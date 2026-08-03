<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <!-- HEADER -->
    <DashboardHeader userName="Admin User" userId="ADMIN-001" showChangeProfile changeProfileLink="/revenue-partnership/admin" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 pb-[0px] pt-8 space-y-6 overflow-y-auto" style="margin-top: -18px;">
      <CommonNotificationsList :groups="notificationGroups" :tabs="notificationTabs" v-model:active-tab="activeTab" />
    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
// TODO: NEED Alerts — hardcoded mock data below, not wired to a real notifications API yet.
import { ref } from 'vue'

const { isDark } = useTheme()

definePageMeta({
  layout: false
})

const activeTab = ref('All')

const notificationTabs = [
  { name: 'All', count: 21 },
  { name: 'Accounts', count: 2 },
  { name: 'System', count: 2 }
]

const notificationGroups = [
  {
    id: 1,
    date: 'Today - Nov 15, 2024',
    items: [
      { id: 101, type: 'warning', message: '3 customer cards are due to expire soon. Update payment details to prevent failed transactions.', time: '05:30 AM', category: 'Accounts', unread: true },
      { id: 102, type: 'info', message: 'Month end report upload is pending. Please upload before end of business today.', time: '05:30 AM', category: 'Accounts', unread: true },
      { id: 103, type: 'success', message: 'Settlement of AED 125,308 for TechCorp Solutions Inc. completed successfully.', time: '05:30 AM', category: 'Accounts', unread: true }
    ]
  },
  {
    id: 2,
    date: 'Yesterday - Nov 14, 2024',
    items: [
      { id: 201, type: 'warning', message: '3 customer cards are due to expire soon. Update payment details to prevent failed transactions.', time: '05:30 AM', category: 'Accounts', unread: true },
      { id: 202, type: 'info', message: 'Month end report upload is pending. Please upload before end of business today.', time: '05:30 AM', category: 'Accounts', unread: true },
      { id: 203, type: 'success', message: 'Settlement of AED 125,308 for TechCorp Solutions Inc. completed successfully.', time: '05:30 AM', category: 'Accounts', unread: true }
    ]
  }
]
</script>

<style scoped>
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
</style>
