<template>
  <div class="min-h-screen w-full overflow-auto bg-[#F4F2EF] p-4 sm:p-6 lg:p-[25px]">
    <div class="grid h-full min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-50px)] w-full grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 overflow-hidden bg-[#F4F2EF]">
      
      <!-- LEFT : FORM SECTION -->
      <section class="relative flex flex-col p-0 order-1 lg:order-1">
        <div class="flex items-center gap-3 mb-6 lg:mb-0">
          <img src="/images/logo.png" alt="Taxaid" class="w-full max-w-[180px] sm:max-w-[220px] lg:max-w-[250px]" />
        </div>

        <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6 lg:py-0">
          <h1 class="text-center text-[24px] sm:text-[28px] lg:text-[32px] font-semibold text-slate-900 transition-all duration-300">
            {{ isLogin ? 'Welcome' : 'Create Account' }}
          </h1>
          
          <p v-if="isLogin" class="mt-3 mx-auto max-w-[390px] text-center text-[14px] sm:text-[15px] lg:text-[16px] font-normal text-[#00000080] px-4">
            Sign in to access your financial dashboards.
          </p>

          <form class="mt-8 lg:mt-10 space-y-5 lg:space-y-6 px-4 sm:px-0" @submit.prevent="onSubmit">
            <!-- Name field only shows for Sign Up -->
            <div v-if="!isLogin" class="transition-all duration-300">
              <input v-model="form.name" type="text" placeholder="Full Name" class="h-11 sm:h-12 w-full rounded-full border border-[#CFCFCF] px-6 outline-none focus:border-[#0C5B55]" required />
            </div>

            <input v-model="form.email" type="email" placeholder="Email" class="h-11 sm:h-12 w-full rounded-full border border-[#CFCFCF] px-6 outline-none focus:border-[#0C5B55]" required />
            
            <input v-model="form.password" type="password" placeholder="Password" class="h-11 sm:h-12 w-full rounded-full border border-[#CFCFCF] px-6 outline-none focus:border-[#0C5B55]" required />
            
            <button type="submit" class="mt-4 h-11 sm:h-12 w-full rounded-full text-[18px] font-semibold text-white shadow-sm transition-transform active:scale-95" style="background: linear-gradient(to right, #003228, #0E6B60)">
              {{ isLogin ? 'Login' : 'Create Account' }}
            </button>

            <p class="pt-2 text-center text-[14px] text-[#A0A0A0]">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <button type="button" @click="toggleMode" class="font-semibold text-[#00B389] hover:underline bg-transparent border-none cursor-pointer">
                {{ isLogin ? 'Sign up here' : 'Sign in here' }}
              </button>
            </p>
          </form>
        </div>
      </section>

      <!-- RIGHT : HERO SECTION -->
      <section class="relative hidden lg:flex h-full min-h-[500px] overflow-hidden order-2">
        <div class="relative h-full w-full rounded-[20px] flex items-center justify-center" style="background: linear-gradient(135deg, #003228 0%, #0E6B60 100%)">
          <div class="relative z-10 flex flex-col items-center">
             <img 
               src="/images/login-hero.png" 
               class="hero-img" 
               :class="imgExit ? 'hero-img-exit-left' : ''" 
               style="max-width: 700px; width: 100%" 
             />
          </div>
        </div>
      </section>
    </div>

    <!-- WELCOME OVERLAY (Shared for both actions) -->
    <WelcomeOverlay v-model="overlay" :start="triggerStart" :exit="exitOverlay">
      <div class="relative z-10 text-center flex flex-col items-center px-8 sm:px-12">
        <img src="/images/welcome-logo.png" alt="Taxaid" class="mx-auto w-full max-w-[220px] mb-8" />
        <h3 class="text-[48px] font-semibold text-[#31E0C8] leading-tight">Welcome to</h3>
        <p class="mt-1 text-[36px] font-normal text-white">TaxAid Financial Analytics!</p>
        <p class="mt-8 text-[18px] font-light text-white/70 max-w-[440px] mx-auto leading-relaxed">
          Let's personalize your dashboard to match your business goals. It'll only take a minute.
        </p>
        <button
          type="button"
          @click="goNext"
          class="mt-10 h-[48px] w-[250px] rounded-full text-[20px] font-semibold text-white flex items-center justify-center gap-3 transition-transform hover:scale-105 cursor-pointer relative z-30"
          style="background: linear-gradient(90deg, #00BFA6 0%, #0E6B60 100%);"
        >
          Get Started <span class="font-bold">→</span>
        </button>
      </div>
    </WelcomeOverlay>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// --- State ---
const isLogin = ref(true)
const form = reactive({
  name: '',
  email: '',
  password: ''
})

// --- Animation/Overlay State ---
const imgExit = ref(false)
const overlay = ref(false)
const triggerStart = ref(false)
const exitOverlay = ref(false)

// --- Methods ---
function toggleMode() {
  isLogin.value = !isLogin.value
}

function onSubmit() {
  // Trigger Hero Image Animation
  imgExit.value = true
  
  // Wait for image to slide out, then show overlay
  setTimeout(() => {
    overlay.value = true
    setTimeout(() => { 
      triggerStart.value = true 
    }, 50)
  }, 400)
}

function goNext() {
  exitOverlay.value = true
  setTimeout(() => {
    navigateTo('/onboarding')
  }, 700)
}
</script>

<style scoped>
.hero-img { 
  will-change: transform, opacity; 
  transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms; 
}
.hero-img-exit-left { 
  transform: translateX(-120%); 
  opacity: 0; 
}

/* Optional: Smooth transition for form fields */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>