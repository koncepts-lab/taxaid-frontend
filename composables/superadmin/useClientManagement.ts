// Client Management (Super Admin) — tenant list + per-tenant connector
// controls. All calls go through useAdminApi (admin_token).

export interface TenantRow {
  id: number
  license_id: string
  status: string
  data_mode: string | null
  go_live_at: string | null
  created_at: string
  name: string | null // company_name of the tenant's users
}

export function useClientManagement() {
  // ── Tenant list ─────────────────────────────────────────────────────────
  async function getTenants(params: { search?: string; status?: string; page?: number; per_page?: number } = {}): Promise<any> {
    const q = new URLSearchParams()
    if (params.search) q.set('search', params.search)
    if (params.status) q.set('status', params.status)
    if (params.page) q.set('page', String(params.page))
    if (params.per_page) q.set('per_page', String(params.per_page))
    return useAdminApi(`/admin/tenants?${q.toString()}`)
  }

  // ── Status & Users tab ──────────────────────────────────────────────────
  const setTenantStatus = (tenantId: number, status: 'live' | 'suspended') =>
    useAdminApi(`/admin/tenants/${tenantId}/status`, { method: 'PATCH', body: { status } })

  const getTenantUsers = (tenantId: number) =>
    useAdminApi(`/admin/tenants/${tenantId}/users`)

  // ── Connector controls (admin passes tenant_id) ─────────────────────────
  const getSchedule = (tenantId: number) =>
    useAdminApi(`/connector/schedule?tenant_id=${tenantId}`)

  const setSchedule = (tenantId: number, data: { sync_time: string; years: string[]; enabled: boolean }) =>
    useAdminApi('/connector/schedule', { method: 'POST', body: { tenant_id: tenantId, ...data } })

  const syncNow = (tenantId: number) =>
    useAdminApi('/connector/sync-now', { method: 'POST', body: { tenant_id: tenantId } })

  const adminSyncNow = (tenantId: number, years: string[]) =>
    useAdminApi('/connector/admin-sync-now', { method: 'POST', body: { tenant_id: tenantId, years } })

  const stopSync = (tenantId: number) =>
    useAdminApi('/connector/admin-sync-now', { method: 'POST', body: { tenant_id: tenantId, stop_sync: true } })

  const openSettings = (tenantId: number) =>
    useAdminApi('/connector/open-settings', { method: 'POST', body: { tenant_id: tenantId } })

  const requestLogs = (tenantId: number, logType: string) =>
    useAdminApi('/connector/request-logs', { method: 'POST', body: { tenant_id: tenantId, log_type: logType } })

  const getSyncHistory = (tenantId: number, page = 1, perPage = 10) =>
    useAdminApi(`/connector/sync-history?tenant_id=${tenantId}&page=${page}&per_page=${perPage}`)

  // ── Backup ──────────────────────────────────────────────────────────────
  const requestBackup = (tenantId: number, format: 'csv' | 'json') =>
    useAdminApi('/connector/backup', { method: 'POST', body: { tenant_id: tenantId, format } })

  const getLatestBackup = (tenantId: number) =>
    useAdminApi(`/connector/backup/latest?tenant_id=${tenantId}`)

  async function downloadBackup(tenantId: number, backupId: number) {
    const blob = await useAdminApi(`/connector/backup/${backupId}/download?tenant_id=${tenantId}`, { responseType: 'blob' }) as Blob
    saveBlob(blob, `taxaid_backup_tenant_${tenantId}_${backupId}.zip`)
  }

  async function downloadLogs(requestId: string) {
    const blob = await useAdminApi(`/connector/logs/${requestId}`, { responseType: 'blob' }) as Blob
    saveBlob(blob, `connector_logs_${requestId}.zip`)
  }

  function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    getTenants, setTenantStatus, getTenantUsers,
    getSchedule, setSchedule, syncNow, adminSyncNow, stopSync,
    openSettings, requestLogs, downloadLogs,
    getSyncHistory,
    requestBackup, getLatestBackup, downloadBackup,
  }
}
