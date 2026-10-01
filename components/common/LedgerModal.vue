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
                                {{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button @click="exportStatement" :disabled="exporting || !ledgerName"
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
                                <div v-else-if="error" class="flex flex-col items-center justify-center h-full min-h-[300px] py-16">
                                    <p class="text-sm font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
                                </div>
                                <div v-else-if="!bodyRows.length" class="flex flex-col items-center justify-center h-full min-h-[300px] py-16">
                                    <p class="text-sm font-medium" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ currentLang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available' }}</p>
                                </div>
                                <table v-else class="w-full text-sm">
                                    <colgroup>
                                        <col style="width: 18%">
                                        <col style="width: 46%">
                                        <col style="width: 18%">
                                        <col style="width: 18%">
                                    </colgroup>
                                    <tbody>
                                        <tr v-for="(row, idx) in bodyRows" :key="idx"
                                            class="border-b transition-colors"
                                            :class="[
                                                isDark ? 'bg-transparent border-white/5 text-white/80' : 'bg-white border-gray-100 text-gray-700'
                                            ]">
                                            <td class="ps-8 py-3.5 text-[13px] font-medium">{{ row.date }}</td>
                                            <td class="px-4 py-3.5 text-[13px] font-medium">{{ row.particulars }}</td>
                                            <td class="px-4 py-3.5 text-end text-[13px] font-medium tabular-nums">{{ row.debit }}</td>
                                            <td class="pe-8 py-3.5 text-end text-[13px] font-medium tabular-nums">{{ row.credit }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="statement && !loading" class="shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table class="w-full text-sm">
                                    <colgroup>
                                        <col style="width: 18%">
                                        <col style="width: 46%">
                                        <col style="width: 18%">
                                        <col style="width: 18%">
                                    </colgroup>
                                    <tbody>
                                        <tr class="font-semibold" :class="isDark ? 'bg-[#1D5E54] text-white' : 'bg-[#64E9D1] text-[#013e32]'">
                                            <td colspan="2" class="ps-8 py-3 text-start text-[13px]"></td>
                                            <td class="px-4 py-3 text-end text-[13px] tabular-nums">{{ totals.debit }}</td>
                                            <td class="pe-8 py-3 text-end text-[13px] tabular-nums">{{ totals.credit }}</td>
                                        </tr>
                                        <tr class="font-semibold text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                            <td colspan="2" class="ps-8 py-3.5 text-center text-[13px]">
                                                {{ currentLang === 'ar' ? 'رصيد الإغلاق' : 'Closing balance' }}
                                            </td>
                                            <td class="px-4 py-3.5 text-end text-[13px] tabular-nums">{{ totals.closingDebit }}</td>
                                            <td class="pe-8 py-3.5 text-end text-[13px] tabular-nums">{{ totals.closingCredit }}</td>
                                        </tr>
                                        <tr class="font-semibold text-white" :class="isDark ? 'bg-[#00C9A2]/30' : 'bg-[#1EBBA3]'">
                                            <td colspan="2" class="ps-8 py-3 text-start text-[13px]"></td>
                                            <td class="px-4 py-3 text-end text-[13px] tabular-nums">{{ totals.finalDebit }}</td>
                                            <td class="pe-8 py-3.5 text-end text-[13px] tabular-nums">{{ totals.finalCredit }}</td>
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
import { ref, computed, watch } from 'vue'
import { formatStandardNumber } from '~/utils/formatters'

const props = defineProps({
    isOpen: Boolean,
    ledgerName: String,
    card: { type: String, default: 'revenue' },
    rangeOption: { type: String, default: null },
    customFrom: { type: String, default: null },
    customTo: { type: String, default: null },
})

defineEmits(['close'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const defaultRangeOption = useState(`${props.card}_range_option`, () => 'Year to Date')
const defaultCustomFrom  = useState(`${props.card}_custom_from`, () => null)
const defaultCustomTo    = useState(`${props.card}_custom_to`,   () => null)

const activeRangeOption = computed(() => props.rangeOption || defaultRangeOption.value)
const activeCustomFrom = computed(() => props.customFrom !== undefined ? props.customFrom : defaultCustomFrom.value)
const activeCustomTo = computed(() => props.customTo !== undefined ? props.customTo : defaultCustomTo.value)

const { exporting, exportLedger } = useExport()

const exportStatement = () => exportLedger(props.card, props.ledgerName, {
    range_option: activeRangeOption.value,
    custom_from: activeCustomFrom.value,
    custom_to: activeCustomTo.value,
    lang: currentLang.value,
})

const loading   = ref(false)
const error     = ref(null)
const statement = ref(null)

const fetchStatement = async () => {
    if (!props.ledgerName) return
    loading.value = true
    error.value   = null
    statement.value = null
    try {
        const body = {
            ledger: props.ledgerName,
            range_option: activeRangeOption.value === 'Custom Range' ? 'Custom Dates' : activeRangeOption.value,
        }
        if (activeCustomFrom.value) body.custom_from = activeCustomFrom.value
        if (activeCustomTo.value)   body.custom_to   = activeCustomTo.value

        const res = await useApi('financial-analysis/pl-ledger-details', { method: 'POST', body })
        statement.value = res?.data ?? null
    } catch (err) {
        error.value = err?.data?.message ?? 'Failed to load ledger'
    } finally {
        loading.value = false
    }
}

watch(() => props.isOpen, (open) => { if (open) fetchStatement() })

const fmt = (v) => (v === null || v === undefined || v === '') ? '-' : formatStandardNumber(Number(v), 2)

const formatDate = (d) => {
    if (!d) return '-'
    const date = new Date(d)
    return date.toLocaleDateString(currentLang.value === 'ar' ? 'ar-AE' : 'en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const bodyRows = computed(() => {
    const s = statement.value
    if (!s) return []
    const rows = []
    rows.push({
        date: s.from ? formatDate(s.from) : '',
        particulars: `${s.opening_balance >= 0 ? 'By' : 'To'} ${currentLang.value === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}`,
        debit: s.opening_balance < 0 ? fmt(Math.abs(s.opening_balance)) : '-',
        credit: s.opening_balance >= 0 ? fmt(s.opening_balance) : '-',
    })
    for (const e of (s.entries || [])) {
        rows.push({
            date: formatDate(e.date),
            particulars: e.particulars,
            debit: e.debit != null ? fmt(e.debit) : '-',
            credit: e.credit != null ? fmt(e.credit) : '-',
        })
    }
    return rows
})

const totals = computed(() => {
    const s = statement.value
    if (!s) return { debit: '-', credit: '-', closingDebit: '-', closingCredit: '-', finalDebit: '-', finalCredit: '-' }
    const openingDr = s.opening_balance < 0 ? Math.abs(s.opening_balance) : 0
    const openingCr = s.opening_balance >= 0 ? s.opening_balance : 0
    const grandDr   = Number(s.total_debit || 0) + openingDr
    const grandCr   = Number(s.total_credit || 0) + openingCr
    const final     = Math.max(grandDr, grandCr)
    return {
        debit: fmt(s.total_debit),
        credit: fmt(s.total_credit),
        closingDebit: s.closing_balance < 0 ? fmt(Math.abs(s.closing_balance)) : '-',
        closingCredit: s.closing_balance >= 0 ? fmt(s.closing_balance) : '-',
        finalDebit: fmt(final),
        finalCredit: fmt(final),
    }
})
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

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
