<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
      
       <!-- Title -->
      <div class="mb-2">
        <h2 class="text-[16px] font-regular text-white">{{ currentLang === 'ar' ? 'التدفق النقدي بناءً على السيناريو (2025-26)' : 'Cash flow based on Scenario (2025-26)' }}</h2>
        <p class="text-[12px] font-regular mt-1 text-[#FFFFFFCF]">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-4 text-xs font-medium">
             <div class="flex items-center gap-1.5">
               <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
               <span class="text-white">{{ currentLang === 'ar' ? 'سيناريو افتراضي' : 'Hypothetical Scenario' }}</span>
             </div>
             <div class="flex items-center gap-1.5">
               <span class="w-3 h-3 rounded-full bg-[#00FFBC]"></span>
               <span class="text-white">{{ currentLang === 'ar' ? 'سيناريو حقيقي' : 'Real Scenario' }}</span>
             </div>
             <img 
               :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-white.svg'" 
               alt="Expand" 
               class="w-6 h-6 cursor-pointer hover:opacity-100"
               @click="isModalOpen = true"
             />
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
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular text-white">{{ currentLang === 'ar' ? 'التدفق النقدي بناءً على السيناريو (2025-26)' : 'Cash flow based on Scenario (2025-26)' }}</h2>
              <p class="text-xs font-regular mt-1 text-[#FFFFFFCF]">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
                  <span class="text-white">{{ currentLang === 'ar' ? 'سيناريو افتراضي' : 'Hypothetical Scenario' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#00FFBC]"></span>
                  <span class="text-white">{{ currentLang === 'ar' ? 'سيناريو حقيقي' : 'Real Scenario' }}</span>
                </div>
              </div>
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
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const isModalOpen = ref(false)

const chartSeries = [
  {
    name: 'Real Scenario',
    data: [2.6, 2.8, 2.9, 3.1, 2.4, 2.0, 2.5, 3.5, 3.8, 3.2, 3.5, 3.8, 3.5, 3.8, 4.0, 3.5, 3.8, 2.5]
  },
  {
    name: 'Hypothetical Scenario',
    data: [2.6, 2.2, 1.8, 1.2, 0.8, 1.5, 2.5, 3.2, 3.5, 2.8, 1.0, 0.8, 1.2, 1.8, 1.5, 1.2, 0.8, 2.5]
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
  fill: {
    type: 'solid',
    opacity: 1
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: currentLang.value === 'ar' 
      ? ['مايو', '', '', 'يونيو', '', '', 'يوليو', '', '', 'أغسطس', '', '', 'سبتمبر', '', '', 'أكتوبر', '', '']
      : ['May', '', '', 'Jun', '', '', 'Jul', '', '', 'Aug', '', '', 'Sep', '', '', 'Oct', '', ''],
    labels: {
        style: { colors: '#FFFFFF', fontSize: '13px', fontWeight: 500 }
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false }
  },
  yaxis: {
    min: 0,
    max: 4.5,
    tickAmount: 4,
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
      const months = currentLang.value === 'ar' 
        ? ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
        : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const monthName = months[Math.floor(dataPointIndex / 3)];
      
      // Values matched to design image but with standard tooltip styling
      const currentYear = 4.6;
      const previousYear = 4.7;
      const decline = "-3.2%";
      
      const currentYearLabel = currentLang.value === 'ar' ? 'السنة الحالية: ' : 'Current Year: ';
      const previousYearLabel = currentLang.value === 'ar' ? 'السنة السابقة: ' : 'Previous Year: ';
      const declineLabel = currentLang.value === 'ar' ? 'الانخفاض: ' : 'Decline: ';
      
      return '<div class="px-5 py-4 bg-white rounded-xl shadow-xl border-none" style="min-width: 200px;">' +
        '<div class="font-bold mb-2 text-[#000] text-[16px]">' + monthName + '</div>' +
        '<div class="text-[#000] text-[14px] mb-1">' + currentYearLabel + '<span class="font-medium"> AED ' + currentYear.toFixed(1).replace('.', ',') + 'M</span></div>' +
        '<div class="text-[#000] text-[14px] mb-1">' + previousYearLabel + '<span class="font-medium"> AED ' + previousYear.toFixed(1).replace('.', ',') + 'M</span></div>' +
        '<div class="text-[#000] text-[14px]">' + declineLabel + '<span class="font-bold text-[#FF7B5F]"> ' + decline + '</span></div>' +
        '</div>'
    }
  }
}));
</script>

<style scoped>
@keyframes sweep-right {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

:deep(.apexcharts-series) {
  animation: sweep-right 1.5s ease-out forwards;
  animation-delay: 0.5s;
  clip-path: inset(0 100% 0 0);
}

:deep(.apexcharts-tooltip) {
  background: white !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
