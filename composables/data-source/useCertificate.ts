export const useCertificate = () => {
  const certificates = ref<any[]>([])
  const types        = ref<string[]>([])
  const loading      = ref(false)
  const uploading    = ref(false)
  const error        = ref<string | null>(null)

  const fetchCertificates = async () => {
    loading.value = true
    error.value   = null
    try {
      const result = await useApi('/data-source/certificates') as any
      types.value        = result?.types ?? []
      certificates.value = result?.data  ?? []
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load certificates.'
    } finally {
      loading.value = false
    }
  }

  const uploadCertificate = async (certificateType: string, file: File) => {
    uploading.value = true
    error.value     = null
    try {
      const form = new FormData()
      form.append('certificate_type', certificateType)
      form.append('file', file)
      await useApi('/data-source/certificates/upload', { method: 'POST', body: form })
      await fetchCertificates()
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Upload failed.'
      throw e
    } finally {
      uploading.value = false
    }
  }

  const deleteCertificate = async (certificateType: string) => {
    error.value = null
    try {
      await useApi('/data-source/certificates/delete', {
        method: 'DELETE',
        body: { certificate_type: certificateType },
      })
      await fetchCertificates()
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Delete failed.'
    }
  }

  const downloadCertificate = async (certificateType: string, fileName: string) => {
    try {
      const blob = await useApi(`/data-source/certificates/download?certificate_type=${encodeURIComponent(certificateType)}`, {
        responseType: 'blob',
      }) as Blob
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Download failed.'
    }
  }

  // Inline preview — returns a blob object URL for iframe viewing.
  // Caller must URL.revokeObjectURL() when done.
  const fetchCertificateFileUrl = async (certificateType: string): Promise<string> => {
    const blob = await useApi(`/data-source/certificates/preview?certificate_type=${encodeURIComponent(certificateType)}`, {
      responseType: 'blob',
    }) as Blob
    return URL.createObjectURL(blob)
  }

  onMounted(async () => {
    await fetchCertificates()
  })

  return {
    certificates, types, loading, uploading, error,
    fetchCertificates, uploadCertificate, deleteCertificate, downloadCertificate, fetchCertificateFileUrl,
  }
}
