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
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'استخدام الرموز' : 'Token Usage' }}</div>
        <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatNumber(tokenUsed) }} / {{ formatNumber(tokenTotal) }}</div>
       <div v-if="trendDelta !== 0" class="flex items-center gap-1 font-medium text-[14px] mt-2" :class="trendDelta > 0 ? 'text-red-500' : 'text-[#05B743]'">
           <svg v-if="trendDelta > 0" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg>
           <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7L17 17M17 17H8M17 17V8" /></svg>
           <span>{{ tokenUsagePercent }} vs last month</span>
        </div>
        <div v-else class="flex items-center gap-1 font-medium text-[14px] mt-2 text-gray-400">
           <span>{{ tokenUsagePercent }} vs last month</span>
        </div>
        <div class="text-[11px] mt-1 transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">
          {{ currentLang === 'ar'
            ? `تم استخدام ${formatNumber(requestsUsed)} من أصل ${formatNumber(requestsTotal)} طلب.`
            : `${formatNumber(requestsUsed)} of ${formatNumber(requestsTotal)} total requests used.` }}
        </div>
        <div class="text-[11px] transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">
          {{ currentLang === 'ar'
            ? `تم استخدام ${reviewHoursUsed} من أصل ${reviewHoursTotal} ساعة مراجعة.`
            : `${reviewHoursUsed} of ${reviewHoursTotal} hrs review time used.` }}
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
            :stroke="limitReached ? '#E53E3E' : '#F1B208'"
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
            v-if="animProgress > 0 && usagePctValue > 0"
            :cx="getMarkerPos(animProgress).x"
            :cy="getMarkerPos(animProgress).y"
            r="6"
            fill="#fff"
            :stroke="limitReached ? '#E53E3E' : '#DCAA06'"
            stroke-width="2.5"
          />
        </svg>

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex items-center gap-1 font-semibold text-[14px] transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">
            <span>{{ Math.round(usagePctValue) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Stats — deadlines looped (future types like CT just append to the array) -->
    <div class="flex flex-col gap-1 mt-auto">
      <div v-for="item in deadlines" :key="item.id" class="text-[12px] flex justify-start">
        <span class="text-[12px] font-regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ deadlineLabel(item.id) }}:</span>
        <span class="font-medium transition-colors duration-300" :class="[currentLang === 'ar' ? 'mr-2' : 'ml-2', isDark ? 'text-white' : 'text-[#000]']">{{ item.date ?? '-' }}</span>
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

// ── Pull values from useDashboard() — live GET /dashboard, same as every other card ──
const { taxQueries } = useDashboard()

const tokenUsed        = computed(() => taxQueries.value?.tokenUsed ?? 0)
const tokenTotal       = computed(() => taxQueries.value?.tokenTotal ?? 0)
const tokenUsagePercent = computed(() => taxQueries.value?.tokenUsagePercent ?? '+0%')
const requestsUsed     = computed(() => taxQueries.value?.requestsUsed ?? 0)
const requestsTotal    = computed(() => taxQueries.value?.requestsTotal ?? 0)
const deadlines        = computed(() => taxQueries.value?.deadlines ?? [])
const reviewHoursUsed  = computed(() => taxQueries.value?.reviewHoursUsed ?? 0)
const reviewHoursTotal = computed(() => taxQueries.value?.reviewHoursTotal ?? 0)

// Deadline labels/translations, keyed by the backend's `id`.
const deadlineLabels: Record<string, { en: string; ar: string }> = {
  vat: { en: 'VAT Return Due', ar: 'موعد تقديم ضريبة القيمة المضافة' },
}
const deadlineLabel = (id: string) => {
  const l = deadlineLabels[id]
  if (!l) return id
  return currentLang.value === 'ar' ? l.ar : l.en
}

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n)

// Donut fill = actual quota usage (tokenUsed/tokenTotal), not the trend delta —
// the trend delta is only for the center arrow/percent overlay.
const usagePctValue = computed(() => {
  if (!tokenTotal.value) return 0;
  return Math.min(100, (tokenUsed.value / tokenTotal.value) * 100);
});

const limitReached = computed(() => tokenTotal.value > 0 && tokenUsed.value >= tokenTotal.value);

// Parsed trend delta (e.g. "+2.4%" -> 2.4, "-1%" -> -1) — drives the center arrow only.
const trendDelta = computed(() => {
  const match = tokenUsagePercent.value.match(/-?[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
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
