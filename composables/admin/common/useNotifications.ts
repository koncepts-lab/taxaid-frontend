export function useNotifications() {
  const config      = useRuntimeConfig()
  const tokenCookie = useCookie('admin_token')

  function apiFetch(url: string, options: any = {}) {
    const method = (options.method || 'GET').toUpperCase()
    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
        ...(tokenCookie.value ? { 'Authorization': `Bearer ${tokenCookie.value}` } : {}),
        ...options.headers,
      },
    })
  }

  // mode: 'dashboard' -> { ticket_count, default_count }; 'page' -> paginated { data, total, ... }
  async function fetchNotifications(params: { type?: 'ticket' | 'default'; mode?: 'dashboard' | 'page'; page?: number; per_page?: number } = {}): Promise<any> {
    return await apiFetch('/admin/notifications-feed', { params })
  }

  function toGroups(items: any[]) {
    const byDate = new Map<string, any[]>()
    for (const n of items) {
      const date = (n.created_at || '').split(' ')[0] || 'Today'
      const time = (n.created_at || '').split(' ')[1]?.slice(0, 5) || ''
      const entry = {
        id: n.id ?? `${n.category}-${byDate.size}-${date}`,
        type: n.category === 'default' ? 'warning' : 'info',
        message: n.message,
        time,
        category: n.category === 'default' ? 'Default' : 'Ticket',
        unread: n.category === 'ticket' ? !n.is_read : false,
      }
      if (!byDate.has(date)) byDate.set(date, [])
      byDate.get(date)!.push(entry)
    }
    return Array.from(byDate.entries()).map(([date, items]) => ({ id: date, date, items }))
  }

  return { fetchNotifications, toGroups }
}
