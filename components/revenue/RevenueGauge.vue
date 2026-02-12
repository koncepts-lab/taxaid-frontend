<template>
  <div class="bg-primary-850 rounded-3xl p-8 text-white h-full flex flex-col items-center justify-between relative overflow-hidden">
    <!-- Header -->
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-lg font-medium">Target , Previous Year and Current</span>
        <span class="text-xs opacity-60">Values in AED Million</span>
      </div>
      <img src="/images/icons/expand-white.svg" alt="Expand" class="w-5 h-5 opacity-60 cursor-pointer" />
    </div>

    <!-- Gauge Area -->
    <div class="relative w-full mt-8 flex flex-col items-center">
      <div class="relative w-72 h-44">
        <svg class="w-full h-full" viewBox="0 0 200 120">
          <!-- Background Track -->
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" stroke-linecap="round" />
          
          <!-- Ticks -->
          <g>
            <circle v-for="i in 11" :key="i"
              :cx="100 + 95 * Math.cos((180 + (i-1)*18) * Math.PI / 180)"
              :cy="100 + 95 * Math.sin((180 + (i-1)*18) * Math.PI / 180)"
              r="1" fill="rgba(255,255,255,0.2)" />
          </g>

          <!-- Main Progress Path -->
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#03D9B0" stroke-width="12" stroke-linecap="round"
                stroke-dasharray="251.3" :stroke-dashoffset="251.3 * (1 - (progress / 100))" />

          <!-- Marker -->
          <circle :cx="100 + 80 * Math.cos((180 + progress * 1.8) * Math.PI / 180)"
                  :cy="100 + 80 * Math.sin((180 + progress * 1.8) * Math.PI / 180)"
                  r="6" fill="#fff" stroke="#03D9B0" stroke-width="4" />
        </svg>

        <!-- Center Value -->
        <div class="absolute inset-0 flex flex-col items-center justify-center mt-4">
          <span class="text-5xl font-bold">{{ progress }}%</span>
          <span class="text-xs opacity-60 mt-2">Target Achieved</span>
        </div>
      </div>
      
      <!-- Range Labels -->
      <div class="w-full flex justify-between px-4 -mt-2">
        <span class="text-xs opacity-40">0</span>
        <span class="text-xs opacity-40">100%</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="w-full grid grid-cols-3 gap-4 mt-auto pt-8 border-t border-white/5">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full bg-green-400"></div>
          <span class="text-[10px] opacity-60 whitespace-nowrap">Previous Year (13%)</span>
        </div>
        <div class="text-sm font-bold">AED 7.8M</div>
      </div>
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span class="text-[10px] opacity-60 whitespace-nowrap">Current (92%)</span>
        </div>
        <div class="text-sm font-bold">AED 7.8M</div>
      </div>
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full bg-emerald-700"></div>
          <span class="text-[10px] opacity-60 whitespace-nowrap">Target (100%)</span>
        </div>
        <div class="text-sm font-bold">AED 8.5M</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const progress = ref(0)
const targetValue = 92

onMounted(() => {
  setTimeout(() => {
    progress.value = targetValue
  }, 100)
})
</script>

<style scoped>
path {
  transition: stroke-dashoffset 1.5s ease-out;
}
</style>
