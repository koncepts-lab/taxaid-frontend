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

const makeBudgetStatuses = (): Record<string, BudgetItemStatus> =>
  Object.fromEntries(BUDGET_ALL_IDS.map(id => [id, { isUploaded: false, fileName: null, uploadDate: null }]))

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

  // ── VAT return upload — POST /tax-queries/vat/upload ──────────────────────
  const vatUploading = ref(false)
  const vatUploadError = ref<string | null>(null)

  const uploadVat = async (fields: VatUploadFields, file: File | null): Promise<void> => {
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
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any
        throw new Error(body?.message ?? `VAT upload failed (${res.status})`)
      }
    } catch (err: any) {
      vatUploadError.value = err?.message ?? 'VAT upload failed'
      throw err
    } finally {
      vatUploading.value = false
    }
  }

  // ── Data-in sample download ────────────────────────────────────────────────
  const downloadSample = async (id: string): Promise<void> => {
    const url = `${config.public.apiBase}/data-source/data-in/sample/${id}`
    const res = await fetch(url, {
      headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
    })
    if (!res.ok) throw new Error(`Failed to download sample for ${id}`)
    const blob      = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const anchor    = document.createElement('a')
    anchor.href     = objectUrl
    const disposition = res.headers.get('Content-Disposition') ?? ''
    const match       = disposition.match(/filename="?([^"]+)"?/)
    anchor.download   = match?.[1] ?? `${id}_Template.xlsx`
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
      budgetStatuses.value[id] = { isUploaded: true, fileName: file.name, uploadDate: new Date().toLocaleDateString() }
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
      const res = await fetch(`${config.public.apiBase}/data-source/budget/upload-status`, {
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
      })
      if (!res.ok) return
      const json = await res.json() as any
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
    const y   = year ?? new Date().getFullYear()
    const url = `${config.public.apiBase}${endpoint}?year=${y}`
    try {
      const res = await fetch(url, {
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any
        budgetError.value = body?.message ?? `Sync failed for ${id} (${res.status})`
        return
      }
      budgetStatuses.value[id] = {
        isUploaded: true,
        fileName:   budgetStatuses.value[id]?.fileName ?? null,
        uploadDate: new Date().toLocaleDateString(),
      }
    } catch (err: any) {
      budgetError.value = err?.message ?? `Sync failed for ${id}`
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
    const y   = _year ?? new Date().getFullYear()
    const url = `${config.public.apiBase}${endpoint}?year=${y}`
    try {
      const res = await fetch(url, {
        headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any
        budgetError.value = body?.message ?? `Failed to load ${id} data (${res.status})`
        return null
      }
      const json = await res.json() as any
      budgetViewData.value = json as BudgetViewData
      return budgetViewData.value
    } catch (err: any) {
      budgetError.value = err?.message ?? `Failed to load ${id} data`
      return null
    } finally {
      budgetViewLoading.value = false
    }
  }

  // ── Budget sample download — GET /data-source/budget/sample/{id} ───────────
  const budgetDownloadSample = async (id: string): Promise<void> => {
    const url = `${config.public.apiBase}/data-source/budget/sample/${id}`
    const res = await fetch(url, {
      headers: { Authorization: token.value ? `Bearer ${token.value}` : '' },
    })
    if (!res.ok) throw new Error(`Failed to download budget sample for ${id}`)
    const blob      = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const anchor    = document.createElement('a')
    anchor.href     = objectUrl
    const disposition = res.headers.get('Content-Disposition') ?? ''
    const match       = disposition.match(/filename="?([^"]+)"?/)
    anchor.download   = match?.[1] ?? `budget_${id}_template.xlsx`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  return {
    // data-in
    items, loading, error, uploadingId,
    fetchConfig, uploadFile, downloadSample, removeItem,
    // budget
    budgetStatuses, budgetUploadingId, budgetFetchingId, budgetError,
    budgetViewLoading, budgetViewData,
    budgetUploadFile, budgetFetchGet, budgetFetchViewData, budgetDownloadSample, fetchBudgetStatuses,
    // vat
    vatUploading, vatUploadError, uploadVat,
  }
}
