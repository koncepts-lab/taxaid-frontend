<template>
  <header class="h-[110px] w-full flex items-center justify-between px-8 bg-transparent relative z-20">
    <!-- Background Image -->
    <div class="absolute inset-y-0 right-0 w-full max-w-[90%] pointer-events-none z-[-1] float-right">
      <img src="/images/partnership-bg.png" alt="Header Background" class="w-full h-full object-fill" />
    </div>

    <!-- Left: Logo -->
    <div class="flex items-center mt-2">
      <img src="/images/logo.svg" alt="Taxaid.AI" class="w-[180px] h-auto" />
    </div>

    <!-- Right: Profile & Actions -->
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-4 border-r border-[#ffffff33] pr-4 h-[44px]">
        <div class="text-right flex flex-col items-end justify-center">
          <span class="text-[14px] font-medium text-white leading-tight mb-1">{{ userName }}</span>
          <span class="text-[14px] font-normal text-[#e6f1ef]">{{ userId }}</span>
        </div>

        <NuxtLink v-if="showChangeProfile" to="/profile"
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
        <button
          class="w-[38px] h-[38px] rounded-full bg-[#00896F]/40 border border-[#ffffff1A] flex items-center justify-center text-white hover:bg-[#00896F]/60 transition-colors cursor-pointer">
          <img src="/images/icons/Notifications.svg" alt="Notifications" class="w-5 h-5 invert brightness-0" />
        </button>

        <NuxtLink to="/revenue-partnership-login"
          class="flex items-center gap-2 bg-white h-[38px] px-4 rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm text-[13px] font-medium text-[#1a1a1a] cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-[16px] w-[16px] text-[#1a1a1a]" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  userName: {
    type: String,
    default: 'Partner'
  },
  userId: {
    type: String,
    default: 'PARTNER-001'
  },
  showChangeProfile: {
    type: Boolean,
    default: false
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
