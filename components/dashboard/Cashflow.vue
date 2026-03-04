<template>
  <div class="rounded-[20px] p-5 flex flex-col h-[250px] group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Cashflow'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      
       <!-- Title & Icon -->
      <div class="flex items-center gap-3 mb-4 md:mb-0">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl" 
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }">
          <img src="/images/icons/Cashflow-black.svg" alt="Cashflow" class="w-5 h-5 object-contain">
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'التدفق النقدي' : 'Cashflow' }}</div>
      </div>

      <!-- Legend & Filters & Hover Icon -->
      <div class="flex items-center gap-3 text-xs font-medium">
             <div class="flex items-center gap-1">
               <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
               <span class="transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#191919]'">{{ currentLang === 'ar' ? 'سيناريو افتراضي' : 'Hypothetical Scenario' }}</span>
             </div>
             <div class="flex items-center gap-1">
               <span class="w-3 h-3 rounded-full bg-[#00B794]"></span>
               <span class="transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#191919]'">{{ currentLang === 'ar' ? 'سيناريو حقيقي' : 'Real Scenario' }}</span>
             </div>
             <img
               src="/images/icons/right-hover-2.svg"
               alt="Arrow"
               class="w-[35px] h-[35px] transition-all duration-300 ml-2"
               :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
             />
      </div>
    </div>

    <!-- Chart & Filters Area -->
    <div class="flex gap-3">
      <!-- Chart -->
      <div class="flex-1 h-[180px]">
        <ClientOnly>
          <apexchart width="100%" height="100%" type="area" :options="chartOptions" :series="chartSeries"></apexchart>
        </ClientOnly>
      </div>

      <!-- Vertical Time Filters -->
      <div class="flex flex-col gap-2 pt-2 shrink-0">
          <button class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-semibold transition-colors"
            :class="isDark ? 'bg-white/10 text-white' : 'bg-[#E0E7E6] text-[#003d35]'">3M</button>
          <button class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-semibold transition-colors shadow-lg"
            :class="isDark ? 'bg-white text-[#003d35]' : 'text-white bg-[#003d35]'">6M</button>
          <button class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-semibold transition-colors"
            :class="isDark ? 'bg-white/10 text-white' : 'bg-[#E0E7E6] text-[#003d35]'">1Y</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Cashflow')
const { isDark } = useTheme()

const seriesData = {
  real: [2.8, 2.1, 2.5, 1.7, 2.3, 4.0, 4.2, 3.1, 3.6, 3.0, 3.0, 1.4, 1.9, 1.5, 1.8, 3.0, 3.4, 3.6, 4.1, 3.9],
  hypothetical: [1.5, 0.8, 0.9, 1.2, 1.0, 0.9, 1.3, 2.7, 2.8, 2.2, 2.3, 1.8, 2.2, 1.2, 0.6, 1.8, 1.4, 0.4, 1.0, 1.0]
};

// Rebuilding data to roughly match the curve visualization
const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const chartSeries = [
  {
    name: 'Real Scenario',
    data: [2.6, 2.1, 2.5, 1.7, 2.5, 4.0, 2.9, 3.6, 2.8, 1.4, 1.9, 1.5, 3.2, 2.6, 4.1, 4.0]
  },
  {
    name: 'Hypothetical Scenario',
    data: [1.4, 0.8, 1.2, 0.9, 1.1, 2.8, 2.0, 2.3, 1.8, 1.3, 0.5, 1.5, 0.3, 2.0, 1.9, 2.9]
  }
];

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false }
  },
  legend: { show: false },
  colors: ['#00B794', '#FF7B5F'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3
  },
    xaxis: {
    categories: currentLang.value === 'ar' 
      ? ['مايو', '', '', 'يونيو', '', '', 'يوليو', '', '', 'أغسطس', '', '', 'سبتمبر', '', '', 'أكتوبر']
      : ['May', '','', 'Jun', '','', 'Jul', '','', 'Aug', '','', 'Sep', '','', 'Oct'],
    labels: {
        style: { colors: isDark.value ? '#9CA3AF' : '#9CA3AF', fontSize: '12px' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 0,
    max: 4.5,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => value.toFixed(0) + 'M',
      style: { colors: isDark.value ? '#6B7280' : '#9CA3AF', fontSize: '12px' }
    }
  },
  grid: {
    borderColor: isDark.value ? '#374151' : '#f3f4f6',
    strokeDashArray: 0,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  tooltip: {
    custom: function({series, seriesIndex, dataPointIndex, w}: any) {
      const month = currentLang.value === 'ar' ? 'يوليو' : 'July';
      const realLabel = currentLang.value === 'ar' ? 'حقيقي: ' : 'Real: ';
      const hypoLabel = currentLang.value === 'ar' ? 'افتراضي: ' : 'Hypothetical: ';
      return '<div class="px-3 py-2 bg-[#DFFFF6] text-[#003d35] rounded-lg shadow-lg border-none text-xs">' +
        '<div class="font-bold mb-1">' + month + '</div>' +
        '<div class="flex items-center gap-2 mb-1"><span class="w-2 h-2 rounded-full bg-[#00B794]"></span><span>' + realLabel + 'AED 2.5M</span></div>' +
        '<div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#FF7B5F]"></span><span>' + hypoLabel + 'AED 1.2M</span></div>' +
        '</div>'
    }
  },
  annotations: {
      xaxis: [
          {
              x: 'Jul',
              borderColor: '#00B794',
              strokeDashArray: 0,
              borderWidth: 2,
              opacity: 1,
          }
      ],
      points: [
          {
              x: 'Jul',
              y: 3.6,
              marker: {
                  size: 6,
                  fillColor: '#fff',
                  strokeColor: '#00B794',
                  strokeWidth: 3
              }
          },
          {
              x: 'Jul',
              y: 2.3,
              marker: {
                  size: 6,
                  fillColor: '#fff',
                  strokeColor: '#00B794', // Using green stroke for both markers on the green line/vertical line
                  strokeWidth: 3
              }
          }
      ]
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
</style>
