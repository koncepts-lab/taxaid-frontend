<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminHeader role="manager" />
            <AdminManagerDashboard :isDark="isDark" :currentLang="currentLang" />

            <template #fallback>
                <div class="p-8 space-y-6">
                    <div class="flex bg-white p-1.5 rounded-full shadow-sm w-fit border border-gray-100">
                        <div v-for="n in 4" :key="n" class="px-12 py-1.5 rounded-full">
                            <div class="h-4 w-20 rounded bg-gray-100 animate-pulse"></div>
                        </div>
                    </div>

                    <div class="mt-8 space-y-8">
                        <div class="space-y-2">
                            <div class="h-6 w-56 rounded bg-gray-100 animate-pulse"></div>
                            <div class="h-3.5 w-80 rounded bg-gray-100 animate-pulse"></div>
                        </div>

                        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div class="h-[46px] rounded-xl bg-gray-100 animate-pulse"></div>
                            <div class="rounded-xl border border-gray-100 overflow-hidden">
                                <div class="h-12 bg-gray-100 animate-pulse"></div>
                                <div v-for="n in 6" :key="n" class="h-16 border-t border-gray-50 flex items-center px-4 gap-6">
                                    <div class="h-4 w-24 rounded bg-gray-50 animate-pulse"></div>
                                    <div class="h-4 w-32 rounded bg-gray-50 animate-pulse"></div>
                                    <div class="h-4 w-20 rounded bg-gray-50 animate-pulse"></div>
                                    <div class="h-4 w-28 rounded bg-gray-50 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
