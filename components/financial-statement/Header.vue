<template>
    <div :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" class="relative">
        <div class="container mx-auto">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">
                        {{ currentLang === 'ar' ? 'تحليل القوائم المالية' : 'Financial Statement Analysis' }}
                    </h1>
                    <p class="text-sm mt-1" :class="isDark ? 'text-white/80' : 'text-black/59'">
                        {{ currentLang === 'ar' ? 'نظرة عامة على الدخل والميزانية العمومية والنسب المالية.' :
                            'Income, balance sheet, and financial ratios overview.' }}
                    </p>
                </div>

                <div class="flex items-center gap-3 rtl:space-x-reverse">

                    <div class="relative" ref="dateDropdownRef">
                        <button @click="showDateDropdown = !showDateDropdown"
                            class="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 border rounded-lg transition-colors min-w-[160px] justify-between"
                            :class="isDark ? 'bg-primary-900 text-white hover:bg-white/10 border-primary-100' : 'bg-white border-primary-100 text-gray-700 hover:bg-teal-50'">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5" :class="isDark ? 'text-white' : 'text-black'" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-sm font-normal">{{ selectedPeriodLabel }}</span>
                            </div>
                            <svg class="w-4 h-4 transition-transform duration-200"
                                :class="[showDateDropdown ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/40']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <Transition name="dropdown">
                            <div v-if="showDateDropdown"
                                class="absolute mt-2 border rounded-lg shadow-lg z-50 py-2 px-2 min-w-[200px]" :class="[
                                    isDark ? 'bg-primary-900 border-primary-100 shadow-black/50' : 'bg-white border-primary-100',
                                    currentLang === 'ar' ? 'left-0' : 'right-0'
                                ]">
                                <div v-for="period in periods" :key="period" class="relative group">
                                    <button @click="selectPeriod(period)"
                                        class="w-full px-3 py-2 font-normal text-sm rounded-lg flex justify-between items-center transition-colors"
                                        :class="[
                                            currentLang === 'ar' ? 'text-right' : 'text-left',
                                            isDark ? 'text-white hover:bg-white/10' : 'hover:bg-primary-700',
                                            selectedPeriod === period ? (isDark ? 'bg-white/20 text-white' : 'bg-primary-700 text-black') : ''
                                        ]">
                                        <span>{{ getTranslatedPeriod(period) }}</span>
                                    </button>

                                    <div v-if="period === 'Custom Range' && selectedPeriod === 'Custom Range'"
                                        class="absolute top-0 z-60 shadow-2xl rounded-xl border overflow-hidden "
                                        :class="[
                                            currentLang === 'ar' ? 'left-full ml-2' : 'right-full mr-2',
                                            isDark ? 'border-primary-100 bg-primary-900' : 'border-primary-100 bg-white'
                                        ]">
                                        <div class="flex gap-4 justify-center">
                                            <div class="p-3" :class="isDark ? ' border-primary-100' : ''">
                                                <VDatePicker v-model="range.start" :is-dark="isDark"
                                                    :locale="currentLang === 'ar' ? 'ar' : 'en'" color="primary"
                                                    borderless :max-date="range.end || today"
                                                    :initial-page="prevMonthPage"
                                                    @update:model-value="emitDateChange" />
                                            </div>

                                            <div class="p-3">
                                                <VDatePicker v-model="range.end" :is-dark="isDark"
                                                    :locale="currentLang === 'ar' ? 'ar' : 'en'" color="primary"
                                                    borderless :min-date="range.start || undefined" :max-date="today"
                                                    :initial-page="currMonthPage"
                                                    @update:model-value="emitDateChange" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <button @click="emit('refresh')" class="p-2 border rounded-lg transition-colors"
                        :class="isDark ? 'bg-primary-900 border-primary-100 text-white hover:bg-white/10' : 'bg-white border-primary-100 text-gray-700 hover:bg-gray-50'">
                        <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5"
                            :class="isDark ? 'invert' : ''" />
                    </button>


                    <div class="relative" ref="exportDropdownRef">
                        <button @click="showExportDropdown = !showExportDropdown"
                            class="p-2 border rounded-lg transition-colors"
                            :class="isDark ? 'bg-primary-900 border-primary-100 text-white hover:bg-white/10' : 'bg-white border-primary-100 text-gray-700 hover:bg-gray-50'">
                            <img src="/images/icons/export.svg" alt="Export" class="w-5 h-5"
                                :class="isDark ? 'invert' : ''" />
                        </button>

                        <Transition name="dropdown">
                            <div v-if="showExportDropdown"
                                class="absolute mt-2 w-48 border rounded-lg shadow-lg z-50 py-2 px-2" :class="[
                                    isDark ? 'bg-primary-900 border-primary-100 shadow-black/50' : 'bg-white border-primary-100',
                                    currentLang === 'ar' ? 'left-0' : 'right-0'
                                ]">
                                <button @click="triggerExport('excel')"
                                    class="w-full px-4 py-2 text-xs rounded-lg flex items-center transition-colors"
                                    :class="[
                                        currentLang === 'ar' ? 'text-right' : 'text-left',
                                        isDark ? 'text-white hover:bg-white/10' : 'hover:bg-primary-700'
                                    ]">
                                    <span class="font-medium">{{ currentLang === 'ar' ? 'تصدير بصيغة إكسل (.xlsx)' :
                                        'Export as Excel (.xlsx)' }}</span>
                                </button>

                                <button @click="triggerExport('pdf')"
                                    class="w-full px-4 py-2 text-xs rounded-lg flex items-center transition-colors"
                                    :class="[
                                        currentLang === 'ar' ? 'text-right' : 'text-left',
                                        isDark ? 'text-white hover:bg-white/10' : 'hover:bg-primary-700'
                                    ]">
                                    <span class="font-medium">{{ currentLang === 'ar' ? 'تصدير بصيغة PDF (.pdf)' :
                                        'Export as PDF (.pdf)' }}</span>
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
import { format } from 'date-fns'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const emit = defineEmits(['export-excel', 'export-pdf', 'refresh', 'date-change'])

const currentLang = useState('currentLang', () => 'en')
const isDark = useTheme().isDark

const showExportDropdown = ref(false)
const showDateDropdown = ref(false)
const today = new Date();

const dateDropdownRef = ref(null)
const exportDropdownRef = ref(null)

const range = ref({ start: null, end: null })

const currMonthPage = ref({ month: today.getMonth() + 1, year: today.getFullYear() });
const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const prevMonthPage = ref({ month: prevMonthDate.getMonth() + 1, year: prevMonthDate.getFullYear() });

const selectedPeriod = ref('Year to Date')
const periods = ['Year to Date', 'Previous 3 Months', 'Previous 6 Months', 'Custom Range']

const periodTranslations = {
    'Year to Date': 'من بداية العام',
    'Previous 3 Months': 'آخر ٣ أشهر',
    'Previous 6 Months': 'آخر ٦ أشهر',
    'Custom Range': 'فترة مخصصة'
}

const getTranslatedPeriod = (period) => {
    return currentLang.value === 'ar' ? periodTranslations[period] : period
}

const selectedPeriodLabel = computed(() => {
    if (selectedPeriod.value === 'Custom Range') {
        if (!range.value.start || !range.value.end) return getTranslatedPeriod('Custom Range')
        return `${format(range.value.start, 'MMM dd')} - ${format(range.value.end, 'MMM dd, yy')}`
    }
    return getTranslatedPeriod(selectedPeriod.value)
})

const selectPeriod = (period) => {
    selectedPeriod.value = period
    if (period !== 'Custom Range') {
        showDateDropdown.value = false
        emit('date-change', { type: period })
    }
}

const emitDateChange = () => {
    if (range.value.start && range.value.end) {
        if (range.value.start > range.value.end) {
            const temp = range.value.start;
            range.value.start = range.value.end;
            range.value.end = temp;
        }
        emit('date-change', {
            type: 'Custom Range',
            start: format(range.value.start, 'yyyy-MM-dd'),
            end: format(range.value.end, 'yyyy-MM-dd')
        });
        setTimeout(() => { showDateDropdown.value = false; }, 300);
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

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})

const triggerExport = (type) => {
    if (type === 'excel') emit('export-excel')
    if (type === 'pdf') emit('export-pdf')
    showExportDropdown.value = false
}
</script>

<style>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.vc-header .vc-arrow.vc-opacity-0 {
    opacity: 1 !important;
    pointer-events: auto !important;
    visibility: visible !important;
    display: flex !important;
}

.vc-primary {
    --vc-accent-50: #f0fdfa !important;
    --vc-accent-100: #ccfbf1 !important;
    --vc-accent-500: #029F80 !important;
    --vc-accent-600: #0d9488 !important;
}

.dark .vc-container {
    background: transparent !important;
    border: none !important;
}

.dark .vc-primary {
    --vc-accent-50: rgba(2, 159, 128, 0.2) !important;
    --vc-accent-500: #029F80 !important;
    --vc-accent-600: #2dd4bf !important;
}

.vc-container {
    background: transparent !important;
}

.dark .vc-title,
.dark .vc-weekday,
.dark .vc-header .vc-arrow,
.dark .vc-nav-title,
.dark .vc-nav-arrow,
.dark .vc-nav-item {
    color: #ffffff !important;
}

.dark .vc-day-content:not(.vc-highlight-content-solid) {
    color: rgba(255, 255, 255, 0.9) !important;
}

.vc-highlight-content-solid {
    color: #ffffff !important;
    font-weight: 700 !important;
}

.vc-highlight-bg-light {
    background-color: var(--vc-accent-50) !important;
}

.dark .vc-day-content:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>