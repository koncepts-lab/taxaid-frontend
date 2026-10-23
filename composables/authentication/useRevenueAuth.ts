let syncedThisLoad = false

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

  const login = async (email: string, password: string, location: string | null = null) => {
    const config = useRuntimeConfig()

    let sessionMeta: Record<string, any> = {}
    try {
      sessionMeta = { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
    } catch {}
    if (location) sessionMeta.location = location

    const res: any = await $fetch('/revenue/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { email, password, ...sessionMeta },
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })

    rpToken.value = res.token
    rpUser.value  = JSON.stringify(res.user)

    return navigateTo('/taxaid-partner/dashboard')
  }

  const logout = async () => {
    try {
      await useRpApi('/revenue/logout', { method: 'POST' })
    } catch {}
    rpToken.value = null
    rpUser.value  = null
    return navigateTo('/taxaid-partnership-login')
  }

  const updateName = (name: string) => {
    if (!user.value) return
    rpUser.value = JSON.stringify({ ...user.value, name })
  }

  const syncFromServer = async (): Promise<void> => {
    if (syncedThisLoad || !rpToken.value) return
    syncedThisLoad = true
    try {
      const res: any = await useRpApi('/revenue/partner/me')
      const fresh = res?.data
      if (fresh) {
        rpUser.value = JSON.stringify({ ...(user.value ?? {}), ...fresh })
      }
    } catch {}
  }

  return { login, logout, isAuthenticated, user, rpToken, rpUser, updateName, syncFromServer }
}
