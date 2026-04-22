<template>
    <div v-if="tabs.length > 0"
        class="w-full bg-white border border-gray-200 rounded-full p-1.5 flex gap-1 shadow-sm overflow-x-auto no-scrollbar">
        <button v-for="tab in tabs" :key="tab.name" @click="$emit('update:modelValue', tab.name)"
            class="flex-1 whitespace-nowrap px-6 py-1 rounded-full text-base font-normal transition-all"
            :class="modelValue === tab.name ? 'bg-[#68FFD6] text-black' : 'text-black hover:text-black'">
            {{ tab.label }} ({{ tab.count }})
        </button>
    </div>
</template>

<script setup>
defineProps(['tabs', 'modelValue'])
defineEmits(['update:modelValue'])
</script>