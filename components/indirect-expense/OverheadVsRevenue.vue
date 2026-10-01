<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0 gap-3">
      <!-- Title -->
      <div>
        <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'النفقات العامة مقابل الإيرادات' : 'Overhead vs Revenue' }}</h2>
        <p class="text-[12px] font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#333333BF]'">{{ valuesNote(unit === 'millions') }}</p>
      </div>

      <!-- Legend & Controls -->
      <div class="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium w-full lg:w-auto justify-between lg:justify-end shrink-0">
        <div class="flex items-center gap-3 lg:gap-4">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#FFBB00]"></span>
            <span :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'النفقات العامة' : 'Overhead' }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#007965]"></span>
            <span :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 lg:gap-4">
          <CommonUnitToggle :on-dark="isDark" storage-key="indirect_expense_overhead_vs_revenue_unit" />
          <img 
            :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" 
            alt="Info" 
            class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          />
          <img 
            :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" 
            alt="Expand" 
            class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity hidden lg:block"
            @click="isModalOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (Zero CLS) -->
    <div v-if="loading" class="flex-1 min-h-[300px] mt-6 flex flex-col justify-between animate-pulse">
      <div class="flex items-end justify-between h-[230px] w-full px-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <div v-for="c in 6" :key="'ovr-skel-' + c" class="flex items-end gap-1.5">
          <div class="w-3.5 lg:w-5 rounded-t bg-[#FFBB00]/30" :style="{ height: (35 + (c * 6)) + '%' }"></div>
          <div class="w-3.5 lg:w-5 rounded-t bg-[#007965]/30" :style="{ height: (50 + (c * 5)) + '%' }"></div>
        </div>
      </div>
      <div class="flex justify-between pt-3">
        <div v-for="c in 6" :key="'ovr-lbl-' + c" class="h-3 w-12 rounded" :class="isDark ? 'bg-white/15' : 'bg-gray-200'"></div>
      </div>
    </div>

    <!-- Chart Area -->
    <div v-else class="flex-1 min-h-[300px] mt-6">
      <ClientOnly>
        <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
          :class="isDark ? 'bg-[#002e26]' : 'bg-white'" 
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'النفقات العامة مقابل الإيرادات' : 'Overhead vs Revenue' }}</h2>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#333333BF]'">{{ valuesNote(unit === 'millions') }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FFBB00]"></span>
                  <span :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'النفقات العامة' : 'Overhead' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#007965]"></span>
                  <span :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
                </div>
              </div>
              <CommonUnitToggle :on-dark="isDark" storage-key="indirect_expense_overhead_vs_revenue_unit" />
              <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0" :class="isDark ? 'text-white' : 'text-[#333333]'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[350px]">
            <ClientOnly>
              <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
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
const { unit } = useChartHelper('indirect_expense_overhead_vs_revenue_unit')
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
      name: currentLang.value === 'ar' ? 'النفقات العامة' : 'Overhead',
      data: props.data.map((item: any) => {
        const val = Number(item['indirect expenses']) || 0
        return isMil ? parseFloat((val / 1_000_000).toFixed(2)) : val
      })
    },
    {
      name: currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue',
      data: props.data.map((item: any) => {
        const val = Number(item.revenue) || 0
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
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
      background: 'transparent'
    },
    colors: ['#FFBB00', '#007965'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        if (!val) return '0'
        return isMil ? val + 'M' : formatStandardNumber(val, 0)
      },
      offsetY: -20,
      style: {
        fontSize: '10px',
        colors: [isDark.value ? '#ffffff80' : '#33333380']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: { show: false },
    xaxis: {
      categories: chartCategories.value,
      labels: {
        style: { colors: isDark.value ? '#FFFFFFBF' : '#333333BF', fontSize: '13px', fontWeight: 400 }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      max: yMax.value,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => {
          if (isMil) return value.toFixed(1) + 'M'
          return formatStandardNumber(value, 0)
        },
        style: { colors: isDark.value ? '#FFFFFFBF' : '#333333BF', fontSize: '13px', fontWeight: 400 }
      }
    },
    grid: {
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      custom: function({ dataPointIndex }: any) {
        const monthName = chartCategories.value[dataPointIndex]
        const raw = rawData.value[dataPointIndex] as any
        
        const overhead = isMil
          ? formatToMillions(raw?.['indirect expenses'] ?? 0, 2) + ' M'
          : formatStandardNumber(raw?.['indirect expenses'] ?? 0, 2)
        const revenue = isMil
          ? formatToMillions(raw?.revenue ?? 0, 2) + ' M'
          : formatStandardNumber(raw?.revenue ?? 0, 2)
        const ratio = raw?.expense_to_revenue_ratio ?? '0%'
        
        const revenueLabel = currentLang.value === 'ar' ? 'الإيرادات: ' : 'Revenue: '
        const overheadLabel = currentLang.value === 'ar' ? 'النفقات العامة: ' : 'Overhead: '
        const ratioLabel = currentLang.value === 'ar' ? 'نسبة النفقات العامة: ' : 'Overhead Ratio: '
        const code = currencyCode.value
        
        return '<div class="px-5 py-4 bg-[#E2F9F4] rounded-xl shadow-xl border-none" style="min-width: 220px;">' +
          '<div class="font-bold mb-2 text-[#000] text-[16px]">' + monthName + '</div>' +
          '<div class="text-[#333] text-[14px] mb-1">' + revenueLabel + '<span class="font-bold text-[#007965]"> ' + code + ' ' + revenue + '</span></div>' +
          '<div class="text-[#333] text-[14px] mb-1">' + overheadLabel + '<span class="font-bold text-[#D48806]"> ' + code + ' ' + overhead + '</span></div>' +
          '<div class="text-[#333] text-[14px]">' + ratioLabel + '<span class="font-bold text-[#007965]"> ' + ratio + '</span></div>' +
          '</div>'
      }
    }
  }
})
</script>

<style scoped>
</style>
