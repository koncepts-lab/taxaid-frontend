<template>
  <div class="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4 relative font-sans" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    
    <!-- Login Card -->
    <div class="w-full max-w-[600px] bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-12 flex flex-col items-center">
      
      <!-- Logo -->
      <NuxtLink to="/home" class="mb-6">
        <img src="/images/logo.svg" alt="Taxaid.AI" class="text-center text-[32px] font-semibold text-[#000] mb-3" />
      </NuxtLink>

      <!-- Header Content -->
      <h1 class="text-[24px] font-semibold text-[#1a1a1a] mb-1.5 text-center">
        {{ currentLang === 'ar' ? titleAr : title }}
      </h1>
      <p class="text-center text-[16px] text-[#00000052] font-normal leading-relaxed mb-10 px-4">
        {{ currentLang === 'ar' ? subtitleAr : subtitle }}
      </p>

      <!-- Form -->
      <form @submit.prevent="onLogin" class="w-full space-y-5">

        <!-- Email Address -->
        <div class="relative">
          <label class="block text-[14px] font-normal text-[#0A0A0A] mb-2">
            {{ currentLang === 'ar' ? labels.emailAr : labels.email }}
          </label>
          <div class="relative">
            <span class="absolute top-1/2 -translate-y-1/2 text-[#94a3b8]" :class="currentLang === 'ar' ? 'right-4' : 'left-4'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input 
              v-model="email" 
              type="email" 
              :placeholder="currentLang === 'ar' ? placeholders.emailAr || placeholders.email : placeholders.email"
              class="h-[48px] w-full border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#00705a] text-[14px] font-normal text-[#0A0A0A] placeholder:text-[#717182] transition-all"
              :class="currentLang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block text-[14px] font-normal text-[#0A0A0A] mb-2">
            {{ currentLang === 'ar' ? labels.passwordAr : labels.password }}
          </label>
          <div class="relative">
            <span class="absolute top-1/2 -translate-y-1/2 text-[#94a3b8]" :class="currentLang === 'ar' ? 'right-4' : 'left-4'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input 
              v-model="password" 
              type="password" 
              :placeholder="currentLang === 'ar' ? placeholders.passwordAr || placeholders.password : placeholders.password"
              class="h-[48px] w-full border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#00705a] text-[14px] font-normal text-[#0A0A0A] placeholder:text-[#717182] transition-all"
              :class="currentLang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'"
              required
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="loginError" class="p-3 rounded-xl text-sm text-center font-medium bg-red-50 text-red-600">{{ loginError }}</div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoggingIn"
          class="w-full h-[48px] bg-[#007C65] hover:bg-[#006552] text-white font-medium rounded-[10px] transition-all duration-300 mt-4 active:scale-[0.98] shadow-lg shadow-[#007C6533] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isLoggingIn ? 'Signing in…' : (currentLang === 'ar' ? labels.submitAr : labels.submit) }}
        </button>

      </form>
    </div>

    <!-- Page Footer (Relative to screen, matches Image 2) -->
    <div class="fixed bottom-6 text-[#999] text-[13px] font-normal z-0" :class="currentLang === 'ar' ? 'right-6' : 'left-6'">
      {{ currentLang === 'ar' ? footer.copyrightAr : footer.copyright }}
    </div>
    <div class="fixed bottom-6 text-[#999] text-[13px] font-normal z-0" :class="currentLang === 'ar' ? 'left-6' : 'right-6'">
      {{ currentLang === 'ar' ? footer.lastSyncAr : footer.lastSync }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: false
})

const pageContent = {
  "title": "Partner Login",
  "titleAr": "تسجيل دخول الشريك",
  "subtitle": "Track your referred clients, earnings and payments",
  "subtitleAr": "تتبع عملائك المُحالين وأرباحك ومدفوعاتك",
  "roles": [
    "Partner",
    "Accounts",
    "Admin"
  ],
  "rolesAr": [
    "شريك",
    "حسابات",
    "مسؤول"
  ],
  "labels": {
    "loginAs": "Login as",
    "loginAsAr": "تسجيل الدخول كـ",
    "email": "Email Address *",
    "emailAr": "عنوان البريد الإلكتروني *",
    "password": "Password *",
    "passwordAr": "كلمة المرور *",
    "submit": "Login to Dashboard",
    "submitAr": "تسجيل الدخول إلى لوحة التحكم"
  },
  "placeholders": {
    "email": "your.email@company.com",
    "password": "Min. 6 characters",
    "passwordAr": "6 أحرف كحد أدنى"
  },
  "footer": {
    "copyright": "Copyright Reserved @2025",
    "copyrightAr": "جميع الحقوق محفوظة @2025",
    "lastSync": "Last Sync: 19 Oct 2025, 10:45 AM IST",
    "lastSyncAr": "آخر تزامن: 19 أكتوبر 2025، 10:45 صباحًا بتوقيت IST"
  }
}

const { title, titleAr, subtitle, subtitleAr, labels, placeholders, footer } = pageContent

const { login } = useRevenueAuth()

const currentLang  = useState('currentLang', () => 'en')
const email        = ref('')
const password     = ref('')
const isLoggingIn  = ref(false)
const loginError   = ref('')

async function onLogin() {
  if (isLoggingIn.value) return
  loginError.value = ''
  isLoggingIn.value = true
  try {
    await login(email.value, password.value)
  } catch (err) {
    loginError.value = err?.data?.message ?? 'Login failed. Please check your credentials.'
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

input:focus {
  background-color: #f8fafc;
}

/* Remove browser autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #0A0A0A !important;
}
</style>
