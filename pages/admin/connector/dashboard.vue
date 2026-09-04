<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <AdminDashboardHeader :userName="admin?.role?.name ?? 'Connector Dashboard'" :userId="'Welcome, ' + (admin?.full_name ?? '')" :showChangeProfile="false" notificationsTo="/admin/notifications" :adminLogout="true" logoutTo="/ad-aqnz-pro-auth-78z46" />

    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto overflow-x-hidden" style="margin-top: -18px;">

      <!-- Page title -->
      <div class="space-y-1">
        <h1 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Connector Dashboard</h1>
        <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Groups, sync status, and version rollout for the Tally connector</p>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(metric, idx) in statCards" :key="idx"
             :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
             class="rounded-[16px] p-6 border shadow-sm">
          <h5 class="text-[14px] font-medium opacity-70 mb-4">{{ metric.title }}</h5>
          <span class="text-[32px] font-semibold leading-tight" :class="isDark ? 'text-white' : metric.textClass">{{ metric.value }}</span>
        </div>
      </div>

      <!-- Navigation Tabs (sized to content, not stretched) -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="inline-flex items-center gap-1 overflow-x-auto no-scrollbar rounded-[35px] p-[10px] border shadow-sm">
        <button v-for="tab in tabs" :key="tab"
                @click="setTab(tab)"
                class="px-6 py-2.5 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap"
                :class="activeTab === tab
                  ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] font-normal')
                  : (isDark ? 'bg-transparent text-white/70' : 'bg-transparent text-[#0A0A0A] font-normal')">
          {{ tab }}
        </button>
      </div>

      <!-- Sync Status -->
      <div v-if="activeTab === 'Sync Status'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Sync Status</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Per-tenant connector sync status and group assignment</p>
          </div>
          <div class="flex items-center gap-3">
            <input v-model="tenantSearch" type="text" placeholder="Search by tenant name..."
                   @input="debounce(() => loadTenants(1))"
                   class="h-[42px] px-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] text-[14px] bg-white text-[#1a1a1a]" />
            <button @click="loadTenants(tenantsMeta.current_page)" class="w-[42px] h-[42px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                    :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
              <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', tenantsLoading ? 'animate-spin' : '']" alt="refresh" />
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Tenant</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Group</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Last Sync</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Connector Version</th>
                <th class="py-4 px-8 font-normal text-[15px]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-if="!tenantsLoading && !tenantRows.length">
                <td colspan="5" class="py-8 text-center text-gray-400 text-sm">No Tally-connected tenants yet.</td>
              </tr>
              <tr v-for="row in tenantRows" :key="row.tenant_id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ row.company_name }}</td>
                <td class="py-6 px-8 text-[14px] font-regular">
                  <select :value="row.connector_group_id ?? ''" @change="onReassign(row, $event.target.value)"
                          class="rounded-[8px] border border-[#04C18F33] px-3 py-1.5 text-[13px] bg-white text-[#1a1a1a]">
                    <option value="" disabled>Unassigned</option>
                    <option v-for="g in groupRows" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                </td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ formatDate(row.last_sync_at) }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ row.connector_version ?? '—' }}</td>
                <td class="py-6 px-8 text-[14px] font-regular">
                  <span :class="row.needs_full_resync ? 'bg-[#FEF2F2] text-[#C10007] border-[#FFA6A6]' : 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]'"
                        class="px-3 py-1 rounded-full text-[12px] font-medium border">
                    {{ row.needs_full_resync ? 'Full Resync Pending' : 'OK' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="tenantsMeta.total > 0" :meta="tenantsMeta" :loading="tenantsLoading"
          @page-change="(p) => loadTenants(p)" @per-page-change="(pp) => loadTenants(1, pp)" />
      </div>

      <!-- Groups -->
      <div v-if="activeTab === 'Groups'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Connector Groups</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Groups are created automatically (max 10 groups total) — edit name, sync time, interval, and notes here</p>
          </div>
          <div class="flex items-center rounded-full border border-[#04C18F33] p-1 text-[12px] font-medium">
            <button @click="is24Hour = false" class="px-3 py-1 rounded-full transition-colors" :class="!is24Hour ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">12h</button>
            <button @click="is24Hour = true" class="px-3 py-1 rounded-full transition-colors" :class="is24Hour ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">24h</button>
          </div>
        </div>

        <div v-if="!groupRows.length" class="py-8 text-center text-gray-400 text-sm">No groups yet — one is created automatically when the first connector activates.</div>

        <div class="space-y-4 overflow-y-auto overflow-x-hidden pr-1" style="max-height: 980px;">
          <div v-for="g in groupRows" :key="g.id" class="rounded-[12px] border p-5 space-y-4 shadow-sm"
               :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#E0F9F3]/40 border-[#6FDBBF]'">
            <div class="flex flex-wrap items-end gap-4">
              <div>
                <label class="block text-[13px] font-medium mb-1">Name</label>
                <input v-model="draftFor(g).name"
                       class="rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
              </div>
              <div>
                <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
                  Sync Time (cycle 1)
                  <span class="relative inline-block group/tip">
                    <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
                    <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
                      The base daily time this group's tenants sync at. This is the only window a full sync can run in.
                    </span>
                  </span>
                </label>
                <AdminConnectorTimeWheelPicker v-model="draftFor(g).sync_time" :is24-hour="is24Hour" />
              </div>
              <div>
                <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
                  Cycle 2 Time (catch-up)
                  <span class="relative inline-block group/tip">
                    <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
                    <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
                      Only runs if cycle 1 was missed today — a same-day catch-up attempt. Uncheck "Enabled" for groups that never need a catch-up.
                    </span>
                  </span>
                </label>
                <div class="flex items-center gap-3">
                  <AdminConnectorTimeWheelPicker v-model="draftFor(g).cycle_2_time" :is24-hour="is24Hour" />
                  <label class="flex items-center gap-1.5 text-[12px] text-gray-600 whitespace-nowrap cursor-pointer">
                    <input type="checkbox" v-model="draftFor(g).cycle_2_enabled" class="w-4 h-4 accent-[#00896F] cursor-pointer" />
                    Enabled
                  </label>
                </div>
              </div>
              <div>
                <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
                  Reconciliation Interval (minutes)
                  <span class="relative inline-block group/tip">
                    <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
                    <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
                      How long a tenant can go without a successful sync before it's flagged for a full resync (checked hourly).
                    </span>
                  </span>
                </label>
                <input v-model.number="draftFor(g).reconciliation_interval_minutes"
                       type="number" min="1" class="w-32 rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
              </div>
              <div class="text-[13px] text-gray-500 pb-2.5">{{ g.erp_connections_count ?? 0 }} tenant(s)</div>
              <div class="ml-auto flex flex-col items-end gap-1">
                <button @click="saveGroupDraft(g)" :disabled="savingGroupId === g.id"
                        class="px-6 py-2.5 rounded-[10px] bg-[#00896F] text-white text-[14px] font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                  {{ savingGroupId === g.id ? 'Saving...' : 'Save' }}
                </button>
                <span v-if="savedGroupId === g.id" class="text-[12px] text-[#00896F]">Saved</span>
              </div>
            </div>
            <div>
              <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
                Scheduled Full Sync
                <span class="relative inline-block group/tip">
                  <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
                  <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
                    Cycle 1 always runs a full sync (not diff) on this day, regardless of any flag — routine drift prevention.
                  </span>
                </span>
              </label>
              <AdminConnectorFullSyncDayPicker
                :frequency="draftFor(g).full_sync_frequency" :day="draftFor(g).full_sync_day"
                @update:frequency="onFrequencyChange(g, $event)"
                @update:day="draftFor(g).full_sync_day = $event" />
            </div>
            <div>
              <label class="block text-[13px] font-medium mb-1">Notes</label>
              <textarea v-model="draftFor(g).notes"
                        maxlength="2000" rows="3" placeholder="Reference notes for this group..."
                        class="w-full rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px] resize-y"></textarea>
            </div>
          </div>
        </div>
        <CommonPaginationBar v-if="groupsMeta.total > 0" :meta="groupsMeta" :loading="groupsLoading"
          @page-change="(p) => loadGroups(p)" @per-page-change="(pp) => loadGroups(1, pp)" />
      </div>

      <!-- Update Packages -->
      <div v-if="activeTab === 'Update Packages'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Update Packages</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Connector version history and rollout</p>
          </div>
        </div>

        <!-- Upload — Super Admin only. Version/schedule fields sit here; the modal only handles file pick/drop. -->
        <div v-if="isSuperAdmin" class="flex flex-wrap items-end gap-4 p-4 rounded-[12px] border border-[#04C18F33]">
          <div>
            <label class="block text-[13px] font-medium mb-1">Version</label>
            <input v-model="upload.version" type="text" placeholder="e.g. 2.0.1" class="rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px] w-32" />
          </div>
          <div>
            <label class="block text-[13px] font-medium mb-1">Schedule for later (optional)</label>
            <div @click="showScheduleCalendar = true"
              class="px-3 py-2 rounded-[8px] border border-[#04C18F33] bg-white flex items-center gap-2 justify-between cursor-pointer text-[14px] min-w-[220px]">
              <span :class="!upload.scheduledAt ? 'text-[#717182]' : 'text-gray-700'">
                {{ upload.scheduledAt ? formatScheduleLabel(upload.scheduledAt) : 'Pick date & time' }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <Teleport to="body">
              <div v-if="showScheduleCalendar" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showScheduleCalendar = false">
                <div class="bg-white rounded-2xl shadow-xl p-4 space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-[15px] font-medium text-gray-900">Schedule Upload</h3>
                    <button @click="showScheduleCalendar = false" class="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div class="flex items-start gap-4">
                    <VDatePicker v-model="upload.scheduledAt" mode="date" color="teal" borderless />
                    <div class="border-l border-gray-100 pl-4 pt-1">
                      <span class="block text-[12px] text-gray-500 mb-2 text-center">Time</span>
                      <AdminConnectorTimeWheelPicker v-model="upload.scheduledTime" :is24-hour="is24Hour" inline />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2 pt-1">
                    <button @click="upload.scheduledAt = null; showScheduleCalendar = false" class="text-[12px] text-gray-500 hover:text-gray-700 px-2 py-1">Clear</button>
                    <button @click="showScheduleCalendar = false" class="text-[13px] text-white bg-[#00896F] hover:bg-[#00705a] rounded-md px-4 py-1.5">Done</button>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>
          <button @click="showUploadModal = true" :disabled="!upload.version"
                  class="px-5 py-2.5 rounded-[10px] bg-[#00896F] text-white text-[14px] font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
            Choose File & Upload
          </button>
        </div>
        <p v-if="uploadMessage" class="text-[13px]" :class="uploadOk ? 'text-[#00896F]' : 'text-red-500'">{{ uploadMessage }}</p>

        <div class="overflow-x-auto rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Version</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Uploaded</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Scheduled At</th>
                <th class="py-4 px-8 font-normal text-[15px]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-if="!updateRows.length">
                <td colspan="4" class="py-8 text-center text-gray-400 text-sm">No packages uploaded yet.</td>
              </tr>
              <tr v-for="pkg in updateRows" :key="pkg.id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px]">{{ pkg.version }}</td>
                <td class="py-6 px-8 text-[14px]">{{ formatDate(pkg.created_at) }}</td>
                <td class="py-6 px-8 text-[14px]">{{ pkg.scheduled_at ? formatDate(pkg.scheduled_at) : '—' }}</td>
                <td class="py-6 px-8 text-[14px]">
                  <span v-if="pkg.is_latest" class="px-3 py-1 rounded-full text-[12px] font-medium border bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]">Latest</span>
                  <span v-else class="px-3 py-1 rounded-full text-[12px] font-medium border bg-gray-100 text-gray-500 border-gray-200">Retired</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="updatesMeta.total > 0" :meta="updatesMeta" :loading="updatesLoading"
          @page-change="(p) => loadUpdates(p)" @per-page-change="(pp) => loadUpdates(1, pp)" />
      </div>

    </main>

    <DataSourceUploadModal :isOpen="showUploadModal" title="Upload Connector Version"
      hint="TaxAidConnector .exe file" accept=".exe"
      @close="showUploadModal = false" @upload="handleUpload" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'

useHead({ title: 'Connector Dashboard' })

const { isDark } = useTheme()
const { admin } = useAdminAuth()
const cd = useConnectorDashboard()

const isSuperAdmin = computed(() => admin.value?.role?.name === 'Super Admin')

const route  = useRoute()
const router = useRouter()
const tabs = ['Sync Status', 'Groups', 'Update Packages']
const tabMap = { 'sync-status': 'Sync Status', groups: 'Groups', 'update-packages': 'Update Packages' }
const tabKey = { 'Sync Status': 'sync-status', Groups: 'groups', 'Update Packages': 'update-packages' }
const activeTab = ref(tabMap[route.query.tab] ?? 'Sync Status')

function setTab(name) {
  activeTab.value = name
  router.replace({ query: { ...route.query, tab: tabKey[name] } })
}

const tenantRows = computed(() => cd.tenants.value)
const groupRows  = computed(() => cd.groups.value)
const updateRows = computed(() => cd.updates.value)
const tenantsMeta = computed(() => cd.tenantsMeta.value)
const groupsMeta  = computed(() => cd.groupsMeta.value)
const updatesMeta = computed(() => cd.updatesMeta.value)

const stats = ref({ total_tenants: 0, pending_full_resync: 0, total_groups: 0, latest_version: null })
const statCards = computed(() => [
  { title: 'Connected Tenants', value: stats.value.total_tenants, textClass: 'text-[#004D40]' },
  { title: 'Full Resync Pending', value: stats.value.pending_full_resync, textClass: stats.value.pending_full_resync ? 'text-[#C10007]' : 'text-[#004D40]' },
  { title: 'Connector Groups', value: stats.value.total_groups, textClass: 'text-[#004D40]' },
  { title: 'Latest Version', value: stats.value.latest_version ?? '—', textClass: 'text-[#004D40]' },
])

const tenantSearch = ref('')
const tenantsLoading = ref(false)
async function loadTenants(page = 1, perPage = tenantsMeta.value.per_page) {
  tenantsLoading.value = true
  await cd.getTenants(page, perPage, tenantSearch.value).catch(() => {})
  tenantsLoading.value = false
}

let searchTimer = null
function debounce(fn) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fn, 400)
}

async function onReassign(row, groupId) {
  if (!groupId) return
  await cd.reassignGroup(row.tenant_id, Number(groupId)).catch(() => {})
  await loadTenants(tenantsMeta.value.current_page)
}

const groupsLoading = ref(false)
async function loadGroups(page = 1, perPage = groupsMeta.value.per_page) {
  groupsLoading.value = true
  await cd.getGroups(page, perPage).catch(() => {})
  // Discard unsaved drafts on reload, same as any other form.
  for (const key of Object.keys(groupDrafts)) delete groupDrafts[key]
  groupsLoading.value = false
}

// Local edit buffer per group — nothing hits the backend until Save is clicked.
const groupDrafts = reactive({})
function draftFor(g) {
  if (!groupDrafts[g.id]) {
    groupDrafts[g.id] = {
      name: g.name,
      sync_time: g.sync_time ?? '10:00',
      cycle_2_time: g.cycle_2_time ?? '16:00',
      cycle_2_enabled: g.cycle_2_enabled ?? true,
      reconciliation_interval_minutes: g.reconciliation_interval_minutes,
      full_sync_frequency: g.full_sync_frequency ?? 'monthly',
      full_sync_day: g.full_sync_day ?? 1,
      notes: g.notes ?? '',
    }
  }
  return groupDrafts[g.id]
}

const savingGroupId = ref(null)
const savedGroupId = ref(null)
async function saveGroupDraft(g) {
  savingGroupId.value = g.id
  savedGroupId.value = null
  try {
    await cd.updateGroup(g.id, draftFor(g))
    await loadGroups(groupsMeta.value.current_page)
    savedGroupId.value = g.id
    setTimeout(() => { if (savedGroupId.value === g.id) savedGroupId.value = null }, 3000)
  } catch {
    // Left as-is — the draft stays editable so the admin can retry.
  } finally {
    savingGroupId.value = null
  }
}

const is24Hour = ref(true)

function onFrequencyChange(g, frequency) {
  const draft = draftFor(g)
  draft.full_sync_frequency = frequency
  // Reset to a valid default for the new frequency's day type.
  draft.full_sync_day = frequency === 'monthly' ? 1 : 0
}

const updatesLoading = ref(false)
async function loadUpdates(page = 1, perPage = updatesMeta.value.per_page) {
  updatesLoading.value = true
  await cd.getUpdatePackages(page, perPage).catch(() => {})
  updatesLoading.value = false
  await loadStats()
}

const showUploadModal = ref(false)
const showScheduleCalendar = ref(false)
const upload = reactive({ version: '', scheduledAt: null, scheduledTime: '09:00' })
const uploadMessage = ref('')
const uploadOk = ref(true)

const formatScheduleLabel = (date) => {
  const dateLabel = new Date(date).toLocaleDateString([], { dateStyle: 'medium' })
  return `${dateLabel}, ${upload.scheduledTime}`
}

function combinedScheduledAtIso() {
  if (!upload.scheduledAt) return null
  const [h, m] = upload.scheduledTime.split(':').map(Number)
  const d = new Date(upload.scheduledAt)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

async function handleUpload(file) {
  uploadMessage.value = ''
  try {
    await cd.uploadUpdatePackage(file, upload.version, true, combinedScheduledAtIso())
    uploadOk.value = true
    uploadMessage.value = 'Package uploaded and set as latest.'
    upload.version = ''
    upload.scheduledAt = null
    upload.scheduledTime = '09:00'
    await loadUpdates(1)
  } catch (e) {
    uploadOk.value = false
    uploadMessage.value = e?.data?.message ?? e?.data?.error ?? 'Upload failed.'
  }
}

async function loadStats() {
  stats.value = await cd.getStats().catch(() => stats.value)
}

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
}

onMounted(async () => {
  await Promise.all([loadStats(), loadGroups(1), loadTenants(1), loadUpdates(1)])
})
</script>
