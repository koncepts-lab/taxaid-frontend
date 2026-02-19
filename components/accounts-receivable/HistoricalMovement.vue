<template>
  <div class="historical-movement-card rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-sm border border-[#EFEFEF]">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6 text-[#000000] relative z-10 w-full">
      <div class="flex flex-col">
        <h2 class="text-[17px] font-medium leading-tight">{{ currentLang === 'ar' ? 'حركة حسابات القبض التاريخية' : 'AR balances historical movement' }}</h2>
        <p class="text-[13px] font-normal mt-1 text-[#00000091]">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-6 text-[14px]">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="text-[#1A1A1A] text-[13px] font-normal">{{ currentLang === 'ar' ? 'رصيد حسابات القبض' : 'Account Receivable Balance' }}</span>
          </div>
        </div>
        <img src="/images/icons/expand-dark.svg" alt="Expand" class="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer ml-4" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full relative z-10 min-h-[300px]">
      <ClientOnly>
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const series = ref([
  {
    name: 'AR Balance',
    data: [1.6, 3.2, 3.8, 4.3, 4.6, 4.8]
  },
  {
    name: 'Percentage',
    data: []
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'Noto Sans Arabic, sans-serif',
    zoom: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: [2, 0],
    colors: ['#FB7554', 'transparent']
  },
  colors: ['#FB7554', 'transparent'],
  grid: {
    borderColor: '#EFEFEF',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 10, right: 10, bottom: 0, left: 10 }
  },
  markers: {
    size: [5, 0],
    colors: ['#FFC107', 'transparent'],
    strokeColors: ['#FB7554', 'transparent'],
    strokeWidth: 2,
    hover: { size: 7 }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    axisBorder: { 
      show: true,
      color: '#EFEFEF',
      height: 1
    },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: {
      style: {
        colors: '#00000091',
        fontSize: '12px',
        fontWeight: 400
      }
    }
  },
  yaxis: [
    {
      min: 0,
      max: 5,
      tickAmount: 5,
      axisBorder: { 
        show: true,
        color: '#EFEFEF',
        width: 1
      },
      labels: {
        style: {
          colors: '#00000091',
          fontSize: '12px'
        },
        formatter: (val) => val === 0 ? '0' : val + 'M'
      }
    },
    {
      opposite: true,
      min: 0,
      max: 100,
      tickAmount: 5,
      axisBorder: { 
        show: true,
        color: '#EFEFEF',
        width: 1
      },
      labels: {
        style: {
          colors: '#00000091',
          fontSize: '12px'
        },
        formatter: (val) => val + '%'
      }
    }
  ],
  legend: { show: false },
  tooltip: {
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const monthLabel = w.globals.categoryLabels[dataPointIndex]
      const bal = series[0][dataPointIndex]
      
      return `
        <div class="custom-tooltip">
          <div class="tooltip-header">${monthLabel}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${currentLang.value === 'ar' ? 'رصيد حسابات القبض' : 'AR Balance'}:</span>
              <span class="value">AED ${bal.toString().replace('.', ',')}M</span>
            </div>
          </div>
        </div>
      `
    }
  }
}))
</script>

<style scoped>
.historical-movement-card {
  background: #FFFFFF !important;
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.custom-tooltip) {
  background: #E2FFF3;
  padding: 12px 16px;
  border-radius: 14px;
  color: #1A1A1A;
  font-family: 'Noto Sans Arabic', sans-serif;
  min-width: 160px;
  border: none !important;
  box-shadow: none !important;
}

:deep(.tooltip-header) {
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 4px;
  color: #1A1A1A;
}

:deep(.tooltip-body) {
  display: flex;
  flex-direction: column;
}

:deep(.tooltip-row) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

:deep(.tooltip-row .label) {
  color: #1A1A1A;
}

:deep(.tooltip-row .value) {
  color: #1A1A1A;
  font-weight: 600;
}
</style>
