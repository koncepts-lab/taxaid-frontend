<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div class="w-full max-w-6xl max-h-[90vh] min-h-[40vh] rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500"
                :class="isDark ? 'bg-[#002e26] border border-white/10' : 'bg-white'">

                <!-- Header -->
                <div class="flex justify-between items-center py-5 px-8">
                    <div class="flex flex-col">
                        <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-primary-750'">
                            Schedule {{ schedule }} - {{ title }}
                        </h3>
                    </div>
                    <div class="flex items-center gap-6">
                        <span class="text-xs" :class="isDark ? 'text-white/50' : 'text-gray-500'">Values in AED
                            Million</span>
                        <button @click="$emit('close')" class="hover:opacity-70 transition-opacity">
                            <svg class="w-6 h-6" :class="isDark ? 'text-white' : 'text-black'" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Content Area -->
                <div class="flex-1 overflow-auto no-scrollbar">
                    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029F80]"></div>
                    </div>
                    <div v-else-if="!props.data || props.data.length === 0"
                        class="flex flex-col items-center justify-center py-24 px-8 text-center">
                        <div class="mb-4 p-4 rounded-full" :class="isDark ? 'bg-white/5' : 'bg-gray-50'">
                            <svg class="w-12 h-12 opacity-20" :class="isDark ? 'text-white' : 'text-gray-400'"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p class="text-lg font-medium" :class="isDark ? 'text-white/70' : 'text-gray-500'">
                            No data available
                        </p>
                        <p class="text-sm mt-1" :class="isDark ? 'text-white/40' : 'text-gray-400'">
                            There are no records found for {{ schedule }}.
                        </p>
                    </div>

                    <table v-else class="w-full text-sm border-collapse">
                        <thead class="sticky top-0 z-10 text-white bg-[#029F80]">
                            <tr>
                                <th class="ps-8 py-4 text-start font-medium">Particulars</th>
                                <th class="px-4 py-4 text-center font-medium">
                                    <div class="flex items-center justify-center gap-1">
                                        Current Year <img src="/images/icons/current-year.svg"
                                            class="w-4 h-4 brightness-200" />
                                    </div>
                                </th>
                                <th class="px-4 py-4 text-center font-medium">Previous Year</th>
                                <th class="px-4 py-4 text-center font-medium">Budget</th>
                                <th class="px-4 py-4 text-center font-medium">Variance</th>
                                <th class="pe-8 py-4 text-center font-medium">Year to Go</th>
                            </tr>
                        </thead>

                        <tbody :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                            <template v-for="(item, idx) in props.data" :key="idx">

                                <!-- Parent Row -->
                                <tr :class="[
                                    item.isTotal
                                        ? (isDark ? 'bg-[#00C9A7]/20 font-bold' : 'bg-[#64E9D1] font-bold')
                                        : (isDark ? 'border-b border-white/5' : 'border-b border-gray-50 hover:bg-gray-50/50')
                                ]" class="transition-colors">

                                    <!-- Particulars -->
                                    <td class="ps-8 py-4 text-start">
                                        <div class="flex items-center gap-4">
                                            <span :class="[isDark ? 'text-white/80' : 'text-gray-700']">{{ item.subgroup
                                            }}</span>

                                            <!-- Toggle Button (Triangle Icon matching image) -->
                                            <button v-if="!item.isTotal" @click="handleLedgerList(item)"
                                                class="focus:outline-none">
                                                <svg class="w-2.5 h-2.5 text-gray-400 transition-transform duration-200"
                                                    :class="{ 'rotate-180': expandedRows.includes(item.subgroup) }"
                                                    viewBox="0 0 10 6" fill="currentColor">
                                                    <path d="M0 0L5 6L10 0H0Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>

                                    <td class="px-4 py-4 text-center"
                                        :class="isDark ? 'text-white/60' : 'text-gray-600'">
                                        {{ formatNumber(item.current_year) }}</td>
                                    <td class="px-4 py-4 text-center"
                                        :class="isDark ? 'text-white/60' : 'text-gray-600'">
                                        {{ formatNumber(item.previous_year) }}</td>
                                    <td class="px-4 py-4 text-center"
                                        :class="isDark ? 'text-white/60' : 'text-gray-600'">
                                        {{ item.budget ? formatNumber(item.budget) : '-' }}</td>
                                    <td class="px-4 py-4 text-center">
                                        <span :class="[
                                            item.variance < 0 ? 'bg-red-100 text-red-600' : 'bg-[#E6F9F4] text-[#029F80]',
                                            'px-3 py-1 rounded-full text-xs font-semibold'
                                        ]">
                                            {{ item.variance_percent }}
                                        </span>
                                    </td>
                                    <td class="pe-8 py-2">
                                        <!-- Progress Gauge (Visible in image) -->
                                        <div class="flex justify-center items-center">
                                            <div v-if="item.ytg_percent !== null" class="w-12 h-8 relative">
                                                <svg class="w-full h-full" viewBox="0 0 36 22">
                                                    <circle cx="18" cy="18" r="15" fill="none"
                                                        :stroke="isDark ? '#ffffff1a' : '#f1f1f1'" stroke-width="3"
                                                        stroke-dasharray="47.1 94.2" transform="rotate(-180 18 18)"
                                                        stroke-linecap="round" />
                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#FB7554"
                                                        stroke-width="3.5" stroke-dasharray="47.1 94.2"
                                                        :stroke-dashoffset="47.1 - (parseFloat(item.ytg_percent) / 100) * 47.1"
                                                        transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                </svg>
                                                <span
                                                    class="absolute bottom-0 inset-x-0 flex items-center justify-center text-[9px] font-bold"
                                                    :class="isDark ? 'text-white' : 'text-black'">{{ item.ytg_percent
                                                    }}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <!-- EXPANDED SUB-LIST (Matching the green styling in image) -->
                                <template v-if="expandedRows.includes(item.subgroup)">
                                    <!-- Loading -->
                                    <tr v-if="rowLoading[item.subgroup]" :class="[
                                        isDark
                                            ? 'bg-emerald-900/20 border-b border-gray-700/50'
                                            : 'bg-primary-1150 border-b border-emerald-200/70'
                                    ]">
                                        <td colspan="6" class="py-5 text-center">
                                            <div class="animate-spin inline-block rounded-full h-5 w-5 border-b-2"
                                                :class="isDark ? 'border-emerald-400' : 'border-emerald-700'"></div>
                                        </td>
                                    </tr>

                                    <!-- Ledger Data Rows -->
                                    <tr v-for="(ledger, lIdx) in ledgerDataMap[item.subgroup]" :key="`ledger-${lIdx}`"
                                        :class="[
                                            isDark
                                                ? 'bg-emerald-950/15 hover:bg-emerald-900/25 border-b border-gray-800/70'
                                                : 'bg-primary-1150 hover:bg-emerald-100/80 border-b border-emerald-200/60'
                                        ]">
                                        <!-- Underlined Ledger Name -->
                                        <td class="px-8 py-3.5 text-start">
                                            <CommonTooltip
                                                :text="currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger'"
                                                position="top">
                                                <button @click="openGlReport(ledger)"
                                                    class="underline cursor-pointer font-medium"
                                                    :class="isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-black/80 hover:text-emerald-800'">
                                                    {{ ledger.ledger_name || ledger.subgroup }}
                                                </button>
                                            </CommonTooltip>
                                        </td>

                                        <td class="px-4 py-3.5 text-center "
                                            :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                                            {{ formatNumber(ledger.current_year) }}
                                        </td>

                                        <td class="px-4 py-3.5 text-center"
                                            :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                                            {{ formatNumber(ledger.previous_year) }}
                                        </td>

                                        <td class="px-4 py-3.5 text-center"
                                            :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                                            {{ ledger.budget ? formatNumber(ledger.budget) : '-' }}
                                        </td>

                                        <td class="px-4 py-3.5 text-center"
                                            :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                                            -
                                        </td>

                                        <td class="pe-8 py-3.5 text-center"
                                            :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                                            -
                                        </td>
                                    </tr>
                                </template>

                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Teleport>
    <FinancialStatementLedgerDetailsModal :isOpen="isLedgerReportOpen" :loading="ledgerReportLoading"
        :ledgerName="activeLedgerName" :data="ledgerReportData" :isDark="isDark" @close="isLedgerReportOpen = false" />
</template>

<script setup>
import { ref } from 'vue';
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase;
const props = defineProps({
    isOpen: Boolean,
    loading: Boolean,
    data: Array,
    title: String,
    isDark: Boolean,
    schedule: String,
    // Ensure these are passed from the parent component
    rangeOption: { type: String, default: 'Previous 3 months' },
    customFrom: { type: String, default: '12-01-2025' }
});

defineEmits(['close']);

// --- New Reactive State ---
const expandedRows = ref([]);      // Tracks which subgroups are open
const ledgerDataMap = ref({});     // Stores API results: { "Subgroup Name": [data] }
const rowLoading = ref({});        // Tracks loading state per row: { "Subgroup Name": true/false }

const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(num);
};
const isLedgerReportOpen = ref(false);
const ledgerReportLoading = ref(false);
const ledgerReportData = ref({ entries: [] });
const activeLedgerName = ref('');

const openGlReport = async (ledger) => {
    activeLedgerName.value = ledger.ledger_name || ledger.subgroup;
    isLedgerReportOpen.value = true;
    ledgerReportLoading.value = true;

    // Determine endpoint based on schedule type (e.g., S1-S5 are Balance Sheet)
    const isBalanceSheet = props.schedule.startsWith('S');
    const endpoint = isBalanceSheet ? 'gl/report-bs' : 'gl/report-pl';

    try {
        const response = await $fetch(`${baseUrl}/financial-analysis/${endpoint}`, {
            method: 'POST',
            body: {
                ledger_name: activeLedgerName.value,
                range_option: props.rangeOption,
                custom_from: props.customFrom
            }
        });
        ledgerReportData.value = response.data;
    } catch (error) {
        console.error("GL Report Error:", error);
    } finally {
        ledgerReportLoading.value = false;
    }
};
const handleLedgerList = async (item) => {
    const key = item.subgroup;

    // 1. Toggle Collapse: If already open, remove from array and close
    if (expandedRows.value.includes(key)) {
        expandedRows.value = expandedRows.value.filter(i => i !== key);
        return;
    }

    // 2. Add to expanded rows
    expandedRows.value.push(key);

    // 3. Prevent duplicate API calls if data already exists
    if (ledgerDataMap.value[key]) return;

    // 4. API Call Logic
    try {
        rowLoading.value[key] = true;

        const response = await $fetch(`${baseUrl}/financial-analysis/pl-ledger-details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subgroup: item.subgroup,
                range_option: props.rangeOption,
                custom_from: props.customFrom
            })
        });


        // Assuming your API returns { data: [...] }
        ledgerDataMap.value[key] = response.data || [];
    } catch (error) {
        console.error("Failed to fetch ledger details:", error);
    } finally {
        rowLoading.value[key] = false;
    }
};
</script>