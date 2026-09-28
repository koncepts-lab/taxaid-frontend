<template>
  <div class="w-full h-full rounded-[24px] p-8 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    style="background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);">
    
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0 relative">
      <div class="mb-2">
        <h2 class="text-[16px] font-regular text-white">
          {{ title }}
        </h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white' : 'text-[#FFFFFF5C]'">
          {{ note }}
        </p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-4 text-xs font-medium">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
          <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الفعلي' : 'Actual' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[#00D8B0]"></span>
          <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</span>
        </div>
        <CommonInfoTooltip tip="costCenterDetail.chart" light align="right" />
        <img 
          src="/images/icons/expand-white.svg" 
          alt="Expand" 
          class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity" 
          @click="isModalOpen = true"
        />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 min-h-0 mt-0 relative">
      <CommonUnitToggle storage-key="cc_chart_unit" class="absolute top-0 right-0 rtl:right-auto rtl:left-0 z-10" />
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

    <!-- Modal Area -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
          :style="isDark ? { background: '#002e26' } : { background: 'linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%)' }" 
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 relative z-10">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular text-white">
                {{ title }}
              </h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white' : 'text-[#FFFFFF5C]'">
                {{ note }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
                  <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الفعلي' : 'Actual' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#00D8B0]"></span>
                  <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[350px]">
            <CommonUnitToggle storage-key="cc_chart_unit" class="absolute top-3 right-8 rtl:right-auto rtl:left-8 z-10" />
            <ClientOnly>
              <CommonApexBarChart :key="chartKey" width="100%" height="100%" type="bar" :options="chartOptions" :series="series"></CommonApexBarChart>
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

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const { code: currency, valuesNote } = useCurrency()
const projectName = computed(() => props.data?.cost_center || '')

const { unit } = useChartHelper('cc_chart_unit')

const title = computed(() => {
  const base = currentLang.value === 'ar' ? 'الفعلي مقابل الميزانية' : 'Actual vs Budget'
  return projectName.value ? `${base} – ${projectName.value}` : base
})
const note = computed(() => valuesNote(unit.value === 'millions'))

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const million = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

// Millions mode rounds only from 100,000 up; smaller values stay exact. Actual mode is always the full number.
const fmt = (value) => {
  const v = Number(value) || 0
  if (unit.value === 'millions' && Math.abs(v) >= 100000) return `${million.format(v / 1_000_000)}M`
  return whole.format(v)
}

const tableRows = computed(() => props.data?.table_data ?? [])
const categories = computed(() => tableRows.value.map(row => row.particulars ?? ''))
const rawActual = computed(() => tableRows.value.map(row => Number(row.actual ?? 0)))
const rawBudget = computed(() => tableRows.value.map(row => Number(row.budget ?? 0)))

const peak = computed(() => Math.max(0, ...rawActual.value, ...rawBudget.value))

// Positive bars too small to see get a minimum height; labels and the tooltip still show the real value.
const minVisible = computed(() => peak.value * 0.025)
const plot = (value) => (value > 0 && value < minVisible.value ? minVisible.value : value)

const series = computed(() => [
  { name: 'Actual', data: rawActual.value.map(plot) },
  { name: 'Budget', data: rawBudget.value.map(plot) }
])

// Axis top is taken from the data, rounded up to a clean step, with headroom for the bar labels.
const axis = computed(() => {
  const top = peak.value * (1.12)
  if (top <= 0) return { max: 5, ticks: 5 }

  const rough = top / 5
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 10].map(m => m * power).find(s => s >= rough) ?? 10 * power
  const max = Math.ceil(top / step) * step

  return { max, ticks: Math.max(2, Math.round(max / step)) }
})

const chartKey = computed(() => JSON.stringify([unit.value, currency.value, categories.value, rawActual.value, rawBudget.value]))

const yFormatter = (val) => (val === 0 ? '0' : fmt(val))
const compactLabels = computed(() => unit.value === 'actual')

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent'
  },
  plotOptions: {
    bar: {
      columnWidth: unit.value === 'actual' ? '64px' : '40px',
      borderRadius: 8,
      borderRadiusApplication: 'around',
      dataLabels: { position: 'top' }
    }
  },
  colors: ['#FF7B5F', '#00D8B0'],
  dataLabels: {
    enabled: true,
    offsetY: -45,
    style: { fontSize: compactLabels.value ? '11px' : '14px', colors: ['#03D8B0'], fontWeight: 500 },
    formatter: (val, { seriesIndex, dataPointIndex }) => {
      const raw = (seriesIndex === 0 ? rawActual.value : rawBudget.value)[dataPointIndex]
      return raw <= 0 ? '' : fmt(raw)
    }
  },
  xaxis: {
    categories: categories.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: '13px', colors: '#FFFFFF', fontWeight: 500 } },
    crosshairs: { show: false }
  },
  yaxis: {
    min: 0,
    max: axis.value.max,
    tickAmount: axis.value.ticks,
    labels: {
      style: { fontSize: '13px', colors: '#FFFFFF', fontWeight: 500 },
      formatter: yFormatter
    },
    axisBorder: {
      show: true,
      color: 'rgba(255, 255, 255, 0.3)',
      width: 1
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    yaxis: { lines: { show: true } },
    padding: { top: 40 }
  },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } }
  },
  legend: { show: false },
  responsive: [
    {
      breakpoint: 640,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '55%',
            borderRadius: 4,
            dataLabels: {
              orientation: 'vertical'
            }
          }
        },
        dataLabels: {
          offsetY: 0,
          style: {
            fontSize: '9px'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '11px',
              colors: '#FFFFFF'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: yFormatter,
            style: {
              fontSize: '11px',
              colors: '#FFFFFF'
            }
          }
        }
      }
    }
  ],
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    custom: function({ dataPointIndex, w }) {
      const category = w.globals.labels[dataPointIndex]
      const actual = rawActual.value[dataPointIndex] ?? 0
      const budget = rawBudget.value[dataPointIndex] ?? 0
      const varianceValue = budget - actual
      const variancePercent = budget ? ((varianceValue / budget) * 100).toFixed(1) : null
      const varianceSign = varianceValue >= 0 ? '+' : ''

      return `
        <div class="px-5 py-4 bg-[#E2FFF3] rounded-xl shadow-2xl border-none" style="min-width: 200px;">
          <div class="font-semibold mb-3 text-[#000] text-[15px]">${category}</div>
          <div class="text-[#333] text-[13px] mb-1.5 flex justify-between gap-4">
            <span>Actual:</span> <span class="font-bold text-[#FF7B5F]">${currency.value} ${fmt(actual)}</span>
          </div>
          <div class="text-[#333] text-[13px] mb-1.5 flex justify-between gap-4">
            <span>Budget:</span> <span class="font-bold text-[#00A176]">${currency.value} ${fmt(budget)}</span>
          </div>
          <div class="text-[14px] pt-1 border-t border-black/5 mt-1 flex justify-between gap-4">
            <span>Variance:</span> <span class="font-bold text-[#00A176]">${variancePercent === null ? '—' : varianceSign + variancePercent + '%'}</span>
          </div>
        </div>
      `
    }
  }
}))
</script>
