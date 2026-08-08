export function useTicketing() {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('admin_token')

  function apiFetch(url: string, options: any = {}) {
    const method = (options.method || 'GET').toUpperCase()
    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(method !== 'GET' && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(tokenCookie.value ? { 'Authorization': `Bearer ${tokenCookie.value}` } : {}),
        ...options.headers,
      },
    })
  }

  // Shared
  async function getTicketMeta(only?: Array<'statuses' | 'types'>): Promise<{ statuses?: any[]; types?: any[] }> {
    return await apiFetch('/admin/ticket-meta', { params: only ? { only: only.join(',') } : {} })
  }

  async function getTicket(id: number | string): Promise<any> {
    const res: any = await apiFetch(`/admin/tickets/${id}`)
    return res.data ?? res
  }

  async function getNotifications(): Promise<any[]> {
    const res: any = await apiFetch('/admin/notifications')
    return res.data ?? res
  }

  async function markNotificationRead(id: number | string): Promise<any> {
    const res: any = await apiFetch(`/admin/notifications/${id}/read`, { method: 'PUT' })
    return res.data ?? res
  }

  // Laravel paginator shape: { data, current_page, per_page, total, last_page, ... }
  function unwrapPage(res: any): { items: any[]; meta: { current_page: number; per_page: number; total: number; last_page: number } } {
    return {
      items: res.data ?? [],
      meta: {
        current_page: res.current_page ?? 1,
        per_page: res.per_page ?? 10,
        total: res.total ?? 0,
        last_page: res.last_page ?? 1,
      },
    }
  }

  // Team Member
  async function searchClientUsers(keyword: string): Promise<any[]> {
    const res: any = await apiFetch('/admin/client-users/search', { params: { q: keyword } })
    return res.data ?? res
  }

  async function createTicket(formData: FormData): Promise<any> {
    const res: any = await apiFetch('/admin/tickets', { method: 'POST', body: formData })
    return res.data ?? res
  }

  async function getMyTickets(filter?: Record<string, any>) {
    const res: any = await apiFetch('/admin/tickets', { params: filter })
    return unwrapPage(res)
  }

  async function getMyTicketStats(): Promise<any> {
    const res: any = await apiFetch('/admin/team-member/tickets/my-count')
    return res.data ?? res
  }

  // Team Lead
  async function getTeamLeadDashboard(): Promise<any> {
    const res: any = await apiFetch('/admin/team-lead/dashboard')
    return res.data ?? res
  }

  async function getTeamLeadTickets(filter?: Record<string, any>) {
    const res: any = await apiFetch('/admin/team-lead/tickets', { params: filter })
    return unwrapPage(res)
  }

  async function getMyTeamMembers(params?: Record<string, any>) {
    const res: any = await apiFetch('/admin/my-team-members', { params })
    return unwrapPage(res)
  }

  async function addTeamMember(email: string): Promise<any> {
    return await apiFetch('/admin/team-members/add', { method: 'POST', body: { email } })
  }

  async function removeTeamMember(teamMemberId: number | string): Promise<any> {
    return await apiFetch('/admin/remove-team-member', { method: 'POST', body: { team_member_id: teamMemberId } })
  }

  async function searchTeamMemberCandidates(search?: string): Promise<{ role: string | null; data: any[] }> {
    return await apiFetch('/admin/team-members/candidates', { params: search ? { search } : {} })
  }

  async function reviewAsTeamLead(id: number | string, body: Record<string, any>): Promise<any> {
    const res: any = await apiFetch(`/admin/tickets/${id}/review`, { method: 'PUT', body })
    return res.data ?? res
  }

  // Tech Team
  async function getTechDashboard(): Promise<any> {
    const res: any = await apiFetch('/admin/tech-team/tickets/dashboard')
    return res.data ?? res
  }

  async function getAllTicketsForTech(filter?: Record<string, any>) {
    const res: any = await apiFetch('/admin/tech/tickets', { params: filter })
    return unwrapPage(res)
  }

  async function reviewAsTech(id: number | string, body: Record<string, any>): Promise<any> {
    const res: any = await apiFetch(`/admin/${id}/technical-review`, { method: 'PUT', body })
    return res.data ?? res
  }

  async function progressTicket(id: number | string, action: 'start_dev' | 'flag' | 'future' | 'start_working' | 'developed'): Promise<any> {
    return await apiFetch(`/admin/tickets/${id}/progress`, { method: 'PUT', body: { action } })
  }

  // VP
  async function getVpDashboard(): Promise<any> {
    const res: any = await apiFetch('/admin/vp/tickets/dashboard')
    return res.data ?? res
  }

  async function getVpTickets(filter?: Record<string, any>) {
    const res: any = await apiFetch('/admin/vp/tickets/filter', { params: filter })
    return unwrapPage(res)
  }

  async function reviewAsVp(id: number | string, body: Record<string, any>): Promise<any> {
    const res: any = await apiFetch(`/admin/vp/tickets/${id}/vp-review`, { method: 'PUT', body })
    return res.data ?? res
  }

  // Manager (Review Manager)
  async function getManagerDashboard(): Promise<any> {
    const res: any = await apiFetch('/admin/manager/dashboard')
    return res.data ?? res
  }

  async function getManagerTickets(filter?: Record<string, any>): Promise<any[]> {
    const res: any = await apiFetch('/admin/manager/tickets', { params: filter })
    return res.data ?? res
  }

  async function reviewAsManager(id: number | string, formData: FormData): Promise<any> {
    const res: any = await apiFetch(`/admin/manager/tickets/${id}/manager-review`, { method: 'POST', body: formData })
    return res.data ?? res
  }

  // Admin (final review)
  async function getReviewManagers(): Promise<any[]> {
    const res: any = await apiFetch('/admin/review-managers')
    return res.data ?? res
  }

  async function getAdminDashboard(): Promise<any> {
    const res: any = await apiFetch('/admin/admin-view/dashboard')
    return res.data ?? res
  }

  async function getAdminTickets(filter?: Record<string, any>) {
    const res: any = await apiFetch('/admin/admin-view/tickets', { params: filter })
    return unwrapPage(res)
  }

  async function getManagerReport(): Promise<any> {
    const res: any = await apiFetch('/admin/admin-view/manager-report')
    return res.data ?? res
  }

  async function reviewAsAdmin(id: number | string, formData: FormData): Promise<any> {
    const res: any = await apiFetch(`/admin/admin-review/tickets/${id}/review`, { method: 'POST', body: formData })
    return res.data ?? res
  }

  return {
    getTicketMeta, getTicket, getNotifications, markNotificationRead,
    searchClientUsers, createTicket, getMyTickets, getMyTicketStats,
    getTeamLeadDashboard, getTeamLeadTickets, reviewAsTeamLead,
    getMyTeamMembers, addTeamMember, removeTeamMember, searchTeamMemberCandidates,
    getTechDashboard, getAllTicketsForTech, reviewAsTech, progressTicket,
    getVpDashboard, getVpTickets, reviewAsVp,
    getManagerDashboard, getManagerTickets, reviewAsManager,
    getReviewManagers, getAdminDashboard, getAdminTickets, getManagerReport, reviewAsAdmin,
  }
}
