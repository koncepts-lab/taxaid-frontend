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

export function useAkeel() {
  const chats = useState<AkeelSession[]>('akeel_chats', () => [])
  const activeChatId = useState<number | null>('akeel_active_chat_id', () => null)
  const messages = useState<AkeelMessage[]>('akeel_messages', () => [])
  const status = useState<number>('akeel_status', () => 1) // 1=online, 2=offline
  const usage = useState<{ tokens_used: number; tokens_total: number | null }>('akeel_usage', () => ({ tokens_used: 0, tokens_total: null }))
  const loading = useState<boolean>('akeel_loading', () => false)
  const sending = useState<boolean>('akeel_sending', () => false)
  const error = useState<string | null>('akeel_error', () => null)
  const chatGettingLong = useState<boolean>('akeel_chat_getting_long', () => false)
  const usageWarning = useState<boolean>('akeel_usage_warning', () => false)

  async function fetchChats() {
    loading.value = true
    error.value = null
    try {
      const res: any = await useApi('/ai/chats?include=status,usage')
      chats.value = res?.sessions ?? []
      if (res?.status) status.value = res.status
      if (res?.usage) usage.value = res.usage
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load chats'
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
      await fetchChats()
      return res?.id ?? null
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to start a new chat'
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
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load chat'
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
      }
      await fetchChats()
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to delete chat'
      console.error('[useAkeel] deleteChat failed:', err)
    }
  }

  /** Sends a message on the active chat, auto-creating one first if none is active. */
  async function sendMessage(message: string, domains?: string[]) {
    if (!message?.trim()) return

    sending.value = true
    error.value = null

    let chatId = activeChatId.value
    if (!chatId) {
      chatId = await createChat()
      if (!chatId) {
        sending.value = false
        return
      }
    }

    messages.value.push({ role: 'user', content: message })

    try {
      const res: any = await useApi(`/ai/chats/${chatId}/messages`, {
        method: 'POST',
        body: { message, ...(domains?.length ? { domains } : {}) },
      })

      messages.value.push({ role: 'assistant', content: res?.message ?? '' })
      if (res?.status) status.value = res.status
      chatGettingLong.value = !!res?.chat_getting_long
      usageWarning.value = !!res?.usage_warning

      const chat = chats.value.find((c) => c.id === chatId)
      if (chat && res?.title) chat.title = res.title
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to send message'
      console.error('[useAkeel] sendMessage failed:', err)
    } finally {
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
    error,
    chatGettingLong,
    usageWarning,
    fetchChats,
    createChat,
    resumeChat,
    deleteChat,
    sendMessage,
  }
}
