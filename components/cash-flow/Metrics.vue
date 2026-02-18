<template>
    <div class="flex flex-col xl:flex-row gap-6 mb-8">
        <!-- Cash in Hand Card -->
        <div class="flex-1 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group hover:shadow-lg"
            :class="isDark ? 'bg-[#D9D9D9] text-black' : 'bg-[#fff] text-black'">
            
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <img src="/images/icons/Cash-in-Hand.svg" alt="Cash" class="w-[20px] h-auto object-contain" />
                    <span class="text-[#595959] text-lg font-normal">{{ currentLang === 'ar' ? 'النقد في اليد' : 'Cash in Hand' }}</span>
                </div>
            </div>

            <div class="flex items-end gap-3 mt-6">
                <h2 class="text-xl font-semibold text-[#013E32]">AED 3.45 M</h2>
                <div class="flex flex-col items-end mb-1 ml-auto">
                    <div class="flex items-center gap-1 text-[#00D9A4] font-medium">
                        <img src="/images/icons/up.svg" alt="Up" class="w-4 h-4 object-contain">
                        <span>(+4.2%)</span>
                    </div>
                    <span class="text-[#8C8C8C] text-sm">{{ currentLang === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month' }}</span>
                </div>
            </div>
            
            <!-- Green Border Effect on Hover or Active -->
            <div class="absolute inset-0 border-2 border-transparent hover:border-[#00D9A4] rounded-3xl pointer-events-none transition-colors duration-300"></div>
            <div class="absolute inset-0 border-2 border-[#00D9A4] rounded-3xl pointer-events-none opacity-100"></div>
        </div>

        <!-- AR in 30 Days Card -->
        <div class="flex-1 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group hover:shadow-lg"
            :class="isDark ? 'bg-[#D9D9D9] text-black' : 'bg-[#fff] text-black'">
            
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <img src="/images/icons/AR-in-30-Days.svg" alt="Cash" class="w-[30px] h-auto object-contain" />
                    <span class="text-[#595959] text-lg font-normal">{{ currentLang === 'ar' ? 'الحسابات المستحقة خلال 30 يومًا' : 'AR in 30 Days' }}</span>
                </div>
            </div>

            <div class="flex items-end gap-3 mt-6">
                <h2 class="text-xl font-semibold text-[#013E32]">AED 2.95 M</h2>
                <div class="flex flex-col items-end mb-1 ml-auto">
                    <div class="flex items-center gap-1 text-[#FF6B6B] font-medium">
                        <img src="/images/icons/down-right.svg" alt="Down" class="w-4 h-4">
                        <span>(-3.1%)</span>
                    </div>
                    <span class="text-[#8C8C8C] text-sm">{{ currentLang === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month' }}</span>
                </div>
            </div>

             <!-- Green Border Effect on Hover or Active -->
             <div class="absolute inset-0 border-2 border-transparent hover:border-[#00D9A4] rounded-3xl pointer-events-none transition-colors duration-300"></div>
             <div class="absolute inset-0 border-2 border-[#00D9A4] rounded-3xl pointer-events-none opacity-100"></div>
        </div>

        <!-- Scenario Selector -->
        <div class="w-full xl:w-[320px] flex flex-col gap-4">
             <div class="relative">
                <button @click="showScenarioDropdown = !showScenarioDropdown"
                    class="w-full flex items-center justify-between bg-white border border-[#00D9A4] rounded-2xl px-6 py-4 transition-all duration-300 hover:shadow-md"
                    :class="isDark ? 'bg-[#002E26] text-white border-[#03D8B0]' : 'bg-white text-black'">
                    <span class="text-lg font-normal">{{ selectedScenario }}</span>
                    <svg class="w-5 h-5 transition-transform duration-300" 
                        :class="[showScenarioDropdown ? 'rotate-180' : '']" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <Transition name="dropdown">
                    <div v-if="showScenarioDropdown"
                        class="absolute top-full left-0 w-full mt-2 rounded-2xl shadow-xl z-20 overflow-hidden"
                         :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]' : 'bg-white border border-gray-100'">
                        <button v-for="scenario in scenarios" :key="scenario" 
                             @click="selectScenario(scenario)"
                             class="w-full text-left rtl:text-right px-6 py-4 text-sm transition-colors hover:bg-[#E6F9F5] dark:hover:bg-[#00453A]"
                             :class="selectedScenario === scenario ? 'bg-[#E6F9F5] dark:bg-[#00453A] font-medium text-[#00D9A4]' : ''">
                             {{ scenario }}
                        </button>
                    </div>
                </Transition>
             </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const showScenarioDropdown = ref(false)
const selectedScenario = ref('100% Scenario')

const scenarios = [
    '100% Scenario',
    'Future Contract'
]

const selectScenario = (scenario) => {
    selectedScenario.value = scenario
    showScenarioDropdown.value = false
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
