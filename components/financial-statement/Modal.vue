<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div class="w-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
                :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">

                <!-- Header -->
                <div class="flex justify-between items-center py-6 px-8">
                    <div>
                        <p class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">
                            {{ title }}
                        </p>
                        <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-black/59'">
                            {{ t.valuesIn }}
                        </p>
                    </div>
                    <div class="flex items-center gap-4">
                        <!-- Ratio Selection inside Modal -->
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
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div v-if="isOpenRatio"
                                class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                                :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                                <div v-for="option in ratioOptions" :key="option" @click="handleRatioSelect(option)"
                                    class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                                    :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                                    {{ option }}
                                </div>
                            </div>
                        </div>
                        <button @click="$emit('close')">
                            <img src="/images/icons/expand.svg" alt="Close" class="w-5 h-5"
                                :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                        </button>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="overflow-auto no-scrollbar">
                    <table class="w-full text-start border-collapse">
                        <thead class="text-white" :class="isDark ? 'bg-primary-1100' : 'bg-primary-750'">
                            <tr>
                                <template v-if="activeTab === 'ratios'">
                                    <template v-if="selectedRatio === 'All Ratios'">
                                        <th class="ps-8 py-4 font-medium text-sm text-start">{{ t.colRatioCat }}</th>
                                        <th class="font-medium text-center text-sm px-4">{{ t.colMetric }}</th>
                                    </template>
                                    <template v-else>
                                        <th colspan="2" class="ps-8 py-4 font-medium text-sm text-start">{{ t.colRatio
                                        }}</th>
                                    </template>
                                </template>
                                <template v-else>
                                    <th :class="isCompressed ? `ps-8 py-3` : `ps-8 py-4`"
                                        class="font-medium text-sm text-start">{{ t.colRevenue }}</th>
                                    <th class="font-medium text-center text-sm px-4">{{ t.colSchedule }}</th>
                                </template>
                                <th class="font-medium text-center text-sm px-4">
                                    <div class="flex items-center justify-center gap-1">
                                        {{ t.colCurrent }}
                                        <img src="/images/icons/current-year.svg" alt="Year Icon" class="w-4 h-4" />
                                    </div>
                                </th>
                                <th class="font-medium text-center text-sm px-4">{{ t.colPrevious }}</th>
                                <th v-if="!(activeTab === 'ratios' && selectedRatio === 'All Ratios')"
                                    class="font-medium text-center text-sm px-4">
                                    {{ activeTab === 'ratios' ? t.colBalance : t.colBudget }}
                                </th>
                                <th class="font-medium text-center text-sm px-4">{{ t.colVariance }}</th>
                                <th class="font-medium text-center text-sm pe-8">{{ t.colYTG }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(row, i) in data" :key="`modal-` + i">
                                <tr v-if="row.isHeader" :class="isDark ? 'bg-[#003d30]' : 'bg-[#B2FFF2]'">
                                    <td colspan="7" class="ps-8 py-4 font-medium text-sm text-start"
                                        :class="isDark ? 'text-white/80' : 'text-primary-950'">{{ row.label }}</td>
                                </tr>
                                <tr v-else
                                    :class="[row.isSummary ? (isDark ? 'bg-[#003d30] font-medium' : 'bg-primary-800 font-medium') : (isDark ? 'bg-[#002e26] border-b border-white/5' : 'bg-white border-b border-gray-50')]"
                                    class="transition-all duration-500">

                                    <template v-if="activeTab === 'ratios'">
                                        <template v-if="selectedRatio === 'All Ratios'">
                                            <td class="ps-8 py-4 text-start text-sm"
                                                :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.category }}
                                            </td>
                                            <td class="text-center px-4 text-sm"
                                                :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.label }}</td>
                                        </template>
                                        <template v-else>
                                            <td colspan="2" class="ps-8 py-4 text-start text-sm font-medium"
                                                :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.label }}</td>
                                        </template>
                                    </template>

                                    <template v-else>
                                        <td :class="[isCompressed ? 'ps-8 py-3' : 'ps-8 py-4', row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black/80']"
                                            class="text-start text-sm">{{ row.label }}</td>
                                        <td class="text-center">
                                            <span v-if="row.isSummary" class="text-sm"
                                                :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.metric
                                                }}</span>
                                            <button @click="$emit('handleSchedule', row)"
                                                v-else-if="row.schedule && row.schedule !== '-'"
                                                class="text-[#029F80] font-medium underline underline-offset-4 cursor-pointer text-sm">{{
                                                    row.schedule }}</button>
                                            <span v-else class="text-[#029F80]">-</span>
                                        </td>
                                    </template>

                                    <td class="text-center px-4 text-sm"
                                        :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black']">
                                        {{
                                            row.current }}</td>
                                    <td class="text-center px-4 text-sm"
                                        :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black']">
                                        {{ row.previous }}</td>
                                    <td v-if="!(activeTab === 'ratios' && selectedRatio === 'All Ratios')"
                                        class="text-center px-4 text-sm"
                                        :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black']">
                                        {{
                                            row.budget }}</td>
                                    <td class="text-center px-4">
                                        <span dir="ltr"
                                            :class="[row.variance?.includes('-') ? 'bg-red-50 text-red-500' : 'bg-[#E6F9F4] text-[#029F80]', 'px-2 py-0.5 rounded-full text-xs font-bold inline-block']">{{
                                                row.variance }}</span>
                                    </td>
                                    <td class="pe-8 py-2">
                                        <div class="flex justify-center items-end">
                                            <div v-if="row.progress !== '-'"
                                                :class="[isCompressed ? 'w-14 h-8' : 'w-16 h-10', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                                class="relative transition-all duration-500">
                                                <svg class="w-full h-full" viewBox="0 0 36 22">
                                                    <circle cx="18" cy="18" r="15" fill="none"
                                                        :class="isDark ? 'stroke-white/10' : 'stroke-gray-100'"
                                                        stroke-width="3" stroke-dasharray="47.1 94.2"
                                                        transform="rotate(-180 18 18)" stroke-linecap="round" />
                                                    <circle v-if="row.progress > 0" cx="18" cy="18" r="15" fill="none"
                                                        :stroke="getProgressColor(row.progress)" stroke-width="3.5"
                                                        stroke-dasharray="47.1 94.2"
                                                        :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                                        transform="rotate(-180 18 18)" stroke-linecap="round"
                                                        class="transition-all duration-1000" />
                                                </svg>
                                                <span
                                                    :class="[isDark ? 'text-white/80' : 'text-black', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                                    class="absolute bottom-0 text-[10px] inset-x-0 flex items-center justify-center font-bold leading-none">{{
                                                        row.progress }}%</span>
                                            </div>
                                            <div v-else class="text-gray-400 text-xs">-</div>
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
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    isDark: Boolean,
    currentLang: String,
    title: String,
    t: Object,
    data: Array,
    activeTab: String,
    selectedRatio: String,
    ratioOptions: Array,
    isCompressed: Boolean
});

const emit = defineEmits(['close', 'handleSchedule', 'updateRatio']);

const isOpenRatio = ref(false);

const handleRatioSelect = (option) => {
    emit('updateRatio', option);
    isOpenRatio.value = false;
};

const getProgressColor = (progress) => {
    if (progress >= 75) return `#029F80`;
    if (progress >= 50) return `#FFBC01`;
    return `#FB7554`;
};
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