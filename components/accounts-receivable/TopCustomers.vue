<template>
  <div
    class="top-customers-card rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-md"
    :style="isDark ? 'background: #015A49CC !important' : ''"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-6 text-white relative z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-regular leading-tight">{{ currentLang === 'ar' ? 'أفضل العملاء حسب حسابات القبض' : 'Top Account Receivable customer wise' }}</h2>
        <p class="text-[12px] font-regular mt-2 opacity-80">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-6 text-[14px] font-regular leading-normal">
          <div class="flex items-center gap-2">
            <div class="w-3.5 h-3.5 rounded-full bg-[#FF886A]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'نسبة تراكمي' : 'Cumulative %' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3.5 h-3.5 rounded-full bg-[#04C18F]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'إيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <img src="/images/icons/expand-white.svg" alt="Expand" class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[350px] relative z-10">
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
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-6 mt-0 text-white relative z-10">
      <div v-for="item in customers" :key="item.id" class="flex items-center gap-2 whitespace-nowrap overflow-hidden">
        <span class="text-[14px] font-semibold text-[#04C18F]">{{ item.id }}</span>
        <span class="text-[14px] font-regular truncate opacity-90">- {{ item.displayName }}</span>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden top-customers-card" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white relative z-10 w-full">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular leading-tight">{{ currentLang === 'ar' ? 'أفضل العملاء حسب حسابات القبض' : 'Top Account Receivable customer wise' }}</h2>
              <p class="text-xs font-regular mt-2 opacity-80">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-6 text-[14px] font-regular leading-normal">
                <div class="flex items-center gap-2">
                  <div class="w-3.5 h-3.5 rounded-full bg-[#FF886A]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'نسبة تراكمي' : 'Cumulative %' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3.5 h-3.5 rounded-full bg-[#04C18F]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'إيرادات' : 'Revenue' }}</span>
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
              <apexchart
                type="line"
                height="100%"
                :options="chartOptions"
                :series="series"
              />
            </ClientOnly>
          </div>

          <!-- Bottom Legend Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-6 mt-0 text-white relative z-10 px-8 pb-8">
            <div v-for="item in customers" :key="'modal-' + item.id" class="flex items-center gap-2 whitespace-nowrap overflow-hidden">
              <span class="text-[14px] font-semibold text-[#04C18F]">{{ item.id }}</span>
              <span class="text-[14px] font-regular truncate opacity-90">- {{ item.displayName }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const customersData = [
  { id: 'A', name: 'Horizon Global', nameAr: 'هورايزون جلوبال', value: 3.3, color: '#04C18F' },
  { id: 'B', name: 'Orion Tech', nameAr: 'أوريون تك', value: 4.1, color: '#04C18F' },
  { id: 'C', name: 'Gulf Trading', nameAr: 'جلف تريدينج', value: 2.9, color: '#04C18F' },
  { id: 'D', name: 'Prime Logistics', nameAr: 'برايم لوجيستكس', value: 3.7, color: '#04C18F' },
  { id: 'E', name: 'Emirates Trading', nameAr: 'الإمارات للتجارة', value: 4.4, color: '#04C18F' },
  { id: 'F', name: 'Alpha Tech', nameAr: 'ألفا تك', value: 1.9, color: '#04C18F' },
  { id: 'G', name: 'Mena Retail', nameAr: 'مينا لتجارة التجزئة', value: 3.7, color: '#04C18F' },
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

const series = ref([
  {
    name: 'AR Balance',
    type: 'column',
    data: customersData.map(c => c.value)
  },
  {
    name: 'Cumulative %',
    type: 'line',
    data: [40, 62, 70, 78, 85, 88, 92, 95, 97, 100]
  }
])

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Noto Sans Arabic, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      columnWidth: 40,
      borderRadius: 20,
      borderRadiusApplication: 'around'
    }
  },
  stroke: {
    width: [0, 2],
    curve: 'smooth',
    colors: ['transparent', '#FB7554']
  },
  colors: ['#04C18F', '#FB7554'],
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    offsetY: -25,
    background: { enabled: false },
    style: {
      fontSize: '10px',
      colors: ['#FFFFFFBF'],
      fontWeight: 400
    },
    formatter: (val) => val.toString().replace('.', ',') + "M"
  },
  markers: {
    size: 5,
    colors: ['#FFFFFF'],
    strokeColors: '#FB7554',
    strokeWidth: 2,
    hover: { size: 7 }
  },
  xaxis: {
    categories: customersData.map(c => c.id),
    axisBorder: { 
      show: true,
      color: '#00403333',
      height: 1,
      width: '100%',
      offsetX: 0,
      offsetY: 0
    },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: {
      style: {
        fontSize: '14px',
        colors: '#FFFFFF',
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
        color: '#00403333',
        width: 1,
        offsetX: -2
      },
      labels: {
        style: {
          fontSize: '14px',
          colors: '#FFFFFF'
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
        style: {
          fontSize: '14px',
          colors: '#FFFFFF'
        },
        formatter: (val) => val + "%"
      }
    }
  ],
  grid: {
    borderColor: '#00403333',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
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
      const bal = series[0][dataPointIndex]
      const cum = series[1][dataPointIndex]
      
      const balLabel = currentLang.value === 'ar' ? 'رصيد حسابات القبض' : 'AR Balance'
      const totLabel = currentLang.value === 'ar' ? '% من الإجمالي' : '% of Total AR'
      const cumLabel = currentLang.value === 'ar' ? 'تراكمي %' : 'Cumulative %'

      return `
        <div class="custom-tooltip shadow-2xl">
          <div class="tooltip-header">${customerName}</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="label">${balLabel}:</span>
              <span class="value teal">AED ${bal.toString().replace('.', ',')}M</span>
            </div>
            <div class="tooltip-row">
              <span class="label">${totLabel}:</span>
              <span class="value teal">15%</span>
            </div>
            <div class="tooltip-row">
              <span class="label">${cumLabel}:</span>
              <span class="value teal">${cum}%</span>
            </div>
          </div>
        </div>
      `
    }
  }
}))
</script>

<style scoped>
.top-customers-card {
  background: linear-gradient(180deg, #00A176 0%, #004E3F 100%);
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.custom-tooltip) {
  background: #FFFFFF;
  padding: 16px;
  border-radius: 12px;
  color: #1A1A1A;
  font-family: 'Noto Sans Arabic', sans-serif;
  min-width: 200px;
  border: none !important;
}

:deep(.tooltip-header) {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
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
  gap: 12px;
  font-size: 13px;
}

:deep(.tooltip-row .label) {
  color: #1A1A1A;
}

:deep(.tooltip-row .value.teal) {
  color: #00A176;
  font-weight: 600;
}
</style>
