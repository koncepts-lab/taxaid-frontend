<template>
    <NuxtLayout name="dashboard">
        <div class="lg:h-[calc(100vh-90px)] h-auto bg-[#F0F5F4] lg:px-6 px-0 pb-4 font-sans overflow-hidden">
            <div class="flex justify-between items-center mb-4">
                <h1 class="lg:hidden font-medium text-2xl lg:mb-0" :class="isDark ? 'text-white' : 'text-[#013E32]'">Tax Queries</h1>
                <button @click="handleChatOpen">
                    <img src="/images/icons/hamburger.svg" class="w-6 h-6 lg:hidden" />
                </button>
            </div>
            <div class="flex gap-6 h-full">
                <TaxQueriesLeftSideBar v-model:activeTab="activeTabId" :isSideChatOpen="isSideChatOpen"
                    @close="isSideChatOpen = false" />

                <div class="flex-1 flex flex-col gap-5 overflow-hidden">
                    <TaxQueriesTaxTable :isMinimized="isTableMinimized" :title="currentTitle" :data="currentTableData"
                        @toggleMinimize="isTableMinimized = !isTableMinimized" class="shrink-0" />

                    <TaxQueriesChatWindow :isMinimized="isTableMinimized" class="flex-1 min-h-0 max-lg:hidden" />
                </div>
            </div>
        </div>
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" class="lg:hidden" />

    </NuxtLayout>
</template>

<script setup>
import { useTheme } from '#imports'
const { isDark } = useTheme()
const activeTabId = ref('vat');
const isTableMinimized = ref(false);
const isSideChatOpen = ref(false);
const isChatOpen = ref(false);

const { tableData } = useTaxQueriesPage()

onMounted(() => useLocation().syncSessionLocation())

const currentTitle = computed(() => {
    const titles = {
        vat: 'VAT Queries',
        corporate: 'Corporate Tax',
        ifrs: 'IFRS',
        accounting: 'General Accounting'
    };
    return titles[activeTabId.value] || 'Tax Data';
});

const currentTableData = computed(() => tableData.value[activeTabId.value] || []);

const handleChatOpen = () => {
    isSideChatOpen.value = true;
}
</script>