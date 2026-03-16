<template>
    <div class=" ">
        <div class="mx-auto">
            <div class="flex lg:flex-row flex-col lg:items-center max-lg:gap-4 justify-between">
                <!-- Title Section -->
                <div>
                    <h1 class="text-2xl font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'المواعيد' : 'Appointments' }}</h1>
                    <p class="text-sm mt-1" :class="isDark ? 'text-white' : 'text-black/59'">{{ currentLang === 'ar' ? 'إدارة المراجعات الشهرية وطلب ساعات استشارية إضافية.' : 'Manage monthly reviews and request extra consultation hours.' }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-3">
                    <!-- Search Bar -->
                    <div class="relative">
                        <input type="text" 
                            :placeholder="currentLang === 'ar' ? 'بحث في المواعيد...' : 'Search Appointments...'"
                            class="pl-6 pr-12 h-[40px] rounded-[10px] border border-[#04C18F] focus:outline-none focus:ring-1 focus:ring-[#04C18F]/30 transition-all w-[346px] max-md:w-full"
                            :class="isDark ? 'bg-[#002E26] text-white placeholder:text-white/40' : 'bg-white text-[#111111]/60 placeholder:text-[#111111]/40'"
                        />
                        <svg class="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" :class="isDark ? 'text-white/40' : 'text-[#111111]/40'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <!-- Reload Button -->
                    <button
                        class="w-[40px] h-[40px] flex items-center justify-center border border-[#04C18F] rounded-[10px] transition-colors group cursor-pointer"
                        :class="isDark ? 'bg-[#002E26]' : 'bg-white hover:bg-gray-50'">
                        <img src="/images/icons/reload.svg" alt="Reload Icon" class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" :class="isDark ? 'invert' : ''" />
                    </button>

                    <!-- Schedule Button -->
                    <button
                        @click="isModalOpen = true"
                        class="h-[40px] px-6 flex items-center gap-2 rounded-[10px] bg-[#007B5B] text-white font-medium hover:bg-[#00664B] transition-colors shadow-sm whitespace-nowrap cursor-pointer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="text-sm">{{ currentLang === 'ar' ? 'جدولة موعد' : 'Schedule Appointment' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = useState('isScheduleModalOpen', () => false)
</script>

<style scoped>
</style>
