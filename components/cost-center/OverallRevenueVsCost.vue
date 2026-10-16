<template>
  <div
    class="rounded-3xl p-8 h-auto md:h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-sm"
    :class="isDark ? 'bg-[#003d35]' : 'bg-[#014235]'"
  >
    <!-- Background styling to match the dark green background of the card in the design.
         Wait, the design shows this specific card having a dark green bg (#014235) in dark/light mode probably. 
         Let's stick to standard theming if it's meant to be consistent or just apply the specific color. 
         I will use text-white for this entire block to match the design. -->
         
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start mb-4 relative z-10 text-white gap-4 md:gap-0">
      <div class="flex flex-col">
        <h2 class="text-[18px] font-medium leading-tight">
          {{ currentLang === 'ar' ? 'إجمالي الإيرادات مقابل التكلفة' : 'Overall Revenue vs Cost' }}
        </h2>
        <p class="text-[13px] font-regular mt-1 opacity-80 text-white">
          {{ note }}
        </p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-4 text-[13px] font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'التكلفة' : 'Cost' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <CommonInfoTooltip tip="costCenterOverall.chart" light align="right" />
        <img :src="'/images/icons/expand-white.svg'" alt="Expand" class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[350px] relative z-10 mt-0">
      <CommonUnitToggle storage-key="cc_chart_unit" class="absolute top-0 right-0 rtl:right-auto rtl:left-0 z-20" />
      <ClientOnly>
        <CommonApexBarChart
          :key="chartKey"
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Sub Legend mapping (A - J), driven by the real cost center names -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-2 text-[13px] text-white/90 w-full px-0 md:px-8 mt-2 relative z-10">
      <div v-for="letter in categories" :key="letter" class="flex items-center gap-1.5 whitespace-nowrap">
        <span class="text-[#03D8B0] font-semibold">{{ letter }}</span>
        <span class="opacity-80">- {{ mappingFullNames[letter] }}</span>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex items-center justify-end gap-1.5 mt-3 px-0 md:px-8 text-xs select-none relative z-10 text-white/80">
      <button type="button" @click="prevPage" :disabled="page === 0"
        class="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20">
        <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button type="button" @click="nextPage" :disabled="page >= totalPages - 1"
        class="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20">
        <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-[#014235]'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight">
                {{ currentLang === 'ar' ? 'إجمالي الإيرادات مقابل التكلفة' : 'Overall Revenue vs Cost' }}
              </h2>
              <p class="text-xs font-regular mt-1 opacity-80 text-white">
                {{ note }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-4 text-[13px] font-regular">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'التكلفة' : 'Cost' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img :src="'/images/icons/expand-white.svg'" alt="Close Modal" class="w-5 h-5 flex-shrink-0" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 flex flex-col justify-between" style="background-color: transparent;">
            <CommonUnitToggle storage-key="cc_chart_unit" class="absolute top-3 right-8 rtl:right-auto rtl:left-8 z-20" />
            <div class="flex-1">
                <ClientOnly>
                  <CommonApexBarChart
                    :key="chartKey"
                    type="bar"
                    height="100%"
                    :options="chartOptions"
                    :series="series"
                  />
                </ClientOnly>
            </div>
            <!-- Sub Legend mapping (A - J), driven by the real cost center names -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-2 text-[13px] text-white/90 w-full px-0 md:px-8 mt-2 relative z-10">
                <div v-for="letter in categories" :key="letter" class="flex items-center gap-1.5 whitespace-nowrap">
                  <span class="text-[#03D8B0] font-semibold">{{ letter }}</span>
                  <span class="opacity-80">- {{ mappingFullNames[letter] }}</span>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="flex items-center justify-end gap-1.5 mt-3 px-0 md:px-8 text-xs select-none relative z-10 text-white/80">
              <button type="button" @click="prevPage" :disabled="page === 0"
                class="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20">
                <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" @click="nextPage" :disabled="page >= totalPages - 1"
                class="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20">
                <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const windowWidth = ref(1024)
const { overallRevenueVsCost, fetchChart } = useCostCenterChart()

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    const handleResize = () => { windowWidth.value = window.innerWidth }
    window.addEventListener('resize', handleResize)
    onUnmounted(() => window.removeEventListener('resize', handleResize))
  }
  fetchChart()
})

const projectNames = computed(() => overallRevenueVsCost.value?.projectNames ?? [])
const allRevenueRaw = computed(() => overallRevenueVsCost.value?.revenueRaw ?? [])
const allCostRaw = computed(() => overallRevenueVsCost.value?.costRaw ?? [])

const pageSize = 8
const page = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(projectNames.value.length / pageSize)))
watch(projectNames, () => { page.value = 0 })
const prevPage = () => { if (page.value > 0) page.value-- }
const nextPage = () => { if (page.value < totalPages.value - 1) page.value++ }

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const categories = computed(() => projectNames.value.slice(page.value * pageSize, page.value * pageSize + pageSize).map((_, i) => letters[i]))
const mappingFullNames = computed(() => {
  const start = page.value * pageSize
  const map = {}
  projectNames.value.slice(start, start + pageSize).forEach((name, i) => { map[letters[i]] = name })
  return map
})

const { code: currency, valuesNote } = useCurrency()

const { unit } = useChartHelper('cc_chart_unit')
const note = computed(() => valuesNote(unit.value === 'millions'))

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const million = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

const fmt = (value) => {
  const v = Number(value) || 0
  if (unit.value === 'millions') return `${million.format(v / 1_000_000)}M`
  return whole.format(v)
}

const rawCost = computed(() => allCostRaw.value.slice(page.value * pageSize, page.value * pageSize + pageSize))
const rawRevenue = computed(() => allRevenueRaw.value.slice(page.value * pageSize, page.value * pageSize + pageSize))
const peak = computed(() => Math.max(0, ...rawCost.value, ...rawRevenue.value))

// Positive bars too small to see get a minimum height; labels and the tooltip still show the real value.
const minVisible = computed(() => peak.value * 0.025)
const plot = (value) => (value > 0 && value < minVisible.value ? minVisible.value : value)

const series = computed(() => {
  const shift = unit.value === 'normal' ? 16 : 10
  return [
    { name: 'Cost', data: rawCost.value.map(plot), dataLabels: { offsetX: -shift } },
    { name: 'Revenue', data: rawRevenue.value.map(plot), dataLabels: { offsetX: shift } }
  ]
})

// Axis top comes from the data, rounded up to a clean step, with headroom for the bar labels.
const axis = computed(() => {
  const top = peak.value * (1.12)
  if (top <= 0) return { max: 5, ticks: 5 }

  const rough = top / 5
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 10].map(m => m * power).find(s => s >= rough) ?? 10 * power
  const max = Math.ceil(top / step) * step

  return { max, ticks: Math.max(2, Math.round(max / step)) }
})

// vue3-apexcharts JSON-copies options on update and drops formatter functions, so redraw the chart on any change
const chartKey = computed(() => JSON.stringify([unit.value, currency.value, categories.value, rawCost.value, rawRevenue.value]))

const yFormatter = (val) => (val === 0 ? '0' : fmt(val))

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Noto Sans Arabic, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      columnWidth: '70%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top'
      },
    }
  },
  colors: ['#FB7554', '#03D8B0'],
  dataLabels: {
    enabled: true,
    offsetY: -35,
    style: {
      fontSize: '9.5px',
      fontWeight: 500,
      colors: ['#FB7554', '#03D8B0']
    },
    formatter: (val, { seriesIndex, dataPointIndex }) => {
      const raw = (seriesIndex === 0 ? rawCost.value : rawRevenue.value)[dataPointIndex]
      return raw <= 0 ? '' : fmt(raw)
    }
  },
  xaxis: {
    categories: categories.value,
    axisBorder: {
      show: false
    },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: {
      style: {
        fontSize: '12px',
        colors: '#FFFFFFBF',
        fontWeight: 400
      }
    },
    crosshairs: {
      show: false
    }
  },
  yaxis: {
    min: 0,
    max: axis.value.max,
    tickAmount: axis.value.ticks,
    axisBorder: {
      show: true,
      color: 'rgba(255, 255, 255, 0.1)',
      width: 1
    },
    axisTicks: { show: false },
    labels: {
      minWidth: 75,
      style: {
        fontSize: '12px',
        colors: '#FFFFFFBF'
      },
      formatter: yFormatter
    }
  },
  grid: {
    show: true,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 35, right: 20, bottom: 0, left: 15 }
  },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } }
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    custom: function({ dataPointIndex }) {
      const cat = categories.value[dataPointIndex]
      const fullName = mappingFullNames.value[cat]
      const cVal = rawCost.value[dataPointIndex] ?? 0
      const rVal = rawRevenue.value[dataPointIndex] ?? 0
      const variance = cVal ? (((rVal - cVal) / cVal) * 100).toFixed(1) : null
      const varianceSign = variance !== null && variance >= 0 ? '+' : ''

      const trFullName = fullName // would map ar if needed
      const trRevenue = currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue'
      const trCost = currentLang.value === 'ar' ? 'التكلفة' : 'Cost'
      const trVariance = currentLang.value === 'ar' ? 'التباين' : 'Variance'

      return `
        <div class="custom-tooltip shadow-xl rounded-2xl" style="background:#D9FBF2; padding: 12px 16px; border:none; color:#1A1A1A;">
          <div style="font-size:12px; margin-bottom:8px; font-weight:500;">${trFullName}</div>
          <div style="font-size:11px; margin-bottom:4px;">${trRevenue}: ${currency.value} ${fmt(rVal)}</div>
          <div style="font-size:11px; margin-bottom:4px;">${trCost}: ${currency.value} ${fmt(cVal)}</div>
          <div style="font-size:11px; color:#00A176;">${trVariance}: ${variance === null ? '—' : varianceSign + variance + '%'}</div>
        </div>
      `
    }
  }
}))
</script>

<style scoped>
:deep(.apexcharts-canvas) {
  margin: 0 auto;
}
:deep(.apexcharts-tooltip) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}
</style>