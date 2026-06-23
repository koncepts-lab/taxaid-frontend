export const useAccountsDashboard = () => {
  const overview  = ref<any>(null)
  const customers = ref<any[]>([])
  const alerts    = ref<any[]>([])
  const loading   = ref(false)
  const error     = ref<string | null>(null)

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

  const fetchAlerts = async () => {
    try {
      alerts.value = await useRpApi('/revenue/admin/alerts') as any[]
    } catch {}
  }

  const submitPaymentToPartner = async (data: {
    partner_id: number
    payment_date: string
    details: string
    amount: number
    voucher_number: string
    covered_client_ids: number[]
  }) => {
    return await useRpApi('/revenue/accounts/payment-to-partner', { method: 'POST', body: data })
  }

  const fetchPartnerClients = async (partnerId: number) => {
    return await useRpApi(`/revenue/accounts/partners/${partnerId}/clients`)
  }

  const addPartner = async (data: Record<string, any>) => {
    return await useRpApi('/revenue/accounts/partners', { method: 'POST', body: data })
  }

  const uploadHosting = async (file: File, month: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('month', month)
    return await useRpApi('/revenue/accounts/uploads/hosting', { method: 'POST', body: form })
  }

  const uploadAiUsage = async (file: File, month: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('month', month)
    return await useRpApi('/revenue/accounts/uploads/ai-usage', { method: 'POST', body: form })
  }

  const downloadTemplate = async (type: 'hosting' | 'ai-usage') => {
    const config = useRuntimeConfig()
    const token  = useCookie('rp_token')
    window.open(`${config.public.apiBase}/revenue/accounts/uploads/${type}/template?token=${token.value}`, '_blank')
  }

  const fetchNotifyCustomers = async () => {
    return await useRpApi('/revenue/accounts/notify-customers')
  }

  const fetchUploadedReports = async () => {
    return await useRpApi('/revenue/admin/uploaded-reports')
  }

  const fetchUserMasterInfo = async () => {
    return await useRpApi('/revenue/admin/user-master-info')
  }

  const fetchActivePartners = async () => {
    try {
      return await useRpApi('/revenue/accounts/partners')
    } catch {
      return []
    }
  }

  const fetchPartnerRegistrations = async () => {
    return await useRpApi('/revenue/admin/partner-approvals/registrations')
  }

  return {
    overview, customers, alerts, loading, error,
    fetchOverview, fetchCustomers, fetchAlerts,
    submitPaymentToPartner, fetchPartnerClients, addPartner,
    uploadHosting, uploadAiUsage, downloadTemplate,
    fetchNotifyCustomers, fetchUploadedReports,
    fetchUserMasterInfo, fetchActivePartners,
  }
}
