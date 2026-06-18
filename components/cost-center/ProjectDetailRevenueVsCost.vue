<template>
  <div class="w-full h-full rounded-[24px] p-8 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    style="background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);">
    
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0 relative z-10">
      <div class="mb-2">
        <h2 class="text-[16px] font-regular text-white">
          {{ currentLang === 'ar' ? 'الفعلي مقابل الميزانية - مشروع البرج السكني' : 'Actual vs Budget – Residential Tower Project' }}
        </h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white' : 'text-[#FFFFFF5C]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-4 text-xs font-medium">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
          <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الفعلي' : 'Actual' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[#00D8B0]"></span>
          <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</span>
        </div>
        <img 
          src="/images/icons/info-white.svg" 
          alt="Info" 
          class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        />
        <img 
          src="/images/icons/expand-white.svg" 
          alt="Expand" 
          class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity" 
          @click="isModalOpen = true"
        />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 min-h-0 mt-0 relative z-10">
      <ClientOnly>
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Modal Area -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
          :style="isDark ? { background: '#002e26' } : { background: 'linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%)' }" 
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 relative z-10">
            <div class="flex flex-col">
              <h2 class="text-lg font-regular text-white">
                {{ currentLang === 'ar' ? 'الإيرادات مقابل التكلفة - مشروع البرج السكني' : 'Revenue vs Cost – Residential Tower Project' }}
              </h2>
              <p class="text-xs font-regular mt-1" :class="isDark ? 'text-white' : 'text-[#FFFFFF5C]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4 text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
                  <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الفعلي' : 'Actual' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#00D8B0]"></span>
                  <span class="text-white font-regular">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</span>
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
              <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="series"></apexchart>
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

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const tableRows = computed(() => props.data?.table_data ?? [])

const categories = computed(() => tableRows.value.map(row => row.particulars ?? ''))

const series = computed(() => [
  { name: 'Actual', data: tableRows.value.map(row => parseFloat(((row.actual ?? 0) / 1_000_000).toFixed(2))) },
  { name: 'Budget', data: tableRows.value.map(row => parseFloat(((row.budget ?? 0) / 1_000_000).toFixed(2))) }
])

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent'
  },
  plotOptions: {
    bar: {
      columnWidth: '40px',
      borderRadius: 20,
      borderRadiusApplication: 'around',
      dataLabels: { position: 'top' }
    }
  },
  colors: ['#FF7B5F', '#00D8B0'],
  dataLabels: {
    enabled: true,
    offsetY: -45,
    style: { fontSize: '14px', colors: ['#03D8B0'], fontWeight: 500 },
    formatter: (val) => val === 0 ? '' : val.toString().replace('.', ',') + 'M'
  },
  xaxis: {
    categories: categories.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: '13px', colors: '#FFFFFF', fontWeight: 500 } }
  },
  yaxis: {
    min: 0,
    tickAmount: 5,
    labels: {
      style: { fontSize: '13px', colors: '#FFFFFF', fontWeight: 500 },
      formatter: (val) => val === 0 ? '0' : val.toFixed(0) + 'M'
    },
    axisBorder: { 
      show: true,
      color: 'rgba(255, 255, 255, 0.3)',
      width: 1
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    yaxis: { lines: { show: true } },
    padding: { top: 40 }
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    custom: function({ series: s, dataPointIndex, w }) {
      const category = w.globals.labels[dataPointIndex]
      const actual = s[0][dataPointIndex]
      const budget = s[1][dataPointIndex]
      const varianceValue = budget - actual
      const variancePercent = ((varianceValue / budget) * 100).toFixed(1)
      const varianceSign = varianceValue >= 0 ? '+' : ''

      return `
        <div class="px-5 py-4 bg-[#E2FFF3] rounded-xl shadow-2xl border-none" style="min-width: 200px;">
          <div class="font-semibold mb-3 text-[#000] text-[15px]">${category}</div>
          <div class="text-[#333] text-[13px] mb-1.5 flex justify-between">
            <span>Actual:</span> <span class="font-bold text-[#FF7B5F]">AED ${actual.toFixed(1)}M</span>
          </div>
          <div class="text-[#333] text-[13px] mb-1.5 flex justify-between">
            <span>Budget:</span> <span class="font-bold text-[#00A176]">AED ${budget.toFixed(1)}M</span>
          </div>
          <div class="text-[14px] pt-1 border-t border-black/5 mt-1 flex justify-between">
            <span>Variance:</span> <span class="font-bold text-[#00A176]">${varianceSign}${variancePercent}%</span>
          </div>
        </div>
      `
    }
  }
}))
</script>