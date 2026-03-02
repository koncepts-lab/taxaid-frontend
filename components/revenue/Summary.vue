<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500 rounded-b-3xl">
        <div class="py-5 px-8 flex justify-between items-center">
            <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص الإيرادات' : 'Revenue Summary' }}</p>
            <div class="flex gap-4 items-center">
                <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
                <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100" @click="isModalOpen = true" />
            </div>
        </div> 
        <table class="w-full text-left rtl:text-right border-collapse min-w-200">
            <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr class="transition-all duration-500">
                    <th :class="isCompressed ? 'px-8 py-4' : 'px-8 py-5'" class="font-medium text-[14px]">
                        {{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}
                    </th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-right rtl:text-left text-[14px]">
                        <div class="flex items-center justify-end rtl:justify-start gap-2">
                            {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'التباين' : 'Variance' }}</th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'السنة القادمة' : 'Year to Go' }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in data" :key="i" :class="[
                    row.isSummary ? (isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]') : (isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'),
                    'text-[14px] font-medium'
                ]" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium']">{{ currentLang === 'ar' ? row.labelAr : row.label }}</td>
                    <td class="text-right rtl:text-left" :class="[isCompressed ? 'px-4' : 'px-6']">
                        <span v-if="!row.isSummary" class="underline underline-offset-4 cursor-pointer font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00b484]'">
                            {{ row.current }}
                        </span>
                        <span v-else :class="isDark ? 'text-white' : 'text-[#000]'">
                            {{ row.current }}
                        </span>
                    </td>
                    <td :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000] opacity-80', 'text-right rtl:text-left font-medium']">{{ row.previous }}</td>
                    <td :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000] opacity-80', 'text-right rtl:text-left font-medium']">{{ row.budget }}</td>
                    <td class="text-center" :class="[isCompressed ? 'px-4' : 'px-6']">
                        <span class="px-4 py-1.5 rounded-full text-[13px] font-medium inline-block min-w-[70px] ltr:direction-ltr rtl:direction-ltr"
                            :class="[
                                row.variance.startsWith('+') 
                                    ? (isDark ? 'bg-[#6EFFA0CC] text-[#002B21]' : 'bg-[#6EFFA04D] text-[#00b48d]') 
                                    : (isDark ? 'bg-[#FB7554CC] text-white' : 'bg-[#FB75544D] text-[#FF582F]')
                            ]">
                            {{ row.variance }}
                        </span>
                    </td>
                    <td :class="isCompressed ? 'px-4' : 'px-6'" class="py-5">
                        <div class="flex justify-center">
                            <div class="relative w-16 h-8 overflow-hidden">
                                <svg class="w-16 h-16" viewBox="0 0 100 100">
                                    <!-- Background Track -->
                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" :stroke="isDark ? '#FFFFFF1A' : '#f3f4f6'" stroke-width="8" stroke-linecap="round" />
                                    <!-- Progress Path -->
                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" 
                                        :stroke="getProgressColor(row.progress)" 
                                        stroke-width="8" 
                                        stroke-linecap="round"
                                        stroke-dasharray="125.66" 
                                        :stroke-dashoffset="125.66 * (1 - row.progress / 100)"
                                        class="transition-all duration-1000 ease-out" />
                                </svg>
                                <span class="absolute bottom-0 left-0 w-full text-center text-[10px] font-bold leading-none mb-1" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                                    {{ row.progress }}%
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    data: Array,
    isCompressed: Boolean
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const getProgressColor = (progress) => {
    if (progress >= 50) return '#00d28e'
    if (progress >= 30) return '#ffb74d'
    return '#fb7554'
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

/* Semi-circle transition */
path {
    transition: stroke-dashoffset 1s ease-in-out;
}
</style>
