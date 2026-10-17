<template>
    <!-- Inline swap (fullscreen modal only): detail view replaces the table, with a back button -->
    <div v-if="isModal && detailView" class="w-full flex-1 min-h-0 flex flex-col h-full">
        <div class="shrink-0 flex items-center gap-3 px-4 lg:px-8 py-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <button @click="detailView = null" class="p-1.5 rounded-lg transition-colors flex-shrink-0" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-[#013e32]'">
                <svg class="w-5 h-5" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h3 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                {{ detailView === 'incoming' ? (currentLang === 'ar' ? 'الواردة' : 'Incoming') : (currentLang === 'ar' ? 'الصادرة' : 'Outgoing') }}
            </h3>
        </div>
        <CashFlowDetailSections :type="detailView" @open-invoices="openInvoices" />
    </div>

    <div v-else class="w-full" :class="isModal ? 'flex-1 min-h-0 h-full overflow-auto custom-scrollbar rounded-b-xl' : ''">
    <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px] table-fixed">
        <colgroup>
            <col style="width: 28%;" />
            <col v-for="month in months" :key="`col-${month}`" :style="`width: ${72 / months.length}%;`" />
        </colgroup>
        <thead class="text-white z-20 shadow-sm" :class="[isDark ? 'bg-[#002B21]' : 'bg-[#008864]', isModal ? 'sticky top-0' : 'lg:sticky lg:top-[82px]']">
            <tr class="transition-all duration-500">
                <th :class="isCompressed ? 'px-8 py-4' : 'px-8 py-5'" class="font-medium text-[14px]">
                    {{ currentLang === 'ar' ? 'التدفقات النقدية' : 'Cashflow' }}
                </th>
                <th v-for="month in months" :key="month" :class="isCompressed ? 'px-4 py-4' : 'px-6 py-5'" class="font-medium text-right rtl:text-left text-[14px]">
                    <span class="inline-flex items-center gap-1 justify-end">
                        {{ month }}
                        <span v-if="fallbackMonths.includes(month)" class="group relative inline-flex">
                            <svg class="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>
                            <span class="absolute bottom-full mb-2 ltr:right-0 rtl:left-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                <span class="bg-[#013e32] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg block">
                                    {{ currentLang === 'ar' ? 'هذه بيانات العام السابق، حيث لم يتم رفع موازنة لهذا الشهر بعد' : "This is last year's data, as no budget has been uploaded for this month yet" }}
                                </span>
                            </span>
                        </span>
                    </span>
                </th>
            </tr>
        </thead>
        <tbody>
            <!-- Opening Balance -->
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#4d431180] border-b border-white/10' : 'bg-gradient-to-r from-[#EFDF8E] to-[#F7EDBB] border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-[#F5E6A8]' : 'text-black', 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance' }}
                </td>
                <td v-for="(value, idx) in openingBalance" :key="idx" :class="[cellPadX, isDark ? 'text-[#F5E6A8]' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Incoming (opens detail modal) -->
            <tr class="transition-all duration-500 relative z-10" :class="isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    <div class="flex items-center gap-2 cursor-pointer select-none" @click="openDetail('incoming')">
                        {{ currentLang === 'ar' ? 'الواردة' : 'Incoming' }}
                        <button class="focus:outline-none">
                            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''">
                                <path d="M1 1L5.5 5.5L1 10" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </td>
                <td v-for="(value, idx) in incoming" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Outgoing (opens detail modal) -->
            <tr class="transition-all duration-500 relative z-10" :class="isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    <div class="flex items-center gap-2 cursor-pointer select-none" @click="openDetail('outgoing')">
                        {{ currentLang === 'ar' ? 'الصادرة' : 'Outgoing' }}
                        <button class="focus:outline-none">
                            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''">
                                <path d="M1 1L5.5 5.5L1 10" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </td>
                <td v-for="(value, idx) in outgoing" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Net Movements -->
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#186554] text-white' : 'bg-[#51FFD980] text-black'">
                <td :class="[cellPad, 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'صافي الحركات' : 'Net Movements' }}
                </td>
                <td v-for="(value, idx) in netMovements" :key="idx" :class="[cellPadX, 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Adjustment Rows -->
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'التدفق الخارج لشراء الأصول' : 'Outflow for Asset purchase' }}
                </td>
                <td v-for="(value, idx) in assetPurchase" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'التدفق الخارج لسداد القرض' : 'Outflow for Loan repayment' }}
                </td>
                <td v-for="(value, idx) in loanRepayment" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'تدفق/خروج من المساهمين' : 'Inflow/ outflow from shareholders' }}
                </td>
                <td v-for="(value, idx) in shareholders" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'التسويات المدفوعة مقدماً' : 'Prepaid adjustments' }}
                </td>
                <td v-for="(value, idx) in prepaidAdjustments" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Closing -->
            <tr class="transition-all duration-500" :class="[isDark ? 'bg-[#1F6F4D] text-white' : 'bg-[#68E4C4] text-black', isModal ? 'sticky bottom-0 z-10' : '']">
                <td :class="[cellPad, 'font-medium text-[14px] rounded-bl-3xl rtl:rounded-bl-none rtl:rounded-br-3xl']">
                    {{ currentLang === 'ar' ? 'الإغلاق' : 'Closing' }}
                </td>
                <td v-for="(value, idx) in closing" :key="idx" :class="[cellPadX, 'text-right rtl:text-left font-medium text-[14px]', idx === closing.length - 1 ? 'rounded-br-3xl rtl:rounded-br-none rtl:rounded-bl-3xl' : '']">
                    {{ value }}
                </td>
            </tr>
        </tbody>
    </table>
    </div>

    <CashFlowDetailModal v-model:open="detailModalOpen" :type="detailType" @open-invoices="openInvoices" />
    <CashFlowInvoiceModal v-model:open="invoiceModalOpen" :customer="invoiceCustomer" :type="invoiceType" />
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isCompressed: Boolean,
    isModal: {
        type: Boolean,
        default: false
    }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { summary, fallbackMonths } = useCashFlow()

const months          = computed(() => summary.value?.months          ?? [])
const openingBalance  = computed(() => summary.value?.openingBalance  ?? [])
const incoming        = computed(() => summary.value?.incoming        ?? [])
const outgoing        = computed(() => summary.value?.outgoing        ?? [])
const netMovements    = computed(() => summary.value?.netMovements    ?? [])
const assetPurchase   = computed(() => summary.value?.assetPurchase   ?? [])
const loanRepayment   = computed(() => summary.value?.loanRepayment   ?? [])
const shareholders    = computed(() => summary.value?.shareholders    ?? [])
const prepaidAdjustments = computed(() => summary.value?.prepaidAdjustments ?? [])
const closing         = computed(() => summary.value?.closing         ?? [])

// Fullscreen modal (isModal=true): swap table for detail view in place, with a back button.
// Normal card view: pop a standalone overlay modal instead.
const detailView = ref(null)
const detailModalOpen = ref(false)
const detailType = ref('incoming')

const openDetail = (type) => {
    if (props.isModal) {
        detailView.value = type
    } else {
        detailType.value = type
        detailModalOpen.value = true
    }
}

const cellPad  = computed(() => props.isCompressed ? 'px-8 py-4' : 'px-8 py-5')
const cellPadX = computed(() => props.isCompressed ? 'px-4' : 'px-6')

// ⓘ invoice details modal (AR/AP customer rows only)
const invoiceModalOpen = ref(false)
const invoiceCustomer  = ref('')
const invoiceType      = ref('AR')

const openInvoices = (row) => {
    invoiceCustomer.value  = row.name
    invoiceType.value      = row.invoiceType
    invoiceModalOpen.value = true
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
