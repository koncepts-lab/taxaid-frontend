<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-[1010] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>

      <div class="relative w-full max-w-[680px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" @click.stop>
        <!-- Header -->
        <div class="flex items-start justify-between px-8 pt-8 pb-4 flex-shrink-0">
          <div>
            <h2 class="text-[18px] font-medium text-[#0A0A0A]">Monthly Review</h2>
            <p class="text-[13px] text-gray-500 mt-0.5">
              {{ detail?.review?.client_name }} — {{ detail?.review?.month }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Status badge -->
            <span class="px-3 py-1 rounded-full text-[12px] font-medium" :style="statusStyle">
              {{ capitalize(detail?.review?.status ?? '') }}
            </span>
            <button @click="$emit('update:modelValue', false)"
              class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mx-8 h-px bg-gray-100 flex-shrink-0"></div>

        <!-- Progress + Meta -->
        <div class="px-8 py-5 flex-shrink-0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[13px] font-medium text-gray-700">
              Steps: {{ detail?.progress?.current ?? 0 }} / {{ detail?.progress?.total ?? 14 }}
            </span>
            <span class="text-[13px] font-semibold text-gray-800">{{ progressPercent }}%</span>
          </div>
          <div class="w-full bg-[#EAEAEA] rounded-full h-[6px] overflow-hidden">
            <div class="h-[6px] rounded-full transition-all duration-300"
              :class="detail?.review?.status === 'completed' ? 'bg-[#00896F]' : 'bg-[#5C8DFF]'"
              :style="`width: ${progressPercent}%`"></div>
          </div>

          <!-- Meet link -->
          <div v-if="detail?.review?.meet_url" class="mt-4 flex items-center gap-2 text-[13px]">
            <svg class="w-4 h-4 text-[#00896F] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <a :href="detail.review.meet_url" target="_blank" rel="noopener noreferrer"
              class="text-[#00896F] hover:underline break-all">
              {{ detail.review.meet_url }}
            </a>
          </div>

          <!-- Auto-completed banner -->
          <div v-if="autoCompletedBanner"
            class="mt-4 flex items-center gap-2 px-4 py-3 bg-[#E6FFF5] border border-[#00896F]/20 rounded-xl">
            <svg class="w-4 h-4 text-[#00896F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[13px] font-medium text-[#00896F]">Review Completed — all 14 steps answered.</span>
          </div>
        </div>

        <div class="mx-8 h-px bg-gray-100 flex-shrink-0"></div>

        <!-- Scrollable Questions -->
        <div class="overflow-y-auto px-8 py-6 flex-1">
          <div v-if="loadingDetail" class="flex justify-center py-12">
            <div class="w-8 h-8 border-2 border-[#00896F] border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="!detail?.questions?.length" class="text-center py-12 text-gray-400 text-sm">
            No questions found.
          </div>

          <div v-else class="space-y-5">
            <div v-for="q in detail.questions" :key="q.id"
              class="border border-gray-100 rounded-xl p-5 transition-colors"
              :class="q.answered ? 'bg-[#F8FFFD]' : 'bg-white'">
              <div class="flex items-start justify-between gap-4">
                <!-- Step number + text -->
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5"
                    :class="q.answered ? 'bg-[#00896F] text-white' : 'bg-gray-200 text-gray-500'">
                    {{ q.order }}
                  </span>
                  <span class="text-[14px] text-gray-800">{{ q.question_text }}</span>
                </div>

                <!-- Radio buttons -->
                <div class="flex items-center gap-4 flex-shrink-0">
                  <label class="flex items-center gap-1.5 cursor-pointer text-[13px] text-gray-700">
                    <input type="radio"
                      :name="`q-${q.id}`"
                      value="status"
                      :checked="q.selection === 'status'"
                      :disabled="savingId === q.id || detail?.review?.status === 'cancelled'"
                      @change="handleAnswer(q, 'status')"
                      class="accent-[#00896F] w-4 h-4 cursor-pointer"
                    />
                    Status
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer text-[13px] text-gray-700">
                    <input type="radio"
                      :name="`q-${q.id}`"
                      value="client_delay"
                      :checked="q.selection === 'client_delay'"
                      :disabled="savingId === q.id || detail?.review?.status === 'cancelled'"
                      @change="handleAnswer(q, 'client_delay')"
                      class="accent-[#F97316] w-4 h-4 cursor-pointer"
                    />
                    Client Delay
                  </label>
                  <!-- saving spinner -->
                  <div v-if="savingId === q.id" class="w-4 h-4 border-2 border-[#00896F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>

              <!-- Timestamp -->
              <div v-if="q.answered_at" class="mt-2 ml-9 text-[11px] text-gray-400">
                Answered {{ formatAnsweredAt(q.answered_at) }}
              </div>

              <!-- Notes textarea -->
              <div class="mt-3 ml-9">
                <textarea
                  v-model="localNotes[q.id]"
                  placeholder="Add notes (optional)..."
                  rows="2"
                  :disabled="detail?.review?.status === 'cancelled'"
                  @blur="handleNoteBlur(q)"
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-[#00896F] text-gray-600 placeholder-gray-300 disabled:bg-gray-50"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format, parseISO } from 'date-fns'
import type { AdminMonthlyReview } from '~/composables/admin/review/useAdminMonthlyReviews'

const props = defineProps<{
  modelValue: boolean
  review: AdminMonthlyReview | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'refreshList'): void
}>()

const { fetchDetail, saveAnswer } = useAdminMonthlyReviews()

const detail          = ref<any>(null)
const loadingDetail   = ref(false)
const savingId        = ref<number | null>(null)
const autoCompletedBanner = ref(false)
const localNotes      = ref<Record<number, string>>({})

const progressPercent = computed(() => {
  if (!detail.value?.progress?.total) return 0
  return Math.round((detail.value.progress.current / detail.value.progress.total) * 100)
})

const statusStyle = computed(() => {
  const s = detail.value?.review?.status
  if (s === 'completed') return { backgroundColor: '#D6F5ED', color: '#018E71' }
  if (s === 'scheduled') return { backgroundColor: '#E5F1FF', color: '#3B82F6' }
  if (s === 'cancelled') return { backgroundColor: '#FFE8E8', color: '#EF4444' }
  return { backgroundColor: '#FFF4E5', color: '#D97706' }
})

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const formatAnsweredAt = (dt: string) => {
  try { return format(parseISO(dt), 'MMM d, yyyy h:mm a') } catch { return dt }
}

watch(() => props.modelValue, async (open) => {
  if (open && props.review) {
    loadingDetail.value   = true
    autoCompletedBanner.value = false
    detail.value          = null
    localNotes.value      = {}
    try {
      detail.value = await fetchDetail(props.review.id)
      // Pre-populate notes from existing answers
      for (const q of detail.value?.questions ?? []) {
        if (q.notes) localNotes.value[q.id] = q.notes
      }
    } finally {
      loadingDetail.value = false
    }
  }
})

async function handleAnswer(question: any, selection: string) {
  if (savingId.value) return
  savingId.value = question.id
  try {
    const result = await saveAnswer(
      props.review!.id,
      question.id,
      selection,
      localNotes.value[question.id] ?? undefined
    )
    // Update local state
    const q = detail.value.questions.find((x: any) => x.id === question.id)
    if (q) {
      q.selection  = result.answer.selection
      q.answered   = true
      q.answered_at = result.answer.answered_at
    }
    detail.value.progress.current = result.progress_current
    detail.value.progress.total   = result.progress_total

    if (result.auto_completed) {
      detail.value.review.status = 'completed'
      autoCompletedBanner.value  = true
      emit('refreshList')
    }
  } catch {
    // Silently ignore — radio will revert visually
  } finally {
    savingId.value = null
  }
}

async function handleNoteBlur(question: any) {
  // Only save note if question already has a selection
  if (!question.selection) return
  try {
    await saveAnswer(props.review!.id, question.id, question.selection, localNotes.value[question.id] ?? undefined)
  } catch {
    // non-fatal
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.96) translateY(8px); opacity: 0; }
</style>
