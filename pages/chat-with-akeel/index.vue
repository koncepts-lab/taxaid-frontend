<template>
    <NuxtLayout name="dashboard">
        <div class="w-full flex overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
                <TaxQueriesLeftSideBar @close="isFullScreenChat = true" />
            </aside>
            <main class="flex-1">
                <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
            </main>
        </div>
    </NuxtLayout>
</template>
<script setup>
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
</script>