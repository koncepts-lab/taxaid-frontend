<template>
    <div class="transition-all duration-300">
        <div class="flex justify-between items-center mb-2">
            <h2 v-if="!isMinimized" class="text-sm font-bold text-gray-800">VAT Quarter Summary</h2>
            <div class="flex items-center gap-4 ml-auto">
                <span v-if="!isMinimized" class="text-[10px] text-gray-400">Values in AED Million</span>
                <button @click="$emit('toggleMinimize')"
                    class="bg-[#008472] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2">
                    <span v-if="isMinimized">VAT Quarter Summary</span>
                    <span class="text-[14px]">{{ isMinimized ? '↗' : '↙' }}</span>
                </button>
            </div>
        </div>

        <div v-if="!isMinimized" class="bg-white rounded-2xl border border-emerald-50 shadow-sm overflow-hidden">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-[#00B69B] text-white font-semibold">
                    <tr>
                        <th class="px-4 py-3 border-r border-emerald-400/30">Quarter</th>
                        <th class="px-4 py-3 border-r border-emerald-400/30">Sales Budgeted</th>
                        <th class="px-4 py-3 border-r border-emerald-400/30">Sales Recorded in VAT</th>
                        <th class="px-4 py-3 border-r border-emerald-400/30">Variance</th>
                        <th class="px-4 py-3 text-center">Variance %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, idx) in data" :key="idx" class="border-b border-gray-50 text-gray-700">
                        <td class="px-4 py-2.5 font-bold">{{ row.quarter }}</td>
                        <td class="px-4 py-2.5">{{ row.budgeted.toLocaleString() }}</td>
                        <td class="px-4 py-2.5">{{ row.recorded.toLocaleString() }}</td>
                        <td class="px-4 py-2.5">{{ row.variance.toLocaleString() }}</td>
                        <td class="px-4 py-2.5 text-center">
                            <span class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                {{ row.variancePercent }}%
                            </span>
                        </td>
                    </tr>
                    <tr class="bg-[#D2F7F1] text-[#008472] font-bold">
                        <td class="px-4 py-3">Total</td>
                        <td class="px-4 py-3">6,000,000</td>
                        <td class="px-4 py-3">5,670,000</td>
                        <td class="px-4 py-3">330,000</td>
                        <td class="px-4 py-3 text-center">
                            <span
                                class="bg-orange-200/50 text-orange-700 px-2 py-0.5 rounded-full text-[10px]">-5.5%</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps(['isMinimized', 'data']);
</script>