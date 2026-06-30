const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'] as const

function toMonthRow(row: any, extras: Record<string, any> = {}) {
  const obj: Record<string, any> = { ...extras }
  let total = 0
  ;(row.months as number[] ?? []).forEach((v: number, i: number) => {
    obj[MONTHS[i]] = v
    total += v
  })
  obj.total = total
  return obj
}

function transformSummaryRow(row: any) {
  const base: Record<string, any> = { name: row.particulars ?? '' }
  if (row.is_gap) {
    return { ...base, type: 'header', ...Object.fromEntries(MONTHS.map(k => [k, null])), total: null }
  }
  if (row.is_summary) base.type = 'net-row'
  return toMonthRow(row, base)
}

function transformDetailedRow(row: any) {
  const base: Record<string, any> = {
    mainGroup: row.main_group ?? '',
    subGroup:  row.sub_group  ?? '',
    name:      row.particulars ?? '',
  }
  if (row.is_group_total)   base.type = 'net-row'
  else if (row.is_subgroup_total) base.type = 'header'
  return toMonthRow(row, base)
}

function transformSalaryRow(row: any) {
  const base: Record<string, any> = {
    empNo: row.employee_no ?? '',
    name:  row.staff_name  ?? '',
  }
  if (row.is_summary) base.type = 'net-row'
  return toMonthRow(row, base)
}

export const useBudget = () => {
  const year    = ref(new Date().getFullYear())
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const plData     = ref<any[]>([])
  const bsData     = ref<any[]>([])
  const salaryData = ref<any[]>([])

  const monthHeaders = ref<string[]>([])

  const fetchPL = async () => {
    const result = await useApi(`/data-source/budget/pl-data`, { params: { year: year.value } }) as any
    monthHeaders.value = result?.headers ?? []
    plData.value = (result?.data ?? []).map(transformSummaryRow)
  }

  const fetchBS = async () => {
    const result = await useApi(`/data-source/budget/bs-data`, { params: { year: year.value } }) as any
    bsData.value = (result?.data ?? []).map(transformSummaryRow)
  }

  const fetchDetailed = async (type: string): Promise<any[]> => {
    const result = await useApi(`/data-source/budget/detailed-report`, { params: { year: year.value, type } }) as any
    return (result?.data ?? []).map(transformDetailedRow)
  }

  const fetchSalary = async () => {
    const result = await useApi(`/data-source/budget/salary-detailed`, { params: { year: year.value } }) as any
    salaryData.value = (result?.data ?? []).map(transformSalaryRow)
  }

  const loadAll = async () => {
    loading.value = true
    error.value   = null
    try {
      await Promise.all([fetchPL(), fetchBS()])
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load budget data.'
    } finally {
      loading.value = false
    }
  }

  const openDetailedReport = async (itemId: string): Promise<any[]> => {
    const typeMap: Record<string, string> = {
      b_fixed_assets:    'fixed_asset',
      b_current_assets:  'current_asset',
      b_capital:         'capital',
      b_non_current_liab:'non_current_liability',
      b_current_liab:    'current_liability',
      b_revenue:         'revenue',
      b_indirect_income: 'other_indirect_income',
      b_direct_exp:      'direct_expenses',
      b_indirect_exp:    'general_and_admin',
    }
    if (itemId === 'b_salaries') {
      await fetchSalary()
      return salaryData.value
    }
    if (typeMap[itemId]) {
      return fetchDetailed(typeMap[itemId])
    }
    if (itemId === 'b_profit_loss')   return plData.value
    if (itemId === 'b_balance_sheet') return bsData.value
    return []
  }

  const logs = ref<any[]>([])
  const logsLoading = ref(false)

  const fetchLogs = async () => {
    logsLoading.value = true
    try {
      const result = await useApi('data-source/upload-logs?module=budget') as any
      logs.value = result?.data ?? []
    } catch { logs.value = [] }
    finally { logsLoading.value = false }
  }

  onMounted(() => { loadAll(); fetchLogs() })

  return {
    year, loading, error,
    plData, bsData, salaryData, monthHeaders,
    openDetailedReport, loadAll,
    logs, logsLoading, fetchLogs,
  }
}
