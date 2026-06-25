export const useRevenueAuth = () => {
  const rpToken = useCookie('rp_token')
  const rpUser  = useCookie('rp_user')

  const isAuthenticated = computed(() => !!rpToken.value)

  const user = computed(() => {
    if (!rpUser.value) return null
    try {
      return typeof rpUser.value === 'string' ? JSON.parse(rpUser.value) : rpUser.value
    } catch {
      return null
    }
  })

  const login = async (role: string, email: string, password: string) => {
    const config = useRuntimeConfig()

    const res: any = await $fetch('/revenue/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { role, email, password },
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })

    rpToken.value = res.token
    rpUser.value  = JSON.stringify(res.user)

    const userRole = (res.user?.role ?? '').toLowerCase()

    if (userRole === 'partner') {
      return navigateTo('/revenue-partnership/partner')
    }

    if (userRole === 'accounts') {
      return navigateTo('/revenue-partnership/accounts')
    }

    // admin — check assigned systems for multi-system routing
    const systems: string[] = res.user?.assigned_systems ?? []
    const hasRevenue  = systems.includes('revenue_dashboard')
    const hasTicketing = systems.includes('ticketing_dashboard')

    if (hasRevenue && hasTicketing) {
      return navigateTo('/revenue-partnership/select-dashboard')
    }

    return navigateTo('/revenue-partnership/admin')
  }

  const logout = async () => {
    try {
      await useRpApi('/revenue/logout', { method: 'POST' })
    } catch {}
    rpToken.value = null
    rpUser.value  = null
    return navigateTo('/revenue-partnership-login')
  }

  return { login, logout, isAuthenticated, user, rpToken, rpUser }
}
