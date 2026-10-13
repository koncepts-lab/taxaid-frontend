<template>
    <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar">
        <div class="min-w-[900px] flex flex-col flex-1 h-full">
            <!-- ── Fixed Column Headers ── -->
            <div class="shrink-0 sticky top-0 z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <table class="w-full text-sm table-fixed">
                    <colgroup>
                        <col style="width: 28%">
                        <col v-for="m in months" :key="`h-${m}`" :style="`width: ${72 / months.length}%`">
                    </colgroup>
                    <thead>
                        <tr class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                            <th class="ps-8 py-3.5 text-start font-medium text-[13px]">{{ currentLang === 'ar' ? 'التدفقات النقدية' : 'Cashflow' }}</th>
                            <th v-for="m in months" :key="m" class="px-6 py-3.5 text-right rtl:text-left font-medium text-[13px]">{{ m }}</th>
                        </tr>
                    </thead>
                </table>
            </div>

            <!-- ── Scrollable Body ── -->
            <div class="overflow-y-auto custom-scrollbar flex-1" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <div v-if="!sections.length" class="flex items-center justify-center py-16">
                    <p class="text-sm font-medium" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ currentLang === 'ar' ? 'لا توجد بيانات' : 'No data available' }}</p>
                </div>
                <table v-else class="w-full text-sm table-fixed">
                    <colgroup>
                        <col style="width: 28%">
                        <col v-for="m in months" :key="`b-${m}`" :style="`width: ${72 / months.length}%`">
                    </colgroup>
                    <tbody>
                        <template v-for="section in sections" :key="section.key">
                            <tr :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'">
                                <td :colspan="months.length + 1" class="px-8 py-3 font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-black'">
                                    {{ currentLang === 'ar' ? section.title.ar : section.title.en }}
                                </td>
                            </tr>
                            <tr v-for="row in section.rows" :key="section.key + row.name"
                                class="border-b" :class="isDark ? 'bg-[#003D2E] border-white/5' : 'bg-[#E8FBF3] border-[#b2edd4]'">
                                <td class="px-8 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                    <div class="flex items-center gap-2 group relative inline-block">
                                        <span>{{ row.name }}</span>
                                        <template v-if="row.invoiceType">
                                            <div class="absolute top-1/2 -translate-y-1/2 ltr:left-full rtl:right-full ltr:ml-2 rtl:mr-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                                <div class="bg-[#013e32] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
                                                    {{ currentLang === 'ar' ? 'عرض تفاصيل الفواتير' : 'View Invoice Details' }}
                                                </div>
                                                <div class="absolute top-1/2 -translate-y-1/2 ltr:-left-1 rtl:-right-1 w-2 h-2 bg-[#013e32] rotate-45"></div>
                                            </div>
                                            <button @click="$emit('open-invoices', row)" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity outline-none">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>
                                            </button>
                                        </template>
                                    </div>
                                </td>
                                <td v-for="(value, idx) in row.values" :key="idx" class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">
                                    {{ value }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: { type: String, default: 'incoming' }, // incoming | outgoing
})
defineEmits(['open-invoices'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { summary, sections: allSections } = useCashFlow()

const months   = computed(() => summary.value?.months ?? [])
const sections = computed(() => (props.type === 'incoming' ? allSections.value?.incoming : allSections.value?.outgoing) ?? [])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
