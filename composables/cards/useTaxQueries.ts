// composables/cards/useTaxQueries.ts
// Real composable for /tax-queries page.
// - VAT tab: live data from GET /tax-queries/vat-summary
// - All other data (tabs, suggestions, deadlines, historyGroups, corporate/ifrs/accounting tableData)
//   still comes from data.json via useWebsiteData so mock content + image paths stay intact

import { ref, computed, onMounted } from 'vue'

export function useTaxQueriesPage() {
    // ── Static / mock data from data.json ─────────────────────────────────────
    const { data, loading, error } = useWebsiteData()
    const tq = computed(() => data.value?.taxQueriesPage ?? {})

    // ── VAT tab — GET /tax-queries/vat-summary ────────────────────────────────
    // API response per row:
    //   { quarter, period, sales_budgeted, sales_recorded_in_vat, variance, variance_percentage }
    // TaxTable expects:
    //   { quarter, budgeted, recorded, variance, variancePercent }
    const vatData    = ref<any[]>([])
    const vatLoading = ref(false)
    const vatError   = ref<string | null>(null)

    const fetchVatSummary = async () => {
        try {
            vatLoading.value = true
            vatError.value   = null

            const response: any = await useApi('tax-queries/vat-summary', { method: 'GET' })

            if (response?.success && Array.isArray(response.data)) {
                vatData.value = response.data.map((row: any) => ({
                    quarter:         row.quarter,
                    budgeted:        row.sales_budgeted        ?? 0,
                    recorded:        row.sales_recorded_in_vat ?? 0,
                    variance:        row.variance              ?? 0,
                    variancePercent: row.variance_percentage   ?? 0,
                }))
            }
        } catch (err: any) {
            vatError.value = err?.message ?? 'Failed to load VAT summary'
            console.error('useTaxQueriesPage: fetchVatSummary failed', err)
        } finally {
            vatLoading.value = false
        }
    }

    // ── Corporate Tax tab ─────────────────────────────────────────────────────
    // TODO: replace mock with GET /tax-queries/corporate-summary when API is ready
    // Expected shape: { quarter, budgeted, recorded, variance, variancePercent }

    // ── IFRS tab ──────────────────────────────────────────────────────────────
    // TODO: replace mock with GET /tax-queries/ifrs-summary when API is ready

    // ── General Accounting tab ────────────────────────────────────────────────
    // TODO: replace mock with GET /tax-queries/accounting-summary when API is ready

    // ── tableData — VAT from API, rest from data.json mock ────────────────────
    const tableData = computed(() => ({
        vat:        vatData.value,
        corporate:  tq.value?.tableData?.corporate  ?? [],
        ifrs:       tq.value?.tableData?.ifrs       ?? [],
        accounting: tq.value?.tableData?.accounting ?? [],
    }))

    // ── Akeel AI chat ─────────────────────────────────────────────────────────
    // TODO: wire to AI chat backend when available — currently mock from data.json
    const suggestions = computed(() => tq.value?.suggestions ?? [])

    // ── Sidebar static data from data.json ────────────────────────────────────
    const tabs          = computed(() => tq.value?.tabs          ?? [])
    const historyGroups = computed(() => tq.value?.historyGroups ?? [])
    // TODO: deadlines — wire to GET /tax-queries/quarter-dates when deadline display logic is defined
    const deadlines     = computed(() => tq.value?.deadlines     ?? [])

    // ── Init ──────────────────────────────────────────────────────────────────
    onMounted(() => fetchVatSummary())

    return {
        loading,
        error,
        vatLoading,
        vatError,
        tableData,
        tabs,
        deadlines,
        suggestions,
        historyGroups,
        fetchVatSummary,
    }
}
