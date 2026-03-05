<template>
  <NuxtLayout name="dashboard">


    <!-- 1. Container fills the screen height and prevents page-level scrolling -->
    <div v-if="!isFullScreenChat" class="h-screen font-sans flex overflow-hidden relative z-10" :class="{ '': isDark }"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- 2. LEFT AREA: Resizes dynamically and handles its own scrolling -->
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-4 pt-0" :class="isChatOpen
        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
        : (currentLang === 'ar' ? 'lg:ml-[170px] mr-0' : 'lg:mr-[170px] mr-0')">
        <div class="mx-auto">

          <CostCenterHeader class="mb-8" />

          <div class="mb-8">
            <CostCenterSummary />
          </div>

          <div>
            <div class="h-[620px]">
              <CostCenterOverallRevenueVsCost />
            </div>
          </div>

        </div>
      </div>

      <!-- 3. RIGHT SIDEBAR -->

      <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = false" />
    </div>

    <div v-else class="w-full flex overflow-hidden">
      <!-- Full Sidebar version -->
      <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />

      <!-- Main Chat Window -->
      <main class="flex-1">
        <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'
import ParticleBackground from '~/components/common/ParticleBackground.vue'
import CostCenterHeader from '~/components/cost-center/Header.vue'
import CostCenterSummary from '~/components/cost-center/Summary.vue'
import CostCenterOverallRevenueVsCost from '~/components/cost-center/OverallRevenueVsCost.vue'

const isChatOpen = ref(true)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
