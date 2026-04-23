// composables/useRevenueBreakdown.ts
import { ref, onMounted } from 'vue'

export function useRevenueBreakdown() {
  const loading = ref(true)
  const error = ref(null)
  const breakdownData = ref(null)

  const fetchBreakdown = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await useApi('revenue-analysis/breakdown', {
        method: 'POST',
        body: {
          range_option: "Previous 3 months",
          custom_from: "12-05-2025"
        }
      })
      
      if (response.status === 'success') {
        breakdownData.value = response
      }
    } catch (err) {
      error.value = err
      console.error('Failed to fetch revenue breakdown:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchBreakdown()
  })

  return {
    loading,
    error,
    breakdownData,
    fetchBreakdown
  }
}
