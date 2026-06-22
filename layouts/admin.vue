<template>
    <div :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#F0F0F0] text-[#1a1a1a]'" class="min-h-screen transition-colors duration-300">
        <DashboardHeader name="Welcome, Akhil" role="Implementation Team Member" :adminLogout="true" logoutTo="/admin/login" />
        <slot />
        <CommonFooter />
    </div>
</template>

<script setup>
const { isDark } = useTheme()
</script>