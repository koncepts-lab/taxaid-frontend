<template>
  <div class="bg-white p-5 rounded-2xl border border-[#A5E5D9] shadow-sm flex flex-col gap-3 min-h-[140px]">
    <h3 class="text-[13px] font-semibold text-gray-700">Work Session Timer</h3>

    <!-- IDLE -->
    <template v-if="state === 'idle'">
      <p class="text-[13px] text-gray-400">Not clocked in today</p>
      <button @click="$emit('clockin')" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-[#00896F] text-white text-[13px] font-medium rounded-lg hover:bg-[#007A62] disabled:opacity-60 transition-colors w-fit shadow-sm">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Clock In
      </button>
    </template>

    <!-- RUNNING -->
    <template v-else-if="state === 'running'">
      <!-- Row 1: logged in + elapsed -->
      <div class="flex items-center justify-between">
        <div class="text-[13px] text-gray-700">
          <span class="font-semibold">Logged in at:</span>
          <span class="ml-1 text-gray-900">{{ loggedInAt }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-[13px]">
          <svg class="w-4 h-4 text-[#00896F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-mono font-semibold text-gray-900">{{ elapsedFormatted }}</span>
        </div>
      </div>

      <!-- Row 2: remaining -->
      <div class="flex items-center gap-2 text-[12px]" :class="remainingSeconds <= 0 ? 'text-[#00896F]' : 'text-gray-400'">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span v-if="remainingSeconds > 0">{{ remainingFormatted }} remaining until 8h</span>
        <span v-else class="font-medium">8 hours completed — ready to clock out</span>
      </div>

      <!-- Row 3: Clock Out -->
      <button @click="$emit('clockout')" :disabled="loading"
        class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 transition-colors w-fit">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Clock Out
      </button>
    </template>

    <!-- ENDED -->
    <template v-else-if="state === 'ended'">
      <div class="text-[13px] text-gray-600 space-y-0.5">
        <div><span class="font-semibold">Clocked in:</span> <span>{{ firstClockedInAt }}</span></div>
        <div><span class="font-semibold">Clocked out:</span> <span>{{ loggedOutAt }}</span></div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-[13px] text-[#00896F] font-medium">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Total worked: {{ totalWorkedFormatted }}
        </div>
        <button @click="$emit('clockin')" :disabled="loading"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-[#00896F] text-white text-[12px] font-medium rounded-lg hover:bg-[#007A62] disabled:opacity-60 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Clock In Again
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { WorkSession } from '~/composables/admin/useActivityTracking'

const props = defineProps<{
  session?: WorkSession | null
  loading?: boolean
}>()

defineEmits<{ clockin: []; clockout: [] }>()

const tick = ref(0)
let interval: ReturnType<typeof setInterval> | null = null
onMounted(() => { interval = setInterval(() => tick.value++, 1000) })
onUnmounted(() => { if (interval) clearInterval(interval) })

const state = computed(() => {
  const s = props.session
  if (!s) return 'idle'
  if (s.checked_out_at) return 'ended'
  if (s.checked_in_at) return 'running'
  return 'idle'
})

const currentSegmentMs = computed(() => {
  tick.value
  if (state.value !== 'running' || !props.session?.checked_in_at) return 0
  return Math.max(0, Date.now() - new Date(props.session.checked_in_at).getTime())
})

// Total elapsed = already-accumulated seconds + current segment
const elapsedSeconds  = computed(() =>
  (props.session?.total_worked_seconds ?? 0) + Math.floor(currentSegmentMs.value / 1000)
)
const EIGHT_HOURS_SEC = 8 * 3600
const remainingSeconds = computed(() => Math.max(0, EIGHT_HOURS_SEC - elapsedSeconds.value))

const elapsedFormatted = computed(() => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
})

const remainingFormatted = computed(() => {
  const h = Math.floor(remainingSeconds.value / 3600)
  const m = Math.floor((remainingSeconds.value % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
})

function fmtTime(dt: string): string {
  return new Date(dt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
}

const firstClockedInAt = computed(() => props.session?.first_clocked_in_at ? fmtTime(props.session.first_clocked_in_at) : '—')
const loggedInAt       = computed(() => props.session?.checked_in_at       ? fmtTime(props.session.checked_in_at)       : '—')
const loggedOutAt      = computed(() => props.session?.checked_out_at      ? fmtTime(props.session.checked_out_at)      : '—')

const totalWorkedFormatted = computed(() => {
  if (!props.session?.first_clocked_in_at || !props.session?.checked_out_at) return '—'
  const ms   = new Date(props.session.checked_out_at).getTime() - new Date(props.session.first_clocked_in_at).getTime()
  const secs = Math.floor(ms / 1000)
  return `${Math.floor(secs / 3600)}h ${String(Math.floor((secs % 3600) / 60)).padStart(2, '0')}m`
})
</script>
