<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <h2 class="text-xl font-bold">Verifying...</h2>
      <p>Setting up your account, please wait.</p>
    </div>

    <div v-else-if="error" class="text-center">
      <h2 class="text-xl font-bold text-red-600">Verification Failed</h2>
      <p class="mt-2 text-gray-600">{{ errorMessage }}</p>
      <NuxtLink to="/home" class="mt-4 inline-block text-blue-500 underline">Go to Home</NuxtLink>
    </div>

    <div v-else class="text-center">
      <h2 class="text-xl font-bold text-green-600">Verified Successfully!</h2>
      <p class="mt-2 text-gray-600">You can safely close this tab now.</p>
      <!-- <p class="mt-2 text-gray-600">Redirecting you now...</p> -->
    </div>
  </div>
</template>

<script setup>
// Ensure this page is public even if global middleware exists
definePageMeta({
  middleware: []
})

const route = useRoute()
const config = useRuntimeConfig()
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

// CRITICAL: Prevent Nuxt from calling the API twice during hydration/dev-mode
const hasCalledApi = ref(false)

onMounted(async () => {
  if (hasCalledApi.value) return
  hasCalledApi.value = true

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