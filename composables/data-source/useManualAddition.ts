// composables/data-source/useManualAddition.ts
// Single composable for all 4 manual-addition forms (lead, contract, pdc in/out).
// All payloads are shaped exactly as the backend validation expects.

export const useManualAddition = () => {
  const debtorLedgers = useState<string[]>('ma_debtor_ledgers', () => [])
  const costHeads = useState<string[]>('ma_cost_heads', () => [])
  const leadIds = useState<string[]>('ma_lead_ids', () => [])
  const leadDetails = useState<any>('ma_lead_details', () => null)

  const loading = useState<boolean>('ma_loading', () => false)
  const saving = useState<boolean>('ma_saving', () => false)
  const error = useState<string>('ma_error', () => '')
  const success = useState<string>('ma_success', () => '')

  // dd-mm-yyyy (form) -> yyyy-mm-dd (backend). Passes through if already ISO.
  const toApiDate = (value: string): string => {
    if (!value) return ''
    const v = value.trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    const m = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
    if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
    return v
  }

  const toNumber = (value: any): number => {
    const n = parseFloat(String(value ?? '').replace(/,/g, ''))
    return isNaN(n) ? 0 : n
  }

  const extractError = (err: any): string => {
    const data = err?.data || err?.response?._data
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      return Array.isArray(first) ? String(first[0]) : String(first)
    }
    return data?.message || err?.message || 'Something went wrong'
  }

  const clearMessages = () => { error.value = ''; success.value = '' }

  // ---------- Dropdown data ----------

  const fetchDebtorLedgers = async () => {
    try {
      const res: any = await useApi('/data-source/leads/ledger-list')
      debtorLedgers.value = res?.data || []
    } catch (err) { error.value = extractError(err) }
  }

  const fetchCostHeads = async () => {
    try {
      const res: any = await useApi('/data-source/leads/cost-heads')
      costHeads.value = res?.data || []
    } catch (err) { error.value = extractError(err) }
  }

  const fetchLeadIds = async () => {
    try {
      const res: any = await useApi('/data-source/leads/contracts/list-ids')
      leadIds.value = res?.data || []
    } catch (err) { error.value = extractError(err) }
  }

  const fetchLeadDetails = async (leadId: string) => {
    loading.value = true
    try {
      const res: any = await useApi(`/data-source/leads/contracts/${encodeURIComponent(leadId)}/details`)
      leadDetails.value = res?.data || null
      return leadDetails.value
    } catch (err) {
      error.value = extractError(err)
      leadDetails.value = null
      return null
    } finally { loading.value = false }
  }

  // ---------- Variance calculators (backend is source of truth) ----------

  const calcSalesVariance = async (leadSalesValue: number, finalContractValue: number): Promise<number> => {
    try {
      const res: any = await useApi('/data-source/leads/contracts/sales-variance', {
        method: 'POST',
        body: { 'Lead Sales Value': leadSalesValue, 'Final Contract Value': finalContractValue }
      })
      return res?.data?.['Sales Variance'] ?? 0
    } catch (err) { error.value = extractError(err); return 0 }
  }

  const calcBudgetVariance = async (plannedLeadBudget: number, currentBudgetValue: number): Promise<number> => {
    try {
      const res: any = await useApi('/data-source/leads/contracts/budget-variance', {
        method: 'POST',
        body: { 'Planned Lead Budget': plannedLeadBudget, 'Current Budget Value': currentBudgetValue }
      })
      return res?.data?.['Budget Variance'] ?? 0
    } catch (err) { error.value = extractError(err); return 0 }
  }

  const applySalesMilestone = async (totalMilestoneValue: number, finalContractValue: number, finalValue: number) => {
    try {
      const res: any = await useApi('/data-source/contracts/apply-sales-milestone', {
        method: 'POST',
        body: {
          'Total Milestone Value': totalMilestoneValue,
          'Final Contract Value': finalContractValue,
          'Final Value': finalValue
        }
      })
      return res?.data || null
    } catch (err) { error.value = extractError(err); return null }
  }

  const applyBudgetMilestone = async (totalBudgetAllocation: number, currentBudgetValue: number, finalValue: number) => {
    try {
      const res: any = await useApi('/data-source/contracts/apply-budget-milestone', {
        method: 'POST',
        body: {
          'Total Budget Allocation': totalBudgetAllocation,
          'Current Budget Value': currentBudgetValue,
          'Final Value': finalValue
        }
      })
      return res?.data || null
    } catch (err) { error.value = extractError(err); return null }
  }

  // ---------- Saves ----------

  const saveLead = async (payload: any) => {
    clearMessages()
    saving.value = true
    try {
      const res: any = await useApi('/data-source/leads', { method: 'POST', body: payload })
      success.value = res?.message || 'Lead created successfully'
      return res?.data || null
    } catch (err) {
      error.value = extractError(err)
      return null
    } finally { saving.value = false }
  }

  const saveContract = async (payload: any) => {
    clearMessages()
    saving.value = true
    try {
      const res: any = await useApi('/data-source/contracts', { method: 'POST', body: payload })
      success.value = res?.message || 'Contract saved successfully'
      return res?.data || null
    } catch (err) {
      error.value = extractError(err)
      return null
    } finally { saving.value = false }
  }

  // POST /adjustments/ap/manual-adjustment — single AP entry.
  // Backend signs the amount itself: purchase => +abs, payment => -abs.
  const saveApAdjustment = async (payload: any) => {
    clearMessages()
    saving.value = true
    try {
      const res: any = await useApi('/adjustments/ap/manual-adjustment', { method: 'POST', body: payload })
      success.value = res?.message || 'AP manual adjustment created successfully'
      return res?.data || null
    } catch (err) {
      error.value = extractError(err)
      return null
    } finally { saving.value = false }
  }

  const savePdc = async (type: 'in' | 'out', payload: any) => {
    clearMessages()
    saving.value = true
    try {
      const res: any = await useApi(`/data-source/pdc/${type}`, { method: 'POST', body: payload })
      success.value = res?.message || 'PDC records created successfully'
      return res?.data || null
    } catch (err) {
      error.value = extractError(err)
      return null
    } finally { saving.value = false }
  }

  return {
    debtorLedgers, costHeads, leadIds, leadDetails,
    loading, saving, error, success,
    toApiDate, toNumber, clearMessages,
    fetchDebtorLedgers, fetchCostHeads, fetchLeadIds, fetchLeadDetails,
    calcSalesVariance, calcBudgetVariance, applySalesMilestone, applyBudgetMilestone,
    saveLead, saveContract, savePdc, saveApAdjustment
  }
}
