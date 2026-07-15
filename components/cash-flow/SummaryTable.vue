<template>
    <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px] table-fixed">
        <colgroup>
            <col style="width: 28%;" />
            <col v-for="month in months" :key="`col-${month}`" :style="`width: ${72 / months.length}%;`" />
        </colgroup>
        <thead class="text-white sticky top-0 z-20" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
            <tr class="transition-all duration-500">
                <th :class="isCompressed ? 'px-8 py-4' : 'px-8 py-5'" class="font-medium text-[14px]">
                    {{ currentLang === 'ar' ? 'التدفقات النقدية' : 'Cashflow' }}
                </th>
                <th v-for="month in months" :key="month" :class="isCompressed ? 'px-4 py-4' : 'px-6 py-5'" class="font-medium text-right rtl:text-left text-[14px]">
                    {{ month }}
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

            <!-- Incoming (expandable) -->
            <tr class="transition-all duration-500 relative z-10" :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    <div class="flex items-center gap-2 cursor-pointer select-none" @click="toggleRow('incoming', $event)">
                        {{ currentLang === 'ar' ? 'الواردة' : 'Incoming' }}
                        <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="expandedRow === 'incoming' ? 'rotate-180' : ''" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                    </div>
                </td>
                <td v-for="(value, idx) in incoming" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Incoming Child Rows -->
            <tr v-if="expandedRow === 'incoming'">
                <td :colspan="months.length + 1" class="p-0 border-none">
                    <div class="max-h-[320px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <table class="w-full text-left rtl:text-right border-collapse table-fixed">
                            <colgroup>
                                <col style="width: 28%;" />
                                <col v-for="month in months" :key="`subcol-${month}`" :style="`width: ${72 / months.length}%;`" />
                            </colgroup>
                            <tbody>
                                <template v-for="section in (sections?.incoming ?? [])" :key="section.key">
                                    <tr :class="isDark ? 'bg-[#04C18F5E]' : 'bg-[#A1E2D2]'">
                                        <td :colspan="months.length + 1" class="px-8 py-3 font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-black'">
                                            {{ currentLang === 'ar' ? section.title.ar : section.title.en }}
                                        </td>
                                    </tr>
                                    <tr v-for="row in section.rows" :key="section.key + row.name"
                                        :class="isDark ? 'bg-[#04C18F1A] border-b border-white/5' : 'bg-[#E8F9F5] border-b border-[#b2edd4]'">
                                        <td class="px-8 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                            <div class="flex items-center gap-2 group relative inline-block">
                                                <span>{{ row.name }}</span>
                                                <template v-if="row.invoiceType">
                                                    <!-- Tooltip -->
                                                    <div class="absolute top-1/2 -translate-y-1/2 ltr:left-full rtl:right-full ltr:ml-2 rtl:mr-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                                        <div class="bg-[#013e32] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
                                                            {{ currentLang === 'ar' ? 'عرض تفاصيل الفواتير' : 'View Invoice Details' }}
                                                        </div>
                                                        <!-- Sharp Arrow -->
                                                        <div class="absolute top-1/2 -translate-y-1/2 ltr:-left-1 rtl:-right-1 w-2 h-2 bg-[#013e32] rotate-45"></div>
                                                    </div>
                                                    <button @click="openInvoices(row)" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity outline-none">
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
                </td>
            </tr>

            <!-- Outgoing (expandable) -->
            <tr class="transition-all duration-500 relative z-10" :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'">
                <td :class="[cellPad, isDark ? 'text-white' : 'text-black', 'font-medium text-[14px]']">
                    <div class="flex items-center gap-2 cursor-pointer select-none" @click="toggleRow('outgoing', $event)">
                        {{ currentLang === 'ar' ? 'الصادرة' : 'Outgoing' }}
                        <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="expandedRow === 'outgoing' ? 'rotate-180' : ''" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                    </div>
                </td>
                <td v-for="(value, idx) in outgoing" :key="idx" :class="[cellPadX, isDark ? 'text-white/80' : 'text-black', 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>

            <!-- Outgoing Child Rows -->
            <tr v-if="expandedRow === 'outgoing'">
                <td :colspan="months.length + 1" class="p-0 border-none">
                    <div class="max-h-[320px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <table class="w-full text-left rtl:text-right border-collapse table-fixed">
                            <colgroup>
                                <col style="width: 28%;" />
                                <col v-for="month in months" :key="`subcol-${month}`" :style="`width: ${72 / months.length}%;`" />
                            </colgroup>
                            <tbody>
                                <template v-for="section in (sections?.outgoing ?? [])" :key="section.key">
                                    <tr :class="isDark ? 'bg-[#04C18F5E]' : 'bg-[#A1E2D2]'">
                                        <td :colspan="months.length + 1" class="px-8 py-3 font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-black'">
                                            {{ currentLang === 'ar' ? section.title.ar : section.title.en }}
                                        </td>
                                    </tr>
                                    <tr v-for="row in section.rows" :key="section.key + row.name"
                                        :class="isDark ? 'bg-[#04C18F1A] border-b border-white/5' : 'bg-[#E8F9F5] border-b border-[#b2edd4]'">
                                        <td class="px-8 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                            <div class="flex items-center gap-2 group relative inline-block">
                                                <span>{{ row.name }}</span>
                                                <template v-if="row.invoiceType">
                                                    <!-- Tooltip -->
                                                    <div class="absolute top-1/2 -translate-y-1/2 ltr:left-full rtl:right-full ltr:ml-2 rtl:mr-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                                        <div class="bg-[#013e32] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
                                                            {{ currentLang === 'ar' ? 'عرض تفاصيل الفواتير' : 'View Invoice Details' }}
                                                        </div>
                                                        <!-- Sharp Arrow -->
                                                        <div class="absolute top-1/2 -translate-y-1/2 ltr:-left-1 rtl:-right-1 w-2 h-2 bg-[#013e32] rotate-45"></div>
                                                    </div>
                                                    <button @click="openInvoices(row)" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity outline-none">
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

            <!-- Closing -->
            <tr class="transition-all duration-500" :class="isDark ? 'bg-[#1F6F4D] text-white' : 'bg-[#68E4C4] text-black'">
                <td :class="[cellPad, 'font-medium text-[14px]']">
                    {{ currentLang === 'ar' ? 'الإغلاق' : 'Closing' }}
                </td>
                <td v-for="(value, idx) in closing" :key="idx" :class="[cellPadX, 'text-right rtl:text-left font-medium text-[14px]']">
                    {{ value }}
                </td>
            </tr>
        </tbody>
    </table>

    <CashFlowInvoiceModal v-model:open="invoiceModalOpen" :customer="invoiceCustomer" :type="invoiceType" />
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
    isCompressed: Boolean
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { summary, sections } = useCashFlow()

const months          = computed(() => summary.value?.months          ?? [])
const openingBalance  = computed(() => summary.value?.openingBalance  ?? [])
const incoming        = computed(() => summary.value?.incoming        ?? [])
const outgoing        = computed(() => summary.value?.outgoing        ?? [])
const netMovements    = computed(() => summary.value?.netMovements    ?? [])
const closing         = computed(() => summary.value?.closing         ?? [])

const expandedRow = ref(null)

const toggleRow = async (type, event) => {
    const target = event?.currentTarget?.closest('tr')
    const scrollContainer = document.querySelector('main') || window
    const originalTop = target ? target.getBoundingClientRect().top : 0

    if (expandedRow.value === type) {
        expandedRow.value = null
    } else {
        expandedRow.value = type
    }

    if (target && scrollContainer && scrollContainer.scrollBy) {
        await nextTick()
        const newTop = target.getBoundingClientRect().top
        const diff = newTop - originalTop
        if (Math.abs(diff) > 1) {
            scrollContainer.scrollBy({ top: diff, behavior: 'instant' })
        }
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
