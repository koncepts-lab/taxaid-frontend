<template>
  <div class="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-4">

    <!-- ══════════ PASSWORD RESET MODE (ctx=a1) ══════════ -->
    <template v-if="isResetMode">
      <!-- Validating link -->
      <div v-if="resetState === 'validating'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-5">
          <svg class="animate-spin text-[#007C65]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <p class="text-gray-500 text-sm">Checking your reset link…</p>
      </div>

      <!-- Invalid / expired link -->
      <div v-else-if="resetState === 'invalid'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
        <div class="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5">
          <svg class="text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Link Invalid or Expired</h2>
        <p class="text-sm text-gray-500 mb-6">{{ resetError }}</p>
        <NuxtLink to="/home" class="text-[#007C65] text-sm font-medium hover:underline">Back to Login</NuxtLink>
      </div>

      <!-- Generate / show code -->
      <div v-else class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
        <img src="https://storage.googleapis.com/taxaid_kcms/logo-new-svg/1775803721_tx2.svg" alt="TaxAid" class="h-9 mx-auto mb-6">
        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
          <svg class="text-[#007C65]" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 class="text-[20px] font-semibold text-gray-900 mb-2">Password Reset Code</h1>

        <template v-if="!generatedOtp">
          <p class="text-sm text-gray-500 mb-6">Press the button below to generate your one-time verification code, then enter it on the login page.</p>
        </template>
        <template v-else>
          <p class="text-sm text-gray-500 mb-4">Enter this code on the login page for <span class="font-medium text-gray-700">{{ maskedEmail }}</span>:</p>
          <div class="flex justify-center gap-3 mb-4">
            <span v-for="(d, i) in generatedOtp.split('')" :key="i"
              class="w-[56px] h-[56px] rounded-xl border border-[#A7F3D0] bg-[#F0FDF9] flex items-center justify-center text-[26px] font-semibold text-[#007C65] tracking-wider">
              {{ d }}
            </span>
          </div>
          <p class="text-xs text-gray-400 mb-6">The code expires in 10 minutes. Keep this tab open until you're done.</p>
        </template>

        <p v-if="resetError" class="text-red-500 text-[13px] mb-4">{{ resetError }}</p>

        <!-- Button disappears once a code has been generated -->
        <button v-if="!generatedOtp" @click="generateCode" :disabled="generating"
          class="w-full bg-[#007C65] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#006A56] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="generating" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          {{ generating ? 'Generating…' : 'Generate Code' }}
        </button>
      </div>
    </template>

    <!-- ══════════ EMAIL VERIFICATION MODE (default) ══════════ -->
    <template v-else>
      <div v-if="loading" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-5">
          <svg class="animate-spin text-[#007C65]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Verifying…</h2>
        <p class="text-sm text-gray-500">Setting up your account, please wait.</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
        <div class="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5">
          <svg class="text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Verification Failed</h2>
        <p class="text-sm text-gray-500 mb-6">{{ errorMessage }}</p>
        <NuxtLink to="/home" class="text-[#007C65] text-sm font-medium hover:underline">Go to Home</NuxtLink>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-5">
          <svg class="text-[#007C65]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Verified Successfully!</h2>
        <p class="text-sm text-gray-500">You can safely close this tab now.</p>
      </div>
    </template>

  </div>
</template>

<script setup>
// Ensure this page is public even if global middleware exists
definePageMeta({
  middleware: []
})

const route = useRoute()
const config = useRuntimeConfig()

// ── Password reset mode (obfuscated params from the reset mail) ─────────────
// `ref` = real token, `ctx=a1` = reset flag. Other params (sid, v, trace) are
// intentional decoys added by the backend — never read them.
const isResetMode = computed(() => route.query.ctx === 'a1' && !!route.query.ref)

const resetState   = ref('validating') // validating | ready | invalid
const resetError   = ref('')
const generatedOtp = ref('')
const maskedEmail  = ref('')
const generating   = ref(false)

const generateCode = async () => {
  if (generating.value) return
  resetError.value = ''
  generating.value = true
  try {
    const res = await $fetch('/reset-password/generate-code', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { ref: route.query.ref },
    })
    generatedOtp.value = res.otp
    maskedEmail.value = res.email
  } catch (err) {
    resetError.value = err?.data?.message || 'Could not generate a code. Please try again.'
  } finally {
    generating.value = false
  }
}

// ── Email verification mode (original behaviour, unchanged) ─────────────────
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

// CRITICAL: Prevent Nuxt from calling the API twice during hydration/dev-mode
const hasCalledApi = ref(false)

onMounted(async () => {
  if (hasCalledApi.value) return
  hasCalledApi.value = true

  if (isResetMode.value) {
    // Validate the link first, then wait for the user to press Generate Code
    try {
      const res = await $fetch('/reset-password/validate', {
        baseURL: config.public.apiBase,
        params: { token: route.query.ref },
      })
      if (res.valid) {
        resetState.value = 'ready'
      } else {
        resetError.value = res.message ?? 'This reset link is invalid.'
        resetState.value = 'invalid'
      }
    } catch (err) {
      resetError.value = err?.data?.message ?? 'This reset link is invalid or has expired.'
      resetState.value = 'invalid'
    }
    return
  }

  const token = route.query.token

  if (!token) {
    error.value = true
    errorMessage.value = 'Verification token is missing.'
    loading.value = false
    return
  }

  try {
    // Using your NUXT_PUBLIC_API_BASE
    const response = await $fetch(`${config.public.apiBase}/auth/verify-email`, {
      method: 'GET',
      params: { token }
    })

    if (response.status === 'success') {
      // Save the Sanctum token sent by VerificationController
      const authCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 12 , // 12 hrs
        path: '/'
      })
      authCookie.value = response.data.token

      // Success redirect if it required uncomment later
      // setTimeout(() => {
      //   navigateTo(response.data.redirect_to || '/home')
      // }, 1500)
    }
  } catch (err) {
    error.value = true
    // Grabs the error message you wrote in VerificationController
    errorMessage.value = err.data?.message || 'The link is invalid or has already been used.'
  } finally {
    loading.value = false
  }
})
</script>
