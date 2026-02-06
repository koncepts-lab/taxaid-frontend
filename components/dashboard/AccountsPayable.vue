<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[20px] p-4 shadow-sm flex flex-col h-[260px] relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <div 
        class="w-10 h-10 rounded-full grid place-items-center"
        style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)"
      >
        <img src="/images/icons/Accounts-Payable.svg" alt="Payable" class="w-5 h-5 object-contain" />
      </div>
      <div class="text-[18px] font-bold text-[#000]">Accounts Payable</div>
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-end mb-6">
      <div class="flex flex-col">
        <div class="text-[12px] text-gray-400 font-medium">Total Outstanding Payables</div>
        <div class="text-[28px] font-bold text-[#000] mt-1">
          <span class="text-xl font-medium mr-1 opacity-60">د.إ</span>140,175
        </div>
        <div class="flex items-center gap-1 text-[#ff4b4b] font-bold text-[12px] mt-2">
           <span><img src="/images/icons/down.svg" alt="Down" class="w-4 h-4" /></span>
           <span>8% vs last month</span>
        </div>
      </div>

      <!-- Small Bar Chart -->
      <div class="flex items-end gap-1.5 h-16 mb-1">
        <div class="w-2.5 h-[60%] bg-[#00B794] rounded-t-full"></div>
        <div class="w-2.5 h-[90%] bg-[#007A6A] rounded-t-full"></div>
        <div class="w-2.5 h-[40%] bg-[#004D4E] rounded-t-full"></div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="pt-4 border-t border-gray-100 flex flex-col gap-1">
      <div class="text-[12px]">
        <span class="text-gray-400">Overdue: </span>
        <span class="font-bold text-[#000]">د.إ 35 L</span>
      </div>
      <div class="text-[12px]">
        <span class="text-gray-400">Due in next 30 days: </span>
        <span class="font-bold text-[#000]">د.إ 90 L</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed
</script>
