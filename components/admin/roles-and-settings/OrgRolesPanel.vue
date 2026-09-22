<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[132px]">
      <template v-if="!limits">
        <div v-for="n in 3" :key="n" class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm h-[132px]">
          <div class="skeleton h-4 w-28 rounded mb-4"></div>
          <div class="skeleton h-8 w-16 rounded mb-3"></div>
          <div class="skeleton h-2 w-full rounded"></div>
        </div>
      </template>
      <template v-else>
        <div v-for="card in cards" :key="card.title" class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm h-[132px]">
          <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
            <span>{{ card.title }}</span>
            <span :class="card.iconBg" class="w-8 h-8 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="card.iconColor" v-html="card.icon"></svg>
            </span>
          </div>
          <div class="text-3xl font-semibold text-gray-800 mb-1">
            {{ card.used }}<span v-if="card.max !== null" class="text-lg text-gray-400 font-medium"> / {{ card.max }}</span>
          </div>
          <div v-if="card.max !== null" class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
            <div :class="barColor(card)" class="h-full rounded-full" :style="{ width: barWidth(card) }"></div>
          </div>
          <div v-else class="text-xs text-gray-400">{{ card.hint }}</div>
        </div>
      </template>
    </div>

    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-[16px] font-medium text-[#101828]">Organization Settings</h2>
        <p class="text-[13px] text-[#4A5565] mt-0.5">Control whether this organization follows the global defaults or uses its own.</p>
      </div>
      <p v-if="error" class="px-6 pt-3 text-[13px] text-red-500">{{ error }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 min-h-[104px]">
        <template v-if="!toggles">
          <div v-for="n in 2" :key="n" class="skeleton h-[64px] rounded-lg"></div>
        </template>
        <template v-else>
          <label class="flex items-center justify-between gap-4 border border-gray-200 rounded-lg px-4 py-3 text-sm">
            <span>
              <span class="font-medium text-gray-800">Use custom settings</span><br>
              <span class="text-[12px] text-gray-500">Off means this organization follows the global defaults exactly.</span>
            </span>
            <input type="checkbox" class="w-5 h-5 accent-[#00896F]" :checked="toggles.use_custom_settings" :disabled="busy"
              @change="toggle('use_custom_settings', $event.target.checked)" />
          </label>
          <label class="flex items-center justify-between gap-4 border border-gray-200 rounded-lg px-4 py-3 text-sm">
            <span>
              <span class="font-medium text-gray-800">Master can edit permissions</span><br>
              <span class="text-[12px] text-gray-500">Lets the master change the permissions you leave unlocked.</span>
            </span>
            <input type="checkbox" class="w-5 h-5 accent-[#00896F]" :checked="toggles.master_can_edit" :disabled="busy"
              @change="toggle('master_can_edit', $event.target.checked)" />
          </label>
        </template>
      </div>
    </div>

    <AdminRolesAndSettingsGroupsTable ref="table" mode="org" :tenant-id="tenantId"
      title="Roles & Permissions" subtitle="Per-organization overrides of the global defaults, and user limits."
      @loaded="onLoaded" @changed="onChanged" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
  activeUsers: { type: Number, default: 0 },
  usersLoading: { type: Boolean, default: false },
})

const { setRolesToggles } = useClientManagement()
const { errorMessage } = useDefaultSettings()

const table = ref(null)
const toggles = ref(null)
const limits = ref(null)
const busy = ref(false)
const error = ref('')

const onLoaded = (data) => {
  if (!data) return
  toggles.value = data.toggles
  limits.value = data.limits
}
const onChanged = () => {}

const cards = computed(() => [
  {
    title: 'Total Users',
    used: limits.value.total.used,
    max: limits.value.total.max ?? null,
    hint: 'No user limit',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  },
  {
    title: 'Master Accounts',
    used: limits.value.roles?.master_user?.used ?? 0,
    max: limits.value.roles?.master_user?.max ?? null,
    hint: 'No master limit',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
  },
  {
    title: 'Active Users',
    used: props.activeUsers,
    max: null,
    hint: 'Currently live accounts',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
  },
])

const pct = (card) => (card.max ? Math.min((card.used / card.max) * 100, 100) : 0)
const barWidth = (card) => `${pct(card)}%`
const barColor = (card) => (pct(card) >= 100 ? 'bg-red-500' : pct(card) >= 80 ? 'bg-amber-500' : 'bg-[#00896F]')

async function toggle(field, value) {
  busy.value = true
  error.value = ''
  try {
    const res = await setRolesToggles(props.tenantId, { [field]: value })
    if (res?.data?.toggles) toggles.value = res.data.toggles
    await table.value?.reload()
  } catch (e) {
    error.value = errorMessage(e)
    await table.value?.reload()
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
