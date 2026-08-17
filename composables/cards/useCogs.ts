const _breakdownData     = ref<any>(null)
const _trendData         = ref<any[]>([])
const _revenueToCogsData = ref<any[]>([])
const _loading           = ref(false)
const _error             = ref<string | null>(null)

export function useCogs() {
  const rangeOption = useState<string>('cogs_range_option', () => 'Year to Date')
  const customFrom  = useState<string | null>('cogs_custom_from', () => null)
  const customTo    = useState<string | null>('cogs_custom_to',   () => null)

  async function fetchAll(lang = 'en') {
    _loading.value = true
    _error.value   = null

    try {
      const backendRange = rangeOption.value

      // 1. Breakdown — uses range_option, custom dates only when Custom Dates
      const breakdownBody: any = { range_option: backendRange, lang }
      if (backendRange === 'Custom Dates') {
        breakdownBody.custom_from = customFrom.value
        breakdownBody.custom_to   = customTo.value
      }
      const breakdownRes: any = await useApi('/cogs-analysis/breakdown', {
        method: 'POST',
        body: breakdownBody,
      })
      if (breakdownRes?.status === 'success') {
        _breakdownData.value = breakdownRes
      }

      // 2. Trend chart — backend forces 'Previous 6 months'; pass custom_from anchor only for Custom Dates
      const trendBody: any = { lang }
      if (backendRange === 'Custom Dates' && customTo.value) {
        trendBody.custom_from = customTo.value
      }
      const trendRes: any = await useApi('/cogs-analysis/trend-chart', {
        method: 'POST',
        body: trendBody,
      })
      if (trendRes) {
        _trendData.value = Array.isArray(trendRes) ? trendRes : (trendRes.data || trendRes.payload || [])
      }

      // 3. Revenue vs COGS trend — same anchor logic
      const revenueBody: any = { lang }
      if (backendRange === 'Custom Dates' && customTo.value) {
        revenueBody.custom_from = customTo.value
      }
      const revenueRes: any = await useApi('/cogs-analysis/revenue-vs-cogs/trend-chart', {
        method: 'POST',
        body: revenueBody,
      })
      if (revenueRes) {
        _revenueToCogsData.value = Array.isArray(revenueRes) ? revenueRes : (revenueRes.data || revenueRes.payload || [])
      }

    } catch (e: any) {
      _error.value = e?.message ?? 'Failed to load COGS data'
    } finally {
      _loading.value = false
    }
  }

  // ── Drill-down (Figma): subgroup row → ledger rows → ledger statement ────
  // Both modes hit POST /financial-analysis/pl-ledger-details with the page's
  // active range.

  const rangeBody = () => {
    const body: any = { range_option: rangeOption.value }
    if (rangeOption.value === 'Custom Dates') {
      body.custom_from = customFrom.value
      body.custom_to   = customTo.value
    }
    return body
  }

  // subgroup mode: ledger rows (current/previous/variance) under a subgroup
  async function fetchSubgroupLedgers(subgroup: string) {
    const res: any = await useApi('/financial-analysis/pl-ledger-details', {
      method: 'POST',
      body: { ...rangeBody(), subgroup },
    })
    if (res?.status !== 'success') throw new Error(res?.message ?? 'Failed to fetch ledger breakdown')
    return res.data ?? []
  }

  // ledger mode: daybook statement (Date/Particulars/Debit/Credit + balances)
  async function fetchLedgerStatement(ledger: string) {
    const res: any = await useApi('/financial-analysis/pl-ledger-details', {
      method: 'POST',
      body: { ...rangeBody(), ledger },
    })
    if (res?.status !== 'success') throw new Error(res?.message ?? 'Failed to fetch ledger statement')
    return res // { info: {ledger, from, to}, data: {opening_balance, entries, total_debit, total_credit, closing_balance} }
  }

  return {
    rangeOption,
    customFrom,
    customTo,
    fetchSubgroupLedgers,
    fetchLedgerStatement,
    breakdownData:    _breakdownData,
    trendData:        _trendData,
    revenueToCogsData: _revenueToCogsData,
    loading:          _loading,
    error:            _error,
    fetchAll,
  }
}
