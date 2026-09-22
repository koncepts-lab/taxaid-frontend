import { ref, watch, onMounted } from 'vue'

const storageKey = (name: string) => {
  let userId: string | null = null
  try {
    userId = (useAuth().user.value as any)?.id ?? localStorage.getItem('auth_user_id')
  } catch {}
  return `${name}:${userId ?? 'anon'}`
}

const readSession = (name: string) => {
  try {
    const raw = sessionStorage.getItem(storageKey(name))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const writeSession = (name: string, value: any) => {
  try { sessionStorage.setItem(storageKey(name), JSON.stringify(value)) } catch {}
}

const clearSession = (name: string) => {
  try { sessionStorage.removeItem(storageKey(name)) } catch {}
}

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

  // Excel-style column filters — arrays of checked values per column.
  // Empty array = no filter for that column. '(blank)' matches unmapped cells.
  const tbFilters = ref<Record<string, string[]>>({
    fs_code: [], main_group: [], sub_group: [], ledger_name: [],
  })
  // Distinct values per column from GET /opening-balance/filter-options
  const tbFilterOptions = ref<Record<string, string[]>>({
    fs_code: [], main_group: [], sub_group: [], ledger_name: [],
  })

  const fetchFilterOptions = async () => {
    try {
      const res = await useApi('/data-source/opening-balance/filter-options') as any
      if (res?.success && res.data) {
        tbFilterOptions.value = {
          fs_code:     res.data.fs_code     ?? [],
          main_group:  res.data.main_group  ?? [],
          sub_group:   res.data.sub_group   ?? [],
          ledger_name: res.data.ledger_name ?? [],
        }
        for (const col of Object.keys(tbFilters.value)) {
          const valid = new Set(tbFilterOptions.value[col] ?? [])
          tbFilters.value[col] = tbFilters.value[col].filter(v => valid.has(v))
        }
      }
    } catch (e) { console.error('useTrialBalance: filter-options failed', e) }
  }

  const filterQuery = () => {
    const params = new URLSearchParams()
    for (const [col, values] of Object.entries(tbFilters.value)) {
      // All options checked = same as no filter — send nothing
      const all = tbFilterOptions.value[col] ?? []
      if (!values.length || (all.length && values.length === all.length)) continue
      values.forEach(v => params.append(`${col}[]`, v))
    }
    const qs = params.toString()
    return qs ? `&${qs}` : ''
  }

  // Called from the header filter dropdowns; always lands on page 1 so a
  // shrunken result set can't leave the user on a page past the end.
  const applyFilters = async (col: string, values: string[]) => {
    tbFilters.value[col] = values
    await fetchTrialBalance(1, tbPerPage.value)
  }

  // Persists edits across page navigations, keyed by ledger_name — only rows that actually changed.
  const pendingChanges = ref(readSession('tb_pending_changes') ?? {})
  const originalValues = ref<Record<string, { fsCode: string; mainGroup: string; subGroup: string }>>({})

  const saveCurrentPageEdits = () => {
    tbMappingData.value.forEach((row: any) => {
      const original = originalValues.value[row.ledger]
      const isDirty = !original
        || original.fsCode !== row.fsCode
        || original.mainGroup !== row.mainGroup
        || original.subGroup !== row.subGroup

      if (isDirty) {
        pendingChanges.value[row.ledger] = {
          fsCode:    row.fsCode,
          mainGroup: row.mainGroup,
          subGroup:  row.subGroup,
        }
      } else {
        delete pendingChanges.value[row.ledger]
      }
    })
    writeSession('tb_pending_changes', pendingChanges.value)
  }

  watch(tbMappingData, () => saveCurrentPageEdits(), { deep: true })

  const fetchMappingOptions = async () => {
    try {
      const res = await useApi('/ledgers/mapping-options') as any
      if (res?.status === 'success' && res.data) {
        const merge = (master: any[], harvested: any[]) =>
          [...new Set([...(master ?? []), ...(harvested ?? [])])]
        const harvest = (key: string) =>
          [...new Set(tbMappingData.value.map((r: any) => r[key]).filter(Boolean))]
        tbMappingOptions.value = {
          fsCodes:    merge(res.data.fs_codes,    harvest('fsCode')),
          mainGroups: merge(res.data.main_groups, harvest('mainGroup')),
          subGroups:  merge(res.data.sub_groups,  harvest('subGroup')),
        }
      }
    } catch (e) { console.error('useTrialBalance: mapping-options refresh failed', e) }
  }

  const fetchTrialBalance = async (page?: number, perPage?: number) => {
    // Snapshot current page edits before navigating away
    saveCurrentPageEdits()

    if (page    !== undefined) tbPage.value    = page
    if (perPage !== undefined) tbPerPage.value = perPage

    writeSession('tb_mapping_state', {
      page: tbPage.value, perPage: tbPerPage.value, filters: tbFilters.value,
    })

    tbLoading.value = true
    tbError.value   = null

    const [mappingResult, configResult, optionsResult] = await Promise.allSettled([
      useApi(`/data-source/opening-balance?page=${tbPage.value}&per_page=${tbPerPage.value}${filterQuery()}`),
      useApi('/configuration-settings'),
      useApi('/ledgers/mapping-options'),
    ])

    if (mappingResult.status === 'fulfilled') {
      const res: any = mappingResult.value
      if (res?.success && Array.isArray(res.data)) {
        res.data.forEach((r: any) => {
          originalValues.value[r.ledger_name] = {
            fsCode:    r.fs_code    ?? '',
            mainGroup: r.main_group ?? '',
            subGroup:  r.subgroup   ?? '',
          }
        })

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
      const mappings = Object.entries(pendingChanges.value)
        .filter(([, data]: [string, any]) => data.fsCode && data.mainGroup && data.subGroup)
        .map(([ledger_name, data]: [string, any]) => ({
          ledger_name,
          fs_code:    data.fsCode,
          main_group: data.mainGroup,
          sub_group:  data.subGroup,
        }))
      const res: any = await useApi('/ledgers/update-mapping', { method: 'POST', body: { mappings } })

      // Only clear rows the backend actually saved — rejected ones stay pending.
      const saved: string[] = res?.saved ?? mappings.map(m => m.ledger_name)
      saved.forEach(name => delete pendingChanges.value[name])
      writeSession('tb_pending_changes', pendingChanges.value)

      if (Array.isArray(res?.rejected) && res.rejected.length) {
        tbError.value = `${res.rejected.length} row(s) not saved — unrecognized value(s): `
          + res.rejected.map((r: any) => `${r.ledger_name} (${r.reasons.join(', ')})`).join('; ')
      }

      // Refetch current page to update mapped/unmapped counts; refresh the
      // filter option lists too — a save can introduce new group values
      // (stale lists would orphan the new values from the filters).
      await Promise.all([
        fetchTrialBalance(tbPage.value, tbPerPage.value),
        fetchFilterOptions(),
      ])
    } catch (e: any) {
      tbError.value = e?.data?.message ?? e?.message ?? 'Failed to save mapping'
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

  const IMPORT_MAX_BYTES = 10 * 1024 * 1024
  const IMPORT_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  const importOpen     = ref(false)
  const importUploading = ref(false)
  const importLoading   = ref(false)
  const importError     = ref<string | null>(null)
  const importVariance  = ref({ fs_code: [] as string[], main_group: [] as string[], sub_group: [] as string[] })
  const importRows      = ref<any[]>([])
  const importHasFile   = ref(false)

  const putWithProgress = (url: string, file: File) => new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', IMPORT_CONTENT_TYPE)
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error(`Upload failed (${xhr.status})`))
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(file)
  })

  const validateImportFile = (file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.xlsx')) return 'Only .xlsx files are supported.'
    if (file.size > IMPORT_MAX_BYTES) return 'File exceeds the 10MB size limit.'
    return null
  }

  const uploadMappingFile = async (file: File) => {
    importUploading.value = true
    importError.value = null

    const clientError = validateImportFile(file)
    if (clientError) { importError.value = clientError; importUploading.value = false; return }

    // Switch to the preview modal immediately — no gap during upload.
    importHasFile.value = true
    importLoading.value = true

    try {
      const { upload_url }: any = await useApi('/ledgers/mapping-import', { method: 'POST', body: { action: 'upload_url' } })
      await putWithProgress(upload_url, file)
      await previewMappingImport()
    } catch (e: any) {
      importError.value = e?.data?.message ?? e?.message ?? 'Upload failed'
      // Couldn't even get a file onto the bucket — fall back to the upload picker.
      importHasFile.value = false
      importLoading.value = false
    } finally {
      importUploading.value = false
    }
  }

  const previewMappingImport = async () => {
    importLoading.value = true
    importError.value = null
    try {
      const res: any = await useApi('/ledgers/mapping-import', { method: 'POST', body: { action: 'preview' } })
      importVariance.value = res.variance
      importRows.value = res.rows
    } catch (e: any) {
      importError.value = e?.data?.message ?? e?.message ?? 'Preview failed'
    } finally {
      importLoading.value = false
    }
  }

  const confirmMappingImport = async () => {
    importLoading.value = true
    importError.value = null
    try {
      await useApi('/ledgers/mapping-import', { method: 'POST', body: { action: 'confirm' } })
      importOpen.value = false
      importHasFile.value = false
      importRows.value = []
      await Promise.all([
        fetchTrialBalance(tbPage.value, tbPerPage.value),
        fetchFilterOptions(),
        fetchMappingOptions(),
      ])
    } catch (e: any) {
      importError.value = e?.data?.message ?? e?.message ?? 'Import failed'
      throw e
    } finally {
      importLoading.value = false
    }
  }

  const cancelMappingImport = () => {
    useApi('/ledgers/mapping-import', { method: 'POST', body: { action: 'cancel' } }).catch(() => {})
    importOpen.value = false
    importHasFile.value = false
    importRows.value = []
    importVariance.value = { fs_code: [], main_group: [], sub_group: [] }
    importError.value = null
  }

  const downloadMappingTemplate = async () => {
    const config = useRuntimeConfig()
    const token  = useCookie('auth_token')
    const res = await fetch(`${config.public.apiBase}/ledgers/mapping-import/template`, {
      headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
    })
    if (!res.ok) throw new Error('Failed to download template')
    const blob      = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const anchor    = document.createElement('a')
    anchor.href     = objectUrl
    anchor.download = 'Trial_Balance_Mapping_Template.xlsx'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
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
  const tbLogsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })

  const fetchLogs = async (page = 1, perPage = 10) => {
    tbLogsLoading.value = true
    try {
      const result = await useApi(`data-source/upload-logs?module=trial_balance&page=${page}&per_page=${perPage}`) as any
      tbLogs.value = result?.data ?? []
      tbLogsMeta.value = result?.meta ?? tbLogsMeta.value
    } catch { tbLogs.value = [] }
    finally { tbLogsLoading.value = false }
  }

  const loadInitial = async () => {
    const cached = readSession('tb_mapping_state')
    if (cached) {
      if (cached.page)    tbPage.value    = cached.page
      if (cached.perPage) tbPerPage.value = cached.perPage
      if (cached.filters) tbFilters.value = { ...tbFilters.value, ...cached.filters }
    }
    await Promise.all([fetchTrialBalance(), fetchFilterOptions()])
    await fetchLogs()
  }

  return {
    loadInitial,
    tbMappingData,
    tbConfigData,
    tbMappingOptions,
    tbLoading,
    tbSaving,
    tbError,
    tbPage,
    tbPerPage,
    tbMeta,
    tbFilters,
    tbFilterOptions,
    applyFilters,
    fetchFilterOptions,
    fetchTrialBalance,
    fetchMappingOptions,
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
    tbLogsMeta,
    fetchLogs,
    importOpen,
    importUploading,
    importLoading,
    importError,
    importVariance,
    importRows,
    importHasFile,
    uploadMappingFile,
    previewMappingImport,
    confirmMappingImport,
    cancelMappingImport,
    downloadMappingTemplate,
  }
}
