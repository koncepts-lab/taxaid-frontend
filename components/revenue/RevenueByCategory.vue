<template>
  <div class="relative z-[1] rounded-3xl p-8 h-full flex flex-col transition-all duration-500"
    :class="isDark ? 'bg-[#00141080] border-none shadow-none' : 'bg-white shadow-sm border border-gray-100'">
    <div class="flex justify-between items-start mb-4">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-normal leading-tight" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإيرادات حسب الفئة' : 'Revenue by category' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ valuesNote(unit === 'millions') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <CommonUnitToggle :on-dark="isDark" storage-key="revenue_category_unit" />
        <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand" class="w-6 h-6 cursor-pointer opacity-80 hidden lg:block" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="flex-1 w-full min-h-[360px] relative flex flex-col justify-between"> 
      <!-- Loading Skeleton (5-pair bar chart) -->
      <div v-if="loading" class="w-full flex-1 flex flex-col justify-between animate-pulse py-4">
        <div class="flex items-end justify-around h-[250px] w-full px-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div v-for="c in 5" :key="'cat-skel-' + c" class="flex items-end gap-2">
            <div class="w-4 lg:w-6 rounded-t" :style="{ height: (35 + (c * 10)) + '%' }" :class="isDark ? 'bg-[#FB7554]/30' : 'bg-[#FB7554]/20'"></div>
            <div class="w-4 lg:w-6 rounded-t" :style="{ height: (45 + (c * 8)) + '%' }" :class="isDark ? 'bg-[#0BD9A4]/30' : 'bg-[#0BD9A4]/20'"></div>
          </div>
        </div>
        <div class="flex justify-around pt-3">
          <div v-for="c in 5" :key="'cat-lbl-' + c" class="h-3 w-12 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-xs font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !error && (!series || series.every(s => !s.data || s.data.length === 0))" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-sm font-medium opacity-60" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'البيانات فارغة' : 'Data empty' }}
          </p>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="flex-1 w-full relative">
        <ClientOnly>
          <apexchart
            :key="chartKey"
            type="bar"
            height="100%"
            :options="chartOptions"
            :series="series"
          />
        </ClientOnly>
      </div>

      <!-- Carousel Pagination Controls -->
      <div v-if="totalPages > 1" class="flex items-center justify-between pt-2 px-1 text-xs select-none relative z-10" :class="isDark ? 'text-white/70' : 'text-gray-600'">
        <button
          type="button"
          @click="prevPage"
          :disabled="page === 0"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
          :class="isDark ? 'border-white/20' : 'border-gray-200'"
        >
          <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ currentLang === 'ar' ? 'السابق' : 'Prev' }}</span>
        </button>

        <span class="font-medium text-[11px]">
          {{ page + 1 }} / {{ totalPages }}
        </span>

        <button
          type="button"
          @click="nextPage"
          :disabled="page >= totalPages - 1"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
          :class="isDark ? 'border-white/20' : 'border-gray-200'"
        >
          <span>{{ currentLang === 'ar' ? 'التالي' : 'Next' }}</span>
          <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div class="flex flex-col">
              <h2 class="text-lg font-normal leading-tight" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإيرادات حسب الفئة' : 'Revenue by category' }}</h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ valuesNote(unit === 'millions') }}</p>
            </div>
            <div class="flex items-center gap-4">
              <CommonUnitToggle :on-dark="isDark" storage-key="revenue_category_unit" />
              <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-5 h-5 cursor-pointer hover:opacity-100" />
              <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 flex flex-col justify-between" :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
            <!-- Empty State -->
            <div v-if="!loading && !error && (!series || series.every(s => !s.data || s.data.length === 0))" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[2px]">
              <div class="flex flex-col items-center gap-3 text-center px-6">
                <p class="text-base font-medium opacity-60" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                  {{ currentLang === 'ar' ? 'البيانات فارغة' : 'Data empty' }}
                </p>
              </div>
            </div>

            <div v-else-if="!loading && !error" class="flex-1 w-full relative">
              <ClientOnly>
                <apexchart
                  :key="chartKey + '-modal'"
                  type="bar"
                  height="100%"
                  :options="chartOptions"
                  :series="series"
                />
              </ClientOnly>
            </div>

            <!-- Modal Carousel Pagination Controls -->
            <div v-if="totalPages > 1" class="flex items-center justify-between pt-4 px-2 text-sm select-none relative z-10" :class="isDark ? 'text-white/70' : 'text-gray-600'">
              <button
                type="button"
                @click="prevPage"
                :disabled="page === 0"
                class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
                :class="isDark ? 'border-white/20' : 'border-gray-200'"
              >
                <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{{ currentLang === 'ar' ? 'السابق' : 'Previous' }}</span>
              </button>

              <span class="font-medium text-xs">
                {{ page + 1 }} / {{ totalPages }}
              </span>

              <button
                type="button"
                @click="nextPage"
                :disabled="page >= totalPages - 1"
                class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
                :class="isDark ? 'border-white/20' : 'border-gray-200'"
              >
                <span>{{ currentLang === 'ar' ? 'التالي' : 'Next' }}</span>
                <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, computed } from 'vue'

const props = defineProps({
  data: Object,
  loading: Boolean,
  error: [String, Object]
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const { valuesNote } = useCurrency()
const { unit } = useChartHelper('revenue_category_unit')

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const million = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

const fmt = (value) => {
  const v = Number(value) || 0
  if (unit.value === 'millions') {
    return `${million.format(v / 1_000_000)}M`
  }
  return whole.format(v)
}

const page = ref(0)
const pageSize = 5

const rawCategories = computed(() => {
  return currentLang.value === 'ar' ? (props.data?.categoriesAr || []) : (props.data?.categories || [])
})

const rawPrev = computed(() => {
  if (props.data?.previousYearRaw?.length) return props.data.previousYearRaw
  const s = props.data?.series?.[0]?.data ?? []
  return s.map(v => v * 1_000_000)
})

const rawCurr = computed(() => {
  if (props.data?.currentYearRaw?.length) return props.data.currentYearRaw
  const s = props.data?.series?.[1]?.data ?? []
  return s.map(v => v * 1_000_000)
})

const totalPairs = computed(() => rawCategories.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalPairs.value / pageSize)))

const prevPage = () => {
  if (page.value > 0) page.value--
}

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value++
}

const pagedCategories = computed(() => {
  const start = page.value * pageSize
  return rawCategories.value.slice(start, start + pageSize)
})

const pagedPrevRaw = computed(() => {
  const start = page.value * pageSize
  return rawPrev.value.slice(start, start + pageSize)
})

const pagedCurrRaw = computed(() => {
  const start = page.value * pageSize
  return rawCurr.value.slice(start, start + pageSize)
})

const peak = computed(() => Math.max(0, ...pagedPrevRaw.value, ...pagedCurrRaw.value))
const minVisible = computed(() => peak.value * 0.025)
const plot = (value) => (value > 0 && value < minVisible.value ? minVisible.value : value)

const series = computed(() => [
  {
    name: currentLang.value === 'ar' ? 'السنة السابقة' : 'Previous Year',
    data: pagedPrevRaw.value.map(plot)
  },
  {
    name: currentLang.value === 'ar' ? 'السنة الحالية' : 'Current Year',
    data: pagedCurrRaw.value.map(plot)
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
  page.value,
  pagedCategories.value,
  pagedPrevRaw.value,
  pagedCurrRaw.value
]))

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    },
    fontFamily: 'Noto Sans Arabic, sans-serif',
    rtl: currentLang.value === 'ar'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -22,
    style: {
      fontSize: '10px',
      colors: ['#46867E'],
      fontWeight: 500,
    },
    formatter: function (val, opts) {
      const sIdx = opts?.seriesIndex ?? 0
      const dIdx = opts?.dataPointIndex ?? 0
      const raw = sIdx === 0 ? (pagedPrevRaw.value[dIdx] ?? val) : (pagedCurrRaw.value[dIdx] ?? val)
      if (raw === 0) return '0'
      return fmt(raw)
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: pagedCategories.value,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        fontSize: '12px',
        colors: isDark.value ? '#FFFFFF80' : '#00000080',
        fontWeight: 400
      },
      offsetY: 0,
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: false
    }
  },
  yaxis: {
    min: 0,
    max: axis.value.max,
    tickAmount: axis.value.ticks,
    labels: {
      style: {
        fontSize: '12px',
        colors: '#A6A6A6',
        fontWeight: 400
      },
      formatter: (value) => {
        if (value === 0) return '0'
        return fmt(value)
      },
      offsetX: 0
    },
    opposite: currentLang.value === 'ar',
    axisBorder: {
      show: true,
      color: isDark.value ? '#F2F2F20F' : '#EFEFEF99',
      width: 1,
      offsetX: -2
    }
  },
  grid: {
    borderColor: isDark.value ? '#F2F2F20F' : '#EFEFEF99',
    strokeDashArray: 0,
    yaxis: {
      lines: {
        show: true
      }
    },
    xaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      top: 0,
      right: currentLang.value === 'ar' ? 10 : 20,
      bottom: 0,
      left: currentLang.value === 'ar' ? 20 : 10
    }
  },
  fill: {
    opacity: 1
  },
  colors: ['#FB7554', '#0BD9A4'],
  legend: {
    position: 'bottom',
    horizontalAlign: currentLang.value === 'ar' ? 'right' : 'left',
    fontSize: '14px',
    fontWeight: 400,
    offsetY: 0,
    markers: {
      width: 12,
      height: 12,
      radius: 6,
      offsetY: 0
    },
    itemMargin: {
      horizontal: 10,
      vertical: -5
    },
    labels: {
      colors: isDark.value ? '#FFFFFF' : '#000000'
    }
  },
  tooltip: {
    enabled: true,
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: function (val, opts) {
        const sIdx = opts?.seriesIndex ?? 0
        const dIdx = opts?.dataPointIndex ?? 0
        const raw = sIdx === 0 ? (pagedPrevRaw.value[dIdx] ?? val) : (pagedCurrRaw.value[dIdx] ?? val)
        return fmt(raw)
      }
    }
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '70%'
          }
        },
        dataLabels: {
          style: {
            fontSize: '9px'
          }
        },
        legend: {
          fontSize: '12px'
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            },
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: false
          }
        }
      }
    }
  ]
}))
</script>

<style scoped>
:deep(.apexcharts-legend) {
  overflow: visible !important;
  max-height: none !important;
}

:deep(.apexcharts-legend-series) {
  margin-bottom: 5px !important;
}
</style>
