// Card-2 ("own dashboard") destination per admin role. Single source of truth,
// consumed by the shared select-dashboard component. Roles not listed here
// (Super Admin, Admin, VP, Tech Team) have no distinct card-2 destination —
// Super Admin gets the directory instead, the rest are ticketing-only.
const OWN_DASHBOARD_ROUTES: Record<string, string> = {
  'Admin': '/admin/management',
  'Super Admin': '/admin/management',
  'Payments Admin': '/admin/payments',
  'Implementation Manager': '/admin/implementation/manager',
  'Implementation Consultant': '/admin/implementation/member',
  'Review Manager': '/admin/review-team/manager/dashboard',
  'Review Consultant': '/admin/review-team/member/dashboard',
  'Partner Admin': '/admin/revenue-partner/admin',
  'Partner Account': '/admin/revenue-partner/accounts',
}

export const useDashboardRoute = () => {
  const ownDashboardRoute = (roleName: string | null | undefined): string | null => {
    if (!roleName) return null
    return OWN_DASHBOARD_ROUTES[roleName] ?? null
  }

  return { ownDashboardRoute }
}
