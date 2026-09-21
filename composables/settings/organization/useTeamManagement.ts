export const useTeamManagement = () => {
  const errorMessage = (e: any) =>
    e?.data?.message ||
    (e?.data?.errors ? (Object.values(e.data.errors).flat() as string[])[0] : null) ||
    'Something went wrong. Please try again.'

  const getTeam = () => useApi('/user/team')
  const createMember = (payload: Record<string, any>) => useApi('/user/team', { method: 'POST', body: payload })
  const updateMember = (id: number, payload: Record<string, any>) => useApi(`/user/team/${id}`, { method: 'PUT', body: payload })
  const resetPassword = (id: number) => useApi(`/user/team/${id}/reset-password`, { method: 'POST' })
  const setStatus = (id: number, status: 'live' | 'suspended', confirm?: string) => useApi(`/user/team/${id}/status`, { method: 'PATCH', body: { status, ...(confirm ? { confirm } : {}) } })
  const getPermissions = () => useApi('/user/team/permissions')
  const setPermissionGroup = (group: string, values: Record<string, boolean>) => useApi(`/user/team/permissions/${group}`, { method: 'PUT', body: { values } })

  return { errorMessage, getTeam, createMember, updateMember, resetPassword, setStatus, getPermissions, setPermissionGroup }
}
