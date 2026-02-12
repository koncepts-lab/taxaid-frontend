<template>
    <NuxtLayout name="dashboard">
        <div class="min-h-screen bg-[#f0f4f7] font-sans overflow-x-hidden">
            <div class="flex gap-6 items-center transition-all duration-500 ease-in-out w-full">

                <div class="transition-all duration-500 ease-in-out min-w-0"
                    :class="isChatOpen ? 'w-[calc(100%-510px)]' : 'w-[calc(100%-140px)] mr-35'">
                    
                    <RevenueHeader class="mb-8" />

                    <div class="bg-white rounded-3xl py-8 shadow-sm border border-gray-100 mb-8">
                        <RevenueSummary :data="revenueSummaryData" :is-compressed="isChatOpen" />
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div class="h-[450px]">
                            <RevenueGauge />
                        </div>
                        <div class="h-[450px]">
                            <RevenueByCategory />
                        </div>
                    </div>

                    <p class="mt-8 text-[11px] text-gray-400">Copyright Reserved @2025</p>
                </div>

                <!-- RIGHT: Sidebar Container -->
                <aside class="transition-all duration-500 ease-in-out shrink-0"
                    :class="isChatOpen ? 'w-121.5' : 'w-auto'">
                    <CommonChatSideBar v-model:isChatOpen="isChatOpen" />
                </aside>

            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
const isChatOpen = ref(true)

const revenueSummaryData = [
    { label: 'Product Sales', current: '1,850,000', previous: '1,620,000', budget: '1,900,000', variance: '+14.2%', progress: 50 },
    { label: 'Service', current: '450,000', previous: '380,000', budget: '410,000', variance: '+18.4%', progress: 30 },
    { label: 'Subscriptions', current: '280,000', previous: '240,000', budget: '300,000', variance: '-16.7%', progress: 20 },
    { label: 'Total Revenue', current: '2,775,000', previous: '2,405,000', budget: '2,890,000', variance: '+15.4%', progress: 25, isSummary: true },
]
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
