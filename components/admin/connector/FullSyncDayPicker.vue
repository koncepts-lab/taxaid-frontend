<template>
  <div class="inline-block">
    <div @click="open = true"
         class="px-3 py-2 rounded-[8px] border border-[#04C18F33] bg-white flex items-center gap-2 cursor-pointer text-[14px] min-w-[180px]">
      <span>{{ summary }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 pointer-events-none ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="open = false">
        <div class="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-medium text-gray-900">Scheduled Full Sync</h3>
            <button @click="open = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="inline-flex items-center rounded-full border border-[#04C18F33] p-1 text-[13px] font-medium">
            <button v-for="opt in frequencies" :key="opt.value" @click="$emit('update:frequency', opt.value)"
                    class="px-4 py-1.5 rounded-full transition-colors"
                    :class="frequency === opt.value ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">
              {{ opt.label }}
            </button>
          </div>

          <!-- Weekly / Biweekly: a week-strip, like a mini calendar row -->
          <div v-if="frequency !== 'monthly'" class="flex gap-1.5">
            <button v-for="(name, idx) in weekdayShort" :key="idx" @click="pickDay(idx)"
                    class="w-11 h-11 rounded-[10px] border text-[13px] font-medium transition-colors"
                    :class="day === idx ? 'bg-[#00896F] text-white border-[#00896F]' : 'border-[#04C18F33] text-gray-600 hover:bg-gray-50'">
              {{ name }}
            </button>
          </div>

          <!-- Monthly: a calendar-grid of days, capped at 28 so it's valid every month -->
          <div v-else class="grid grid-cols-7 gap-1.5 max-w-[280px]">
            <button v-for="d in 28" :key="d" @click="pickDay(d)"
                    class="w-9 h-9 rounded-[8px] border text-[13px] font-medium transition-colors"
                    :class="day === d ? 'bg-[#00896F] text-white border-[#00896F]' : 'border-[#04C18F33] text-gray-600 hover:bg-gray-50'">
              {{ d }}
            </button>
          </div>

          <div class="flex justify-end">
            <button @click="open = false" class="text-[13px] text-white bg-[#00896F] hover:bg-[#00705a] rounded-md px-4 py-1.5">Done</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  frequency: { type: String, default: 'monthly' },
  day: { type: Number, default: 1 },
})
const emit = defineEmits(['update:frequency', 'update:day'])

const open = ref(false)

function pickDay(d) { emit('update:day', d) }

const frequencies = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
]
const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekdayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const summary = computed(() => {
  const freqLabel = frequencies.find(f => f.value === props.frequency)?.label ?? 'Monthly'
  if (props.frequency === 'monthly') return `${freqLabel} · Day ${props.day}`
  return `${freqLabel} · ${weekdayFull[props.day] ?? 'Sunday'}`
})
</script>
