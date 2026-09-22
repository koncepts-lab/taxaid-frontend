<template>
  <header class="h-[110px] w-full flex items-center justify-between px-8 bg-transparent relative z-20">
    <div class="absolute inset-y-0 right-0 w-full max-w-[90%] pointer-events-none z-[-1] float-right">
      <img :src="isDark ? '/images/partnership-dark-bg.png' : '/images/partnership-bg.png'" alt="Header Background"
        class="w-full h-full object-fill" />
    </div>

    <NuxtLink to="/taxaid-partner/dashboard" class="flex items-center mt-2">
      <img :src="isDark ? '/images/logo-dark.svg' : '/images/logo.svg'" alt="Taxaid.AI" class="w-[180px] h-auto" />
    </NuxtLink>

    <div class="flex items-center gap-6">
      <div class="text-right flex flex-col items-end justify-center border-r border-[#ffffff33] pr-4 h-[44px]">
        <span class="text-[14px] font-medium text-white leading-tight mb-1">{{ partnerName }}</span>
        <span class="text-[14px] font-normal text-[#e6f1ef]">{{ currentLang === 'ar' ? 'شريك' : 'Partner' }}</span>
      </div>

      <div class="flex items-center gap-4 ml-[-8px]">
        <CommonTooltip :text="isDark ? (currentLang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (currentLang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')">
          <button @click="toggleTheme"
            class="w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
            :style="isDark ? { background: 'linear-gradient(180deg, #057759 0%, #04B788 100%)', boxShadow: 'none' } : { background: 'rgba(0, 137, 111, 0.4)' }">
            <img v-if="!isDark" src="/images/icons/dark.svg" class="w-5 h-5 invert brightness-0" alt="Dark Mode" />
            <img v-else src="/images/icons/sun.svg" class="w-5 h-5" alt="Light Mode" />
          </button>
        </CommonTooltip>

        <CommonTooltip :text="currentLang === 'ar' ? 'التنبيهات' : 'Notifications'">
          <NuxtLink to="/taxaid-partner/notifications"
            class="relative w-[38px] h-[38px] rounded-full bg-[#00896F]/40 border border-[#ffffff1A] flex items-center justify-center text-white hover:bg-[#00896F]/60 transition-all cursor-pointer">
            <img src="/images/icons/Notifications.svg" alt="Notifications" class="w-5 h-5 invert brightness-0" />
            <span v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-semibold leading-none text-white border-2"
              :style="isDark ? { background: '#04B788', borderColor: '#0a1f1a' } : { background: '#00896F', borderColor: '#F0F0F0' }">
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </NuxtLink>
        </CommonTooltip>

        <CommonTooltip :text="currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'">
          <button @click="logout"
            class="w-[38px] h-[38px] rounded-full bg-[#00896F]/40 border border-[#ffffff1A] flex items-center justify-center text-white hover:bg-[#00896F]/60 transition-all cursor-pointer">
            <img src="/images/icons/logout-icon.svg" alt="Logout" class="w-5 h-5 invert brightness-0" />
          </button>
        </CommonTooltip>
      </div>
    </div>
  </header>
</template>

<script setup>
const currentLang = useState('currentLang', () => 'en')
const { isDark, toggleTheme } = useTheme()
const { user, logout } = useRevenueAuth()
const { notificationCount } = usePartnerNotifications()

const partnerName = computed(() => user.value?.name ?? user.value?.full_name ?? user.value?.email ?? '')
</script>
