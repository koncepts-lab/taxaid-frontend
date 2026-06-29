export default defineNuxtRouteMiddleware((to) => {
  const authToken  = useCookie('auth_token')
  const adminToken = useCookie('admin_token')
  const rpToken    = useCookie('rp_token')

  const publicPages   = ['/', '/home', '/revenue-partnership-login', '/verify-email', '/test-auth', '/admin/login', '/reset-password']
  const adminPrefixes = ['/admin', '/review-manager', '/review-team-member']
  const rpPrefixes    = ['/revenue-partnership/admin', '/revenue-partnership/accounts', '/revenue-partnership/partner', '/revenue-partnership/notifications', '/revenue-partnership/select-dashboard']

  if (publicPages.includes(to.path)) return

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
    if (!adminToken.value) return navigateTo('/admin/login')

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
})
