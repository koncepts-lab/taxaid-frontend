<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300"
    :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <!-- HEADER -->
    <DashboardHeader userName="Admin User" userId="ADMIN-001" :showChangeProfile="true" />

    <!-- CONTENT -->
    <main class="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full">
      <!-- Header Text -->
      <div class="text-center mb-10 mt-[-50px]">
        <h1 class="text-[30px] font-normal mb-2" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Select Dashboard</h1>
        <p class="text-[18px] font-normal" :class="isDark ? 'text-white/70' : 'text-[#00000080]'">Choose which dashboard
          you'd like to access</p>
      </div>

      <!-- Cards Container -->
      <div class="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">

        <!-- Card 1: Ticketing System -->
        <SelectDashboardCard icon="/images/icons/Ticketing-System.svg" title="Ticketing System"
          description="Manage customer support tickets, track issues, and monitor resolution times"
          buttonLabel="Access Ticketing Dashboard" />

        <!-- Card 2: Revenue Partnership -->
        <SelectDashboardCard icon="/images/icons/Revenue-Partnership.svg" title="Revenue Partnership"
          description="Track revenue, manage partners, analyze costs, and monitor financial metrics"
          buttonLabel="Access Revenue Dashboard" @click="navigateToRevenue" />

      </div>
    </main>


  </div>
</template>

<script setup>
const { isDark } = useTheme()

definePageMeta({
  layout: false
})

import SelectDashboardCard from '@/components/revenue-partnership/SelectDashboardCard.vue'

function navigateToRevenue() {
  navigateTo('/revenue-partnership/admin')
}
</script>

<style scoped></style>
