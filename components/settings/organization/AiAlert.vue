<template>
  <div class="bg-white border border-gray-100 rounded-[16px] shadow-sm overflow-hidden">
    <div class="p-6 pb-2">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#E8FCF2] rounded-[10px] flex items-center justify-center text-[#00835D] shrink-0">
            <img src="/images/icons/Notifications.svg" alt="" class="w-5 h-5" />
          </div>
          <h2 class="text-[18px] font-normal" style="color: #101828;">AI Alert Settings</h2>
        </div>

        <div class="relative min-w-[220px]">
          <select v-model="selectedDomain" @change="load" class="w-full pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00835D] text-sm text-gray-700 appearance-none shadow-sm">
            <option v-for="d in domainOptions" :key="d" :value="d">{{ formatDomain(d) }}</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </div>
      </div>

      <p class="text-[13px] mt-2 mb-6" style="color: #4A5565;">
        Control which AI alert groups reach this org, and which roles receive them. Your own personal email toggle
        stays on <NuxtLink to="/settings/notifications" class="text-[#00835D] underline">Notification Settings</NuxtLink>.
      </p>

      <!-- Fixed height (~5-6 rows) regardless of state, so loading/empty/loaded never shift the page around it -->
      <div class="min-h-[420px] max-h-[420px] overflow-y-auto pr-1 mb-6">
        <div v-if="loading" class="space-y-6">
          <div v-for="n in 5" :key="'sk'+n" class="border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
            <div class="h-4 w-1/3 bg-gray-100 rounded animate-pulse mb-2"></div>
            <div class="h-3 w-1/2 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="!groups.length" class="h-full flex items-center justify-center text-sm text-gray-400">
          No AI alert groups for this domain.
        </div>

        <div v-else class="space-y-6">
          <div v-for="group in groups" :key="group.group_id" class="border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">{{ group.name }}</h3>
                <p class="text-[13px] mt-0.5" style="color: #4A5565;">
                  {{ group.is_enabled ? (group.email_enabled ? 'Shown in-app + emailed' : 'Shown in-app, email off') : 'Off — hidden from everyone' }}
                </p>
              </div>
              <div class="flex items-center gap-4 shrink-0">
                <label class="flex items-center gap-1.5 text-[12px] text-gray-500">
                  Email
                  <button :disabled="!group.is_enabled" @click="toggleGroup(group, 'email_enabled')"
                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40"
                    :class="group.email_enabled ? 'bg-[#00835D]' : 'bg-gray-200'">
                    <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform" :class="group.email_enabled ? 'translate-x-4' : 'translate-x-1'"></span>
                  </button>
                </label>
                <button @click="toggleGroup(group, 'is_enabled')"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                  :class="group.is_enabled ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="group.is_enabled ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>
            </div>

            <button @click="group._expanded = !group._expanded" class="mt-3 text-[12px] text-[#00835D] font-medium">
              {{ group._expanded ? 'Hide roles' : 'Which roles get this?' }}
            </button>

            <div v-if="group._expanded" class="mt-3 flex flex-wrap gap-2">
              <label v-for="role in assignableRoles" :key="role"
                class="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-[12px] cursor-pointer"
                :class="group.roles[role] ? 'bg-[#E8FCF2] border-[#00835D] text-[#00835D]' : 'text-gray-500'">
                <input type="checkbox" :checked="group.roles[role]"
                  @change="toggleRole(group, role, $event.target.checked)" class="w-3.5 h-3.5 accent-[#00835D]" />
                {{ roleLabel(role) }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { getAiAlertGroups, updateGroup, updateRole } = useOrganizationSettings()

const selectedDomain = ref('')
const domainOptions = ref([])
const groups = ref([])
const assignableRoles = ref([])
const loading = ref(true)

const roleLabels = {
  client_user: 'Client User', account_user: 'Accounts', sales_user: 'Sales', master_user: 'Master User',
  procurement_user: 'Procurement', project_manager_user: 'Project Manager', guest_user: 'Guest', partner_user: 'Partner',
}
function roleLabel(role) {
  return roleLabels[role] ?? role
}
function formatDomain(d) {
  if (!d) return d
  if (!d.includes('_') && d === d.toUpperCase() && d.length <= 4) return d
  return d.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

async function load() {
  loading.value = true
  try {
    const res = await getAiAlertGroups(selectedDomain.value)
    domainOptions.value = res?.domain_options ?? []
    assignableRoles.value = res?.assignable_roles ?? []

    // First load has no domain selected yet, so the response is unfiltered (all domains) —
    // pick the default domain and filter what's already in hand instead of a second round-trip.
    if (!selectedDomain.value && domainOptions.value.length) {
      selectedDomain.value = domainOptions.value[0]
    }

    groups.value = (res?.data ?? [])
      .filter((g) => g.domain === selectedDomain.value)
      .map((g) => ({ ...g, _expanded: false }))
  } catch (e) {
    if ((e?.status ?? e?.response?.status) === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }
    groups.value = []
  } finally {
    loading.value = false
  }
}

// Loads on mount, not a top-level await — this component has no <Suspense> boundary around it,
// so blocking setup on the fetch would either warn or render nothing. `loading` already starts
// true, so the skeleton shows immediately while this resolves.
onMounted(load)

async function toggleGroup(group, field) {
  const next = !group[field]
  group[field] = next
  try {
    await updateGroup(group.group_id, { [field]: next })
  } catch {
    group[field] = !next
  }
}

async function toggleRole(group, role, checked) {
  group.roles[role] = checked
  try {
    await updateRole(group.group_id, role, checked)
  } catch {
    group.roles[role] = !checked
  }
}
</script>
