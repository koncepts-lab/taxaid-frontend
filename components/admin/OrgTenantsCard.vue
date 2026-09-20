<template>
  <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100">
      <h2 class="text-[16px] font-medium text-[#101828]">
        Organization Management
        <span v-if="org" class="text-[#4A5565] font-normal">— {{ org.name }} ({{ org.id }})</span>
      </h2>
      <p class="text-[13px] text-[#4A5565] mt-0.5">Every tenant of this organization. Open a tenant's configuration (connector and AI), or suspend a live tenant and unsuspend a suspended one here.</p>
    </div>

    <p v-if="error" class="px-6 pt-3 text-[13px] text-red-500">{{ error }}</p>

    <div class="w-full overflow-x-auto">
      <div class="min-w-[1210px]" :style="{ minHeight: `${48 + fixedRows * 60}px` }">
        <div class="grid grid-cols-[1.3fr_80px_1.1fr_170px_230px_110px_250px] h-[48px] items-center text-sm font-medium bg-[#008865] text-white">
          <div class="px-6">Tenant name</div>
          <div class="px-4 whitespace-nowrap">Tenant ID</div>
          <div class="px-4 whitespace-nowrap">TaxAid ID</div>
          <div class="px-4">Connector</div>
          <div class="px-4">AI</div>
          <div class="px-4">Status</div>
          <div class="px-4 text-center">Action</div>
        </div>

        <template v-if="loading">
          <div v-for="n in fixedRows" :key="n" class="grid grid-cols-[1.3fr_80px_1.1fr_170px_230px_110px_250px] h-[60px] items-center border-b border-gray-100">
            <div class="px-6"><div class="skeleton h-4 w-40 rounded"></div></div>
            <div class="px-4"><div class="skeleton h-4 w-10 rounded"></div></div>
            <div class="px-4"><div class="skeleton h-4 w-32 rounded"></div></div>
            <div class="px-4"><div class="skeleton h-5 w-24 rounded-full"></div></div>
            <div class="px-4"><div class="skeleton h-5 w-28 rounded-full"></div></div>
            <div class="px-4"><div class="skeleton h-6 w-20 rounded-full"></div></div>
            <div class="px-4 flex justify-center"><div class="skeleton h-8 w-32 rounded-md"></div></div>
          </div>
        </template>

        <template v-else>
          <div v-for="t in tenants" :key="t.id" class="grid grid-cols-[1.3fr_80px_1.1fr_170px_230px_110px_250px] h-[60px] items-center border-b border-gray-100 text-sm text-gray-700">
            <div class="px-6 font-medium text-gray-800 truncate">{{ t.name || '—' }}</div>
            <div class="px-4">{{ t.id }}</div>
            <div class="px-4 truncate">{{ t.license_id || '—' }}</div>
            <div class="px-4 min-w-0">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="connectorClass(t.connector_status)">{{ connectorLabel(t.connector_status) }}</span>
              <span class="block text-[11px] text-gray-400 truncate mt-0.5">{{ t.connector_last_seen_at ? 'Seen ' + new Date(t.connector_last_seen_at).toLocaleString() : 'Never seen' }}</span>
            </div>
            <div class="px-4 min-w-0">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="t.ai_calling_enabled ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-red-100 text-red-700'">{{ t.ai_calling_enabled ? 'Enabled' : 'Disabled' }}</span>
              <span class="block text-[11px] text-gray-500 mt-0.5 whitespace-nowrap cursor-default"
                @mouseenter="showAiTip($event, t)" @mouseleave="aiTip = null" @click="showAiTip($event, t)">Chat: {{ aiShort(t, 'chat') }} · Alerts: {{ aiShort(t, 'alerts') }}</span>
            </div>
            <div class="px-4">
              <span class="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium capitalize" :class="statusClass(t.status)">{{ t.status }}</span>
            </div>
            <div class="px-4 flex justify-center gap-2">
              <button @click="$emit('open-tenant', t.id)"
                class="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 border border-[#007C65] text-[#007C65] rounded-md text-[13px] font-medium hover:bg-[#F0FDF4] transition-colors">
                Configuration
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button v-if="t.status === 'suspended'" @click="target = { tenant: t, next: 'live' }" :disabled="busy"
                class="whitespace-nowrap px-3 py-1.5 bg-[#00896F] text-white rounded-md text-[13px] font-medium hover:bg-[#00705a] disabled:opacity-60">Unsuspend</button>
              <button v-else-if="t.status === 'live'" @click="target = { tenant: t, next: 'suspended' }" :disabled="busy"
                class="whitespace-nowrap px-3 py-1.5 border border-red-300 text-red-600 rounded-md text-[13px] font-medium hover:bg-red-50 disabled:opacity-60">Suspend</button>
            </div>
          </div>
          <div v-if="!tenants.length" class="py-10 text-center text-sm text-gray-400">No tenants found.</div>
        </template>
      </div>
    </div>

    <div class="min-h-[64px]">
      <CommonPaginationBar v-if="meta.total > 10" :meta="meta" :loading="loading"
        @page-change="(p) => load(p)" @per-page-change="() => {}" />
    </div>

    <div v-if="target" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-2">{{ target.next === 'live' ? 'Unsuspend tenant?' : 'Suspend tenant?' }}</h3>
        <p class="text-sm text-gray-500 mb-6">
          <span class="font-medium text-gray-700">{{ target.tenant.name }} (#{{ target.tenant.id }})</span><br>
          {{ target.next === 'live' ? 'The tenant will be set to live and regain full access.' : 'The tenant\'s users will lose access until unsuspended.' }}
        </p>
        <div class="flex justify-end gap-3">
          <button @click="target = null" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="apply" :disabled="busy"
            :class="target.next === 'live' ? 'bg-[#00896F] hover:bg-[#00705a]' : 'bg-red-600 hover:bg-red-700'"
            class="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ target.next === 'live' ? 'Unsuspend' : 'Suspend' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="aiTip" class="fixed z-[80] pointer-events-none rounded-md px-3 py-2 shadow-lg space-y-0.5 text-[12px] border"
      :class="isDark ? 'bg-[#1F2937] text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-200'"
      :style="{ left: aiTip.x + 'px', top: aiTip.y + 'px', maxWidth: 'min(340px, calc(100vw - 16px))', transform: aiTip.above ? 'translateY(-100%)' : 'none' }">
      <p v-for="l in aiTip.lines" :key="l">{{ l }}</p>
      <p class="pt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">G = AI Global Default · O = Custom Organization · T = Custom Tenant</p>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  organizationId: { type: Number, required: true },
})
const emit = defineEmits(['changed', 'open-tenant', 'loaded'])

const { getTenants, setTenantStatus } = useClientManagement()

const PAGE_SIZE = 10

const org = ref(null)
const tenants = ref([])
const meta = ref({ current_page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 })
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const target = ref(null)

const fixedRows = computed(() => (meta.value.total > 5 ? PAGE_SIZE : 5))

const statusClass = (status) => {
  if (status === 'live') return 'bg-[#D1FAE5] text-[#065F46]'
  if (status === 'suspended') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-50 text-blue-700'
}
const connectorLabel = (status) => (!status ? 'Not set up' : status === 'active' ? 'Connected' : status)
const connectorClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-500'
  return status === 'active' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-amber-100 text-amber-700'
}
const AI_MODE_LABELS = { global: 'AI Global Default', organization: 'Custom Organization', custom: 'Custom Tenant' }
const AI_MODE_LETTERS = { global: 'G', organization: 'O', custom: 'T' }
const aiShort = (t, area) => `${t.ai_effective?.[area]?.on ? 'on' : 'off'} (${AI_MODE_LETTERS[t.ai_modes?.[area]] ?? '?'})`
const { isDark } = useTheme()
const aiTip = ref(null)
function showAiTip(event, t) {
  const rect = event.currentTarget.getBoundingClientRect()
  const line = (name, area) => {
    const state = t.ai_effective?.[area]
    return `${name}: ${state?.on ? 'On' : 'Off'}${state && !state.on && state.reason ? ` — ${state.reason}` : ''} · uses ${AI_MODE_LABELS[t.ai_modes?.[area]] ?? 'unknown'}`
  }
  const width = Math.min(340, window.innerWidth - 16)
  const above = rect.bottom + 130 > window.innerHeight
  aiTip.value = {
    x: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
    y: above ? rect.top - 6 : rect.bottom + 6,
    above,
    lines: [line('Chat', 'chat'), line('Alerts', 'alerts')],
  }
}

async function load(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await getTenants({ organization_id: props.organizationId, page, per_page: PAGE_SIZE })
    tenants.value = res?.data ?? []
    meta.value = {
      current_page: res?.current_page ?? 1,
      per_page: res?.per_page ?? PAGE_SIZE,
      total: res?.total ?? 0,
      last_page: res?.last_page ?? 1,
    }
    const first = tenants.value[0]
    org.value = first ? { id: first.organization_id, name: first.organization_name } : org.value
    emit('loaded', tenants.value)
  } catch (e) {
    error.value = e?.data?.message ?? 'Failed to load organization.'
  } finally {
    loading.value = false
  }
}

async function apply() {
  busy.value = true
  error.value = ''
  try {
    await setTenantStatus(target.value.tenant.id, target.value.next)
    target.value = null
    await load(meta.value.current_page)
    emit('changed')
  } catch (e) {
    error.value = e?.data?.message ?? 'Failed to update status.'
    target.value = null
  } finally {
    busy.value = false
  }
}

onMounted(() => load(1))
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: org-shimmer 1.4s ease infinite;
}
@keyframes org-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
