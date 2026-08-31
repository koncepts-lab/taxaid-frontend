/**
 * useAkeel
 * Shared Akeel AI chat state/actions — backs ChatSideBar.vue, LeftSideBar.vue+ChatWindow.vue,
 * and ChatModal.vue. useState-backed so switching between the sidebar widget, the full
 * /chat-with-akeel page, and the alert modal shares the same active chat/session list.
 */

interface AkeelSession {
  id: number
  title: string | null
  created_at: string
  last_message_at: string | null
}

interface AkeelMessage {
  id?: number
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

interface AkeelUpload {
  id: number
  file_type: string
  extracted_preview: string | null
  has_extracted_content: boolean
}

export function useAkeel() {
  const chats = useState<AkeelSession[]>('akeel_chats', () => [])
  const activeChatId = useState<number | null>('akeel_active_chat_id', () => null)
  const messages = useState<AkeelMessage[]>('akeel_messages', () => [])
  const status = useState<number>('akeel_status', () => 1) // 1=online, 2=offline
  const usage = useState<{ tokens_used: number; tokens_total: number | null }>('akeel_usage', () => ({ tokens_used: 0, tokens_total: null }))
  const loading = useState<boolean>('akeel_loading', () => false)
  const sending = useState<boolean>('akeel_sending', () => false)
  const error = useState<string | null>('akeel_error', () => null)
  const errorVariant = useState<'error' | 'restricted'>('akeel_error_variant', () => 'error')
  const chatGettingLong = useState<boolean>('akeel_chat_getting_long', () => false)
  const usageWarning = useState<boolean>('akeel_usage_warning', () => false)
  const pendingUploads = useState<AkeelUpload[]>('akeel_pending_uploads', () => [])
  const uploading = useState<boolean>('akeel_uploading', () => false)
  const sendingStatusText = useState<string>('akeel_sending_status', () => 'Akeel is typing...')

  const SENDING_PHASES = ['Akeel is thinking...', 'Akeel is checking your data...', 'Akeel is working on it...', 'Akeel is answering...', 'Akeel is typing...']
  const ONE_CLICK_WORKING_PHASES = ['Akeel is analyzing your data...', 'Akeel is compiling the full report...', 'Akeel is preparing your summary...']
  const ONE_CLICK_FINAL_PHASE = 'Almost done — finalizing your summary...'

  // Attached files stay visible after a send (chat isn't "closed" just because a message went
  // through) — cleared 5 min after the last activity in this chat, or immediately on switching
  // to a different chat. Module-scope (not reactive state) since it's just a timer handle.
  const UPLOADS_CLEAR_DELAY_MS = 5 * 60 * 1000
  let clearUploadsTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleUploadsClear() {
    if (clearUploadsTimer) clearTimeout(clearUploadsTimer)
    clearUploadsTimer = setTimeout(() => { pendingUploads.value = [] }, UPLOADS_CLEAR_DELAY_MS)
  }

  function cancelUploadsClear() {
    if (clearUploadsTimer) {
      clearTimeout(clearUploadsTimer)
      clearUploadsTimer = null
    }
  }

  function startSendingStatusCycle(isOneClick = false) {
    const phases = isOneClick ? ONE_CLICK_WORKING_PHASES : SENDING_PHASES
    let i = 0
    sendingStatusText.value = phases[0]
    const interval = setInterval(() => {
      if (isOneClick) {
        if (i < phases.length - 1) {
          i++
          sendingStatusText.value = phases[i]
        }
        return
      }
      i = (i + 1) % phases.length
      sendingStatusText.value = phases[i]
    }, 1600)
    return () => clearInterval(interval)
  }

  function setError(message: string, code?: string) {
    error.value = message
    errorVariant.value = code === 'plan_restricted' ? 'restricted' : 'error'
  }

  async function fetchChats() {
    loading.value = true
    error.value = null
    try {
      const res: any = await useApi('/ai/chats?include=status,usage')
      chats.value = res?.sessions ?? []
      if (res?.status) status.value = res.status
      if (res?.usage) usage.value = res.usage
    } catch (err: any) {
      setError(err?.data?.message ?? 'Failed to load chats', err?.data?.code)
      // eslint-disable-next-line no-console
      console.error('[useAkeel] fetchChats failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function createChat() {
    try {
      const res: any = await useApi('/ai/chats', { method: 'POST' })
      activeChatId.value = res?.id ?? null
      messages.value = []
      cancelUploadsClear()
      pendingUploads.value = []
      await fetchChats()
      return res?.id ?? null
    } catch (err: any) {
      setError(err?.data?.message ?? 'Failed to start a new chat', err?.data?.code)
      console.error('[useAkeel] createChat failed:', err)
      return null
    }
  }

  async function resumeChat(id: number) {
    loading.value = true
    error.value = null
    try {
      const res: any = await useApi(`/ai/chats/${id}`)
      activeChatId.value = id
      messages.value = res?.messages ?? []
      cancelUploadsClear()
      pendingUploads.value = []
    } catch (err: any) {
      setError(err?.data?.message ?? 'Failed to load chat', err?.data?.code)
      console.error('[useAkeel] resumeChat failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function deleteChat(id: number) {
    try {
      await useApi(`/ai/chats/${id}`, { method: 'DELETE' })
      if (activeChatId.value === id) {
        activeChatId.value = null
        messages.value = []
        cancelUploadsClear()
        pendingUploads.value = []
      }
      await fetchChats()
    } catch (err: any) {
      setError(err?.data?.message ?? 'Failed to delete chat', err?.data?.code)
      console.error('[useAkeel] deleteChat failed:', err)
    }
  }

  /** Uploads a file for AI use (image/PDF/Excel) — only extracted text ever reaches the model,
   *  never the raw file. Adds to pendingUploads, attached automatically on the next sendMessage. */
  async function uploadFile(file: File) {
    uploading.value = true
    error.value = null
    try {
      const form = new FormData()
      form.append('file', file)
      if (activeChatId.value) form.append('chat_session_id', String(activeChatId.value))

      const res: any = await useApi('/ai/uploads', { method: 'POST', body: form })
      pendingUploads.value.push({
        id: res.id,
        file_type: res.file_type,
        extracted_preview: res.extracted_preview,
        has_extracted_content: res.has_extracted_content,
      })
      return true
    } catch (err: any) {
      setError(err?.data?.message ?? 'Upload failed', err?.data?.code)
      if (err?.data?.debug_error) console.error('[useAkeel] uploadFile raw error:', err.data.debug_error)
      return false
    } finally {
      uploading.value = false
    }
  }

  function removeUpload(id: number) {
    pendingUploads.value = pendingUploads.value.filter((u) => u.id !== id)
    useApi(`/ai/uploads/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  /** Navigates to chat-with-akeel instantly; sendMessage runs in the background. */
  function openOneClickSummary(domain: string, dataLinkKey: string) {
    navigateTo('/chat-with-akeel')
    sendMessage('', [domain], dataLinkKey)
  }

  /** Sends a message on the active chat, auto-creating one first if none is active.
   *  dataLinkKey: guarantees that specific data-link's real result reaches the model as extra
   *  context (e.g. a One-Click Summary card) — additive only, never replaces normal domain-scoped
   *  tool-choice. message can be omitted when dataLinkKey is set (backend synthesizes it). */
  async function sendMessage(message: string, domains?: string[], dataLinkKey?: string, hideUserMessage = false) {
    if (!message?.trim() && !dataLinkKey) return
    if (sending.value) return

    sending.value = true
    error.value = null
    const isOneClick = !!dataLinkKey?.startsWith('onclick_')
    sendingStatusText.value = isOneClick ? ONE_CLICK_WORKING_PHASES[0] : SENDING_PHASES[0]

    let chatId = activeChatId.value
    if (!chatId) {
      chatId = await createChat()
      if (!chatId) {
        sending.value = false
        return
      }
    }

    if (message?.trim() && !hideUserMessage) messages.value.push({ role: 'user', content: message })
    const uploadIds = pendingUploads.value.map((u) => u.id)
    const stopStatusCycle = startSendingStatusCycle(isOneClick)

    try {
      const res: any = await useApi(`/ai/chats/${chatId}/messages`, {
        method: 'POST',
        body: {
          ...(message?.trim() ? { message } : {}),
          ...(domains?.length ? { domains } : {}),
          ...(uploadIds.length ? { upload_ids: uploadIds } : {}),
          ...(dataLinkKey ? { data_link_key: dataLinkKey } : {}),
        },
      })

      if (dataLinkKey?.startsWith('onclick_')) {
        sendingStatusText.value = ONE_CLICK_FINAL_PHASE
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      messages.value.push({ role: 'assistant', content: res?.message ?? '' })
      if (res?.status) status.value = res.status
      chatGettingLong.value = !!res?.chat_getting_long
      usageWarning.value = !!res?.usage_warning
      if (pendingUploads.value.length) scheduleUploadsClear()

      const chat = chats.value.find((c) => c.id === chatId)
      if (chat && res?.title) chat.title = res.title
    } catch (err: any) {
      setError(err?.data?.message ?? 'Failed to send message', err?.data?.code)
      if (err?.data?.status) status.value = err.data.status
      // TODO: remove this before production — dev-only visibility into the raw Vertex/API error.
      if (err?.data?.debug_error) console.error('[useAkeel] sendMessage raw error:', err.data.debug_error)
    } finally {
      stopStatusCycle()
      sending.value = false
    }
  }

  return {
    chats,
    activeChatId,
    messages,
    status,
    usage,
    loading,
    sending,
    sendingStatusText,
    error,
    errorVariant,
    chatGettingLong,
    usageWarning,
    pendingUploads,
    uploading,
    fetchChats,
    createChat,
    resumeChat,
    deleteChat,
    sendMessage,
    uploadFile,
    removeUpload,
    openOneClickSummary,
  }
}
