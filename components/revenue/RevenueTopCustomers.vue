<template>
  <div class="rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500"
    :class="isDark ? 'bg-[#00141080] border-none shadow-none' : 'bg-white shadow-sm border border-gray-100'">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:justify-between items-start gap-4 lg:gap-0 mb-6 w-full z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإيرادات - أفضل 10 عملاء حسب القيمة' : 'Revenue - Top 10 Customers by value' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
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
        <div class="flex items-center gap-4 lg:ml-4">
          <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
          <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand" class="w-6 h-6 cursor-pointer opacity-60 hidden lg:block" @click="isModalOpen = true" />
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[350px] relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-[#04C18F] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium" :class="isDark ? 'text-white/80' : 'text-[#013E32]'">{{ currentLang === 'ar' ? 'جاري التحميل...' : 'Loading Data...' }}</p>
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

      <ClientOnly v-if="!loading && !error">
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Bottom Legend Grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-4 mt-0">
      <div v-for="item in customers" :key="item.id" class="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
        <span class="text-[12px] font-regular" :style="{ color: item.color }">{{ item.id }}</span>
        <span class="text-[12px] font-regular truncate" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">- {{ item.displayName }}</span>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-start py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular leading-tight" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإيرادات - أفضل 10 عملاء حسب القيمة' : 'Revenue - Top 10 Customers by value' }}</h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
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
              <div class="flex items-center gap-4">
                <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-5 h-5 cursor-pointer hover:opacity-100" />
                <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                  <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[350px]" :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
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

            <ClientOnly v-if="!loading && !error">
              <apexchart
                type="line"
                height="100%"
                :options="chartOptions"
                :series="series"
              />
            </ClientOnly>
          </div>

          <!-- Bottom Legend Grid -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-4 mt-0 px-8 pb-8" :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
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

const { loading, error, topCustomersData, fetchAll: fetchTopCustomers } = useRevenue()

const customersData = computed(() => topCustomersData.value?.customers ?? [])
const cumulativePct = computed(() => topCustomersData.value?.cumulative ?? [])

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
    data: customersData.value.map((c: any) => c.value)
  },
  {
    name: 'Cumulative %',
    type: 'line',
    data: cumulativePct.value
  }
])

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
    offsetY: -25,
    style: {
      fontSize: '12px',
      colors: [isDark.value ? '#00E0A5CF' : '#013E32CF'],
      fontWeight: 500
    },
    background: {
      enabled: false,
    },
    formatter: (val) => val.toString().replace(',', '.') + "M"
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
      // Dynamically set max based on data
      max: Math.ceil(Math.max(...customersData.value.map((c: any) => c.value), 1)),
      tickAmount: 5,
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
        formatter: (val) => val === 0 ? "0" : val + "M"
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
        formatter: (val) => val + "%"
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
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const customer = customersData.value[dataPointIndex]
      if (!customer) return ''
      
      const customerName = currentLang.value === 'ar' ? customer.nameAr : customer.name
      const rev = series[0][dataPointIndex]
      const cum = series[1][dataPointIndex]
      
      const revLabel = currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue'
      const contLabel = currentLang.value === 'ar' ? 'المساهمات' : 'Contributions'

      // Using the global formatInMillions utility for the tooltip
      const formattedRev = formatInMillions(customer.value * 1000000, { showCurrency: false, suffix: 'M' })

      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${customerName}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${revLabel}:</span>
              <span class="value">AED ${formattedRev}</span>
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
