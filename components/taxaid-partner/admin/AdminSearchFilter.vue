<template>
  <div :class="isDark ? 'bg-[#1b5e502e] border-[#04C18F80]' : 'bg-[#E4FFF6B0] border-[#00BE8CBD]'" class="flex items-center gap-4 rounded-[16px] p-4 border transition-all duration-300">
    <!-- Search Input -->
    <div class="relative w-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" :class="isDark ? 'text-white/40' : 'text-[#00000040]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search by company name, customer code, or source..."
        class="w-full h-[44px] border rounded-[8px] pl-12 pr-4 text-[14px] placeholder:text-gray-400 focus:outline-none transition-all"
        :class="isDark ? 'bg-white/5 text-white border-white/10' : 'bg-white border-[#00BE8CBD] text-[#1a1a1a]'"
      />
    </div>

    <!-- Status Filter -->
    <div class="relative w-[300px] flex-shrink-0 z-20">
      <!-- Filter Icon Overlay -->
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] pointer-events-none" :class="isDark ? 'text-white/60' : 'text-[#00000060]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>

      <!-- Dropdown Trigger Button -->
      <div @click="isStatusDropdownOpen = !isStatusDropdownOpen"
           class="w-full h-[44px] rounded-[12px] pl-10 pr-4 text-[14px] flex items-center justify-center cursor-pointer transition-all border outline-none font-medium"
           :class="isStatusDropdownOpen 
              ? (isDark ? 'border-[#00BE8CBD] bg-[#001410] shadow-[0_0_0_1px_#00BE8CBD]' : 'border-[#00BE8CBD] bg-white shadow-[0_0_0_2px_rgba(0,190,140,0.1)]') 
              : (isDark ? 'border-[#00BE8CBD] bg-transparent text-white' : 'border-[#00BE8CBD] bg-white text-[#1a1a1a]')">
        <span class="flex-1 text-center font-medium">{{ selectedStatus }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-transform duration-200" :class="[{ 'rotate-180': isStatusDropdownOpen }, isDark ? 'text-[#00BE8CBD]' : 'text-[#00000060]']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Dropdown Menu -->
      <transition name="fade-slide">
        <div v-if="isStatusDropdownOpen"
             :class="isDark ? 'bg-[#001410] border-[#00BE8CBD]' : 'bg-white border-[#E5E7EB]'"
             class="absolute top-[calc(100%+8px)] left-0 right-0 border rounded-[16px] shadow-xl py-2 px-2 flex flex-col gap-1.5 z-30">
          <button v-for="status in ['All Statuses', 'Partners', 'Direct Customers']" :key="status"
                  @click="selectedStatus = status; isStatusDropdownOpen = false"
                  class="w-full text-left px-4 py-2.5 rounded-[12px] text-[14px] transition-all font-medium"
                  :class="selectedStatus === status 
                    ? (isDark ? 'bg-[#00BE8CBD] text-white' : 'bg-[#E4FFF6] text-[#1a1a1a]') 
                    : (isDark ? 'bg-transparent text-white hover:bg-white/5' : 'bg-transparent text-[#1a1a1a] hover:bg-gray-50')">
            {{ status }}
          </button>
        </div>
      </transition>
    </div>

    <!-- Export Button -->
    <button class="h-[44px] w-[200px] flex-shrink-0 flex items-center justify-center gap-2 px-5 rounded-[8px] text-[14px] font-medium border transition-all cursor-pointer shadow-sm"
            :class="isDark ? 'bg-[#1b5e502e] border-[#04C18F80] text-white hover:bg-[#1b5e5040]' : 'bg-[#9BFFEC] border-[#00BE8CBD] text-[#00614E] hover:bg-[#82FFE0]'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export to Excel
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { isDark } = useTheme()

const isStatusDropdownOpen = ref(false)
const selectedStatus = ref('All Statuses')
</script>
