<template>
  <div class="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-4">
    <!-- Validating token -->
    <div v-if="pageState === 'validating'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
      <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-5">
        <svg class="animate-spin text-[#007C65]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      </div>
      <p class="text-gray-500 text-sm">Validating your reset link…</p>
    </div>

    <!-- Invalid / expired -->
    <div v-else-if="pageState === 'invalid'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
      <div class="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5">
        <svg class="text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Link Invalid or Expired</h2>
      <p class="text-sm text-gray-500 mb-6">{{ invalidMessage }}</p>
      <NuxtLink to="/revenue-partnership-login" class="text-[#007C65] text-sm font-medium hover:underline">Back to Login</NuxtLink>
    </div>

    <!-- Reset form -->
    <div v-else-if="pageState === 'form'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full">
      <div class="px-8 pt-8 pb-2 text-center">
        <img src="https://storage.googleapis.com/taxaid_kcms/logo-new-svg/1775803721_tx2.svg" alt="TaxAid" class="h-9 mx-auto mb-6">
        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
          <svg class="text-[#007C65]" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 class="text-[20px] font-semibold text-gray-900">Set New Password</h1>
        <p class="text-sm text-gray-500 mt-1 mb-0">Hi <span class="font-medium text-gray-700">{{ tokenInfo.name }}</span>, choose a strong new password for your account.</p>
      </div>

      <form @submit.prevent="handleReset" class="px-8 pb-8 pt-5 space-y-4">
        <div>
          <label class="block text-[13px] font-medium text-gray-700 mb-1">New Password</label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="Min. 8 characters"
            class="w-full border border-[#A7F3D0] rounded-lg px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-[13px] font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            autocomplete="new-password"
            placeholder="Repeat your new password"
            class="w-full border border-[#A7F3D0] rounded-lg px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400"
          />
        </div>

        <p v-if="formError" class="text-red-500 text-[13px]">{{ formError }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full bg-[#007C65] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#006A56] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="submitting" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          {{ submitting ? 'Resetting…' : 'Reset Password' }}
        </button>
      </form>
    </div>

    <!-- Success -->
    <div v-else-if="pageState === 'success'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
      <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-5">
        <svg class="text-[#007C65]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 class="text-[20px] font-semibold text-gray-900 mb-2">Password Reset!</h2>
      <p class="text-sm text-gray-500 mb-6">Your password has been updated successfully. You can now log in with your new password.</p>
      <NuxtLink to="/revenue-partnership-login" class="inline-block bg-[#007C65] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#006A56] transition-colors">Go to Login</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: [] })

const route  = useRoute()
const config = useRuntimeConfig()

const pageState           = ref('validating')
const invalidMessage      = ref('')
const tokenInfo           = ref({ name: '', email: '', type: '' })
const password            = ref('')
const passwordConfirmation = ref('')
const formError           = ref('')
const submitting          = ref(false)

const token = route.query.token

onMounted(async () => {
  if (!token) {
    invalidMessage.value = 'No reset token found in this link.'
    pageState.value = 'invalid'
    return
  }

  try {
    const res = await $fetch('/reset-password/validate', {
      baseURL: config.public.apiBase,
      params: { token },
    })
    if (res.valid) {
      tokenInfo.value = { name: res.name, email: res.email, type: res.type }
      pageState.value = 'form'
    } else {
      invalidMessage.value = res.message ?? 'This reset link is invalid.'
      pageState.value = 'invalid'
    }
  } catch (err) {
    invalidMessage.value = err?.data?.message ?? 'This reset link is invalid or has expired.'
    pageState.value = 'invalid'
  }
})

async function handleReset() {
  formError.value = ''
  if (!password.value || password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== passwordConfirmation.value) {
    formError.value = 'Passwords do not match.'
    return
  }

  submitting.value = true
  try {
    await $fetch('/reset-password', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: {
        token: token,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
      },
    })
    pageState.value = 'success'
  } catch (err) {
    formError.value = err?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
