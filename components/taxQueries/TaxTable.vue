<template>
    <div class="transition-all duration-300 bg-white rounded-2xl">
        <div class="flex lg:flex-row flex-col justify-between lg:items-center items-start px-4 py-2">
            <h2 v-if="!isMinimized" class="text-base font-medium text-primary-450">{{ title }} Summary</h2>

            <div class="flex items-center gap-4 lg:ml-auto ml-0">
                <span v-if="!isMinimized" class="lg:text-xs text-[10px] text-black/59">Values in AED Million</span>

                <select v-if="!isMinimized && years && years.length"
                    :value="selectedYear"
                    @change="$emit('changeYear', Number($event.target.value))"
                    class="text-[11px] lg:text-xs border border-emerald-100 rounded-lg px-2 py-1 text-primary-450 font-medium focus:outline-none">
                    <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>

                <button @click="$emit('toggleMinimize')"
                    class="text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 max-lg:hidden"
                    :class="isMinimized ? 'bg-primary-100' : 'bg-none'">
                    <span v-if="isMinimized">{{ title }} Summary</span>
                    <img :src="isMinimized ? '/images/icons/contract.svg' : '/images/icons/expand.svg'" class="w-5 h-5"
                        :alt="isMinimized ? 'Expand' : 'Contract'" />
                </button>
            </div>
        </div>

        <div v-if="!isMinimized" class="bg-white rounded-b-2xl border border-emerald-50 shadow-sm overflow-hidden">
            <div class="overflow-auto lg:max-h-60 max-h-auto">
                <table class="w-full text-left text-[11px] border-collapse min-w-[900px]">
                    <thead class="bg-primary-500 text-white font-medium text-sm sticky top-0 z-10">
                        <tr>
                            <th class="px-4 py-3 lg:text-sm font-medium w-[20%]">Quarter</th>
                            <th class="px-4 py-3 lg:text-sm font-medium w-[20%]">Sales Budgeted</th>
                            <th class="px-4 py-3 lg:text-sm font-medium w-[20%]">Sales Reported</th>
                            <th class="px-4 py-3 lg:text-sm font-medium w-[20%]">Variance</th>
                            <th class="px-4 py-3 lg:text-sm font-medium w-[20%]">Variance %</th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="(row, idx) in data" :key="idx">
                            <tr class="border-b border-gray-50 text-secondary-150/80"
                                :class="isExpandable(row) ? 'cursor-pointer hover:bg-emerald-50/40' : ''"
                                @click="isExpandable(row) && toggleExpanded(idx)">
                                <td class="px-4 py-2.5 font-medium w-[20%] text-sm">{{ row.quarter }}</td>
                                <td class="px-4 py-2.5 font-medium w-[20%] text-sm">{{ formatInMillions(row.budgeted) }}</td>
                                <td class="px-4 py-2.5 font-medium w-[20%] text-sm">{{ formatInMillions(row.recorded) }}</td>
                                <td class="px-4 py-2.5 font-medium w-[20%] text-sm">{{ formatInMillions(row.variance) }}</td>
                                <td class="px-4 py-2.5 font-medium w-[20%]">
                                    <span
                                        class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                        {{ row.variancePercent }}%
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="isExpandable(row) && expandedIdx === idx" class="bg-emerald-50/30 border-b border-gray-50">
                                <td colspan="5" class="px-4 py-3">
                                    <div class="flex flex-wrap gap-6 text-xs text-secondary-150/80" style="padding-left: 20%;">
                                        <div>
                                            <span class="text-gray-400">Standard Rated Supplies: </span>
                                            <span class="font-semibold">{{ formatInMillions(row.standardRatedSupplies) }}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-400">Zero Rated Supplies: </span>
                                            <span class="font-semibold">{{ formatInMillions(row.zeroRatedSupplies) }}</span>
                                        </div>
                                        <div v-if="row.exemptedSupplies !== undefined">
                                            <span class="text-gray-400">Exempted Supplies: </span>
                                            <span class="font-semibold">{{ formatInMillions(row.exemptedSupplies) }}</span>
                                        </div>
                                        <div v-if="row.standardRatedExpenses !== undefined">
                                            <span class="text-gray-400">Standard Rated Expenses: </span>
                                            <span class="font-semibold">{{ formatInMillions(row.standardRatedExpenses) }}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <!-- Empty state if no data -->
                        <tr v-if="!data || data.length === 0">
                            <td colspan="5" class="px-4 py-10 text-center text-gray-400 text-sm">{{ emptyMessage }}</td>
                        </tr>
                    </tbody>

                    <tfoot v-if="data && data.length > 0"
                        class="bg-primary-550 border border-none text-secondary-150 font-bold sticky bottom-0 z-10">
                        <tr>
                            <td class="px-4 py-3 font-medium w-[20%] text-sm rounded-bl-2xl">Total</td>
                            <td class="px-4 py-3 font-medium w-[20%] text-sm">{{
                                formatInMillions(calculatedTotals.budgeted) }}</td>
                            <td class="px-4 py-3 font-medium w-[20%] text-sm">{{
                                formatInMillions(calculatedTotals.recorded) }}</td>
                            <td class="px-4 py-3 font-medium w-[20%] text-sm">{{
                                formatInMillions(calculatedTotals.variance) }}</td>
                            <td class="px-4 py-3 font-medium w-[20%] text-sm rounded-br-2xl">
                                <span class="bg-orange-200/50 text-orange-700 px-2 py-0.5 rounded-full text-[10px]">
                                    {{ calculatedTotals.variancePercent }}%
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { formatInMillions } from '~/utils/formatters';

const props = defineProps({
    isMinimized: Boolean,
    data: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: 'Tax'
    },
    emptyMessage: {
        type: String,
        default: 'No data available for this section.'
    },
    years: {
        type: Array,
        default: () => []
    },
    selectedYear: {
        type: Number,
        default: null
    }
});

defineEmits(['toggleMinimize', 'changeYear']);

const expandedIdx = ref(null);
const isExpandable = (row) => row.standardRatedSupplies !== undefined && row.zeroRatedSupplies !== undefined;
const toggleExpanded = (idx) => {
    expandedIdx.value = expandedIdx.value === idx ? null : idx;
};

const calculatedTotals = computed(() => {
    if (!props.data || props.data.length === 0) {
        return { budgeted: 0, recorded: 0, variance: 0, variancePercent: 0 };
    }

    const totals = props.data.reduce((acc, row) => {
        acc.budgeted += row.budgeted;
        acc.recorded += row.recorded;
        acc.variance += row.variance;
        return acc;
    }, { budgeted: 0, recorded: 0, variance: 0 });

    const variancePercent = totals.budgeted !== 0
        ? ((totals.variance / totals.budgeted) * 100).toFixed(1)
        : 0;

    return { ...totals, variancePercent };
});
</script>