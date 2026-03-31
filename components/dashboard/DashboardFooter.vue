<template>
  <footer class="fixed bottom-0 inset-x-0 h-[60px] bg-[#f3f4f6]/80 backdrop-blur-md flex items-center justify-between px-8 text-[13px] text-gray-400 z-30">
    <div>{{ currentLang === 'ar' ? 'جميع الحقوق محفوظة @2025' : 'Copyright Reserved @2025' }}</div>
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
      {{ currentLang === 'ar' ? 'آخر مزامنة: ' : 'Last Sync: ' }} 19 Oct 2025, 10:45 AM IST
    </div>
  </footer>
</template>

<script setup>
const currentLang = useState('currentLang')
</script>
