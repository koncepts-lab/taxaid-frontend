<template>
  <NuxtLayout name="admin">
    <ClientOnly>
      <AdminHeader role="member" />

      <div class="min-h-screen bg-[#F8F9FA] p-8">

        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/admin/Review-Dashboard" class="text-[#004D40] hover:text-[#00332A] transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-[26px] font-semibold text-[#004D40] leading-tight">
                {{ detail?.review?.client_name ?? '...' }}
              </h1>
              <p class="text-[14px] text-gray-500">Project Details — {{ selectedMonth }}</p>
            </div>
          </div>

          <!-- Month picker -->
          <input v-model="selectedMonth" type="month"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00896F] text-gray-700 bg-white" />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-2 border-[#00896F] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Not found -->
        <div v-else-if="notFound" class="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <p class="text-gray-500 text-[15px]">No monthly review found for this client in {{ selectedMonth }}.</p>
          <p class="text-gray-400 text-[13px] mt-1">Run the monthly refresh command to generate it.</p>
        </div>

        <template v-else-if="detail">
          <!-- Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p class="text-[13px] text-gray-500 mb-2">Tenant ID</p>
              <p class="text-[16px] font-semibold text-gray-900">{{ detail.review.tenant_id }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p class="text-[13px] text-gray-500 mb-2">Client Name</p>
              <p class="text-[16px] font-semibold text-gray-900">{{ detail.review.client_name }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p class="text-[13px] text-gray-500 mb-2">Scheduled Date</p>
              <p class="text-[16px] font-semibold text-gray-900">
                {{ detail.review.scheduled_date ? formatDate(detail.review.scheduled_date) : '—' }}
              </p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p class="text-[13px] text-gray-500 mb-2">Status</p>
              <span class="px-3 py-1 rounded-full text-[13px] font-medium" :style="statusStyle(detail.review.status)">
                {{ capitalize(detail.review.status) }}
              </span>
            </div>
          </div>

          <!-- Meet link -->
          <div v-if="detail.review.meet_url" class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
            <svg class="w-5 h-5 text-[#00896F] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <a :href="detail.review.meet_url" target="_blank" rel="noopener noreferrer"
              class="text-[#00896F] hover:underline text-[14px] break-all">
              {{ detail.review.meet_url }}
            </a>
          </div>

          <!-- Review Steps -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div class="p-8 pb-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 class="text-[20px] font-medium text-gray-900 mb-1">Review Steps</h2>
                <p class="text-[14px] text-gray-500">
                  {{ detail.progress.current }}/{{ detail.progress.total }} steps completed
                </p>
              </div>
              <!-- Progress bar -->
              <div class="flex items-center gap-3 w-48">
                <div class="flex-1 bg-[#EAEAEA] rounded-full h-[6px] overflow-hidden">
                  <div class="h-[6px] rounded-full transition-all"
                    :class="detail.review.status === 'completed' ? 'bg-[#00896F]' : 'bg-[#5C8DFF]'"
                    :style="`width: ${progressPercent}%`"></div>
                </div>
                <span class="text-[13px] font-semibold text-gray-700 w-8 text-right">{{ progressPercent }}%</span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-white">
                  <tr>
                    <th class="px-8 py-4 text-left text-[13px] font-semibold text-gray-700 w-[6%]">Sl Num</th>
                    <th class="px-8 py-4 text-left text-[13px] font-semibold text-gray-700 w-[30%]">Particulars</th>
                    <th class="px-8 py-4 text-left text-[13px] font-semibold text-gray-700 w-[10%]">Status</th>
                    <th class="px-8 py-4 text-left text-[13px] font-semibold text-gray-700 w-[12%]">Client Delay</th>
                    <th class="px-8 py-4 text-left text-[13px] font-semibold text-gray-700 w-[20%]">Time Stamp</th>
                    <th class="px-8 py-4 text-left text-[13px] font-semibold text-gray-700 w-[22%]">Notes</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-50">
                  <tr v-for="q in detail.questions" :key="q.id" class="hover:bg-gray-50/50">
                    <td class="px-8 py-4 whitespace-nowrap text-[14px] font-medium text-gray-900">{{ q.order }}</td>
                    <td class="px-8 py-4 text-[14px] text-gray-800">{{ q.question_text }}</td>

                    <!-- Status checkbox -->
                    <td class="px-8 py-4 whitespace-nowrap">
                      <div
                        class="w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer"
                        :class="[
                          q.selection === 'status' ? 'bg-[#00896F] border-[#00896F]' : 'border-gray-300 hover:border-[#00896F]',
                          (savingId === q.id || detail.review.status === 'cancelled') ? 'opacity-50 cursor-not-allowed' : ''
                        ]"
                        @click="handleSelection(q, 'status')"
                      >
                        <svg v-if="q.selection === 'status'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                        <div v-else-if="savingId === q.id" class="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>

                    <!-- Client Delay checkbox -->
                    <td class="px-8 py-4 whitespace-nowrap">
                      <div
                        class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors"
                        :class="[
                          q.selection === 'client_delay' ? 'bg-gray-200 border-gray-400' : 'border-gray-300 hover:border-gray-400',
                          (savingId === q.id || detail.review.status === 'cancelled') ? 'opacity-50 cursor-not-allowed' : ''
                        ]"
                        @click="handleSelection(q, 'client_delay')"
                      >
                        <svg v-if="q.selection === 'client_delay'" class="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>

                    <!-- Timestamp -->
                    <td class="px-8 py-4 whitespace-nowrap text-[13px] text-gray-600">
                      {{ q.answered_at ? formatTimestamp(q.answered_at) : '—' }}
                    </td>

                    <!-- Notes -->
                    <td class="px-8 py-3 pr-8">
                      <input
                        type="text"
                        v-model="localNotes[q.id]"
                        placeholder="Click to add delay reason..."
                        :disabled="detail.review.status === 'cancelled'"
                        @blur="handleNoteBlur(q)"
                        class="w-full bg-[#F5F7F9] border-none rounded-md px-4 py-2.5 text-[13px] text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-[#00896F] focus:outline-none disabled:opacity-50"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- All answered — ready to finish -->
          <div v-if="allAnswered && detail.review.status !== 'completed'" class="bg-[#E2F7ED] border border-[#A5E5D9] rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-4">
              <div class="bg-[#00896F] w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 class="text-[#004D40] font-semibold text-[18px] mb-0.5">All 14 Review Steps are Completed!</h3>
                <p class="text-[#006C58] text-[14px]">Click 'Finish Reporting' to confirm all steps are verified with the client and are ready for implementation.</p>
              </div>
            </div>
            <button @click="handleComplete" :disabled="completing"
              class="bg-[#00896F] hover:bg-[#006C58] text-white px-6 py-2.5 rounded-lg text-[14px] font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer">
              <svg v-if="!completing" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ completing ? 'Finishing...' : 'Finish Reporting' }}
            </button>
          </div>

          <!-- Already completed -->
          <div v-else-if="detail.review.status === 'completed'" class="bg-[#E2F7ED] border border-[#A5E5D9] rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div class="bg-[#00896F] w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-[#004D40] font-semibold text-[18px] mb-0.5">Review Completed</h3>
              <p class="text-[#006C58] text-[14px]">This month's review has been marked as complete.</p>
            </div>
          </div>
        </template>

      </div>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { format, parseISO } from 'date-fns'
import { useAdminMonthlyReviews } from '~/composables/admin/useAdminMonthlyReviews'

const route = useRoute()
const tenantId = route.params.id

const { fetchByTenant, saveAnswer, completeReview } = useAdminMonthlyReviews()

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const detail        = ref<any>(null)
const loading       = ref(false)
const notFound      = ref(false)
const savingId      = ref<number | null>(null)
const completing    = ref(false)
const localNotes    = ref<Record<number, string>>({})

const progressPercent = computed(() => {
  if (!detail.value?.progress?.total) return 0
  return Math.round((detail.value.progress.current / detail.value.progress.total) * 100)
})

const allAnswered = computed(() =>
  detail.value?.progress?.total > 0 &&
  detail.value?.progress?.current >= detail.value?.progress?.total
)

const formatDate = (d: string) => {
  try { return format(parseISO(d.slice(0, 10)), 'MMM d, yyyy') } catch { return d }
}

const formatTimestamp = (dt: string) => {
  try { return format(parseISO(dt), 'M/d/yyyy, h:mm:ss a') } catch { return dt }
}

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const statusStyle = (status: string) => {
  if (status === 'completed') return { backgroundColor: '#D6F5ED', color: '#018E71' }
  if (status === 'scheduled') return { backgroundColor: '#E5F1FF', color: '#3B82F6' }
  if (status === 'cancelled') return { backgroundColor: '#FFE8E8', color: '#EF4444' }
  return { backgroundColor: '#FFF4E5', color: '#D97706' }
}

async function load() {
  loading.value  = true
  notFound.value = false
  detail.value   = null
  localNotes.value = {}
  try {
    detail.value = await fetchByTenant(tenantId, selectedMonth.value)
    for (const q of detail.value?.questions ?? []) {
      if (q.notes) localNotes.value[q.id] = q.notes
    }
  } catch (err: any) {
    if (err?.status === 404 || err?.response?.status === 404) {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
}

watch(selectedMonth, load)
onMounted(load)

async function handleSelection(question: any, selection: 'status' | 'client_delay') {
  if (savingId.value || detail.value?.review?.status === 'cancelled') return
  savingId.value = question.id
  try {
    const result = await saveAnswer(
      detail.value.review.id,
      question.id,
      selection,
      localNotes.value[question.id] ?? undefined
    )
    question.selection   = result.answer.selection
    question.answered    = true
    question.answered_at = result.answer.answered_at
    detail.value.progress.current = result.progress_current
    detail.value.progress.total   = result.progress_total
  } catch {
    // revert nothing — UI stays consistent
  } finally {
    savingId.value = null
  }
}

async function handleComplete() {
  completing.value = true
  try {
    await completeReview(detail.value.review.id)
    detail.value.review.status = 'completed'
  } catch (err: any) {
    alert(err?.data?.message ?? 'Failed to complete review.')
  } finally {
    completing.value = false
  }
}

async function handleNoteBlur(question: any) {
  if (!question.selection) return
  try {
    await saveAnswer(
      detail.value.review.id,
      question.id,
      question.selection,
      localNotes.value[question.id] ?? undefined
    )
    question.notes = localNotes.value[question.id] ?? null
  } catch {
    // non-fatal
  }
}
</script>
