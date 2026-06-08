/**
 * useAccountsPayable
 * Fetches live AP data from the backend and transforms it into the shapes
 * expected by the AP components (Summary, TopCustomers, AgingGraph, HistoricalMovement).
 *
 * Shared state: activeDate is global so the page and all components stay in sync.
 */

const todayYMD = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const apActiveDate = ref(todayYMD())

const _summary            = ref<any[]>([])
const _agingData          = ref<any>({})
const _topCustomers       = ref<any>(null)
const _timelineData       = ref<any>(null)
const _loading            = ref(false)
const _error              = ref<string | null>(null)

async function fetchAll(lang = 'en') {
  _loading.value = true
  _error.value   = null
  const date = apActiveDate.value

  try {
    // 1. Summary table (/ap-report)
    const summaryRes: any = await useApi('/ap-report', { params: { test_date: date } })
    if (summaryRes?.status === 'success') {
      _summary.value = summaryRes.data || []
    }

    // 2. Aging graph (/ap-report/aging)
    const agingRes: any = await useApi('/ap-report/aging', { params: { test_date: date, lang } })
    if (agingRes?.status === 'success') {
      _agingData.value = agingRes.payload || {}
    }

    // 3. Top vendors (/ap-report/top-eight)
    const topRes: any = await useApi('/ap-report/top-eight', { params: { test_date: date } })
    if (topRes?.status === 'success') {
      _topCustomers.value = topRes.payload || null
    }

    // 4. Historical movement (/ap-report/timeline)
    const timelineRes: any = await useApi('/ap-report/timeline', { params: { test_date: date } })
    if (timelineRes?.status === 'success' && timelineRes.payload) {
      const ranges = timelineRes.payload.ranges || []
      _timelineData.value = {
        apBalance:  ranges.map((r: any) => parseFloat(((r.ap_value ?? 0) / 1_000_000).toFixed(2))),
        categories: ranges.map((r: any) => {
          const d = new Date(r.start)
          return d.toLocaleString('en-US', { month: 'short' })
        }),
        percentage: ranges.map(() => 0)
      }
    }

  } catch (e: any) {
    _error.value = e?.message ?? 'Failed to load AP data'
  } finally {
    _loading.value = false
  }
}

export function useAccountsPayablePage() {
  return {
    activeDate:   apActiveDate,
    summary:      _summary,
    agingData:    _agingData,
    topCustomers: _topCustomers,
    timelineData: _timelineData,
    loading:      _loading,
    error:        _error,
    fetchAll,
  }
}
