import { ref } from 'vue'

export interface AdminMonthlyReview {
  id: number
  tenant_id: number
  client_name: string
  month: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  scheduled_date: string | null
  scheduled_time: string | null
  meet_url: string | null
  notes: string | null
  progress_current: number
  progress_total: number
}

export interface ReviewQuestion {
  id: number
  question_text: string
  order: number
}

export interface ReviewAnswer {
  question_id: number
  selection: 'status' | 'client_delay'
  notes: string | null
  answered_at: string
}

const _reviews  = ref<AdminMonthlyReview[]>([])
const _loading  = ref(false)
const _error    = ref<string | null>(null)

export function useAdminMonthlyReviews() {
  async function fetchReviews(month: string, search?: string): Promise<void> {
    _loading.value = true
    _error.value   = null
    try {
      const params = new URLSearchParams({ month })
      if (search) params.set('search', search)
      const res: any = await useApi(`/admin/monthly-reviews?${params.toString()}`)
      _reviews.value = res.data ?? []
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Failed to load monthly reviews.'
    } finally {
      _loading.value = false
    }
  }

  async function fetchDetail(id: number): Promise<any> {
    const res: any = await useApi(`/admin/monthly-reviews/${id}`)
    return res.data
  }

  async function fetchByTenant(tenantId: number | string, month: string): Promise<any> {
    const res: any = await useApi(`/admin/monthly-reviews/by-tenant/${tenantId}?month=${month}`)
    return res.data
  }

  async function fetchQuestions(): Promise<ReviewQuestion[]> {
    const res: any = await useApi('/admin/monthly-reviews/questions')
    return res.data ?? []
  }

  async function setSchedule(id: number, date: string, time: string, meetUrl: string, notes?: string | null): Promise<void> {
    await useApi(`/admin/monthly-reviews/${id}/schedule`, {
      method: 'PATCH',
      body: { scheduled_date: date, scheduled_time: time, meet_url: meetUrl, notes: notes ?? null },
    })
  }

  async function completeReview(id: number): Promise<any> {
    const res: any = await useApi(`/admin/monthly-reviews/${id}/complete`, { method: 'PATCH' })
    return res.data
  }

  async function saveAnswer(reviewId: number, questionId: number, selection: string, notes?: string): Promise<any> {
    const res: any = await useApi(`/admin/monthly-reviews/${reviewId}/answers`, {
      method: 'POST',
      body: { question_id: questionId, selection, notes: notes ?? null },
    })
    return res.data
  }

  async function cancelReview(id: number): Promise<void> {
    await useApi(`/admin/monthly-reviews/${id}/cancel`, { method: 'PATCH' })
  }

  async function refreshForMonth(month?: string): Promise<void> {
    await useApi('/admin/monthly-reviews/refresh', {
      method: 'POST',
      body: month ? { month } : {},
    })
  }

  return {
    reviews:  _reviews,
    loading:  _loading,
    error:    _error,
    fetchReviews,
    fetchDetail,
    fetchByTenant,
    fetchQuestions,
    setSchedule,
    saveAnswer,
    completeReview,
    cancelReview,
    refreshForMonth,
  }
}
