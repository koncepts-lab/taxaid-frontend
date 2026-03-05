<template>
  <div class="rounded-[20px] p-4 flex flex-col h-[225px] relative overflow-hidden group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Cost Center'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Cost-Center-Project-black.svg" alt="Cost Center" class="w-5 h-5 object-contain" />
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'مركز التكلفة / المشروع' : 'Cost Center / Project' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-end">
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'المشاريع النشطة' : 'Active Projects' }}</div>
         <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">12</div>
        <div class="flex items-center gap-1 text-[#05B743] font-medium text-[14px] mt-2">
           <span><img src="/images/icons/up.svg" alt="Up" class="w-4 h-4" /></span>
           <span>{{ currentLang === 'ar' ? '2% مقارنة بالشهر الماضي' : '2% vs last month' }}</span>
        </div>
      </div>

      <!-- Mini Wave Chart -->
      <div class="w-28 h-16 mb-2 animate-sweep-right">
        <svg viewBox="0 0 120 60" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="costCenterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00B794" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#00B794" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          
          <!-- Wave fill -->
          <path 
            d="M 0 45 Q 15 35, 30 40 Q 45 45, 60 25 Q 75 10, 90 30 Q 105 45, 120 15 L 120 60 L 0 60 Z" 
            fill="url(#costCenterGradient)" 
          />
          
          <!-- Wave stroke -->
          <path 
            d="M 0 45 Q 15 35, 30 40 Q 45 45, 60 25 Q 75 10, 90 30 Q 105 45, 120 15" 
            stroke="#00B794" 
            stroke-width="3" 
            stroke-linecap="round" 
            fill="none" 
          />
        </svg>
      </div>
    </div>

    <!-- Footer Text -->
    <div class="mt-auto transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
      <p class="text-[12px] font-regular">
        <template v-if="currentLang === 'ar'">
          أضافت <span :class="isDark ? 'text-white' : 'text-[#000]'">Atria.co</span> مؤخرًا مشروعين جديدين. <br/>تعزيز النشاط التشغيلي.
        </template>
        <template v-else>
          <span :class="isDark ? 'text-white' : 'text-[#000]'">Atria.co</span> recently added 2 new projects. <br/>Strengthening operational activity.
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Cost Center')
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
