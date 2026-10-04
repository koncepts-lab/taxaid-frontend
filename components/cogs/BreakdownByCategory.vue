<template>
  <div
    class="breakdown-chart-card rounded-3xl lg:p-8 p-4 max-lg:py-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-md"
    :style="isDark ? 'background: #002e26 !important' : ''">
    <!-- Header -->
    <div class="flex lg:flex-row flex-col max-lg:gap-4 justify-between items-start mb-4 text-white relative z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-medium leading-tight">
          {{ currentLang === 'ar' ? 'تفصيل تكلفة المبيعات حسب الفئة' : 'COGS Breakdown by Category' }}
        </h2>
        <p class="text-[12px] font-regular mt-1 opacity-80">
          {{ valuesNote(unit === 'millions') }}
        </p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-4 text-[13px] font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
          </div>
        </div>
        <CommonUnitToggle :on-dark="true" storage-key="cogs_breakdown_unit" />
        <CommonInfoTooltip tip="cogs.breakdownByCategory" light class="max-lg:hidden" />
        <img src="/images/icons/expand-white.svg" alt="Expand"
          class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity max-lg:hidden"
          @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[320px] relative z-10">
      <ClientOnly>
        <apexchart :key="(data?.charts?.cogs_by_category?.categories?.length || 0) + '-' + unit" type="bar" height="100%" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden breakdown-chart-card"
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight">
                {{ currentLang === 'ar' ? 'تفصيل تكلفة المبيعات حسب الفئة' : 'COGS Breakdown by Category' }}
              </h2>
              <p class="text-xs font-regular mt-1 opacity-80">
                {{ valuesNote(unit === 'millions') }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-4 text-[13px] font-regular">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
                </div>
              </div>
              <CommonUnitToggle :on-dark="true" storage-key="cogs_breakdown_unit" />
              <button @click="isModalOpen = false"
                class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 invert"
                  :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>

          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10">
            <ClientOnly>
              <apexchart :key="(data?.charts?.cogs_by_category?.categories?.length || 0) + '-' + unit + '-modal'" type="bar" height="100%" :options="chartOptions" :series="series" />
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => null
  }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { valuesNote, code } = useCurrency()
const { unit, fmt, axisFmt, axisFor } = useChartHelper('cogs_breakdown_unit')
const isModalOpen = ref(false)

const categories = computed(() => {
  if (props.data?.charts?.cogs_by_category?.categories) {
    return props.data.charts.cogs_by_category.categories.map(cat => ({
      en: cat,
      ar: cat
    }))
  }
  return []
})

const series = computed(() => {
  if (props.data?.charts?.cogs_by_category) {
    const chartData = props.data.charts.cogs_by_category
    return [
      {
        name: 'Previous Year',
        data: chartData.previous_year.map(val => Number(val) || 0)
      },
      {
        name: 'Current Year',
        data: chartData.current_year.map(val => Number(val) || 0)
      }
    ]
  }
  return [
    { name: 'Previous Year', data: [] },
    { name: 'Current Year', data: [] }
  ]
})

const chartOptions = computed(() => {
  const allData = [...series.value[0].data, ...series.value[1].data]
  const peak = Math.max(0, ...allData)
  const axis = axisFor(peak)

  return {
    chart: {
      fontFamily: 'Noto Sans Arabic, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
        },
      }
    },
    colors: ['#FB7554', '#03D8B0'],
    dataLabels: {
      enabled: true,
      offsetY: -30,
      style: {
        fontSize: '11px',
        colors: ['#03D8B0'] // Adjust accordingly, using teal for labels as mostly seen
      },
      formatter: (val) => axisFmt(val)
    },
    xaxis: {
      categories: categories.value.map(c => currentLang.value === 'ar' ? c.ar : c.en),
      axisBorder: {
        show: true,
        color: '#004033',
        height: 1,
        width: '100%'
      },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#FFFFFFBF',
          fontWeight: 400
        }
      }
    },
    yaxis: {
      min: 0,
      max: axis.max,
      tickAmount: axis.ticks,
      axisBorder: {
        show: true,
        color: '#004033',
        width: 1
      },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#FFFFFFBF'
        },
        formatter: (val) => val === 0 ? '0' : axisFmt(val)
      }
    },
    grid: {
      show: true,
      borderColor: '#004033',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 20, right: 10, bottom: 0, left: 10 }
    },
    legend: { show: false },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return code.value + " " + fmt(val)
        }
      }
    }
  }
})
</script>

<style scoped>
.breakdown-chart-card {
  background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-tooltip) {
  color: #1A1A1A !important;
}

:deep(.apexcharts-tooltip-title) {
  color: #1A1A1A !important;
}
</style>
