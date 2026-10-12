<template>
    <div class="animate-pulse">
        <!-- Wheel pills -->
        <div class="relative w-full flex flex-wrap justify-center gap-3 mt-4 mb-6">
            <div v-for="n in 4" :key="n" class="h-10 w-28 rounded-full border" :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/20' : 'bg-gray-200 border-transparent'"></div>
        </div>

        <!-- Table -->
        <div class="relative mt-6 w-full rounded-2xl overflow-hidden border" :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/20' : 'bg-white border-transparent'">
            <div class="flex items-center gap-4 h-14 w-full px-6" :class="headerBg">
                <div class="h-3 w-4 rounded shrink-0 bg-white/30"></div>
                <div class="h-3 w-20 rounded shrink-0 bg-white/30"></div>
                <div class="h-3 flex-1 rounded bg-white/30"></div>
                <div class="h-3 w-20 rounded shrink-0 bg-white/30"></div>
                <div class="h-3 w-24 rounded shrink-0 bg-white/30"></div>
                <div class="h-3 w-32 rounded shrink-0 bg-white/30"></div>
            </div>
            <div v-for="n in 4" :key="n" class="flex items-center gap-4 py-3 px-6 border-b" :class="isDark ? 'border-[#03D8B0]/10' : 'border-gray-100'">
                <div class="h-3 w-4 rounded shrink-0" :class="blockClass"></div>
                <div class="h-3 w-20 rounded shrink-0" :class="blockClass"></div>
                <div class="h-3 flex-1 rounded" :class="blockClass"></div>
                <div class="h-3 w-20 rounded shrink-0" :class="blockClass"></div>
                <div class="h-5 w-24 rounded-full shrink-0" :class="blockClass"></div>
                <div class="h-8 w-20 rounded shrink-0" :class="blockClass"></div>
                <div class="h-8 w-20 rounded shrink-0" :class="blockClass"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    type: { type: String, default: 'all' }
})

const { isDark } = useTheme()
const blockClass = computed(() => isDark.value ? 'bg-white/20' : 'bg-gray-200')

// Matches AlertsSummary's per-category header color exactly.
const headerBg = computed(() => ({
    all: 'bg-[#008864]',
    pending: 'bg-[#A68426]',
    resolved: 'bg-[#0F5225]',
    ignored: 'bg-[#4D4D4D]',
}[props.type] || 'bg-[#008864]'))
</script>
