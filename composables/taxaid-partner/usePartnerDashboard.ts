export const usePartnerDashboard = () => {
  const stats    = ref<any>(null)
  const summary  = ref<any[]>([])
  const payments = ref<any[]>([])
  const alerts   = ref<any[]>([])
  const loading  = ref(false)
  const error    = ref<string | null>(null)

  const fetchDashboard = async () => {
    loading.value = true
    try {
      stats.value = await useRpApi('/revenue/partner/dashboard')
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load dashboard.'
    } finally {
      loading.value = false
    }
  }

  const fetchSummary = async () => {
    loading.value = true
    try {
      summary.value = await useRpApi('/revenue/partner/summary') as any[]
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load summary.'
    } finally {
      loading.value = false
    }
  }

  const fetchPayments = async (filters: { status?: string } = {}) => {
    loading.value = true
    try {
      const params = filters.status ? `?status=${filters.status}` : ''
      payments.value = await useRpApi(`/revenue/partner/payments${params}`) as any[]
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load payments.'
    } finally {
      loading.value = false
    }
  }

  const exportPayments = async () => {
    const config = useRuntimeConfig()
    const token  = useCookie('rp_token')

    const response = await fetch(`${config.public.apiBase}/revenue/partner/export`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (!response.ok) throw new Error('Failed to export payments')

    const blob = await response.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'payments-export.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const fetchAlerts = async () => {
    try {
      alerts.value = await useRpApi('/revenue/partner/alerts') as any[]
    } catch {}
  }

  return {
    stats, summary, payments, alerts, loading, error,
    fetchDashboard, fetchSummary, fetchPayments, exportPayments, fetchAlerts,
  }
}
