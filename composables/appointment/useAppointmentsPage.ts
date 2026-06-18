import { ref, computed } from 'vue'
import { format, subMonths, addMonths, parseISO, isBefore } from 'date-fns'

interface Appointment {
  id: number
  title: string | null
  consultant: string
  type: string
  appointment_date: string
  appointment_time: string
  duration: string
  duration_hours: number
  status: 'pending' | 'scheduled' | 'rescheduled' | 'extra_hours' | 'cancelled' | 'completed'
  meet_url: string | null
  notes: string | null
  created_at: string
}

interface MonthlyUsageStats {
  total_hours_allocated: number
  total_hours_used: number
  remaining_hours: number
  extra_hours_used: number
  next_review: { date: string; time: string } | null
}

// ── Module-level state — shared across every component that calls this composable ─
const _cache            = ref<Appointment[]>([])
const _cachedFrom       = ref<string | null>(null)
const _cachedTo         = ref<string | null>(null)
const _searchQuery      = ref('')
const _statusFilter     = ref('')
const _monthlyUsageStats = ref<MonthlyUsageStats>({
  total_hours_allocated: 20,
  total_hours_used: 0,
  remaining_hours: 20,
  extra_hours_used: 0,
  next_review: null,
})
const _monthlyReviews = ref<any[]>([])

const _loading = ref(false)

// Derived module-level computeds — all component instances read the same values
const _hasAnyAppointments = computed(() => _cache.value.length > 0)

const _appointments = computed<Appointment[]>(() => {
  // Merge regular appointments with monthly reviews (shaped identically by backend)
  const merged = [..._cache.value, ..._monthlyReviews.value]
    .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date))

  let list = merged
  if (_statusFilter.value) {
    list = list.filter(a => a.status === _statusFilter.value)
  }
  if (_searchQuery.value.trim()) {
    const q = _searchQuery.value.toLowerCase()
    list = list.filter(a =>
      a.consultant?.toLowerCase().includes(q) ||
      a.type?.toLowerCase().includes(q) ||
      a.notes?.toLowerCase().includes(q) ||
      a.title?.toLowerCase().includes(q)
    )
  }
  return list
})

const _stats = computed(() => [
  {
    label:    'Total Hours (This Month)',
    labelAr:  'إجمالي الساعات (هذا الشهر)',
    value:    `${_monthlyUsageStats.value.total_hours_allocated} hrs`,
    icon:     '/images/icons/Hours.svg',
  },
  {
    label:      'Hours Used',
    labelAr:    'الساعات المستخدمة',
    value:      `${_monthlyUsageStats.value.total_hours_used} hrs`,
    sublabel:   'Completed meetings',
    sublabelAr: 'الاجتماعات المكتملة',
    icon:       '/images/icons/Hours-Used.svg',
  },
  {
    label:      'Hours Remaining',
    labelAr:    'الساعات المتبقية',
    value:      `${_monthlyUsageStats.value.remaining_hours} hrs`,
    sublabel:   'Balance Available',
    sublabelAr: 'الرصيد المتاح',
    icon:       '/images/icons/Hours-Remaining.svg',
  },
  {
    label:      'Next Review',
    labelAr:    'المراجعة القادمة',
    value:      _monthlyUsageStats.value.next_review
      ? `${_monthlyUsageStats.value.next_review.date}, ${_monthlyUsageStats.value.next_review.time}`
      : '—',
    sublabel:   'Upcoming',
    sublabelAr: 'قادم',
    icon:       '/images/icons/Next-Review.svg',
  },
])

// Static config refs — callers use .value consistently
const _legend = ref([
  { label: 'Pending',     labelAr: 'قيد الانتظار',  color: '#D97706' },
  { label: 'Scheduled',   labelAr: 'مجدول',          color: '#3B82F6' },
  { label: 'Rescheduled', labelAr: 'معاد جدولته',   color: '#F97316' },
  { label: 'Extra Hours', labelAr: 'ساعات إضافية',  color: '#F97316' },
  { label: 'Cancelled',   labelAr: 'ملغي',            color: '#991B1B' },
  { label: 'Completed',   labelAr: 'مكتمل',           color: '#018E71' },
])

const _statusStyles = ref<Record<string, { bg: string; text: string }>>({
  completed:   { bg: '#D6F5ED', text: '#018E71' },
  pending:     { bg: '#FFF4E5', text: '#D97706' },
  scheduled:   { bg: '#E5F1FF', text: '#3B82F6' },
  rescheduled: { bg: '#FFF3E0', text: '#F97316' },
  extra_hours: { bg: '#FFF0E5', text: '#F97316' },
  cancelled:   { bg: '#FFE8E8', text: '#EF4444' },
})

const _typeStyles = ref<Record<string, { bg: string; text: string }>>({
  'Implementation Feedback': { bg: '#E5F1FF', text: '#3B82F6' },
  'Initial Usability':       { bg: '#FFF4E5', text: '#D97706' },
  'Feature Suggestion':      { bg: '#D6F5ED', text: '#018E71' },
})

const _columns   = ref(['Date', 'Consultant', 'Type', 'Duration', 'Status', 'Action'])
const _columnsAr = ref(['التاريخ', 'المستشار', 'النوع', 'المدة', 'الحالة', 'إجراء'])

const BANNER = {
  text:   'You can request up to 3 extra hours per month, subject to consultant availability.',
  textAr: 'يمكنك طلب ما يصل إلى 3 ساعات إضافية شهريًا، وفقًا لتوافر المستشار.',
}

export function useAppointmentsPage() {
  const statsLoading = ref(false)
  const error        = ref<string | null>(null)

  // Capture Nuxt composables synchronously during setup so the async functions
  // below can call $fetch without touching Nuxt composables after an await
  // (Vue component instance is null after any await — Nuxt composables crash).
  const runtimeConfig = useRuntimeConfig()
  const authToken     = useCookie('auth_token')

  const apiFetch = (url: string, options: any = {}) => {
    const method     = (options.method || 'GET').toUpperCase()
    const isFormData = options.body instanceof FormData
    return $fetch(url, {
      baseURL: runtimeConfig.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(method !== 'GET' && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(authToken.value ? { 'Authorization': `Bearer ${authToken.value}` } : {}),
        ...options.headers,
      },
    })
  }

  async function fetchScheduledReviews(): Promise<void> {
    try {
      const res = await apiFetch('/monthly-reviews')
      _monthlyReviews.value = (res as any).data ?? []
    } catch {
      // non-fatal
    }
  }

  async function fetchAppointments(from: string, to: string): Promise<void> {
    _loading.value = true
    error.value   = null
    try {
      const res = await apiFetch(`/appointments?from=${from}&to=${to}`)
      const incoming: Appointment[] = (res as any).data ?? []

      const existingIds = new Set(_cache.value.map(a => a.id))
      const newItems    = incoming.filter(a => !existingIds.has(a.id))
      _cache.value = [..._cache.value, ...newItems].sort((a, b) =>
        a.appointment_date.localeCompare(b.appointment_date)
      )

      if (!_cachedFrom.value || isBefore(parseISO(from), parseISO(_cachedFrom.value))) {
        _cachedFrom.value = from
      }
      if (!_cachedTo.value || isBefore(parseISO(_cachedTo.value), parseISO(to))) {
        _cachedTo.value = to
      }
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load appointments.'
    } finally {
      _loading.value = false
    }
  }

  async function fetchStats(): Promise<void> {
    statsLoading.value = true
    try {
      const res = await apiFetch('/appointments/stats/monthly-usage')
      _monthlyUsageStats.value = (res as any).data
    } catch {
      // non-fatal — UI shows stale stats rather than breaking
    } finally {
      statsLoading.value = false
    }
  }

  async function forceRefresh(): Promise<void> {
    _loading.value     = true   // prevent empty-state flash while cache is cleared
    _cache.value      = []
    _cachedFrom.value = null
    _cachedTo.value   = null
    const from = format(subMonths(new Date(), 3), 'yyyy-MM-dd')
    const to   = format(addMonths(new Date(), 3), 'yyyy-MM-dd')
    await Promise.all([fetchAppointments(from, to), fetchStats(), fetchScheduledReviews()])
  }

  async function extendCacheIfNeeded(targetDate: Date): Promise<void> {
    const targetStr = format(targetDate, 'yyyy-MM-dd')
    if (_cachedFrom.value && isBefore(parseISO(targetStr), parseISO(_cachedFrom.value))) {
      const newFrom = format(subMonths(targetDate, 3), 'yyyy-MM-dd')
      await fetchAppointments(newFrom, _cachedFrom.value)
    } else if (_cachedTo.value && isBefore(parseISO(_cachedTo.value), parseISO(targetStr))) {
      const newTo = format(addMonths(targetDate, 3), 'yyyy-MM-dd')
      await fetchAppointments(_cachedTo.value, newTo)
    }
  }

  async function createAppointment(data: Record<string, unknown>): Promise<Appointment> {
    const res     = await apiFetch('/appointments', { method: 'POST', body: data })
    const created = (res as any).data as Appointment
    _cache.value  = [..._cache.value, created].sort((a, b) =>
      a.appointment_date.localeCompare(b.appointment_date)
    )
    await fetchStats()
    return created
  }

  async function cancelAppointment(id: number): Promise<void> {
    await apiFetch(`/appointments/${id}/cancel`, { method: 'PATCH' })
    _cache.value = _cache.value.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    )
    await fetchStats()
  }

  onMounted(async () => {
    if (_cache.value.length === 0) {
      const from = format(subMonths(new Date(), 3), 'yyyy-MM-dd')
      const to   = format(addMonths(new Date(), 3), 'yyyy-MM-dd')
      await Promise.all([fetchAppointments(from, to), fetchStats(), fetchScheduledReviews()])
    } else {
      await Promise.all([fetchStats(), fetchScheduledReviews()])
    }
  })

  return {
    appointments:       _appointments,
    hasAnyAppointments: _hasAnyAppointments,
    monthlyUsageStats:  _monthlyUsageStats,
    stats:              _stats,
    loading:       _loading,
    statsLoading,
    error,
    searchQuery:   _searchQuery,
    statusFilter:  _statusFilter,
    banner:        BANNER,
    legend:        _legend,
    statusStyles:  _statusStyles,
    typeStyles:    _typeStyles,
    columns:       _columns,
    columnsAr:     _columnsAr,
    fetchAppointments,
    fetchStats,
    forceRefresh,
    extendCacheIfNeeded,
    createAppointment,
    cancelAppointment,
  }
}
