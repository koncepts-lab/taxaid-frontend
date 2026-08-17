<template>
  <div v-if="message" class="flex items-start gap-2 rounded-lg border px-3 py-2 mb-2 text-xs"
    :class="variant === 'restricted'
      ? (isDark ? 'bg-[#3a2a00]/40 border-[#FDBA74]/40 text-[#FDBA74]' : 'bg-[#FEFCE8] border-[#FDBA74] text-[#854D0E]')
      : (isDark ? 'bg-[#3a0000]/40 border-[#FCA5A5]/40 text-[#FCA5A5]' : 'bg-[#FEF2F2] border-[#FFC9C9] text-[#DC2626]')">
    <svg v-if="variant === 'restricted'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 shrink-0 mt-0.5">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" stroke-linecap="round" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
    </svg>
    <span class="font-medium">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  variant: { type: String, default: 'error' }, // 'error' | 'restricted'
  isDark: { type: Boolean, default: false },
})
</script>
