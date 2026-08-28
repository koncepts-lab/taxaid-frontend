// composables/admin/useAdminAi.ts
// All admin-side AI calls: per-tenant monitoring/controls (client management "AI" subtab) +
// global settings/catalog/chat-prompts (top-level "AI Settings" tab). One composable, both
// screens consume it. All calls go through useAdminApi (admin_token).
export function useAdminAi() {
  // ── Per-tenant (client management "AI" subtab) ──────────────────────────
  const getClientAi = (tenantId: number, range: '6m' | '1y' | 'full' = '6m') =>
    useAdminApi(`/admin/ai/clients/${tenantId}?range=${range}`)

  const toggleClientAi = (tenantId: number, password?: string) =>
    useAdminApi(`/admin/ai/clients/${tenantId}/toggle`, { method: 'PATCH', body: password ? { password } : {} })

  const getClientAiSettings = (tenantId: number) =>
    useAdminApi(`/admin/ai/clients/${tenantId}/settings`)

  const updateClientAiSettings = (tenantId: number, settings: Array<{ name: string; value: string }>) =>
    useAdminApi(`/admin/ai/clients/${tenantId}/settings`, { method: 'PUT', body: { settings } })

  // ── Global (top-level "AI Settings" tab) ────────────────────────────────
  // ai_global_settings is now row-per-instruction: seeded/default rows (is_default=true) can't
  // be removed, admin can freely add their own on top. All rows join into one system prompt.
  const getSettings = () => useAdminApi('/admin/ai/settings')
  const addSetting = (instruction: string) =>
    useAdminApi('/admin/ai/settings', { method: 'POST', body: { instruction } })
  const deleteSetting = (id: number) =>
    useAdminApi(`/admin/ai/settings/${id}`, { method: 'DELETE' })

  const getUsageSnapshot = () => useAdminApi('/admin/ai/usage-snapshot')

  // Array values (domain/category multi-select) serialize as repeated domain[]=A&domain[]=B —
  // Laravel's Request::array() on the backend reads that shape directly.
  const qs = (params?: Record<string, any>) => {
    if (!params) return ''
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue
      if (Array.isArray(value)) {
        if (!value.length) continue
        value.forEach((v) => search.append(`${key}[]`, v))
      } else {
        search.append(key, value)
      }
    }
    const s = search.toString()
    return s ? `?${s}` : ''
  }

  const getDataLinks = (params?: { page?: number; per_page?: number; search?: string; domain?: string[]; category?: string[] }) => useAdminApi(`/admin/ai/data-links${qs(params)}`)
  const updateDataLink = (id: number, body: { label: string; context: string; category?: string | null; is_active: boolean }) =>
    useAdminApi(`/admin/ai/data-links/${id}`, { method: 'PUT', body })

  const getRules = (params?: { page?: number; per_page?: number; search?: string; domain?: string; category?: string }) => useAdminApi(`/admin/ai/rules${qs(params)}`)
  const updateRule = (id: number, body: { label: string; context_template: string | null; category?: string | null; is_active: boolean }) =>
    useAdminApi(`/admin/ai/rules/${id}`, { method: 'PUT', body })

  const getAlertRules = (params?: { page?: number; per_page?: number; search?: string; domain?: string[]; category?: string[]; priority?: string }) => useAdminApi(`/admin/ai/alert-rules${qs(params)}`)
  const updateAlertRule = (id: number, body: { alert_title: string; category: string | null; priority: string; rag_prompt_instruction: string | null; is_active: boolean }) =>
    useAdminApi(`/admin/ai/alert-rules/${id}`, { method: 'PUT', body })

  const getChatPrompts = (params?: { page?: number; per_page?: number; search?: string }) => useAdminApi(`/admin/ai/chat-prompts${qs(params)}`)
  const createChatPrompt = (body: any) => useAdminApi('/admin/ai/chat-prompts', { method: 'POST', body })
  const updateChatPrompt = (id: number, body: any) => useAdminApi(`/admin/ai/chat-prompts/${id}`, { method: 'PUT', body })
  const deleteChatPrompt = (id: number) => useAdminApi(`/admin/ai/chat-prompts/${id}`, { method: 'DELETE' })
  const cloneChatPrompt = (id: number, page: string) => useAdminApi(`/admin/ai/chat-prompts/${id}/clone`, { method: 'POST', body: { page } })

  return {
    getClientAi, toggleClientAi, getClientAiSettings, updateClientAiSettings,
    getSettings, addSetting, deleteSetting, getUsageSnapshot,
    getDataLinks, updateDataLink,
    getRules, updateRule,
    getAlertRules, updateAlertRule,
    getChatPrompts, createChatPrompt, updateChatPrompt, deleteChatPrompt, cloneChatPrompt,
  }
}
