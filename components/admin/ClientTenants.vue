<template>
  <div>
    <!-- Detail view replaces the list entirely (SPA via ?id=&subtab=) -->
    <div v-if="selectedId">
      <div class="flex items-center gap-3 mt-4 mb-4">
        <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h2 class="text-[18px] text-[#013E32]">Client Settings</h2>
          <p class="text-[13px] text-[#00000080]">Tenant #{{ selectedId }}</p>
        </div>
      </div>

      <!-- Sub tabs — same pill bar as the main Roles tabs -->
      <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto mb-2">
        <button v-for="st in subtabs" :key="st.key" @click="setSubtab(st.key)"
          :class="activeSubtab === st.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'"
          class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">{{ st.label }}</button>
      </div>

      <AdminClientConnector v-if="activeSubtab === 'connector'" :key="selectedId" :tenant-id="selectedId" />
      <AdminClientStatusUsers v-else-if="activeSubtab === 'status'" :key="selectedId" :tenant-id="selectedId" />
    </div>

    <div v-else>
    <!-- Search & Filter -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
      <div class="relative w-full md:w-[40%]">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        <input v-model="tenantSearch" @input="debouncedLoad" type="text" placeholder="Search by name or license ID..." autocomplete="off" class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>
    </div>

    <!-- Tenants Table -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-6">
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-[#008865] text-white text-sm">
              <th class="py-3 px-6 font-medium whitespace-nowrap">Tenant ID</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Name</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <tr v-if="loading"><td colspan="4" class="py-10 text-center text-gray-400">Loading...</td></tr>
            <tr v-else-if="!tenants.length"><td colspan="4" class="py-10 text-center text-gray-400">No clients found.</td></tr>
            <tr v-for="t in tenants" :key="t.id" class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 font-medium text-gray-800">{{ t.id }} <span class="text-gray-400 text-xs">({{ t.license_id }})</span></td>
              <td class="py-4 px-6">{{ t.name ?? '—' }}</td>
              <td class="py-4 px-6">
                <span :class="t.status === 'live' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-amber-100 text-amber-700'" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium capitalize">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg> {{ t.status ?? '—' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="openDetail(t.id)" class="inline-flex items-center gap-1.5 border border-[#007C65] text-[#007C65] px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#F0FDF4] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  Configure
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loading"
        @page-change="(p) => load(p)" @per-page-change="(pp) => { perPage = pp; load(1) }" />
    </div>
    </div>
  </div>
</template>

<script setup>
// Reusable client (tenant) manager — list + SPA detail view driven by query
// params (?tab=clients&id=12&subtab=connector|status). Used in the Super
// Admin Client Management tab; reusable for the review-team side later.
import { ref, computed, onMounted, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const { getTenants } = useClientManagement()

const subtabs = [
  { key: 'connector', label: 'Connector' },
  { key: 'status', label: 'Status & Users' },
]

// ── SPA query state ─────────────────────────────────────────────────────────
const selectedId = computed(() => {
  const id = Number(route.query.id)
  return Number.isFinite(id) && id > 0 ? id : null
})
const activeSubtab = computed(() =>
  subtabs.some(s => s.key === route.query.subtab) ? route.query.subtab : 'connector'
)

function openDetail(id) {
  router.push({ query: { ...route.query, id, subtab: 'connector' } })
}
function setSubtab(key) {
  router.replace({ query: { ...route.query, subtab: key } })
}
function closeDetail() {
  const q = { ...route.query }
  delete q.id
  delete q.subtab
  router.push({ query: q })
}

// ── List ────────────────────────────────────────────────────────────────────
const tenants = ref([])
const loading = ref(false)
const tenantSearch = ref('')
const perPage = ref(10)
const meta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
let searchTimer = null

async function load(page = 1) {
  loading.value = true
  try {
    const res = await getTenants({ search: tenantSearch.value, page, per_page: perPage.value })
    tenants.value = res.data ?? []
    meta.value = {
      current_page: res.current_page ?? 1,
      per_page: res.per_page ?? perPage.value,
      total: res.total ?? 0,
      last_page: res.last_page ?? 1,
    }
  } finally {
    loading.value = false
  }
}

function debouncedLoad() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(1), 350)
}

onMounted(() => { if (!selectedId.value) load() })
// Returning from detail to list → refresh (status may have changed)
watch(selectedId, (id) => { if (!id) load() })
</script>
