<template>
    <div class="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
        <div
            class="bg-white rounded-[14px] w-full max-w-md py-10 px-8 md:p-14 shadow-sm border border-gray-100 transition-all duration-300">

            <div class="text-center mb-10">
                <div class="flex justify-center mb-4">
                    <div class="flex items-center gap-1">
                        <img src="/images/logo.svg" alt="TaxAid Logo" class=" h-8">
                    </div>
                </div>
                <h1 class="text-base font-normal text-black mb-2">Admin Dashboard Login</h1>
                <p class="text-sm text-[#717182] mx-auto">
                    Your central gateway to ticketing, implementation, and review operations.
                </p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">

                <div class="space-y-3 text-left">
                    <label class="text-sm font-normal text-gray-800 ps-1">Your Name</label>
                    <div class="relative group">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#717182]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <input v-model="form.name" type="text" placeholder="Enter your name"
                            class="w-full pl-10 pr- py-2.5 bg-white border border-[#04C18F80] rounded-xl text-sm focus:ring-1 focus:ring-[#008169] outline-none transition-all placeholder:text-[#717182]" />
                    </div>
                </div>

                <div class="space-y-2 text-left relative" ref="roleRef">
                    <label class="text-sm font-normal text-gray-800 ps-1">Select Your Role</label>
                    <button type="button" @click="toggleDropdown('role')"
                        class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#04C18F80] rounded-xl text-sm transition-all outline-none"
                        :class="isRoleOpen ? ' border-[#04C18F80]' : ''">
                        <span :class="form.role ? 'text-gray-900' : 'text-gray-300'">{{ form.role || 'Select a role'
                        }}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" class="transition-transform duration-200 text-gray-300"
                            :class="isRoleOpen ? 'rotate-180' : ''">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <transition name="dropdown">
                        <div v-if="isRoleOpen"
                            class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                            <div v-for="role in roles" :key="role" @click="selectOption('role', role)"
                                class="px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-colors"
                                :class="form.role === role ? 'bg-[#E6FDF9] text-black font-normal' : 'text-gray-700 hover:bg-[#E6FDF9] hover:text-[#008169]'">
                                {{ role }}
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="space-y-2 text-left relative" ref="deptRef">
                    <label class="text-sm font-normal text-gray-800 ps-1">Your Department</label>
                    <button type="button" @click="toggleDropdown('dept')"
                        class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#04C18F80] rounded-xl text-sm transition-all outline-none"
                        :class="isDeptOpen ? ' border-[#04C18F80]' : ''">
                        <span :class="form.dept ? 'text-gray-900' : 'text-gray-300'">{{ form.dept ||
                            'Select a department' }}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" class="transition-transform duration-200 text-gray-300"
                            :class="isDeptOpen ? 'rotate-180' : ''">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <transition name="dropdown">
                        <div v-if="isDeptOpen"
                            class="absolute z-40 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2">
                            <div v-for="dept in departments" :key="dept" @click="selectOption('dept', dept)"
                                class="px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-colors"
                                :class="form.dept === dept ? 'bg-[#E6FDF9] text-black font-normal' : 'text-gray-700 hover:bg-[#E6FDF9] hover:text-[#008169]'">
                                {{ dept }}
                            </div>
                        </div>
                    </transition>
                </div>

                <button type="submit"
                    class="w-full py-2.5 bg-[#008169] hover:bg-[#006b56] text-white rounded-lg font-normal text-sm transition-all active:scale-95 shadow-md shadow-[#008169]/20">
                    Login to Dashboard
                </button>

                <div class="text-center pt-2">
                    <p class="text-sm text-gray-600">
                        Don't have an account?
                        <a href="#" class="text-[#008169] font-medium hover:underline">Sign up here</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const form = reactive({
    name: '',
    role: 'Implementation Team Member',
    dept: 'Implementation Team'
})

const isRoleOpen = ref(false)
const isDeptOpen = ref(false)
const roleRef = ref(null)
const deptRef = ref(null)

const roles = [
    'Implementation Team Member',
    'Review Team Member',
    'Implementation Team Lead',
    'Review Team Lead',
    'Implementation Manager',
    'Review Manager',
    'Tech Team Member',
    'Vice President of Technology',
    'Admin'
]

const departments = [
    'Implementation Team',
    'Business Review Team',
    'Customer Support Team',
    'Sales & Marketing',
    'R & D',
    'Tech / Development Team'
]

const toggleDropdown = (type) => {
    if (type === 'role') {
        isRoleOpen.value = !isRoleOpen.value
        isDeptOpen.value = false
    } else {
        isDeptOpen.value = !isDeptOpen.value
        isRoleOpen.value = false
    }
}

const selectOption = (type, value) => {
    form[type] = value
    isRoleOpen.value = false
    isDeptOpen.value = false
}

const handleLogin = () => {
    console.log('Logging in with:', form)
}

const handleClickOutside = (event) => {
    if (roleRef.value && !roleRef.value.contains(event.target)) isRoleOpen.value = false
    if (deptRef.value && !deptRef.value.contains(event.target)) isDeptOpen.value = false
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>