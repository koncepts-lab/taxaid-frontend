// Review-team temp credential requests (mirrors the implementation-side
// methods in useImplementation.ts, endpoints under /admin/review/...).
// Review pages identify clients by numeric tenant_id — the backend resolves
// client_id as either tenants.license_id or tenants.id.
export function useTempCredentials() {
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

  // Consultant side
  async function requestCredentials(tenantId: string | number, requestNote?: string | null): Promise<any> {
    const res: any = await apiFetch('/admin/review/credential-requests', {
      method: 'POST',
      body: { client_id: String(tenantId), request_note: requestNote || null },
    })
    return res.data
  }

  async function getMyCredentialRequest(tenantId: string | number): Promise<any | null> {
    const res: any = await apiFetch('/admin/review/credential-requests/mine', {
      params: { client_id: String(tenantId) },
    })
    return res.data ?? null
  }

  // Manager side (paginated)
  async function getCredentialRequests(opts: {
    search?: string
    status?: string
    page?: number
    per_page?: number
  } = {}): Promise<any> {
    const params: any = { page: opts.page ?? 1, per_page: opts.per_page ?? 10 }
    if (opts.search) params.search = opts.search
    if (opts.status) params.status = opts.status
    const res: any = await apiFetch('/admin/review/credential-requests', { params })
    return res.data ?? { data: [], current_page: 1, last_page: 1, total: 0 }
  }

  async function reviewCredentialRequest(id: number, action: 'approve' | 'reject' | 'terminate', rejectNote?: string): Promise<any> {
    const res: any = await apiFetch(`/admin/review/credential-requests/${id}/review`, {
      method: 'PATCH',
      body: { action, ...(action === 'reject' ? { reject_note: rejectNote } : {}) },
    })
    return res.data
  }

  const approveCredentialRequest   = (id: number) => reviewCredentialRequest(id, 'approve')
  const rejectCredentialRequest    = (id: number, rejectNote: string) => reviewCredentialRequest(id, 'reject', rejectNote)
  const terminateCredentialRequest = (id: number) => reviewCredentialRequest(id, 'terminate')

  return {
    requestCredentials,
    getMyCredentialRequest,
    getCredentialRequests,
    reviewCredentialRequest,
    approveCredentialRequest,
    rejectCredentialRequest,
    terminateCredentialRequest,
  }
}
