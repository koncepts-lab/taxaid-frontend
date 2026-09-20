export default defineNuxtRouteMiddleware(async (to) => {
  const authToken  = useCookie('auth_token')
  const adminToken = useCookie('admin_token')
  const rpToken    = useCookie('rp_token')

  const publicPages   = ['/', '/home', '/taxaid-partnership-login', '/verify-email', '/ad-aqnz-pro-auth-78z46', '/admin-reset-password', '/reset-password','/ticketing/ticketing-dashboard', '/connector']
  const adminPrefixes = ['/admin']
  const rpPrefixes    = ['/taxaid-partner']

  if (publicPages.includes(to.path)) return

  // Pre-approval onboarding is keyed by registration_id, not a login session —
  // no account/token exists yet at this stage (created later, at admin approval).
  if (to.path === '/onboarding' && to.query.registration_id) return

  const isRpPath = rpPrefixes.some(p => to.path.startsWith(p))
  if (isRpPath) {
    if (!rpToken.value) return navigateTo('/taxaid-partnership-login')

    try {
      const rpUser = useCookie('rp_user')
      const user = typeof rpUser.value === 'string' ? JSON.parse(rpUser.value) : rpUser.value
      const role = (user?.role ?? '').toLowerCase()

      if (to.path.startsWith('/taxaid-partner') && role !== 'partner') {
        return navigateTo('/taxaid-partnership-login')
      }
    } catch {}

    return
  }

  const isAdminPath = adminPrefixes.some(p => to.path.startsWith(p))
  if (isAdminPath) {
    if (!adminToken.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })

    if (to.path.startsWith('/admin/management')) {
      try {
        const adminUser = useCookie('admin_user')
        const user = typeof adminUser.value === 'string' ? JSON.parse(adminUser.value) : adminUser.value
        if (user?.role?.name !== 'Super Admin') return navigateTo('/admin')
      } catch {
        return navigateTo('/admin')
      }
    }

    if (to.path.startsWith('/admin/implementation')) {
      try {
        const adminUser = useCookie('admin_user')
        const user = typeof adminUser.value === 'string' ? JSON.parse(adminUser.value) : adminUser.value
        const role = user?.role?.name

        if (to.path.startsWith('/admin/implementation/manager')) {
          if (role !== 'Super Admin' && role !== 'Implementation Manager') return navigateTo('/admin')
        } else if (to.path.startsWith('/admin/implementation/member') || to.path.startsWith('/admin/implementation/project')) {
          if (role !== 'Super Admin' && role !== 'Implementation Consultant') return navigateTo('/admin')
        } else if (to.path === '/admin/implementation' || to.path === '/admin/implementation/') {
          // redirect index based on role
          if (role === 'Implementation Manager')   return navigateTo('/admin/implementation/manager')
          if (role === 'Implementation Consultant') return navigateTo('/admin/implementation/member')
          if (role !== 'Super Admin')              return navigateTo('/admin')
        }
      } catch {
        return navigateTo('/admin')
      }
    }

    return
  }

  if (!authToken.value) return navigateTo('/home')

  // Tenant-user area only (admin/rp already returned above, untouched). 'live' is the only
  // status that reaches the real app — anything else (registered/onboarding/pending_review/
  // implementation/suspended) is routed to the one page that decides what to show, regardless
  // of which page was actually requested (dashboard, revenue, any subpage). Status is refreshed
  // at login/verify/onboarding-progress time (useAuth.ts, onboarding.vue), not re-fetched from
  // the API on every navigation.
  // TaxAid staff on a temp credential (implementation_consultant/review_team) need the real
  // dashboard even while the tenant they're working on isn't 'live' — the onboarding/waiting
  // redirect below is only for the tenant's own users.
  const accountType = useCookie('account_type')
  if (accountType.value === 'taxaid') return

  const tenantStatus = useCookie('tenant_status')
  if (to.path !== '/onboarding' && tenantStatus.value && tenantStatus.value !== 'live' && tenantStatus.value !== 'demo') {
    return navigateTo('/onboarding')
  }

  const permissionsCookie = useCookie('permissions')
  if (!permissionsCookie.value) {
    try {
      const me: any = await useApi('/me')
      if (me?.data?.permissions) permissionsCookie.value = JSON.stringify(me.data.permissions)
    } catch {}
  }

  const { permissions, hasPermissions } = usePermissions()
  if (!hasPermissions.value) return

  const routeKeys: [string, string][] = [
    ['/data-source/manual-addition', 'data_source.manual_addition'],
    ['/data-source', 'data_source.access'],
    ['/accounts-receivable', 'cards.accounts_receivable'],
    ['/accounts-payable', 'cards.accounts_payable'],
    ['/cogs', 'cards.cogs'],
    ['/revenue', 'cards.revenue'],
    ['/indirect-expense', 'cards.indirect_expense'],
    ['/cost-center', 'cards.cost_center'],
    ['/financial-statement', 'cards.financials'],
    ['/cash-flow', 'cards.cash_flow'],
    ['/tax-queries', 'cards.tax_queries'],
    ['/one-click-summary', 'cards.one_click_summary'],
    ['/alerts', 'alerts.access'],
    ['/chat-with-akeel', 'alerts.access'],
    ['/appointment', 'appointments.view'],
    ['/settings/company-settings', 'company_settings.access'],
    ['/settings/subscription', 'settings.subscription'],
    ['/settings/checkout', 'settings.subscription'],
    ['/settings/sync-and-data-management', 'settings.sync_data_management'],
    ['/settings/notifications', 'settings.notifications'],
  ]
  const match = routeKeys.find(([prefix]) => to.path === prefix || to.path.startsWith(prefix + '/'))
  if (match && permissions.value[match[1]] !== true) return navigateTo('/dashboard')
})
