<template>
  <div class="rounded-3xl p-8 h-full flex flex-col transition-all duration-500"
    :class="isDark ? 'bg-[#00141080] border-none shadow-none' : 'bg-white shadow-sm border border-gray-100'">
    <div class="flex justify-between items-start mb-4">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-normal leading-tight" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإيرادات حسب الفئة' : 'Revenue by category' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-3">
        <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand" class="w-6 h-6 cursor-pointer opacity-80 hidden lg:block" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="flex-1 w-full min-h-[400px] relative"> 
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-[#0BD9A4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px] rounded-2xl">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-xs font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
        </div>
      </div>

      <ClientOnly v-if="!loading && !error">
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div class="flex flex-col">
              <h2 class="text-lg font-normal leading-tight" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإيرادات حسب الفئة' : 'Revenue by category' }}</h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-4">
              <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-5 h-5 cursor-pointer hover:opacity-100" />
              <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10" :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
            <ClientOnly>
              <apexchart
                type="bar"
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

const series = computed(() => {
  const dataSeries = props.data?.series ?? []
  return dataSeries.map(s => ({
    name: currentLang.value === 'ar' ? (s.nameAr || s.name) : s.name,
    data: s.data
  }))
})

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
    offsetY: -30,
    style: {
      fontSize: '10px',
      colors: ['#46867E'],
      fontWeight: 400,
    },
    formatter: function (val) {
      if (currentLang.value === 'ar') {
        return val.toString() + " مليون"
      }
      return val.toString() + "M"
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: currentLang.value === 'ar' ? (props.data?.categoriesAr || []) : (props.data?.categories || []),
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
    max: Math.ceil(Math.max(...series.value.flatMap(s => s.data), 1)),
    tickAmount: 6,
    labels: {
      style: {
        fontSize: '12px',
        colors: '#A6A6A6',
        fontWeight: 400
      },
      formatter: (value) => {
        if (currentLang.value === 'ar') {
          return value === 0 ? "0" : Math.floor(value) + " مليون"
        }
        return value === 0 ? "0" : Math.floor(value) + "M"
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
    enabled: false
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
            fontSize: '10px'
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
/* Adjust ApexCharts default font styles if necessary */
:deep(.apexcharts-legend) {
  overflow: visible !important;
  max-height: none !important;
}

:deep(.apexcharts-legend-series) {
  margin-bottom: 5px !important;
}
</style>
