<template>
  <div class="rounded-[20px] p-5 h-[280px] group cursor-pointer transition-all duration-300 flex flex-col justify-between border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Account Receivables'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
      <div class="flex items-center justify-between w-full md:w-auto">
        <div class="flex items-center gap-3">
          <div 
            class="w-12 h-12 rounded-full grid place-items-center"
            :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
          >
            <img src="/images/icons/Account-Receivables-black.svg" alt="Receivables" class="w-6 h-6 object-contain" />
          </div>
         <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'حسابات القبض' : 'Account Receivables' }}</div>
        </div>
      </div>

      <div class="flex items-center gap-3 mt-4 md:mt-0">

        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-3">
          <div v-for="(item, index) in legendItems" :key="index" class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors[index] }"></span>
            <span class="text-[12px] font-Regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? legendItemsAr[index] : item }}</span>
          </div>
        </div>
        <!-- Hover Icon -->
        <img 
          src="/images/icons/right-hover-2.svg" 
          alt="Arrow" 
          class="w-[35px] h-[35px] transition-all duration-300"
          :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
        />
      </div>
    </div>

    <!-- Chart Container -->
    <div class="h-[180px] w-full mt-4 flex gap-3">
      <div class="h-full flex-1 relative pl-12 pr-4">
        <!-- Y-Axis Labels (dynamic from data max) -->
        <div class="absolute flex flex-col justify-between text-[12px] font-Regular top-0 bottom-8 transition-colors duration-300"
          :class="[currentLang === 'ar' ? 'right-0 items-end' : 'left-0 items-start', isDark ? 'text-white/60' : 'text-[#00000080]']">
          <span v-for="tick in yAxisTicks" :key="tick" class="h-0 flex items-center">{{ tick }}</span>
        </div>

        <!-- Grid Lines -->
        <div class="absolute top-0 bottom-8 flex flex-col justify-between pointer-events-none" :class="currentLang === 'ar' ? 'right-12 left-4' : 'left-12 right-4'">
          <div class="border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'"></div>
          <div class="border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'"></div>
          <div class="border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'"></div>
          <div class="border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'"></div>
        </div>

        <!-- Bars Container -->
        <div class="h-full pb-8 flex items-end justify-around gap-2 transition-opacity duration-700" :style="{ opacity: animProgress / 100 }">
          <div v-for="(month, mIndex) in months" :key="mIndex" class="flex-1 h-full flex items-end justify-center">
            <div class="relative h-full flex items-end w-[13px] max-w-[13px] md:w-[26px] md:max-w-[26px]">
              <!-- Stacked Bars -->
              <div 
                v-for="(segment, sIndex) in getStackedSegments(mIndex)" 
                :key="sIndex"
                class="absolute bottom-0 left-0 right-0 transition-all duration-300"
                :style="{
                  height: segment.height,
                  bottom: segment.bottom,
                  backgroundColor: colors[segment.index],
                  borderRadius: getRoundedCorners(sIndex, getStackedSegments(mIndex).length),
                  zIndex: segment.zIndex
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- X-Axis Labels -->
        <div class="absolute bottom-0 h-8 flex items-center justify-around text-[12px] font-Regular transition-colors duration-300" 
          :class="[currentLang === 'ar' ? 'right-12 left-4' : 'left-12 right-4', isDark ? 'text-white/60' : 'text-[#00000080]']">
          <span v-for="(month, idx) in (currentLang === 'ar' ? monthsAr : months)" :key="idx" class="flex-1 text-center">{{ month }}</span>
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
const isHovered = computed(() => hoveredMenuItem.value === 'Account Receivables')

// ── Pull values from useDashboard() ───────────────────────────────────────
const { accountReceivables, arPeriod, fetchSummary } = useDashboard()

const selectArPeriod = (months: number) => {
  arPeriod.value = months
  // Timeline-only slice — the toggle doesn't need the AR report re-parsed
  fetchSummary(['ar_timeline'])
}

const isMobile = ref(false);
const animProgress = ref(0);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });

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
const legendItems   = computed(() => accountReceivables.value?.legendItems   ?? ['< 30 Days', '31-60 Days', '61-90 Days', '> 90 Days'])
const legendItemsAr = computed(() => accountReceivables.value?.legendItemsAr ?? ['أقل من 30 يوماً', '31-60 يوماً', '61-90 يوماً', 'أكثر من 90 يوماً'])
const colors        = computed(() => accountReceivables.value?.colors        ?? ['#003328', '#00966C', '#B2EDE3', '#E6EBEB'])
const months        = computed(() => accountReceivables.value?.months        ?? [])
const monthsAr      = computed(() => accountReceivables.value?.monthsAr      ?? [])

// Series as a flat array of arrays for stacked bar rendering
const series = computed(() => {
  const s = accountReceivables.value?.series
  return s
    ? [s.lt30Days, s.d31to60, s.d61to90, s.gt90Days]
    : [[], [], [], []]
})

// Y-axis tick labels (top→bottom) derived from the real data max, in AED M —
// no more hardcoded 60M/40M/20M scale.
const yAxisTicks = computed(() => {
  const max = accountReceivables.value?.yAxisMax ?? 0;
  const fmt = (v: number) => `${v >= 10 || v === 0 ? Math.round(v) : v.toFixed(1)}M`;
  return [fmt(max), fmt((max * 2) / 3), fmt(max / 3), fmt(0)];
});

const getStackedSegments = (monthIndex: number) => {
  const maxValue = accountReceivables.value?.yAxisMax ?? 1;
  const segments: Array<{ height: string; bottom: string; index: number; zIndex: number }> = [];
  const zIndexes = [10000, 1000, 100, 10];
  let cumulativePercent = 0;
  series.value.forEach((seriesData: number[], seriesIndex: number) => {
    const value = seriesData[monthIndex];
    // Skip empty segments entirely — the pill pixel-offset below would
    // otherwise push a zero-height bar down over the month labels.
    if (value === undefined || value <= 0) return;
    const heightPercent = (value / maxValue) * 100 * (animProgress.value / 100);
    const currentBottom = cumulativePercent;
    const isFirst = segments.length === 0;
    const offset = isFirst ? 0 : (isMobile.value ? 13 : 20);
    segments.push({
      height: isFirst ? `${heightPercent}%` : `calc(${heightPercent}% + ${offset}px)`,
      bottom: isFirst ? `${currentBottom}%` : `calc(${currentBottom}% - ${offset}px)`,
      index: seriesIndex,
      zIndex: zIndexes[seriesIndex] ?? 10
    });
    cumulativePercent += heightPercent;
  });
  // Months with no value at all get a tiny base stub so the chart doesn't
  // look empty — visual placeholder only, not data.
  if (segments.length === 0) {
    segments.push({ height: '4%', bottom: '0%', index: 0, zIndex: 10 });
  }
  return segments;
};

const getRoundedCorners = (segmentIndex: number, totalSegments: number) => {
  // Return all around rounding for the "pill" effect
  return '24px';
};
</script>

<style scoped>
/* Ensure smooth transitions */
div[class*="absolute bottom-0"] {
  transition: all 0.3s ease;
}
</style>