<template>
  <div class="relative min-h-screen w-full bg-[#fff] overflow-hidden" :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- WELCOME OVERLAY SCREEN -->
    <div v-if="showWelcome" class="absolute inset-0 z-50 min-h-screen w-full flex items-center justify-center overflow-hidden text-center animate-expand-bg" style="background: radial-gradient(circle at center, #0C5B55 0%, #002B23 100%)">
      <div v-if="showWelcomeCard" class="relative z-[55] flex flex-col items-center max-w-2xl w-full animate-slide-in-right-far">
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
               @click="handleGetStarted"
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

    <!-- MAIN SCREEN -->
    <div class="w-full min-h-screen flex items-center justify-center relative z-10">
      <div class="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      
      <!-- LEFT : FORM SECTION -->
      <section class="flex flex-col justify-center items-center px-6 lg:px-20 py-10 order-2 lg:order-1 relative bg-[#fff]"
               :style="{
                 transform: showWelcome ? (isRtl ? 'translateX(100vw)' : 'translateX(-100vw)') : 'translateX(0)',
                 transition: 'transform 1s cubic-bezier(0.65, 0, 0.15, 1)'
               }">
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
            <template v-if="!isForgotPassword && !isEmailVerification">
              {{ isLogin ? t.welcome : t.createAccount }}
            </template>
            <template v-else-if="isEmailVerification">
              {{ t.emailVerifyTitle }}
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
            <template v-if="!isForgotPassword && !isEmailVerification">
              {{ isLogin ? t.loginDesc : t.signupDesc }}
            </template>
            <template v-else-if="isEmailVerification">
              <!-- {{ t.emailVerifySub }} <span class="font-normal text-[#000000B2]">{{ form.email }}</span> -->
            </template>
            <template v-else>
              <template v-if="forgotPasswordStep === 1">{{ t.forgotPassSub }}</template>
              <template v-else-if="forgotPasswordStep === 2">{{ t.passResetSub }} <span class="font-normal text-[#000000B2]">{{ form.email }}</span></template>
              <template v-else-if="forgotPasswordStep === 3">{{ t.minChar }}</template>
              <template v-else-if="forgotPasswordStep === 4">{{ t.passResetSuccess }}</template>
            </template>
          </p>

          <div v-if="errorMessage" class="mb-4 p-3 rounded-xl text-sm text-center font-medium"
            :class="errorVariant === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'">
            {{ errorMessage }}
          </div>

          <div v-if="isEmailVerification" class="w-full">
            <CommonEmailVerify :email="form.email" :password="form.password" :lang="currentLanguage" @verified="onEmailVerified" @back="isEmailVerification = false" />
          </div>

          <form v-else-if="!isForgotPassword" class="space-y-4" @submit.prevent="onSubmit">
            
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
            
            <!-- Contact Number (Signup Only) -->
            <div v-if="!isLogin" class="relative group">
              <span class="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#013E32] transition-colors"
                    :class="isRtl ? 'right-5' : 'left-5'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <input 
                v-model="form.contactNumber" 
                type="tel" 
                :placeholder="t.contactNumberPlaceholder" 
                class="h-[56px] w-full rounded-[35px] border border-[#D1D5DB] bg-white px-14 outline-none focus:border-[#013E32] transition-all text-[15px] placeholder:text-gray-400" 
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
                  <input type="checkbox" v-model="rememberMe" class="peer sr-only"/>
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
              :disabled="loading"
              class="group relative inline-flex items-center justify-center mt-6 h-[52px] w-full rounded-full text-[20px] font-medium text-white btn-premium cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" 
            >
              <span v-if="!loading">{{ isLogin ? t.loginBtn : t.signupBtn }}</span>
              <UIcon v-else name="i-heroicons-arrow-path" class="animate-spin w-6 h-6" />
              <svg v-if="!loading" class="w-6 h-6 ml-2 transition-transform duration-200 group-hover:translate-x-1" 
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
                @click="isLogin = !isLogin; errorMessage = ''" 
                class="font-semibold text-[#00B389] hover:underline ml-1 cursor-pointer"
              >
                {{ isLogin ? t.signUpLink : t.signInLink }}
              </button>
            </p>

            <p class="pt-2 text-center text-[16px] font-medium">
              <NuxtLink to="/revenue-partnership-login" class="text-[#00705a] hover:underline cursor-pointer">
                {{ t.partnershipLogin }}
              </NuxtLink>
            </p>

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
                <button @click="handleResetPassword()" class="h-[52px] w-full rounded-full text-[20px] font-medium text-white btn-premium cursor-pointer">
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
                <button @click="handleResetPassword()" class="h-[52px] w-full rounded-full text-[20px] font-medium text-white btn-premium cursor-pointer">
                   {{ t.continue }}
                </button>
                <p class="text-[18px] font-medium text-[#00000080]">
                   {{ t.didntReceive }} <button @click="handleResendEmail()" class="text-[#00B389] font-semibold hover:underline ml-1 cursor-pointer">{{ t.clickResend }}</button>
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
                <button @click="handleResetPassword()" class="h-[52px] w-full rounded-full text-[20px] font-medium text-white btn-premium cursor-pointer">
                   {{ t.resetPassword }}
                </button>
                <p class="text-[18px] font-medium text-[#00000080] text-center">
                   {{ t.didntReceive }} <button @click="handleResendEmail()" class="text-[#00B389] font-semibold hover:underline ml-1 cursor-pointer">{{ t.clickResend }}</button>
                </p>
             </div>

             <!-- Step 4: Success -->
             <div v-else-if="forgotPasswordStep === 4" class="w-full flex flex-col items-center">
                <div class="w-20 h-20 rounded-full border-2 border-[#00B389] flex items-center justify-center mb-8">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#00B389]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                 <button @click="backToLogin()" class="h-[54px] w-full rounded-full text-[20px] font-medium text-white btn-premium flex items-center justify-center gap-2 cursor-pointer">
                   <svg v-if="!isRtl" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                   {{ t.backToLogin }}
                   <svg v-if="isRtl" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </button>
             </div>

             <!-- Error / cooldown message -->
             <p v-if="forgotError" class="mt-4 text-[14px] text-red-500 text-center">{{ forgotError }}</p>

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
             <div class="mb-5 text-center">
                <p class="text-[24px] font-light text-[#FFFFFFB2] tracking-wide mb-2">{{ t.heroSub }}</p>
                <h2 class="text-[26px] font-medium text-white leading-tight">{{ t.heroMain }}</h2>
             </div>
             <img 
               src="/images/login-hero.webp" 
               class="drop-shadow-2xl" 
               style="max-width: 75%; width: 100%" 
               alt="Dashboard"
             />
          </div>
        </div>
      </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import LanguageToggle from '@/components/common/LanguageToggle.vue'
// ---------- AUTH LOGIC ----------
const { login, user } = useAuth()
const config = useRuntimeConfig()
const loading = ref(false)
const errorMessage = ref('')
const errorVariant = ref('error') // 'error' (red) | 'warning' (amber, lockout)
const isEmailVerification = ref(false)
const nextRedirect = ref('') // Store where the user should go after welcome screen 

const router = useRouter()
const isLogin = ref(true)
const showWelcome = ref(false)
const showWelcomeCard = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const currentLanguage = ref('en')
const isForgotPassword = ref(false)
const forgotPasswordStep = ref(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
const otp = ref(['', '', '', ''])
const forgotEmail = ref('')
const rememberMe = ref(true)

// ---------- SESSION LOCATION (best effort) ----------
// Resolved before submit so the permission popup doesn't race the login call.
// Shared provider chain lives in useLocation (GPS + geocode, IP-based backup);
// on total failure we send nothing and the backend falls back to timezone.
const geoLocation = ref(null)
onMounted(() => {
  useLocation().resolve().then((loc) => { if (loc) geoLocation.value = loc })
})

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
    contactNumberPlaceholder: 'Contact Number',
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
    passResetSub: 'Open the link in the email we sent to get your code:',
    continue: 'Continue',
    didntReceive: "Don't receive the email?",
    clickResend: 'Click to resend',
    setNewPass: 'Set new password',
    minChar: 'Must be atleast 8 characters',
    allDone: 'All Done!',
    passResetSuccess: 'Your password has been reset.',
    partnershipLogin: 'Partnership Login',
    emailVerifyTitle: 'Verification Required',
    emailVerifySub: 'A verification link has been sent to',
    tooManyAttempts: 'Too many login attempts. Please try again after 15 minutes.',
    accountSuspended: 'Your account has been suspended. Please contact TaxAid support.',
    serverOffline: 'Server is under maintenance. Please try again later.',
  },
  ar: {
    welcome: 'مرحباً',
    createAccount: 'إنشاء حساب',
    loginDesc: 'قم بتسجيل الدخول للوصول إلى لوحات المعلومات المالية ورؤى الذكاء الاصطناعي وبيانات تخطيط موارد المؤسسات - كل ذلك في مكان واحد.',
    signupDesc: 'أنشئ حسابك للوصول إلى لوحات المعلومات المالية الذكية والتحليلات المدعومة بالذكاء الاصطناعي.',
    namePlaceholder: 'اسم الشركة',
    emailPlaceholder: 'بريد إلكتروني',
    contactNumberPlaceholder: 'رقم الاتصال',
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
    passResetSub: 'افتح الرابط في البريد الإلكتروني الذي أرسلناه للحصول على الرمز:',
    continue: 'متابعـة',
    didntReceive: 'لم تستلم البريد الإلكتروني؟',
    clickResend: 'انقر لإعادة الإرسال',
    setNewPass: 'تعيين كلمة مرور جديدة',
    minChar: 'يجب أن يكون على الأقل 8 أحرف',
    allDone: 'تم بنجاح!',
    passResetSuccess: 'لقد تم إعادة تعيين كلمة المرور الخاصة بك.',
    partnershipLogin: 'تسجيل دخول الشركاء',
    emailVerifyTitle: 'التحقق من البريد الإلكتروني',
    emailVerifySub: 'تم إرسال رابط التحقق إلى',
    tooManyAttempts: 'محاولات تسجيل دخول كثيرة جداً. يرجى المحاولة مرة أخرى بعد 15 دقيقة.',
    accountSuspended: 'تم تعليق حسابك. يرجى التواصل مع دعم TaxAid.',
    serverOffline: 'الخادم تحت الصيانة. يرجى المحاولة مرة أخرى لاحقاً.',
  }
}

const t = computed(() => translations[currentLanguage.value])

const form = reactive({
  name: '',
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: ''
})

async function onSubmit() {
  errorMessage.value = ''
  loading.value = true
  
  try {
    if (isLogin.value) {
      // LOGIN
      const res = await login({
        email: form.email,
        password: form.password
      }, rememberMe.value, geoLocation.value)

      const status = res?.data?.tenant?.status      
      if (status === 'pending_onboarding') {// NEW USER / ONBOARDING: Show Welcome Card journey        
        nextRedirect.value = '/onboarding'
        showWelcome.value = true
        setTimeout(() => { showWelcomeCard.value = true }, 1200)
      } else {// NORMAL USER: Skip Welcome Card, go directly to Dashboard
        router.push('/dashboard')
      }

    } else {      // REGISTER
      await $fetch('/auth/register', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          company_name: form.name,
          email: form.email,
          contact_number: form.contactNumber,
          password: form.password,
          password_confirmation: form.confirmPassword
        }
      })
      
      // After registration, show verification
      isEmailVerification.value = true
    }
  } catch (err) {
    if (err.status === 403 && err.data?.message?.includes('verify your email')) {
      isEmailVerification.value = true
    } else if (err.data?.code === 'too_many_attempts') {
      errorVariant.value = 'warning' // lockout window — amber, translated copy
      errorMessage.value = t.value.tooManyAttempts
    } else if (err.data?.code === 'account_suspended') {
      errorVariant.value = 'error'
      errorMessage.value = t.value.accountSuspended
    } else if (err.message?.toLowerCase().includes('fetch failed') || err.message?.toLowerCase().includes('network error') || err.message?.toLowerCase().includes('failed to fetch')) {
      errorVariant.value = 'warning'
      errorMessage.value = t.value.serverOffline
    } else {
      errorVariant.value = 'error'
      errorMessage.value = err.data?.message || err.message || 'Authentication failed' ///remove the err msg later in live
    }
  } finally {
    loading.value = false
  }
}

function handleGetStarted() {
  router.push(nextRedirect.value)
}

function onEmailVerified() {
  isEmailVerification.value = false
  
//email verified destination()
  nextRedirect.value = '/onboarding'  
  showWelcome.value = true
  setTimeout(() => {
    showWelcomeCard.value = true
  }, 1200)
}

const forgotError = ref('')
const forgotLoading = ref(false)
const resetToken = ref('')

const handleResetPassword = async () => {
  if (forgotLoading.value) return
  forgotError.value = ''

  try {
    if (forgotPasswordStep.value === 1) {
      const email = form.email?.trim()
      if (!email) {
        forgotError.value = currentLanguage.value === 'ar' ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email.'
        return
      }
      forgotLoading.value = true
      await $fetch('/forgot-password', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { email },
      })
      forgotEmail.value = email
      forgotPasswordStep.value = 2

    } else if (forgotPasswordStep.value === 2) {
      const code = otp.value.join('')
      if (code.length !== 4) {
        forgotError.value = currentLanguage.value === 'ar' ? 'يرجى إدخال الرمز المكون من 4 أرقام' : 'Please enter the 4-digit code.'
        return
      }
      forgotLoading.value = true
      const res = await $fetch('/forgot-password/verify-otp', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { email: forgotEmail.value, otp: code },
      })
      resetToken.value = res.reset_token
      forgotPasswordStep.value = 3

    } else if (forgotPasswordStep.value === 3) {
      if (!form.password || form.password.length < 8) {
        forgotError.value = currentLanguage.value === 'ar' ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل' : 'Password must be at least 8 characters.'
        return
      }
      if (form.password !== form.confirmPassword) {
        forgotError.value = currentLanguage.value === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match.'
        return
      }
      forgotLoading.value = true
      await $fetch('/reset-password', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          token: resetToken.value,
          password: form.password,
          password_confirmation: form.confirmPassword,
        },
      })
      form.password = ''
      form.confirmPassword = ''
      forgotPasswordStep.value = 4
    }
  } catch (err) {
    forgotError.value = err?.data?.message
      || (currentLanguage.value === 'ar' ? 'حدث خطأ ما، يرجى المحاولة مرة أخرى' : 'Something went wrong. Please try again.')
  } finally {
    forgotLoading.value = false
  }
}

// "Click to resend" — backend enforces a 2-minute per-email cooldown (429)
const handleResendEmail = async () => {
  if (forgotLoading.value) return
  forgotError.value = ''
  forgotLoading.value = true
  try {
    await $fetch('/forgot-password', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { email: forgotEmail.value },
    })
  } catch (err) {
    forgotError.value = err?.data?.message
      || (currentLanguage.value === 'ar' ? 'حدث خطأ ما، يرجى المحاولة مرة أخرى' : 'Something went wrong. Please try again.')
  } finally {
    forgotLoading.value = false
  }
}

const backToLogin = () => {
  isForgotPassword.value = false
  forgotPasswordStep.value = 1
  isLogin.value = true
  otp.value = ['', '', '', '']
  resetToken.value = ''
  forgotError.value = ''
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
/* Premium Button Styles */
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
</style>
