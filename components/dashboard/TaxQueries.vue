<template>
  <div 
    class="rounded-[20px] p-4 shadow-sm flex flex-col h-[225px] relative overflow-hidden group cursor-pointer hover:shadow-[0_0_10px_#00B794] transition-all duration-300"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white'"
    :dir="currentLang === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Tax-Queries-black.svg" alt="Tax Queries" class="w-5 h-5 object-contain" />
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'استفسارات ضريبية' : 'Tax Queries' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] opacity-0 group-hover:opacity-100 transition-all duration-300"
      />
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'استخدام الرموز' : 'Token Usage' }}</div>
        <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">8,001 / 10,485</div>
       <div class="flex items-center gap-1 text-[#05B743] font-medium text-[14px] mt-2">
           <span><img src="/images/icons/up.svg" alt="Up" class="w-4 h-4" /></span>
           <span>+8.4% vs last month</span>
        </div>
      </div>

      <!-- Donut Chart -->
      <div class="relative w-24 h-24">
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <!-- Yellow/Gold segment (about 75% - bottom and sides) -->
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="#F1B208" 
            stroke-width="10" 
            :stroke-dasharray="`${(animProgress / 100) * 188.4} ${(1 - (animProgress / 100) * 0.75) * 251.3}`" 
            stroke-dashoffset="0" 
            stroke-linecap="round" 
            transform="rotate(-90 50 50)"
          />
          
          <!-- Light teal segment (about 25% - top) -->
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="#C5E1DB" 
            stroke-width="10" 
            stroke-dasharray="62.8 188.4" 
            stroke-dashoffset="-188.4"
            stroke-linecap="round" 
            transform="rotate(-90 50 50)"
          />
          
          <!-- Marker circle at the leading junction -->
          <circle 
            v-if="animProgress > 0"
            :cx="getMarkerPos(animProgress).x" 
            :cy="getMarkerPos(animProgress).y" 
            r="6" 
            fill="#fff" 
            stroke="#DCAA06" 
            stroke-width="2.5" 
          />
        </svg>
        
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex items-center gap-1 font-semibold text-[14px] transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">
            <span><img src="/images/icons/up.svg" alt="Up" class="w-4 h-4" /></span>
            <span>8.4%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="flex flex-col gap-1 mt-auto">
      <div class="text-[12px] flex justify-start">
        <span  class="text-[12px] font-regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'موعد تقديم ضريبة القيمة المضافة:' : 'VAT Return Due:' }}</span>
        <span class="font-medium transition-colors duration-300" :class="[currentLang === 'ar' ? 'mr-2' : 'ml-2', isDark ? 'text-white' : 'text-[#000]']">  {{ currentLang === 'ar' ? '28 يناير 2026' : '28 Jan 2026' }}</span>
      </div>
      <div class="text-[12px] flex justify-start">
        <span class="text-[12px] font-regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'موعد تقديم ضريبة الشركات:' : 'CT Return Due:' }}</span>
        <span class="font-medium transition-colors duration-300" :class="[currentLang === 'ar' ? 'mr-2' : 'ml-2', isDark ? 'text-white' : 'text-[#000]']">  {{ currentLang === 'ar' ? '30 يونيو 2026' : '30 Jun 2026' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()

const animProgress = ref(0);

onMounted(() => {
  let startTimestamp: number | null = null;
  const duration = 1500;
  const animate = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = timestamp - startTimestamp;
    animProgress.value = Math.min(100, (progress / duration) * 100);
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
});

const getMarkerPos = (progress: number) => {
  // Start at -90deg (12 o'clock)
  // End at 180deg (9 o'clock)
  // Total span = 270deg (75% of 360)
  const angleDeg = -90 + (progress / 100) * 270;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + 40 * Math.cos(rad),
    y: 50 + 40 * Math.sin(rad)
  };
};
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
