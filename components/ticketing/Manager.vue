<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">{{ dashboard.total_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>

      <div class="border border-[#BFDBFE] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Needs Review</div>
        <div class="text-3xl font-semibold text-[#1D4ED8]">{{ dashboard.needs_review ?? 0 }}</div>
      </div>

      <div class="border border-[#86EFAC] rounded-xl p-5 bg-[#F0FDF4] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Approved</div>
        <div class="text-3xl font-semibold text-[#15803D]">{{ dashboard.approved ?? 0 }}</div>
      </div>

      <div class="border border-[#FCA5A5] rounded-xl p-5 bg-[#FEF2F2] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Overdue</div>
        <div class="text-3xl font-semibold text-[#DC2626]">{{ dashboard.overdue ?? 0 }}</div>
      </div>
    </div>

    <!-- Dismissible banners -->
    <div class="space-y-3" v-if="banners.length">
      <div v-for="b in banners" :key="b.id" class="rounded-xl border p-4 flex items-start justify-between gap-4" :class="b.style">
        <div>
          <div class="font-medium">{{ b.title }}</div>
          <div class="text-sm opacity-80">{{ b.subtitle }}</div>
        </div>
        <button @click="dismissBanner(b.id)" class="opacity-60 hover:opacity-100 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-2 mt-8 px-2 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
      <button v-for="tab in tabs" :key="tab.key" @click="setActiveTab(tab.key)"
        :class="activeTab === tab.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold' : 'text-gray-700 font-medium hover:text-gray-900'"
        class="px-6 py-2 rounded-full transition-colors">
        {{ tab.label }} ({{ dashboard[tab.countKey] ?? 0 }})
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
          <h2 class="text-xl font-medium text-gray-800">Tickets for Manager Review</h2>
          <p class="text-gray-500 text-sm mt-1">Tickets raised by your team, VP-approved and awaiting your decision</p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[12%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[30%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[13%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <template v-if="loadingTickets">
              <tr v-for="n in perPage" :key="`sk-${n}`" class="border-b border-gray-100 animate-pulse">
                <td colspan="6" class="py-4 px-6"><div class="h-4 bg-gray-100 rounded"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr v-if="!tickets.length">
                <td colspan="6" class="py-8 px-6 text-center text-gray-400">No tickets found.</td>
              </tr>
              <tr v-for="ticket in tickets" :key="ticket.id" class="border-b border-gray-100 hover:bg-gray-50/50 last:border-b-0">
                <td class="py-4 px-6 text-gray-600 font-medium">{{ ticket.ticket_custom_id }}</td>
                <td class="py-4 px-6 text-gray-800">{{ ticket.title }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">{{ ticket.type ?? '—' }}</span>
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
                    <button v-if="ticket.status === 'VP Approved' && !ticket.manager_decision" @click="openDecisionModal(ticket, 'review')" class="inline-flex items-center gap-1.5 bg-[#00AD5FCC] text-white rounded-md px-4 py-1.5 hover:bg-[#22C55E] font-medium transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      Review
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="n in fillerRowCount" :key="`fill-${n}`" class="border-b border-gray-100 last:border-b-0" aria-hidden="true">
                <td colspan="6" class="py-4 px-6">&nbsp;</td>
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
      role="manager"
      :submitting="reviewing"
      :error="reviewError"
      @close="isDecisionModalOpen = false"
      @submit="handleDecisionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { getManagerDashboard, getManagerTickets, reviewAsManager, getTicket } = useTicketing()
const route = useRoute()
const router = useRouter()

const dashboard = ref({})
async function loadDashboard() {
  dashboard.value = await getManagerDashboard()
}

const tabs = [
  { key: 'needs_review', label: 'Needs Review', countKey: 'needs_review' },
  { key: 'approved', label: 'Approved', countKey: 'approved' },
  { key: 'rejected', label: 'Rejected', countKey: 'rejected' },
  { key: 'all', label: 'All Tickets', countKey: 'total_tickets' },
]
const activeTab = ref(tabs.some(t => t.key === route.query.tab) ? route.query.tab : 'needs_review')
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
    const { items, meta } = await getManagerTickets(params)
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

// Dismissible, computed-not-stored status banners
const dismissedBanners = ref([])
const banners = computed(() => {
  const list = []
  if (dashboard.value.needs_review > 0) {
    list.push({ id: 'needs_review', title: `${dashboard.value.needs_review} ticket(s) waiting for your review`, subtitle: 'Tickets awaiting manager review.', style: 'bg-[#FEFCE8] border-[#FDE68A] text-[#854D0E]' })
  }
  if (dashboard.value.overdue > 0) {
    list.push({ id: 'overdue', title: `${dashboard.value.overdue} ticket(s) overdue for review`, subtitle: 'These have been waiting more than 15 days since VP review.', style: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]' })
  }
  return list.filter(b => !dismissedBanners.value.includes(b.id))
})
function dismissBanner(id) {
  dismissedBanners.value.push(id)
}

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
    const fd = new FormData()
    fd.append('decision', payload.status === 'approve' ? 'approved' : 'rejected')
    if (payload.comment) fd.append('comments_analysis', payload.comment)
    await reviewAsManager(payload.id, fd)
    isDecisionModalOpen.value = false
    await Promise.all([loadDashboard(), fetchTickets(pageMeta.value.current_page)])
  } catch (e) {
    reviewError.value = e?.data?.message || 'Failed to submit review.'
  } finally {
    reviewing.value = false
  }
}
</script>
