<template>
  <NuxtLayout name="admin">
    <ClientOnly>
      <AdminHeader role="member" />

      <div class="p-8 space-y-6 min-h-screen bg-[#F8F9FA]">
        <!-- Back + Title -->
        <div class="flex items-center gap-4 mb-2">
          <NuxtLink to="/admin/Review-Dashboard?tab=activity" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </NuxtLink>
        </div>

        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-[26px] font-semibold text-[#004D40] mb-1">Activity Log History</h1>
            <p class="text-[15px] text-gray-500">Review daily work sessions and activity entries by date</p>
          </div>
        </div>

        <!-- Date Navigation -->
        <div class="flex items-center gap-3">
          <button @click="prevDay" class="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Calendar Picker -->
          <div class="relative">
            <button @click="calendarOpen = !calendarOpen"
              class="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formattedSelectedDate }}
            </button>
            <Transition name="dropdown">
              <div v-if="calendarOpen" class="absolute top-full left-0 mt-2 z-[60] border rounded-xl shadow-2xl overflow-hidden bg-white border-gray-100">
                <VDatePicker
                  v-model="calendarDate"
                  @update:model-value="onCalendarSelect"
                  color="emerald"
                  borderless
                />
              </div>
            </Transition>
          </div>

          <button @click="nextDay" class="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button @click="goToday" class="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            Today
          </button>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl border border-[#A5E5D9] shadow-sm p-6">
            <p class="text-sm text-gray-500 font-medium mb-2">Total Hours</p>
            <p class="text-2xl font-bold text-gray-900">{{ sessionHrsFormatted }}</p>
            <p class="text-xs text-gray-400 mt-1">Productive Time</p>
          </div>

          <div class="bg-white rounded-2xl border border-[#A5E5D9] shadow-sm p-6">
            <p class="text-sm text-gray-500 font-medium mb-2">Appointments</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalAppointments }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ appointmentBreakdown }}</p>
          </div>

          <div class="bg-white rounded-2xl border border-[#A5E5D9] shadow-sm p-6">
            <p class="text-sm text-gray-500 font-medium mb-2">Internal</p>
            <p class="text-2xl font-bold text-gray-900">{{ dateStats?.log_count_internal ?? 0 }}</p>
            <p class="text-xs text-gray-400 mt-1">Internal tasks logged</p>
          </div>
        </div>

        <!-- Activity Table -->
        <div class="bg-white rounded-xl border border-[#A5E5D9] shadow-sm p-6">
          <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
          <ReviewTable
            v-else
            :activities="dateLogs"
            :isTimerRunning="false"
            :totalHours="totalLoggedFormatted"
            :hideAddButton="true"
          />
        </div>
      </div>

      <template #fallback>
        <div class="p-20 text-center">Loading...</div>
      </template>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, addDays, subDays, parseISO } from 'date-fns'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { useActivityTracking } from '~/composables/admin/useActivityTracking'
import type { DailyStats } from '~/composables/admin/useActivityTracking'
import ReviewTable from '~/components/admin/review/ReviewTable.vue'

const { fetchDailyLogs } = useActivityTracking()

const selectedDate  = ref(new Date().toISOString().slice(0, 10))
const calendarDate  = ref(new Date())
const calendarOpen  = ref(false)
const loading       = ref(false)
const dateSession   = ref<any>(null)
const dateStats     = ref<DailyStats | null>(null)
const dateLogs      = ref<any[]>([])

const formattedSelectedDate = computed(() =>
  format(parseISO(selectedDate.value), 'MMMM dd, yyyy')
)

const sessionHrsFormatted = computed(() => {
  const mins = dateStats.value?.session_duration_minutes ?? 0
  return `${Math.floor(mins / 60)} hrs ${mins % 60} min`
})

const totalLoggedFormatted = computed(() => {
  const mins = dateStats.value?.total_logged_minutes ?? 0
  return `${Math.floor(mins / 60)} hrs ${mins % 60} min`
})

const totalAppointments = computed(() =>
  (dateStats.value?.log_count_fixed ?? 0) + (dateStats.value?.log_count_review ?? 0)
)

const appointmentBreakdown = computed(() => {
  const f = dateStats.value?.log_count_fixed ?? 0
  const r = dateStats.value?.log_count_review ?? 0
  return `${f} Client Fixed · ${r} Client Review`
})

async function load(date: string) {
  loading.value = true
  try {
    const res = await fetchDailyLogs(date)
    dateSession.value = res.session
    dateStats.value   = res.stats
    dateLogs.value    = res.logs
  } finally {
    loading.value = false
  }
}

function prevDay() {
  selectedDate.value = format(subDays(parseISO(selectedDate.value), 1), 'yyyy-MM-dd')
  calendarDate.value = parseISO(selectedDate.value)
  load(selectedDate.value)
}

function nextDay() {
  selectedDate.value = format(addDays(parseISO(selectedDate.value), 1), 'yyyy-MM-dd')
  calendarDate.value = parseISO(selectedDate.value)
  load(selectedDate.value)
}

function goToday() {
  selectedDate.value = new Date().toISOString().slice(0, 10)
  calendarDate.value = new Date()
  load(selectedDate.value)
}

function onCalendarSelect(date: Date) {
  selectedDate.value = format(date, 'yyyy-MM-dd')
  calendarOpen.value = false
  load(selectedDate.value)
}

onMounted(() => load(selectedDate.value))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
