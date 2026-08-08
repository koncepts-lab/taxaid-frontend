// Runs on the actual HTTP request (Nitro), before any client JS. Only acts when a real
// admin_token cookie is present (a genuine logged-in admin hit a broken/renamed link) —
// anonymous requests to unknown /admin paths fall through to the normal 404, revealing
// nothing, matching auth.global.ts's existing posture for unauthenticated admin access.
const VALID_ADMIN_PATHS = new Set([
  '/admin',
  '/admin/roles',
  '/admin/dashboard',
  '/admin/implementation',
  '/admin/implementation/manager',
  '/admin/implementation/member',
  '/admin/implementation/project',
  '/admin/payments',
  '/admin/notifications',
  '/admin/activity-log',
  '/admin/Review-Dashboard',
  '/admin/ticketing',
  '/admin/ticketing/ticketing-dashboard',
])

export default defineEventHandler((event) => {
  const path = (event.node.req.url || '').split('?')[0]

  if (!path.startsWith('/admin')) return
  if (!getCookie(event, 'admin_token')) return // anonymous — let it 404 normally, reveal nothing

  const isValid = VALID_ADMIN_PATHS.has(path) || path.startsWith('/admin/Review-Dashboard/')

  if (!isValid) {
    return sendRedirect(event, '/ad-aqnz-pro-auth-78z46', 302)
  }
})
