<template>
    <div class="w-full transition-all duration-500 rounded-3xl">
        <div class="sticky top-0 z-20 py-5 lg:px-8 px-4 flex justify-between items-center rounded-t-3xl" :class="isDark ? 'bg-[#001813]' : 'bg-white'">
            <div>
                <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص التدفقات النقدية' : 'Cashflow Summary' }}</p>
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

        <div class="w-full max-w-full xl:overflow-visible overflow-x-auto custom-scrollbar relative min-h-[200px]">
            <CashFlowSummaryTable :is-compressed="isCompressed" />
        </div>
    </div>

    <!-- Fullscreen Modal -->
    <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div class="w-full rounded-xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px; max-height: 90vh;">
                <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                    <div class="flex flex-col">
                        <h2 class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص التدفقات النقدية' : 'Cashflow Summary' }}</h2>
                        <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}</p>
                    </div>
                    <button @click="isModalOpen = false" class="p-2 rounded-full transition-colors flex-shrink-0" :class="isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'">
                        <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                    </button>
                </div>

                <div class="w-full flex-1 overflow-auto custom-scrollbar" :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
                    <CashFlowSummaryTable />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isCompressed: Boolean
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
