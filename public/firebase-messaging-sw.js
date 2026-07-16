/* global importScripts, firebase, clients */
// Firebase Cloud Messaging service worker — shows push notifications while
// the TaxAid tab is closed/backgrounded and routes clicks to the target page.

// IMPORTANT: our notificationclick listener must be registered BEFORE the
// Firebase SDK loads — the SDK adds its own click listener that calls
// stopImmediatePropagation() on notifications it displayed, which would
// silently swallow clicks if it ran first.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.stopImmediatePropagation() // keep the SDK's own handler out of it

  // Target route: our showNotification stores it at data.target; SDK-displayed
  // notifications nest the original message under data.FCM_MSG.
  const data = event.notification.data || {}
  const target = data.target || data.FCM_MSG?.data?.target || 'dashboard'
  const url = self.location.origin + '/' + String(target).replace(/^\/+/, '')

  event.waitUntil((async () => {
    const tabs = await clients.matchAll({ type: 'window', includeUncontrolled: true })
    const tab = tabs.find((t) => t.url.startsWith(self.location.origin))
    if (tab) {
      await tab.focus()
      try {
        await tab.navigate(url) // full navigation to the target page
        return
      } catch (e) {
        // navigate() fails on tabs this SW doesn't control yet — open fresh
      }
    }
    await clients.openWindow(url)
  })())
})

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

// Config comes from the NUXT_PUBLIC_FIREBASE_* runtime config, injected as
// query-string params by the registration call in useNotificationSettings.
const params = new URLSearchParams(self.location.search)

firebase.initializeApp({
  apiKey: params.get('apiKey') || '',
  projectId: params.get('projectId') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'TaxAid'
  self.registration.showNotification(title, {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    data: payload.data || {},
  })
})
