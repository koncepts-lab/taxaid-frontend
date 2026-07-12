// Tenant company-SMTP settings (Settings → Security page, Mail Settings card).
// Reminders/internal mails send ONLY through these — never the TaxAid default.
export interface TenantMailSettings {
  id?: number
  host: string
  port: number | string
  encryption: string | null
  username: string
  password?: string
  from_address: string
  from_name: string | null
  internal_departments: string[] | null
  is_active: boolean
  verified_at?: string | null
}

export function useMailSettings() {
  const settings = ref<TenantMailSettings | null>(null)
  const availableDepartments = ref<string[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const testing = ref(false)
  const error = ref<string | null>(null)

  const fetchSettings = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await useApi('/configuration-settings/mail') as any
      settings.value = res.data ?? null
      availableDepartments.value = res.available_departments ?? []
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load mail settings.'
    } finally {
      loading.value = false
    }
  }

  const saveSettings = async (payload: TenantMailSettings) => {
    saving.value = true
    try {
      const res = await useApi('/configuration-settings/mail', { method: 'PUT', body: payload }) as any
      settings.value = res.data ?? settings.value
      return { ok: true, message: res.message as string }
    } catch (e: any) {
      const errs = e?.data?.errors
      return { ok: false, message: errs ? Object.values(errs).flat().join(' ') : (e?.data?.message ?? 'Failed to save.') }
    } finally {
      saving.value = false
    }
  }

  // email optional — backend defaults to the logged-in user's own email
  const sendTestMail = async (email?: string) => {
    testing.value = true
    try {
      const res = await useApi('/configuration-settings/mail/test', {
        method: 'POST',
        body: email ? { email } : {},
      }) as any
      await fetchSettings() // refresh verified_at
      return { ok: true, message: res.message as string }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Test failed.' }
    } finally {
      testing.value = false
    }
  }

  return { settings, availableDepartments, loading, saving, testing, error, fetchSettings, saveSettings, sendTestMail }
}
