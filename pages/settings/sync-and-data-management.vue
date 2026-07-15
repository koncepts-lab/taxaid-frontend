<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20 ">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]">Sync & Data Management</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage your data synchronization and exports</p>
      </div>

      <div class="space-y-6">

        <!-- Automatic Sync -->
        <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-[16px] font-medium text-[#101828]">Automatic Sync</h2>
              <p class="text-[14px] mt-0.5 text-[#4A5565]">Automatically synchronize your data</p>
            </div>
            <span v-if="status" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium shrink-0"
              :class="status.connector_online ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
              {{ status.connector_online ? 'Connector Online' : 'Connector Offline' }}
            </span>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-[#101828] mb-2">Sync Frequency</label>
            <div class="relative max-w-full">
              <input type="text" value="Daily" readonly
                class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] outline-none text-gray-700 text-sm bg-white cursor-default" />
            </div>
          </div>
        </div>

        <!-- Last Sync -->
        <div class="bg-[#E0F9F3] border border-[#6FDBBF] rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-[16px] font-medium text-[#101828]">Last Sync</h2>
            <p class="text-[14px] mt-0.5 text-[#4A5565]">{{ lastSyncText }}</p>
          </div>
          <button @click="handleSyncNow" :disabled="syncing"
            class="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" :class="syncing ? 'animate-spin' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            {{ syncing ? 'Requesting...' : 'Sync Now' }}
          </button>
        </div>
        <p v-if="syncMessage" class="text-[13px] -mt-3 px-1" :class="syncMessageOk ? 'text-[#00896F]' : 'text-red-500'">{{ syncMessage }}</p>

        <!-- Sync History -->
        <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-[16px] font-medium text-[#101828]">Sync History</h2>
          </div>

          <!-- 4 rows visible, then scroll -->
          <div class="space-y-4 overflow-y-auto pr-1" style="max-height: 356px;">
            <div v-if="loading" class="py-8 text-center text-gray-400 text-sm">Loading...</div>
            <div v-else-if="!history.length" class="py-8 text-center text-gray-400 text-sm">No syncs yet.</div>
            <div v-for="item in history" :key="item.id" class="flex items-center justify-between p-4 border border-[#6FDBBF] rounded-lg bg-white">
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full bg-[#E0F9F3] flex items-center justify-center text-[#00896F] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-[14px] font-medium text-[#101828]">{{ historyDate(item.created_at) }}</h3>
                  <p class="text-[13px] text-[#4A5565]">{{ historyDetails(item) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Backup -->
        <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden p-6">
          <h2 class="text-[16px] font-medium text-[#101828]">System Backup</h2>
          <p class="text-[14px] mt-0.5 text-[#4A5565] mb-6">Download all your data in CSV or JSON format</p>

          <div class="flex flex-wrap items-center gap-4">
            <button @click="requestBackup('csv')" :disabled="backupBusy"
              class="flex items-center gap-2 px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Backup (CSV)
            </button>
            <button @click="requestBackup('json')" :disabled="backupBusy"
              class="flex items-center gap-2 px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Backup (JSON)
            </button>

            <span v-if="backupBusy" class="text-[13px] text-[#4A5565] flex items-center gap-2">
              <svg class="animate-spin w-4 h-4 text-[#00896F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Preparing backup ({{ backup?.status ?? 'queued' }})... download starts automatically.
            </span>
            <button v-else-if="backup?.status === 'ready'" @click="downloadBackup(backup.id)"
              class="text-[13px] text-[#00896F] font-medium underline underline-offset-2">
              Download last backup ({{ backup.format.toUpperCase() }}, {{ formatSize(backup.file_size) }})
            </button>
          </div>
        </div>

        <p v-if="error" class="text-[13px] text-red-500 px-1">{{ error }}</p>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'

const {
  status, history, backup,
  loading, syncing, backupBusy, error,
  load, fetchStatus, syncNow, requestBackup, downloadBackup, stopPolling,
} = useSyncSettings()

const syncMessage = ref('')
const syncMessageOk = ref(true)

const lastSyncText = computed(() => {
  if (!status.value?.last_sync_at) return 'Not synced yet'
  const d = new Date(status.value.last_sync_at)
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`
})

const historyDate = (iso) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

const historyDetails = (item) => {
  const time = new Date(item.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const parts = [time]
  if (item.financial_year) parts.push(item.financial_year)
  parts.push(`${item.rows_added} added • ${item.rows_changed} changed • ${item.rows_removed} removed`)
  return parts.join(' • ')
}

const formatSize = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const handleSyncNow = async () => {
  syncMessage.value = ''
  try {
    await syncNow()
    syncMessageOk.value = true
    syncMessage.value = 'Sync requested.'
    setTimeout(fetchStatus, 5000)
  } catch {
    syncMessageOk.value = false
    syncMessage.value = error.value ?? 'Failed to trigger sync.'
  }
}

onMounted(load)
onBeforeUnmount(stopPolling)
</script>
