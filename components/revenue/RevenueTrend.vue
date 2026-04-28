<template>
  <div class="revenue-trend-card rounded-[20px] p-8 text-white h-full flex flex-col relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-md"
    :class="{ 'dark-mode': isDark }">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:justify-between items-start gap-4 lg:gap-0 mb-6 w-full z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight">{{ currentLang === 'ar' ? 'آخر 6 أشهر إلى السنة السابقة' : 'Last 6 months to Previous year' }}</h2>
        <p class="text-[12px] opacity-70 font-regular mt-1">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end">
        <div class="flex items-center gap-4 lg:gap-6 text-[14px]">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF582F]"></div>
            <span class="opacity-90 text-[12px] font-regular whitespace-normal text-left">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 shrink-0 rounded-full bg-[#00FFBC]"></div>
            <span class="opacity-90 text-[12px] font-regular whitespace-normal text-left">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-4 lg:ml-4">
          <img src="/images/icons/info-white.svg" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
          <img src="/images/icons/expand-white.svg" alt="Expand" class="w-6 h-6 hover:opacity-100 transition-opacity cursor-pointer hidden lg:block" @click="isModalOpen = true" />
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full relative z-10 min-h-[300px]">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-[#00FFBC] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-white/80">{{ currentLang === 'ar' ? 'جاري التحميل...' : 'Loading Data...' }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-500/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-sm font-medium text-white">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
          <button @click="fetchTrendData" class="mt-2 px-4 py-2 bg-white/20 text-white text-xs rounded-lg hover:bg-white/30 transition-colors">
            {{ currentLang === 'ar' ? 'إعادة المحاولة' : 'Retry' }}
          </button>
        </div>
      </div>

      <ClientOnly v-if="!loading && !error">
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
              <div class="flex items-center gap-4 ml-4">
                <img src="/images/icons/info-white.svg" alt="Info Icon" class="w-5 h-5 cursor-pointer hover:opacity-100" />
                <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                  <img src="/images/icons/expand.svg" alt="Close Modal" class="w-[25px] h-[25px] invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[300px]">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 border-4 border-[#00FFBC] border-t-transparent rounded-full animate-spin"></div>
                <p class="text-base font-medium text-white/80">{{ currentLang === 'ar' ? 'جاري التحميل...' : 'Loading Data...' }}</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-500/10 backdrop-blur-[2px]">
              <div class="flex flex-col items-center gap-3 text-center px-6">
                <p class="text-base font-medium text-white">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
                <button @click="fetchTrendData" class="mt-4 px-6 py-2 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors">
                  {{ currentLang === 'ar' ? 'إعادة المحاولة' : 'Retry' }}
                </button>
              </div>
            </div>

            <ClientOnly v-if="!loading && !error">
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
import { ref, computed, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

// API Data State
const loading = ref(true)
const error = ref(null)
const trendData = ref([])
const categories = ref([])

const fetchTrendData = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await useApi('revenue-analysis/trend-chart', {
      method: 'POST',
      body: {
        custom_from: "12-05-2025"
      }
    })
    
    if (response.status === 'success') {
      const apiData = response.data
      
      categories.value = apiData.map(item => item.month_short)
      
      // Series 0: Previous Year, Series 1: Current Year
      trendData.value = [
        {
          name: 'Previous Year',
          nameAr: 'السنة السابقة',
          data: apiData.map(item => Number((item.previous_year / 1_000_000).toFixed(2)))
        },
        {
          name: 'Current Year',
          nameAr: 'السنة الحالية',
          data: apiData.map(item => Number((item.current_year / 1_000_000).toFixed(2)))
        }
      ]
    }
  } catch (err) {
    error.value = err
    console.error('Failed to fetch trend data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTrendData()
})

const series = computed(() => {
  return trendData.value.map(s => ({
    name: currentLang.value === 'ar' ? s.nameAr : s.name,
    data: s.data
  }))
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    sparkline: { enabled: false },
    fontFamily: 'Noto Sans Arabic, sans-serif',
    zoom: { enabled: false },
    rtl: currentLang.value === 'ar'
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
    categories: categories.value.length ? categories.value : ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
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
    min: Math.floor(Math.min(...trendData.value.flatMap(s => s.data), 0)),
    max: Math.ceil(Math.max(...trendData.value.flatMap(s => s.data), 1)),
    tickAmount: 4,
    opposite: currentLang.value === 'ar',
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
      const variance = preYearValue !== 0 ? ((diff / preYearValue) * 100).toFixed(1) : '0.0'
      
      const curLabel = currentLang.value === 'ar' ? 'السنة الحالية:' : 'Current Year:'
      const preLabel = currentLang.value === 'ar' ? 'السنة السابقة:' : 'Previous Year:'
      const varLabel = currentLang.value === 'ar' ? 'تباين:' : 'Variance:'

      // Format using our utility
      const formattedCur = formatInMillions(curYearValue * 1000000, { suffix: 'M' })
      const formattedPre = formatInMillions(preYearValue * 1000000, { suffix: 'M' })

      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${monthLabel}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${curLabel}</span>
              <span class="value">AED ${formattedCur}</span>
            </div>
            <div class="tooltip-row">
              <span class="label">${preLabel}</span>
              <span class="value">AED ${formattedPre}</span>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-row">
              <span class="label">${varLabel}</span>
              <span class="value ${diff > 0 ? 'highlight' : 'teal'}">${diff > 0 ? '-' : '+'}${Math.abs(variance)}%</span>
            </div>
          </div>
        </div>
      `
    }
  }
}))
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
