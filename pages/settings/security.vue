<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto px-4 md:px-8 py-8 pb-20" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]" :class="isDark ? 'text-white' : 'text-[#013E32]'">
        {{ currentLang === 'ar' ? 'الأمن والخصوصية' : 'Security & Privacy' }}
      </h1>
      <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]" :class="isDark ? 'text-white/60' : 'text-black/50'">
        {{ currentLang === 'ar' ? 'إدارة إعدادات الأمان والخصوصية لحسابك' : 'Manage your account security and privacy settings' }}
      </p>
    </div>

    <div class="space-y-6">
      <!-- 1. CHANGE PASSWORD CARD -->
      <div class="rounded-2xl border p-6 transition-all duration-300"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">
        
        <div class="flex items-start gap-4 mb-6">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
            :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E6FFF9] text-[#013E32]'">
            <img src="/images/icons/Change-Password.svg" class="w-6" />
          </div>
          <div>
            <h2 class="text-[24px] font-regular text-black mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
              {{ currentLang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password' }}
            </h2>
            <p class="text-[14px] text-[#000000CC] mb-6">
              {{ currentLang === 'ar' ? 'قم بتحديث كلمة المرور بانتظام للحفاظ على أمان حسابك' : 'Update your password regularly to keep your account secure' }}
            </p>
          </div>
        </div>

        <form @submit.prevent="handleUpdatePassword" class="space-y-4 max-w-xl">
          <!-- Current Password -->
          <div class="flex flex-col gap-1.5">
            <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
              {{ currentLang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password' }}
            </label>
            <div class="relative">
              <input :type="showCurrentPassword ? 'text' : 'password'"
                v-model="passwordForm.current"
                class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all"
                :class="isDark 
                  ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white' 
                  : 'bg-white border text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'"
                :style="!isDark ? 'border-color: #A2E8D6;' : ''"
                :placeholder="currentLang === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Enter current password'"
                required />
              <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div class="flex flex-col gap-1.5">
            <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
              {{ currentLang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password' }}
            </label>
            <div class="relative">
              <input :type="showNewPassword ? 'text' : 'password'"
                v-model="passwordForm.new"
                class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all"
                :class="isDark 
                  ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white' 
                  : 'bg-white border text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'"
                :style="!isDark ? 'border-color: #A2E8D6;' : ''"
                :placeholder="currentLang === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'"
                required />
              <button type="button" @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="flex flex-col gap-1.5">
            <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
              {{ currentLang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password' }}
            </label>
            <div class="relative">
              <input :type="showConfirmPassword ? 'text' : 'password'"
                v-model="passwordForm.confirm"
                class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all"
                :class="isDark 
                  ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white' 
                  : 'bg-white border text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'"
                :style="!isDark ? 'border-color: #A2E8D6;' : ''"
                :placeholder="currentLang === 'ar' ? 'أعد إدخال كلمة المرور الجديدة' : 'Confirm new password'"
                required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Notification Toast/Alert in card -->
          <Transition name="fade">
            <div v-if="passwordStatus.message" class="p-3.5 rounded-xl text-sm border font-medium flex items-center gap-2"
              :class="passwordStatus.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-300'">
              <svg v-if="passwordStatus.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ passwordStatus.message }}</span>
            </div>
          </Transition>

          <button type="submit"
            @mouseenter="isBtnHovered = true"
            @mouseleave="isBtnHovered = false"
            class="transition-all transform active:scale-95 text-center flex items-center justify-center font-normal"
            :class="isDark
              ? 'shadow-[0_4px_12px_rgba(0,146,118,0.2)]'
              : 'shadow-[0_4px_12px_rgba(0,146,118,0.15)]'"
            :style="{ 
              backgroundColor: isBtnHovered ? '#007b63' : '#009276',
              fontWeight: '400',
              fontSize: '14px',
              width: '180px',
              height: '40px',
              borderRadius: '8px',
              color: '#FFFFFF'
            }">
            {{ currentLang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- 2. TWO-FACTOR AUTHENTICATION CARD -->
      <div class="rounded-2xl border p-6 transition-all duration-300"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">
        
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[#E8FCF2] dark:bg-teal-950 text-[#00835D]">
              <!-- Shield Check Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <h2 class="leading-tight"
                :style="{ 
                  fontFamily: 'Noto Sans Arabic, sans-serif', 
                  fontWeight: '400', 
                  fontSize: '18px', 
                  color: isDark ? '#FFFFFF' : '#000000' 
                }">
                {{ currentLang === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication' }}
              </h2>
              <p class="mt-1"
                :style="{ 
                  fontWeight: '400', 
                  fontSize: '14px', 
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' 
                }">
                {{ currentLang === 'ar' ? 'إضافة طبقة حماية إضافية لحسابك' : 'Add an extra layer of security to your account' }}
              </p>
            </div>
          </div>

          <!-- Switch Toggle Button -->
          <button @click="twoFactorEnabled = !twoFactorEnabled"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shrink-0"
            :style="{ 
              backgroundColor: twoFactorEnabled ? '#009276' : (isDark ? '#374151' : '#E5E7EB') 
            }">
            <span class="inline-block h-5 w-5 rounded-full bg-white transition-all border-[3px]"
              :style="{ 
                borderColor: twoFactorEnabled ? '#009276' : (isDark ? '#374151' : '#E5E7EB'),
                transform: twoFactorEnabled ? (currentLang === 'ar' ? 'translateX(-22px)' : 'translateX(22px)') : (currentLang === 'ar' ? 'translateX(-2px)' : 'translateX(2px)')
              }"></span>
          </button>
        </div>

        <!-- Banner alert -->
        <Transition name="slide">
          <div class="mt-4 p-4 rounded-lg text-[14px] leading-relaxed transition-all"
            :class="twoFactorEnabled
              ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950 text-emerald-800 dark:text-emerald-300 border'
              : 'border dark:bg-blue-950/20 dark:border-blue-950/50 dark:text-blue-300'"
            :style="!twoFactorEnabled && !isDark ? { 
              backgroundColor: '#EFF6FF', 
              border: '1px solid #BEDBFF', 
              padding: '25px', 
              color: '#1C398E',
              fontSize: '14px',
              fontWeight: '400'
            } : {
              padding: '25px'
            }">
            <p v-if="!twoFactorEnabled">
              {{ currentLang === 'ar'
                ? 'المصادقة الثنائية معطلة حاليًا. قم بتمكينها لإضافة طبقة أمان إضافية باستخدام جهازك المحمول.'
                : 'Two-factor authentication is currently disabled. Enable it to add an extra layer of security using your mobile device.' }}
            </p>
            <p v-else>
              {{ currentLang === 'ar'
                ? 'لقد تم تمكين المصادقة الثنائية لحسابك بنجاح. سيتم طلب رمز أمان إضافي عند تسجيل الدخول.'
                : 'Two-factor authentication is successfully enabled for your account. An extra security token will be required during login.' }}
            </p>
          </div>
        </Transition>
      </div>

      <!-- 3. ACTIVE SESSIONS CARD -->
      <div class="rounded-2xl border p-6 transition-all duration-300"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">
        
        <div class="flex items-start gap-4 mb-6">
          <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors"
            :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E8FCF2] text-[#00835D]'">
            <!-- Clock Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="leading-tight"
              :style="{ 
                fontFamily: 'Noto Sans Arabic, sans-serif', 
                fontWeight: '400', 
                fontSize: '18px', 
                color: isDark ? '#FFFFFF' : '#000000' 
              }">
              {{ currentLang === 'ar' ? 'الجلسات النشطة' : 'Active Sessions' }}
            </h2>
            <p class="mt-1"
              :style="{ 
                fontWeight: '400', 
                fontSize: '14px', 
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' 
              }">
              {{ currentLang === 'ar' ? 'إدارة الأجهزة التي قمت بتسجيل الدخول منها حاليًا' : 'Manage devices where you\'re currently signed in' }}
            </p>
          </div>
        </div>

        <!-- Sessions List -->
        <div class="space-y-3">
          <div v-for="session in sessions" :key="session.id"
            class="flex items-center justify-between p-4 rounded-xl border transition-all"
            :class="isDark ? 'bg-[#00251e]/80 border-teal-950/60' : ''"
            :style="!isDark ? { backgroundColor: '#EAFCF4', borderColor: '#A2E8D6' } : {}">
            
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors flex-shrink-0"
                :class="isDark ? 'bg-teal-950/80 border-teal-900 text-teal-300' : 'bg-white border-[#A2E8D6] text-gray-400'">
                <!-- Device Icon (Dynamic) -->
                <svg v-if="session.device === 'desktop'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>

              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-normal text-[16px]" :style="{ color: isDark ? '#FFFFFF' : '#000000' }">{{ session.browser }}</span>
                  <span v-if="session.isCurrent"
                    class="px-2 py-0.5 text-[10px] font-semibold rounded-full"
                    :class="isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-[#E6FFF9] text-[#00896F] border border-[#A2E8D6]'">
                    {{ currentLang === 'ar' ? 'الحالي' : 'Current' }}
                  </span>
                </div>
                <div class="mt-0.5"
                  :style="{ 
                    fontWeight: '400', 
                    fontSize: '14px', 
                    color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#000000CC' 
                  }">
                  {{ session.location }}
                </div>
                <div class="mt-0.5"
                  :style="{ 
                    fontWeight: '400', 
                    fontSize: '12px', 
                    color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' 
                  }">
                  {{ currentLang === 'ar' ? 'نشط منذ: ' : 'Last active: ' }} {{ session.lastActive }}
                </div>
              </div>
            </div>

            <!-- Sign Out action button -->
             <button v-if="!session.isCurrent" @click="signOutSession(session.id)"
               @mouseenter="hoveredSessionId = session.id"
               @mouseleave="hoveredSessionId = null"
               class="transition-all transform active:scale-95 text-center px-3 py-1.5 font-normal"
               :style="{
                 backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
                 borderRadius: '8px',
                 border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #0000001A',
                 color: hoveredSessionId === session.id ? '#d62d04' : '#FF3908',
                 fontSize: '14px',
                 fontWeight: '400',
                 cursor: 'pointer'
               }">
               {{ currentLang === 'ar' ? 'تسجيل الخروج' : 'Sign Out' }}
             </button>
          </div>
        </div>

        <!-- Sign Out All Button -->
        <button v-if="sessions.length > 1" @click="signOutAllOtherSessions"
          @mouseenter="isSignOutAllHovered = true"
          @mouseleave="isSignOutAllHovered = false"
          class="w-full mt-4 py-2.5 border rounded-xl text-sm font-medium transition-all text-center"
          :class="isDark 
            ? 'dark:bg-transparent dark:border-red-950 dark:hover:bg-red-950/20' 
            : 'bg-white hover:bg-red-50/50'"
          :style="{
            borderColor: isDark ? '' : '#0000001A',
            color: isSignOutAllHovered ? '#d62d04' : '#FF3908'
          }">
          {{ currentLang === 'ar' ? 'تسجيل الخروج من جميع الجلسات الأخرى' : 'Sign Out All Other Sessions' }}
        </button>
      </div>

      <!-- 4. SESSION MANAGEMENT CARD -->
      <div class="rounded-2xl border p-6 transition-all duration-300"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">
        
        <h2 class="font-medium text-lg" :class="isDark ? 'text-white' : 'text-[#013E32]'">
          {{ currentLang === 'ar' ? 'إدارة الجلسات' : 'Session Management' }}
        </h2>
        <p class="text-xs transition-colors mb-6" :class="isDark ? 'text-white/60' : 'text-black/50'">
          {{ currentLang === 'ar' ? 'التحكم في مدة بقاء تسجيل الدخول نشطًا' : 'Control how long you stay logged in' }}
        </p>

        <div class="flex flex-col gap-1.5 max-w-sm">
          <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
            {{ currentLang === 'ar' ? 'مهلة الجلسة (بالدقائق)' : 'Session Timeout (minutes)' }}
          </label>
          <div class="relative">
            <select v-model="sessionTimeout"
              class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all appearance-none pr-10"
              :class="isDark 
                ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white' 
                : 'bg-white border text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'"
              :style="!isDark ? 'border-color: #A2E8D6;' : ''">
              <option value="15 minutes">{{ currentLang === 'ar' ? '15 دقيقة' : '15 minutes' }}</option>
              <option value="30 minutes">{{ currentLang === 'ar' ? '30 دقيقة' : '30 minutes' }}</option>
              <option value="1 hour">{{ currentLang === 'ar' ? 'ساعة واحدة' : '1 hour' }}</option>
              <option value="4 hours">{{ currentLang === 'ar' ? '4 ساعات' : '4 hours' }}</option>
              <option value="1 day">{{ currentLang === 'ar' ? 'يوم واحد' : '1 day' }}</option>
            </select>
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. PRIVACY SETTINGS CARD -->
      <div class="rounded-2xl border p-6 transition-all duration-300"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">
        
        <div class="flex items-start gap-4 mb-6">
          <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors"
            :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E8FCF2] text-[#00835D]'">
            <!-- Eye / Privacy Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h2 class="leading-tight"
              :style="{ 
                fontFamily: 'Noto Sans Arabic, sans-serif', 
                fontWeight: '400', 
                fontSize: '18px', 
                color: isDark ? '#FFFFFF' : '#000000' 
              }">
              {{ currentLang === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings' }}
            </h2>
            <p class="mt-1"
              :style="{ 
                fontWeight: '400', 
                fontSize: '14px', 
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' 
              }">
              {{ currentLang === 'ar' ? 'التحكم في كيفية استخدام بياناتك ومشاركتها' : 'Control how your data is used and shared' }}
            </p>
          </div>
        </div>

        <!-- Privacy toggles list -->
        <div class="space-y-6">
          <!-- Toggle 1 -->
          <div class="flex items-center justify-between gap-6 pb-4 border-b border-teal-500/10">
            <div>
              <h3 :style="{ fontWeight: '400', fontSize: '16px', color: isDark ? '#FFFFFF' : '#000000' }">
                {{ currentLang === 'ar' ? 'مشاركة بيانات الاستخدام لتحسين المنصة' : 'Share usage data for platform improvement' }}
              </h3>
              <p class="mt-1" :style="{ fontWeight: '400', fontSize: '14px', color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' }">
                {{ currentLang === 'ar' ? 'ساعدنا في تحسين TaxAid من خلال مشاركة إحصاءات الاستخدام المجهولة' : 'Help us improve TaxAid by sharing anonymous usage statistics' }}
              </p>
            </div>
            <button @click="shareUsageData = !shareUsageData"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shrink-0"
              :style="{ 
                backgroundColor: shareUsageData ? '#009276' : (isDark ? '#374151' : '#E5E7EB') 
              }">
              <span class="inline-block h-5 w-5 rounded-full bg-white transition-all border-[3px]"
                :style="{ 
                  borderColor: shareUsageData ? '#009276' : (isDark ? '#374151' : '#E5E7EB'),
                  transform: shareUsageData ? (currentLang === 'ar' ? 'translateX(-22px)' : 'translateX(22px)') : (currentLang === 'ar' ? 'translateX(-2px)' : 'translateX(2px)')
                }"></span>
            </button>
          </div>

          <!-- Toggle 2 -->
          <div class="flex items-center justify-between gap-6 pb-4 border-b border-teal-500/10">
            <div>
              <h3 :style="{ fontWeight: '400', fontSize: '16px', color: isDark ? '#FFFFFF' : '#000000' }">
                {{ currentLang === 'ar' ? 'أرسل لي بريدًا إلكترونيًا حول تحديثات المنتج' : 'Email me about product updates' }}
              </h3>
              <p class="mt-1" :style="{ fontWeight: '400', fontSize: '14px', color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' }">
                {{ currentLang === 'ar' ? 'تلقي النشرات الإخبارية حول الميزات والتحسينات الجديدة' : 'Receive newsletters about new features and improvements' }}
              </p>
            </div>
            <button @click="emailUpdates = !emailUpdates"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shrink-0"
              :style="{ 
                backgroundColor: emailUpdates ? '#009276' : (isDark ? '#374151' : '#E5E7EB') 
              }">
              <span class="inline-block h-5 w-5 rounded-full bg-white transition-all border-[3px]"
                :style="{ 
                  borderColor: emailUpdates ? '#009276' : (isDark ? '#374151' : '#E5E7EB'),
                  transform: emailUpdates ? (currentLang === 'ar' ? 'translateX(-22px)' : 'translateX(22px)') : (currentLang === 'ar' ? 'translateX(-2px)' : 'translateX(2px)')
                }"></span>
            </button>
          </div>

          <!-- Toggle 3 -->
          <div class="flex items-center justify-between gap-6 pb-4 border-b border-teal-500/10">
            <div>
              <h3 :style="{ fontWeight: '400', fontSize: '16px', color: isDark ? '#FFFFFF' : '#000000' }">
                {{ currentLang === 'ar' ? 'السماح لفريق الدعم بالوصول إلى بياناتي' : 'Allow support team access to my data' }}
              </h3>
              <p class="mt-1" :style="{ fontWeight: '400', fontSize: '14px', color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' }">
                {{ currentLang === 'ar' ? 'السماح لفريق دعم TaxAid بعرض بياناتك بشكل آمن فقط عند حل المشكلات.' : 'Permit the TaxAid support team to securely view your data only when resolving issues.' }}
              </p>
            </div>
            <button @click="allowSupportAccess = !allowSupportAccess"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shrink-0"
              :style="{ 
                backgroundColor: allowSupportAccess ? '#009276' : (isDark ? '#374151' : '#E5E7EB') 
              }">
              <span class="inline-block h-5 w-5 rounded-full bg-white transition-all border-[3px]"
                :style="{ 
                  borderColor: allowSupportAccess ? '#009276' : (isDark ? '#374151' : '#E5E7EB'),
                  transform: allowSupportAccess ? (currentLang === 'ar' ? 'translateX(-22px)' : 'translateX(22px)') : (currentLang === 'ar' ? 'translateX(-2px)' : 'translateX(2px)')
                }"></span>
            </button>
          </div>

          <!-- Inner Card: Data Management -->
          <div class="rounded-xl p-4 border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all"
            :class="isDark ? 'bg-[#00251E] border-teal-950' : ''"
            :style="!isDark ? { backgroundColor: '#EAFCF4', borderColor: '#A2E8D6' } : {}">
            <div>
              <h4 :style="{ fontWeight: '400', fontSize: '16px', color: isDark ? '#FFFFFF' : '#000000' }">
                {{ currentLang === 'ar' ? 'إدارة البيانات' : 'Data Management' }}
              </h4>
            </div>
            <button @click="downloadData"
              class="transition-all transform active:scale-95 text-center px-4 py-2 font-normal"
              :style="{
                backgroundColor: isDark ? '#002E26' : '#FFFFFF',
                borderRadius: '8px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #0000001A',
                color: isDark ? '#FFFFFF' : '#000000',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer'
              }">
              {{ currentLang === 'ar' ? 'تنزيل بياناتي' : 'Download My Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isBtnHovered = ref(false)
const hoveredSessionId = ref(null)
const isSignOutAllHovered = ref(false)

// Change Password form states
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStatus = reactive({
  type: '',
  message: ''
})

const handleUpdatePassword = () => {
  passwordStatus.message = ''
  
  if (passwordForm.new !== passwordForm.confirm) {
    passwordStatus.type = 'error'
    passwordStatus.message = currentLang.value === 'ar' 
      ? 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين.' 
      : 'New password and confirm password do not match.'
    return
  }

  if (passwordForm.new.length < 8) {
    passwordStatus.type = 'error'
    passwordStatus.message = currentLang.value === 'ar'
      ? 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.'
      : 'New password must be at least 8 characters long.'
    return
  }

  // Simulate API success
  passwordStatus.type = 'success'
  passwordStatus.message = currentLang.value === 'ar'
    ? 'تم تحديث كلمة المرور الخاصة بك بنجاح!'
    : 'Your password has been updated successfully!'
  
  // Reset Form fields
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''

  setTimeout(() => {
    passwordStatus.message = ''
  }, 4000)
}

// 2FA state
const twoFactorEnabled = ref(false)

// Active Sessions state
const sessions = ref([
  {
    id: 1,
    browser: 'Chrome on Windows',
    location: 'New York, USA',
    lastActive: '5 minutes ago',
    device: 'desktop',
    isCurrent: true
  },
  {
    id: 2,
    browser: 'Safari on iPhone',
    location: 'New York, USA',
    lastActive: '2 hours ago',
    device: 'mobile',
    isCurrent: false
  },
  {
    id: 3,
    browser: 'Firefox on MacBook',
    location: 'Boston, USA',
    lastActive: '1 day ago',
    device: 'desktop',
    isCurrent: false
  }
])

const signOutSession = (id) => {
  sessions.value = sessions.value.filter(session => session.id !== id)
}

const signOutAllOtherSessions = () => {
  sessions.value = sessions.value.filter(session => session.isCurrent)
}

// Session Management Timeout
const sessionTimeout = ref('30 minutes')

// Privacy Settings switches
const shareUsageData = ref(false)
const emailUpdates = ref(false)
const allowSupportAccess = ref(true)

const downloadData = () => {
  alert(currentLang.value === 'ar' 
    ? 'بدأ تنزيل بياناتك. سيتم إرسال بريد إلكتروني عند انتهاء التصدير.'
    : 'Your data download has started. An email will be sent once the export is ready.'
  )
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
