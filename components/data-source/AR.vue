<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">

        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
                <h2 class="text-[20px] font-medium transition-colors duration-300"
                    :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                    {{ title }}
                </h2>
                <p class="text-[14px] mt-1 transition-colors duration-300"
                    :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                    {{ currentLang === 'ar' ? 'تتبع فواتير العملاء والمدفوعات القائمة' :
                        'Track customer invoices and outstanding payments' }}
                </p>
            </div>

            <div class="flex items-center gap-4 w-full lg:w-auto">
                <div class="flex bg-[#61FFD61A] p-1 rounded-xl border border-[#84D7C5]/30">
                    <button v-for="mode in ['Hybrid', 'Direct']" :key="mode" @click="$emit('change-mode', mode)"
                        class="px-4 py-1.5 rounded-lg text-sm transition-all duration-300"
                        :class="activeMode === mode ? 'bg-[#00B794] text-white shadow-sm' : 'text-black/80 '">
                        {{ mode }}
                    </button>
                </div>

                <button @click="isModalOpen = true"
                    class="flex items-center gap-2 px-5 py-2.5 bg-[#68E4C4] hover:bg-[#52c9ac] text-[#013E32] rounded-xl text-sm font-medium transition-all whitespace-nowrap shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-16">
            <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin w-8 h-8 text-[#00B794]" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span class="text-sm" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                    {{ currentLang === 'ar' ? 'جارٍ التحميل...' : 'Loading aging data...' }}
                </span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error"
            class="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ error }}
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto rounded-[15px] border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <table class="w-full text-left rtl:text-right border-collapse min-w-[900px]">
                <thead>
                    <tr class="bg-[#008864] text-white">
                        <th class="px-6 py-4 text-[14px] font-normal w-20">{{ currentLang === 'ar' ? 'رقم' : 'Sl.No' }}</th>
                        <th class="px-4 py-4 text-[14px] font-normal">{{ currentLang === 'ar' ? 'العميل' : 'Customer' }}</th>
                        <th class="px-4 py-4 text-[14px] font-normal">{{ currentLang === 'ar' ? 'المبلغ (AED)' : 'Amount (AED)' }}</th>
                        <th class="px-4 py-4 text-[14px] font-normal">{{ currentLang === 'ar' ? 'غير مستحق' : 'Not Due' }}</th>
                        <th class="px-4 py-4 text-[14px] font-normal">&lt;0 - 30&gt;</th>
                        <th class="px-4 py-4 text-[14px] font-normal">&lt;31 - 90&gt;</th>
                        <th class="px-4 py-4 text-[14px] font-normal">&lt;91 - 180&gt;</th>
                        <th class="px-4 py-4 text-[14px] font-normal">&gt; 180</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Empty state -->
                    <tr v-if="!arRows.length">
                        <td colspan="8" class="px-6 py-12 text-center text-sm"
                            :class="isDark ? 'text-white/50' : 'text-gray-400'">
                            {{ currentLang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available' }}
                        </td>
                    </tr>

                    <tr v-for="(row, index) in arRows" :key="index" class="border-b transition-all duration-300"
                        :class="[
                          row.is_total
                            ? (isDark ? 'bg-[#00B794]/20 border-[#00B794]/30 font-semibold' : 'bg-[#e8fdf7] border-[#84D7C5] font-semibold')
                            : (isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50/50')
                        ]">
                        <td class="px-6 py-4 text-sm" :class="isDark ? 'text-white/60' : 'text-gray-600'">{{ row.is_total ? '—' : index + 1 }}</td>
                        <td class="px-4 py-4 text-sm font-medium" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ row.customer }}</td>
                        <td class="px-4 py-4 text-sm" :class="isDark ? 'text-white/80' : 'text-[#0A0A0A]'">{{ formatNumber(row.amount) }}</td>
                        <td class="px-4 py-4 text-sm" :class="isDark ? 'text-white/80' : 'text-[#0A0A0A]'">{{ formatNumber(row.not_due) }}</td>
                        <td class="px-4 py-4 text-sm" :class="isDark ? 'text-white/80' : 'text-[#0A0A0A]'">{{ formatNumber(row.age_0_30) }}</td>
                        <td class="px-4 py-4 text-sm" :class="isDark ? 'text-white/80' : 'text-[#0A0A0A]'">{{ formatNumber(row.age_31_90) }}</td>
                        <td class="px-4 py-4 text-sm" :class="isDark ? 'text-white/80' : 'text-[#0A0A0A]'">{{ formatNumber(row.age_91_180) }}</td>
                        <td class="px-4 py-4 text-sm" :class="isDark ? 'text-white/80' : 'text-[#0A0A0A]'">{{ formatNumber(row.age_gt_180) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="bg-[#68E4C4] font-medium text-[#013E32]">
                        <td class="px-6 py-4 rounded-bl-[15px]" colspan="2">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                        <td class="px-4 py-4">{{ formatNumber(arTotals.amount) }}</td>
                        <td class="px-4 py-4">{{ formatNumber(arTotals.not_due) }}</td>
                        <td class="px-4 py-4">{{ formatNumber(arTotals.age_0_30) }}</td>
                        <td class="px-4 py-4">{{ formatNumber(arTotals.age_31_90) }}</td>
                        <td class="px-4 py-4">{{ formatNumber(arTotals.age_91_180) }}</td>
                        <td class="px-4 py-4 rounded-br-[15px]">{{ formatNumber(arTotals.age_gt_180) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="isModalOpen"
                    class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="isModalOpen = false">

                    <div class="w-full max-w-[90vw] bg-white transition-all duration-300 transform scale-100 shadow-2xl rounded-lg p-6"
                        :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                        <div class="flex justify-between items-center mb-8 px-4">
                            <h2 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                                {{ title }} - {{ currentLang === 'ar' ? 'تقرير مفصل' : 'Detailed Report' }}
                            </h2>
                            <button @click="isModalOpen = false"
                                class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="overflow-x-auto rounded-[20px] border"
                            :class="isDark ? 'border-white/10' : 'border-gray-200'">
                            <table class="w-full text-left rtl:text-right border-collapse min-w-[1200px]">
                                <thead>
                                    <tr class="bg-[#008864] text-white">
                                        <th class="px-6 py-5 text-[15px] font-medium">{{ currentLang === 'ar' ? 'العميل' : 'Customer' }}</th>
                                        <th class="px-4 py-5 text-[15px] font-medium">{{ currentLang === 'ar' ? 'الفاتورة' : 'Invoice' }}</th>
                                        <th class="px-4 py-5 text-[15px] font-medium">{{ currentLang === 'ar' ? 'تاريخ الفاتورة' : 'Date of Invoice' }}</th>
                                        <th class="px-4 py-5 text-[15px] font-medium">{{ currentLang === 'ar' ? 'أيام الائتمان' : 'Credit days' }}</th>
                                        <th class="px-4 py-5 text-[15px] font-medium">{{ currentLang === 'ar' ? 'تاريخ الاستحقاق' : 'Due date of Invoice' }}</th>
                                        <th class="px-4 py-5 text-[15px] font-medium">30-Jun-25</th>
                                        <th class="px-6 py-5 text-[15px] font-medium text-right rtl:text-left">{{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                                    </tr>
                                </thead>
                                <tbody class="max-h-[50vh]">
                                    <tr v-for="i in 11" :key="i" class="border-b transition-colors"
                                        :class="isDark ? 'border-white/5 hover:bg-white/5 text-white/80' : 'border-gray-100 hover:bg-gray-50 text-gray-700'">
                                        <td class="px-6 py-4 text-[15px]">AI Dhabi Contracting LLC</td>
                                        <td class="px-4 py-4 text-[15px]">1876</td>
                                        <td class="px-4 py-4 text-[15px]">11-Jun-25</td>
                                        <td class="px-4 py-4 text-[15px]">0</td>
                                        <td class="px-4 py-4 text-[15px]">11-Jun-25</td>
                                        <td class="px-4 py-4 text-[15px]">19 Days</td>
                                        <td class="px-6 py-4 text-[15px] text-right rtl:text-left font-medium">1,250,000</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr class="bg-[#68E4C4] font-bold text-[#013E32]">
                                        <td class="px-6 py-5 rounded-bl-[20px]">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                                        <td colspan="5"></td>
                                        <td class="px-6 py-5 text-right rtl:text-left rounded-br-[20px]">8,96,000</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isModalOpen = ref(false)

defineEmits(['change-mode'])

const props = defineProps({
    // Legacy static data (AP still uses this)
    data: Array,
    isDark: Boolean,
    currentLang: String,
    title: String,
    type: String, // 'AR' | 'AP'
    // Persisted tenant data mode for this side ('Hybrid' | 'Direct')
    activeMode: {
        type: String,
        default: 'Hybrid',
    },
    // Live API data (AR only)
    arRows: {
        type: Array,
        default: () => [],
    },
    arTotals: {
        type: Object,
        default: () => ({
            amount: 0, not_due: 0, age_0_30: 0,
            age_31_90: 0, age_91_180: 0, age_gt_180: 0,
        }),
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: null,
    },
})

// Format numbers with commas, 2 decimal places when non-zero
const formatNumber = (val) => {
    if (val === null || val === undefined) return '—'
    const num = Number(val)
    if (isNaN(num)) return '—'
    return num.toLocaleString('en-AE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>