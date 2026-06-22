export const useAdminApi = async (url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const token = useCookie('admin_token')

  const method = (options.method || 'GET').toUpperCase()
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
        navigateTo('/superadmin/login')
      }
    },
  })
}
