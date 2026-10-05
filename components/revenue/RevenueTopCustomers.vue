<template>
  <div class="rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500"
    :class="isDark ? 'bg-[#002e26] border-none shadow-none' : 'bg-white shadow-sm border border-gray-100'">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:justify-between items-start gap-4 lg:gap-0 mb-6 w-full z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإيرادات - أفضل 10 عملاء حسب القيمة' : 'Revenue - Top 10 Customers by value' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ valuesNote(unit === 'millions') }}</p>
      </div>
      <div class="flex flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end">
        <div class="flex items-center gap-4 lg:gap-6 text-[12px] font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF886A]"></div>
            <span :class="isDark ? 'text-white/60' : 'text-[#0000005C]'" class="whitespace-normal text-left">{{ currentLang === 'ar' ? 'نسبة تراكمي' : 'Cumulative %' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 shrink-0 rounded-full bg-[#04C18F]"></div>
            <span :class="isDark ? 'text-white/60' : 'text-[#0000005C]'" class="whitespace-normal text-left">{{ currentLang === 'ar' ? 'إيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <CommonUnitToggle :on-dark="isDark" storage-key="revenue_top_customers_unit" />
        <div class="flex items-center gap-4 lg:ml-2">
          <CommonInfoTooltip tip="revenue.topCustomers" :light="isDark" align="right" />
          <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand" class="w-6 h-6 cursor-pointer opacity-60 hidden lg:block" @click="isModalOpen = true" />
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[350px] relative">
      <!-- Loading Skeleton (10 Columns + Dual Axis Layout) -->
      <div v-if="loading" class="w-full h-full min-h-[350px] flex flex-col justify-between py-4 animate-pulse">
        <div class="flex items-end justify-between gap-2 h-[260px] w-full px-2 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div v-for="b in 10" :key="'cust-bar-' + b" class="flex-1 flex flex-col items-center justify-end h-full">
            <div class="w-full max-w-[28px] rounded-t" :style="{ height: (20 + ((11 - b) * 7.5)) + '%' }" :class="isDark ? 'bg-[#04C18F]/25' : 'bg-[#04C18F]/20'"></div>
          </div>
        </div>
        <div class="flex justify-between px-2 pt-2">
          <div v-for="b in 10" :key="'cust-lbl-' + b" class="h-3 w-4 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <div class="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-medium text-red-600">
            {{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}
            <span class="block text-[10px] mt-1 opacity-70">{{ error.message || error }}</span>
          </p>
          <button @click="fetchTopCustomers" class="mt-2 px-4 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
            {{ currentLang === 'ar' ? 'إعادة المحاولة' : 'Retry' }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !error && customersData.length === 0" class="absolute inset-0 z-20 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-sm font-medium opacity-60" :class="isDark ? 'text-white' : 'text-[#013E32]'">
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

    <!-- Bottom Legend Grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-4 mt-0" :class="{ 'animate-pulse': loading }">
      <template v-if="loading">
        <div v-for="leg in 10" :key="'cust-leg-sk-' + leg" class="h-4 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
      </template>
      <template v-else>
        <div v-for="item in customers" :key="item.id" class="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <span class="text-[12px] font-regular" :style="{ color: item.color }">{{ item.id }}</span>
          <span class="text-[12px] font-regular truncate" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">- {{ item.displayName }}</span>
        </div>
      </template>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-start py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular leading-tight" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإيرادات - أفضل 10 عملاء حسب القيمة' : 'Revenue - Top 10 Customers by value' }}</h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ valuesNote(unit === 'millions') }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-[12px] font-regular">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FF886A]"></div>
                  <span :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'نسبة تراكمي' : 'Cumulative %' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#04C18F]"></div>
                  <span :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'إيرادات' : 'Revenue' }}</span>
                </div>
              </div>
              <CommonUnitToggle :on-dark="isDark" storage-key="revenue_top_customers_unit" />
              <div class="flex items-center gap-4 ml-2">
                <CommonInfoTooltip tip="revenue.topCustomers" :light="isDark" align="right" />
                <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                  <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[350px]" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 border-4 border-[#04C18F] border-t-transparent rounded-full animate-spin"></div>
                <p class="text-base font-medium" :class="isDark ? 'text-white/80' : 'text-[#013E32]'">{{ currentLang === 'ar' ? 'جاري التحميل...' : 'Loading Data...' }}</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px]">
              <div class="flex flex-col items-center gap-3 text-center px-6">
                <div class="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full">
                  <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-base font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
                <button @click="fetchTopCustomers" class="mt-4 px-6 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                  {{ currentLang === 'ar' ? 'إعادة المحاولة' : 'Retry' }}
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && !error && customersData.length === 0" class="absolute inset-0 z-20 flex items-center justify-center">
              <div class="flex flex-col items-center gap-3 text-center px-6">
                <p class="text-base font-medium opacity-60" :class="isDark ? 'text-white' : 'text-[#013E32]'">
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

          <!-- Bottom Legend Grid -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-4 mt-0 px-8 pb-8" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'">
            <div v-for="item in customers" :key="'modal-' + item.id" class="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
              <span class="text-[12px] font-regular" :style="{ color: item.color }">{{ item.id }}</span>
              <span class="text-[12px] font-regular truncate" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">- {{ item.displayName }}</span>
            </div>
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

const { code: currencyCode, valuesNote } = useCurrency()
const { unit } = useChartHelper('revenue_top_customers_unit')

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const million = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

const fmt = (value: any) => {
  const v = Number(value) || 0
  if (unit.value === 'millions') {
    return `${million.format(v / 1_000_000)}M`
  }
  return whole.format(v)
}

const { loading, error, topCustomersData, fetchAll: fetchTopCustomers } = useRevenue()

const customersData = computed(() => topCustomersData.value?.customers ?? [])
const cumulativePct = computed(() => topCustomersData.value?.cumulative ?? [])

const rawAmounts = computed(() => {
  return customersData.value.map((c: any) => {
    if (c.rawAmount !== undefined) return c.rawAmount
    return (Number(c.value) || 0) * 1_000_000
  })
})

const peak = computed(() => Math.max(0, ...rawAmounts.value))
const minVisible = computed(() => peak.value * 0.025)
const plot = (value: number) => (value > 0 && value < minVisible.value ? minVisible.value : value)

const customers = computed(() => {
  return customersData.value.map((c: any) => ({
    ...c,
    displayName: currentLang.value === 'ar' ? c.nameAr : c.name
  }))
})

const series = computed(() => [
  {
    name: 'Revenue',
    type: 'column',
    data: rawAmounts.value.map(plot)
  },
  {
    name: 'Cumulative %',
    type: 'line',
    data: cumulativePct.value
  }
])

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
  customersData.value.map((c: any) => c.id),
  rawAmounts.value,
  cumulativePct.value
]))

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Noto Sans Arabic, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      columnWidth: '60%',
      borderRadius: 8,
      borderRadiusApplication: 'around'
    }
  },
  stroke: {
    width: [0, 2],
    curve: 'smooth',
    colors: ['transparent', '#FF886A']
  },
  colors: ['#04C18F', '#FF886A'],
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    offsetY: -22,
    style: {
      fontSize: '11px',
      colors: [isDark.value ? '#00E0A5CF' : '#013E32CF'],
      fontWeight: 500
    },
    background: {
      enabled: false,
    },
    formatter: (val: any, opts: any) => {
      const dIdx = opts?.dataPointIndex ?? 0
      const raw = rawAmounts.value[dIdx] ?? val
      if (raw === 0) return '0'
      return fmt(raw)
    }
  },
  markers: {
    size: 5,
    colors: ['#fff'],
    strokeColors: '#FFC107',
    strokeWidth: 2,
    hover: { size: 7 }
  },
  xaxis: {
    categories: customersData.value.map(c => c.id),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        fontSize: '14px',
        colors: isDark.value ? '#FFFFFF80' : '#8C8C8C',
        fontWeight: 400
      }
    }
  },
  yaxis: [
    {
      min: 0,
      max: axis.value.max,
      tickAmount: axis.value.ticks,
      axisBorder: {
        show: true,
        color: isDark.value ? '#F2F2F20F' : '#f1f1f1',
        width: 1
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: isDark.value ? '#FFFFFF80' : '#8C8C8C'
        },
        formatter: (val: any) => val === 0 ? "0" : fmt(val)
      }
    },
    {
      opposite: true,
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: '12px',
          colors: isDark.value ? '#FFFFFF80' : '#8C8C8C'
        },
        formatter: (val: any) => val + "%"
      }
    }
  ],
  grid: {
    borderColor: isDark.value ? '#F2F2F20F' : '#f1f1f1',
    padding: { top: 0, right: 0, bottom: 0, left: 10 }
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    theme: isDark.value ? 'dark' : 'light',
    intersect: false,
    custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
      const customer = customersData.value[dataPointIndex]
      if (!customer) return ''
      
      const customerName = currentLang.value === 'ar' ? customer.nameAr : customer.name
      const raw = rawAmounts.value[dataPointIndex] ?? 0
      const cum = series[1][dataPointIndex]
      
      const revLabel = currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue'
      const contLabel = currentLang.value === 'ar' ? 'المساهمات' : 'Contributions'

      const formattedRev = fmt(raw)

      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${customerName}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${revLabel}:</span>
              <span class="value">${currencyCode.value} ${formattedRev}</span>
            </div>
            <div class="tooltip-row">
              <span class="label">${contLabel}:</span>
              <span class="value teal">${cum}%</span>
            </div>
          </div>
        </div>
      `
    }
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '85%',
            borderRadius: 5,
          }
        },
        dataLabels: {
          offsetY: -10,
          style: {
            fontSize: '9px'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: [
          {
            labels: {
              style: {
                fontSize: '10px'
              },
              offsetX: -5
            }
          },
          {
            opposite: true,
            labels: {
              style: {
                fontSize: '10px'
              },
              offsetX: 5
            }
          }
        ],
        markers: {
          size: 4
        }
      }
    }
  ]
}))
</script>

<style scoped>
:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-tooltip),
:deep(.dark-mode-bg .apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
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
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.tooltip-body) {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-weight: 500;
}

:deep(.tooltip-row .value.teal) {
  color: #04C18F;
  font-weight: 600;
}
</style>
