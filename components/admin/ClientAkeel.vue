<template>
  <div class="space-y-6 mt-4">

    <!-- Kill switch -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">AI / Akeel Access</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">Instantly stop or resume AI chat for this tenant (testing/support control, separate from the plan entitlement).</p>
        </div>
        <div class="flex items-center gap-3">
          <span :class="enabled ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-red-100 text-red-700'"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
            {{ enabled ? 'Enabled' : 'Disabled' }}
          </span>
          <button @click="onToggleClick" :disabled="busy"
            :class="enabled ? 'border border-red-300 text-red-600 hover:bg-red-50' : 'bg-[#00896F] text-white hover:bg-[#00705a]'"
            class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ enabled ? 'Disable AI' : 'Enable AI' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Disable confirmation (password required) -->
    <div v-if="confirmDisable" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-2">Disable AI for this tenant?</h3>
        <p class="text-sm text-gray-500 mb-4">Users on this tenant will immediately lose AI chat access.</p>
        <label class="block text-[13px] text-gray-600 mb-1.5">Confirm with your admin password</label>
        <input v-model="togglePassword" type="password" placeholder="Your password" autocomplete="current-password"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <p v-if="toggleError" class="text-[13px] text-red-500 mt-2">{{ toggleError }}</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="confirmDisable = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="toggle" :disabled="busy || !togglePassword"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ busy ? 'Disabling…' : 'Disable AI' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 4 stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Flagged Chats</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : data.flagged_chats_total }}</p>
      </div>
      <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Total Tokens</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : data.tokens_used_total?.toLocaleString() }}</p>
      </div>
      <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Total Requests</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : data.requests_used_total }}</p>
      </div>
      <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Live Status</p>
        <p class="text-2xl font-semibold mt-1" :class="data.live_status === 'online' ? 'text-[#00896F]' : 'text-gray-400'">
          {{ loading ? '—' : (data.live_status === 'online' ? 'Online' : 'Offline') }}
        </p>
      </div>
    </div>

    <!-- Usage graph -->
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-4">Token Usage by Period</h2>
      <div v-if="!data.graph?.length" class="text-sm text-gray-400 py-10 text-center">No usage data yet.</div>
      <client-only v-else>
        <apexchart type="line" height="280" :options="chartOptions" :series="chartSeries"></apexchart>
      </client-only>
    </div>

    <!-- Org settings editor -->
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-1">AI Chat Settings</h2>
      <p class="text-[13px] text-[#4A5565] mb-4">0 = unlimited, unless noted otherwise.</p>
      <div class="space-y-4" v-if="settings.length">
        <div v-for="s in settings" :key="s.id" class="flex items-center justify-between gap-4">
          <label class="text-sm text-gray-700">{{ settingLabel(s.name) }}</label>
          <input v-if="s.value_type === 'bool'" type="checkbox" :checked="s.value === '1'"
            @change="s.value = ($event.target.checked ? '1' : '0')"
            class="w-5 h-5 accent-[#00896F]" />
          <input v-else type="number" v-model="s.value"
            class="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        </div>
      </div>
      <p v-if="settingsMessage" class="text-[13px] mt-3" :class="settingsOk ? 'text-[#00896F]' : 'text-red-500'">{{ settingsMessage }}</p>
      <button @click="saveSettings" :disabled="savingSettings"
        class="mt-4 px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
        {{ savingSettings ? 'Saving…' : 'Save Settings' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
})

const { getClientAi, toggleClientAi, getClientAiSettings, updateClientAiSettings } = useAdminAi()

const data = ref({})
const settings = ref([])
const loading = ref(false)
const busy = ref(false)
const savingSettings = ref(false)
const settingsMessage = ref('')
const settingsOk = ref(true)
const confirmDisable = ref(false)
const togglePassword = ref('')
const toggleError = ref('')

const enabled = computed(() => !!data.value.ai_calling_enabled)

const chartSeries = computed(() => [
  { name: 'Tokens Used', data: (data.value.graph ?? []).map((r) => r.tokens_used) },
])

const chartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false }, dropShadow: { enabled: false } },
  colors: ['#04C18F'],
  stroke: { width: 2, curve: 'smooth' },
  markers: { size: (data.value.graph ?? []).length === 1 ? 6 : 4, colors: ['#fff'], strokeColors: ['#04C18F'], strokeWidth: 2, hover: { size: 7 } },
  xaxis: {
    categories: (data.value.graph ?? []).map((r) => r.period),
    axisBorder: { show: true, color: '#9CA3AF' },
    axisTicks: { show: false },
    labels: { style: { colors: '#1a1a1a', fontSize: '12px' } },
    title: { text: 'Plan Cycle / Month', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
  },
  yaxis: {
    title: { text: 'Tokens', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
    labels: { style: { colors: '#1a1a1a', fontSize: '12px' } },
  },
  grid: { strokeDashArray: 4, padding: { left: 20 }, xaxis: { lines: { show: true } }, borderColor: '#E5E7EB' },
  legend: { show: false },
  tooltip: { theme: 'light' },
}))

function settingLabel(name) {
  const labels = {
    keep_history_per_chat: 'Keep chat history',
    max_chat_life_period: 'Max chat life period',
    per_user_max_history: 'Per-user max chat history',
    per_user_token_limit: 'Per-user token limit',
  }
  return labels[name] ?? name
}

async function load() {
  loading.value = true
  try {
    const res = await getClientAi(props.tenantId)
    data.value = res?.data ?? {}
  } catch {
    data.value = {}
  } finally {
    loading.value = false
  }
  try {
    const res = await getClientAiSettings(props.tenantId)
    settings.value = res?.data ?? []
  } catch {
    settings.value = []
  }
}

function onToggleClick() {
  if (enabled.value) {
    toggleError.value = ''
    togglePassword.value = ''
    confirmDisable.value = true
    return
  }
  toggle()
}

async function toggle() {
  busy.value = true
  toggleError.value = ''
  try {
    const res = await toggleClientAi(props.tenantId, enabled.value ? togglePassword.value : undefined)
    data.value.ai_calling_enabled = res?.data?.ai_calling_enabled ?? !enabled.value
    confirmDisable.value = false
  } catch (e) {
    toggleError.value = e?.data?.message ?? 'Failed to update AI access.'
  } finally {
    busy.value = false
  }
}

async function saveSettings() {
  savingSettings.value = true
  settingsMessage.value = ''
  try {
    await updateClientAiSettings(props.tenantId, settings.value.map((s) => ({ name: s.name, value: s.value })))
    settingsOk.value = true
    settingsMessage.value = 'Settings updated.'
  } catch (e) {
    settingsOk.value = false
    settingsMessage.value = e?.data?.message ?? 'Failed to update settings.'
  } finally {
    savingSettings.value = false
  }
}

onMounted(load)
</script>
