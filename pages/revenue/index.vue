<template>
    <NuxtLayout name="dashboard">

        <!-- 1. Container fills the content height -->
        <div v-if="!isFullScreenChat" class="min-h-screen font-sans flex relative z-10"
            :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

            <!-- 2. LEFT AREA: Resizes dynamically -->
            <div id="revenue-left-area" class="flex-1 no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-0" 
                 :class="[
                    isChatOpen 
                        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
                        : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')
                 ]">
                <div class="mx-auto pt-0">
                    
                    <CommonDashboardHeader
                        class="mb-4 lg:mb-8"
                        :title="{ en: 'Revenue Analysis', ar: 'تحليل الإيرادات' }"
                        :subtitle="{ en: 'Comprehensive revenue tracking and insights', ar: 'تتبع شامل للإيرادات والرؤى' }"
                        :oneclickreview="false"
                        :showDateFilter="true"
                        :showReload="true"
                        :showExport="true"
                        :periods="revenuePeriods"
                        @reload="fetchAll"
                        @selected-date="handleDateSelected"
                        @export-excel="handleExport('excel')"
                        @export-pdf="handleExport('pdf')"
                    />

                    <div class="rounded-3xl mb-4 lg:mb-8 transition-all duration-500"
                        :class="isDark ? 'bg-[#00141080] border-none' : 'bg-white border border-gray-100'"
                        :style="isDark ? { boxShadow: '0px 4px 4px 0px #00000040' } : {}">
                        <RevenueSummary 
                            :data="summaryData" 
                            :is-compressed="isChatOpen" 
                            :loading="loadingBreakdown"
                            :error="errorBreakdown"
                        />
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 lg:mb-8">
                        <div class="h-[410px] lg:h-[500px]">
                            <RevenueGauge 
                                :data="gaugeData"
                                :loading="loadingBreakdown"
                                :error="errorBreakdown"
                            />
                        </div>
                        <div class="h-[auto] lg:h-[500px]">
                            <RevenueByCategory 
                                :data="byCategoryData"
                                :loading="loadingBreakdown"
                                :error="errorBreakdown"
                            />
                        </div>
                    </div>

                    <div class="mb-4 lg:mb-8">
                        <div class="h-[auto]">
                            <RevenueTrend />
                        </div>
                    </div>

                    <div>
                        <div>
                            <RevenueTopCustomers />
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'


const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { fetchAll, customFrom, customTo, rangeOption, loading: loadingBreakdown, error: errorBreakdown, summaryData, gaugeData, byCategoryData } = useRevenue()

const revenuePeriods = [
    { en: 'Year to Date',  ar: 'منذ بداية العام' },
    // { en: 'This Quarter',  ar: 'هذا الربع' },    // not supported by backend
    // { en: 'Last Quarter',  ar: 'الربع الماضي' },  // not supported by backend
    // { en: 'This Year',     ar: 'هذه السنة' },     // not supported by backend
    // { en: 'Last Year',     ar: 'السنة الماضية' }, // not supported by backend
    { en: 'Custom Range',  ar: 'نطاق مخصص' },
]

const handleDateSelected = (periodData) => {
    rangeOption.value = periodData.en

    if (periodData.en === 'Custom Range') {
        // DashboardHeader emits dates as dd-MM-yyyy — convert to yyyy-MM-dd for backend
        if (periodData.custom_from) {
            const [d, m, y] = periodData.custom_from.split('-')
            customFrom.value = `${y}-${m}-${d}`
        }
        if (periodData.custom_to) {
            const [d, m, y] = periodData.custom_to.split('-')
            customTo.value = `${y}-${m}-${d}`
        }
    } else {
        // Let backend resolve dates from Carbon::now() — sending custom_from collapses
        // the Year to Date toDate to the anchor itself instead of today
        customFrom.value = null
        customTo.value   = null
    }

    fetchAll()
}

const handleExport = (type) => {}

onMounted(() => fetchAll())
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
