<template>
  <div>
    <!-- Tenant page (?organization_id=&tenant_id=&subtab=) -->
    <div v-if="selectedOrgId && selectedTenantId">
      <div class="flex items-center gap-3 mt-4 mb-4">
        <button @click="closeTenant" class="text-gray-400 hover:text-gray-600" title="Back to organization">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h2 class="text-[18px] text-[#013E32]">Tenant Configuration</h2>
          <div v-if="orgLoading" class="h-[18px] w-56 rounded bg-gray-200 animate-pulse mt-1"></div>
          <p v-else class="text-[13px] text-[#00000080]">{{ tenantLabel }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto mb-2">
        <button v-for="st in tenantSubtabs" :key="st.key" @click="setSubtab(st.key)"
          :class="tenantSubtab === st.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'"
          class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">{{ st.label }}</button>
      </div>

      <AdminClientConnector v-if="tenantSubtab === 'connector'" :key="'connector-' + selectedTenantId" :tenant-id="selectedTenantId" />
      <AdminClientAkeel v-else :key="'ai-' + selectedTenantId" scope="tenant" :tenant-id="selectedTenantId" :tenants="orgTenants" :label="orgTenants.find((x) => x.id === selectedTenantId)?.name ?? ''" />
    </div>

    <!-- Organization page (?organization_id=) -->
    <div v-else-if="selectedOrgId">
      <div class="flex items-center gap-3 mt-4 mb-4">
        <button @click="closeOrg" class="text-gray-400 hover:text-gray-600" title="Back to organizations">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h2 class="text-[18px] text-[#013E32]">Organization Settings</h2>
          <div v-if="orgLoading" class="h-[18px] w-48 rounded bg-gray-200 animate-pulse mt-1"></div>
          <p v-else class="text-[13px] text-[#00000080]">{{ orgLabel }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto mb-2">
        <button v-for="st in orgSubtabs" :key="st.key" @click="setSubtab(st.key)"
          :class="orgSubtab === st.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'"
          class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">{{ st.label }}</button>
      </div>

      <div v-if="orgSubtab === 'organization'" class="mt-4">
        <AdminOrgTenantsCard :key="'org-' + selectedOrgId + '-' + tenantsReload" :organization-id="selectedOrgId" @open-tenant="openTenant" @changed="loadOrg(selectedOrgId)" />
      </div>

      <AdminClientStatusUsers v-else-if="orgSubtab === 'users' && representativeTenantId" :key="selectedOrgId"
        :tenant-id="representativeTenantId" :tenants="orgTenants" />

      <AdminClientAkeel v-else-if="orgSubtab === 'ai' && representativeTenantId" :key="'org-ai-' + selectedOrgId" scope="organization"
        :tenant-id="representativeTenantId" :tenants="orgTenants" :label="orgTenants[0]?.organization_name ?? ''" />
    </div>

    <!-- Organizations list -->
    <div v-else>
      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="search" @input="debouncedLoad" type="text" placeholder="Search by organization, tenant or license ID..." autocomplete="off" class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="relative min-w-[160px] w-full md:w-auto">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </span>
          <select v-model="statusFilter" @change="load(1)" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="">All Statuses</option>
            <option value="implementation">Implementation</option>
            <option value="demo">Demo</option>
            <option value="live">Live</option>
            <option value="suspended">Suspended</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-6">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[1060px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Organization</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Contact</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Country</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Created</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Plan</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Tenants</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <template v-if="loading">
                <tr v-for="n in 8" :key="'sk' + n" class="border-b border-gray-100">
                  <td v-for="c in 8" :key="c" class="py-4 px-6"><div class="h-[36px] rounded bg-gray-100 animate-pulse"></div></td>
                </tr>
              </template>
              <tr v-else-if="!organizations.length"><td colspan="8" class="py-10 text-center text-gray-400">No organizations found.</td></tr>
              <tr v-for="o in organizations" :key="o.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 font-medium text-gray-800">{{ o.name }} <span class="text-gray-400 text-xs">({{ o.id }})</span></td>
                <td class="py-4 px-6">
                  <p v-if="o.contact_name" class="text-gray-800">{{ o.contact_name }}</p>
                  <p class="text-gray-500 text-[12px]">{{ o.contact_email || '—' }}</p>
                  <p v-if="o.contact_phone" class="text-gray-500 text-[12px]">{{ o.contact_phone }}</p>
                </td>
                <td class="py-4 px-6">{{ o.country || '—' }}</td>
                <td class="py-4 px-6 whitespace-nowrap">{{ o.created_at ? String(o.created_at).slice(0, 10) : '—' }}</td>
                <td class="py-4 px-6 whitespace-nowrap">{{ o.plan_name || 'No plan' }}</td>
                <td class="py-4 px-6">{{ o.tenants_count }}</td>
                <td class="py-4 px-6">
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="(count, status) in o.status_counts" :key="status"
                      :class="statusClass(status)" class="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium capitalize">{{ count }} {{ status }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="openOrg(o.id)" class="inline-flex items-center gap-1.5 border border-[#007C65] text-[#007C65] px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#F0FDF4] transition-colors">
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
// Organization manager: list of organizations -> organization page (its tenants, users, settings)
// (subtabs: Organization, Users & Permissions, AI) -> tenant page (connector). Query params: ?organization_id=&tenant_id=&subtab=
import { ref, computed, onMounted, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const { getTenants } = useClientManagement()

const orgSubtabs = [
  { key: 'organization', label: 'Organization' },
  { key: 'users', label: 'Users & Permissions' },
  { key: 'ai', label: 'AI / Akeel' },
]

const tenantSubtabs = [
  { key: 'connector', label: 'Connector' },
  { key: 'ai', label: 'AI / Akeel' },
]

const positive = (value) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}
const selectedOrgId = computed(() => positive(route.query.organization_id))
const selectedTenantId = computed(() => positive(route.query.tenant_id))
const orgSubtab = computed(() =>
  orgSubtabs.some(s => s.key === route.query.subtab) ? route.query.subtab : 'organization'
)
const tenantSubtab = computed(() => (tenantSubtabs.some(s => s.key === route.query.subtab) ? route.query.subtab : 'connector'))
const tenantsReload = ref(0)

function withQuery(changes, remove = []) {
  const q = { ...route.query, ...changes }
  remove.forEach((k) => delete q[k])
  return q
}
function openOrg(id) { router.push({ query: withQuery({ organization_id: id }, ['tenant_id', 'subtab']) }) }
function openTenant(id) { router.push({ query: withQuery({ tenant_id: id, subtab: 'connector' }) }) }
function setSubtab(key) { router.replace({ query: withQuery({ subtab: key }) }) }
function closeTenant() { router.push({ query: withQuery({ subtab: 'organization' }, ['tenant_id']) }) }
function closeOrg() { router.push({ query: withQuery({}, ['organization_id', 'tenant_id', 'subtab', 'aitab']) }) }

const statusClass = (status) => {
  if (status === 'live') return 'bg-[#D1FAE5] text-[#065F46]'
  if (status === 'suspended') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-50 text-blue-700'
}

// ── Organization page data ─────────────────────────────────
const orgTenants = ref([])
const orgLoading = ref(false)
const orgLabel = computed(() => {
  const first = orgTenants.value[0]
  return first ? `${first.organization_name} (${first.organization_id})` : `Organization #${selectedOrgId.value}`
})
const representativeTenantId = computed(() => orgTenants.value[0]?.id ?? null)
const tenantLabel = computed(() => {
  const t = orgTenants.value.find((x) => x.id === selectedTenantId.value)
  return t ? `${t.name ?? 'Tenant'} (#${t.id}) · ${t.license_id ?? ''} · ${t.status}` : `Tenant #${selectedTenantId.value}`
})

async function loadOrg(id) {
  if (!id) { orgTenants.value = []; return }
  orgLoading.value = true
  try {
    const res = await getTenants({ organization_id: id, per_page: 100 })
    orgTenants.value = res?.data ?? []
  } catch {
    orgTenants.value = []
  } finally {
    orgLoading.value = false
  }
}

// ── List ───────────────────────────────────────────────────
const organizations = ref([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref('')
const perPage = ref(10)
const meta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
let searchTimer = null

async function load(page = 1) {
  loading.value = true
  try {
    const res = await getTenants({ view: 'organizations', search: search.value, status: statusFilter.value, page, per_page: perPage.value })
    organizations.value = res.data ?? []
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

onMounted(() => { if (!selectedOrgId.value) load() })
watch(selectedOrgId, (id) => { if (!id) load() })
watch(selectedOrgId, (id) => loadOrg(id), { immediate: true })
</script>
