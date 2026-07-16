/* global importScripts, firebase */
// Firebase Cloud Messaging service worker — shows push notifications while
// the TaxAid tab is closed/backgrounded. Config values are injected via the
// query string by the registration call if needed; the compat CDN build is
// used because service workers can't use the bundled ESM SDK.
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

// Click -> focus an open TaxAid tab (navigating it to the target page) or open one
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification.data?.target || 'dashboard'
  const url = '/' + target.replace(/^\/+/, '')

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((tabs) => {
      const tab = tabs.find((t) => new URL(t.url).origin === self.location.origin)
      if (tab) {
        tab.focus()
        return tab.navigate(url)
      }
      return clients.openWindow(url)
    })
  )
})
