<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500">
        <div class="pb-8 px-8 flex justify-between items-center">
            <p class="text-base font-medium text-primary-450">Revenue Summary</p>
            <div class="flex gap-2 items-center">
                <p class="text-xs font-normal text-black/59">Values in AED Million</p>
                <img src="/images/icons/expand-dark.svg" alt="Expand Icon" class="w-5 h-5 cursor-pointer" />
            </div>
        </div>
        <table class="w-full text-left border-collapse min-w-150">
            <thead class="bg-[#006b54] text-white px-8">
                <tr class="transition-all duration-500">
                    <th :class="isCompressed ? 'px-8 py-3 text-xs' : 'px-8 py-4 text-sm'" class="font-medium">
                        Revenue
                    </th>
                    <th :class="isCompressed ? 'px-2' : 'px-4'" class="py-4 font-medium text-right text-sm">Current
                        Year
                    </th>
                    <th :class="isCompressed ? 'px-2' : 'px-4'" class="py-4 font-medium text-right text-sm">Previous
                        Year</th>
                    <th :class="isCompressed ? 'px-2' : 'px-4'" class="py-4 font-medium text-right text-sm">Budget
                    </th>
                    <th :class="isCompressed ? 'px-2' : 'px-4'" class="py-4 font-medium text-center text-sm">
                        Variance
                    </th>
                    <th :class="isCompressed ? 'px-3 py-4' : 'px-6 py-4'" class="font-medium text-center text-sm">
                        Year to Go</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in data" :key="i" :class="[
                    row.isSummary ? 'bg-[#e0fcf6] font-bold' : 'bg-white border-b border-gray-50 px-8',
                    isCompressed ? 'text-[11px] px-8' : 'text-sm px-8'
                ]" class="transition-all duration-500">
                    <td :class="isCompressed ? 'px-8 py-3' : 'px-8 py-4'" class="text-gray-700">{{ row.label }}</td>
                    <td class="text-right" :class="[
                        isCompressed ? 'px-2' : 'px-4',
                        !row.isSummary ? 'text-[#006b54]' : ''
                    ]">
                        {{ row.current }}
                    </td>
                    <td :class="isCompressed ? 'px-2' : 'px-4'" class="text-right text-gray-700">{{ row.previous }}</td>
                    <td :class="isCompressed ? 'px-2' : 'px-4'" class="text-right text-gray-700">{{ row.budget }}</td>
                    <td class="text-center">
                        <span class="px-2 py-1 rounded text-[10px] font-bold"
                              :class="row.variance.startsWith('+') ? 'bg-[#e6f9f4] text-[#00b48d]' : 'bg-red-50 text-red-500'">
                            {{ row.variance }}
                        </span>
                    </td>
                    <td :class="isCompressed ? 'px-3' : 'px-6'" class="py-4">
                        <div class="flex justify-center">
                            <div :class="isCompressed ? 'w-7 h-7' : 'w-9 h-9'"
                                class="relative transition-all duration-500">
                                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-gray-100"
                                        stroke-width="3" />
                                    <circle cx="18" cy="18" r="16" fill="none" :stroke="row.progress < 50 ? '#ff8a65' : '#00d28e'" stroke-width="3"
                                        stroke-dasharray="100" :stroke-dashoffset="100 - row.progress"
                                        stroke-linecap="round" />
                                </svg>
                                <span :class="isCompressed ? 'text-[7px]' : 'text-[9px]'"
                                    class="absolute inset-0 flex items-center justify-center font-bold">{{
                                        row.progress
                                    }}%</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    data: Array,
    isCompressed: Boolean
})
</script>
