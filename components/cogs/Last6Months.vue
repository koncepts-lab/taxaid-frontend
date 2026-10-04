<template>
  <div
    class="last-6-months-card rounded-3xl lg:p-8 p-4 max-lg:py-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-md"
    :style="isDark ? 'background: #002e26 !important' : ''">
    <!-- Header -->
    <div class="flex  lg:flex-row flex-col max-lg:gap-4 justify-between items-start mb-4 text-white relative z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-medium leading-tight">
          {{ currentLang === 'ar' ? 'آخر 6 أشهر مقارنة بالعام الماضي' : 'Last 6 months to Previous year' }}
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
        <CommonUnitToggle :on-dark="true" storage-key="cogs_last6months_unit" />
        <CommonInfoTooltip tip="cogs.last6Months" light class="max-lg:hidden" />
        <img src="/images/icons/expand-white.svg" alt="Expand"
          class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity max-lg:hidden"
          @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[320px] relative z-10 mt-6">
      <ClientOnly>
        <apexchart :key="data.length + '-' + unit" type="line" height="100%" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden last-6-months-card"
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight">
                {{ currentLang === 'ar' ? 'آخر 6 أشهر مقارنة بالعام الماضي' : 'Last 6 months to Previous year' }}
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
              <CommonUnitToggle :on-dark="true" storage-key="cogs_last6months_unit" />
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
              <apexchart :key="data.length + '-' + unit + '-modal'" type="line" height="100%" :options="chartOptions" :series="series" />
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
    type: Array,
    default: () => []
  }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { valuesNote, code } = useCurrency()
const { unit, fmt, axisFmt, axisFor } = useChartHelper('cogs_last6months_unit')
const isModalOpen = ref(false)

const months = computed(() => {
  if (props.data && props.data.length > 0) {
    return props.data.map(item => {
      const monthVal = item.month_short || item.month || item.month_name || 'N/A'
      const label = item.year ? `${monthVal} ${item.year}` : monthVal
      return {
        en: label,
        ar: label
      }
    })
  }
  return []
})

const series = computed(() => {
  if (props.data && props.data.length > 0) {
    return [
      {
        name: 'Previous Year',
        data: props.data.map(item => Number(item.previous_year) || 0)
      },
      {
        name: 'Current Year',
        data: props.data.map(item => Number(item.current_year) || 0)
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
    stroke: {
      width: 2,
      curve: 'smooth',
      colors: ['#FB7554', '#03D8B0']
    },
    colors: ['#FB7554', '#03D8B0'],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 5,
      colors: ['#FB7554', '#03D8B0'],
      strokeColors: ['#fff', '#fff'],
      strokeWidth: 2,
      hover: { size: 7 }
    },
    xaxis: {
      categories: months.value.map(m => currentLang.value === 'ar' ? m.ar : m.en),
      axisBorder: { show: false },
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
      shared: true,
      intersect: false,
      theme: 'light',
      custom: function ({ series: s, dataPointIndex }) {
        const cat = months.value[dataPointIndex]
        const catLabel = currentLang.value === 'ar' ? cat.ar : cat.en
        const pyVal = s[0][dataPointIndex]
        const cyVal = s[1][dataPointIndex]

        const decline = pyVal !== 0 ? (((cyVal - pyVal) / pyVal) * 100).toFixed(1) : (cyVal > 0 ? 100 : 0)
        const declineColor = decline < 0 ? '#FB7554' : '#03D8B0'
        const declinePrefix = decline > 0 ? '+' : ''
        const declineText = currentLang.value === 'ar' ? 'التغيير' : 'Change'

        const cyLabel = currentLang.value === 'ar' ? 'السنة الحالية' : 'Current Year'
        const pyLabel = currentLang.value === 'ar' ? 'السنة السابقة' : 'Previous Year'

        return `
          <div class="custom-tooltip-line shadow-xl rounded-2xl" style="background:#ffffff; padding: 12px 18px; border:none; color:#1A1A1A; width: max-content; max-width: 260px;">
            <div style="font-size:13px; margin-bottom:10px; font-weight:600; white-space: nowrap;">${catLabel}</div>
            <div style="font-size:12px; margin-bottom:6px; display:flex; justify-content:space-between; gap:12px; white-space: nowrap;">
               <span>${cyLabel}:</span>
               <span style="font-weight:600;">${code.value} ${fmt(cyVal)}</span>
            </div>
            <div style="font-size:12px; margin-bottom:6px; display:flex; justify-content:space-between; gap:12px; white-space: nowrap;">
               <span>${pyLabel}:</span>
               <span style="font-weight:600;">${code.value} ${fmt(pyVal)}</span>
            </div>
            <div style="font-size:12px; display:flex; justify-content:space-between; gap:12px; white-space: nowrap;">
               <span>${declineText}:</span>
               <span style="color:${declineColor}; font-weight:600;">${declinePrefix}${decline}%</span>
            </div>
          </div>
        `
      }
    }
  }
})
</script>

<style scoped>
.last-6-months-card {
  background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
