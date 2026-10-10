/**
 * useAccountsReceivable
 * Fetches live AR data from the backend and transforms it into the shapes
 * expected by the AR components (Summary, TopCustomers, AgingGraph, HistoricalMovement).
 *
 * Shared state: activeDate is global so the page and all components stay in sync.
 */

export const arActiveDate = ref('')

// ── GAP-DAY FALLBACK TOGGLE ────────────────────────────────────────────────
// true (default, also the behavior if this line is missing): a date with no
// uploaded AR snapshot shows the LATEST upload on or before it, the shared
// date state snaps to that snapshot, and the page shows a notice.
// false: strict legacy behavior — the exact requested date only, empty when
// nothing was uploaded that day (backend gets ?strict_date=1).
const ENABLE_SNAPSHOT_FALLBACK = true
// ───────────────────────────────────────────────────────────────────────────

const _summary            = ref<any[]>([])
const _topCustomers       = ref<any>({})
const _agingGraph         = ref<any>({})
const _historicalMovement = ref<any>({})
const _loading            = ref(false)
const _error              = ref<string | null>(null)
const _hasMailSettings    = ref(true)

// Hybrid gap-day fallback: the backend answers with the latest upload
// snapshot on or before the requested date. When they differ we snap
// activeDate to the snapshot and show a notice under the calendar.
const _snapshotDate   = ref<string | null>(null)
const _requestedDate  = ref<string | null>(null)
const _snapshotNotice = ref(false)
const _goLiveDate     = ref<string | null>(null)

async function fetchAll(clearCache = false) {
  _loading.value = true
  _error.value   = null
  let date = arActiveDate.value
  const strict = !ENABLE_SNAPSHOT_FALLBACK
  const withDate = (path: string, useStrict = true) => {
    const parts: string[] = []
    if (date) parts.push(`date=${date}`)
    if (useStrict && strict) parts.push('strict_date=1')
    // Reload button passes clearCache=true — per-key cache wipe, all param variants.
    if (clearCache) parts.push(`clear_cache=${clearCache === 'all' ? 'all' : 'true'}`)
    return parts.length ? `${path}?${parts.join('&')}` : path
  }

  try {
    // 1. Summary table (/ar-report)
    const summaryRes: any = await useApi(withDate('/ar-report'))

    if (!date && summaryRes?.requested_date) {
      date = summaryRes.requested_date
      arActiveDate.value = date
    }

    _goLiveDate.value = summaryRes?.go_live_date ?? null
    _hasMailSettings.value = summaryRes?.has_mail_settings ?? true
    useState('cardPeriod').value = summaryRes?.period ?? null
    useState('cardToday').value = summaryRes?.today ?? null

    if (ENABLE_SNAPSHOT_FALLBACK && summaryRes?.snapshot_date) {
      _requestedDate.value  = summaryRes.requested_date ?? date
      _snapshotDate.value   = summaryRes.snapshot_date
      _snapshotNotice.value = summaryRes.snapshot_date !== (summaryRes.requested_date ?? date)
      if (_snapshotNotice.value) {
        // snap the shared date state to what is actually shown
        arActiveDate.value = summaryRes.snapshot_date
      }
    } else {
      _snapshotNotice.value = false
    }

    if (summaryRes?.status === 'success' && Array.isArray(summaryRes.data)) {
      _summary.value = summaryRes.data
        .filter((r: any) => !r.isTotal)
        .map((r: any) => ({
          label:     r.customer,
          labelAr:   r.customer,
          total:     r.amount,
          age30:     r.bucket_0_30,
          age3060:   r.bucket_31_60,
          age6090:   r.bucket_61_90,
          age90plus: (r.bucket_91_180 ?? 0) + (r.bucket_181_365 ?? 0) + (r.bucket_365_plus ?? 0),
          invoices:  [],
        }))
    }

    // 2. Top customers chart (/ar-report/top-eight)
    const topRes: any = await useApi(withDate('/ar-report/top-eight'))
    if (topRes?.status === 'success' && topRes.payload?.top_customers) {
      const customers = topRes.payload.top_customers
      const totalAR   = topRes.payload.total_ar_value ?? 1

      const customersData = customers.map((c: any, i: number) => ({
        id:      `C${i + 1}`,
        name:    c.customer,
        nameAr:  c.customer,
        value:   parseFloat((c.value / 1_000_000).toFixed(2)),
        valueRaw: Number(c.value) || 0,
        percentage: c.percentage ?? '0%',
      }))

      let running = 0
      const cumulativeLine = customers.map((c: any) => {
        running += (totalAR > 0 ? Math.round((c.value / totalAR) * 100) : 0)
        return running
      })

      _topCustomers.value = { customersData, cumulativeLine }
    }

    // 3. Aging graph (/ar-report/aging)
    const agingRes: any = await useApi(withDate('/ar-report/aging'))
    if (agingRes?.status === 'success' && agingRes.payload?.comparison_data) {
      const compData = agingRes.payload.comparison_data
      const toM = (v: any) => parseFloat(((v ?? 0) / 1_000_000).toFixed(2))

      const current  = (compData[0]?.aging_summary ?? []).slice(0, 4)
      const previous = (compData[1]?.aging_summary ?? []).slice(0, 4)

      const currentYearData  = current.map((b: any) => toM(b.value))
      const previousYearData = previous.map((b: any) => toM(b.value))

      const categories = [
        { en: 'Overdue >30 Days',   ar: 'متأخر أكثر من 30 يوم' },
        { en: 'Overdue 30-60 Days', ar: 'متأخر 30-60 يوم' },
        { en: 'Overdue 60-90 Days', ar: 'متأخر 60-90 يوم' },
        { en: 'Overdue <90 Days',   ar: 'متأخر أقل من 90 يوم' },
      ]

      const totalCurrent = current.reduce((s: number, b: any) => s + (b.value ?? 0), 0)
      let runningPct = 0
      const cumulativeData = current.map((b: any) => {
        runningPct += totalCurrent > 0 ? Math.round(((b.value ?? 0) / totalCurrent) * 100) : 0
        return runningPct
      })
      const percentOfTotal = current.map((b: any) =>
        totalCurrent > 0 ? Math.round(((b.value ?? 0) / totalCurrent) * 100) : 0
      )

      const previousYearRaw = previous.map((b: any) => Number(b.value) || 0)
      const currentYearRaw  = current.map((b: any) => Number(b.value) || 0)

      _agingGraph.value = { agingCategories: categories, percentOfTotal, previousYearData, currentYearData, previousYearRaw, currentYearRaw, cumulativeData }
    }

    // 4. Historical movement (/ar-report/timeline)
    const timelineRes: any = await useApi(withDate('/ar-report/timeline', false))
    if (timelineRes?.status === 'success' && timelineRes.payload?.ranges) {
      const ranges = timelineRes.payload.ranges

      const categories = ranges.map((r: any) => {
        const [y, m] = String(r.start).split('-')
        return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      })
      const arBalance  = ranges.map((r: any) => parseFloat(((r.ar_value ?? 0) / 1_000_000).toFixed(2)))
      const percentage = ranges.map(() => 0)

      const arBalanceRaw = ranges.map((r: any) => Number(r.ar_value ?? 0))

      _historicalMovement.value = { categories, arBalance, arBalanceRaw, percentage }
    }

  } catch (e: any) {
    _error.value = e?.message ?? 'Failed to load AR data'
  } finally {
    _loading.value = false
  }
}

// ── Payment reminders ────────────────────────────────────────────────────────
// Batch send: items = [{customer, invoices: [...]}, ...] — ONE request; the
// backend sends one mail per customer with all its invoices (1/day cooldown).
async function sendReminders(items: { customer: string, invoices: any[] }[]) {
  try {
    const res: any = await useApi('/ar-report/send-reminders', { method: 'POST', body: { items } })
    return { ok: true, results: res.results ?? [] }
  } catch (e: any) {
    return {
      ok: false,
      code: e?.data?.code ?? null,
      message: e?.data?.message ?? 'Failed to send reminders.',
      results: [],
    }
  }
}

async function fetchCustomerInvoicesBatch(customerNames: string[], perPage = 10) {
  if (!customerNames.length) return {}
  try {
    const res: any = await useApi('/ar-report/customer-details-batch', {
      method: 'POST',
      body: { customers: customerNames, date: arActiveDate.value, per_page: perPage }
    })
    if (res?.status !== 'success' || !Array.isArray(res.results)) return {}

    const map: Record<string, any> = {}
    for (const r of res.results) map[r.customer] = r
    return map
  } catch {
    return {}
  }
}

export function useAccountsReceivablePage() {
  return {
    activeDate:         arActiveDate,
    summary:            _summary,
    topCustomers:       _topCustomers,
    agingGraph:         _agingGraph,
    historicalMovement: _historicalMovement,
    loading:            _loading,
    error:              _error,
    snapshotDate:       _snapshotDate,
    requestedDate:      _requestedDate,
    snapshotNotice:     _snapshotNotice,
    goLiveDate:         _goLiveDate,
    hasMailSettings:    _hasMailSettings,
    fetchAll,
    sendReminders,
    fetchCustomerInvoicesBatch,
  }
}
