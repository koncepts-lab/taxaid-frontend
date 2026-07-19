/**
 * useAccountsReceivable
 * Fetches live AR data from the backend and transforms it into the shapes
 * expected by the AR components (Summary, TopCustomers, AgingGraph, HistoricalMovement).
 *
 * Shared state: activeDate is global so the page and all components stay in sync.
 */

const todayYMD = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const arActiveDate = ref(todayYMD())

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

// Hybrid gap-day fallback: the backend answers with the latest upload
// snapshot on or before the requested date. When they differ we snap
// activeDate to the snapshot and show a notice under the calendar.
const _snapshotDate   = ref<string | null>(null)
const _requestedDate  = ref<string | null>(null)
const _snapshotNotice = ref(false)

async function fetchAll() {
  _loading.value = true
  _error.value   = null
  const date = arActiveDate.value
  const strict = ENABLE_SNAPSHOT_FALLBACK ? '' : '&strict_date=1'

  try {
    // 1. Summary table (/ar-report)
    const summaryRes: any = await useApi(`/ar-report?test_date=${date}${strict}`)

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
    const topRes: any = await useApi(`/ar-report/top-eight?test_date=${date}${strict}`)
    if (topRes?.status === 'success' && topRes.payload?.top_customers) {
      const customers = topRes.payload.top_customers
      const totalAR   = topRes.payload.total_ar_value ?? 1

      const customersData = customers.map((c: any, i: number) => ({
        id:      `C${i + 1}`,
        name:    c.customer,
        nameAr:  c.customer,
        value:   parseFloat((c.value / 1_000_000).toFixed(2)),
      }))

      let running = 0
      const cumulativeLine = customers.map((c: any) => {
        running += (totalAR > 0 ? Math.round((c.value / totalAR) * 100) : 0)
        return running
      })

      _topCustomers.value = { customersData, cumulativeLine }
    }

    // 3. Aging graph (/ar-report/aging)
    const agingRes: any = await useApi(`/ar-report/aging?test_date=${date}${strict}`)
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

      _agingGraph.value = { agingCategories: categories, percentOfTotal, previousYearData, currentYearData, cumulativeData }
    }

    // 4. Historical movement (/ar-report/timeline)
    const timelineRes: any = await useApi(`/ar-report/timeline?test_date=${date}`)
    if (timelineRes?.status === 'success' && timelineRes.payload?.ranges) {
      const ranges = timelineRes.payload.ranges

      const categories = ranges.map((r: any) => {
        const d = new Date(r.start)
        return d.toLocaleString('en-US', { month: 'short' })
      })
      const arBalance  = ranges.map((r: any) => parseFloat(((r.ar_value ?? 0) / 1_000_000).toFixed(2)))
      const percentage = ranges.map(() => 0)

      _historicalMovement.value = { categories, arBalance, percentage }
    }

  } catch (e: any) {
    _error.value = e?.message ?? 'Failed to load AR data'
  } finally {
    _loading.value = false
  }
}

// ── Payment reminders ────────────────────────────────────────────────────────
// Map of contact emails by customer name (lowercased) — used for the
// "email not added" tooltip; fetched once from the contacts registry.
const _contactEmails = ref<Record<string, string>>({})

async function fetchContactEmails() {
  try {
    const res: any = await useApi('/data-source/customers')
    const map: Record<string, string> = {}
    for (const c of res?.data ?? []) {
      if (c?.name) map[String(c.name).trim().toLowerCase()] = c.email ?? ''
    }
    _contactEmails.value = map
  } catch { _contactEmails.value = {} }
}

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
    contactEmails:      _contactEmails,
    fetchAll,
    fetchContactEmails,
    sendReminders,
  }
}
