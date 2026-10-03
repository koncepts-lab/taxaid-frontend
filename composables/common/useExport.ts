export interface ExportProgress {
  stage: 'idle' | 'preparing' | 'downloading'
  percent: number | null
}

export interface ExportResult {
  ok: boolean
  message?: string
}

export const useExport = () => {
  const currentLang = useState('currentLang', () => 'en')

  const exporting = useState<boolean>('export_busy', () => false)
  const exportError = useState<string | null>('export_error', () => null)
  const progress = useState<ExportProgress>('export_progress', () => ({ stage: 'idle', percent: null }))

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

  const readFailure = (response: Response): string => {
    const body = (response as any)._data
    if (body?.message) return body.message

    return currentLang.value === 'ar' ? 'فشل التصدير. حاول مرة أخرى.' : 'Export failed. Please try again.'
  }

  const download = async (path: string, params: Record<string, any>, fallbackName: string, showError: boolean): Promise<ExportResult> => {
    if (exporting.value) return { ok: false }

    exporting.value = true
    exportError.value = null
    progress.value = { stage: 'preparing', percent: null }

    try {
      const response = await useApi(`/${path}?${buildQuery(params)}`, {
        raw: true, headers: { Accept: '*/*' },
      }) as Response

      if (!response.ok) {
        const message = readFailure(response)
        if (showError) exportError.value = message
        return { ok: false, message }
      }

      const filename = filenameFrom(response.headers.get('content-disposition')) ?? fallbackName
      progress.value = { stage: 'downloading', percent: 100 }

      saveBlob((response as any)._data as Blob, filename)
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
    const response = await useApi(`/exports/${card}/options?lang=${currentLang.value === 'ar' ? 'ar' : 'en'}`) as any

    return response.data as {
      row_limit: number
      sheets: { key: string; label: string; description: string; default: boolean }[]
      details: { key: string; label: string; default: boolean }[]
    }
  }

  return { exporting, exportError, progress, exportCard, exportLedger, exportPart, fetchExportOptions }
}
