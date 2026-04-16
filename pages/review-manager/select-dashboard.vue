<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Review Manager" userId="Welcome, Akhil" :showChangeProfile="true" />

    <!-- CONTENT -->
    <main class="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full">
      <!-- Header Text -->
      <div class="text-center mb-10 mt-[-50px]">
        <h1 class="text-[30px] font-normal mb-2" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Select Dashboard</h1>
        <p class="text-[18px] font-normal" :class="isDark ? 'text-white/70' : 'text-[#00000080]'">Choose which dashboard you'd like to access</p>
      </div>

      <!-- Cards Container -->
      <div class="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">

        <!-- Card 1: Ticketing System -->
        <SelectDashboardCard
          icon="/images/icons/Ticketing-System.svg"
          title="Ticketing System"
          description="Review and approve tickets raised by the team, track progress, and manage development priorities."
          buttonLabel="Access Ticketing Dashboard"
        />

        <!-- Card 2: Review Dashboard -->
        <SelectDashboardCard
          icon="/images/icons/Revenue-Partnership.svg"
          title="Review Dashboard"
          description="Monitor consultant productivity, track client review progress, and manage workload across your team."
          buttonLabel="Access Review Dashboard"
          @click="navigateToDashboard"
        />

      </div>
    </main>

    <!-- Page Footer (Relative to screen) -->
    <div class="fixed bottom-6 left-6 text-[#999] text-[13px] font-normal z-0 hidden md:block">
      Copyright Reserved @2025
    </div>
    <div class="fixed bottom-6 right-6 text-[#999] text-[13px] font-normal z-0 hidden md:block">
      Last Sync: 19 Oct 2025, 10:45 AM IST
    </div>
  </div>
</template>

<script setup>
const { isDark } = useTheme()

definePageMeta({
  layout: false
})

import SelectDashboardCard from '@/components/revenue-partnership/SelectDashboardCard.vue'

function navigateToDashboard() {
  navigateTo('/review-manager/dashboard')
}
</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
</style>

