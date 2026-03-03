<template>
  <div class="revenue-trend-card rounded-[20px] p-8 text-white h-full flex flex-col relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-md"
    :class="{ 'dark-mode': isDark }">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6 w-full z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight">{{ currentLang === 'ar' ? 'آخر 6 أشهر إلى السنة السابقة' : 'Last 6 months to Previous year' }}</h2>
        <p class="text-[12px] opacity-70 font-regular mt-1">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-6 text-[14px]">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FF582F]"></div>
            <span class="opacity-90 text-[12px] font-regular">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#00FFBC]"></div>
            <span class="opacity-90 text-[12px] font-regular">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
          </div>
        </div>
        <img src="/images/icons/expand-white.svg" alt="Expand" class="w-6 h-6 hover:opacity-100 transition-opacity cursor-pointer ml-4" @click="isModalOpen = true" />
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
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden revenue-trend-card" :class="{ 'dark-mode': isDark }" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-start py-6 px-8 border-b border-white/10 w-full z-10">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular leading-tight text-white">{{ currentLang === 'ar' ? 'آخر 6 أشهر إلى السنة السابقة' : 'Last 6 months to Previous year' }}</h2>
              <p class="text-xs opacity-70 font-regular mt-1 text-white">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-6 text-[14px]">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FF582F]"></div>
                  <span class="opacity-90 text-[12px] font-regular text-white">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#00FFBC]"></div>
                  <span class="opacity-90 text-[12px] font-regular text-white">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0 ml-4">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-[25px] h-[25px] invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[300px]">
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
    name: 'Previous Year',
    data: [2.5, 1.2, 2.8, 1.8, 1.2, 1.8, 2.6]
  },
  {
    name: 'Current Year',
    data: [0.8, 2.2, 1.2, 3.8, 2.8, 4.2, 4.4]
  }
])

const chartOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false },
    sparkline: { enabled: false },
    fontFamily: 'Noto Sans Arabic, sans-serif',
    zoom: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#FF582F', '#00FFBC']
  },
  colors: ['#FF582F', '#00FFBC'],
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 20, bottom: 0, left: 10 }
  },
  markers: {
    size: 0,
    hover: {
      size: 6,
      strokeColors: '#FFC107',
      strokeWidth: 4,
      strokeOpacity: 1,
      fillOpacity: 1,
      colors: ['#fff']
    }
  },
  xaxis: {
    categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: {
      show: true,
      stroke: {
        color: '#ffffff',
        width: 1,
        dashArray: 3
      }
    },
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        fontWeight: 400
      },
      offsetY: 10
    }
  },
  yaxis: {
    min: 0,
    max: 4,
    tickAmount: 4,
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        fontWeight: 400
      },
      formatter: (val) => val === 0 ? '0' : val + ' M'
    }
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const monthLabel = w.globals.categoryLabels[dataPointIndex]
      const curYearValue = series[1][dataPointIndex]
      const preYearValue = series[0][dataPointIndex]
      const diff = preYearValue - curYearValue
      const decline = ((diff / preYearValue) * 100).toFixed(1)
      
      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${monthLabel}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">Current Year:</span>
              <span class="value">AED ${curYearValue.toString().replace('.', ',')}M</span>
            </div>
            <div class="tooltip-row">
              <span class="label">Previous Year:</span>
              <span class="value">AED ${preYearValue.toString().replace('.', ',')}M</span>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-row">
              <span class="label">Decline:</span>
              <span class="value highlight">-${decline}%</span>
            </div>
          </div>
        </div>
      `
    }
  }
}
</script>

<style scoped>
.revenue-trend-card {
  background: linear-gradient(180deg, #00A176 0%, #004E3F 100%) !important;
}

.revenue-trend-card.dark-mode {
  background: #00141080 !important;
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

/* Specific glow for Previous Year (#FF582F) at index 1 */
:deep(.apexcharts-series:nth-child(1) path) {
  filter: drop-shadow(0px 0px 7.2px #FF886A) !important;
}

/* Specific glow for Current Year (#00FFBC) at index 2 */
:deep(.apexcharts-series:nth-child(2) path) {
  filter: drop-shadow(0px 0px 6.3px #00C692) !important;
}

:deep(.custom-tooltip) {
  background: #DCF9F3;
  padding: 16px;
  border-radius: 16px;
  color: #1A1A1A;
  font-family: 'Noto Sans Arabic', sans-serif;
  min-width: 200px;
  border: none !important;
}

:deep(.tooltip-header) {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
}

:deep(.tooltip-body) {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

:deep(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}

:deep(.tooltip-row .label) {
  opacity: 0.6;
}

:deep(.tooltip-row .value) {
  font-weight: 600;
}

:deep(.tooltip-divider) {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 4px 0;
}

:deep(.tooltip-row .value.highlight) {
  color: #FF582F;
  font-weight: 700;
}

/* Ensure lines have a subtle glow */
/* (Defined above specifically for each series) */
</style>
