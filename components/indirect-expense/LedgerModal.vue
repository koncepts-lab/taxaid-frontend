<template>
    <Teleport to="body">
        <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="close">
            <div class="w-full rounded-xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1200px; max-height: 85vh;">
                <!-- Header -->
                <div class="flex justify-between items-center py-5 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                    <div class="flex flex-col">
                        <h2 class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                            {{ ledger }} - {{ currentLang === 'ar' ? 'دفتر الأستاذ' : 'Ledger' }}
                        </h2>
                        <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                            {{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}<span v-if="rangeLabel"> · {{ rangeLabel }}</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="exportCsv"
                            class="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                            :class="isDark ? 'border-[#04C18F] text-white hover:bg-white/10' : 'border-gray-200 text-black hover:bg-gray-50'">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4"/></svg>
                            {{ currentLang === 'ar' ? 'تصدير' : 'Export' }}
                        </button>
                        <button @click="close" class="p-2 rounded-full transition-colors" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>

                <!-- ── Table Container (Handles Horizontal Scroll) ── -->
                <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar bg-white dark:bg-[#00141080]">
                    <div class="min-w-[800px] flex flex-col flex-1 h-full">
                        <div v-if="loading" class="py-16 text-center text-sm" :class="isDark ? 'text-white/60' : 'text-black/60'">
                            {{ currentLang === 'ar' ? 'جار التحميل...' : 'Loading...' }}
                        </div>
                        <div v-else-if="error" class="py-16 text-center text-sm text-red-500">{{ error }}</div>
                        <template v-else-if="statement">
                            <!-- Fixed Header -->
                            <div class="shrink-0 sticky top-0 z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                                    <colgroup>
                                        <col style="width: 20%" />
                                        <col style="width: 40%" />
                                        <col style="width: 20%" />
                                        <col style="width: 20%" />
                                    </colgroup>
                                    <thead class="text-white" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
                                        <tr>
                                            <th class="px-8 py-4 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التاريخ' : 'Date' }}</th>
                                            <th class="px-6 py-4 font-medium text-[14px]">{{ currentLang === 'ar' ? 'البيان' : 'Particulars' }}</th>
                                            <th class="px-6 py-4 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'مدين' : 'Debit' }}</th>
                                            <th class="px-6 py-4 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'دائن' : 'Credit' }}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <!-- Scrollable Body -->
                            <div class="overflow-y-auto custom-scrollbar flex-1 max-h-[60vh]">
                                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                                    <colgroup>
                                        <col style="width: 20%" />
                                        <col style="width: 40%" />
                                        <col style="width: 20%" />
                                        <col style="width: 20%" />
                                    </colgroup>
                                    <tbody :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
                                        <!-- Opening balance -->
                                        <tr :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100 bg-white'">
                                            <td class="px-8 py-3.5 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">{{ fmtDate(statement.from) }}</td>
                                            <td class="px-6 py-3.5 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                                {{ statement.opening_balance >= 0 ? 'By' : 'To' }} {{ currentLang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance' }}
                                            </td>
                                            <td class="px-6 py-3.5 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">{{ statement.opening_balance < 0 ? fmt(-statement.opening_balance) : '-' }}</td>
                                            <td class="px-6 py-3.5 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">{{ statement.opening_balance >= 0 ? fmt(statement.opening_balance) : '-' }}</td>
                                        </tr>
                                        <!-- Entries -->
                                        <tr v-for="(e, idx) in statement.entries" :key="idx" :title="e.narration"
                                            :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100 bg-white'">
                                            <td class="px-8 py-3.5 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">{{ fmtDate(e.date) }}</td>
                                            <td class="px-6 py-3.5 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">{{ e.particulars }}</td>
                                            <td class="px-6 py-3.5 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">{{ e.debit != null ? fmt(e.debit) : '-' }}</td>
                                            <td class="px-6 py-3.5 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">{{ e.credit != null ? fmt(e.credit) : '-' }}</td>
                                        </tr>
                                        <!-- Totals -->
                                        <tr :class="isDark ? 'bg-[#04C18F5E] text-white' : 'bg-[#68E4C4] text-black'">
                                            <td class="px-8 py-4 font-medium text-[14px]"></td>
                                            <td class="px-6 py-4 font-medium text-[14px]"></td>
                                            <td class="px-6 py-4 text-right rtl:text-left font-medium text-[14px]">{{ fmt(statement.total_debit) }}</td>
                                            <td class="px-6 py-4 text-right rtl:text-left font-medium text-[14px]">{{ fmt(statement.total_credit) }}</td>
                                        </tr>
                                        <!-- Closing balance -->
                                        <tr class="text-white" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
                                            <td class="px-8 py-4 font-medium text-[14px]"></td>
                                            <td class="px-6 py-4 font-medium text-[14px]">{{ currentLang === 'ar' ? 'الرصيد الختامي' : 'Closing balance' }}</td>
                                            <td class="px-6 py-4 text-right rtl:text-left font-medium text-[14px]">{{ statement.closing_balance < 0 ? fmt(-statement.closing_balance) : '-' }}</td>
                                            <td class="px-6 py-4 text-right rtl:text-left font-medium text-[14px]">{{ statement.closing_balance >= 0 ? fmt(statement.closing_balance) : '-' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    open:   Boolean,
    ledger: { type: String, default: '' },
})
const emit = defineEmits(['update:open'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { fetchLedgerStatement } = useIndirectExpense()

const loading   = ref(false)
const error     = ref(null)
const statement = ref(null)
const rangeLabel = ref('')

const close = () => emit('update:open', false)

watch(() => props.open, async (isOpen) => {
    if (!isOpen || !props.ledger) return
    loading.value = true
    error.value = null
    statement.value = null
    try {
        const res = await fetchLedgerStatement(props.ledger)
        statement.value = { ...res.data, from: res.info?.from }
        rangeLabel.value = res.info ? `${fmtDate(res.info.from)} → ${fmtDate(res.info.to)}` : ''
    } catch (e) {
        error.value = e?.message ?? 'Failed to load ledger'
    } finally {
        loading.value = false
    }
})

const fmt = (val) => Number(val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const exportCsv = () => {
    if (!statement.value) return
    const s = statement.value
    const lines = ['Date,Particulars,Voucher No,Debit,Credit,Narration']
    lines.push(`${fmtDate(s.from)},"Opening Balance",,${s.opening_balance < 0 ? -s.opening_balance : ''},${s.opening_balance >= 0 ? s.opening_balance : ''},`)
    for (const e of s.entries) {
        lines.push(`${e.date},"${(e.particulars ?? '').replace(/"/g, '""')}","${e.voucher_no ?? ''}",${e.debit ?? ''},${e.credit ?? ''},"${(e.narration ?? '').replace(/"/g, '""')}"`)
    }
    lines.push(`,Total,,${s.total_debit},${s.total_credit},`)
    lines.push(`,Closing balance,,${s.closing_balance < 0 ? -s.closing_balance : ''},${s.closing_balance >= 0 ? s.closing_balance : ''},`)
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${props.ledger.replace(/[^\w\- ]/g, '')}-ledger.csv`
    a.click()
    URL.revokeObjectURL(a.href)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
