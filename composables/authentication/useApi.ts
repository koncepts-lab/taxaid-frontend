// composables/authentication/useApi.ts
export const useApi = async (url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  try {
    const method = (options.method || 'GET').toUpperCase();

    const isFormData = options.body instanceof FormData

    return await $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(method !== 'GET' && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {}),
        ...options.headers,
      },
      onResponseError({ response }) {
        if (response.status === 401) {
          token.value = null
          useCookie('tenant_status').value = null
          useCookie('account_type').value = null
          useCookie('permissions').value = null
          useCookie('currency').value = null
          navigateTo('/home') // Send them back to login
        }
      }
    })
  } catch (err) {
    throw err
  }
} 