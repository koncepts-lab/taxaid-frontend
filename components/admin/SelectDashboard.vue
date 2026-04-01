<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300"
        :class="isDark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
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

        <!-- Cards Container -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

            <!-- Card 1: Ticketing System -->
            <div class="group bg-white rounded-[32px] p-10 flex flex-col items-center text-center shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                :class="isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-[#68E4C44D]'">
                <div
                    class="w-20 h-20 rounded-full bg-[#E6FDF9] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#008169" stroke-width="1.5">
                        <path
                            d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-normal mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ currentLang === 'ar' ? 'نظام التذاكر' : 'Ticketing System' }}
                </h2>
                <p class="text-gray-500 text-sm leading-relaxed mb-10 max-w-[280px]">
                    {{ currentLang === 'ar' ? 'إدارة تذاكر دعم العملاء وتتبع المشكلات ومراقبة أوقات الحل' :
                        'Manage customer support tickets, track issues, and monitor resolution times' }}
                </p>
                <button @click="$emit('select', 'ticketing')"
                    class="w-full py-3.5 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl font-medium transition-all active:scale-95 shadow-md shadow-[#008169]/20">
                    {{ currentLang === 'ar' ? 'الدخول إلى لوحة التذاكر' : 'Access Ticketing Dashboard' }}
                </button>
            </div>

            <!-- Card 2: Revenue Partnership -->
            <div class="group bg-white rounded-[32px] p-10 flex flex-col items-center text-center shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                :class="isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-[#68E4C44D]'">
                <div
                    class="w-20 h-20 rounded-full bg-[#E6FDF9] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#008169" stroke-width="1.5">
                        <path d="M18 20V10M12 20V4M6 20v-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <h2 class="text-2xl font-normal mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ currentLang === 'ar' ? 'شراكة الإيرادات' : 'Revenue Partnership' }}
                </h2>
                <p class="text-gray-500 text-sm leading-relaxed mb-10 max-w-[280px]">
                    {{ currentLang === 'ar' ? 'تتبع الإيرادات وإدارة الشركاء وتحليل التكاليف ومراقبة المقاييس المالية' :
                        'Track revenue, manage partners, analyze costs, and monitor financial metrics' }}
                </p>
                <button @click="$emit('select', 'revenue')"
                    class="w-full py-3.5 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl font-medium transition-all active:scale-95 shadow-md shadow-[#008169]/20">
                    {{ currentLang === 'ar' ? 'الدخول إلى لوحة الإيرادات' : 'Access Revenue Dashboard' }}
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
defineProps({
    isDark: Boolean,
    currentLang: { type: String, default: 'en' }
})

defineEmits(['select'])
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