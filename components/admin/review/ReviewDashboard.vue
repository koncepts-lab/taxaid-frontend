<template>
  <div class="p-8 space-y-6 min-h-screen bg-[#F8F9FA]">
    <!-- Header with Tabs -->
    <div class="flex justify-between items-start mb-8">
      <!-- Main Navigation Tabs -->
      <div class="flex bg-white p-1.5 rounded-full shadow-sm w-fit border border-gray-100">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="px-12 py-2 rounded-full text-[14px] font-medium transition-all duration-300"
          :class="activeTab === tab.id ? 'bg-[#8EFDE0] text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Activity Tracking Content -->
    <div v-if="activeTab === 'activity'">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-[26px] font-semibold text-[#004D40] mb-1">Activity Tracking</h1>
          <p class="text-[15px] text-gray-500">Track your daily work sessions, activities, and performance metrics</p>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Activity Log History
        </button>
      </div>

      <!-- Top Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ReviewStatsCard title="Number of Active Clients" :value="metrics.activeClients || '0'">
          <template #icon>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </template>
        </ReviewStatsCard>
        
        <ReviewStatsCard title="Average Productive Hours" :value="metrics.avgProductiveHours || '0 hrs 0 min'">
          <template #icon>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </ReviewStatsCard>
        
        <ReviewTimer :initialRunning="false" @toggle="onTimerToggle" />
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl border border-[#A5E5D9] shadow-sm p-6">
        <ReviewTable 
          :isTimerRunning="isTimerRunning" 
          :activities="activities" 
          :totalHours="monthlySummary.totalHours || '00:00:00 hrs'" 
        />
      </div>
    </div>

    <!-- Client Management Content -->
    <div v-else-if="activeTab === 'client'">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h1 class="text-[26px] font-semibold text-[#004D40] mb-1">Client Management</h1>
          <p class="text-[15px] text-gray-500">Manage client appointment requests and review client summary</p>
        </div>
      </div>
      
      <ClientRequestPool
        :requests="appointments"
        :loading="loading"
        v-model:search="search"
        v-model:status-filter="statusFilter"
        @refresh="fetchAppointments"
        @approve="approveAppointment"
        @reschedule="rescheduleAppointment"
        @cancel="cancelAppointment"
        @complete="completeAppointment"
        @start-session="startSession"
        @pause-session="pauseSession"
        @stop-session="stopSession"
      />
      <ClientFixedSummary />
    </div>

    <!-- Masterlist Content -->
    <div v-else-if="activeTab === 'masterlist'">
      <div class="mb-6">
        <h1 class="text-[26px] font-semibold text-[#004D40] mb-1">Masterlist - Client Projects</h1>
        <p class="text-[15px] text-gray-500">Overview of monthly reviews and appointment progress per client</p>
      </div>

      <!-- Sub Tabs -->
      <div class="flex bg-white rounded-full shadow-sm border border-gray-100 mb-6 w-fit">
        <button v-for="tab in masterlistTabs" :key="tab.id" @click="activeMasterlistTab = tab.id"
          class="px-10 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 m-1"
          :class="activeMasterlistTab === tab.id ? 'bg-[#8EFDE0] text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'">
          {{ tab.label }}
        </button>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-4 mb-6">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="masterlistSearch" type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#00896F]" placeholder="Search by client name...">
        </div>
        <button @click="refreshMasterlist" class="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors bg-white shadow-sm">
          <svg class="w-5 h-5" :class="masterlistLoading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <!-- Client Fixed Tab -->
      <div v-if="activeMasterlistTab === 'fixed'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-[#00896F]">
            <tr>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[12%]">Client ID</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[25%]">Client Name</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[20%]">Monthly Progress</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[15%]">Status</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[18%]">Scheduled Date</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[10%]">Month</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-if="masterlistLoading">
              <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-400 text-sm">Loading...</td>
              </tr>
            </template>
            <template v-else-if="filteredFixedRows.length === 0">
              <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 text-sm">No monthly reviews found.</td>
              </tr>
            </template>
            <tr v-else v-for="r in filteredFixedRows" :key="r.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-600">{{ r.tenant_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-gray-900">{{ r.client_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all"
                      :class="r.progress_current >= r.progress_total ? 'bg-[#00896F]' : r.progress_current > 0 ? 'bg-amber-400' : 'bg-gray-300'"
                      :style="`width: ${r.progress_total > 0 ? Math.round((r.progress_current / r.progress_total) * 100) : 0}%`">
                    </div>
                  </div>
                  <span class="text-[13px] font-medium text-gray-700">{{ r.progress_current }}/{{ r.progress_total }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium"
                  :class="fixedBadgeClass(r)">
                  {{ fixedDisplayLabel(r) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-700">
                {{ r.scheduled_date ? formatMasterDate(r.scheduled_date) : '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-600">{{ r.month }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- All Appointments Tab -->
      <div v-if="activeMasterlistTab === 'all'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-[#00896F]">
            <tr>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[10%]">Client ID</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[25%]">Client Name</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[15%]">Type</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[22%]">Progress</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[13%]">Status</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[15%]">Info</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-if="masterlistLoading">
              <tr><td colspan="6" class="px-6 py-8 text-center text-gray-400 text-sm">Loading...</td></tr>
            </template>
            <template v-else-if="allRows.length === 0">
              <tr><td colspan="6" class="px-6 py-8 text-center text-gray-500 text-sm">No records found.</td></tr>
            </template>
            <tr v-else v-for="r in allRows" :key="r.key" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-600">{{ r.tenant_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-gray-900">{{ r.client_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium"
                  :class="r.type === 'Monthly Fixed' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                  {{ r.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all"
                      :class="r.progress_total > 0 && r.progress_current >= r.progress_total ? 'bg-[#00896F]' : r.progress_current > 0 ? 'bg-amber-400' : 'bg-gray-300'"
                      :style="`width: ${r.progress_total > 0 ? Math.round((r.progress_current / r.progress_total) * 100) : 0}%`">
                    </div>
                  </div>
                  <span class="text-[13px] font-medium text-gray-700">{{ r.progress_current }}/{{ r.progress_total }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="r.status !== null" class="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium"
                  :class="allRowBadgeClass(r)">
                  {{ allRowDisplayLabel(r) }}
                </span>
                <span v-else class="text-[13px] text-gray-400">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-600">{{ r.extra }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Client Review Tab -->
      <div v-if="activeMasterlistTab === 'review'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-[#00896F]">
            <tr>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[12%]">Client ID</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[30%]">Client Name</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[25%]">Appointment Progress</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[15%]">Completed</th>
              <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[18%]">Total Appointments</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-if="masterlistLoading">
              <tr>
                <td colspan="5" class="px-6 py-8 text-center text-gray-400 text-sm">Loading...</td>
              </tr>
            </template>
            <template v-else-if="filteredReviewRows.length === 0">
              <tr>
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 text-sm">No appointment data found.</td>
              </tr>
            </template>
            <tr v-else v-for="r in filteredReviewRows" :key="r.tenant_id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-600">{{ r.tenant_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-gray-900">{{ r.client_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all"
                      :class="r.total > 0 && r.completed >= r.total ? 'bg-[#00896F]' : r.completed > 0 ? 'bg-amber-400' : 'bg-gray-300'"
                      :style="`width: ${r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0}%`">
                    </div>
                  </div>
                  <span class="text-[13px] font-medium text-gray-700">{{ r.completed }}/{{ r.total }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-700">{{ r.completed }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-[13px] text-gray-700">{{ r.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { format, parseISO } from 'date-fns'
import { useTeamMemberActivity } from '~/composables/useWebsiteData'
import { useAdminAppointments } from '~/composables/admin/useAdminAppointments'
import { useAdminMonthlyReviews } from '~/composables/admin/useAdminMonthlyReviews'
import ReviewStatsCard from './ReviewStatsCard.vue'
import ReviewTimer from './ReviewTimer.vue'
import ReviewTable from './ReviewTable.vue'
import ClientRequestPool from './ClientRequestPool.vue'
import ClientFixedSummary from './ClientFixedSummary.vue'

// Activity Data
const { metrics, activities, monthlySummary } = useTeamMemberActivity()

// Client Management Data
const {
  appointments,
  loading,
  error,
  search,
  statusFilter,
  fetchAppointments,
  approveAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  startSession,
  pauseSession,
  stopSession,
} = useAdminAppointments()

onMounted(() => fetchAppointments())

const activeTab = ref('client')
const tabs = [
  { id: 'activity', label: 'Activity Tracking' },
  { id: 'client', label: 'Client Management' },
  { id: 'masterlist', label: 'Masterlist' }
]

// ─── Masterlist ──────────────────────────────────────────────────────────────

const activeMasterlistTab = ref('fixed')
const masterlistTabs = [
  { id: 'fixed',  label: 'Client Fixed' },
  { id: 'review', label: 'Client Review' },
  { id: 'all',    label: 'All Appointments' },
]

const masterlistSearch = ref('')
const masterlistLoading = ref(false)

// Client Fixed — monthly reviews
const { reviews: fixedRows, fetchReviews } = useAdminMonthlyReviews()
const currentMonth = new Date().toISOString().slice(0, 7)

// Client Review — appointment summary per client
const reviewRows = ref<{ tenant_id: number; client_name: string; total: number; completed: number }[]>([])

async function fetchClientReview() {
  try {
    const res: any = await useApi('/admin/appointments/client-summary')
    reviewRows.value = res.data ?? []
  } catch { /* non-fatal */ }
}

async function refreshMasterlist() {
  masterlistLoading.value = true
  try {
    if (activeMasterlistTab.value === 'fixed') {
      await fetchReviews(currentMonth)
    } else if (activeMasterlistTab.value === 'review') {
      await fetchClientReview()
    } else {
      await Promise.all([fetchReviews(currentMonth), fetchClientReview()])
    }
  } finally {
    masterlistLoading.value = false
  }
}

watch(activeMasterlistTab, () => refreshMasterlist())

onMounted(async () => {
  masterlistLoading.value = true
  await Promise.all([fetchReviews(currentMonth), fetchClientReview()])
  masterlistLoading.value = false
})

const filteredFixedRows = computed(() => {
  const q = masterlistSearch.value.toLowerCase()
  if (!q) return fixedRows.value
  return fixedRows.value.filter((r: any) => r.client_name?.toLowerCase().includes(q))
})

const filteredReviewRows = computed(() => {
  const q = masterlistSearch.value.toLowerCase()
  if (!q) return reviewRows.value
  return reviewRows.value.filter(r => r.client_name?.toLowerCase().includes(q))
})

const allRows = computed(() => {
  const q = masterlistSearch.value.toLowerCase()
  const fixed = fixedRows.value.map((r: any) => ({
    key: `fixed-${r.id}`,
    tenant_id: r.tenant_id,
    client_name: r.client_name,
    type: 'Monthly Fixed',
    progress_current: r.progress_current,
    progress_total: r.progress_total,
    status: r.status,
    extra: r.scheduled_date ? formatMasterDate(r.scheduled_date) : r.month,
  }))
  const review = reviewRows.value.map(r => ({
    key: `review-${r.tenant_id}`,
    tenant_id: r.tenant_id,
    client_name: r.client_name,
    type: 'Client Review',
    progress_current: r.completed,
    progress_total: r.total,
    status: null,
    extra: `${r.total} appointments`,
  }))
  const merged = [...fixed, ...review].sort((a, b) => a.client_name.localeCompare(b.client_name))
  if (!q) return merged
  return merged.filter(r => r.client_name.toLowerCase().includes(q))
})

function formatMasterDate(d: string) {
  try { return format(parseISO(d), 'MMM dd, yyyy') } catch { return d }
}

function fixedDisplayStatus(r: any): string {
  if (r.status === 'completed' || r.status === 'cancelled') return r.status
  if (r.progress_current >= 1 && r.progress_current < r.progress_total) return 'in_progress'
  return r.status
}

function fixedBadgeClass(r: any): string {
  const s = fixedDisplayStatus(r)
  if (s === 'completed')   return 'bg-green-100 text-green-700'
  if (s === 'in_progress') return 'bg-amber-100 text-amber-700'
  if (s === 'scheduled')   return 'bg-blue-100 text-blue-700'
  if (s === 'cancelled')   return 'bg-red-100 text-red-600'
  return 'bg-gray-100 text-gray-600'
}

function fixedDisplayLabel(r: any): string {
  const s = fixedDisplayStatus(r)
  if (s === 'in_progress') return 'In Progress'
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

function allRowBadgeClass(r: any): string {
  return fixedBadgeClass(r)
}

function allRowDisplayLabel(r: any): string {
  return fixedDisplayLabel(r)
}

// ─── Timer ───────────────────────────────────────────────────────────────────

const isTimerRunning = ref(false)

const onTimerToggle = (running: boolean) => {
  isTimerRunning.value = running
}
</script>
