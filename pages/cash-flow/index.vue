<template>
    <NuxtLayout name="dashboard">
        <ParticleBackground />

        <!-- 1. Container fills the screen height and prevents page-level scrolling -->
        <div v-if="!isFullScreenChat" class="h-screen bg-[#f0f4f7] font-sans flex overflow-hidden relative z-10"
            :class="{ 'dark-mode-bg': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

            <!-- 2. LEFT AREA: Resizes dynamically and handles its own scrolling -->
            <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out p-8 pt-0"
                :class="isChatOpen ? `2xl:mr-[480px] mr-[400px]` : `mr-[170px]`">
                <div class="mx-auto">
                    
                    <CashFlowHeader class="mb-8" />

                    <CashFlowMetrics />

                    <div class="rounded-3xl mb-8 transition-all duration-500"
                        :class="isDark ? 'bg-[#00141080] border-none' : 'bg-white shadow-sm border border-gray-100'"
                        :style="isDark ? { boxShadow: '0px 4px 4px 0px #00000040' } : {}">
                        <CashFlowSummary :data="cashFlowSummaryData" :is-compressed="isChatOpen" />
                    </div>

                    <div class="mb-8">
                        <div class="h-[420px]">
                            <CashFlowChart />
                        </div>
                    </div>

                    <div class="mb-8">
                        <div class="h-[420px]">
                            <CashFlowInflowOutflow />
                        </div>
                    </div>

                </div>
            </div>

            <!-- 3. RIGHT SIDEBAR: Fixed width, does not scroll with content -->
            <aside class="fixed right-0 top-1/2 -translate-y-1/2 shrink-0 transition-all duration-500 ease-in-out mt-5"
                :class="isChatOpen ? '2xl:w-120 w-100' : 'w-[80px]'">
                <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
            </aside>
        </div>
        
        <div v-else class="w-full flex overflow-hidden">
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
import ParticleBackground from '~/components/common/ParticleBackground.vue'

const isChatOpen = ref(true)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const cashFlowSummaryData = computed(() => [
    { label: 'Operating Activities', labelAr: 'أنشطة التشغيل', current: '1,200,000', previous: '1,100,000', budget: '1,250,000', variance: '+9.1%', progress: 60 },
    { label: 'Investing Activities', labelAr: 'أنشطة الاستثمار', current: '-400,000', previous: '-350,000', budget: '-450,000', variance: '-14.3%', progress: 30 },
    { label: 'Financing Activities', labelAr: 'أنشطة التمويل', current: '-200,000', previous: '-150,000', budget: '-200,000', variance: '-33.3%', progress: 20 },
    { label: 'Net Cash Flow', labelAr: 'صافي التدفق النقدي', current: '600,000', previous: '600,000', budget: '600,000', variance: '0.0%', progress: 40, isSummary: true },
])
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
