<template>
  <div v-if="total > 0" class="flex items-center justify-between mt-4 px-1">
    <p class="text-[13px] text-gray-500">
      Showing {{ from }}–{{ to }} of {{ total }} rows
    </p>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('prev')"
        :disabled="page <= 1"
        class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      <span class="text-[13px] text-gray-500 px-1">{{ page }} / {{ totalPages }}</span>
      <button
        @click="$emit('next')"
        :disabled="page >= totalPages"
        class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
  from: number
  to: number
  total: number
}>()
defineEmits<{ prev: []; next: [] }>()
</script>
