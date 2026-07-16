<template>
  <div class="w-full space-y-6 flex flex-col items-center animate-fade-in" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="w-20 h-20 rounded-full bg-[#0092761a] flex items-center justify-center mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#009276" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9"/>
        <polyline points="22,6 12,13 2,6"/>
        <circle cx="18" cy="19" r="3"/>
        <path d="m17 19 1 1 3-3"/>
      </svg>
    </div>

    <p class="text-center text-[16px] text-[#000000B2] font-medium px-2 leading-relaxed">
      {{ t.sentTo }} <br/>
      <span class="text-[#013E32] font-semibold">{{ email }}</span>
    </p>

    <div v-if="localError" class="w-full p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center font-medium">
      {{ localError === 'auth_error' ? t.error : localError }}
    </div>
    <div v-if="resendMessage" class="w-full p-3 rounded-xl bg-[#0092761a] text-[#009276] text-sm text-center font-medium">
      {{ resendMessage }}
    </div>

    <button 
      @click="checkStatus" 
      :disabled="loading"
      class="group relative inline-flex items-center justify-center h-[52px] w-full rounded-full text-[18px] font-medium text-white btn-premium cursor-pointer disabled:opacity-70"
    >
      <span v-if="!loading">{{ t.btnVerify }}</span>
      <UIcon v-else name="i-heroicons-arrow-path" class="animate-spin w-6 h-6" />
      
      <svg v-if="!loading" class="w-5 h-5 ml-2 transition-transform duration-200" 
           :class="isRtl ? '-translate-x-1 group-hover:-translate-x-2' : 'group-hover:translate-x-1'"
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <div class="flex flex-col items-center gap-4 pt-2">
      <p class="text-[16px] font-medium text-[#999999]">
        {{ t.noEmail }}
        <button @click="resend" :disabled="resending" class="text-[#00B389] font-semibold hover:underline ml-1 cursor-pointer disabled:opacity-50">
          {{ resending ? '…' : t.resendLink }}
        </button>
      </p>
      
      <button @click="$emit('back')" class="flex items-center gap-2 text-[16px] font-medium text-[#00000080] hover:text-[#013E32] transition-colors cursor-pointer group">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform" 
             :class="isRtl ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'" 
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        {{ t.backLogin }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  email: { type: String, required: true },
  password: { type: String, required: true },
  lang: { type: String, default: 'en' } 
})

const emit = defineEmits(['verified', 'back'])
const { login } = useAuth()
const config = useRuntimeConfig()
const loading = ref(false)
const localError = ref('')
const resending = ref(false)
const resendMessage = ref('')

const isRtl = computed(() => props.lang === 'ar')

const translations = {
  en: {
    sentTo: 'A verification link has been sent to',
    btnVerify: "I've Verified My Email",
    noEmail: "Didn't receive the email?",
    resendLink: 'Resend Link',
    resent: 'A new verification link has been sent.',
    cooldown: 'A link was just sent. Please wait a couple of minutes before trying again.',
    resendFailed: 'Could not resend the link. Please try again.',
    backLogin: 'Back to Login',
    error: 'Email not verified yet. Please check your inbox.'
  },
  ar: {
    sentTo: 'تم إرسال رابط التحقق إلى',
    btnVerify: 'لقد قمت بالتحقق من بريدي الإلكتروني',
    noEmail: 'لم تستلم البريد الإلكتروني؟',
    resendLink: 'إعادة إرسال الرابط',
    resent: 'تم إرسال رابط تحقق جديد.',
    cooldown: 'تم إرسال رابط للتو. يرجى الانتظار بضع دقائق قبل المحاولة مرة أخرى.',
    resendFailed: 'تعذر إعادة إرسال الرابط. يرجى المحاولة مرة أخرى.',
    backLogin: 'العودة لتسجيل الدخول',
    error: 'لم يتم التحقق من البريد الإلكتروني بعد. يرجى التحقق من صندوق الوارد الخاص بك.'
  }
}

const t = computed(() => translations[props.lang])

const checkStatus = async () => {
  loading.value = true
  localError.value = ''
  
  try {
    await login({
      email: props.email,
      password: props.password
    })
    emit('verified') 
  } catch (err) {
    if (err.status === 403) {
      localError.value = 'auth_error'
    } else {
      localError.value = err.data?.message || err.message || 'auth_error' ///remove the err msg later in live
    }
  } finally {
    loading.value = false
  }
}

// Resend: backend disposes the old token, issues a fresh 24h one to the
// same address (2-min cooldown, generic response — no account enumeration).
const resend = async () => {
  if (resending.value) return
  resending.value = true
  localError.value = ''
  resendMessage.value = ''
  try {
    await $fetch('/auth/resend-verification', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { email: props.email },
    })
    resendMessage.value = t.value.resent
  } catch (err) {
    localError.value = err?.status === 429 ? t.value.cooldown : (err?.data?.message || t.value.resendFailed)
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
.btn-premium {
  background: linear-gradient(90deg, #003228 0%, #0E6B60 50%, #003228 100%);
  background-size: 200% auto;
  background-position: 0% 0%;
  transition: background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-premium:hover {
  background-position: 100% 0%;
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>