<template>
    <!-- 1. Wrap the entire template in a Transition -->
    <Transition name="fade-out">
        <div v-if="isVisible" class="flex items-center justify-between p-4 rounded-lg border mb-3 transition-all"
            :style="{ backgroundColor: theme.bg, borderColor: theme.border }">

            <div class="flex items-start gap-4">
                <div class="p-2 rounded-full bg-white/40 flex items-center justify-center">
                    <img :src="icon" alt="Alert Icon" class="w-5 h-5" />
                </div>

                <div>
                    <p class="text-base leading-tight" :style="{ color: theme.titleColor }">
                        {{ message }}
                    </p>
                    <p class="text-sm mt-0.5" :style="{ color: theme.subtextColor }">
                        {{ subtext }}
                    </p>
                </div>
            </div>

            <!-- Close Button triggers local hide -->
            <button @click="handleClose" class="opacity-40 hover:opacity-100 transition-opacity"
                :style="{ color: theme.titleColor }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['message', 'subtext', 'type', 'icon'])
const emit = defineEmits(['close'])

// 2. Local state to control visibility
const isVisible = ref(true)

const handleClose = () => {
    isVisible.value = false
    // Still emit so the parent knows, but the component handles the animation
    emit('close')
}

const theme = computed(() => {
    const configurations = {
        info: { bg: '#EFF6FF', border: '#81B8FF', titleColor: '#004254', subtextColor: '#007595' },
        success: { bg: '#F0FDF4', border: '#04C18F80', titleColor: '#00441C', subtextColor: '#008235' },
        warning: { bg: '#FFFBEB', border: '#FFF085', titleColor: '#92400E', subtextColor: '#B45309' },
        danger: { bg: '#FEF2F2', border: '#FECACA', titleColor: '#991B1B', subtextColor: '#B91C1C' }
    }
    return configurations[props.type] || configurations.info
})
</script>

<style scoped>
/* 3. Transition Styles */
.fade-out-leave-active {
    transition: all 0.5s ease;
}

.fade-out-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}
</style>