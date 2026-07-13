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

          <!-- Gap-day snapshot notice: shown when the selected date has no
               uploaded AP snapshot and the latest earlier upload is displayed -->
          <div v-if="snapshotNotice"
            class="mb-4 -mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span v-if="currentLang === 'ar'">عرض بيانات <b>{{ snapshotDate }}</b> (آخر تحميل) — لا توجد بيانات للتاريخ المحدد {{ requestedDate }}</span>
            <span v-else>Showing data of <b>{{ snapshotDate }}</b> (last upload) — no data was uploaded for the selected date {{ requestedDate }}.</span>
          </div>

          <AccountsPayableAlert />

          <div class="mb-4 lg:mb-8">
            <AccountsPayableSummary :data="summary" :testDate="activeDate" />
          </div>

          <div class="mb-4 lg:mb-8">
            <div class="h-[600px]">
              <AccountsPayableTopCustomers :data="topCustomers" />
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

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { activeDate, fetchAll, summary, agingData, topCustomers, timelineData, snapshotNotice, snapshotDate, requestedDate } = useAccountsPayablePage()

const customPeriods = [
    // { en: 'Year to Date', ar: 'منذ بداية العام' }, // not supported — backend uses single test_date only
    // { en: 'This Quarter', ar: 'هذا الربع' },        // not supported
    // { en: 'Last Quarter', ar: 'الربع الماضي' },     // not supported
    // { en: 'This Year',    ar: 'هذه السنة' },        // not supported
    // { en: 'Last Year',    ar: 'السنة الماضية' },    // not supported
    { en: 'Custom Date', ar: 'تاريخ مخصص' },           // ✅ maps to ?test_date=Y-m-d
]

const handleDateChange = (period) => {
  const dateStr = period.custom_from || period.custom_to
  if (dateStr) {
    const [d, m, y] = dateStr.split('-')
    activeDate.value = `${y}-${m}-${d}`
  }
  fetchAll(currentLang.value)
}

const handleReload = () => fetchAll(currentLang.value)

watch(currentLang, () => fetchAll(currentLang.value))

onMounted(() => {
  fetchAll(currentLang.value)
  useLocation().syncSessionLocation()
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
