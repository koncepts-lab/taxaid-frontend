<template>
  <div v-if="show" 
    class="flex items-center justify-between px-6 py-4 rounded-xl mb-6 transition-all duration-300"
    :class="isDark ? 'bg-[#FF990022] border border-[#FF990044]' : 'bg-[#FFF4E5] border border-[#FF990022]'">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isDark ? 'bg-[#FF990033]' : 'bg-[#FF990011]'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V11M12 15H12.01M5.07001 19H18.93C20.47 19 21.43 17.33 20.66 16L13.73 4C12.96 2.67 11.04 2.67 10.27 4L3.34001 16C2.57001 17.33 3.53001 19 5.07001 19Z" stroke="#FF9900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <h4 class="text-[14px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
          {{ currentLang === 'ar' ? 'تنبيه بعدم تطابق البيانات' : 'Data Mismatch Alert' }}
        </h4>
        <p class="text-[12px] opacity-70" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
          {{ currentLang === 'ar' ? 'إجمالي حسابات القبض لا يتطابق مع رصيد الأستاذ العام - يرجى تصحيحه في نظام تخطيط موارد المؤسسات الخاص بك.' : 'AR total doesn\'t match ledger balance — please correct it in your ERP.' }}
        </p>
      </div>
    </div>
    <button @click="show = false" class="p-2 transition-opacity hover:opacity-100 opacity-60">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const show = ref(true)
</script>
