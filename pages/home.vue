<template>
  <!-- WELCOME OVERLAY SCREEN -->
  <div v-if="showWelcome" class="min-h-screen w-full bg-[#002B23] flex items-center justify-center relative overflow-hidden text-center p-4 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/welcome-bg.webp')">
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
           <img :src="welcomeLogoPath" alt="Taxaid" class="w-full max-w-[250px] mb-8" />

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
             @click="router.push('/onboarding')"
             class="group relative inline-flex items-center justify-center w-full max-w-[250px] py-3.5 text-[16px] font-medium text-white transition-all duration-200 bg-[linear-gradient(90deg,#00C79F_0%,#0A6B59_57.14%,#175C50_100%)] rounded-full hover:opacity-90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(12,91,85,0.4)] cursor-pointer"
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

  <div v-else class="min-h-screen w-full bg-[#fff] flex items-center justify-center" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      
      <!-- LEFT : FORM SECTION -->
      <section class="flex flex-col justify-center items-center px-6 lg:px-20 py-10 order-2 lg:order-1 relative bg-[#fff]">
        <!-- Logo (Absolute Top-Left on Desktop, Relative on Mobile) -->
        <!-- Logic: in RTL, this should be Top-Right? Usually logos stay or flip. Let's flip it for mirroring. -->
        <div class="absolute top-10 hidden lg:block" :class="isRtl ? 'right-10' : 'left-10'">
           <img src="/images/logo.png" alt="Taxaid" class="w-[150px]" />
        </div>
        <div class="w-full max-w-[160px] mb-8 lg:hidden">
           <img src="/images/logo.png" alt="Taxaid" class="w-full" />
        </div>

        <div class="w-full max-w-[430px] pt-10">
          <!-- Dynamic Title -->
          <h1 class="text-center text-[32px] font-semibold text-[#000] mb-3">
            <template v-if="!isForgotPassword">
              {{ isLogin ? t.welcome : t.createAccount }}
            </template>
            <template v-else>
              <template v-if="forgotPasswordStep === 1">{{ t.forgotPassTitle }}</template>
              <template v-else-if="forgotPasswordStep === 2">{{ t.passResetTitle }}</template>
              <template v-else-if="forgotPasswordStep === 3">{{ t.setNewPass }}</template>
              <template v-else-if="forgotPasswordStep === 4">{{ t.allDone }}</template>
            </template>
          </h1>

          <!-- Dynamic Description -->
          <p class="text-center text-[16px] text-[#00000052] font-normal leading-relaxed mb-10 px-4">
            <template v-if="!isForgotPassword">
              {{ isLogin ? t.loginDesc : t.signupDesc }}
            </template>
            <template v-else>
              <template v-if="forgotPasswordStep === 1">{{ t.forgotPassSub }}</template>
              <template v-else-if="forgotPasswordStep === 2">{{ t.passResetSub }} <span class="font-normal text-[#000000B2]">{{ form.email }}</span></template>
              <template v-else-if="forgotPasswordStep === 3">{{ t.minChar }}</template>
              <template v-else-if="forgotPasswordStep === 4">{{ t.passResetSuccess }}</template>
            </template>
          </p>

          <form v-if="!isForgotPassword" class="space-y-4" @submit.prevent="onSubmit">
            
            <!-- Signup Name -->
            <div v-if="!isLogin">
              <div class="relative group">
                 <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                       :class="isRtl ? 'right-5' : 'left-5'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input 
                  v-model="form.name" 
                  type="text" 
                  :placeholder="t.namePlaceholder" 
                  class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[15px] placeholder:text-gray-400" 
                />
              </div>
            </div>

            <!-- Email -->
            <div class="relative group">
              <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                    :class="isRtl ? 'right-5' : 'left-5'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input 
                v-model="form.email" 
                type="email" 
                :placeholder="t.emailPlaceholder" 
                class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[15px] placeholder:text-gray-400" 
                required 
              />
            </div>
            
            <!-- Password -->
            <div class="relative group">
              <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                    :class="isRtl ? 'right-5' : 'left-5'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                :placeholder="t.passwordPlaceholder" 
                class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[15px] placeholder:text-gray-400" 
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
                <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                      :class="isRtl ? 'right-5' : 'left-5'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input 
                  v-model="form.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  :placeholder="t.confirmPlaceholder" 
                  class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[15px] placeholder:text-gray-400" 
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
                <span class="text-[16px] font-medium text-[#000000B2]">{{ t.rememberMe }}</span>
              </label>
              <button type="button" @click="isForgotPassword = true" class="text-[16px] font-medium text-[#00000052] hover:text-[#013E32] cursor-pointer">{{ t.forgotPassword }}</button>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              class="group relative inline-flex items-center justify-center mt-6 h-[52px] w-full rounded-full text-[20px] font-semibold text-white transition-all duration-200 bg-[linear-gradient(90deg,#00C79F_0%,#0A6B59_57.14%,#175C50_100%)] hover:opacity-90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(12,91,85,0.4)] cursor-pointer" 
            >
              {{ isLogin ? t.loginBtn : t.signupBtn }}
              <svg class="w-6 h-6 ml-2 transition-transform duration-200 group-hover:translate-x-1" 
                   :class="isRtl ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- Toggle -->
            <p class="pt-4 text-center text-[18px] font-medium text-[#999999]">
              {{ isLogin ? t.dontHaveAccount : t.alreadyHaveAccount }}
              <button 
                type="button" 
                @click="isLogin = !isLogin" 
                class="font-semibold text-[#00B389] hover:underline ml-1 cursor-pointer"
              >
                {{ isLogin ? t.signUpLink : t.signInLink }}
              </button>
            </p>

            <!-- Divider -->
            <div class="relative flex items-center py-6">
              <div class="flex-grow border-t border-gray-200"></div>
              <span class="flex-shrink mx-4 text-[18px] font-medium text-[#00000078] bg-[#fff] px-2">{{ t.or }}</span>
              <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <!-- Social Logins -->
            <div class="flex justify-center gap-4">
              <button type="button" class="w-[52px] h-[52px] rounded-full bg-white border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-6 h-6" alt="Google" />
              </button>
              <button type="button" class="w-[52px] h-[52px] rounded-full bg-white border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.91 3.84-.75c.52.01 2.04.13 3 1.57-2.6.76-2.16 3.81.36 4.95-.56 2-1.35 3.98-2.28 6.46zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              </button>
            </div>
          </form>

          <!-- Forgot Password Steps -->
          <div v-else class="w-full flex flex-col items-center">
             <!-- Step 1: Email Input -->
             <div v-if="forgotPasswordStep === 1" class="w-full space-y-6">
                <div class="relative group">
                   <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                         :class="isRtl ? 'right-5' : 'left-5'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                   </span>
                   <input v-model="form.email" type="email" :placeholder="t.emailPlaceholder" 
                      class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[#000] placeholder:text-gray-400" 
                   />
                </div>
                <button @click="handleResetPassword()" class="h-[52px] w-full rounded-full text-[20px] font-semibold text-white transition-all bg-[linear-gradient(90deg,#00C79F_0%,#0A6B59_57.14%,#175C50_100%)] hover:opacity-90 active:scale-[0.98] cursor-pointer">
                   {{ t.resetPassword }}
                </button>
             </div>

             <!-- Step 2: OTP -->
             <div v-else-if="forgotPasswordStep === 2" class="w-full space-y-8 flex flex-col items-center">
                <div class="flex gap-4 justify-center">
                   <input v-for="i in 4" :key="i" v-model="otp[i-1]" type="text" maxlength="1" 
                      class="w-[80px] h-[80px] rounded-[20px] border border-[#009276] !text-[#009276] outline-none bg-white text-center text-[32px] font-medium transition-all focus:border-[#013E32]" 
                   />
                </div>
                <button @click="handleResetPassword()" class="h-[52px] w-full rounded-full text-[20px] font-semibold text-white transition-all bg-[linear-gradient(90deg,#00C79F_0%,#0A6B59_57.14%,#175C50_100%)] hover:opacity-90 active:scale-[0.98] cursor-pointer">
                   {{ t.continue }}
                </button>
                <p class="text-[18px] font-medium text-[#00000080]">
                   {{ t.didntReceive }} <button class="text-[#00B389] font-semibold hover:underline ml-1 cursor-pointer">{{ t.clickResend }}</button>
                </p>
             </div>

             <!-- Step 3: Set New Password -->
             <div v-else-if="forgotPasswordStep === 3" class="w-full space-y-6">
                <div class="relative group">
                   <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                         :class="isRtl ? 'right-5' : 'left-5'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   </span>
                   <input v-model="form.password" :type="showPassword ? 'text' : 'password'" :placeholder="t.passwordPlaceholder" 
                      class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[#000] placeholder:text-gray-400" />
                   <button type="button" @click="showPassword = !showPassword" 
                          class="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          :class="isRtl ? 'left-6' : 'right-6'">
                      <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.02 1.29-.05"/><path d="m3 3 18 18"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                   </button>
                </div>
                <div class="relative group">
                   <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                         :class="isRtl ? 'right-5' : 'left-5'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   </span>
                   <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" :placeholder="t.confirmPlaceholder" 
                      class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[#000] placeholder:text-gray-400" />
                   <button type="button" @click="showConfirmPassword = !showConfirmPassword" 
                          class="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          :class="isRtl ? 'left-6' : 'right-6'">
                      <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.02 1.29-.05"/><path d="m3 3 18 18"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                   </button>
                </div>
                <button @click="handleResetPassword()" class="h-[52px] w-full rounded-full text-[20px] font-semibold text-white transition-all bg-[linear-gradient(90deg,#00C79F_0%,#0A6B59_57.14%,#175C50_100%)] hover:opacity-90 active:scale-[0.98] cursor-pointer">
                   {{ t.resetPassword }}
                </button>
                <p class="text-[18px] font-medium text-[#00000080] text-center">
                   {{ t.didntReceive }} <button class="text-[#00B389] font-semibold hover:underline ml-1 cursor-pointer">{{ t.clickResend }}</button>
                </p>
             </div>

             <!-- Step 4: Success -->
             <div v-else-if="forgotPasswordStep === 4" class="w-full flex flex-col items-center">
                <div class="w-20 h-20 rounded-full border-2 border-[#00B389] flex items-center justify-center mb-8">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#00B389]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <button @click="backToLogin()" class="h-[54px] w-full rounded-full text-[20px] font-semibold text-white transition-all bg-[linear-gradient(90deg,#00C79F_0%,#0A6B59_57.14%,#175C50_100%)] hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer">
                   <svg v-if="!isRtl" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                   {{ t.backToLogin }}
                   <svg v-if="isRtl" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </button>
             </div>

             <!-- Back to Login Link -->
             <button v-if="forgotPasswordStep < 4" @click="backToLogin()" class="mt-12 flex items-center gap-2 text-[18px] font-medium text-[#00000080] hover:text-[#013E32] transition-colors group cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:-translate-x-1" :class="isRtl ? 'rotate-180 group-hover:translate-x-1' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                {{ t.backToLogin }}
             </button>
          </div>
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
                <p class="text-[24px] font-light text-[#FFFFFFB2] tracking-wide mb-2">{{ t.heroSub }}</p>
                <h2 class="text-[26px] font-medium text-white leading-tight">{{ t.heroMain }}</h2>
             </div>
             <img 
               src="/images/login-hero.png" 
               class="drop-shadow-2xl transition-transform hover:scale-[1.02] duration-500" 
               style="max-width: 85%; width: 100%" 
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
const showPassword = ref(true)
const showConfirmPassword = ref(false)
const currentLanguage = ref('en')
const isForgotPassword = ref(false)
const forgotPasswordStep = ref(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
const otp = ref(['', '', '', ''])
const forgotEmail = ref('')

// Using dynamic path to avoid any potential static analysis weirdness
const welcomeLogoPath = '/images/welcome-logo.png'

const isRtl = computed(() => currentLanguage.value === 'ar')

const translations = {
  en: {
    welcome: 'Welcome',
    createAccount: 'Create Account',
    loginDesc: 'Sign in to access your financial dashboards, AI insights, and ERP data — all in one place.',
    signupDesc: 'Create your account to access smart financial dashboards and AI-powered analytics.',
    namePlaceholder: 'Company Name',
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
    getStarted: 'Get Started',
    // Forgot Password Flow
    forgotPassTitle: 'Forgot Password',
    forgotPassSub: 'Please enter the email associated with your account.',
    resetPassword: 'Reset Password',
    backToLogin: 'Back to Login',
    passResetTitle: 'Password Reset',
    passResetSub: 'We send a code to',
    continue: 'Continue',
    didntReceive: "Don't receive the email?",
    clickResend: 'Click to resend',
    setNewPass: 'Set new password',
    minChar: 'Must be atleast 8 characters',
    allDone: 'All Done!',
    passResetSuccess: 'Your password has been reset.'
  },
  ar: {
    welcome: 'مرحباً',
    createAccount: 'إنشاء حساب',
    loginDesc: 'قم بتسجيل الدخول للوصول إلى لوحات المعلومات المالية ورؤى الذكاء الاصطناعي وبيانات تخطيط موارد المؤسسات - كل ذلك في مكان واحد.',
    signupDesc: 'أنشئ حسابك للوصول إلى لوحات المعلومات المالية الذكية والتحليلات المدعومة بالذكاء الاصطناعي.',
    namePlaceholder: 'اسم الشركة',
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
    getStarted: 'البدء',
    // Arabic Forgot Password Flow
    forgotPassTitle: 'هل نسيت كلمة السر',
    forgotPassSub: 'يرجى إدخال البريد الإلكتروني المرتبط بحسابك.',
    resetPassword: 'إعادة تعيين كلمة المرور',
    backToLogin: 'العودة إلى تسجيل الدخول',
    passResetTitle: 'إعادة تعيين كلمة المرور',
    passResetSub: 'نرسل كود إلى',
    continue: 'متابعـة',
    didntReceive: 'لم تستلم البريد الإلكتروني؟',
    clickResend: 'انقر لإعادة الإرسال',
    setNewPass: 'تعيين كلمة مرور جديدة',
    minChar: 'يجب أن يكون على الأقل 8 أحرف',
    allDone: 'تم بنجاح!',
    passResetSuccess: 'لقد تم إعادة تعيين كلمة المرور الخاصة بك.'
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

const handleResetPassword = () => {
  if (forgotPasswordStep.value === 1) {
    forgotEmail.value = form.email
    forgotPasswordStep.value = 2
  } else if (forgotPasswordStep.value === 2) {
    forgotPasswordStep.value = 3
  } else if (forgotPasswordStep.value === 3) {
    forgotPasswordStep.value = 4
  }
}

const backToLogin = () => {
  isForgotPassword.value = false
  forgotPasswordStep.value = 1
  isLogin.value = true
}
</script>

<style scoped>
input { color: #000; }
/* Override browser autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #000 !important;
}
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
