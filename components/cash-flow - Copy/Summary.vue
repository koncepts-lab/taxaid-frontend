<template>
    <div class="w-full transition-all duration-500 rounded-3xl overflow-hidden">
        <div class="py-5 lg:px-8 px-4 flex justify-between items-center">
            <div>
                <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                    {{ currentLang === 'ar' ? 'ملخص التدفقات النقدية' : 'Cashflow Summary' }}
                </p>
                <p class="text-[12px] font-normal mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                    {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
                </p>
            </div>
            <div class="flex items-center gap-3">
                <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
            </div>
        </div>

        <div class="w-full overflow-x-auto no-scrollbar relative min-h-[200px]">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[2px]">
                <div class="w-10 h-10 border-4 border-[#0BD9A4] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px]">
                <p class="text-xs font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
            </div>

            <table v-if="!loading && !error" class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[700px]">
                <thead class="text-white" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
                    <tr class="transition-all duration-500">
                        <th :class="isCompressed ? 'px-8 py-4' : 'px-8 py-5'" class="font-medium text-[14px]">
                            {{ currentLang === 'ar' ? 'التدفقات النقدية' : 'Cashflow' }}
                        </th>
                        <th :class="isCompressed ? 'px-4 py-4' : 'px-6 py-5'" class="font-medium text-right rtl:text-left text-[14px]">
                            {{ currentLang === 'ar' ? 'الحالي' : 'Current' }}
                        </th>
                        <th :class="isCompressed ? 'px-4 py-4' : 'px-6 py-5'" class="font-medium text-right rtl:text-left text-[14px]">
                            {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
                        </th>
                        <th :class="isCompressed ? 'px-4 py-4' : 'px-6 py-5'" class="font-medium text-right rtl:text-left text-[14px]">
                            {{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}
                        </th>
                        <th :class="isCompressed ? 'px-4 py-4' : 'px-6 py-5'" class="font-medium text-right rtl:text-left text-[14px]">
                            {{ currentLang === 'ar' ? 'الفرق' : 'Variance' }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, index) in rows"
                        :key="index"
                        class="transition-all duration-500"
                        :class="[
                            row.isSummary
                                ? (isDark ? 'bg-[#186554] text-white' : 'bg-[#51FFD980] text-black')
                                : (isDark ? 'bg-transparent border-b border-white/10 text-white' : 'bg-white border-b border-gray-100 text-black')
                        ]"
                    >
                        <!-- Label -->
                        <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', 'font-medium text-[14px]']">
                            {{ currentLang === 'ar' ? (row.labelAr ?? row.label) : row.label }}
                        </td>
                        <!-- Current -->
                        <td :class="[isCompressed ? 'px-4 py-4' : 'px-6 py-5', 'text-right rtl:text-left font-medium text-[14px]']">
                            {{ row.current }}
                        </td>
                        <!-- Previous -->
                        <td
                            :class="[isCompressed ? 'px-4 py-4' : 'px-6 py-5', 'text-right rtl:text-left font-medium text-[14px]']"
                            :style="row.isSummary ? {} : { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }"
                        >
                            {{ row.previous }}
                        </td>
                        <!-- Budget -->
                        <td
                            :class="[isCompressed ? 'px-4 py-4' : 'px-6 py-5', 'text-right rtl:text-left font-medium text-[14px]']"
                            :style="row.isSummary ? {} : { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }"
                        >
                            {{ row.budget }}
                        </td>
                        <!-- Variance -->
                        <td :class="[isCompressed ? 'px-4 py-4' : 'px-6 py-5', 'text-right rtl:text-left font-semibold text-[14px]']">
                            <span :class="varianceClass(row.variance)">{{ row.variance }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    isCompressed: Boolean,
    loading: Boolean,
    error: [String, Object]
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const rows = computed(() => props.data ?? [])

const varianceClass = (variance) => {
    if (!variance) return ''
    if (variance.startsWith('+')) return 'text-[#00C285]'
    if (variance.startsWith('-')) return 'text-[#FF6B6B]'
    return isDark.value ? 'text-white/80' : 'text-gray-700'
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
