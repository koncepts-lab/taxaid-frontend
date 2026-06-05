<template>
  <NuxtLayout name="dashboard">


    <!-- 1. Container fills the screen height and prevents page-level scrolling -->
    <div v-if="!isFullScreenChat" class="h-screen font-sans flex overflow-hidden relative z-10" :class="{ '': isDark }"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- 2. LEFT AREA: Resizes dynamically -->
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8" :class="isChatOpen
        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
        : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')">
        <div class="mx-auto pt-8 lg:pt-0">

          <CommonDashboardHeader 
            :title="{ en: 'Accounts Payable Analysis', ar: 'تحليل حسابات الدفع' }"
            :subtitle="{ en: 'Comprehensive AP tracking and aging insights', ar: 'تتبع شامل لحسابات الدفع ورؤى التقادم' }" 
            :periods="customPeriods"
            class="mb-8" 
            @selected-date="handleDateChange"
            @reload="handleReload"
          />

          <AccountsPayableAlert />

          <div class="mb-4 lg:mb-8">
            <AccountsPayableSummary :data="summaryData" :testDate="activeTestDate" />
          </div>

          <div class="mb-4 lg:mb-8">
            <div class="h-[600px]">
              <AccountsPayableTopCustomers :data="topCustomersData" />
            </div>
          </div>

          <div class="mb-4 lg:mb-8">
            <div class="h-[420px]">
              <AccountsPayableHistoricalMovement :data="timelineData" />
            </div>
          </div>

          <div>
            <div class="lg:h-[440px] h-[440px]">
              <AccountsPayableAgingGraph :agingData="agingData" />
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
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = false" />
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
import { ref, onMounted, watch } from 'vue'
const { date, currentDate } = useAppDate()

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const agingData = ref({})
const summaryData = ref([])
const topCustomersData = ref(null)
const timelineData = ref(null)
const activeTestDate = ref(currentDate.value)

const customPeriods = [
    { en: 'Year to Date', ar: 'منذ بداية العام' },
    { en: 'This Quarter', ar: 'هذا الربع' },
    { en: 'Last Quarter', ar: 'الربع الماضي' },
    { en: 'This Year', ar: 'هذه السنة' },
    { en: 'Last Year', ar: 'السنة الماضية' },
    { en: 'Custom Date', ar: 'تاريخ مخصص' }
]

const fetchAgingData = async () => {
  agingData.value = {}
  try {
    const response = await useApi('/ap-report/aging', {
      params: {
        test_date: activeTestDate.value,
        lang: currentLang.value
      }
    })
    
    if (response && response.status === 'success') {
      agingData.value = response.payload || {}
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    agingData.value = {}
  }
}

const fetchSummaryData = async () => {
  summaryData.value = []
  try {
    const response = await useApi('/ap-report', {
      params: {
        test_date: activeTestDate.value
      }
    })
    
    if (response && response.status === 'success') {
      summaryData.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching summary data:', error)
    summaryData.value = []
  }
}

const fetchTopCustomersData = async () => {
  topCustomersData.value = null
  try {
    const response = await useApi('/ap-report/top-eight', {
      params: {
        test_date: activeTestDate.value
      }
    })
    
    if (response && response.status === 'success') {
      topCustomersData.value = response.payload || null
    }
  } catch (error) {
    console.error('Error fetching top customers data:', error)
    topCustomersData.value = null
  }
}

const fetchTimelineData = async () => {
  timelineData.value = null
  try {
    const response = await useApi('/ap-report/timeline', {
      params: {
        test_date: activeTestDate.value
      }
    })
    
    if (response && response.status === 'success' && response.payload) {
      const ranges = response.payload.ranges || []
      timelineData.value = {
        apBalance: ranges.map(r => r.ap_value / 1000000),
        categories: ranges.map(r => {
          const date = new Date(r.start)
          return date.toLocaleString('en-US', { month: 'short' })
        }),
        percentage: []
      }
    }
  } catch (error) {
    console.error('Error fetching timeline data:', error)
    timelineData.value = null
  }
}

const handleDateChange = (period) => {
  if (period.custom_from) {
    const parts = period.custom_from.split('-')
    activeTestDate.value = `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  handleReload()
}

const handleReload = () => {
  fetchAgingData()
  fetchTopCustomersData()
  fetchSummaryData()
  fetchTimelineData()
}

watch(currentLang, () => {
  fetchAgingData()
})

onMounted(() => {
  fetchAgingData()
  fetchTopCustomersData()
  fetchSummaryData()
  fetchTimelineData()
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
