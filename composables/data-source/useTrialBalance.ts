import { ref, onMounted } from 'vue'

export function useTrialBalance() {
  const tbMappingData    = ref([])
  const tbConfigData     = ref([])
  const tbMappingOptions = ref({ fsCodes: [], mainGroups: [], subGroups: [] })
  const tbLoading = ref(false)
  const tbSaving  = ref(false)
  const tbError   = ref(null)

  const tbPage    = ref(1)
  const tbPerPage = ref(10) // ← change this to set the default rows per page (options: 10, 20, 30, 40)
  const tbMeta    = ref({
    current_page:   1,
    last_page:      1,
    total:          0,
    per_page:       10, // ← keep in sync with tbPerPage above
    mapped_count:   0,
    unmapped_count: 0,
  })

  // Persists edits across page navigations, keyed by ledger_name
  const pendingChanges = ref({})

  const saveCurrentPageEdits = () => {
    tbMappingData.value.forEach((row: any) => {
      pendingChanges.value[row.ledger] = {
        fsCode:    row.fsCode,
        mainGroup: row.mainGroup,
        subGroup:  row.subGroup,
      }
    })
  }

  const fetchTrialBalance = async (page?: number, perPage?: number) => {
    // Snapshot current page edits before navigating away
    saveCurrentPageEdits()

    if (page    !== undefined) tbPage.value    = page
    if (perPage !== undefined) tbPerPage.value = perPage

    tbLoading.value = true
    tbError.value   = null

    const [mappingResult, configResult, optionsResult] = await Promise.allSettled([
      useApi(`/data-source/opening-balance?page=${tbPage.value}&per_page=${tbPerPage.value}`),
      useApi('/configuration-settings'),
      useApi('/ledgers/mapping-options'),
    ])

    if (mappingResult.status === 'fulfilled') {
      const res: any = mappingResult.value
      if (res?.success && Array.isArray(res.data)) {
        tbMappingData.value = res.data.map((r: any) => {
          // Merge with any pending (unsaved) edits for this ledger
          const pending = (pendingChanges.value as any)[r.ledger_name]
          return {
            id:        r.ledger_name,
            fsCode:    pending?.fsCode    ?? r.fs_code    ?? '',
            mainGroup: pending?.mainGroup ?? r.main_group ?? '',
            subGroup:  pending?.subGroup  ?? r.subgroup   ?? '',
            ledger:    r.ledger_name ?? '',
          }
        })

        if (res.meta) {
          tbMeta.value = {
            current_page:   res.meta.current_page   ?? 1,
            last_page:      res.meta.last_page       ?? 1,
            total:          res.meta.total           ?? 0,
            per_page:       res.meta.per_page        ?? tbPerPage.value,
            mapped_count:   res.meta.mapped_count    ?? 0,
            unmapped_count: res.meta.unmapped_count  ?? 0,
          }
        }

        tbMappingOptions.value = {
          fsCodes:    [...new Set(tbMappingData.value.map((r: any) => r.fsCode).filter(Boolean))],
          mainGroups: [...new Set(tbMappingData.value.map((r: any) => r.mainGroup).filter(Boolean))],
          subGroups:  [...new Set(tbMappingData.value.map((r: any) => r.subGroup).filter(Boolean))],
        }
      }
    } else {
      console.error('useTrialBalance: opening-balance failed', (mappingResult as PromiseRejectedResult).reason)
    }

    if (configResult.status === 'fulfilled') {
      const res: any = configResult.value
      if (res?.success && Array.isArray(res.data)) {
        tbConfigData.value = res.data.map((r: any) => ({
          label:  r.particulars,
          from:   r.from ?? null,
          to:     r.to   ?? null,
          isYear: r.particulars === 'Historical data since',
        }))
      }
    } else {
      console.error('useTrialBalance: configuration-settings failed', (configResult as PromiseRejectedResult).reason)
    }

    if (optionsResult.status === 'fulfilled') {
      const res: any = optionsResult.value
      if (res?.status === 'success' && res.data) {
        const fsCodes    = res.data.fs_codes    ?? []
        const mainGroups = res.data.main_groups ?? []
        const subGroups  = res.data.sub_groups  ?? []
        if (fsCodes.length)    tbMappingOptions.value.fsCodes    = fsCodes
        if (mainGroups.length) tbMappingOptions.value.mainGroups = mainGroups
        if (subGroups.length)  tbMappingOptions.value.subGroups  = subGroups
      }
    }

    tbLoading.value = false
  }

  const updateTrialBalance = async () => {
    // Snapshot current page before sending
    saveCurrentPageEdits()

    tbSaving.value = true
    tbError.value  = null
    try {
      const mappings = Object.entries(pendingChanges.value).map(([ledger_name, data]: [string, any]) => ({
        ledger_name,
        fs_code:    data.fsCode,
        main_group: data.mainGroup,
        sub_group:  data.subGroup,
      }))
      await useApi('/ledgers/update-mapping', { method: 'POST', body: { mappings } })
      // Clear pending after successful save
      pendingChanges.value = {}
      // Refetch current page to update mapped/unmapped counts
      await fetchTrialBalance(tbPage.value, tbPerPage.value)
    } catch (e: any) {
      tbError.value = e?.message ?? 'Failed to save mapping'
      throw e
    } finally {
      tbSaving.value = false
    }
  }

  const updateConfigSettings = async (configItems: any[]) => {
    const settings = configItems.map((r: any) => ({
      particulars: r.label,
      from: r.from != null ? String(r.from) : null,
      to:   r.to   != null ? String(r.to)   : null,
    }))
    await useApi('/configuration-settings', { method: 'POST', body: { settings } })
    await fetchTrialBalance(tbPage.value, tbPerPage.value)
  }

  const tbLogs = ref([])
  const tbLogsLoading = ref(false)

  const fetchLogs = async () => {
    tbLogsLoading.value = true
    try {
      const result = await useApi('data-source/upload-logs?module=trial_balance') as any
      tbLogs.value = result?.data ?? []
    } catch { tbLogs.value = [] }
    finally { tbLogsLoading.value = false }
  }

  onMounted(() => { fetchTrialBalance(); fetchLogs() })

  return {
    tbMappingData,
    tbConfigData,
    tbMappingOptions,
    tbLoading,
    tbSaving,
    tbError,
    tbPage,
    tbPerPage,
    tbMeta,
    fetchTrialBalance,
    updateTrialBalance,
    updateConfigSettings,
    tbLogs,
    tbLogsLoading,
    fetchLogs,
  }
}
