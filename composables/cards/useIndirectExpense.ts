const _breakdownData    = ref<any>(null)
const _trendData        = ref<any[]>([])
const _expenseVsRevenue = ref<any[]>([])
const _loading          = ref(false)
const _error            = ref<string | null>(null)

export function useIndirectExpense() {
  const rangeOption = useState<string>('ie_range_option', () => 'Year to Date')
  const customFrom  = useState<string | null>('ie_custom_from', () => null)
  const customTo    = useState<string | null>('ie_custom_to',   () => null)

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
      const breakdownRes: any = await useApi('/indirectexpenses-analysis/breakdown', {
        method: 'POST',
        body: breakdownBody,
      })
      if (breakdownRes?.status === 'success') {
        _breakdownData.value = breakdownRes
      }

      // 2. Trend chart — backend forces 'Previous 6 months'; pass custom_from anchor only for Custom Dates
      const trendBody: any = {}
      if (backendRange === 'Custom Dates' && customTo.value) {
        trendBody.custom_from = customTo.value
      }
      const trendRes: any = await useApi('/indirectexpenses-analysis/trend-chart', {
        method: 'POST',
        body: trendBody,
      })
      if (trendRes?.status === 'success') {
        _trendData.value = trendRes.data || []
      }

      // 3. Expense vs Revenue trend chart — same anchor logic as trend chart
      const evrBody: any = { lang }
      if (backendRange === 'Custom Dates' && customTo.value) {
        evrBody.custom_from = customTo.value
      }
      const evrRes: any = await useApi('/indirectexpenses-analysis/expense-vs-revenue/trend-chart', {
        method: 'POST',
        body: evrBody,
      })
      if (evrRes?.status === 'success') {
        _expenseVsRevenue.value = evrRes.data || []
      }

    } catch (e: any) {
      _error.value = e?.message ?? 'Failed to load Indirect Expense data'
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
    expenseVsRevenue: _expenseVsRevenue,
    loading:          _loading,
    error:            _error,
    fetchAll,
  }
}
