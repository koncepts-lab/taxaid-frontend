<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-[1010] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>

      <div class="relative w-full max-w-[500px] bg-white rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl overflow-hidden border border-gray-100" @click.stop>

        <!-- Header -->
        <div class="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 class="text-xl font-bold text-[#013e32]">
              {{ review?.scheduled_date ? 'Update Schedule' : 'Set Schedule' }}
            </h2>
            <p class="text-[13px] text-gray-500 mt-0.5">{{ review?.client_name }} — {{ review?.month }}</p>
          </div>
          <button @click="close" class="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 overflow-y-auto max-h-[78vh] no-scrollbar space-y-4">

          <!-- ── Date Picker (same as appointment modal) ── -->
          <div>
            <label class="block text-[13px] font-medium text-gray-600 mb-1.5">Scheduled Date</label>
            <div class="relative">
              <button ref="dateBtn" @click="toggleCalendar"
                class="w-full pl-4 pr-10 h-[44px] rounded-[10px] border flex items-center justify-between transition-all cursor-pointer font-normal bg-white border-[#04C18F]/30"
                :class="selectedDate ? 'text-[#013e32]' : 'text-[#00000080]'">
                <span>{{ selectedDate ? formatDisplayDate(selectedDate) : 'dd-mm-yyyy' }}</span>
                <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <!-- Calendar Popover -->
              <Transition name="dropdown">
                <div v-if="activeDropdown === 'calendar'"
                  class="fixed z-[1300] border rounded-xl shadow-2xl overflow-hidden bg-white border-gray-100"
                  :style="calStyle">
                  <VDatePicker
                    v-model="selectedDate"
                    :min-date="tomorrow"
                    @update:model-value="activeDropdown = null"
                    color="emerald"
                    borderless
                  />
                </div>
              </Transition>
            </div>
            <p v-if="errors.date" class="mt-1 text-[12px] text-red-500">{{ errors.date }}</p>
          </div>

          <!-- ── Time Picker (wheel selects + manual input) ── -->
          <div>
            <label class="block text-[13px] font-medium text-gray-600 mb-1.5">Scheduled Time</label>

            <CommonTimePicker
              v-model:hour="timeHour"
              v-model:minute="timeMinute"
              v-model:ampm="timeAmpm" />

            <p v-if="errors.time" class="mt-1 text-[12px] text-red-500">{{ errors.time }}</p>
          </div>

          <!-- ── Meet URL ── -->
          <div>
            <label class="block text-[13px] font-medium text-gray-600 mb-1.5">
              Meet Link (optional)
            </label>
            <input
              v-model="meetUrl"
              type="url"
              placeholder="https://meet.google.com/..."
              class="w-full px-4 h-[44px] rounded-[10px] border border-[#04C18F]/30 focus:outline-none focus:border-[#04C18F] text-[14px] text-[#013e32] placeholder-gray-300"
            />
            <p v-if="errors.meetUrl" class="mt-1 text-[12px] text-red-500">{{ errors.meetUrl }}</p>
          </div>

          <!-- ── Notes ── -->
          <div>
            <label class="block text-[13px] font-medium text-gray-600 mb-1.5">Notes (optional)</label>
            <textarea
              v-model="notes"
              rows="3"
              placeholder="Add any notes for the client about this review..."
              class="w-full px-4 py-3 rounded-[12px] border border-[#04C18F]/30 focus:outline-none focus:border-[#04C18F] text-[14px] text-[#013e32] placeholder-gray-300 resize-none"
            ></textarea>
            <p class="text-[11px] text-gray-400 mt-1">If left empty, client will see "Monthly TaxAid Review" as the notes.</p>
          </div>

        </div>

        <!-- Error -->
        <div v-if="errors.general" class="mx-6 mb-2 px-4 py-2 rounded-[10px] text-sm text-red-600 bg-red-50 border border-red-200">
          {{ errors.general }}
        </div>

        <!-- Footer -->
        <div class="p-6 flex items-center gap-4">
          <button @click="handleConfirm" :disabled="submitting"
            class="flex-1 h-[48px] rounded-[12px] bg-[#007B5B] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#00664B] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            <svg v-if="!submitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span>{{ submitting ? 'Saving...' : 'Confirm Schedule' }}</span>
          </button>
          <button @click="close"
            class="flex-1 h-[48px] rounded-[12px] bg-white border border-[#04C18F] text-[#013e32] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { format, parseISO } from 'date-fns'
import { useAdminMonthlyReviews } from '~/composables/admin/review/useAdminMonthlyReviews'
import type { AdminMonthlyReview } from '~/composables/admin/review/useAdminMonthlyReviews'

const props = defineProps<{
  modelValue: boolean
  review: AdminMonthlyReview | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'saved'): void
}>()

const { setSchedule } = useAdminMonthlyReviews()

// Calendar
const selectedDate   = ref<Date | null>(null)
const activeDropdown = ref<string | null>(null)
const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0,0,0,0); return d })()

// Time wheel
const timeHour    = ref('09')
const timeMinute  = ref('00')
const timeAmpm    = ref('AM')

// Meet URL + Notes
const meetUrl = ref('')
const notes   = ref('')

const submitting = ref(false)
const errors     = ref<Record<string, string>>({})

const dateBtn  = ref<HTMLElement | null>(null)
const calStyle = ref<Record<string, string>>({})
const CAL_HEIGHT = 330
const CAL_WIDTH  = 300

function toggleCalendar() {
  if (activeDropdown.value === 'calendar') { activeDropdown.value = null; return }
  const rect = dateBtn.value?.getBoundingClientRect()
  if (rect) {
    const spaceBelow = window.innerHeight - rect.bottom
    const top  = spaceBelow >= CAL_HEIGHT + 12 ? rect.bottom + 8 : Math.max(8, rect.top - CAL_HEIGHT - 8)
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - CAL_WIDTH - 8)
    calStyle.value = { top: `${top}px`, left: `${left}px` }
  }
  activeDropdown.value = 'calendar'
}

function close() {
  activeDropdown.value = null
  emit('update:modelValue', false)
}

function formatDisplayDate(date: Date) {
  return format(date, 'dd-MM-yyyy')
}

// Pre-fill from existing review when modal opens
watch(() => props.modelValue, (open) => {
  if (!open) return
  errors.value          = {}
  submitting.value      = false
  activeDropdown.value  = null

  if (props.review?.scheduled_date) {
    try { selectedDate.value = parseISO(props.review.scheduled_date) } catch { selectedDate.value = null }
  } else {
    selectedDate.value = null
  }

  if (props.review?.scheduled_time) {
    const m = props.review.scheduled_time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (m) {
      timeHour.value   = String(parseInt(m[1])).padStart(2, '0')
      timeMinute.value = m[2]
      timeAmpm.value   = m[3].toUpperCase()
    }
  } else {
    timeHour.value   = '09'
    timeMinute.value = '00'
    timeAmpm.value   = 'AM'
  }

  meetUrl.value         = props.review?.meet_url ?? ''
  notes.value           = props.review?.notes ?? ''
})

async function handleConfirm() {
  errors.value = {}

  if (!selectedDate.value) { errors.value.date    = 'Date is required.' }
  if (meetUrl.value && !/^https?:\/\/.+/.test(meetUrl.value)) {
    errors.value.meetUrl = 'Enter a valid meet link (https://...).'
  }
  if (Object.keys(errors.value).length) return

  const dateStr = format(selectedDate.value!, 'yyyy-MM-dd')
  const timeStr = `${timeHour.value}:${timeMinute.value} ${timeAmpm.value}`

  submitting.value = true
  try {
    await setSchedule(props.review!.id, dateStr, timeStr, meetUrl.value || null, notes.value || null)
    emit('update:modelValue', false)
    emit('saved')
  } catch (err: any) {
    errors.value.general = err?.data?.message ?? 'Failed to save schedule.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-10px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

select { background-image: none; }

:deep(.vc-emerald) {
  --vc-accent-50: #f0fdfa;
  --vc-accent-100: #ccfbf1;
  --vc-accent-500: #029F80;
  --vc-accent-600: #0d9488;
}
:deep(.vc-container) { border: none !important; background: transparent !important; }
</style>
