<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[20px] p-4 shadow-sm flex flex-col h-[260px] relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <div 
        class="w-10 h-10 rounded-full grid place-items-center"
        style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)"
      >
        <img src="/images/icons/Tax-Queries-black.svg" alt="Tax Queries" class="w-5 h-5 object-contain" />
      </div>
      <div class="text-[18px] font-bold text-[#000]">Tax Queries</div>
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col">
        <div class="text-[12px] text-gray-400 font-medium">Token Usage</div>
        <div class="text-[22px] font-bold text-[#000] mt-1">8,001 / 10,485</div>
        <div class="flex items-center gap-1 text-[#00B794] font-bold text-[12px] mt-2">
           <span><img src="/images/icons/up.svg" alt="Up" class="w-4 h-4" /></span>
           <span>+8.4% vs last month</span>
        </div>
      </div>

      <!-- Donut Chart -->
      <div class="relative w-24 h-24">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" stroke-width="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#F1B208" stroke-width="8" stroke-dasharray="251.2" :stroke-dashoffset="251.2 * 0.2" stroke-linecap="round" />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
           
            <div class="flex items-center gap-1 text-[#00B794] font-bold text-[12px] mt-2">
           <span><img src="/images/icons/up.svg" alt="Up" class="w-4 h-4" /></span>
           <span>+8.4%</span>
        </div>
        </div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="pt-4 border-t border-gray-100 flex flex-col gap-1 mt-auto">
      <div class="text-[11px] flex justify-between">
        <span class="text-gray-400">VAT Return Due:</span>
        <span class="font-bold text-[#000]">28 Jan 2026</span>
      </div>
      <div class="text-[11px] flex justify-between">
        <span class="text-gray-400">CT Return Due:</span>
        <span class="font-bold text-[#000]">30 Jun 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed
</script>
