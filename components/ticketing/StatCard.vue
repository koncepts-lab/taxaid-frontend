<template>
    <!-- Background and Border from Props -->
    <div class="p-4 rounded-2xl border flex flex-col justify-between h-28 transition-all"
        :style="{ backgroundColor: bgColor, borderColor: borderColor }">

        <div class="flex justify-between items-start">
            <span class="text-sm text-black/50 tracking-wider">
                {{ title }}
            </span>

            <!-- Icon color applied via style -->
            <div :style="{ color: textColor }">
                <slot name="icon"></slot>
            </div>
        </div>

        <!-- Big Number color applied via style -->
        <span class="text-3xl" :style="{ color: textColor }">
            {{ count }}
        </span>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    count: [String, Number],
    bgColor: String,      // Expects: '#FFF9F2'
    borderColor: String,  // Expects: '#FFDAB0'
    textColor: String     // Expects: '#C05600'
})
</script>