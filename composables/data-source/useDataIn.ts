// composables/data-source/useDataIn.ts

export interface DataInItem {
  id: string
  label: string
  labelAr: string
  uploadEndpoint: string
  fileField: string
  sampleUrl: string
  isUploaded: boolean
  uploadDate: string | null
  fileName: string | null
  // vat_returns only — last active quarter label + full per-quarter list
  quarter?: string
  returns?: VatReturnItem[]
}

export interface VatReturnItem {
  id: number
  label: string      // "Q2 2026" — UAE FTA quarter-year convention
  quarter: string
  year: number
  period: string | null
  uploadDate: string
  fileName: string | null
  hasFile: boolean
}

export interface VatUploadFields {
  period_from: string // YYYY-MM-DD (from <input type="date">)
  period_to: string   // YYYY-MM-DD
  standard_rated_supplies: number
  zero_rated_supplies: number
  exempted_supplies: number
  standard_rated_expenses: number
}

export interface BudgetItemStatus {
  isUploaded: boolean
  fileName: string | null
  uploadDate: string | null
}

// ── Budget constants ───────────────────────────────────────────────────────────

const BUDGET_UPLOAD_ENDPOINTS: Record<string, string> = {
  'fixed-asset':           '/data-source/budget/upload-fixed-asset',
  'current-asset':         '/data-source/budget/upload-current-asset',
  capital:                 '/data-source/budget/upload-capital',
  'non-current-liability': '/data-source/budget/upload-non-current-liability',
  'current-liability':     '/data-source/budget/upload-current-liability',
  revenue:                 '/data-source/budget/upload-revenue',
  'direct-expense':        '/data-source/budget/upload-direct-expense',
  'general-admin':         '/data-source/budget/upload-general-and-admin',
  salary:                  '/data-source/budget/upload-salary',
}

const BUDGET_GET_ENDPOINTS: Record<string, string> = {
  bs: '/data-source/budget/bs',
  pl: '/data-source/budget/pl',
}

const BUDGET_VIEW_ENDPOINTS: Record<string, string> = {
  bs: '/data-source/budget/bs-data',
  pl: '/data-source/budget/pl-data',
}

export interface BudgetViewRow {
  particulars: string
  months: (number | null)[]
  is_summary?: boolean
  is_gap?: boolean
}

export interface BudgetViewData {
  headers: string[]
  data: BudgetViewRow[]
}

const BUDGET_ALL_IDS = [
  'bs', 'pl', 'fixed-asset', 'current-asset', 'capital',
  'non-current-liability', 'current-liability', 'revenue',
  'direct-expense', 'general-admin', 'salary',
]

// UI tab ids (hyphenated) → backend `statement_type` strings (underscored)
const BUDGET_STATEMENT_TYPE_MAP: Record<string, string> = {
  'fixed-asset':           'fixed_asset',
  'current-asset':         'current_asset',
  capital:                 'capital',
  'non-current-liability': 'non_current_liability',
  'current-liability':     'current_liability',
  revenue:                 'revenue',
  'direct-expense':        'direct_expenses',
  'general-admin':         'general_and_admin',
  salary:                  'salary',
}
const BUDGET_VARIANCE_IDS = Object.keys(BUDGET_STATEMENT_TYPE_MAP)

// Data-in ids → backend `cost_center_type` strings
const COST_CENTER_TYPE_MAP: Record<string, string> = {
  cc_master: 'master',
  cc_budget: 'budget',
  cc_mapping: 'mapping',
}
const COST_CENTER_VARIANCE_IDS = Object.keys(COST_CENTER_TYPE_MAP)

// Data-in ids → backend `direction` strings — PDC is additive-only, no changed/removed case
const PDC_DIRECTION_MAP: Record<string, string> = {
  pdcin: 'in',
  pdcout: 'out',
}
const PDC_VARIANCE_IDS = Object.keys(PDC_DIRECTION_MAP)

const makeBudgetStatuses = (): Record<string, BudgetItemStatus> =>
  Object.fromEntries(BUDGET_ALL_IDS.map(id => [id, { isUploaded: false, fileName: null, uploadDate: null }]))

// ── Mapping cards (Cost Center Mapping / Prepaid Adjustments / Opening Balance) ─

export interface MappingLedgerRow {
  fs_code: string
  main_group: string
  subgroup: string
  ledger_name: string
  value_in_budget?: number
}

export interface MappingMeta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

export interface MappingPage {
  data: MappingLedgerRow[]
  meta: MappingMeta
}

export interface PreviewPage {
  columns: string[]
  data: any[][]
  meta: MappingMeta
}

// ── Composable ─────────────────────────────────────────────────────────────────

export const useDataIn = () => {
  // Hoist to setup context to ensure Nuxt composables resolve correctly
  const config = useRuntimeConfig()
  const token  = useCookie('auth_token')

  // ── Data-in state ──────────────────────────────────────────────────────────
  const items      = ref<DataInItem[]>([])
  const loading    = ref(false)
  const error      = ref<string | null>(null)
  const uploadingId = ref<string | null>(null)

  // ── Budget state ───────────────────────────────────────────────────────────
  const budgetStatuses    = ref<Record<string, BudgetItemStatus>>(makeBudgetStatuses())
  const budgetUploadingId = ref<string | null>(null)
  const budgetFetchingId  = ref<string | null>(null)
  const budgetError       = ref<string | null>(null)
  const budgetViewLoading = ref(false)
  const budgetViewData    = ref<BudgetViewData | null>(null)

  // ── Config / Status ────────────────────────────────────────────────────────
  const fetchConfig = async () => {
    loading.value = true
    error.value   = null
    try {
      const res    = await useApi('/data-source/data-in/config') as any
      items.value  = res.data ?? []
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load data-in config.'
    } finally {
      loading.value = false
    }
  }

  // ── Data-in upload ─────────────────────────────────────────────────────────
  // Use native fetch (not useApi/$fetch) so the POST method is never silently
  // downgraded to GET by Nuxt's $fetch when called outside the setup context.
  const uploadFile = async (id: string, file: File): Promise<void> => {
    const item = items.value.find(i => i.id === id)
    if (!item) throw new Error(`Unknown data-in id: ${id}`)

    uploadingId.value = id
    error.value       = null

    // Strip /api prefix — apiBase already contains it
    const endpoint = item.uploadEndpoint.replace(/^\/api/, '')
    const url      = `${config.public.apiBase}${endpoint}`

    const form = new FormData()
    form.append(item.fileField, file)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
        body: form,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any
        throw new Error(body?.message ?? `Upload failed (${res.status})`)
      }
      await refreshItem(id)
    } finally {
      uploadingId.value = null
    }
  }

  // ── Preview/confirm variance flow — AR/AP + Budget (9 templates + salary) + Cost Center + PDC + Sales Forecast ──
  // 'forecast' needs no extra sub-param (id === backend `type` directly), so it just falls into
  // the generic else-branch in previewUpload/confirmUpload below — no new isXVarianceId needed.
  const VARIANCE_UPLOAD_IDS = ['ar', 'ap', 'forecast', ...BUDGET_VARIANCE_IDS, ...COST_CENTER_VARIANCE_IDS, ...PDC_VARIANCE_IDS]
  const supportsVariancePreview = (id: string) => VARIANCE_UPLOAD_IDS.includes(id)
  const isBudgetVarianceId = (id: string) => BUDGET_VARIANCE_IDS.includes(id)
  const isCostCenterVarianceId = (id: string) => COST_CENTER_VARIANCE_IDS.includes(id)
  const isPdcVarianceId = (id: string) => PDC_VARIANCE_IDS.includes(id)

  const previewing = ref(false)
  const previewError = ref<string | null>(null)
  const confirming = ref(false)

  // Single backend route for the whole flow — dispatches on `mode` (+`type` for preview/confirm).
  const DATA_IN_UPLOAD_URL = () => `${config.public.apiBase}/data-source/data-in/upload`

  const previewUpload = async (id: string, file: File): Promise<any> => {
    if (!VARIANCE_UPLOAD_IDS.includes(id)) throw new Error(`Unknown data-in id: ${id}`)

    previewing.value = true
    previewError.value = null
    try {
      const form = new FormData()
      form.append('mode', 'preview')
      form.append('file', file)
      if (isBudgetVarianceId(id)) {
        form.append('type', 'budget')
        form.append('statement_type', BUDGET_STATEMENT_TYPE_MAP[id])
      } else if (isCostCenterVarianceId(id)) {
        form.append('type', 'cost_center')
        form.append('cost_center_type', COST_CENTER_TYPE_MAP[id])
      } else if (isPdcVarianceId(id)) {
        form.append('type', 'pdc')
        form.append('direction', PDC_DIRECTION_MAP[id])
      } else {
        form.append('type', id)
      }

      const res = await fetch(DATA_IN_UPLOAD_URL(), {
        method: 'POST',
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
        body: form,
      })
      const body = await res.json().catch(() => ({})) as any
      if (!res.ok) throw new Error(body?.message ?? `Preview failed (${res.status})`)
      return body
    } catch (err: any) {
      previewError.value = err?.message ?? 'Preview failed'
      throw err
    } finally {
      previewing.value = false
    }
  }

  const confirmUpload = async (id: string, tempPath: string, excludedLedgers?: string[]): Promise<void> => {
    if (!VARIANCE_UPLOAD_IDS.includes(id)) throw new Error(`Unknown data-in id: ${id}`)

    confirming.value = true
    try {
      const payload: Record<string, any> = { mode: 'confirm', temp_path: tempPath }
      if (excludedLedgers?.length) payload.excluded_ledgers = excludedLedgers
      if (isBudgetVarianceId(id)) {
        payload.type = 'budget'
        payload.statement_type = BUDGET_STATEMENT_TYPE_MAP[id]
      } else if (isCostCenterVarianceId(id)) {
        payload.type = 'cost_center'
        payload.cost_center_type = COST_CENTER_TYPE_MAP[id]
      } else if (isPdcVarianceId(id)) {
        payload.type = 'pdc'
        payload.direction = PDC_DIRECTION_MAP[id]
      } else {
        payload.type = id
      }

      const res = await fetch(DATA_IN_UPLOAD_URL(), {
        method: 'POST',
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any
        throw new Error(body?.message ?? `Confirm failed (${res.status})`)
      }
      if (isBudgetVarianceId(id)) {
        budgetStatuses.value[id] = { isUploaded: true, fileName: null, uploadDate: localIsoDate() }
      } else {
        await refreshItem(id)
      }
    } finally {
      confirming.value = false
    }
  }

  // Best-effort — an abandoned preview also gets reaped later by a cleanup cron either way.
  const cancelPreview = async (tempPath: string): Promise<void> => {
    try {
      await fetch(DATA_IN_UPLOAD_URL(), {
        method: 'POST',
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode: 'cancel', temp_path: tempPath }),
      })
    } catch {
      // ignore — non-fatal
    }
  }

  // ── VAT return upload — POST /tax-queries/vat/upload ──────────────────────
  const vatUploading = ref(false)
  const vatUploadError = ref<string | null>(null)

  // Response includes `document_check` — a parallel box 8/11 comparison read
  // off the PDF (informational status only, never a validation gate).
  const uploadVat = async (fields: VatUploadFields, file: File | null): Promise<any> => {
    vatUploading.value = true
    vatUploadError.value = null

    const url = `${config.public.apiBase}/tax-queries/vat/upload`
    const form = new FormData()
    if (file) form.append('file', file)
    form.append('period_from', fields.period_from)
    form.append('period_to', fields.period_to)
    form.append('standard_rated_supplies', String(fields.standard_rated_supplies))
    form.append('zero_rated_supplies', String(fields.zero_rated_supplies))
    form.append('exempted_supplies', String(fields.exempted_supplies))
    form.append('standard_rated_expenses', String(fields.standard_rated_expenses))

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
        body: form,
      })
      const body = await res.json().catch(() => ({})) as any
      if (!res.ok) {
        throw new Error(body?.message ?? `VAT upload failed (${res.status})`)
      }
      return body
    } catch (err: any) {
      vatUploadError.value = err?.message ?? 'VAT upload failed'
      throw err
    } finally {
      vatUploading.value = false
    }
  }

  // ── VAT certificate preview — GET /tax-queries/vat/returns/{id}/file ──────
  // Returns a blob object URL for inline viewing (iframe), not download.
  // Caller must URL.revokeObjectURL() when done.
  const fetchVatFileUrl = async (id: number): Promise<string> => {
    const blob = await useApi(`/tax-queries/vat/returns/${id}/file`, { responseType: 'blob' }) as Blob
    return URL.createObjectURL(blob)
  }

  // ── Data-in sample download ────────────────────────────────────────────────
  const downloadSample = async (id: string): Promise<void> => {
    const item     = items.value.find(i => i.id === id)
    const endpoint = item?.sampleUrl ? item.sampleUrl.replace(/^\/api/, '') : `/data-source/data-in/sample/${id}`
    const blob      = await useApi(endpoint, { responseType: 'blob' }) as Blob
    const objectUrl = URL.createObjectURL(blob)
    const anchor    = document.createElement('a')
    anchor.href     = objectUrl
    anchor.download = `${id}_Template.xlsx`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  const downloadMappingTemplate = async (filled: boolean): Promise<void> => {
    const endpoint = `/data-source/cost-center/mapping-import/template${filled ? '?filled=1' : ''}`
    const blob = await useApi(endpoint, { responseType: 'blob' }) as Blob
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filled ? 'Cost_Center_Mapping_Filled_Template.xlsx' : 'Cost_Center_Mapping_Template.xlsx'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  // ── Data-in remove (resets local state) ───────────────────────────────────
  const removeItem = (id: string): void => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.isUploaded = false
      item.uploadDate = null
      item.fileName   = null
    }
  }

  const refreshItem = async (id: string): Promise<void> => {
    try {
      const res     = await useApi('/data-source/data-in/config') as any
      const updated = (res.data ?? []).find((i: DataInItem) => i.id === id)
      if (updated) {
        const idx = items.value.findIndex(i => i.id === id)
        if (idx !== -1) items.value[idx] = updated
      }
    } catch {
      // Non-fatal
    }
  }

  // ── Budget upload ──────────────────────────────────────────────────────────
  const budgetUploadFile = async (id: string, file: File): Promise<void> => {
    const endpoint = BUDGET_UPLOAD_ENDPOINTS[id]
    if (!endpoint) return
    budgetUploadingId.value = id
    budgetError.value       = null
    const url  = `${config.public.apiBase}${endpoint}`
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
        body:    form,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any
        budgetError.value = body?.message ?? `Upload failed for ${id} (${res.status})`
        throw new Error(budgetError.value ?? `Upload failed for ${id}`)
      }
      budgetStatuses.value[id] = { isUploaded: true, fileName: file.name, uploadDate: localIsoDate() }
    } catch (err: any) {
      if (!budgetError.value) budgetError.value = err?.message ?? `Upload failed for ${id}`
      throw err
    } finally {
      budgetUploadingId.value = null
    }
  }

  // ── Budget upload status — restore state from backend on mount ───────────
  const fetchBudgetStatuses = async (): Promise<void> => {
    try {
      const json = await useApi('/data-source/budget/upload-status') as any
      const data = json?.data ?? {}
      for (const [id, status] of Object.entries(data) as any[]) {
        budgetStatuses.value[id] = {
          isUploaded: status.isUploaded,
          fileName:   null,
          uploadDate: status.uploadDate,
        }
      }
    } catch {
      // Non-fatal — statuses just stay false
    }
  }

  // ── Budget sync (BS / P&L) — computes and saves to DB ────────────────────
  const budgetFetchGet = async (id: string, year?: number): Promise<void> => {
    const endpoint = BUDGET_GET_ENDPOINTS[id]
    if (!endpoint) return
    budgetFetchingId.value = id
    budgetError.value      = null
    const y = year ?? new Date().getFullYear()
    try {
      await useApi(`${endpoint}?year=${y}`)
      budgetStatuses.value[id] = {
        isUploaded: true,
        fileName:   budgetStatuses.value[id]?.fileName ?? null,
        uploadDate: localIsoDate(),
      }
    } catch (err: any) {
      budgetError.value = err?.data?.message ?? err?.message ?? `Sync failed for ${id}`
    } finally {
      budgetFetchingId.value = null
    }
  }

  // ── Budget view data (BS / P&L display) ───────────────────────────────────
  const budgetFetchViewData = async (id: string, _year?: number): Promise<BudgetViewData | null> => {
    const endpoint = BUDGET_VIEW_ENDPOINTS[id]
    if (!endpoint) return null
    budgetViewLoading.value = true
    budgetError.value       = null
    const y = _year ?? new Date().getFullYear()
    try {
      const json = await useApi(`${endpoint}?year=${y}`) as any
      budgetViewData.value = json as BudgetViewData
      return budgetViewData.value
    } catch (err: any) {
      budgetError.value = err?.data?.message ?? err?.message ?? `Failed to load ${id} data`
      return null
    } finally {
      budgetViewLoading.value = false
    }
  }

  // ── Budget sample download — GET /data-source/budget/sample/{id} ───────────
  const budgetDownloadSample = async (id: string): Promise<void> => {
    const blob      = await useApi(`/data-source/budget/sample/${id}`, { responseType: 'blob' }) as Blob
    const objectUrl = URL.createObjectURL(blob)
    const anchor    = document.createElement('a')
    anchor.href     = objectUrl
    anchor.download = `budget_${id}_template.xlsx`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  // ── Cost Center Mapping ────────────────────────────────────────────────────
  const fetchCostCenterMappingLedgers = async (page = 1, perPage = 20, mapped?: boolean): Promise<MappingPage> => {
    const mappedParam = mapped === undefined ? '' : `&mapped=${mapped ? 1 : 0}`
    const res = await useApi(`/data-source/cost-center/pl-grouped-report-ledgers?page=${page}&per_page=${perPage}${mappedParam}`) as any
    return { data: res?.data ?? [], meta: res?.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: perPage } }
  }

  const fetchCostCenterOptions = async (): Promise<string[]> => {
    const res = await useApi('/data-source/cost-center/project-names') as any
    return res?.data ?? []
  }

  const saveCostCenterMappings = async (mappings: Array<{ fs_code: string, main_group: string, subgroup: string, ledger_name: string, cost_center: string }>): Promise<void> => {
    await useApi('/data-source/cost-center/cost-center-mappings', { method: 'POST', body: { mappings } })
  }

  // ── Prepaid Adjustments ────────────────────────────────────────────────────
  const fetchPrepaidLedgers = async (year?: number, page = 1, perPage = 20): Promise<MappingPage> => {
    const y = year ?? new Date().getFullYear()
    const res = await useApi(`/data-source/prepaid-expense-ledgers?year=${y}&page=${page}&per_page=${perPage}`) as any
    return { data: res?.data ?? [], meta: res?.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: perPage } }
  }

  const savePrepaidAdjustments = async (entries: Array<Record<string, any>>): Promise<void> => {
    await useApi('/data-source/prepaid-adjustments', { method: 'POST', body: { entries } })
  }

  // ── Opening Balance ────────────────────────────────────────────────────────
  const fetchOpeningBalanceLedgers = async (page = 1, perPage = 20): Promise<MappingPage> => {
    const res = await useApi(`/data-source/opening-balance?page=${page}&per_page=${perPage}`) as any
    const data = (res?.data ?? []).map((r: any) => ({
      fs_code: r.fs_code,
      main_group: r.main_group,
      subgroup: r.subgroup,
      ledger_name: r.ledger_name,
    }))
    return { data, meta: res?.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: perPage } }
  }

  const saveOpeningBalances = async (balances: Array<{ fs_code: string, main_group: string, sub_group: string, ledger_name: string, opening_balance: number }>): Promise<void> => {
    await useApi('/data-source/opening-balance/store', { method: 'POST', body: { balances } })
  }

  // ── Preview + Excel download ────────────────────────────────────────────────
  const dataPreviewLoading = ref(false)
  const dataPreviewError   = ref<string | null>(null)

  const emptyPreviewPage = (perPage: number): PreviewPage => ({
    columns: [],
    data: [],
    meta: { current_page: 1, last_page: 1, total: 0, per_page: perPage },
  })

  const fetchDataInPreview = async (cardId: string, page = 1, perPage = 20): Promise<PreviewPage> => {
    dataPreviewLoading.value = true
    dataPreviewError.value   = null
    try {
      const res = await useApi(`/data-source/data-in/${cardId}/view?page=${page}&per_page=${perPage}`) as any
      return { columns: res?.columns ?? [], data: res?.data ?? [], meta: res?.meta ?? emptyPreviewPage(perPage).meta }
    } catch (err: any) {
      dataPreviewError.value = err?.data?.message ?? err?.message ?? 'Failed to load preview'
      return emptyPreviewPage(perPage)
    } finally {
      dataPreviewLoading.value = false
    }
  }

  const fetchBudgetPreview = async (categoryId: string, year?: number, page = 1, perPage = 20): Promise<PreviewPage> => {
    dataPreviewLoading.value = true
    dataPreviewError.value   = null
    const y = year ?? new Date().getFullYear()
    try {
      const res = await useApi(`/data-source/budget/${categoryId}/view?year=${y}&page=${page}&per_page=${perPage}`) as any
      return { columns: res?.columns ?? [], data: res?.data ?? [], meta: res?.meta ?? emptyPreviewPage(perPage).meta }
    } catch (err: any) {
      dataPreviewError.value = err?.data?.message ?? err?.message ?? 'Failed to load preview'
      return emptyPreviewPage(perPage)
    } finally {
      dataPreviewLoading.value = false
    }
  }

  const downloadFile = async (endpoint: string, filename: string): Promise<void> => {
    const blob      = await useApi(endpoint, { responseType: 'blob' }) as Blob
    const objectUrl = URL.createObjectURL(blob)
    const anchor    = document.createElement('a')
    anchor.href     = objectUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  const downloadDataInPreview = (cardId: string) =>
    downloadFile(`/data-source/data-in/${cardId}/download`, `${cardId}_${new Date().toISOString().slice(0, 10)}.xlsx`)

  const downloadBudgetPreview = (categoryId: string, year?: number) => {
    const y = year ?? new Date().getFullYear()
    return downloadFile(`/data-source/budget/${categoryId}/download?year=${y}`, `${categoryId}_budget_${y}.xlsx`)
  }

  return {
    // data-in
    items, loading, error, uploadingId,
    fetchConfig, uploadFile, downloadSample, downloadMappingTemplate, removeItem,
    // preview/confirm variance flow (AR/AP + Budget + Cost Center + PDC)
    supportsVariancePreview, isBudgetVarianceId, isCostCenterVarianceId, isPdcVarianceId, previewing, previewError, confirming,
    previewUpload, confirmUpload, cancelPreview,
    // budget
    budgetStatuses, budgetUploadingId, budgetFetchingId, budgetError,
    budgetViewLoading, budgetViewData,
    budgetUploadFile, budgetFetchGet, budgetFetchViewData, budgetDownloadSample, fetchBudgetStatuses,
    // vat
    vatUploading, vatUploadError, uploadVat, fetchVatFileUrl,
    // mapping cards
    fetchCostCenterMappingLedgers, fetchCostCenterOptions, saveCostCenterMappings,
    fetchPrepaidLedgers, savePrepaidAdjustments,
    fetchOpeningBalanceLedgers, saveOpeningBalances,
    // preview + Excel download
    dataPreviewLoading, dataPreviewError,
    fetchDataInPreview, fetchBudgetPreview, downloadDataInPreview, downloadBudgetPreview,
  }
}
