<template>
  <div class="revenue-trend-card rounded-[20px] p-8 text-white h-full flex flex-col relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-md"
    :class="{ 'dark-mode': isDark }">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:justify-between items-start gap-4 lg:gap-0 mb-6 w-full z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight">{{ trendTitle }}</h2>
        <p class="text-[12px] opacity-70 font-regular mt-1">{{ valuesNote(unit === 'millions') }}</p>
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
        <CommonUnitToggle :on-dark="true" storage-key="revenue_trend_unit" />
        <div class="flex items-center gap-4 lg:ml-2">
          <CommonInfoTooltip tip="revenue.trend" light align="right" />
          <img src="/images/icons/expand-white.svg" alt="Expand" class="w-6 h-6 hover:opacity-100 transition-opacity cursor-pointer hidden lg:block" @click="isModalOpen = true" />
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full relative z-10 min-h-[300px]">
      <!-- Loading Skeleton (Dual wave line skeleton) -->
      <div v-if="loading" class="w-full h-full min-h-[300px] flex flex-col justify-between py-6 animate-pulse">
        <svg class="w-full h-[220px]" viewBox="0 0 500 200" preserveAspectRatio="none">
          <path d="M 0 140 Q 125 50 250 120 T 500 80" fill="none" stroke="#FF582F" stroke-width="2.5" opacity="0.35" stroke-dasharray="6 4" />
          <path d="M 0 100 Q 125 150 250 60 T 500 40" fill="none" stroke="#00FFBC" stroke-width="2.5" opacity="0.45" />
          <!-- Subtle Grid Lines -->
          <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
          <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        </svg>
        <div class="flex justify-between px-2 pt-2">
          <div v-for="m in 6" :key="'m-skel-' + m" class="h-3 w-10 rounded bg-white/20"></div>
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

      <!-- Empty State -->
      <div v-else-if="!loading && !error && (!series || series.every(s => !s.data || s.data.length === 0))" class="absolute inset-0 z-20 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-sm font-medium opacity-60 text-white">
            {{ currentLang === 'ar' ? 'البيانات فارغة' : 'Data empty' }}
          </p>
        </div>
      </div>

      <ClientOnly v-else-if="!loading && !error">
        <apexchart
          :key="chartKey"
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
              <h2 class="text-lg font-regular leading-tight text-white">{{ trendTitle }}</h2>
              <p class="text-xs opacity-70 font-regular mt-1 text-white">{{ valuesNote(unit === 'millions') }}</p>
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
              <CommonUnitToggle :on-dark="true" storage-key="revenue_trend_unit" />
              <div class="flex items-center gap-4 ml-2">
                <CommonInfoTooltip tip="revenue.trend" light align="right" />
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

            <!-- Empty State -->
            <div v-else-if="!loading && !error && (!series || series.every(s => !s.data || s.data.length === 0))" class="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
              <div class="flex flex-col items-center gap-3 text-center px-6">
                <p class="text-base font-medium opacity-60 text-white">
                  {{ currentLang === 'ar' ? 'البيانات فارغة' : 'Data empty' }}
                </p>
              </div>
            </div>

            <ClientOnly v-else-if="!loading && !error">
              <apexchart
                :key="chartKey + '-modal'"
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

<script setup lang="ts">
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const { valuesNote } = useCurrency()
const { unit } = useChartHelper('revenue_trend_unit')

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const million = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

const fmt = (value: any) => {
  const v = Number(value) || 0
  if (unit.value === 'millions') {
    return `${million.format(v / 1_000_000)}M`
  }
  return whole.format(v)
}

const { loading, error, trendData, fetchAll: fetchTrendData } = useRevenue()

const categories = computed(() => trendData.value?.categories ?? [])

const trendTitle = computed(() => {
  const n = categories.value.length || 6
  return currentLang.value === 'ar'
    ? `آخر ${n} أشهر إلى السنة السابقة`
    : `Last ${n} months to Previous year`
})

const rawPrev = computed(() => {
  if (trendData.value?.previousYearRaw?.length) return trendData.value.previousYearRaw
  return (trendData.value?.series?.[0]?.data ?? []).map((v: number) => v * 1_000_000)
})

const rawCurr = computed(() => {
  if (trendData.value?.currentYearRaw?.length) return trendData.value.currentYearRaw
  return (trendData.value?.series?.[1]?.data ?? []).map((v: number) => v * 1_000_000)
})

const series = computed(() => [
  {
    name: currentLang.value === 'ar' ? 'السنة السابقة' : 'Previous Year',
    data: rawPrev.value
  },
  {
    name: currentLang.value === 'ar' ? 'السنة الحالية' : 'Current Year',
    data: rawCurr.value
  }
])

const peak = computed(() => Math.max(0, ...rawPrev.value, ...rawCurr.value))

const axis = computed(() => {
  const top = peak.value * 1.15
  if (top <= 0) return { max: 5, ticks: 5 }

  const rough = top / 5
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 10].map(m => m * power).find(s => s >= rough) ?? 10 * power
  const max = Math.ceil(top / step) * step

  return { max, ticks: Math.max(2, Math.round(max / step)) }
})

const chartKey = computed(() => JSON.stringify([
  unit.value,
  currentLang.value,
  categories.value,
  rawPrev.value,
  rawCurr.value
]))

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
    categories: categories.value.length ? categories.value : [],
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
    max: axis.value.max,
    tickAmount: axis.value.ticks,
    opposite: currentLang.value === 'ar',
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        fontWeight: 400
      },
      formatter: (val: any) => val === 0 ? '0' : fmt(val)
    }
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
      const monthLabel = categories.value[dataPointIndex] ?? w.globals.categoryLabels[dataPointIndex]
      const curYearValue = Number(series[1][dataPointIndex] || 0)
      const preYearValue = Number(series[0][dataPointIndex] || 0)
      
      const diff = preYearValue - curYearValue
      const variance = preYearValue !== 0 ? ((diff / preYearValue) * 100).toFixed(1) : '0.0'
      
      const curLabel = currentLang.value === 'ar' ? 'السنة الحالية:' : 'Current Year:'
      const preLabel = currentLang.value === 'ar' ? 'السنة السابقة:' : 'Previous Year:'
      const varLabel = currentLang.value === 'ar' ? 'تباين:' : 'Variance:'

      const formattedCur = fmt(curYearValue)
      const formattedPre = fmt(preYearValue)

      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${monthLabel}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="dot current"></span>
              <span class="label">${curLabel}</span>
              <span class="value">${formattedCur}</span>
            </div>
            <div class="tooltip-row">
              <span class="dot previous"></span>
              <span class="label">${preLabel}</span>
              <span class="value">${formattedPre}</span>
            </div>
            <div class="tooltip-row">
              <span class="label">${varLabel}</span>
              <span class="value font-semibold">${variance}%</span>
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
  background: #002e26 !important;
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-tooltip),
:deep(.dark-mode-bg .apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
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
