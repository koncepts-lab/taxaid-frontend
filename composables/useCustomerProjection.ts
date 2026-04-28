import { ref } from 'vue'

export const useCustomerProjection = () => {
  const loading = ref(false)
  const error = ref<any>(null)
  const data = ref<any>(null)

  const fetchCustomerDetail = async (params: { date: string, period: number, customer: string, type: string }) => {
    loading.value = true
    error.value = null
    try {
      const { date, period, customer, type } = params
      const response = await useApi(`cash-flow/customer-projection?date=${date}&period=${period}&customer=${encodeURIComponent(customer)}&type=${type}`, {
        method: 'GET'
      })
      
      if (response.status === 'success') {
        data.value = response.data
        return response.data
      } else {
        error.value = response.message || 'Failed to fetch customer detail'
      }
    } catch (err) {
      error.value = err
      console.error('Customer Projection Error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    data,
    fetchCustomerDetail
  }
}
