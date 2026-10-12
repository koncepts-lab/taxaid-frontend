<template>
    <div v-if="extraHoursAllowed > 0" class="mb-8 p-4 rounded-2xl flex items-center gap-4 transition-all"
        :class="isDark ? 'bg-[#002E26] border border-[#00FFBC]/30 text-white' : 'bg-[#40D9B1A6] border border-[#00FFBC]/20 text-[#013e32]'">
        <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            :class="isDark ? 'bg-white/10' : 'bg-white/20'">
            <img src="/images/icons/bulb.svg" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
        </div>
        <p class="text-[16px] font-normal leading-relaxed">
            {{ currentLang === 'ar' ? banner.textAr : banner.text }}
        </p>
    </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { banner, extraHoursAllowed } = useAppointmentsPage()
</script>

<style scoped>
</style>
