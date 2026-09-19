// Client Management (Super Admin) — tenant list + per-tenant connector
// controls. All calls go through useAdminApi (admin_token).

export interface TenantRow {
  id: number
  license_id: string
  status: string
  data_mode_ar: string | null
  data_mode_ap: string | null
  data_mode_sales_forecast: string | null
  data_mode_cost_center: string | null
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

  const getTenantUsers = (tenantId: number, params: { status?: string; role?: string; search?: string } = {}) => {
    const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    return useAdminApi(`/admin/tenants/${tenantId}/users`, { query })
  }

  // Suspend requires the acting admin's own password; making live does not.
  const setTenantUserStatus = (tenantId: number, userId: number, status: 'live' | 'suspended', password?: string) =>
    useAdminApi(`/admin/tenants/${tenantId}/users/${userId}/status`, { method: 'PATCH', body: { status, ...(password ? { password } : {}) } })

  const updateTenantUser = (tenantId: number, userId: number, payload: { role?: string; is_primary?: boolean }) =>
    useAdminApi(`/admin/tenants/${tenantId}/users/${userId}`, { method: 'PATCH', body: payload })

  const addTenantUser = (tenantId: number, payload: Record<string, any>) =>
    useAdminApi(`/admin/tenants/${tenantId}/users`, { method: 'POST', body: payload })

  const getRolesSettings = (tenantId: number, params: { page?: number; per_page?: number; search?: string } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.per_page) query.set('per_page', String(params.per_page))
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return useAdminApi(`/admin/tenants/${tenantId}/roles-settings${qs ? `?${qs}` : ''}`)
  }

  const setRolesToggles = (tenantId: number, payload: { use_custom_settings?: boolean; master_can_edit?: boolean }) =>
    useAdminApi(`/admin/tenants/${tenantId}/roles-settings/toggles`, { method: 'PUT', body: payload })

  const setRolesGroup = (tenantId: number, group: string, payload: Record<string, any>) =>
    useAdminApi(`/admin/tenants/${tenantId}/roles-settings/groups/${group}`, { method: 'PUT', body: payload })

  const resetRolesGroup = (tenantId: number, group: string) =>
    useAdminApi(`/admin/tenants/${tenantId}/roles-settings/groups/${group}`, { method: 'DELETE' })

  // ── Connector controls (admin passes tenant_id) ─────────────────────────
  const getSchedule = (tenantId: number) =>
    useAdminApi(`/connector/schedule?tenant_id=${tenantId}`)

  const setSchedule = (tenantId: number, data: { years: string[]; enabled: boolean }) =>
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

  const getCompanyPeriod = (tenantId: number) =>
    useAdminApi(`/connector/company-period?tenant_id=${tenantId}`)

  const updateCompanyPeriod = (tenantId: number, data: { from_date?: string; to_date?: string; report_schedules?: any }) =>
    useAdminApi('/connector/company-period', { method: 'POST', body: { tenant_id: tenantId, ...data } })

  // ── Backup ──────────────────────────────────────────────────────────────
  const requestBackup = (tenantId: number, format: 'csv' | 'json') =>
    useAdminApi('/connector/backup', { method: 'POST', body: { tenant_id: tenantId, format } })

  const getLatestBackup = (tenantId: number) =>
    useAdminApi(`/connector/backup/latest?tenant_id=${tenantId}`)

  async function downloadBackup(tenantId: number, backupId: number) {
    const blob = await useAdminApi(`/connector/backup/${backupId}/download?tenant_id=${tenantId}`, { responseType: 'blob' }) as Blob
    saveBlob(blob, `taxaid_backup_tenant_${tenantId}_${backupId}.zip`)
  }

  async function downloadLogs(tenantId: number, requestId: string) {
    const blob = await useAdminApi(`/connector/logs/${requestId}?tenant_id=${tenantId}`, { responseType: 'blob' }) as Blob
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
    getTenants, setTenantStatus, getTenantUsers, setTenantUserStatus,
    updateTenantUser, addTenantUser, getRolesSettings, setRolesToggles, setRolesGroup, resetRolesGroup,
    getSchedule, setSchedule, syncNow, adminSyncNow, stopSync,
    openSettings, requestLogs, downloadLogs,
    getSyncHistory,
    getCompanyPeriod, updateCompanyPeriod,
    requestBackup, getLatestBackup, downloadBackup,
  }
}
