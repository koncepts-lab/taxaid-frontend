<template>
    <div class="flex justify-between items-center" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div>
            <h1 class="text-2xl font-medium" :class="isDark ? 'text-white' : 'text-primary-450'">
                {{ currentLang === 'ar' ? 'لوحة التنبيهات' : 'Alert Dashboard' }}
            </h1>
            <p class="text-sm" :class="isDark ? 'text-white/60' : 'text-black/80'">
                {{ currentLang === 'ar' ? 'رؤى عامة بناءً على الإطار الزمني الذي اخترته.' :
                    'General insights based on the timeframe you selected.' }}
            </p>
        </div>

        <div class="relative" ref="dropdownRef">
            <button @click="isOpen = !isOpen"
                class="flex items-center justify-between px-4 py-2 border rounded-xl transition-all min-w-[280px] group"
                :class="[
                    isDark
                        ? 'bg-[#1A1A1A] border-[#00B794] text-white'
                        : 'bg-white/50 border-[#00B794] text-black'
                ]">
                <span class="text-sm font-medium">{{ selectedLabel }}</span>
                <svg class="w-4 h-4 transition-transform duration-300 opacity-60"
                    :class="[isOpen ? 'rotate-180' : '', currentLang === 'ar' ? 'mr-2' : 'ml-2']" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <Transition name="dropdown">
                <div v-if="isOpen"
                    class="absolute mt-2 w-full min-w-[220px] rounded-2xl shadow-xl z-50 py-2 px-2 border" :class="[
                        isDark ? 'bg-[#1A1A1A] border-white/10 shadow-black/50' : 'bg-white border-gray-100',
                        currentLang === 'ar' ? 'right-0' : 'left-0'
                    ]">
                    <div v-for="option in periodOptions" :key="option.id" class="relative">
                        <button @click="handleSelect(option)"
                            class="w-full px-4 py-3 font-normal text-sm rounded-xl flex items-center transition-colors mb-1 last:mb-0"
                            :class="[
                                currentLang === 'ar' ? 'text-right' : 'text-left',
                                selected === option.id
                                    ? (isDark ? 'bg-[#00B794]/20 text-[#00FFBC]' : 'bg-[#D9FBF2] text-[#013E32] font-semibold')
                                    : (isDark ? 'text-white/80 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50')
                            ]">
                            {{ currentLang === 'ar' ? option.labelAr : option.label }}
                        </button>

                        <div v-if="option.id === 'custom' && selected === 'custom' && showPicker"
                            class="absolute top-0 z-[70] shadow-2xl rounded-xl border p-2" :class="[
                                isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200',
                                currentLang === 'ar'
                                    ? 'lg:left-full lg:mr-2 right-0'
                                    : 'lg:right-full lg:ml-2 right-0',
                                'mt-12 lg:mt-0'
                            ]">

                            <ClientOnly>
                                <VDatePicker v-model="selectedDate" :is-dark="isDark"
                                    :locale="currentLang === 'ar' ? 'ar' : 'en'" color="teal"
                                    @update:model-value="onDateChange" />

                                <template #fallback>
                                    <div class="p-4 text-center text-xs text-gray-400">Loading...</div>
                                </template>
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { DatePicker as VDatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

const currentLang = useState('currentLang', () => 'en')
const isDark = useTheme().isDark

const isOpen = ref(false);
const showPicker = ref(false);
const dropdownRef = ref(null);
const selected = ref('daily');

const selectedDate = ref(new Date());

const periodOptions = [
    { id: 'daily', label: 'Daily', labelAr: 'يومي' },
    { id: 'month', label: 'Last Month', labelAr: 'الشهر الماضي' },
    { id: 'custom', label: 'Custom Date', labelAr: 'تاريخ مخصص' }
];
const selectedLabel = computed(() => {
    if (selected.value === 'custom' && selectedDate.value) {
        return format(selectedDate.value, 'dd MMMM, yyyy');
    }
    const active = periodOptions.find(o => o.id === selected.value);
    return currentLang === 'ar' ? active?.labelAr : active?.label;
});

const handleSelect = (option) => {
    selected.value = option.id;
    if (option.id === 'custom') {
        showPicker.value = !showPicker.value;
    } else {
        showPicker.value = false;
        isOpen.value = false;
        emitChange(option.id);
    }
};

const onDateChange = (val) => {
    if (val) {
        emitChange('custom', val);
        showPicker.value = false;
        isOpen.value = false;
    }
};

const emitChange = (type, date) => {
    console.log('Selection Changed:', type, format(date, 'yyyy-MM-dd'));
};


const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
        showPicker.value = false;
    }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

:deep(.vc-container.vc-is-dark) {
    --vc-bg: #1A1A1A;
    --vc-border: rgba(255, 255, 255, 0.1);
}
</style>