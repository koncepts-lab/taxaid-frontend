<template>
  <div class="bg-white p-6 rounded-2xl border border-[#A5E5D9] shadow-sm relative flex flex-col justify-between min-h-[140px]">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-gray-500 text-sm font-medium">{{ title }}</h3>
      <div class="text-gray-500">
        <slot name="icon"></slot>
      </div>
    </div>
    <div class="text-[32px] text-gray-900 font-normal mt-2">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
}>()
</script>
