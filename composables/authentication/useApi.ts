export const useApi = async (url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')
  const currentLang = useState('currentLang', () => 'en')

  const { raw, ...rest } = options
  const method = (rest.method || 'GET').toUpperCase()
  const isFormData = rest.body instanceof FormData

  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('clear_cache') === '1') {
    if (method === 'GET' && !isFormData) {
      rest.query = { ...(rest.query || {}), clear_cache: 'all' }
      if (rest.params) rest.params = { ...rest.params, clear_cache: 'all' }
    } else if (!isFormData) {
      rest.body = { ...(rest.body || {}), clear_cache: 'all' }
    }
  }

  // Auto-append lang=ar to every request when the UI is in Arabic, so
  // individual composables don't each need to set it manually. A caller's
  // own explicit `lang` (query/params/body) takes precedence.
  if (currentLang.value === 'ar' && !isFormData) {
    if (method === 'GET') {
      rest.query = { lang: 'ar', ...(rest.query || {}) }
      if (rest.params) rest.params = { lang: 'ar', ...rest.params }
    } else {
      rest.body = { lang: 'ar', ...(rest.body || {}) }
    }
  }

  const clearSession = () => {
    token.value = null
    useCookie('tenant_status').value = null
    useCookie('account_type').value = null
    useCookie('permissions').value = null
    useCookie('currency').value = null
    useCookie('timezone').value = null
    useCookie('display_format').value = null
    navigateTo('/home')
  }

  const fetchOptions = {
    baseURL: config.public.apiBase,
    ...rest,
    headers: {
      'Accept': 'application/json',
      ...(method !== 'GET' && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {}),
      ...rest.headers,
    },
    onResponseError({ response }: any) {
      if (response.status === 401) clearSession()
    },
  }

  if (raw) {
    return await $fetch.raw(url, { ...fetchOptions, ignoreResponseError: true })
  }

  return await $fetch(url, fetchOptions)
}