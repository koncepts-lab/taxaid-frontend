<template>
    <Teleport to="body">
        <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="close">
            <div class="w-full rounded-xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1200px; max-height: 85vh;">
                <!-- Header -->
                <div class="flex justify-between items-center py-5 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                    <div class="flex flex-col">
                        <h2 class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ customer }}</h2>
                        <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بالدرهم الإماراتي' : 'Values in AED' }}</p>
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

                <!-- Body -->
                <div class="flex-1 overflow-auto">
                    <div v-if="loading" class="py-16 text-center text-sm" :class="isDark ? 'text-white/60' : 'text-black/60'">
                        {{ currentLang === 'ar' ? 'جار التحميل...' : 'Loading...' }}
                    </div>
                    <div v-else-if="error" class="py-16 text-center text-sm text-red-500">{{ error }}</div>
                    <div v-else-if="!rows.length" class="py-16 text-center text-sm" :class="isDark ? 'text-white/60' : 'text-black/60'">
                        {{ currentLang === 'ar' ? 'لا توجد فواتير لهذه الفترة' : 'No invoices for this period' }}
                    </div>
                    <table v-else class="w-full text-left rtl:text-right border-collapse">
                        <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
                            <tr>
                                <th class="px-8 py-4 font-medium text-[14px]">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                <th v-for="m in monthsList" :key="m" class="px-6 py-4 font-medium text-right rtl:text-left text-[14px]">{{ m }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in rows" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100 bg-white'">
                                <td class="px-8 py-3.5 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">{{ row.invoice_no }}</td>
                                <td v-for="m in monthsList" :key="m" class="px-6 py-3.5 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-black/80'">
                                    {{ row.month === m ? fmt(row.amount) : '-' }}
                                </td>
                            </tr>
                            <tr :class="isDark ? 'bg-[#1F6F4D] text-white' : 'bg-[#68E4C4] text-black'">
                                <td class="px-8 py-4 font-medium text-[14px]">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                                <td v-for="m in monthsList" :key="m" class="px-6 py-4 text-right rtl:text-left font-medium text-[14px]">{{ fmt(totals[m] ?? 0) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
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

// One row per invoice; each invoice belongs to exactly one month bucket.
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
