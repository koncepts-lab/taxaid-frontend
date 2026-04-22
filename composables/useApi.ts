// composables/useApi.ts
export const useApi = async (url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  try {
    return await $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {}),
        ...options.headers,
      },
      onResponseError({ response }) {
        if (response.status === 401) {
          // Token expired or invalid
          token.value = null // Clear the bad token
          navigateTo('/home') // Send them back to login
        }
      }
    })
  } catch (err) {
    throw err
  }
}