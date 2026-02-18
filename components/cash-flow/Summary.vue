<template>
    <div class="w-full overflow-x-auto no-scrollbar transition-all duration-500 rounded-b-3xl">
        <div class="py-5 px-8 flex justify-between items-center">
            <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص التدفقات النقدية' : 'Cashflow Summary' }}</p>
            <div class="flex gap-4 items-center">
                <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
                <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
            </div>
        </div> 
        <table class="w-full text-left rtl:text-right border-collapse">
            <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
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
                <!-- Opening Balance Row -->
                <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium text-[14px]']">
                        {{ currentLang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance' }}
                    </td>
                    <td v-for="(value, idx) in openingBalance" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Incoming Row (Expandable) -->
                <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium text-[14px]']">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleIncoming">
                            <svg class="w-4 h-4 transition-transform duration-300" :class="[showIncoming ? 'rotate-180' : '', isDark ? 'text-white' : 'text-[#000]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            {{ currentLang === 'ar' ? 'الواردة' : 'Incoming' }}
                        </div>
                    </td>
                    <td v-for="(value, idx) in incoming" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Incoming Details Table (Expandable) -->
                <tr v-if="showIncoming" :class="isDark ? 'bg-[#002B21]/30' : 'bg-[#E6F9F5]'">
                    <td colspan="7" class="p-0">
                        <div class="px-8 py-4">
                            <table class="w-full border-collapse">
                                <thead :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'">
                                    <tr>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}
                                        </th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ currentLang === 'ar' ? 'اسم العميل' : 'Customer Name' }}
                                        </th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ currentLang === 'ar' ? 'النوع' : 'Type' }}
                                        </th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}
                                        </th>
                                        <th class="px-6 py-3 text-center font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ currentLang === 'ar' ? 'الحالة' : 'Status' }}
                                        </th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Exp. Date' }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(invoice, idx) in invoices" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100'">
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ invoice.number }}
                                        </td>
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">
                                            {{ invoice.customer }}
                                        </td>
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">
                                            {{ invoice.type }}
                                        </td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">
                                            {{ invoice.amount }}
                                        </td>
                                        <td class="px-6 py-3 text-center">
                                            <span class="px-3 py-1 rounded-full text-[12px] font-medium inline-block" :class="getStatusClass(invoice.status)">
                                                {{ invoice.status }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">
                                            {{ invoice.expDate }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>

                <!-- Outgoing Row (Expandable) -->
                <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium text-[14px]']">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleOutgoing">
                            <svg class="w-4 h-4 transition-transform duration-300" :class="[showOutgoing ? 'rotate-180' : '', isDark ? 'text-white' : 'text-[#000]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            {{ currentLang === 'ar' ? 'الصادرة' : 'Outgoing' }}
                        </div>
                    </td>
                    <td v-for="(value, idx) in outgoing" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Net Movements Row -->
                <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium text-[14px]']">
                        {{ currentLang === 'ar' ? 'صافي الحركات' : 'Net Movements' }}
                    </td>
                    <td v-for="(value, idx) in netMovements" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Closing Row (Summary) -->
                <tr :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium text-[14px]']">
                        {{ currentLang === 'ar' ? 'الإغلاق' : 'Closing' }}
                    </td>
                    <td v-for="(value, idx) in closing" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isCompressed: Boolean
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const showIncoming = ref(true)
const showOutgoing = ref(false)

const months = ['Sept 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26']
const openingBalance = ['1,800,000', '2,100,000', '2,400,000', '2,800,000', '3,000,000', '2,700,000']
const incoming = ['1,800,000', '2,100,000', '2,400,000', '2,800,000', '3,000,000', '2,700,000']
const outgoing = ['1,800,000', '2,100,000', '2,400,000', '2,800,000', '3,000,000', '2,700,000']
const netMovements = ['1,800,000', '2,100,000', '2,400,000', '2,800,000', '3,000,000', '2,700,000']
const closing = ['2,100,000', '2,400,000', '2,800,000', '3,300,000', '2,700,000', '3,100,000']

const invoices = [
    { number: 'INV-1015', customer: 'Emirates Trading LLC', type: 'Invoice', amount: '12,000', status: 'Confirmed', expDate: 'Oct 5, 2025' },
    { number: 'INV-1016', customer: 'BlueSky Interiors', type: 'Contract Signed', amount: '12,000', status: 'Signed', expDate: 'Oct 10, 2025' },
    { number: 'FUT-2031', customer: 'Gulf Star Services', type: 'Future Contract', amount: '10,000', status: 'Pipeline', expDate: 'Oct 22, 2025' }
]

const toggleIncoming = () => {
    showIncoming.value = !showIncoming.value
}

const toggleOutgoing = () => {
    showOutgoing.value = !showOutgoing.value
}

const getStatusClass = (status) => {
    if (status === 'Confirmed') {
        return isDark.value ? 'bg-[#00D9A4] text-[#002B21]' : 'bg-[#00D9A4] text-[#002B21]'
    } else if (status === 'Signed') {
        return isDark.value ? 'bg-[#FFB74D] text-[#000]' : 'bg-[#FFB74D] text-[#000]'
    } else if (status === 'Pipeline') {
        return isDark.value ? 'bg-[#7B9FFF] text-white' : 'bg-[#7B9FFF] text-white'
    }
    return ''
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
