<template>
  <!-- VM status badge → click opens detail modal -->
  <button @click="openModal" title="VM status (Reverb / Queue / Scheduler / Redis / DB)"
    :class="loading ? 'bg-white text-gray-400 border-gray-200' : online ? 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100' : 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100'"
    class="py-1.5 px-4 rounded-full border transition-colors flex items-center gap-2 text-[13px] font-medium whitespace-nowrap shadow-sm shrink-0 min-w-[190px] justify-center">
    <span v-if="!loading" :class="online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'" class="w-2 h-2 rounded-full shrink-0"></span>
    <div v-if="loading" class="flex items-center gap-1.5">
      <span>VM status :</span>
      <div class="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <span v-else>VM status : {{ online ? 'Live' : 'Offline' }}</span>
  </button>

  <!-- VM Status Modal -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[78vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <span :class="online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'" class="w-2.5 h-2.5 rounded-full"></span>
          <h2 class="text-[17px] font-semibold text-gray-900">VM Status — {{ online ? 'Live' : 'Down' }}</h2>
        </div>
        <div class="flex items-center gap-3">
          <button @click="load" :disabled="loading" class="bg-[#007C65] hover:bg-[#00695A] text-white text-[13px] font-medium rounded-full px-4 py-1.5 disabled:opacity-70 flex items-center justify-center min-w-[70px]">
            <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-else>Refresh</span>
          </button>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div class="px-6 py-4 overflow-y-auto space-y-4 text-sm">
        <div v-if="loading && !status" class="py-10 text-center text-gray-400">Loading…</div>

        <template v-else>
          <!-- 8 status tiles -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div :class="reverbRunning ? 'bg-gray-50' : 'bg-red-50/60'" class="rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Reverb</div><div :class="reverbRunning ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">{{ reverbRunning ? 'Running' : status?.data?.reverb ? 'Stopped' : 'Unreachable' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Latency</div><div class="font-semibold text-gray-800">{{ status?.data?.reverb?.latency_ms != null ? status.data.reverb.latency_ms + ' ms' : '—' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Service</div><div class="font-semibold text-gray-800">{{ status?.data?.reverb?.service ?? '—' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Queue</div><div :class="status?.data?.queue?.running ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">{{ status?.data?.queue?.service ?? '—' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Failed Jobs</div><div class="font-semibold text-gray-800">{{ status?.data?.queue?.failed_jobs ?? '—' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Scheduler</div><div :class="status?.data?.scheduler?.running ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">{{ status?.data?.scheduler?.service ?? '—' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">Redis</div><div :class="status?.data?.redis?.connected ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">{{ status?.data?.redis?.connected ? (status.data.redis.latency_ms + ' ms') : 'Down' }}</div></div>
            <div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-400 mb-1">DB</div><div :class="status?.data?.db?.connected ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">{{ status?.data?.db?.connected ? (status.data.db.latency_ms + ' ms') : 'Down' }}</div></div>
          </div>

          <!-- IPs (always shown) -->
          <div class="border border-gray-100 rounded-lg p-4">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Server IPs</div>
            <div class="flex flex-wrap gap-2">
              <span v-if="status?.data?.ips?.public" class="bg-[#F0FDF4] text-[#007C65] border border-emerald-100 rounded-md px-2.5 py-1 text-[13px] font-mono">{{ status.data.ips.public }} <span class="text-[10px] text-gray-400 font-sans">public</span></span>
              <span v-for="ip in (status?.data?.ips?.local ?? [])" :key="ip" class="bg-gray-50 text-gray-700 border border-gray-200 rounded-md px-2.5 py-1 text-[13px] font-mono">{{ ip }} <span class="text-[10px] text-gray-400 font-sans">local</span></span>
              <span v-if="!status?.data?.ips" class="text-gray-400 text-[13px]">Not available while the server is unreachable</span>
            </div>
          </div>

          <!-- VM details (always shown) -->
          <div class="border border-gray-100 rounded-lg p-4">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">VM Details</div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-[13px]">
              <div><span class="text-gray-400">Hostname:</span> {{ status?.data?.vm?.hostname ?? '—' }}</div>
              <div><span class="text-gray-400">OS:</span> {{ status?.data?.vm?.os ?? '—' }}</div>
              <div><span class="text-gray-400">Uptime:</span> {{ status?.data?.vm?.uptime ?? '—' }}</div>
              <div><span class="text-gray-400">CPU cores:</span> {{ status?.data?.vm?.cpu_cores ?? '—' }}</div>
              <div><span class="text-gray-400">Load (1m):</span> {{ status?.data?.vm?.load_avg?.['1m'] ?? '—' }}</div>
              <div><span class="text-gray-400">Memory:</span> {{ status?.data?.vm?.memory ? status.data.vm.memory.used_pct + '% of ' + status.data.vm.memory.total_mb + ' MB' : '—' }}</div>
              <div><span class="text-gray-400">Disk:</span> {{ status?.data?.vm?.disk ? status.data.vm.disk.used_pct + '% of ' + status.data.vm.disk.total_gb + ' GB' : '—' }}</div>
              <div><span class="text-gray-400">PHP:</span> {{ status?.data?.vm?.php_version ?? '—' }}</div>
              <div><span class="text-gray-400">Env:</span> {{ status?.data?.vm?.app_env ?? '—' }}</div>
            </div>
          </div>

          <!-- Logs, scoped by source -->
          <div class="border border-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Logs <span v-if="status?.data?.logs?.source" class="normal-case font-normal text-gray-400">({{ status.data.logs.source }})</span></div>
              <select v-model="logSource" @change="load" class="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600">
                <option value="system">System</option>
                <option value="reverb">Reverb</option>
                <option value="queue">Queue</option>
                <option value="scheduler">Scheduler</option>
              </select>
            </div>
            <pre v-if="status?.data?.logs?.lines?.length" class="bg-gray-900 text-gray-200 rounded-lg p-3 text-[11px] leading-relaxed max-h-56 overflow-auto whitespace-pre-wrap">{{ status.data.logs.lines.join('\n') }}</pre>
            <pre v-else class="bg-gray-900 rounded-lg p-3 text-[11px] leading-relaxed max-h-56 overflow-auto whitespace-pre-wrap"><span class="text-red-400">{{ status?.reason ?? (status?.data?.reverb?.error ? 'VM reachable but Reverb refused the connection: ' + status.data.reverb.error : 'No log data available') }}</span></pre>
          </div>
        </template>
      </div>

      <div class="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">Last checked: {{ status?.checked_at ? new Date(status.checked_at).toLocaleString() : '—' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdmin } from '~/composables/superadmin/useSuperAdmin'

const { getVmStatus } = useSuperAdmin()

const status = ref(null)
const loading = ref(true)
const showModal = ref(false)
const logSource = ref('system')
const online = computed(() => status.value?.online === true)
const reverbRunning = computed(() => status.value?.data?.reverb?.running === true)

async function load() {
  loading.value = true
  try {
    status.value = await getVmStatus(logSource.value)
  } catch (e) {
    status.value = { online: false, reason: 'Failed to reach backend' }
  } finally {
    loading.value = false
  }
}

function openModal() {
  showModal.value = true
  load()
}

onMounted(load)
</script>
