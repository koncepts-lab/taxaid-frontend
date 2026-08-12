<template>
    <!-- <div
        class="relative w-full float-left mt-[30px] z-50 h-fit max-w-full mx-auto flex flex-col items-center justify-end min-h-[400px] font-sans">
        ... (graphical wheel commented out) ...
    </div> -->

    <div class="relative w-full flex flex-wrap justify-center gap-3 mt-4 mb-6 z-30 pb-4">
        <!-- Updated @click to use setCategory for v-model sync -->
        <button v-for="(cat, index) in categoriesWithIcons" :key="cat.id" @click="setCategory(index)"
            class="flex items-center gap-1 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium border "
            :class="activeIndex === index
                ? ' text-white border-white border-[#008472] shadow-lg scale-105'
                : 'bg-[#F1F3F4] text-black/70 border-transparent hover:bg-gray-200'"
            :style="activeIndex === index ? { backgroundColor: cat.color } : {}">
            <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" v-html="cat.icon.template"></div>
            {{ currentLang === 'ar' ? cat.labelAr : cat.label }}
            <span class="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                {{ cat.count }}
            </span>
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const currentLang = useState('currentLang', () => 'en')

const props = defineProps({
    activeIndex: { type: Number, default: 0 },
    categories: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:activeIndex'])

const direction = ref('next');

// Icons
const IconAlert = { template: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.935 13.1996L10.0683 2.93298C9.9404 2.70726 9.7549 2.51951 9.53073 2.38889C9.30657 2.25827 9.05177 2.18945 8.79232 2.18945C8.53288 2.18945 8.27808 2.25827 8.05391 2.38889C7.82975 2.51951 7.64424 2.70726 7.51632 2.93298L1.64966 13.1996C1.52036 13.4236 1.45256 13.6777 1.45313 13.9363C1.4537 14.1949 1.52263 14.4487 1.65292 14.672C1.78321 14.8954 1.97023 15.0803 2.19503 15.2081C2.41983 15.3359 2.67442 15.402 2.93299 15.3996H14.6663C14.9236 15.3994 15.1764 15.3314 15.3991 15.2026C15.6219 15.0738 15.8068 14.8886 15.9354 14.6657C16.0639 14.4427 16.1316 14.1899 16.1315 13.9326C16.1314 13.6753 16.0637 13.4225 15.935 13.1996Z" stroke="currentColor" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.79688 6.59961V9.53294" stroke="currentColor" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.79688 12.4668H8.80421" stroke="currentColor" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/></svg>` };
const IconCheck = { template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.535 6.66764C14.8395 8.16183 14.6225 9.71525 13.9203 11.0688C13.218 12.4224 12.073 13.4943 10.6761 14.1058C9.27913 14.7174 7.71479 14.8315 6.24391 14.4292C4.77302 14.0269 3.4845 13.1326 2.59323 11.8952C1.70195 10.6579 1.26179 9.15246 1.34615 7.62989C1.43051 6.10733 2.0343 4.6597 3.05681 3.52842C4.07932 2.39714 5.45876 1.65059 6.96509 1.41327C8.47141 1.17595 10.0136 1.46221 11.3344 2.2243" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 7.33268L8 9.33268L14.6667 2.66602" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>` };
const IconClock = { template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4V8L10.6667 9.33333" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0026 14.6673C11.6845 14.6673 14.6693 11.6825 14.6693 8.00065C14.6693 4.31875 11.6845 1.33398 8.0026 1.33398C4.32071 1.33398 1.33594 4.31875 1.33594 8.00065C1.33594 11.6825 4.32071 14.6673 8.0026 14.6673Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>` };
const IconX = { template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.0026 14.6673C11.6845 14.6673 14.6693 11.6825 14.6693 8.00065C14.6693 4.31875 11.6845 1.33398 8.0026 1.33398C4.32071 1.33398 1.33594 4.31875 1.33594 8.00065C1.33594 11.6825 4.32071 14.6673 8.0026 14.6673Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 6L6 10" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L10 10" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>` };

const categoriesWithIcons = computed(() => {
    const iconMap = {
        all: IconAlert,
        pending: IconClock,
        resolved: IconCheck,
        ignored: IconX
    }

    return props.categories.map(cat => ({
        ...cat,
        icon: iconMap[cat.id] || IconAlert
    }))
})

// Navigation Logic updating the Prop
const setCategory = (index) => {
    direction.value = index > props.activeIndex ? 'next' : 'prev';
    emit('update:activeIndex', index);
};

const nextCategory = () => {
    direction.value = 'next';
    const nextIdx = (props.activeIndex + 1) % categoriesWithIcons.value.length;
    emit('update:activeIndex', nextIdx);
};

const prevCategory = () => {
    direction.value = 'prev';
    const prevIdx = (props.activeIndex - 1 + categoriesWithIcons.value.length) % categoriesWithIcons.value.length;
    emit('update:activeIndex', prevIdx);
};

const transitionName = computed(() => `wheel-${direction.value}`);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* FIXED CSS: Moved out of scrollbar block */
.wheel-next-enter-active,
.wheel-next-leave-active,
.wheel-prev-enter-active,
.wheel-prev-leave-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: absolute;
    width: 100%;
}

.wheel-next-enter-from {
    transform: rotate(45deg) scale(0.9);
    opacity: 0;
}

.wheel-next-leave-to {
    transform: rotate(-45deg) scale(0.9);
    opacity: 0;
}

.wheel-prev-enter-from {
    transform: rotate(-45deg) scale(0.9);
    opacity: 0;
}

.wheel-prev-leave-to {
    transform: rotate(45deg) scale(0.9);
    opacity: 0;
}

img,
.absolute.inset-0 {
    transform-origin: center 80%;
}
</style>