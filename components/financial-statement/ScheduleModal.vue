<template>
    <Teleport to="body">
        <!-- Transition for the Slide-up effect -->
        <Transition name="bottom-sheet">
            <div v-if="isOpen"
                class="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">

                <!-- Main Panel -->
                <div class="w-full bg-white flex flex-col transition-all duration-500 shadow-2xl
                 max-h-[85vh] rounded-t-4xl 
                 sm:h-auto sm:max-w-6xl sm:max-h-[90vh] sm:min-h-[40vh] sm:rounded-xl"
                    :class="[isDark ? 'bg-[#002e26] border-t sm:border border-white/10' : 'bg-white border-none']">
                    <!-- Mobile Drag Handle (Visual only) -->
                    <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                        <div class="w-12 h-1.5 rounded-full bg-gray-300/30"></div>
                    </div>

                    <!-- Header Section (Stays at the top) -->
                    <div class="flex justify-between items-center py-4 px-4 sm:px-8 shrink-0 border-b sm:border-none"
                        :class="isDark ? 'border-white/5' : 'border-gray-100'">
                        <div class="flex flex-col">
                            <h3 class="text-lg sm:text-xl font-semibold"
                                :class="isDark ? 'text-white' : 'text-primary-750'">
                                Schedule {{ schedule }} - {{ title }}
                            </h3>
                            <p class="sm:hidden text-[10px] opacity-50"
                                :class="isDark ? 'text-white' : 'text-gray-500'">
                                Values in AED Million • Swipe table to view more
                            </p>
                        </div>

                        <div class="flex items-center gap-4">
                            <span class="hidden sm:block text-xs" :class="isDark ? 'text-white/50' : 'text-gray-500'">
                                Values in AED Million
                            </span>
                            <button @click="$emit('close')" class="p-2 hover:bg-black/5 rounded-full transition-colors">
                                <svg class="w-6 h-6" :class="isDark ? 'text-white' : 'text-black'" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- ── Table Container (Handles Horizontal Scroll) ── -->
                    <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar">
                        <div class="min-w-[800px] flex flex-col flex-1 h-full">

                            <!-- Loading & Empty States -->
                            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029F80]"></div>
                            </div>

                            <div v-else-if="!data || data.length === 0" class="py-20 text-center">
                                <p :class="isDark ? 'text-white/50' : 'text-gray-400'">No data available</p>
                            </div>

                            <template v-else>
                                <!-- ── Fixed Table Column Headers ── -->
                                <div class="shrink-0 sticky top-0 z-10">
                                    <table class="w-full text-sm table-fixed">
                                        <colgroup>
                                            <col style="width: 25%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                        </colgroup>
                                        <thead class="text-white bg-[#029F80]">
                                            <tr>
                                                <th class="lg:ps-8 ps-4 py-4 text-start font-medium">Particulars</th>
                                                <th class="px-4 py-4 text-center font-medium">Current Year</th>
                                                <th class="px-4 py-4 text-center font-medium">Previous Year</th>
                                                <th class="px-4 py-4 text-center font-medium">Budget</th>
                                                <th class="px-4 py-4 text-center font-medium">Variance</th>
                                                <th class="pe-4 py-4 text-center font-medium">Year to Go</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                <!-- ── Scrollable Body ── -->
                                <div class="overflow-y-auto custom-scrollbar flex-1 max-h-[50vh]">
                                    <table class="w-full text-sm table-fixed">
                                        <colgroup>
                                            <col style="width: 25%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                            <col style="width: 15%">
                                        </colgroup>
                                        <tbody :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                                            <template v-for="(item, idx) in data" :key="idx">
                                                <!-- Main Row -->
                                                <tr :class="[
                                                    item.isTotal
                                                        ? (isDark ? 'bg-[#00C9A7]/20 font-bold' : 'bg-[#64E9D1] font-bold')
                                                        : (isDark ? 'border-b border-white/5' : 'border-b border-gray-50 hover:bg-gray-50/50')
                                                ]" class="transition-colors">
                                                    <td class="lg:ps-8 ps-4 py-4 text-start">
                                                        <div class="flex items-center gap-4">
                                                            <span :class="[isDark ? 'text-white/80' : 'text-gray-700']">{{
                                                                item.subgroup }}</span>
                                                            <button v-if="!item.isTotal" @click="handleLedgerList(item)"
                                                                class="p-1">
                                                                <svg class="w-2.5 h-2.5 text-gray-400 transition-transform duration-200"
                                                                    :class="{ 'rotate-180': expandedRows.includes(item.subgroup) }"
                                                                    viewBox="0 0 10 6" fill="currentColor">
                                                                    <path d="M0 0L5 6L10 0H0Z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td class="px-4 py-4 text-center"
                                                        :class="isDark ? 'text-white/60' : 'text-gray-600'">{{
                                                            formatNumber(item.current_year) }}</td>
                                                    <td class="px-4 py-4 text-center"
                                                        :class="isDark ? 'text-white/60' : 'text-gray-600'">{{
                                                            formatNumber(item.previous_year) }}</td>
                                                    <td class="px-4 py-4 text-center"
                                                        :class="isDark ? 'text-white/60' : 'text-gray-600'">{{ item.budget ?
                                                            formatNumber(item.budget) : '-' }}</td>
                                                    <td class="px-4 py-4 text-center">
                                                        <span
                                                            :class="[item.variance < 0 ? 'bg-red-100 text-red-600' : 'bg-[#E6F9F4] text-[#029F80]', 'px-3 py-1 rounded-full text-[11px] font-bold']">
                                                            {{ item.variance_percent }}
                                                        </span>
                                                    </td>
                                                    <td class="pe-8 py-2">
                                                        <div class="flex justify-center items-center">
                                                            <div v-if="item.ytg_percent !== null" class="w-[65px] h-[32px] relative">
                                                                <svg class="w-full h-full" viewBox="0 0 36 22">
                                                                    <circle cx="18" cy="18" r="15" fill="none"
                                                                        :stroke="isDark ? '#ffffff1a' : '#f1f1f1'"
                                                                        stroke-width="3" stroke-dasharray="47.1 94.2"
                                                                        transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                                    <circle cx="18" cy="18" r="15" fill="none" :stroke="getProgressColor(item.ytg_percent)"
                                                                        stroke-width="3.5" stroke-dasharray="47.1 94.2"
                                                                        :stroke-dashoffset="Math.max(0, 47.1 - (Math.min(parseFloat(item.ytg_percent), 100) / 100) * 47.1)"
                                                                        transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                                </svg>
                                                                <span
                                                                    class="absolute bottom-0 inset-x-0 flex items-center justify-center text-[10px] font-bold"
                                                                    :class="isDark ? 'text-white' : 'text-black'">{{
                                                                        item.ytg_percent }}</span>
                                                            </div>
                                                            <div v-else class="text-gray-400 text-xs">-</div>
                                                        </div>
                                                    </td>
                                                </tr>
        
                                                <!-- Expansion Rows -->
                                                <template v-if="expandedRows.includes(item.subgroup)">
                                                    <!-- Loading -->
                                                    <tr v-if="rowLoading[item.subgroup]" :class="[
                                                        isDark
                                                            ? 'bg-emerald-900/20 border-b border-gray-700/50'
                                                            : 'bg-primary-1150 border-b border-emerald-200/70'
                                                    ]">
                                                        <td colspan="6" class="py-5 text-center">
                                                            <div class="animate-spin inline-block rounded-full h-5 w-5 border-b-2"
                                                                :class="isDark ? 'border-emerald-400' : 'border-emerald-700'">
                                                            </div>
                                                        </td>
                                                    </tr>
        
                                                    <!-- Empty State -->
                                                    <tr v-if="!rowLoading[item.subgroup] && ledgerDataMap[item.subgroup]?.length === 0"
                                                        :class="isDark ? 'bg-emerald-950/15 border-b border-gray-800/70' : 'bg-primary-1150 border-b border-emerald-200/60'">
                                                        <td colspan="6" class="py-4 text-center text-xs"
                                                            :class="isDark ? 'text-white/40' : 'text-gray-400'">
                                                            No ledger data for selected period
                                                        </td>
                                                    </tr>
        
                                                    <!-- Ledger Data Rows -->
                                                    <tr v-for="(ledger, lIdx) in ledgerDataMap[item.subgroup]"
                                                        :key="`ledger-${lIdx}`" :class="[
                                                            isDark
                                                                ? 'bg-emerald-950/15 hover:bg-emerald-900/25 border-b border-gray-800/70'
                                                                : 'bg-primary-1150 hover:bg-emerald-100/80 border-b border-emerald-200/60'
                                                        ]">
                                                        <td class="lg:px-8 px-4 py-3.5 text-start">
                                                            <CommonTooltip
                                                                :text="currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger'"
                                                                position="top">
                                                                <button @click="openGlReport(ledger)"
                                                                    class="underline cursor-pointer font-medium text-left"
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
                                                        <td class="px-4 py-3.5 text-center">
                                                            <span v-if="ledger.variance_percent && !ledger.isTotal"
                                                                :class="[ledger.variance < 0 ? 'bg-red-100 text-red-600' : 'bg-[#E6F9F4] text-[#029F80]', 'px-3 py-1 rounded-full text-[11px] font-bold']">
                                                                {{ ledger.variance_percent }}
                                                            </span>
                                                            <span v-else :class="isDark ? 'text-gray-200' : 'text-gray-600'">-</span>
                                                        </td>
                                                        <td class="px-4 py-3.5 text-center"
                                                            :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                                                            -
                                                        </td>
                                                    </tr>
                                                </template>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
    <FinancialStatementLedgerDetailsModal :isOpen="isLedgerReportOpen" :loading="ledgerReportLoading"
        :ledgerName="activeLedgerName" :data="ledgerReportData" :isDark="isDark" @close="isLedgerReportOpen = false" />
</template>
<script setup>
import { ref } from 'vue';
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase;
const currentLang = useState('currentLang', () => 'en')
const props = defineProps({
    isOpen: Boolean,
    loading: Boolean,
    data: Array,
    title: String,
    isDark: Boolean,
    schedule: String,
    activeTab: String,
    // Ensure these are passed from the parent component
    rangeOption: { type: String, default: 'Previous 3 months' },
    customFrom: { type: String, default: '12-01-2025' },
    customTo: { type: String, default: null }
});

defineEmits(['close']);

// --- New Reactive State ---
const expandedRows = ref([]);      // Tracks which subgroups are open
const ledgerDataMap = ref({});     // Stores API results: { "Subgroup Name": [data] }
const rowLoading = ref({});        // Tracks loading state per row: { "Subgroup Name": true/false }

const mapRangeOption = (en) => {
    // Pass the range_option through directly — already backend-correct from the page handler
    return en ?? 'Year to Date'
}

const getProgressColor = (progress) => {
    const val = parseFloat(progress);
    if (val >= 50) return '#00d28e';
    if (val >= 25) return '#ffb74d';
    return '#fb7554';
};

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

    // Determine endpoint based on activeTab
    const isBalanceSheet = props.activeTab === 'balance-sheet';
    const endpoint = isBalanceSheet ? 'gl/report-bs' : 'gl/report-pl';

    try {
        const response = await useApi(`/financial-analysis/${endpoint}`, {
            method: 'POST',
            body: {
                ledger_name: activeLedgerName.value,
                range_option: mapRangeOption(props.rangeOption),
                custom_from: props.customFrom,
                custom_to: props.customTo
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

        const isBalanceSheet = props.activeTab === 'balance-sheet';
        const endpoint = isBalanceSheet ? '/financial-analysis/bs-ledger-details' : '/financial-analysis/pl-ledger-details';

        const response = await useApi(endpoint, {
            method: 'POST',
            body: {
                subgroup: item.subgroup,
                range_option: mapRangeOption(props.rangeOption),
                custom_from: props.customFrom,
                custom_to: props.customTo
            }
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
