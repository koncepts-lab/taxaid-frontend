export const useAccountsDashboard = () => {
  const overview  = ref<any>(null)
  const customers = ref<any[]>([])
  const alerts    = ref<any[]>([])
  const loading   = ref(false)
  const error     = ref<string | null>(null)

  const fetchOverview = async () => {
    loading.value = true
    try {
      overview.value = await useAdminApi('/revenue/admin/overview')
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load overview.'
    } finally {
      loading.value = false
    }
  }

  const fetchCustomers = async (tab: 'all' | 'partners' | 'direct' | 'resource') => {
    loading.value = true
    try {
      const result = await useAdminApi(`/revenue/admin/customers/${tab}`) as any[]
      customers.value = result
      return result
    } catch (e: any) {
      console.error(`[fetchCustomers:${tab}]`, e?.data?.message ?? e?.message ?? e)
      error.value = e?.data?.message ?? 'Failed to load customers.'
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchAlerts = async () => {
    try {
      alerts.value = await useAdminApi('/revenue/admin/alerts') as any[]
    } catch {}
  }

  const submitPaymentToPartner = async (data: {
    partner_id: number
    payment_date: string
    details: string
    amount: number
    voucher_number: string
    covered_client_ids: number[]
    client_amounts?: Record<string, number>
  }) => {
    return await useAdminApi('/revenue/accounts/payment-to-partner', { method: 'POST', body: data })
  }

  const calcPaymentTotal = async (client_amounts: Record<string, number>) => {
    return await useAdminApi('/revenue/accounts/payment-to-partner/total', { method: 'POST', body: { client_amounts } })
  }

  const fetchPartnerClients = async (partnerId: number) => {
    return await useAdminApi(`/revenue/accounts/partners/${partnerId}/clients`)
  }

  const addPartner = async (data: Record<string, any>) => {
    return await useAdminApi('/revenue/accounts/partners', { method: 'POST', body: data })
  }

  const uploadHosting = async (file: File, month: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('month', month)
    return await useAdminApi('/revenue/accounts/uploads/hosting', { method: 'POST', body: form })
  }

  const uploadAiUsage = async (file: File, month: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('month', month)
    return await useAdminApi('/revenue/accounts/uploads/ai-usage', { method: 'POST', body: form })
  }

  const downloadTemplate = async (type: 'hosting' | 'ai-usage') => {
    const config   = useRuntimeConfig()
    const token    = useCookie('admin_token')
    const fileName = type === 'hosting' ? 'hosting_cost_template.xlsx' : 'ai_usage_template.csv'

    const response = await fetch(`${config.public.apiBase}/revenue/accounts/uploads/${type}/template`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (!response.ok) throw new Error('Failed to download template')

    const blob = await response.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const fetchNotifyCustomers = async () => {
    try {
      return await useAdminApi('/revenue/accounts/notify-customers')
    } catch (e: any) {
      console.error('[fetchNotifyCustomers]', e?.data?.message ?? e?.message ?? e)
      return []
    }
  }

  const fetchUploadedReports = async () => {
    return await useAdminApi('/revenue/admin/uploaded-reports')
  }

  const fetchUserMasterInfo = async () => {
    try {
      return await useAdminApi('/revenue/admin/user-master-info')
    } catch (e: any) {
      console.error('[fetchUserMasterInfo]', e?.data?.message ?? e?.message ?? e)
      return []
    }
  }

  const sendCardExpiryNotification = async (tenantId: number) => {
    try {
      return await useAdminApi(`/revenue/accounts/notify-customers/${tenantId}/send`, { method: 'POST' })
    } catch (e: any) {
      console.error('[sendCardExpiryNotification]', e?.data?.message ?? e?.message ?? e)
      throw e
    }
  }

  const fetchActivePartners = async () => {
    try {
      return await useAdminApi('/revenue/accounts/partners')
    } catch {
      return []
    }
  }

  const fetchPartnerRegistrations = async () => {
    return await useAdminApi('/revenue/admin/partner-approvals/registrations')
  }

  return {
    overview, customers, alerts, loading, error,
    fetchOverview, fetchCustomers, fetchAlerts,
    submitPaymentToPartner, calcPaymentTotal, fetchPartnerClients, addPartner,
    uploadHosting, uploadAiUsage, downloadTemplate,
    fetchNotifyCustomers, fetchUploadedReports,
    fetchUserMasterInfo, fetchActivePartners, sendCardExpiryNotification,
  }
}
