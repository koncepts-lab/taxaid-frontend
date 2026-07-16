// In-app notification toast state. Pushed to by the Reverb listener plugin,
// rendered by components/common/NotificationToasts.vue (mounted in app.vue).

export interface AppNotification {
  id: number
  event_key: string
  title: string
  body: string
  target: string | null // route to open on click, e.g. 'settings/notifications'
}

const DISMISS_AFTER_MS = 8000

let nextId = 1

export function useAppNotifications() {
  const items = useState<AppNotification[]>('app_notifications', () => [])

  const remove = (id: number) => {
    items.value = items.value.filter((n) => n.id !== id)
  }

  const add = (n: Omit<AppNotification, 'id'>) => {
    const id = nextId++
    items.value = [...items.value, { ...n, id }]
    setTimeout(() => remove(id), DISMISS_AFTER_MS)
  }

  return { items, add, remove }
}
