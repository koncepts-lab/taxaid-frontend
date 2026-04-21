// composables/useAuth.ts
export const useAuth = () => {
  // 1. Shared state for the user object
  const user = useState('auth_user', () => null)
  
  // 2. Cookie for the token
  const token = useCookie('auth_token')
  const config = useRuntimeConfig()

  // 3. Login Logic
  const login = async (credentials: any, remember: boolean = false) => {
    try {
      const response: any = await $fetch('/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: credentials,
        headers: { 'Accept': 'application/json' }
      })

      if (response.status === 'success') {
        const cookieOptions = remember 
          ? { maxAge: 60 * 60 * 24 * 30, path: '/' } //30days if user check rember me. elso session only
          : { path: '/' }

        const authToken = useCookie('auth_token', cookieOptions)
        authToken.value = response.data.token
        
        user.value = response.data.user   // Saved to global state
        return response
      }
    } catch (error) {
      throw error
    }
  }

  // 4. Logout Logic
  const logout = async () => {
    if (token.value) {
      try {
        await $fetch('/logout', {
          baseURL: config.public.apiBase,
          method: 'POST',
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