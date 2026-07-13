<template>
  <div class="space-y-6 mt-4">

    <!-- Status strip -->
    <div class="bg-[#E0F9F3] border border-[#6FDBBF] rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-[16px] font-medium text-[#101828]">Last Sync</h2>
        <p class="text-[14px] mt-0.5 text-[#4A5565]">{{ lastSyncText }}</p>
        <p v-if="schedule?.last_status_reason" class="text-[13px] mt-0.5 text-amber-600">{{ schedule.last_status_reason }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="schedule" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium"
          :class="schedule.connector_online ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
          {{ schedule.connector_online ? 'Connector Online' : 'Connector Offline' }}
        </span>
        <button @click="handleSyncNow" :disabled="busy"
          class="flex items-center gap-2 px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          Sync Now
        </button>
      </div>
    </div>

    <!-- Schedule -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-4">Sync Schedule</h2>
      <p class="text-[13px] text-[#4A5565] -mt-2 mb-4">Daily sync runs the current year only — use Force Sync below for previous years.</p>
      <div class="flex flex-wrap items-end gap-6">
        <div>
          <label class="block text-[14px] font-medium text-[#101828] mb-2">Daily Sync Time</label>
          <input v-model="form.sync_time" type="time" step="60" required
            class="px-4 py-2 rounded-lg border border-[#04C18F80] focus:border-[#00896F] outline-none text-gray-700 text-sm bg-white cursor-pointer"
            @click="$event.target.showPicker && $event.target.showPicker()" />
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-700 pb-2">
          <input type="checkbox" v-model="form.enabled" class="accent-[#00896F]" /> Auto-sync enabled
        </label>
        <button @click="saveSchedule" :disabled="busy || !form.sync_time"
          class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          Save Schedule
        </button>
      </div>
    </div>

    <!-- Force sync with years + stop -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-1">Force Sync (Year Selection)</h2>
      <p class="text-[13px] text-[#4A5565] mb-4">Trigger an immediate sync for the selected years, or stop a running one.</p>
      <div class="flex flex-wrap items-center gap-4">
        <label v-for="y in allYears" :key="y" class="flex items-center gap-1.5 text-sm text-gray-700">
          <input type="checkbox" v-model="forceYears" :value="y" class="accent-[#00896F]" /> {{ y }}
        </label>
        <button @click="handleAdminSyncNow" :disabled="busy || !forceYears.length"
          class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          Start Force Sync
        </button>
        <button @click="handleStopSync" :disabled="busy"
          class="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60">
          Stop Sync
        </button>
      </div>
    </div>

    <!-- Remote tools -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-4">Remote Tools</h2>
      <div class="flex flex-wrap items-center gap-4">
        <button @click="handleOpenSettings" :disabled="busy"
          class="px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors disabled:opacity-60">
          Open Connector Settings
        </button>
        <select v-model="logType" class="px-4 py-2.5 rounded-lg border border-[#04C18F80] outline-none text-gray-700 text-sm bg-white">
          <option v-for="t in ['all','auto_sync','tally_debug','activation','ui','errors']" :key="t" :value="t">{{ t }}</option>
        </select>
        <button @click="handleRequestLogs" :disabled="busy"
          class="px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors disabled:opacity-60">
          Request Logs
        </button>
        <button v-if="logRequestId" @click="handleDownloadLogs"
          class="text-[13px] text-[#00896F] font-medium underline underline-offset-2">
          Download logs ({{ logRequestId.slice(0, 8) }}…)
        </button>
      </div>
    </div>

    <!-- Sync history -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-4">Sync History</h2>
      <div class="space-y-3">
        <div v-if="!history.length" class="py-6 text-center text-gray-400 text-sm">No syncs yet.</div>
        <div v-for="h in history" :key="h.id" class="flex items-center justify-between p-3 border border-[#6FDBBF] rounded-lg text-sm">
          <div>
            <span class="font-medium text-[#101828]">{{ new Date(h.created_at).toLocaleString() }}</span>
            <span class="text-[#4A5565]"> — {{ h.financial_year ?? '—' }}</span>
          </div>
          <div class="text-[#4A5565]">{{ h.rows_added }} added • {{ h.rows_changed }} changed • {{ h.rows_removed }} removed</div>
        </div>
      </div>
      <CommonPaginationBar v-if="historyMeta.total > 0" :meta="historyMeta" :loading="historyLoading"
        @page-change="(p) => loadHistory(p)" @per-page-change="(pp) => { historyPerPage = pp; loadHistory(1) }" />
    </div>

    <!-- Backup -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-1">System Backup</h2>
      <p class="text-[13px] text-[#4A5565] mb-4">Export this client's data as a ZIP of CSV or JSON files.</p>
      <div class="flex flex-wrap items-center gap-4">
        <button @click="handleBackup('csv')" :disabled="backupBusy"
          class="px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors disabled:opacity-60">
          Export Backup (CSV)
        </button>
        <button @click="handleBackup('json')" :disabled="backupBusy"
          class="px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors disabled:opacity-60">
          Export Backup (JSON)
        </button>
        <span v-if="backupBusy" class="text-[13px] text-[#4A5565]">Preparing backup ({{ latestBackup?.status ?? 'queued' }})... download starts automatically.</span>
        <button v-else-if="latestBackup?.status === 'ready'" @click="downloadBackup(props.tenantId, latestBackup.id)"
          class="text-[13px] text-[#00896F] font-medium underline underline-offset-2">
          Download last backup ({{ latestBackup.format.toUpperCase() }})
        </button>
      </div>
    </div>

    <p v-if="message" class="text-[13px] px-1" :class="messageOk ? 'text-[#00896F]' : 'text-red-500'">{{ message }}</p>
  </div>
</template>

<script setup>
// Admin connector controls for one tenant — used in the Client Management
// Configure page; reusable for the review-team side later.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
})

const {
  getSchedule, setSchedule, syncNow, adminSyncNow, stopSync,
  openSettings, requestLogs, downloadLogs, getSyncHistory,
  requestBackup, getLatestBackup, downloadBackup,
} = useClientManagement()

const allYears = ['Current Year', 'PY 1', 'PY 2', 'PY 3']

const schedule = ref(null)
const history = ref([])
const historyMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const historyPerPage = ref(10)
const historyLoading = ref(false)
const form = ref({ sync_time: '10:00', enabled: true })
const forceYears = ref(['Current Year'])
const logType = ref('all')
const logRequestId = ref(null)
const latestBackup = ref(null)

const busy = ref(false)
const backupBusy = ref(false)
const message = ref('')
const messageOk = ref(true)
let pollTimer = null

const lastSyncText = computed(() => {
  if (!schedule.value?.last_sync_at) return 'Not synced yet'
  const d = new Date(schedule.value.last_sync_at)
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()} — ${schedule.value.last_status}`
})

function note(msg, ok = true) {
  message.value = msg
  messageOk.value = ok
}

async function run(fn, okMsg) {
  busy.value = true
  message.value = ''
  try {
    const res = await fn()
    // Short inline confirmation — backend messages are too long for the UI
    note(okMsg)
    return res
  } catch (e) {
    note(e?.data?.error ?? e?.data?.message ?? 'Request failed.', false)
  } finally {
    busy.value = false
  }
}

async function load() {
  try {
    schedule.value = await getSchedule(props.tenantId)
    form.value = {
      sync_time: schedule.value.sync_time ?? '10:00',
      enabled: !!schedule.value.enabled,
    }
  } catch {
    schedule.value = null
  }
  await loadHistory(1)
  try {
    const res = await getLatestBackup(props.tenantId)
    latestBackup.value = res.backup ?? null
  } catch {
    latestBackup.value = null
  }
}

// Scheduled daily sync is current-year only; PYs go through Force Sync
async function loadHistory(page = 1) {
  historyLoading.value = true
  try {
    const res = await getSyncHistory(props.tenantId, page, historyPerPage.value)
    history.value = res.data ?? []
    historyMeta.value = {
      current_page: res.current_page ?? 1,
      per_page: res.per_page ?? historyPerPage.value,
      total: res.total ?? 0,
      last_page: res.last_page ?? 1,
    }
  } catch {
    history.value = []
  } finally {
    historyLoading.value = false
  }
}

const saveSchedule = () => run(
  () => setSchedule(props.tenantId, { ...form.value, years: ['Current Year'] }),
  'Saved.'
)
const handleSyncNow = () => run(() => syncNow(props.tenantId), 'Sync requested.')
const handleAdminSyncNow = () => run(() => adminSyncNow(props.tenantId, forceYears.value), 'Force sync started.')
const handleStopSync = () => run(() => stopSync(props.tenantId), 'Stop sent.')
const handleOpenSettings = () => run(() => openSettings(props.tenantId), 'Signal sent.')

async function handleRequestLogs() {
  const res = await run(() => requestLogs(props.tenantId, logType.value), 'Logs requested.')
  if (res?.request_id) logRequestId.value = res.request_id
}

async function handleDownloadLogs() {
  try {
    await downloadLogs(logRequestId.value)
    logRequestId.value = null
  } catch {
    note('Logs not uploaded yet — try again in a moment.', false)
  }
}

async function handleBackup(format) {
  backupBusy.value = true
  message.value = ''
  try {
    const res = await requestBackup(props.tenantId, format)
    latestBackup.value = res.backup
    pollBackup()
  } catch (e) {
    if (e?.status === 409 && e?.data?.backup) {
      latestBackup.value = e.data.backup
      pollBackup()
    } else {
      backupBusy.value = false
      note(e?.data?.message ?? 'Failed to request backup.', false)
    }
  }
}

function pollBackup() {
  clearTimeout(pollTimer)
  pollTimer = setTimeout(async () => {
    try {
      const res = await getLatestBackup(props.tenantId)
      latestBackup.value = res.backup ?? null
    } catch {}
    const s = latestBackup.value?.status
    if (s === 'queued' || s === 'processing') {
      pollBackup()
    } else {
      backupBusy.value = false
      if (s === 'ready') downloadBackup(props.tenantId, latestBackup.value.id)
      if (s === 'failed') note('Backup failed. Please try again.', false)
    }
  }, 4000)
}

onMounted(load)
onBeforeUnmount(() => clearTimeout(pollTimer))
</script>
