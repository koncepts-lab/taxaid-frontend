/**
 * useAccountsReceivable
 * Fetches live AR data from the backend and transforms it into the shapes
 * expected by the AR components (Summary, TopCustomers, AgingGraph, HistoricalMovement).
 *
 * Shared state: activeDate is global so the page and all components stay in sync.
 */

export const arActiveDate = ref('2024-07-04')

const _summary            = ref<any[]>([])
const _topCustomers       = ref<any>({})
const _agingGraph         = ref<any>({})
const _historicalMovement = ref<any>({})
const _loading            = ref(false)
const _error              = ref<string | null>(null)

async function fetchAll() {
  _loading.value = true
  _error.value   = null
  const date = arActiveDate.value

  try {
    // 1. Summary table (/ar-report)
    const summaryRes: any = await useApi(`/ar-report?test_date=${date}`)
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
    const topRes: any = await useApi(`/ar-report/top-eight?test_date=${date}`)
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
    const agingRes: any = await useApi(`/ar-report/aging?test_date=${date}`)
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

export function useAccountsReceivablePage() {
  return {
    activeDate:         arActiveDate,
    summary:            _summary,
    topCustomers:       _topCustomers,
    agingGraph:         _agingGraph,
    historicalMovement: _historicalMovement,
    loading:            _loading,
    error:              _error,
    fetchAll,
  }
}
