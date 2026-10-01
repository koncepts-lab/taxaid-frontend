<template>
    <Teleport to="body">
        <Transition name="ledger-fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                @click.self="$emit('close')">

                <div class="w-full h-[580px] max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    style="max-width: 1100px;"
                    :class="isDark ? 'bg-[#001a14] border border-white/10' : 'bg-white'">

                    <div class="shrink-0 flex justify-between items-start py-5 px-4 lg:px-8"
                        :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100'">
                        <div>
                            <h3 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                                {{ ledgerName }} - {{ currentLang === 'ar' ? 'دفتر الأستاذ' : 'Ledger' }}
                                ({{ currentLang === 'ar' ? 'العام الحالي' : 'Current Year' }})
                            </h3>
                            <span class="text-[12px] mt-0.5 block" :class="isDark ? 'text-white/50' : 'text-[#00000096]'">
                                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button @click="handleExport" :disabled="exporting || !ledgerName"
                                class="flex items-center gap-2 px-3 lg:px-4 py-1.5 border rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                :class="isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#013e32]/30 text-[#013e32] hover:bg-[#013e32]/5'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span class="hidden sm:inline">{{ currentLang === 'ar' ? 'تصدير' : 'Export' }}</span>
                            </button>
                            <button @click="$emit('close')"
                                class="p-1.5 rounded-lg transition-colors"
                                :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-[#013e32]'">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar">
                        <div class="min-w-[800px] flex flex-col flex-1 h-full">
                            <div class="shrink-0 sticky top-0 z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table class="w-full text-sm">
                                    <colgroup>
                                        <col style="width: 18%">
                                        <col style="width: 46%">
                                        <col style="width: 18%">
                                        <col style="width: 18%">
                                    </colgroup>
                                    <thead>
                                        <tr class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                            <th class="ps-8 py-3.5 text-start font-medium text-[13px]">
                                                {{ currentLang === 'ar' ? 'التاريخ' : 'Date' }}
                                            </th>
                                            <th class="px-4 py-3.5 text-start font-medium text-[13px]">
                                                {{ currentLang === 'ar' ? 'البيان' : 'Particulars' }}
                                            </th>
                                            <th class="px-4 py-3.5 text-end font-medium text-[13px]">
                                                {{ currentLang === 'ar' ? 'مدين' : 'Debit' }}
                                            </th>
                                            <th class="pe-8 py-3.5 text-end font-medium text-[13px]">
                                                {{ currentLang === 'ar' ? 'دائن' : 'Credit' }}
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <div class="overflow-y-auto custom-scrollbar flex-1 min-h-[300px]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table v-if="loading" class="w-full text-sm">
                                    <colgroup>
                                        <col style="width: 18%">
                                        <col style="width: 46%">
                                        <col style="width: 18%">
                                        <col style="width: 18%">
                                    </colgroup>
                                    <tbody>
                                        <tr v-for="n in 8" :key="`ledger-skel-${n}`"
                                            class="border-b"
                                            :class="isDark ? 'border-white/5' : 'border-gray-100'">
                                            <td class="ps-8 py-3.5">
                                                <div class="h-4 rounded animate-pulse w-20"
                                                    :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
                                            </td>
                                            <td class="px-4 py-3.5">
                                                <div class="h-4 rounded animate-pulse w-3/4"
                                                    :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
                                            </td>
                                            <td class="px-4 py-3.5 text-end">
                                                <div class="h-4 rounded animate-pulse w-16 ms-auto"
                                                    :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
                                            </td>
                                            <td class="pe-8 py-3.5 text-end">
                                                <div class="h-4 rounded animate-pulse w-16 ms-auto"
                                                    :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div v-else-if="!reportRows.length" class="flex flex-col items-center justify-center h-full min-h-[300px] py-16">
                                    <p class="text-sm font-medium" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                                        {{ currentLang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available' }}
                                    </p>
                                </div>

                                <table v-else class="w-full text-sm">
                                    <colgroup>
                                        <col style="width: 18%">
                                        <col style="width: 46%">
                                        <col style="width: 18%">
                                        <col style="width: 18%">
                                    </colgroup>
                                    <tbody>
                                        <tr v-for="(row, idx) in reportRows" :key="idx"
                                            class="border-b transition-colors"
                                            :class="[
                                                row.in_range === 'Yes'
                                                    ? (isDark ? 'bg-[#00FFBC]/10 border-[#00FFBC]/20' : 'bg-[#94F0D8]/40 border-[#94F0D8]')
                                                    : (isDark ? 'bg-transparent border-white/5' : 'bg-white border-gray-100'),
                                                isDark ? 'text-white/80' : 'text-gray-700'
                                            ]">
                                            <td class="ps-8 py-3.5 text-[13px]">{{ row.date }}</td>
                                            <td class="px-4 py-3.5 text-[13px]">{{ row.particulars }}</td>
                                            <td class="px-4 py-3.5 text-end text-[13px]">{{ formatNumber(row.debit) }}</td>
                                            <td class="pe-8 py-3.5 text-end text-[13px]">{{ formatNumber(row.credit) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table class="w-full text-sm">
                                    <colgroup>
                                        <col style="width: 18%">
                                        <col style="width: 46%">
                                        <col style="width: 18%">
                                        <col style="width: 18%">
                                    </colgroup>
                                    <tbody>
                                        <tr class="font-semibold" :class="isDark ? 'bg-[#1D5E54] text-white' : 'bg-[#64E9D1] text-[#013e32]'">
                                            <td colspan="2" class="ps-8 py-3 text-start text-[13px]">
                                                {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                                            </td>
                                            <td class="px-4 py-3 text-end text-[13px]">{{ summaryRows.length >= 3 ? formatNumber(summaryRows[0]?.debit) : '-' }}</td>
                                            <td class="pe-8 py-3 text-end text-[13px]">{{ summaryRows.length >= 3 ? formatNumber(summaryRows[0]?.credit) : '-' }}</td>
                                        </tr>
                                        <tr class="font-semibold text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                            <td colspan="2" class="ps-8 py-3.5 text-center text-[13px]">
                                                {{ currentLang === 'ar' ? 'رصيد الإغلاق' : 'Closing balance' }}
                                            </td>
                                            <td class="px-4 py-3.5 text-end text-[13px]">{{ summaryRows.length >= 3 ? formatNumber(summaryRows[1]?.debit) : '-' }}</td>
                                            <td class="pe-8 py-3.5 text-end text-[13px]">{{ summaryRows.length >= 3 ? formatNumber(summaryRows[1]?.credit) : '-' }}</td>
                                        </tr>
                                        <tr class="font-semibold text-white" :class="isDark ? 'bg-[#00C9A2]/30' : 'bg-[#1EBBA3]'">
                                            <td colspan="2" class="ps-8 py-3 text-start text-[13px]"></td>
                                            <td class="px-4 py-3 text-end text-[13px]">{{ summaryRows.length >= 3 ? formatNumber(summaryRows[2]?.debit) : '-' }}</td>
                                            <td class="pe-8 py-3 text-end text-[13px]">{{ summaryRows.length >= 3 ? formatNumber(summaryRows[2]?.credit) : '-' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    loading: Boolean,
    ledgerName: String,
    data: Object,
    isDark: Boolean,
    statement: {
        type: String,
        default: 'pl'
    },
    rangeOption: String,
    customFrom: String,
    customTo: String
})

defineEmits(['close'])

const currentLang = useState('currentLang', () => 'en')

const formatNumber = (val) => {
    if (val === null || val === undefined || val === '' || val === '-') return '-'
    const clean = typeof val === 'string' ? val.replace(/,/g, '') : val
    const num = Number(clean)
    if (isNaN(num)) return val
    return formatStandardNumber(num, 2)
}

const reportRows = computed(() => {
    const list = props.data?.report || []
    return list.length > 3 ? list.slice(0, -3) : list
})

const summaryRows = computed(() => {
    const list = props.data?.report || []
    return list.length >= 3 ? list.slice(-3) : []
})

const { exporting, exportLedger } = useExport()

const handleExport = () => {
    exportLedger(props.statement === 'bs' ? 'balance_sheet' : 'profit_loss', props.ledgerName, {
        range_option: props.rangeOption,
        custom_from: props.customFrom,
        custom_to: props.customTo,
    })
}
</script>

<style scoped>
.ledger-fade-enter-active,
.ledger-fade-leave-active {
    transition: opacity 0.2s ease;
}
.ledger-fade-enter-from,
.ledger-fade-leave-to {
    opacity: 0;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
