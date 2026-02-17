<template>
  <div class="rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500"
    :class="isDark ? 'bg-[#00141080] border-none shadow-none' : 'bg-white shadow-sm border border-gray-100'">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإيرادات - أفضل 10 عملاء حسب القيمة' : 'Revenue - Top 10 Customers by value' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-4 text-[12px] font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FF886A]"></div>
            <span class="text-[#0000005C]">{{ currentLang === 'ar' ? 'نسبة تراكمي' : 'Cumulative %' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#04C18F]"></div>
            <span :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'إيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <img src="/images/icons/expand-dark.svg" alt="Expand" class="w-6 h-6 cursor-pointer opacity-60" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[350px]">
      <ClientOnly>
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Bottom Legend Grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-4 mt-0">
      <div v-for="item in customers" :key="item.id" class="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
        <span class="text-[12px] font-regular" :style="{ color: item.color }">{{ item.id }}</span>
        <span class="text-[12px] font-regular text-[#00000080] truncate">- {{ item.displayName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

const currentLang = useState('currentLang', () => 'en')

const customersData = [
  { id: 'A', name: 'Horizon Global', nameAr: 'هورايزون جلوبال', value: 3.5, color: '#04C18F' },
  { id: 'B', name: 'Orion Tech', nameAr: 'أوريون تك', value: 4.0, color: '#04C18F' },
  { id: 'C', name: 'Gulf Trading', nameAr: 'جلف تريدينج', value: 2.9, color: '#04C18F' },
  { id: 'D', name: 'Prime Logistics', nameAr: 'برايم لوجيستكس', value: 3.7, color: '#04C18F' },
  { id: 'E', name: 'Emirates Trading', nameAr: 'الإمارات للتجارة', value: 4.5, color: '#04C18F' },
  { id: 'F', name: 'Alpha Tech', nameAr: 'ألفا تك', value: 1.9, color: '#04C18F' },
  { id: 'G', name: 'Mena Retail', nameAr: 'مينا لتجارة التجزئة', value: 3.3, color: '#04C18F' },
  { id: 'H', name: 'Crescent', nameAr: 'كريسنت', value: 4.0, color: '#04C18F' },
  { id: 'I', name: 'Vertex Corp', nameAr: 'فيرتكس كورب', value: 2.8, color: '#04C18F' },
  { id: 'J', name: 'Vertex Trading', nameAr: 'فيرتكس للتجارة', value: 3.2, color: '#04C18F' }
]

const customers = computed(() => {
  return customersData.map(c => ({
    ...c,
    displayName: currentLang.value === 'ar' ? c.nameAr : c.name
  }))
})

// Data series for Chart
const series = ref([
  {
    name: 'Revenue',
    type: 'column',
    data: customersData.map(c => c.value)
  },
  {
    name: 'Cumulative %',
    type: 'line',
    data: [40, 62, 70, 78, 85, 88, 92, 95, 97, 100] // Simplified cumulative %
  }
])

const chartOptions = {
  chart: {
    fontFamily: 'Noto Sans Arabic, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      columnWidth: '39px',
      borderRadius: 20,
      borderRadiusApplication: 'around'
    }
  },
  stroke: {
    width: [0, 2],
    curve: 'smooth',
    colors: ['transparent', '#FF886A']
  },
  colors: ['#04C18F', '#FF886A'],
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    offsetY: -30,
    style: {
      fontSize: '12px',
      colors: ['#04C18F'],
      fontWeight: 500
    },
    formatter: (val) => val.toString().replace('.', ',') + "M"
  },
  markers: {
    size: 5,
    colors: ['#fff'],
    strokeColors: '#FFC107',
    strokeWidth: 2,
    hover: { size: 7 }
  },
  xaxis: {
    categories: customersData.map(c => c.id),
    axisBorder: { 
      show: true,
      color: '#EFEFEF99',
      width: 1
    },
    axisTicks: { show: false },
    labels: {
      style: {
        fontSize: '14px',
        colors: '#8C8C8C',
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
        color: '#EFEFEF99',
        width: 1
      },
      labels: {
        show: false,
        style: {
          fontSize: '12px',
          colors: '#8C8C8C'
        },
        formatter: (val) => val === 0 ? "0" : val + "M"
      }
    },
    {
      opposite: true,
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        show: false,
        style: {
          fontSize: '12px',
          colors: '#8C8C8C'
        },
        formatter: (val) => val + "%"
      }
    }
  ],
  grid: {
    borderColor: '#EFEFEF99',
    padding: { top: 0, right: 0, bottom: 0, left: 10 }
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const customer = customersData[dataPointIndex]
      const customerName = currentLang.value === 'ar' ? customer.nameAr : customer.name
      const rev = series[0][dataPointIndex]
      const cum = series[1][dataPointIndex]
      
      const revLabel = currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue'
      const contLabel = currentLang.value === 'ar' ? 'المساهمات' : 'Contributions'

      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${customerName}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${revLabel}:</span>
              <span class="value">AED ${rev.toString().replace('.', ',')}M</span>
            </div>
            <div class="tooltip-row">
              <span class="label">${contLabel}:</span>
              <span class="value teal">${cum}%</span>
            </div>
          </div>
        </div>
      `
    }
  }
}
</script>

<style scoped>
:deep(.apexcharts-canvas) {
  margin: 0 auto;
  margin-left: -2px;
}

:deep(.custom-tooltip) {
  background: #DCF9F3;
  padding: 16px;
  border-radius: 16px;
  color: #1A1A1A;
  font-family: 'Noto Sans Arabic', sans-serif;
  min-width: 200px;
  border: none !important;
}

:deep(.tooltip-header) {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.tooltip-body) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}

:deep(.tooltip-row .label) {
  opacity: 0.6;
}

:deep(.tooltip-row .value) {
  font-weight: 500;
}

:deep(.tooltip-row .value.teal) {
  color: #04C18F;
  font-weight: 600;
}
</style>
