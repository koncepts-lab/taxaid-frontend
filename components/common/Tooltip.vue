<template>
    <!-- 1. The Trigger: Stays in the layout -->
    <div ref="trigger" class="relative inline-block" @mouseenter="updatePosition" @mouseleave="isVisible = false">
        <slot />

        <!-- 2. The Tooltip: Teleported to the end of <body> to prevent clipping -->
        <Teleport to="body">
            <div v-if="isVisible" :style="coords"
                class="fixed z-99999 px-4 py-2.5 text-[12px] font-medium rounded-2xl whitespace-nowrap shadow-xl pointer-events-none transition-opacity duration-300"
                :class="isDark ? 'bg-[#fff] text-[#000]' : 'bg-[#003d35] text-white'">
                {{ text }}

                <!-- Arrow -->
                <div :class="[
                    'absolute left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent',
                    position === 'top'
                        ? ('-bottom-1.5 border-t-[6px] ' + (isDark ? 'border-t-[#fff]' : 'border-t-[#003d35]'))
                        : ('-top-1.5 border-b-[6px] ' + (isDark ? 'border-b-[#fff]' : 'border-b-[#003d35]'))
                ]"></div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const { isDark } = useTheme()

const props = defineProps({
    text: { type: String, required: true },
    position: {
        type: String,
        default: 'bottom',
        validator: (v) => ['top', 'bottom'].includes(v)
    }
})

const trigger = ref(null)
const isVisible = ref(false)
const coords = reactive({ top: '0px', left: '0px' })

const updatePosition = () => {
    if (window.innerWidth < 768) return

    if (!window.matchMedia('(hover: hover)').matches) return
    if (!trigger.value) return

    const rect = trigger.value.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    const centerX = rect.left + scrollX + rect.width / 2

    if (props.position === 'top') {
        coords.top = `${rect.top + scrollY - 12}px` // 12px offset
        coords.left = `${centerX}px`
        coords.transform = 'translate(-50%, -100%)'
    } else {
        coords.top = `${rect.bottom + scrollY + 12}px` // 12px offset
        coords.left = `${centerX}px`
        coords.transform = 'translate(-50%, 0%)'
    }

    isVisible.value = true
}
</script>