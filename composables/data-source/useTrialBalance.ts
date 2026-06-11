import { ref, onMounted } from 'vue'

export function useTrialBalance() {
  const tbMappingData    = ref<any[]>([])
  const tbConfigData     = ref<any[]>([])
  const tbMappingOptions = ref<{ fsCodes: string[], mainGroups: string[], subGroups: string[] }>({
    fsCodes: [], mainGroups: [], subGroups: [],
  })
  const tbLoading = ref(false)
  const tbSaving  = ref(false)
  const tbError   = ref<string | null>(null)

  const fetchTrialBalance = async () => {
    tbLoading.value = true
    tbError.value   = null

    const [mappingResult, configResult, optionsResult] = await Promise.allSettled([
      useApi('/data-source/opening-balance'),
      useApi('/configuration-settings'),
      useApi('/ledgers/mapping-options'),
    ])

    if (mappingResult.status === 'fulfilled') {
      const res: any = mappingResult.value
      if (res?.success && Array.isArray(res.data)) {
        const rows = res.data.map((r: any) => ({
          id:        r.id ?? r.ledger_name,
          fsCode:    r.fs_code    ?? '',
          mainGroup: r.main_group ?? '',
          subGroup:  r.subgroup   ?? '',
          ledger:    r.ledger_name ?? '',
        }))
        tbMappingData.value = rows

        // Derive dropdown options from live ledger data
        tbMappingOptions.value = {
          fsCodes:    [...new Set(rows.map((r: any) => r.fsCode).filter(Boolean))]    as string[],
          mainGroups: [...new Set(rows.map((r: any) => r.mainGroup).filter(Boolean))] as string[],
          subGroups:  [...new Set(rows.map((r: any) => r.subGroup).filter(Boolean))]  as string[],
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

    // Override options with MappingMaster data if it has entries
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

  const updateTrialBalance = async (rows: any[]) => {
    tbSaving.value = true
    tbError.value  = null
    try {
      const mappings = rows.map((r: any) => ({
        ledger_name: r.ledger,
        fs_code:     r.fsCode,
        main_group:  r.mainGroup,
        sub_group:   r.subGroup,
      }))
      await useApi('/ledgers/update-mapping', { method: 'POST', body: { mappings } })
    } catch (e: any) {
      tbError.value = e?.message ?? 'Failed to save mapping'
      throw e
    } finally {
      tbSaving.value = false
    }
  }

  onMounted(() => fetchTrialBalance())

  return {
    tbMappingData,
    tbConfigData,
    tbMappingOptions,
    tbLoading,
    tbSaving,
    tbError,
    fetchTrialBalance,
    updateTrialBalance,
  }
}
