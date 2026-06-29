<template>
    <div class="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
        <div
            class="bg-white rounded-[14px] w-full max-w-md py-10 px-8 md:p-14 shadow-sm border border-gray-100 transition-all duration-300">

            <!-- 1. Transition Wrapper for smooth switching -->
            <Transition name="fade" mode="out-in">

                <!-- LOGIN FORM -->
                <div v-if="authMode === 'login'" key="login">
                    <div class="text-center mb-10">
                        <div class="flex justify-center mb-4">
                            <img src="/images/logo.svg" alt="TaxAid Logo" class=" h-8">
                        </div>
                        <h1 class="text-base font-normal text-black mb-2">
                            {{ currentLang === 'ar' ? 'تسجيل دخول المسؤول' : 'Admin Dashboard Login' }}
                        </h1>
                        <p class="text-sm text-[#717182]">
                            {{ currentLang === 'ar' ? 'بوابتك المركزية للعمليات والمراجعة.' :
                                'Your central gateway to ticketing, implementation, and review operations.' }}
                        </p>
                    </div>

                    <form @submit.prevent="handleLogin" class="space-y-4">
                        <!-- Username Field -->
                        <div class="space-y-1.5 text-left">
                            <label class="text-sm font-normal text-gray-800 ps-1">{{ currentLang === 'ar' ?
                                'اسم المستخدم' : 'Username' }}</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors"
                                    :class="errors.username ? 'text-red-500' : 'text-[#717182]'">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input v-model="form.username" type="text" @input="errors.username = ''"
                                    class="w-full pl-11 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:ring-1 outline-none text-black transition-all"
                                    :class="errors.username ? 'border-red-500 focus:ring-red-500' : 'border-[#04C18F80] focus:ring-[#008169]'" />
                            </div>
                            <!-- Inline Statement -->
                            <p v-if="errors.username" class="text-[11px] text-red-500 font-medium ps-1">{{
                                errors.username }}</p>
                        </div>

                        <!-- Password Field -->
                        <div class="space-y-1.5 text-left">
                            <label class="text-sm font-normal text-gray-800 ps-1">{{ currentLang === 'ar' ?
                                'كلمة المرور' : 'Password' }}</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors"
                                    :class="errors.password ? 'text-red-500' : 'text-[#717182]'">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </span>
                                <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    @input="errors.password = ''"
                                    class="w-full pl-11 pr-12 py-2.5 bg-white border rounded-lg text-sm focus:ring-1 outline-none text-black transition-all"
                                    :class="errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#04C18F80] focus:ring-[#008169]'" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#717182] hover:text-[#008169] transition-colors">
                                    <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                </button>
                            </div>
                            <!-- Inline Statement -->
                            <p v-if="errors.password" class="text-[11px] text-red-500 font-medium ps-1">{{
                                errors.password }}</p>
                        </div>

                        <!-- Forgot Password Link -->
                        <div class="flex justify-end px-1 !mt-1">
                            <button type="button" @click="authMode = 'forgot'"
                                class="text-xs font-medium text-[#008169] hover:underline">
                                {{ currentLang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?' }}
                            </button>
                        </div>

                        <p v-if="loginError" class="text-[12px] text-red-500 font-medium text-center -mb-1">{{ loginError }}</p>

                        <button type="submit" :disabled="loading"
                            class="w-full py-3 !mt-6 bg-[#008169] hover:bg-[#006b56] text-white rounded-lg font-medium text-sm transition-all active:scale-95 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                            {{ loading ? 'Logging in…' : (currentLang === 'ar' ? 'تسجيل الدخول' : 'Login to Dashboard') }}
                        </button>
                    </form>
                </div>

                <!-- FORGOT PASSWORD FORM -->
                <div v-else key="forgot">
                    <div class="text-center mb-10">
                        <h2 class="text-2xl font-bold text-black mb-3">
                            {{ currentLang === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password' }}
                        </h2>
                        <p class="text-sm text-[#717182] leading-relaxed max-w-[280px] mx-auto">
                            {{ currentLang === 'ar' ? 'يرجى إدخال البريد الإلكتروني المرتبط بحسابك.' :
                                'Please enter the email associated with your account.' }}
                        </p>
                    </div>

                    <form @submit.prevent="handleForgotPassword" class="space-y-4">
                        <div class="space-y-1.5 text-left">
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors"
                                    :class="errors.email ? 'text-red-500' : 'text-[#717182]'">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>
                                <input v-model="form.email" type="email" @input="errors.email = ''"
                                    :placeholder="currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'"
                                    class="w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-sm outline-none transition-all placeholder:text-gray-300 text-black"
                                    :class="errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#04C18F80] focus:ring-[#008169]'" />
                            </div>
                            <p v-if="errors.email" class="text-[11px] text-red-500 font-medium ps-1">{{ errors.email }}
                            </p>
                        </div>

                        <button type="submit"
                            class="w-full py-3 bg-[#014E40] hover:bg-[#00342A] text-white rounded-[40px] font-bold text-sm transition-all active:scale-95 shadow-lg">
                            {{ currentLang === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password' }}
                        </button>

                        <button type="button" @click="authMode = 'login'; errors.email = ''"
                            class="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black transition-colors pt-4 font-medium">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" :class="currentLang === 'ar' ? 'rotate-180' : ''">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            {{ currentLang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login' }}
                        </button>
                    </form>
                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
    currentLang: { type: String, default: 'en' },
    isDark: Boolean
})

const { login, admin } = useAdminAuth()

const authMode     = ref('login')
const form         = reactive({ username: '', password: '', email: '' })
const errors       = reactive({ username: '', password: '', email: '' })
const showPassword = ref(false)
const loading      = ref(false)
const loginError   = ref('')

function dashboardRoute(adminUser) {
    const role = adminUser?.role?.name
    const dept = adminUser?.department?.name
    if (role === 'Super Admin')                                                            return '/admin/roles'
    if (role === 'Implementation Manager')                                                 return '/admin/implementation/manager'
    if (role === 'Implementation Consultant')                                              return '/admin/implementation/member'
    if (role === 'Review Manager' && dept === 'Review')                                   return '/review-manager/dashboard'
    if ((role === 'Team Lead' || role === 'Review Consultant') && dept === 'Review')      return '/review-team-member/dashboard'
    return '/admin'
}

const handleLogin = async () => {
    errors.username = ''
    errors.password = ''
    loginError.value = ''

    if (!form.username) {
        errors.username = props.currentLang === 'ar' ? 'يرجى إدخال اسم المستخدم' : 'Please enter your username'
    }
    if (!form.password) {
        errors.password = props.currentLang === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password'
    }
    if (errors.username || errors.password) return

    loading.value = true
    try {
        await login(form.username, form.password)
        await navigateTo(dashboardRoute(admin.value))
    } catch (e) {
        loginError.value = e?.data?.message ?? e?.message ?? 'Invalid credentials'
    } finally {
        loading.value = false
    }
}

const handleForgotPassword = () => {
    errors.email = ''
    if (!form.email) {
        errors.email = props.currentLang === 'ar' ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email'
        return
    }
    console.log('Sending reset link...')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>