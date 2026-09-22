<template>
  <div class="space-y-6 mt-4">

    <!-- Users table -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">Users</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">All logins across this organization's tenants.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3 md:justify-end">
          <input v-model="searchText" type="text" placeholder="Search name or email"
            class="min-w-[200px] px-3 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        <div class="relative min-w-[150px] shrink-0">
          <select v-model="statusFilter" class="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="">All statuses</option>
            <option value="live">Live</option>
            <option value="suspended">Suspended</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>
        <div class="relative min-w-[150px] shrink-0">
          <select v-model="roleFilter" class="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="">All roles</option>
            <option value="owner">Owner</option>
            <option value="master_user">Master</option>
            <option value="account_user">Accounts</option>
            <option value="sales_user">Sales</option>
            <option value="procurement_user">Procurement</option>
            <option value="project_manager_user">Project Manager</option>
            <option value="partner_user">Partner</option>
            <option value="guest_user">Guest</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>
        <div class="relative min-w-[150px] shrink-0">
          <select v-model="userTypeFilter" class="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="org">Tenant Users</option>
            <option value="taxaid">TaxAid Staff</option>
            <option value="all">All Users</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>
          <div v-if="tenants.length > 1" class="relative min-w-[170px] shrink-0">
            <select v-model="tenantFilter" class="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option value="">All tenants</option>
              <option v-for="t in tenants" :key="t.id" :value="String(t.id)">{{ t.name || 'Tenant' }} · Tenant ID: {{ t.id }}</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>
          <button @click="userModal = { user: null }" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] shrink-0">+ Add user</button>
        </div>
      </div>
      <div class="w-full overflow-x-auto min-h-[540px]">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-[#008865] text-white text-sm">
              <th class="py-3 px-6 font-medium whitespace-nowrap">Name</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Email</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Role</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Tenant</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Last Login</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Location</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap text-center">Active Sessions</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <template v-if="loading">
              <tr v-for="n in 8" :key="'sk' + n" class="border-b border-gray-100 h-[60px]">
                <td v-for="c in 9" :key="c" class="px-6"><div class="user-skeleton h-4 w-full max-w-[120px] rounded"></div></td>
              </tr>
            </template>
            <tr v-else-if="!filteredUsers.length"><td colspan="9" class="py-10 text-center text-gray-400">No users found.</td></tr>
            <tr v-for="u in filteredUsers" :key="u.id" :class="isOwner(u) ? 'bg-[#ECFDF5]/60 hover:bg-[#ECFDF5]' : 'hover:bg-gray-50/50'" class="border-b border-gray-100">
              <td class="py-4 px-6 font-medium" :class="isOwner(u) ? 'text-[#065F46]' : 'text-gray-800'">{{ u.name ?? '—' }}</td>
              <td class="py-4 px-6">{{ u.email }}</td>
              <td class="py-4 px-6"><span :class="roleBadgeClass(u)" class="rounded-full px-2.5 py-1 text-[12px] font-medium">{{ userRoleLabel(u) }}</span></td>
              <td class="py-4 px-6 whitespace-nowrap text-gray-500">#{{ u.tenant_id }}</td>
              <td class="py-4 px-6">{{ u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never' }}</td>
              <td class="py-4 px-6">{{ u.last_location ?? '—' }}</td>
              <td class="py-4 px-6 text-center">
                <span :class="u.active_sessions > 0 ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'"
                  class="rounded-full px-2.5 py-1 text-[12px] font-medium">{{ u.active_sessions }}</span>
              </td>
              <td class="py-4 px-6">
                <span :class="u.status === 'live' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-amber-100 text-amber-700'"
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium capitalize">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
                  {{ u.status ?? '—' }}
                </span>
              </td>
              <td class="py-4 px-6 text-center whitespace-nowrap">
                <button v-if="u.account_type !== 'taxaid'" @click="userModal = { user: u }" title="Edit role / primary"
                  class="inline-flex items-center justify-center w-8 h-8 mr-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 align-middle">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button v-if="u.status === 'live'" @click="openUserStatusModal(u, 'suspended')"
                  class="px-3 py-1.5 border border-red-300 text-red-600 rounded-md text-[13px] font-medium hover:bg-red-50 transition-colors">
                  Suspend
                </button>
                <button v-else @click="openUserStatusModal(u, 'live')"
                  class="px-3 py-1.5 bg-[#00896F] text-white rounded-md text-[13px] font-medium hover:bg-[#00705a] transition-colors">
                  Make Live
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <AdminRolesAndSettingsOrgRolesPanel :key="'roles-' + tenantId + '-' + rolesReload" :tenant-id="tenantId" :active-users="activeUsers" :users-loading="loading" />
    <AdminRolesAndSettingsUserEditModal v-if="userModal" :tenant-id="userModal.user?.tenant_id ?? (tenantFilter ? Number(tenantFilter) : tenantId)" :user="userModal.user"
      @close="userModal = null" @saved="onUserSaved" />
    <!-- User suspend / make-live modal -->
    <div v-if="userStatusTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[420px] max-w-full p-6">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-2">
          {{ userStatusNext === 'live' ? 'Make user live?' : 'Suspend user?' }}
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          <span class="font-medium text-gray-700">{{ userStatusTarget.email }}</span><br>
          {{ userStatusNext === 'live'
            ? 'The user will be able to log in again.'
            : 'The user will be blocked from logging in until made live again.' }}
        </p>
        <!-- Suspending requires the admin to re-enter their own password -->
        <div v-if="userStatusNext === 'suspended'" class="mb-4">
          <label class="block text-[13px] text-gray-600 mb-1.5">Confirm with your admin password</label>
          <input v-model="adminPassword" type="password" placeholder="Your password" autocomplete="current-password"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        </div>
        <p v-if="userStatusError" class="text-[13px] text-red-500 mb-3">{{ userStatusError }}</p>
        <div class="flex justify-end gap-3">
          <button @click="closeUserStatusModal" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="applyUserStatus" :disabled="userStatusBusy || (userStatusNext === 'suspended' && !adminPassword)"
            :class="userStatusNext === 'live' ? 'bg-[#00896F] hover:bg-[#00705a]' : 'bg-red-600 hover:bg-red-700'"
            class="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ userStatusBusy ? 'Saving…' : userStatusNext === 'live' ? 'Make Live' : 'Suspend' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// Status & Users tab of the client configure view — make live / suspend
// plus the tenant's user list with login/session info.
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
  tenants: { type: Array, default: () => [] },
})

const { getTenantUsers, setTenantUserStatus } = useClientManagement()
const { userRoleLabel, roleBadgeClass, isOwner } = useRoleLabel()

const users = ref([])
const tenantFilter = ref('')
const userModal = ref(null)
const rolesReload = ref(0)
const userTypeFilter = ref('org')
const statusFilter = ref('')
const roleFilter = ref('')
const searchText = ref('')
const filteredUsers = computed(() => {
  if (userTypeFilter.value === 'all') return users.value
  const isTaxaid = (u) => u.account_type === 'taxaid' || (u.email ?? '').endsWith('@taxaid.temp')
  return users.value.filter((u) => userTypeFilter.value === 'taxaid' ? isTaxaid(u) : !isTaxaid(u))
})
const activeUsers = ref(0)
const loading = ref(true)

function userParams() {
  return { scope: 'organization', tenant_id: tenantFilter.value ? Number(tenantFilter.value) : undefined, status: statusFilter.value, role: roleFilter.value, search: searchText.value }
}

async function load() {
  loading.value = true
  try {
    const res = await getTenantUsers(props.tenantId, userParams())
    users.value = res.data ?? []
    const all = statusFilter.value || roleFilter.value || searchText.value || tenantFilter.value ? (await getTenantUsers(props.tenantId, { scope: 'organization' })).data ?? [] : users.value
    activeUsers.value = all.filter((u) => u.status === 'live' && u.account_type !== 'taxaid' && !(u.email ?? '').endsWith('@taxaid.temp')).length
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  loading.value = true
  try {
    const res = await getTenantUsers(props.tenantId, userParams())
    users.value = res.data ?? []
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

async function onUserSaved() {
  userModal.value = null
  rolesReload.value++
  await load()
}

// ── Per-user suspend / make-live modal ──────────────────────────────────────
const userStatusTarget = ref(null)   // user row the modal is acting on
const userStatusNext = ref(null)     // 'live' | 'suspended'
const adminPassword = ref('')
const userStatusBusy = ref(false)
const userStatusError = ref('')

function openUserStatusModal(user, next) {
  userStatusTarget.value = user
  userStatusNext.value = next
  adminPassword.value = ''
  userStatusError.value = ''
}
function closeUserStatusModal() {
  userStatusTarget.value = null
  userStatusNext.value = null
}

async function applyUserStatus() {
  userStatusBusy.value = true
  userStatusError.value = ''
  try {
    const res = await setTenantUserStatus(
      userStatusTarget.value.tenant_id ?? props.tenantId,
      userStatusTarget.value.id,
      userStatusNext.value,
      userStatusNext.value === 'suspended' ? adminPassword.value : undefined,
    )
    userStatusTarget.value.status = res.user?.status ?? userStatusNext.value
    closeUserStatusModal()
  } catch (e) {
    userStatusError.value = e?.data?.message ?? 'Failed to update user status.'
  } finally {
    userStatusBusy.value = false
  }
}

let searchTimer
watch([statusFilter, roleFilter, tenantFilter], loadUsers)
watch(searchText, () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadUsers, 300) })

onMounted(load)
</script>

<style scoped>
.user-skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: user-shimmer 1.4s ease infinite;
}
@keyframes user-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
