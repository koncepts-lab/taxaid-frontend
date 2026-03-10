<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
       <!-- Title -->
      <div class="mb-4 lg:mb-2">
        <h2 class="text-[16px] font-regular text-white">{{ currentLang === 'ar' ? 'اتحاهات النفقات العامة مع السنة السابقة' : 'Overhead Trends with Previous year' }}</h2>
        <p class="text-[12px] font-regular mt-1 text-[#FFFFFFCF]">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium w-full lg:w-auto justify-between lg:justify-end">
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

    <!-- Chart Area -->
    <div class="flex-1 min-h-0 mt-6">
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
              <h2 class="text-lg font-regular text-white">{{ currentLang === 'ar' ? 'اتحاهات النفقات العامة مع السنة السابقة' : 'Overhead Trends with Previous year' }}</h2>
              <p class="text-xs font-regular mt-1 text-[#FFFFFFCF]">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
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
               <apexchart width="100%" height="100%" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
             </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const isModalOpen = ref(false)

const chartSeries = [
  {
    name: 'Current Year',
    data: [0.8, 1.2, 3.8, 1.5, 3.8, 2.5, 4.0]
  },
  {
    name: 'Previous Year',
    data: [2.5, 1.5, 3.5, 0.8, 2.5, 1.5, 2.6]
  }
];

const chartOptions = computed(() => ({
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
    categories: currentLang.value === 'ar' 
      ? ['أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
      : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    labels: {
        style: { colors: '#FFFFFFBF', fontSize: '13px', fontWeight: 400 }
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false }
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => value.toFixed(0) + ' M',
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
    custom: function({series, seriesIndex, dataPointIndex, w}: any) {
      const months = currentLang.value === 'ar' 
        ? ['أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
        : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const monthName = months[dataPointIndex];
      
      const currentYearVal = series[0][dataPointIndex];
      const previousYearVal = series[1][dataPointIndex];
      const diff = ((currentYearVal - previousYearVal) / previousYearVal * 100).toFixed(1);
      
      const currentLabel = currentLang.value === 'ar' ? 'السنة الحالية: ' : 'Current Year: ';
      const previousLabel = currentLang.value === 'ar' ? 'السنة السابقة: ' : 'Previous Year: ';
      const diffLabel = currentLang.value === 'ar' ? 'التغير: ' : 'Decline: ';
      
      return '<div class="px-5 py-4 bg-[#E2F9F4] rounded-xl shadow-xl border-none" style="min-width: 200px;">' +
        '<div class="font-bold mb-2 text-[#000] text-[16px]">' + monthName + '</div>' +
        '<div class="text-[#333] text-[14px] mb-1">' + currentLabel + '<span class="font-bold"> AED ' + currentYearVal + 'M</span></div>' +
        '<div class="text-[#333] text-[14px] mb-1">' + previousLabel + '<span class="font-bold"> AED ' + previousYearVal + 'M</span></div>' +
        '<div class="text-[#333] text-[14px]">' + diffLabel + '<span class="font-bold text-[#FF582F]"> ' + diff + '%</span></div>' +
        '</div>'
    }
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
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
            formatter: (value: number) => Math.abs(value).toFixed(0) + ' M',
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
@keyframes sweep-right {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}

:deep(.apexcharts-series) {
  animation: sweep-right 1.5s ease-out forwards;
  animation-delay: 0.5s;
  clip-path: inset(0 100% 0 0);
}

:deep(.apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
