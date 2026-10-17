<template>
    <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar">
        <div class="min-w-[900px] flex flex-col flex-1 min-h-0 h-full">
            <div v-if="!hideHeaderBar" class="shrink-0 flex items-center justify-between px-4 lg:px-8 py-2.5 border-b"
                :class="isDark ? 'border-white/10 bg-[#002B21]/60' : 'border-gray-100 bg-[#E8FBF3]/50'"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <div class="flex items-center gap-2">
                    <button v-if="activeSectionKey" @click="activeSectionKey = null"
                        class="p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                        :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-[#013e32]'">
                        <svg class="w-4 h-4" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        <span>{{ currentLang === 'ar' ? 'الكل' : 'All' }}</span>
                    </button>
                    <span v-if="activeSection" class="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        :class="isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#008864]/10 text-[#008864]'">
                        {{ currentLang === 'ar' ? activeSection.title.ar : activeSection.title.en }}
                    </span>
                </div>

                <div class="flex items-center gap-1 p-1 rounded-xl"
                    :class="isDark ? 'bg-black/40 border border-white/10' : 'bg-gray-100 border border-gray-200'">
                    <button @click="setMode('drilldown')"
                        class="p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                        :title="currentLang === 'ar' ? 'الانتقال بالداخل' : 'Drill-down mode'"
                        :class="viewMode === 'drilldown' ? (isDark ? 'bg-[#008864] text-white shadow-sm' : 'bg-white text-[#008864] shadow-sm') : (isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-black')">
                        <svg class="w-4 h-4" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button @click="setMode('accordion')"
                        class="p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                        :title="currentLang === 'ar' ? 'توسيع مضمن' : 'Expand mode'"
                        :class="viewMode === 'accordion' ? (isDark ? 'bg-[#008864] text-white shadow-sm' : 'bg-white text-[#008864] shadow-sm') : (isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-black')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                </div>
            </div>

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

            <div class="overflow-y-auto custom-scrollbar flex-1" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <div v-if="!displayedSections.length" class="flex items-center justify-center py-16">
                    <p class="text-sm font-medium" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ currentLang === 'ar' ? 'لا توجد بيانات' : 'No data available' }}</p>
                </div>
                <table v-else class="w-full text-sm table-fixed">
                    <colgroup>
                        <col style="width: 28%">
                        <col v-for="m in months" :key="`b-${m}`" :style="`width: ${72 / months.length}%`">
                    </colgroup>
                    <tbody>
                        <template v-for="section in displayedSections" :key="section.key">
                            <tr :class="[isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]', 'transition-colors cursor-pointer select-none']"
                                @click="handleSectionHeaderClick(section.key)">
                                <td :colspan="months.length + 1" class="px-8 py-3 font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-black'">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <span>{{ currentLang === 'ar' ? section.title.ar : section.title.en }}</span>
                                            <span class="text-xs opacity-70">({{ section.rows.length }})</span>
                                        </div>

                                        <button v-if="viewMode === 'drilldown'" class="focus:outline-none p-1">
                                            <svg class="w-4 h-4 transition-transform" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <button v-else class="focus:outline-none p-1">
                                            <svg class="w-4 h-4 transition-transform duration-300"
                                                :class="{ 'rotate-180': expandedSections.includes(section.key) }"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M19 9l-7 7-7-7"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <template v-if="shouldShowRows(section.key)">
                                <tr v-for="row in section.rows" :key="section.key + row.name"
                                    class="border-b transition-colors" :class="isDark ? 'bg-[#003D2E] border-white/5 hover:bg-[#004a37]' : 'bg-[#E8FBF3] border-[#b2edd4] hover:bg-[#d6f7eb]'">
                                    <td class="px-8 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                        <div class="flex items-center justify-between gap-2.5">
                                            <span>{{ row.name }}</span>
                                            <button
                                                v-if="row.invoiceType"
                                                @click.stop="$emit('open-invoices', row)"
                                                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all shadow-sm shrink-0"
                                                :class="isDark ? 'bg-[#00FFBC] text-[#002e26] hover:bg-[#00e6a8]' : 'bg-[#008864] text-white hover:bg-[#007052]'"
                                            >
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                                <span>{{ currentLang === 'ar' ? 'الفواتير' : 'Invoices' }}</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td v-for="(value, idx) in row.values" :key="idx" class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">
                                        {{ value }}
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    type: { type: String, default: 'incoming' },
    hideHeaderBar: { type: Boolean, default: false },
    modelViewMode: { type: String, default: null },
    modelActiveKey: { type: String, default: null },
})
const emit = defineEmits(['open-invoices', 'update:modelViewMode', 'update:modelActiveKey'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { summary, sections: allSections } = useCashFlow()

const months   = computed(() => summary.value?.months ?? [])
const sections = computed(() => (props.type === 'incoming' ? allSections.value?.incoming : allSections.value?.outgoing) ?? [])

const internalViewMode = ref('accordion')
const internalActiveKey = ref(null)

const viewMode = computed({
    get: () => props.modelViewMode ?? internalViewMode.value,
    set: (val) => {
        if (props.modelViewMode !== null) emit('update:modelViewMode', val)
        else internalViewMode.value = val
    }
})

const activeSectionKey = computed({
    get: () => props.modelActiveKey ?? internalActiveKey.value,
    set: (val) => {
        if (props.modelActiveKey !== null) emit('update:modelActiveKey', val)
        else internalActiveKey.value = val
    }
})

const expandedSections = ref([])

const activeSection = computed(() => {
    if (!activeSectionKey.value) return null
    return sections.value.find(s => s.key === activeSectionKey.value) || null
})

const displayedSections = computed(() => {
    if (viewMode.value === 'drilldown' && activeSectionKey.value) {
        return sections.value.filter(s => s.key === activeSectionKey.value)
    }
    return sections.value
})

const setMode = (mode) => {
    viewMode.value = mode
    activeSectionKey.value = null
}

const handleSectionHeaderClick = (key) => {
    if (viewMode.value === 'drilldown') {
        if (activeSectionKey.value === key) {
            activeSectionKey.value = null
        } else {
            activeSectionKey.value = key
        }
    } else {
        const idx = expandedSections.value.indexOf(key)
        if (idx > -1) {
            expandedSections.value.splice(idx, 1)
        } else {
            expandedSections.value.push(key)
        }
    }
}

const shouldShowRows = (key) => {
    if (viewMode.value === 'drilldown') {
        return activeSectionKey.value === key
    }
    return expandedSections.value.includes(key)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
