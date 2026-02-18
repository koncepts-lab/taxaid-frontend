<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    style="background: linear-gradient(180deg, #00A176 0%, #004E3F 100%);">
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
               class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100"
             />
      </div>
    </div>

    <!-- Chart Area -->
    <div class="flex-1 min-h-0 mt-6">
      <ClientOnly>
        <apexchart width="100%" height="100%" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()

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
    axisTicks: { show: false }
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
      const month = w.globals.labels[dataPointIndex];
      const realValue = series[0][dataPointIndex];
      const hypoValue = series[1][dataPointIndex];
      
      // Calculate decline percentage
      const currentYear = 4.6;
      const previousYear = 4.7;
      const decline = ((currentYear - previousYear) / previousYear * 100).toFixed(1);
      
      const currentYearLabel = currentLang.value === 'ar' ? 'السنة الحالية: ' : 'Current Year: ';
      const previousYearLabel = currentLang.value === 'ar' ? 'السنة السابقة: ' : 'Previous Year: ';
      const declineLabel = currentLang.value === 'ar' ? 'الانخفاض: ' : 'Decline: ';
      
      return '<div class="px-4 py-3 bg-white rounded-lg shadow-xl border-none" style="min-width: 180px;">' +
        '<div class="font-semibold mb-2 text-[#000] text-[13px]">' + month + '</div>' +
        '<div class="text-[#000] text-[12px] mb-1">' + currentYearLabel + '<span class="font-semibold">AED ' + currentYear.toFixed(1) + 'M</span></div>' +
        '<div class="text-[#000] text-[12px] mb-1">' + previousYearLabel + '<span class="font-semibold">AED ' + previousYear.toFixed(1) + 'M</span></div>' +
        '<div class="text-[12px]">' + declineLabel + '<span class="font-semibold text-[#FF582F]">' + decline + '%</span></div>' +
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
