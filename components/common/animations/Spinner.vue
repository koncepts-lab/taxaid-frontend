<template>
  <svg class="animate-spin" :class="sizeClass" viewBox="0 0 24 24" fill="none">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
</template>

<script setup>
const props = defineProps({ size: { type: String, default: 'w-3.5 h-3.5' } })
const sizeClass = props.size
</script>
