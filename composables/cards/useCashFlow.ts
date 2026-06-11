export const useCashFlow = () => {
  const rawData    = useState<any>('cashflow_raw',      () => null)
  const loading    = useState<boolean>('cashflow_loading', () => false)
  const error      = useState<string | null>('cashflow_error', () => null)
  const period     = useState<number>('cashflow_period',   () => 3)
  const scenario   = useState<string>('cashflow_scenario', () => '100% Scenario')
  const activeDate = useState<string | null>('cashflow_date', () => null)

  const fetchProjection = async () => {
    loading.value = true
    error.value   = null
    try {
      const params = new URLSearchParams()
      if (activeDate.value) params.set('date', activeDate.value)
      params.set('period',   String(period.value))
      params.set('scenario', scenario.value)

      const res = await useApi(`/cash-flow/projection?${params.toString()}`) as any
      rawData.value = res.data ?? null
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to fetch cash flow data'
    } finally {
      loading.value = false
    }
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  const fmt  = (val: number) => Math.round(val).toLocaleString('en-US')
  const fmtM = (val: number) => `AED ${(val / 1_000_000).toFixed(1)} M`
  const toM  = (val: number) => parseFloat((val / 1_000_000).toFixed(2))

  const months = computed((): string[] => {
    if (!rawData.value) return []
    return Object.keys(rawData.value['Opening Cash Balance']?.monthly_totals ?? {})
  })

  // ── CashFlowSummary ───────────────────────────────────────────────────────

  const summary = computed(() => {
    if (!rawData.value || !months.value.length) return null
    const d  = rawData.value
    const ms = months.value
    return {
      months:          ms,
      openingBalance:  ms.map(m => fmt(d['Opening Cash Balance']?.monthly_totals?.[m] ?? 0)),
      incoming:        ms.map(m => fmt(d['Incoming']?.monthly_totals?.[m] ?? 0)),
      outgoing:        ms.map(m => fmt(d['Outgoing']?.monthly_totals?.[m] ?? 0)),
      netMovements:    ms.map(m => fmt(d['Net Cash Flow']?.monthly_totals?.[m] ?? 0)),
      closing:         ms.map(m => fmt(d['Closing Balance']?.monthly_totals?.[m] ?? 0)),
      incomingInvoices: (d['AR File']?.customers ?? []).map((c: any) => ({
        number:   'N/A',
        customer: c.name,
        type:     'AR',
        amount:   fmt(c.total),
        status:   'Confirmed',
        expDate:  '-',
      })),
      outgoingInvoices: (d['AP File']?.customers ?? []).map((c: any) => ({
        number:   'N/A',
        customer: c.name,
        type:     'AP',
        amount:   fmt(c.total),
        status:   'Pending',
        expDate:  '-',
      })),
    }
  })

  // ── CashFlowMetrics ───────────────────────────────────────────────────────

  const metrics = computed(() => {
    if (!rawData.value || !months.value.length) return null
    const ms         = months.value
    const d          = rawData.value
    const firstMonth = ms[0]

    const openingVal = d['Opening Cash Balance']?.monthly_totals?.[firstMonth] ?? 0
    const arVal      = d['AR File']?.monthly_totals?.[firstMonth] ?? 0
    const secondMonth = ms[1]
    const prevOpening = secondMonth
      ? (d['Opening Cash Balance']?.monthly_totals?.[secondMonth] ?? openingVal)
      : openingVal

    const changePct = (curr: number, prev: number) =>
      prev === 0 ? '0.0%' : ((curr - prev) / Math.abs(prev) * 100).toFixed(1) + '%'

    return {
      cashInHand:       fmtM(openingVal),
      cashInHandChange: changePct(openingVal, prevOpening),
      ar30Days:         fmtM(arVal),
      ar30DaysChange:   '0.0%',
      scenarios: [
        { en: '100% Scenario', ar: 'سيناريو 100%' },
        { en: 'Future Contract', ar: 'عقد مستقبلي' },
      ],
    }
  })

  // ── CashFlowChart (line: Incoming = Real, Outgoing = Hypothetical) ────────

  const scenarioChart = computed(() => {
    if (!rawData.value || !months.value.length) return null
    const ms = months.value
    const d  = rawData.value
    return {
      series: [
        { name: 'Real Scenario',        nameAr: 'سيناريو حقيقي',    data: ms.map(m => toM(d['Incoming']?.monthly_totals?.[m] ?? 0)) },
        { name: 'Hypothetical Scenario', nameAr: 'سيناريو افتراضي', data: ms.map(m => toM(d['Outgoing']?.monthly_totals?.[m] ?? 0)) },
      ],
      categories:   ms,
      categoriesAr: ms,
    }
  })

  // ── CashFlowInflowOutflow (bar) ───────────────────────────────────────────

  const inflowOutflow = computed(() => {
    if (!rawData.value || !months.value.length) return null
    const ms = months.value
    const d  = rawData.value
    return {
      series: [
        { name: 'Outflow', nameAr: 'التدفق الخارجي', data: ms.map(m => toM(d['Outgoing']?.monthly_totals?.[m] ?? 0)) },
        { name: 'Inflow',  nameAr: 'التدفق الداخلي', data: ms.map(m => toM(d['Incoming']?.monthly_totals?.[m] ?? 0)) },
      ],
      categories:   ms,
      categoriesAr: ms,
    }
  })

  return {
    loading,
    error,
    period,
    scenario,
    activeDate,
    fetchProjection,
    summary,
    metrics,
    scenarioChart,
    inflowOutflow,
  }
}
