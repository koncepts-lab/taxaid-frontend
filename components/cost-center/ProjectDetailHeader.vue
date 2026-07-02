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
                    <!-- Date Filter Dropdown -->
                    <div v-if="showDateFilter" class="relative">
                        <button @click="showDateDropdown = !showDateDropdown"
                            class="flex items-center space-x-2 rtl:space-x-reverse px-4 h-[40px] rounded-lg border transition-all"
                            :class="isDark ? 'bg-[#002E26] border-[#03D8B0] text-white' : 'bg-white border-[#03D8B0] text-black hover:bg-teal-50'">
                            <svg class="w-4 h-4" :class="isDark ? 'text-[#03D8B0]' : 'text-black/50'" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="lg:text-sm text-xs font-normal">{{ selectedPeriodLabel }}</span>
                            <svg class="w-4 h-4 transition-transform duration-300"
                                :class="showDateDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <Transition name="dropdown">
                            <div v-if="showDateDropdown"
                                class="absolute right-0 rtl:left-0 mt-2 border rounded-lg shadow-lg z-[100] py-2 px-2 min-w-[180px]"
                                :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0]'">
                                <button v-for="period in periods" :key="period.en" @click="selectPeriod(period)"
                                    class="w-full text-left rtl:text-right px-4 py-3 font-normal text-sm rounded-lg transition-colors"
                                    :class="getDropdownItemClass(period)">
                                    {{ currentLang === 'ar' ? period.ar : period.en }}
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>

                <div class="flex gap-4">
                    <!-- Reload Button (Triggers local reset + emit) -->
                    <button v-if="showReload" @click="handleReload"
                        class="w-[40px] h-[40px] flex items-center justify-center border rounded-lg transition-all active:rotate-180"
                        :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0] hover:bg-gray-50'">
                        <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5"
                            :class="isDark ? 'invert' : ''" />
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
                                    class="w-full px-4 py-3 text-sm rounded-lg flex items-center hover:bg-teal-50  text-black ">
                                    {{ currentLang === 'ar' ? 'تصدير بصيغة إكسل (.xlsx)' : 'Export as Excel (.xlsx)' }}
                                </button>
                                <button @click="triggerExport('pdf')"
                                    class="w-full px-4 py-3 text-sm rounded-lg flex items-center hover:bg-teal-50  text-black  border-t border-gray-100 dark:border-white/5">
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
import { ref, computed } from 'vue'
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
            { en: 'Custom Range', ar: 'نطاق مخصص' }
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
const selectedPeriodKey = ref(props.periods[0]?.en || 'Year to Date')

// Computed Label for the button
const selectedPeriodLabel = computed(() => {
    const period = props.periods.find(p => p.en === selectedPeriodKey.value) || props.periods[0]
    return currentLang.value === 'ar' ? period?.ar : period?.en
})

// --- FUNCTIONS ---

const handleBack = () => router.push('/cost-center')

const selectPeriod = (period) => {
    selectedPeriodKey.value = period.en
    showDateDropdown.value = false
    emit('selected-date', period)
}

const handleReload = () => {
    resetToDefault()
    emit('reload')
}

const resetToDefault = () => {
    if (props.periods.length > 0) {
        selectedPeriodKey.value = props.periods[0].en
    }
    showDateDropdown.value = false
    showExportDropdown.value = false
}

const triggerExport = (type) => {
    if (type === 'excel') emit('export-excel')
    if (type === 'pdf') emit('export-pdf')
    showExportDropdown.value = false
}

// Helper for active dropdown styling
const getDropdownItemClass = (period) => {
    const isSelected = selectedPeriodKey.value === period.en
    if (isDark.value) {
        return isSelected ? 'bg-[#00D9A4] text-black font-medium' : 'text-white hover:bg-white/10'
    }
    return isSelected ? 'bg-primary-700 text-black font-medium' : 'text-black hover:bg-teal-50'
}

// Expose reset method so Parent (index.vue) can call it if needed
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
</style>