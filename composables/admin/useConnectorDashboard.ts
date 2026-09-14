const _groups     = ref<any[]>([])
const _customGroups = ref<any[]>([])
const _tenants    = ref<any[]>([])
const _updates    = ref<any[]>([])
const _groupsMeta  = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _customGroupsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _tenantsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _updatesMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _uploadProgress = ref(0)
const _shardingSettings = ref({ max_groups: 10 })
const _liveStatus = ref({ running_tasks: [], active_tenants_count: 0, queued_tenants_count: 0, total_groups: 0 })
const _liveStatusMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _importMetrics = ref({ summary: [], recent: [] })
const _importMetricsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })

export function useConnectorDashboard() {
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

  function applyMeta(target: any, res: any, page: number, perPage: number) {
    target.value = {
      current_page: res.current_page ?? page,
      per_page: res.per_page ?? perPage,
      total: res.total ?? 0,
      last_page: res.last_page ?? 1,
    }
  }

  async function getStats(): Promise<any> {
    return apiFetch('/admin/connector/stats')
  }

  async function getGroups(page = 1, perPage = 10): Promise<any[]> {
    const res: any = await apiFetch(`/admin/connector/groups?page=${page}&per_page=${perPage}&is_custom=0`)
    _groups.value = res.data ?? []
    applyMeta(_groupsMeta, res, page, perPage)
    return _groups.value
  }

  async function getGroupFilterOptions(): Promise<any[]> {
    const [defaultRes, customRes]: any = await Promise.all([
      apiFetch('/admin/connector/groups?page=1&per_page=1000&is_custom=0'),
      apiFetch('/admin/connector/groups?page=1&per_page=1000&is_custom=1'),
    ])
    return [...(defaultRes.data ?? []), ...(customRes.data ?? [])]
  }

  async function getCustomGroups(page = 1, perPage = 10): Promise<any[]> {
    const res: any = await apiFetch(`/admin/connector/groups?page=${page}&per_page=${perPage}&is_custom=1`)
    _customGroups.value = res.data ?? []
    applyMeta(_customGroupsMeta, res, page, perPage)
    return _customGroups.value
  }

  async function updateGroup(id: number, data: {
    name?: string
    reconciliation_interval_minutes?: number
    sync_time?: string
    cycle_2_time?: string
    cycle_2_enabled?: boolean
    full_sync_frequency?: 'weekly' | 'biweekly' | 'monthly'
    full_sync_day?: number
    notes?: string
  }): Promise<any> {
    return apiFetch(`/admin/connector/groups/${id}`, { method: 'PUT', body: data })
  }

  async function getTenants(page = 1, perPage = 10, search = '', groupId: number | null = null): Promise<any[]> {
    const groupParam = groupId ? `&group_id=${groupId}` : ''
    const res: any = await apiFetch(`/admin/connector/tenants?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}${groupParam}`)
    _tenants.value = res.data ?? []
    applyMeta(_tenantsMeta, res, page, perPage)
    return _tenants.value
  }

  async function getShardingSettings(): Promise<any> {
    const res = await apiFetch('/admin/connector/sharding-settings')
    _shardingSettings.value = res
    return res
  }

  async function updateShardingSettings(maxGroups: number): Promise<any> {
    const res = await apiFetch('/admin/connector/sharding-settings', {
      method: 'PUT',
      body: { max_groups: maxGroups },
    })
    _shardingSettings.value = res
    return res
  }

  async function createCustomGroup(fields: any): Promise<any> {
    return apiFetch('/admin/connector/groups/custom', {
      method: 'POST',
      body: fields,
    })
  }

  async function deleteCustomGroup(id: number): Promise<any> {
    return apiFetch(`/admin/connector/groups/custom/${id}`, { method: 'DELETE' })
  }

  async function pinTenantToCustomGroup(tenantId: number, name: string): Promise<any> {
    return apiFetch(`/admin/connector/tenants/${tenantId}/pin-custom-group`, {
      method: 'POST',
      body: { name },
    })
  }

  async function getLiveStatus(page = 1, perPage = 10): Promise<any> {
    const res: any = await apiFetch(`/admin/connector/live-status?page=${page}&per_page=${perPage}`)
    _liveStatus.value = {
      running_tasks: res.running_tasks?.data ?? [],
      active_tenants_count: res.active_tenants_count,
      queued_tenants_count: res.queued_tenants_count,
      total_groups: res.total_groups,
    }
    applyMeta(_liveStatusMeta, res.running_tasks ?? {}, page, perPage)
    return _liveStatus.value
  }

  async function getImportMetrics(opts: {
    days?: number
    groupId?: number | null
    status?: string | null
    sortBy?: string
    sortDir?: 'asc' | 'desc'
    page?: number
    perPage?: number
  } = {}): Promise<any> {
    const { days = 60, groupId = null, status = null, sortBy = 'created_at', sortDir = 'desc', page = 1, perPage = 10 } = opts
    const groupParam = groupId ? `&group_id=${groupId}` : ''
    const statusParam = status ? `&status=${encodeURIComponent(status)}` : ''
    const res: any = await apiFetch(`/admin/connector/import-metrics?days=${days}${groupParam}${statusParam}&sort_by=${sortBy}&sort_dir=${sortDir}&page=${page}&per_page=${perPage}`)
    _importMetrics.value = { summary: res.summary ?? [], recent: res.recent?.data ?? [] }
    applyMeta(_importMetricsMeta, res.recent ?? {}, page, perPage)
    return _importMetrics.value
  }

  async function reassignGroup(tenantId: number, connectorGroupId: number): Promise<void> {
    await apiFetch(`/admin/connector/tenants/${tenantId}`, {
      method: 'PUT',
      body: { connector_group_id: connectorGroupId },
    })
  }

  async function getUpdatePackages(page = 1, perPage = 10): Promise<any[]> {
    const res: any = await apiFetch(`/admin/connector/updates?page=${page}&per_page=${perPage}`)
    _updates.value = res.data ?? []
    applyMeta(_updatesMeta, res, page, perPage)
    return _updates.value
  }

  async function sha256Hex(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const digest = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  function putWithProgress(url: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', url)
      xhr.setRequestHeader('Content-Type', 'application/octet-stream')
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) _uploadProgress.value = Math.round((e.loaded / e.total) * 100)
      }
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error(`Upload failed (${xhr.status})`))
      xhr.onerror = () => reject(new Error('Upload failed'))
      xhr.send(file)
    })
  }

  async function uploadUpdatePackage(file: File, version: string, isLatest = true, scheduledAt: string | null = null): Promise<any> {
    _uploadProgress.value = 0

    const { upload_url, file_path }: any = await apiFetch('/admin/connector/updates/request-upload-url', {
      method: 'POST',
      body: { version, content_type: 'application/octet-stream' },
    })

    const checksum = await sha256Hex(file)
    await putWithProgress(upload_url, file)

    const result = await apiFetch('/connector/tally/updates', {
      method: 'POST',
      body: {
        version,
        file_path,
        checksum,
        is_latest: isLatest,
        ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
      },
    })

    _uploadProgress.value = 100
    return result
  }

  async function setLatestPackage(id: number): Promise<any> {
    const result = await apiFetch(`/admin/connector/updates/${id}/set-latest`, { method: 'PATCH' })
    const idx = _updates.value.findIndex((p: any) => p.id === id)
    if (idx !== -1) {
      _updates.value = _updates.value.map((p: any) => ({ ...p, is_latest: p.id === id }))
    }
    return result
  }

  async function downloadUpdatePackage(id: number, version: string): Promise<void> {
    const { download_url }: any = await apiFetch(`/connector/tally/updates/download/${id}`)
    window.location.href = download_url
  }

  return {
    groups: _groups,
    customGroups: _customGroups,
    customGroupsMeta: _customGroupsMeta,
    tenants: _tenants,
    updates: _updates,
    groupsMeta: _groupsMeta,
    tenantsMeta: _tenantsMeta,
    updatesMeta: _updatesMeta,
    uploadProgress: _uploadProgress,
    shardingSettings: _shardingSettings,
    liveStatus: _liveStatus,
    liveStatusMeta: _liveStatusMeta,
    importMetrics: _importMetrics,
    importMetricsMeta: _importMetricsMeta,
    getStats,
    getGroups,
    getGroupFilterOptions,
    getCustomGroups,
    updateGroup,
    deleteCustomGroup,
    getTenants,
    reassignGroup,
    getUpdatePackages,
    uploadUpdatePackage,
    downloadUpdatePackage,
    setLatestPackage,
    getShardingSettings,
    updateShardingSettings,
    createCustomGroup,
    pinTenantToCustomGroup,
    getLiveStatus,
    getImportMetrics,
  }
}
