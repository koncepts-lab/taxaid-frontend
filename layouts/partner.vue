<template>
  <div :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'" class="min-h-screen w-full flex flex-col transition-colors duration-300">
    <PartnerHeader />
    <slot />
    <DashboardFooter />
  </div>
</template>

<script setup>
const { isDark } = useTheme()
</script>
