<template>
  <div class="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl w-full max-w-md py-10 px-8 shadow-sm border border-gray-100">
      <div class="text-center mb-8">
        <img src="/images/logo.svg" alt="TaxAid" class="h-8 mx-auto mb-4" />
        <h1 class="text-base font-semibold text-gray-900">Super Admin Login</h1>
        <p class="text-sm text-gray-500 mt-1">Internal access only</p>
      </div>

      <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-center">{{ error }}</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required placeholder="superadmin@taxaid.com"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008169] focus:ring-1 focus:ring-[#008169]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input v-model="form.password" :type="showPw ? 'text' : 'password'" required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008169] focus:ring-1 focus:ring-[#008169] pr-10" />
            <button type="button" @click="showPw = !showPw"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              <svg v-if="!showPw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" :disabled="loading"
          class="w-full py-2.5 mt-2 bg-[#008169] hover:bg-[#006b56] disabled:opacity-60 text-white rounded-lg font-medium text-sm transition-all">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import { useAdminAuth } from '~/composables/superadmin/useAdminAuth'

const { login, redirectByRole } = useAdminAuth()

const form    = reactive({ email: 'superadmin@taxaid.com', password: 'Password@123' })
const showPw  = ref(false)
const loading = ref(false)
const error   = ref('')

async function handleLogin() {
  loading.value = true
  error.value   = ''
  try {
    await login(form.email, form.password)
    await redirectByRole()
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>
