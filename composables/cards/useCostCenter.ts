export const useCostCenter = () => {
  const loading    = useState<boolean>('cc_loading',  () => false)
  const error      = useState<string | null>('cc_error', () => null)
  const activeDate = useState<string>('cc_date',      () => '31-12-2025')

  const chartRaw = useState<any>('cc_chart_raw', () => null)

  const fetchChart = async () => {
    loading.value = true
    error.value   = null
    try {
      const res = await useApi(`cost-center/revenue-by-totalexpenses?date=${activeDate.value}`) as any
      chartRaw.value = res?.data ?? null
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to fetch cost center data'
    } finally {
      loading.value = false
    }
  }

  // ── Overall Revenue vs Cost chart ─────────────────────────────────────────
  const overallRevenueVsCost = computed(() => {
    const data: any[] = chartRaw.value ?? []
    if (!data.length) return null

    const letters = ['A','B','C','D','E','F','G','H','I','J']
    const mappingFullNames: Record<string, string> = {}

    data.forEach((item, i) => {
      if (i < letters.length) mappingFullNames[letters[i]] = item.project_name
    })

    return {
      categories:       data.map((_, i) => letters[i] ?? String(i + 1)),
      mappingFullNames,
      revenueData:      data.map(item => parseFloat((item.revenue      / 1_000_000).toFixed(2))),
      costData:         data.map(item => parseFloat((item.total_expenses / 1_000_000).toFixed(2))),
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
