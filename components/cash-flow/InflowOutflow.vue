<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :style="isDark ? { background: '#00141080' } : { background: 'linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%)' }">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
      
       <!-- Title -->
      <div class="mb-4 lg:mb-2">
        <h2 class="text-[16px] font-regular text-white">{{ currentLang === 'ar' ? 'التدفق الداخلي مقابل التدفق الخارجي' : 'Inflow vs Outflow' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white' : 'text-[#FFFFFF5C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium w-full lg:w-auto justify-between lg:justify-end">
             <div class="flex items-center gap-3 lg:gap-4">
               <div class="flex items-center gap-1.5">
                 <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#FF7B5F]"></span>
                 <span class="text-white font-regular">{{ currentLang === 'ar' ? 'التدفق الخارجي' : 'Outflow' }}</span>
               </div>
               <div class="flex items-center gap-1.5">
                 <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#00FFBC]"></span>
                 <span class="text-white font-regular">{{ currentLang === 'ar' ? 'التدفق الداخلي' : 'Inflow' }}</span>
               </div>
             </div>
             <div class="flex items-center gap-3 lg:gap-4">
               <img 
                 src="/images/icons/info-white.svg" 
                 alt="Info" 
                 class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
               />
               <img 
                 :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-white.svg'" 
                 alt="Expand" 
                 class="w-6 h-6 cursor-pointer hover:opacity-100 hidden lg:block"
                 @click="isModalOpen = true"
               />
             </div>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="flex-1 min-h-[300px] lg:min-h-0 mt-0 lg:mt-0">
      <ClientOnly>
        <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" :style="isDark ? { background: '#002e26' } : { background: 'linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%)' }" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular text-white">{{ currentLang === 'ar' ? 'التدفق الداخلي مقابل التدفق الخارجي' : 'Inflow vs Outflow' }}</h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white' : 'text-[#FFFFFF5C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
                  <span class="text-white font-regular">{{ currentLang === 'ar' ? 'التدفق الخارجي' : 'Outflow' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#00FFBC]"></span>
                  <span class="text-white font-regular">{{ currentLang === 'ar' ? 'التدفق الداخلي' : 'Inflow' }}</span>
                </div>
              </div>
               <img 
                src="/images/icons/info-white.svg" 
                alt="Info" 
                class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
              />
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
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
import { computed, ref } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const isModalOpen = ref(false)

const { inflowOutflow } = useCashFlow()

const chartSeries = computed(() => {
  const dataSeries = inflowOutflow.value?.series ?? []
  return dataSeries.map(s => ({
    name: currentLang.value === 'ar' ? (s.nameAr || s.name) : s.name,
    data: s.data
  }))
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false },
    background: 'transparent'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -30,
    style: {
      fontSize: '12px',
      colors: ['#00B793CF'],
      fontWeight: 400
    },
    formatter: function (val: number) {
      return val.toFixed(1) + 'M'
    }
  },
  legend: { show: false },
  colors: ['#FF7B5F', '#00FFBC'],
  stroke: {
    show: false
  },
  xaxis: {
    categories: currentLang.value === 'ar' 
      ? (inflowOutflow.value?.categoriesAr || [])
      : (inflowOutflow.value?.categories || []),
    labels: {
        style: { colors: '#FFFFFF', fontSize: '13px', fontWeight: 500 }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => value.toFixed(0) + 'M',
      style: { colors: '#FFFFFF', fontSize: '13px', fontWeight: 500 }
    },
    axisBorder: { 
      show: true,
      color: 'rgba(255, 255, 255, 0.3)',
      width: 1,
      offsetX: -2,
      offsetY: -2
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    custom: function({series, seriesIndex, dataPointIndex, w}: any) {
      const month = w.globals.labels[dataPointIndex];
      const inflowValue = series[1][dataPointIndex];
      const outflowValue = series[0][dataPointIndex];
      const netCashflow = inflowValue - outflowValue;
      const netPercentage = ((netCashflow / outflowValue) * 100).toFixed(1);
      
      const inflowLabel = currentLang.value === 'ar' ? 'التدفق الداخلي: ' : 'Inflow: ';
      const outflowLabel = currentLang.value === 'ar' ? 'التدفق الخارجي: ' : 'Outflow: ';
      const netCashflowLabel = currentLang.value === 'ar' ? 'صافي التدفق النقدي: ' : 'Net Cashflow: ';
      
      return '<div class="px-4 py-3 bg-white rounded-lg shadow-xl border-none" style="min-width: 180px;">' +
        '<div class="font-semibold mb-2 text-[#000] text-[13px]">' + month + '</div>' +
        '<div class="text-[#000] text-[12px] mb-1">' + inflowLabel + '<span class="font-semibold">AED ' + inflowValue.toFixed(1) + 'M</span></div>' +
        '<div class="text-[#000] text-[12px] mb-1">' + outflowLabel + '<span class="font-semibold">AED ' + outflowValue.toFixed(1) + 'M</span></div>' +
        '<div class="text-[12px]">' + netCashflowLabel + '<span class="font-semibold text-[#00A176]">+' + netPercentage + '%</span></div>' +
        '</div>'
    }
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '45%',
            borderRadius: 4
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
            formatter: (value: number) => Math.abs(value).toFixed(0) + 'M',
            style: {
              fontSize: '11px',
              colors: '#FFFFFF'
            }
          },
          axisBorder: {
            show: true,
            color: 'rgba(255, 255, 255, 0.3)',
            width: 1,
            offsetX: -2,
            offsetY: -2
          }
        }
      }
    }
  ]
}));
</script>

<style scoped>
:deep(.apexcharts-tooltip) {
  background: white !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
