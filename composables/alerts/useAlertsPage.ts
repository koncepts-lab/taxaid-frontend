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
    get: () => (route.query.status as string) || 'pending',
    set: (val: string) => router.replace({ query: { ...route.query, status: val } }),
  })

  const categories = ref([
    { id: 'pending',  label: 'Pending Actions', labelAr: 'قيد الانتظار', color: '#B78700', wheel: '/images/pending.webp',    textColor: '#FFBC00', title: '(Required Action)',  titleAr: 'قيد الانتظار' },
    { id: 'resolved', label: 'Resolved',        labelAr: 'تم الحل',       color: '#10612A', wheel: '/images/resolved.webp',  textColor: '#29B356', title: '(Resolved Alerts)',  titleAr: 'تم الحل'    },
    { id: 'ignored',  label: 'Ignored',         labelAr: 'تم التجاهل',    color: '#666666', wheel: '/images/ignored.webp',   textColor: '#D0D0D0', title: '(Dismissed Alerts)', titleAr: 'تم التجاهل' },
    { id: 'all',      label: 'All Alerts',     labelAr: 'الكل',          color: '#009276', wheel: '/images/all-alerts.webp', textColor: '#00FFBC', title: '(Last 30 days)',     titleAr: 'الكل'       },
  ])

  const statusMap = ref({
    pending:  'Awaiting Action',
    resolved: 'Resolved',
    ignored:  'Ignored',
  })

  const currentDate   = ref<string>(localIsoDate())
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

  const CACHE_TTL_MS = 60_000
  const tabsCache     = ref<Record<string, Record<number, { data: any[]; meta: any }>>>({})
  const cacheFetchedAt = ref(0)

  const isCacheFresh = () => Date.now() - cacheFetchedAt.value < CACHE_TTL_MS

  const applyCachedPage = (status: string, page: number): boolean => {
    const entry = tabsCache.value[status]?.[page]
    if (!entry) return false
    alerts.value = entry.data
    meta.value   = { ...meta.value, ...entry.meta, counts: meta.value.counts }
    return true
  }

  const buildBaseParams = () => {
    const params: Record<string, any> = {
      period:   currentPeriod.value,
      per_page: 10,
      lang:     currentLang.value === 'ar' ? 'ar' : 'en',
    }
    if (currentPeriod.value !== 'month') params.date = currentDate.value
    return params
  }

  const loadBundle = async () => {
    loading.value = true
    error.value   = null
    try {
      const params = { ...buildBaseParams(), status: 'pending,resolved,ignored,all' }
      const result = await useApi(`/alerts?${new URLSearchParams(params).toString()}`) as any

      const fresh: Record<string, Record<number, { data: any[]; meta: any }>> = {}
      for (const [status, tab] of Object.entries<any>(result?.tabs ?? {})) {
        fresh[status] = { 1: { data: tab.data ?? [], meta: tab.meta } }
      }
      tabsCache.value    = fresh
      cacheFetchedAt.value = Date.now()
      meta.value.counts  = result?.counts ?? meta.value.counts

      if (!applyCachedPage(activeStatus.value, 1)) {
        alerts.value = []
      }
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load alerts.'
    } finally {
      loading.value = false
    }
  }

  const loadPage = async (status: string, page: number) => {
    loading.value = true
    error.value   = null
    try {
      const params = { ...buildBaseParams(), status, page }
      const result = await useApi(`/alerts?${new URLSearchParams(params).toString()}`) as any

      tabsCache.value[status] = { ...(tabsCache.value[status] || {}), [page]: { data: result?.data ?? [], meta: result?.meta } }
      if (result?.meta?.counts) meta.value.counts = result.meta.counts
      applyCachedPage(status, page)
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load alerts.'
    } finally {
      loading.value = false
    }
  }

  const fetchAlerts = async (date?: string | null, period?: string | null, page: number = 1) => {
    const dateOrPeriodChanged = !!date || !!period
    if (date)   currentDate.value   = date
    if (period) currentPeriod.value = period

    if (dateOrPeriodChanged) {
      await loadBundle()
      return
    }

    if (page > 1) {
      if (applyCachedPage(activeStatus.value, page) && isCacheFresh()) return
      await loadPage(activeStatus.value, page)
      return
    }

    if (applyCachedPage(activeStatus.value, 1) && isCacheFresh()) return
    await loadBundle()
  }

  const loadMore = async () => {
    if (meta.value.current_page >= meta.value.last_page) return
    const nextPage = meta.value.current_page + 1
    loadingMore.value = true
    try {
      if (applyCachedPage(activeStatus.value, nextPage) && isCacheFresh()) return
      const params = { ...buildBaseParams(), status: activeStatus.value, page: nextPage }
      const result  = await useApi(`/alerts?${new URLSearchParams(params).toString()}`) as any
      tabsCache.value[activeStatus.value] = { ...(tabsCache.value[activeStatus.value] || {}), [nextPage]: { data: result?.data ?? [], meta: result?.meta } }
      alerts.value = [...alerts.value, ...(result?.data ?? [])]
      if (result?.meta) meta.value = { ...meta.value, ...result.meta }
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
    tabsCache.value = {}
    await loadBundle()
  }

  watch(activeStatus, () => fetchAlerts())
  // Rows are server-localized, so a language switch needs a refetch
  watch(currentLang, () => loadBundle())
  onMounted(() => loadBundle())

  return {
    alerts, loading, loadingMore, error, meta,
    activeStatus, categories, enrichedCategories, statusMap,
    fetchAlerts, loadMore, recordAction,
  }
}
