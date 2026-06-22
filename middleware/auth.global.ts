export default defineNuxtRouteMiddleware((to) => {
  const authToken  = useCookie('auth_token')
  const adminToken = useCookie('admin_token')

  const publicPages   = ['/', '/home', '/revenue-partnership-login', '/verify-email', '/test-auth', '/superadmin/login', '/admin/login', '/admin/roles']
  const adminPrefixes = ['/superadmin', '/admin', '/review-manager', '/review-team-member']

  if (publicPages.includes(to.path)) return

  const isAdminPath = adminPrefixes.some(p => to.path.startsWith(p))

  if (isAdminPath) {
    if (!adminToken.value) return navigateTo('/admin/login')
    return
  }

  if (!authToken.value) return navigateTo('/home')
})
