<template>
    <div class="w-full transition-all duration-500 rounded-3xl">
        <div class="py-5 lg:px-8 px-4 flex justify-between items-center sticky top-0 z-30 rounded-t-3xl" 
             :class="isDark ? 'bg-[#001a14]' : 'bg-white'">
            <div>
                <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص الإيرادات' : 'Revenue Summary' }}</p>
                <p class="text-[12px] font-normal mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}</p>
            </div>
            <div class="flex items-center gap-3">
                <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
                <img
                    :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'"
                    alt="Expand Icon"
                    class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity hidden lg:block"
                    @click="isModalOpen = true"
                />
            </div>
        </div>

        <!-- Inline Table Container with overflow -->
        <div class="w-full max-w-full xl:overflow-visible overflow-x-auto custom-scrollbar relative min-h-[200px]">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-[2px]">
                <div class="flex flex-col items-center gap-3">
                    <div class="w-10 h-10 border-4 border-[#00C9A2] border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-sm font-medium" :class="isDark ? 'text-white/80' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'جاري التحميل...' : 'Loading Data...' }}</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px]">
                <div class="flex flex-col items-center gap-3 text-center px-6">
                    <p class="text-sm font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
                </div>
            </div>

            <table v-if="!loading && !error" class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px] table-fixed">
                <colgroup>
                    <col style="width: 28%;" />
                    <col style="width: 15%;" />
                    <col style="width: 15%;" />
                    <col style="width: 14%;" />
                    <col style="width: 14%;" />
                    <col style="width: 14%;" />
                </colgroup>
            <thead class="text-white sticky top-[82px] z-20" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr class="transition-all duration-500">
                    <th :class="isCompressed ? 'px-8 py-4' : 'px-8 py-5'" class="font-medium text-[14px]">
                        {{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}
                    </th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-right rtl:text-left text-[14px]">
                        <div class="flex items-center justify-end rtl:justify-start gap-2">
                            {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
                          
                        </div>
                    </th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'التباين' : 'Variance' }}</th>
                    <th :class="isCompressed ? 'px-4' : 'px-6'" class="py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'السنة القادمة' : 'Year to Go' }}</th>
                </tr>
            </thead>
            <tbody v-for="(row, i) in data" :key="i"> 
                    <!-- Parent Row -->
                    <tr :class="[
                        row.isSummary
                            ? (isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]')
                            : (isDark ? 'bg-[#001a14] border-b border-white/10' : 'bg-white border-b border-gray-100'),
                        'text-[14px] font-medium transition-all duration-500',
                        (row.children && expandedRows[i]) ? 'sticky top-[142px] z-10 shadow-sm outline outline-1 outline-gray-100 dark:outline-white/10' : ''
                    ]">
                        <!-- Label -->
                        <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium']">
                            <div class="flex items-center gap-2">
                                <span>{{ currentLang === 'ar' ? row.labelAr : row.label }}</span>
                                <button v-if="row.children && row.children.length"
                                    @click="toggleRow(i, $event)"
                                    class="focus:outline-none transition-transform duration-200">
                                    <svg v-if="expandedRows[i]" width="10" height="7" viewBox="0 0 10 7" fill="none">
                                        <path d="M1 6L5 2L9 6" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <svg v-else width="10" height="7" viewBox="0 0 10 7" fill="none">
                                        <path d="M1 1L5 5L9 1" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                        <!-- Current Year -->
                        <td class="text-right rtl:text-left" :class="[isCompressed ? 'px-4' : 'px-6']">
                            <span v-if="!row.isSummary" class="font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00b484]'">
                                {{ row.current }}
                            </span>
                            <span v-else :class="isDark ? 'text-white' : 'text-[#000]'">
                                {{ row.current }}
                            </span>
                        </td>
                        <!-- Previous Year -->
                        <td :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000] opacity-80', 'text-right rtl:text-left font-medium']">{{ row.previous }}</td>
                        <!-- Budget -->
                        <td :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000] opacity-80', 'text-right rtl:text-left font-medium']">{{ row.budget }}</td>
                        <!-- Variance -->
                        <td class="text-center" :class="[isCompressed ? 'px-4' : 'px-6']">
                            <span v-if="row.variance && row.variance !== '-'" class="px-4 py-1.5 rounded-full text-[13px] font-medium inline-block min-w-[70px] ltr:direction-ltr rtl:direction-ltr"
                                :class="[
                                    row.variance.startsWith('+')
                                        ? (isDark ? 'bg-[#6EFFA0CC] text-[#002B21]' : 'bg-[#6EFFA04D] text-[#00b48d]')
                                        : (isDark ? 'bg-[#FB7554CC] text-white' : 'bg-[#FB75544D] text-[#FF582F]')
                                ]">
                                {{ row.variance }}
                            </span>
                            <span v-else :class="isDark ? 'text-white/40' : 'text-gray-400'">-</span>
                        </td>
                        <!-- Year to Go -->
                        <td :class="isCompressed ? 'px-4' : 'px-6'" class="py-5">
                            <div v-if="row.progress !== null && row.progress !== undefined" class="flex justify-center">
                                <div class="relative w-[65px] h-[32px] overflow-hidden">
                                    <svg class="w-[65px] h-[65px]" viewBox="0 0 100 100">
                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" :stroke="isDark ? '#FFFFFF1A' : '#f3f4f6'" stroke-width="8" stroke-linecap="round" />
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
                            <div v-else class="flex justify-center">
                                <span :class="isDark ? 'text-white/40' : 'text-gray-400'">-</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Child Rows -->
                    <tr v-if="row.children && expandedRows[i]">
                        <td colspan="6" class="p-0 border-none">
                            <div class="max-h-[320px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                                <table class="w-full text-left rtl:text-right border-collapse table-fixed">
                                    <colgroup>
                                        <col style="width: 28%;" />
                                        <col style="width: 15%;" />
                                        <col style="width: 15%;" />
                                        <col style="width: 14%;" />
                                        <col style="width: 14%;" />
                                        <col style="width: 14%;" />
                                    </colgroup>
                                    <tbody>
                                        <tr v-for="(child, j) in row.children" :key="`child-${i}-${j}`"
                                            :class="[
                                                isDark ? 'bg-[#003D2E] border-b border-white/5' : 'bg-[#E8FBF3] border-b border-[#b2edd4]',
                                                'text-[14px] font-medium transition-all duration-500'
                                            ]">
                            <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5']">
                                <div class="relative inline-block group ltr:pl-4 rtl:pr-4">
                                    <!-- Tooltip -->
                                    <div class="absolute top-1/2 -translate-y-1/2 ltr:left-full rtl:right-full ltr:ml-2 rtl:mr-2 pointer-events-none
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                        <div class="bg-[#013e32] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
                                            {{ currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger' }}
                                        </div>
                                        <!-- Sharp Arrow -->
                                        <div class="absolute top-1/2 -translate-y-1/2 ltr:-left-1 rtl:-right-1 w-2 h-2 bg-[#013e32] rotate-45"></div>
                                    </div>
                                    <span class="underline underline-offset-4 cursor-pointer font-medium"
                                        :class="isDark ? 'text-[#00FFBC]' : 'text-[#007a57]'"
                                        @click="openLedger(child)">
                                        {{ currentLang === 'ar' ? child.labelAr : child.label }}
                                    </span>
                                </div>
                            </td>
                            <td class="text-right rtl:text-left font-medium" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white' : 'text-[#000]']">{{ child.current }}</td>
                            <td :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000] opacity-80', 'text-right rtl:text-left font-medium']">{{ child.previous }}</td>
                            <td class="text-right rtl:text-left" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/40' : 'text-gray-400']">-</td>
                            <td class="text-center" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/40' : 'text-gray-400']">-</td>
                            <td class="text-center" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/40' : 'text-gray-400']">-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
        </table>
    </div>
</div>

    <!-- ── Modal Popup ── -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isModalOpen"
                class="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                @click.self="isModalOpen = false">

                <div class="w-full max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300" style="max-width: 1500px;"
                    :class="isDark ? 'bg-[#001a14] border border-white/10' : 'bg-white'">

                    <!-- Modal Header -->
                    <div class="flex justify-between items-center py-5 px-8 shrink-0"
                        :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100'">
                        <div>
                            <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                                {{ currentLang === 'ar' ? 'ملخص الإيرادات' : 'Revenue Summary' }}
                            </p>
                            <p class="text-[12px] mt-0.5" :class="isDark ? 'text-white/50' : 'text-[#00000096]'">
                                {{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}
                            </p>
                        </div>
                        <button @click="isModalOpen = false"
                            class="p-1.5 rounded-lg transition-colors"
                            :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-[#013e32]'">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Modal Table -->
                    <div class="w-full flex-1 overflow-auto no-scrollbar" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                        <table class="w-full text-left rtl:text-right border-collapse table-fixed lg:min-w-full min-w-[1100px]">
                            <colgroup>
                                <col style="width: 28%;" />
                                <col style="width: 15%;" />
                                <col style="width: 15%;" />
                                <col style="width: 14%;" />
                                <col style="width: 14%;" />
                                <col style="width: 14%;" />
                            </colgroup>
                            <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                <tr>
                                    <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</th>
                                    <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">
                                        <div class="flex items-center justify-end rtl:justify-start gap-2">
                                            {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                    </th>
                                    <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</th>
                                    <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                                    <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'التباين' : 'Variance' }}</th>
                                    <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'السنة القادمة' : 'Year to Go' }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, i) in data" :key="`m-${i}`">
                                    <tr :class="[
                                        row.isSummary
                                            ? (isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]')
                                            : (isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'),
                                        'text-[14px] font-medium transition-all duration-500'
                                    ]">
                                        <td class="px-8 py-5 font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            <div class="flex items-center gap-2">
                                                <span>{{ currentLang === 'ar' ? row.labelAr : row.label }}</span>
                                                <button v-if="row.children && row.children.length"
                                                    @click="toggleModalRow(i, $event)"
                                                    class="focus:outline-none">
                                                    <svg v-if="modalExpandedRows[i]" width="10" height="7" viewBox="0 0 10 7" fill="none">
                                                        <path d="M1 6L5 2L9 6" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    <svg v-else width="10" height="7" viewBox="0 0 10 7" fill="none">
                                                        <path d="M1 1L5 5L9 1" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td class="px-6 py-5 text-right rtl:text-left">
                                            <span v-if="!row.isSummary" class="font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00b484]'">{{ row.current }}</span>
                                            <span v-else :class="isDark ? 'text-white' : 'text-[#000]'">{{ row.current }}</span>
                                        </td>
                                        <td class="px-6 py-5 text-right rtl:text-left font-medium" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ row.previous }}</td>
                                        <td class="px-6 py-5 text-right rtl:text-left font-medium" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ row.budget }}</td>
                                        <td class="px-6 py-5 text-center">
                                            <span v-if="row.variance && row.variance !== '-'" class="px-4 py-1.5 rounded-full text-[13px] font-medium inline-block min-w-[70px]"
                                                :class="row.variance.startsWith('+')
                                                    ? (isDark ? 'bg-[#6EFFA0CC] text-[#002B21]' : 'bg-[#6EFFA04D] text-[#00b48d]')
                                                    : (isDark ? 'bg-[#FB7554CC] text-white' : 'bg-[#FB75544D] text-[#FF582F]')">
                                                {{ row.variance }}
                                            </span>
                                            <span v-else :class="isDark ? 'text-white/40' : 'text-gray-400'">-</span>
                                        </td>
                                        <td class="px-6 py-5">
                                            <div v-if="row.progress !== null && row.progress !== undefined" class="flex justify-center">
                                                <div class="relative w-[65px] h-[32px] overflow-hidden">
                                                    <svg class="w-[65px] h-[65px]" viewBox="0 0 100 100">
                                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" :stroke="isDark ? '#FFFFFF1A' : '#f3f4f6'" stroke-width="8" stroke-linecap="round" />
                                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none"
                                                            :stroke="getProgressColor(row.progress)"
                                                            stroke-width="8" stroke-linecap="round"
                                                            stroke-dasharray="125.66"
                                                            :stroke-dashoffset="125.66 * (1 - row.progress / 100)" />
                                                    </svg>
                                                    <span class="absolute bottom-0 left-0 w-full text-center text-[10px] font-bold leading-none mb-1" :class="isDark ? 'text-white' : 'text-[#013e32]'">{{ row.progress }}%</span>
                                                </div>
                                            </div>
                                            <div v-else class="flex justify-center">
                                                <span :class="isDark ? 'text-white/40' : 'text-gray-400'">-</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- Modal Child Rows -->
                                    <tr v-if="row.children && modalExpandedRows[i]">
                                        <td colspan="6" class="p-0 border-none">
                                            <div class="max-h-[320px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                                                <table class="w-full text-left rtl:text-right border-collapse table-fixed">
                                                    <colgroup>
                                                        <col style="width: 28%;" />
                                                        <col style="width: 15%;" />
                                                        <col style="width: 15%;" />
                                                        <col style="width: 14%;" />
                                                        <col style="width: 14%;" />
                                                        <col style="width: 14%;" />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr v-for="(child, j) in row.children" :key="`mc-${i}-${j}`"
                                                            :class="[
                                                                isDark ? 'bg-[#003D2E] border-b border-white/5' : 'bg-[#E8FBF3] border-b border-[#b2edd4]',
                                                                'text-[14px] font-medium'
                                                            ]">
                                            <td class="px-8 py-4">
                                                <div class="relative inline-block group pl-4">
                                                    <!-- Tooltip -->
                                                    <div class="absolute top-1/2 -translate-y-1/2 ltr:left-full rtl:right-full ltr:ml-2 rtl:mr-2 pointer-events-none
                                                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                                        <div class="bg-[#013e32] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
                                                            {{ currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger' }}
                                                        </div>
                                                        <!-- Sharp Arrow -->
                                                        <div class="absolute top-1/2 -translate-y-1/2 ltr:-left-1 rtl:-right-1 w-2 h-2 bg-[#013e32] rotate-45"></div>
                                                    </div>
                                                    <span class="underline underline-offset-4 cursor-pointer font-medium"
                                                        :class="isDark ? 'text-[#00FFBC]' : 'text-[#007a57]'"
                                                        @click="openLedger(child)">
                                                        {{ currentLang === 'ar' ? child.labelAr : child.label }}
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 text-right font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ child.current }}</td>
                                            <td class="px-6 py-4 text-right font-medium" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ child.previous }}</td>
                                            <td class="px-6 py-4 text-right" :class="isDark ? 'text-white/40' : 'text-gray-400'">-</td>
                                            <td class="px-6 py-4 text-center" :class="isDark ? 'text-white/40' : 'text-gray-400'">-</td>
                                            <td class="px-6 py-4 text-center" :class="isDark ? 'text-white/40' : 'text-gray-400'">-</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- ── Ledger Detail Modal ── -->
    <RevenueLedgerModal
        :is-open="isLedgerOpen"
        :ledger-name="selectedLedger"
        @close="isLedgerOpen = false"
    />
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    data: Array,
    isCompressed: Boolean,
    loading: Boolean,
    error: [String, Object]
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)

// Ledger detail modal
const isLedgerOpen = ref(false)
const selectedLedger = ref('')

const openLedger = (child) => {
    selectedLedger.value = currentLang.value === 'ar' ? child.labelAr : child.label
    isLedgerOpen.value = true
}

// Inline table expand state
const expandedRows = ref({})
const initializeExpanded = () => {
    if (props.data && props.data.length) {
        props.data.forEach((row, i) => {
            if (row.children && row.children.length) {
                if (expandedRows.value[i] === undefined) {
                    expandedRows.value[i] = false
                }
            }
        })
    }
}

watch(() => props.data, () => {
    initializeExpanded()
}, { immediate: true })

const toggleRow = async (index, event) => {
    const target = event?.currentTarget?.closest('tr')
    const scrollContainer = document.querySelector('main') || window
    const originalTop = target ? target.getBoundingClientRect().top : 0

    const isCurrentlyExpanded = expandedRows.value[index]
    Object.keys(expandedRows.value).forEach(key => {
        expandedRows.value[key] = false
    })
    if (!isCurrentlyExpanded) {
        expandedRows.value[index] = true
    }

    if (target && scrollContainer && scrollContainer.scrollBy) {
        await nextTick()
        const newTop = target.getBoundingClientRect().top
        const diff = newTop - originalTop
        if (diff !== 0) {
            scrollContainer.scrollBy({ top: diff, behavior: 'instant' })
        }
    }
}

// Modal table expand state (independent)
const modalExpandedRows = ref({})
const initializeModalExpanded = () => {
    if (props.data && props.data.length) {
        props.data.forEach((row, i) => {
            if (row.children && row.children.length) {
                if (modalExpandedRows.value[i] === undefined) {
                    modalExpandedRows.value[i] = false
                }
            }
        })
    }
}

watch(() => props.data, () => {
    initializeModalExpanded()
}, { immediate: true })

const toggleModalRow = async (index, event) => {
    const target = event?.currentTarget?.closest('tr')
    const scrollContainer = target ? (target.closest('.overflow-auto') || window) : null
    const originalTop = target ? target.getBoundingClientRect().top : 0

    const isCurrentlyExpanded = modalExpandedRows.value[index]
    Object.keys(modalExpandedRows.value).forEach(key => {
        modalExpandedRows.value[key] = false
    })
    if (!isCurrentlyExpanded) {
        modalExpandedRows.value[index] = true
    }

    if (target && scrollContainer && scrollContainer.scrollBy) {
        await nextTick()
        const newTop = target.getBoundingClientRect().top
        const diff = newTop - originalTop
        if (diff !== 0) {
            scrollContainer.scrollBy({ top: diff, behavior: 'instant' })
        }
    }
}

const getProgressColor = (progress) => {
    if (progress >= 50) return '#00d28e'
    if (progress >= 25) return '#ffb74d'
    return '#fb7554'
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }

path { transition: stroke-dashoffset 1s ease-in-out; }

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
