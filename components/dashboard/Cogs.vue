<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[20px] p-4 shadow-sm flex flex-col justify-between h-[260px] relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div 
        class="w-12 h-12 rounded-full grid place-items-center"
        style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)"
      >
        <img src="/images/icons/C.O.G.S-black.svg" alt="C.O.G.S" class="w-4 h-4 object-contain" />
      </div>
      <div class="text-[20px] font-medium text-[#000]">C.O.G.S</div>
    </div>

    <div class="flex justify-between items-start mt-0 z-10">
      <!-- Left Content -->
      <div class="flex flex-col">
        <div class="text-[12px] text-[#00000080] font-medium">COGS to Revenue Ratio</div>
        <div class="text-[40px] font-semibold text-[#000] leading-tight mt-1">65%</div>
        <div class="flex items-center gap-1 text-[#05B743] font-medium text-[13px] mt-2">
          <span><img src="/images/icons/up.svg" alt="C.O.G.S" class="w-6 h-6 object-contain" /></span>
          <span text-[#05B743]>2% vs last month</span>
        </div>
      </div>

      <!-- Right Graph Area -->
      <div class="absolute right-[15px] top-[70px] w-[140px] h-[80px]">
         <svg class="w-full h-full" viewBox="0 0 140 80" fill="none">
             <!-- Wave path fitting the image roughly -->
             <!-- Starting low, curve up, dip, high peak, dip, up end -->
             <defs>
               <linearGradient id="cogsGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="#00B794" stop-opacity="0.2"/>
                 <stop offset="100%" stop-color="#00B794" stop-opacity="0"/>
               </linearGradient>
             </defs>
             <path d="M10 60 Q 30 20 50 40 T 90 20 T 130 40" stroke="#00B794" stroke-width="3" stroke-linecap="round" fill="none" />
             <!-- Fill area -->
             <path d="M10 60 Q 30 20 50 40 T 90 20 T 130 40 V 80 H 10 Z" fill="url(#cogsGradient)" opacity="0.5" />
             <!-- Marker Circle on peak -->
             <circle cx="90" cy="20" r="4" fill="white" stroke="#00B794" stroke-width="2" />
         </svg>
      </div>
    </div>

    <!-- Footer Text -->
    <div class="mt-4 text-[13px] text-gray-400 leading-snug">
      Achieved greater operational efficiency.<br>
      Now unlocking higher profit margins.
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic if needed
</script>
