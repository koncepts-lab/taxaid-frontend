export const useCostCenter = () => {
  const mappingColumns = [
    { label: 'FS Code',     labelAr: 'كود FS',        key: 'fsCode'     },
    { label: 'Main Group',  labelAr: 'المجموعة الرئيسية', key: 'mainGroup' },
    { label: 'Sub Group',   labelAr: 'المجموعة الفرعية',  key: 'subGroup'  },
    { label: 'Ledger Name', labelAr: 'اسم الحساب',    key: 'ledgerName' },
  ]

  const mappingData = ref<any[]>([])
  const loading     = ref(false)
  const error       = ref<string | null>(null)

  const fetchMappingData = async () => {
    loading.value = true
    error.value   = null
    try {
      const result = await useApi('/data-source/cost-center/pl-grouped-report-ledgers') as any
      mappingData.value = (result?.data ?? []).map((row: any) => ({
        fsCode:     row.fs_code    ?? '',
        mainGroup:  row.main_group ?? '',
        subGroup:   row.subgroup   ?? '',
        ledgerName: row.ledger_name ?? '',
      }))
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load cost center mapping.'
    } finally {
      loading.value = false
    }
  }

  // Contract Master report
  const contractData    = ref<any[]>([])
  const contractTotal   = ref('0.00')
  const contractLoading = ref(false)

  const contractActiveCount = computed(() =>
    contractData.value.filter((r: any) => r.status === 'Active').length
  )

  const fetchContractMaster = async () => {
    contractLoading.value = true
    try {
      const result = await useApi('/data-source/cost-center/contract-master') as any
      contractData.value  = result?.data  ?? []
      contractTotal.value = result?.total ?? '0.00'
    } catch { contractData.value = []; contractTotal.value = '0.00' }
    finally { contractLoading.value = false }
  }

  // Budget Cost Center report
  const budgetReportColumns = ref<any[]>([])
  const budgetReportData    = ref<any[]>([])
  const budgetReportTotal   = ref('0.00')
  const budgetReportLoading = ref(false)

  const fetchBudgetReport = async () => {
    budgetReportLoading.value = true
    try {
      const result = await useApi('/data-source/cost-center/budget-report') as any
      budgetReportColumns.value = result?.columns ?? []
      budgetReportData.value    = result?.data    ?? []
      budgetReportTotal.value   = result?.total   ?? '0.00'
    } catch { budgetReportColumns.value = []; budgetReportData.value = []; budgetReportTotal.value = '0.00' }
    finally { budgetReportLoading.value = false }
  }

  const logs = ref<any[]>([])
  const logsLoading = ref(false)

  const fetchLogs = async () => {
    logsLoading.value = true
    try {
      const result = await useApi('data-source/upload-logs?module=cost_center') as any
      logs.value = result?.data ?? []
    } catch { logs.value = [] }
    finally { logsLoading.value = false }
  }

  onMounted(() => { fetchMappingData(); fetchContractMaster(); fetchBudgetReport(); fetchLogs() })

  return {
    mappingColumns, mappingData, loading, error, fetchMappingData,
    contractData, contractTotal, contractActiveCount, contractLoading, fetchContractMaster,
    budgetReportColumns, budgetReportData, budgetReportTotal, budgetReportLoading, fetchBudgetReport,
    logs, logsLoading, fetchLogs,
  }
}
