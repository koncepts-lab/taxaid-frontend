<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300"
        :class="isDark ? 'bg-[#0A0A0A]' : ''" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-3xl font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ currentLang === 'ar' ? 'اختر لوحة التحكم' : 'Select Dashboard' }}
            </h1>
            <p class="text-gray-500 text-sm">
                {{ currentLang === 'ar' ? 'اختر لوحة التحكم التي ترغب في الوصول إليها' :
                    "Choose which dashboard you'd like to access" }}
            </p>
        </div>

        <div class="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">

            <!-- Card 1: Ticketing System -->
            <SelectDashboardCard icon="/images/icons/Ticketing-System.svg" title="Ticketing System"
                description="Manage customer support tickets, track issues, and monitor resolution times"
                buttonLabel="Access Ticketing Dashboard" />

            <!-- Card 2: Revenue Partnership -->
            <SelectDashboardCard icon="/images/icons/Revenue-Partnership.svg" title="Implementation Dashboard"
                description="Manage client onboarding, GL codes, consultant assignments, and project tracking."
                buttonLabel="Access Implementation Dashboard" @click="navigateToRevenue" />

        </div>
    </div>
</template>

<script setup>
defineProps({
    isDark: Boolean,
    currentLang: { type: String, default: 'en' }
})

defineEmits(['select'])

function navigateToRevenue() {
    navigateTo('/admin/dashboard')
}
</script>

<style scoped>
/* Optional: Adding a soft fade-in animation for the whole screen */
.grid {
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>