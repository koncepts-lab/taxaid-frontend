<template>
  <div 
    class="rounded-[20px] p-4 flex flex-col h-[290px] relative overflow-hidden group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Tax Queries'"
    @mouseleave="hoveredMenuItem = null"
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
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? (taxQueries?.labelsAr?.tokenUsage ?? 'استخدام الرموز') : (taxQueries?.labels?.tokenUsage ?? 'Token Usage') }}</div>
        <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatNumber(tokenUsed) }} / {{ formatNumber(tokenTotal) }}</div>
       <div class="flex items-center gap-1 font-medium text-[14px] mt-2" :class="trend === 'up' ? 'text-[#05B743]' : 'text-red-500'">
           <span><img :src="trend === 'up' ? '/images/icons/up.svg' : '/images/icons/down-right.svg'" alt="Trend" class="w-4 h-4" /></span>
           <span>{{ tokenUsagePercent }} vs last month</span>
        </div>
      </div>

      <!-- Donut Chart -->
      <div class="relative w-24 h-24">
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <!-- Main usage segment (Dynamic) -->
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="#F1B208" 
            stroke-width="10" 
            :stroke-dasharray="`${(animProgress / 100) * usagePctValue * 2.513} 251.3`" 
            stroke-dashoffset="0" 
            stroke-linecap="round" 
            transform="rotate(-90 50 50)"
          />
          
          <!-- Remaining capacity segment -->
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="#C5E1DB" 
            stroke-width="10" 
            :stroke-dasharray="`251.3`" 
            :stroke-dashoffset="`${- (animProgress / 100) * usagePctValue * 2.513}`"
            stroke-linecap="round" 
            transform="rotate(-90 50 50)"
            style="transition: stroke-dashoffset 0.3s ease-out;"
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
            <span><img :src="trend === 'up' ? '/images/icons/up.svg' : '/images/icons/down-right.svg'" alt="Trend" class="w-4 h-4" /></span>
            <span>{{ tokenUsagePercent.replace('+', '').replace('-', '') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="flex flex-col gap-1 mt-auto">
      <div class="text-[12px] flex justify-start">
        <span  class="text-[12px] font-regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? (taxQueries?.labelsAr?.vatDue ?? 'موعد تقديم ضريبة القيمة المضافة:') : (taxQueries?.labels?.vatDue ?? 'VAT Return Due:') }}</span>
        <span class="font-medium transition-colors duration-300" :class="[currentLang === 'ar' ? 'mr-2' : 'ml-2', isDark ? 'text-white' : 'text-[#000]']">{{ vatReturnDue }}</span>
      </div>
      <div class="text-[12px] flex justify-start">
        <span class="text-[12px] font-regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? (taxQueries?.labelsAr?.ctDue ?? 'موعد تقديم ضريبة الشركات:') : (taxQueries?.labels?.ctDue ?? 'CT Return Due:') }}</span>
        <span class="font-medium transition-colors duration-300" :class="[currentLang === 'ar' ? 'mr-2' : 'ml-2', isDark ? 'text-white' : 'text-[#000]']">{{ ctReturnDue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Tax Queries')

// ── Pull values from website-data.json ────────────────────────────────────
const { taxQueries } = useMainDashboard()

const tokenUsed        = computed(() => taxQueries.value?.tokenUsed ?? 8001)
const tokenTotal       = computed(() => taxQueries.value?.tokenTotal ?? 10485)
const tokenUsagePercent = computed(() => taxQueries.value?.tokenUsagePercent ?? '+8.4%')
const trend            = computed(() => taxQueries.value?.trend ?? 'up')
const vatReturnDue     = computed(() => currentLang.value === 'ar' ? (taxQueries.value?.vatReturnDueAr ?? '28 يناير 2026') : (taxQueries.value?.vatReturnDue ?? '28 Jan 2026'))
const ctReturnDue      = computed(() => currentLang.value === 'ar' ? (taxQueries.value?.ctReturnDueAr ?? '30 يونيو 2026') : (taxQueries.value?.ctReturnDue ?? '30 Jun 2026'))

const formatNumber = (n: number) => new Intl.NumberFormat().format(n)

// Parse numeric percentage for the gauge (e.g., "+2.4%" -> 2.4)
const usagePctValue = computed(() => {
  const match = tokenUsagePercent.value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 75;
});

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
  // Total span = 360deg. Percentage of span is usagePctValue.
  const angleDeg = -90 + (progress / 100) * usagePctValue.value * 3.6;
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
