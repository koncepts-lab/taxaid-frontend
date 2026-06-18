import { ref, computed, onUnmounted } from 'vue'
import type { AdminAppointment } from './useAdminAppointments'

export type TimerState = 'idle' | 'running' | 'paused' | 'stopped'

function parseSessionTimestamp(s: string): number | null {
  // Backend serializeDate() strips time from datetime fields, returning "YYYY-MM-DD" only.
  // A date-only string parsed via new Date() becomes midnight UTC → huge elapsed on remount.
  // If no time component present, return null so the timer resets rather than shows garbage.
  const hasTime = s.includes('T') || s.includes(' ')
  if (!hasTime) return null
  const iso = s.includes('T') ? s : s.replace(' ', 'T') + 'Z'
  return new Date(iso).getTime()
}

export function useSessionTimer(appt: AdminAppointment) {
  const accumulated = appt.session_elapsed_seconds ?? 0
  const startedAt   = appt.session_started_at ? parseSessionTimestamp(appt.session_started_at) : null

  // Clock-based: wall-clock ms when the current segment began
  const segmentStartMs = ref<number | null>(startedAt)
  // Seconds accumulated before the current segment
  const baseSeconds    = ref(accumulated)

  const initialState: TimerState = startedAt
    ? 'running'
    : accumulated > 0 ? 'paused' : 'idle'

  const state          = ref<TimerState>(initialState)
  const elapsedSeconds = ref(
    startedAt
      ? accumulated + Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      : accumulated
  )

  let interval: ReturnType<typeof setInterval> | null = null

  const allocatedSeconds = computed(() => Math.round((appt.duration_hours ?? 1) * 3600))
  const progressPercent  = computed(() =>
    allocatedSeconds.value > 0
      ? Math.min(100, Math.round((elapsedSeconds.value / allocatedSeconds.value) * 100))
      : 0
  )
  const showOverAlert    = computed(() => progressPercent.value >= 90 && state.value === 'running')

  const formattedElapsed = computed(() => {
    const h = Math.floor(elapsedSeconds.value / 3600)
    const m = Math.floor((elapsedSeconds.value % 3600) / 60)
    const s = elapsedSeconds.value % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const remainingSeconds  = computed(() => Math.max(0, allocatedSeconds.value - elapsedSeconds.value))
  const formattedRemaining = computed(() => {
    const m = Math.floor(remainingSeconds.value / 60)
    const s = remainingSeconds.value % 60
    return `${m}m ${String(s).padStart(2, '0')}s`
  })

  function tick() {
    if (segmentStartMs.value !== null) {
      // Always derive from wall clock — immune to tab throttling
      elapsedSeconds.value = baseSeconds.value + Math.max(0, Math.floor((Date.now() - segmentStartMs.value) / 1000))
    }
  }

  function startTicking() {
    if (interval) clearInterval(interval)
    interval = setInterval(tick, 1000)
  }

  function stopTicking() {
    if (interval) { clearInterval(interval); interval = null }
  }

  if (state.value === 'running') startTicking()

  function onStarted() {
    baseSeconds.value    = elapsedSeconds.value
    segmentStartMs.value = Date.now()
    state.value          = 'running'
    startTicking()
  }

  function onPaused() {
    // Snapshot current elapsed before stopping
    tick()
    baseSeconds.value    = elapsedSeconds.value
    segmentStartMs.value = null
    stopTicking()
    state.value = 'paused'
  }

  function onStopped() {
    tick()
    baseSeconds.value    = elapsedSeconds.value
    segmentStartMs.value = null
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
