<template>
  <div class="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4 relative font-sans">
    
    <!-- Login Card -->
    <div class="w-full max-w-[600px] bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-12 flex flex-col items-center">
      
      <!-- Logo -->
      <div class="mb-6">
        <img src="/images/logo.svg" alt="Taxaid.AI" class="text-center text-[32px] font-semibold text-[#000] mb-3" />
      </div>

      <!-- Header Content -->
      <h1 class="text-[24px] font-semibold text-[#1a1a1a] mb-1.5 text-center">Revenue Partnership Login</h1>
      <p class="text-center text-[16px] text-[#00000052] font-normal leading-relaxed mb-10 px-4">
        Track Client Revenue, Partner Performance & Shared Earnings
      </p>

      <!-- Form -->
      <form @submit.prevent="onLogin" class="w-full space-y-5">
        
        <!-- Login As Selector -->
        <div class="relative">
          <label class="block text-[14px] font-normal text-[#0A0A0A] mb-2">Login as</label>
          <div 
            @click="isDropdownOpen = !isDropdownOpen"
            class="relative h-[48px] w-full border border-[#04C18F80] rounded-[10px] px-4 flex items-center justify-between cursor-pointer hover:border-[#00705a] transition-all"
            :class="{ 'border-[#00705a] ring-1 ring-[#00705a]': isDropdownOpen }"
          >
            <span class="text-[14px] font-normal text-[#0A0A0A]">{{ selectedRole }}</span>
            <svg 
              class="w-5 h-5 text-[#94a3b8] transition-transform duration-300"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Custom Dropdown Menu  -->
          <Transition name="fade-slide">
            <div 
              v-if="isDropdownOpen"
              class="absolute top-full left-0 right-0 mt-2 bg-white border border-[#0000000D] rounded-[16px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 p-1.5"
            >
              <div 
                v-for="role in roles" 
                :key="role"
                @click="selectRole(role)"
                class="flex items-center px-4 py-3 rounded-[10px] cursor-pointer transition-all text-[14px] font-normal"
                :class="{ 
                  'bg-[#E2FAF4] text-[#00705a] font-medium': selectedRole === role, 
                  'text-[#0A0A0A] hover:bg-[#F8FAFC]': selectedRole !== role 
                }"
              >
                {{ role }}
              </div>
            </div>
          </Transition>
        </div>

        <!-- Email Address -->
        <div class="relative">
          <label class="block text-[14px] font-normal text-[#0A0A0A] mb-2">Email Address *</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input 
              v-model="email" 
              type="email" 
              placeholder="your.email@company.com"
              class="h-[48px] w-full border border-[#04C18F80] rounded-[10px] pl-12 pr-4 outline-none focus:border-[#00705a] text-[14px] font-normal text-[#0A0A0A] placeholder:text-[#717182] transition-all"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block text-[14px] font-normal text-[#0A0A0A] mb-2">Password *</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Min. 6 characters"
              class="h-[48px] w-full border border-[#04C18F80] rounded-[10px] pl-12 pr-4 outline-none focus:border-[#00705a] text-[14px] font-normal text-[#0A0A0A] placeholder:text-[#717182] transition-all"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          class="w-full h-[48px] bg-[#007C65] hover:bg-[#006552] text-white font-medium rounded-[10px] transition-all duration-300 mt-4 active:scale-[0.98] shadow-lg shadow-[#007C6533] cursor-pointer"
        >
          Login to Dashboard
        </button>

        

      </form>
    </div>

    <!-- Page Footer (Relative to screen, matches Image 2) -->
    <div class="fixed bottom-6 left-6 text-[#999] text-[13px] font-normal z-0">
      Copyright Reserved @2025
    </div>
    <div class="fixed bottom-6 right-6 text-[#999] text-[13px] font-normal z-0">
      Last Sync: 19 Oct 2025, 10:45 AM IST
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const email = ref('')
const password = ref('')
const isDropdownOpen = ref(false)
const selectedRole = ref('Partner')
const roles = ['Partner', 'Accounts', 'Admin']

function selectRole(role) {
  selectedRole.value = role
  isDropdownOpen.value = false
}

function onLogin() {
  console.log('Logging in as:', selectedRole.value, email.value)
  
  if (selectedRole.value === 'Partner') {
    navigateTo('/revenue-partnership/partner')
  } else if (selectedRole.value === 'Accounts') {
    navigateTo('/revenue-partnership/accounts')
  } else {
    // For Admin, currently navigating to the select dashboard
    navigateTo('/revenue-partnership/admin')
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
