<template>
    <NuxtLayout name="admin">
        <AdminSelectDashboard :isDark="isDark" :currentLang="currentLang" />
    </NuxtLayout>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>
