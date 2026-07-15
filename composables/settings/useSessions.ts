// Device sessions + per-user idle timeout (Settings → Security page).
// Maps the backend /sessions payload onto the exact field names the
// Active Sessions card already binds to, so the template stays untouched.
export interface DeviceSession {
  id: number
  browser: string      // "Chrome on Windows" (backend device_label)
  location: string
  lastActive: string   // relative, localized
  device: 'desktop' | 'mobile'
  isCurrent: boolean
}

export interface TimeoutOption {
  minutes: number
  label: string
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

export function useSessions() {
  const currentLang = useState('currentLang', () => 'en')

  const sessions = ref<DeviceSession[]>([])
  const loading = ref(false)
  const timeoutOptions = ref<TimeoutOption[]>([])
  const currentTimeout = ref<number | null>(null)
  const error = ref<string | null>(null)

  const mapSession = (s: any): DeviceSession => ({
    id: s.id,
    browser: s.device_label ?? 'Unknown device',
    location: s.location ?? (currentLang.value === 'ar' ? 'موقع غير معروف' : 'Unknown location'),
    lastActive: relativeTime(s.last_active_at, currentLang.value),
    device: MOBILE_PLATFORMS.includes(s.platform) ? 'mobile' : 'desktop',
    isCurrent: !!s.is_current,
  })

  const fetchSessions = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await useApi('/sessions') as any
      sessions.value = (res.data ?? []).map(mapSession)
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load sessions.'
    } finally {
      loading.value = false
    }
  }

  const revoke = async (id: number) => {
    try {
      await useApi(`/sessions/${id}`, { method: 'DELETE' })
      sessions.value = sessions.value.filter((s) => s.id !== id)
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to sign out session.' }
    }
  }

  const revokeOthers = async () => {
    try {
      await useApi('/sessions/others', { method: 'DELETE' })
      sessions.value = sessions.value.filter((s) => s.isCurrent)
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to sign out other sessions.' }
    }
  }

  // Fixed choices come from the backend; labels follow ?lang convention
  const fetchTimeout = async () => {
    try {
      const res = await useApi(`/sessions/timeout?lang=${currentLang.value === 'ar' ? 'ar' : 'en'}`) as any
      timeoutOptions.value = res.data?.options ?? []
      currentTimeout.value = res.data?.session_timeout_minutes ?? null
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to load session timeout.'
    }
  }

  const saveTimeout = async (minutes: number | null) => {
    try {
      const res = await useApi('/sessions/timeout', { method: 'PUT', body: { minutes } }) as any
      currentTimeout.value = res.data?.session_timeout_minutes ?? minutes
      return { ok: true, message: res.message as string }
    } catch (e: any) {
      return { ok: false, message: e?.data?.message ?? 'Failed to save session timeout.' }
    }
  }

  return {
    sessions, loading, error,
    fetchSessions, revoke, revokeOthers,
    timeoutOptions, currentTimeout, fetchTimeout, saveTimeout,
  }
}
