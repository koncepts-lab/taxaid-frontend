import { ref, computed } from 'vue'

export interface AdminAppointment {
  id: number
  tenant_id: number
  client_name: string
  title: string | null
  consultant: string
  type: string
  appointment_date: string
  appointment_time: string
  rescheduled_date: string | null
  rescheduled_time: string | null
  rescheduled_datetime: string | null
  status: 'pending' | 'scheduled' | 'rescheduled' | 'extra_hours' | 'cancelled' | 'completed'
  cancelled_by: string | null
  completed_hours: number | null
  session_started_at: string | null
  session_elapsed_seconds: number
  duration: string
  duration_hours: number
  meet_url: string | null
  notes: string | null
}

const _appointments = ref<AdminAppointment[]>([])
const _loading      = ref(false)
const _error        = ref<string | null>(null)
const _search       = ref('')
const _statusFilter = ref('')

export function useAdminAppointments() {
  async function fetchAppointments(): Promise<void> {
    _loading.value = true
    _error.value   = null
    try {
      const params = new URLSearchParams()
      if (_search.value)       params.set('search', _search.value)
      if (_statusFilter.value) params.set('status', _statusFilter.value)
      const qs = params.toString()
      const res: any = await useApi(`/admin/appointments${qs ? '?' + qs : ''}`)
      _appointments.value = res.data ?? []
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Failed to load appointments.'
    } finally {
      _loading.value = false
    }
  }

  async function approveAppointment(id: number, meetUrl: string): Promise<void> {
    await useApi(`/admin/appointments/${id}/approve`, { method: 'PATCH', body: { meet_url: meetUrl } })
    await fetchAppointments()
  }

  async function rescheduleAppointment(id: number, date: string, time: string): Promise<void> {
    await useApi(`/admin/appointments/${id}/reschedule`, {
      method: 'PATCH',
      body: { rescheduled_date: date, rescheduled_time: time },
    })
    await fetchAppointments()
  }

  async function cancelAppointment(id: number): Promise<void> {
    await useApi(`/admin/appointments/${id}/cancel`, { method: 'PATCH' })
    await fetchAppointments()
  }

  async function completeAppointment(id: number): Promise<void> {
    await useApi(`/admin/appointments/${id}/complete`, { method: 'PATCH' })
    await fetchAppointments()
  }

  async function startSession(id: number): Promise<AdminAppointment> {
    const res: any = await useApi(`/admin/appointments/${id}/session/start`, { method: 'POST' })
    await fetchAppointments()
    return res.data
  }

  async function pauseSession(id: number): Promise<AdminAppointment> {
    const res: any = await useApi(`/admin/appointments/${id}/session/pause`, { method: 'POST' })
    await fetchAppointments()
    return res.data
  }

  async function stopSession(id: number): Promise<AdminAppointment> {
    const res: any = await useApi(`/admin/appointments/${id}/session/stop`, { method: 'POST' })
    await fetchAppointments()
    return res.data
  }

  return {
    appointments:       _appointments,
    loading:            _loading,
    error:              _error,
    search:             _search,
    statusFilter:       _statusFilter,
    fetchAppointments,
    approveAppointment,
    rescheduleAppointment,
    cancelAppointment,
    completeAppointment,
    startSession,
    pauseSession,
    stopSession,
  }
}
