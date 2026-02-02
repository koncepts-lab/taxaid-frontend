<template>
  <!-- WELCOME OVERLAY SCREEN -->
  <div v-if="showWelcome" class="min-h-screen w-full bg-[#002B23] flex items-center justify-center relative overflow-hidden text-center p-4">
    <!-- Dynamic Particles from Center -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <div v-for="i in 100" :key="i" 
           class="absolute w-1 h-1 bg-[#00E5B0] rounded-full opacity-0 animate-particle"
           :style="{
             '--x': `${(Math.random() - 0.5) * 100}vw`,
             '--y': `${(Math.random() - 0.5) * 100}vh`,
             '--duration': `${10 + Math.random() * 10}s`,
             '--delay': `${Math.random() * 5}s`
           }">
      </div>
    </div>

    <div class="relative z-10 flex flex-col items-center max-w-2xl w-full animate-fade-in">
      

      <!-- Content Card -->
      <div class="bg-[#04332A]/50 backdrop-blur-sm border border-white/5 rounded-[40px] p-10 md:p-16 w-full shadow-2xl relative overflow-hidden">
        <!-- Glow effect -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0C5B55]/40 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="relative z-10 flex flex-col items-center">
           <!-- Logo -->
           <img :src="welcomeLogoPath" alt="Taxaid" class="w-[160px] mb-8" />

           <h1 class="text-[32px] md:text-[40px] font-bold text-[#00E5B0] mb-2 leading-tight">
             {{ t.welcomeTitle }}
           </h1>
           <h2 class="text-[24px] md:text-[28px] font-medium text-white mb-6">
             {{ t.welcomeSubtitle }}
           </h2>

           <p class="text-[#A0AEC0] text-[16px] leading-relaxed mb-10 max-w-lg mx-auto">
             {{ t.welcomeDesc }}
           </p>

           <button 
             @click="router.push('/onboarding')"
             class="group relative inline-flex items-center justify-center px-8 py-3.5 text-[16px] font-bold text-white transition-all duration-200 bg-[#0C5B55] rounded-full hover:bg-[#0E6B60] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(12,91,85,0.4)]"
           >
             {{ t.getStarted }}
             <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" 
                  :class="isRtl ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
           </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      
      <!-- LEFT : FORM SECTION -->
      <section class="flex flex-col justify-center items-center px-6 lg:px-20 py-10 order-2 lg:order-1 relative bg-[#f8f9fa]">
        <!-- Logo (Absolute Top-Left on Desktop, Relative on Mobile) -->
        <!-- Logic: in RTL, this should be Top-Right? Usually logos stay or flip. Let's flip it for mirroring. -->
        <div class="absolute top-10 hidden lg:block" :class="isRtl ? 'right-10' : 'left-10'">
           <img src="/images/logo.png" alt="Taxaid" class="w-[140px]" />
        </div>
        <div class="w-full max-w-[160px] mb-8 lg:hidden">
           <img src="/images/logo.png" alt="Taxaid" class="w-full" />
        </div>

        <div class="w-full max-w-[420px] pt-10">
          <!-- Dynamic Title -->
          <h1 class="text-center text-[32px] font-bold text-[#1a1a1a] mb-3">
            {{ isLogin ? t.welcome : t.createAccount }}
          </h1>

          <!-- Dynamic Description -->
          <p class="text-center text-[15px] text-[#666666] leading-relaxed mb-10 px-4">
            {{ isLogin ? t.loginDesc : t.signupDesc }}
          </p>

          <form class="space-y-4" @submit.prevent="onSubmit">
            
            <!-- Signup Name -->
            <div v-if="!isLogin">
              <div class="relative group">
                 <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C5B55] transition-colors"
                       :class="isRtl ? 'right-6' : 'left-6'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input 
                  v-model="form.name" 
                  type="text" 
                  :placeholder="t.namePlaceholder" 
                  class="h-[56px] w-full rounded-full border border-[#C2C2C2] bg-white px-14 outline-none focus:border-[#0C5B55] transition-all text-[15px] placeholder:text-gray-400" 
                />
              </div>
            </div>

            <!-- Email -->
            <div class="relative group">
              <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C5B55] transition-colors"
                    :class="isRtl ? 'right-6' : 'left-6'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input 
                v-model="form.email" 
                type="email" 
                :placeholder="t.emailPlaceholder" 
                class="h-[56px] w-full rounded-full border border-[#C2C2C2] bg-white px-14 outline-none focus:border-[#0C5B55] transition-all text-[15px] placeholder:text-gray-400" 
                required 
              />
            </div>
            
            <!-- Password -->
            <div class="relative group">
              <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C5B55] transition-colors"
                    :class="isRtl ? 'right-6' : 'left-6'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                :placeholder="t.passwordPlaceholder" 
                class="h-[56px] w-full rounded-full border border-[#C2C2C2] bg-white px-14 outline-none focus:border-[#0C5B55] transition-all text-[15px] placeholder:text-gray-400" 
                required 
              />
              <button type="button" @click="showPassword = !showPassword" 
                      class="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      :class="isRtl ? 'left-6' : 'right-6'">
                 <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.02 1.29-.05"/><path d="m3 3 18 18"/></svg>
                 <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>

            <!-- Confirm Password (Signup Only) -->
            <div v-if="!isLogin" class="relative group">
              <div class="relative group">
                <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C5B55] transition-colors"
                      :class="isRtl ? 'right-6' : 'left-6'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input 
                  v-model="form.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  :placeholder="t.confirmPlaceholder" 
                  class="h-[56px] w-full rounded-full border border-[#C2C2C2] bg-white px-14 outline-none focus:border-[#0C5B55] transition-all text-[15px] placeholder:text-gray-400" 
                />
                 <button type="button" @click="showConfirmPassword = !showConfirmPassword" 
                         class="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                         :class="isRtl ? 'left-6' : 'right-6'">
                   <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.02 1.29-.05"/><path d="m3 3 18 18"/></svg>
                   <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <!-- Remember & Forgot -->
            <div v-if="isLogin" class="flex items-center justify-between px-2 pt-1">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <div class="relative">
                  <input type="checkbox" class="peer sr-only" checked />
                  <div class="w-5 h-5 border-2 border-[#0C5B55] rounded-md peer-checked:bg-[#0C5B55] transition-colors"></div>
                  <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span class="text-[14px] font-semibold text-[#1a1a1a]">{{ t.rememberMe }}</span>
              </label>
              <button type="button" class="text-[14px] font-semibold text-[#999999] hover:text-[#0C5B55]">{{ t.forgotPassword }}</button>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              class="mt-6 h-[52px] w-full rounded-full text-[16px] font-bold text-white shadow-lg shadow-[#0C5B55]/20 transition-all hover:shadow-[#0C5B55]/30 hover:-translate-y-0.5 active:translate-y-0" 
              style="background: linear-gradient(90deg, #003228 0%, #0E6B60 100%)"
            >
              {{ isLogin ? t.loginBtn : t.signupBtn }}
            </button>

            <!-- Toggle -->
            <p class="pt-4 text-center text-[15px] text-[#999999]">
              {{ isLogin ? t.dontHaveAccount : t.alreadyHaveAccount }}
              <button 
                type="button" 
                @click="isLogin = !isLogin" 
                class="font-bold text-[#00B389] hover:underline ml-1"
              >
                {{ isLogin ? t.signUpLink : t.signInLink }}
              </button>
            </p>

            <!-- Divider -->
            <div class="relative flex items-center py-6">
              <div class="flex-grow border-t border-gray-200"></div>
              <span class="flex-shrink mx-4 text-gray-400 text-sm bg-[#f8f9fa] px-2">{{ t.or }}</span>
              <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <!-- Social Logins -->
            <div class="flex justify-center gap-4">
              <button type="button" class="w-[52px] h-[52px] rounded-full bg-white border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-6 h-6" alt="Google" />
              </button>
              <button type="button" class="w-[52px] h-[52px] rounded-full bg-white border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.91 3.84-.75c.52.01 2.04.13 3 1.57-2.6.76-2.16 3.81.36 4.95-.56 2-1.35 3.98-2.28 6.46zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- RIGHT : HERO SECTION -->
      <section class="items-center justify-center hidden lg:flex h-full relative order-1 lg:order-2 p-4">
        <div class="relative w-full h-full rounded-[20px] flex flex-col items-center justify-center overflow-hidden" 
             style="background: radial-gradient(circle at center, #0C5B55 0%, #002B23 100%)">
          
          <!-- Language Toggle -->
          <div class="absolute top-8 z-50" :class="isRtl ? 'left-8' : 'right-8'">
             <LanguageToggle v-model="currentLanguage" />
          </div>

          <div class="relative z-10 flex flex-col items-center w-full px-10">
             <div class="mb-14 text-center">
                <p class="text-[20px] font-light text-white/70 tracking-wide mb-2">{{ t.heroSub }}</p>
                <h2 class="text-[32px] font-bold text-white leading-tight">{{ t.heroMain }}</h2>
             </div>
             <img 
               src="/images/login-hero.png" 
               class="drop-shadow-2xl transition-transform hover:scale-[1.02] duration-500" 
               style="max-width: 480px; width: 100%" 
               alt="Dashboard"
             />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import LanguageToggle from '@/components/common/LanguageToggle.vue'

const router = useRouter()
const isLogin = ref(true)
const showWelcome = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const currentLanguage = ref('en')

// Using dynamic path to avoid any potential static analysis weirdness
const welcomeLogoPath = '/images/welcome-logo.png'

const isRtl = computed(() => currentLanguage.value === 'ar')

const translations = {
// ... existing translations ...
  en: {
    welcome: 'Welcome',
    createAccount: 'Create Account',
    loginDesc: 'Sign in to access your financial dashboards, AI insights, and ERP data — all in one place.',
    signupDesc: 'Create your account to access smart financial dashboards and AI-powered analytics.',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    confirmPlaceholder: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password',
    loginBtn: 'Login',
    signupBtn: 'Create Account',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUpLink: 'Sign up here',
    signInLink: 'Sign in here',
    or: 'or',
    heroSub: 'Analyze deeper.',
    heroMain: 'Decide faster. Grow smarter.',
    welcomeTitle: 'Welcome to',
    welcomeSubtitle: 'TaxAid Financial Analytics!',
    welcomeDesc: 'Let’s personalize your dashboard to match your business goals. It’ll only take a minute.',
    getStarted: 'Get Started'
  },
  ar: {
    welcome: 'مرحباً',
    createAccount: 'إنشاء حساب',
    loginDesc: 'قم بتسجيل الدخول للوصول إلى لوحات المعلومات المالية ورؤى الذكاء الاصطناعي وبيانات تخطيط موارد المؤسسات - كل ذلك في مكان واحد.',
    signupDesc: 'أنشئ حسابك للوصول إلى لوحات المعلومات المالية الذكية والتحليلات المدعومة بالذكاء الاصطناعي.',
    namePlaceholder: 'اسم',
    emailPlaceholder: 'بريد إلكتروني',
    passwordPlaceholder: 'كلمة المرور',
    confirmPlaceholder: 'تأكيد كلمة المرور',
    rememberMe: 'تذكرنى',
    forgotPassword: 'هل نسيت كلمة السر',
    loginBtn: 'تسجيل الدخول',
    signupBtn: 'إنشاء حساب',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    signUpLink: 'قم بالتسجيل هنا',
    signInLink: 'تسجيل الدخول هنا',
    or: 'أو',
    heroSub: 'تحليل أعمق.',
    heroMain: 'قرر بشكل أسرع. كن أكثر ذكاءً.',
    welcomeTitle: 'مرحبًا بك في',
    welcomeSubtitle: 'TaxAid للتحليلات المالية!',
    welcomeDesc: 'دعنا نخصص لوحة التحكم الخاصة بك لتناسب أهداف عملك. لن يستغرق الأمر سوى دقيقة واحدة.',
    getStarted: 'البدء'
  }
}

const t = computed(() => translations[currentLanguage.value])

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function onSubmit() {
  console.log('Submitting', isLogin.value ? 'Login' : 'Signup', form)
  // Show welcome screen instead of immediate routing
  showWelcome.value = true
}
</script>

<style scoped>
/* Custom Scrollbar for form section if needed */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }

/* Simple fade in animation for the Welcome screen */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-particle {
  animation: particle-move var(--duration) linear infinite;
  animation-delay: var(--delay);
}

@keyframes particle-move {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(1);
    opacity: 0;
  }
}
</style>
