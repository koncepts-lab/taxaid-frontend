export default defineNuxtRouteMiddleware((to) => {
  const authToken  = useCookie('auth_token')
  const adminToken = useCookie('admin_token')
  const rpToken    = useCookie('rp_token')

  const publicPages   = ['/', '/home', '/revenue-partnership-login', '/verify-email', '/ad-aqnz-pro-auth-78z46', '/reset-password']
  const adminPrefixes = ['/admin', '/review-manager', '/review-team-member']
  const rpPrefixes    = ['/revenue-partnership/admin', '/revenue-partnership/accounts', '/revenue-partnership/partner', '/revenue-partnership/notifications', '/revenue-partnership/select-dashboard']

  if (publicPages.includes(to.path)) return

  // Pre-approval onboarding is keyed by registration_id, not a login session —
  // no account/token exists yet at this stage (created later, at admin approval).
  if (to.path === '/onboarding' && to.query.registration_id) return

  const isRpPath = rpPrefixes.some(p => to.path.startsWith(p))
  if (isRpPath) {
    if (!rpToken.value) return navigateTo('/revenue-partnership-login')

    try {
      const rpUser = useCookie('rp_user')
      const user = typeof rpUser.value === 'string' ? JSON.parse(rpUser.value) : rpUser.value
      const role = (user?.role ?? '').toLowerCase()

      if (to.path.startsWith('/revenue-partnership/admin') && role !== 'admin') {
        return navigateTo('/revenue-partnership-login')
      }
      if (to.path.startsWith('/revenue-partnership/accounts') && role !== 'accounts') {
        return navigateTo('/revenue-partnership-login')
      }
      if (to.path.startsWith('/revenue-partnership/partner') && role !== 'partner') {
        return navigateTo('/revenue-partnership-login')
      }
    } catch {}

    return
  }

  const isAdminPath = adminPrefixes.some(p => to.path.startsWith(p))
  if (isAdminPath) {
    if (!adminToken.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })

    if (to.path.startsWith('/admin/roles')) {
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
  if (to.path !== '/onboarding' && tenantStatus.value && tenantStatus.value !== 'live') {
    return navigateTo('/onboarding')
  }
})
