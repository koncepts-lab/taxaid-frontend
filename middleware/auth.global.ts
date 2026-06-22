export default defineNuxtRouteMiddleware((to) => {
  const authToken       = useCookie('auth_token')
  const adminToken      = useCookie('admin_token')
  const adminUserCookie = useCookie('admin_user')

  const publicPages   = ['/', '/home', '/revenue-partnership-login', '/verify-email', '/test-auth', '/superadmin/login', '/admin/login']
  const adminPrefixes = ['/superadmin', '/admin', '/review-manager', '/review-team-member']

  if (publicPages.includes(to.path)) return

  const isAdminPath = adminPrefixes.some(p => to.path.startsWith(p))

  if (isAdminPath) {
    // superadmin keeps its own login page
    if (to.path.startsWith('/superadmin')) {
      if (!adminToken.value) return navigateTo('/superadmin/login')
      return
    }

    // all other admin routes require admin_token — redirect to /admin/login if missing
    if (!adminToken.value) return navigateTo('/admin/login')

    // parse role + department stored at login time
    // useCookie<string|null> in useAdminAuth stores a raw JSON string;
    // middleware's useCookie() (no type) may auto-deserialize it to an object already
    let adminUser: any = adminUserCookie.value
    if (typeof adminUser === 'string') {
      try { adminUser = JSON.parse(adminUser) } catch { adminUser = null }
    }

    const role = adminUser?.role?.name
    const dept = adminUser?.department?.name

    const isReviewManager = role === 'Review Manager' && dept === 'Review'
    const isReviewTeam    = (role === 'Team Lead' || role === 'Review Consultant') && dept === 'Review'

    if (to.path.startsWith('/review-manager')) {
      if (!isReviewManager) {
        if (isReviewTeam) return navigateTo('/review-team-member/dashboard')
        return navigateTo('/admin')
      }
    }

    if (to.path.startsWith('/review-team-member')) {
      if (!isReviewTeam) {
        if (isReviewManager) return navigateTo('/review-manager/dashboard')
        return navigateTo('/admin')
      }
    }

    return
  }

  if (!authToken.value) return navigateTo('/home')
})
