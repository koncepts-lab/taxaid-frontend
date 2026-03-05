<template>
  <NuxtLayout name="dashboard">


    <!-- 1. Container fills the screen height and prevents page-level scrolling -->
    <div v-if="!isFullScreenChat" class="font-sans flex relative z-10"
      :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- 2. LEFT AREA: Resizes dynamically -->
      <div class="flex-1 transition-all duration-500 ease-in-out px-8 pt-0 pb-[17px]" :class="isChatOpen 
        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
        : (currentLang === 'ar' ? 'ml-[170px]' : 'mr-[170px]')">
        <div class="mx-auto">
          
          <IndirectExpenseHeader class="mb-8" />

          <div class="mb-8">
            <IndirectExpenseSummary />
          </div>

          <div class="grid grid-cols-1 gap-8 mb-8">
            <div>
              <IndirectExpenseTopCategories />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 mb-8">
            <div class="h-[450px]">
              <IndirectExpenseOverheadTrends />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8">
            <div class="h-[450px]">
              <IndirectExpenseOverheadVsRevenue />
            </div>
          </div>

        </div>
      </div>

      <!-- 3. RIGHT SIDEBAR -->
      <aside class="fixed top-1/2 -translate-y-1/2 shrink-0 transition-all duration-500 ease-in-out mt-5" :class="[
        currentLang === 'ar' ? 'left-0' : 'right-0',
        isChatOpen ? '2xl:w-120 w-100' : 'w-[80px]'
      ]">
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
      </aside>
    </div>
    
    <div v-else class="w-full flex overflow-hidden">
        <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
          <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />
        </aside>

        <main class="flex-1">
          <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
        </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'
import ParticleBackground from '~/components/common/ParticleBackground.vue'
import IndirectExpenseHeader from '~/components/indirect-expense/Header.vue'
import IndirectExpenseSummary from '~/components/indirect-expense/Summary.vue'
import IndirectExpenseTopCategories from '~/components/indirect-expense/TopCategories.vue'
import IndirectExpenseOverheadTrends from '~/components/indirect-expense/OverheadTrends.vue'
import IndirectExpenseOverheadVsRevenue from '~/components/indirect-expense/OverheadVsRevenue.vue'

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
