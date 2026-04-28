<template>
    <div class="bg-white rounded-[20px] p-8 border border-black/10 flex-1">
        <div class="flex items-center gap-3 mb-2" :style="{ color: iconColor }">
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.123 6.61621H20.7941V12.2873" stroke="currentColor" stroke-width="1.89036"
                    stroke-linecap="round" stroke-linejoin="round" />
                <path d="M20.7932 6.61621L12.7592 14.6502L8.03332 9.92434L1.88965 16.068" stroke="currentColor"
                    stroke-width="1.89036" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <h3 class="text-lg text-black">{{ name }}</h3>
        </div>
        <p class="text-lg text-black/50 mb-6">{{ departments }}</p>

        <div class="space-y-3">
            <div v-for="stat in stats" :key="stat.label" class="flex justify-between items-center py-1">
                <span class="text-lg text-black/50">{{ stat.label }}</span>
                <span class="text-lg" :style="{ color: stat.color }">{{ stat.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['name', 'departments', 'stats', 'iconColor'])
</script>