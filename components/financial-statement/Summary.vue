<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500"
        :class="isDark ? 'bg-[#00141050]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <div v-if="activeTab === 'schedules'" class="px-8 pb-8 flex gap-4 transition-all duration-500">
            <div class="flex-1 relative">
                <div @click="isOpenPL = !isOpenPL; isOpenBS = false"
                    class="w-full border rounded-lg py-3 px-4 text-sm flex justify-between items-center cursor-pointer transition-all"
                    :class="[
                        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-primary-650',
                        isOpenPL ? 'ring-1 ring-primary-750 border-primary-750' : ''
                    ]">
                    <span
                        :class="selectedPL ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/40' : 'text-black/40')">
                        {{ selectedPL || t.plPlaceholder }}
                    </span>
                    <svg class="w-4 h-4 transition-transform duration-300"
                        :class="[isOpenPL ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/40']" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div v-if="isOpenPL"
                    class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                    :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                    <div v-for="option in plOptions" :key="option" @click="selectedPL = option; isOpenPL = false"
                        class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                        :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                        {{ option }}
                    </div>
                </div>
            </div>

            <div class="flex-1 relative">
                <div @click="isOpenBS = !isOpenBS; isOpenPL = false"
                    class="w-full border rounded-lg py-3 px-4 text-sm flex justify-between items-center cursor-pointer transition-all"
                    :class="[
                        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-primary-650',
                        isOpenBS ? 'ring-1 ring-primary-750 border-primary-750' : ''
                    ]">
                    <span
                        :class="selectedBS ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/40' : 'text-black/40')">
                        {{ selectedBS || t.bsPlaceholder }}
                    </span>
                    <svg class="w-4 h-4 transition-transform duration-300"
                        :class="[isOpenBS ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/40']" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div v-if="isOpenBS"
                    class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                    :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                    <div v-for="option in bsOptions" :key="option" @click="selectedBS = option; isOpenBS = false"
                        class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                        :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                        {{ option }}
                    </div>
                </div>
            </div>
        </div>

        <div class="pb-6 px-8 flex justify-between items-center transition-all duration-500"
            :class="isDark ? 'bg-[#00141050]' : 'bg-white'">
            <div>
                <p class="text-base font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">{{ translatedTitle
                    }}</p>
                <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-black/59'">{{ t.valuesIn }}
                </p>
            </div>

            <div class="flex items-center gap-4">
                <div v-if="activeTab === 'ratios'" class="w-80 relative">
                    <div @click="isOpenRatio = !isOpenRatio"
                        class="w-full border rounded-lg py-2.5 px-4 text-sm flex justify-between items-center cursor-pointer transition-all"
                        :class="[
                            isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-primary-650',
                            isOpenRatio ? 'ring-1 ring-primary-750 border-primary-750' : ''
                        ]">
                        <span
                            :class="selectedRatio ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/40' : 'text-black/40')">
                            {{ selectedRatio || t.ratioPlaceholder }}
                        </span>
                        <svg class="w-4 h-4 transition-transform duration-300"
                            :class="[isOpenRatio ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/40']"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div v-if="isOpenRatio"
                        class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                        :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                        <div v-for="option in ratioOptions" :key="option"
                            @click="selectedRatio = option; isOpenRatio = false"
                            class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                            :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                            {{ option }}
                        </div>
                    </div>
                </div>
                <button @click="isModalOpen = true" v-if="isCompressed">
                    <img src="/images/icons/expand-dark.svg" alt="Expand" class="w-5 h-5"
                        :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                </button>
                <button @click="handleInfoClick">
                    <img src="/images/icons/i.svg" alt="Info" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
                </button>
            </div>
        </div>

        <table class="w-full text-start border-collapse min-w-150">
            <thead class="text-white" :class="isDark ? 'bg-primary-1100' : 'bg-primary-750'">
                <tr>
                    <th :class="isCompressed ? `ps-8 py-3` : `ps-8 py-4`" class="font-medium text-sm text-start">
                        {{ activeTab === 'ratios' ? t.colRatioCat : t.colRevenue }}
                    </th>
                    <th class="font-medium text-center text-sm px-4">
                        {{ activeTab === 'ratios' ? t.colMetric : t.colSchedule }}
                    </th>
                    <th class="font-medium text-center text-sm px-4">
                        <div class="flex items-center justify-center gap-1">
                            {{ t.colCurrent }}
                            <img src="/images/icons/current-year.svg" alt="Year Icon" class="w-4 h-4" />
                        </div>
                    </th>
                    <th class="font-medium text-center text-sm px-4">{{ t.colPrevious }}</th>
                    <th class="font-medium text-center text-sm px-4">{{ t.colBudget }}</th>
                    <th class="font-medium text-center text-sm px-4">{{ t.colVariance }}</th>
                    <th class="font-medium text-center text-sm pe-8">{{ t.colYTG }}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(row, i) in data" :key="i">
                    <tr v-if="row.isHeader" :class="isDark ? 'bg-primary-1050' : 'bg-primary-800'">
                        <td colspan="7" class="ps-8 py-3 text-sm font-medium text-start"
                            :class="isDark ? 'text-white/80' : 'text-primary-950'">{{ row.label }}</td>
                    </tr>
                    <tr v-else :class="[
                        row.isSummary ? (isDark ? 'bg-[#003d30] font-medium' : 'bg-primary-800 font-medium') : (isDark ? 'bg-[#002e26] border-b border-white/5' : 'bg-white border-b border-gray-50')
                    ]" class="transition-all duration-500">
                        <td :class="[isCompressed ? 'ps-8 py-3' : 'ps-8 py-4', row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black/80']"
                            class="text-start">
                            {{ row.label }}
                        </td>
                        <td class="text-center">
                            <span v-if="activeTab === 'ratios'" class="text-sm"
                                :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.metric }}</span>
                            <button @click="handleSchedule" v-else-if="row.schedule && row.schedule !== '-'"
                                class="text-[#029F80] font-medium underline underline-offset-4 cursor-pointer">{{
                                    row.schedule }}</button>
                            <span v-else class="text-[#029F80]">-</span>
                        </td>
                        <td class="text-center px-4"
                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                            {{ row.current }}</td>
                        <td class="text-center px-4"
                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/60' : 'text-black']">
                            {{ row.previous }}</td>
                        <td class="text-center px-4"
                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/60' : '']">
                            {{ row.budget }}</td>
                        <td class="text-center px-4">
                            <span dir="ltr"
                                :class="[row.variance?.includes('-') ? 'bg-red-50 text-red-500' : 'bg-[#E6F9F4] text-[#029F80]', 'px-2 py-0.5 rounded-full text-xs font-bold inline-block']">
                                {{ row.variance }}
                            </span>
                        </td>
                        <td class="pe-8 py-2">
                            <div class="flex justify-center items-end">
                                <div :class="[isCompressed ? 'w-14 h-8' : 'w-16 h-10', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                    class="relative transition-all duration-500">
                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                        <circle cx="18" cy="18" r="15" fill="none"
                                            :class="isDark ? 'stroke-white/10' : 'stroke-gray-100'" stroke-width="3"
                                            stroke-dasharray="47.1 94.2" transform="rotate(-180 18 18)"
                                            stroke-linecap="round" />
                                        <circle v-if="row.progress > 0" cx="18" cy="18" r="15" fill="none"
                                            :stroke="getProgressColor(row.progress)" stroke-width="3.5"
                                            stroke-dasharray="47.1 94.2"
                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                            transform="rotate(-180 18 18)" stroke-linecap="round"
                                            class="transition-all duration-1000" />
                                    </svg>
                                    <span
                                        :class="[isDark ? 'text-white/80' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                        class="absolute bottom-0 text-[10px] inset-x-0 flex items-center justify-center font-bold leading-none">
                                        {{ row.progress }}%
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>

        <Teleport to="body">
            <div v-if="isModalOpen"
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <div class="w-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">

                    <div class="flex justify-between items-center py-6 px-8">
                        <div>
                            <p class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">{{
                                translatedTitle }}</p>
                            <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-black/59'">{{
                                t.valuesIn }}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <button @click="isModalOpen = false">
                                <img src="/images/icons/expand.svg" alt="Close" class="w-5 h-5"
                                    :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                            </button>
                        </div>
                    </div>

                    <div class="overflow-auto no-scrollbar">
                        <table class="w-full text-start border-collapse">
                            <thead class="bg-primary-750 text-white sticky top-0">
                                <tr>
                                    <th class="ps-8 py-4 font-medium text-start">{{ activeTab === 'ratios' ?
                                        t.colRatioCat :
                                        t.colRevenue }}</th>
                                    <th class="text-center font-medium">{{ activeTab === 'ratios' ? t.colMetric :
                                        t.colSchedule
                                        }}</th>
                                    <th class="text-center font-medium">{{ t.colCurrent }}</th>
                                    <th class="text-center font-medium">{{ t.colPrevious }}</th>
                                    <th class="text-center font-medium">{{ t.colVariance }}</th>
                                    <th class="pe-8 text-center font-medium">{{ t.colYTG }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, i) in data" :key="`modal-` + i">
                                    <tr v-if="row.isHeader" :class="isDark ? 'bg-[#003d30]' : 'bg-[#B2FFF2]'">
                                        <td colspan="6" class="ps-8 py-4 font-medium text-sm text-start"
                                            :class="isDark ? 'text-white/80' : 'text-primary-950'">{{ row.label }}</td>
                                    </tr>
                                    <tr v-else
                                        :class="row.isSummary ? (isDark ? 'bg-[#003d30] font-medium' : 'bg-[#B2FFF2]/40 font-medium') : (isDark ? 'bg-[#002e26] border-b border-white/5' : 'bg-white border-b border-gray-50')">
                                        <td class="ps-8 py-4 text-sm text-start"
                                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                                            {{ row.label }}</td>
                                        <td class="text-center text-sm">
                                            <span v-if="activeTab === 'ratios'">{{ row.metric }}</span>
                                            <span v-else
                                                :class="row.schedule !== '-' ? 'text-[#029F80] font-bold underline underline-offset-4' : ''">{{
                                                    row.schedule || '-' }}</span>
                                        </td>
                                        <td class="text-center text-sm"
                                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                                            {{ row.current }}</td>
                                        <td class="text-center text-sm" :class="isDark ? 'text-white/60' : ''">{{
                                            row.previous }}</td>
                                        <td class="text-center">
                                            <span dir="ltr"
                                                :class="[row.variance?.includes('-') ? 'bg-red-50 text-red-500' : 'bg-[#E6F9F4] text-[#029F80]', 'px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block']">
                                                {{ row.variance }}
                                            </span>
                                        </td>
                                        <td class="pe-8 py-2">
                                            <div class="flex justify-center items-end">
                                                <div :class="[isCompressed ? 'w-14 h-8' : 'w-16 h-10', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                                    class="relative">
                                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                                        <circle cx="18" cy="18" r="15" fill="none"
                                                            :class="isDark ? 'stroke-white/10' : 'stroke-gray-100'"
                                                            stroke-width="3" stroke-dasharray="47.1 94.2"
                                                            transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                        <circle v-if="row.progress > 0" cx="18" cy="18" r="15"
                                                            fill="none" :stroke="getProgressColor(row.progress)"
                                                            stroke-width="3.5" stroke-dasharray="47.1 94.2"
                                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                                            transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                    </svg>
                                                    <span
                                                        :class="[isDark ? 'text-white/80' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                                        class="absolute bottom-0 text-[10px] inset-x-0 flex items-center justify-center font-bold">
                                                        {{ row.progress }}%
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    data: Array,
    isCompressed: Boolean,
    activeTab: String
});

const emit = defineEmits(['askAkeel'])
const isDark = useTheme().isDark
const currentLang = useState('currentLang', () => 'en')

const t = computed(() => {
    return currentLang.value === 'ar' ? {
        plPlaceholder: 'اختر جدول الأرباح والخسائر',
        bsPlaceholder: 'اختر جدول الميزانية العمومية',
        ratioPlaceholder: 'اختر نوع النسبة',
        valuesIn: 'القيم بمليون درهم إماراتي',
        colRevenue: 'الإيرادات',
        colRatioCat: 'فئة النسبة',
        colSchedule: 'الجدول',
        colMetric: 'المقياس الأساسي',
        colCurrent: 'السنة الحالية',
        colPrevious: 'السنة السابقة',
        colBudget: 'الميزانية',
        colVariance: 'الانحراف',
        colYTG: 'المتبقي للسنة',
        titles: {
            schedules: 'ملخص الجداول المالية',
            balanceSheet: 'ملخص الميزانية العمومية',
            ratios: 'ملخص النسب المالية',
            profitLoss: 'ملخص الأرباح والخسائر'
        }
    } : {
        plPlaceholder: 'Select Profit & Loss Schedule',
        bsPlaceholder: 'Select Balance Sheet Schedule',
        ratioPlaceholder: 'Select Ratio Type',
        valuesIn: 'Values in AED Million',
        colRevenue: 'Revenue',
        colRatioCat: 'Ratio Category',
        colSchedule: 'Schedule',
        colMetric: 'Key Metric',
        colCurrent: 'Current Year',
        colPrevious: 'Previous Year',
        colBudget: 'Budget',
        colVariance: 'Variance',
        colYTG: 'Year to Go',
        titles: {
            schedules: 'Financial Schedule Summary',
            balanceSheet: 'Balance Sheet Summary',
            ratios: 'Financial Ratios Summary',
            profitLoss: 'Profit & Loss Summary'
        }
    }
});

const translatedTitle = computed(() => {
    if (props.activeTab === 'schedules') return t.value.titles.schedules;
    if (props.activeTab === 'balance-sheet') return t.value.titles.balanceSheet;
    if (props.activeTab === 'ratios') return t.value.titles.ratios;
    return t.value.titles.profitLoss;
});

// COMPONENT STATE
const isModalOpen = ref(false);
const isOpenPL = ref(false);
const isOpenBS = ref(false);
const isOpenRatio = ref(false);
const selectedPL = ref('');
const selectedBS = ref('');
const selectedRatio = ref('');

const plOptions = [`Schedule 01 – Revenue`, `Schedule 02 – COGS`, `Schedule 03 – Operating Expenses`, `Schedule 04 – Other Income / Expense`, `Schedule 05 – Tax Expense`];
const bsOptions = [`Schedule S1 – Current Assets`, `Schedule S2 – Non-Current Assets`, `Schedule S3 – Current Liabilities`, `Schedule S4 – Non-Current Liabilities`, `Schedule S5 – Shareholders' Equity`];
const ratioOptions = [`Profitability Ratios`, `Liquidity Ratios`, `Valuation Ratios`, `Efficiency Ratios`, `Leverage Ratios`];

const getProgressColor = (progress) => {
    if (progress >= 75) return `#029F80`;
    if (progress >= 50) return `#FFBC01`;
    return `#FB7554`;
};

const handleInfoClick = () => {
    emit('askAkeel')
}

const handleSchedule = () => {
    alert('handleSchedule')
}
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