<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 rounded-[20px] p-4 shadow-sm flex flex-col justify-between h-[225px] relative overflow-hidden group cursor-pointer hover:shadow-[0_0_10px_#00B794] transition-all duration-300 gap-1"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div 
          class="w-12 h-12 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/C.O.G.S-black.svg" alt="C.O.G.S" class="w-5 h-5 object-contain" />
        </div>
        <div class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'تكلفة البضائع المباعة' : 'C.O.G.S' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] opacity-0 group-hover:opacity-100 transition-all duration-300"
      />
    </div>

    <div class="flex justify-between items-start z-10">
      <!-- Left Content -->
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'نسبة تكلفة البضائع المباعة إلى الإيرادات' : 'COGS to Revenue Ratio' }}</div>
        <div class="text-[40px] font-semibold leading-tight transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">65%</div>
        <div class="flex items-center gap-1 text-[#05B743] font-medium text-[14px] mt-1">
          <span><img src="/images/icons/up.svg" alt="C.O.G.S" class="w-4 h-4 object-contain" /></span>
          <span class="text-[12px] font-Regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? '2% مقارنة بالشهر الماضي' : '2% vs last month' }}</span>
        </div>
      </div>


      <!-- Right Graph Area -->
      <div 
        class="absolute top-[70px] w-[140px] h-[100px] animate-sweep-right"
        :class="currentLang === 'ar' ? 'left-[15px]' : 'right-[15px]'"
      >
         <svg class="w-full h-full" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <linearGradient id="cogsWaveGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="#00B794" stop-opacity="0.3"/>
                 <stop offset="100%" stop-color="#00B794" stop-opacity="0"/>
               </linearGradient>
             </defs>
             
             <!-- Smooth wave path with fill -->
             <path 
               d="M 0 60 Q 20 25, 40 40 Q 60 55, 80 20 Q 100 5, 120 35 Q 130 45, 140 40 L 140 100 L 0 100 Z" 
               fill="url(#cogsWaveGradient)" 
             />
             
             <!-- Wave stroke line -->
             <path 
               d="M 0 60 Q 20 25, 40 40 Q 60 55, 80 20 Q 100 5, 120 35 Q 130 45, 140 40" 
               stroke="#00B794" 
               stroke-width="3" 
               stroke-linecap="round" 
               fill="none" 
             />
             
             <!-- Marker circle at the highest peak -->
             <circle cx="80" cy="20" r="5" fill="white" stroke="#00B794" stroke-width="3" />
         </svg>
      </div>
    </div>

    <div class="text-[12px] leading-snug transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">
      {{ currentLang === 'ar' ? 'تم تحقيق كفاءة تشغيلية أكبر.' : 'Achieved greater operational efficiency.' }}<br>
      {{ currentLang === 'ar' ? 'والآن يتم فتح هوامش ربح أعلى.' : 'Now unlocking higher profit margins.' }}
    </div>
  </div>
</template>

<script setup lang="ts">
const currentLang = useState('currentLang')
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
