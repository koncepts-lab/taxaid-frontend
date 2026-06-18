import { ref } from 'vue'

export interface WorkSession {
  id: number
  admin_user_id: number
  date: string
  checked_in_at: string | null
  first_clocked_in_at: string | null
  checked_out_at: string | null
  total_worked_seconds: number
}

export interface DailyStats {
  session_duration_minutes: number
  active_clients_count: number
  log_count_fixed: number
  log_count_review: number
  log_count_internal: number
  total_logged_minutes: number
}

export interface ActivityLogEntry {
  id: number
  time_in: string
  time_out: string | null
  appointment_type: 'client_fixed' | 'client_review' | 'internal'
  tenant_id: number | null
  client_name: string
}

export interface MonthlyStats {
  fixed_minutes: number
  review_minutes: number
  internal_minutes: number
  fixed_formatted: string
  review_formatted: string
  internal_formatted: string
}

export interface ActivityStats {
  active_clients_count: number
  avg_productive_hours: string
}

export interface ActivityClient {
  id: number
  name: string
}

// Module-level singleton state
const _session      = ref<WorkSession | null>(null)
const _clients      = ref<ActivityClient[]>([])
const _dailyStats   = ref<DailyStats | null>(null)
const _todayLogs    = ref<ActivityLogEntry[]>([])
const _monthlyStats = ref<MonthlyStats | null>(null)
const _stats        = ref<ActivityStats | null>(null)
const _loading      = ref(false)
const _error        = ref<string | null>(null)

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    client_fixed:    'Client Fixed',
    client_review:   'Client Review',
    internal:        'Internal',
    training:        'Training',
    client_analysis: 'Client Analysis',
  }
  return map[type] ?? type
}

function mapLogs(raw: ActivityLogEntry[]) {
  return raw.map(e => ({
    id:         e.id,
    timeIn:     e.time_in,
    timeOut:    e.time_out ?? '—',
    type:       typeLabel(e.appointment_type),
    clientId:   e.tenant_id ? String(e.tenant_id) : '—',
    clientName: e.client_name,
  }))
}

export function useActivityTracking() {
  async function fetchTodaySession(): Promise<void> {
    _loading.value = true
    _error.value   = null
    try {
      const res: any = await useApi('/admin/activity/session/today')
      _session.value    = res.data?.session ?? null
      _dailyStats.value = res.data?.stats ?? null
      _todayLogs.value  = mapLogs(res.data?.logs ?? [])
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Failed to load today session.'
    } finally {
      _loading.value = false
    }
  }

  async function fetchDailyLogs(date: string): Promise<{ session: WorkSession | null; stats: DailyStats | null; logs: any[] }> {
    const res: any = await useApi(`/admin/activity/daily?date=${date}`)
    return {
      session: res.data?.session ?? null,
      stats:   res.data?.stats ?? null,
      logs:    mapLogs(res.data?.logs ?? []),
    }
  }

  async function fetchMonthlyStats(month: string): Promise<void> {
    try {
      const res: any = await useApi(`/admin/activity/monthly?month=${month}`)
      _monthlyStats.value = res.data ?? null
    } catch { /* non-fatal */ }
  }

  async function fetchStats(): Promise<void> {
    try {
      const res: any = await useApi('/admin/activity/stats')
      _stats.value = res.data ?? null
    } catch { /* non-fatal */ }
  }

  async function fetchClients(): Promise<void> {
    try {
      const res: any = await useApi('/admin/activity/clients')
      _clients.value = res.data ?? []
    } catch { /* non-fatal */ }
  }

  async function clockIn(): Promise<void> {
    _loading.value = true
    _error.value   = null
    try {
      await useApi('/admin/activity/clockin', { method: 'POST' })
      await fetchTodaySession()
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Clock-in failed.'
    } finally {
      _loading.value = false
    }
  }

  async function clockOut(): Promise<void> {
    _loading.value = true
    _error.value   = null
    try {
      await useApi('/admin/activity/clockout', { method: 'POST' })
      await fetchTodaySession()
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Clock-out failed.'
    } finally {
      _loading.value = false
    }
  }

  async function logEntry(payload: object): Promise<void> {
    await useApi('/admin/activity/logs', { method: 'POST', body: payload })
    await fetchTodaySession()
  }

  async function checkOutEntry(id: number, time_out: string): Promise<void> {
    await useApi(`/admin/activity/logs/${id}/checkout`, { method: 'PATCH', body: { time_out } })
    await fetchTodaySession()
  }

  return {
    session:      _session,
    clients:      _clients,
    dailyStats:   _dailyStats,
    todayLogs:    _todayLogs,
    monthlyStats: _monthlyStats,
    stats:        _stats,
    loading:      _loading,
    error:        _error,
    fetchTodaySession,
    fetchClients,
    fetchDailyLogs,
    fetchMonthlyStats,
    fetchStats,
    clockIn,
    clockOut,
    logEntry,
    checkOutEntry,
  }
}
