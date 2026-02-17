<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500 bg-white">

        <div v-if="activeTab === `schedules`" class="px-8 pb-8 flex gap-4 transition-all duration-500">
            <div class="flex-1 relative">
                <div @click="isOpenPL = !isOpenPL; isOpenBS = false"
                    class="w-full border border-primary-650 rounded-lg py-3 px-4 text-sm flex justify-between items-center bg-white cursor-pointer transition-all"
                    :class="isOpenPL ? `ring-1 ring-primary-750 border-primary-750` : ``">
                    <span :class="selectedPL ? `text-black` : `text-black/40`">
                        {{ selectedPL || `Select Profit & Loss Schedule` }}
                    </span>
                    <svg class="w-4 h-4 text-black/40 transition-transform duration-300"
                        :class="isOpenPL ? `rotate-180` : ``" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div v-if="isOpenPL"
                    class="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar">
                    <div v-for="option in plOptions" :key="option" @click="selectedPL = option; isOpenPL = false"
                        class="px-4 py-3 text-sm text-gray-700 hover:bg-[#E0FCF6] cursor-pointer transition-colors">
                        {{ option }}
                    </div>
                </div>
            </div>

            <div class="flex-1 relative">
                <div @click="isOpenBS = !isOpenBS; isOpenPL = false"
                    class="w-full border border-primary-650 rounded-lg py-3 px-4 text-sm flex justify-between items-center bg-white cursor-pointer transition-all"
                    :class="isOpenBS ? `ring-1 ring-primary-750 border-primary-750` : ``">
                    <span :class="selectedBS ? `text-black` : `text-black/40`">
                        {{ selectedBS || `Select Balance Sheet Schedule` }}
                    </span>
                    <svg class="w-4 h-4 text-black/40 transition-transform duration-300"
                        :class="isOpenBS ? `rotate-180` : ``" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div v-if="isOpenBS"
                    class="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar">
                    <div v-for="option in bsOptions" :key="option" @click="selectedBS = option; isOpenBS = false"
                        class="px-4 py-3 text-sm text-gray-700 hover:bg-[#E0FCF6] cursor-pointer transition-colors">
                        {{ option }}
                    </div>
                </div>
            </div>
        </div>

        <div class="pb-6 px-8 flex justify-between items-center transition-all duration-500">
            <div>
                <p class="text-base font-medium text-primary-450">{{ activeTitle }}</p>
                <p class="text-xs font-normal text-black/59 mt-1">{{ `Values in AED Million` }}</p>
            </div>

            <div class="flex items-center gap-4">
                <div v-if="activeTab === `ratios`" class="w-80 relative">
                    <div @click="isOpenRatio = !isOpenRatio"
                        class="w-full border border-primary-650 rounded-lg py-2.5 px-4 text-sm flex justify-between items-center bg-white cursor-pointer transition-all"
                        :class="isOpenRatio ? `ring-1 ring-primary-750 border-primary-750` : ``">
                        <span :class="selectedRatio ? `text-black` : `text-black/40`">
                            {{ selectedRatio || `Select Ratio Type` }}
                        </span>
                        <svg class="w-4 h-4 text-black/40 transition-transform duration-300"
                            :class="isOpenRatio ? `rotate-180` : ``" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div v-if="isOpenRatio"
                        class="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar">
                        <div v-for="option in ratioOptions" :key="option"
                            @click="selectedRatio = option; isOpenRatio = false"
                            class="px-4 py-3 text-sm text-gray-700 hover:bg-[#E0FCF6] cursor-pointer transition-colors">
                            {{ option }}
                        </div>
                    </div>
                </div>
                <button @click="isModalOpen = true" v-if="isCompressed">
                    <img src="/images/icons/expand-dark.svg" alt="Expand Icon" class="w-5 h-5" />
                </button>
                <button @click="handleInfoClick">
                    <img src="/images/icons/i.svg" alt="Refresh Icon" class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- 3. TABLE SECTION -->
        <table class="w-full text-left border-collapse min-w-150">
            <thead class="bg-primary-750 text-white">
                <tr>
                    <th :class="isCompressed ? `pl-8 py-3` : `pl-8 py-4`" class="font-medium text-sm">{{ activeTab ===
                        `ratios` ? `Ratio Category` : `Revenue` }}</th>
                    <th class="font-medium text-center text-sm px-4">{{ activeTab === `ratios` ? `Key Metric` :
                        `Schedule` }}</th>
                    <th class="font-medium text-center text-sm px-4">
                        <div class="flex items-center justify-center gap-1">
                            {{ `Current Year` }}
                            <img src="/images/icons/current-year.svg" alt="Link" class="w-4 h-4" />
                        </div>
                    </th>
                    <th class="font-medium text-center text-sm px-4">{{ `Previous Year` }}</th>
                    <th class="font-medium text-center text-sm px-4">{{ `Budget` }}</th>
                    <th class="font-medium text-center text-sm px-4">{{ `Variance` }}</th>
                    <th class="font-medium text-center text-sm pr-8">{{ `Year to Go` }}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(row, i) in data" :key="i">
                    <tr v-if="row.isHeader" class="bg-primary-800">
                        <td colspan="7" class="pl-8 py-3 text-primary-950 text-sm font-medium">{{ row.label }}</td>
                    </tr>
                    <tr v-else
                        :class="[row.isSummary ? `bg-primary-800 font-medium` : `bg-white border-b border-gray-50 px-8`, isCompressed ? `text-sm px-8` : `text-sm px-8`]"
                        class="transition-all duration-500">
                        <td :class="[isCompressed ? `pl-8 py-3` : `pl-8 py-4`, row.isSummary || row.isTotal ? `font-medium` : `font-normal`]"
                            class="text-black/80">{{ row.label }}</td>
                        <td class="text-center">
                            <template v-if="activeTab === `ratios`"><span class="text-black/80 text-sm">{{ row.metric
                            }}</span></template>
                            <template v-else>
                                <span v-if="row.schedule && row.schedule !== `-`"
                                    class="text-[#029F80] font-medium underline underline-offset-4 cursor-pointer">{{
                                        row.schedule }}</span>
                                <span v-else class="text-[#029F80]">-</span>
                            </template>
                        </td>
                        <td class="text-center px-4"
                            :class="[row.isSummary || row.isTotal ? `font-medium` : `font-normal`]">{{ row.current }}
                        </td>
                        <td class="text-center text-black px-4"
                            :class="[row.isSummary || row.isTotal ? `font-medium` : `font-normal`]">{{
                                row.previous }}</td>
                        <td class="text-center px-4"
                            :class="[row.isSummary || row.isTotal ? `font-medium` : `font-normal`]">{{ row.budget }}
                        </td>
                        <td class="text-center px-4">
                            <span
                                :class="[row.variance?.includes(`-`) ? `bg-red-50 text-red-500` : `bg-[#E6F9F4] text-[#029F80]`, `px-2 py-0.5 rounded-full text-xs font-bold`]">{{
                                    row.variance }}</span>
                        </td>
                        <td class="pr-8 py-2">
                            <div class="flex justify-center items-end">
                                <div :class="isCompressed ? `w-14 h-8` : `w-16 h-10`"
                                    class="relative transition-all duration-500">
                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                        <!-- Background Gray Arc -->
                                        <circle cx="18" cy="18" r="15" fill="none" class="stroke-gray-100"
                                            stroke-width="3" stroke-dasharray="47.1 94.2" transform="rotate(-180 18 18)"
                                            stroke-linecap="round" />

                                        <!-- Colored Progress Arc -->
                                        <!-- v-if="row.progress > 0" handles the orange dots at 0% -->
                                        <circle v-if="row.progress > 0" cx="18" cy="18" r="15" fill="none"
                                            :stroke="getProgressColor(row.progress)" stroke-width="3.5"
                                            stroke-dasharray="47.1 94.2"
                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                            transform="rotate(-180 18 18)" stroke-linecap="round"
                                            class="transition-all duration-1000" />
                                    </svg>
                                    <span
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
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div
                    class="bg-white w-full max-w-[95%] max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">

                    <div v-if="activeTab === `schedules`" class="flex gap-4  p-8">
                        <div class="flex-1 relative">
                            <div @click="isOpenPL = !isOpenPL; isOpenBS = false"
                                class="w-full border border-primary-650 rounded-lg py-3 px-4 text-sm flex justify-between items-center bg-white cursor-pointer transition-all"
                                :class="isOpenPL ? `ring-1 ring-primary-750` : ``">
                                <span :class="selectedPL ? `text-black` : `text-black/40`">{{ selectedPL || `Select
                                    Profit &
                                    Loss Schedule` }}</span>
                                <svg class="w-4 h-4 text-black/40 transition-transform duration-300"
                                    :class="isOpenPL ? `rotate-180` : ``" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div v-if="isOpenPL"
                                class="absolute top-full left-0 right-0 z-[10000] mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar">
                                <div v-for="option in plOptions" :key="option"
                                    @click="selectedPL = option; isOpenPL = false"
                                    class="px-4 py-3 text-sm text-gray-700 hover:bg-[#E0FCF6] cursor-pointer">{{ option
                                    }}</div>
                            </div>
                        </div>
                        <div class="flex-1 relative">
                            <div @click="isOpenBS = !isOpenBS; isOpenPL = false"
                                class="w-full border border-primary-650 rounded-lg py-3 px-4 text-sm flex justify-between items-center bg-white cursor-pointer transition-all"
                                :class="isOpenBS ? `ring-1 ring-primary-750` : ``">
                                <span :class="selectedBS ? `text-black` : `text-black/40`">{{ selectedBS || `Select
                                    Balance
                                    Sheet Schedule` }}</span>
                                <svg class="w-4 h-4 text-black/40 transition-transform duration-300"
                                    :class="isOpenBS ? `rotate-180` : ``" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div v-if="isOpenBS"
                                class="absolute top-full left-0 right-0 z-[10000] mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar">
                                <div v-for="option in bsOptions" :key="option"
                                    @click="selectedBS = option; isOpenBS = false"
                                    class="px-4 py-3 text-sm text-gray-700 hover:bg-[#E0FCF6] cursor-pointer">{{ option
                                    }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between items-center py-6 px-8">
                        <div>
                            <p class="text-lg font-medium text-primary-450">{{ activeTitle }}</p>
                            <p class="text-xs font-normal text-black/59 mt-1">{{ `Values in AED Million` }}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <div v-if="activeTab === `ratios`" class="w-80 relative">
                                <div @click="isOpenRatio = !isOpenRatio"
                                    class="w-full border border-primary-650 rounded-lg py-2.5 px-4 text-sm flex justify-between items-center bg-white cursor-pointer transition-all"
                                    :class="isOpenRatio ? `ring-1 ring-primary-750` : ``">
                                    <span :class="selectedRatio ? `text-black` : `text-black/40`">{{ selectedRatio ||
                                        `Select
                                        Ratio Type` }}</span>
                                    <svg class="w-4 h-4 text-black/40 transition-transform duration-300"
                                        :class="isOpenRatio ? `rotate-180` : ``" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div v-if="isOpenRatio"
                                    class="absolute top-full left-0 right-0 z-[10000] mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar">
                                    <div v-for="option in ratioOptions" :key="option"
                                        @click="selectedRatio = option; isOpenRatio = false"
                                        class="px-4 py-3 text-sm text-gray-700 hover:bg-[#E0FCF6] cursor-pointer">{{
                                            option }}
                                    </div>
                                </div>
                            </div>
                            <button @click="isModalOpen = false"><img src="/images/icons/expand.svg" alt="Close"
                                    class="w-5 h-5" /></button>
                        </div>
                    </div>

                    <!-- Modal Table -->
                    <div class="overflow-auto ">
                        <table class="w-full text-left ">
                            <thead class="bg-primary-750 text-white">
                                <tr>
                                    <th class="pl-8 py-4 font-medium">{{ activeTab === `ratios` ? `Ratio Category` :
                                        `Revenue`
                                    }}</th>
                                    <th class="text-center font-medium">{{ activeTab === `ratios` ? `Key Metric` :
                                        `Schedule` }}
                                    </th>
                                    <th class="text-center font-medium">{{ `Current Year` }}</th>
                                    <th class="text-center font-medium">{{ `Previous Year` }}</th>
                                    <th class="text-center font-medium">{{ `Variance` }}</th>
                                    <th class="pr-8 text-center font-medium">{{ `Year to Go` }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, i) in data" :key="`modal-` + i">
                                    <tr v-if="row.isHeader" class="bg-[#B2FFF2]">
                                        <td colspan="6" class="pl-8 py-4 font-medium text-primary-950 text-sm ">{{
                                            row.label }}</td>
                                    </tr>
                                    <tr v-else
                                        :class="row.isSummary ? `bg-[#B2FFF2]/40 font-medium` : `bg-white border-b border-gray-50`">
                                        <td class="pl-8 py-4 text-sm"
                                            :class="row.isSummary || row.isTotal ? `font-medium` : `font-normal`">{{
                                                row.label }}</td>
                                        <td class="text-center text-sm"
                                            :class="row.isSummary || row.isTotal ? `font-medium` : `font-normal`">
                                            <span v-if="activeTab === `ratios`">{{ row.metric }}</span>
                                            <span v-else
                                                :class="row.schedule !== `-` ? `text-[#029F80] font-bold underline underline-offset-4` : ``">{{
                                                    row.schedule || `-` }}</span>
                                        </td>
                                        <td class="text-center text-sm "
                                            :class="row.isSummary || row.isTotal ? `font-medium` : `font-normal`">{{
                                                row.current }}</td>
                                        <td class="text-center text-sm ">{{ row.previous }}</td>
                                        <td class="text-center">
                                            <span
                                                :class="[row.variance?.includes(`-`) ? `bg-red-50 text-red-500` : `bg-[#E6F9F4] text-[#029F80]`, `px-3 py-1 rounded-full text-xs font-bold shadow-sm`]">{{
                                                    row.variance }}</span>
                                        </td>
                                        <td class="pr-8 py-2">
                                            <div class="flex justify-center items-end">
                                                <div :class="isCompressed ? `w-14 h-8` : `w-16 h-10`"
                                                    class="relative transition-all duration-500">
                                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                                        <!-- Background Gray Arc -->
                                                        <circle cx="18" cy="18" r="15" fill="none"
                                                            class="stroke-gray-100" stroke-width="3"
                                                            stroke-dasharray="47.1 94.2" transform="rotate(-180 18 18)"
                                                            stroke-linecap="round" />

                                                        <!-- Colored Progress Arc -->
                                                        <!-- v-if="row.progress > 0" handles the orange dots at 0% -->
                                                        <circle v-if="row.progress > 0" cx="18" cy="18" r="15"
                                                            fill="none" :stroke="getProgressColor(row.progress)"
                                                            stroke-width="3.5" stroke-dasharray="47.1 94.2"
                                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                                            transform="rotate(-180 18 18)" stroke-linecap="round"
                                                            class="transition-all duration-1000" />
                                                    </svg>
                                                    <span
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

const isModalOpen = ref(false);
const isOpenPL = ref(false);
const isOpenBS = ref(false);
const isOpenRatio = ref(false);
const selectedPL = ref(``);
const selectedBS = ref(``);
const selectedRatio = ref(``);

const plOptions = [`Schedule 01 – Revenue`, `Schedule 02 – COGS`, `Schedule 03 – Operating Expenses`, `Schedule 04 – Other Income / Expense`, `Schedule 05 – Tax Expense`];
const bsOptions = [`Schedule S1 – Current Assets`, `Schedule S2 – Non-Current Assets`, `Schedule S3 – Current Liabilities`, `Schedule S4 – Non-Current Liabilities`, `Schedule S5 – Shareholders’ Equity`];
const ratioOptions = [`Profitability Ratios`, `Liquidity Ratios`, `Valuation Ratios`, `Efficiency Ratios`, `Leverage Ratios`];

const getProgressColor = (progress) => {
    if (progress >= 75) return `#029F80`;
    if (progress >= 50) return `#FFBC01`;
    return `#FB7554`;
};

const activeTitle = computed(() => {
    if (props.activeTab === `schedules`) return `Financial Schedule Summary`;
    if (props.activeTab === `balance-sheet`) return `Balance Sheet Summary`;
    if (props.activeTab === `ratios`) return `Financial Ratios Summary`;
    return `Profit & Loss Summary`;
});
const handleInfoClick = () => {
    emit('askAkeel')
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