<template>
  <div class="space-y-6 mt-4">

    <!-- Tenant status -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">Tenant Status</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">Suspended tenants lose access to the live system.</p>
        </div>
        <div class="flex items-center gap-3">
          <span :class="status === 'live' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-amber-100 text-amber-700'"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium capitalize">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
            {{ status ?? '—' }}
          </span>
          <!-- live → Deactivate; suspended → Make Live; any other status → badge only -->
          <button v-if="status === 'live'" @click="confirmStatus = 'suspended'" :disabled="busy"
            class="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60">
            Deactivate
          </button>
          <button v-else-if="status === 'suspended'" @click="confirmStatus = 'live'" :disabled="busy"
            class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
            Make Live
          </button>
        </div>
      </div>
      <p v-if="message" class="text-[13px] mt-3" :class="messageOk ? 'text-[#00896F]' : 'text-red-500'">{{ message }}</p>
    </div>

    <!-- Confirm dialog -->
    <div v-if="confirmStatus" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-2">{{ confirmStatus === 'live' ? 'Make tenant live?' : 'Deactivate tenant?' }}</h3>
        <p class="text-sm text-gray-500 mb-6">
          {{ confirmStatus === 'live'
            ? 'The tenant will regain full access to the system.'
            : 'The tenant\'s users will lose access until made live again.' }}
        </p>
        <div class="flex justify-end gap-3">
          <button @click="confirmStatus = null" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="applyStatus" :disabled="busy"
            :class="confirmStatus === 'live' ? 'bg-[#00896F] hover:bg-[#00705a]' : 'bg-red-600 hover:bg-red-700'"
            class="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ confirmStatus === 'live' ? 'Make Live' : 'Deactivate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Users table -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-[16px] font-medium text-[#101828]">Users</h2>
        <p class="text-[13px] text-[#4A5565] mt-0.5">All logins under this tenant.</p>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-[#008865] text-white text-sm">
              <th class="py-3 px-6 font-medium whitespace-nowrap">Name</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Email</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Role</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Last Login</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap">Location</th>
              <th class="py-3 px-6 font-medium whitespace-nowrap text-center">Active Sessions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <tr v-if="loading"><td colspan="6" class="py-10 text-center text-gray-400">Loading...</td></tr>
            <tr v-else-if="!users.length"><td colspan="6" class="py-10 text-center text-gray-400">No users found.</td></tr>
            <tr v-for="u in users" :key="u.id" class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 font-medium text-gray-800">{{ u.name ?? '—' }}</td>
              <td class="py-4 px-6">{{ u.email }}</td>
              <td class="py-4 px-6"><span class="bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 text-[12px] font-medium">{{ u.role }}</span></td>
              <td class="py-4 px-6">{{ u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never' }}</td>
              <td class="py-4 px-6">{{ u.last_location ?? '—' }}</td>
              <td class="py-4 px-6 text-center">
                <span :class="u.active_sessions > 0 ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'"
                  class="rounded-full px-2.5 py-1 text-[12px] font-medium">{{ u.active_sessions }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Status & Users tab of the client configure view — make live / suspend
// plus the tenant's user list with login/session info.
import { ref, onMounted } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
})

const { setTenantStatus, getTenantUsers, getTenants } = useClientManagement()

const status = ref(null)
const users = ref([])
const loading = ref(false)
const busy = ref(false)
const confirmStatus = ref(null)
const message = ref('')
const messageOk = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await getTenantUsers(props.tenantId)
    users.value = res.data ?? []
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
  // Current status via the tenant list (single-tenant fetch not needed)
  try {
    const res = await getTenants({ per_page: 100 })
    status.value = (res.data ?? []).find(t => t.id === props.tenantId)?.status ?? null
  } catch {}
}

async function applyStatus() {
  busy.value = true
  message.value = ''
  try {
    const res = await setTenantStatus(props.tenantId, confirmStatus.value)
    status.value = res.tenant?.status ?? confirmStatus.value
    messageOk.value = true
    message.value = 'Status updated.'
  } catch (e) {
    messageOk.value = false
    message.value = e?.data?.message ?? 'Failed to update status.'
  } finally {
    busy.value = false
    confirmStatus.value = null
  }
}

onMounted(load)
</script>
