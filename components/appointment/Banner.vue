<template>
    <div class="mb-8 p-4 rounded-2xl flex items-center gap-4 transition-all"
        :class="isDark ? 'bg-[#00FFBC]/10 border border-[#00FFBC]/30 text-[#00FFBC]' : 'bg-[#40D9B1A6] border border-[#00FFBC]/20 text-[#013e32]'">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <img src="/images/icons/bulb.svg" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
        </div>
        <p class="text-[16px] font-normal leading-relaxed">
            {{ currentLang === 'ar' ? 'يمكنك طلب ما يصل إلى 3 ساعات إضافية شهرياً، وتخضع لتوفر المستشار.' : 'You can request up to 3 extra hours per month, subject to consultant availability.' }}
        </p>
    </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>

<style scoped>
</style>
