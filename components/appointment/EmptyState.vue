<template>
    <div class="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-3xl border transition-all"
        :class="isDark ? 'bg-[#001410] border-[#03D8B0]/20' : 'bg-white border-gray-100 shadow-sm'">
        <div class="w-[80px] h-[80px] mb-6 rounded-full bg-[#8DF3DFE8] flex items-center justify-center animate-pulse">
            <svg class="w-10 h-10 text-[#00B995]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <h4 class="text-xl font-normal mb-2" :class="isDark ? 'text-white' : 'text-[#000]'">
            {{ currentLang === 'ar' ? 'لا توجد اجتماعات قادمة مجدولة' : 'No upcoming meetings scheduled' }}
        </h4>
        <p class="max-w-md mx-auto text-sm mb-8" :class="isDark ? 'text-white/60' : 'text-gray-500'">
            {{ currentLang === 'ar' ? 'ليس لديك أي مواعيد في تقويمك. حدد موعد اجتماعك الأول للبدء.' : 'You don\'t have any appointments on your calendar. Schedule your first meeting to get started.' }}
        </p>
        <button
            @click="$emit('schedule')"
            class="px-8 py-3 rounded-xl bg-[#63DABCEB] text-[#000] font-semibold hover:bg-[#00e6a9] active:scale-95 transition-all shadow-lg hover:shadow-[#00FFBC]/20 cursor-pointer">
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                </svg>
                <span>{{ currentLang === 'ar' ? 'جدولة موعدك الأول' : 'Schedule Your First Appointment' }}</span>
            </div>
        </button>
    </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

defineEmits(['schedule'])
</script>

<style scoped>
</style>
