<template>
  <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
    <div class="flex justify-between items-center mb-8">
      <div class="flex flex-col">
        <span class="text-base font-medium text-primary-450">Revenue by category</span>
        <span class="text-xs text-black/40">Values in AED Million</span>
      </div>
      <img src="/images/icons/expand-dark.svg" alt="Expand" class="w-5 h-5 cursor-pointer" />
    </div>

    <div class="flex-1 flex flex-col justify-end">
      <!-- Y-Axis Labels -->
      <div class="relative flex-1 w-full pt-4">
        <div v-for="label in ['5M', '4M', '3M', '2M', '1M', '0']" :key="label" 
             class="h-1/5 border-b border-gray-50 flex items-start text-[10px] text-gray-400">
          <span class="w-8 -mt-2">{{ label }}</span>
        </div>

        <!-- Bars Container -->
        <div class="absolute inset-0 left-8 right-0 flex justify-around items-end pb-0">
          <div v-for="(category, index) in categories" :key="index" class="flex flex-col items-center group">
            <div class="flex gap-1 items-end">
              <!-- Previous Year Bar -->
              <div class="w-2.5 bg-[#FF8A65] rounded-t-full transition-all duration-1000"
                   :style="{ height: (category.previous / 5) * 100 + '%' }">
                <div class="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                  Prev: {{ category.previous }}M
                </div>
              </div>
              <!-- Current Year Bar -->
              <div class="w-2.5 bg-[#03D9B0] rounded-t-full transition-all duration-1000"
                   :style="{ height: (category.current / 5) * 100 + '%' }">
                <div class="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                  Curr: {{ category.current }}M
                </div>
              </div>
            </div>
            <span class="mt-4 text-[10px] text-gray-500">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex gap-4 mt-8 pt-4 border-t border-gray-50">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-[#FF8A65]"></div>
        <span class="text-[10px] text-gray-500">Previous Year</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-[#03D9B0]"></div>
        <span class="text-[10px] text-gray-500">Current Year</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { name: 'Consulting', previous: 2.8, current: 4.2 },
  { name: 'SaaS', previous: 3.1, current: 3.5 },
  { name: 'Training', previous: 2.8, current: 3.4 },
  { name: 'Support', previous: 1.5, current: 2.0 },
  { name: 'Other', previous: 2.5, current: 1.7 }
]
</script>

<style scoped>
.rounded-t-full {
  border-top-left-radius: 9999px;
  border-top-right-radius: 9999px;
}
</style>
