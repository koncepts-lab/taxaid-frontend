<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="font-sans flex relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 transition-all duration-500 ease-in-out px-8 pt-0 pb-[17px]">

        <div class="mx-auto max-w-[1600px] flex flex-col gap-8 pt-4">
          <ProjectDetailHeader />
          <ProjectDetailSummaryCards />
          <ProjectDetailTable />
          <div class="h-[500px]">
            <ProjectDetailRevenueVsCost />
          </div>
        </div>
      </div>

      <aside class="fixed top-1/2 -translate-y-1/2 shrink-0 transition-all duration-500 ease-in-out mt-5" :class="[
        currentLang === 'ar' ? 'left-0' : 'right-0',
        isChatOpen ? '2xl:w-120 w-100' : 'w-[80px]'
      ]">
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
      </aside>
    </div>

    <div v-else class="w-full flex overflow-hidden">

      <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />

      <main class="flex-1">
        <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'
import ProjectDetailHeader from '~/components/cost-center/ProjectDetailHeader.vue'
import ProjectDetailSummaryCards from '~/components/cost-center/ProjectDetailSummaryCards.vue'
import ProjectDetailTable from '~/components/cost-center/ProjectDetailTable.vue'
import ProjectDetailRevenueVsCost from '~/components/cost-center/ProjectDetailRevenueVsCost.vue'

const isChatOpen = ref(true)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>
