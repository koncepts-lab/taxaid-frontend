<template>
  <div
    class="breakdown-chart-card rounded-3xl lg:p-8 p-4 max-lg:py-8 h-full flex flex-col relative transition-all duration-500 overflow-auto shadow-md"
    :style="isDark ? 'background: #00141080 !important' : ''">
    <!-- Header -->
    <div class="flex lg:flex-row flex-col max-lg:gap-4 justify-between items-start mb-4 text-white relative z-10">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-medium leading-tight">
          {{ currentLang === 'ar' ? 'تفصيل تكلفة المبيعات حسب الفئة' : 'COGS Breakdown by Category' }}
        </h2>
        <p class="text-[12px] font-regular mt-1 opacity-80">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-4 text-[13px] font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</span>
          </div>
        </div>
        <img src="/images/icons/info-white.svg" alt="Info"
          class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity max-lg:hidden" />
        <img src="/images/icons/expand-white.svg" alt="Expand"
          class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity max-lg:hidden"
          @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[320px] relative z-10 min-w-175 ">
      <ClientOnly>
        <apexchart type="bar" height="100%" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden breakdown-chart-card"
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight">
                {{ currentLang === 'ar' ? 'تفصيل تكلفة المبيعات حسب الفئة' : 'COGS Breakdown by Category' }}
              </h2>
              <p class="text-xs font-regular mt-1 opacity-80">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-4 text-[13px] font-regular">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
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
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isModalOpen = ref(false)

const categories = [
  { en: 'Product Sales', ar: 'مبيعات المنتجات' },
  { en: 'Service', ar: 'خدمة' },
  { en: 'Consulting', ar: 'استشارات' },
  { en: 'Subscription', ar: 'الاشتراك' },
  { en: 'SaaS', ar: 'برمجيات' },
  { en: 'Training', ar: 'التدريب' },
  { en: 'Support', ar: 'دعم' },
  { en: 'Licensing', ar: 'الترخيص' },
  { en: 'Logistics', ar: 'الخدمات اللوجستية' },
  { en: 'Manufacturing', ar: 'التصنيع' }
]

const previousYearData = [1.6, 3.8, 3.4, 2.4, 2.5, 4.5, 2.7, 3.5, 4.5, 4.8]
const currentYearData = [1.8, 4.5, 2.8, 2.8, 1.7, 5.0, 3.0, 4.0, 5.0, 5.0]

const series = ref([
  {
    name: 'Previous Year',
    data: previousYearData
  },
  {
    name: 'Current Year',
    data: currentYearData
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
      columnWidth: '50%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top',
      },
    }
  },
  colors: ['#FB7554', '#03D8B0'],
  dataLabels: {
    enabled: true,
    offsetY: -30,
    style: {
      fontSize: '11px',
      colors: ['#03D8B0'] // Adjust accordingly, using teal for labels as mostly seen
    },
    formatter: (val) => val.toString().replace('.', ',') + 'M'
  },
  xaxis: {
    categories: categories.map(c => currentLang.value === 'ar' ? c.ar : c.en),
    axisBorder: {
      show: true,
      color: '#004033',
      height: 1,
      width: '100%'
    },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: {
      style: {
        fontSize: '12px',
        colors: '#FFFFFFBF',
        fontWeight: 400
      }
    }
  },
  yaxis: {
    min: 0,
    max: 6,
    tickAmount: 6,
    axisBorder: {
      show: true,
      color: '#004033',
      width: 1
    },
    axisTicks: { show: false },
    labels: {
      style: {
        fontSize: '12px',
        colors: '#FFFFFFBF'
      },
      formatter: (val) => val === 0 ? '0' : val + 'M'
    }
  },
  grid: {
    show: true,
    borderColor: '#004033',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 20, right: 10, bottom: 0, left: 10 }
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    y: {
      formatter: function (val) {
        return "AED " + val + "M"
      }
    }
  }
}))
</script>

<style scoped>
.breakdown-chart-card {
  background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);
}

:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-datalabel) {
  fill: #03D8B0 !important;
}
</style>
