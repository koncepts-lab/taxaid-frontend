<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">{{ dashboard.total_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>

      <!-- Pending Review -->
      <div class="border border-[#FFE738] rounded-xl p-5 bg-[#FFFBE1] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Pending Review</div>
        <div class="text-3xl font-semibold text-[#A65F00]">{{ dashboard.not_reviewed ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#D97706]">
          <img src="/images/icons/Review-In-Progress.svg" class="w-6 h-6" alt="Review In Progress" />
        </div>
      </div>

      <!-- Need Scoring -->
      <div class="border border-[#81B8FF] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Need Scoring</div>
        <div class="text-3xl font-semibold text-[#1D4ED8]">{{ dashboard.not_scored ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <img src="/images/icons/review.svg" class="w-6 h-6" alt="In Development" />
        </div>
      </div>

      <!-- Scored -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-[#FFFFFFBF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Scored</div>
        <div class="text-3xl font-semibold text-[#15803D]">{{ dashboard.scored ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Completed.svg" class="w-6 h-6" alt="Completed" />
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[16px] p-4 flex flex-col md:flex-row gap-4">
      <div class="relative w-full md:flex-1">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input v-model="searchTerm" type="text" placeholder="Search tickets..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>

      <!-- Tickets Dropdown -->
      <div class="w-full md:w-[40%] lg:w-[30%] relative">
        <button @click="isTicketsOpen = !isTicketsOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedFilter.label }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isTicketsOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isTicketsOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="opt in filterOptions" :key="opt.key"
               @click="selectedFilter = opt; isTicketsOpen = false; fetchTickets(1)"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="opt.key === selectedFilter.key ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ opt.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Tickets for Technical Review</h2>
          <p class="text-gray-500 text-sm mt-1">Score technical feasibility, estimate costs</p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[20%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Lead Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Tech score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <template v-if="loadingTickets">
              <tr v-for="n in perPage" :key="`sk-${n}`" class="border-b border-gray-100 animate-pulse">
                <td colspan="8" class="py-4 px-6"><div class="h-4 bg-gray-100 rounded"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr v-if="!tickets.length">
                <td colspan="8" class="py-8 px-6 text-center text-gray-400">No tickets found.</td>
              </tr>
              <tr v-for="ticket in tickets" :key="ticket.ticket_custom_id" class="border-b border-gray-100 hover:bg-gray-50/50 last:border-b-0">
                <td class="py-4 px-6 text-gray-600 font-medium">{{ ticket.ticket_custom_id }}</td>
                <td class="py-4 px-6 text-gray-800">{{ ticket.title }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">{{ ticket.type ?? '—' }}</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.lead_score !== null && ticket.lead_score !== undefined" class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    {{ ticket.lead_score }}/10
                  </span>
                  <span v-else class="text-gray-400 font-medium">Not Scored</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.tech_score !== null && ticket.tech_score !== undefined" class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    {{ ticket.tech_score }}/10
                  </span>
                  <span v-else class="text-gray-400 font-medium">Not Scored</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.cost" class="inline-flex bg-[#DBEAFE] text-[#193CB8] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">AED {{ ticket.cost }}</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#D1FAE5] text-[#059669] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ ticket.status }}</span>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openDecisionModal(ticket, 'view')" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button v-if="ticket.tech_score === null || ticket.tech_score === undefined" @click="openDecisionModal(ticket, 'review')" class="inline-flex items-center gap-1.5 bg-[#008169] text-white rounded-md px-4 py-1.5 hover:bg-[#006A56] font-medium transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                      Score
                    </button>
                    <button v-if="ticket.status === 'Approved for Development'" @click="openProgressModal(ticket, 'start_working')" class="inline-flex items-center gap-1.5 bg-[#60A5FA] text-white rounded-md px-4 py-1.5 hover:bg-[#3B82F6] font-medium transition-colors">
                      Start Working
                    </button>
                    <button v-if="ticket.status === 'In Development'" @click="openProgressModal(ticket, 'developed')" class="inline-flex items-center gap-1.5 bg-[#008169] text-white rounded-md px-4 py-1.5 hover:bg-[#006A56] font-medium transition-colors">
                      Complete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="n in fillerRowCount" :key="`fill-${n}`" class="border-b border-gray-100 last:border-b-0" aria-hidden="true">
                <td colspan="8" class="py-4 px-6">&nbsp;</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <CommonPaginationBar
        :meta="pageMeta"
        :loading="loadingTickets"
        @page-change="(p) => fetchTickets(p)"
        @per-page-change="(pp) => { perPage = pp; fetchTickets(1) }"
      />
    </div>

    <TicketingDecisionModal
      :is-open="isDecisionModalOpen"
      :ticket="decisionTicket"
      :mode="decisionMode"
      role="tech_team"
      :submitting="scoring"
      :error="scoreError"
      @close="isDecisionModalOpen = false"
      @submit="handleDecisionSubmit"
    />

    <!-- Progress Action Modal (Start Working / Complete) -->
    <div v-if="isProgressModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col p-8 relative">
        <button @click="isProgressModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="flex flex-col items-center text-center mt-2">
          <div class="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-6 text-[#10B981]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h2 class="text-[20px] font-medium text-gray-900 mb-3">{{ progressModalCopy.title }}</h2>
          <p class="text-gray-600 mb-8">{{ progressModalCopy.body }}</p>
          <p v-if="progressError" class="text-red-600 text-sm mb-4">{{ progressError }}</p>

          <div class="flex items-center justify-center gap-4 w-full">
            <button @click="isProgressModalOpen = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button @click="confirmProgressAction" :disabled="progressing" class="px-6 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
              {{ progressing ? 'Submitting…' : 'Yes, Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { getTechDashboard, getAllTicketsForTech, reviewAsTech, getTicket, progressTicket } = useTicketing()

// Dashboard stats
const dashboard = ref({})
async function loadDashboard() {
  dashboard.value = await getTechDashboard()
}

// Filters + table + pagination
const filterOptions = [
  { key: 'all', label: 'All Tickets' },
  { key: 'need_scoring', label: 'Needs Scoring' },
  { key: 'scored', label: 'Scored' },
]
const isTicketsOpen = ref(false)
const selectedFilter = ref(filterOptions[0])
const searchTerm = ref('')

const tickets = ref([])
const loadingTickets = ref(false)
const perPage = ref(10)
const pageMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const fillerRowCount = computed(() => Math.max(0, perPage.value - Math.max(tickets.value.length, 1)))

async function fetchTickets(page = 1) {
  loadingTickets.value = true
  try {
    const params = { filter: selectedFilter.value.key, page, per_page: perPage.value }
    if (searchTerm.value) params.search = searchTerm.value
    const { items, meta } = await getAllTicketsForTech(params)
    tickets.value = items
    pageMeta.value = meta
  } finally {
    loadingTickets.value = false
  }
}

let searchDebounce
watch(searchTerm, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => fetchTickets(1), 350)
})

onMounted(async () => {
  await Promise.all([loadDashboard(), fetchTickets(1)])
})

// Review/View modal — shared DecisionModal component
const isDecisionModalOpen = ref(false)
const decisionTicket = ref(null)
const decisionMode = ref('review')
const scoring = ref(false)
const scoreError = ref('')

async function openDecisionModal(ticket, mode) {
  decisionMode.value = mode
  scoreError.value = ''
  isDecisionModalOpen.value = true
  decisionTicket.value = null
  if (ticket?.id) {
    decisionTicket.value = await getTicket(ticket.id)
  }
}

async function handleDecisionSubmit(payload) {
  if (!payload?.id) {
    scoreError.value = 'Missing ticket id.'
    return
  }
  scoring.value = true
  scoreError.value = ''
  try {
    await reviewAsTech(payload.id, {
      tech_score: payload.score,
      cost: payload.estimatedCost,
      tech_comments: payload.comment,
    })
    isDecisionModalOpen.value = false
    await Promise.all([loadDashboard(), fetchTickets(pageMeta.value.current_page)])
  } catch (e) {
    scoreError.value = e?.data?.message || 'Failed to submit score.'
  } finally {
    scoring.value = false
  }
}

// Tech Team's two actions: pick up a greenlit ticket, then mark it finished
const PROGRESS_COPY = {
  start_working: { title: 'Start working on this ticket?', body: 'This will move the status to In Development.' },
  developed:     { title: 'Mark this ticket as developed?', body: 'This will move the status to Completed.' },
}

const isProgressModalOpen = ref(false)
const progressTicketRef = ref(null)
const progressAction = ref(null)
const progressing = ref(false)
const progressError = ref('')

const progressModalCopy = computed(() => PROGRESS_COPY[progressAction.value] ?? { title: '', body: '' })

function openProgressModal(ticket, action) {
  progressTicketRef.value = ticket
  progressAction.value = action
  progressError.value = ''
  isProgressModalOpen.value = true
}

async function confirmProgressAction() {
  if (!progressTicketRef.value?.id || !progressAction.value) return
  progressing.value = true
  progressError.value = ''
  try {
    await progressTicket(progressTicketRef.value.id, progressAction.value)
    isProgressModalOpen.value = false
    await Promise.all([loadDashboard(), fetchTickets(pageMeta.value.current_page)])
  } catch (e) {
    progressError.value = e?.data?.message || 'Failed to update ticket.'
  } finally {
    progressing.value = false
  }
}
</script>
