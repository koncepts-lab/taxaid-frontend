<template>
    <div class="w-full transition-all duration-500 rounded-3xl overflow-hidden">
        <div class="py-5 lg:px-8 px-4 flex justify-between items-center">
            <div>
                <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص التدفقات النقدية' : 'Cashflow Summary' }}</p>
                <p class="text-[12px] font-normal mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-3">
                <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
                <img
                    :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'"
                    alt="Expand Icon"
                    class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity hidden lg:block"
                    @click="isModalOpen = true"
                />
            </div>
        </div>

        <div class="w-full overflow-x-auto no-scrollbar relative min-h-[400px]">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[2px]">
                <div class="w-10 h-10 border-4 border-[#0BD9A4] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/10 backdrop-blur-[2px]">
                <p class="text-xs font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
            </div>

            <table v-if="!loading && !error" class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px]">
                <thead class="text-white" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
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
                    <template v-for="(catData, catName) in categories" :key="catName">
                        <!-- Main Category Row -->
                        <tr :class="[
                            isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100',
                            catName === 'Closing Balance' ? (isDark ? 'bg-[#1F6F4D] text-white' : 'bg-[#68E4C4] text-black') : '',
                            catName === 'Net Cash Flow' ? (isDark ? 'bg-[#186554] text-white' : 'bg-[#51FFD980] text-black') : ''
                        ]" class="transition-all duration-500">
                            <td :class="[
                                isCompressed ? 'px-8 py-4' : 'px-8 py-5', 
                                isDark && catName !== 'Closing Balance' && catName !== 'Net Cash Flow' ? 'text-white' : 'text-[#000]', 
                                'font-medium text-[14px]'
                            ]">
                                <div class="flex items-center gap-2" :class="catData.customers?.length ? 'cursor-pointer' : ''" @click="catData.customers?.length ? toggleCategory(catName) : null">
                                    {{ catName }}
                                    <svg v-if="catData.customers?.length" class="w-2.5 h-2.5 transition-transform duration-300" :class="[expandedCategories.has(catName) ? 'rotate-180' : '']" viewBox="0 0 10 6" fill="currentColor">
                                        <path d="M5 6L0 0H10L5 6Z" />
                                    </svg>
                                </div>
                            </td>
                            <td v-for="(val, month) in catData.monthly_totals" :key="month" :class="[
                                isCompressed ? 'px-4' : 'px-6', 
                                isDark && catName !== 'Closing Balance' && catName !== 'Net Cash Flow' ? 'text-white/80' : 'text-[#000]', 
                                'text-right rtl:text-left font-medium text-[14px]'
                            ]">
                                {{ formatStandardNumber(val) }}
                            </td>
                        </tr>

                        <!-- Customer Rows (Expanded) -->
                        <template v-if="expandedCategories.has(catName)">
                            <tr v-for="customer in catData.customers" :key="customer.name" 
                                :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#F0FAF8]'"
                                class="border-b border-white/5 cursor-pointer hover:bg-[#0BD9A420] transition-colors"
                                @click="openCustomerDetail(customer.name, catName)"
                            >
                                <td :class="[isCompressed ? 'px-12 py-3' : 'px-12 py-4', 'text-white/60 text-[13px] font-medium']">
                                    {{ customer.name }}
                                </td>
                                <td v-for="(val, month) in customer.values" :key="month" class="px-6 text-right rtl:text-left text-white/50 text-[13px] font-medium">
                                    {{ formatStandardNumber(val) }}
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
</div>

    <!-- Modal -->
    <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div class="w-full rounded-xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
                <!-- Modal Header -->
                <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                    <div class="flex flex-col">
                        <h2 class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                            {{ currentLang === 'ar' ? 'تفاصيل العميل' : 'Customer Projection Detail' }} - {{ selectedCustomer }}
                        </h2>
                    </div>
                    <button @click="isModalOpen = false" class="p-2 rounded-full transition-colors flex-shrink-0" :class="isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'">
                        <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="flex-1 overflow-auto p-8 relative min-h-[300px]" :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
                    <!-- Loading Overlay -->
                    <div v-if="customerLoading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[2px]">
                        <div class="w-10 h-10 border-4 border-[#0BD9A4] border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    <div v-else-if="customerDetail" class="space-y-8">
                        <div v-for="(monthData, monthName) in customerDetail" :key="monthName" class="space-y-4">
                            <h3 class="text-md font-bold" :class="isDark ? 'text-white' : 'text-[#013e32]'">{{ monthName }} (Total: {{ formatStandardNumber(monthData.total) }})</h3>
                            
                            <table v-if="monthData.invoices.length" class="w-full border-collapse">
                                <thead :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'" class="text-white">
                                    <tr>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]">{{ currentLang === 'ar' ? 'الوصف' : 'Description' }}</th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]">{{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]">{{ currentLang === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date' }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(inv, idx) in monthData.invoices" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-100'">
                                        <td class="px-6 py-3 text-[13px]" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ inv.invoice_no }}</td>
                                        <td class="px-6 py-3 text-[13px]" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ inv.description }}</td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ formatStandardNumber(inv.amount) }}</td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ inv.due_date }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-else class="text-sm text-gray-500 italic">{{ currentLang === 'ar' ? 'لا توجد فواتير لهذا الشهر.' : 'No invoices for this month.' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatStandardNumber } from '~/utils/formatters'
import { useCustomerProjection } from '~/composables/useCustomerProjection'

const props = defineProps({
    data: Object,
    isCompressed: Boolean,
    loading: Boolean,
    error: [String, Object]
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)
const expandedCategories = ref(new Set())

const months = computed(() => props.data?.months || [])
const categories = computed(() => props.data?.categories || {})

const toggleCategory = (categoryName) => {
    if (expandedCategories.value.has(categoryName)) {
        expandedCategories.value.delete(categoryName)
    } else {
        expandedCategories.value.add(categoryName)
    }
}

// Customer Detail State
const { fetchCustomerDetail, data: customerDetail, loading: customerLoading } = useCustomerProjection()
const selectedCustomer = ref(null)

const openCustomerDetail = async (customerName, categoryKey) => {
    selectedCustomer.value = customerName
    isModalOpen.value = true
    
    // Determine type (AR, AP, etc.)
    const type = categoryKey.includes('AR') ? 'AR' : categoryKey.includes('AP') ? 'AP' : 'Other'
    
    await fetchCustomerDetail({
        date: '2025-06-30', // Fallback or dynamic
        period: 6,
        customer: customerName,
        type: type
    })
}

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
        return isDark.value ? 'bg-[#5CE5C1] text-[#002B21]' : 'bg-[#5CE5C1] text-[#002B21]'
    } else if (status === 'Signed') {
        return isDark.value ? 'bg-[#FFC08A] text-[#000]' : 'bg-[#FFC08A] text-[#000]'
    } else if (status === 'Pipeline') {
        return isDark.value ? 'bg-[#A7C5FB] text-[#2B54A7]' : 'bg-[#A7C5FB] text-[#2B54A7]'
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
