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

      <!-- 1b. COMPANY MAIL SETTINGS CARD (tenant SMTP — reminders & internal mails) -->
      <div class="rounded-2xl border p-6 transition-all duration-300"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

        <div class="flex items-start justify-between gap-4 mb-6">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E6FFF9] text-[#013E32]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h2 class="text-[24px] font-regular mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                {{ currentLang === 'ar' ? 'إعدادات بريد الشركة' : 'Company Mail Settings' }}
              </h2>
              <p class="text-[14px] mb-2" :class="isDark ? 'text-white/60' : 'text-[#000000CC]'">
                {{ currentLang === 'ar'
                  ? 'تُرسل تذكيرات الدفع والبريد الداخلي عبر خادم بريد شركتك (Google أو Microsoft أو أي SMTP)'
                  : 'Payment reminders and internal mails are sent through YOUR company mail server (Google, Microsoft, or any SMTP)' }}
              </p>
            </div>
          </div>
          <!-- Verified badge -->
          <span v-if="mailSettings?.verified_at"
            class="px-3 py-1 text-[11px] font-semibold rounded-full shrink-0"
            :class="isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-[#E6FFF9] text-[#00896F] border border-[#A2E8D6]'">
            {{ currentLang === 'ar' ? 'تم التحقق ✓' : 'Verified ✓' }}
          </span>
          <span v-else-if="mailSettings"
            class="px-3 py-1 text-[11px] font-semibold rounded-full shrink-0 bg-amber-50 text-amber-700 border border-amber-200">
            {{ currentLang === 'ar' ? 'غير مُتحقق' : 'Not verified' }}
          </span>
        </div>

        <div class="space-y-5 max-w-xl">
          <!-- Action buttons: Mailer Settings (modal) + Send Test Mail (modal) -->
          <div class="flex flex-wrap gap-3">
            <button type="button" @click="openMailerModal"
              class="transition-all transform active:scale-95 flex items-center gap-2 font-normal text-white px-5"
              :style="{ backgroundColor: '#009276', fontSize: '14px', height: '42px', borderRadius: '8px' }">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ mailSettings ? (currentLang === 'ar' ? 'إعدادات المرسل' : 'Mailer Settings') : (currentLang === 'ar' ? 'إعداد المرسل' : 'Set up Mailer') }}
            </button>
            <button type="button" @click="openTestModal" :disabled="!mailSettings"
              class="transition-all transform active:scale-95 flex items-center gap-2 font-normal border px-5 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isDark ? 'border-teal-800 text-white' : 'text-[#013E32]'"
              :style="{ fontSize: '14px', height: '42px', borderRadius: '8px', borderColor: !isDark ? '#A2E8D6' : undefined }">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {{ currentLang === 'ar' ? 'إرسال بريد تجريبي' : 'Send Test Mail' }}
            </button>
          </div>

          <!-- Status banner -->
          <Transition name="fade">
            <div v-if="mailStatus.message" class="p-3.5 rounded-xl text-sm border font-medium flex items-center gap-2"
              :class="mailStatus.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-300'">
              <span>{{ mailStatus.message }}</span>
            </div>
          </Transition>

          <!-- Internal mail recipients (departments from the Internal Email Directory) — kept -->
          <div class="flex flex-col gap-1.5 pt-2 border-t" :class="isDark ? 'border-teal-950/60' : 'border-[#EAF7F3]'">
            <label class="block text-[14px] mb-1" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
              {{ currentLang === 'ar' ? 'إرسال البريد الداخلي إلى الأقسام' : 'Send internal mails to departments' }}
            </label>
            <p class="text-[12px] mb-2" :class="isDark ? 'text-white/50' : 'text-black/40'">
              {{ currentLang === 'ar'
                ? 'بدون تحديد = يُرسل إلى جميع عناوين البريد الداخلي'
                : 'Nothing ticked = sent to ALL internal email directory entries' }}
            </p>
            <div v-if="availableDepartments.length" class="flex flex-wrap gap-3">
              <label v-for="d in availableDepartments" :key="d"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all"
                :class="mailForm.internal_departments.includes(d)
                  ? (isDark ? 'border-[#00B68D] bg-teal-950/60 text-white' : 'border-[#00896F] bg-[#E6FFF9] text-[#013E32]')
                  : (isDark ? 'border-teal-900 text-white/70' : 'border-[#A2E8D6] text-gray-600')">
                <input type="checkbox" :value="d" v-model="mailForm.internal_departments" class="accent-[#009276]" />
                {{ d }}
              </label>
            </div>
            <p v-else class="text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/40'">
              {{ currentLang === 'ar'
                ? 'لا توجد أقسام بعد — أضف موظفين في دليل البريد الداخلي (مصادر البيانات)'
                : 'No departments yet — add employees in the Internal Email Directory (Data Source page)' }}
            </p>
          </div>

          <!-- Save departments (only when mailer is configured) -->
          <button v-if="mailSettings" type="button" @click="handleSaveDepartments" :disabled="mailSaving"
            class="mt-3 transition-all transform active:scale-95 font-normal disabled:opacity-50 px-5"
            :style="{ backgroundColor: '#009276', fontSize: '14px', height: '40px', borderRadius: '8px', color: '#FFFFFF' }">
            {{ mailSaving ? '...' : (currentLang === 'ar' ? 'حفظ الأقسام' : 'Save Departments') }}
          </button>
        </div>
      </div>

      <!-- Mailer Settings Modal (SMTP config) -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showMailerModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="showMailerModal = false">
            <div class="w-full max-w-lg rounded-2xl bg-white max-h-[90vh] overflow-y-auto shadow-2xl">
              <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-900">{{ currentLang === 'ar' ? 'إعدادات المرسل (SMTP)' : 'Mailer Settings (SMTP)' }}</h2>
                <button @click="showMailerModal = false" class="text-gray-400 hover:text-gray-600">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <form @submit.prevent="handleSaveMailer" class="p-7 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'خادم SMTP *' : 'SMTP Host *' }}</label>
                    <input type="text" v-model="mailForm.host" required placeholder="smtp.gmail.com"
                      class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                  </div>
                  <div>
                    <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'المنفذ *' : 'Port *' }}</label>
                    <input type="number" v-model="mailForm.port" required placeholder="587" min="1" max="65535"
                      class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                  </div>
                </div>
                <div>
                  <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'التشفير' : 'Encryption' }}</label>
                  <select v-model="mailForm.encryption"
                    class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F]">
                    <option value="tls">TLS (587)</option>
                    <option value="ssl">SSL (465)</option>
                    <option :value="null">{{ currentLang === 'ar' ? 'بدون' : 'None' }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'اسم المستخدم *' : 'Username *' }}</label>
                  <input type="text" v-model="mailForm.username" required placeholder="accounts@yourcompany.com"
                    class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                </div>
                <div>
                  <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'كلمة المرور / كلمة مرور التطبيق *' : 'Password / App Password *' }}</label>
                  <input type="password" v-model="mailForm.password" :required="!mailSettings"
                    :placeholder="mailSettings ? (currentLang === 'ar' ? '•••••••• (اتركه لعدم التغيير)' : '•••••••• (leave blank to keep)') : (currentLang === 'ar' ? 'كلمة مرور SMTP' : 'SMTP password or app password')"
                    class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'عنوان المرسل *' : 'From Address *' }}</label>
                    <input type="email" v-model="mailForm.from_address" required placeholder="accounts@yourcompany.com"
                      class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                  </div>
                  <div>
                    <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'اسم المرسل' : 'From Name' }}</label>
                    <input type="text" v-model="mailForm.from_name" :placeholder="currentLang === 'ar' ? 'اسم شركتك' : 'Your Company Name'"
                      class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                  </div>
                </div>
                <p v-if="modalError" class="text-sm text-red-500">{{ modalError }}</p>
                <div class="flex gap-3 pt-2">
                  <button type="submit" :disabled="mailSaving"
                    class="flex-1 h-11 rounded-lg text-white text-sm font-medium disabled:opacity-50" style="background-color:#009276">
                    {{ mailSaving ? '...' : (currentLang === 'ar' ? 'حفظ' : 'Save') }}
                  </button>
                  <button type="button" @click="showMailerModal = false"
                    class="flex-1 h-11 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                    {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Send Test Mail Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showTestModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="showTestModal = false">
            <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl">
              <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-900">{{ currentLang === 'ar' ? 'إرسال بريد تجريبي' : 'Send Test Mail' }}</h2>
                <button @click="showTestModal = false" class="text-gray-400 hover:text-gray-600">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="p-7 space-y-4">
                <div>
                  <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'إرسال إلى' : 'Send to' }}</label>
                  <input type="email" v-model="testEmail" :placeholder="currentLang === 'ar' ? 'بريدك الإلكتروني' : 'your@email.com'"
                    class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
                  <p class="text-[12px] text-gray-400 mt-1.5">{{ currentLang === 'ar' ? 'افتراضيًا بريد حسابك عند تركه فارغًا' : 'Defaults to your login email if left blank' }}</p>
                </div>
                <div class="flex gap-3 pt-1">
                  <button type="button" @click="handleTestMail" :disabled="mailTesting"
                    class="flex-1 h-11 rounded-lg text-white text-sm font-medium disabled:opacity-50" style="background-color:#009276">
                    {{ mailTesting ? '...' : (currentLang === 'ar' ? 'إرسال' : 'Send Test') }}
                  </button>
                  <button type="button" @click="showTestModal = false"
                    class="flex-1 h-11 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                    {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

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
import { ref, reactive, watch, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

// ── Company Mail Settings ────────────────────────────────────────────────────
const {
  settings: mailSettings,
  availableDepartments,
  saving: mailSaving,
  testing: mailTesting,
  fetchSettings: fetchMailSettings,
  saveSettings: saveMailSettings,
  sendTestMail,
} = useMailSettings()

const mailForm = reactive({
  host: '', port: 587, encryption: 'tls', username: '', password: '',
  from_address: '', from_name: '', internal_departments: [],
})
const mailStatus = reactive({ type: '', message: '' })
const showMailerModal = ref(false)
const showTestModal = ref(false)
const modalError = ref('')
const testEmail = ref('')

const syncMailForm = () => {
  if (!mailSettings.value) return
  const s = mailSettings.value
  mailForm.host = s.host ?? ''
  mailForm.port = s.port ?? 587
  mailForm.encryption = s.encryption ?? 'tls'
  mailForm.username = s.username ?? ''
  mailForm.password = '' // never echoed back
  mailForm.from_address = s.from_address ?? ''
  mailForm.from_name = s.from_name ?? ''
  mailForm.internal_departments = [...(s.internal_departments ?? [])]
}
watch(mailSettings, syncMailForm)

// Owner email — default recipient for the test-mail modal
const ownerEmail = ref('')
onMounted(async () => {
  await fetchMailSettings()
  try {
    const res = await useApi('/profile')
    ownerEmail.value = res?.data?.email ?? ''
  } catch { /* non-fatal */ }
})

const flashMailStatus = (type, message) => {
  mailStatus.type = type
  mailStatus.message = message
  setTimeout(() => { mailStatus.message = '' }, 5000)
}

const buildMailPayload = () => {
  const p = { ...mailForm, port: Number(mailForm.port) }
  if (!p.password) delete p.password // blank = keep existing (backend allows on update)
  return p
}

const openMailerModal = () => {
  modalError.value = ''
  syncMailForm() // reset from stored settings
  showMailerModal.value = true
}

// Full SMTP save (from the modal)
const handleSaveMailer = async () => {
  modalError.value = ''
  if (!mailSettings.value && !mailForm.password) {
    modalError.value = currentLang.value === 'ar' ? 'كلمة مرور SMTP مطلوبة' : 'SMTP password is required.'
    return
  }
  const res = await saveMailSettings(buildMailPayload())
  if (res.ok) {
    showMailerModal.value = false
    flashMailStatus('success', res.message)
  } else {
    modalError.value = res.message
  }
}

// Departments-only save (keeps stored SMTP + password)
const handleSaveDepartments = async () => {
  const res = await saveMailSettings(buildMailPayload())
  flashMailStatus(res.ok ? 'success' : 'error', res.message)
}

const openTestModal = () => {
  testEmail.value = ownerEmail.value || ''
  showTestModal.value = true
}

const handleTestMail = async () => {
  const res = await sendTestMail(testEmail.value?.trim() || undefined)
  showTestModal.value = false
  flashMailStatus(res.ok ? 'success' : 'error', res.message)
}

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
