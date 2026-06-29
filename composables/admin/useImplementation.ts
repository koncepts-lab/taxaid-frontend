export function useImplementation() {
  const config      = useRuntimeConfig()
  const tokenCookie = useCookie('admin_token')

  function apiFetch(url: string, options: any = {}) {
    const method = (options.method || 'GET').toUpperCase()
    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
        ...(tokenCookie.value ? { 'Authorization': `Bearer ${tokenCookie.value}` } : {}),
        ...options.headers,
      },
    })
  }

  // Manager routes — role: Super Admin, Implementation Manager
  async function getPool(implementationStatus?: string, connectorStatus?: string): Promise<any[]> {
    const params: any = {}
    if (implementationStatus) params.implementation_status = implementationStatus
    if (connectorStatus) params.connector_status = connectorStatus
    const res: any = await apiFetch('/admin/implementation-pool', { params })
    return res.data ?? []
  }

  async function getConsultants(): Promise<any[]> {
    const res: any = await apiFetch('/admin/implementation-consultants')
    return res.data ?? []
  }

  async function updateAssignment(data: {
    client_id: string
    implementation_consultant_id?: number | null
    connector_status?: string
    implementation_status?: string
  }): Promise<any> {
    const res: any = await apiFetch('/admin/implementation-pool/update', { method: 'PATCH', body: data })
    return res.data ?? res
  }

  async function getConsultantWorkload(): Promise<any[]> {
    const res: any = await apiFetch('/admin/implementation-pool/consultant-workload')
    return res.data ?? []
  }

  async function getConsultantWorkloadDetails(consultantId: number): Promise<any[]> {
    const res: any = await apiFetch('/admin/implementation-pool/consultant-workload-details', {
      params: { consultant_id: consultantId },
    })
    return res.data ?? []
  }

  async function getProjectStatusCounts(): Promise<any> {
    const res: any = await apiFetch('/admin/implementation-pool/project-status-counts')
    return res.data ?? {}
  }

  // Member routes — role: Super Admin, Implementation Consultant
  async function getMyClients(): Promise<any[]> {
    const res: any = await apiFetch('/admin/implementation-pool/my-clients')
    return res.data ?? []
  }

  async function getClientSteps(clientId: string): Promise<any[]> {
    const res: any = await apiFetch(`/admin/implementation-pool/client-steps/${clientId}`)
    return res.data ?? []
  }

  async function getDeliverablesThisWeek(): Promise<number> {
    const res: any = await apiFetch('/admin/implementation-pool/deliverables-this-week')
    return res.data?.deliverables_this_week ?? 0
  }

  async function getAverageCompletionDays(): Promise<number> {
    const res: any = await apiFetch('/admin/implementation-pool/average-completion-days')
    return res.data?.average_days_to_complete ?? 0
  }

  async function getProjectCounts(): Promise<any> {
    const res: any = await apiFetch('/admin/implementation-pool/project-counts')
    return res.data ?? {}
  }

  async function updateStepProgress(id: number, data: {
    completed?: boolean
    client_delay?: boolean
    client_delay_reason?: string | null
  }): Promise<any> {
    const res: any = await apiFetch(`/admin/implementation-pool/step-progress/${id}`, { method: 'PATCH', body: data })
    return res.data
  }

  async function getClientDelays(clientId: string): Promise<any[]> {
    const res: any = await apiFetch(`/admin/implementation-pool/client-delays/${clientId}`)
    return res.data ?? []
  }

  // Partner linking (Implementation Manager)
  async function getActivePartners(): Promise<any[]> {
    const res: any = await apiFetch('/admin/partners', { params: { status: 'active' } })
    return res.data ?? []
  }

  async function linkPartnerToClient(partnerId: number, userId: number): Promise<any> {
    const res: any = await apiFetch(`/admin/partners/${partnerId}/link-client/${userId}`, { method: 'POST' })
    return res.data
  }

  // GL Code Master
  async function getGLMasters(): Promise<any> {
    const res: any = await apiFetch('/admin/gl/masters')
    return res.data ?? { fs_codes: [], main_groups: [], sub_groups: [] }
  }

  async function createFsCode(code: string): Promise<any> {
    const res: any = await apiFetch('/admin/gl/fs-codes', { method: 'POST', body: { code } })
    return res.data
  }

  async function createMainGroup(name: string): Promise<any> {
    const res: any = await apiFetch('/admin/gl/main-groups', { method: 'POST', body: { name } })
    return res.data
  }

  async function createSubGroup(name: string): Promise<any> {
    const res: any = await apiFetch('/admin/gl/sub-groups', { method: 'POST', body: { name } })
    return res.data
  }

  async function updateFsCode(id: number, code: string): Promise<any> {
    const res: any = await apiFetch(`/admin/gl/fs-codes/${id}`, { method: 'PUT', body: { code } })
    return res.data
  }

  async function updateMainGroup(id: number, name: string): Promise<any> {
    const res: any = await apiFetch(`/admin/gl/main-groups/${id}`, { method: 'PUT', body: { name } })
    return res.data
  }

  async function updateSubGroup(id: number, name: string): Promise<any> {
    const res: any = await apiFetch(`/admin/gl/sub-groups/${id}`, { method: 'PUT', body: { name } })
    return res.data
  }

  async function deleteFsCode(id: number): Promise<void> {
    await apiFetch(`/admin/gl/fs-codes/${id}`, { method: 'DELETE' })
  }

  async function deleteMainGroup(id: number): Promise<void> {
    await apiFetch(`/admin/gl/main-groups/${id}`, { method: 'DELETE' })
  }

  async function deleteSubGroup(id: number): Promise<void> {
    await apiFetch(`/admin/gl/sub-groups/${id}`, { method: 'DELETE' })
  }

  return {
    getPool,
    getConsultants,
    updateAssignment,
    getConsultantWorkload,
    getConsultantWorkloadDetails,
    getProjectStatusCounts,
    getMyClients,
    getClientSteps,
    getDeliverablesThisWeek,
    getAverageCompletionDays,
    getProjectCounts,
    updateStepProgress,
    getClientDelays,
    getActivePartners,
    linkPartnerToClient,
    getGLMasters,
    createFsCode, createMainGroup, createSubGroup,
    updateFsCode, updateMainGroup, updateSubGroup,
    deleteFsCode, deleteMainGroup, deleteSubGroup,
  }
}
