export const useAdminDashboard = () => {
  const overview    = ref<any>(null)
  const customers   = ref<any[]>([])
  const charts      = ref<any>({ revenueBySource: [], licensingBreakdown: [] })
  const alerts      = ref<any[]>([])
  const loading     = ref(false)
  const error       = ref<string | null>(null)

  const fetchOverview = async () => {
    loading.value = true
    try {
      overview.value = await useRpApi('/revenue/admin/overview')
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load overview.'
    } finally {
      loading.value = false
    }
  }

  const fetchCustomers = async (tab: 'all' | 'partners' | 'direct' | 'resource') => {
    loading.value = true
    try {
      customers.value = await useRpApi(`/revenue/admin/customers/${tab}`) as any[]
      return customers.value
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load customers.'
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchCharts = async () => {
    try {
      const [bySource, licensing] = await Promise.all([
        useRpApi('/revenue/admin/charts/revenue-by-source'),
        useRpApi('/revenue/admin/charts/licensing-breakdown'),
      ])
      charts.value = { revenueBySource: bySource, licensingBreakdown: licensing }
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load charts.'
    }
  }

  const fetchAlerts = async () => {
    try {
      alerts.value = await useRpApi('/revenue/admin/alerts') as any[]
    } catch {}
  }

  const approvePartner = async (id: number, password: string, referralCode: string) => {
    return await useRpApi(`/revenue/admin/partner-approvals/${id}/approve`, {
      method: 'POST',
      body: { password, referral_code: referralCode },
    })
  }

  const rejectPartner = async (id: number) => {
    return await useRpApi(`/revenue/admin/partner-approvals/${id}/reject`, { method: 'POST' })
  }

  const fetchPartnerRegistrations = async () => {
    return await useRpApi('/revenue/admin/partner-approvals/registrations')
  }

  const approvePayment = async (id: number) => {
    return await useRpApi(`/revenue/admin/payment-requests/${id}/approve`, { method: 'POST' })
  }

  const rejectPayment = async (id: number) => {
    return await useRpApi(`/revenue/admin/payment-requests/${id}/reject`, { method: 'POST' })
  }

  const fetchPaymentRequests = async () => {
    return await useRpApi('/revenue/admin/partner-approvals/payment-requests')
  }

  const fetchUploadedReports = async () => {
    return await useRpApi('/revenue/admin/uploaded-reports')
  }

  const downloadReport = async (id: number) => {
    const config = useRuntimeConfig()
    const token  = useCookie('rp_token')
    window.open(`${config.public.apiBase}/revenue/admin/uploaded-reports/${id}/download?token=${token.value}`, '_blank')
  }

  const fetchUserMasterInfo = async () => {
    return await useRpApi('/revenue/admin/user-master-info')
  }

  return {
    overview, customers, charts, alerts, loading, error,
    fetchOverview, fetchCustomers, fetchCharts, fetchAlerts,
    approvePartner, rejectPartner, fetchPartnerRegistrations,
    approvePayment, rejectPayment, fetchPaymentRequests,
    fetchUploadedReports, downloadReport, fetchUserMasterInfo,
  }
}
