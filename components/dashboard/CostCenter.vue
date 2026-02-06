<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[20px] p-4 shadow-sm flex flex-col h-[260px] relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <div 
        class="w-10 h-10 rounded-full grid place-items-center"
        style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)"
      >
        <img src="/images/icons/Cost-Center-Project-black.svg" alt="Cost Center" class="w-5 h-5 object-contain" />
      </div>
      <div class="text-[18px] font-bold text-[#000]">Cost Center / Project</div>
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-end mb-6">
      <div class="flex flex-col">
        <div class="text-[12px] text-gray-400 font-medium">Active Projects</div>
        <div class="text-[42px] font-bold text-[#000] leading-none mt-2">12</div>
        <div class="flex items-center gap-1 text-[#00B794] font-bold text-[12px] mt-2">
           <span><img src="/images/icons/up.svg" alt="Up" class="w-4 h-4" /></span>
           <span>2% vs last month</span>
        </div>
      </div>

      <!-- Mini Wave Chart -->
      <div class="w-24 h-12 mb-2">
        <svg viewBox="0 0 100 40" class="w-full h-full">
          <path d="M0 30 Q 20 10 40 25 T 80 15 T 100 20" fill="none" stroke="#00B794" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0 30 Q 20 10 40 25 T 80 15 T 100 20 V 40 H 0 Z" fill="#00B794" opacity="0.1" />
        </svg>
      </div>
    </div>

    <!-- Footer Text -->
    <div class="pt-4 border-t border-gray-100 mt-auto">
      <p class="text-[11px] text-gray-400 leading-relaxed">
        <span class="font-bold text-gray-500">Atria.co</span> recently added 2 new projects. Strengthening operational activity.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed
</script>
