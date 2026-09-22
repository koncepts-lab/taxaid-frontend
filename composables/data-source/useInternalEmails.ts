export interface InternalEmail {
  id: number
  key?: string
  source?: 'user' | 'entry'
  is_primary?: boolean
  employee_name: string
  department: string
  email: string
  phone_number: string | null
}

export const useInternalEmails = () => {
  const emails = ref<InternalEmail[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const meta = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })

  const fetchEmails = async (params: { page?: number; per_page?: number; search?: string } = {}) => {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (params.page) query.set('page', String(params.page))
      if (params.per_page) query.set('per_page', String(params.per_page))
      if (params.search) query.set('search', params.search)
      const qs = query.toString()
      const res = await useApi(`/data-source/internal-emails${qs ? `?${qs}` : ''}`) as any
      emails.value = res.data ?? []
      if (res.meta) meta.value = res.meta
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load emails.'
    } finally {
      loading.value = false
    }
  }

  const createEmail = async (data: Partial<InternalEmail>): Promise<InternalEmail> => {
    const res = await useApi('/data-source/internal-emails', { method: 'POST', body: data }) as any
    return res.data
  }

  const updateEmail = async (id: number, data: Partial<InternalEmail>): Promise<InternalEmail> => {
    const res = await useApi(`/data-source/internal-emails/${id}`, { method: 'PUT', body: data }) as any
    return res.data
  }

  const deleteEmail = async (id: number): Promise<void> => {
    await useApi(`/data-source/internal-emails/${id}`, { method: 'DELETE' })
  }

  return {
    emails,
    meta,
    loading,
    error,
    fetchEmails,
    createEmail,
    updateEmail,
    deleteEmail,
  }
}
