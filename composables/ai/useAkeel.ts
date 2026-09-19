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
  // Real ledger/customer names this reply's data touched (System-category tools only) — lets the
  // UI offer a "View Ledger" action that opens the real ledger modal instead of only prose.
  ledgerRefs?: string[]
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
  const locked = useState<boolean>('akeel_locked', () => false)
  const dots = useState<number>('akeel_status_dots', () => 3)
  const currentScope = useState<string>('akeel_scope', () => 'general')
  const scopeChats = useState<Record<string, number>>('akeel_scope_chats', () => ({}))
  const SCOPE_STORAGE_KEY = 'akeel_scope_chats'

  function persistScopes() {
    if (!import.meta.client) return
    try { localStorage.setItem(SCOPE_STORAGE_KEY, JSON.stringify(scopeChats.value)) } catch { /* storage unavailable */ }
  }

  function loadScopes() {
    if (!import.meta.client || Object.keys(scopeChats.value).length) return
    try {
      const raw = localStorage.getItem(SCOPE_STORAGE_KEY)
      if (raw) scopeChats.value = JSON.parse(raw)
    } catch { /* ignore */ }
  }
  const chatGettingLong = useState<boolean>('akeel_chat_getting_long', () => false)
  const usageWarning = useState<boolean>('akeel_usage_warning', () => false)
  const pendingUploads = useState<AkeelUpload[]>('akeel_pending_uploads', () => [])
  const uploading = useState<boolean>('akeel_uploading', () => false)
  const sendingStatusText = useState<string>('akeel_sending_status', () => 'Akeel is thinking...')
  const sendingStatusDisplay = computed(() => sendingStatusText.value.replace(/\.+$/, '') + '.'.repeat(dots.value))

  const PHASES = {
    en: {
      chat: ['Akeel is thinking...', 'Akeel is checking your data...', 'Akeel is working on it...', 'Akeel is still working on it, hang tight...'],
      typing: 'Akeel is typing...',
      oneClick: ['Akeel is analyzing your data...', 'Akeel is compiling the full report...', 'Akeel is preparing your summary...'],
      oneClickFinal: 'Almost done — finalizing your summary...',
    },
    ar: {
      chat: ['عقيل يفكر...', 'عقيل يفحص بياناتك...', 'عقيل يعمل على ذلك...', 'عقيل ما زال يعمل على ذلك، يرجى الانتظار...'],
      typing: 'عقيل يكتب...',
      oneClick: ['عقيل يحلل بياناتك...', 'عقيل يجمع التقرير الكامل...', 'عقيل يجهز ملخصك...'],
      oneClickFinal: 'على وشك الانتهاء — يتم إنهاء ملخصك...',
    },
  }
  const langState = useState<string>('currentLang', () => 'en')
  const phaseSet = () => (langState.value === 'ar' ? PHASES.ar : PHASES.en)

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
    const phases = isOneClick ? phaseSet().oneClick : phaseSet().chat
    let i = 0
    let tick = 0
    sendingStatusText.value = phases[0]
    dots.value = 1
    const interval = setInterval(() => {
      tick++
      dots.value = (tick % 3) + 1
      if (tick % 4 === 0 && i < phases.length - 1) {
        i++
        sendingStatusText.value = phases[i]
      }
    }, 400)
    return () => {
      clearInterval(interval)
      dots.value = 3
    }
  }

  function setError(message: string, code?: string) {
    error.value = message
    errorVariant.value = code && ['plan_restricted', 'permission_denied', 'ai_org_disabled', 'ai_chat_disabled', 'ai_support_login', 'quota_reached'].includes(code) ? 'restricted' : 'error'
    if (errorVariant.value === 'restricted') locked.value = true
  }

  async function fetchChats() {
    loading.value = true
    error.value = null
    locked.value = false
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
      if (res?.id) {
        scopeChats.value = { ...scopeChats.value, [currentScope.value]: res.id }
        persistScopes()
      }
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
      scopeChats.value = Object.fromEntries(Object.entries(scopeChats.value).filter(([, chatId]) => chatId !== id))
      persistScopes()
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

  /** Each card/page keeps its own chat: switching scope resumes that scope's chat (by id) or starts empty. */
  async function setScope(scope: string) {
    loadScopes()
    if (currentScope.value === scope && activeChatId.value && scopeChats.value[scope] === activeChatId.value) return
    currentScope.value = scope
    error.value = null
    const id = scopeChats.value[scope]
    if (!id) {
      activeChatId.value = null
      messages.value = []
      cancelUploadsClear()
      pendingUploads.value = []
      return
    }
    await resumeChat(id)
    if (error.value) {
      error.value = null
      const next = { ...scopeChats.value }
      delete next[scope]
      scopeChats.value = next
      persistScopes()
      activeChatId.value = null
      messages.value = []
    }
  }

  /** Forgets this scope's chat and starts a fresh one on the next message (the old chat stays in history). */
  function newChat() {
    const next = { ...scopeChats.value }
    delete next[currentScope.value]
    scopeChats.value = next
    persistScopes()
    activeChatId.value = null
    messages.value = []
    error.value = null
    cancelUploadsClear()
    pendingUploads.value = []
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
    sendingStatusText.value = isOneClick ? phaseSet().oneClick[0] : phaseSet().chat[0]

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

      sendingStatusText.value = isOneClick ? phaseSet().oneClickFinal : phaseSet().typing
      await new Promise((resolve) => setTimeout(resolve, isOneClick ? 300 : 700))

      messages.value.push({ role: 'assistant', content: res?.message ?? '', ledgerRefs: res?.ledger_refs ?? [] })
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
    sendingStatusDisplay,
    setScope,
    newChat,
    currentScope,
    error,
    errorVariant,
    locked,
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
