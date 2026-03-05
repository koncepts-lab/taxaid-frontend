<template>
    <NuxtLayout name="dashboard">


        <!-- 1. Container fills the screen height and prevents page-level scrolling -->
        <div v-if="!isFullScreenChat" class="font-sans flex relative z-10"
            :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

            <!-- 2. LEFT AREA: Resizes dynamically -->
            <div class="flex-1 transition-all duration-500 ease-in-out px-8 pt-0 pb-[17px]" :class="isChatOpen 
                ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
                : (currentLang === 'ar' ? 'ml-[170px]' : 'mr-[170px]')">
                <div class="mx-auto">
                    
                    <RevenueHeader class="mb-8" />

                    <div class="rounded-3xl mb-8 transition-all duration-500"
                        :class="isDark ? 'bg-[#00141080] border-none' : 'bg-white border border-gray-100'"
                        :style="isDark ? { boxShadow: '0px 4px 4px 0px #00000040' } : {}">
                        <RevenueSummary :data="revenueSummaryData" :is-compressed="isChatOpen" />
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                        <div class="h-[500px]">
                            <RevenueGauge />
                        </div>
                        <div class="h-[500px]">
                            <RevenueByCategory />
                        </div>
                    </div>

                    <div class="mb-8">
                        <div class="h-[420px]">
                            <RevenueTrend />
                        </div>
                    </div>

                    <div>
                        <div class="h-[600px]">
                            <RevenueTopCustomers />
                        </div>
                    </div>

                </div>
            </div>

            <!-- 3. RIGHT SIDEBAR -->
            <aside class="fixed top-1/2 -translate-y-1/2 shrink-0 transition-all duration-500 ease-in-out mt-5" :class="[
                currentLang === 'ar' ? 'left-0' : 'right-0',
                isChatOpen ? '2xl:w-120 w-100' : 'w-[80px]'
            ]">
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

const revenueSummaryData = computed(() => [
    {
        label: 'Product Sales', labelAr: 'مبيعات المنتجات', current: '1,850,000', previous: '1,620,000', budget: '1,900,000', variance: '+14.2%', progress: 50,
        children: [
            { label: 'SST 01', labelAr: 'SST 01', current: '2,100,000', previous: '1,900,000' },
            { label: 'SST 02', labelAr: 'SST 02', current: '2,100,000', previous: '1,900,000' },
            { label: 'SST 03', labelAr: 'SST 03', current: '2,100,000', previous: '1,900,000' },
        ]
    },
    { label: 'Service', labelAr: 'الخدمات', current: '450,000', previous: '380,000', budget: '480,000', variance: '+18.4%', progress: 30 },
    { label: 'Subscriptions', labelAr: 'الاشتراكات', current: '280,000', previous: '240,000', budget: '300,000', variance: '-16.7%', progress: 20 },
    { label: 'Total Revenue', labelAr: 'إجمالي الإيرادات', current: '2,775,000', previous: '2,405,000', budget: '2,890,000', variance: '+15.4%', progress: 25, isSummary: true },
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
