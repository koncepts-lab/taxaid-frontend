export const useCmsEndpoints = () => {
  const list = (params: { page?: number; per_page?: number; search?: string } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.per_page) query.set('per_page', String(params.per_page))
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return useAdminApi(`/admin/cms-endpoints${qs ? `?${qs}` : ''}`)
  }

  const create = (payload: Record<string, any>) =>
    useAdminApi('/admin/cms-endpoints', { method: 'POST', body: payload })

  const update = (key: string, payload: Record<string, any>) =>
    useAdminApi(`/admin/cms-endpoints/${key}`, { method: 'PUT', body: payload })

  const remove = (key: string) =>
    useAdminApi(`/admin/cms-endpoints/${key}`, { method: 'DELETE' })

  const CODE_TEXT: Record<string, string> = {
    invalid_url: 'That URL is not valid.',
    https_required: 'Public URLs must use https. Only localhost and IP addresses can use http.',
    header_value_required: 'Every header needs a value.',
    reserved_header: 'That header name cannot be set.',
    audience_required: 'Pick at least one audience, or "Any logged-in user".',
  }

  const errorMessage = (e: any) => {
    const code = e?.data?.code
    if (code && CODE_TEXT[code]) return CODE_TEXT[code]

    const errors = e?.data?.errors
    if (errors) {
      const first = (Object.values(errors).flat() as string[])[0]
      return CODE_TEXT[first] || first
    }

    return e?.data?.message || 'Something went wrong. Please try again.'
  }

  return { list, create, update, remove, errorMessage }
}
