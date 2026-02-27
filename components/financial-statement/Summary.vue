<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500 rounded-3xl"
        :class="isDark ? 'bg-[#00141050]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <div v-if="activeTab === 'schedules'" class="px-8 pb-8 flex gap-4 transition-all duration-500">
            <div class="flex-1 relative">
                <div @click="isOpenPL = !isOpenPL; isOpenBS = false"
                    class="w-full border rounded-lg py-3 px-4 text-sm flex justify-between items-center cursor-pointer transition-all"
                    :class="[
                        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-primary-650',
                        isOpenPL ? 'ring-1 ring-primary-750 border-primary-750' : ''
                    ]">
                    <span
                        :class="selectedPL ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/40' : 'text-black/40')">
                        {{ selectedPL || t.plPlaceholder }}
                    </span>
                    <svg class="w-4 h-4 transition-transform duration-300"
                        :class="[isOpenPL ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/40']" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div v-if="isOpenPL"
                    class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                    :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                    <div v-for="option in plOptions" :key="option" @click="selectedPL = option; isOpenPL = false"
                        class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                        :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                        {{ option }}
                    </div>
                </div>
            </div>

            <div class="flex-1 relative">
                <div @click="isOpenBS = !isOpenBS; isOpenPL = false"
                    class="w-full border rounded-lg py-3 px-4 text-sm flex justify-between items-center cursor-pointer transition-all"
                    :class="[
                        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-primary-650',
                        isOpenBS ? 'ring-1 ring-primary-750 border-primary-750' : ''
                    ]">
                    <span
                        :class="selectedBS ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/40' : 'text-black/40')">
                        {{ selectedBS || t.bsPlaceholder }}
                    </span>
                    <svg class="w-4 h-4 transition-transform duration-300"
                        :class="[isOpenBS ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/40']" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div v-if="isOpenBS"
                    class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                    :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                    <div v-for="option in bsOptions" :key="option" @click="selectedBS = option; isOpenBS = false"
                        class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                        :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                        {{ option }}
                    </div>
                </div>
            </div>
        </div>

        <div class="py-6 px-8 flex justify-between items-center transition-all duration-500"
            :class="isDark ? 'bg-[#00141050]' : 'bg-white'">
            <div>
                <p class="text-base font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">{{ translatedTitle
                }}</p>
                <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-black/59'">{{ t.valuesIn }}
                </p>
            </div>

            <div class="flex items-center gap-4">
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div v-if="isOpenRatio"
                        class="absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto no-scrollbar"
                        :class="isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'">
                        <div v-for="option in ratioOptions" :key="option"
                            @click="selectedRatio = option; isOpenRatio = false"
                            class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                            :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                            {{ option }}
                        </div>
                    </div>
                </div>
                <button @click="isModalOpen = true" v-if="isCompressed">
                    <img src="/images/icons/expand-dark.svg" alt="Expand" class="w-5 h-5"
                        :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                </button>
                <CommonTooltip :text="currentLang === 'ar' ? 'اسأل عقيل' : 'Ask Akeel'" position="top">
                    <button @click="handleInfoClick">
                        <img src="/images/icons/i.svg" class="w-5 h-5" />
                    </button>
                </CommonTooltip>
            </div>
        </div>

        <table class="w-full text-start border-collapse min-w-150">
            <thead class="text-white" :class="isDark ? 'bg-primary-1100' : 'bg-primary-750'">
                <tr>
                    <!-- DYNAMIC HEADER LOGIC -->
                    <template v-if="activeTab === 'ratios'">
                        <template v-if="selectedRatio === 'All Ratios'">
                            <th class="ps-8 py-4 font-medium text-sm text-start">{{ t.colRatioCat }}</th>
                            <th class="font-medium text-center text-sm px-4">{{ t.colMetric }}</th>
                        </template>
                        <template v-else>
                            <th colspan="2" class="ps-8 py-4 font-medium text-sm text-start">{{ t.colRatio }}</th>
                        </template>
                    </template>
                    <template v-else>
                        <th :class="isCompressed ? `ps-8 py-3` : `ps-8 py-4`" class="font-medium text-sm text-start">
                            {{ t.colRevenue }}
                        </th>
                        <th class="font-medium text-center text-sm px-4">
                            {{ t.colSchedule }}
                        </th>
                    </template>

                    <th class="font-medium text-center text-sm px-4">
                        <div class="flex items-center justify-center gap-1">
                            {{ t.colCurrent }}
                            <img src="/images/icons/current-year.svg" alt="Year Icon" class="w-4 h-4" />
                        </div>
                    </th>
                    <th class="font-medium text-center text-sm px-4">{{ t.colPrevious }}</th>

                    <!-- Hide Balance/Budget column only when "All Ratios" is selected -->
                    <th v-if="!(activeTab === 'ratios' && selectedRatio === 'All Ratios')"
                        class="font-medium text-center text-sm px-4">
                        {{ activeTab === 'ratios' ? t.colBalance : t.colBudget }}
                    </th>

                    <th class="font-medium text-center text-sm px-4">{{ t.colVariance }}</th>
                    <th class="font-medium text-center text-sm pe-8">{{ t.colYTG }}</th>
                </tr>
            </thead>
            <tbody>

                <template v-for="(row, i) in data" :key="i">
                    <tr v-if="row.isHeader" :class="isDark ? 'bg-primary-1050' : 'bg-primary-800'">
                        <td colspan="7" class="ps-8 py-3 font-medium text-start"
                            :class="isDark ? 'text-white/80' : 'text-primary-950'">{{ row.label }}</td>
                    </tr>
                    <tr v-else :class="[
                        row.isSummary ? (isDark ? 'bg-[#003d30] font-medium' : 'bg-primary-800 font-medium') : (isDark ? 'bg-[#002e26] border-b border-white/5' : 'bg-white border-b border-gray-50')
                    ]" class="transition-all duration-500">

                        <!-- DYNAMIC CELL LOGIC -->
                        <template v-if="activeTab === 'ratios'">
                            <template v-if="selectedRatio === 'All Ratios'">
                                <td class="ps-8 py-4 text-start text-sm"
                                    :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.category }}</td>
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
                                class="text-start text-sm">
                                {{ row.label }}
                            </td>
                            <td class="text-center">
                                <CommonTooltip :text="currentLang === 'ar' ? 'عرض الجدول' : 'View Schedule'"
                                    position="top">

                                    <span v-if="row.isSummary" class="text-sm"
                                        :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.metric }}</span>

                                    <button @click="handleSchedule(row)"
                                        v-else-if="row.schedule && row.schedule !== '-'"
                                        class="text-[#029F80] text-sm font-medium underline underline-offset-4 cursor-pointer">
                                        {{ row.schedule }}
                                    </button>
                                    <span v-else class="text-[#029F80]">-</span>
                                </CommonTooltip>
                            </td>
                        </template>

                        <td class="text-center px-4 text-sm"
                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                            {{ row.current }}</td>
                        <td class="text-center px-4 text-sm"
                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black']">
                            {{ row.previous }}</td>

                        <!-- Budget/Balance Cell -->
                        <td v-if="!(activeTab === 'ratios' && selectedRatio === 'All Ratios')"
                            class="text-center px-4 text-sm"
                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                            {{ row.budget }}</td>

                        <td class="text-center px-4">
                            <span dir="ltr" :class="[
                                (row.variance && String(row.variance).includes('-')) ? 'bg-red-50 text-red-500' : 'bg-[#E6F9F4] text-[#029F80]',
                                'px-2  rounded-full text-xs font-semibold  items-center justify-center leading-none'
                            ]">
                                {{ row.variance }}
                            </span>
                        </td>
                        <td class="pe-8 py-2">
                            <div class="flex justify-center items-end">
                                <div v-if="row.progress !== '-'"
                                    :class="[isCompressed ? 'w-14 h-8' : 'w-16 h-10', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                    class="relative transition-all duration-500">
                                    <svg class="w-full h-full" viewBox="0 0 36 22">
                                        <circle cx="18" cy="18" r="15" fill="none"
                                            :class="isDark ? 'stroke-white/10' : 'stroke-gray-100'" stroke-width="3"
                                            stroke-dasharray="47.1 94.2" transform="rotate(-180 18 18)"
                                            stroke-linecap="round" />
                                        <circle v-if="row.progress > 0" cx="18" cy="18" r="15" fill="none"
                                            :stroke="getProgressColor(row.progress)" stroke-width="3.5"
                                            stroke-dasharray="47.1 94.2"
                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                            transform="rotate(-180 18 18)" stroke-linecap="round"
                                            class="transition-all duration-1000" />
                                    </svg>
                                    <span
                                        :class="[isDark ? 'text-white/80' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                        class="absolute bottom-0 text-sm inset-x-0 flex items-center justify-center font-medium leading-none">
                                        {{ row.progress }}%
                                    </span>
                                </div>
                                <div v-else class="text-gray-400 text-xs">-</div>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div v-if="reportInfo?.current" class="px-8 py-6 text-sm transition-all duration-500"
            :class="isDark ? 'text-white/40' : 'text-black/50'">
            {{ currentLang === 'ar' ? 'تم إنشاء التقرير للفترة' : 'Report is generated for the period' }}
            <span class="font-medium">CY:</span> {{ reportInfo.current }}
            <span class="mx-2">|</span>
            <span class="font-medium">PY:</span> {{ reportInfo.previous }}
        </div>
        <FinancialStatementScheduleModal :isOpen="isScheduleModalOpen" :loading="isScheduleLoading"
            :data="scheduleDetails" :title="selectedMainGroup" :isDark="isDark" @close="isScheduleModalOpen = false"
            :schedule="selectedSchedule" />
        <Teleport to="body">
            <div v-if="isModalOpen"
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <div class="w-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">

                    <div class="flex justify-between items-center py-6 px-8">
                        <div>
                            <p class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">{{
                                translatedTitle }}</p>
                            <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-black/59'">{{
                                t.valuesIn }}</p>
                        </div>
                        <div class="flex items-center gap-4">
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
                                    <div v-for="option in ratioOptions" :key="option"
                                        @click="selectedRatio = option; isOpenRatio = false"
                                        class="px-4 py-3 text-sm cursor-pointer transition-colors text-start"
                                        :class="isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-[#E0FCF6]'">
                                        {{ option }}
                                    </div>
                                </div>
                            </div>
                            <button @click="isModalOpen = false">
                                <img src="/images/icons/expand.svg" alt="Close" class="w-5 h-5"
                                    :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                            </button>
                        </div>
                    </div>

                    <div class="overflow-auto no-scrollbar">
                        <table class="w-full text-start border-collapse">
                            <thead class="text-white" :class="isDark ? 'bg-primary-1100' : 'bg-primary-750'">
                                <tr>
                                    <!-- DYNAMIC HEADER LOGIC -->
                                    <template v-if="activeTab === 'ratios'">
                                        <template v-if="selectedRatio === 'All Ratios'">
                                            <th class="ps-8 py-4 font-medium text-sm text-start">{{ t.colRatioCat }}
                                            </th>
                                            <th class="font-medium text-center text-sm px-4">{{ t.colMetric }}</th>
                                        </template>
                                        <template v-else>
                                            <th colspan="2" class="ps-8 py-4 font-medium text-sm text-start">{{
                                                t.colRatio }}</th>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <th :class="isCompressed ? `ps-8 py-3` : `ps-8 py-4`"
                                            class="font-medium text-sm text-start">
                                            {{ t.colRevenue }}
                                        </th>
                                        <th class="font-medium text-center text-sm px-4">
                                            {{ t.colSchedule }}
                                        </th>
                                    </template>

                                    <th class="font-medium text-center text-sm px-4">
                                        <div class="flex items-center justify-center gap-1">
                                            {{ t.colCurrent }}
                                            <img src="/images/icons/current-year.svg" alt="Year Icon" class="w-4 h-4" />
                                        </div>
                                    </th>
                                    <th class="font-medium text-center text-sm px-4">{{ t.colPrevious }}</th>

                                    <!-- Hide Balance/Budget column only when "All Ratios" is selected -->
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
                                        <td colspan="6" class="ps-8 py-4 font-medium text-sm text-start"
                                            :class="isDark ? 'text-white/80' : 'text-primary-950'">{{ row.label }}</td>
                                    </tr>
                                    <tr v-else :class="[
                                        row.isSummary ? (isDark ? 'bg-[#003d30] font-medium' : 'bg-primary-800 font-medium') : (isDark ? 'bg-[#002e26] border-b border-white/5' : 'bg-white border-b border-gray-50')
                                    ]" class="transition-all duration-500">

                                        <!-- DYNAMIC CELL LOGIC -->
                                        <template v-if="activeTab === 'ratios'">
                                            <template v-if="selectedRatio === 'All Ratios'">
                                                <td class="ps-8 py-4 text-start text-sm"
                                                    :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.category
                                                    }}</td>
                                                <td class="text-center px-4 text-sm"
                                                    :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.label }}
                                                </td>
                                            </template>
                                            <template v-else>
                                                <td colspan="2" class="ps-8 py-4 text-start text-sm font-medium"
                                                    :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.label }}
                                                </td>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <td :class="[isCompressed ? 'ps-8 py-3' : 'ps-8 py-4', row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black/80']"
                                                class="text-start text-sm">
                                                {{ row.label }}
                                            </td>
                                            <td class="text-center">
                                                <span v-if="row.isSummary" class="text-sm"
                                                    :class="isDark ? 'text-white/80' : 'text-black/80'">{{ row.metric
                                                    }}</span>
                                                <button @click="handleSchedule(row)"
                                                    v-else-if="row.schedule && row.schedule !== '-'"
                                                    class="text-[#029F80] font-medium underline underline-offset-4 cursor-pointer text-sm">
                                                    {{ row.schedule }}
                                                </button>
                                                <span v-else class="text-[#029F80]">-</span>
                                            </td>
                                        </template>

                                        <td class="text-center px-4 text-sm"
                                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                                            {{ row.current }}</td>
                                        <td class="text-center px-4 text-sm"
                                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : 'text-black']">
                                            {{ row.previous }}</td>

                                        <!-- Budget/Balance Cell -->
                                        <td v-if="!(activeTab === 'ratios' && selectedRatio === 'All Ratios')"
                                            class="text-center px-4 text-sm"
                                            :class="[row.isSummary || row.isTotal ? 'font-medium' : 'font-normal', isDark ? 'text-white/80' : '']">
                                            {{ row.budget }}</td>

                                        <td class="text-center px-4">
                                            <span dir="ltr"
                                                :class="[row.variance?.includes('-') ? 'bg-red-50 text-red-500' : 'bg-[#E6F9F4] text-[#029F80]', 'px-2 py-0.5 rounded-full text-xs font-bold inline-block']">
                                                {{ row.variance }}
                                            </span>
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
                                                        <circle v-if="row.progress > 0" cx="18" cy="18" r="15"
                                                            fill="none" :stroke="getProgressColor(row.progress)"
                                                            stroke-width="3.5" stroke-dasharray="47.1 94.2"
                                                            :stroke-dashoffset="47.1 - (row.progress / 100) * 47.1"
                                                            transform="rotate(-180 18 18)" stroke-linecap="round"
                                                            class="transition-all duration-1000" />
                                                    </svg>
                                                    <span
                                                        :class="[isDark ? 'text-white/80' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']"
                                                        class="absolute bottom-0 text-[10px] inset-x-0 flex items-center justify-center font-bold leading-none">
                                                        {{ row.progress }}%
                                                    </span>
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
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    data: Array,
    isCompressed: Boolean,
    activeTab: String,
    filters: Object,
    reportInfo: Object

});
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase;
const isDark = useTheme().isDark
const currentLang = useState('currentLang', () => 'en')
const emit = defineEmits(['askAkeel', 'ratio-change']);


const t = computed(() => {
    return currentLang.value === 'ar' ? {
        plPlaceholder: 'اختر جدول الأرباح والخسائر',
        bsPlaceholder: 'اختر جدول الميزانية العمومية',
        ratioPlaceholder: 'اختر نوع النسبة',
        valuesIn: 'القيم بمليون درهم إماراتي',
        colRevenue: 'الإيرادات',
        colRatioCat: 'فئة النسبة',
        colSchedule: 'الجدول',
        colMetric: 'المقياس الأساسي',
        colCurrent: 'السنة الحالية',
        colPrevious: 'السنة السابقة',
        colBudget: 'الميزانية',
        colVariance: 'الانحراف',
        colYTG: 'المتبقي للسنة',
        titles: {
            schedules: 'ملخص الجداول المالية',
            balanceSheet: 'ملخص الميزانية العمومية',
            ratios: 'ملخص النسب المالية',
            profitLoss: 'ملخص الأرباح والخسائر'
        },
        colRatioCat: 'فئة النسبة',
        colMetric: 'المقياس الأساسي',
        colRatio: 'النسبة',
        colBalance: 'الميزانية',
    } : {
        plPlaceholder: 'Select Profit & Loss Schedule',
        bsPlaceholder: 'Select Balance Sheet Schedule',
        ratioPlaceholder: 'Select Ratio Type',
        valuesIn: 'Values in AED Million',
        colRevenue: 'Revenue',
        colRatioCat: 'Ratio Category',
        colSchedule: 'Schedule',
        colMetric: 'Key Metric',
        colCurrent: 'Current Year',
        colPrevious: 'Previous Year',
        colBudget: 'Budget',
        colVariance: 'Variance',
        colYTG: 'Year to Go',
        titles: {
            schedules: 'Financial Schedule Summary',
            balanceSheet: 'Balance Sheet Summary',
            ratios: 'Financial Ratios Summary',
            profitLoss: 'Profit & Loss Summary'
        },
        colRatioCat: 'Ratio Category',
        colMetric: 'Key Metric',
        colRatio: 'Ratio',
        colBalance: 'Balance',
    }
});

const translatedTitle = computed(() => {
    if (props.activeTab === 'ratios') {
        return selectedRatio.value === 'All Ratios'
            ? t.value.titles.ratios
            : `${selectedRatio.value} ${currentLang.value === 'ar' ? 'ملخص' : 'Summary'}`;
    }
    if (props.activeTab === 'schedules') return t.value.titles.schedules;
    if (props.activeTab === 'balance-sheet') return t.value.titles.balanceSheet;
    return t.value.titles.profitLoss;
});

// COMPONENT STATE
const isModalOpen = ref(false);
const isOpenPL = ref(false);
const isOpenBS = ref(false);
const isOpenRatio = ref(false);
const selectedPL = ref('');
const selectedBS = ref('');
const selectedRatio = ref('All Ratios');

const plOptions = [`Schedule 01 – Revenue`, `Schedule 02 – COGS`, `Schedule 03 – Operating Expenses`, `Schedule 04 – Other Income / Expense`, `Schedule 05 – Tax Expense`];
const bsOptions = [`Schedule S1 – Current Assets`, `Schedule S2 – Non-Current Assets`, `Schedule S3 – Current Liabilities`, `Schedule S4 – Non-Current Liabilities`, `Schedule S5 – Shareholders' Equity`];
const ratioOptions = [`All Ratios`, `Profitability Ratios`, `Liquidity Ratios`, `Valuation Ratios`, `Efficiency Ratios`, `Leverage Ratios`];

const getProgressColor = (progress) => {
    if (progress >= 75) return `#029F80`;
    if (progress >= 50) return `#FFBC01`;
    return `#FB7554`;
};

const handleInfoClick = () => {
    emit('askAkeel')
}
const isScheduleModalOpen = ref(false);
const isScheduleLoading = ref(false);
const scheduleDetails = ref([]);
const selectedMainGroup = ref('');
const selectedSchedule = ref('');

const handleSchedule = async (row) => {
    selectedMainGroup.value = row.label;
    selectedSchedule.value = row.schedule;
    isScheduleModalOpen.value = true;
    isScheduleLoading.value = true;

    try {

        const result = await $fetch(`${baseUrl}/financial-analysis/pl-subgroup-totals`, {
            method: 'POST',
            body: {
                "main_group": row.label,
                "range_option": props.filters.range_option,
                "custom_from": props.filters.custom_from,
                "custom_to": props.filters.custom_to
            }
        });

        if (result.status === "success") {
            // Using result.data as per your Postman screenshot

            scheduleDetails.value = result.data;
        }
    } catch (error) {
        console.error("API Error:", error);
    } finally {
        isScheduleLoading.value = false;
    }
};
watch(selectedRatio, (newVal) => {
    emit('ratio-change', newVal);
}, { immediate: true });
// Monitor and console log data specifically for Ratios
watch(() => props.data, (newData) => {
    console.log('--- Ratio Data Debug ---');
    console.log('Current Selected Ratio:', selectedRatio.value);
    console.log('Data Received:', props.data);
}
    , { deep: true, immediate: true });

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