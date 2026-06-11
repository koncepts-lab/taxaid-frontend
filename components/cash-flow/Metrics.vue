<template>
    <div class="flex flex-col xl:flex-row gap-6 mb-8 items-stretch xl:items-end w-full"> 
        <!-- Cash in Hand Card -->
        <div class="w-full xl:flex-1 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 group hover:shadow-lg"
            :class="isDark ? 'bg-[#003A2ECC]' : 'bg-[#fff] text-black'">
            
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <img src="/images/icons/Cash-in-Hand.svg" alt="Cash" class="w-[15px] h-auto object-contain" :class="{ 'invert brightness-0 invert-[1]': isDark }" />
                    <span class="text-xs font-normal" :class="isDark ? 'text-white/70' : 'text-[#595959]'">{{ currentLang === 'ar' ? 'النقد في اليد' : 'Cash in Hand' }}</span>
                </div>
            </div>

            <div class="flex items-end gap-3 mt-0">
                <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ cashInHand }}</h2>
                <div class="flex flex-col items-end mb-1 ml-auto">
                    <div class="flex items-center gap-1 text-[#32c465] font-medium">
                        <img src="/images/icons/up.svg" alt="Up" class="w-4 h-4 object-contain">
                        <span class="text-sm">({{ cashInHandChange }})</span>
                    </div>
                    <span class="text-xs" :class="isDark ? 'text-white/50' : 'text-[#8C8C8C]'">{{ currentLang === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month' }}</span>
                </div>
            </div>
            
            <div class="absolute inset-0 border-2 border-transparent hover:border-[#00D9A4] pointer-events-none transition-colors duration-300" :class="isCompressed ? 'rounded-[15px]' : 'rounded-3xl'"></div>
            <div class="absolute inset-0 border pointer-events-none opacity-100" :class="[isDark ? 'border-[#04C18F]' : 'border-2 border-[#00D9A4]', isCompressed ? 'rounded-[15px]' : 'rounded-3xl']"></div>
        </div>

        <div class="w-full xl:flex-1 p-6 relative overflow-hidden transition-all duration-300 group hover:shadow-lg"
            :class="[isDark ? 'bg-[#003A2ECC]' : 'bg-[#fff] text-black', isCompressed ? 'rounded-[15px]' : 'rounded-3xl']">
            
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <img src="/images/icons/AR-in-30-Days.svg" alt="Cash" class="w-[25px] h-auto object-contain" :class="{ 'invert brightness-0 invert-[1]': isDark }" />
                    <span class="text-xs font-normal" :class="isDark ? 'text-white/70' : 'text-[#595959]'">{{ currentLang === 'ar' ? 'الحسابات المستحقة خلال 30 يومًا' : 'AR in 30 Days' }}</span>
                </div>
            </div>

            <div class="flex items-end gap-3 mt-0">
                <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ ar30Days }}</h2>
                <div class="flex flex-col items-end mb-1 ml-auto">
                    <div class="flex items-center gap-1 text-[#FF6B6B] font-medium">
                        <img src="/images/icons/down-right.svg" alt="Down" class="w-4 h-4">
                        <span class="text-sm">({{ ar30DaysChange }})</span>
                    </div>
                    <span class="text-xs" :class="isDark ? 'text-white/50' : 'text-[#8C8C8C]'">{{ currentLang === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month' }}</span>
                </div>
            </div>

             <div class="absolute inset-0 border-2 border-transparent hover:border-[#00D9A4] pointer-events-none transition-colors duration-300" :class="isCompressed ? 'rounded-[15px]' : 'rounded-3xl'"></div>
             <div class="absolute inset-0 border pointer-events-none opacity-100" :class="[isDark ? 'border-[#04C18F]' : 'border-2 border-[#00D9A4]', isCompressed ? 'rounded-[15px]' : 'rounded-3xl']"></div>
        </div>

        <!-- Scenario Selector -->
        <div class="w-full xl:w-[320px] flex flex-col gap-4">
             <div class="relative">
                <button @click="showScenarioDropdown = !showScenarioDropdown"
                    class="w-full flex items-center justify-between border rounded-[10px] px-6 py-4 transition-all duration-300 hover:shadow-md"
                    :class="isDark ? 'bg-[#003A2ECC] text-white border-[#04C18F]' : 'bg-white text-black border-[#00D9A4]'">
                    <span class="text-sm font-normal">{{ selectedScenario }}</span>
                    <svg class="w-5 h-5 transition-transform duration-300" 
                        :class="[showScenarioDropdown ? 'rotate-180' : '', isDark ? 'text-white' : 'text-black']" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <Transition name="dropdown">
                    <div v-if="showScenarioDropdown"
                        class="absolute top-full left-0 w-full mt-2 rounded-[24px] shadow-xl z-20 p-2"
                        :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]' : 'bg-white border border-gray-100'">
                        <button v-for="scenario in scenarios" :key="scenario.en" 
                             @click="selectScenario(scenario)"
                             class="w-full text-left rtl:text-right px-6 py-3 text-sm transition-all duration-200 rounded-[10px] mb-1 last:mb-0 hover:bg-[#E0FFF6] hover:text-[#013E32]"
                             :class="[
                                 selectedScenarioKey === scenario.en 
                                    ? 'bg-[#E0FFF6] text-[#013E32] font-medium' 
                                    : (isDark ? 'text-white' : 'text-black')
                             ]">
                             {{ currentLang === 'ar' ? scenario.ar : scenario.en }}
                        </button>
                    </div>
                </Transition>
             </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isCompressed: {
        type: Boolean,
        default: false
    }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const showScenarioDropdown = ref(false)

const { metrics } = useCashFlow()

const cashInHand = computed(() => metrics.value?.cashInHand ?? 'AED 0.0 M')
const cashInHandChange = computed(() => metrics.value?.cashInHandChange ?? '0.0%')
const ar30Days = computed(() => metrics.value?.ar30Days ?? 'AED 0.0 M')
const ar30DaysChange = computed(() => metrics.value?.ar30DaysChange ?? '0.0%')

const scenarios = computed(() => metrics.value?.scenarios ?? [
    { en: '100% Scenario', ar: 'سيناريو 100%' },
    { en: 'Future Contract', ar: 'عقد مستقبلي' }
])

const selectedScenarioKey = ref('100% Scenario')

const selectedScenario = computed(() => {
    const scenario = scenarios.value.find(s => s.en === selectedScenarioKey.value)
    if (!scenario) return ''
    return currentLang.value === 'ar' ? scenario.ar : scenario.en
})

const selectScenario = (scenario) => {
    selectedScenarioKey.value = scenario.en
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
