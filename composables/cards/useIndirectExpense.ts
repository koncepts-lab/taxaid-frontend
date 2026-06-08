const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}-${m}-${y}`
}

const today = new Date()
const startOfYear = `${today.getFullYear()}-01-01`
const todayStr    = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

export const indirectExpenseDateFrom = ref(formatDate(startOfYear))
export const indirectExpenseDateTo   = ref(formatDate(todayStr))

const _breakdownData      = ref<any>(null)
const _trendData          = ref<any[]>([])
const _expenseVsRevenue   = ref<any[]>([])
const _loading            = ref(false)
const _error              = ref<string | null>(null)

async function fetchAll(lang = 'en') {
  _loading.value = true
  _error.value   = null

  try {
    // 1. Breakdown — uses full date range
    const breakdownRes: any = await useApi('/indirectexpenses-analysis/breakdown', {
      method: 'POST',
      body: {
        range_option: 'Custom Dates',
        custom_from:  indirectExpenseDateFrom.value,
        custom_to:    indirectExpenseDateTo.value,
        lang,
      }
    })
    if (breakdownRes?.status === 'success') {
      _breakdownData.value = breakdownRes
    }

    // 2. Overhead trend chart — uses activeDateTo as anchor for "Previous 6 months" lookback
    const trendRes: any = await useApi('/indirectexpenses-analysis/trend-chart', {
      method: 'POST',
      body: { custom_from: indirectExpenseDateTo.value }
    })
    if (trendRes?.status === 'success') {
      _trendData.value = trendRes.data || []
    }

    // 3. Expense vs Revenue trend chart — same anchor fix
    const evrRes: any = await useApi('/indirectexpenses-analysis/expense-vs-revenue/trend-chart', {
      method: 'POST',
      body: { custom_from: indirectExpenseDateTo.value, lang }
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

export function useIndirectExpense() {
  return {
    dateFrom:         indirectExpenseDateFrom,
    dateTo:           indirectExpenseDateTo,
    breakdownData:    _breakdownData,
    trendData:        _trendData,
    expenseVsRevenue: _expenseVsRevenue,
    loading:          _loading,
    error:            _error,
    fetchAll,
  }
}
