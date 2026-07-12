export const useRevenue = () => {
  const loading    = useState<boolean>('revenue_loading',   () => false)
  const error      = useState<string | null>('revenue_error', () => null)
  const customFrom  = useState<string | null>('revenue_custom_from', () => null)
  const customTo    = useState<string | null>('revenue_custom_to',   () => null)
  const rangeOption = useState<string>('revenue_range_option', () => 'Year to Date')

  const breakdownRaw    = useState<any>('revenue_breakdown',     () => null)
  const trendRaw        = useState<any>('revenue_trend',         () => null)
  const topCustomersRaw = useState<any>('revenue_top_customers', () => null)

  const fetchAll = async () => {
    loading.value = true
    error.value   = null
    try {
      // Backend expects 'Custom Dates' but header emits 'Custom Range'
      const backendRangeOption = rangeOption.value === 'Custom Range' ? 'Custom Dates' : rangeOption.value
      const body: Record<string, any> = { range_option: backendRangeOption, include_ledgers: true }
      if (customFrom.value) body.custom_from = customFrom.value
      if (customTo.value)   body.custom_to   = customTo.value

      const [breakdown, trend, topCustomers] = await Promise.all([
        useApi('revenue-analysis/breakdown',       { method: 'POST', body }) as any,
        useApi('revenue-analysis/trend-chart',     { method: 'POST', body }) as any,
        useApi('revenue-analysis/top-10-customers',{ method: 'POST', body }) as any,
      ])

      breakdownRaw.value    = breakdown
      trendRaw.value        = trend
      topCustomersRaw.value = topCustomers
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to fetch revenue data'
    } finally {
      loading.value = false
    }
  }

  // ── Summary (table) ───────────────────────────────────────────────────────
  const summaryData = computed(() => {
    if (!breakdownRaw.value?.data) return []
    return breakdownRaw.value.data.map((item: any) => {
      const achievedPct  = item.budget > 0 ? (item.current_year / item.budget) * 100 : 0
      const varianceSign = item.variance >= 0 ? '+' : ''
      return {
        label:     item.subgroup,
        labelAr:   item.subgroup,
        current:   formatStandardNumber(item.current_year),
        previous:  formatStandardNumber(item.previous_year),
        budget:    formatStandardNumber(item.budget),
        variance:  `${varianceSign}${item.variance_percent}`,
        progress:  Number(achievedPct.toFixed(1)),
        isSummary: item.isTotal,
        children:  (item.children ?? []).map((c: any) => ({
          label:    c.ledger_name,
          labelAr:  c.ledger_name,
          current:  formatStandardNumber(c.current_year),
          previous: formatStandardNumber(c.previous_year),
        })),
      }
    })
  })

  // ── Gauge ─────────────────────────────────────────────────────────────────
  const gaugeData = computed(() => {
    const t = breakdownRaw.value?.charts?.target_achievement
    if (!t) return null
    return {
      target:          t.target_value,
      achieved:        t.current_value,
      previousYearPct: t.previous_percent,
      previousValue:   t.previous_value,
    }
  })

  // ── By-category bar chart ─────────────────────────────────────────────────
  const byCategoryData = computed(() => {
    const chart = breakdownRaw.value?.charts?.revenue_by_category
    if (!chart) return null
    return {
      categories:   chart.categories,
      categoriesAr: chart.categories,
      series: [
        { name: 'Previous Year', nameAr: 'السنة السابقة', data: chart.previous_year.map((v: number) => Number((v / 1_000_000).toFixed(2))) },
        { name: 'Current Year',  nameAr: 'السنة الحالية',  data: chart.current_year.map((v: number) => Number((v / 1_000_000).toFixed(2))) },
      ],
    }
  })

  // ── Trend line chart ──────────────────────────────────────────────────────
  const trendData = computed(() => {
    const apiData: any[] = trendRaw.value?.data ?? []
    if (!apiData.length) return { categories: [], series: [] }
    return {
      categories: apiData.map((item: any) => item.month_short),
      series: [
        { name: 'Previous Year', nameAr: 'السنة السابقة', data: apiData.map((item: any) => Number((item.previous_year / 1_000_000).toFixed(2))) },
        { name: 'Current Year',  nameAr: 'السنة الحالية',  data: apiData.map((item: any) => Number((item.current_year  / 1_000_000).toFixed(2))) },
      ],
    }
  })

  // ── Top-10 customers ─────────────────────────────────────────────────────
  const topCustomersData = computed(() => {
    const res = topCustomersRaw.value
    if (!res?.data?.top_10_ledgers) return { customers: [], cumulative: [] }

    const total = res.data.total_sales_amount
    let runningSum = 0
    const colors = ['#04C18F','#FF886A','#FFB01A','#008FFB','#00E396','#775DD0','#546E7A','#26A69A','#D10CE8','#FF4560']
    const cumulative: number[] = []

    const customers = res.data.top_10_ledgers.map((item: any, index: number) => {
      const valM = Number((item.amount / 1_000_000).toFixed(2))
      runningSum += item.amount
      cumulative.push(Number(((runningSum / total) * 100).toFixed(2)))
      return {
        id:      `C${index + 1}`,
        name:    item.name,
        nameAr:  item.name,
        value:   valM,
        color:   colors[index % colors.length],
      }
    })

    return { customers, cumulative }
  })

  return {
    loading,
    error,
    customFrom,
    customTo,
    rangeOption,
    fetchAll,
    summaryData,
    gaugeData,
    byCategoryData,
    trendData,
    topCustomersData,
  }
}
