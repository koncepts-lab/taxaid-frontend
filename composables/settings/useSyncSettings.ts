// Tenant-user side of Settings → Sync & Data Management.
// Backend group: /user/sync-settings/* — tenant is always resolved from the
// login token, so no tenant_id is ever sent from here.

export interface SyncStatus {
  tenant_id: number
  sync_time: string | null
  last_sync_at: string | null
  last_status: string
  last_status_at: string | null
  last_status_reason: string | null
  connector_last_seen_at: string | null
  connector_online: boolean
  alert_active: boolean
  frequency: string // static "daily" for now
}

export interface SyncHistoryRow {
  id: number
  company_name: string | null
  financial_year: string | null
  period: number | null
  range_from: string | null
  range_to: string | null
  rows_added: number
  rows_changed: number
  rows_removed: number
  created_at: string
  status: string
}

export interface BackupInfo {
  id: number
  tenant_id: number
  format: 'csv' | 'json'
  status: 'queued' | 'processing' | 'ready' | 'failed'
  file_size: number | null
  error: string | null
  expires_at: string | null
  created_at: string
}

export function useSyncSettings() {
  const status = ref<SyncStatus | null>(null)
  const history = ref<SyncHistoryRow[]>([])
  const backup = ref<BackupInfo | null>(null)

  const loading = ref(false)
  const syncing = ref(false)
  const backupBusy = ref(false)
  const error = ref<string | null>(null)

  let pollTimer: ReturnType<typeof setTimeout> | null = null

  const fetchStatus = async () => {
    try {
      status.value = await useApi('/user/sync-settings') as SyncStatus
    } catch (e: any) {
      if (e?.status !== 404) error.value = e?.data?.message ?? 'Failed to load sync settings.'
      status.value = null
    }
  }

  const fetchHistory = async (perPage = 20) => {
    try {
      const res: any = await useApi(`/user/sync-settings/history?per_page=${perPage}`)
      history.value = res.data ?? []
    } catch {
      history.value = []
    }
  }

  const load = async () => {
    loading.value = true
    error.value = null
    await Promise.all([fetchStatus(), fetchHistory(), fetchLatestBackup()])
    loading.value = false
  }

  const syncNow = async () => {
    syncing.value = true
    error.value = null
    try {
      const res: any = await useApi('/user/sync-settings/sync-now', { method: 'POST' })
      return res
    } catch (e: any) {
      error.value = e?.data?.error ?? e?.data?.message ?? 'Failed to trigger sync.'
      throw e
    } finally {
      syncing.value = false
    }
  }

  const fetchLatestBackup = async () => {
    try {
      const res: any = await useApi('/user/sync-settings/backup/latest')
      backup.value = res.backup ?? null
    } catch {
      backup.value = null
    }
  }

  // Request a backup and poll until it's ready, then trigger the download.
  const requestBackup = async (format: 'csv' | 'json') => {
    backupBusy.value = true
    error.value = null
    try {
      const res: any = await useApi('/user/sync-settings/backup', {
        method: 'POST',
        body: { format },
      })
      backup.value = res.backup
      pollBackup()
    } catch (e: any) {
      if (e?.status === 409 && e?.data?.backup) {
        // One already in progress — just start polling it
        backup.value = e.data.backup
        pollBackup()
      } else {
        backupBusy.value = false
        error.value = e?.data?.message ?? 'Failed to request backup.'
      }
    }
  }

  const pollBackup = () => {
    if (pollTimer) clearTimeout(pollTimer)
    pollTimer = setTimeout(async () => {
      await fetchLatestBackup()
      const s = backup.value?.status
      if (s === 'queued' || s === 'processing') {
        pollBackup()
      } else {
        backupBusy.value = false
        if (s === 'ready' && backup.value) downloadBackup(backup.value.id)
        if (s === 'failed') error.value = 'Backup failed. Please try again.'
      }
    }, 4000)
  }

  // Authenticated download: fetch as blob, save via object URL.
  const downloadBackup = async (id: number) => {
    const blob = await useApi(`/user/sync-settings/backup/${id}/download`, { responseType: 'blob' }) as Blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `taxaid_backup_${id}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stopPolling = () => {
    if (pollTimer) clearTimeout(pollTimer)
    pollTimer = null
  }

  return {
    status, history, backup,
    loading, syncing, backupBusy, error,
    load, fetchStatus, fetchHistory, syncNow,
    requestBackup, fetchLatestBackup, downloadBackup, stopPolling,
  }
}
