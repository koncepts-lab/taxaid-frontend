<template>
    <NuxtLayout name="dashboard">
        <!-- Main Wrapper: Fixed height, no page scroll -->
        <div class="h-[calc(100vh-90px)] bg-[#F0F5F4] p-6 font-sans overflow-hidden">
            <div class="flex gap-6 h-full">

                <!-- Left Sidebar: Internal scroll for 'Recent' section -->
                <TaxQueriesLeftSideBar v-model:activeTab="activeTabId" class="w-80 shrink-0" />

                <!-- Right Main Content Area -->
                <div class="flex-1 flex flex-col gap-5 overflow-hidden">

                    <!-- Table Component: Shrink-0 ensures it doesn't get crushed -->
                    <TaxQueriesTaxTable :isMinimized="isTableMinimized" :data="currentTableData"
                        @toggleMinimize="isTableMinimized = !isTableMinimized" class="shrink-0" />

                    <!-- Chat Component: flex-1 min-h-0 allows it to grow/shrink and scroll internally -->
                    <TaxQueriesChatWindow :isMinimized="isTableMinimized" class="flex-1 min-h-0" />

                    <!-- Footer -->
                    <div class="flex justify-between items-center text-[10px] text-gray-400 px-2 shrink-0">
                        <p>Copyright Reserved @2025</p>
                        <p>Last Sync: 19 Oct 2025, 10:45 AM IST</p>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
const activeTabId = ref('vat');
const isTableMinimized = ref(false);

const tableData = {
    vat: [
        { quarter: 'Q1 2025', budgeted: 1200000, recorded: 1150000, variance: 50000, variancePercent: -4.2 },
        { quarter: 'Q2 2025', budgeted: 1200000, recorded: 1150000, variance: 130000, variancePercent: -9.0 },
        { quarter: 'Q3 2025', budgeted: 1200000, recorded: 1150000, variance: 20000, variancePercent: -1.2 },
        { quarter: 'Q4 2025', budgeted: 1200000, recorded: 1150000, variance: 130000, variancePercent: -7.4 },
    ],
    corporate: [
        { quarter: 'FY 2025', budgeted: 5000000, recorded: 4800000, variance: 200000, variancePercent: -4.0 },
    ],
};

const currentTableData = computed(() => tableData[activeTabId.value] || tableData.vat);
</script>