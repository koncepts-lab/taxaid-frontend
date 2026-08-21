/**
 * useDashboard
 * Single composable backing the 9 main-dashboard cards (`components/dashboard/*.vue`).
 * Fetches GET /dashboard once and exposes the same key names useMainDashboard()
 * used to expose from mock data, now computed from the real payload — so each
 * card's template/script needs only a one-line data-source swap.
 */

export function useDashboard() {
  const raw = useState<any>('dashboard_raw', () => null)
  const loading = useState<boolean>('dashboard_loading', () => false)
  const error = useState<string | null>('dashboard_error', () => null)
  const date = useState<string | null>('dashboard_date', () => null)
  const cashflowPeriod = useState<number>('dashboard_cashflow_period', () => 3)
  const requestSeq = useState<number>('dashboard_request_seq', () => 0)
  // Session cache for period-toggle results, keyed by card+period+date —
  // switching 3→6→9 refetches each period once, then reuses it.
  const periodCache = useState<Record<string, any>>('dashboard_period_cache', () => ({}))

  // Pass e.g. ['cash_flow'] to only recompute/refetch that card (used by the
  // period toggle, so switching months doesn't re-run all 9 cards' queries)
  // — omit for the initial full-page load, which still fetches everything.
  function applyData(data: Record<string, any>) {
    raw.value = { ...(raw.value ?? {}), ...(data ?? {}) }
  }

  async function fetchSummary(focus?: string[]) {
    // Serve a single-card toggle from the session cache when we've already
    // fetched that card at this period/date (monthly data — safe to reuse
    // for the session).
    const cacheKey = focus?.length === 1
      ? `${focus[0]}|${cashflowPeriod.value}|${date.value ?? 'today'}`
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
  // Gauge is Gross Profit Margin (revenue vs COGS). netRevenue is the current VAT
  // year's filed quarters — a different period basis than totalRevenue.
  const revenue = computed(() => {
    const d = raw.value?.revenue
    if (!d) return null
    return {
      totalRevenue: d.currentValue,
      netRevenue: d.netRevenue,
      grossProfitMargin: d.grossProfitMargin ?? 0,
    }
  })

  // ── Cashflow (Cashflow.vue) ───────────────────────────────────────────────
  // Backend sends chart-ready values (millions, real vs 90%-lead-projected
  // scenario, y-axis max) — no unit conversion or math here, just render.
  const cashflow = computed(() => {
    const d = raw.value?.cash_flow
    if (!d) return null
    return {
      chartCategories: d.chartCategories ?? [],
      series: {
        realScenario: d.realScenario ?? [],
        hypotheticalScenario: d.hypotheticalScenario ?? [],
      },
      yAxis: { min: 0, max: d.yAxisMax ?? 1, unit: 'M' },
    }
  })

  // ── Financials (Financials.vue) ──────────────────────────────────────────
  // Backend sends the 3 final gauge values, fully computed — no report rows to
  // search, no margin division here. Just render.
  const financialStatements = computed(() => {
    const d = raw.value?.financials
    if (!d) return null
    const posNeg = (v: number) => (v >= 0 ? '#009848' : '#E5484D')
    const growth = d.revenueGrowth ?? 0
    const margin = d.netProfitMargin ?? 0
    const ratio = d.liquidityRatio ?? 0
    return {
      gauges: [
        {
          label: 'Revenue Growth', labelAr: 'نمو الإيرادات',
          value: `${growth}%`, progress: Math.min(100, Math.abs(growth)),
          color: posNeg(growth),
        },
        {
          label: 'Net Profit Margin', labelAr: 'هامش الربح الصافي',
          value: `${margin.toFixed(1)}%`, progress: Math.min(100, Math.abs(margin)),
          color: posNeg(margin),
        },
        // Current Ratio is a ratio, not a %; 2.0 is conventionally "fully healthy",
        // so the arc maxes there.
        {
          label: 'Liquidity Status', labelAr: 'حالة السيولة',
          value: ratio.toFixed(2), progress: Math.min(100, (ratio / 2) * 100),
          color: ratio >= 1 ? '#009848' : '#F1B208',
        },
      ],
    }
  })

  // ── Indirect Expense (IndirectExpense.vue) ───────────────────────────────
  // Backend already picked the top 5 subgroups and computed their % share —
  // no filter/sort/slice/math here, just render.
  const indirectExpense = computed(() => {
    const d = raw.value?.indirect_expense
    if (!d?.labels?.length) return null
    return {
      labels: d.labels,
      labelsAr: d.labels,
      series: d.series,
    }
  })

  // ── Accounts Receivable (AccountReceivables.vue) ─────────────────────────
  // Top 10 customers, stacked by aging bucket — key rename so the month-chart's
  // rendering (keyed by `months`/`series`) can be reused with customer names.
  const accountReceivables = computed(() => {
    const d = raw.value?.accounts_receivable
    if (!d?.customers?.length) return null
    return {
      series: d.series,
      months: d.customers,
      monthsAr: d.customers,
      yAxisMax: d.yAxisMax,
    }
  })

  // ── COGS (Cogs.vue) ───────────────────────────────────────────────────────
  // Backend already computed the ratio and the delta — no cross-card dependency
  // on the 'revenue' card's data, no full breakdown to search, just render.
  const cogs = computed(() => {
    const d = raw.value?.cogs
    if (!d) return null
    const delta = d.delta ?? 0
    return {
      cogsToRevenueRatio: `${d.ratio ?? 0}%`,
      vsLastMonth: `${delta >= 0 ? '+' : ''}${delta}%`,
      delta,
    }
  })

  // COGS card's wave graph — 6-month real ratio trend, already %-scaled.
  const cogsTrend = computed(() => raw.value?.cogs_trend?.ratios ?? [])

  // ── Accounts Payable (AccountsPayable.vue) ───────────────────────────────
  // Backend already computed everything (total, delta, trend, aging bar %s) from
  // the isTotal row only — no full customer list to search, just render.
  const accountsPayable = computed(() => {
    const d = raw.value?.accounts_payable
    if (!d) return null
    return {
      agingBars: d.agingBars ?? [0, 0, 0, 0],
      totalOutstandingPayables: d.total ?? 0,
      overdue: d.overdue ?? 0,
      dueInNext30Days: d.dueInNext30Days ?? 0,
      vsLastMonth: `${d.delta >= 0 ? '+' : ''}${d.delta ?? 0}%`,
      delta: d.delta ?? 0,
    }
  })

  // ── Cost Center (CostCenter.vue) ──────────────────────────────────────────
  // Margin, delta, key driver, and year-over-year trend (PY 1 vs Current Year).
  const costCenter = computed(() => {
    const d = raw.value?.cost_center
    if (!d) return null
    const values: number[] = d.waveValues ?? []
    const min = values.length ? Math.min(...values) : 0
    const max = values.length ? Math.max(...values) : 0
    const range = max - min
    return {
      profitMargin: d.profitMargin ?? 0,
      delta: d.delta ?? 0,
      keyDriver: d.keyDriver ?? '',
      // Normalize to 0-100 for the wave chart's existing 0-100 rendering scale.
      waveValues: values.map((v) => (range > 0 ? Math.round(((v - min) / range) * 100) : 50)),
    }
  })

  // ── Tax Queries (TaxQueries.vue) ──────────────────────────────────────────
  const taxQueries = computed(() => raw.value?.tax_queries ?? null)

  return {
    loading,
    error,
    date,
    cashflowPeriod,
    fetchSummary,
    revenue,
    cashflow,
    financialStatements,
    indirectExpense,
    accountReceivables,
    cogs,
    cogsTrend,
    accountsPayable,
    costCenter,
    taxQueries,
  }
}
