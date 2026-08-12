<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">{{ dashboard.total_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
           <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>

      <!-- Need Validation -->
      <div class="border border-[#FDBA74] rounded-xl p-5 bg-[#FFF7ED] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Need Validation</div>
        <div class="text-3xl font-semibold text-[#C2410C]">{{ dashboard.not_reviewed ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#EA580C]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
      </div>

      <!-- Overdue Reviews -->
      <div class="border border-[#FCA5A5] rounded-xl p-5 bg-[#FEF2F2] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Overdue Reviews</div>
        <div class="text-3xl font-semibold text-[#DC2626]">{{ dashboard.overdue_reviews ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#EF4444]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      </div>

      <!-- In Development -->
      <div class="border border-[#BFDBFE] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">In Development</div>
        <div class="text-3xl font-semibold text-[#1D4ED8]">{{ dashboard.in_development ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
          </svg>
        </div>
      </div>

      <!-- Completed -->
      <div class="border border-[#86EFAC] rounded-xl p-5 bg-[#F0FDF4] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Completed</div>
        <div class="text-3xl font-semibold text-[#15803D]">{{ dashboard.developed ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#16A34A]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-2 mt-8 px-2 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key; fetchTickets(1)"
        :class="activeTab === tab.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold' : 'text-gray-700 font-medium hover:text-gray-900'"
        class="px-6 py-2 rounded-full transition-colors">
        {{ tab.label }} ({{ (tab.key === 'all' ? dashboard.total_tickets : dashboard[tab.key]) ?? 0 }})
      </button>
    </div>

    <!-- Search -->
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
    </div>

    <!-- Tickets Table -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h2 class="text-xl font-medium text-gray-800">Tickets for VP Review</h2>
          <p class="text-gray-500 text-sm mt-1">Validate technical feasibility, approve for development</p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[25%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Lead Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Tech score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Status</th>
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
                <td class="py-4 px-6 text-gray-800">{{ ticket.issue }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">{{ ticket.type ?? '—' }}</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.score !== null && ticket.score !== undefined" class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">{{ ticket.score }}/10</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.tech_score !== null && ticket.tech_score !== undefined" class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">{{ ticket.tech_score }}/10</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.cost" class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">AED {{ ticket.cost }}</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ ticket.status }}</span>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openDecisionModal(ticket, 'view')" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button v-if="!ticket.vp_decision" @click="openDecisionModal(ticket, 'review')" class="inline-flex items-center gap-1.5 bg-[#00AD5FCC] text-white rounded-md px-4 py-1.5 hover:bg-[#22C55E] font-medium transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      Review
                    </button>
                    <template v-if="ticket.status === 'Admin Approved'">
                      <button @click="openStartDevModal(ticket)" class="inline-flex items-center gap-1.5 bg-[#60A5FA] text-white rounded-md px-4 py-1.5 hover:bg-[#3B82F6] font-medium transition-colors min-w-[110px] justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Strart Dev
                      </button>
                      <button @click="openFlagModal(ticket)" class="inline-flex items-center gap-1.5 bg-[#F59E0B] text-white rounded-md px-4 py-1.5 hover:bg-[#D97706] font-medium transition-colors">
                        Flag
                      </button>
                      <button @click="openFutureModal(ticket)" class="inline-flex items-center gap-1.5 bg-gray-400 text-white rounded-md px-4 py-1.5 hover:bg-gray-500 font-medium transition-colors">
                        Future
                      </button>
                    </template>
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
      role="vp"
      :submitting="reviewing"
      :error="reviewError"
      @close="isDecisionModalOpen = false"
      @submit="handleDecisionSubmit"
    />

    <!-- Progress Action Modal (Start Dev / Flag / Future) -->
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
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

const { getVpDashboard, getVpTickets, reviewAsVp, progressTicket, getTicket } = useTicketing()

// Dashboard stats
const dashboard = ref({})
async function loadDashboard() {
  dashboard.value = await getVpDashboard()
}

// Tabs + table + pagination
const tabs = [
  { key: 'all', label: 'All' },
  { key: 'not_reviewed', label: 'Needs Action' },
  { key: 'in_development', label: 'In Development' },
  { key: 'developed', label: 'Completed' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]
const activeTab = ref('all')
const searchTerm = ref('')
const tickets = ref([])
const loadingTickets = ref(false)
const perPage = ref(10)
const pageMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const fillerRowCount = computed(() => Math.max(0, perPage.value - Math.max(tickets.value.length, 1)))

async function fetchTickets(page = 1) {
  loadingTickets.value = true
  try {
    const params = { filter: activeTab.value, page, per_page: perPage.value }
    if (searchTerm.value) params.search = searchTerm.value
    const { items, meta } = await getVpTickets(params)
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
const reviewing = ref(false)
const reviewError = ref('')

async function openDecisionModal(ticket, mode) {
  decisionMode.value = mode
  reviewError.value = ''
  isDecisionModalOpen.value = true
  decisionTicket.value = null
  if (ticket?.id) {
    decisionTicket.value = await getTicket(ticket.id)
  }
}

async function handleDecisionSubmit(payload) {
  if (!payload?.id) {
    reviewError.value = 'Missing ticket id.'
    return
  }
  reviewing.value = true
  reviewError.value = ''
  try {
    await reviewAsVp(payload.id, {
      technical_feasibility: payload.score,
      vp_comments: payload.comment,
      vp_decision: payload.status === 'approve' ? 'approved' : 'rejected',
    })
    isDecisionModalOpen.value = false
    await Promise.all([loadDashboard(), fetchTickets(pageMeta.value.current_page)])
  } catch (e) {
    reviewError.value = e?.data?.message || 'Failed to submit review.'
  } finally {
    reviewing.value = false
  }
}

// VP's 3-way decision on an Admin-Approved ticket
const PROGRESS_COPY = {
  start_dev: { title: 'Are you sure you want to start development on this ticket?', body: 'This will move the status to Approved for Development.' },
  flag:      { title: 'Flag this ticket?', body: 'This will move the status to Flagged.' },
  future:    { title: 'Move this ticket to Future?', body: 'This will move the status to Future.' },
}

const isProgressModalOpen = ref(false)
const progressTicketRef = ref(null)
const progressAction = ref(null)
const progressing = ref(false)
const progressError = ref('')

const progressModalCopy = computed(() => PROGRESS_COPY[progressAction.value] ?? { title: '', body: '' })

function openStartDevModal(ticket) { openProgressModal(ticket, 'start_dev') }
function openFlagModal(ticket) { openProgressModal(ticket, 'flag') }
function openFutureModal(ticket) { openProgressModal(ticket, 'future') }

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
