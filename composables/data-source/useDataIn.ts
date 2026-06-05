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

export const useDataIn = () => {
  const items = ref<DataInItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadingId = ref<string | null>(null)

  // ── Config / Status ────────────────────────────────────────────────────────
  const fetchConfig = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await useApi('/data-source/data-in/config') as any
      items.value = res.data ?? []
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load data-in config.'
    } finally {
      loading.value = false
    }
  }

  // ── Upload ─────────────────────────────────────────────────────────────────
  const uploadFile = async (id: string, file: File): Promise<void> => {
    const item = items.value.find(i => i.id === id)
    if (!item) throw new Error(`Unknown data-in id: ${id}`)

    uploadingId.value = id
    error.value = null

    const form = new FormData()
    form.append(item.fileField, file)

    // Strip leading /api from endpoint — useApi already prepends the base
    const endpoint = item.uploadEndpoint.replace(/^\/api/, '')

    try {
      await useApi(endpoint, {
        method: 'POST',
        body: form,
        headers: {
          // Let the browser set Content-Type with the boundary for FormData
          'Content-Type': undefined as any,
        },
      })

      // Refresh status for this card from backend after a successful upload
      await refreshItem(id)
    } finally {
      uploadingId.value = null
    }
  }

  // ── Sample Download ────────────────────────────────────────────────────────
  const downloadSample = async (id: string): Promise<void> => {
    const config = useRuntimeConfig()
    const token = useCookie('auth_token')

    const url = `${config.public.apiBase}/data-source/data-in/sample/${id}`

    // Fetch the file as a blob so we can trigger a browser download
    const res = await fetch(url, {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to download sample for ${id}`)
    }

    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)

    const anchor = document.createElement('a')
    anchor.href = objectUrl
    // Try to get filename from Content-Disposition header
    const disposition = res.headers.get('Content-Disposition') ?? ''
    const match = disposition.match(/filename="?([^"]+)"?/)
    anchor.download = match ? match[1] : `${id}_Template.xlsx`
    anchor.click()

    URL.revokeObjectURL(objectUrl)
  }

  // ── Remove (resets local state — no delete endpoint on backend yet) ────────
  const removeItem = (id: string): void => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.isUploaded = false
      item.uploadDate = null
      item.fileName = null
    }
  }

  // ── Internal: refresh a single item after upload ───────────────────────────
  const refreshItem = async (id: string): Promise<void> => {
    try {
      const res = await useApi('/data-source/data-in/config') as any
      const updated = (res.data ?? []).find((i: DataInItem) => i.id === id)
      if (updated) {
        const idx = items.value.findIndex(i => i.id === id)
        if (idx !== -1) items.value[idx] = updated
      }
    } catch {
      // Non-fatal — card will still show uploaded once next fetchConfig runs
    }
  }

  return {
    items,
    loading,
    error,
    uploadingId,
    fetchConfig,
    uploadFile,
    downloadSample,
    removeItem,
  }
}
