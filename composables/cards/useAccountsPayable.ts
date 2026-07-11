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

// ── GAP-DAY FALLBACK TOGGLE ────────────────────────────────────────────────
// true (default, also the behavior if this line is missing): a date with no
// uploaded AP snapshot shows the LATEST upload on or before it, the shared
// date state snaps to that snapshot, and the page shows a notice.
// false: strict legacy behavior — the exact requested date only, empty when
// nothing was uploaded that day (backend gets ?strict_date=1).
const ENABLE_SNAPSHOT_FALLBACK = true
// ───────────────────────────────────────────────────────────────────────────

const _snapshotDate   = ref<string | null>(null)
const _requestedDate  = ref<string | null>(null)
const _snapshotNotice = ref(false)

async function fetchAll(lang = 'en') {
  _loading.value = true
  _error.value   = null
  const date = apActiveDate.value
  const strict = ENABLE_SNAPSHOT_FALLBACK ? {} : { strict_date: 1 }

  try {
    // 1. Summary table (/ap-report)
    const summaryRes: any = await useApi('/ap-report', { params: { test_date: date, ...strict } })

    if (ENABLE_SNAPSHOT_FALLBACK && summaryRes?.snapshot_date) {
      _requestedDate.value  = summaryRes.requested_date ?? date
      _snapshotDate.value   = summaryRes.snapshot_date
      _snapshotNotice.value = summaryRes.snapshot_date !== (summaryRes.requested_date ?? date)
      if (_snapshotNotice.value) {
        apActiveDate.value = summaryRes.snapshot_date
      }
    } else {
      _snapshotNotice.value = false
    }

    if (summaryRes?.status === 'success') {
      _summary.value = summaryRes.data || []
    }

    // 2. Aging graph (/ap-report/aging)
    const agingRes: any = await useApi('/ap-report/aging', { params: { test_date: date, lang, ...strict } })
    if (agingRes?.status === 'success') {
      _agingData.value = agingRes.payload || {}
    }

    // 3. Top vendors (/ap-report/top-eight)
    const topRes: any = await useApi('/ap-report/top-eight', { params: { test_date: date, ...strict } })
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
    snapshotDate:   _snapshotDate,
    requestedDate:  _requestedDate,
    snapshotNotice: _snapshotNotice,
    fetchAll,
  }
}
