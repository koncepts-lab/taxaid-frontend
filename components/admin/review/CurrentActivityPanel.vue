<template>
  <div>
  <WorkSessionGuardModal :show="showGuard" @dismiss="showGuard = false" />
  <div class="bg-[#E8F8F4] border border-[#A5E5D9] rounded-xl p-6 mb-6">
    <h2 class="text-[15px] font-semibold text-[#004D40] mb-4">Current Activity</h2>

    <!-- Field Row -->
    <div class="grid grid-cols-5 gap-4 items-end mb-4">
      <!-- Time In -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Time In</label>
        <div class="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm min-h-[42px] flex items-center">
          <span :class="startedAt ? 'text-gray-800' : 'text-gray-300'">
            {{ startedAt ? fmtTime(startedAt) : '—' }}
          </span>
        </div>
      </div>

      <!-- Time Out -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Time Out</label>
        <div class="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm min-h-[42px] flex items-center">
          <span :class="stoppedAt ? 'text-gray-800' : 'text-gray-300'">
            {{ stoppedAt ? fmtTime(stoppedAt) : '—' }}
          </span>
        </div>
      </div>

      <!-- Type of Appointment -->
      <div class="relative">
        <label class="block text-xs font-medium text-gray-600 mb-1">Type of Appointment</label>
        <button @click="typeOpen = !typeOpen" type="button" :disabled="timerState !== 'idle'"
          class="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm hover:border-gray-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :class="form.appointment_type ? 'text-gray-800' : 'text-gray-400'">
          {{ selectedTypeLabel || 'Select Appointment Type' }}
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform" :class="typeOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <Transition name="dropdown">
          <div v-if="typeOpen" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <button v-for="opt in typeOptions" :key="opt.value"
              @click="selectType(opt.value)" type="button"
              class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#E8F8F4] transition-colors"
              :class="form.appointment_type === opt.value ? 'bg-[#E8F8F4] text-[#004D40] font-medium' : 'text-gray-700'">
              {{ opt.label }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Client ID -->
      <div class="relative">
        <label class="block text-xs font-medium text-gray-600 mb-1">Client ID</label>
        <button v-if="needsClient" @click="clientOpen = !clientOpen" type="button" :disabled="timerState !== 'idle'"
          class="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm hover:border-gray-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :class="form.tenant_id ? 'text-gray-800' : 'text-gray-400'">
          {{ form.tenant_id ? `C${String(form.tenant_id).padStart(3, '0')}` : 'Select Client Id' }}
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform" :class="clientOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-else class="bg-white border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-300 shadow-sm min-h-[42px] flex items-center">N/A</div>
        <Transition name="dropdown">
          <div v-if="clientOpen && needsClient" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
            <button v-for="c in clients" :key="c.id"
              @click="selectClient(c.id)" type="button"
              class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#E8F8F4] transition-colors"
              :class="form.tenant_id === c.id ? 'bg-[#E8F8F4] text-[#004D40] font-medium' : 'text-gray-700'">
              C{{ String(c.id).padStart(3, '0') }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Client Name -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Client Name</label>
        <input :value="clientName" readonly type="text" placeholder="Auto-filled"
          class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 shadow-sm placeholder-gray-300 cursor-default" />
      </div>
    </div>

    <!-- Timer Controls Row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Elapsed display -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-[#00896F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-mono text-base font-medium" :class="timerState === 'running' ? 'text-[#004D40]' : 'text-gray-400'">
            {{ formattedElapsed }}
          </span>
          <span v-if="timerState === 'paused'" class="text-xs text-amber-600 font-medium">Paused</span>
        </div>

        <!-- Start -->
        <button v-if="timerState === 'idle'" @click="start" type="button"
          class="flex items-center gap-2 px-4 py-2 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#007A62] transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Start
        </button>

        <!-- Pause / Resume -->
        <template v-if="timerState === 'running' || timerState === 'paused'">
          <button v-if="timerState === 'running'" @click="pause" type="button"
            class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Pause
          </button>
          <button v-else @click="resume" type="button"
            class="flex items-center gap-2 px-4 py-2 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#007A62] transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Resume
          </button>

          <!-- Stop -->
          <button @click="stop" :disabled="submitting" type="button"
            class="flex items-center gap-2 px-4 py-2 bg-[#FF4D4D] text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z"/>
            </svg>
            {{ submitting ? 'Saving...' : 'Stop & Save' }}
          </button>
        </template>
      </div>

      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useActivityTracking, type ActivityClient } from '~/composables/admin/useActivityTracking'
import WorkSessionGuardModal from './WorkSessionGuardModal.vue'

const props = defineProps<{
  clients: ActivityClient[]
}>()

const { session } = useActivityTracking()
const showGuard = ref(false)

function isSessionActive(): boolean {
  return !!session.value?.checked_in_at && !session.value?.checked_out_at
}

const emit = defineEmits<{
  save: [payload: object]
}>()

// ─── Form state ───────────────────────────────────────────────────────────────
const form = ref({ appointment_type: '', tenant_id: null as number | null })
const typeOpen   = ref(false)
const clientOpen = ref(false)
const error      = ref('')
const submitting = ref(false)

const typeOptions = [
  { value: 'client_fixed', label: 'Client Fixed' },
  { value: 'internal',     label: 'Internal' },
  { value: 'training',     label: 'Training' },
]

const needsClient      = computed(() => form.value.appointment_type === 'client_fixed')
const selectedTypeLabel = computed(() => typeOptions.find(o => o.value === form.value.appointment_type)?.label ?? '')
const clientName        = computed(() => props.clients.find(c => c.id === form.value.tenant_id)?.name ?? '')

function selectType(val: string) {
  form.value.appointment_type = val
  form.value.tenant_id        = null
  typeOpen.value              = false
}
function selectClient(id: number) {
  form.value.tenant_id = id
  clientOpen.value     = false
}

// ─── Timer state ─────────────────────────────────────────────────────────────
type TimerState = 'idle' | 'running' | 'paused'

const timerState  = ref<TimerState>('idle')
const startedAt   = ref<Date | null>(null)   // original start — becomes time_in
const stoppedAt   = ref<Date | null>(null)   // stop moment — for display only
const elapsedMs   = ref(0)                   // accumulated ms across pauses
const runStartMs  = ref(0)                   // Date.now() when current run began
const tick        = ref(0)
let   interval:   ReturnType<typeof setInterval> | null = null

const totalElapsedMs = computed(() => {
  tick.value // subscribe to tick
  if (timerState.value !== 'running') return elapsedMs.value
  return elapsedMs.value + (Date.now() - runStartMs.value)
})

const formattedElapsed = computed(() => {
  const s = Math.floor(totalElapsedMs.value / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`
})

function fmtTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
}

function toDatetimeStr(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ─── Controls ────────────────────────────────────────────────────────────────
function start() {
  error.value = ''

  if (!isSessionActive()) {
    showGuard.value = true
    return
  }

  if (!form.value.appointment_type) {
    error.value = 'Select appointment type before starting.'
    return
  }
  if (needsClient.value && !form.value.tenant_id) {
    error.value = 'Select a client before starting.'
    return
  }

  startedAt.value  = new Date()
  stoppedAt.value  = null
  elapsedMs.value  = 0
  runStartMs.value = Date.now()
  timerState.value = 'running'
  interval = setInterval(() => tick.value++, 1000)
}

function pause() {
  elapsedMs.value  += Date.now() - runStartMs.value
  timerState.value  = 'paused'
  if (interval) { clearInterval(interval); interval = null }
}

function resume() {
  runStartMs.value  = Date.now()
  timerState.value  = 'running'
  interval = setInterval(() => tick.value++, 1000)
}

async function stop() {
  if (interval) { clearInterval(interval); interval = null }

  // Accumulate any remaining run time
  if (timerState.value === 'running') {
    elapsedMs.value += Date.now() - runStartMs.value
  }
  timerState.value = 'idle'

  // Compute time_out = time_in + total elapsed
  const timeInDate  = startedAt.value!
  const timeOutDate = new Date(timeInDate.getTime() + elapsedMs.value)
  stoppedAt.value   = timeOutDate

  submitting.value = true
  try {
    const payload: any = {
      appointment_type: form.value.appointment_type,
      time_in:          toDatetimeStr(timeInDate),
      time_out:         toDatetimeStr(timeOutDate),
    }
    if (form.value.tenant_id) payload.tenant_id = form.value.tenant_id

    emit('save', payload)

    // Reset after a short display delay so user sees the final times
    setTimeout(reset, 1500)
  } finally {
    submitting.value = false
  }
}

function reset() {
  startedAt.value  = null
  stoppedAt.value  = null
  elapsedMs.value  = 0
  runStartMs.value = 0
  tick.value       = 0
  form.value       = { appointment_type: '', tenant_id: null }
}

onUnmounted(() => { if (interval) clearInterval(interval) })
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.dropdown-enter-from,
.dropdown-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
