<template>
    <div class="container mx-auto">
        <div class="flex lg:flex-row flex-col items-start max-lg:gap-4 lg:items-center justify-between">

            <!-- TITLE & BACK SECTION -->
            <div class="flex items-center gap-4">
                <button @click="handleBack"
                    class="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                    <img src="/images/icons/back.svg" class="w-6 h-6"
                        :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'rotate-180' : '']" />
                </button>
                <div>
                    <h1 class="text-2xl font-medium" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                        {{ currentLang === 'ar' ? title?.ar : title?.en }}
                    </h1>
                    <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-black/50'">
                        {{ currentLang === 'ar' ? subtitle?.ar : subtitle?.en }}
                    </p>
                </div>
            </div>

            <!-- ACTION BUTTONS SECTION -->
            <div class="flex lg:flex-row flex-col lg:items-center items-start gap-3">
                <div class="flex gap-4">
                    <!-- One Click Summary -->
                    <button v-if="oneclickreview" @click="$emit('one-click-summary')"
                        class="flex items-center space-x-2 rtl:space-x-reverse px-4 h-[40px] rounded-lg border transition-all active:scale-95"
                        :class="isDark ? 'bg-[#002E26] border-[#03D8B0] text-white hover:bg-[#003d35]' : 'bg-white border-[#03D8B0] text-black hover:bg-teal-50'">
                        <svg class="w-4 h-4" :class="isDark ? 'text-[#03D8B0]' : 'text-teal-600'" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="lg:text-sm text-xs font-normal">{{ currentLang === 'ar' ? 'ملخص بنقرة واحدة' :
                            'One Click Summary' }}</span>
                    </button>

                    <!-- Date Filter -->
                    <div v-if="showDateFilter" class="relative" ref="dateDropdownRef">
                        <button @click="showDateDropdown = !showDateDropdown"
                            class="flex items-center space-x-2 rtl:space-x-reverse px-4 h-[40px] rounded-lg border transition-colors"
                            :class="isDark ? 'bg-[#002E26] border-[#03D8B0] text-white' : 'bg-white border-[#03D8B0] text-black hover:bg-teal-50'">
                            <svg class="w-4 h-4" :class="isDark ? 'text-[#03D8B0]' : 'text-black/50'" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="lg:text-sm text-xs font-normal">{{ selectedPeriodLabel }}</span>
                            <svg class="w-4 h-4 transition-transform duration-300"
                                :class="[isDark ? 'text-[#03D8B0]' : 'text-black/50', showDateDropdown ? 'rotate-180' : '']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown -->
                        <Transition name="dropdown">
                            <div v-if="showDateDropdown"
                                class="absolute right-0 rtl:left-0 mt-2 border rounded-lg shadow-lg z-50 py-2 px-2 min-w-[180px]"
                                :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0]'">
                                <div v-for="period in periods" :key="period.en" class="relative group">
                                    <button @click="selectPeriod(period)"
                                        class="w-full text-left rtl:text-right px-4 py-3 font-normal text-sm rounded-lg transition-colors"
                                        :class="getDropdownItemClass(period)">
                                        {{ currentLang === 'ar' ? period.ar : period.en }}
                                    </button>

                                    <div v-if="(period.en === 'Custom Range' || period.en === 'Custom Date') && selectedPeriodKey === period.en"
                                        class="absolute top-0 shadow-2xl rounded-xl border overflow-hidden z-[60] w-max"
                                        :class="[
                                            isDark ? 'border-[#03D8B0] bg-[#002E26]' : 'border-[#03D8B0] bg-white',
                                            currentLang === 'ar' ? 'left-full ml-2' : 'right-full mr-2'
                                        ]">

                                        <div v-if="selectedPeriodKey === 'Custom Range'"
                                            class="flex flex-col lg:flex-row">
                                            <div class="p-3">
                                                <VDatePicker v-model="range.start" :is-dark="isDark"
                                                    :locale="currentLang === 'ar' ? 'ar' : 'en'" color="primary"
                                                    borderless :max-date="range.end || today"
                                                    :initial-page="prevMonthPage"
                                                    @update:model-value="emitRangeChange" />
                                            </div>
                                            <div class="p-3 border-t lg:border-t-0 lg:border-l"
                                                :class="isDark ? 'border-white/10' : 'border-gray-100'">
                                                <VDatePicker v-model="range.end" :is-dark="isDark"
                                                    :locale="currentLang === 'ar' ? 'ar' : 'en'" color="primary"
                                                    borderless :min-date="range.start || undefined" :max-date="today"
                                                    :initial-page="currMonthPage"
                                                    @update:model-value="emitRangeChange" />
                                            </div>
                                        </div>

                                        <div v-else class="p-2">
                                            <VDatePicker v-model="singleDate" :is-dark="isDark"
                                                :locale="currentLang === 'ar' ? 'ar' : 'en'" color="primary" borderless
                                                :max-date="today" @update:model-value="handleSingleChange" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>


                <!-- Reload Button -->
                <div class="flex gap-4">

                    <button v-if="showReload" @click="handleReload"
                        class="w-[40px] h-[40px] flex items-center justify-center border rounded-lg transition-colors"
                        :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0] hover:bg-gray-50'">
                        <img :src="isDark ? '/images/icons/reload.svg' : '/images/icons/reload.svg'" alt="Reload Icon"
                            class="w-5 h-5" :class="isDark ? 'invert' : ''" />
                    </button>

                    <!-- Export Group -->
                    <div class="relative" v-if="showExport">
                        <button @click="showExportDropdown = !showExportDropdown"
                            class="w-[40px] h-[40px] flex items-center justify-center border rounded-lg transition-all"
                            :class="isDark ? 'bg-primary-900 border-primary-100' : 'bg-white border-[#03D8B0] hover:bg-gray-50'">
                            <img src="/images/icons/export.svg" alt="Export" class="w-5 h-5"
                                :class="isDark ? 'invert' : ''" />
                        </button>
                        <Transition name="dropdown">
                            <div v-if="showExportDropdown"
                                class="absolute mt-2 w-56 border rounded-lg shadow-lg z-[100] py-2 px-2"
                                :class="[isDark ? 'bg-primary-900 border-primary-100' : 'bg-white border-[#03D8B0]', currentLang === 'ar' ? 'left-0' : 'right-0']">
                                <button @click="triggerExport('excel')"
                                    class="w-full px-4 py-3 text-sm rounded-lg flex items-center hover:bg-teal-50 dark:hover:bg-white/10 text-black dark:text-white">
                                    {{ currentLang === 'ar' ? 'تصدير بصيغة إكسل (.xlsx)' : 'Export as Excel (.xlsx)' }}
                                </button>
                                <button @click="triggerExport('pdf')"
                                    class="w-full px-4 py-3 text-sm rounded-lg flex items-center hover:bg-teal-50 dark:hover:bg-white/10 text-black dark:text-white border-t border-gray-100 dark:border-white/5">
                                    {{ currentLang === 'ar' ? 'تصدير بصيغة PDF (.pdf)' : 'Export as PDF (.pdf)' }}
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { format, subMonths, startOfYear, startOfQuarter, subQuarters, subYears } from 'date-fns'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps({
    title: { type: Object, default: () => ({ en: 'Residential Projects Overview', ar: 'نظرة عامة على المشاريع السكنية' }) },
    subtitle: { type: Object, default: () => ({ en: 'Detailed performance breakdown', ar: 'تحليل مفصل للأداء والتفاصيل المالية' }) },
    oneclickreview: { type: Boolean, default: true },
    showDateFilter: { type: Boolean, default: true },
    showReload: { type: Boolean, default: true },
    showExport: { type: Boolean, default: true },
    periods: {
        type: Array,
        default: () => [
            { en: 'Year to Date', ar: 'منذ بداية العام' },
            { en: 'This Quarter', ar: 'هذا الربع' },
            { en: 'Last Quarter', ar: 'الربع الماضي' },
            { en: 'This Year', ar: 'هذه السنة' },
            { en: 'Last Year', ar: 'السنة الماضية' },
            { en: 'Custom Range', ar: 'نطاق مخصص' },
            { en: 'Custom Date', ar: 'تاريخ مخصص' }
        ]
    }
})

const emit = defineEmits(['selected-date', 'reload', 'export-excel', 'export-pdf', 'one-click-summary'])

const router = useRouter()
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

// UI States
const showDateDropdown = ref(false)
const showExportDropdown = ref(false)
const today = new Date()

const range = ref({ start: null, end: null })
const singleDate = ref(null)
const dateDropdownRef = ref(null)
const exportDropdownRef = ref(null)

// Calendar pages
const currMonthPage = ref({ month: today.getMonth() + 1, year: today.getFullYear() });
const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const prevMonthPage = ref({ month: prevMonthDate.getMonth() + 1, year: prevMonthDate.getFullYear() });

const selectedPeriodKey = ref(props.periods[0]?.en || 'Year to Date')

const selectedPeriodLabel = computed(() => {
    if (selectedPeriodKey.value === 'Custom Range') {
        if (!range.value.start || !range.value.end) return currentLang.value === 'ar' ? 'نطاق مخصص' : 'Custom Range'
        return `${format(range.value.start, 'MMM dd')} - ${format(range.value.end, 'MMM dd, yy')}`
    }
    if (selectedPeriodKey.value === 'Custom Date') {
        if (!singleDate.value) return currentLang.value === 'ar' ? 'تاريخ مخصص' : 'Custom Date'
        return format(singleDate.value, 'MMM dd, yyyy')
    }
    const period = props.periods.find(p => p.en === selectedPeriodKey.value) || props.periods[0]
    return currentLang.value === 'ar' ? period?.ar : period?.en
})

const resetToDefault = () => {
    if (props.periods.length > 0) {
        selectedPeriodKey.value = props.periods[0].en
    }
    range.value = { start: null, end: null }
    singleDate.value = null
    showDateDropdown.value = false
    showExportDropdown.value = false
}

const handleReload = () => {
    resetToDefault()
    emit('reload')
}

const triggerExport = (type) => {
    if (type === 'excel') emit('export-excel')
    if (type === 'pdf') emit('export-pdf')
    showExportDropdown.value = false
}

const selectPeriod = (period) => {
    selectedPeriodKey.value = period.en

    if (period.en !== 'Custom Range' && period.en !== 'Custom Date') {
        showDateDropdown.value = false
        let startDate = new Date()
        let endDate = new Date()

        if (period.en === 'Year to Date') startDate = startOfYear(today)
        else if (period.en === 'This Quarter') startDate = startOfQuarter(today)
        else if (period.en === 'Last Quarter') {
            startDate = startOfQuarter(subQuarters(today, 1))
            endDate = new Date(startOfQuarter(today).getTime() - 1)
        }
        else if (period.en === 'This Year') startDate = startOfYear(today)
        else if (period.en === 'Last Year') {
            startDate = startOfYear(subYears(today, 1))
            endDate = new Date(startOfYear(today).getTime() - 1)
        }

        emit('selected-date', {
            ...period,
            custom_from: format(startDate, 'dd-MM-yyyy'),
            custom_to: format(endDate, 'dd-MM-yyyy')
        })
    }
}

const emitRangeChange = () => {
    if (range.value.start && range.value.end) {
        emit('selected-date', {
            en: 'Custom Range',
            ar: 'نطاق مخصص',
            custom_from: format(range.value.start, 'dd-MM-yyyy'),
            custom_to: format(range.value.end, 'dd-MM-yyyy')
        });
        setTimeout(() => { showDateDropdown.value = false; }, 600);
    }
};

const handleSingleChange = (val) => {
    if (val) {
        emit('selected-date', {
            en: 'Custom Date',
            ar: 'تاريخ مخصص',
            custom_from: format(val, 'dd-MM-yyyy'),
            custom_to: null
        });
        setTimeout(() => { showDateDropdown.value = false; }, 600);
    }
};

const handleClickOutside = (event) => {
    if (dateDropdownRef.value && !dateDropdownRef.value.contains(event.target)) {
        showDateDropdown.value = false
    }
    if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target)) {
        showExportDropdown.value = false
    }
}

onMounted(() => { document.addEventListener('mousedown', handleClickOutside) })
onUnmounted(() => { document.removeEventListener('mousedown', handleClickOutside) })

// Helper for active dropdown styling
const getDropdownItemClass = (period) => {
    const isSelected = selectedPeriodKey.value === period.en
    if (isDark.value) {
        return isSelected
            ? 'bg-[#03D8B0] text-black font-medium'
            : 'text-white hover:bg-white/10'
    } else {
        return isSelected
            ? 'bg-[#03D8B0] text-black font-medium'
            : 'text-black hover:bg-teal-50'
    }
}

defineExpose({ resetToDefault })
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

:deep(.vc-header .vc-arrow.vc-opacity-0) {
    opacity: 1 !important;
    pointer-events: auto !important;
    visibility: visible !important;
    display: flex !important;
}

:deep(.vc-primary) {
    --vc-accent-50: #f0fdfa !important;
    --vc-accent-100: #ccfbf1 !important;
    --vc-accent-500: #029F80 !important;
    --vc-accent-600: #0d9488 !important;
}

:deep(.dark .vc-container) {
    background: transparent !important;
    border: none !important;
}
</style>

<!-- Example Usage: <template>
  <DashboardHeader 
    :title="{ en: 'My Title', ar: 'عنواني' }"
    :subtitle="{ en: 'My subtitle', ar: 'عنوان فرعي' }"
    :oneclickreview="true"
    :showExport="false"
    @selected-date="handleDateChange"
    @reload="fetchData"
    @export="exportData"
    @one-click-summary="showSummaryModal"
  />
</template> -->
