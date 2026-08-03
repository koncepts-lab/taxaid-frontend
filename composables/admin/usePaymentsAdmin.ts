// Payments Admin CMS — plans, plan versions, entitlement definitions, subscriptions/payments monitoring.
// All calls go through useAdminApi (admin_token). No entitlement enforcement here — CMS only.

export function usePaymentsAdmin() {
  // ── Plans ───────────────────────────────────────────────────────────────
  // isCustom: undefined = Plans tab shows both types (optionally filtered), true/false = explicit filter.
  const getPlans = (page = 1, perPage = 10, isCustom?: boolean, status?: string, unassigned = false, search?: string) => {
    const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
    if (isCustom !== undefined) q.set('is_custom', isCustom ? '1' : '0')
    if (status) q.set('status', status)
    if (unassigned) q.set('unassigned', '1')
    if (search) q.set('search', search)
    return useAdminApi(`/admin/plans?${q.toString()}`)
  }

  const getPlan = (id: number) => useAdminApi(`/admin/plans/${id}`)

  // Same /admin/plans endpoint, ?view= switches modes — no separate routes.
  const getOrgPlansGrouped = (page = 1, perPage = 10) =>
    useAdminApi(`/admin/plans?view=grouped&page=${page}&per_page=${perPage}`)

  const getPlanStats = () => useAdminApi('/admin/plans?view=stats')

  const getOrganizations = (search?: string) =>
    useAdminApi(`/admin/organizations${search ? `?search=${encodeURIComponent(search)}` : ''}`)

  const assignPlanToOrg = (planId: number, organizationId: number | null) =>
    useAdminApi(`/admin/plans/${planId}/assign-org`, { method: 'PATCH', body: { organization_id: organizationId } })

  interface FeaturePoint { label: string; included: boolean; entitlement_key?: string | null }
  interface FeatureGroup { title: string; points: FeaturePoint[] }

  interface PlanPayload {
    name?: string
    description?: string
    tier?: string
    is_popular?: boolean
    is_custom?: boolean
    status?: 'draft' | 'active' | 'inactive'
    monthly_price: number
    annual_price: number
    annual_discount_percent?: number
    currency?: string
    entitlements: Record<string, any>
    monthly_features?: FeatureGroup[]
    annual_features?: FeatureGroup[]
  }

  const createPlan = (data: PlanPayload) => useAdminApi('/admin/plans', { method: 'POST', body: data })

  const createPlanVersion = (planId: number, data: PlanPayload) =>
    useAdminApi(`/admin/plans/${planId}/versions`, { method: 'POST', body: data })

  const updatePlanStatus = (planId: number, status: 'draft' | 'active' | 'inactive') =>
    useAdminApi(`/admin/plans/${planId}/status`, { method: 'PATCH', body: { status } })

  // ── Entitlement definitions catalog ────────────────────────────────────
  const getEntitlementDefinitions = (page = 1, perPage = 10) =>
    useAdminApi(`/admin/entitlement-definitions?page=${page}&per_page=${perPage}`)

  const createEntitlementDefinition = (data: {
    key: string
    label: string
    description?: string
    type: 'boolean' | 'numeric' | 'unlimited_capable'
    unit?: string
    category?: string
  }) => useAdminApi('/admin/entitlement-definitions', { method: 'POST', body: data })

  const toggleEntitlementDefinitionActive = (id: number) =>
    useAdminApi(`/admin/entitlement-definitions/${id}/toggle-active`, { method: 'PATCH' })

  // ── Subscriptions / payments monitoring ────────────────────────────────
  const getSubscriptions = (page = 1, perPage = 10, status?: string) => {
    const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
    if (status) q.set('status', status)
    return useAdminApi(`/admin/subscriptions?${q.toString()}`)
  }

  const getPayments = (page = 1, perPage = 10, status?: string) => {
    const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
    if (status) q.set('status', status)
    return useAdminApi(`/admin/payments?${q.toString()}`)
  }

  const setDunningOverride = (subscriptionId: number, dunningGraceDays: number | null) =>
    useAdminApi(`/admin/subscriptions/${subscriptionId}/dunning`, {
      method: 'PATCH',
      body: { dunning_grace_days: dunningGraceDays },
    })

  // Each sub-list paginates independently via its own prefixed params.
  const getAlerts = (pages: { failed?: number; expiring?: number; pastdue?: number } = {}, perPage = 10) => {
    const q = new URLSearchParams({
      failed_page: String(pages.failed ?? 1), failed_per_page: String(perPage),
      expiring_page: String(pages.expiring ?? 1), expiring_per_page: String(perPage),
      pastdue_page: String(pages.pastdue ?? 1), pastdue_per_page: String(perPage),
    })
    return useAdminApi(`/admin/payment-alerts?${q.toString()}`)
  }

  // ── Global settings ─────────────────────────────────────────────────────
  const getPaymentSettings = () => useAdminApi('/admin/payment-settings')

  const updatePaymentSettings = (dunningGraceDaysDefault: number, trialDays: number) =>
    useAdminApi('/admin/payment-settings', {
      method: 'PATCH',
      body: { dunning_grace_days_default: dunningGraceDaysDefault, trial_days: trialDays },
    })

  const getTrialPlan = () => useAdminApi('/admin/trial-plan')

  const saveTrialPlan = (payload: any) =>
    useAdminApi('/admin/trial-plan', { method: 'POST', body: payload })

  // TODO: remove for production — demo-only in-place plan edit, bypasses normal versioning rules
  const demoEditPlan = (id: number, payload: any) =>
    useAdminApi(`/admin/plans/${id}/demo-edit`, { method: 'POST', body: payload })

  return {
    getPlans, getPlan, getOrgPlansGrouped, getPlanStats, getOrganizations, assignPlanToOrg, createPlan, createPlanVersion, updatePlanStatus,
    getEntitlementDefinitions, createEntitlementDefinition, toggleEntitlementDefinitionActive,
    getSubscriptions, getPayments, setDunningOverride, getAlerts,
    getPaymentSettings, updatePaymentSettings, getTrialPlan, saveTrialPlan, demoEditPlan,
  }
}
