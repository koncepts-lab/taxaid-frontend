const _groups     = ref<any[]>([])
const _tenants    = ref<any[]>([])
const _updates    = ref<any[]>([])
const _groupsMeta  = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _tenantsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _updatesMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const _uploadProgress = ref(0)

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
    const res: any = await apiFetch(`/admin/connector/groups?page=${page}&per_page=${perPage}`)
    _groups.value = res.data ?? []
    applyMeta(_groupsMeta, res, page, perPage)
    return _groups.value
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

  async function getTenants(page = 1, perPage = 10, search = ''): Promise<any[]> {
    const res: any = await apiFetch(`/admin/connector/tenants?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`)
    _tenants.value = res.data ?? []
    applyMeta(_tenantsMeta, res, page, perPage)
    return _tenants.value
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

  async function downloadUpdatePackage(id: number, version: string): Promise<void> {
    const blob: Blob = await apiFetch(`/connector/tally/updates/download/${id}`, { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TaxAidConnector-${version}.exe`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return {
    groups: _groups,
    tenants: _tenants,
    updates: _updates,
    groupsMeta: _groupsMeta,
    tenantsMeta: _tenantsMeta,
    updatesMeta: _updatesMeta,
    uploadProgress: _uploadProgress,
    getStats,
    getGroups,
    updateGroup,
    getTenants,
    reassignGroup,
    getUpdatePackages,
    uploadUpdatePackage,
    downloadUpdatePackage,
  }
}
