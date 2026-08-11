/**
 * useAkeelPrompts
 * Page-aware quick-questions + tips for the Akeel chat widgets, admin-managed via
 * ai.ai_chat_prompts (falls back to the 'default' row server-side if no page-specific row).
 */
export function useAkeelPrompts() {
  const questions = useState<string[]>('akeel_prompt_questions', () => [])
  const tips = useState<Array<{ heading: string; body: string }>>('akeel_prompt_tips', () => [])

  async function fetchPrompts(page: string) {
    const currentLang = useState('currentLang', () => 'en')
    try {
      const res: any = await useApi(`/ai/chat-prompts?page=${encodeURIComponent(page)}&lang=${currentLang.value}`)
      questions.value = res?.questions ?? []
      tips.value = res?.tips ?? []
    } catch (err) {
      // Non-critical — chat still works without quick-questions/tips.
      console.error('[useAkeelPrompts] fetchPrompts failed:', err)
    }
  }

  return { questions, tips, fetchPrompts }
}
