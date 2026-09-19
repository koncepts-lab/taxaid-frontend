export const useDefaultSettings = () => {
  const list = (params: { page?: number; per_page?: number; search?: string } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.per_page) query.set('per_page', String(params.per_page))
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return useAdminApi(`/admin/default-settings${qs ? `?${qs}` : ''}`)
  }
  const updateGroup = (group: string, payload: Record<string, any>) =>
    useAdminApi(`/admin/default-settings/groups/${group}`, { method: 'PUT', body: payload })
  const errorMessage = (e: any) =>
    e?.data?.message ||
    (e?.data?.errors ? (Object.values(e.data.errors).flat() as string[])[0] : null) ||
    'Something went wrong. Please try again.'

  return { list, updateGroup, errorMessage }
}
