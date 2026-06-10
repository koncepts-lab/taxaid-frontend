export interface Contact {
  id: number
  identity: string | null
  type: string
  name: string
  tax_id: string | null
  contact_person: string | null
  email: string
  phone_number: string | null
  credit_limit: number | null
  status: string
}

export const useContacts = () => {
  const contacts = ref<Contact[]>([])
  const customers = ref<Contact[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchContacts = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await useApi('/data-source/contacts') as any
      contacts.value = res.data ?? []
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load contacts.'
    } finally {
      loading.value = false
    }
  }

  const fetchCustomers = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await useApi('/data-source/customers') as any
      customers.value = res.data ?? []
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Failed to load customers.'
    } finally {
      loading.value = false
    }
  }

  const createContact = async (data: Partial<Contact>): Promise<Contact> => {
    const res = await useApi('/data-source/contacts', { method: 'POST', body: data }) as any
    return res.data
  }

  const deleteContact = async (id: number): Promise<void> => {
    await useApi(`/data-source/contacts/${id}`, { method: 'DELETE' })
  }

  const generateIdentity = async (type: 'customer' | 'vendor'): Promise<string> => {
    const res = await useApi(`/data-source/contacts/generate-identity?type=${type}`) as any
    return res.data?.identity ?? ''
  }

  return {
    contacts,
    customers,
    loading,
    error,
    fetchContacts,
    fetchCustomers,
    createContact,
    deleteContact,
    generateIdentity,
  }
}
