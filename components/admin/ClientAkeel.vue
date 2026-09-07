<template>
  <div class="space-y-6 mt-4">

    <!-- Kill switch -->
    <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-6">
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
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Flagged Chats</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : data.flagged_chats_total }}</p>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Total Tokens</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : formatInMillions(data.tokens_used_total) }}</p>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Total Requests</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : data.requests_used_total }}</p>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Live Status</p>
        <p class="text-2xl font-semibold mt-1" :class="data.live_status === 'online' ? 'text-[#00896F]' : 'text-gray-400'">
          {{ loading ? '—' : (data.live_status === 'online' ? 'Online' : 'Offline') }}
        </p>
      </div>
    </div>

    <!-- Usage graph -->
    <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[16px] font-medium text-[#101828]">Token Usage by Month</h2>
        <div class="relative">
          <div @click="isRangeOpen = !isRangeOpen"
            class="h-[38px] px-3 border border-[#00896F] rounded-[10px] flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#101828]">
            {{ rangeLabels[selectedRange] }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': isRangeOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-if="isRangeOpen" class="absolute top-[calc(100%+6px)] right-0 w-[140px] bg-white border border-gray-100 rounded-[12px] shadow-xl py-2 px-2 flex flex-col gap-1 z-20">
            <button v-for="(label, key) in rangeLabels" :key="key"
              @click="selectedRange = key; isRangeOpen = false"
              class="w-full text-left px-3 py-2 rounded-[8px] text-[13px]"
              :class="selectedRange === key ? 'bg-[#E4FFF6] text-[#00896F] font-medium' : 'text-[#101828] hover:bg-gray-50'">
              {{ label }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="!data.graph?.length" class="text-sm text-gray-400 py-10 text-center">No usage data yet.</div>
      <client-only v-else>
        <apexchart type="line" height="280" :options="chartOptions" :series="chartSeries"></apexchart>
        <p class="text-[12px] text-gray-400 mt-2 flex items-center gap-3">
          <span class="flex items-center gap-1.5"><span class="inline-block w-2 h-2 rounded-full bg-[#04C18F]"></span> Normal month</span>
          <span class="flex items-center gap-1.5"><span class="inline-block w-2 h-2 rounded-full bg-red-500"></span> Month had flagged chats</span>
        </p>
      </client-only>
    </div>

    <!-- Sub-tab switcher: General / Chat / AI Alerts -->
    <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto">
      <button v-for="t in ['General', 'Chat', 'AI Alerts']" :key="t" @click="activeAkeelSubTab = t"
        :class="activeAkeelSubTab === t ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-6 shadow-sm' : 'text-gray-700 font-medium px-5 hover:bg-gray-50 hover:text-gray-900'"
        class="py-2 rounded-full transition-colors whitespace-nowrap">{{ t }}</button>
    </div>

    <!-- Org settings editor -->
    <div v-if="activeAkeelSubTab === 'General'" class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-1">AI Chat Settings</h2>
      <p class="text-[13px] text-[#4A5565] mb-4">0 = unlimited, unless noted otherwise.</p>
      <div class="space-y-4" v-if="generalSettings.length">
        <div v-for="s in generalSettings" :key="s.id" class="flex items-center justify-between gap-4">
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

    <!-- Chat Settings sub-tab: system-instruction override + per-org data-link overrides -->
    <div v-if="activeAkeelSubTab === 'Chat'" class="space-y-6">
      <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
        <h2 class="text-[16px] font-medium text-[#101828] mb-1">Chat Customization</h2>
        <p class="text-[13px] text-[#4A5565] mb-4">Off = pure global behavior, even if custom values are saved below.</p>
        <label class="flex items-center gap-2 mb-4">
          <input type="checkbox" :checked="settingByName('chat_use_custom_settings')?.value === '1'"
            @change="setSettingValue('chat_use_custom_settings', $event.target.checked)" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Use custom system instruction for this org</span>
        </label>
        <label class="block text-[13px] text-gray-600 mb-1.5">System instruction override</label>
        <textarea :value="settingByName('system_instructions_override')?.value" rows="4"
          @input="setSettingValue('system_instructions_override', $event.target.value, false)"
          placeholder="Empty = inherit the global instruction"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"></textarea>
        <button @click="saveSettings" :disabled="savingSettings"
          class="mt-4 px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          {{ savingSettings ? 'Saving…' : 'Save' }}
        </button>
      </div>

      <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
        <div class="flex items-center justify-between gap-4 mb-1">
          <h2 class="text-[16px] font-medium text-[#101828]">Chat Data-Links</h2>
          <label class="flex items-center gap-2 shrink-0">
            <input type="checkbox" :checked="settingByName('chat_data_links_use_custom_settings')?.value === '1'"
              @change="setSettingValue('chat_data_links_use_custom_settings', $event.target.checked); saveSettings()" class="w-5 h-5 accent-[#00896F]" />
            <span class="text-sm text-gray-700">Use custom data-link settings</span>
          </label>
        </div>
        <p class="text-[13px] text-[#4A5565] mb-4">Disable a tool for this org's chat, or customize how it's described to Akeel. The underlying computation never changes.</p>
        <div class="flex flex-col md:flex-row gap-3 mb-3">
          <input v-model="dataLinkOverrides.search" @input="debouncedLoadOverrides('dataLinks')" type="text" placeholder="Search tool…"
            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
          <div class="flex items-center gap-2 min-w-[140px] bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700">
            <span>Domain<span v-if="dataLinkOverrides.domain.length"> ({{ dataLinkOverrides.domain.length }})</span></span>
            <DataSourceTbHeaderFilter column="domain" :options="dataLinkOverrides.domainOptions" :selected="dataLinkOverrides.domain"
              @apply="(col, values) => { dataLinkOverrides.domain = values; loadDataLinkOverrides(1) }" class="ml-auto" />
          </div>
        </div>
        <div class="divide-y divide-gray-100">
          <template v-if="dataLinkOverrides.loading">
            <div v-for="n in 10" :key="'sk'+n" class="py-3"><div class="h-10 bg-gray-100 rounded animate-pulse"></div></div>
          </template>
          <p v-else-if="!dataLinkOverrides.rows.length" class="py-10 text-center text-sm text-gray-400">No data-links found.</p>
          <div v-for="row in dataLinkOverrides.rows" :key="row.id" class="py-3 flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-800 flex items-center gap-2">
                {{ row.label }}
                <span v-if="row.is_customized.is_enabled || row.is_customized.context_instruction" class="text-[11px] font-medium bg-[#E4FFF6] text-[#00896F] rounded-full px-2 py-0.5">Customized</span>
              </p>
              <p class="text-[12px] text-gray-400">{{ row.domain }}</p>
              <textarea v-model="row.resolved.context_instruction" rows="2"
                class="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#008169]"></textarea>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <label class="flex items-center gap-1.5">
                <input type="checkbox" v-model="row.resolved.is_enabled" class="w-4 h-4 accent-[#00896F]" />
                <span class="text-[12px] text-gray-600">Enabled</span>
              </label>
              <div class="flex gap-2">
                <button @click="saveDataLinkOverride(row)" class="text-[12px] px-2.5 py-1 bg-[#00896F] text-white rounded-md hover:bg-[#00705a]">Save</button>
                <button @click="resetDataLinkOverride(row)" class="text-[12px] px-2.5 py-1 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50">Reset</button>
              </div>
            </div>
          </div>
        </div>
        <CommonPaginationBar v-if="dataLinkOverrides.meta.total > 0" :meta="dataLinkOverrides.meta" :loading="dataLinkOverrides.loading"
          @page-change="(p) => loadDataLinkOverrides(p)" @per-page-change="(pp) => { dataLinkOverrides.perPage = pp; loadDataLinkOverrides(1) }" />
      </div>
    </div>

    <!-- AI Alerts sub-tab: per-org alert-rule overrides -->
    <div v-if="activeAkeelSubTab === 'AI Alerts'" class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
      <div class="flex items-center justify-between gap-4 mb-1">
        <h2 class="text-[16px] font-medium text-[#101828]">Alert Rule Customization</h2>
        <label class="flex items-center gap-2 shrink-0">
          <input type="checkbox" :checked="settingByName('alerts_use_custom_settings')?.value === '1'"
            @change="setSettingValue('alerts_use_custom_settings', $event.target.checked); saveSettings()" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Use custom alert settings</span>
        </label>
      </div>
      <p class="text-[13px] text-[#4A5565] mb-4">Off = pure global behavior for every rule, even if overrides already exist below. Title/category/priority stay global-only, never overridable.</p>
      <div class="flex flex-col md:flex-row gap-3 mb-3">
        <input v-model="alertRuleOverrides.search" @input="debouncedLoadOverrides('alertRules')" type="text" placeholder="Search alert title…"
          class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <div class="flex items-center gap-2 min-w-[140px] bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700">
          <span>Domain<span v-if="alertRuleOverrides.domain.length"> ({{ alertRuleOverrides.domain.length }})</span></span>
          <DataSourceTbHeaderFilter column="domain" :options="alertRuleOverrides.domainOptions" :selected="alertRuleOverrides.domain"
            @apply="(col, values) => { alertRuleOverrides.domain = values; loadAlertRuleOverrides(1) }" class="ml-auto" />
        </div>
      </div>
      <div class="divide-y divide-gray-100">
        <template v-if="alertRuleOverrides.loading">
          <div v-for="n in 10" :key="'sk'+n" class="py-3"><div class="h-16 bg-gray-100 rounded animate-pulse"></div></div>
        </template>
        <p v-else-if="!alertRuleOverrides.rows.length" class="py-10 text-center text-sm text-gray-400">No alert rules found.</p>
        <div v-for="row in alertRuleOverrides.rows" :key="row.id" class="py-3">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-800 flex items-center gap-2">
                {{ row.alert_title }}
                <span :class="{ 'bg-[#FEF2F2] text-[#DC2626]': row.priority === 'P1', 'bg-[#FFF7ED] text-[#C2410C]': row.priority === 'P2', 'bg-gray-100 text-gray-600': row.priority === 'P3' }" class="rounded-full px-2 py-0.5 text-[11px] font-medium">{{ row.priority }}</span>
                <span v-if="Object.values(row.is_customized).some(Boolean)" class="text-[11px] font-medium bg-[#E4FFF6] text-[#00896F] rounded-full px-2 py-0.5">Customized</span>
              </p>
              <p class="text-[12px] text-gray-400">{{ row.domain }} · {{ row.category ?? '—' }}</p>
              <textarea v-model="row.resolved.rag_prompt_instruction" rows="2" placeholder="RAG prompt instruction"
                class="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#008169]"></textarea>

              <div class="flex flex-wrap items-center gap-3 mt-2">
                <select v-model="row.resolved.check_interval" class="px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] outline-none focus:border-[#008169]">
                  <option :value="null">Inherit cadence</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input v-if="row.resolved.check_interval === 'hourly'" type="number" min="1" v-model.number="row.resolved.check_interval_hours" placeholder="Every N hours" class="w-28 px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] outline-none focus:border-[#008169]" />
                <input v-else-if="row.resolved.check_interval === 'daily'" type="time" v-model="row.resolved.check_interval_time" class="px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] outline-none focus:border-[#008169]" />
                <input v-else-if="['weekly','biweekly'].includes(row.resolved.check_interval)" type="number" min="0" max="6" v-model.number="row.resolved.check_interval_day" placeholder="Weekday 0-6" class="w-28 px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] outline-none focus:border-[#008169]" />
                <input v-else-if="row.resolved.check_interval === 'monthly'" type="number" min="1" max="28" v-model.number="row.resolved.check_interval_day" placeholder="Day 1-28" class="w-28 px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] outline-none focus:border-[#008169]" />
              </div>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <label class="flex items-center gap-1.5">
                <input type="checkbox" v-model="row.resolved.is_active" class="w-4 h-4 accent-[#00896F]" />
                <span class="text-[12px] text-gray-600">Active</span>
              </label>
              <div class="flex gap-2">
                <button @click="saveAlertRuleOverride(row)" class="text-[12px] px-2.5 py-1 bg-[#00896F] text-white rounded-md hover:bg-[#00705a]">Save</button>
                <button @click="resetAlertRuleOverride(row)" class="text-[12px] px-2.5 py-1 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonPaginationBar v-if="alertRuleOverrides.meta.total > 0" :meta="alertRuleOverrides.meta" :loading="alertRuleOverrides.loading"
        @page-change="(p) => loadAlertRuleOverrides(p)" @per-page-change="(pp) => { alertRuleOverrides.perPage = pp; loadAlertRuleOverrides(1) }" />
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
})

const {
  getClientAi, toggleClientAi, getClientAiSettings, updateClientAiSettings,
  getClientAlertRuleOverrides, updateClientAlertRuleOverride, resetClientAlertRuleOverride,
  getClientDataLinkOverrides, updateClientDataLinkOverride, resetClientDataLinkOverride,
} = useAdminAi()

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

const activeAkeelSubTab = ref('General')

const AKEEL_TAB_SETTING_NAMES = ['alerts_use_custom_settings', 'chat_use_custom_settings', 'system_instructions_override', 'chat_data_links_use_custom_settings']
const generalSettings = computed(() => settings.value.filter((s) => !AKEEL_TAB_SETTING_NAMES.includes(s.name)))
function settingByName(name) {
  return settings.value.find((s) => s.name === name)
}
function setSettingValue(name, value, isBool = true) {
  const row = settingByName(name)
  if (row) row.value = isBool ? (value ? '1' : '0') : value
}

function makeOverrideTableState() {
  return reactive({ rows: [], meta: { total: 0 }, loading: false, perPage: 10, search: '', domain: [], domainOptions: [] })
}
const alertRuleOverrides = makeOverrideTableState()
const dataLinkOverrides = makeOverrideTableState()

const overrideDebounceTimers = {}
function debouncedLoadOverrides(key) {
  clearTimeout(overrideDebounceTimers[key])
  overrideDebounceTimers[key] = setTimeout(() => {
    if (key === 'alertRules') loadAlertRuleOverrides(1)
    if (key === 'dataLinks') loadDataLinkOverrides(1)
  }, 400)
}

function applyMeta(res) {
  return { current_page: res.current_page ?? 1, per_page: res.per_page ?? 10, total: res.total ?? 0, last_page: res.last_page ?? 1 }
}

const enabled = computed(() => !!data.value.ai_calling_enabled)

const isRangeOpen = ref(false)
const selectedRange = ref('6m')
const rangeLabels = { '3m': '3 Months', '6m': '6 Months', '1y': '1 Year', full: 'Full' }

// Flagged-month dots ride on the same "Tokens Used" line series (value at that point when
// flagged_count > 0, else null so ApexCharts skips drawing a marker there) rather than a second
// scatter series — keeps a single continuous line with red markers only where real flags exist.
const chartSeries = computed(() => [
  { name: 'Tokens Used', data: (data.value.graph ?? []).map((r) => r.tokens_used) },
])

const flaggedPointIndexes = computed(() =>
  (data.value.graph ?? []).reduce((idxs, r, i) => (r.flagged_count > 0 ? [...idxs, i] : idxs), [])
)

const chartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false }, dropShadow: { enabled: false } },
  colors: ['#04C18F'],
  stroke: { width: 2, curve: 'smooth' },
  markers: {
    size: (data.value.graph ?? []).length === 1 ? 6 : 4,
    colors: ['#04C18F'],
    strokeColors: ['#04C18F'],
    strokeWidth: 2,
    hover: { size: 7 },
    discrete: flaggedPointIndexes.value.map((i) => ({ seriesIndex: 0, dataPointIndex: i, fillColor: '#EF4444', strokeColor: '#EF4444', size: 6 })),
  },
  xaxis: {
    categories: (data.value.graph ?? []).map((r) => r.period),
    axisBorder: { show: true, color: '#9CA3AF' },
    axisTicks: { show: false },
    labels: { style: { colors: '#1a1a1a', fontSize: '12px' } },
    title: { text: 'Month', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
  },
  yaxis: {
    min: 0,
    title: { text: 'Tokens', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
    labels: { style: { colors: '#1a1a1a', fontSize: '12px' } },
  },
  grid: { strokeDashArray: 4, padding: { left: 20 }, xaxis: { lines: { show: true } }, borderColor: '#E5E7EB' },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    custom: ({ dataPointIndex }) => {
      const r = data.value.graph?.[dataPointIndex] ?? {}
      const flagLine = r.flagged_count > 0 ? `<div class="text-red-500 text-[13px] mt-1">${r.flagged_count} flagged chat${r.flagged_count === 1 ? '' : 's'}</div>` : ''
      return `<div class="bg-white rounded-[10px] p-3 shadow-lg border border-gray-100">
        <div class="text-[13px] text-gray-500">${r.period ?? ''}</div>
        <div class="text-[14px] font-medium text-[#04C18F] mt-1">${(r.tokens_used ?? 0).toLocaleString()} tokens</div>
        ${flagLine}
      </div>`
    },
  },
}))

watch(selectedRange, reloadGraph)

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
    const res = await getClientAi(props.tenantId, selectedRange.value)
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

/** Range switch only needs the graph payload re-fetched, not the settings/kill-switch state. */
async function reloadGraph() {
  loading.value = true
  try {
    const res = await getClientAi(props.tenantId, selectedRange.value)
    data.value = res?.data ?? {}
  } catch {
    data.value = {}
  } finally {
    loading.value = false
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

async function loadAlertRuleOverrides(page = 1) {
  alertRuleOverrides.loading = true
  try {
    const res = await getClientAlertRuleOverrides(props.tenantId, { page, per_page: alertRuleOverrides.perPage, search: alertRuleOverrides.search, domain: alertRuleOverrides.domain })
    alertRuleOverrides.rows = res?.data ?? []
    alertRuleOverrides.meta = applyMeta(res)
    if (res?.category_options) alertRuleOverrides.categoryOptions = res.category_options
    alertRuleOverrides.domainOptions = res?.domain_options ?? alertRuleOverrides.domainOptions
  } catch {
    alertRuleOverrides.rows = []
  } finally {
    alertRuleOverrides.loading = false
  }
}

async function loadDataLinkOverrides(page = 1) {
  dataLinkOverrides.loading = true
  try {
    const res = await getClientDataLinkOverrides(props.tenantId, { page, per_page: dataLinkOverrides.perPage, search: dataLinkOverrides.search, domain: dataLinkOverrides.domain })
    dataLinkOverrides.rows = res?.data ?? []
    dataLinkOverrides.meta = applyMeta(res)
    if (res?.domain_options) dataLinkOverrides.domainOptions = res.domain_options
  } catch {
    dataLinkOverrides.rows = []
  } finally {
    dataLinkOverrides.loading = false
  }
}

async function saveAlertRuleOverride(row) {
  const r = row.resolved
  await updateClientAlertRuleOverride(props.tenantId, row.id, {
    rag_prompt_instruction: r.rag_prompt_instruction,
    is_active: r.is_active,
    check_interval: r.check_interval,
    check_interval_hours: r.check_interval === 'hourly' ? r.check_interval_hours : null,
    check_interval_day: ['weekly', 'biweekly', 'monthly'].includes(r.check_interval) ? r.check_interval_day : null,
    check_interval_time: r.check_interval === 'daily' ? r.check_interval_time : null,
  })
  await loadAlertRuleOverrides(alertRuleOverrides.meta.current_page)
}
async function resetAlertRuleOverride(row) {
  await resetClientAlertRuleOverride(props.tenantId, row.id)
  await loadAlertRuleOverrides(alertRuleOverrides.meta.current_page)
}

async function saveDataLinkOverride(row) {
  await updateClientDataLinkOverride(props.tenantId, row.id, row.resolved)
  await loadDataLinkOverrides(dataLinkOverrides.meta.current_page)
}
async function resetDataLinkOverride(row) {
  await resetClientDataLinkOverride(props.tenantId, row.id)
  await loadDataLinkOverrides(dataLinkOverrides.meta.current_page)
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

onMounted(() => {
  load()
  loadAlertRuleOverrides()
  loadDataLinkOverrides()
})
</script>
