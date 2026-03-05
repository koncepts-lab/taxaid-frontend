<template>
  <div class="rounded-[20px] p-5 flex flex-col h-[250px] group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Financial Statement'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3">
        <div 
          class="w-12 h-12 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Financial-Statement-black.svg" alt="Financials" class="w-6 h-6 object-contain" />
        </div>
       <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'القوائم المالية' : 'Financial Statements' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>

    <!-- Charts Container -->
    <div class="flex-1 flex justify-between items-center px-2">
      <div v-for="(item, index) in financials" :key="index" class="flex flex-col items-center gap-1">
        <!-- SVG Gauge -->
        <div class="relative w-[100px] h-[100px]">
           <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
             <!-- Background Circle -->
             <circle 
               cx="50" cy="50" r="45" 
               fill="none" 
               :stroke="item.bgColor" 
               stroke-width="8" 
               stroke-opacity="0.3" 
             />
             <!-- Progress Arc -->
             <circle 
               cx="50" cy="50" r="45" 
               fill="none" 
               :stroke="item.color" 
               stroke-width="8" 
               stroke-linecap="round"
               :stroke-dasharray="`${(item.progress * (animProgress / 100)) * 2.83} 283`"
             />
             <!-- Marker Circle (Calculated position) -->
             <circle 
                v-if="item.progress > 0"
                :cx="getMarkerPos(item.progress * (animProgress / 100)).x" 
                :cy="getMarkerPos(item.progress * (animProgress / 100)).y" 
                r="5" 
                fill="white" 
                :stroke="item.color"
                stroke-width="2"
             />
           </svg>
           <!-- Center Text -->
           <div class="absolute inset-0 flex items-center justify-center transform">
             <span class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-[#000]'">{{ item.value }}</span>
           </div>
        </div>
        <!-- Label -->
        <div class="text-[13px] font-medium text-center leading-tight transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-gray-600'">
          {{ currentLang === 'ar' ? item.labelAr : item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Financial Statement')

const animProgress = ref(0);

onMounted(() => {
  let startTimestamp: number | null = null;
  const duration = 1200;
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

const financials = [
  { label: 'Revenue Growth', labelAr: 'نمو الإيرادات', value: '+8.2%', progress: 75, color: '#009848', bgColor: '#009848' }, // Green
  { label: 'Net Profit Margin', labelAr: 'هامش الربح الصافي', value: '+4.8%', progress: 60, color: '#036192', bgColor: '#036192' }, // Blue
  { label: 'Liquidity Status', labelAr: 'حالة السيولة', value: '+2.2%', progress: 35, color: '#F1B208', bgColor: '#F1B208' }  // Yellow
];

// Helper to calculate marker position
// R = 45, Center = 50, 50.
// Angle = progress / 100 * 360
// We need to convert to radians.
const getMarkerPos = (pct: number) => {
  const angle = (pct * 3.6) * (Math.PI / 180);
  // Default SVG starts at 3 o'clock (0 rad). We rotated container -90deg, so 0 is at top vertically visually.
  // Actually, circle with stroke-dasharray starts at 3 o'clock. 
  // Container rotate -90 means 3 o'clock becomes 12 o'clock.
  // We need coordinates relative to standard circle geometry
  return {
    x: 50 + 45 * Math.cos(angle),
    y: 50 + 45 * Math.sin(angle)
  };
};
</script>
