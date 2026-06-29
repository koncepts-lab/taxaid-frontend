<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminHeader role="manager" />
            <AdminManagerDashboard :isDark="isDark" :currentLang="currentLang" />

            <template #fallback>
                <div class="p-20 text-center">Loading Manager Dashboard...</div>
            </template>
        </ClientOnly>
    </NuxtLayout>
</template>
<script setup>
import { ref } from 'vue'

// You might need to import or provide isDark and currentLang
const isDark = ref(false)
const currentLang = ref('en')
</script>
