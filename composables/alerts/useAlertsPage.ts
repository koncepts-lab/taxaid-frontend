export const useAlertsPage = () => {
  const route  = useRoute()
  const router = useRouter()
  const currentLang = useState('currentLang', () => 'en')

  const alerts      = ref<any[]>([])
  const loading     = ref(false)
  const loadingMore = ref(false)
  const error       = ref<string | null>(null)
  const meta        = ref({
    current_page: 1,
    last_page:    1,
    total:        0,
    per_page:     10,
    counts:       { all: 0, pending: 0, resolved: 0, ignored: 0 } as Record<string, number>,
  })

  const activeStatus = computed({
    get: () => (route.query.status as string) || 'all',
    set: (val: string) => router.replace({ query: { ...route.query, status: val } }),
  })

  const categories = ref([
    { id: 'all',      label: 'All Alerts',     labelAr: 'الكل',          color: '#009276', wheel: '/images/all-alerts.webp', textColor: '#00FFBC', title: '(Last 30 days)',     titleAr: 'الكل'       },
    { id: 'pending',  label: 'Pending Actions', labelAr: 'قيد الانتظار', color: '#B78700', wheel: '/images/pending.webp',    textColor: '#FFBC00', title: '(Required Action)',  titleAr: 'قيد الانتظار' },
    { id: 'resolved', label: 'Resolved',        labelAr: 'تم الحل',       color: '#10612A', wheel: '/images/resolved.webp',  textColor: '#29B356', title: '(Resolved Alerts)',  titleAr: 'تم الحل'    },
    { id: 'ignored',  label: 'Ignored',         labelAr: 'تم التجاهل',    color: '#666666', wheel: '/images/ignored.webp',   textColor: '#D0D0D0', title: '(Dismissed Alerts)', titleAr: 'تم التجاهل' },
  ])

  const statusMap = ref({
    pending:  'Awaiting Action',
    resolved: 'Resolved',
    ignored:  'Ignored',
  })

  const currentDate   = ref<string>(new Date().toISOString().split('T')[0])
  const currentPeriod = ref<string>('daily')

  // Dynamic subtitle for the wheel based on selected period
  const periodTitle = computed(() => {
    if (currentPeriod.value === 'month') return '(Last Month)'
    if (currentPeriod.value === 'custom') {
      const [y, m, d] = currentDate.value.split('-')
      const date = new Date(+y, +m - 1, +d)
      return `(${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`
    }
    return '(Today)'
  })

  // Enrich categories with live counts and dynamic period title
  const enrichedCategories = computed(() =>
    categories.value.map(cat => ({
      ...cat,
      count: meta.value.counts[cat.id] ?? 0,
      title: cat.id === 'all' ? periodTitle.value : cat.title,
    }))
  )

  const buildParams = (page = 1) => {
    const params: Record<string, any> = {
      status:   activeStatus.value,
      period:   currentPeriod.value,
      page,
      per_page: 10,
      // Backend returns a single-language payload: lang=ar or en (default en)
      lang:     currentLang.value === 'ar' ? 'ar' : 'en',
    }
    if (currentPeriod.value !== 'month') params.date = currentDate.value
    return new URLSearchParams(params).toString()
  }

  const fetchAlerts = async (date?: string | null, period?: string | null) => {
    if (date)   currentDate.value   = date
    if (period) currentPeriod.value = period
    loading.value = true
    error.value   = null
    alerts.value  = []
    try {
      const result = await useApi(`/alerts?${buildParams(1)}`) as any
      alerts.value = result?.data ?? []
      if (result?.meta) meta.value = result.meta
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load alerts.'
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (meta.value.current_page >= meta.value.last_page) return
    loadingMore.value = true
    try {
      const result = await useApi(`/alerts?${buildParams(meta.value.current_page + 1)}`) as any
      alerts.value = [...alerts.value, ...(result?.data ?? [])]
      if (result?.meta) meta.value = result.meta
    } finally {
      loadingMore.value = false
    }
  }

  const recordAction = async (
    id: number,
    type: 'resolve' | 'ignore',
    action_by?: string,
    action_notes?: string
  ) => {
    await useApi(`/alerts/${id}/action`, {
      method: 'POST',
      body:   { type, action_by, action_notes },
    })
    await fetchAlerts()
  }

  watch(activeStatus, () => fetchAlerts())
  // Rows are server-localized, so a language switch needs a refetch
  watch(currentLang, () => fetchAlerts())
  onMounted(() => fetchAlerts())

  return {
    alerts, loading, loadingMore, error, meta,
    activeStatus, categories, enrichedCategories, statusMap,
    fetchAlerts, loadMore, recordAction,
  }
}
