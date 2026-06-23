export default defineNuxtRouteMiddleware((to) => {
  const authToken  = useCookie('auth_token')
  const adminToken = useCookie('admin_token')
  const rpToken    = useCookie('rp_token')

  const publicPages   = ['/', '/home', '/revenue-partnership-login', '/verify-email', '/test-auth', '/superadmin/login', '/admin/login', '/admin/roles']
  const adminPrefixes = ['/superadmin', '/admin', '/review-manager', '/review-team-member']
  const rpPrefixes    = ['/revenue-partnership/admin', '/revenue-partnership/accounts', '/revenue-partnership/partner', '/revenue-partnership/notifications', '/revenue-partnership/select-dashboard']

  if (publicPages.includes(to.path)) return

  const isRpPath = rpPrefixes.some(p => to.path.startsWith(p))
  if (isRpPath) {
    if (!rpToken.value) return navigateTo('/revenue-partnership-login')
    return
  }

  const isAdminPath = adminPrefixes.some(p => to.path.startsWith(p))
  if (isAdminPath) {
    if (!adminToken.value) return navigateTo('/admin/login')
    return
  }

  if (!authToken.value) return navigateTo('/home')
})
