<template>
  <header class="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-transparent mt-0 mb-2">
    <!-- LEFT: LOGO -->
    <div class="flex items-center">
      <img :src="isDark ? '/images/logo-dark.svg' : '/images/logo.svg'" alt="Taxaid.AI" :class="currentLang === 'ar' ? 'h-10 md:h-14 mr-0 md:mr-[30px]' : 'h-10 md:h-14 ml-0 md:ml-[30px]'" />
    </div>

    <!-- CENTER: NAVIGATION PILL -->
    <div class="hidden lg:flex items-center p-1.5 rounded-full transition-all duration-300"
      :class="isDark ? 'bg-[#015F4D] text-white' : 'border border-[#B2E4D9]'"
      :style="isDark ? {} : { background: 'linear-gradient(271.49deg, rgba(164, 227, 214, 0.485) 30.96%, rgba(109, 216, 193, 0.5) 109.26%)', boxShadow: '0px 4px 4px 0px #D0F7EF80' }">
      <button class="px-8 py-2.5 rounded-full font-regular transition-all text-[16px]"
        :class="isDark ? 'bg-white text-black shadow-none' : 'bg-white text-black shadow-sm'">
        {{ currentLang === 'ar' ? 'لوحة القيادة' : 'Dashboard' }}
      </button>
      <button class="px-7 py-2.5 rounded-full font-regular transition-all text-[16px]"
        :class="isDark ? 'text-white hover:text-white/80' : 'text-black/70 hover:text-black'">
        {{ currentLang === 'ar' ? 'مصدر البيانات' : 'Data Source' }}
      </button>
      <button class="px-7 py-2.5 rounded-full font-regular transition-all text-[16px]"
        :class="isDark ? 'text-white hover:text-white/80' : 'text-black/70 hover:text-black'">
        {{ currentLang === 'ar' ? 'التنبيهات' : 'Alerts' }}
      </button>
      <button class="px-7 py-2.5 rounded-full font-regular transition-all text-[16px]"
        :class="isDark ? 'text-white hover:text-white/80' : 'text-black/70 hover:text-black'">
        {{ currentLang === 'ar' ? 'المواعيد' : 'Appointment' }}
      </button>
    </div>

    <!-- RIGHT: ACTIONS -->
    <div class="flex items-center gap-2 md:gap-7">
      <!-- LANGUAGE TOGGLE -->
      <div class="hidden md:block">
        <LanguageToggle v-model="currentLang" />
      </div>

      <!-- FLASH ACTION -->
      <div class="group relative hidden md:block">
        <button
          class="action-btn flash-btn w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
          :class="{ 'shadow-none': isDark }"
          :style="isDark ? { background: 'linear-gradient(313.43deg, rgba(4, 183, 136, 0.5) 14.29%, rgba(5, 119, 89, 0.5) 81.93%)', boxShadow: 'none' } : {}">
          <img :src="isDark ? '/images/icons/flash-dark.svg' : '/images/icons/flash.svg'" class="w-6 h-6" alt="Flash" />
        </button>
        <!-- TOOLTIP -->
        <div
          class="absolute top-[110%] left-1/2 -translate-x-1/2 mt-2 px-4 py-2.5 bg-[#003d35] text-white text-[12px] font-medium rounded-2xl whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-xl z-50">
          {{ currentLang === 'ar' ? 'ملخص بنقرة واحدة' : 'One Click Summary' }}
          <!-- Arrow -->
          <div
            class="absolute -top-1.5 left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-b-[6px] border-b-[#003d35]">
          </div>
        </div>
      </div>

      <!-- THEME TOGGLE (DARK) -->
      <button
        @click="toggleTheme"
        class="action-btn theme-btn w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center transition-all duration-300 flex"
        :class="{ 'shadow-none': isDark }"
        :style="isDark ? { background: 'linear-gradient(180deg, #057759 0%, #04B788 100%)', boxShadow: 'none' } : {}">
        <img v-if="!isDark" src="/images/icons/dark.svg" class="w-5 h-5 md:w-6 md:h-6 invert brightness-0" alt="Dark Mode" />
        <img v-else src="/images/icons/sun.svg" class="w-5 h-5 md:w-6 md:h-6" alt="Light Mode" />
      </button>

      <!-- SETTINGS -->
      <div class="group relative">
        <button
          class="action-btn settings-btn w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center transition-all duration-300 flex"
          :class="{ 'shadow-none': isDark }"
          :style="isDark ? { background: 'linear-gradient(313.43deg, rgba(4, 183, 135, 0.5) 14.29%, rgba(2, 83, 64, 0.5) 81.93%)', boxShadow: 'none' } : {}">
          <img :src="isDark ? '/images/icons/settings-dark.svg' : '/images/icons/settings.svg'" class="w-5 h-5 md:w-6 md:h-6" alt="Settings" />
        </button>
        <!-- DROPDOWN MENU -->
        <div
          class="absolute top-[110%] right-0 mt-2 w-[280px] md:w-[324px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-4 border border-teal-50">
          <div class="flex flex-col gap-1">
            <div v-for="(item, index) in settingsItems" :key="index"
              class="flex items-center gap-4 p-1 rounded-2xl hover:bg-[#E6FFF9] cursor-pointer transition-colors group/item">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center">
                <img :src="item.icon" class="w-5 h-5" :alt="item.label" />
              </div>
              <span class="text-[#013E32] font-medium text-[15px]">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PROFILE SECTION -->
      <div class="flex items-center gap-2 md:gap-4 p-1" :class="currentLang === 'ar' ? 'mr-1 md:mr-3' : 'ml-1 md:ml-3'">
        <div class="text-right hidden lg:block" :class="currentLang === 'ar' ? 'text-left' : 'text-right'">
          <div class="font-medium text-[15px] leading-tight transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ currentLang === 'ar' ? 'ماستر لاين ميكانيك' : 'Masterline Mech' }}</div>
          <div class="text-[12px] font-light transition-colors duration-300" :class="isDark ? 'text-white/80' : 'text-[#013E32]'">{{ currentLang === 'ar' ? 'أبو ظبي، الإمارات العربية المتحدة' : 'Abu Dhabi, UAE' }}</div>
        </div>
        <div class="relative">
          <img src="/images/avatar-company.png"
            class="w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md object-cover" alt="Profile" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import LanguageToggle from './LanguageToggle.vue'

const currentLang = useState('currentLang', () => 'en')
const { isDark, toggleTheme } = useTheme()

const settingsItems = [
  { label: 'Subscription Management', labelAr: 'إدارة الاشتراك', icon: '/images/icons/Subscription-Management.svg' },
  { label: 'Support', labelAr: 'الدعم', icon: '/images/icons/Support.svg' },
  { label: 'Notification Preferences', labelAr: 'تفضيلات الإشعارات', icon: '/images/icons/Notification-Preferences.svg' },
  { label: 'Security & Privacy', labelAr: 'الأمن والخصوصية', icon: '/images/icons/Security-Privacy.svg' },
  { label: 'Sync & Data Management', labelAr: 'المزامنة وإدارة البيانات', icon: '/images/icons/Sync-Data-Management.svg' },
]
</script>

<style scoped>
.flash-btn,
.settings-btn {
  background: linear-gradient(313.43deg, rgba(197, 230, 223, 0.5) 14.29%, rgba(109, 216, 193, 0.5) 81.93%);
  box-shadow: 0px 4px 4px 0px #D0F7EF;
}

.theme-btn {
  background: linear-gradient(180deg, #057759 0%, #04B788 100%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  box-shadow: 0px 5px 10px 0px #00B79499 !important;
  transform: translateY(-1px);
}

.flash-btn:hover,
.settings-btn:hover {
  background: linear-gradient(313.43deg, rgba(197, 230, 223, 0.8) 14.29%, rgba(109, 216, 193, 0.8) 81.93%) !important;
}
</style>
