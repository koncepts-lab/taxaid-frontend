<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Team Member Dashboard" userId="Welcome, Akhil" :showChangeProfile="true" :showManageAccess="true" changeProfileLink="/profile" />

  

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto" style="margin-top: -18px;">
      
      <!-- Page Title Row -->
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
          <img src="/images/icons/back.svg" class="w-6 h-6" :class="isDark ? 'invert' : ''" alt="back" />
        </button>
        <div class="space-y-1">
          <h1 class="text-[24px] font-semibold text-[#013E32]" :class="isDark ? 'text-[#10FFD4]' : ''">Activity Log History</h1>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">View your past daily activity logs</p>
        </div>
      </div>

      <!-- Toolbar Row -->
      <div class="flex items-center gap-6 py-2">
        <!-- Date Navigator -->
        <div class="flex items-center gap-4">
          <!-- Prev Button -->
          <button class="w-[50px] h-[50px] bg-[#013E32] rounded-[10px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/images/icons/back.svg" class="w-5 h-5 invert" alt="prev" />
          </button>
          
          <!-- Date text -->
          <div class="flex items-center gap-3 px-6 h-[50px] bg-white rounded-[10px] border border-[#E5E5E5]" :class="isDark ? 'bg-white/5 border-white/10' : ''">
            <span class="text-[15px] font-normal text-[#1a1a1a] whitespace-nowrap" :class="isDark ? 'text-white' : ''">{{ activeDate }}</span>
            <img src="/images/icons/calendar-black.svg" class="w-5 h-5 opacity-60" :class="isDark ? 'invert' : 'brightness-0'" alt="calendar" />
          </div>

          <!-- Next Button -->
          <button class="w-[50px] h-[50px] bg-[#82B1A8] rounded-[10px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/images/icons/back.svg" class="w-5 h-5 invert rotate-180" alt="next" />
          </button>
        </div>

        <!-- Today Button -->
        <button class="px-7 h-[46px] rounded-[10px] border border-[#04C18F66] bg-white text-[15px] font-normal text-[#1a1a1a] hover:border-[#04C18F] transition-colors cursor-pointer"
                :class="isDark ? 'bg-white/5 text-white border-white/20' : ''">
          Today
        </button>
      </div>

      <!-- Summary Metrics Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Card 1: Total Hrs -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5]'" 
             class="rounded-[16px] p-7 border shadow-sm space-y-6 flex flex-col justify-between h-[180px]">
          <div class="flex justify-between items-start">
            <h5 class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white/70' : 'text-[#6B7280]'">Total Hrs</h5>
            <img src="/images/icons/Average-Hours.svg" alt="clock" class="w-5 h-5 opacity-70" :class="isDark ? 'invert' : 'brightness-0'" />
          </div>
          <div class="space-y-1">
            <h2 class="text-[30px] font-normal leading-tight text-[#1a1a1a]" :class="isDark ? 'text-white' : ''">8 hrs 36 min</h2>
            <p class="text-[13px] opacity-60 text-[#6B7280]" :class="isDark ? 'text-white/60' : ''">Productive Time</p>
          </div>
        </div>

        <!-- Card 2: Appointments -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5]'" 
             class="rounded-[16px] p-7 border shadow-sm space-y-6 flex flex-col justify-between h-[180px]">
          <div class="flex justify-between items-start">
            <h5 class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white/70' : 'text-[#6B7280]'">Appointments</h5>
            <img src="/images/icons/calendar-black.svg" alt="calendar" class="w-5 h-5 opacity-70" :class="isDark ? 'invert' : 'brightness-0'" />
          </div>
          <div class="space-y-1">
            <h2 class="text-[30px] font-normal leading-tight text-[#1a1a1a]" :class="isDark ? 'text-white' : ''">2</h2>
            <p class="text-[13px] opacity-60 text-[#6B7280]" :class="isDark ? 'text-white/60' : ''">1 Client Fixed . 1 Client Review</p>
          </div>
        </div>

        <!-- Card 3: Internal -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5]'" 
             class="rounded-[16px] p-7 border shadow-sm space-y-6 flex flex-col justify-between h-[180px]">
          <div class="flex justify-between items-start">
            <h5 class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white/70' : 'text-[#6B7280]'">Internal</h5>
            <img src="/images/icons/Icon-profile.svg" alt="profile" class="w-5 h-5 opacity-70" :class="isDark ? 'invert' : 'brightness-0'" />
          </div>
          <div class="space-y-1">
            <h2 class="text-[30px] font-normal leading-tight text-[#1a1a1a]" :class="isDark ? 'text-white' : ''">1</h2>
            <p class="text-[13px] opacity-60 text-[#6B7280]" :class="isDark ? 'text-white/60' : ''">Internal meetings</p>
          </div>
        </div>

      </div>

      <!-- Daily Activity Tracker Card -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#F0F0F0]'" 
           class="rounded-[15px] border shadow-sm overflow-hidden flex flex-col">
        
        <div class="p-8 pb-5 flex justify-between items-center">
          <h3 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ activeDate }}</h3>
          <span class="text-[14px] font-normal opacity-60">3 Activities</span>
        </div>

        <div class="px-5 pb-8 flex-1">
          <div class="overflow-hidden rounded-[4px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#00896F] text-white">
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Time In</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Time Out</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Type of Appointment</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Client Id</th>
                  <th class="py-4 px-6 font-normal text-[14px] whitespace-nowrap">Client Name</th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-[#F0F0F0]'">
                <tr v-for="i in 3" :key="i" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/30'">
                  <td class="py-5 px-6 text-[14px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">1:24:23 PM</td>
                  <td class="py-5 px-6 text-[14px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">1:24:23 PM</td>
                  <td class="py-5 px-6 text-[14px] font-normal">
                    <span class="px-4 py-1.5 rounded-full bg-[#f3f4f6b3] text-black text-[12px] font-medium" 
                          :class="isDark ? 'bg-white/10 text-white/90' : ''">
                      Client Review
                    </span>
                  </td>
                  <td class="py-5 px-6 text-[14px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">C002</td>
                  <td class="py-5 px-6 text-[14px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Beta Industries</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Hours Summary Bar -->
          <div class="mt-8 mx-1">
            <div class="bg-[#FDC70029] p-5 px-8 flex justify-between items-center rounded-[10px] border border-[#D08700]" 
                 :class="isDark ? 'bg-yellow-900/20 border-yellow-700/30' : ''">
              <span class="text-[16px] font-medium text-[#0A0A0A]" :class="isDark ? 'text-white/90' : ''">Total hours logged:</span>
              <span class="text-[20px] font-bold text-[#0A0A0A]" :class="isDark ? 'text-white' : ''">2 hrs 0 min</span>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isDark } = useTheme()

const activeDate = ref('Thursday, 12 Feb 2026')

</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
</style>
