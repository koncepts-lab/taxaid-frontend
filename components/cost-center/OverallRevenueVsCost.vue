<template>
  <div
    class="rounded-3xl p-8 h-full flex flex-col relative transition-all duration-500 overflow-hidden shadow-sm"
    :class="isDark ? 'bg-[#003d35]' : 'bg-[#014235]'"
  >
    <!-- Background styling to match the dark green background of the card in the design.
         Wait, the design shows this specific card having a dark green bg (#014235) in dark/light mode probably. 
         Let's stick to standard theming if it's meant to be consistent or just apply the specific color. 
         I will use text-white for this entire block to match the design. -->
         
    <!-- Header -->
    <div class="flex justify-between items-start mb-4 relative z-10 text-white">
      <div class="flex flex-col">
        <h2 class="text-[18px] font-medium leading-tight">
          {{ currentLang === 'ar' ? 'إجمالي الإيرادات مقابل التكلفة' : 'Overall Revenue vs Cost' }}
        </h2>
        <p class="text-[13px] font-regular mt-1 opacity-80 text-white">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>
      <div class="flex items-center gap-6">
        <!-- Custom Legend -->
        <div class="flex items-center gap-4 text-[13px] font-regular">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'التكلفة' : 'Cost' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
            <span class="opacity-90">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
          </div>
        </div>
        <img :src="'/images/icons/expand-white.svg'" alt="Expand" class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 w-full min-h-[350px] relative z-10 mt-0">
      <ClientOnly>
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Sub Legend mapping (A - Residential, etc.) -->
    <div class="grid grid-cols-4 gap-y-2 gap-x-4 text-xs text-white/80 w-full xl:w-4/5" style="margin-left: 45px; margin-top: 0;">
      <div><span class="text-[#03D8B0] font-medium">A</span> - {{ currentLang === 'ar' ? 'سكني' : 'Residential' }}</div>
      <div><span class="text-[#03D8B0] font-medium">B</span> - {{ currentLang === 'ar' ? 'بنية تحتية' : 'Infrastructure' }}</div>
      <div><span class="text-[#03D8B0] font-medium">C</span> - {{ currentLang === 'ar' ? 'تجاري' : 'Commercial' }}</div>
      <div><span class="text-[#03D8B0] font-medium">D</span> - {{ currentLang === 'ar' ? 'لوجستيات' : 'Prime Logistics' }}</div>
      
      <div><span class="text-[#03D8B0] font-medium">E</span> - {{ currentLang === 'ar' ? 'تجارة الإمارات' : 'Emirates Trading' }}</div>
      <div><span class="text-[#03D8B0] font-medium">F</span> - {{ currentLang === 'ar' ? 'ألفا تك' : 'Alpha Tech' }}</div>
      <div><span class="text-[#03D8B0] font-medium">G</span> - {{ currentLang === 'ar' ? 'مينا للتجزئة' : 'Mena Retail' }}</div>
      <div><span class="text-[#03D8B0] font-medium">H</span> - {{ currentLang === 'ar' ? 'كريسنت' : 'Crescent' }}</div>
      
      <div><span class="text-[#03D8B0] font-medium">I</span> - {{ currentLang === 'ar' ? 'فيرتكس كورب' : 'Vertex Corp' }}</div>
      <div><span class="text-[#03D8B0] font-medium">J</span> - {{ currentLang === 'ar' ? 'تجارة فيرتكس' : 'Vertex Trading' }}</div>
      <div><span class="text-[#03D8B0] font-medium">K</span> - {{ currentLang === 'ar' ? 'المستقبل' : 'Future Projects' }}</div>
      <div><span class="text-[#03D8B0] font-medium">L</span> - {{ currentLang === 'ar' ? 'المدينة' : 'City Center' }}</div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-[#014235]'" style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10 text-white">
            <div class="flex flex-col">
              <h2 class="text-lg font-medium leading-tight">
                {{ currentLang === 'ar' ? 'إجمالي الإيرادات مقابل التكلفة' : 'Overall Revenue vs Cost' }}
              </h2>
              <p class="text-xs font-regular mt-1 opacity-80 text-white">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <!-- Custom Legend -->
              <div class="flex items-center gap-4 text-[13px] font-regular">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#FB7554]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'التكلفة' : 'Cost' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#03D8B0]"></div>
                  <span class="opacity-90">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</span>
                </div>
              </div>
              <button @click="isModalOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 flex-shrink-0 invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body (Chart) -->
          <div class="flex-1 w-full p-8 relative z-10 flex flex-col justify-between" style="background-color: transparent;">
            <div class="flex-1">
                <ClientOnly>
                  <apexchart
                    type="bar"
                    height="100%"
                    :options="chartOptions"
                    :series="series"
                  />
                </ClientOnly>
            </div>
            <div class="grid grid-cols-4 gap-y-2 gap-x-4 text-sm text-white/80 w-full xl:w-4/5" style="margin-left: 45px; margin-top: 0;">
                <div><span class="text-[#03D8B0] font-medium">A</span> - {{ currentLang === 'ar' ? 'سكني' : 'Residential' }}</div>
                <div><span class="text-[#03D8B0] font-medium">B</span> - {{ currentLang === 'ar' ? 'بنية تحتية' : 'Infrastructure' }}</div>
                <div><span class="text-[#03D8B0] font-medium">C</span> - {{ currentLang === 'ar' ? 'تجاري' : 'Commercial' }}</div>
                <div><span class="text-[#03D8B0] font-medium">D</span> - {{ currentLang === 'ar' ? 'لوجستيات' : 'Prime Logistics' }}</div>
                
                <div><span class="text-[#03D8B0] font-medium">E</span> - {{ currentLang === 'ar' ? 'تجارة الإمارات' : 'Emirates Trading' }}</div>
                <div><span class="text-[#03D8B0] font-medium">F</span> - {{ currentLang === 'ar' ? 'ألفا تك' : 'Alpha Tech' }}</div>
                <div><span class="text-[#03D8B0] font-medium">G</span> - {{ currentLang === 'ar' ? 'مينا للتجزئة' : 'Mena Retail' }}</div>
                <div><span class="text-[#03D8B0] font-medium">H</span> - {{ currentLang === 'ar' ? 'كريسنت' : 'Crescent' }}</div>
                
                <div><span class="text-[#03D8B0] font-medium">I</span> - {{ currentLang === 'ar' ? 'فيرتكس كورب' : 'Vertex Corp' }}</div>
                <div><span class="text-[#03D8B0] font-medium">J</span> - {{ currentLang === 'ar' ? 'تجارة فيرتكس' : 'Vertex Trading' }}</div>
                <div><span class="text-[#03D8B0] font-medium">K</span> - {{ currentLang === 'ar' ? 'المستقبل' : 'Future Projects' }}</div>
                <div><span class="text-[#03D8B0] font-medium">L</span> - {{ currentLang === 'ar' ? 'المدينة' : 'City Center' }}</div>
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

const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const costData = [1.6, 3.8, 3.4, 2.4, 2.5, 4.0, 3.1, 3.5, 4.5, 4.8, 4.0, 3.6]
const revenueData = [1.8, 4.5, 2.8, 2.8, 1.7, 5.0, 3.5, 4.0, 5.0, 5.0, 4.8, 4.6]

const mappingFullNames = {
    'A': 'Residential Project',
    'B': 'Infrastructure',
    'C': 'Commercial',
    'D': 'Prime Logistics',
    'E': 'Emirates Trading',
    'F': 'Alpha Tech',
    'G': 'Mena Retail',
    'H': 'Crescent',
    'I': 'Vertex Corp',
    'J': 'Vertex Trading',
    'K': 'Future Projects',
    'L': 'City Center'
}

const series = ref([
  {
    name: 'Cost',
    data: costData
  },
  {
    name: 'Revenue',
    data: revenueData
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
      columnWidth: '55%',
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
    offsetY: -25,
    style: {
      fontSize: '11px',
      colors: ['#FB7554', '#03D8B0']
    },
    formatter: (val) => val === 0 ? '' : val.toString().replace('.', ',') + 'M'
  },
  xaxis: {
    categories: categories,
    axisBorder: {
      show: false
    },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: {
      style: {
        fontSize: '12px',
        colors: '#FFFFFFBF',
        fontWeight: 400
      }
    },
    crosshairs: {
      show: false
    }
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    axisBorder: { 
      show: true,
      color: 'rgba(255, 255, 255, 0.1)',
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
    borderColor: 'rgba(255, 255, 255, 0.05)',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 20, right: 20, bottom: 0, left: 10 }
  },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } }
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    custom: function({ series: s, dataPointIndex }) {
      const cat = categories[dataPointIndex]
      const fullName = mappingFullNames[cat]
      const cVal = s[0][dataPointIndex]
      const rVal = s[1][dataPointIndex]
      const variance = (((rVal - cVal) / cVal) * 100).toFixed(1)
      const varianceSign = variance >= 0 ? '+' : ''

      const trFullName = fullName // would map ar if needed
      const trRevenue = currentLang.value === 'ar' ? 'الإيرادات' : 'Revenue'
      const trCost = currentLang.value === 'ar' ? 'التكلفة' : 'Cost'
      const trVariance = currentLang.value === 'ar' ? 'التباين' : 'Variance'

      return `
        <div class="custom-tooltip shadow-xl rounded-2xl" style="background:#D9FBF2; padding: 12px 16px; border:none; color:#1A1A1A;">
          <div style="font-size:12px; margin-bottom:8px; font-weight:500;">${trFullName}</div>
          <div style="font-size:11px; margin-bottom:4px;">${trRevenue}: AED ${rVal.toString().replace('.', ',')}M</div>
          <div style="font-size:11px; margin-bottom:4px;">${trCost}: AED ${cVal.toString().replace('.', ',')}M</div>
          <div style="font-size:11px; color:#00A176;">${trVariance}: ${varianceSign}${variance}%</div>
        </div>
      `
    }
  }
}))
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
