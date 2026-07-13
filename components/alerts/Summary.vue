<template>
    <!-- Root container with dynamic key for animation and height limits -->
    <div :key="type"
        class="relative z-10 mt-6 w-full overflow-auto rounded-2xl  transition-all duration-500 animate-expand 2xl:max-h-92.5 max-h-62.5"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <table class="w-full text-left rtl:text-right border-collapse min-w-[1000px]">
            <!-- Sticky Header -->
            <thead class="sticky top-0 z-20">
                <tr :class="[config.headerBg, 'text-white transition-colors duration-500']">
                    <th class="py-4 px-6 font-normal text-base w-16"></th>
                    <th class="py-2 px-4 font-normal text-base">{{ t.module }}</th>
                    <th class="py-4 px-4 font-normal text-base">{{ t.title }}</th>
                    <th class="py-4 px-4 font-normal text-base">{{ t.date }}</th>
                    <th class="py-4 px-4 font-normal text-base">{{ t.status }}</th>
                    <th class="py-4 px-4 font-normal text-base">{{ t.actions }}</th>
                </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
                <tr v-for="(row, idx) in data" :key="idx"
                    class="border-b-[0.3px]   !opacity-80 last:border-0 transition-colors duration-300 border-white/60"
                    :class="[config.borderColor, config.tableBg]">

                    <!-- Index -->
                    <td class="py-2 px-6 text-sm" :class="isDark ? 'text-white/80' : 'text-black'">
                        {{ idx + 1 }}
                    </td>

                    <!-- Module -->
                    <td class="py-2 px-4 text-sm font-medium" :class="isDark ? 'text-white/80' : 'text-black'">
                        <!-- Server localizes via ?lang= — row carries one language only -->
                        {{ row.module }}
                    </td>

                    <!-- Alert Title -->
                    <td class="py-2 px-4 text-sm" :class="isDark ? 'text-white/80' : 'text-black'">
                        {{ row.title }}
                    </td>

                    <!-- Date -->
                    <td class="py-2 px-4 text-sm" :class="isDark ? 'text-white/80' : 'text-black'">
                        {{ row.date }}
                    </td>

                    <!-- Status Pill -->
                    <td class="py-2 px-4">
                        <span
                            :class="['px-3 py-0.5 rounded-full text-xs font-normal border transition-all duration-500 inline-block', getStatusStyles(row.status)]">
                            <!-- Translate status text -->
                            {{ translateStatus(row.status) }}
                        </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-2 px-4">
                        <div class="flex items-center justify-start gap-2">
                            <!-- View Button -->
                            <button @click="$emit('view', row)"
                                class="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-black px-4 py-1.5 rounded text-sm transition-all shadow-sm">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span v-if="type !== 'pending'">{{ t.view }}</span>
                            </button>

                            <!-- Chat Button -->
                            <button @click="$emit('chat', row)"
                                class="flex items-center gap-2 bg-[#333333] hover:bg-black text-white px-4 py-1.5 rounded text-sm transition-all shadow-sm">
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333H1.33333C0.979711 13.3333 0.640573 13.1929 0.390524 12.9428C0.140476 12.6928 0 12.3536 0 12V6.66667C0 2.98467 2.98467 0 6.66667 0ZM6.66667 1.33333C5.25218 1.33333 3.89562 1.89524 2.89543 2.89543C1.89524 3.89562 1.33333 5.25218 1.33333 6.66667V12H6.66667C8.08115 12 9.43771 11.4381 10.4379 10.4379C11.4381 9.43771 12 8.08115 12 6.66667C12 5.25218 11.4381 3.89562 10.4379 2.89543C9.43771 1.89524 8.08115 1.33333 6.66667 1.33333ZM6.66667 8C6.83659 8.00019 7.00002 8.06525 7.12358 8.1819C7.24714 8.29854 7.32149 8.45797 7.33145 8.6276C7.34141 8.79722 7.28622 8.96425 7.17716 9.09455C7.0681 9.22486 6.9134 9.3086 6.74467 9.32867L6.66667 9.33333H4.66667C4.49675 9.33314 4.33331 9.26808 4.20975 9.15143C4.0862 9.03479 4.01184 8.87536 4.00188 8.70574C3.99193 8.53611 4.04712 8.36908 4.15618 8.23878C4.26524 8.10848 4.41994 8.02474 4.58867 8.00467L4.66667 8H6.66667ZM8.66667 5.33333C8.84348 5.33333 9.01305 5.40357 9.13807 5.5286C9.26309 5.65362 9.33333 5.82319 9.33333 6C9.33333 6.17681 9.26309 6.34638 9.13807 6.4714C9.01305 6.59643 8.84348 6.66667 8.66667 6.66667H4.66667C4.48986 6.66667 4.32029 6.59643 4.19526 6.4714C4.07024 6.34638 4 6.17681 4 6C4 5.82319 4.07024 5.65362 4.19526 5.5286C4.32029 5.40357 4.48986 5.33333 4.66667 5.33333H8.66667Z"
                                        fill="white" />
                                </svg>
                                {{ t.chat }}
                            </button>

                            <!-- Resolve Button: always occupies space to keep layout consistent -->
                            <button
                                :class="(row.status === 'Awaiting Action' && !row.isAutoResolve)
                                    ? 'bg-[#765E00] hover:bg-[#5E4B00] text-white shadow-sm'
                                    : 'invisible pointer-events-none'"
                                class="flex items-center justify-center px-6 py-1.5 rounded text-sm transition-all"
                                @click="row.status === 'Awaiting Action' && !row.isAutoResolve && $emit('resolve', row)">
                                {{ t.resolve }}
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed } from 'vue';
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()

const props = defineProps({
    type: { type: String, default: 'all' },
    data: { type: Array, required: true }
});

// Translation dictionary correctly observing currentLang
const t = computed(() => {
    return currentLang.value === 'ar' ? {
        module: 'الوحدة',
        title: 'عنوان التنبيه',
        date: 'التاريخ',
        status: 'الحالة',
        actions: 'الإجراءات',
        resolve: 'حل',
        chat: 'دردشة',
        view: 'عرض'
    } : {
        module: 'Module',
        title: 'Alert Title',
        date: 'Date',
        status: 'Status',
        actions: 'Actions',
        resolve: 'Resolve',
        chat: 'Chat',
        view: 'View'
    }
});

// Translation helper for dynamic status values
const translateStatus = (status) => {
    if (currentLang.value !== 'ar') return status;
    const s = status.toLowerCase();
    if (s.includes('completed')) return 'مكتمل';
    if (s.includes('resolved')) return 'تم الحل';
    if (s.includes('awaiting')) return 'قيد الانتظار';
    if (s.includes('pending')) return 'معلق';
    if (s.includes('ignored')) return 'تم التجاهل';
    return status;
};

// Dark-mode aware Theme configuration - Kept Light Mode colors exactly as before
const config = computed(() => {
    const isD = isDark.value;
    const themes = {
        all: {
            headerBg: 'bg-[#008864]',
            tableBg: isD ? 'bg-[#00261f]/50' : 'bg-[#9ae3d1]',
            borderColor: isD ? 'border-[#00261f]' : ''
        },
        pending: {
            headerBg: 'bg-[#A68426]',
            tableBg: isD ? 'bg-[#2b2610]' : 'bg-[#f2ebc4]',
            borderColor: isD ? 'border-[#00261f]' : ''
        },
        resolved: {
            headerBg: 'bg-[#0F5225]',
            tableBg: isD ? 'bg-[#0a2113]' : 'bg-[#bce8d1]',
            borderColor: isD ? 'border-[#00261f]    ' : ''
        },
        ignored: {
            headerBg: 'bg-[#4D4D4D]',
            tableBg: isD ? 'bg-[#1a1a1a]' : 'bg-[#d9dedd]',
            borderColor: isD ? 'border-[#00261f]' : ''
        }
    };
    return themes[props.type] || themes.all;
});

const getStatusStyles = (status) => {
    const s = status.toLowerCase();
    if (s.includes('completed') || s.includes('resolved')) return 'bg-[#198A3F] text-white border-transparent';
    if (s.includes('awaiting') || s.includes('pending')) return 'bg-[#B29544] text-white border-transparent';
    if (s.includes('ignored')) return 'bg-[#666666] text-white border-transparent';
    return isDark.value ? 'bg-white/10 text-white/60 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200';
};
</script>

<style scoped>
@keyframes expandFromMiddle {
    0% {
        transform: scaleX(0.2);
        opacity: 0;
    }

    100% {
        transform: scaleX(1);
        opacity: 1;
    }
}

.animate-expand {
    transform-origin: center;
    animation: expandFromMiddle 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 10px;
}

::-webkit-scrollbar-track {
    background: transparent;
}
</style>