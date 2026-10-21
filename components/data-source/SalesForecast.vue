<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#002e26] border-white/5' : 'bg-white border border-gray-100 shadow-sm'">

        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
                <h2 class="text-[20px] font-medium transition-colors duration-300"
                    :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                    {{ currentLang === 'ar' ? 'توقعات المبيعات' : 'Sales Forecast' }}
                </h2>
                <p class="text-[14px] mt-1 transition-colors duration-300"
                    :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                    {{ currentLang === 'ar' ? 'تتبع وإدارة فرص المبيعات وتوقعات الإيرادات' :
                        'Track and manage sales opportunities and revenue forecasts' }}
                </p>
            </div>

            <div class="flex items-center gap-4 w-full lg:w-auto">
                <div v-if="isTaxaid" class="flex bg-[#61FFD61A] p-1 rounded-xl border border-[#84D7C5]/30">
                    <button v-for="mode in ['Hybrid', 'Direct']" :key="mode" @click="changeMode(mode)"
                        class="px-4 py-1.5 rounded-lg text-sm transition-all duration-300"
                        :class="activeMode === mode ? 'bg-[#00B794] text-white shadow-sm' : isDark ? 'text-white/60' : 'text-black/80'">
                        {{ mode }}
                    </button>
                </div>

                <button @click="openDetailedReport"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shadow-sm"
                    :class="isDark ? 'bg-[#008169] hover:bg-[#006b56] text-white' : 'bg-[#68E4C4] hover:bg-[#52c9ac] text-[#013E32]'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                </button>
            </div>
        </div>

        <!-- Table always rendered -->
        <div class="overflow-x-auto rounded-[15px] border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <table class="w-full text-left rtl:text-right border-collapse min-w-[1200px]">
                <thead>
                    <tr class="bg-[#008864] text-white">
                        <th class="px-6 py-5 text-sm font-medium w-[15%]"></th>
                        <th class="px-4 py-5 text-sm font-medium text-right">Actual ({{ currencyCode }}) Invoiced</th>
                        <th class="px-4 py-5 text-sm font-medium text-right">Income (100%) {{ currencyCode }}</th>
                        <th class="px-4 py-5 text-sm font-medium text-right">
                            Forecasted Income<br>
                            <span>(less than 100% but >= 90%) {{ currencyCode }}</span>
                        </th>
                        <th class="px-4 py-5 text-sm font-medium text-right">
                            Income After Including<br>
                            <span>Possible Income</span>
                        </th>
                        <th class="px-4 py-5 text-sm font-medium text-right">Budget 2025 {{ currencyCode }}</th>
                        <th class="px-4 py-5 text-sm font-medium text-right">
                            Difference<br>
                            <span>(income 100% vs budget)</span>
                        </th>
                    </tr>
                </thead>

                <!-- Skeleton Loading -->
                <tbody v-if="loading">
                    <!-- Year Row Skeleton -->
                    <tr class="text-white font-medium bg-[#014235]">
                        <td class="px-6 py-3 border-white/10"><div class="h-4 bg-white/20 rounded w-16 animate-pulse"></div></td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                    </tr>
                    <!-- Quarter & Month Rows Skeleton -->
                    <template v-for="q in 4" :key="'skeleton-q-'+q">
                        <tr :class="['font-medium border-b border-[#84D7C5]/30', isDark ? 'bg-[#013e32] text-white' : 'bg-[#C2F9E9] text-[#013E32]']">
                            <td class="px-6 py-3 border-[#84D7C5]"><div class="h-4 rounded w-20 animate-pulse" :class="isDark ? 'bg-white/20' : 'bg-[#013E32]/20'"></div></td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        </tr>
                        <tr v-for="m in 3" :key="'skeleton-m-'+q+'-'+m" class="border-b transition-colors animate-pulse"
                            :class="isDark ? 'border-white/5' : 'border-gray-100'">
                            <td class="px-6 py-3"><div class="h-4 rounded w-16" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                            <td class="px-4 py-3"><div class="h-4 rounded w-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                            <td class="px-4 py-3"><div class="h-4 rounded w-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                            <td class="px-4 py-3"><div class="h-4 rounded w-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                            <td class="px-4 py-3"><div class="h-4 rounded w-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                            <td class="px-4 py-3"><div class="h-4 rounded w-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                            <td class="px-4 py-3"><div class="h-4 rounded w-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                        </tr>
                    </template>
                </tbody>

                <!-- Error -->
                <tbody v-else-if="error">
                    <tr><td colspan="7" class="text-sm text-red-500 py-10 text-center">{{ error }}</td></tr>
                </tbody>

                <!-- Data -->
                <tbody v-else v-for="year in data" :key="year.id">
                    <tr class="text-white font-medium bg-[#014235]">
                        <td class="px-6 py-3 border-white/10">{{ year.label }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                    </tr>

                    <template v-for="quarter in year.quarters" :key="quarter.id">
                        <tr :class="['font-medium border-b border-[#84D7C5]/30', isDark ? 'bg-[#013e32] text-white' : 'bg-[#C2F9E9] text-[#013E32]']">
                            <td class="px-6 py-3 border-[#84D7C5]">{{ quarter.label }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ currencyCode }}</td>
                        </tr>

                        <tr v-for="month in quarter.months" :key="month.label" class="transition-colors"
                            :class="[
                                month.is_total
                                    ? (isDark ? 'bg-[#004d3d] font-semibold text-white border-0' : 'bg-[#8FE0C4] font-medium text-[#013E32] border-0')
                                    : (isDark ? 'border-b border-white/5 hover:bg-white/5 text-white/80' : 'border-b border-gray-100 hover:bg-gray-50 text-gray-700')
                            ]">
                            <td class="px-6 py-3" :class="month.is_total ? 'border-0' : (isDark ? 'border-white/5' : 'border-gray-100')">{{ month.label }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ formatCurrency(month.actual) }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ formatCurrency(month.income) }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ formatCurrency(month.forecast) }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ formatCurrency(month.possible) }}</td>
                            <td class="px-4 py-3 text-right text-sm">{{ formatCurrency(month.budget) }}</td>
                            <td class="px-4 py-3 text-right text-sm font-medium"
                                :class="month.diff !== null && parseFloat(month.diff) < 0 ? (isDark ? 'text-[#FF7056]' : 'text-red-500') : (isDark ? 'text-[#00FFBC]' : 'text-green-600')">
                                {{ formatCurrency(month.diff) }}
                            </td>
                        </tr>
                    </template>
                </tbody>

                <tfoot v-if="!loading && !error && data.length > 0">
                    <tr class="transition-colors font-bold border-t-2"
                        :class="isDark ? 'bg-[#003d30] text-white border-[#00FFBC]/40' : 'bg-[#D2F7EC] text-[#013E32] border-[#008864]'">
                        <td class="px-6 py-4 text-sm font-bold">
                            {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                        </td>
                        <td class="px-4 py-4 text-right text-sm font-bold">{{ formatCurrency(mainTotals.actual) }}</td>
                        <td class="px-4 py-4 text-right text-sm font-bold">{{ formatCurrency(mainTotals.income) }}</td>
                        <td class="px-4 py-4 text-right text-sm font-bold">{{ formatCurrency(mainTotals.forecast) }}</td>
                        <td class="px-4 py-4 text-right text-sm font-bold">{{ formatCurrency(mainTotals.possible) }}</td>
                        <td class="px-4 py-4 text-right text-sm font-bold">{{ formatCurrency(mainTotals.budget) }}</td>
                        <td class="px-4 py-4 text-right text-sm font-bold"
                            :class="mainTotals.diff !== null && parseFloat(mainTotals.diff) < 0
                                ? (isDark ? 'text-[#FF7056]' : 'text-red-500')
                                : (isDark ? 'text-[#00FFBC]' : 'text-green-600')">
                            {{ formatCurrency(mainTotals.diff) }}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>
const { isTaxaid } = usePermissions()
defineProps({
    isDark: Boolean,
    currentLang: String
})
const emit = defineEmits(['open-sales-report'])

const { data, loading, error, activeMode, changeMode, detailedRows, fetchDetailedReport } = useSalesForecast()
const { code: currencyCode } = useCurrency()

const mainTotals = computed(() => {
    const totals = { actual: 0, income: 0, forecast: 0, possible: 0, budget: 0, diff: 0 }
    let hasActual = false, hasIncome = false, hasForecast = false, hasPossible = false, hasBudget = false, hasDiff = false

    for (const year of data.value || []) {
        for (const q of year.quarters || []) {
            const qTotal = q.months?.find(m => m.is_total)
            if (qTotal) {
                if (qTotal.actual != null) { totals.actual += Number(qTotal.actual); hasActual = true }
                if (qTotal.income != null) { totals.income += Number(qTotal.income); hasIncome = true }
                if (qTotal.forecast != null) { totals.forecast += Number(qTotal.forecast); hasForecast = true }
                if (qTotal.possible != null) { totals.possible += Number(qTotal.possible); hasPossible = true }
                if (qTotal.budget != null) { totals.budget += Number(qTotal.budget); hasBudget = true }
                if (qTotal.diff != null) { totals.diff += Number(qTotal.diff); hasDiff = true }
            }
        }
    }

    return {
        actual: hasActual ? totals.actual : null,
        income: hasIncome ? totals.income : null,
        forecast: hasForecast ? totals.forecast : null,
        possible: hasPossible ? totals.possible : null,
        budget: hasBudget ? totals.budget : null,
        diff: hasDiff ? totals.diff : null,
    }
})

const openDetailedReport = async () => {
  await fetchDetailedReport()
  emit('open-sales-report', detailedRows.value)
}
</script>
