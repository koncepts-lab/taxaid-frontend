<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
      
       <!-- Title -->
      <div class="mb-4 lg:mb-2">
        <h2 class="text-[16px] font-regular text-white">{{ currentLang === 'ar' ? `التدفق النقدي بناءً على السيناريو (${fyLabel})` : `Cash flow based on Scenario (${fyLabel})` }}</h2>
        <p class="text-[12px] font-regular mt-1 text-[#FFFFFFCF]">{{ valuesNote(unit === 'millions') }}</p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium w-full lg:w-auto justify-between lg:justify-end">
             <div class="flex items-center gap-3 lg:gap-4">
               <div class="flex items-center gap-1.5">
                 <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#FF7B5F]"></span>
                 <span class="text-white">{{ currentLang === 'ar' ? 'سيناريو افتراضي' : 'Hypothetical Scenario' }}</span>
               </div>
               <div class="flex items-center gap-1.5">
                 <span class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#00FFBC]"></span>
                 <span class="text-white">{{ currentLang === 'ar' ? 'سيناريو حقيقي' : 'Real Scenario' }}</span>
               </div>
             </div>
             <div class="flex items-center gap-3 lg:gap-4">
               <CommonUnitToggle :on-dark="true" storage-key="cash_flow_scenario_unit" />
               <CommonInfoTooltip tip="cashFlow.chart" light align="right" />
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
    <div class="flex-1 min-h-[300px] lg:min-h-0 mt-6 md:mt-6">
      <ClientOnly>
        <CommonApexBarChart :key="chartKey" width="100%" height="100%" type="line" :options="chartOptions" :series="chartSeries" />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" :style="isDark ? { background: '#015645' } : { background: 'linear-gradient(180deg, #00A176 0%, #004E3F 100%)' }" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular text-white">{{ currentLang === 'ar' ? `التدفق النقدي بناءً على السيناريو (${fyLabel})` : `Cash flow based on Scenario (${fyLabel})` }}</h2>
              <p class="text-xs font-regular mt-1 text-[#FFFFFFCF]">{{ valuesNote(unit === 'millions') }}</p>
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
              <CommonUnitToggle :on-dark="true" storage-key="cash_flow_scenario_unit" />
               <CommonInfoTooltip tip="cashFlow.chart" light align="right" />
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>

          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 min-h-[350px]">
             <ClientOnly>
               <CommonApexBarChart :key="chartKey" width="100%" height="100%" type="line" :options="chartOptions" :series="chartSeries" />
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
const { code: currencyCode, valuesNote } = useCurrency()
const { unit, fmt, axisFmt, axisFor, plotter } = useChartHelper('cash_flow_scenario_unit')
const isModalOpen = ref(false)

const { scenarioChart, fyLabel, fallbackMonths } = useCashFlow()

const rawSeries = computed(() => scenarioChart.value?.series ?? [])
const peak = computed(() => Math.max(0, ...rawSeries.value.flatMap(s => s.dataRaw ?? [])))

const chartSeries = computed(() => {
  const plot = plotter(peak.value)
  return rawSeries.value.map(s => ({
    name: currentLang.value === 'ar' ? (s.nameAr || s.name) : s.name,
    data: (s.dataRaw ?? []).map(plot)
  }))
})

// CommonApexBarChart only redraws when options/series change identity, so tie a key to unit so toggling forces that
const chartKey = computed(() => JSON.stringify([unit.value, scenarioChart.value?.categories, rawSeries.value.map(s => s.dataRaw)]))

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
      ? (scenarioChart.value?.categoriesAr || [])
      : (scenarioChart.value?.categories || []),
    labels: {
        style: { colors: '#FFFFFF', fontSize: '13px', fontWeight: 500 }
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false }
  },
  yaxis: {
    min: 0,
    max: axisFor(peak.value).max,
    tickAmount: axisFor(peak.value).ticks,
    labels: {
      formatter: (value: number) => value === 0 ? '0' : axisFmt(value),
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
    custom: function({dataPointIndex}: any) {
      const categories = currentLang.value === 'ar'
        ? (scenarioChart.value?.categoriesAr || [])
        : (scenarioChart.value?.categories || []);
      const monthName = categories[dataPointIndex] ?? '';
      const rawMonth = scenarioChart.value?.categories?.[dataPointIndex] ?? '';
      const isFallback = fallbackMonths.value.includes(rawMonth);

      const realVal = rawSeries.value[0]?.dataRaw?.[dataPointIndex] ?? 0;
      const hypoVal = rawSeries.value[1]?.dataRaw?.[dataPointIndex] ?? 0;
      const changePct = realVal ? (((hypoVal - realVal) / Math.abs(realVal)) * 100).toFixed(1) : '0.0';

      const realLabel = currentLang.value === 'ar' ? 'سيناريو حقيقي: ' : 'Real Scenario: ';
      const hypoLabel = currentLang.value === 'ar' ? 'سيناريو افتراضي: ' : 'Hypothetical Scenario: ';
      const changeLabel = currentLang.value === 'ar' ? 'التغير: ' : 'Change: ';
      const fallbackNote = currentLang.value === 'ar' ? 'هذه بيانات العام السابق، حيث لم يتم رفع موازنة لهذا الشهر بعد' : 'This is last year\'s data, as no budget has been uploaded for this month yet';

      return '<div class="px-5 py-4 rounded-xl shadow-xl border-none" style="min-width: 200px; background: #ffffff;">' +
        '<div class="font-bold mb-2 text-[16px]" style="color: #1A1A1A;">' + monthName + '</div>' +
        (isFallback ? '<div class="text-[12px] mb-2 font-medium" style="color: #FF7B5F;">ⓘ ' + fallbackNote + '</div>' : '') +
        '<div class="text-[14px] mb-1" style="color: #1A1A1A;">' + realLabel + '<span class="font-medium"> ' + currencyCode.value + ' ' + fmt(realVal) + '</span></div>' +
        '<div class="text-[14px] mb-1" style="color: #1A1A1A;">' + hypoLabel + '<span class="font-medium"> ' + currencyCode.value + ' ' + fmt(hypoVal) + '</span></div>' +
        '<div class="text-[14px]" style="color: #1A1A1A;">' + changeLabel + '<span class="font-bold text-[#FF7B5F]"> ' + changePct + '%</span></div>' +
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
            formatter: (value: number) => value === 0 ? '0' : axisFmt(Math.abs(value)),
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

:deep(.dark-mode-bg .apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
