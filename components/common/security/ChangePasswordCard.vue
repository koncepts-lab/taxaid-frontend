<template>
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
        <p class="text-[14px] mb-6" :style="{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' }">
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
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  changePassword: { type: Function, required: true },
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isBtnHovered = ref(false)

const passwordForm = reactive({ current: '', new: '', confirm: '' })
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStatus = reactive({ type: '', message: '' })
const passwordSaving = ref(false)

const handleUpdatePassword = async () => {
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

  if (passwordSaving.value) return
  passwordSaving.value = true

  const res = await props.changePassword(passwordForm.current, passwordForm.new, passwordForm.confirm)

  if (res.ok) {
    passwordStatus.type = 'success'
    passwordStatus.message = currentLang.value === 'ar'
      ? 'تم تحديث كلمة المرور بنجاح! تم تسجيل الخروج من الأجهزة الأخرى.'
      : 'Your password has been updated successfully! Other devices have been logged out.'

    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } else {
    passwordStatus.type = 'error'
    passwordStatus.message = res.message
      || (currentLang.value === 'ar' ? 'حدث خطأ ما، يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.')
  }

  passwordSaving.value = false

  setTimeout(() => {
    passwordStatus.message = ''
  }, 4000)
}
</script>
