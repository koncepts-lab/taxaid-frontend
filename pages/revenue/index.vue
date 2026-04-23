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
                    
                    <RevenueHeader class="mb-4 lg:mb-8" />

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

<script setup>
import { ref, computed } from 'vue'

// revenue page 
const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { breakdownData, loading: loadingBreakdown, error: errorBreakdown } = useRevenueBreakdown()

// 1. Map Summary Data
const summaryData = computed(() => {
    if (!breakdownData.value?.data) return []
    
    return breakdownData.value.data.map(item => {
        const achievedPct = item.budget > 0 ? (item.current_year / item.budget) * 100 : 0
        const varianceSign = item.variance >= 0 ? '+' : ''
        
        return {
            label: item.subgroup,
            labelAr: item.subgroup, // Fallback
            current: formatStandardNumber(item.current_year),
            previous: formatStandardNumber(item.previous_year),
            budget: formatStandardNumber(item.budget),
            variance: `${varianceSign}${item.variance_percent}`,
            progress: Number(achievedPct.toFixed(1)),
            isSummary: item.isTotal
        }
    })
})

// 2. Map Gauge Data
const gaugeData = computed(() => {
    if (!breakdownData.value?.charts?.target_achievement) return null
    const target = breakdownData.value.charts.target_achievement
    
    return {
        target: target.target_value,
        achieved: target.current_value,
        previousYearPct: target.previous_percent,
        previousValue: target.previous_value
    }
})

// 3. Map ByCategory Data
const byCategoryData = computed(() => {
    if (!breakdownData.value?.charts?.revenue_by_category) return null
    const chart = breakdownData.value.charts.revenue_by_category
    
    return {
        categories: chart.categories,
        categoriesAr: chart.categories, // Fallback
        series: [
            {
                name: 'Previous Year',
                nameAr: 'السنة السابقة',
                data: chart.previous_year.map(v => Number((v / 1_000_000).toFixed(2)))
            },
            {
                name: 'Current Year',
                nameAr: 'السنة الحالية',
                data: chart.current_year.map(v => Number((v / 1_000_000).toFixed(2)))
            }
        ]
    }
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
