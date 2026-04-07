<template>
  <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[24px] p-8 shadow-sm flex flex-col min-h-[400px] border transition-colors duration-300">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Revenue Report by Source</h3>
      <div class="relative w-[180px] z-20">
        <!-- Dropdown Trigger -->
        <div @click="isBarChartFilterOpen = !isBarChartFilterOpen" 
             class="w-full h-[44px] px-4 border outline-none rounded-[12px] flex items-center justify-between cursor-pointer transition-all"
             :class="isBarChartFilterOpen 
                ? (isDark ? 'border-[#00BE8CBD] bg-[#001410] shadow-[0_0_0_1px_#00BE8CBD]' : 'border-[#00BE8CBD] bg-white shadow-[0_0_0_2px_rgba(0,190,140,0.1)]') 
                : (isDark ? 'border-[#00BE8CBD] bg-transparent' : 'border-[#00BE8CBD] bg-white')">
          <div class="flex items-center gap-2.5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" :class="isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ selectedBarChartPeriod }}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="[{ 'rotate-180': isBarChartFilterOpen }, isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Dropdown Menu -->
        <transition name="fade-slide">
          <div v-if="isBarChartFilterOpen"
               :class="isDark ? 'bg-[#001410] border-[#00BE8CBD]' : 'bg-white border-[#E5E7EB]'"
               class="absolute top-[calc(100%+8px)] left-0 w-full border rounded-[16px] shadow-xl py-2 px-2 flex flex-col gap-1.5 z-30">
            <button v-for="period in ['6 Months', '3 Months']" :key="period"
                    @click="selectedBarChartPeriod = period; isBarChartFilterOpen = false"
                    class="w-full text-left px-4 py-2.5 rounded-[12px] text-[14px] transition-all font-medium"
                    :class="selectedBarChartPeriod === period 
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
           <apexchart type="bar" height="280" :options="barOptions" :series="barSeries"></apexchart>
       </client-only>
    </div>
    
    <div class="flex items-center justify-center gap-6 mt-4">
      <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#FFBC0D]"></div><span class="text-[14px] text-[#FFBC0D]">Revenue</span></div>
      <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#FF7B4F]"></div><span class="text-[14px] text-[#FF7B4F]">Cost</span></div>
      <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#04C18F]"></div><span class="text-[14px] text-[#04C18F]">Profit</span></div>
    </div>

    <div class="flex flex-wrap gap-4 mt-8 justify-start">
      <div :class="isDark ? 'bg-transparent border-white/15' : 'bg-[#F0fbf8] border-[#CCFBEF]'" class="rounded-[12px] p-4 text-center border w-full max-w-[200px] transition-all">
        <p class="text-[14px] mb-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">Partner</p>
        <h4 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">5</h4>
        <h4 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">clients</h4>
      </div>
      <div :class="isDark ? 'bg-transparent border-white/15' : 'bg-[#F0fbf8] border-[#CCFBEF]'" class="rounded-[12px] p-4 text-center border w-full max-w-[200px] transition-all">
        <p class="text-[14px] mb-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">Direct Customers</p>
        <h4 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">4</h4>
        <h4 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">clients</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

const isBarChartFilterOpen = ref(false)
const selectedBarChartPeriod = ref('6 Months')

const barSeries = ref([
 { name: 'Revenue', data: [5.2, 3] },
 { name: 'Cost', data: [2.2, 1.7] },
 { name: 'Profit', data: [4, 1.9] }
])

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  colors: ['#FFBC01', '#FB7554', '#04C18F'],
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } }
  },
  plotOptions: {
    bar: { 
      horizontal: false, 
      columnWidth: '43px', 
      borderRadius: 15, 
      borderRadiusApplication: 'around',
      dataLabels: { position: 'top' } 
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { 
    categories: ['Partner', 'Direct Customers'], 
    axisBorder: { show: true, color: isDark.value ? '#374151' : '#E5E7EB' }, 
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
        if (num === 0) return '0';
        if ([2, 4, 6].includes(num)) return num + 'M';
        return '';
      }
    },
    tickAmount: 6,
    min: 0,
    max: 6
  },
  fill: { opacity: 1 },
  grid: { strokeDashArray: 4, xaxis: { lines: { show: true } }, borderColor: isDark.value ? '#374151' : '#E5E7EB' },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: isDark.value ? 'dark' : 'light',
    custom: function({series, seriesIndex, dataPointIndex, w}) {
      const category = w.globals.labels[dataPointIndex]
      const revenue = series[0][dataPointIndex]
      const cost = series[1][dataPointIndex]
      const profit = series[2][dataPointIndex]

      return `
        <div class="${isDark.value ? 'bg-[#001410] border border-[#00BE8CBD]' : 'bg-[#E4FFF6]'} rounded-[12px] p-3 min-w-[150px]">
          <div class="${isDark.value ? 'text-white' : 'text-[#1a1a1a]'} text-[15px] mb-[10px] font-normal">${category}</div>
          <div class="flex flex-col gap-2">
            <div class="text-[#FB7554] text-[14px]">Cost: ${cost.toString().replace('.', ',')}M</div>
            <div class="text-[#04C18F] text-[14px]">Profit: ${profit.toString().replace('.', ',')}M</div>
            <div class="text-[#FFBC01] text-[14px]">Revenue: ${revenue.toString().replace('.', ',')}M</div>
          </div>
        </div>
      `
    }
  }
}))
</script>
