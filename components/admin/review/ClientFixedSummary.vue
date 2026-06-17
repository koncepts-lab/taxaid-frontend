<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8 p-8">
    <div class="mb-6">
      <h2 class="text-[22px] font-medium text-gray-900 mb-1">Client Fixed Summary</h2>
      <p class="text-[15px] text-gray-500">Monthly review appointments for all clients</p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-[60%]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input v-model="search" type="text"
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#00896F]"
          placeholder="Search by client name..." />
      </div>

      <!-- Month picker -->
      <div class="relative">
        <input v-model="selectedMonth" type="month"
          class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00896F] text-gray-700 bg-white" />
      </div>

      <button @click="handleRefresh" title="Refresh"
        class="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-t-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#00896F]">
          <tr>
            <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[8%]">Tenant ID</th>
            <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[18%]">Client Name</th>
            <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[24%]">Review Progress</th>
            <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[10%]">Status</th>
            <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[14%]">Scheduled Date</th>
            <th class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[12%]">Set Schedule</th>
            <th class="px-6 py-4 text-right text-[13px] font-medium text-white tracking-wider w-[14%]">Project Details</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100 border-x border-b border-gray-200">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-400">
              <div class="flex justify-center">
                <div class="w-6 h-6 border-2 border-[#00896F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredReviews.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-400">No reviews found for {{ selectedMonth }}.</td>
          </tr>
          <tr v-for="r in filteredReviews" :key="r.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{{ r.tenant_id }}</td>
            <td class="px-6 py-5 whitespace-nowrap text-[15px] font-medium text-gray-900">{{ r.client_name }}</td>
            <!-- Progress -->
            <td class="px-6 py-5">
              <div class="flex items-center gap-4 w-[85%]">
                <div class="flex-1 flex flex-col gap-2">
                  <span class="text-[13px] font-medium text-gray-800">
                    Steps {{ r.progress_current }}/{{ r.progress_total }}
                  </span>
                  <div class="w-full bg-[#EAEAEA] rounded-full h-[5px] overflow-hidden">
                    <div class="h-[5px] rounded-full transition-all"
                      :class="r.status === 'completed' ? 'bg-[#00896F]' : r.progress_current >= 1 && r.progress_current < r.progress_total ? 'bg-[#F39C12]' : r.status === 'scheduled' ? 'bg-[#5C8DFF]' : 'bg-gray-300'"
                      :style="`width: ${progressPercent(r)}%`"></div>
                  </div>
                </div>
                <span class="text-[13px] font-semibold text-gray-800 mt-5">{{ progressPercent(r) }}%</span>
              </div>
            </td>
            <!-- Status -->
            <td class="px-6 py-5 whitespace-nowrap">
              <span class="px-3.5 py-1 inline-flex text-xs font-semibold rounded-full" :style="statusStyle(displayStatus(r))">
                {{ statusLabel(displayStatus(r)) }}
              </span>
            </td>
            <!-- Scheduled Date -->
            <td class="px-6 py-5 whitespace-nowrap">
              <div v-if="r.scheduled_date" class="flex flex-col">
                <span class="text-sm text-gray-800">{{ formatDate(r.scheduled_date) }}</span>
                <span class="text-xs text-gray-500 mt-0.5">{{ r.scheduled_time }}</span>
              </div>
              <span v-else class="text-sm text-gray-400">—</span>
            </td>
            <!-- Set Schedule -->
            <td class="px-6 py-5 whitespace-nowrap">
              <button @click="openScheduleModal(r)"
                :disabled="r.status === 'cancelled' || r.status === 'completed'"
                class="px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-600 rounded-md hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                {{ r.scheduled_date ? 'Update Date' : 'Set Date' }}
              </button>
            </td>
            <!-- Project Details -->
            <td class="px-6 py-5 whitespace-nowrap text-right">
              <NuxtLink :to="`/admin/Review-Dashboard/${r.tenant_id}`"
                class="text-[#00896F] hover:text-[#006C58] font-medium text-[13px] flex items-center justify-end gap-1 transition-colors">
                Project Details
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Set Schedule Modal -->
    <SetScheduleModal
      v-model="isScheduleModalOpen"
      :review="selectedReview"
      @saved="handleScheduleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { format, parseISO } from 'date-fns'
import { useAdminMonthlyReviews } from '~/composables/admin/useAdminMonthlyReviews'
import type { AdminMonthlyReview } from '~/composables/admin/useAdminMonthlyReviews'
import SetScheduleModal from './SetScheduleModal.vue'

const { reviews, loading, fetchReviews } = useAdminMonthlyReviews()

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const search        = ref('')

const isScheduleModalOpen = ref(false)
const selectedReview      = ref<AdminMonthlyReview | null>(null)

const filteredReviews = computed(() => {
  if (!search.value.trim()) return reviews.value
  const q = search.value.toLowerCase()
  return reviews.value.filter(r => r.client_name.toLowerCase().includes(q))
})

const progressPercent = (r: AdminMonthlyReview) => {
  if (!r.progress_total) return 0
  return Math.round((r.progress_current / r.progress_total) * 100)
}

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const formatDate = (d: string) => {
  try { return format(parseISO(d.slice(0, 10)), 'MMM d, yyyy') } catch { return d }
}

const displayStatus = (r: AdminMonthlyReview) => {
  if (r.status === 'completed' || r.status === 'cancelled') return r.status
  if (r.progress_current >= 1 && r.progress_current < r.progress_total) return 'in_progress'
  return r.status
}

const statusStyle = (status: string) => {
  if (status === 'completed')   return { backgroundColor: '#D6F5ED', color: '#018E71' }
  if (status === 'in_progress') return { backgroundColor: '#FFF0DB', color: '#D97706' }
  if (status === 'scheduled')   return { backgroundColor: '#E5F1FF', color: '#3B82F6' }
  if (status === 'cancelled')   return { backgroundColor: '#FFE8E8', color: '#EF4444' }
  return { backgroundColor: '#F3F4F6', color: '#6B7280' } // pending
}

const statusLabel = (status: string) => {
  if (status === 'in_progress') return 'In Progress'
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : ''
}

async function loadReviews() {
  await fetchReviews(selectedMonth.value, search.value || undefined)
}

watch(selectedMonth, loadReviews)

function openScheduleModal(r: AdminMonthlyReview) {
  selectedReview.value    = r
  isScheduleModalOpen.value = true
}

async function handleScheduleSaved() {
  await loadReviews()
}

async function handleRefresh() {
  await loadReviews()
}

onMounted(loadReviews)
</script>
