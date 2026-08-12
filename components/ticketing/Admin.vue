<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Pending Approval -->
      <div class="bg-[#FFF7ED] border border-[#FDBA74] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#C2410C] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Pending Approval</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#C2410C]">{{ dashboard.pending ?? 0 }}</div>
      </div>

      <!-- Overdue Reviews -->
      <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#DC2626] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Overdue Reviews</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#DC2626]">{{ dashboard.overdue_reviews ?? 0 }}</div>
      </div>

      <!-- In Development -->
      <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#0369A1] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>In Development</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="text-3xl font-semibold text-[#0369A1]">{{ dashboard.in_development ?? 0 }}</div>
      </div>

      <!-- Completed -->
      <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#16A34A] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Completed</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#16A34A]">{{ dashboard.developed ?? 0 }}</div>
      </div>

      <!-- Scrapped/Rejected -->
      <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#DC2626] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Scrapped/Rejected</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#DC2626]">{{ dashboard.scrapped ?? 0 }}</div>
      </div>
    </div>

    <!-- Red Alert Banner -->
    <div v-if="dashboard.repeated_tickets > 0" class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-4 flex items-start gap-3">
      <div class="mt-0.5 text-[#DC2626]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <div>
        <div class="text-[#991B1B] font-medium">{{ dashboard.repeated_tickets }} ticket{{ dashboard.repeated_tickets === 1 ? '' : 's' }} reported multiple times</div>
        <div class="text-[#DC2626] text-sm mt-1">These issues have recurred across separate tickets and may need special attention.</div>
      </div>
    </div>

    <!-- Manager Report — one card per Manager account, horizontal scroll once there are more
         than fit on screen. -->
    <div v-if="loadingManagerReport" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="n in 2" :key="n" class="border border-gray-200 rounded-[16px] p-6 bg-white shadow-sm space-y-3 animate-pulse">
        <div v-for="i in 5" :key="i" class="h-5 bg-gray-100 rounded"></div>
      </div>
    </div>
    <div v-else-if="managerReport.length" :class="managerReport.length > 4 ? 'flex gap-4 overflow-x-auto pb-1' : 'grid grid-cols-1 md:grid-cols-2 gap-4'">
      <div v-for="m in managerReport" :key="m.manager_id" class="border border-gray-200 rounded-[16px] p-6 bg-white shadow-sm space-y-6" :class="managerReport.length > 4 ? 'flex-shrink-0 w-[calc(50%-8px)] min-w-[380px]' : ''">
        <div>
          <h3 class="text-[17px] font-medium text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            {{ m.title }}
          </h3>
          <p v-if="m.description" class="text-gray-500 text-sm mt-1">{{ m.description }}</p>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Total Tickets:</span>
            <span class="text-gray-900 font-medium">{{ m.total_tickets }}</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Pending Your Review:</span>
            <span class="text-[#D97706] font-medium">{{ m.pending_admin_review }}</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Approved:</span>
            <span class="text-[#16A34A] font-medium">{{ m.approved }}</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Flagged:</span>
            <span class="text-[#DC2626] font-medium">{{ m.flagged }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-2 mt-8 px-2 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
      <button v-for="tab in tabs" :key="tab.key" @click="setActiveTab(tab.key)"
        :class="activeTab === tab.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold' : 'text-gray-700 font-medium hover:text-gray-900'"
        class="px-6 py-2 rounded-full transition-colors whitespace-nowrap">
        {{ tab.label }} ({{ dashboard[tab.key] ?? 0 }})
      </button>
    </div>

    <!-- Search -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[16px] p-4 flex flex-col md:flex-row gap-4">
      <div class="relative w-full">
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
      <div class="p-6 pb-4 border-b border-gray-100">
        <h2 class="text-xl font-medium text-gray-800">Tickets Table</h2>
        <p class="text-gray-500 text-sm mt-1">Review tickets awaiting your final decision.</p>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[25%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Department</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Overall Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <template v-if="loadingTickets">
              <tr v-for="n in perPage" :key="`sk-${n}`" class="border-b border-gray-100 animate-pulse">
                <td colspan="7" class="py-4 px-6"><div class="h-4 bg-gray-100 rounded"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr v-if="!tickets.length">
                <td colspan="7" class="py-8 px-6 text-center text-gray-400">No tickets found.</td>
              </tr>
              <tr v-for="ticket in tickets" :key="ticket.ticket_custom_id" class="border-b border-gray-100 hover:bg-gray-50/50 last:border-b-0">
                <td class="py-4 px-6 text-gray-600 font-medium">{{ ticket.ticket_custom_id }}</td>
                <td class="py-4 px-6 text-gray-800">{{ ticket.title }}</td>
                <td class="py-4 px-6 text-gray-800">{{ ticket.department ?? '—' }}</td>
                <td class="py-4 px-6">
                  <span v-if="ticket.overall_score !== '-'" class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">{{ ticket.overall_score }}</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.cost" class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">AED {{ ticket.cost }}</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ ticket.status }}</span>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openDecisionModal(ticket, 'view')" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button v-if="ticket.status === 'VP Approved'" @click="openDecisionModal(ticket, 'review')" class="inline-flex items-center justify-center gap-1.5 bg-[#22C55E] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] font-medium transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      Review & Decide
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="n in fillerRowCount" :key="`fill-${n}`" class="border-b border-gray-100 last:border-b-0" aria-hidden="true">
                <td colspan="7" class="py-4 px-6">&nbsp;</td>
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
      role="admin"
      :submitting="reviewing"
      :error="reviewError"
      @close="isDecisionModalOpen = false"
      @submit="handleDecisionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { getAdminDashboard, getAdminTickets, getManagerReport, reviewAsAdmin, getTicket } = useTicketing()

// Dashboard stats
const dashboard = ref({})
async function loadDashboard() {
  dashboard.value = await getAdminDashboard()
}

const managerReport = ref([])
const loadingManagerReport = ref(true)

async function loadManagerReport() {
  loadingManagerReport.value = true
  try {
    managerReport.value = await getManagerReport()
  } finally {
    loadingManagerReport.value = false
  }
}

// Tabs + table + pagination
const tabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'developed', label: 'Completed' },
  { key: 'in_development', label: 'In Dev' },
  { key: 'flagged', label: 'Flagged' },
  { key: 'scrapped', label: 'Scrapped' },
  { key: 'future', label: 'Future' },
]
const route = useRoute()
const router = useRouter()
const activeTab = ref(tabs.some(t => t.key === route.query.tab) ? route.query.tab : 'pending')
const searchTerm = ref('')
const tickets = ref([])
const loadingTickets = ref(false)
const perPage = ref(10)
const pageMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const fillerRowCount = computed(() => Math.max(0, perPage.value - Math.max(tickets.value.length, 1)))

function setActiveTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
  fetchTickets(1)
}

async function fetchTickets(page = 1) {
  loadingTickets.value = true
  try {
    const params = { filter: activeTab.value, page, per_page: perPage.value }
    if (searchTerm.value) params.search = searchTerm.value
    const { items, meta } = await getAdminTickets(params)
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
  await Promise.all([loadDashboard(), loadManagerReport(), fetchTickets(1)])
})

// Review/View modal — shared DecisionModal component. Attachment upload isn't wired here yet
// (DecisionModal has no file-upload UI) — decision + comments only.
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

const ADMIN_DECISION_MAP = { approve: 'approved', reject: 'rejected', hold: 'onhold' }

async function handleDecisionSubmit(payload) {
  if (!payload?.id) {
    reviewError.value = 'Missing ticket id.'
    return
  }
  reviewing.value = true
  reviewError.value = ''
  try {
    const fd = new FormData()
    fd.append('decision', ADMIN_DECISION_MAP[payload.status] ?? payload.status)
    if (payload.comment) fd.append('comments', payload.comment)

    await reviewAsAdmin(payload.id, fd)
    isDecisionModalOpen.value = false
    await Promise.all([loadDashboard(), fetchTickets(1)])
  } catch (e) {
    reviewError.value = e?.data?.message || 'Failed to submit review.'
  } finally {
    reviewing.value = false
  }
}
</script>
