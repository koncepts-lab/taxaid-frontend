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

  // ── ⓘ invoice-details drill-down (GET /cash-flow/customer-projection) ────

  const customerDetail        = useState<any>('cashflow_customer_detail', () => null)
  const customerDetailLoading = useState<boolean>('cashflow_customer_detail_loading', () => false)
  const customerDetailError   = useState<string | null>('cashflow_customer_detail_error', () => null)

  const fetchCustomerDetail = async (customer: string, type: 'AR' | 'AP') => {
    customerDetailLoading.value = true
    customerDetailError.value   = null
    customerDetail.value        = null
    try {
      const qs = new URLSearchParams({ period: String(period.value), customer, type })
      if (activeDate.value) qs.set('date', activeDate.value)
      const res = await useApi(`/cash-flow/customer-projection?${qs.toString()}`) as any
      if (res?.status === 'success') {
        customerDetail.value = res.data
      } else {
        customerDetailError.value = res?.message ?? 'Failed to fetch customer detail'
      }
    } catch (err: any) {
      customerDetailError.value = err?.data?.message ?? 'Failed to fetch customer detail'
    } finally {
      customerDetailLoading.value = false
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
      incomingInvoices: (d['AR File']?.invoices ?? []).map((inv: any) => ({
        number:   inv.invoice_no,
        customer: inv.customer,
        type:     'AR',
        amount:   fmt(inv.amount),
        status:   inv.status,
        expDate:  inv.due_date,
      })),
      outgoingInvoices: (d['AP File']?.invoices ?? []).map((inv: any) => ({
        number:   inv.invoice_no,
        customer: inv.customer,
        type:     'AP',
        amount:   fmt(inv.amount),
        status:   inv.status,
        expDate:  inv.due_date,
      })),
    }
  })

  // ── Figma grouped sub-sections (expanded Incoming / Outgoing) ────────────
  // invoiceType marks rows that have real invoices behind them (ⓘ modal).

  const mapSectionRows = (group: any, ms: string[], invoiceType: 'AR' | 'AP' | null = null) =>
    (group?.customers ?? []).map((c: any) => ({
      name:        c.name,
      invoiceType,
      values:      ms.map(m => fmt(c.values?.[m] ?? 0)),
    }))

  const sections = computed(() => {
    if (!rawData.value || !months.value.length) return null
    const d  = rawData.value
    const ms = months.value

    const incoming = [
      { key: 'ar',   title: { en: 'Collections from AR',   ar: 'التحصيلات من الذمم المدينة' }, rows: mapSectionRows(d['AR File'], ms, 'AR') },
      { key: 'p100', title: { en: 'Projections from 100%', ar: 'توقعات 100%' },               rows: mapSectionRows(d['Sales Forecast'], ms) },
    ]
    if (d['Projections from 90%']) {
      incoming.push({ key: 'p90', title: { en: 'Projections from 90%', ar: 'توقعات 90%' }, rows: mapSectionRows(d['Projections from 90%'], ms) })
    }

    const outgoing = [
      { key: 'ap', title: { en: 'Payment to AP',      ar: 'مدفوعات الذمم الدائنة' },      rows: mapSectionRows(d['AP File'], ms, 'AP') },
      { key: 'de', title: { en: 'Direct expenses',    ar: 'المصروفات المباشرة' },         rows: mapSectionRows(d['Direct Expenses'], ms) },
      { key: 'ie', title: { en: 'Indirect expenses',  ar: 'المصروفات غير المباشرة' },     rows: mapSectionRows(d['Indirect Expenses'], ms) },
    ]
    if (d['Budget for 90% - from Cost center budget']) {
      outgoing.push({ key: 'b90', title: { en: 'Budget for 90% - Cost center', ar: 'موازنة 90% - مركز التكلفة' }, rows: mapSectionRows(d['Budget for 90% - from Cost center budget'], ms) })
    }

    return {
      incoming: incoming.filter(s => s.rows.length),
      outgoing: outgoing.filter(s => s.rows.length),
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
    customerDetail,
    customerDetailLoading,
    customerDetailError,
    fetchCustomerDetail,
    summary,
    sections,
    metrics,
    scenarioChart,
    inflowOutflow,
  }
}
