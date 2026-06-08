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
            class="mb-8"
            :title="{ en: 'COGS Analysis', ar: 'تحليل تكلفة المبيعات' }"
            :subtitle="{ en: 'COGS Breakdown by Categories', ar: 'تفصيل تكلفة المبيعات حسب الفئات' }"
            :periods="customPeriods"
            :oneclickreview="true"
            @selected-date="handleDateChange"
            @reload="handleReload"
            @one-click-summary="handleOneClickSummary"
          />

          <div class="mb-4 lg:mb-8">
            <CogsSummary :data="breakdownData?.data" />
          </div>

          <div class="mb-4 lg:mb-8">
            <div class="h-[500px]">
              <CogsBreakdownByCategory :data="breakdownData" />
            </div>
          </div>

          <div class="mb-8">
            <div class="lg:h-[420px] h-[500px]">
              <CogsRevenueToCogsMonthly :data="revenueToCogsData" />
            </div>
          </div>

          <div>
            <div class="lg:h-[440px] h-[500px]">
              <CogsLast6Months :data="trendData" />
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
import { ref, onMounted, watch } from 'vue'

const isChatOpen = ref(false)
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

const { dateFrom, dateTo, breakdownData, trendData, revenueToCogsData, fetchAll } = useCogs()

const handleDateChange = (period) => {
  if (period.custom_from) dateFrom.value = period.custom_from
  if (period.custom_to)   dateTo.value   = period.custom_to
  fetchAll(currentLang.value)
}

const handleReload = () => fetchAll(currentLang.value)

const handleOneClickSummary = () => {
  console.log('One Click Summary clicked')
}

watch(currentLang, () => fetchAll(currentLang.value))

onMounted(() => fetchAll(currentLang.value))
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
