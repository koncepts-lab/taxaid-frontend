<template>
  <div
    class="rounded-3xl lg:p-8 p-4 max-lg:py-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-sm"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
    <!-- Header -->
    <div class="flex lg:flex-row flex-col max-lg:gap-4 justify-between items-start mb-4 relative z-10"
      :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-medium leading-tight">
          {{ currentLang === 'ar' ? 'الإيرادات مقابل تكلفة المبيعات شهريا' : 'Revenue to COGS Monthly' }}
        </h2>
        <p class="text-[12px] font-regular mt-1 opacity-80" :class="isDark ? 'text-white' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-4 text-[13px] font-regular leading-normal">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FFC107]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#005A48]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info"
          class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity max-lg:hidden" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand"
          class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity max-lg:hidden"
          @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[320px] relative z-10 mt-0">
      <ClientOnly>
        <apexchart :key="data.length" type="bar" height="100%" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b"
            :class="isDark ? 'border-white/10 text-white' : 'border-black/5 text-[#1A1A1A]'">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight">
                {{ currentLang === 'ar' ? 'الإيرادات مقابل تكلفة المبيعات شهريا' : 'Revenue to COGS Monthly' }}
              </h2>
              <p class="text-xs font-regular mt-1 opacity-80" :class="isDark ? 'text-white' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-4 text-[13px] font-regular leading-normal">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FFC107]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#005A48]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false"
                class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 flex-shrink-0"
                  :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>

          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10" style="background-color: #fff;">
            <ClientOnly>
              <apexchart type="bar" height="100%" :options="chartOptions" :series="series" />
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const months = computed(() => {
  if (props.data && props.data.length > 0) {
    return props.data.map(item => ({
      en: item.month_short,
      ar: item.month_short
    }))
  }
  return []
})

const series = computed(() => {
  if (props.data && props.data.length > 0) {
    return [
      {
        name: 'COGS',
        data: props.data.map(item => Number(formatToMillions(item.cogs || 0, 2).replace(/,/g, ''))),
        dataLabels: { offsetX: -12 }
      },
      {
        name: 'Revenue',
        data: props.data.map(item => Number(formatToMillions(item.revenue || 0, 2).replace(/,/g, ''))),
        dataLabels: { offsetX: 12 }
      }
    ]
  }
  return [
    { name: 'COGS', data: [] },
    { name: 'Revenue', data: [] }
  ]
})

const chartOptions = computed(() => {
  // Calculate dynamic max for Y-axis based on data to prevent values hitting the ceiling
  const allData = [...series.value[0].data, ...series.value[1].data]
  const rawMax = Math.max(...allData, 0)
  // Logic: only if it exceeds the original 5M range, add 10% buffer and round to nearest 5.
  const dynamicMax = rawMax > 5 ? Math.ceil((rawMax * 1.1) / 5) * 5 : 5

  return {
    chart: {
      fontFamily: 'Noto Sans Arabic, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
        },
      }
    },
    colors: ['#FFC107', '#005A48'],
    dataLabels: {
      enabled: true,
      offsetY: -30,
      style: {
        fontSize: '10px',
        colors: [isDark.value ? '#FFFFFF' : '#005A48']
      },
      formatter: (val) => val.toString().replace('.', ',') + 'M'
    },
    xaxis: {
      categories: months.value.map(m => currentLang.value === 'ar' ? m.ar : m.en),
      axisBorder: {
        show: false
      },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: isDark.value ? '#FFFFFFBF' : '#00000099',
          fontWeight: 400
        }
      },
      crosshairs: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: dynamicMax,
      tickAmount: 5,
      axisBorder: {
        show: true,
        color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFEFEF',
        width: 1
      },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: isDark.value ? '#FFFFFFBF' : '#00000099'
        },
        formatter: (val) => val === 0 ? '0' : val + 'M'
      }
    },
    grid: {
      show: true,
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.05)' : '#EFEFEF',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 20, right: 20, bottom: 0, left: 10 }
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    legend: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark.value ? 'dark' : 'light',
      custom: function ({ series: s, dataPointIndex }) {
        const cat = months.value[dataPointIndex]
        if (!cat) return ''
        
        const catLabel = currentLang.value === 'ar' ? cat.ar : cat.en
        const rVal = s[1][dataPointIndex]
        const cVal = s[0][dataPointIndex]
        const ratio = cVal !== 0 ? (rVal / cVal).toFixed(2) : (rVal > 0 ? '∞' : '0.00')

        const trRevenue = currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue'
        const trCOGS = currentLang.value === 'ar' ? 'تكلفة المبيعات' : 'COGS'
        const trRatio = currentLang.value === 'ar' ? 'لإيرادات نسبة تكلفة' : 'Revenue to COGS'

        // Tooltip styling matches the mockup (teal background bubble)
        return `
          <div class="custom-tooltip-cogs shadow-xl rounded-2xl" style="background:#D9FBF2; padding: 12px 16px; border:none;  color:#1A1A1A;">
            <div style="font-size:12px; margin-bottom:8px; font-weight:500;">${catLabel}</div>
            <div style="font-size:11px; margin-bottom:4px;">${trRevenue}: AED ${rVal.toString().replace('.', ',')}M</div>
            <div style="font-size:11px; margin-bottom:4px;">${trCOGS}: AED ${cVal.toString().replace('.', ',')}M</div>
            <div style="font-size:11px; color:#00A176;">${trRatio}: ${ratio}</div>
          </div>
        `
      }
    }
  }
})
</script>

<style scoped>
:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
