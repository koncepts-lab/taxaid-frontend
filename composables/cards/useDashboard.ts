/**
 * useDashboard
 * Single composable backing the 8 main-dashboard cards (`components/dashboard/*.vue`).
 * Fetches GET /dashboard once and exposes the same key names useMainDashboard()
 * used to expose from mock data, now computed from the real payload — so each
 * card's template/script needs only a one-line data-source swap.
 */

const findRow = (rows: any[], pattern: RegExp) =>
  (rows ?? []).find((r: any) => pattern.test(r?.subgroup ?? r?.label ?? '')) ?? null

export function useDashboard() {
  const raw = useState<any>('dashboard_raw', () => null)
  const loading = useState<boolean>('dashboard_loading', () => false)
  const error = useState<string | null>('dashboard_error', () => null)
  const date = useState<string | null>('dashboard_date', () => null)
  const cashflowPeriod = useState<number>('dashboard_cashflow_period', () => 3)
  const arPeriod = useState<number>('dashboard_ar_period', () => 6)
  const requestSeq = useState<number>('dashboard_request_seq', () => 0)
  // Session cache for period-toggle results, keyed by card+period+date —
  // switching 3→6→9 (or 6→12) refetches each period once, then reuses it.
  const periodCache = useState<Record<string, any>>('dashboard_period_cache', () => ({}))

  // Pass e.g. ['cash_flow'] to only recompute/refetch that card (used by the
  // period toggles, so switching months doesn't re-run all 8 cards' queries)
  // — omit for the initial full-page load, which still fetches everything.
  // Fold a (possibly partial) response payload into existing state.
  // `ar_timeline` is a slice of accounts_receivable, not a top-level card —
  // it must land at accounts_receivable.timeline, not overwrite the card.
  function applyData(data: Record<string, any>) {
    const { ar_timeline, ...cards } = data ?? {}
    const merged = { ...(raw.value ?? {}), ...cards }
    if (ar_timeline) {
      merged.accounts_receivable = { ...(merged.accounts_receivable ?? {}), timeline: ar_timeline }
    }
    raw.value = merged
  }

  async function fetchSummary(focus?: string[]) {
    // Serve a single-card toggle from the session cache when we've already
    // fetched that card at this period/date (monthly data — safe to reuse
    // for the session).
    const cacheKey = focus?.length === 1
      ? `${focus[0]}|${focus[0] === 'cash_flow' ? cashflowPeriod.value : arPeriod.value}|${date.value ?? 'today'}`
      : null
    if (cacheKey && periodCache.value[cacheKey]) {
      applyData({ [focus![0]]: periodCache.value[cacheKey] })
      return
    }

    // Guard against a slower earlier request (e.g. from rapid re-clicking a
    // toggle) resolving after a later one and overwriting fresher data with
    // stale data — only the response to the LATEST request is applied.
    const myRequestId = ++requestSeq.value
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (date.value) params.set('date', date.value)
      params.set('cashflow_period', String(cashflowPeriod.value))
      params.set('ar_period', String(arPeriod.value))
      if (focus?.length) params.set('focus', focus.join(','))

      const res: any = await useApi(`/dashboard?${params.toString()}`)
      if (myRequestId !== requestSeq.value) return
      // Merge rather than replace — a focused fetch only returns a subset of
      // keys, and must not wipe out the other cards already loaded.
      applyData(res?.data ?? {})
      if (cacheKey && res?.data?.[focus![0]]) {
        periodCache.value[cacheKey] = res.data[focus![0]]
      }
    } catch (err: any) {
      if (myRequestId !== requestSeq.value) return
      error.value = err?.data?.message ?? 'Failed to load dashboard data'
      // eslint-disable-next-line no-console
      console.error('[useDashboard] fetchSummary failed:', err)
    } finally {
      if (myRequestId === requestSeq.value) loading.value = false
    }
  }

  // ── Revenue (Revenue.vue) ─────────────────────────────────────────────────
  const revenue = computed(() => {
    const chart = raw.value?.revenue?.charts?.target_achievement
    if (!chart) return null
    const target = chart.target_value ?? (chart.current_percent ? Math.round((chart.current_value / chart.current_percent) * 100) : null)
    return {
      totalRevenue: chart.current_value,
      netRevenue: chart.current_value,
      currentYearTarget: target ?? chart.current_value,
      currentYearAchieved: chart.current_value,
    }
  })

  // ── Cashflow (Cashflow.vue) ───────────────────────────────────────────────
  const cashflow = computed(() => {
    const d = raw.value?.cash_flow
    if (!d) return null
    // Backend keys are "Jul-2026" etc (month-year, needed to disambiguate
    // across a year boundary) — the UI has only ever shown the month name.
    const months = Object.keys(d['Opening Cash Balance']?.monthly_totals ?? {})
    const toM = (v: number) => parseFloat(((v ?? 0) / 1_000_000).toFixed(2))
    return {
      chartCategories: months.map((m) => m.split('-')[0]),
      series: {
        realScenario: months.map((m) => toM(d['Incoming']?.monthly_totals?.[m])),
        hypotheticalScenario: months.map((m) => toM(d['Outgoing']?.monthly_totals?.[m])),
      },
      yAxis: { min: 0, max: Math.max(1, ...months.map((m) => toM(d['Incoming']?.monthly_totals?.[m]))) * 1.2, unit: 'M' },
    }
  })

  // ── Financials (Financials.vue) ──────────────────────────────────────────
  const financialStatements = computed(() => {
    const pl = raw.value?.financials?.pl?.report
    if (!pl) return null
    const revenueRow = findRow(pl, /^revenue$/i)
    const netProfitRow = findRow(pl, /net profit/i)
    const gauges = []
    const posNeg = (v: number) => (v >= 0 ? '#009848' : '#E5484D')
    if (revenueRow) {
      const growth = parseFloat(revenueRow.variance_percent) || 0
      gauges.push({
        label: 'Revenue Growth', labelAr: 'نمو الإيرادات',
        value: `${revenueRow.variance_percent ?? '0%'}`, progress: Math.min(100, Math.abs(growth)),
        color: posNeg(growth),
      })
    }
    if (netProfitRow && revenueRow?.current_year) {
      const margin = (netProfitRow.current_year / revenueRow.current_year) * 100
      gauges.push({
        label: 'Net Profit Margin', labelAr: 'هامش الربح الصافي',
        value: `${margin.toFixed(1)}%`, progress: Math.min(100, Math.abs(margin)),
        color: posNeg(margin),
      })
    }
    // Liquidity: Current Ratio from the ratios report (ratio, not a %) —
    // a ratio of 2.0 is conventionally "fully healthy", so the arc maxes there.
    // If the ratios call errored (e.g. tenant has no ratio mappings configured)
    // still render the gauge at 0 so the 3-pie layout doesn't break.
    const ratioRows = raw.value?.financials?.ratios?.report
    const currentRatioRow = (ratioRows ?? []).find((r: any) => /current ratio/i.test(r?.key_metric ?? ''))
    const ratio = currentRatioRow ? (parseFloat(currentRatioRow.current_year) || 0) : 0
    gauges.push({
      label: 'Liquidity Status', labelAr: 'حالة السيولة',
      value: ratio.toFixed(2), progress: Math.min(100, (ratio / 2) * 100),
      color: ratio >= 1 ? '#009848' : '#F1B208',
    })
    return gauges.length ? { gauges } : null
  })

  // ── Indirect Expense (IndirectExpense.vue) ───────────────────────────────
  const indirectExpense = computed(() => {
    const rows = (raw.value?.indirect_expense?.data ?? []).filter((r: any) => !r.isTotal && r.current_year > 0)
    if (!rows.length) return null
    const top5 = [...rows].sort((a, b) => b.current_year - a.current_year).slice(0, 5)
    // The pie component computes slice angles as value/100*360 — it needs
    // percentage shares, NOT raw AED amounts.
    const total = top5.reduce((s, r) => s + r.current_year, 0)
    return {
      labels: top5.map((r) => r.subgroup),
      labelsAr: top5.map((r) => r.subgroup),
      series: top5.map((r) => (total > 0 ? Math.round((r.current_year / total) * 100) : 0)),
    }
  })

  // ── Accounts Receivable (AccountReceivables.vue) ─────────────────────────
  const accountReceivables = computed(() => {
    // The 6M/12M toggle only changes the *timeline* range (ar_period) — the
    // single-date `report` snapshot has no period dimension at all, so the
    // chart must be built from `timeline.ranges`, not `report`, or the
    // toggle would have zero visible effect.
    const ranges = raw.value?.accounts_receivable?.timeline?.ranges
    if (!Array.isArray(ranges) || !ranges.length) return null
    const toM = (v: number) => parseFloat(((v ?? 0) / 1_000_000).toFixed(2))
    const months = ranges.map((r: any) => new Date(r.end).toLocaleString('en-US', { month: 'short' }))
    const values = ranges.map((r: any) => toM(r.ar_value))
    const zeros = ranges.map(() => 0)
    return {
      // Historical per-bucket aging isn't available at each past date — only
      // the total AR balance trend is. Show it in one series rather than
      // fabricating a fake aging split for prior months.
      series: { lt30Days: values, d31to60: zeros, d61to90: zeros, gt90Days: zeros },
      months,
      monthsAr: months,
      yAxisMax: Math.max(1, ...values),
    }
  })

  // ── COGS (Cogs.vue) ───────────────────────────────────────────────────────
  const cogs = computed(() => {
    const cogsRows = raw.value?.cogs?.data
    const totalRow = findRow(cogsRows, /total cogs/i)
    const revenueTotal = raw.value?.revenue?.charts?.target_achievement?.current_value
    if (!totalRow || !revenueTotal) return null
    const ratio = (totalRow.current_year / revenueTotal) * 100
    const change = totalRow.variance_percent ?? '0%'
    return {
      cogsToRevenueRatio: `${ratio.toFixed(0)}%`,
      vsLastMonth: change,
      trend: parseFloat(change) >= 0 ? 'up' : 'down',
    }
  })

  // ── Accounts Payable (AccountsPayable.vue) ───────────────────────────────
  const accountsPayable = computed(() => {
    const rows = raw.value?.accounts_payable
    const totalRow = (rows ?? []).find((r: any) => r.isTotal)
    if (!totalRow) return null
    // Aging buckets as % of the largest bucket — drives the mini bar chart
    const buckets = [
      totalRow.bucket_0_30 ?? 0,
      totalRow.bucket_31_60 ?? 0,
      totalRow.bucket_61_90 ?? 0,
      (totalRow.bucket_91_180 ?? 0) + (totalRow.bucket_181_365 ?? 0) + (totalRow.bucket_365_plus ?? 0),
    ]
    const maxBucket = Math.max(1, ...buckets)
    return {
      agingBars: buckets.map((b) => Math.round((b / maxBucket) * 100)),
      totalOutstandingPayables: totalRow.amount ?? 0,
      overdue: (totalRow.bucket_91_180 ?? 0) + (totalRow.bucket_181_365 ?? 0) + (totalRow.bucket_365_plus ?? 0),
      dueInNext30Days: totalRow.bucket_0_30 ?? 0,
    }
  })

  // ── Cost Center (CostCenter.vue) ──────────────────────────────────────────
  const costCenter = computed(() => {
    const projects = raw.value?.cost_center
    if (!Array.isArray(projects)) return null
    // Per-project revenue normalized 0-100 — drives the mini wave chart
    // (data already in this payload; no extra endpoint).
    const revenues = projects.map((p: any) => p.revenue ?? 0)
    const maxRev = Math.max(1, ...revenues)
    return {
      activeProjects: projects.length,
      waveValues: revenues.map((r: number) => Math.round((r / maxRev) * 100)),
    }
  })

  return {
    loading,
    error,
    date,
    cashflowPeriod,
    arPeriod,
    fetchSummary,
    revenue,
    cashflow,
    financialStatements,
    indirectExpense,
    accountReceivables,
    cogs,
    accountsPayable,
    costCenter,
  }
}
