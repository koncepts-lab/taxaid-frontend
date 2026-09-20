// TODO: partner notifications are hardcoded sample data; replace with a real backend call when the API exists
export const usePartnerNotifications = () => {
  const notificationTabs = [
    { name: 'All', count: 3 },
    { name: 'Payments', count: 2 },
    { name: 'System', count: 1 },
  ]

  const notificationGroups = [
    {
      id: 1,
      date: 'Today',
      items: [
        { id: 101, type: 'success', message: 'Your settlement for this month has been paid.', time: '09:00 AM', category: 'Payments', unread: true },
        { id: 102, type: 'info', message: 'A new client was linked to your account.', time: '08:15 AM', category: 'System', unread: true },
      ],
    },
    {
      id: 2,
      date: 'Yesterday',
      items: [
        { id: 201, type: 'warning', message: 'A client payment is overdue. Settlement may be delayed.', time: '05:30 PM', category: 'Payments', unread: true },
      ],
    },
  ]

  const notificationCount = computed(() => notificationGroups.reduce((n, g) => n + g.items.length, 0))

  return { notificationTabs, notificationGroups, notificationCount }
}
