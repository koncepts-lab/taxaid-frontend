<template>
  <div
    class="h-full min-h-[160px] rounded-[20px] flex flex-col items-center justify-center gap-2 p-6 text-center border"
    :class="isDark ? 'bg-[#01332a] border-[#063f34] text-white/70' : 'bg-white border-gray-200 text-gray-500'">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
    </svg>
    <p class="text-sm font-medium">{{ title }}</p>
    <p class="text-xs">{{ currentLang === 'ar' ? 'غير متاح لدورك' : 'Not available for your role' }}</p>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: '' } })
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>
