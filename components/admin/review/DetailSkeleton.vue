<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="n in 4" :key="n" class="rounded-xl p-6 shadow-sm border"
           :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'">
        <div class="h-3 w-20 rounded animate-pulse mb-3" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-5 w-32 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
      </div>
    </div>

    <div class="rounded-xl shadow-sm border overflow-hidden mb-8"
         :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'">
      <div class="p-8 pb-6 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <div class="h-5 w-40 rounded animate-pulse mb-2" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-3 w-52 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
      </div>
      <div v-for="n in 8" :key="n" class="flex items-center gap-6 px-8 py-4 border-b last:border-0"
           :class="isDark ? 'border-white/5' : 'border-gray-50'">
        <div class="h-4 w-6 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-4 flex-1 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-5 w-5 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-5 w-5 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-4 w-28 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
        <div class="h-9 w-48 rounded-md animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isDark } = useTheme()
</script>
