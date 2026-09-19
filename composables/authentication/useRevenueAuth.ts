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

  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig()

    const res: any = await $fetch('/revenue/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { email, password },
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })

    rpToken.value = res.token
    rpUser.value  = JSON.stringify(res.user)

    return navigateTo('/revenue-partnership/partner')
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
