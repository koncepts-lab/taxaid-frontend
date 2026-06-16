<template>
  <div class="bg-white p-6 rounded-2xl border border-[#A5E5D9] shadow-sm relative flex flex-col justify-between min-h-[140px]">
    <h3 class="text-gray-500 text-sm font-medium mb-4">Work Session Timer</h3>
    
    <div class="flex items-center gap-4 mt-auto">
      <span class="text-sm font-medium text-gray-900">Login:</span>
      
      <button 
        @click="toggleTimer"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-normal transition-colors text-white"
        :class="isTimerRunning ? 'bg-[#FF4D4D] hover:bg-red-600' : 'bg-[#FF4D4D] hover:bg-red-600'"
      >
        <svg v-if="!isTimerRunning" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
        {{ isTimerRunning ? 'End Session' : 'Start Session' }}
      </button>

      <div class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ isTimerRunning ? formattedTime : 'Not logged in' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps<{
  initialRunning?: boolean
}>()

const emit = defineEmits(['toggle'])

const isTimerRunning = ref(props.initialRunning || false)
const elapsedSeconds = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

const toggleTimer = () => {
  isTimerRunning.value = !isTimerRunning.value
  emit('toggle', isTimerRunning.value)
  
  if (isTimerRunning.value) {
    timerInterval = setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  } else {
    if (timerInterval) clearInterval(timerInterval)
    // Optional: reset or keep elapsed time? We'll just stop it.
  }
}

const formattedTime = computed(() => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  const s = elapsedSeconds.value % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
