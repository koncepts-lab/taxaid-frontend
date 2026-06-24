<template>
  <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[24px] p-8 shadow-sm flex flex-col min-h-[400px] border transition-colors duration-300">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Licensing Report (Cost Breakdown)</h3>
      <div class="relative w-[180px] z-20">
        <div @click="isLineChartFilterOpen = !isLineChartFilterOpen"
             class="w-full h-[44px] px-4 border outline-none rounded-[12px] flex items-center justify-between cursor-pointer transition-all"
             :class="isLineChartFilterOpen
                ? (isDark ? 'border-[#00BE8CBD] bg-[#001410] shadow-[0_0_0_1px_#00BE8CBD]' : 'border-[#00BE8CBD] bg-white shadow-[0_0_0_2px_rgba(0,190,140,0.1)]')
                : (isDark ? 'border-[#00BE8CBD] bg-transparent' : 'border-[#00BE8CBD] bg-white')">
          <div class="flex items-center gap-2.5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" :class="isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            {{ selectedLineChartPeriod }}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="[{ 'rotate-180': isLineChartFilterOpen }, isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

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
        <!-- Only render chart when there is data -->
        <apexchart v-if="filteredCost.length" type="line" height="280" :options="lineOptions" :series="lineSeries"></apexchart>
        <div v-else class="flex flex-col items-center justify-center h-[280px] gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" :class="isDark ? 'text-white/20' : 'text-gray-200'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <p class="text-[14px]" :class="isDark ? 'text-white/40' : 'text-gray-400'">No data yet — chart will populate as monthly reports are uploaded</p>
        </div>
      </client-only>
    </div>

    <div class="flex items-center justify-center gap-6 mt-4">
      <div class="flex items-center gap-2"><img :src="'/images/icons/icon-01.svg'" class="w-4 h-4" alt="icon" /><span class="text-[14px] text-[#04C18F]">Total Cost</span></div>
      <div class="flex items-center gap-2"><img :src="'/images/icons/icon-02.svg'" class="w-4 h-4" alt="icon" /><span class="text-[14px] text-[#FB7554]">Hosting Cost</span></div>
      <div class="flex items-center gap-2"><img :src="'/images/icons/icon-03.svg'" class="w-4 h-4" alt="icon" /><span class="text-[14px] text-[#FFBC01]">AI Tokens</span></div>
    </div>

    <div :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#04C18F14] border-[#04C18F80]'" class="rounded-[12px] p-4 mt-8 flex items-start gap-2 border transition-all">
      <span class="text-[14px] font-medium" :class="isDark ? 'text-[#ccc]' : 'text-[#364153]'">Note:</span>
      <span class="text-[14px]" :class="isDark ? 'text-[#ccc]' : 'text-[#364153]'">Cost includes hosting infrastructure and AI token consumption. Chart grows as monthly reports are uploaded.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

const props = defineProps({
  costData: { type: Array, default: () => [] },
})

const isLineChartFilterOpen   = ref(false)
const selectedLineChartPeriod = ref('6 Months')

// Only include months that have actual data
const dataWithValues = computed(() =>
  props.costData.filter(d => (d.hosting_aed ?? 0) + (d.ai_aed ?? 0) > 0)
)

const filteredCost = computed(() => {
  const n = selectedLineChartPeriod.value === '3 Months' ? 3 : 6
  return dataWithValues.value.slice(-n)
})

const monthLabel = (monthStr) => {
  const [year, month] = monthStr.split('-')
  return new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })
}

const fmt = (val) => {
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + 'M'
  if (val >= 1_000)     return (val / 1_000).toFixed(1) + 'K'
  return Math.round(val).toString()
}

const lineSeries = computed(() => [
  { name: 'Total Cost',   data: filteredCost.value.map(d => Math.round((d.hosting_aed ?? 0) + (d.ai_aed ?? 0))) },
  { name: 'Hosting Cost', data: filteredCost.value.map(d => Math.round(d.hosting_aed ?? 0)) },
  { name: 'AI Tokens',    data: filteredCost.value.map(d => Math.round(d.ai_aed ?? 0)) },
])

const lineOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false }, dropShadow: { enabled: false } },
  colors: ['#04C18F', '#FB7554', '#FFBC01'],
  stroke: { width: 2, curve: 'smooth' },
  markers: {
    size: filteredCost.value.length === 1 ? 6 : 4,
    colors: ['#fff'],
    strokeColors: ['#04C18F', '#FB7554', '#FFBC01'],
    strokeWidth: 2,
    hover: { size: 7 },
  },
  xaxis: {
    categories: filteredCost.value.map(d => monthLabel(d.month)),
    axisBorder: { show: true, color: isDark.value ? '#374151' : '#9CA3AF' },
    axisTicks: { show: false },
    labels: { style: { colors: isDark.value ? '#fff' : '#1a1a1a', fontSize: '12px' } },
  },
  yaxis: {
    title: { text: 'AED', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
    labels: {
      style: { colors: isDark.value ? '#fff' : '#1a1a1a', fontSize: '12px' },
      formatter: fmt,
    },
  },
  grid: { strokeDashArray: 4, padding: { left: 20 }, xaxis: { lines: { show: true } }, borderColor: isDark.value ? '#374151' : '#E5E7EB' },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: isDark.value ? 'dark' : 'light',
    custom: ({ series, dataPointIndex, w }) => {
      const category    = w.globals.labels[dataPointIndex]
      const totalCost   = fmt(series[0][dataPointIndex])
      const hostingCost = fmt(series[1][dataPointIndex])
      const aiTokens    = fmt(series[2][dataPointIndex])
      return `
        <div class="${isDark.value ? 'bg-[#001410] border border-[#00BE8CBD]' : 'bg-[#E4FFF6]'} rounded-[12px] p-3 min-w-[150px]">
          <div class="${isDark.value ? 'text-white' : 'text-[#1a1a1a]'} text-[15px] mb-[10px] font-normal">${category}</div>
          <div class="flex flex-col gap-2">
            <div class="text-[#04C18F] text-[14px]">Total Cost: ${totalCost}</div>
            <div class="text-[#FB7554] text-[14px]">Hosting: ${hostingCost}</div>
            <div class="text-[#FFBC01] text-[14px]">AI Tokens: ${aiTokens}</div>
          </div>
        </div>
      `
    },
  },
}))
</script>
