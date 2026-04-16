<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader
      userName="Team Member Dashboard"
      userId="Welcome, Akhil"
      :showChangeProfile="true"
      :showManageAccess="true"
      changeProfileLink="/profile"
    />

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
          description="Raise tickets, track the status of your submissions, and stay updated on review and approval progress."
          buttonLabel="Access Ticketing Dashboard"
          @click="navigateToTicketing"
        />

        <!-- Card 2: Review Dashboard -->
        <SelectDashboardCard
          icon="/images/icons/Revenue-Partnership.svg"
          title="Review Dashboard"
          description="Log daily activity, manage client appointments, and track review progress across assigned projects."
          buttonLabel="Access Review Dashboard"
          @click="navigateToDashboard"
        />

      </div>
    </main>

    <!-- Page Footer -->
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
  navigateTo('/review-team-member/dashboard')
}

function navigateToTicketing() {
  navigateTo('/review-team-member/ticketing-dashboard')
}
</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
</style>
