import { ref } from 'vue'

const _monthlyReviews = ref<any[]>([])
const _loading        = ref(false)

export function useMonthlyReviews() {
  const runtimeConfig = useRuntimeConfig()
  const authToken     = useCookie('auth_token')

  const apiFetch = (url: string, options: any = {}) => {
    return $fetch(url, {
      baseURL: runtimeConfig.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(authToken.value ? { 'Authorization': `Bearer ${authToken.value}` } : {}),
        ...options.headers,
      },
    })
  }

  async function fetchScheduledReviews(): Promise<void> {
    _loading.value = true
    try {
      const res = await apiFetch('/monthly-reviews')
      _monthlyReviews.value = (res as any).data ?? []
    } catch {
      // non-fatal — appointments page still works without reviews
    } finally {
      _loading.value = false
    }
  }

  return {
    monthlyReviews: _monthlyReviews,
    fetchScheduledReviews,
  }
}
