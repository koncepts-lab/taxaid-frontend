// composables/useAuth.ts
export const useAuth = () => {
  // 1. Shared state for the user object
  const user = useState('auth_user', () => null)
  
  // 2. Cookie for the token
  const token = useCookie('auth_token')
  const config = useRuntimeConfig()

  // 3. Login Logic
  const login = async (credentials: any, remember: boolean = false, location: string | null = null) => {
    try {
      // Session tracking extras (optional server-side): browser timezone -> coarse location,
      // plus a geolocated "City, Region, Country" when the caller resolved one
      let sessionMeta: Record<string, any> = {}
      try {
        sessionMeta = {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          device_name: navigator?.platform || null,
        }
      } catch {}
      if (location) sessionMeta.location = location

      const response: any = await $fetch('/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { ...credentials, ...sessionMeta },
        headers: { 'Accept': 'application/json' }
      })

      if (response.status === 'success') {
        const cookieOptions = remember
          ? { maxAge: 60 * 60 * 24 * 7, path: '/' } // 7 days = backend token expiry; else session-only cookie
          : { path: '/' }

        const authToken = useCookie('auth_token', cookieOptions)
        authToken.value = response.data.token
        
        user.value = response.data.user   // Saved to global state
        // Persisted for the Reverb notification listener (survives refresh)
        if (response.data.user?.id) {
          try { localStorage.setItem('auth_user_id', String(response.data.user.id)) } catch {}
        }
        // Force syncWebPush to re-register the device token under THIS new
        // session — its backend row is tied to the session (token_id) and
        // would otherwise still point at the previous, now-dead session
        try { localStorage.removeItem('push_device_token_user_id') } catch {}
        return response
      }
    } catch (error) {
      throw error
    }
  }

  // 4. Logout Logic
  const logout = async () => {
    if (token.value) {
      // This browser's push registration is disposed server-side along with
      // the auth token — one atomic call; other logged-in devices keep theirs
      let deviceToken: string | null = null
      try { deviceToken = localStorage.getItem('push_device_token') } catch {}
      try {
        await $fetch('/logout', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: deviceToken ? { device_token: deviceToken } : {},
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
          }
        })
      } catch (error) {
      }
    }

    token.value = null
    user.value = null
    try {
      localStorage.removeItem('auth_user_id')
      localStorage.removeItem('push_device_token')
      localStorage.removeItem('push_device_token_user_id')
    } catch {}
    await navigateTo('/home')
  }

  return { 
    user, 
    token, 
    login, 
    logout,
    isAuthenticated: computed(() => !!token.value) 
  }
}