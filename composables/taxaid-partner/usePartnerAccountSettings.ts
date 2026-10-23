export interface PartnerAccountSession {
  id: number
  browser: string
  location: string
  lastActive: string
  isCurrent: boolean
  device: 'desktop' | 'mobile'
}

const MOBILE_PLATFORMS = ['Android', 'iOS']

function relativeTime(iso: string | null, lang: string): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.max(0, Math.floor(diffMs / 60000))
  const ar = lang === 'ar'
  if (mins < 1) return ar ? 'الآن' : 'just now'
  if (mins < 60) return ar ? `منذ ${mins} دقيقة` : `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return ar ? `منذ ${hours} ساعة` : `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return ar ? `منذ ${days} يوم` : `${days} day${days === 1 ? '' : 's'} ago`
}

export function usePartnerAccountSettings() {
  const currentLang = useState('currentLang', () => 'en')

  const sessions = ref<PartnerAccountSession[]>([])
  const sessionsLoading = ref(false)

  const mapSession = (s: any): PartnerAccountSession => ({
    id: s.id,
    browser: s.device_label ?? 'Unknown device',
    location: s.location ?? (currentLang.value === 'ar' ? 'موقع غير معروف' : 'Unknown location'),
    lastActive: relativeTime(s.last_active_at, currentLang.value),
    isCurrent: !!s.is_current,
    device: MOBILE_PLATFORMS.includes(s.platform) ? 'mobile' : 'desktop',
  })

  const fetchSessions = async () => {
    sessionsLoading.value = true
    try {
      const res = await useRpApi('/revenue/partner/account/sessions') as any
      sessions.value = (res ?? []).map(mapSession)
    } catch {
      sessions.value = []
    } finally {
      sessionsLoading.value = false
    }
  }

  const revokeSession = async (id: number) => {
    try {
      await useRpApi(`/revenue/partner/account/sessions/${id}`, { method: 'DELETE' })
      sessions.value = sessions.value.filter((s) => s.id !== id)
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to sign out session.' }
    }
  }

  const revokeOtherSessions = async () => {
    try {
      await useRpApi('/revenue/partner/account/sessions/others', { method: 'DELETE' })
      sessions.value = sessions.value.filter((s) => s.isCurrent)
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to sign out other sessions.' }
    }
  }

  const changePassword = async (currentPassword: string, password: string, passwordConfirmation: string) => {
    try {
      await useRpApi('/revenue/partner/account/change-password', {
        method: 'POST',
        body: { current_password: currentPassword, password, password_confirmation: passwordConfirmation },
      })
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to update password.' }
    }
  }

  const updateProfile = async (name: string) => {
    try {
      await useRpApi('/revenue/partner/account/profile', { method: 'PUT', body: { name } })
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to update profile.' }
    }
  }

  return { sessions, sessionsLoading, fetchSessions, revokeSession, revokeOtherSessions, changePassword, updateProfile }
}
