<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Review Manager" userId="Welcome, Akhil" :showChangeProfile="true" />

    <!-- CONTENT -->
    <main class="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full">
      <!-- Header Text -->
      <div class="text-center mb-10 mt-[-50px]">
        <h1 class="text-[30px] font-normal mb-2" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ title }}</h1>
        <p class="text-[18px] font-normal" :class="isDark ? 'text-white/70' : 'text-[#00000080]'">{{ subtitle }}</p>
      </div>

      <!-- Cards Container -->
      <div class="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">

        <SelectDashboardCard
          v-for="card in cards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :buttonLabel="card.buttonLabel"
          @click="card.title === 'Review Dashboard' ? navigateToDashboard() : null"
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
import { useReviewManagerSelectDashboardPage } from '@/composables/useWebsiteData'

const { isDark } = useTheme()
const { title, subtitle, cards } = useReviewManagerSelectDashboardPage()


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

