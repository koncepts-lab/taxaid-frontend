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
                    <!-- Skeleton rows while loading — same row height as real rows, no layout shift -->
                    <tr v-if="loading" v-for="n in (meta?.per_page || 10)" :key="'skeleton-' + n"
                        class="border-b last:border-none h-[52px]" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                        <td class="px-6 py-4" colspan="4">
                            <div class="h-4 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
                        </td>
                    </tr>

                    <template v-else>
                        <tr v-for="(log, idx) in logs" :key="idx" class="transition-colors border-b last:border-none h-[52px]"
                            :class="isDark ? 'bg-[#00141080] border-white/5 text-white/70' : 'bg-white border-gray-100 text-[#4D4D4D]'">
                            <td class="px-6 py-4 text-sm whitespace-nowrap">{{ log.date }}</td>
                            <td class="px-4 py-4 text-sm whitespace-nowrap">{{ log.time }}</td>
                            <td class="px-4 py-4 text-sm whitespace-nowrap">{{ log.user }}</td>
                            <td class="px-4 py-4 text-sm">{{ log.details }}</td>
                        </tr>

                        <!-- Filler rows on a partial last page — keeps table height fixed, no CLS -->
                        <tr v-if="logs && logs.length > 0" v-for="n in fillerRowCount" :key="'filler-' + n"
                            class="border-b last:border-none h-[52px]" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                            <td class="px-6 py-4" colspan="4">&nbsp;</td>
                        </tr>

                        <tr v-if="!logs || logs.length === 0">
                            <td colspan="4" class="px-6 py-8 text-center text-sm" :class="isDark ? 'text-white/50' : 'text-gray-400'">
                                {{ currentLang === 'ar' ? 'لا توجد سجلات' : 'No logs available' }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Only show pagination once there's more than a page's worth of rows -->
        <CommonPaginationBar v-if="meta && meta.total > 10" :meta="meta"
            @page-change="(p) => onPageChange && onPageChange(p, meta.per_page)"
            @per-page-change="(pp) => onPageChange && onPageChange(1, pp)" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    logs: { type: Array, default: () => [] },
    meta: { type: Object, default: () => ({ current_page: 1, per_page: 10, total: 0, last_page: 1 }) },
    loading: { type: Boolean, default: false },
    onPageChange: { type: Function, default: null },
    isDark: Boolean,
    currentLang: String
});

// Pads a partial last page (e.g. 8 of 10 rows) up to per_page rows so the
// table height stays fixed across page changes. Only applies when pagination
// is actually showing (total > 10) — under that, a short table is correct.
const fillerRowCount = computed(() => {
    if (!props.meta || props.meta.total <= 10) return 0
    const perPage = props.meta?.per_page || 10
    const rowCount = props.logs?.length || 0
    return rowCount > 0 && rowCount < perPage ? perPage - rowCount : 0
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>