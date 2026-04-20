<template>
  <div class="rounded-[20px] p-5 flex flex-col h-auto md:h-[250px] group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Cashflow'"
    @mouseleave="hoveredMenuItem = null">
    
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      
       <!-- Title & Icon -->
      <div class="flex flex-col gap-2 mb-4 md:mb-0 w-full md:w-auto">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0" 
            :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }">
            <img src="/images/icons/Cashflow-black.svg" alt="Cashflow" class="w-5 h-5 object-contain">
          </div>
          <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'التدفق النقدي' : 'Cashflow' }}</div>
        </div>
        
        <!-- Mobile: Time Filters -->
        <div class="flex md:hidden gap-2 mt-1">
          <button v-for="t in (cashflow?.periodFilters ?? ['3M', '6M', '1Y'])" :key="t" 
            class="px-4 h-[25px] flex items-center justify-center rounded-full text-xs font-semibold transition-colors"
            :class="[
              t === (cashflow?.defaultFilter ?? '6M') 
                ? (isDark ? 'bg-white text-[#003d35]' : 'text-white bg-[#003d35] shadow-lg') 
                : (isDark ? 'bg-white/10 text-white' : 'bg-[#E0E7E6] text-[#003d35]')
            ]">
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Desktop: Legend & Hover Icon -->
      <div class="hidden md:flex items-center gap-3 text-xs font-medium">
             <div class="flex items-center gap-1">
               <span class="w-3 h-3 rounded-full" :style="{ background: hypoColor }"></span>
               <span class="transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#191919]'">{{ currentLang === 'ar' ? (cashflow?.labelsAr?.hypothetical ?? 'سيناريو افتراضي') : (cashflow?.labels?.hypothetical ?? 'Hypothetical Scenario') }}</span>
             </div>
             <div class="flex items-center gap-1">
               <span class="w-3 h-3 rounded-full" :style="{ background: realColor }"></span>
               <span class="transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#191919]'">{{ currentLang === 'ar' ? (cashflow?.labelsAr?.real ?? 'سيناريو حقيقي') : (cashflow?.labels?.real ?? 'Real Scenario') }}</span>
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

      <!-- Desktop: Vertical Time Filters -->
      <div class="hidden md:flex flex-col gap-2 pt-2 shrink-0">
          <button v-for="t in (cashflow?.periodFilters ?? ['3M', '6M', '1Y'])" :key="t"
            class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-semibold transition-colors"
            :class="[
              t === (cashflow?.defaultFilter ?? '6M')
                ? (isDark ? 'bg-white text-[#003d35]' : 'text-white bg-[#003d35] shadow-lg')
                : (isDark ? 'bg-white/10 text-white' : 'bg-[#E0E7E6] text-[#003d35]')
            ]">
            {{ t }}
          </button>
      </div>
    </div>

    <!-- Mobile: Legend -->
    <div class="flex md:hidden items-center justify-between gap-3 text-xs font-medium mt-2 pt-2 border-t border-gray-100/10 w-full">
         <div class="flex gap-4">
           <div class="flex items-center gap-1">
             <span class="w-2.5 h-2.5 rounded-full bg-[#FF7B5F]"></span>
             <span class="transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#191919]'">{{ currentLang === 'ar' ? 'افتراضي' : 'Hypothetical' }}</span>
           </div>
           <div class="flex items-center gap-1">
             <span class="w-2.5 h-2.5 rounded-full bg-[#00B794]"></span>
             <span class="transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#191919]'">{{ currentLang === 'ar' ? 'حقيقي' : 'Real' }}</span>
           </div>
         </div>
         <img
           src="/images/icons/right-hover-2.svg"
           alt="Arrow"
           class="w-[30px] h-[30px] transition-all duration-300"
           :class="isHovered ? 'opacity-100' : 'opacity-0'"
         />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Cashflow')
const { isDark } = useTheme()

// ── Pull values from website-data.json ────────────────────────────────────
const { cashflow } = useMainDashboard()

const chartSeries = computed(() => [
  {
    name: cashflow.value?.labels?.real ?? 'Real Scenario',
    data: cashflow.value?.series?.realScenario ?? [2.6, 2.1, 2.5, 1.7, 2.5, 4.0, 2.9, 3.6, 2.8, 1.4, 1.9, 1.5, 3.2, 2.6, 4.1, 4.0]
  },
  {
    name: cashflow.value?.labels?.hypothetical ?? 'Hypothetical Scenario',
    data: cashflow.value?.series?.hypotheticalScenario ?? [1.4, 0.8, 1.2, 0.9, 1.1, 2.8, 2.0, 2.3, 1.8, 1.3, 0.5, 1.5, 0.3, 2.0, 1.9, 2.9]
  }
])

const chartCategories = computed(() =>
  cashflow.value?.chartCategories ?? ['May','','','Jun','','','Jul','','','Aug','','','Sep','','','Oct']
)

const realColor = computed(() => cashflow.value?.colors?.realScenario ?? '#00B794')
const hypoColor = computed(() => cashflow.value?.colors?.hypotheticalScenario ?? '#FF7B5F')
const yMax      = computed(() => cashflow.value?.yAxis?.max ?? 4.5)

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false }
  },
  legend: { show: false },
  colors: [realColor.value, hypoColor.value],
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
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: currentLang.value === 'ar'
      ? (cashflow.value?.chartCategories?.map((_: string, i: number) =>
          ['مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر'].flatMap((m: string) => [m,'',''])[i] ?? '')
        ?? ['مايو','','','يونيو','','','يوليو','','','أغسطس','','','سبتمبر','','','أكتوبر'])
      : chartCategories.value,
    labels: {
      style: { colors: isDark.value ? '#9CA3AF' : '#9CA3AF', fontSize: '12px' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 0,
    max: yMax.value,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => value.toFixed(0) + (cashflow.value?.yAxis?.unit ?? 'M'),
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
      const month = currentLang.value === 'ar' ? 'يوليو' : (cashflow.value?.tooltipSample?.month ?? 'July');
      const realLabel = currentLang.value === 'ar' ? 'حقيقي: ' : 'Real: ';
      const hypoLabel = currentLang.value === 'ar' ? 'افتراضي: ' : 'Hypothetical: ';
      const realVal = cashflow.value?.tooltipSample?.real ?? 'AED 2.5M';
      const hypoVal = cashflow.value?.tooltipSample?.hypothetical ?? 'AED 1.2M';
      return `<div class="px-3 py-2 bg-[#DFFFF6] text-[#003d35] rounded-lg shadow-lg border-none text-xs">
        <div class="font-bold mb-1">${month}</div>
        <div class="flex items-center gap-2 mb-1"><span class="w-2 h-2 rounded-full" style="background:${realColor.value}"></span><span>${realLabel}${realVal}</span></div>
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full" style="background:${hypoColor.value}"></span><span>${hypoLabel}${hypoVal}</span></div>
      </div>`
    }
  },
  annotations: {
    xaxis: [{ x: cashflow.value?.annotationMonth ?? 'Jul', borderColor: realColor.value, strokeDashArray: 0, borderWidth: 2, opacity: 1 }],
    points: [
      { x: cashflow.value?.annotationMonth ?? 'Jul', y: 3.6, marker: { size: 6, fillColor: '#fff', strokeColor: realColor.value, strokeWidth: 3 } },
      { x: cashflow.value?.annotationMonth ?? 'Jul', y: 2.3, marker: { size: 6, fillColor: '#fff', strokeColor: realColor.value, strokeWidth: 3 } }
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
