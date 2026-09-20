// composables/admin/superadmin/useAdminAi.ts
// All admin-side AI calls: per-tenant monitoring/controls (client management "AI" subtab) +
// global settings/catalog/chat-prompts (top-level "AI Settings" tab). One composable, both
// screens consume it. All calls go through useAdminApi (admin_token).
export function useAdminAi() {
  // ── Per-tenant (client management "AI" subtab) ──────────────────────────
  const getClientAi = (tenantId: number, range: '3m' | '6m' | '1y' | 'full' = '6m', scope: 'tenant' | 'organization' = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}?range=${range}${scope === 'organization' ? '&scope=organization' : ''}`)

  const toggleClientAi = (tenantId: number, password?: string, scope: 'tenant' | 'organization' = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/toggle`, {
      method: 'PATCH',
      body: { ...(password ? { password } : {}), ...(scope === 'organization' ? { scope } : {}) },
    })

  const updateClientAiEntitlements = (
    tenantId: number,
    body: { ai_chat_enabled?: boolean | null; ai_alerts_enabled?: boolean | null; ai_chat_mode?: string; ai_alerts_mode?: string },
    scope: 'tenant' | 'organization' = 'tenant',
  ) => useAdminApi(`/admin/ai/clients/${tenantId}/entitlements`, { method: 'PATCH', body: scope === 'organization' ? { ...body, scope } : body })

  type Scope = 'tenant' | 'organization'
  const scopeQs = (scope: Scope, first = true) => (scope === 'organization' ? `${first ? '?' : '&'}scope=organization` : '')

  const exportClientAiConfig = (tenantId: number, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/settings?format=export${scopeQs(scope, false)}`)

  const runClientAiConfigAction = (
    tenantId: number,
    body: { action: 'mode' | 'sync' | 'reset' | 'copy' | 'promote' | 'import'; mode?: 'global' | 'organization' | 'custom'; area?: 'chat' | 'alerts' | 'both'; scope?: 'tenant' | 'organization'; source_tenant_id?: number; config?: any },
  ) => useAdminApi(`/admin/ai/clients/${tenantId}/settings`, { method: 'PUT', body })

  const getClientAiSettings = (tenantId: number, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/settings${scopeQs(scope)}`)

  const updateClientAiSettings = (tenantId: number, settings: Array<{ name: string; value: string }>, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/settings`, { method: 'PUT', body: scope === 'organization' ? { settings, scope } : { settings } })

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

  const getDataLinks = (params?: { page?: number; per_page?: number; search?: string; domain?: string[]; category?: string[]; status?: string }) => useAdminApi(`/admin/ai/data-links${qs(params)}`)
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

  const getAlertRuleGroups = (params?: { page?: number; per_page?: number; search?: string; domain?: string[]; default_notification_frequency?: string }) => useAdminApi(`/admin/ai/alert-rule-groups${qs(params)}`)
  const createAlertRuleGroup = (body: any) => useAdminApi('/admin/ai/alert-rule-groups', { method: 'POST', body })
  const updateAlertRuleGroup = (id: number, body: any) => useAdminApi(`/admin/ai/alert-rule-groups/${id}`, { method: 'PUT', body })
  const assignRulesToGroup = (groupId: number, ruleIds: number[]) =>
    useAdminApi(`/admin/ai/alert-rule-groups/${groupId}/rules`, { method: 'PUT', body: { rule_ids: ruleIds } })
  const unassignRuleFromGroup = (groupId: number, ruleId: number) =>
    useAdminApi(`/admin/ai/alert-rule-groups/${groupId}/rules/${ruleId}`, { method: 'DELETE' })
  const getUnassignedAlertRules = (params?: { page?: number; per_page?: number; search?: string; domain?: string[] }) =>
    useAdminApi(`/admin/ai/alert-rules/unassigned${qs(params)}`)

  const getClientAlertRuleOverrides = (tenantId: number, params?: { page?: number; per_page?: number; search?: string; domain?: string[]; category?: string[]; priority?: string }, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/alert-rule-overrides${qs({ ...params, ...(scope === 'organization' ? { scope } : {}) })}`)
  const updateClientAlertRuleOverride = (tenantId: number, ruleId: number, body: any, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/alert-rule-overrides/${ruleId}`, { method: 'PUT', body: scope === 'organization' ? { ...body, scope } : body })
  const resetClientAlertRuleOverride = (tenantId: number, ruleId: number, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/alert-rule-overrides/${ruleId}${scopeQs(scope)}`, { method: 'DELETE' })

  const getClientDataLinkOverrides = (tenantId: number, params?: { page?: number; per_page?: number; search?: string; domain?: string[] }, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/data-link-overrides${qs({ ...params, ...(scope === 'organization' ? { scope } : {}) })}`)
  const updateClientDataLinkOverride = (tenantId: number, linkId: number, body: any, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/data-link-overrides/${linkId}`, { method: 'PUT', body: scope === 'organization' ? { ...body, scope } : body })
  const resetClientDataLinkOverride = (tenantId: number, linkId: number, scope: Scope = 'tenant') =>
    useAdminApi(`/admin/ai/clients/${tenantId}/data-link-overrides/${linkId}${scopeQs(scope)}`, { method: 'DELETE' })

  return {
    getClientAi, toggleClientAi, updateClientAiEntitlements, getClientAiSettings, updateClientAiSettings,
    exportClientAiConfig, runClientAiConfigAction,
    getSettings, addSetting, deleteSetting, getUsageSnapshot,
    getDataLinks, updateDataLink,
    getRules, updateRule,
    getAlertRules, updateAlertRule,
    getChatPrompts, createChatPrompt, updateChatPrompt, deleteChatPrompt, cloneChatPrompt,
    getAlertRuleGroups, createAlertRuleGroup, updateAlertRuleGroup, assignRulesToGroup, unassignRuleFromGroup, getUnassignedAlertRules,
    getClientAlertRuleOverrides, updateClientAlertRuleOverride, resetClientAlertRuleOverride,
    getClientDataLinkOverrides, updateClientDataLinkOverride, resetClientDataLinkOverride,
  }
}
