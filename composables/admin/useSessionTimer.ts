import { ref, computed, onUnmounted } from 'vue'
import type { AdminAppointment } from './useAdminAppointments'

export type TimerState = 'idle' | 'running' | 'paused' | 'stopped'

export function useSessionTimer(appt: AdminAppointment) {
  // Reconstruct base elapsed from server: accumulated + time since started_at (if running)
  const serverBase = (() => {
    let base = appt.session_elapsed_seconds ?? 0
    if (appt.session_started_at) {
      const startedAt = new Date(appt.session_started_at).getTime()
      base += Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
    }
    return Math.max(0, base)
  })()

  const elapsedSeconds = ref(serverBase)
  const state          = ref<TimerState>(appt.session_started_at ? 'running' : (appt.session_elapsed_seconds > 0 ? 'paused' : 'idle'))

  let interval: ReturnType<typeof setInterval> | null = null

  const allocatedSeconds = computed(() => Math.round((appt.duration_hours ?? 1) * 3600))

  const progressPercent = computed(() =>
    allocatedSeconds.value > 0
      ? Math.min(100, Math.round((elapsedSeconds.value / allocatedSeconds.value) * 100))
      : 0
  )

  const showOverAlert = computed(() => progressPercent.value >= 90 && state.value === 'running')

  const formattedElapsed = computed(() => {
    const h = Math.floor(elapsedSeconds.value / 3600)
    const m = Math.floor((elapsedSeconds.value % 3600) / 60)
    const s = elapsedSeconds.value % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const remainingSeconds = computed(() => Math.max(0, allocatedSeconds.value - elapsedSeconds.value))

  const formattedRemaining = computed(() => {
    const m = Math.floor(remainingSeconds.value / 60)
    const s = remainingSeconds.value % 60
    return `${m}m ${String(s).padStart(2, '0')}s`
  })

  function startTicking() {
    if (interval) return
    interval = setInterval(() => { elapsedSeconds.value++ }, 1000)
  }

  function stopTicking() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  // Auto-start ticking if session was already running on mount
  if (state.value === 'running') {
    startTicking()
  }

  function onStarted() {
    state.value = 'running'
    startTicking()
  }

  function onPaused() {
    stopTicking()
    state.value = 'paused'
  }

  function onStopped() {
    stopTicking()
    state.value = 'stopped'
  }

  onUnmounted(() => stopTicking())

  return {
    elapsedSeconds,
    formattedElapsed,
    formattedRemaining,
    progressPercent,
    showOverAlert,
    state,
    onStarted,
    onPaused,
    onStopped,
  }
}
