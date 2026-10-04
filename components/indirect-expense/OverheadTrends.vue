<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0 gap-3">
      <!-- Title -->
      <div>
        <h2 class="text-[16px] font-medium text-white">{{ currentLang === 'ar' ? 'اتحاهات النفقات العامة مع السنة السابقة' : 'Overhead Trends with Previous year' }}</h2>
        <p class="text-[12px] font-normal mt-1 text-[#FFFFFFCF]">{{ valuesNote(unit === 'millions') }}</p>
      </div>

      <!-- Legend & Controls -->
      <div class="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium w-full lg:w-auto justify-between lg:justify-end shrink-0">
        <div class="flex items-center gap-3 lg:gap-4">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#FF7B5F]"></span>
            <span class="text-white">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#00FFBC]"></span>
            <span class="text-white">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 lg:gap-4">
          <CommonUnitToggle :on-dark="true" storage-key="indirect_expense_overhead_trends_unit" />
          <img 
            src="/images/icons/info-white.svg" 
            alt="Info" 
            class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/images/icons/expand-white.svg" 
            alt="Expand" 
            class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity hidden lg:block"
            @click="isModalOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (Zero CLS) -->
    <div v-if="loading" class="flex-1 min-h-[300px] mt-6 flex flex-col justify-between animate-pulse">
      <div class="flex items-end justify-between h-[230px] w-full px-4 border-b border-white/10">
        <div v-for="c in 6" :key="'ot-skel-' + c" class="flex items-end gap-1.5">
          <div class="w-3 lg:w-4 rounded-t bg-[#FF7B5F]/30" :style="{ height: (30 + (c * 8)) + '%' }"></div>
          <div class="w-3 lg:w-4 rounded-t bg-[#00FFBC]/30" :style="{ height: (40 + (c * 7)) + '%' }"></div>
        </div>
      </div>
      <div class="flex justify-between pt-3">
        <div v-for="c in 6" :key="'ot-lbl-' + c" class="h-3 w-12 rounded bg-white/15"></div>
      </div>
    </div>

    <!-- Chart Area -->
    <div v-else class="flex-1 min-h-[300px] mt-6">
      <ClientOnly>
        <apexchart width="100%" height="100%" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
          :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }" 
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium text-white">{{ currentLang === 'ar' ? 'اتحاهات النفقات العامة مع السنة السابقة' : 'Overhead Trends with Previous year' }}</h2>
              <p class="text-xs font-normal mt-1 text-[#FFFFFFCF]">{{ valuesNote(unit === 'millions') }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
                  <span class="text-white">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#00FFBC]"></span>
                  <span class="text-white">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
                </div>
              </div>
              <CommonUnitToggle :on-dark="true" storage-key="indirect_expense_overhead_trends_unit" />
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[350px]">
            <ClientOnly>
              <apexchart width="100%" height="100%" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatToMillions, formatStandardNumber } from '~/utils/formatters'
import { useCurrency } from '~/composables/common/useCurrency'
import { useChartHelper } from '~/composables/common/useChartHelper'

const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const { valuesNote, code: currencyCode } = useCurrency()
const { unit } = useChartHelper('indirect_expense_overhead_trends_unit')
const isModalOpen = ref(false)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartCategories = computed(() => {
  return props.data.map((item: any) => item.month_year || item.month_short || '')
})

const chartSeries = computed(() => {
  const isMil = unit.value === 'millions'
  return [
    {
      name: currentLang.value === 'ar' ? 'السنة الحالية' : 'Current Year',
      data: props.data.map((item: any) => {
        const val = Number(item.current_year) || 0
        return isMil ? parseFloat((val / 1_000_000).toFixed(2)) : val
      })
    },
    {
      name: currentLang.value === 'ar' ? 'السنة السابقة' : 'Previous Year',
      data: props.data.map((item: any) => {
        const val = Number(item.previous_year) || 0
        return isMil ? parseFloat((val / 1_000_000).toFixed(2)) : val
      })
    }
  ]
})

const rawData = computed(() => props.data)

const yMax = computed(() => {
  const allVals = chartSeries.value.flatMap(s => s.data)
  const max = Math.max(...allVals, 0)
  return max > 0 ? (unit.value === 'millions' ? Math.ceil(max * 1.15) : Math.ceil(max * 1.1)) : 10
})

const chartOptions = computed(() => {
  const isMil = unit.value === 'millions'
  return {
    chart: {
      type: 'line',
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false },
      background: 'transparent'
    },
    legend: { show: false },
    colors: ['#00FFBC', '#FF7B5F'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: chartCategories.value,
      labels: {
        style: { colors: '#FFFFFFBF', fontSize: '13px', fontWeight: 400 }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      min: 0,
      max: yMax.value,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => {
          if (isMil) return value.toFixed(1) + ' M'
          return formatStandardNumber(value, 0)
        },
        style: { colors: '#FFFFFFBF', fontSize: '13px', fontWeight: 400 }
      },
      axisBorder: { show: false }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    markers: {
      size: 5,
      colors: ['#00FFBC', '#FF7B5F'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 }
    },
    tooltip: {
      custom: function({ dataPointIndex }: any) {
        const monthName = chartCategories.value[dataPointIndex]
        const raw = rawData.value[dataPointIndex] as any
        
        const currentYearVal = isMil
          ? formatToMillions(raw?.current_year ?? 0, 2) + ' M'
          : formatStandardNumber(raw?.current_year ?? 0, 2)
        const previousYearVal = isMil
          ? formatToMillions(raw?.previous_year ?? 0, 2) + ' M'
          : formatStandardNumber(raw?.previous_year ?? 0, 2)
        const variancePercent = raw?.variance_percent ?? '0%'
        
        const currentLabel = currentLang.value === 'ar' ? 'السنة الحالية: ' : 'Current Year: '
        const previousLabel = currentLang.value === 'ar' ? 'السنة السابقة: ' : 'Previous Year: '
        const diffLabel = currentLang.value === 'ar' ? 'التغير: ' : 'Change: '
        const code = currencyCode.value
        
        return '<div class="px-5 py-4 bg-[#E2F9F4] rounded-xl shadow-xl border-none" style="min-width: 200px;">' +
          '<div class="font-bold mb-2 text-[16px]" style="color: #1A1A1A;">' + monthName + '</div>' +
          '<div class="text-[#333] text-[14px] mb-1">' + currentLabel + '<span class="font-bold"> ' + code + ' ' + currentYearVal + '</span></div>' +
          '<div class="text-[#333] text-[14px] mb-1">' + previousLabel + '<span class="font-bold"> ' + code + ' ' + previousYearVal + '</span></div>' +
          '<div class="text-[#333] text-[14px]">' + diffLabel + '<span class="font-bold text-[#FF582F]"> ' + variancePercent + '</span></div>' +
          '</div>'
      }
    }
  }
})
</script>

<style scoped>
@keyframes sweep-right {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}

:deep(.apexcharts-series) {
  animation: sweep-right 1.5s ease-out forwards;
  animation-delay: 0.5s;
  clip-path: inset(0 100% 0 0);
}

:deep(.apexcharts-tooltip),
:deep(.dark-mode-bg .apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
