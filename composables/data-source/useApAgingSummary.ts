// composables/useApAgingSummary.ts
// Fetches /data-source/accounts-payable/aging/summary and normalizes the response
// so the AR.vue table can render it (same component, same prop shape as AR).
// Uses useApi so auth token is handled correctly.

export interface ApAgingRow {
  is_total: boolean
  customer: string   // API key is "Customer" for both AR and AP
  amount: number
  not_due: number
  age_0_30: number
  age_31_90: number
  age_91_180: number
  age_gt_180: number
}

export function useApAgingSummary() {
  const rows = ref<ApAgingRow[]>([])
  const totals = ref<ApAgingRow>({
    is_total: true,
    customer: 'Total',
    amount: 0,
    not_due: 0,
    age_0_30: 0,
    age_31_90: 0,
    age_91_180: 0,
    age_gt_180: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Use today's date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().slice(0, 10)

  const fetchSummary = async () => {
    loading.value = true
    error.value = null
    try {
      const response: any = await useApi(
        `data-source/accounts-payable/aging/summary?currentDate=${currentDate}`,
        { method: 'GET' }
      )

      if (response?.status === 'success' && Array.isArray(response.data)) {
        // Map ALL rows (including is_total) so the table body always shows data.
        rows.value = response.data.map((r: any) => ({
          is_total: !!r.is_total,
          customer: r['Customer'] ?? '',
          amount: r['Amount (AED)'] ?? 0,
          not_due: r['not_due'] ?? 0,
          age_0_30: r['<0-30>'] ?? 0,
          age_31_90: r['<31-90>'] ?? 0,
          age_91_180: r['<91-180>'] ?? 0,
          age_gt_180: r['<greater than 180>'] ?? 0,
        }))

        // Populate tfoot totals from the is_total row (if present)
        const totalsRaw = response.data.find((r: any) => r.is_total)
        if (totalsRaw) {
          totals.value = {
            is_total: true,
            customer: totalsRaw['Customer'] ?? 'Total',
            amount: totalsRaw['Amount (AED)'] ?? 0,
            not_due: totalsRaw['not_due'] ?? 0,
            age_0_30: totalsRaw['<0-30>'] ?? 0,
            age_31_90: totalsRaw['<31-90>'] ?? 0,
            age_91_180: totalsRaw['<91-180>'] ?? 0,
            age_gt_180: totalsRaw['<greater than 180>'] ?? 0,
          }
        }
      } else {
        error.value = response?.message ?? 'Failed to fetch AP aging summary'
      }
    } catch (e: any) {
      const raw: string = e?.message ?? ''
      error.value = raw.toLowerCase().includes('failed to fetch') || raw === ''
        ? 'Unable to reach the server. Please check your connection or try again later.'
        : raw
    } finally {
      loading.value = false
    }
  }

  const logs = ref<any[]>([])
  const logsLoading = ref(false)

  const fetchLogs = async () => {
    logsLoading.value = true
    try {
      const result = await useApi('data-source/upload-logs?module=ap') as any
      logs.value = result?.data ?? []
    } catch { logs.value = [] }
    finally { logsLoading.value = false }
  }

  // Initial fetch on composable creation
  fetchSummary()
  fetchLogs()

  return { rows, totals, loading, error, refresh: fetchSummary, logs, logsLoading, fetchLogs }
}
