// Per-user notification settings (/settings/notifications) + web push
// device registration. All authed calls go through useApi (auth_token).

export interface NotificationEventRow {
  event_key: string
  label: string
  description: string
  channels: string[]        // ['email'] or ['email','push']
  active: boolean           // false = placeholder (toggle saves, nothing sends yet)
  enabled: Record<string, boolean>
}

export function useNotificationSettings() {
  const getSettings = (lang: 'en' | 'ar' = 'en') =>
    useApi(`/notification-settings?lang=${lang}`) as Promise<{ data: NotificationEventRow[] }>

  // Bulk upsert: { email: {event_key: bool}, push: {...} }
  const saveSettings = (matrix: { email?: Record<string, boolean>; push?: Record<string, boolean> }) =>
    useApi('/notification-settings', { method: 'PUT', body: matrix })

  const registerDeviceToken = (token: string, platform: 'web' | 'android' | 'ios' = 'web') =>
    useApi('/device-tokens', { method: 'POST', body: { token, platform } })

  const removeDeviceToken = (token: string) =>
    useApi('/device-tokens', { method: 'DELETE', body: { token } })

  /**
   * Browser push opt-in: ask permission, get an FCM token via the Firebase
   * JS SDK and register it. Returns 'registered' | 'denied' | 'unconfigured'.
   * No-ops quietly until the Firebase web keys are set in runtime config.
   */
  async function enableWebPush(): Promise<'registered' | 'denied' | 'unconfigured'> {
    const config = useRuntimeConfig()
    // All four web-config values must be present — a partial config makes the
    // Firebase SDK throw "Missing App configuration value" deep in getToken.
    if (!config.public.firebaseApiKey || !config.public.firebaseProjectId
      || !config.public.firebaseSenderId || !config.public.firebaseAppId
      || !('Notification' in window)) {
      console.warn('[push] Firebase web config incomplete — restart the dev server after setting NUXT_PUBLIC_FIREBASE_* in .env')
      return 'unconfigured'
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return 'denied'

    const { initializeApp, getApps } = await import('firebase/app')
    const { getMessaging, getToken } = await import('firebase/messaging')

    const app = getApps().length ? getApps()[0] : initializeApp({
      apiKey: config.public.firebaseApiKey,
      projectId: config.public.firebaseProjectId,
      messagingSenderId: config.public.firebaseSenderId,
      appId: config.public.firebaseAppId,
    })

    // SWs can't read runtime config — pass the Firebase keys via query string
    const swParams = new URLSearchParams({
      apiKey: config.public.firebaseApiKey,
      projectId: config.public.firebaseProjectId,
      messagingSenderId: config.public.firebaseSenderId,
      appId: config.public.firebaseAppId,
    })
    const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParams}`)
    const token = await getToken(getMessaging(app), {
      vapidKey: config.public.firebaseVapidKey,
      serviceWorkerRegistration: registration,
    })

    await registerDeviceToken(token, 'web')
    // Remembered so logout can deregister this device; the user id lets
    // syncWebPush re-register when a different user logs in on this browser
    // (the backend re-assigns the token row to the current user).
    localStorage.setItem('push_device_token', token)
    try { localStorage.setItem('push_device_token_user_id', localStorage.getItem('auth_user_id') || '') } catch {}
    return 'registered'
  }

  /**
   * Post-login opt-in, mirroring useLocation.syncSessionLocation: called from
   * the logged-in pages, fire-and-forget, deferred so it never competes with
   * the page's own requests. Asks for notification permission when the browser
   * hasn't decided yet (throttled to once a day so a dismissed popup doesn't
   * nag every page), and silently re-registers the FCM token when permission
   * is already granted but this browser has no token yet.
   */
  function syncWebPush(): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (!useCookie('auth_token').value) return // not logged in
    if (Notification.permission === 'denied') return // browser won't re-ask
    if (webPushSyncScheduled) return

    // Already opted in on this browser by THIS user -> nothing to do.
    // A different user on the same browser re-registers so the token row
    // moves to them (shared-machine case).
    if (Notification.permission === 'granted'
      && localStorage.getItem('push_device_token')
      && localStorage.getItem('push_device_token_user_id') === localStorage.getItem('auth_user_id')) return

    if (Notification.permission === 'default') {
      try {
        const iso = localStorage.getItem(ASKED_AT_KEY)
        if (iso && Date.now() - new Date(iso).getTime() < ASK_AGAIN_AFTER_MS) return
      } catch {}
    }

    webPushSyncScheduled = true

    const run = async () => {
      try {
        if (Notification.permission === 'default') {
          try { localStorage.setItem(ASKED_AT_KEY, new Date().toISOString()) } catch {}
        }
        await enableWebPush()
      } catch {
        // best effort — allow a retry on a later page visit
        webPushSyncScheduled = false
      }
    }

    setTimeout(() => {
      if (typeof requestIdleCallback === 'function') requestIdleCallback(() => run())
      else run()
    }, 5000)
  }

  return { getSettings, saveSettings, registerDeviceToken, removeDeviceToken, enableWebPush, syncWebPush }
}

const ASKED_AT_KEY = 'push_permission_asked_at' // ISO timestamp of last permission ask
const ASK_AGAIN_AFTER_MS = 24 * 60 * 60 * 1000 // dismissed popup -> re-ask next day

// Module-level guard like useLocation's: fast page switches inside the defer
// window would otherwise queue duplicate permission prompts / registrations.
let webPushSyncScheduled = false
