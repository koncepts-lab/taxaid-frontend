<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="close">
                <div class="w-full max-h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#001a14] border border-white/10' : 'bg-white'" style="max-width: 1100px;">
                    <!-- ── Fixed Header ── -->
                    <div class="shrink-0 flex justify-between items-start py-5 px-4 lg:px-8 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <div>
                            <h3 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                                {{ customer }}
                            </h3>
                            <span class="text-[12px] mt-0.5 block" :class="isDark ? 'text-white/50' : 'text-[#00000096]'">
                                {{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button @click="exportCsv"
                                class="flex items-center gap-2 px-3 lg:px-4 py-1.5 border rounded-lg text-[13px] font-medium transition-colors"
                                :class="isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#013e32]/30 text-[#013e32] hover:bg-[#013e32]/5'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4"/></svg>
                                <span class="hidden sm:inline">{{ currentLang === 'ar' ? 'تصدير' : 'Export' }}</span>
                            </button>
                            <button @click="close" class="p-1.5 rounded-lg transition-colors" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-[#013e32]'">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>

                    <!-- ── Table Container (Handles Horizontal Scroll) ── -->
                    <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar">
                        <div class="min-w-[800px] flex flex-col flex-1 h-full">
                            <!-- ── Fixed Table Column Headers ── -->
                            <div class="shrink-0 sticky top-0 z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table class="w-full text-sm table-fixed">
                                    <colgroup>
                                        <col style="width: 25%">
                                        <col v-for="m in monthsList" :key="`h-${m}`" :style="`width: ${75 / monthsList.length}%`">
                                    </colgroup>
                                    <thead>
                                        <tr class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                            <th class="ps-8 py-3.5 text-start font-medium text-[13px]">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                            <th v-for="m in monthsList" :key="m" class="px-6 py-3.5 text-right rtl:text-left font-medium text-[13px]">{{ m }}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <!-- ── Scrollable Body ── -->
                            <div class="overflow-y-auto custom-scrollbar max-h-[280px]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <div v-if="loading" class="flex items-center justify-center py-16">
                                    <div class="w-8 h-8 border-4 border-[#00C9A2] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <div v-else-if="error" class="flex items-center justify-center py-16">
                                    <p class="text-sm font-medium text-red-600">{{ error }}</p>
                                </div>
                                <div v-else-if="!rows.length" class="flex items-center justify-center py-16">
                                    <p class="text-sm font-medium" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ currentLang === 'ar' ? 'لا توجد فواتير لهذه الفترة' : 'No invoices for this period' }}</p>
                                </div>
                                <table v-else class="w-full text-sm table-fixed">
                                    <colgroup>
                                        <col style="width: 25%">
                                        <col v-for="m in monthsList" :key="`b-${m}`" :style="`width: ${75 / monthsList.length}%`">
                                    </colgroup>
                                    <tbody>
                                        <tr v-for="(row, idx) in rows" :key="idx" class="border-b transition-colors" :class="isDark ? 'bg-transparent border-white/5 text-white/80' : 'bg-white border-gray-100 text-gray-700'">
                                            <td class="ps-8 py-3.5 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">{{ row.invoice_no }}</td>
                                            <td v-for="m in monthsList" :key="m" class="px-6 py-3.5 text-right rtl:text-left text-[13px] font-medium">
                                                {{ row.month === m ? fmt(row.amount) : '-' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- ── Fixed Footer ── -->
                            <div v-if="!loading && !error && rows.length" class="shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                                <table class="w-full text-sm table-fixed">
                                    <colgroup>
                                        <col style="width: 25%">
                                        <col v-for="m in monthsList" :key="`f-${m}`" :style="`width: ${75 / monthsList.length}%`">
                                    </colgroup>
                                    <tbody>
                                        <tr class="font-semibold text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                                            <td class="ps-8 py-3.5 font-medium text-[13px]">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                                            <td v-for="m in monthsList" :key="m" class="px-6 py-3.5 text-right rtl:text-left font-medium text-[13px]">{{ fmt(totals[m] ?? 0) }}</td>
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

const props = defineProps({
    open:     Boolean,
    customer: { type: String, default: '' },
    type:     { type: String, default: 'AR' }, // AR | AP
})
const emit = defineEmits(['update:open'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const {
    customerDetail: data,
    customerDetailLoading: loading,
    customerDetailError: error,
    fetchCustomerDetail,
} = useCashFlow()

const close = () => emit('update:open', false)

watch(() => props.open, (isOpen) => {
    if (isOpen && props.customer) {
        fetchCustomerDetail(props.customer, props.type)
    }
})

const monthsList = computed(() => data.value ? Object.keys(data.value) : [])

const rows = computed(() => {
    if (!data.value) return []
    const out = []
    for (const m of monthsList.value) {
        for (const inv of (data.value[m]?.invoices ?? [])) {
            out.push({ invoice_no: inv.invoice_no, description: inv.description, due_date: inv.due_date, amount: inv.amount, month: m })
        }
    }
    return out
})

const totals = computed(() => {
    const t = {}
    for (const m of monthsList.value) t[m] = data.value?.[m]?.total ?? 0
    return t
})

const fmt = (val) => Math.round(val).toLocaleString('en-US')

const exportCsv = () => {
    const header = ['Invoice No.', 'Due Date', ...monthsList.value]
    const lines = [header.join(',')]
    for (const row of rows.value) {
        lines.push([`"${row.invoice_no}"`, `"${row.due_date}"`, ...monthsList.value.map(m => row.month === m ? row.amount : '')].join(','))
    }
    lines.push(['Total', '', ...monthsList.value.map(m => totals.value[m] ?? 0)].join(','))
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${props.customer.replace(/[^\w\- ]/g, '')}-invoices.csv`
    a.click()
    URL.revokeObjectURL(a.href)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
