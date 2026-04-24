<template>
  <div
    class="aging-graph-card rounded-3xl lg:p-8 p-4 max-lg:py-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-md "
    :style="isDark ? 'background: #00141080 !important' : ''">
    <!-- Header -->
    <div class="flex lg:flex-row flex-col max-lg:gap-2 justify-between items-start mb-4 text-white relative z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight">
          {{ currentLang === 'ar' ? 'الرسم البياني حسب التقادم' : 'Graph based on aging' }}
        </h2>
        <p class="text-[12px] font-regular mt-1 opacity-80">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center lg:gap-6 gap-3 lg:text-[13px] text-xs font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'نسبة تراكمية' : 'Cumulative %' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FFC107]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#04C18F]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
          </div>
        </div>
        <img src="/images/icons/expand-white.svg" alt="Expand"
          class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity max-lg:hidden"
          @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div v-if="hasData" class="flex-1 w-full min-h-[320px] relative z-10">
      <ClientOnly>
        <apexchart type="line" height="100%" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>
    <div v-else class="flex-1 flex items-center justify-center text-white/50 italic">
      {{ currentLang === 'ar' ? 'جاري تحميل البيانات...' : 'Loading aging data...' }}
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden aging-graph-card"
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular leading-tight">
                {{ currentLang === 'ar' ? 'الرسم البياني حسب التقادم' : 'Graph based on aging' }}
              </h2>
              <p class="text-xs font-regular mt-1 opacity-80">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-6 text-[13px] font-regular">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'نسبة تراكمية' : 'Cumulative %' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FFC107]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#04C18F]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false"
                class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 invert"
                  :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>

          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10">
            <ClientOnly v-if="hasData">
              <apexchart type="line" height="100%" :options="chartOptions" :series="series" />
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatToMillions } from '~/utils/formatters'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const props = defineProps({
  agingData: {
    type: Object,
    default: () => ({})
  }
})

const arabicBuckets = {
  "0 - 30 days": "أكثر من 30 يوم",
  "31 - 60 days": "31 - 60 يوم",
  "61 - 90 days": "61 - 90 يوم",
  "> 90 days": "أكثر من 90 يوم"
}
const hasData = computed(() => !!props.agingData?.comparison_data?.length)

const agingCategories = computed(() => {
  const source = props.agingData?.comparison_data?.[0]?.aging_summary || []
  const filtered = source.filter(item => item.bucket !== "Total AP")
  
  if (filtered.length === 0) {
    return [
      { en: 'Overdue >30 Days', ar: 'متأخر أكثر من 30 يوم' },
      { en: 'Overdue 30-60 Days', ar: 'متأخر 30-60 يوم' },
      { en: 'Overdue 60-90 Days', ar: 'متأخر 60-90 يوم' },
      { en: 'Overdue <90 Days', ar: 'متأخر أكثر من 90 يوم' }
    ]
  }

  return filtered.map(item => {
    const isFirstBucket = item.bucket === "0 - 30 days"
    let enLabel = isFirstBucket ? ">30 Days" : item.bucket
    
    enLabel = enLabel.replace(/days/g, "Days").replace(/>\s*90/, "<90")
    
    return {
      en: `Overdue ${enLabel}`,
      ar: `متأخر ${arabicBuckets[item.bucket] || item.bucket}`
    }
  })
})

const series = computed(() => {
  const compData = props.agingData?.comparison_data || []
  // Mapping first array as Current and second as Previous based on API logic
  const currentSummary = compData[0]?.aging_summary?.filter(i => i.bucket !== "Total AP") || []
  const previousSummary = compData[1]?.aging_summary?.filter(i => i.bucket !== "Total AP") || []

  return [
    {
      name: 'Previous Year',
      type: 'bar',
      data: previousSummary.map(item => Number(formatToMillions(item.value, 2).replace(/,/g, '')))
    },
    {
      name: 'Current Year',
      type: 'bar',
      data: currentSummary.map(item => Number(formatToMillions(item.value, 2).replace(/,/g, '')))
    },
    {
      name: 'Cumulative %',
      type: 'line',
      data: currentSummary.map(item => parseInt(item.cumulative_percentage || 0)),
      dataLabels: { enabled: false }
    }
  ]
})

const chartOptions = computed(() => {
  // UI FIX: Calculate dynamic max for Y-axis based on data to prevent values hitting the ceiling
  const allBarData = [...series.value[0].data, ...series.value[1].data]
  const rawMax = Math.max(...allBarData, 0)
  const dynamicMax = rawMax > 4 ? Math.ceil((rawMax * 1.1) / 5) * 5 : 5

  return {
    chart: {
      fontFamily: 'Noto Sans Arabic, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        columnWidth: 33,
        borderRadius: 15,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
        grouped: true
      }
    },
    stroke: {
      width: [0, 0, 2],
      curve: 'smooth',
      colors: ['transparent', 'transparent', '#FB7554']
    },
    colors: ['#FFDD7D', '#008D68', '#FB7554'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
      offsetY: -15, // Adjusted offset to clear dots
      background: { enabled: false },
      style: {
        fontSize: '11px',
        colors: ['#FFFFFFBF'],
        fontWeight: 400
      },
      formatter: (val, { seriesIndex }) => {
        if (val === 0) return '0'
        const formatted = val.toString().replace('.', ',') + 'M'
        return seriesIndex === 0 ? `${formatted}\u00A0\u00A0\u00A0\u00A0` : `\u00A0\u00A0\u00A0\u00A0${formatted}`
      }
    },
    markers: {
      size: [0, 0, 6],
      colors: ['transparent', 'transparent', '#FFC107'],
      strokeColors: ['transparent', 'transparent', '#FB7554'],
      strokeWidth: 2,
      hover: { size: 8 }
    },
    xaxis: {
      categories: agingCategories.value.map(c => currentLang.value === 'ar' ? c.ar : c.en),
      axisBorder: {
        show: true,
        color: '#00403399',
        height: 1,
        width: '100%'
      },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        style: {
          fontSize: '13px',
          colors: '#FFFFFFBF',
          fontWeight: 400
        }
      }
    },
    yaxis: [
      {
        seriesName: 'Previous Year',
        min: 0,
        max: dynamicMax, // UI FIX: dynamic instead of hardcoded 5
        tickAmount: 5,
        axisBorder: {
          show: true,
          color: '#00403399',
          width: 1
        },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: '13px', 
            colors: '#FFFFFFBF'
           },
          formatter: (val) => val === 0 ? '0' : Math.round(val) + 'M'
        }
      },
      {
        seriesName: 'Current Year',
        show: false,
        min: 0,
        max: dynamicMax
      },
      {
        seriesName: 'Cumulative %',
        opposite: true,
        min: 0,
        max: 100,
        tickAmount: 5,
        axisBorder: { show: true, color: '#00403399', width: 1 },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: '13px',
            colors: '#FFFFFFBF'
          },
          formatter: (val) => val + '%'
        }
      }
    ],
    grid: {
      borderColor: '#00403399',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { 
        top: 10, 
        right: 10, 
        bottom: 0, 
        left: 10 
      }
    },
    legend: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series: s, dataPointIndex }) {
        const currentSummary = props.agingData?.comparison_data?.[0]?.aging_summary?.filter(i => i.bucket !== "Total AP") || []
        const item = currentSummary[dataPointIndex]
        if (!item) return ''

        const isFirst = item.bucket === "0 - 30 days"
        let enDisp = isFirst ? ">30 Days" : item.bucket
        enDisp = enDisp.replace(/days/g, "Days").replace(/>\s*90/, "<90")
        const catLabel = currentLang.value === 'ar' 
          ? `متأخر ${arabicBuckets[item.bucket] || item.bucket}` 
          : `Overdue ${enDisp}`
        
        const curYearFormatted = formatToMillions(item.value, 2).replace('.', ',')
        const cyrLabel = currentLang.value === 'ar' ? 'السنة الحالية' : 'Current year'
        const totLabel = currentLang.value === 'ar' ? '% من إجمالي AP' : '% of Total AP'
        const cumLabel = currentLang.value === 'ar' ? 'التراكمي %' : 'Cumulative %'

        return `
          <div class="custom-tooltip shadow-xl">
            <div class="tooltip-header">${catLabel}</div>
            <div class="tooltip-body">
              <div class="tooltip-row">
                <span class="label">${cyrLabel}:</span>
                <span class="value teal">AED ${curYearFormatted}M</span>
              </div>
              <div class="tooltip-row">
                <span class="label">${totLabel}:</span>
                <span class="value teal">${item.percentage}</span>
              </div>
              <div class="tooltip-row">
                <span class="label">${cumLabel}:</span>
                <span class="value teal">${item.cumulative_percentage}</span>
              </div>
            </div>
          </div>
        `
      }
    }
  }
})
</script>

<style scoped>
.aging-graph-card {
  background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.custom-tooltip) {
  background: #FFFFFF;
  padding: 16px 18px;
  border-radius: 14px;
  color: #1A1A1A;
  font-family: 'Noto Sans Arabic', sans-serif;
  min-width: 210px;
  border: none !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
}

:deep(.tooltip-header) {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
  color: #1A1A1A;
}

:deep(.tooltip-body) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
}

:deep(.tooltip-row .label) {
  color: #555555;
}

:deep(.tooltip-row .value.teal) {
  color: #00A176;
  font-weight: 600;
}
</style>
