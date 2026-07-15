import { useDataMode } from './useDataMode'

export const useSalesForecast = () => {
  const data        = ref<any[]>([])
  const loading     = ref(false)
  const error       = ref<string | null>(null)

  // Persisted tenant mode drives the toggle; the backend reads the stored
  // mode itself, so /formatted is called without a mode param.
  const { modes, fetchModes, setMode, toLabel, toMode } = useDataMode()
  const activeMode = computed(() => toLabel(modes.value.sales_forecast))

  const fetch = async (date?: string) => {
    loading.value = true
    error.value   = null
    try {
      const result = await useApi('/data-source/sales-forecast/formatted', {
        params: { ...(date ? { date } : {}) },
      }) as any
      data.value = result?.data ?? []
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load sales forecast.'
    } finally {
      loading.value = false
    }
  }

  // Toggle click: persist the mode, then re-fetch so the table follows it.
  const changeMode = async (label: string) => {
    const ok = await setMode('sales_forecast', toMode(label))
    if (ok) await fetch()
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

  onMounted(async () => {
    await fetchModes()
    fetch()
    fetchLogs()
  })

  return { data, loading, error, activeMode, changeMode, fetch, logs, logsLoading, fetchLogs }
}
