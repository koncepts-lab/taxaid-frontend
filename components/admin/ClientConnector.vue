<template>
  <div class="space-y-6 mt-4">

    <!-- Status strip -->
    <div class="border rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-[#E0F9F3] border-[#6FDBBF] text-[#101828]'">
      <div>
        <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#101828]'">Last Sync</h2>
        <p class="text-[14px] mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">{{ lastSyncText }}</p>
        <p v-if="schedule?.device_name" class="text-[13px] mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">Device: {{ schedule.device_name }}</p>
        <p v-if="schedule?.last_status_reason" class="text-[13px] mt-0.5 text-amber-500">{{ schedule.last_status_reason }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="schedule" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium"
          :class="schedule.connector_online
            ? (isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-[#D1FAE5] text-[#065F46]')
            : (isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500')">
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
    <div class="border rounded-[16px] shadow-sm p-6"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-200 text-[#101828]'">
      <h2 class="text-[16px] font-medium mb-4" :class="isDark ? 'text-white' : 'text-[#101828]'">Sync Schedule</h2>
      <p class="text-[13px] -mt-2 mb-4" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">Daily sync runs the current year only — use Force Sync below for previous years.</p>
      <div class="flex flex-wrap items-end gap-6">
        <div v-if="schedule?.is_grouped">
          <label class="block text-[14px] font-medium mb-2" :class="isDark ? 'text-white' : 'text-[#101828]'">Scheduled Sync Time (group-managed)</label>
          <p class="text-sm" :class="isDark ? 'text-white/80' : 'text-gray-700'">
            Cycle 1: {{ schedule.group_sync_time }} • Cycle 2 (catch-up): {{ schedule.group_cycle_2_time }}
          </p>
        </div>
        <label class="flex items-center gap-2 text-sm pb-2" :class="isDark ? 'text-white/80' : 'text-gray-700'">
          <input type="checkbox" v-model="form.enabled" class="accent-[#00896F]" /> Auto-sync enabled
        </label>
        <button @click="saveSchedule" :disabled="busy"
          class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          Save Schedule
        </button>
      </div>
    </div>

    <!-- Force sync with years + stop -->
    <div class="border rounded-[16px] shadow-sm p-6"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-200 text-[#101828]'">
      <h2 class="text-[16px] font-medium mb-1" :class="isDark ? 'text-white' : 'text-[#101828]'">Force Sync (Year Selection)</h2>
      <p class="text-[13px] mb-4" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">Trigger an immediate sync for the selected years, or stop a running one.</p>
      <div class="flex flex-wrap items-center gap-4">
        <label v-for="y in allYears" :key="y" class="flex items-center gap-1.5 text-sm" :class="isDark ? 'text-white/80' : 'text-gray-700'">
          <input type="checkbox" v-model="forceYears" :value="y" class="accent-[#00896F]" /> {{ y }}
        </label>
        <button @click="handleAdminSyncNow" :disabled="busy || !forceYears.length"
          class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          Start Force Sync
        </button>
        <button @click="handleStopSync" :disabled="busy"
          class="px-5 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          :class="isDark ? 'border-red-400/50 text-red-300 hover:bg-red-500/10' : 'border-red-300 text-red-600 hover:bg-red-50'">
          Stop Sync
        </button>
      </div>
    </div>

    <!-- Remote tools -->
    <div class="border rounded-[16px] shadow-sm p-6"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-200 text-[#101828]'">
      <h2 class="text-[16px] font-medium mb-4" :class="isDark ? 'text-white' : 'text-[#101828]'">Remote Tools</h2>
      <div class="flex flex-wrap items-center gap-4">
        <button @click="handleOpenSettings" :disabled="busy"
          class="px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          :class="isDark ? 'border-[#6FDBBF] text-[#6FDBBF] hover:bg-white/10' : 'border-[#6FDBBF] text-[#013E32] hover:bg-gray-50'">
          Open Connector Settings
        </button>
        <CommonSelectDropdown mode="select" size="sm" class="w-36" v-model="logType" :options="['all','auto_sync','tally_debug','activation','ui','errors']" :clearable="false" />
        <button @click="handleRequestLogs" :disabled="busy"
          class="px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          :class="isDark ? 'border-[#6FDBBF] text-[#6FDBBF] hover:bg-white/10' : 'border-[#6FDBBF] text-[#013E32] hover:bg-gray-50'">
          Request Logs
        </button>
        <button v-if="logRequestId" @click="handleDownloadLogs"
          class="text-[13px] font-medium underline underline-offset-2"
          :class="isDark ? 'text-[#04C18F]' : 'text-[#00896F]'">
          Download logs ({{ logRequestId.slice(0, 8) }}…)
        </button>
      </div>
    </div>

    <!-- Sync history -->
    <div class="border rounded-[16px] shadow-sm p-6"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-200 text-[#101828]'">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#101828]'">Sync History</h2>
        <button @click="loadHistory(historyMeta.current_page || 1)" :disabled="historyLoading"
          class="px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
          :class="isDark ? 'border-[#6FDBBF] text-[#6FDBBF] hover:bg-white/10' : 'border-[#6FDBBF] text-[#013E32] hover:bg-gray-50'">
          Refresh
        </button>
      </div>
      <div class="space-y-3 h-[320px] overflow-y-auto pr-1">
        <div v-if="!history.length" class="py-6 text-center text-sm" :class="isDark ? 'text-white/40' : 'text-gray-400'">No syncs yet.</div>
        <div v-for="h in history" :key="h.id" class="flex items-center justify-between p-3 border rounded-lg text-sm"
          :class="isDark ? 'border-white/10 bg-white/[0.02]' : 'border-[#6FDBBF]'">
          <div>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-[#101828]'">{{ new Date(h.created_at).toLocaleString() }}</span>
            <span :class="isDark ? 'text-white/60' : 'text-[#4A5565]'"> — {{ h.financial_year ?? '—' }}</span>
          </div>
          <div :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">{{ h.rows_added }} added • {{ h.rows_changed }} changed • {{ h.rows_removed }} removed</div>
        </div>
      </div>
      <CommonPaginationBar v-if="historyMeta.total > 0" :meta="historyMeta" :loading="historyLoading"
        @page-change="(p) => loadHistory(p)" @per-page-change="(pp) => { historyPerPage = pp; loadHistory(1) }" />
    </div>

    <!-- Company period -->
    <div class="border rounded-[16px] shadow-sm p-6"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-200 text-[#101828]'">
      <div class="flex items-center justify-between mb-1">
        <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#101828]'">Company Period</h2>
        <button v-if="!periodUnlocked" @click="periodUnlocked = true"
          class="px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors"
          :class="isDark ? 'border-[#6FDBBF] text-[#6FDBBF] hover:bg-white/10' : 'border-[#6FDBBF] text-[#013E32] hover:bg-gray-50'">
          Unlock to Edit
        </button>
      </div>
      <p class="text-[13px] mb-4" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">Set once from the initial sync — correct it here if the consultant got it wrong. Never changed automatically after that.</p>
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label class="block text-[13px] mb-1" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">From</label>
          <CommonDateField class="w-48" v-model="periodForm.from_date" :disabled="!periodUnlocked" allow-future />
        </div>
        <div>
          <label class="block text-[13px] mb-1" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">To</label>
          <CommonDateField class="w-48" v-model="periodForm.to_date" :disabled="!periodUnlocked" allow-future />
        </div>
        <button v-if="periodUnlocked" @click="handleSavePeriod" :disabled="busy"
          class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
          Save Period
        </button>
        <button v-if="periodUnlocked" @click="periodUnlocked = false"
          class="px-5 py-2.5 border rounded-lg text-sm font-medium transition-colors"
          :class="isDark ? 'border-white/20 text-white/70 hover:bg-white/10' : 'border-gray-300 text-gray-600 hover:bg-gray-50'">
          Cancel
        </button>
      </div>

      <div class="mt-4 pt-4 border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <p class="text-[13px] mb-3" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">
          Report Schedules — captured for later; Force Sync and admin Sync Now always run a full sync regardless of this. Only the daily auto-sync will respect it once the connector supports it.
        </p>
        <div class="space-y-3">
          <div v-for="report in reportScheduleList" :key="report.key" class="flex items-center justify-between max-w-sm">
            <span class="text-[14px] font-medium" :class="isDark ? 'text-[#04C18F]' : 'text-[#00896F]'">{{ report.label }}</span>
            <AdminConnectorFullSyncDayPicker
              v-if="periodUnlocked"
              :frequency="periodForm.report_schedules[report.key]?.frequency ?? 'daily'"
              :day="periodForm.report_schedules[report.key]?.day ?? 1"
              @update:frequency="v => setReportSchedule(report.key, v, periodForm.report_schedules[report.key]?.day)"
              @update:day="v => setReportSchedule(report.key, periodForm.report_schedules[report.key]?.frequency ?? 'daily', v)"
            />
            <span v-else class="text-[13px] capitalize" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ periodForm.report_schedules[report.key]?.frequency ?? 'daily' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Backup + TaxAid Connector activation (Super Admin / Review Manager) -->
    <div class="grid gap-6" :class="licenseId ? 'md:grid-cols-2' : ''">
      <div class="border rounded-[16px] shadow-sm p-6"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-200 text-[#101828]'">
        <h2 class="text-[16px] font-medium mb-1" :class="isDark ? 'text-white' : 'text-[#101828]'">System Backup</h2>
        <p class="text-[13px] mb-4" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">Export this client's data as a ZIP of CSV or JSON files.</p>
        <div class="flex flex-wrap items-center gap-4">
          <button @click="handleBackup('csv')" :disabled="backupBusy"
            class="px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            :class="isDark ? 'border-[#6FDBBF] text-[#6FDBBF] hover:bg-white/10' : 'border-[#6FDBBF] text-[#013E32] hover:bg-gray-50'">
            Export Backup (Excel)
          </button>
          <button @click="handleBackup('json')" :disabled="backupBusy"
            class="px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            :class="isDark ? 'border-[#6FDBBF] text-[#6FDBBF] hover:bg-white/10' : 'border-[#6FDBBF] text-[#013E32] hover:bg-gray-50'">
            Export Backup (JSON)
          </button>
          <span v-if="backupBusy" class="text-[13px]" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">Preparing backup ({{ latestBackup?.status ?? 'queued' }})... download starts automatically.</span>
          <button v-else-if="latestBackup?.status === 'ready'" @click="downloadBackup(props.tenantId, latestBackup.id)"
            class="text-[13px] font-medium underline underline-offset-2"
            :class="isDark ? 'text-[#04C18F]' : 'text-[#00896F]'">
            Download last backup ({{ latestBackup.format.toUpperCase() }})
          </button>
        </div>
      </div>

      <AdminConnectorActivationCard v-if="licenseId" :client-id="licenseId" />
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
  licenseId: { type: String, default: null },
})

const { isDark } = useTheme()

const {
  getSchedule, setSchedule, syncNow, adminSyncNow, stopSync,
  openSettings, requestLogs, downloadLogs, getSyncHistory,
  getCompanyPeriod, updateCompanyPeriod,
  requestBackup, getLatestBackup, downloadBackup,
} = useClientManagement()

const allYears = ['Current Year', 'PY 1', 'PY 2', 'PY 3']

const schedule = ref(null)
const history = ref([])
const historyMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const historyPerPage = ref(10)
const historyLoading = ref(false)
const form = ref({ enabled: true })
const forceYears = ref(['Current Year'])
const logType = ref('all')
const logRequestId = ref(null)
const latestBackup = ref(null)
const periodUnlocked = ref(false)
const periodForm = ref({ from_date: '', to_date: '', report_schedules: {} })

// TODO(connector): not read by the connector yet.
const reportScheduleList = [
  { key: 'tb_365', label: 'TB 365' },
  { key: 'pl_from_erp', label: 'PL from ERP' },
  { key: 'bs_from_erp', label: 'BS from ERP' },
  { key: 'ar_report', label: 'AR report' },
  { key: 'ap_report', label: 'AP report' },
  { key: 'cost_center', label: 'Cost center' },
  { key: 'general_ledger', label: 'General ledger' },
  { key: 'daybook', label: 'Daybook' },
]

function setReportSchedule(key, frequency, day) {
  periodForm.value.report_schedules = {
    ...periodForm.value.report_schedules,
    [key]: frequency === 'daily' ? { frequency } : { frequency, day },
  }
}

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
    form.value = { enabled: !!schedule.value.enabled }
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
  await loadPeriod()
}

async function loadPeriod() {
  try {
    const res = await getCompanyPeriod(props.tenantId)
    periodForm.value = {
      from_date: res.from_date ?? '',
      to_date: res.to_date ?? '',
      report_schedules: res.report_schedules ?? {},
    }
  } catch {
    periodForm.value = { from_date: '', to_date: '', report_schedules: {} }
  }
}

async function handleSavePeriod() {
  await run(() => updateCompanyPeriod(props.tenantId, {
    from_date: periodForm.value.from_date || undefined,
    to_date: periodForm.value.to_date || undefined,
    report_schedules: periodForm.value.report_schedules,
  }), 'Period saved.')
  periodUnlocked.value = false
  await loadPeriod()
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
    await downloadLogs(props.tenantId, logRequestId.value)
    logRequestId.value = null
  } catch (e) {
    if (e?.data?.status === 'expired') {
      logRequestId.value = null
      note('Log request expired — click Request Logs again.', false)
    } else {
      note('Logs not uploaded yet — try again in a moment.', false)
    }
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
