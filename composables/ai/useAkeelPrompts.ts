/**
 * useAkeelPrompts
 * Page-aware quick-questions + tips for the Akeel chat widgets, admin-managed via
 * ai.ai_chat_prompts (falls back to the 'default' row server-side if no page-specific row).
 * Supports fetching several page keys in one call (e.g. a tab-bearing page's own key plus its
 * active tab's key) — switching tabs afterward is instant, no extra request.
 */
export function useAkeelPrompts() {
  const promptsByPage = useState<Record<string, { questions: string[]; tips: Array<{ heading: string; body: string }> }>>('akeel_prompts_by_page', () => ({}))
  const activePromptPage = useState<string>('akeel_active_prompt_page', () => 'default')

  const questions = computed(() => promptsByPage.value[activePromptPage.value]?.questions ?? [])
  const tips = computed(() => promptsByPage.value[activePromptPage.value]?.tips ?? [])

  async function fetchPrompts(pages: string | string[], activePage?: string) {
    const list = Array.isArray(pages) ? pages : [pages]
    const currentLang = useState('currentLang', () => 'en')
    try {
      const res: any = await useApi(`/ai/chat-prompts?page=${encodeURIComponent(list.join(','))}&lang=${currentLang.value}`)
      promptsByPage.value = { ...promptsByPage.value, ...(res?.pages ?? {}) }
      activePromptPage.value = activePage ?? list[0]
    } catch (err) {
      // Non-critical — chat still works without quick-questions/tips.
      console.error('[useAkeelPrompts] fetchPrompts failed:', err)
    }
  }

  function setActivePromptPage(page: string) {
    activePromptPage.value = page
  }

  return { questions, tips, fetchPrompts, setActivePromptPage }
}
