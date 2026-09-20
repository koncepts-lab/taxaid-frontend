<template>
  <div class="space-y-6 mt-4">

    <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto">
      <button v-for="t in ['General', 'Chat', 'AI Alerts']" :key="t" @click="activeAkeelSubTab = t"
        :class="activeAkeelSubTab === t ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-6 shadow-sm' : 'text-gray-700 font-medium px-5 hover:bg-gray-50 hover:text-gray-900'"
        class="py-2 rounded-full transition-colors whitespace-nowrap">{{ t }}</button>
    </div>
    <p class="text-[12px] text-gray-500 -mt-3">{{ isOrg ? 'Applies to all tenants of this organization.' : 'Applies to this tenant only.' }}</p>

    <div v-if="activeAkeelSubTab === 'General'" class="space-y-6">
    <!-- Tenant page: org override notice -->
    <div v-if="!isOrg && orgOverrideNotice" class="bg-[#FEFCE8] border border-[#FDE047] rounded-[10px] px-4 py-3 text-[13px] text-[#854D0E]">
      {{ orgOverrideNotice }}
    </div>

    <!-- Master / per-tenant AI access -->
    <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">{{ isOrg ? 'AI / Akeel Access (organization)' : 'AI / Akeel Access (this tenant)' }}</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">
            {{ isOrg
              ? 'Master switch for every tenant of this organization. When it is off, no tenant can use AI, whatever the tenant switches say.'
              : 'Kill switch for this tenant only. The organization switch and the plan quota still apply.' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span :class="accessEnabled ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-red-100 text-red-700'"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
            {{ loading ? '—' : (accessEnabled ? 'Enabled' : 'Disabled') }}
          </span>
          <button @click="onToggleClick" :disabled="busy || loading"
            :class="accessEnabled ? 'border border-red-300 text-red-600 hover:bg-red-50' : 'bg-[#00896F] text-white hover:bg-[#00705a]'"
            class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 min-w-[130px]">
            {{ accessEnabled ? 'Disable AI' : 'Enable AI' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Chat / Alerts -->
    <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6" :class="{ 'opacity-50': !accessEnabled }">
      <h2 class="text-[16px] font-medium text-[#101828]">AI Chat / AI Alerts</h2>
      <p class="text-[13px] text-[#4A5565] mt-0.5 mb-4">
        {{ isOrg
          ? 'Follow plan: allowed only if the plan includes it. Off: blocked for every tenant. The plan quota always applies.'
          : 'Plain on/off for this tenant. It starts from the organization setting and can never exceed it.' }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="f in switchFields" :key="f.key" class="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-4 py-3 min-h-[60px]">
          <span class="text-sm text-gray-700">{{ f.label }}</span>
          <select v-if="isOrg" :value="org[f.orgKey]" @change="setOrgMode(f.orgKey, $event.target.value)"
            :disabled="entitlementBusy || !accessEnabled" class="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] outline-none focus:border-[#008169] disabled:opacity-60">
            <option value="global">Follow plan</option>
            <option value="off">Off</option>
          </select>
          <div v-else class="flex items-center gap-3">
            <span v-if="data[f.key] === null || data[f.key] === undefined" class="text-[11px] text-gray-400">Same as organization</span>
            <button v-else @click="setTenantSwitch(f.key, null)" :disabled="entitlementBusy" class="text-[11px] text-[#00896F] hover:underline">Use organization value</button>
            <button type="button" role="switch" :aria-checked="tenantSwitchOn(f)" @click="setTenantSwitch(f.key, !tenantSwitchOn(f))"
              :disabled="entitlementBusy || !accessEnabled"
              :class="tenantSwitchOn(f) ? 'bg-[#00896F]' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50">
              <span :class="tenantSwitchOn(f) ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
            </button>
          </div>
        </div>
      </div>
      <p v-if="entitlementMessage" class="text-[13px] mt-3" :class="entitlementOk ? 'text-[#00896F]' : 'text-red-500'">{{ entitlementMessage }}</p>
    </div>

    <!-- Configuration button -->
    <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-[16px] font-medium text-[#101828]">Configuration</h2>
        <p class="text-[13px] text-[#4A5565] mt-0.5">Copy, sync, reset, promote, export or import the AI chat and alert configuration.</p>
      </div>
      <button @click="showConfig = true" class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors min-w-[130px]">Configuration</button>
    </div>

    <template v-if="isOrg">
    <!-- 4 stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Flagged Chats</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : data.flagged_chats_total }}</p>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-5">
        <p class="text-[13px] text-[#4A5565]">Total Tokens</p>
        <p class="text-2xl font-semibold text-[#101828] mt-1">{{ loading ? '—' : formatTokens(data.tokens_used_total) }}</p>
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

    </template>
    <!-- Org settings editor -->
    <div v-if="isOrg" class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
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

    </div>

    <!-- Chat Settings sub-tab: system-instruction override + per-org data-link overrides -->
    <div v-if="activeAkeelSubTab === 'Chat'" class="space-y-6">
      <div v-if="!isOrg" class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
        <h2 class="text-[16px] font-medium text-[#101828]">Configuration Source</h2>
        <p class="text-[13px] text-[#4A5565] mt-0.5 mb-4">Which AI chat configuration this tenant uses.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button v-for="m in modeOptions" :key="m.key" @click="setMode(m.key, 'chat')" :disabled="modeBusy"
            :class="areaMode('chat') === m.key ? 'border-[#00896F] bg-[#F0FDF9]' : 'border-gray-100 hover:bg-gray-50'"
            class="text-left border rounded-lg px-4 py-3 transition-colors disabled:opacity-60">
            <span class="block text-sm font-medium text-gray-800">{{ m.label }}</span>
            <span class="block text-[12px] text-gray-500 mt-0.5">{{ m.help }}</span>
          </button>
        </div>
        <p v-if="areaMode('chat') !== 'custom'" class="text-[12px] text-gray-500 mt-3">Edits below are saved for this tenant but only take effect in Custom Tenant mode.</p>
        <p v-if="modeMessage" class="text-[13px] mt-3" :class="modeOk ? 'text-[#00896F]' : 'text-red-500'">{{ modeMessage }}</p>
      </div>
      <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
        <h2 class="text-[16px] font-medium text-[#101828] mb-1">Chat Customization</h2>
        <p class="text-[13px] text-[#4A5565] mb-4">{{ isOrg ? 'Applies to every tenant that uses Custom Organization.' : 'Saved for this tenant only.' }} Empty = inherit the AI global default.</p>
        <label class="block text-[13px] text-gray-600 mb-1.5">System instruction override</label>
        <textarea :value="settingByName('system_instructions_override')?.value" rows="4"
          @input="setSettingValue('system_instructions_override', $event.target.value, false)"
          placeholder="Empty = inherit the AI global default"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"></textarea>
        <button @click="saveSettings" :disabled="savingSettings"
          class="mt-4 px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          {{ savingSettings ? 'Saving…' : 'Save' }}
        </button>
      </div>

      <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
        <div class="flex items-center justify-between gap-4 mb-1">
          <h2 class="text-[16px] font-medium text-[#101828]">Chat Data-Links</h2>
        </div>
        <p class="text-[13px] text-[#4A5565] mb-4">Disable a tool for chat, or customize how it's described to Akeel. The underlying computation never changes.</p>
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
    <div v-if="activeAkeelSubTab === 'AI Alerts'" class="space-y-6">
      <div v-if="!isOrg" class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
        <h2 class="text-[16px] font-medium text-[#101828]">Configuration Source</h2>
        <p class="text-[13px] text-[#4A5565] mt-0.5 mb-4">Which AI alerts configuration this tenant uses.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button v-for="m in modeOptions" :key="m.key" @click="setMode(m.key, 'alerts')" :disabled="modeBusy"
            :class="areaMode('alerts') === m.key ? 'border-[#00896F] bg-[#F0FDF9]' : 'border-gray-100 hover:bg-gray-50'"
            class="text-left border rounded-lg px-4 py-3 transition-colors disabled:opacity-60">
            <span class="block text-sm font-medium text-gray-800">{{ m.label }}</span>
            <span class="block text-[12px] text-gray-500 mt-0.5">{{ m.help }}</span>
          </button>
        </div>
        <p v-if="areaMode('alerts') !== 'custom'" class="text-[12px] text-gray-500 mt-3">Edits below are saved for this tenant but only take effect in Custom Tenant mode.</p>
        <p v-if="modeMessage" class="text-[13px] mt-3" :class="modeOk ? 'text-[#00896F]' : 'text-red-500'">{{ modeMessage }}</p>
      </div>
    <div class="bg-white border border-gray-100 rounded-[10px] shadow-sm p-6">
      <div class="flex items-center justify-between gap-4 mb-1">
        <h2 class="text-[16px] font-medium text-[#101828]">Alert Rule Customization</h2>
      </div>
      <p class="text-[13px] text-[#4A5565] mb-4">{{ isOrg ? 'Applies to every tenant that uses Custom Organization.' : 'Saved for this tenant only.' }} Title/category/priority stay AI-global-only, never overridable.</p>
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

    <Teleport to="body">
    <!-- Disable confirmation (password required) -->
    <div v-if="confirmDisable" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-2">{{ isOrg ? 'Disable AI for this organization?' : 'Disable AI for this tenant?' }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ isOrg ? 'Users of every tenant in this organization' : 'Users on this tenant' }} will immediately lose AI access.</p>
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
    </Teleport>

    <Teleport to="body">
      <div v-if="showConfig" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showConfig = false">
        <div class="bg-white rounded-xl shadow-lg w-[720px] max-w-full max-h-[90vh] overflow-y-auto p-6">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h3 class="text-[16px] font-semibold text-gray-900">{{ isOrg ? 'Configure organization' : 'Configure tenant' }}{{ label ? ` (${label})` : '' }}</h3>
            <button @click="showConfig = false" class="text-gray-400 hover:text-gray-600" title="Close">✕</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!isOrg" class="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
            <div><p class="text-sm font-medium text-gray-800">Copy from another tenant</p><p class="text-[12px] text-gray-500 mt-0.5">Copies the configuration of another tenant of this organization onto this tenant, which then becomes Custom Tenant.</p></div>
            <div class="flex flex-wrap items-center gap-2">
              <select v-model="copySource" :disabled="!otherTenants.length || actionBusy" class="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169] disabled:opacity-60 min-w-[180px]">
                <option value="">{{ otherTenants.length ? 'Select tenant…' : 'No other tenant' }}</option>
                <option v-for="t in otherTenants" :key="t.id" :value="String(t.id)">{{ t.name || 'Tenant' }} (#{{ t.id }})</option>
              </select>
              <button @click="openAction('copy')" :disabled="!copySource || actionBusy" class="self-start px-4 py-2 border border-[#007C65] text-[#007C65] rounded-lg text-sm font-medium hover:bg-[#F0FDF4] disabled:opacity-50">Copy</button>
            </div>
          </div>
          <div class="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
            <div><p class="text-sm font-medium text-gray-800">{{ isOrg ? 'Apply Custom Organization to all tenants' : 'Sync from AI Global Default' }}</p><p class="text-[12px] text-gray-500 mt-0.5">{{ isOrg ? 'Every tenant of this organization uses the organization configuration you set here. Nothing is copied from a tenant.' : 'This tenant uses the AI global default only. Its custom data is kept but ignored.' }}</p></div>
            <button @click="openAction('sync')" :disabled="actionBusy" class="self-start px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">{{ isOrg ? 'Apply to all tenants' : 'Sync from AI Global Default' }}</button>
          </div>
          <div class="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
            <div><p class="text-sm font-medium text-gray-800">Reset</p><p class="text-[12px] text-gray-500 mt-0.5">{{ isOrg ? 'Deletes the organization-wide configuration.' : 'Deletes this tenant\'s custom data and points it back at Custom Organization.' }}</p></div>
            <button @click="openAction('reset')" :disabled="actionBusy" class="self-start px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50">Reset</button>
          </div>
          <div v-if="!isOrg" class="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
            <div><p class="text-sm font-medium text-gray-800">Promote to Custom Organization</p><p class="text-[12px] text-gray-500 mt-0.5">Copies this tenant's configuration up as the Custom Organization configuration, replacing it.</p></div>
            <button @click="openAction('promote')" :disabled="actionBusy" class="self-start px-4 py-2 border border-[#007C65] text-[#007C65] rounded-lg text-sm font-medium hover:bg-[#F0FDF4] disabled:opacity-50">Promote</button>
          </div>
          <div class="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
            <div><p class="text-sm font-medium text-gray-800">Export JSON</p><p class="text-[12px] text-gray-500 mt-0.5">{{ isOrg ? 'Downloads the organization-wide configuration.' : 'Downloads this tenant\'s configuration.' }}</p></div>
            <button @click="exportConfig" :disabled="actionBusy" class="self-start px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Export JSON</button>
          </div>
          <div class="border border-gray-100 rounded-lg p-4 flex flex-col gap-3">
            <div><p class="text-sm font-medium text-gray-800">Import JSON</p><p class="text-[12px] text-gray-500 mt-0.5">{{ isOrg ? 'Replaces the organization-wide configuration from a file.' : 'Replaces this tenant\'s configuration from a file.' }}</p></div>
            <button @click="importInput?.click()" :disabled="actionBusy" class="self-start px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Import JSON</button>
          </div>
          </div>
          <input ref="importInput" type="file" accept="application/json,.json" class="hidden" @change="onImportFile" />
          <p v-if="actionMessage" class="text-[13px] mt-4" :class="actionOk ? 'text-[#00896F]' : 'text-red-500'">{{ actionMessage }}</p>
          <ul v-if="actionSkipped.length" class="text-[12px] text-amber-700 mt-2 list-disc pl-5 max-h-24 overflow-y-auto">
            <li v-for="(item, i) in actionSkipped" :key="i">Skipped: {{ item }}</li>
          </ul>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="pendingAction" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div class="bg-white rounded-xl shadow-lg w-[440px] max-w-full p-6">
          <h3 class="text-[16px] font-semibold text-gray-900 mb-2">{{ actionText.title }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ actionText.body }}</p>
          <div class="flex justify-end gap-3">
            <button @click="pendingAction = null" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button @click="confirmAction" :disabled="actionBusy"
              :class="pendingAction.type === 'reset' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#00896F] hover:bg-[#00705a]'"
              class="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
              {{ actionBusy ? 'Working…' : actionText.confirm }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
  scope: { type: String, default: 'tenant' },
  tenants: { type: Array, default: () => [] },
  label: { type: String, default: '' },
})

const isOrg = computed(() => props.scope === 'organization')
const targetScope = computed(() => (isOrg.value ? 'organization' : 'tenant'))

const {
  getClientAi, toggleClientAi, updateClientAiEntitlements, getClientAiSettings, updateClientAiSettings,
  getClientAlertRuleOverrides, updateClientAlertRuleOverride, resetClientAlertRuleOverride,
  getClientDataLinkOverrides, updateClientDataLinkOverride, resetClientDataLinkOverride,
  exportClientAiConfig, runClientAiConfigAction,
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

const route = useRoute()
const router = useRouter()
const AI_TABS = { general: 'General', chat: 'Chat', alerts: 'AI Alerts' }
const activeAkeelSubTab = ref(AI_TABS[route.query.aitab] ?? 'General')
watch(activeAkeelSubTab, (tab) => {
  const key = Object.keys(AI_TABS).find((k) => AI_TABS[k] === tab)
  router.replace({ query: { ...route.query, aitab: key } })
})

const MODE_FLAG_NAMES = ['alerts_use_custom_settings', 'chat_use_custom_settings', 'chat_data_links_use_custom_settings']
const AKEEL_TAB_SETTING_NAMES = [...MODE_FLAG_NAMES, 'system_instructions_override']
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

const org = computed(() => ({ access: true, chat_mode: 'global', alerts_mode: 'global', ...(data.value.organization ?? {}) }))
const accessEnabled = computed(() => (isOrg.value ? !!org.value.access : !!data.value.ai_calling_enabled))
const switchFields = [
  { key: 'ai_chat_enabled', orgKey: 'chat_mode', label: 'AI Chat' },
  { key: 'ai_alerts_enabled', orgKey: 'alerts_mode', label: 'AI Alerts' },
]
const modeOptions = [
  { key: 'global', label: 'AI Global Default', help: 'Platform defaults only.' },
  { key: 'organization', label: 'Custom Organization', help: 'Organization-wide settings, falling back to the AI global default.' },
  { key: 'custom', label: 'Custom Tenant', help: "This tenant's own settings over the organization's." },
]
const modeState = ref(null)
const areaMode = (area) => modeState.value?.[area] ?? 'global'
const modeBusy = ref(false)
const modeMessage = ref('')
const modeOk = ref(true)

async function setMode(mode, area) {
  modeBusy.value = true
  modeMessage.value = ''
  try {
    await runClientAiConfigAction(props.tenantId, { action: 'mode', mode, area })
    modeState.value = { ...(modeState.value ?? {}), [area]: mode, ...(area === 'chat' ? { links: mode } : {}) }
    modeOk.value = true
    modeMessage.value = 'Updated.'
  } catch (e) {
    modeOk.value = false
    modeMessage.value = e?.data?.message ?? 'Failed to update.'
  } finally {
    modeBusy.value = false
  }
}

const showConfig = ref(false)
const otherTenants = computed(() => props.tenants.filter((t) => t.id !== props.tenantId))
const orgOverrideNotice = computed(() => {
  const o = org.value
  if (!o.access) return 'The organization AI access is off. It overrides this tenant, so AI stays off here even if the switches below are on.'
  const parts = []
  if (o.chat_mode === 'off') parts.push('chat')
  if (o.alerts_mode === 'off') parts.push('alerts')
  return parts.length ? `The organization has ${parts.join(' and ')} turned off. That overrides this tenant.` : ''
})

const entitlementBusy = ref(false)
const entitlementMessage = ref('')
const entitlementOk = ref(true)

function tenantSwitchOn(f) {
  const value = data.value[f.key]
  return value === null || value === undefined ? org.value[f.orgKey] !== 'off' : value
}

async function setOrgMode(orgKey, mode) {
  entitlementBusy.value = true
  entitlementMessage.value = ''
  try {
    const field = orgKey === 'chat_mode' ? 'ai_chat_mode' : 'ai_alerts_mode'
    const res = await updateClientAiEntitlements(props.tenantId, { [field]: mode }, 'organization')
    data.value.organization = { ...org.value, ...(res?.data ?? {}), [orgKey]: res?.data?.[orgKey] ?? mode }
    entitlementOk.value = true
    entitlementMessage.value = 'Updated.'
  } catch (e) {
    entitlementOk.value = false
    entitlementMessage.value = e?.data?.message ?? 'Failed to update.'
  } finally {
    entitlementBusy.value = false
  }
}

async function setTenantSwitch(field, value) {
  entitlementBusy.value = true
  entitlementMessage.value = ''
  try {
    const res = await updateClientAiEntitlements(props.tenantId, { [field]: value })
    data.value[field] = res?.data?.[field] ?? value
    entitlementOk.value = true
    entitlementMessage.value = 'Updated.'
  } catch (e) {
    entitlementOk.value = false
    entitlementMessage.value = e?.data?.message ?? 'Failed to update.'
  } finally {
    entitlementBusy.value = false
  }
}

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

function formatTokens(value) {
  const n = Number(value ?? 0)
  return n >= 1000000 ? `${(n / 1000000).toFixed(2)}M` : n.toLocaleString('en-US')
}

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
    const res = await getClientAi(props.tenantId, selectedRange.value, targetScope.value)
    data.value = res?.data ?? {}
  } catch {
    data.value = {}
  } finally {
    loading.value = false
  }
  try {
    const res = await getClientAiSettings(props.tenantId, targetScope.value)
    settings.value = res?.data ?? []
    modeState.value = res?.mode ?? null
  } catch {
    settings.value = []
  }
}

/** Range switch only needs the graph payload re-fetched, not the settings/kill-switch state. */
async function reloadGraph() {
  loading.value = true
  try {
    const res = await getClientAi(props.tenantId, selectedRange.value, targetScope.value)
    data.value = res?.data ?? {}
  } catch {
    data.value = {}
  } finally {
    loading.value = false
  }
}

function onToggleClick() {
  if (accessEnabled.value) {
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
    const res = await toggleClientAi(props.tenantId, accessEnabled.value ? togglePassword.value : undefined, targetScope.value)
    if (isOrg.value) {
      data.value.organization = { ...org.value, access: res?.data?.ai_access ?? !org.value.access }
    } else {
      data.value.ai_calling_enabled = res?.data?.ai_calling_enabled ?? !accessEnabled.value
    }
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
    const res = await getClientAlertRuleOverrides(props.tenantId, { page, per_page: alertRuleOverrides.perPage, search: alertRuleOverrides.search, domain: alertRuleOverrides.domain }, targetScope.value)
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
    const res = await getClientDataLinkOverrides(props.tenantId, { page, per_page: dataLinkOverrides.perPage, search: dataLinkOverrides.search, domain: dataLinkOverrides.domain }, targetScope.value)
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
  const body = {
    rag_prompt_instruction: r.rag_prompt_instruction,
    is_active: r.is_active,
    check_interval: r.check_interval,
    check_interval_hours: r.check_interval === 'hourly' ? r.check_interval_hours : null,
    check_interval_day: ['weekly', 'biweekly', 'monthly'].includes(r.check_interval) ? r.check_interval_day : null,
    check_interval_time: r.check_interval === 'daily' ? r.check_interval_time : null,
  }
  await updateClientAlertRuleOverride(props.tenantId, row.id, body, targetScope.value)
  await loadAlertRuleOverrides(alertRuleOverrides.meta.current_page)
}
async function resetAlertRuleOverride(row) {
  await resetClientAlertRuleOverride(props.tenantId, row.id, targetScope.value)
  await loadAlertRuleOverrides(alertRuleOverrides.meta.current_page)
}

async function saveDataLinkOverride(row) {
  await updateClientDataLinkOverride(props.tenantId, row.id, row.resolved, targetScope.value)
  await loadDataLinkOverrides(dataLinkOverrides.meta.current_page)
}
async function resetDataLinkOverride(row) {
  await resetClientDataLinkOverride(props.tenantId, row.id, targetScope.value)
  await loadDataLinkOverrides(dataLinkOverrides.meta.current_page)
}

async function saveSettings() {
  savingSettings.value = true
  settingsMessage.value = ''
  try {
    const payload = settings.value.filter((s) => !MODE_FLAG_NAMES.includes(s.name)).map((s) => ({ name: s.name, value: s.value }))
    await updateClientAiSettings(props.tenantId, payload, targetScope.value)
    settingsOk.value = true
    settingsMessage.value = 'Settings updated.'
  } catch (e) {
    settingsOk.value = false
    settingsMessage.value = e?.data?.message ?? 'Failed to update settings.'
  } finally {
    savingSettings.value = false
  }
}

const copySource = ref('')
const importInput = ref(null)
const pendingAction = ref(null)
const actionBusy = ref(false)
const actionMessage = ref('')
const actionOk = ref(true)
const actionSkipped = ref([])

const actionText = computed(() => {
  const p = pendingAction.value
  const where = isOrg.value ? 'every tenant of this organization' : 'this tenant'
  if (!p) return { title: '', body: '', confirm: '' }
  if (p.type === 'sync') return isOrg.value
    ? { title: 'Apply Custom Organization to all tenants?', body: 'Every tenant of this organization switches to Custom Organization. Their own custom data is kept but ignored.', confirm: 'Apply' }
    : { title: 'Sync from AI Global Default?', body: 'This tenant uses the AI global default only. Its custom data is kept but ignored.', confirm: 'Sync' }
  if (p.type === 'reset') return isOrg.value
    ? { title: 'Reset organization configuration?', body: 'The organization-wide chat and alert configuration is deleted. This cannot be undone.', confirm: 'Reset' }
    : { title: 'Reset this tenant?', body: 'The custom chat and alert data of this tenant is deleted and the tenant uses Custom Organization again. This cannot be undone.', confirm: 'Reset' }
  if (p.type === 'promote') return { title: 'Promote to Custom Organization?', body: "This tenant's configuration replaces the Custom Organization configuration used by every tenant on Custom Organization, and by Custom Tenant tenants for anything they haven't changed.", confirm: 'Promote' }
  if (p.type === 'copy') {
    const source = props.tenants.find((t) => String(t.id) === copySource.value)
    return { title: 'Copy configuration?', body: `Copies the chat and alert configuration of ${source?.name ?? 'the selected tenant'} (#${copySource.value}) onto this tenant, replacing its current custom data.`, confirm: 'Copy' }
  }
  return { title: 'Import configuration?', body: `Imports "${p.fileName}" into ${where}, replacing its current configuration. Unknown rules are skipped and listed.`, confirm: 'Import' }
})

function openAction(type) {
  pendingAction.value = { type }
}

async function confirmAction() {
  const p = pendingAction.value
  actionBusy.value = true
  actionMessage.value = ''
  actionSkipped.value = []
  try {
    const body = { action: p.type, scope: targetScope.value }
    if (p.type === 'copy') body.source_tenant_id = Number(copySource.value)
    if (p.type === 'import') body.config = p.config
    const res = await runClientAiConfigAction(props.tenantId, body)
    const reports = Object.values(res?.report ?? {})
    actionSkipped.value = [...new Set(reports.flatMap((r) => r?.skipped ?? []))]
    actionOk.value = true
    actionMessage.value = p.type === 'import' || p.type === 'copy' ? 'Configuration applied.' : 'Done.'
    pendingAction.value = null
    if (p.type === 'copy') copySource.value = ''
    if (!isOrg.value && ['copy', 'sync', 'reset'].includes(p.type)) modeState.value = null
    await load()
    await Promise.all([loadAlertRuleOverrides(), loadDataLinkOverrides()])
  } catch (e) {
    actionOk.value = false
    actionMessage.value = e?.data?.message ?? e?.data?.errors?.config?.[0] ?? 'The action failed.'
    pendingAction.value = null
  } finally {
    actionBusy.value = false
  }
}

async function exportConfig() {
  actionMessage.value = ''
  actionSkipped.value = []
  try {
    const res = await exportClientAiConfig(props.tenantId, targetScope.value)
    const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'taxaid-ai-config.json'
    a.click()
    URL.revokeObjectURL(url)
    actionOk.value = true
    actionMessage.value = 'Exported taxaid-ai-config.json.'
  } catch (e) {
    actionOk.value = false
    actionMessage.value = e?.data?.message ?? 'Export failed.'
  }
}

async function onImportFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  actionMessage.value = ''
  actionSkipped.value = []
  try {
    const config = JSON.parse(await file.text())
    if (config?.format !== 'taxaid.ai-config' || Number(config?.version) !== 1) {
      actionOk.value = false
      actionMessage.value = 'This is not a TaxAid AI configuration file (format taxaid.ai-config, version 1).'
      return
    }
    pendingAction.value = { type: 'import', config, fileName: file.name }
  } catch {
    actionOk.value = false
    actionMessage.value = 'The file is not valid JSON.'
  }
}

onMounted(() => {
  load()
  loadAlertRuleOverrides()
  loadDataLinkOverrides()
})
</script>
