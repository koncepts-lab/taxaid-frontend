<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500">
        <!-- Header Section -->
        <div class="pb-6 px-8 flex justify-between items-center">
            <p class="text-base font-medium text-primary-450">Balance Sheet Summary</p>
            <div class="flex gap-2 items-center">
                <p class="text-xs font-normal text-black/59">Values in AED Million</p>
                <button @click="isModalOpen = true">
                    <img src="/images/icons/expand-dark.svg" alt="Expand Icon" class="w-5 h-5" />
                </button>
            </div>
        </div>

        <table class="w-full text-left border-collapse min-w-150">
            <thead class="bg-primary-750 text-white">
                <tr>
                    <th :class="isCompressed ? 'pl-8 py-3' : 'pl-8 py-4'" class="font-medium text-sm">Revenue</th>
                    <th class="font-medium text-center text-sm px-4">Schedule</th>
                    <th class="font-medium text-center text-sm px-4">
                        <div class="flex items-center justify-center gap-1">
                            Current Year
                            <img src="/images/icons/current-year.svg" alt="Link" class="w-4 h-4" />
                        </div>
                    </th>
                    <th class="font-medium text-center text-sm px-4">Previous Year</th>
                    <th class="font-medium text-center text-sm px-4">Budget</th>
                    <th class="font-medium text-center text-sm px-4">Variance</th>
                    <th class="font-medium text-center text-sm pr-8">Year to Go</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(row, i) in data" :key="i">
                    <!-- SECTION HEADER (Assets / Liabilities) -->
                    <tr v-if="row.isHeader" class="bg-primary-800">
                        <td colspan="7" class="pl-8 py-3  text-primary-950 text-sm "
                            :class="row.isHeader ? 'font-medium' : ''">
                            {{ row.label }}
                        </td>
                    </tr>

                    <!-- DATA ROW -->
                    <tr v-else :class="[
                        row.isSummary || row.isHeader ? 'bg-primary-400 font-medium' : 'bg-white border-b border-gray-50',
                        isCompressed ? 'text-sm' : 'text-sm'
                    ]" class="transition-all duration-500">

                        <td :class="[isCompressed ? 'pl-8 py-3' : 'pl-8 py-4', row.isSummary ? 'font-medium' : 'font-normal']"
                            class="text-black/80 font-medium">
                            {{ row.label }}
                        </td>

                        <td class="text-center">
                            <span v-if="row.schedule !== '-'"
                                class="text-[#029F80] font-medium underline underline-offset-4 cursor-pointer"
                                :class="[row.isSummary ? 'font-medium' : 'font-normal']">
                                {{ row.schedule }}
                            </span>
                            <span v-else class="text-[#029F80]">-</span>
                        </td>

                        <td class="text-center px-4" :class="[row.isSummary ? 'font-medium' : 'font-normal']">
                            {{ row.current }}</td>
                        <td class="text-center text-black px-4 "
                            :class="[row.isSummary ? 'font-medium' : 'font-normal']">{{ row.previous }}</td>
                        <td class="text-center text-black px-4 "
                            :class="[row.isSummary ? 'font-medium' : 'font-normal']">{{ row.budget }}</td>

                        <td class="text-center px-4">
                            <span class="px-2 py-0.5 rounded-full bg-[#E6F9F4] text-[#029F80] text-xs font-bold">
                                {{ row.variance }}
                            </span>
                        </td>

                        <td class="pr-8 py-2">
                            <div class="flex justify-center items-end">
                                <!-- Removed overflow-hidden and increased height to prevent flat ends -->
                                <div :class="isCompressed ? 'w-14 h-8' : 'w-16 h-10'"
                                    class="relative transition-all duration-500">
                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                        <circle cx="18" cy="18" r="15" fill="none" class="stroke-gray-100"
                                            stroke-width="3" stroke-dasharray="47.1" transform="rotate(-180 18 18)"
                                            stroke-linecap="round" />

                                        <circle cx="18" cy="18" r="15" fill="none"
                                            :stroke="getProgressColor(row.progress)" stroke-width="3.5"
                                            stroke-dasharray="47.1"
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

        <!-- MODAL -->
        <Teleport to="body">
            <div v-if="isModalOpen"
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div
                    class="bg-white w-full max-w-[95%] max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                    <div class="pb-6 pt-8 px-8 flex justify-between items-center">
                        <p class="text-base font-medium text-primary-450">Balance Sheet Summary</p>
                        <div class="flex gap-2 items-center">
                            <p class="text-xs font-normal text-black/59">Values in AED Million</p>
                            <button @click="isModalOpen = false">
                                <img src="/images/icons/expand.svg" alt="Close" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div class="overflow-auto">
                        <table class="w-full text-left border-collapse">
                            <!-- Use logic identical to main table here -->
                            <thead class="bg-primary-750 text-white">
                                <tr>
                                    <th class="pl-8 py-4">Revenue</th>
                                    <th class="text-center">Schedule</th>
                                    <th class="text-center">
                                        <div class="flex items-center justify-center gap-1">
                                            Current Year
                                            <img src="/images/icons/current-year.svg" alt="Link" class="w-4 h-4" />
                                        </div>
                                    </th>
                                    <th class="text-center">Previous Year</th>
                                    <th class="text-center">Budget</th>
                                    <th class="text-center">Variance</th>
                                    <th class="pr-8 text-center">Year to Go</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, i) in data" :key="'modal-' + i">
                                    <tr v-if="row.isHeader" class="bg-[#B2FFF2]">
                                        <td colspan="7" class="pl-8 py-4 font-semibold text-primary-950 text-sm">{{
                                            row.label }}</td>
                                    </tr>
                                    <tr v-else
                                        :class="row.isSummary ? 'bg-[#B2FFF2]/40 font-bold' : 'bg-white border-b border-gray-50'">
                                        <td class="pl-8 py-4">{{ row.label }}</td>
                                        <td class="text-center">
                                            <span v-if="row.schedule !== '-'" class="text-[#029F80] underline">{{
                                                row.schedule }}</span>
                                            <span v-else class="text-[#029F80]">-</span>
                                        </td>
                                        <td class="text-center font-medium">{{ row.current }}</td>
                                        <td class="text-center text-gray-500">{{ row.previous }}</td>
                                        <td class="text-center text-gray-500">{{ row.budget }}</td>
                                        <td class="text-center">
                                            <span
                                                class="px-3 py-1 rounded-full bg-[#E6F9F4] text-[#029F80] text-xs font-bold">{{
                                                    row.variance }}</span>
                                        </td>
                                        <td class="pr-8 py-4">
                                            <!-- Gauge logic repeated -->
                                            <div class="flex justify-center items-end">
                                                <div class="w-16 h-10 relative">
                                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                                        <circle cx="18" cy="18" r="15" fill="none"
                                                            class="stroke-gray-100" stroke-width="3"
                                                            stroke-dasharray="47.1" transform="rotate(-180 18 18)"
                                                            stroke-linecap="round" />
                                                        <circle cx="18" cy="18" r="15" fill="none"
                                                            :stroke="getProgressColor(row.progress)" stroke-width="3.5"
                                                            stroke-dasharray="47.1"
                                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                                            transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                    </svg>
                                                    <span
                                                        class="absolute bottom-0 text-[10px] inset-x-0 flex items-center justify-center font-bold">{{
                                                            row.progress }}%</span>
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
import { ref } from 'vue';

defineProps({
    data: Array,
    isCompressed: Boolean
})

const isModalOpen = ref(false);

const getProgressColor = (progress) => {
    if (progress >= 75) return '#029F80';
    if (progress >= 50) return '#FFBC01';
    return '#FB7554';
}
</script>