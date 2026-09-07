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

export function useOrganizationSettings() {
  const getAiAlertGroups = (domain?: string) =>
    useApi(`/user/organization-settings/ai-alerts${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`)

  const updateGroup = (groupId: number, body: {
    is_enabled?: boolean
    email_enabled?: boolean
    notification_frequency?: string
    notification_day?: number | null
  }) => useApi(`/user/organization-settings/ai-alerts/${groupId}`, { method: 'PUT', body })

  const updateRole = (groupId: number, role: string, isEnabled: boolean) =>
    useApi(`/user/organization-settings/ai-alerts/${groupId}/roles/${role}`, { method: 'PUT', body: { is_enabled: isEnabled } })

  const getMailSettings = () => useApi('/configuration-settings/mail')

  const saveMailSettings = (payload: TenantMailSettings) =>
    useApi('/configuration-settings/mail', { method: 'PUT', body: payload })

  // email optional — backend defaults to the logged-in user's own email
  const testMailSettings = (email?: string) =>
    useApi('/configuration-settings/mail/test', { method: 'POST', body: email ? { email } : {} })

  return { getAiAlertGroups, updateGroup, updateRole, getMailSettings, saveMailSettings, testMailSettings }
}
