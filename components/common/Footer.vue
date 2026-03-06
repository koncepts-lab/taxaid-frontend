<template>
  <footer class="pt-8 pb-8 px-8 transition-colors duration-300"
    :class="[isDark ? 'text-white/30' : 'text-[#666666]/60']">
    <div class="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[12px] font-normal px-2">
      <div>
        {{ currentLang === 'ar' ? 'جميع الحقوق محفوظة @2025' : 'Copyright Reserved @2025' }}
      </div>
      <div>
        {{ currentLang === 'ar' ? 'آخر مزامنة: ' : 'Last Sync: ' }}{{ lastSync }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentLang = useState('currentLang')
const { isDark } = useTheme()

const lastSync = ref('')

onMounted(() => {
  const now = new Date()
  const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }
  lastSync.value = now.toLocaleDateString(currentLang.value === 'ar' ? 'ar-EG' : 'en-US', options)
})
</script>
