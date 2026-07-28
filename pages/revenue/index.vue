<template>
    <NuxtLayout name="dashboard">

        <!-- 1. Container fills the content height -->
        <div v-if="!isFullScreenChat" class="min-h-screen font-sans flex relative z-10"
            :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

            <!-- 2. LEFT AREA: Resizes dynamically -->
            <div id="revenue-left-area" class="flex-1 min-w-0 no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-0" 
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
                        :showDateFilter="true"
                        :showReload="true"
                        :showExport="true"
                        :periods="revenuePeriods"
                        @reload="fetchAll"
                        @selected-date="handleDateSelected"
                        @export-excel="handleExport('excel')"
                        @export-pdf="handleExport('pdf')"
                    />

                    <template v-if="loadingBreakdown">
                        <div class="relative w-full min-h-[500px]">
                            <div class="relative z-10 space-y-4 lg:space-y-8">
                                <!-- Summary Skeleton -->
                                <div class="rounded-3xl p-6 border relative animate-pulse" :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30' : 'border-[#04C18F80] bg-[#00FFBC1F] shadow-sm'">
                                    <div class="h-7 rounded w-1/4 mb-6" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                    <div class="space-y-4">
                                        <div class="h-[40px] rounded-xl w-full" :class="isDark ? 'bg-white/10' : 'bg-white/50'"></div>
                                        <div class="h-[40px] rounded-xl w-full" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/20'"></div>
                                        <div class="h-[40px] rounded-xl w-full" :class="isDark ? 'bg-white/10' : 'bg-white/50'"></div>
                                    </div>
                                </div>
                                
                                <!-- Gauge & Category Skeleton -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div class="rounded-[20px] p-6 border relative animate-pulse h-[410px] lg:h-[500px] flex flex-col" :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30' : 'border-[#04C18F80] bg-[#00FFBC1F] shadow-sm'">
                                        <div class="h-7 rounded w-1/2 mb-auto" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                        <div class="w-48 h-48 rounded-full mx-auto mb-auto" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/20'"></div>
                                    </div>
                                    <div class="rounded-[20px] p-6 border relative animate-pulse h-[410px] lg:h-[500px] flex flex-col" :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30' : 'border-[#04C18F80] bg-[#00FFBC1F] shadow-sm'">
                                        <div class="h-7 rounded w-1/3 mb-10" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                        <div class="flex items-end justify-center gap-6 h-48 mt-auto mb-10">
                                            <div class="w-16 h-full rounded-t-xl" :class="isDark ? 'bg-white/10' : 'bg-white/50'"></div>
                                            <div class="w-16 h-3/4 rounded-t-xl" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/20'"></div>
                                            <div class="w-16 h-1/2 rounded-t-xl" :class="isDark ? 'bg-white/10' : 'bg-white/50'"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Trend Skeleton -->
                                <div class="rounded-[20px] p-6 border relative animate-pulse h-[400px] flex flex-col" :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30' : 'border-[#04C18F80] bg-[#00FFBC1F] shadow-sm'">
                                    <div class="h-7 rounded w-1/4 mb-10" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                    <div class="w-full flex-1 rounded-xl" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                </div>
                                
                                <!-- Top Customers Skeleton -->
                                <div class="rounded-[20px] p-6 border relative animate-pulse h-[400px] flex flex-col" :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30' : 'border-[#04C18F80] bg-[#00FFBC1F] shadow-sm'">
                                    <div class="h-7 rounded w-1/3 mb-10" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                    <div class="w-full flex-1 rounded-xl" :class="isDark ? 'bg-white/10' : 'bg-[#008169]/10'"></div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <CommonParticleBackground :delay="1500" />
                        
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
                    </template>

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

onMounted(() => {
  fetchAll()
  useLocation().syncSessionLocation()
  useNotificationSettings().syncWebPush()
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
