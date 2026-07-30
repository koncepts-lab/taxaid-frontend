<template>
  <div v-if="modelValue" class="absolute inset-0 z-50 min-h-screen w-full flex items-center justify-center overflow-hidden text-center animate-expand-bg" style="background: radial-gradient(circle at center, #0C5B55 0%, #002B23 100%)">
    <div v-if="showCard" class="relative z-[55] flex flex-col items-center max-w-2xl w-full animate-slide-in-right-far">
      <CommonParticleBackground/>

      <!-- Content Card -->
      <div class="welcome-card rounded-[40px] p-10 md:p-16 w-full relative overflow-hidden">
        <!-- Glow effect -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0C5B55]/40 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="relative z-10 flex flex-col items-center">
           <!-- Logo -->
           <img :src="welcomeLogoPath" alt="Taxaid" class="w-full max-w-[200px] mb-8" />

           <h1 class="text-[48px] font-semibold text-[#53FFDE] mb-2 leading-tight">
             {{ t.welcomeTitle }}
           </h1>
           <h2 class="text-[36px] font-normal text-[#DEFFF9] mb-6">
             {{ t.welcomeSubtitle }}
           </h2>

           <p class="text-[18px] font-light text-[#FFFFFFFA] leading-relaxed mb-10 max-w-lg mx-auto">
             {{ t.welcomeDesc }}
           </p>

           <button
             @click="$emit('get-started')"
             class="group relative inline-flex items-center justify-center w-full max-w-[250px] py-3.5 text-[16px] font-medium text-white rounded-full btn-premium cursor-pointer"
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // showWelcome
  showCard: { type: Boolean, default: false },   // showWelcomeCard
  language: { type: String, default: 'en' },
})
defineEmits(['get-started'])

const welcomeLogoPath = '/images/welcome-logo.png'
const isRtl = computed(() => props.language === 'ar')

const translations = {
  en: {
    welcomeTitle: 'Welcome to',
    welcomeSubtitle: 'TaxAid Financial Analytics!',
    welcomeDesc: 'Let’s personalize your dashboard to match your business goals. It’ll only take a minute.',
    getStarted: 'Get Started',
  },
  ar: {
    welcomeTitle: 'مرحبًا بك في',
    welcomeSubtitle: 'TaxAid للتحليلات المالية!',
    welcomeDesc: 'دعنا نخصص لوحة التحكم الخاصة بك لتناسب أهداف عملك. لن يستغرق الأمر سوى دقيقة واحدة.',
    getStarted: 'البدء',
  }
}

const t = computed(() => translations[props.language])
</script>

<style scoped>
@keyframes slideInRightFar {
  from {
    opacity: 0;
    transform: translateX(100vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right-far {
  animation: slideInRightFar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes expandFromRight {
  0% { clip-path: inset(0 0 0 100%); }
  100% { clip-path: inset(0 0 0 0); }
}

.animate-expand-bg {
  animation: expandFromRight 1s cubic-bezier(0.65, 0, 0.15, 1) forwards;
}

/* Welcome card — gradient border + glass effect */
.welcome-card {
  background: #0F0F0F4A;
  backdrop-filter: blur(72.9px);
  -webkit-backdrop-filter: blur(72.9px);
  box-shadow: 0px 4px 4px 0px #00000040;
}

/* Gradient border via pseudo-element (border-image breaks border-radius) */
.welcome-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 40px;
  padding: 1px;
  background: linear-gradient(125.98deg, rgba(0, 114, 92, 0.28) 0%, rgba(0, 112, 90, 0.28) 93.88%);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}

.btn-premium {
  background: linear-gradient(90deg, #003228 0%, #0E6B60 50%, #003228 100%);
  background-size: 200% auto;
  background-position: 0% 0%;
  font-weight: 500;
  transition: background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-premium:hover {
  background-position: 100% 0%;
}
</style>
