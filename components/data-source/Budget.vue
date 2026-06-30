<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    isDark: Boolean,
    currentLang: String
});

const { year, loading, error, plData, bsData, monthHeaders, openDetailedReport } = useBudget()

const isModalOpen = ref(false);
const isVarianceModalOpen = ref(false);
const modalConfig = ref({ title: '', columns: [], data: [], showSiNo: false });
const modalLoading = ref(false);

// Build month column definitions from backend headers (fallback to generic keys)
const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

const monthColumns = computed(() => {
    if (monthHeaders.value.length === 12) {
        return monthKeys.map((k, i) => ({ label: monthHeaders.value[i], labelAr: monthHeaders.value[i], key: k }))
    }
    return monthKeys.map(k => ({ label: k.charAt(0).toUpperCase() + k.slice(1), labelAr: k, key: k }))
})

const plColumns = computed(() => [
    { label: 'Particulars', labelAr: 'التفاصيل', key: 'name', sticky: true },
    ...monthColumns.value,
    { label: 'Total', labelAr: 'الإجمالي', key: 'total', fontBold: true }
])

const bsColumns = computed(() => [
    { label: 'Particulars', labelAr: 'التفاصيل', key: 'name', sticky: true },
    ...monthColumns.value,
])

const detailColumns = computed(() => [
    { label: 'Main Group',  labelAr: 'المجموعة الرئيسية', key: 'mainGroup' },
    { label: 'Sub Group',   labelAr: 'المجموعة الفرعية',  key: 'subGroup' },
    { label: 'Particulars', labelAr: 'التفاصيل',          key: 'name', sticky: true },
    ...monthColumns.value,
    { label: 'Total', labelAr: 'الإجمالي', key: 'total', fontBold: true }
])

const salaryColumns = computed(() => [
    { label: 'Employee No.', labelAr: 'رقم الموظف', key: 'empNo' },
    { label: 'Staff Name',   labelAr: 'اسم الموظف', key: 'name', sticky: true },
    ...monthColumns.value,
    { label: 'Total', labelAr: 'الإجمالي', key: 'total', fontBold: true }
])

const handleReportOpen = async (itemId, title) => {
    modalLoading.value = true
    isModalOpen.value  = true

    let cols = detailColumns.value
    if (itemId === 'b_profit_loss')   cols = plColumns.value
    if (itemId === 'b_balance_sheet') cols = bsColumns.value
    if (itemId === 'b_salaries')      cols = salaryColumns.value

    modalConfig.value = { title, columns: cols, data: [], showSiNo: false }

    try {
        const rows = await openDetailedReport(itemId)
        modalConfig.value = { title, columns: cols, data: rows, showSiNo: false }
    } catch {
        // keep modal open with empty data
    } finally {
        modalLoading.value = false
    }
};

const budgetSections = [
    {
        id: 'financial',
        label: 'Financial Statements',
        labelAr: 'القوائم المالية',
        lightHeaderBg: 'bg-[#DBEAFE] border border-[#BEDBFF]',
        darkHeaderBg: 'bg-blue-900/40',
        lightCardBg: 'bg-[#EFF6FF] border-[#BEDBFF]',
        buttonBg: 'bg-[#2063BB] hover:bg-[#1e4d8c]',
        items: [
            { id: 'b_balance_sheet', title: 'Balance sheet', titleAr: 'الميزانية العمومية المرصودة' },
            { id: 'b_profit_loss', title: 'Profit & Loss', titleAr: 'الأرباح والخسائر المرصودة' },
        ]
    },
    {
        id: 'assets',
        label: 'Assets & Liabilities',
        labelAr: 'الأصول والالتزامات',
        lightHeaderBg: 'bg-[#F3E8FF] border border-[#E9D4FF]',
        darkHeaderBg: 'bg-purple-900/40',
        lightCardBg: 'bg-[#FAF5FF] border-[#E9D4FF]',
        buttonBg: 'bg-[#733EB9] hover:bg-[#5a3091]',
        items: [
            { id: 'b_fixed_assets', title: 'Fixed Assets', titleAr: 'الأصول الثابتة المرصودة' },
            { id: 'b_current_assets', title: 'Current assets', titleAr: 'الأصول المتداولة المرصودة' },
            { id: 'b_capital', title: 'Capital', titleAr: 'رأس المال المرصود' },
            { id: 'b_non_current_liab', title: 'Non Current liability', titleAr: 'الالتزامات غير المتداولة المرصودة' },
            { id: 'b_current_liab', title: 'Current liability', titleAr: 'الالتزامات المتداولة المرصودة' },
        ]
    },
    {
        id: 'income',
        label: 'Income & Expenses',
        labelAr: 'الإيرادات والمصروفات',
        lightHeaderBg: 'bg-[#DCFCE7] border border-[#B9F8CF]',
        darkHeaderBg: 'bg-green-900/40',
        lightCardBg: 'bg-[#F0FDF4] border-[#B9F8CF]',
        buttonBg: 'bg-[#138A44] hover:bg-[#0e6934]',
        items: [
            { id: 'b_revenue', title: 'Revenue', titleAr: 'الإيرادات المرصودة' },
            { id: 'b_indirect_income', title: 'Indirect Income', titleAr: 'الدخل غير المباشر المرصود' },
            { id: 'b_direct_exp', title: 'Direct expenses', titleAr: 'المصروفات المباشرة المرصودة' },
            { id: 'b_indirect_exp', title: 'Indirect expenses', titleAr: 'المصروفات غير المباشرة المرصودة' },
            { id: 'b_salaries', title: 'Salaries', titleAr: 'الرواتب المرصودة' },
        ]
    }
];
</script>

<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">

        <div class="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
                <h2 class="text-lg font-normal transition-colors duration-300"
                    :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                    {{ currentLang === 'ar' ? 'تخطيط الميزانية' : 'Budget Planning' }}
                </h2>
                <p class="text-base mt-1 transition-colors duration-300"
                    :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                    {{ currentLang === 'ar' ? 'تتبع ميزانيات الأقسام والفروقات' : 'Track departmental budgets and variances' }}
                </p>
            </div>

            <div class="flex items-center gap-4">
                <!-- Year picker -->
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-500">{{ currentLang === 'ar' ? 'السنة' : 'Year' }}</label>
                    <input type="number" v-model.number="year"
                        class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#008169]"
                        :min="2020" :max="2030" />
                </div>

                <button @click="isVarianceModalOpen = true"
                    class="flex items-center gap-2 px-4 py-2.5 bg-[#00896A] text-white rounded-lg text-[14px] font-medium hover:bg-[#007056] transition-colors whitespace-nowrap shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ currentLang === 'ar' ? 'التحقق من التباين' : 'Check Variance' }}
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-6 h-6 border-2 border-[#008169] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            <div v-for="section in budgetSections" :key="section.id" class="flex flex-col gap-6">
                <div class="py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-500"
                    :class="isDark ? section.darkHeaderBg : section.lightHeaderBg">
                    <span :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                        {{ currentLang === 'ar' ? section.labelAr : section.label }}
                    </span>
                </div>

                <div v-for="item in section.items" :key="item.id"
                    class="p-6 rounded-2xl border transition-all duration-300" :class="[
                        isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : section.lightCardBg + ' hover:shadow-md'
                    ]">
                    <h3 class="text-base font-medium mb-6" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                        Budgeted - {{ currentLang === 'ar' ? item.titleAr : item.title }}
                    </h3>

                    <button @click="handleReportOpen(item.id, currentLang === 'ar' ? item.titleAr : item.title)"
                        class="flex items-center justify-center gap-2 w-full py-2.5 text-white rounded-lg text-base font-normal transition-all active:scale-95 shadow-sm"
                        :class="section.buttonBg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        {{ currentLang === 'ar' ? 'عرض التقرير' : 'View Detailed Report' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <DataSourceBudgetModal :isOpen="isModalOpen" :title="modalConfig.title" :columns="modalConfig.columns"
        :data="modalConfig.data" :isDark="isDark" :currentLang="currentLang" :showSiNo="modalConfig.showSiNo"
        :loading="modalLoading"
        @close="isModalOpen = false" />

    <DataSourceVarianceModal
        :isOpen="isVarianceModalOpen"
        :isDark="isDark"
        :currentLang="currentLang"
        @close="isVarianceModalOpen = false"
        @confirm="isVarianceModalOpen = false"
    />
</template>
