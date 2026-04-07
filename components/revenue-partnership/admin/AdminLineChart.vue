<template>
  <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[24px] p-8 shadow-sm flex flex-col min-h-[400px] border transition-colors duration-300">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Licensing Report (Cost Breakdown)</h3>
      <div class="relative w-[180px] z-20">
        <!-- Dropdown Trigger -->
        <div @click="isLineChartFilterOpen = !isLineChartFilterOpen" 
             class="w-full h-[44px] px-4 border outline-none rounded-[12px] flex items-center justify-between cursor-pointer transition-all"
             :class="isLineChartFilterOpen 
                ? (isDark ? 'border-[#00BE8CBD] bg-[#001410] shadow-[0_0_0_1px_#00BE8CBD]' : 'border-[#00BE8CBD] bg-white shadow-[0_0_0_2px_rgba(0,190,140,0.1)]') 
                : (isDark ? 'border-[#00BE8CBD] bg-transparent' : 'border-[#00BE8CBD] bg-white')">
          <div class="flex items-center gap-2.5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" :class="isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ selectedLineChartPeriod }}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="[{ 'rotate-180': isLineChartFilterOpen }, isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Dropdown Menu -->
        <transition name="fade-slide">
          <div v-if="isLineChartFilterOpen"
               :class="isDark ? 'bg-[#001410] border-[#00BE8CBD]' : 'bg-white border-[#E5E7EB]'"
               class="absolute top-[calc(100%+8px)] left-0 w-full border rounded-[16px] shadow-xl py-2 px-2 flex flex-col gap-1.5 z-30">
            <button v-for="period in ['6 Months', '3 Months']" :key="period"
                    @click="selectedLineChartPeriod = period; isLineChartFilterOpen = false"
                    class="w-full text-left px-4 py-2.5 rounded-[12px] text-[14px] transition-all font-medium"
                    :class="selectedLineChartPeriod === period 
                      ? (isDark ? 'bg-[#00BE8CBD] text-white' : 'bg-[#E4FFF6] text-[#1a1a1a]') 
                      : (isDark ? 'bg-transparent text-white hover:bg-white/5' : 'bg-transparent text-[#1a1a1a] hover:bg-gray-50')">
              {{ period }}
            </button>
          </div>
        </transition>
      </div>
    </div>
    
    <div class="flex-grow flex flex-col justify-end w-full">
       <client-only>
           <apexchart type="line" height="280" :options="lineOptions" :series="lineSeries"></apexchart>
       </client-only>
    </div>
    
    <div class="flex items-center justify-center gap-6 mt-4">
      <div class="flex items-center gap-2"><img :src="'/images/icons/icon-01.svg'" class="w-4 h-4" alt="icon" /><span class="text-[14px] text-[#04C18F]">Total Cost</span></div>
      <div class="flex items-center gap-2"><img :src="'/images/icons/icon-02.svg'" class="w-4 h-4" alt="icon" /><span class="text-[14px] text-[#FB7554]">Hosting Cost</span></div>
      <div class="flex items-center gap-2"><img :src="'/images/icons/icon-03.svg'" class="w-4 h-4" alt="icon" /><span class="text-[14px] text-[#FFBC01]">AI Tokens</span></div>
    </div>

    <div :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#04C18F14] border-[#04C18F80]'" class="rounded-[12px] p-4 mt-8 flex items-start gap-2 border transition-all">
       <span class="text-[14px] font-medium" :class="isDark ? 'text-[#ccc]' : 'text-[#364153]'">Note:</span>
       <span class="text-[14px] font-regular" :class="isDark ? 'text-[#ccc]' : 'text-[#364153]'">Cost includes hosting infrastructure (60%) and AI token consumption (40%).</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

const isLineChartFilterOpen = ref(false)
const selectedLineChartPeriod = ref('6 Months')

const lineSeries = ref([
  { name: 'Total Cost', data: [5, 4.5, 6, 4.2, 8, 4.5] },
  { name: 'Hosting Cost', data: [2.5, 1.8, 3.7, 1.5, 4.5, 1.8] },
  { name: 'AI Tokens', data: [1.8, 1, 2.2, 1, 2.5, 1] }
])

const lineOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false }, dropShadow: { enabled: false } },
  colors: ['#04C18F', '#FB7554', '#FFBC01'],
  stroke: { width: 2, curve: 'smooth' },
  markers: { 
    size: 4, 
    colors: ['#fff'], 
    strokeColors: ['#04C18F', '#FB7554', '#FFBC01'], 
    strokeWidth: 2, 
    hover: { size: 6 } 
  },
  xaxis: { 
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
    axisBorder: { show: true, color: isDark.value ? '#374151' : '#9CA3AF' }, 
    axisTicks: { show: false },
    labels: {
      style: { colors: isDark.value ? '#fff' : '#1a1a1a', fontSize: '12px' }
    }
  },
  yaxis: { 
    title: { text: 'Values in AED Million', style: { color: isDark.value ? '#9CA3AF' : '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
    labels: { 
      style: { colors: isDark.value ? '#fff' : '#1a1a1a', fontSize: '12px' },
      formatter: (val) => {
        const num = Math.round(val);
        return num === 0 ? '0' : num + 'M';
      }
    },
    tickAmount: 4,
    min: 0,
    max: 8
  },
  grid: { strokeDashArray: 4, padding: { left: 20 }, xaxis: { lines: { show: true } }, borderColor: isDark.value ? '#374151' : '#E5E7EB' },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: isDark.value ? 'dark' : 'light',
    custom: function({series, seriesIndex, dataPointIndex, w}) {
      const category = w.globals.labels[dataPointIndex]
      const totalCost = series[0][dataPointIndex]
      const hostingCost = series[1][dataPointIndex]
      const aiTokens = series[2][dataPointIndex]

      return `
        <div class="${isDark.value ? 'bg-[#001410] border border-[#00BE8CBD]' : 'bg-[#E4FFF6]'} rounded-[12px] p-3 min-w-[150px]">
          <div class="${isDark.value ? 'text-white' : 'text-[#1a1a1a]'} text-[15px] mb-[10px] font-normal">${category}</div>
          <div class="flex flex-col gap-2">
            <div class="text-[#FB7554] text-[14px]">Hosting Cost: ${hostingCost.toString().replace('.', ',')}M</div>
            <div class="text-[#04C18F] text-[14px]">Total Cost: ${totalCost.toString().replace('.', ',')}M</div>
            <div class="text-[#FFBC01] text-[14px]">AI Tokens: ${aiTokens.toString().replace('.', ',')}M</div>
          </div>
        </div>
      `
    }
  }
}))
</script>
