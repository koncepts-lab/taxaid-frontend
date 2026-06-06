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

        <div class="w-full overflow-x-auto no-scrollbar">
            <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px]">
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
                <!-- Opening Balance Row -->
                <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-[#00C9A2]' : 'text-[#000]', 'font-medium text-[14px]']">
                        {{ currentLang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance' }}
                    </td>
                    <td v-for="(value, idx) in openingBalance" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-[#00C9A2]' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Incoming Row (Expandable) -->
                <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', isDark ? 'text-white' : 'text-[#000]', 'font-medium text-[14px]']">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleIncoming">
                            {{ currentLang === 'ar' ? 'الواردة' : 'Incoming' }}
                            <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="[showIncoming ? 'rotate-180' : '']" viewBox="0 0 10 6" fill="currentColor">
                                <path d="M5 6L0 0H10L5 6Z" />
                            </svg>
                        </div>
                    </td>
                    <td v-for="(value, idx) in incoming" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Incoming Details Table (Expandable) -->
                <tr v-if="showIncoming" :class="isDark ? 'bg-[#002B21]/30' : 'bg-transparent'">
                    <td colspan="7" class="p-0">
                        <div class="px-0 py-0 overflow-hidden">
                            <table class="w-full border-collapse">
                                <thead :class="isDark ? 'bg-[#04C18F5E]' : 'bg-[#A1E2D2]'">
                                    <tr>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'اسم العميل' : 'Customer Name' }}</th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'النوع' : 'Type' }}</th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                                        <th class="px-6 py-3 text-center font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الحالة' : 'Status' }}</th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Exp. Date' }}</th>
                                    </tr>
                                </thead>
                                <tbody :class="isDark ? 'bg-[#04C18F33]' : ''">
                                    <tr v-for="(invoice, idx) in incomingInvoices" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-200 bg-[#E8F9F5]'">
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.number }}</td>
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.customer }}</td>
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.type }}</td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.amount }}</td>
                                        <td class="px-6 py-3 text-center">
                                            <span class="px-3 py-1 rounded-full text-[12px] font-medium inline-block" :class="getStatusClass(invoice.status)">{{ invoice.status }}</span>
                                        </td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.expDate }}</td>
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
                            {{ currentLang === 'ar' ? 'الصادرة' : 'Outgoing' }}
                            <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="[showOutgoing ? 'rotate-180' : '']" viewBox="0 0 10 6" fill="currentColor">
                                <path d="M5 6L0 0H10L5 6Z" />
                            </svg>
                        </div>
                    </td>
                    <td v-for="(value, idx) in outgoing" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', isDark ? 'text-white/80' : 'text-[#000]', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Outgoing Details Table (Expandable) -->
                <tr v-if="showOutgoing" :class="isDark ? 'bg-[#002B21]/30' : 'bg-transparent'">
                    <td colspan="7" class="p-0">
                        <div class="px-0 py-0 overflow-hidden">
                            <table class="w-full border-collapse">
                                <thead :class="isDark ? 'bg-[#04C18F5E]' : 'bg-[#A1E2D2]'">
                                    <tr>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'اسم العميل' : 'Customer Name' }}</th>
                                        <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'النوع' : 'Type' }}</th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                                        <th class="px-6 py-3 text-center font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الحالة' : 'Status' }}</th>
                                        <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Exp. Date' }}</th>
                                    </tr>
                                </thead>
                                <tbody :class="isDark ? 'bg-[#04C18F33]' : ''">
                                    <tr v-for="(invoice, idx) in outgoingInvoices" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-200 bg-[#E8F9F5]'">
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.number }}</td>
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.customer }}</td>
                                        <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.type }}</td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.amount }}</td>
                                        <td class="px-6 py-3 text-center">
                                            <span class="px-3 py-1 rounded-full text-[12px] font-medium inline-block" :class="getStatusClass(invoice.status)">{{ invoice.status }}</span>
                                        </td>
                                        <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.expDate }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>

                <!-- Net Movements Row -->
                <tr :class="isDark ? 'bg-[#186554] text-white' : 'bg-[#51FFD980] text-black'" class="transition-all duration-500">
                    <td :class="[isCompressed ? 'px-8 py-4' : 'px-8 py-5', 'font-medium text-[14px]']">
                        {{ currentLang === 'ar' ? 'صافي الحركات' : 'Net Movements' }}
                    </td>
                    <td v-for="(value, idx) in netMovements" :key="idx" :class="[isCompressed ? 'px-4' : 'px-6', 'text-right rtl:text-left font-medium text-[14px]']">
                        {{ value }}
                    </td>
                </tr>

                <!-- Closing Row -->
                <tr :class="isDark ? 'bg-[#1F6F4D] text-white' : 'bg-[#68E4C4] text-black'" class="transition-all duration-500">
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
</div>

    <!-- Modal -->
    <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div class="w-full rounded-xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
                <!-- Modal Header -->
                <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                    <div class="flex flex-col">
                        <h2 class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'ملخص التدفقات النقدية' : 'Cashflow Summary' }}</h2>
                        <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
                    </div>
                    <button @click="isModalOpen = false" class="p-2 rounded-full transition-colors flex-shrink-0" :class="isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'">
                        <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="flex-1 overflow-auto" :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
                    <table class="w-full text-left rtl:text-right border-collapse">
                        <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002118]' : 'bg-[#008A6F]'">
                            <tr>
                                <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التدفقات النقدية' : 'Cashflow' }}</th>
                                <th v-for="month in months" :key="month" class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ month }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Opening Balance -->
                            <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'">
                                <td class="px-8 py-5 font-medium text-[14px]" :class="isDark ? 'text-[#00C9A2]' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance' }}</td>
                                <td v-for="(value, idx) in openingBalance" :key="idx" class="px-6 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-[#00C9A2]' : 'text-[#000]'">{{ value }}</td>
                            </tr>

                            <!-- Incoming Row -->
                            <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'">
                                <td class="px-8 py-5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                    <div class="flex items-center gap-2 cursor-pointer" @click="toggleIncoming">
                                        {{ currentLang === 'ar' ? 'الواردة' : 'Incoming' }}
                                        <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="[showIncoming ? 'rotate-180' : '']" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                                    </div>
                                </td>
                                <td v-for="(value, idx) in incoming" :key="idx" class="px-6 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000]'">{{ value }}</td>
                            </tr>
                            <tr v-if="showIncoming" :class="isDark ? 'bg-[#002B21]/30' : 'bg-transparent'">
                                <td colspan="7" class="p-0">
                                    <table class="w-full border-collapse">
                                        <thead :class="isDark ? 'bg-[#04C18F5E]' : 'bg-[#A1E2D2]'">
                                            <tr>
                                                <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                                <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'اسم العميل' : 'Customer Name' }}</th>
                                                <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'النوع' : 'Type' }}</th>
                                                <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                                                <th class="px-6 py-3 text-center font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الحالة' : 'Status' }}</th>
                                                <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Exp. Date' }}</th>
                                            </tr>
                                        </thead>
                                        <tbody :class="isDark ? 'bg-[#04C18F33]' : ''">
                                            <tr v-for="(invoice, idx) in incomingInvoices" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-200 bg-[#E8F9F5]'">
                                                <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.number }}</td>
                                                <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.customer }}</td>
                                                <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.type }}</td>
                                                <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.amount }}</td>
                                                <td class="px-6 py-3 text-center"><span class="px-3 py-1 rounded-full text-[12px] font-medium inline-block" :class="getStatusClass(invoice.status)">{{ invoice.status }}</span></td>
                                                <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.expDate }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <!-- Outgoing Row -->
                            <tr :class="isDark ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'">
                                <td class="px-8 py-5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#000]'">
                                    <div class="flex items-center gap-2 cursor-pointer" @click="toggleOutgoing">
                                        {{ currentLang === 'ar' ? 'الصادرة' : 'Outgoing' }}
                                        <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="[showOutgoing ? 'rotate-180' : '']" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                                    </div>
                                </td>
                                <td v-for="(value, idx) in outgoing" :key="idx" class="px-6 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000]'">{{ value }}</td>
                            </tr>
                            <tr v-if="showOutgoing" :class="isDark ? 'bg-[#002B21]/30' : 'bg-transparent'">
                                <td colspan="7" class="p-0">
                                    <table class="w-full border-collapse">
                                        <thead :class="isDark ? 'bg-[#04C18F5E]' : 'bg-[#A1E2D2]'">
                                            <tr>
                                                <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.' }}</th>
                                                <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'اسم العميل' : 'Customer Name' }}</th>
                                                <th class="px-6 py-3 text-left rtl:text-right font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'النوع' : 'Type' }}</th>
                                                <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                                                <th class="px-6 py-3 text-center font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الحالة' : 'Status' }}</th>
                                                <th class="px-6 py-3 text-right rtl:text-left font-medium text-[13px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Exp. Date' }}</th>
                                            </tr>
                                        </thead>
                                        <tbody :class="isDark ? 'bg-[#04C18F33]' : ''">
                                            <tr v-for="(invoice, idx) in outgoingInvoices" :key="idx" :class="isDark ? 'border-b border-white/10' : 'border-b border-gray-200 bg-[#E8F9F5]'">
                                                <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.number }}</td>
                                                <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ invoice.customer }}</td>
                                                <td class="px-6 py-3 text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.type }}</td>
                                                <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.amount }}</td>
                                                <td class="px-6 py-3 text-center"><span class="px-3 py-1 rounded-full text-[12px] font-medium inline-block" :class="getStatusClass(invoice.status)">{{ invoice.status }}</span></td>
                                                <td class="px-6 py-3 text-right rtl:text-left text-[13px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#000]/80'">{{ invoice.expDate }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <!-- Net Movements -->
                            <tr :class="isDark ? 'bg-[#186554] text-white' : 'bg-[#51FFD980] text-black'">
                                <td class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'صافي الحركات' : 'Net Movements' }}</td>
                                <td v-for="(value, idx) in netMovements" :key="idx" class="px-6 text-right rtl:text-left font-medium text-[14px]">{{ value }}</td>
                            </tr>

                            <!-- Closing -->
                            <tr :class="isDark ? 'bg-[#1F6F4D] text-white' : 'bg-[#68E4C4] text-black'">
                                <td class="px-8 py-5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإغلاق' : 'Closing' }}</td>
                                <td v-for="(value, idx) in closing" :key="idx" class="px-6 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#000]'">{{ value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isCompressed: Boolean
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)
const showIncoming = ref(true)
const showOutgoing = ref(false)

const { summary } = useCashFlow()

const months          = computed(() => summary.value?.months          ?? [])
const openingBalance  = computed(() => summary.value?.openingBalance  ?? [])
const incoming        = computed(() => summary.value?.incoming        ?? [])
const outgoing        = computed(() => summary.value?.outgoing        ?? [])
const netMovements    = computed(() => summary.value?.netMovements    ?? [])
const closing         = computed(() => summary.value?.closing         ?? [])
const incomingInvoices = computed(() => summary.value?.incomingInvoices ?? [])
const outgoingInvoices = computed(() => summary.value?.outgoingInvoices ?? [])

const toggleIncoming = () => { showIncoming.value = !showIncoming.value }
const toggleOutgoing = () => { showOutgoing.value = !showOutgoing.value }

const getStatusClass = (status) => {
    if (status === 'Confirmed') return 'bg-[#5CE5C1] text-[#002B21]'
    if (status === 'Signed')    return 'bg-[#FFC08A] text-[#000]'
    if (status === 'Pipeline')  return 'bg-[#A7C5FB] text-[#2B54A7]'
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
