<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6 p-8">
    <div class="mb-6">
      <h2 class="text-[22px] font-medium text-gray-900 mb-1">Client Request Pool</h2>
      <p class="text-[15px] text-gray-500">Manage client appointment requests</p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-[60%]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          :value="search"
          @input="onSearchInput"
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#00896F]"
          placeholder="Search by Client name or client id..."
        >
      </div>
      <button @click="$emit('refresh')" class="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <div class="relative w-56">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <select
          :value="statusFilter"
          @change="onStatusChange"
          class="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#00896F] text-gray-700 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-t-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#00896F]">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider">Client ID</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider">Client Name</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider">Proposed Date & Time</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider">Rescheduled Date & Time</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider">Status</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100 border-x border-b border-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-400">Loading...</td>
          </tr>
          <tr v-else-if="requests.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-500">No requests found.</td>
          </tr>
          <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-800">{{ req.tenant_id }}</td>
            <td class="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{{ req.client_name }}</td>
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{{ req.appointment_date }}, {{ req.appointment_time }}</td>
            <td class="px-6 py-5 whitespace-nowrap text-sm font-medium" :class="req.rescheduled_datetime ? 'text-[#C93B3B]' : 'text-gray-400'">
              {{ req.rescheduled_datetime || '-' }}
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              <span class="px-3.5 py-1 inline-flex text-xs font-semibold rounded-full" :class="getStatusClass(req.status)">
                {{ formatStatus(req.status) }}
              </span>
            </td>
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- View Details -->
                <button @click="openDetailsModal(req)" class="p-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <!-- Pending / Rescheduled actions -->
                <template v-if="req.status === 'rescheduled' || req.status === 'pending'">
                  <button @click="openRescheduleModal(req)" class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 bg-white text-[13px] font-medium">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reschedule
                  </button>
                  <button @click="openMeetUrlModal(req)" class="px-4 py-1.5 bg-[#4AD2A8] text-white rounded-md hover:bg-[#3ebe95] text-[13px] font-medium shadow-sm">
                    Confirm
                  </button>
                </template>

                <!-- Scheduled — session timer controls -->
                <template v-else-if="req.status === 'scheduled' || req.status === 'rescheduled'">
                  <SessionTimerRow
                    :appointment="req"
                    :any-running="isBlockedByAnother(req)"
                    @start="$emit('start-session', req.id)"
                    @pause="$emit('pause-session', req.id)"
                    @stop="$emit('stop-session', req.id)"
                    @complete="$emit('complete', req.id)"
                  />
                </template>

                <!-- Completed -->
                <template v-else-if="req.status === 'completed'">
                  <span class="flex items-center gap-1.5 text-[#00896F] text-[13px] font-semibold px-2 py-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Completed ({{ formatHours(req.completed_hours) }})
                  </span>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationBar
      v-if="meta"
      :page="meta.current_page"
      :totalPages="meta.last_page"
      :from="meta.from"
      :to="meta.to"
      :total="meta.total"
      @prev="fetchAppointments(meta.current_page - 1)"
      @next="fetchAppointments(meta.current_page + 1)"
    />

    <!-- Appointment Details Modal -->
    <div v-if="isDetailsModalOpen && selectedRequest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-md">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div class="px-6 py-5">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-[22px] font-medium text-gray-900">Appointment Details</h3>
            <button @click="isDetailsModalOpen = false" class="text-gray-400 hover:text-gray-800 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p class="text-[13px] text-gray-500 mb-1.5">Appointment Type</p>
              <span class="px-3 py-1 bg-[#D6F7EB] text-[#00896F] text-[13px] font-medium rounded-full">{{ selectedRequest.type }}</span>
            </div>
            <div>
              <p class="text-[13px] text-gray-500 mb-1.5">Consultant</p>
              <p class="text-[15px] font-medium text-gray-900">{{ selectedRequest.consultant }}</p>
            </div>
            <div>
              <p class="text-[13px] text-gray-500 mb-1.5">Status</p>
              <span class="px-3 py-1 inline-flex text-[13px] font-semibold rounded-full" :class="getStatusClass(selectedRequest.status)">
                {{ formatStatus(selectedRequest.status) }}
              </span>
            </div>
          </div>

          <!-- Session Time (admin only) -->
          <div class="bg-[#F0FDF9] border border-[#BBF7E8] rounded-xl p-4 mb-4">
            <p class="text-[13px] text-gray-500 mb-1">Session Time Used</p>
            <p class="text-[18px] font-semibold text-[#00896F]">
              {{ formatSecondsHMS(selectedRequest.session_elapsed_seconds) }}
              <span v-if="selectedRequest.session_started_at" class="text-[12px] font-normal text-[#F97316] ml-2">● Live</span>
            </p>
            <p v-if="selectedRequest.completed_hours" class="text-[13px] text-gray-500 mt-1">
              Completed hours: {{ selectedRequest.completed_hours }}h
            </p>
          </div>

          <!-- Alert for Rescheduled -->
          <div v-if="selectedRequest.status === 'rescheduled'" class="bg-[#FFF8F8] border border-[#FFD9D9] rounded-xl p-4 mb-6">
            <div class="flex items-start gap-2.5">
              <svg class="w-4 h-4 text-[#E63946] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-[13px] font-medium text-[#E63946] mb-1.5">Appointment Rescheduled by Admin</p>
                <div class="flex items-center gap-2 text-[13px] mb-1.5">
                  <span class="line-through text-gray-400">{{ selectedRequest.appointment_date }}, {{ selectedRequest.appointment_time }}</span>
                  <span class="font-bold text-[#E63946]">{{ selectedRequest.rescheduled_datetime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Meet Link -->
          <div v-if="selectedRequest.meet_url" class="mb-4">
            <p class="text-[13px] text-gray-500 mb-1.5">Meet Link</p>
            <a :href="selectedRequest.meet_url" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-[13px] text-[#00896F] font-medium hover:underline break-all">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ selectedRequest.meet_url }}
            </a>
          </div>

          <div>
            <h4 class="text-[15px] font-medium text-gray-900 mb-2.5">Notes</h4>
            <div class="bg-[#E6F9F3] rounded-xl p-4 text-[14px] text-gray-800 min-h-[90px] border border-transparent">
              {{ selectedRequest.notes || 'No notes.' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meet URL Modal -->
    <div v-if="isMeetUrlModalOpen && selectedRequest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-md">
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative">
        <div class="px-6 py-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-[17px] font-medium text-gray-900">Add Meet Link</h3>
            <button @click="isMeetUrlModalOpen = false" class="text-gray-400 hover:text-gray-800 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-[13px] text-gray-500 mb-4">Paste the Google Meet or Teams link for this appointment. The client will see this after confirmation.</p>
          <input
            v-model="meetUrlInput"
            type="url"
            placeholder="https://meet.google.com/..."
            class="block w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none text-gray-800 mb-1"
            :class="meetUrlError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#00896F]'"
            @keyup.enter="confirmApprove"
          />
          <p v-if="meetUrlError" class="text-[12px] text-red-500 mb-3">{{ meetUrlError }}</p>
          <div v-else class="mb-3"></div>
          <div class="flex gap-3">
            <button @click="isMeetUrlModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              Cancel
            </button>
            <button @click="confirmApprove" class="flex-[1.5] px-4 py-2.5 bg-[#4AD2A8] text-white rounded-xl text-sm font-medium hover:bg-[#3ebe95] transition-colors">
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="isRescheduleModalOpen && selectedRequest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-md">
      <div class="bg-white rounded-[24px] w-full max-w-[340px] shadow-2xl relative overflow-hidden">
        <div class="px-6 py-6">
          <!-- Month/Year header -->
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-medium text-gray-900 flex items-center gap-1">
              <button @click="prevMonth" class="mr-1 text-gray-400 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              {{ calMonthName }}
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              <span class="text-gray-500 font-normal ml-1">{{ calYear }}</span>
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              <button @click="nextMonth" class="ml-1 text-gray-400 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </h3>
            <button @click="isRescheduleModalOpen = false" class="text-gray-400 hover:text-gray-800 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Calendar grid -->
          <div class="mb-5 bg-[#F9FAFB] rounded-xl p-3">
            <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-3">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div class="grid grid-cols-7 gap-1.5 text-center text-[13px]">
              <button
                v-for="(day, i) in calDays"
                :key="i"
                @click="day.current ? selectDay(day.date) : null"
                :disabled="!day.current"
                class="py-1 rounded-lg transition-colors"
                :class="[
                  !day.current ? 'text-gray-300 cursor-default' :
                  day.isSelected ? 'bg-[#00896F] text-white font-medium shadow-sm' :
                  day.isToday ? 'font-medium text-[#00896F] relative' :
                  'font-medium text-gray-900 hover:bg-[#E6F9F3]'
                ]"
              >
                {{ day.label }}
                <span v-if="day.isToday && !day.isSelected" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00896F] rounded-full"></span>
              </button>
            </div>
          </div>

          <!-- Time select -->
          <div class="border-t border-gray-100 pt-5 mb-5">
            <label class="block text-[13px] font-medium text-gray-700 mb-2">Select Time</label>
            <div class="relative">
              <select v-model="rescheduleTime" class="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#00896F] text-gray-700 bg-white">
                <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <p class="text-[13px] text-center font-medium text-gray-700 mb-6">
            Rescheduling to <span class="text-[#E63946]">{{ rescheduleDisplayDate }}, {{ rescheduleTime }}</span>
          </p>

          <div class="flex gap-3">
            <button @click="isRescheduleModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              Cancel
            </button>
            <button @click="confirmReschedule" class="flex-[1.5] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00896F] text-white rounded-xl text-sm font-medium hover:bg-[#00735d] transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Confirm Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AdminAppointment } from '~/composables/admin/review/useAdminAppointments'
import { useAdminAppointments } from '~/composables/admin/review/useAdminAppointments'
import SessionTimerRow from './SessionTimerRow.vue'
import PaginationBar from './PaginationBar.vue'

const props = defineProps<{
  requests: AdminAppointment[]
  loading?: boolean
  search: string
  statusFilter: string
  currentActivityRunning?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:statusFilter', val: string): void
  (e: 'refresh'): void
  (e: 'approve', id: number, meetUrl: string): void
  (e: 'reschedule', id: number, date: string, time: string): void
  (e: 'cancel', id: number): void
  (e: 'complete', id: number): void
  (e: 'start-session', id: number): void
  (e: 'pause-session', id: number): void
  (e: 'stop-session', id: number): void
}>()

const { meta, fetchAppointments } = useAdminAppointments()

function isBlockedByAnother(req: AdminAppointment): boolean {
  if (props.currentActivityRunning) return true
  return props.requests.some(r =>
    r.id !== req.id &&
    r.status !== 'completed' &&
    (!!r.session_started_at || (r.session_elapsed_seconds ?? 0) > 0)
  )
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null

function onSearchInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:search', val)
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => emit('refresh'), 300)
}

function onStatusChange(e: Event) {
  emit('update:statusFilter', (e.target as HTMLSelectElement).value)
  emit('refresh')
}

// ─── Modals ──────────────────────────────────────────────────────────────────
const isDetailsModalOpen    = ref(false)
const isRescheduleModalOpen = ref(false)
const isMeetUrlModalOpen    = ref(false)
const selectedRequest       = ref<AdminAppointment | null>(null)
const rescheduleDate        = ref('')  // yyyy-MM-dd
const rescheduleTime        = ref('09:00 AM')
const meetUrlInput          = ref('')
const meetUrlError          = ref('')

function openMeetUrlModal(req: AdminAppointment) {
  selectedRequest.value = req
  meetUrlInput.value    = ''
  meetUrlError.value    = ''
  isMeetUrlModalOpen.value = true
}

function confirmApprove() {
  const url = meetUrlInput.value.trim()
  if (!url) { meetUrlError.value = 'Meet link is required.'; return }
  if (!/^https?:\/\/.+/.test(url)) { meetUrlError.value = 'Enter a valid URL starting with http(s)://'; return }
  emit('approve', selectedRequest.value!.id, url)
  isMeetUrlModalOpen.value = false
}

// ─── Calendar state ───────────────────────────────────────────────────────────
const calViewDate = ref(new Date())

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const calMonthName = computed(() => MONTHS[calViewDate.value.getMonth()])
const calYear      = computed(() => calViewDate.value.getFullYear())

const calDays = computed(() => {
  const year  = calViewDate.value.getFullYear()
  const month = calViewDate.value.getMonth()
  const first = new Date(year, month, 1).getDay()  // 0=Sun
  const total = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const days: { label: string; date: string; current: boolean; isToday: boolean; isSelected: boolean }[] = []

  // Padding from previous month
  const prevTotal = new Date(year, month, 0).getDate()
  for (let i = first - 1; i >= 0; i--) {
    days.push({ label: String(prevTotal - i), date: '', current: false, isToday: false, isSelected: false })
  }

  for (let d = 1; d <= total; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
    days.push({ label: String(d), date: dateStr, current: true, isToday, isSelected: rescheduleDate.value === dateStr })
  }

  // Padding to next month (fill to complete last row)
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push({ label: String(d), date: '', current: false, isToday: false, isSelected: false })
    }
  }

  return days
})

const rescheduleDisplayDate = computed(() => {
  if (!rescheduleDate.value) return '—'
  const [y, m, d] = rescheduleDate.value.split('-')
  return `${MONTHS[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}, ${y}`
})

const timeSlots = computed(() => {
  const slots: string[] = []
  for (let h = 8; h <= 18; h++) {
    for (const m of [0, 30]) {
      const period = h < 12 ? 'AM' : 'PM'
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
      slots.push(`${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`)
    }
  }
  return slots
})

function prevMonth() {
  const d = new Date(calViewDate.value)
  d.setMonth(d.getMonth() - 1)
  calViewDate.value = d
}

function nextMonth() {
  const d = new Date(calViewDate.value)
  d.setMonth(d.getMonth() + 1)
  calViewDate.value = d
}

function selectDay(dateStr: string) {
  rescheduleDate.value = dateStr
}

function openDetailsModal(req: AdminAppointment) {
  selectedRequest.value    = req
  isDetailsModalOpen.value = true
}

function openRescheduleModal(req: AdminAppointment) {
  selectedRequest.value = req
  const startDate = req.rescheduled_date ?? req.appointment_date
  rescheduleDate.value = startDate ?? ''
  rescheduleTime.value = '09:00 AM'
  // Set calendar view to the appointment's month
  if (startDate) calViewDate.value = new Date(startDate + 'T00:00:00')
  isRescheduleModalOpen.value = true
}

function confirmReschedule() {
  if (!selectedRequest.value || !rescheduleDate.value || !rescheduleTime.value) return
  emit('reschedule', selectedRequest.value.id, rescheduleDate.value, rescheduleTime.value)
  isRescheduleModalOpen.value = false
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getStatusClass(status: string) {
  switch (status) {
    case 'rescheduled': return 'bg-[#FFF3E0] text-[#F97316]'
    case 'pending':     return 'bg-[#FFF4D4] text-[#D99A29]'
    case 'scheduled':   return 'bg-[#E6EEFF] text-[#5174F0]'
    case 'completed':   return 'bg-[#E2F7ED] text-[#4BD37B]'
    case 'cancelled':   return 'bg-[#FFE9E9] text-[#F25A5A]'
    case 'extra_hours': return 'bg-[#F3E8FF] text-[#9333EA]'
    default:            return 'bg-gray-100 text-gray-800'
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatHours(hours: number | null): string {
  if (!hours || hours <= 0) return '0 min'
  const totalMinutes = Math.round(hours * 60)
  if (totalMinutes < 60) return `${totalMinutes} min`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function formatSecondsHMS(seconds: number) {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>
