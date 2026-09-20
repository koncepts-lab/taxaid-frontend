<template>
  <main class="flex-1 px-8 pb-[0px] pt-8 space-y-6 overflow-y-auto" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <NuxtLink to="/taxaid-partner/dashboard"
      class="inline-flex items-center gap-2 pl-4 pr-6 py-2 rounded-full border text-[14px] font-medium transition-all"
      :class="isDark ? 'bg-[#057759]/60 border-white/10 text-white hover:bg-[#057759]' : 'bg-[#00896F] border-[#00896F] text-white hover:bg-[#00705a]'">
      <svg class="w-4 h-4" :class="currentLang === 'ar' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      {{ currentLang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard' }}
    </NuxtLink>
    <CommonNotificationsList :groups="notificationGroups" :tabs="notificationTabs" v-model:active-tab="activeTab" />
  </main>
</template>

<script setup>
definePageMeta({ layout: 'partner' })

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const activeTab = ref('All')
const { notificationTabs, notificationGroups } = usePartnerNotifications()
</script>

<style scoped>
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
</style>
