<template>
    <div class="mt-8 transition-all duration-500 w-full max-w-full">
        <h3 class="text-lg font-medium mb-4" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'سجل التغييرات' : 'Change log' }}
        </h3>

        <div class="w-full overflow-x-auto custom-scrollbar rounded-[15px] border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <table class="w-full text-left rtl:text-right border-collapse min-w-[600px]">
                <thead>
                    <tr class="bg-[#008864] text-white">
                        <th class="px-6 py-4 text-[14px] font-normal rounded-tl-[15px] whitespace-nowrap">Date</th>
                        <th class="px-4 py-4 text-[14px] font-normal whitespace-nowrap">Timestamp</th>
                        <th class="px-4 py-4 text-[14px] font-normal whitespace-nowrap">User ID</th>
                        <th class="px-4 py-4 text-[14px] font-normal rounded-tr-[15px] whitespace-nowrap">Details of change</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(log, idx) in paginatedLogs" :key="idx" class="transition-colors border-b last:border-none"
                        :class="isDark ? 'bg-[#00141080] border-white/5 text-white/70' : 'bg-white border-gray-100 text-[#4D4D4D]'">
                        <td class="px-6 py-4 text-sm whitespace-nowrap">{{ log.date }}</td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">{{ log.time }}</td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">{{ log.user }}</td>
                        <td class="px-4 py-4 text-sm">{{ log.details }}</td>
                    </tr>
                    <tr v-if="!logs || logs.length === 0">
                        <td colspan="4" class="px-6 py-8 text-center text-sm" :class="isDark ? 'text-white/50' : 'text-gray-400'">
                            {{ currentLang === 'ar' ? 'لا توجد سجلات' : 'No logs available' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="logs && logs.length > 0" class="py-4 flex flex-wrap items-center justify-between gap-3">
            <span class="text-sm" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                {{ currentLang === 'ar' ? 'عرض' : 'Showing' }} {{ pageStart }}–{{ pageEnd }} {{ currentLang === 'ar' ? 'من' : 'of' }} {{ totalItems }} {{ currentLang === 'ar' ? 'النتائج' : 'results' }}
            </span>
            <div class="flex items-center gap-1.5">
                <button @click="goToPage(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="px-3 py-1.5 rounded-lg border text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="isDark ? 'border-white/10 text-white/80 bg-[#1a1a1a] hover:bg-white/10' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'">
                    {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
                </button>
                <button v-for="p in visiblePages" :key="p"
                    @click="goToPage(p)"
                    :class="[
                        p === currentPage
                            ? 'bg-[#00896F] text-white border-[#00896F]'
                            : (isDark ? 'bg-[#1a1a1a] text-white/80 border-white/10 hover:bg-white/10' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'),
                        'w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all'
                    ]">
                    {{ p }}
                </button>
                <button @click="goToPage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="px-3 py-1.5 rounded-lg border text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="isDark ? 'border-white/10 text-white/80 bg-[#1a1a1a] hover:bg-white/10' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'">
                    {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    logs: { type: Array, default: () => [] },
    isDark: Boolean,
    currentLang: String
});

const currentPage = ref(1);
const perPage = ref(5);

const totalItems = computed(() => props.logs?.length || 0);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / perPage.value)));

const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return (props.logs || []).slice(start, start + perPage.value);
});

const pageStart = computed(() => totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const pageEnd = computed(() => Math.min(currentPage.value * perPage.value, totalItems.value));

const visiblePages = computed(() => {
    const pages = [];
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

watch(() => props.logs, () => {
    currentPage.value = 1;
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>