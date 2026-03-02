<template>
  <div class="rounded-[20px] p-4 shadow-sm flex flex-col h-[225px] relative overflow-hidden group cursor-pointer hover:shadow-[0_0_10px_#00B794] transition-all duration-300"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Accounts-Payable-black.svg" alt="Payable" class="w-5 h-5 object-contain" />
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'حسابات الدفع' : 'Accounts Payable' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] opacity-0 group-hover:opacity-100 transition-all duration-300"
      />
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-end">
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'إجمالي الذمم الدائنة المستحقة' : 'Total Outstanding Payables' }}</div>
        <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">
          <span class="mr-1"><img :src="isDark ? '/images/icons/AED-dark.svg' : '/images/icons/AED.svg'" alt="AED" class="w-7" /></span>140,175
        </div>
        <div class="flex items-center gap-1 text-[#FB7554] font-medium text-[14px] mt-2">
           <span><img src="/images/icons/down-right.svg" alt="Down" class="w-4 h-4" /></span>
           <span>8% vs last month</span>
        </div>
      </div>

      <!-- Small Bar Chart -->
      <div class="flex items-end gap-2 h-20 mb-1 animate-sweep-right">
        <div class="w-3 h-[75%] bg-[#00B794] rounded-full"></div>
        <div class="w-3 h-[50%] bg-[#004D4E] rounded-full"></div>
        <div class="w-3 h-[80%] bg-[#00B794] rounded-full"></div>
        <div class="w-3 h-[55%] bg-[#004D4E] rounded-full"></div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="flex flex-col gap-1">
      <div class="text-[12px]">
        <span class="text-gray-400 transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ currentLang === 'ar' ? 'تجاوزت موعد الاستحقاق: ' : 'Overdue: ' }}</span>
        <span class="font-bold transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">₹ 35L</span>
      </div>
      <div class="text-[12px]">
        <span class="text-gray-400 transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ currentLang === 'ar' ? 'مستحقة في الـ 30 يوم القادمة: ' : 'Due in next 30 days: ' }}</span>
        <span class="font-bold transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">₹ 90L</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
</script>

<style scoped>
@keyframes sweep-right {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.animate-sweep-right {
  animation: sweep-right 1.2s ease-out forwards;
}
</style>
