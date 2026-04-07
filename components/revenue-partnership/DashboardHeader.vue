<template>
  <header class="h-[110px] w-full flex items-center justify-between px-8 bg-transparent relative z-20">
    <!-- Background Image -->
    <div class="absolute inset-y-0 right-0 w-full max-w-[90%] pointer-events-none z-[-1] float-right">
      <img :src="isDark ? '/images/partnership-dark-bg.png' : '/images/partnership-bg.png'" alt="Header Background"
        class="w-full h-full object-fill" />
    </div>

    <!-- Left: Logo -->
    <div class="flex items-center mt-2">
      <img :src="isDark ? '/images/logo-dark.svg' : '/images/logo.svg'" alt="Taxaid.AI" class="w-[180px] h-auto" />
    </div>

    <!-- Right: Profile & Actions -->
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-4 h-[44px]">
        <div class="text-right flex flex-col items-end justify-center border-r border-[#ffffff33] pr-4">
          <span class="text-[14px] font-medium text-white leading-tight mb-1">{{ userName }}</span>
          <span class="text-[14px] font-normal text-[#e6f1ef]">{{ userId }}</span>
        </div>

        <NuxtLink v-if="showChangeProfile" :to="changeProfileLink"
          class="text-[13px] text-white hover:text-gray-200 underline underline-offset-2 transition-colors flex items-center h-full pt-1.5 ml-1">
          Change Profile
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4 ml-[-8px]">
        <!-- Night Mode Toggle -->
        <CommonTooltip
          :text="isDark ? (currentLang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (currentLang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')">
          <button @click="toggleTheme"
            class="w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
            :class="{ 'shadow-none': isDark }"
            :style="isDark ? { background: 'linear-gradient(180deg, #057759 0%, #04B788 100%)', boxShadow: 'none' } : { background: 'rgba(0, 137, 111, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)' }">
            <img v-if="!isDark" src="/images/icons/dark.svg" class="w-5 h-5 invert brightness-0" alt="Dark Mode" />
            <img v-else src="/images/icons/sun.svg" class="w-5 h-5" alt="Light Mode" />
          </button>
        </CommonTooltip>
        <!-- Notifications -->
        <CommonTooltip :text="currentLang === 'ar' ? 'التنبيهات' : 'Notifications'">
          <NuxtLink to="/revenue-partnership/notifications"
            class="w-[38px] h-[38px] rounded-full bg-[#00896F]/40 border border-[#ffffff1A] flex items-center justify-center text-white hover:bg-[#00896F]/60 transition-colors cursor-pointer">
            <img src="/images/icons/Notifications.svg" alt="Notifications" class="w-5 h-5 invert brightness-0" />
          </NuxtLink>
        </CommonTooltip>

        <!-- Logout -->
        <CommonTooltip :text="currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'">
          <NuxtLink to="/revenue-partnership-login"
            class="w-[38px] h-[38px] rounded-full bg-[#00896F]/40 border border-[#ffffff1A] flex items-center justify-center text-white hover:bg-[#00896F]/60 transition-colors cursor-pointer">
            <img src="/images/icons/logout-icon.svg" alt="Logout" class="w-5 h-5 invert brightness-0" />
          </NuxtLink>
        </CommonTooltip>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  userName: {
    type: String,
    default: 'Account'
  },
  userId: {
    type: String,
    default: 'ACCOUNT-001'
  },
  showChangeProfile: {
    type: Boolean,
    default: false
  },
  changeProfileLink: {
    type: String,
    default: '/profile'
  }
})

const currentLang = useState('currentLang')
const { isDark, toggleTheme } = useTheme()
defineProps({
  isDark: Boolean,
  currentLang: { type: String, default: 'en' },
  role: { type: String, default: 'Admin' },
  name: { type: String, default: 'Admin' }
})
</script>
