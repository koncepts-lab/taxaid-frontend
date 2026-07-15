<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">

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
                <div class="flex bg-[#61FFD61A] p-1 rounded-xl border border-[#84D7C5]/30">
                    <button v-for="mode in ['Hybrid', 'Direct']" :key="mode" @click="changeMode(mode)"
                        class="px-4 py-1.5 rounded-lg text-sm transition-all duration-300"
                        :class="activeMode === mode ? 'bg-[#00B794] text-white shadow-sm' : isDark ? 'text-white/60' : 'text-black/80'">
                        {{ mode }}
                    </button>
                </div>

                <button @click="$emit('open-sales-report')"
                    class="flex items-center gap-2 px-5 py-2.5 bg-[#68E4C4] hover:bg-[#52c9ac] text-[#013E32] rounded-xl text-sm font-medium transition-all whitespace-nowrap shadow-sm">
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
                        <th class="px-4 py-5 text-sm font-medium text-center">Actual (AED) Invoiced</th>
                        <th class="px-4 py-5 text-sm font-medium text-center">Income (100%) AED</th>
                        <th class="px-4 py-5 text-sm font-medium text-center">
                            Forecasted Income<br>
                            <span>(less than 100% but >= 90%) AED</span>
                        </th>
                        <th class="px-4 py-5 text-sm font-medium text-center">
                            Income After Including<br>
                            <span>Possible Income</span>
                        </th>
                        <th class="px-4 py-5 text-sm font-medium text-center">Budget 2025 AED</th>
                        <th class="px-4 py-5 text-sm font-medium text-center">
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
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                    </tr>
                    <!-- Quarter & Month Rows Skeleton -->
                    <template v-for="q in 4" :key="'skeleton-q-'+q">
                        <tr class="bg-[#C2F9E9] text-[#013E32] font-medium border-b border-[#84D7C5]/30">
                            <td class="px-6 py-3 border-[#84D7C5]"><div class="h-4 bg-[#013E32]/20 rounded w-20 animate-pulse"></div></td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
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
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                        <td class="px-4 py-3 text-center text-sm">AED</td>
                    </tr>

                    <template v-for="quarter in year.quarters" :key="quarter.id">
                        <tr class="bg-[#C2F9E9] text-[#013E32] font-medium border-b border-[#84D7C5]/30">
                            <td class="px-6 py-3 border-[#84D7C5]">{{ quarter.label }}</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                            <td class="px-4 py-3 text-center text-sm">AED</td>
                        </tr>

                        <tr v-for="month in quarter.months" :key="month.label" class="border-b transition-colors"
                            :class="isDark ? 'border-white/5 hover:bg-white/5 text-white/80' : 'border-gray-100 hover:bg-gray-50 text-gray-700'">
                            <td class="px-6 py-3" :class="isDark ? 'border-white/5' : 'border-gray-100'">{{ month.label }}</td>
                            <td class="px-4 py-3 text-center text-sm">{{ month.actual ?? '-' }}</td>
                            <td class="px-4 py-3 text-center text-sm">{{ month.income ?? '-' }}</td>
                            <td class="px-4 py-3 text-center text-sm">{{ month.forecast ?? '-' }}</td>
                            <td class="px-4 py-3 text-center text-sm">{{ month.possible ?? '-' }}</td>
                            <td class="px-4 py-3 text-center text-sm">{{ month.budget ?? '-' }}</td>
                            <td class="px-4 py-3 text-center text-sm font-medium"
                                :class="month.diff !== null && parseFloat(month.diff) < 0 ? 'text-red-500' : 'text-green-600'">
                                {{ month.diff ?? '-' }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isDark: Boolean,
    currentLang: String
})
defineEmits(['open-sales-report'])

const { data, loading, error, activeMode, changeMode } = useSalesForecast()
</script>
