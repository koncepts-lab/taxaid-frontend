<template>
  <div class="min-h-screen w-full bg-[#f3f4f6] relative flex flex-col font-sans">
    
    <!-- HEADER -->
    <DashboardHeader userName="Admin User" userId="ADMIN-001" :showChangeProfile="true" />

    <!-- CONTENT -->
    <main class="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full">
      <!-- Header Text -->
      <div class="text-center mb-10 mt-[-50px]">
        <h1 class="text-[30px] font-normal text-[#1a1a1a] mb-2">Select Dashboard</h1>
        <p class="text-[18px] text-[#00000080] font-normal">Choose which dashboard you'd like to access</p>
      </div>

      <!-- Cards Container -->
      <div class="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">

        <!-- Card 1: Ticketing System -->
        <DashboardCard
          icon="/images/icons/Ticketing-System.svg"
          title="Ticketing System"
          description="Manage customer support tickets, track issues, and monitor resolution times"
          buttonLabel="Access Ticketing Dashboard"
        />

        <!-- Card 2: Revenue Partnership -->
        <DashboardCard
          icon="/images/icons/Revenue-Partnership.svg"
          title="Revenue Partnership"
          description="Track revenue, manage partners, analyze costs, and monitor financial metrics"
          buttonLabel="Access Revenue Dashboard"
          @click="navigateToRevenue"
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
definePageMeta({
  layout: false
})

function navigateToRevenue() {
  navigateTo('/select-dashboard/revenue-partnership')
}
</script>

<style scoped>
</style>
