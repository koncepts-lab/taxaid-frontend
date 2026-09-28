// Admin-side account deletion requests — Review Manager's "User Requests" queue
// (approve/reject) and Super Admin's "Client Requests" -> Account Deletion queue
// (execute/remove-organization). See account-deletion.md §6.1/§6.2.
export function useAccountDeletionRequests() {
  async function getReviewQueue(opts: { status?: string; page?: number; per_page?: number } = {}): Promise<any> {
    const params = new URLSearchParams({ page: String(opts.page ?? 1), per_page: String(opts.per_page ?? 10) })
    if (opts.status) params.set('status', opts.status)
    const res: any = await useAdminApi(`/admin/review-team/manager/account-deletion-requests?${params.toString()}`)
    return res ?? { data: [], meta: { current_page: 1, last_page: 1, total: 0, per_page: 10 } }
  }
  const approveRequest = (accountDeletionRequestId: number, notes: string) =>
    useAdminApi(`/admin/review-team/manager/account-deletion-requests/${accountDeletionRequestId}/approve`, { method: 'POST', body: { notes } })
  const rejectRequest = (accountDeletionRequestId: number, notes: string) =>
    useAdminApi(`/admin/review-team/manager/account-deletion-requests/${accountDeletionRequestId}/reject`, { method: 'POST', body: { notes } })

  async function getClientQueue(opts: { status?: string; page?: number; per_page?: number } = {}): Promise<any> {
    const params = new URLSearchParams({ page: String(opts.page ?? 1), per_page: String(opts.per_page ?? 10) })
    if (opts.status) params.set('status', opts.status)
    const res: any = await useAdminApi(`/admin/management/account-deletion-requests?${params.toString()}`)
    return res ?? { data: [], meta: { current_page: 1, last_page: 1, total: 0, per_page: 10 } }
  }
  const executeRequest = (accountDeletionRequestId: number, notes: string) =>
    useAdminApi(`/admin/management/account-deletion-requests/${accountDeletionRequestId}/execute`, { method: 'POST', body: { notes } })
  const removeOrganization = (accountDeletionRequestId: number) =>
    useAdminApi(`/admin/management/account-deletion-requests/${accountDeletionRequestId}/remove-organization`, { method: 'POST' })
  const getRemovalChecklist = (accountDeletionRequestId: number) =>
    useAdminApi(`/admin/management/account-deletion-requests/${accountDeletionRequestId}/removal-checklist`)

  return { getReviewQueue, approveRequest, rejectRequest, getClientQueue, executeRequest, removeOrganization, getRemovalChecklist }
}
