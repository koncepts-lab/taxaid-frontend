<template>
    <div :class="['transition-all duration-300 rounded-2xl w-full max-w-full overflow-hidden', isDark ? 'bg-[#002e26]' : 'bg-white']">
        <div class="flex lg:flex-row flex-col justify-between lg:items-center items-start px-4 py-2">
            <h2 v-if="!isMinimized" class="text-base font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">{{ title }} Summary</h2>

            <div class="flex items-center gap-4 lg:ml-auto ml-0">
                <span v-if="!isMinimized" class="lg:text-xs text-[10px]" :class="isDark ? 'text-white/60' : 'text-black/59'">{{ valuesNote(false) }}</span>

                <div v-if="loading && (!years || !years.length)" class="w-[84px] h-[26px] rounded-lg animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
                <CommonSelectDropdown v-else-if="!isMinimized && years && years.length" class="w-[84px]" mode="select" size="xs" :clearable="false" :options="years" :model-value="selectedYear" @update:model-value="$emit('changeYear', Number($event))" />

                <button @click="$emit('toggleMinimize')"
                    class="text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 max-lg:hidden"
                    :class="isMinimized ? (isDark ? 'bg-white/10' : 'bg-primary-100') : 'bg-none'">
                    <span v-if="isMinimized">{{ title }} Summary</span>
                    <img :src="isMinimized ? '/images/icons/contract.svg' : '/images/icons/expand.svg'" class="w-5 h-5"
                        :class="isDark && !isMinimized ? 'invert' : ''"
                        :alt="isMinimized ? 'Expand' : 'Contract'" />
                </button>
            </div>
        </div>

        <div v-if="!isMinimized" :class="['rounded-b-2xl border w-full', isDark ? 'bg-[#002e26] border-white/10 shadow-none' : 'bg-white border-emerald-50 shadow-sm']">
            <div class="overflow-x-auto w-full">
                <table class="w-full text-left text-[11px] border-collapse min-w-[900px]">
                    <thead class="bg-primary-500 text-white font-medium text-sm sticky top-0 z-10">
                        <tr>
                            <th class="px-4 py-2.5 lg:text-sm font-medium w-[20%] text-left">Quarter</th>
                            <th class="px-4 py-2.5 lg:text-sm font-medium w-[20%] text-right">Sales Budgeted</th>
                            <th class="px-4 py-2.5 lg:text-sm font-medium w-[20%] text-right">Sales Reported</th>
                            <th class="px-4 py-2.5 lg:text-sm font-medium w-[20%] text-right">Variance</th>
                            <th class="px-4 py-2.5 lg:text-sm font-medium w-[20%] text-right">Variance %</th>
                        </tr>
                    </thead>

                    <tbody>
                        <!-- Skeleton Loading Rows (exact 4 rows for Q1-Q4) -->
                        <template v-if="loading">
                            <tr v-for="n in 4" :key="'vat-sk-' + n" class="border-b animate-pulse" :class="isDark ? 'border-white/5' : 'border-[#F2F2F2]'">
                                <td class="px-4 py-2 text-left">
                                    <div class="h-4 rounded" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', 'w-16']"></div>
                                </td>
                                <td v-for="c in 3" :key="c" class="px-4 py-2 text-right">
                                    <div class="h-4 rounded ml-auto" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', 'w-24']"></div>
                                </td>
                                <td class="px-4 py-2 text-right">
                                    <div class="h-5 rounded-full ml-auto" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', 'w-12']"></div>
                                </td>
                            </tr>
                        </template>

                        <!-- Loaded Rows (always rendered as 4 fixed rows Q1-Q4) -->
                        <template v-else-if="displayRows.length > 0">
                            <template v-for="(row, idx) in displayRows" :key="idx">
                                <tr :class="['border-b text-sm font-medium', isDark ? 'border-white/5 text-white/90' : 'border-gray-50 text-secondary-150/80', row.isPlaceholder ? 'opacity-40' : (isExpandable(row) ? (isDark ? 'cursor-pointer hover:bg-white/5' : 'cursor-pointer hover:bg-emerald-50/40') : '')]"
                                    @click="!row.isPlaceholder && isExpandable(row) && toggleExpanded(idx)">
                                    <td class="px-4 py-2 font-medium w-[20%] text-sm text-left">{{ row.quarter }}</td>
                                    <td class="px-4 py-2 font-medium w-[20%] text-sm text-right tabular-nums">{{ row.isPlaceholder ? '-' : formatStandardNumber(row.budgeted, 2) }}</td>
                                    <td class="px-4 py-2 font-medium w-[20%] text-sm text-right tabular-nums">{{ row.isPlaceholder ? '-' : formatStandardNumber(row.recorded, 2) }}</td>
                                    <td class="px-4 py-2 font-medium w-[20%] text-sm text-right tabular-nums">{{ row.isPlaceholder ? '-' : formatStandardNumber(row.variance, 2) }}</td>
                                    <td class="px-4 py-2 font-medium w-[20%] text-right">
                                        <span v-if="!row.isPlaceholder"
                                            class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold text-[10px] inline-block tabular-nums">
                                            {{ row.variancePercent }}%
                                        </span>
                                        <span v-else class="text-xs text-gray-400">-</span>
                                    </td>
                                </tr>
                                <tr v-if="!row.isPlaceholder && isExpandable(row) && expandedIdx === idx" :class="['border-b', isDark ? 'bg-black/20 border-white/5 text-white/80' : 'bg-emerald-50/30 border-gray-50 text-secondary-150/80']">
                                    <td colspan="5" class="px-4 py-2.5">
                                        <div class="flex flex-col md:flex-row flex-wrap gap-2 md:gap-6 text-xs pl-0 md:pl-[20%]">
                                            <div>
                                                <span :class="isDark ? 'text-white/50' : 'text-gray-400'">Standard Rated Supplies: </span>
                                                <span class="font-semibold tabular-nums">{{ formatStandardNumber(row.standardRatedSupplies, 2) }}</span>
                                            </div>
                                            <div>
                                                <span :class="isDark ? 'text-white/50' : 'text-gray-400'">Zero Rated Supplies: </span>
                                                <span class="font-semibold tabular-nums">{{ formatStandardNumber(row.zeroRatedSupplies, 2) }}</span>
                                            </div>
                                            <div v-if="row.exemptedSupplies !== undefined">
                                                <span :class="isDark ? 'text-white/50' : 'text-gray-400'">Exempted Supplies: </span>
                                                <span class="font-semibold tabular-nums">{{ formatStandardNumber(row.exemptedSupplies, 2) }}</span>
                                            </div>
                                            <div v-if="row.standardRatedExpenses !== undefined">
                                                <span :class="isDark ? 'text-white/50' : 'text-gray-400'">Standard Rated Expenses: </span>
                                                <span class="font-semibold tabular-nums">{{ formatStandardNumber(row.standardRatedExpenses, 2) }}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </template>
                        <tr v-else>
                            <td colspan="5" class="px-4 py-8 text-center text-sm" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ emptyMessage }}</td>
                        </tr>
                    </tbody>

                    <!-- Skeleton Total Row (5th row) -->
                    <tfoot v-if="loading"
                        :class="['border-none font-bold sticky bottom-0 z-10', isDark ? 'bg-[#00896F]/20 text-white' : 'bg-primary-550 text-secondary-150']">
                        <tr class="animate-pulse">
                            <td class="px-4 py-2.5 text-left rounded-bl-2xl">
                                <div class="h-4 rounded" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', 'w-16']"></div>
                            </td>
                            <td v-for="c in 3" :key="c" class="px-4 py-2.5 text-right">
                                <div class="h-4 rounded ml-auto" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', 'w-24']"></div>
                            </td>
                            <td class="px-4 py-2.5 text-right rounded-br-2xl">
                                <div class="h-5 rounded-full ml-auto" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', 'w-12']"></div>
                            </td>
                        </tr>
                    </tfoot>

                    <!-- Real Total Row (5th row) -->
                    <tfoot v-else-if="displayRows.length > 0"
                        :class="['border-none font-bold sticky bottom-0 z-10', isDark ? 'bg-[#00896F]/20 text-white' : 'bg-primary-550 text-secondary-150']">
                        <tr>
                            <td class="px-4 py-2.5 font-medium w-[20%] text-sm rounded-bl-2xl text-left">Total</td>
                            <td class="px-4 py-2.5 font-medium w-[20%] text-sm text-right tabular-nums">{{
                                formatStandardNumber(calculatedTotals.budgeted, 2) }}</td>
                            <td class="px-4 py-2.5 font-medium w-[20%] text-sm text-right tabular-nums">{{
                                formatStandardNumber(calculatedTotals.recorded, 2) }}</td>
                            <td class="px-4 py-2.5 font-medium w-[20%] text-sm text-right tabular-nums">{{
                                formatStandardNumber(calculatedTotals.variance, 2) }}</td>
                            <td class="px-4 py-2.5 font-medium w-[20%] text-sm rounded-br-2xl text-right">
                                <span class="bg-orange-200/50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] inline-block tabular-nums">
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
import { ref, computed } from 'vue';
import { useTheme } from '#imports'
import { formatStandardNumber } from '~/utils/formatters';
import { useCurrency } from '~/composables/common/useCurrency';

const { isDark } = useTheme()
const { valuesNote } = useCurrency()

const props = defineProps({
    isMinimized: Boolean,
    loading: {
        type: Boolean,
        default: false
    },
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

const displayRows = computed(() => {
    if (!props.data || props.data.length === 0) return [];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const rows = [];
    for (let i = 0; i < 4; i++) {
        const qLabel = quarters[i];
        const existing = props.data.find((r) => r.quarter?.toUpperCase() === qLabel || r.quarter === qLabel);
        if (existing) {
            rows.push({ ...existing, isPlaceholder: false });
        } else if (i < props.data.length) {
            rows.push({ ...props.data[i], isPlaceholder: false });
        } else {
            rows.push({
                quarter: qLabel,
                budgeted: 0,
                recorded: 0,
                variance: 0,
                variancePercent: 0,
                isPlaceholder: true,
            });
        }
    }
    return rows;
});

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