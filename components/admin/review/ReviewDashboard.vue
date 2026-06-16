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
      <ClientFixedSummary :summaries="[]" />
    </div>

    <!-- Other Tabs Placeholders -->
    <div v-else class="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400">
      {{ activeTab }} Content Coming Soon
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTeamMemberActivity } from '~/composables/useWebsiteData'
import { useAdminAppointments } from '~/composables/admin/useAdminAppointments'
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

const activeTab = ref('client') // Defaulting to client tab for easier review
const tabs = [
  { id: 'activity', label: 'Activity Tracking' },
  { id: 'client', label: 'Client Management' },
  { id: 'masterlist', label: 'Masterlist' }
]

const isTimerRunning = ref(false)

const onTimerToggle = (running: boolean) => {
  isTimerRunning.value = running
}
</script>
