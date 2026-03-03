<template>
    <Teleport to="body">
        <Transition name="ledger-fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                @click.self="$emit('close')">

                <div class="w-full max-h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    style="max-width: 1100px;"
                    :class="isDark ? 'bg-[#001a14] border border-white/10' : 'bg-white'">

                    <!-- ── Fixed Header ── -->
                    <div class="shrink-0 flex justify-between items-start py-5 px-8"
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
                            <!-- Export Button -->
                            <button class="flex items-center gap-2 px-4 py-1.5 border rounded-lg text-[13px] font-medium transition-colors"
                                :class="isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#013e32]/30 text-[#013e32] hover:bg-[#013e32]/5'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                {{ currentLang === 'ar' ? 'تصدير' : 'Export' }}
                            </button>
                            <!-- Close -->
                            <button @click="$emit('close')"
                                class="p-1.5 rounded-lg transition-colors"
                                :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-[#013e32]'">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- ── Fixed Table Column Headers ── -->
                    <div class="shrink-0" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                        <table class="w-full text-sm table-fixed">
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

                    <!-- ── Scrollable Body ── -->
                    <div class="flex-1 overflow-y-auto no-scrollbar" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                        <table class="w-full text-sm table-fixed">
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
                                        row.highlighted
                                            ? (isDark ? 'bg-[#00FFBC]/10 border-[#00FFBC]/20' : 'bg-[#94F0D8]/40 border-[#94F0D8]')
                                            : (isDark ? 'bg-transparent border-white/5' : 'bg-white border-gray-100'),
                                        isDark ? 'text-white/80' : 'text-gray-700'
                                    ]">
                                    <td class="ps-8 py-3.5 text-[13px]">{{ row.date }}</td>
                                    <td class="px-4 py-3.5 text-[13px]">{{ row.particulars }}</td>
                                    <td class="px-4 py-3.5 text-end text-[13px]">{{ row.debit }}</td>
                                    <td class="pe-8 py-3.5 text-end text-[13px]">{{ row.credit }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- ── Fixed Footer: Last 3 Summary Rows ── -->
                    <div class="shrink-0" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                        <table class="w-full text-sm table-fixed">
                            <colgroup>
                                <col style="width: 18%">
                                <col style="width: 46%">
                                <col style="width: 18%">
                                <col style="width: 18%">
                            </colgroup>
                            <tbody>
                                <!-- Total Row -->
                                <tr class="font-semibold" :class="isDark ? 'bg-[#1D5E54] text-white' : 'bg-[#64E9D1] text-[#013e32]'">
                                    <td colspan="2" class="ps-8 py-3 text-start text-[13px]"></td>
                                    <td class="px-4 py-3 text-end text-[13px]">{{ totals.debit }}</td>
                                    <td class="pe-8 py-3 text-end text-[13px]">{{ totals.credit }}</td>
                                </tr>
                                <!-- Closing Balance Row -->
                                <tr class="font-semibold text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                    <td colspan="2" class="ps-8 py-3.5 text-center text-[13px]">
                                        {{ currentLang === 'ar' ? 'رصيد الإغلاق' : 'Closing balance' }}
                                    </td>
                                    <td class="px-4 py-3.5 text-end text-[13px]">{{ totals.closingDebit }}</td>
                                    <td class="pe-8 py-3.5 text-end text-[13px]"></td>
                                </tr>
                                <!-- Final Total Row -->
                                <tr class="font-semibold text-white" :class="isDark ? 'bg-[#00C9A2]/30' : 'bg-[#1EBBA3]'">
                                    <td colspan="2" class="ps-8 py-3 text-start text-[13px]"></td>
                                    <td class="px-4 py-3 text-end text-[13px]">{{ totals.finalDebit }}</td>
                                    <td class="pe-8 py-3 text-end text-[13px]">{{ totals.finalCredit }}</td>
                                </tr>
                            </tbody>
                        </table>
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
    ledgerName: String,
})

defineEmits(['close'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

// Mock ledger body data
const bodyRows = computed(() => [
    { date: 'Jan 10, 2025', particulars: 'By Opening Balance', debit: '-', credit: '10,316.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'To Commercial', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '10,316.25', highlighted: true },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: true },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: true },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
    { date: 'Jan 10, 2025', particulars: 'ABC Traders', debit: '-', credit: '43,853.25', highlighted: false },
])

const totals = computed(() => ({
    debit: '53,995.75',
    credit: '1,12,444.5',
    closingDebit: '-58,448.8',
    finalDebit: '1,12,444.5',
    finalCredit: '1,12,444.5',
}))
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.ledger-fade-enter-active,
.ledger-fade-leave-active {
    transition: opacity 0.2s ease;
}
.ledger-fade-enter-from,
.ledger-fade-leave-to {
    opacity: 0;
}
</style>
