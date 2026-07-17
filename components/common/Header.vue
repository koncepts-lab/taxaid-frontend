<template>
  <header
    class="relative z-[1100] flex items-center justify-between px-4 md:px-8 py-1 md:py-2 bg-transparent mt-0 mb-2">
    <div v-if="isMenuOpen" class="fixed inset-0 bg-black/50 z-[100] lg:hidden transition-opacity duration-300"
      @click="isMenuOpen = false"></div>

    <div
      class="fixed top-0 left-0 pt-4 h-full w-[85%] max-w-[320px] z-[101] lg:hidden transition-transform duration-300 transform shadow-2xl flex flex-col border border-none rounded-r-2xl"
      :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      style="background: linear-gradient(180deg, #015A48 0%, #00342A 100%);">
      <div class="flex items-center justify-between p-3">
        <img src="/images/logo-dark.svg" alt="Taxaid.AI" class="h-10" />
        <button @click="isMenuOpen = false" class="text-white/60 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto py-2 no-scrollbar">
        <div class="flex flex-col gap-1">
          <NuxtLink v-for="(item, index) in navItems" :key="index" :to="item.to" @click="isMenuOpen = false"
            class="flex items-center gap-4 p-2 rounded-xl transition-all duration-200 group"
            :class="$route.path.startsWith(item.to) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'">
            <img :src="$route.path.startsWith(item.to) ? item.activeIcon : item.icon"
              class="w-6 h-6 transition-transform duration-200 opacity-60"
              :class="{ 'scale-110': $route.path.startsWith(item.to) }" />
            <span class="text-lg font-medium text-white/60">
              {{ currentLang === 'ar' ? item.labelAr : item.label }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="flex items-center">
      <button class="lg:hidden p-2 -ml-2" @click="isMenuOpen = true">
        <img src="/images/icons/hamburger.svg" class="w-7 h-7" />
      </button>
      <NuxtLink to="/dashboard">
        <img :src="isDark ? '/images/logo-dark.svg' : '/images/logo.svg'" alt="Taxaid.AI"
          :class="currentLang === 'ar' ? 'h-10 md:h-14 mr-0 md:mr-[30px]' : 'h-10 md:h-14 ml-0 md:ml-[30px]'" />
      </NuxtLink>
    </div>

    <div class="hidden lg:flex items-center p-1.5 rounded-full transition-all duration-300"
      :class="isDark ? 'bg-[#015F4D] text-white' : ''"
      :style="isDark ? {} : { background: 'linear-gradient(271.49deg, rgba(164, 227, 214, 0.485) 30.96%, rgba(109, 216, 193, 0.5) 109.26%)', boxShadow: '0px 4px 4px 0px #D0F7EF80' }">
      <NuxtLink to="/dashboard" class="px-8 py-2.5 rounded-full font-regular transition-all text-[16px]" :class="$route.path.startsWith('/dashboard')
        ? (isDark ? 'bg-white text-black shadow-none' : 'bg-white text-black shadow-sm')
        : (isDark ? 'text-white hover:text-white/80' : 'text-black hover:text-black')">
        {{ currentLang === 'ar' ? 'لوحة القيادة' : 'Dashboard' }}
      </NuxtLink>
      <NuxtLink to="/data-source" class="px-7 py-2.5 rounded-full font-regular transition-all text-[16px]" :class="$route.path.startsWith('/data-source')
        ? (isDark ? 'bg-white text-black shadow-none' : 'bg-white text-black shadow-sm')
        : (isDark ? 'text-white hover:text-white/80' : 'text-black hover:text-black')">
        {{ currentLang === 'ar' ? 'مصدر البيانات' : 'Data Source' }}
      </NuxtLink>
      <NuxtLink to="/alerts" class="px-7 py-2.5 rounded-full font-regular transition-all text-[16px]" :class="$route.path.startsWith('/alerts')
        ? (isDark ? 'bg-white text-black shadow-none' : 'bg-white text-black shadow-sm')
        : (isDark ? 'text-white hover:text-white/80' : 'text-black hover:text-black')">
        {{ currentLang === 'ar' ? 'التنبيهات' : 'Alerts' }}
      </NuxtLink>
      <NuxtLink to="/appointment" class="px-7 py-2.5 rounded-full font-regular transition-all text-[16px]" :class="$route.path.startsWith('/appointment')
        ? (isDark ? 'bg-white text-black shadow-none' : 'bg-white text-black shadow-sm')
        : (isDark ? 'text-white hover:text-white/80' : 'text-black hover:text-black')">
        {{ currentLang === 'ar' ? 'المواعيد' : 'Appointment' }}
      </NuxtLink>
    </div>

    <div class="flex items-center gap-2 md:gap-7">
      <div class="hidden md:block">
        <CommonTooltip :text="currentLang === 'ar' ? 'تبديل اللغة' : 'Switch Language'">
          <LanguageToggle v-model="currentLang" />
        </CommonTooltip>
      </div>

      <div class="group relative block">
        <CommonTooltip :text="currentLang === 'ar' ? 'ملخص بنقرة واحدة' : 'One Click Summary'">
          <button
            class="action-btn flash-btn w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300"
            :class="{ 'shadow-none': isDark }"
            :style="isDark ? { background: 'linear-gradient(313.43deg, rgba(4, 183, 136, 0.5) 14.29%, rgba(5, 119, 89, 0.5) 81.93%)', boxShadow: 'none' } : {}">
            <img :src="isDark ? '/images/icons/flash-dark.svg' : '/images/icons/flash.svg'"
              class="w-5 h-5 md:w-6 md:h-6" alt="Flash" />
          </button>
        </CommonTooltip>
      </div>

      <CommonTooltip
        :text="isDark ? (currentLang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (currentLang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')">
        <button @click="toggleTheme"
          class="action-btn theme-btn w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center transition-all duration-300 hidden md:flex"
          :class="{ 'shadow-none': isDark }"
          :style="isDark ? { background: 'linear-gradient(180deg, #057759 0%, #04B788 100%)', boxShadow: 'none' } : {}">
          <img v-if="!isDark" src="/images/icons/dark.svg" class="w-5 h-5 md:w-6 md:h-6 invert brightness-0"
            alt="Dark Mode" />
          <img v-else src="/images/icons/sun.svg" class="w-5 h-5 md:w-6 md:h-6" alt="Light Mode" />
        </button>
      </CommonTooltip>

      <div class="group relative">
        <button @click.stop="isSettingsOpen = true"
          class="action-btn settings-btn w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center transition-all duration-300 flex"
          :class="{ 'shadow-none': isDark }"
          :style="isDark ? { background: 'linear-gradient(313.43deg, rgba(4, 183, 135, 0.5) 14.29%, rgba(2, 83, 64, 0.5) 81.93%)', boxShadow: 'none' } : {}">
          <img :src="isDark ? '/images/icons/settings-dark.svg' : '/images/icons/settings.svg'"
            class="w-5 h-5 md:w-6 md:h-6" alt="Settings" />
        </button>
        <div
          class="absolute top-[110%] right-0 mt-2 w-[280px] md:w-[324px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 border border-teal-50">
          <div class="flex flex-col gap-1">
            <template v-for="(item, index) in settingsItems" :key="index">
              <NuxtLink v-if="item.to" :to="item.to"
                class="flex items-center gap-4 p-1 rounded-2xl hover:bg-[#E6FFF9] cursor-pointer transition-colors group/item">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img :src="item.icon" class="w-5 h-5" :alt="item.label" />
                </div>
                <span class="text-[#013E32] font-medium text-[15px]">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
              </NuxtLink>
              <div v-else
                class="flex items-center gap-4 p-1 rounded-2xl hover:bg-[#E6FFF9] cursor-pointer transition-colors group/item">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img :src="item.icon" class="w-5 h-5" :alt="item.label" />
                </div>
                <span class="text-[#013E32] font-medium text-[15px]">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="group relative flex items-center gap-2 md:gap-4 p-1 cursor-pointer z-[100000]"
        @click.stop="isProfileOpen = true" :class="currentLang === 'ar' ? 'mr-1 md:mr-3' : 'ml-1 md:ml-3'">
        <div class="text-right hidden lg:block" :class="currentLang === 'ar' ? 'text-left' : 'text-right'">
          <div class="font-medium text-[15px] leading-tight transition-colors duration-300"
            :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ profile?.companyNickname || profile?.companyName || '...' }}
          </div>
          <div class="text-[12px] font-light transition-colors duration-300"
            :class="isDark ? 'text-white/80' : 'text-[#013E32]'">
            {{ profile?.email || '' }}
          </div>
        </div>
        <div class="relative">
          <img v-if="pictureUrl" :src="pictureUrl"
            class="w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md object-cover" alt="Profile" />
          <div v-else class="w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md bg-[#E6F9F4]"></div>
        </div>

        <div
          class="absolute top-[110%] right-0 mt-2 w-[380px] bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] p-5 border border-teal-50 text-left"
          :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

          <div class="bg-[#E6F9F4] p-2 rounded-2xl flex items-center gap-4 mb-5">
            <img v-if="pictureUrl" :src="pictureUrl"
              class="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" />
            <div v-else class="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white"></div>
            <div class="flex-1">
              <h4 class="font-medium text-[#013E32] text-sm leading-tight">{{ profile?.companyNickname || profile?.companyName || '' }}</h4>
              <p class="text-sm text-[#013E32]/70 font-medium">{{ profile?.email || '' }}</p>
              <NuxtLink to="/profile" class="text-[#00B68D] text-sm font-medium  mt-1 inline-block">View
                Profile</NuxtLink>
            </div>
          </div>

          <!--
          <div class="flex justify-between items-center mb-3">
            <span class="font-normal text-sm text-[#013E32]">{{ currentLang === 'ar' ? 'اختيار الشركات' :
              'Select Companies'
              }}</span>
            <button @click="toggleAllCompanies" class="text-[#00B68D] text-sm font-normal">{{ currentLang === 'ar' ?
              'تحديد الكل' : 'Select all'
              }}</button>
          </div>

          <div class="bg-[#EEF4FF] p-3 rounded-xl flex gap-3 mb-4">
            <div class="mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-blue-600">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path d="M12 16V12M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <p class="text-[13px] text-blue-800 leading-snug">
              {{ currentLang === 'ar' ? 'اختر شركات متعددة لعرض البيانات المالية الموحدة.' :
                'Select multiple companies to view consolidated financial data.' }}
            </p>
          </div>

          <div class="flex flex-col gap-3 mb-6">
            <div v-for="company in companies" :key="company.id" @click="toggleCompany(company.id)"
              class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer"
              :class="company.selected ? 'border-[#00B68D] bg-[#F7FFFD]' : 'border-gray-100 hover:border-teal-100'">
              <div
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                <img :src="company.logo" class="w-8 h-8 object-contain" />
              </div>
              <span class="flex-1 font-normal text-[#013E32] text-sm">{{ company.name }}</span>

              <div class="w-6 h-6 rounded flex items-center justify-center transition-colors"
                :class="company.selected ? 'bg-[#00B68D]' : 'border-2 border-gray-300'">
                <svg v-if="company.selected" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                  stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          -->

          <div class="border-t border-gray-100 pt-4 flex flex-col gap-8">
            <!--
            <button class="flex items-center gap-3 text-[#013E32] text-sm font-normal group/btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                class="group-hover/btn:text-[#00B68D]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              {{ currentLang === 'ar' ? 'تصدير البيانات' : 'Export Data' }}
            </button>
            <NuxtLink to="/revenue-partnership-login" class="flex items-center gap-3 text-[#013E32] text-sm font-normal group/btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                class="group-hover/btn:text-[#00B68D]">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              {{ currentLang === 'ar' ? 'التبديل إلى لوحة الشركاء' : 'Switch to Partnership' }}
            </NuxtLink>
            -->
            <button @click="onLogoutClick" class="flex items-center gap-3 text-[#013E32] text-sm font-normal group/btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                class="group-hover/btn:text-red-500">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              {{ currentLang === 'ar' ? 'تسجيل الخروج' : 'Sign out' }}
            </button>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-center items-center gap-4 text-xs text-gray-400">
            <NuxtLink to="/privacy">{{ currentLang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' }}</NuxtLink>
            <span class="h-3 w-px bg-gray-300"></span>
            <NuxtLink to="/terms">{{ currentLang === 'ar' ? 'شروط الخدمة' : 'Terms of Service' }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body" class="relative">
      <div v-if="(isSettingsOpen || isProfileOpen) && !isDesktop"
        class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[200] lg:hidden"
        @click="isSettingsOpen = false; isProfileOpen = false"></div>

      <div
        class="fixed  bottom-0 left-0 right-0 z-[2001] lg:hidden transition-transform duration-500 ease-out rounded-t-[2.5rem] shadow-2xl border-t border-white/5 overflow-y-auto max-h-[80vh]"
        :class="[
          isSettingsOpen ? 'translate-y-0' : 'translate-y-full',
          isDark ? 'bg-[#01261f] text-white' : 'bg-white text-gray-900'
        ]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <div class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-white/5' : 'border-gray-100'">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="isDark ? 'bg-[#023b31]' : 'bg-[#E6FFF9]'">
              <img src="/images/icons/settings.svg" class="w-6 h-6" :class="{ 'invert brightness-200': isDark }" />
            </div>
            <h3 class="text-xl font-bold">{{ currentLang === 'ar' ? 'الإعدادات' : 'Settings' }}</h3>
          </div>
          <button @click="isSettingsOpen = false" class="p-2 opacity-50 hover:opacity-100 transition-opacity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-2">
          <div
            class="flex items-center justify-between p-2 rounded-2xl transition-colors hover:bg-[#E6FFF9] dark:hover:bg-[#00B68D]/10 active:bg-[#E6FFF9] group">
            <div class="flex items-center gap-4">
              <img src="/images/icons/lang.svg" class="w-6 h-6 " :class="{ 'invert': isDark }" />
              <div>
                <p class="font-bold text-[17px] group-hover:text-[#008472] transition-colors">{{ currentLang === 'ar' ?
                  'اللغة' : 'Language' }}</p>
                <p class="text-xs opacity-50">{{ currentLang === 'en' ? 'English' : 'العربية' }}</p>
              </div>
            </div>
            <div @click="currentLang = currentLang === 'en' ? 'ar' : 'en'"
              class="w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors"
              :class="currentLang === 'ar' ? 'bg-[#00B68D]' : 'bg-gray-300 dark:bg-gray-700'">
              <div class="w-4 h-4 bg-white rounded-full transition-transform duration-300"
                :class="currentLang === 'ar' ? (currentLang === 'ar' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'">
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between p-2 rounded-2xl transition-colors hover:bg-[#E6FFF9] dark:hover:bg-[#00B68D]/10 active:bg-[#E6FFF9] group">
            <div class="flex items-center gap-4">
              <img src="/images/icons/settings.svg" class="w-6 h-6 " :class="{ 'invert': isDark }" />
              <div>
                <p class="font-bold text-[17px] group-hover:text-[#008472] transition-colors">{{ currentLang === 'ar' ?
                  'الوضع الداكن' : 'Dark Mode' }}</p>
                <p class="text-xs opacity-50">{{ isDark ? (currentLang === 'ar' ? 'مفعّل' : 'Enabled') : (currentLang
                  === 'ar' ? 'معطّل' : 'Disabled') }}</p>
              </div>
            </div>
            <div @click="toggleTheme" class="w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors"
              :class="isDark ? 'bg-[#00B68D]' : 'bg-gray-300 dark:bg-gray-700'">
              <div class="w-4 h-4 bg-white rounded-full transition-transform duration-300"
                :class="isDark ? (currentLang === 'ar' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'"></div>
            </div>
          </div>



          <template v-for="item in settingsItems" :key="item.label">
            <NuxtLink v-if="item.to" :to="item.to"
              @click="isSettingsOpen = false"
              class="p-2 flex items-center gap-4 font-bold text-[17px] opacity-80 rounded-2xl transition-colors hover:bg-[#E6FFF9] dark:hover:bg-[#00B68D]/10 active:bg-[#E6FFF9] cursor-pointer group">
              <img :src="item.icon" class="w-6 h-6 transition-opacity"
                :class="{ 'invert opacity-60 group-hover:opacity-100': isDark }" />
              <span class="group-hover:text-[#008472] transition-colors">{{ currentLang === 'ar' ? item.labelAr :
                item.label }}</span>
            </NuxtLink>
            <div v-else
              class="p-2 flex items-center gap-4 font-bold text-[17px] opacity-80 rounded-2xl transition-colors hover:bg-[#E6FFF9] dark:hover:bg-[#00B68D]/10 active:bg-[#E6FFF9] cursor-pointer group">
              <img :src="item.icon" class="w-6 h-6 transition-opacity"
                :class="{ 'invert opacity-60 group-hover:opacity-100': isDark }" />
              <span class="group-hover:text-[#008472] transition-colors">{{ currentLang === 'ar' ? item.labelAr :
                item.label }}</span>
            </div>
          </template>
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 z-[201] lg:hidden transition-transform duration-500 ease-out rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        :class="[
          isProfileOpen ? 'translate-y-0' : 'translate-y-full',
          isDark ? 'bg-[#01261f] text-white' : 'bg-white text-gray-900'
        ]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <div class="p-2 ">
          <div class="bg-[#E6F9F4] p-2 rounded-2xl flex items-center gap-4 mb-5 relative">
            <img v-if="pictureUrl" :src="pictureUrl"
              class="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" />
            <div v-else class="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white"></div>
            <div class="flex-1">
              <h4 class="font-medium text-[#013E32] text-sm leading-tight">{{ profile?.companyNickname || profile?.companyName || '' }}</h4>
              <p class="text-sm text-[#013E32]/70 font-medium">{{ profile?.email || '' }}</p>
              <NuxtLink to="/profile" class="text-[#00B68D] text-sm font-medium  mt-1 inline-block">View
                Profile</NuxtLink>
            </div>
            <button @click="isSettingsOpen = false"
              class="absolute top-1 right-0 p-2 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!--
          <div class="flex justify-between items-center mb-3">
            <span class="font-normal text-sm text-[#013E32]">{{ currentLang === 'ar' ? 'اختيار الشركات' :
              'Select Companies'
              }}</span>
            <button @click="toggleAllCompanies" class="text-[#00B68D] text-sm font-normal">{{ currentLang === 'ar' ?
              'تحديد الكل' : 'Select all'
              }}</button>
          </div>
          <div class="bg-[#EEF4FF] p-3 rounded-xl flex gap-3 mb-4">
            <div class="mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-blue-600">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path d="M12 16V12M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <p class="text-[13px] text-blue-800 leading-snug">
              {{ currentLang === 'ar' ? 'اختر شركات متعددة لعرض البيانات المالية الموحدة.' :
                'Select multiple companies to view consolidated financial data.' }}
            </p>
          </div>

          <div class="flex flex-col gap-3 mb-6">
            <div v-for="company in companies" :key="company.id" @click="toggleCompany(company.id)"
              class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer"
              :class="company.selected ? 'border-[#00B68D] bg-[#F7FFFD]' : 'border-gray-100 hover:border-teal-100'">
              <div
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                <img :src="company.logo" class="w-8 h-8 object-contain" />
              </div>
              <span class="flex-1 font-normal text-[#013E32] text-sm">{{ company.name }}</span>

              <div class="w-6 h-6 rounded flex items-center justify-center transition-colors"
                :class="company.selected ? 'bg-[#00B68D]' : 'border-2 border-gray-300'">
                <svg v-if="company.selected" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                  stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          -->


          <div class="border-t border-gray-100 pt-4 flex flex-col gap-8">
            <!--
            <button class="flex items-center gap-3 text-[#013E32] text-sm font-normal group/btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                class="group-hover/btn:text-[#00B68D]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              {{ currentLang === 'ar' ? 'تصدير البيانات' : 'Export Data' }}
            </button>
            -->
            <button class="flex items-center gap-3 text-[#013E32] text-sm font-normal group/btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                class="group-hover/btn:text-red-500">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              {{ currentLang === 'ar' ? 'تسجيل الخروج' : 'Sign out' }}
            </button>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-center items-center gap-4 text-xs text-gray-400">
            <NuxtLink to="/privacy">{{ currentLang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' }}</NuxtLink>
            <span class="h-3 w-px bg-gray-300"></span>
            <NuxtLink to="/terms">{{ currentLang === 'ar' ? 'شروط الخدمة' : 'Terms of Service' }}</NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import LanguageToggle from './LanguageToggle.vue'
import { useProfile } from '~/composables/settings/useProfile'

const currentLang = useState('currentLang', () => 'en')
const { isDark, toggleTheme } = useTheme()
const isMenuOpen = ref(false)

const { profile, pictureUrl, fetchProfile, refreshPicture } = useProfile()

const route = useRoute()
watch(() => route.fullPath, () => {
  fetchProfile()
  refreshPicture()
})

const { logout } = useAuth()//logout Logic
const onLogoutClick = () => {
  logout()
}
const settingsItems = [
  { label: 'Subscription Management', labelAr: 'إدارة الاشتراك', icon: '/images/icons/Subscription-Management.svg', to: '/settings/subscription' },
  { label: 'Support', labelAr: 'الدعم', icon: '/images/icons/Support.svg', to: '/settings/support' },
  { label: 'Notification Preferences', labelAr: 'تفضيلات الإشعارات', icon: '/images/icons/Notification-Preferences.svg', to: '/settings/notifications' },
  { label: 'Security & Privacy', labelAr: 'الأمن والخصوصية', icon: '/images/icons/Security-Privacy.svg', to: '/settings/security' },
  { label: 'Sync & Data Management', labelAr: 'المزامنة وإدارة البيانات', icon: '/images/icons/Sync-Data-Management.svg', to: '/settings/sync-and-data-management' },
]
const companies = ref([
  { id: 1, name: 'MasterLine Mechanical LLC', logo: '/images/avatar-company.png', selected: true },
  { id: 2, name: 'NovaTech Industries Pvt Ltd', logo: '/images/icons/novatech.svg', selected: false },
  { id: 3, name: 'BlueSky Manufacturing FZCO', logo: '/images/icons/bluesky.svg', selected: false },
])
const toggleCompany = (id) => {
  const company = companies.value.find(c => c.id === id)
  if (company) company.selected = !company.selected
}
const navItems = [
  {
    label: 'Revenue',
    labelAr: 'الإيرادات',
    to: '/revenue',
    icon: '/images/icons/Revenue.svg',
    activeIcon: '/images/icons/Revenue-active.svg'
  },
  {
    label: 'Cashflow',
    labelAr: 'التدفق النقدي',
    to: '/cash-flow',
    icon: '/images/icons/Cashflow.svg',
    activeIcon: '/images/icons/Cashflow-active.svg'
  },
  {
    label: 'Financial Statement',
    labelAr: 'القوائم المالية',
    to: '/financial-statement',
    icon: '/images/icons/Financial-Statement.svg',
    activeIcon: '/images/icons/Financial-Statement-active.svg'
  },
  {
    label: 'Indirect Expense',
    labelAr: 'المصاريف غير المباشرة',
    to: '/indirect-expense',
    icon: '/images/icons/Indirect-Expense.svg',
    activeIcon: '/images/icons/Indirect-Expense-active.svg'
  },
  {
    label: 'Account Receivables',
    labelAr: 'حسابات القبض',
    to: '/accounts-receivable',
    icon: '/images/icons/Account-Receivables.svg',
    activeIcon: '/images/icons/Account-Receivables-active.svg'
  },
  {
    label: 'COGS',
    labelAr: 'تكلفة البضائع المباعة',
    to: '/cogs',
    icon: '/images/icons/C.O.G.S.svg',
    activeIcon: '/images/icons/C.O.G.S-active.svg'
  },
  {
    label: 'Accounts Payable',
    labelAr: 'حسابات الدفع',
    to: '/accounts-payable',
    icon: '/images/icons/Accounts-Payable.svg',
    activeIcon: '/images/icons/Accounts-Payable-active.svg'
  },
  {
    label: 'Cost Center',
    labelAr: 'مركز التكلفة',
    to: '/cost-center',
    icon: '/images/icons/Cost-Center-Project.svg',
    activeIcon: '/images/icons/Cost-Center-Project-active.svg'
  },
  {
    label: 'Tax Queries',
    labelAr: 'استفسارات ضريبية',
    to: '/tax-queries',
    icon: '/images/icons/Tax-Queries.svg',
    activeIcon: '/images/icons/Tax-Queries-active.svg'
  },
]

const toggleAllCompanies = () => {
  companies.value.forEach(c => c.selected = true)
}
const isSettingsOpen = ref(false)
const isProfileOpen = ref(false)
const isDesktop = ref(true)

onMounted(() => {
  const checkScreen = () => isDesktop.value = window.innerWidth >= 1024
  checkScreen()
  window.addEventListener('resize', checkScreen)
  fetchProfile()
})
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>