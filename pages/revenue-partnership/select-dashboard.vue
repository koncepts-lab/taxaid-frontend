<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300"
    :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <!-- HEADER -->
    <DashboardHeader userName="Admin User" userId="ADMIN-001" :showChangeProfile="true" />

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
          :button-label="card.buttonLabel"
          @click="navigateToReview(card.route)"
        />
      </div>
    </main>


  </div>
</template>

<script setup>
import { useRevenuePartnershipSelectDashboardPage } from '@/composables/useWebsiteData'

const { isDark } = useTheme()
const { title, subtitle, cards } = useRevenuePartnershipSelectDashboardPage()

definePageMeta({
  layout: false
})

import SelectDashboardCard from '@/components/revenue-partnership/SelectDashboardCard.vue'

function navigateToReview(route) {
  if (route) {
    navigateTo(route)
  }
}
</script>

<style scoped></style>
