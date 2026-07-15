// composables/data-source/useDataMode.ts
// Per-module hybrid/direct data modes for the data-source page toggles
// (AR / AP / Sales Forecast / Cost Center). Backed by
// GET /data-source/data-modes and PATCH /data-source/data-modes/{module}.
// State is shared app-wide via useState so every sub-tab sees one source
// of truth.

export type DataModeModule = 'ar' | 'ap' | 'sales_forecast' | 'cost_center'
export type DataMode = 'hybrid' | 'direct'

const DEFAULTS: Record<DataModeModule, DataMode> = {
  ar: 'hybrid',
  ap: 'hybrid',
  sales_forecast: 'hybrid',
  cost_center: 'hybrid',
}

export const useDataMode = () => {
  const modes = useState<Record<DataModeModule, DataMode>>('data-modes', () => ({ ...DEFAULTS }))
  const loading = useState<boolean>('data-modes-loading', () => false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  const fetchModes = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await useApi('/data-source/data-modes') as any
      if (result?.data) modes.value = { ...modes.value, ...result.data }
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load data modes.'
    } finally {
      loading.value = false
    }
  }

  const setMode = async (module: DataModeModule, mode: DataMode) => {
    const previous = modes.value[module]
    if (previous === mode) return true

    modes.value = { ...modes.value, [module]: mode } // optimistic
    saving.value = true
    error.value = null
    try {
      const result = await useApi(`/data-source/data-modes/${module}`, {
        method: 'PATCH',
        body: { mode },
      }) as any
      if (result?.data) modes.value = { ...modes.value, ...result.data }
      return true
    } catch (e: any) {
      modes.value = { ...modes.value, [module]: previous } // revert
      error.value = e?.data?.message ?? 'Failed to update data mode.'
      return false
    } finally {
      saving.value = false
    }
  }

  // UI label helpers — the toggles render 'Hybrid' / 'Direct'
  const toLabel = (mode: DataMode) => (mode === 'direct' ? 'Direct' : 'Hybrid')
  const toMode = (label: string): DataMode => (label === 'Direct' ? 'direct' : 'hybrid')

  return { modes, loading, saving, error, fetchModes, setMode, toLabel, toMode }
}
