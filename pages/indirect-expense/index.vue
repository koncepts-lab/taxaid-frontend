<template>
  <NuxtLayout name="dashboard">

    <!-- 1. Container fills the content height -->
    <div v-if="!isFullScreenChat" class="min-h-screen font-sans flex relative z-10"
      :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- 2. LEFT AREA: Resizes dynamically -->
      <div class="flex-1 no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-0" 
        :class="[
          isChatOpen 
            ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
            : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')
        ]">
        <div class="mx-auto pt-0 lg:pt-0">
          
          <CommonDashboardHeader 
            class="mb-4 lg:mb-8"
            :title="{ en: 'Indirect Expense Analysis', ar: 'تحليل المصروفات غير المباشرة' }"
            :subtitle="{ en: 'Track Overheads and Optimize Operational Costs', ar: 'تتبع النفقات العامة وتحسين التكاليف التشغيلية' }"
            :periods="customPeriods"
            :oneclickreview="false"
            @selected-date="handleDateChange"
            @reload="handleReload"
            @export-excel="handleExport('excel')"
            @export-pdf="handleExport('pdf')"
          />

          <div class="mb-4 lg:mb-8">
            <IndirectExpenseSummary :data="breakdownData?.data" />
          </div>

          <div class="grid grid-cols-1 gap-8 mb-4 lg:mb-8">
            <div>
              <IndirectExpenseTopCategories :data="breakdownData?.charts?.expense_by_category" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 mb-4 lg:mb-8">
            <div class="h-auto lg:h-[450px]">
              <IndirectExpenseOverheadTrends :data="trendData" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8">
            <div class="h-auto lg:h-[450px]">
              <IndirectExpenseOverheadVsRevenue :data="expenseVsRevenueData" />
            </div>
          </div>

        </div>
      </div>

      <!-- 3. RIGHT SIDEBAR -->
      <aside class="fixed z-[1000] transition-all duration-500 ease-in-out" :class="[
        currentLang === 'ar' ? 'left-0' : 'right-0',
        'lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:mt-5',
        isChatOpen
            ? 'bottom-0 w-full translate-y-0'
            : 'bottom-24 w-[80px]',
        isChatOpen ? 'lg:2xl:w-120 lg:w-100' : 'lg:w-[80px]'
      ]">
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
      </aside>
    </div>
    
    <div v-else class="w-full flex overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <!-- Full Sidebar version -->
        <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
            <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />
        </aside>

        <!-- Main Chat Window -->
        <main class="flex-1">
          <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
        </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isChatOpen = ref(true)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const customPeriods = [
    { en: 'Year to Date', ar: 'منذ بداية العام' },
    { en: 'This Quarter', ar: 'هذا الربع' },
    { en: 'Last Quarter', ar: 'الربع الماضي' },
    { en: 'This Year', ar: 'هذه السنة' },
    { en: 'Last Year', ar: 'السنة الماضية' },
    { en: 'Custom Range', ar: 'نطاق مخصص' },
    { en: 'Custom Date', ar: 'تاريخ مخصص' }
]

const { date, currentDate } = useAppDate()

// Format YYYY-MM-DD to DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-')
  return `${d}-${m}-${y}`
}

const startOfYearStr = `${date.value.getFullYear()}-01-01`
const activeDateFrom = ref(formatDate(startOfYearStr))
const activeDateTo = ref(formatDate(currentDate.value))

// API Data
const expenseVsRevenueData = ref([])
const trendData = ref([])
const breakdownData = ref(null)

const fetchExpenseVsRevenue = async () => {
  try {
    const response = await useApi('/indirectexpenses-analysis/expense-vs-revenue/trend-chart', {
      method: 'POST',
      body: {
        custom_from: activeDateFrom.value,
        lang: currentLang.value
      }
    })
    if (response && response.status === 'success') {
      expenseVsRevenueData.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching expense vs revenue data:', error)
    expenseVsRevenueData.value = []
  }
}

const fetchTrendData = async () => {
  try {
    const response = await useApi('/indirectexpenses-analysis/trend-chart', {
      method: 'POST',
      body: {
        custom_from: activeDateFrom.value
      }
    })
    if (response && response.status === 'success') {
      trendData.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching trend data:', error)
    trendData.value = []
  }
}

const fetchBreakdownData = async () => {
  try {
    const response = await useApi('/indirectexpenses-analysis/breakdown', {
      method: 'POST',
      body: {
        range_option: 'Custom Dates',
        custom_from: activeDateFrom.value,
        custom_to: activeDateTo.value,
        lang: currentLang.value
      }
    })
    if (response && response.status === 'success') {
      breakdownData.value = response
    }
  } catch (error) {
    console.error('Error fetching breakdown data:', error)
    breakdownData.value = null
  }
}

const handleDateChange = (period) => {
  activeDateFrom.value = period.custom_from
  activeDateTo.value = period.custom_to
  fetchExpenseVsRevenue()
  fetchTrendData()
  fetchBreakdownData()
}

const handleReload = () => {
  fetchExpenseVsRevenue()
  fetchTrendData()
  fetchBreakdownData()
}

const handleExport = (type) => {
  console.log('Export:', type)
}

onMounted(() => {
  fetchExpenseVsRevenue()
  fetchTrendData()
  fetchBreakdownData()
})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}


</style>
