export interface ExportProgress {
  stage: 'idle' | 'preparing' | 'downloading'
  percent: number | null
}

export interface ExportResult {
  ok: boolean
  message?: string
}

export const useExport = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')
  const currentLang = useState('currentLang', () => 'en')

  const exporting = useState<boolean>('export_busy', () => false)
  const exportError = useState<string | null>('export_error', () => null)
  const progress = useState<ExportProgress>('export_progress', () => ({ stage: 'idle', percent: null }))

  const authHeaders = () => ({
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
  })

  const buildQuery = (params: Record<string, any>) => {
    const query = new URLSearchParams({ type: 'xlsx', lang: currentLang.value === 'ar' ? 'ar' : 'en' })

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') query.set(key, String(value))
    }

    return query.toString()
  }

  const filenameFrom = (header: string | null): string | null => {
    if (!header) return null
    const utf8 = header.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8) return decodeURIComponent(utf8[1])
    const plain = header.match(/filename="?([^";]+)"?/i)
    return plain ? plain[1].trim() : null
  }

  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const readFailure = async (response: Response): Promise<string> => {
    try {
      const body = await response.json()
      if (body?.message) return body.message
    } catch {}

    return currentLang.value === 'ar' ? 'فشل التصدير. حاول مرة أخرى.' : 'Export failed. Please try again.'
  }

  const download = async (path: string, params: Record<string, any>, fallbackName: string, showError: boolean): Promise<ExportResult> => {
    if (exporting.value) return { ok: false }

    exporting.value = true
    exportError.value = null
    progress.value = { stage: 'preparing', percent: null }

    try {
      const response = await fetch(`${config.public.apiBase}/${path}?${buildQuery(params)}`, {
        headers: { Accept: '*/*', ...authHeaders() },
      })

      if (!response.ok) {
        const message = await readFailure(response)
        if (showError) exportError.value = message
        return { ok: false, message }
      }

      const total = Number(response.headers.get('content-length')) || 0
      const filename = filenameFrom(response.headers.get('content-disposition')) ?? fallbackName
      progress.value = { stage: 'downloading', percent: total ? 0 : null }

      const reader = response.body?.getReader()
      if (!reader) {
        saveBlob(await response.blob(), filename)
        return { ok: true }
      }

      const chunks: Uint8Array[] = []
      let received = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        if (total) progress.value = { stage: 'downloading', percent: Math.min(100, Math.round((received / total) * 100)) }
      }

      saveBlob(new Blob(chunks, { type: response.headers.get('content-type') ?? 'application/octet-stream' }), filename)
      return { ok: true }
    } catch {
      const message = currentLang.value === 'ar' ? 'تعذر الاتصال بالخادم.' : 'Could not reach the server.'
      if (showError) exportError.value = message
      return { ok: false, message }
    } finally {
      exporting.value = false
      progress.value = { stage: 'idle', percent: null }
    }
  }

  const exportCard = (card: string, params: Record<string, any> = {}, options: { showError?: boolean } = {}) =>
    download(`exports/${card}`, params, `TaxAid_${card}.xlsx`, options.showError ?? true)

  const exportLedger = (card: string, ledger: string, params: Record<string, any> = {}) =>
    download(`exports/${card}/ledger`, { ...params, ledger }, 'TaxAid_Ledger.xlsx', true)

  const exportPart = (card: string, part: string, params: Record<string, any> = {}, options: { showError?: boolean } = {}) =>
    download(`exports/${card}/${part}`, params, `TaxAid_${card}_${part}.xlsx`, options.showError ?? true)

  const fetchExportOptions = async (card: string) => {
    const response = await $fetch<any>(`exports/${card}/options`, {
      baseURL: config.public.apiBase,
      query: { lang: currentLang.value === 'ar' ? 'ar' : 'en' },
      headers: { Accept: 'application/json', ...authHeaders() },
    })

    return response.data as {
      row_limit: number
      sheets: { key: string; label: string; description: string; default: boolean }[]
      details: { key: string; label: string; default: boolean }[]
    }
  }

  return { exporting, exportError, progress, exportCard, exportLedger, exportPart, fetchExportOptions }
}
