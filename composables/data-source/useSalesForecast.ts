export const useSalesForecast = () => {
  const data        = ref<any[]>([])
  const loading     = ref(false)
  const error       = ref<string | null>(null)
  const activeMode  = ref('Hybrid')

  const fetch = async (date?: string) => {
    loading.value = true
    error.value   = null
    try {
      const mode   = activeMode.value === 'Direct' ? 'direct' : 'hybrid'
      const result = await useApi('/data-source/sales-forecast/formatted', {
        params: { mode, ...(date ? { date } : {}) },
      }) as any
      data.value = result?.data ?? []
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load sales forecast.'
    } finally {
      loading.value = false
    }
  }

  const logs = ref<any[]>([])
  const logsLoading = ref(false)

  const fetchLogs = async () => {
    logsLoading.value = true
    try {
      const result = await useApi('data-source/upload-logs?module=sales_forecast') as any
      logs.value = result?.data ?? []
    } catch { logs.value = [] }
    finally { logsLoading.value = false }
  }

  watch(activeMode, () => fetch())
  onMounted(() => { fetch(); fetchLogs() })

  return { data, loading, error, activeMode, fetch, logs, logsLoading, fetchLogs }
}
