/**
 * useAccountsPayable
 * Fetches live AP data from the backend and transforms it into the shapes
 * expected by the AP components (Summary, TopCustomers, AgingGraph, HistoricalMovement).
 *
 * Shared state: activeDate is global so the page and all components stay in sync.
 */

export const apActiveDate = ref('')

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
const _goLiveDate     = ref<string | null>(null)
// Tenant-wide: whether Hold-for-Review has any internal recipient configured.
const _hasInternalEmails = ref(true)
const _hasMailSettings = ref(true)

async function fetchAll(lang = 'en') {
  _loading.value = true
  _error.value   = null
  let date = apActiveDate.value
  const dateParam = () => (date ? { date } : {})
  const strict = ENABLE_SNAPSHOT_FALLBACK ? {} : { strict_date: 1 }

  try {
    // 1. Summary table (/ap-report)
    const summaryRes: any = await useApi('/ap-report', { params: { ...dateParam(), ...strict } })

    if (!date && summaryRes?.requested_date) {
      date = summaryRes.requested_date
      apActiveDate.value = date
    }

    _goLiveDate.value = summaryRes?.go_live_date ?? null
    useState('cardPeriod').value = summaryRes?.period ?? null
    useState('cardToday').value = summaryRes?.today ?? null

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
      _hasInternalEmails.value = summaryRes.has_internal_emails ?? true
      _hasMailSettings.value = summaryRes.has_mail_settings ?? true
    }

    // 2. Aging graph (/ap-report/aging)
    const agingRes: any = await useApi('/ap-report/aging', { params: { ...dateParam(), lang, ...strict } })
    if (agingRes?.status === 'success') {
      _agingData.value = agingRes.payload || {}
    }

    // 3. Top vendors (/ap-report/top-eight)
    const topRes: any = await useApi('/ap-report/top-eight', { params: { ...dateParam(), ...strict } })
    if (topRes?.status === 'success') {
      _topCustomers.value = topRes.payload || null
    }

    // 4. Historical movement (/ap-report/timeline)
    const timelineRes: any = await useApi('/ap-report/timeline', { params: { ...dateParam() } })
    if (timelineRes?.status === 'success' && timelineRes.payload) {
      const ranges = timelineRes.payload.ranges || []
      _timelineData.value = {
        apBalance:  ranges.map((r: any) => parseFloat(((r.ap_value ?? 0) / 1_000_000).toFixed(2))),
        apBalanceRaw: ranges.map((r: any) => Number(r.ap_value ?? 0)),
        categories: ranges.map((r: any) => {
          const [y, m] = String(r.start).split('-')
          return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
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

// Batch hold-for-review: items = [{customer(vendor), invoices: [...]}, ...]
// ONE request; backend sends ONE internal mail grouped by vendor to the
// tenant's internal_emails (1/day cooldown per invoice).
async function holdForReview(items: { customer: string, invoices: any[] }[]) {
  try {
    const res: any = await useApi('/ap-report/hold-for-review', { method: 'POST', body: { items } })
    return { ok: true, send: res.send, recipients: res.recipients, results: res.results ?? [] }
  } catch (e: any) {
    return {
      ok: false,
      code: e?.data?.code ?? null,
      status: e?.statusCode ?? e?.status ?? null,
      results: [],
    }
  }
}

export function useAccountsPayablePage() {
  return {
    activeDate:   apActiveDate,
    holdForReview,
    summary:      _summary,
    agingData:    _agingData,
    topCustomers: _topCustomers,
    timelineData: _timelineData,
    loading:      _loading,
    error:        _error,
    snapshotDate:   _snapshotDate,
    requestedDate:  _requestedDate,
    snapshotNotice: _snapshotNotice,
    goLiveDate: _goLiveDate,
    hasInternalEmails: _hasInternalEmails,
    hasMailSettings: _hasMailSettings,
    fetchAll,
  }
}
