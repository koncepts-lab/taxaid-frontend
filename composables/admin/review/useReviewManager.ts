const _consultants   = ref<any[]>([])
const _syncStatus    = ref<any[]>([])
const _fixedProgress = ref<any[]>([])
const _workload      = ref<any[]>([])
const _unassigned    = ref<any[]>([])
const _loading       = ref(false)

export function useReviewManager() {
  const config = useRuntimeConfig()
  const token  = useCookie('admin_token')

  function apiFetch(url: string, options: any = {}) {
    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        Accept: 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...options.headers,
      },
    })
  }

  async function getConsultants(page = 1, search = ''): Promise<any> {
    const res: any = await apiFetch(`/admin/review/team/consultants?page=${page}&search=${encodeURIComponent(search)}`)
    _consultants.value = res.data ?? []
    return res
  }

  async function getSyncStatus(page = 1, search = '', status = ''): Promise<any> {
    const res: any = await apiFetch(`/admin/review/clients/sync-status?page=${page}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`)
    _syncStatus.value = res.data ?? []
    return res
  }

  async function getFixedProgress(page = 1, search = ''): Promise<any> {
    const res: any = await apiFetch(`/admin/review/clients/fixed-progress?page=${page}&search=${encodeURIComponent(search)}`)
    _fixedProgress.value = res.data ?? []
    return res
  }

  async function getTeamWorkload(page = 1, search = ''): Promise<any> {
    const res: any = await apiFetch(`/admin/review/team/workload?page=${page}&search=${encodeURIComponent(search)}`)
    _workload.value = res.data ?? []
    return res
  }

  async function getUnassignedClients(page = 1, search = ''): Promise<any> {
    const res: any = await apiFetch(`/admin/review/clients/unassigned?page=${page}&search=${encodeURIComponent(search)}`)
    _unassigned.value = res.data ?? []
    return res
  }

  async function assignConsultant(tenantId: number, adminId: number, departmentId: number): Promise<void> {
    await apiFetch('/admin/review/clients/assign', {
      method: 'POST',
      body: { tenant_id: tenantId, admin_id: adminId, department_id: departmentId },
    })
  }

  async function getConsultantDailyLog(adminId: number, date: string): Promise<any> {
    const res: any = await apiFetch(`/admin/activity/consultant/${adminId}/daily?date=${date}`)
    return res.data ?? {}
  }

  async function getConsultantWorkload(adminId: number): Promise<any[]> {
    const res: any = await apiFetch(`/admin/review/workload/${adminId}`)
    return res.data ?? []
  }

  async function getConsultantList(): Promise<any[]> {
    const res: any = await apiFetch('/admin/review/team/consultants')
    return res.data ?? []
  }

  return {
    loading: _loading,
    consultants: _consultants,
    syncStatus: _syncStatus,
    fixedProgress: _fixedProgress,
    workload: _workload,
    unassigned: _unassigned,
    getConsultants,
    getSyncStatus,
    getFixedProgress,
    getTeamWorkload,
    getUnassignedClients,
    assignConsultant,
    getConsultantDailyLog,
    getConsultantWorkload,
    getConsultantList,
  }
}
