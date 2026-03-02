<template>
  <div class="rounded-[20px] p-5 shadow-sm h-[280px] group cursor-pointer hover:shadow-[0_0_10px_#00B794] transition-all duration-300 flex flex-col justify-between"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
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
          class="w-[35px] h-[35px] opacity-0 group-hover:opacity-100 transition-all duration-300"
        />
      </div>
    </div>

    <!-- Chart Container -->
    <div class="h-[180px] w-full mt-4">
      <div class="h-full relative pl-12 pr-4">
        <!-- Y-Axis Labels -->
        <div class="absolute flex flex-col justify-between text-[12px] font-Regular top-0 bottom-8 transition-colors duration-300" 
          :class="[currentLang === 'ar' ? 'right-0 items-end' : 'left-0 items-start', isDark ? 'text-white/60' : 'text-[#00000080]']">
          <span class="h-0 flex items-center">60M</span>
          <span class="h-0 flex items-center">40M</span>
          <span class="h-0 flex items-center">20M</span>
          <span class="h-0 flex items-center">0M</span>
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
            <div class="relative h-full flex items-end" style="width: 26px; max-width: 26px;">
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
import { ref, onMounted } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()

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
const legendItems = ['< 30 Days', '31-60 Days', '61-90 Days', '> 90 Days'];
const legendItemsAr = ['أقل من 30 يوماً', '31-60 يوماً', '61-90 يوماً', 'أكثر من 90 يوماً'];
const colors = ['#003328', '#00966C', '#B2EDE3', '#E6EBEB'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];

// Data for each aging bucket (in millions)
const series = [
  [12, 26, 13, 18, 15, 25], // < 30 Days (bottom, darkest)
  [20, 16, 10, 16, 10, 12], // 31-60 Days
  [12, 10, 15, 12, 18, 15], // 61-90 Days
  [18, 10, 12, 11, 8, 10]   // > 90 Days (top, lightest)
];

const getStackedSegments = (monthIndex: number) => {
  const maxValue = 60; // 60M max on y-axis
  const segments: Array<{ height: string; bottom: string; index: number; zIndex: number }> = [];
  const zIndexes = [10000, 1000, 100, 10];
  
  let cumulativePercent = 0;
  
  // Build from bottom to top
  series.forEach((seriesData, seriesIndex) => {
    const value = seriesData[monthIndex];
    if (value === undefined) return;
    
    const heightPercent = (value / maxValue) * 100 * (animProgress.value / 100);
    const currentBottom = cumulativePercent;
    
    // Applying offsets: 1st: none, others: 20px
    const offset = seriesIndex === 0 ? 0 : 20; 
    
    segments.push({
      height: seriesIndex === 0 ? `${heightPercent}%` : `calc(${heightPercent}% + ${offset}px)`,
      bottom: seriesIndex === 0 ? `${currentBottom}%` : `calc(${currentBottom}% - ${offset}px)`,
      index: seriesIndex,
      zIndex: zIndexes[seriesIndex] ?? 10
    });
    
    cumulativePercent += heightPercent;
  });
  
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