export const useCostCenterChart = () => {
  const loading    = useState<boolean>('cc_loading',  () => false)
  const error      = useState<string | null>('cc_error', () => null)
  const activeDate = useState<string>('cc_date',      () => '')

  const chartRaw = useState<any>('cc_chart_raw', () => null)

  const fetchChart = async (clearCache = false) => {
    loading.value = true
    error.value   = null
    try {
      // Reload button passes clearCache=true — per-key cache wipe, all param variants.
      const qs: string[] = []
      if (activeDate.value) qs.push(`date=${activeDate.value}`)
      if (clearCache) qs.push(`clear_cache=${clearCache === 'all' ? 'all' : 'true'}`)
      const path = qs.length ? `cost-center/revenue-by-totalexpenses?${qs.join('&')}` : 'cost-center/revenue-by-totalexpenses'
      const res = await useApi(path) as any
      useState('cardPeriod').value = res?.period ?? null
      useState('cardToday').value = res?.today ?? null
      if (!activeDate.value && res?.as_of_date) {
        const [y, m, d] = String(res.as_of_date).split('-')
        activeDate.value = `${d}-${m}-${y}`
      }
      chartRaw.value = res?.data ?? null
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to fetch cost center data'
    } finally {
      loading.value = false
    }
  }

  // ── Overall Revenue vs Cost chart ─────────────────────────────────────────
  // Full list, sorted by the backend — the component pages this 8-at-a-time
  // and assigns A-H letters per page.
  const overallRevenueVsCost = computed(() => {
    const data: any[] = chartRaw.value ?? []
    if (!data.length) return null

    return {
      projectNames:     data.map(item => item.project_name),
      revenueRaw:       data.map(item => Number(item.revenue ?? 0)),
      costRaw:          data.map(item => Number(item.total_expenses ?? 0)),
    }
  })

  return {
    loading,
    error,
    activeDate,
    fetchChart,
    overallRevenueVsCost,
  }
}
