import { ref, watch } from 'vue'

export const useCashFlowProjection = (options: { date?: string, period?: number } = {}) => {
  const loading = ref(false)
  const error = ref<any>(null)
  const data = ref<any>(null)

  const fetchProjection = async () => {
    loading.value = true
    error.value = null
    try {
      const { date = '2025-06-15', period = 6 } = options
      // The user provided a GET URL with query params
      const response = await useApi(`cash-flow/projection?date=${date}&period=${period}`, {
        method: 'GET'
      })
      
      if (response.status === 'success') {
        data.value = response.data
      } else {
        error.value = response.message || 'Failed to fetch cash flow projection'
      }
    } catch (err) {
      error.value = err
      console.error('Cash Flow Projection Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Initial fetch
  fetchProjection()

  return {
    loading,
    error,
    data,
    refresh: fetchProjection
  }
}
