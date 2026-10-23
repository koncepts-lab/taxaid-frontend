<template>
  <div class="p-4 md:p-8 max-w-[100vw] overflow-x-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
      <button @click="goBack"
        class="inline-flex items-center gap-2 pl-4 pr-6 py-2 rounded-full border text-[14px] font-medium transition-all"
        :class="isDark ? 'bg-[#057759]/60 border-white/10 text-white hover:bg-[#057759]' : 'bg-[#00896F] border-[#00896F] text-white hover:bg-[#00705a]'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
      </button>
    </div>
    <h1 class="text-[24px] font-medium mb-8" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
      {{ currentLang === 'ar' ? 'الإعدادات' : 'Settings' }}
    </h1>

    <div class="space-y-6 max-w-4xl mx-auto">
      <CommonSecurityProfileCard
        :current-name="currentName"
        :update-profile="controller.updateProfile"
        @updated="(fullName) => emit('profile-updated', fullName)"
      />

      <CommonSecurityChangePasswordCard :change-password="controller.changePassword" />

      <CommonSecurityActiveSessionsCard
        :sessions="controller.sessions.value"
        :sessions-loading="controller.sessionsLoading.value"
        @revoke="controller.revokeSession"
        @revoke-others="controller.revokeOtherSessions"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  controller: { type: Object, required: true },
  currentName: { type: String, default: '' },
  fallbackRoute: { type: String, default: '/' },
})

const emit = defineEmits(['profile-updated'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const router = useRouter()

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push(props.fallbackRoute)
  }
}

onMounted(props.controller.fetchSessions)
</script>
