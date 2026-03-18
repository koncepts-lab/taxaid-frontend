<template>
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <!-- Switcher -->
        <div class="flex items-center gap-0 p-1.5 rounded-[10px] transition-all"
            :class="isDark ? 'bg-[#001410] border border-[#03D8B0]/30' : 'bg-white border border-[#04C18F]/50 shadow-sm'">
            <button @click="activeView = 'calendar'"
                class="px-10 py-3 text-[14px] font-medium rounded-[10px] transition-all duration-200 cursor-pointer"
                :class="activeView === 'calendar'
                    ? (isDark ? 'bg-[#00FFBC] text-[#013e32]' : 'bg-[#016A56] text-white shadow-md')
                    : (isDark ? 'text-white/50 hover:text-white' : 'text-[#111111] hover:text-[#016A56]')">
                {{ currentLang === 'ar' ? 'عرض التقويم' : 'Calender View' }}
            </button>
            <button @click="activeView = 'table'"
                class="px-10 py-3 text-[14px] font-medium rounded-[10px] transition-all duration-200 cursor-pointer"
                :class="activeView === 'table'
                    ? (isDark ? 'bg-[#00FFBC] text-[#013e32]' : 'bg-[#016A56] text-white shadow-md')
                    : (isDark ? 'text-white/50 hover:text-white' : 'text-[#111111] hover:text-[#016A56]')">
                {{ currentLang === 'ar' ? 'عرض الجدول' : 'Table View' }}
            </button>
        </div>

        <!-- Filter -->
        <div class="relative min-w-[260px]">
            <button @click="showFilter = !showFilter"
                class="w-full flex items-center justify-between gap-3 px-4 py-3 text-[14px] font-medium rounded-[10px] border transition-all cursor-pointer"
                :class="isDark ? 'bg-[#001410] border-[#03D8B0]/30 text-white' : 'bg-white border-[#04C18F]/50 text-[#111111] shadow-sm'">
                <!-- Filter icon left -->
                <svg class="w-4 h-4 flex-shrink-0" :class="isDark ? 'text-white/40' : 'text-[#9CA3AF]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <!-- Centered label -->
                <span class="flex-1 text-center">{{ currentLang === 'ar' ? 'كل الحالات' : 'All Statuses' }}</span>
                <!-- Chevron right -->
                <svg class="w-4 h-4 flex-shrink-0 transition-transform duration-300" :class="[showFilter ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-[#9CA3AF]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <transition name="fade">
                <div v-if="showFilter" class="absolute top-full mt-2 w-full z-50 rounded-[14px] border shadow-lg overflow-hidden"
                    :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/20' : 'bg-white border-gray-100'">
                    <button v-for="(status, index) in statuses" :key="status"
                        @click="selectedStatus = status; showFilter = false"
                        class="w-full text-left px-5 py-3.5 text-[14px] font-normal transition-all cursor-pointer"
                        :class="[
                            index === 0
                                ? (isDark ? 'bg-[#00FFBC]/10 text-[#00FFBC]' : 'bg-[#D6F5ED] text-[#111111]')
                                : (isDark ? 'text-white/80 hover:bg-[#00FFBC]/5' : 'text-[#111111] hover:bg-gray-50')
                        ]">
                        {{ status }}
                    </button>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const activeView = useState('appointment_active_view', () => 'calendar')
const showFilter = ref(false)

const activeStatus = ref('All Statuses')
const statuses = ['All Statuses', 'Pending', 'Scheduled', 'Completed', 'Cancelled']
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
