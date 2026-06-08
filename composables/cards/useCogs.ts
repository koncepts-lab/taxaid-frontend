/**
 * useCogs
 * Fetches live COGS data from the backend and transforms it into the shapes
 * expected by the COGS components (Summary, BreakdownByCategory, RevenueToCogsMonthly, Last6Months).
 *
 * activeDateFrom / activeDateTo are shared so the page and all components stay in sync.
 */

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}-${m}-${y}`
}

const today = new Date()
const startOfYear = `${today.getFullYear()}-01-01`
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

export const cogsDateFrom = ref(formatDate(startOfYear))
export const cogsDateTo   = ref(formatDate(todayStr))

const _breakdownData      = ref<any>(null)
const _trendData          = ref<any[]>([])
const _revenueToCogsData  = ref<any[]>([])
const _loading            = ref(false)
const _error              = ref<string | null>(null)

async function fetchAll(lang = 'en') {
  _loading.value = true
  _error.value   = null

  try {
    // 1. Breakdown (/cogs-analysis/breakdown)
    const breakdownRes: any = await useApi('/cogs-analysis/breakdown', {
      method: 'POST',
      body: {
        range_option: 'Custom Dates',
        custom_from:  cogsDateFrom.value,
        custom_to:    cogsDateTo.value,
        lang,
      }
    })
    if (breakdownRes?.status === 'success') {
      _breakdownData.value = breakdownRes
    }

    // 2. Last 6 months trend (/cogs-analysis/trend-chart)
    // Uses activeDateTo as anchor so "Previous 6 months" ends at the selected end date
    const trendRes: any = await useApi('/cogs-analysis/trend-chart', {
      method: 'POST',
      body: { custom_from: cogsDateTo.value, lang }
    })
    if (trendRes) {
      _trendData.value = Array.isArray(trendRes) ? trendRes : (trendRes.data || trendRes.payload || [])
    }

    // 3. Revenue vs COGS monthly (/cogs-analysis/revenue-vs-cogs/trend-chart)
    const revenueRes: any = await useApi('/cogs-analysis/revenue-vs-cogs/trend-chart', {
      method: 'POST',
      body: { custom_from: cogsDateTo.value, lang }
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

export function useCogs() {
  return {
    dateFrom:         cogsDateFrom,
    dateTo:           cogsDateTo,
    breakdownData:    _breakdownData,
    trendData:        _trendData,
    revenueToCogsData: _revenueToCogsData,
    loading:          _loading,
    error:            _error,
    fetchAll,
  }
}
