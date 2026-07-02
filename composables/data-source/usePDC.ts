// composables/data-source/usePDC.ts
// PDC tab for /data-source page.
// Summary cards : GET /data-source/pdc/in/summary  + GET /data-source/pdc/out/summary
// Detailed modal: GET /data-source/pdc/in           + GET /data-source/pdc/out
//
// API key-name differences (backend inconsistency):
//   PDC In summary  → "Total PDC issued", "Due in the next 30 days", "Due in the next 45 days"
//   PDC Out summary → total_amount, amount_within_30_days, amount_within_45_days
//
// Detail API does not return issueDate — modal column shows '-' for now.

import { ref, onMounted } from 'vue'

export function usePDC() {
    // ── Summary cards ─────────────────────────────────────────────────────
    const pdcGroups    = ref<any[]>([])
    const summaryLoading = ref(false)
    const summaryError   = ref<string | null>(null)

    const fetchSummary = async () => {
        try {
            summaryLoading.value = true
            summaryError.value   = null

            const [inRes, outRes]: any[] = await Promise.all([
                useApi('data-source/pdc/in/summary',  { method: 'GET' }),
                useApi('data-source/pdc/out/summary', { method: 'GET' }),
            ])

            pdcGroups.value = [
                {
                    type:        'received',
                    label:       'PDC Received',
                    labelAr:     'الشيكات المستلمة',
                    totalLabel:  'Total PDC Received',
                    totalAmount: inRes?.data?.['Total PDC issued']        ?? 0,
                    due30:       inRes?.data?.['Due in the next 30 days']  ?? 0,
                    due45:       inRes?.data?.['Due in the next 45 days']  ?? 0,
                },
                {
                    type:        'issued',
                    label:       'PDC Issued',
                    labelAr:     'الشيكات المصدرة',
                    totalLabel:  'Total PDC Issued',
                    totalAmount: outRes?.data?.total_amount          ?? 0,
                    due30:       outRes?.data?.amount_within_30_days ?? 0,
                    due45:       outRes?.data?.amount_within_45_days ?? 0,
                },
            ]
        } catch (err: any) {
            summaryError.value = err?.message ?? 'Failed to load PDC summary'
            console.error('usePDC: fetchSummary failed', err)
        } finally {
            summaryLoading.value = false
        }
    }

    // ── Detailed modal data ───────────────────────────────────────────────
    const pdcDetailedData  = ref<any[]>([])
    const pdcDetailedTotal = ref<number>(0)
    const detailLoading    = ref(false)
    const detailError      = ref<string | null>(null)

    const fetchDetailed = async (type: 'issued' | 'received') => {
        const endpoint = type === 'issued'
            ? 'data-source/pdc/out'
            : 'data-source/pdc/in'
        try {
            detailLoading.value  = true
            detailError.value    = null
            const response: any = await useApi(endpoint, { method: 'GET' })
            pdcDetailedTotal.value = response?.total_amount ?? 0
            if (Array.isArray(response?.data)) {
                pdcDetailedData.value = response.data.map((row: any) => ({
                    issueDate:  '-',
                    chequeDate: row['Cheque Date'] ?? '-',
                    bankName:   row['Bank Name']   ?? '-',
                    chequeNo:   row['Cheque No.']  ?? '-',
                    partyName:  row['Party Name']  ?? '-',
                    amount:     row['Amount']       ?? 0,
                }))
            }
        } catch (err: any) {
            detailError.value = err?.message ?? 'Failed to load PDC details'
            console.error('usePDC: fetchDetailed failed', err)
        } finally {
            detailLoading.value = false
        }
    }

    const logs = ref<any[]>([])
    const logsLoading = ref(false)

    const fetchLogs = async () => {
        logsLoading.value = true
        try {
            const result = await useApi('data-source/upload-logs?module=pdc') as any
            logs.value = result?.data ?? []
        } catch { logs.value = [] }
        finally { logsLoading.value = false }
    }

    onMounted(() => { fetchSummary(); fetchLogs() })

    return {
        pdcGroups,
        summaryLoading,
        summaryError,
        pdcDetailedData,
        pdcDetailedTotal,
        detailLoading,
        detailError,
        fetchSummary,
        fetchDetailed,
        logs,
        logsLoading,
        fetchLogs,
    }
}
