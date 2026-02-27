<template>
  <div
    :class="['historical-movement-card rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-sm', isDark ? '' : 'border border-[#EFEFEF]']"
    :style="isDark ? 'background: #00141080 !important' : ''"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-6 relative z-10 w-full" :class="isDark ? 'text-white' : 'text-[#000000]'">
      <div class="flex flex-col">
        <h2 class="text-[17px] font-medium leading-tight">{{ currentLang === 'ar' ? 'حركة حسابات القبض التاريخية' : 'AR balances historical movement' }}</h2>
        <p class="text-[13px] font-normal mt-1" :class="isDark ? 'text-white opacity-60' : 'text-[#00000091]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-6 text-[14px]">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="text-[13px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'رصيد حسابات القبض' : 'Account Receivable Balance' }}</span>
          </div>
        </div>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand" class="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer ml-4" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full relative z-10 min-h-[300px]">
      <ClientOnly>
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'حركة حسابات القبض التاريخية' : 'AR balances historical movement' }}</h2>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-6 text-[14px]">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
                  <span class="text-[13px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'رصيد حسابات القبض' : 'Account Receivable Balance' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 bg-white dark:bg-[#00141080]">
            <ClientOnly>
              <apexchart
                type="line"
                height="100%"
                :options="chartOptions"
                :series="series"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const series = ref([
  {
    name: 'AR Balance',
    data: [1.6, 3.2, 3.8, 4.3, 4.6, 4.8]
  },
  {
    name: 'Percentage',
    data: []
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'Noto Sans Arabic, sans-serif',
    zoom: { enabled: false },
    clip: false
  },
  stroke: {
    curve: 'smooth',
    width: [2, 0],
    colors: ['#FB7554', 'transparent']
  },
  colors: ['#FB7554', 'transparent'],
  grid: {
    borderColor: isDark.value ? '#FFFFFF0F' : '#EFEFEF',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 10, right: 10, bottom: 0, left: 10 }
  },
  markers: {
    size: [5, 0],
    colors: ['#FFFFFF', 'transparent'],
    strokeColors: ['#FFC107', 'transparent'],
    strokeWidth: 3,
    hover: { size: 7 }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    tickPlacement: 'between',
    axisBorder: { 
      show: true,
      color: isDark.value ? '#FFFFFF0F' : '#EFEFEF',
      height: 1
    },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: {
      style: {
        colors: isDark.value ? '#FFFFFF' : '#00000091',
        fontSize: '12px',
        fontWeight: 400
      }
    }
  },
  yaxis: [
    {
      min: 0,
      max: 5,
      tickAmount: 5,
      axisBorder: { 
        show: true,
        color: isDark.value ? '#FFFFFF0F' : '#EFEFEF',
        width: 1
      },
      labels: {
        style: {
          colors: isDark.value ? '#FFFFFF' : '#00000091',
          fontSize: '12px'
        },
        formatter: (val) => val === 0 ? '0' : val + 'M'
      }
    },
    {
      opposite: true,
      min: 0,
      max: 100,
      tickAmount: 5,
      axisBorder: { 
        show: true,
        color: isDark.value ? '#FFFFFF0F' : '#EFEFEF',
        width: 1
      },
      labels: {
        style: {
          colors: isDark.value ? '#FFFFFF' : '#00000091',
          fontSize: '12px'
        },
        formatter: (val) => val === 0 ? '0' : val + '%'
      }
    }
  ],
  legend: { show: false },
  tooltip: {
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const monthLabel = w.globals.categoryLabels[dataPointIndex]
      const bal = series[0][dataPointIndex]
      
      return `
        <div class="custom-tooltip">
          <div class="tooltip-header">${monthLabel}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${currentLang.value === 'ar' ? 'رصيد حسابات القبض' : 'AR Balance'}:</span>
              <span class="value">AED ${bal.toString().replace('.', ',')}M</span>
            </div>
          </div>
        </div>
      `
    }
  }
}))
</script>

<style scoped>
.historical-movement-card {
  background: #FFFFFF;
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.custom-tooltip) {
  background: #E2FFF3;
  padding: 12px 16px;
  border-radius: 14px;
  color: #1A1A1A;
  font-family: 'Noto Sans Arabic', sans-serif;
  min-width: 160px;
  border: none !important;
  box-shadow: none !important;
}

:deep(.tooltip-header) {
  font-weight: 400;
  font-size: 13px;
  margin-bottom: 4px;
  color: #1A1A1A;
}

:deep(.tooltip-body) {
  display: flex;
  flex-direction: column;
}

:deep(.tooltip-row) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

:deep(.tooltip-row .label) {
  color: #1A1A1A;
}

:deep(.tooltip-row .value) {
  color: #1A1A1A;
  font-weight: 400;
}
</style>
