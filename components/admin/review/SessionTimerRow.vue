<template>
  <div class="flex items-center gap-2 flex-wrap">
    <WorkSessionGuardModal :show="showGuard" @dismiss="showGuard = false" />
    <!-- Idle: Start -->
    <template v-if="timer.state.value === 'idle'">
      <button
        @click="handleStart"
        :disabled="anyRunning"
        :title="anyRunning ? 'Another session is running. Please pause it first.' : ''"
        :class="anyRunning ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#00735d]'"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-[#00896F] text-white rounded-md text-[13px] font-medium"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.8A1 1 0 005 3.7v12.6a1 1 0 001.5.9l10-6.3a1 1 0 000-1.8l-10-6.3z"/></svg>
        Start
      </button>
    </template>

    <!-- Running: elapsed + Pause -->
    <template v-else-if="timer.state.value === 'running'">
      <span class="text-[13px] font-mono font-semibold text-[#00896F] min-w-[60px]">{{ timer.formattedElapsed.value }}</span>
      <button @click="handlePause" class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 bg-white text-[13px] font-medium">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5zm7 0h3v12h-3z"/></svg>
        Pause
      </button>
    </template>

    <!-- Paused: elapsed + Resume + Stop -->
    <template v-else-if="timer.state.value === 'paused'">
      <span class="text-[13px] font-mono text-gray-600 min-w-[60px]">{{ timer.formattedElapsed.value }}</span>
      <button
        @click="handleStart"
        :disabled="anyRunning"
        :title="anyRunning ? 'Another session is running. Please pause it first.' : ''"
        :class="anyRunning ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#00735d]'"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-[#00896F] text-white rounded-md text-[13px] font-medium"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.8A1 1 0 005 3.7v12.6a1 1 0 001.5.9l10-6.3a1 1 0 000-1.8l-10-6.3z"/></svg>
        Resume
      </button>
      <button @click="handleStop" class="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-md text-red-600 hover:bg-red-50 bg-white text-[13px] font-medium">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="1"/></svg>
        Stop
      </button>
    </template>

    <!-- Stopped: Mark Complete -->
    <template v-else-if="timer.state.value === 'stopped'">
      <span class="text-[13px] font-mono text-gray-600 min-w-[60px]">{{ timer.formattedElapsed.value }}</span>
      <button @click="$emit('complete')" class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 bg-white text-[13px] font-medium">
        <svg class="w-3.5 h-3.5 text-[#00896F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Mark as Completed
      </button>
    </template>

    <!-- 90% time alert -->
    <div v-if="showAlert" class="fixed inset-0 z-50 flex items-end justify-center pb-8 pointer-events-none">
      <div class="pointer-events-auto bg-white border border-[#F97316] rounded-xl shadow-xl px-5 py-4 flex items-start gap-3 max-w-sm">
        <svg class="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div>
          <p class="text-[13px] font-semibold text-[#F97316]">90% of allocated time reached</p>
          <p class="text-[12px] text-gray-600 mt-0.5">{{ timer.formattedRemaining.value }} remaining</p>
        </div>
        <button @click="dismissAlert = true" class="ml-auto text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AdminAppointment } from '~/composables/admin/review/useAdminAppointments'
import { useSessionTimer } from '~/composables/admin/review/useSessionTimer'
import { useActivityTracking } from '~/composables/admin/review/useActivityTracking'
import WorkSessionGuardModal from './WorkSessionGuardModal.vue'

const props = defineProps<{
  appointment: AdminAppointment
  anyRunning?: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'stop'): void
  (e: 'complete'): void
}>()

const { session } = useActivityTracking()
const showGuard   = ref(false)

function isWorkSessionRunning(): boolean {
  return !!session.value?.checked_in_at && !session.value?.checked_out_at
}

const timer        = useSessionTimer(props.appointment)
const dismissAlert = ref(false)
const showAlert    = computed(() => timer.showOverAlert.value && !dismissAlert.value)

function handleStart() {
  if (!isWorkSessionRunning()) {
    showGuard.value = true
    return
  }
  if (props.anyRunning) return
  emit('start')
  timer.onStarted()
}

function handlePause() {
  emit('pause')
  timer.onPaused()
}

function handleStop() {
  emit('stop')
  timer.onStopped()
}
</script>
