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
        // Saving auto-locks the table backend-side; only POST /configuration-settings/unlock releases it
        configLocked.value = !!res.meta?.is_locked
      }
    } else {
      console.error('useTrialBalance: configuration-settings failed', (configResult as PromiseRejectedResult).reason)
    }

    if (optionsResult.status === 'fulfilled') {
      const res: any = optionsResult.value
      if (res?.status === 'success' && res.data) {
        // Union: master vocabulary first (authoritative for new picks), then
        // any values already in use on this tenant's mappings. Replacing
        // instead of merging left selects blank when a saved value (e.g. a
        // Tally-derived subgroup) wasn't in the master list.
        const merge = (master: any[], harvested: any[]) =>
          [...new Set([...(master ?? []), ...(harvested ?? [])])]
        tbMappingOptions.value = {
          fsCodes:    merge(res.data.fs_codes,    tbMappingOptions.value.fsCodes),
          mainGroups: merge(res.data.main_groups, tbMappingOptions.value.mainGroups),
          subGroups:  merge(res.data.sub_groups,  tbMappingOptions.value.subGroups),
        }
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

  const configLocked = ref(false)

  const updateConfigSettings = async (configItems: any[]) => {
    const settings = configItems.map((r: any) => ({
      particulars: r.label,
      from: r.from != null ? String(r.from) : null,
      to:   r.to   != null ? String(r.to)   : null,
    }))
    await useApi('/configuration-settings', { method: 'POST', body: { settings } })
    // Backend auto-locks on save; refetch picks up meta.is_locked = true
    await fetchTrialBalance(tbPage.value, tbPerPage.value)
  }

  const unlockConfigSettings = async () => {
    await useApi('/configuration-settings/unlock', { method: 'POST' })
    await fetchTrialBalance(tbPage.value, tbPerPage.value)
  }

  // Integrity Check — POST /data-source/trial-balance/verify (DB-based checks)
  const integrityData = ref([
    { label: 'Trial balance',   isValid: null },
    { label: 'Balance Sheet',   isValid: null },
    { label: 'Profit and loss', isValid: null },
  ])
  const integrityLoading = ref(false)
  const integrityMeta = ref({ unmappedCount: 0, missingCount: 0, isMappingComplete: true })
  // Per-year failure detail for the "Data Integrity Error Detected" modal.
  // Fresh array on every run so the component's watcher fires each time.
  const integrityIssues = ref<any[]>([])

  const runIntegrityCheck = async () => {
    integrityLoading.value = true
    try {
      const res = await useApi('/data-source/trial-balance/verify', { method: 'POST' }) as any
      if (res?.overall) {
        integrityData.value = [
          { label: 'Trial balance',   isValid: !!res.overall.trial_balance },
          { label: 'Balance Sheet',   isValid: !!res.overall.balance_sheet },
          { label: 'Profit and loss', isValid: !!res.overall.profit_and_loss },
        ]
        integrityMeta.value = {
          unmappedCount:     res.mapping?.unmapped_count ?? 0,
          missingCount:      res.mapping?.missing_count ?? 0,
          isMappingComplete: !!res.mapping?.is_complete,
        }

        const issues: any[] = []
        for (const [label, p] of Object.entries((res.periods ?? {}) as Record<string, any>)) {
          const failed: string[] = []
          if (p.check_net_profit && p.check_net_profit.status !== 'PASSED') failed.push('Profit and Loss')
          if ((p.check_total_capital && p.check_total_capital.status !== 'PASSED') ||
              (p.check_assets_vs_liabilities && p.check_assets_vs_liabilities.status !== 'PASSED')) failed.push('Balance Sheet')
          if (p.check_trial_balance_dr_cr && p.check_trial_balance_dr_cr.status !== 'PASSED') failed.push('Trial Balance')
          if (p.error) failed.push('Report generation failed')
          if (failed.length) issues.push({ year: p.period ?? label, label, failed })
        }
        integrityIssues.value = issues
      }
    } catch (e) {
      console.error('useTrialBalance: integrity check failed', e)
    } finally {
      integrityLoading.value = false
    }
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
    configLocked,
    unlockConfigSettings,
    integrityData,
    integrityLoading,
    integrityMeta,
    integrityIssues,
    runIntegrityCheck,
    tbLogs,
    tbLogsLoading,
    fetchLogs,
  }
}
