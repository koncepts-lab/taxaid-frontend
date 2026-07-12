export interface InternalEmail {
  id: number
  employee_name: string
  department: string
  email: string
  phone_number: string | null
}

export const useInternalEmails = () => {
  const emails = ref<InternalEmail[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchEmails = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await useApi('/data-source/internal-emails') as any
      emails.value = res.data ?? []
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

  const deleteEmail = async (id: number): Promise<void> => {
    await useApi(`/data-source/internal-emails/${id}`, { method: 'DELETE' })
  }

  return {
    emails,
    loading,
    error,
    fetchEmails,
    createEmail,
    deleteEmail,
  }
}
