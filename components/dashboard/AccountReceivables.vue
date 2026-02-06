<template>
  <div class="col-span-12 lg:col-span-7 bg-white rounded-[20px] p-5 shadow-sm h-[305px]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
      <div class="flex items-center gap-3">
        <div 
          class="w-12 h-12 rounded-full grid place-items-center"
          style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)"
        >
          <img src="/images/icons/Account-Receivables.svg" alt="Receivables" class="w-6 h-6 object-contain" />
        </div>
        <div class="text-[20px] font-bold text-[#000]">Account Receivables</div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
        <div v-for="(item, index) in legendItems" :key="index" class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors[index] }"></span>
          <span class="text-[13px] text-gray-500 font-medium">{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="h-[180px] w-full mt-4">
      <div class="h-full relative pl-12 pr-4">
        <!-- Y-Axis Labels -->
        <div class="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[13px] text-gray-400 font-medium">
          <span class="h-0 flex items-center">60M</span>
          <span class="h-0 flex items-center">40M</span>
          <span class="h-0 flex items-center">20M</span>
          <span class="h-0 flex items-center">0M</span>
        </div>

        <!-- Grid Lines -->
        <div class="absolute left-12 right-4 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          <div class="border-t border-gray-100"></div>
          <div class="border-t border-gray-100"></div>
          <div class="border-t border-gray-100"></div>
          <div class="border-t border-gray-100"></div>
        </div>

        <!-- Bars Container -->
        <div class="h-full pb-8 flex items-end justify-around gap-2">
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
        <div class="absolute left-12 right-4 bottom-0 h-8 flex items-center justify-around text-[13px] text-gray-400 font-medium">
          <span v-for="month in months" :key="month" class="flex-1 text-center">{{ month }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const legendItems = ['< 30 Days', '31-60 Days', '61-90 Days', '> 90 Days'];
const colors = ['#003328', '#00966C', '#B2EDE3', '#E6EBEB'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

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
    const heightPercent = (value / maxValue) * 100;
    const currentBottom = cumulativePercent;
    
    // Applying offsets: 1st: none, others: 20px
    const offset = seriesIndex === 0 ? 0 : 20; 
    
    segments.push({
      height: seriesIndex === 0 ? `${heightPercent}%` : `calc(${heightPercent}% + ${offset}px)`,
      bottom: seriesIndex === 0 ? `${currentBottom}%` : `calc(${currentBottom}% - ${offset}px)`,
      index: seriesIndex,
      zIndex: zIndexes[seriesIndex]
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