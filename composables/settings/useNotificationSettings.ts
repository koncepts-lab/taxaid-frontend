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
    if (!config.public.firebaseApiKey || !('Notification' in window)) return 'unconfigured'

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return 'denied'

    const { initializeApp, getApps } = await import('firebase/app')
    const { getMessaging, getToken } = await import('firebase/messaging')

    const app = getApps().length ? getApps()[0] : initializeApp({
      apiKey: config.public.firebaseApiKey,
      projectId: config.public.firebaseProjectId,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
    })

    // SWs can't read runtime config — pass the Firebase keys via query string
    const swParams = new URLSearchParams({
      apiKey: config.public.firebaseApiKey,
      projectId: config.public.firebaseProjectId,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
    })
    const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParams}`)
    const token = await getToken(getMessaging(app), {
      vapidKey: config.public.firebaseVapidKey,
      serviceWorkerRegistration: registration,
    })

    await registerDeviceToken(token, 'web')
    // Remembered so logout can deregister this device
    localStorage.setItem('push_device_token', token)
    return 'registered'
  }

  return { getSettings, saveSettings, registerDeviceToken, removeDeviceToken, enableWebPush }
}
