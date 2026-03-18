<template>
    <div class=" ">
        <div class="container mx-auto">
            <div class="flex items-center justify-between">
                <!-- Title Section -->
                <div class="flex items-center gap-4">
                    <button @click="useRouter().back()" class="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                        <img src="/images/icons/back.svg" class="w-6 h-6" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'rotate-180' : '']" />
                    </button>
                    <div>
                        <h1 class="text-2xl font-medium" :class="isDark ? 'text-white' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'نظرة عامة على المشاريع السكنية' : 'Residential Projects Overview' }}</h1>
                        <p class="text-sm mt-1" :class="isDark ? 'text-white' : 'text-black/59'">{{ currentLang === 'ar' ? 'تحليل مفصل للأداء والتفاصيل المالية' : 'Detailed performance and financial breakdown' }}</p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-3">

                    <!-- Date Filter -->
                    <div class="relative">
                        <button @click="showDateDropdown = !showDateDropdown"
                            class="flex items-center space-x-2 rtl:space-x-reverse px-4 h-[40px] rounded-lg border transition-colors"
                            :class="isDark ? 'bg-[#002E26] border-[#03D8B0] text-white' : 'bg-white border-[#03D8B0] text-black hover:bg-teal-50'">
                            <svg class="w-4 h-4" :class="isDark ? 'text-[#03D8B0]' : 'text-black/50'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm font-normal">{{ selectedPeriod }}</span>
                            <svg class="w-4 h-4 transition-transform duration-300" :class="[isDark ? 'text-[#03D8B0]' : 'text-black/50', showDateDropdown ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown -->
                        <Transition name="dropdown">
                            <div v-if="showDateDropdown"
                                class="absolute right-0 rtl:left-0 mt-2 border rounded-lg shadow-lg z-10 py-2 px-2 min-w-[160px]"
                                :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0]'">
                                <button v-for="period in periods" :key="period.en" @click="selectPeriod(period)"
                                    class="w-full text-left rtl:text-right px-4 py-3 font-normal text-sm rounded-lg transition-colors"
                                    :class="getDropdownItemClass(period)">
                                    {{ currentLang === 'ar' ? period.ar : period.en }}
                                </button>
                            </div>
                        </Transition>
                    </div>

                    <!-- Reload Button -->
                    <button
                        class="w-[40px] h-[40px] flex items-center justify-center border rounded-lg transition-colors"
                        :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0] hover:bg-gray-50'">
                        <img :src="isDark ? '/images/icons/reload.svg' : '/images/icons/reload.svg'" alt="Reload Icon" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
                    </button>

                    <!-- Export Button -->
                    <button
                        class="w-[40px] h-[40px] flex items-center justify-center border rounded-lg transition-colors"
                        :class="isDark ? 'bg-[#002E26] border-[#03D8B0]' : 'bg-white border-[#03D8B0] hover:bg-gray-50'">
                        <img :src="isDark ? '/images/icons/export.svg' : '/images/icons/export.svg'" alt="Export Icon" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const showDateDropdown = ref(false)

const periods = [
    { en: 'Year to Date', ar: 'منذ بداية العام' },
    { en: 'This Quarter', ar: 'هذا الربع' },
    { en: 'Last Quarter', ar: 'الربع الماضي' },
    { en: 'This Year', ar: 'هذه السنة' },
    { en: 'Last Year', ar: 'السنة الماضية' },
    { en: 'Custom Range', ar: 'نطاق مخصص' }
]

const selectedPeriodKey = ref('Year to Date')

const selectedPeriod = computed(() => {
    const period = periods.find(p => p.en === selectedPeriodKey.value)
    return currentLang.value === 'ar' ? period.ar : period.en
})

const selectPeriod = (period) => {
    selectedPeriodKey.value = period.en
    showDateDropdown.value = false
}

const getDropdownItemClass = (period) => {
    const isSelected = selectedPeriodKey.value === period.en
    if (isDark.value) {
        return isSelected 
            ? 'bg-[#00D9A4] text-black font-medium' 
            : 'text-white hover:bg-white/10'
    } else {
        return isSelected 
            ? 'bg-primary-700 text-black font-medium' 
            : 'text-black hover:bg-teal-50'
    }
}
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