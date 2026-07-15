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
                <div class="mx-auto pt-0">
                    
                    <CommonDashboardHeader
                        class="mb-4 lg:mb-8"
                        :title="{ en: 'Cash Flow Analysis', ar: 'تحليل التدفقات النقدية' }"
                        :subtitle="{ en: 'Track Overheads and Optimize Operational Costs', ar: 'تتبع النفقات العامة وتحسين التكاليف التشغيلية' }"
                        :oneclickreview="false"
                        :showDateFilter="true"
                        :showReload="true"
                        :showExport="true"
                        :showPeriodToggle="true"
                        :periods="cashFlowPeriods"
                        @reload="fetchProjection"
                        @selected-date="handleDateSelected"
                        @period-change="handlePeriodChange"
                        @export-excel="handleExport('excel')"
                        @export-pdf="handleExport('pdf')"
                    />

                    <CashFlowMetrics :is-compressed="isChatOpen" />

                    <div class="rounded-3xl mb-4 lg:mb-8 transition-all duration-500"
                        :class="isDark ? 'bg-[#00141080] border-none' : 'bg-white border border-gray-100'"
                        :style="isDark ? { boxShadow: '0px 4px 4px 0px #00000040' } : {}">
                        <CashFlowSummary :is-compressed="isChatOpen" />
                    </div>

                    <div class="mb-4 lg:mb-8">
                        <div class="h-[auto] lg:h-[420px]">
                            <CashFlowChart />
                        </div>
                    </div>

                    <div>
                        <div class="h-[auto] lg:h-[420px]">
                            <CashFlowInflowOutflow />
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

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { fetchProjection, activeDate, period } = useCashFlow()

// Backend only accepts: date (single Y-m-d anchor), period (3 or 6), scenario
// No range_option concept — Custom Date is the only supported date filter
const cashFlowPeriods = [
    // { en: 'Year to Date',  ar: 'منذ بداية العام' }, // not supported — no range_option in backend
    // { en: 'This Quarter',  ar: 'هذا الربع' },        // not supported — no range_option in backend
    // { en: 'Last Quarter',  ar: 'الربع الماضي' },     // not supported — no range_option in backend
    // { en: 'This Year',     ar: 'هذه السنة' },        // not supported — no range_option in backend
    // { en: 'Last Year',     ar: 'السنة الماضية' },    // not supported — no range_option in backend
    { en: 'Custom Date',   ar: 'تاريخ مخصص' },         // ✅ maps to ?date=Y-m-d query param
]

const handleDateSelected = (periodData) => {
    // Custom Date emits custom_from only (single day) — convert dd-MM-yyyy to yyyy-MM-dd
    if (periodData.custom_from) {
        const [d, m, y] = periodData.custom_from.split('-')
        activeDate.value = `${y}-${m}-${d}`
    }
    fetchProjection()
}

const handlePeriodChange = (months) => {
    period.value = months
    fetchProjection()
}

const handleExport = (type) => {}

onMounted(() => {
  fetchProjection()
  useLocation().syncSessionLocation()
})
</script>

<style scoped>
/* Custom scrollbar for some containers if needed */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}


</style>
