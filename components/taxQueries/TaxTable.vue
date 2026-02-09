<template>
    <div class="transition-all duration-300 bg-white rounded-2xl">
        <div class="flex justify-between items-center px-4 py-2">
            <h2 v-if="!isMinimized" class="text-base font-medium text-primary-450">VAT Quarter Summary</h2>
            <div class="flex items-center gap-4 ml-auto">
                <span v-if="!isMinimized" class="text-xs text-black/59">Values in AED Million</span>
                <button @click="$emit('toggleMinimize')"
                    class=" text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2"
                    :class="isMinimized ? 'bg-primary-100' : 'bg-none'">
                    <span v-if="isMinimized">VAT Quarter Summary</span>
                    <img :src="isMinimized ? '/images/icons/contract.svg' : '/images/icons/expand.svg'" class="w-5 h-5"
                        :alt="isMinimized ? 'Expand' : 'Contract'" /> </button>
            </div>
        </div>

        <div v-if="!isMinimized" class="bg-white rounded-b-2xl border border-emerald-50 shadow-sm overflow-hidden">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-primary-500 text-white font-medium text-sm sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 font-medium">Quarter</th>
                        <th class="px-4 py-3 font-medium">Sales Budgeted</th>
                        <th class="px-4 py-3 font-medium">Sales Recorded in VAT</th>
                        <th class="px-4 py-3 font-medium">Variance</th>
                        <th class="px-4 py-3 font-medium text-center">Variance %</th>
                    </tr>
                </thead>
            </table>
            <div class="max-h-40 overflow-y-scroll">
                <table class="w-full text-left text-[11px]">
                    <tbody>
                        <tr v-for="(row, idx) in tableData.data" :key="idx"
                            class="border-b border-gray-50 text-secondary-150/80">
                            <td class="px-4 py-2.5 font-medium w-[20%]">{{ row.quarter }}</td>
                            <td class="px-4 py-2.5 font-medium w-[20%]">{{ row.budgeted.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 font-medium w-[20%]">{{ row.recorded.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 font-medium w-[20%]">{{ row.variance.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 font-medium text-center w-[20%]">
                                <span
                                    class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                    {{ row.variancePercent }}%
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <table class="w-full text-left text-[11px]">
                <tfoot v-if="tableData.totals" class="bg-primary-550 text-secondary-150 font-bold">
                    <tr>
                        <td class="px-4 py-3 font-medium w-[20%]">{{ tableData.totals.label || 'Total' }}</td>
                        <td class="px-4 py-3 font-medium w-[20%]">{{ tableData.totals.budgeted.toLocaleString() }}</td>
                        <td class="px-4 py-3 font-medium w-[20%]">{{ tableData.totals.recorded.toLocaleString() }}</td>
                        <td class="px-4 py-3 font-medium w-[20%]">{{ tableData.totals.variance.toLocaleString() }}</td>
                        <td class="px-4 py-3 font-medium text-center w-[20%]">
                            <span class="bg-orange-200/50 text-orange-700 px-2 py-0.5 rounded-full text-[10px]">
                                {{ tableData.totals.variancePercent }}%
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps(['isMinimized']);

const tableData = ref({
    data: [
        {
            quarter: "Q1 2024",
            budgeted: 1500000,
            recorded: 1420000,
            variance: 80000,
            variancePercent: -5.3
        },
        {
            quarter: "Q2 2024",
            budgeted: 1500000,
            recorded: 1425000,
            variance: 75000,
            variancePercent: -5.0
        },
        {
            quarter: "Q3 2024",
            budgeted: 1500000,
            recorded: 1410000,
            variance: 90000,
            variancePercent: -6.0
        },
        {
            quarter: "Q4 2024",
            budgeted: 1500000,
            recorded: 1415000,
            variance: 85000,
            variancePercent: -5.7
        },
        {
            quarter: "Q4 2024",
            budgeted: 1500000,
            recorded: 1415000,
            variance: 85000,
            variancePercent: -5.7
        },
        {
            quarter: "Q4 2024",
            budgeted: 1500000,
            recorded: 1415000,
            variance: 85000,
            variancePercent: -5.7
        },
        {
            quarter: "Q4 2024",
            budgeted: 1500000,
            recorded: 1415000,
            variance: 85000,
            variancePercent: -5.7
        }
    ],
    totals: {
        label: "Total",
        budgeted: 6000000,
        recorded: 5670000,
        variance: 330000,
        variancePercent: -5.5
    }
});
</script>