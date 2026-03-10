<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
       <!-- Title -->
      <div class="mb-4 lg:mb-2">
        <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? 'النفقات العامة مقابل الإيرادات' : 'Overhead vs Revenue' }}</h2>
        <p class="text-[12px] font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#333333BF]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium w-full lg:w-auto justify-between lg:justify-end">
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

    <!-- Chart Area -->
    <div class="flex-1 min-h-0 mt-6">
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
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#333333BF]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
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
               <img 
                :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" 
                alt="Info" 
                class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
              />
              <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
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
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const isModalOpen = ref(false)

const chartSeries = [
  {
    name: 'Overhead',
    data: [1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
  },
  {
    name: 'Revenue',
    data: [2.6, 2.8, 3.0, 3.2, 3.4, 3.6]
  }
];

const chartOptions = computed(() => ({
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
      columnWidth: '40%',
      borderRadius: 4,
      dataLabels: { position: 'top' }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val + 'M',
    offsetY: -35,
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
    categories: currentLang.value === 'ar' 
      ? ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
      : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    labels: {
        style: { colors: isDark.value ? '#FFFFFFBF' : '#333333BF', fontSize: '13px', fontWeight: 400 }
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
    custom: function({series, seriesIndex, dataPointIndex, w}: any) {
      const months = currentLang.value === 'ar' 
        ? ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
        : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const monthName = months[dataPointIndex];
      
      const overhead = series[0][dataPointIndex];
      const revenue = series[1][dataPointIndex];
      const ratio = ((overhead / revenue) * 100).toFixed(1);
      
      const revenueLabel = currentLang.value === 'ar' ? 'الإيرادات: ' : 'Revenue: ';
      const overheadLabel = currentLang.value === 'ar' ? 'النفقات العامة: ' : 'Overhead: ';
      const ratioLabel = currentLang.value === 'ar' ? 'نسبة النفقات العامة: ' : 'Overhead Ratio: ';
      
      return '<div class="px-5 py-4 bg-[#E2F9F4] rounded-xl shadow-xl border-none" style="min-width: 220px;">' +
        '<div class="font-bold mb-2 text-[#000] text-[16px]">' + monthName + '</div>' +
        '<div class="text-[#333] text-[14px] mb-1">' + revenueLabel + '<span class="font-bold text-[#007965]"> AED ' + revenue + 'M</span></div>' +
        '<div class="text-[#333] text-[14px] mb-1">' + overheadLabel + '<span class="font-bold text-[#D48806]"> AED ' + overhead + 'M</span></div>' +
        '<div class="text-[#333] text-[14px]">' + ratioLabel + '<span class="font-bold text-[#007965]"> ' + ratio + '%</span></div>' +
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
              colors: isDark.value ? '#FFFFFF' : '#333333'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (value: number) => Math.abs(value).toFixed(0) + ' M',
            style: {
              fontSize: '11px',
              colors: isDark.value ? '#FFFFFF' : '#333333'
            }
          },
          axisBorder: {
            show: true,
            color: isDark.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
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
/* Custom styles */
</style>
