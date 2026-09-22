// composables/cards/useTaxQueries.ts
// Real composable for /tax-queries page.
// - VAT tab: live data from GET /tax-queries/vat-summary
// - All other data (tabs, suggestions, deadlines, historyGroups, corporate/ifrs/accounting tableData)
//   are placeholders until their APIs exist

import { ref, computed, onMounted } from 'vue'

export function useTaxQueriesPage() {
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ── VAT tab — GET /tax-queries/vat-summary ────────────────────────────────
    // API response per row:
    //   { quarter, period, sales_budgeted, sales_recorded_in_vat, variance, variance_percentage }
    // TaxTable expects:
    //   { quarter, budgeted, recorded, variance, variancePercent }
    const vatData    = ref<any[]>([])
    const vatLoading = ref(false)
    const vatError   = ref<string | null>(null)
    const vatMessage = ref<string | null>(null)
    const vatYears   = ref<number[]>([])
    const selectedVatYear = ref<number | null>(null)

    const fetchVatSummary = async (year?: number | null) => {
        try {
            vatLoading.value = true
            vatError.value   = null
            vatMessage.value = null

            const query = year ? `?year=${year}` : ''
            const response: any = await useApi(`tax-queries/vat-summary${query}`, { method: 'GET' })

            if (response?.success && Array.isArray(response.data)) {
                vatData.value = response.data.map((row: any) => ({
                    quarter:                 row.quarter,
                    budgeted:                row.sales_budgeted            ?? 0,
                    recorded:                row.sales_recorded_in_vat     ?? 0,
                    variance:                row.variance                  ?? 0,
                    variancePercent:         row.variance_percentage       ?? 0,
                    standardRatedSupplies:   row.standard_rated_supplies   ?? 0,
                    zeroRatedSupplies:       row.zero_rated_supplies       ?? 0,
                    exemptedSupplies:        row.exempted_supplies         ?? 0,
                    standardRatedExpenses:   row.standard_rated_expenses   ?? 0,
                }))
                vatMessage.value = response.message ?? null
                vatYears.value = Array.isArray(response.years) ? response.years : []

                // First load fetches without a year filter (all uploads). Years come
                // from actual uploaded returns — a tenant may have started at Q3/Q4,
                // or mid-year, so never assume a Q1..Q4 calendar grid. Default the
                // dropdown to the latest year with data and narrow the table to it.
                if (selectedVatYear.value === null && vatYears.value.length) {
                    selectedVatYear.value = vatYears.value[0]
                    if (vatYears.value.length > 1) {
                        await fetchVatSummary(selectedVatYear.value)
                        return
                    }
                }
            }
        } catch (err: any) {
            vatError.value = err?.message ?? 'Failed to load VAT summary'
            console.error('useTaxQueriesPage: fetchVatSummary failed', err)
        } finally {
            vatLoading.value = false
        }
    }

    const changeVatYear = (year: number) => {
        selectedVatYear.value = year
        fetchVatSummary(year)
    }

    // ── VAT deadline — GET /tax-queries/vat-deadline ──────────────────────────
    const vatDeadline = ref<{ label: string; date: string; color: string } | null>(null)

    const fetchVatDeadline = async () => {
        try {
            const response: any = await useApi('tax-queries/vat-deadline', { method: 'GET' })
            if (response?.success && response.data) {
                vatDeadline.value = {
                    label: `VAT Return Date (${response.data.quarter} ${response.data.year})`,
                    date:  response.data.deadline,
                    color: 'orange-50',
                }
            }
        } catch (err: any) {
            console.error('useTaxQueriesPage: fetchVatDeadline failed', err)
        }
    }

    // ── Corporate Tax tab ─────────────────────────────────────────────────────
    // TODO: replace mock with GET /tax-queries/corporate-summary when API is ready
    // Expected shape: { quarter, budgeted, recorded, variance, variancePercent }

    // ── IFRS tab ──────────────────────────────────────────────────────────────
    // TODO: replace mock with GET /tax-queries/ifrs-summary when API is ready

    // ── General Accounting tab ────────────────────────────────────────────────
    // TODO: replace mock with GET /tax-queries/accounting-summary when API is ready

    // ── tableData — only VAT is live; Corporate Tax / IFRS / General Accounting show a placeholder ──
    const tableData = computed(() => ({
        vat: vatData.value,
    }))

    // VAT deadline is real, from GET /tax-queries/vat-deadline
    const deadlines = computed(() => (vatDeadline.value ? [vatDeadline.value] : []))

    // ── Init ──────────────────────────────────────────────────────────────────
    onMounted(() => {
        fetchVatSummary()
        fetchVatDeadline()
    })

    return {
        loading,
        error,
        vatLoading,
        vatError,
        vatMessage,
        vatYears,
        selectedVatYear,
        tableData,
        deadlines,
        fetchVatSummary,
        fetchVatDeadline,
        changeVatYear,
    }
}
