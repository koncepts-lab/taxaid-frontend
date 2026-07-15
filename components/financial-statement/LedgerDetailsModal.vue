<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div class="w-screen md:max-w-6xl md:max-h-[90vh] max-h-screen rounded-xl shadow-2xl overflow-hidden flex flex-col"
                :class="isDark ? 'bg-[#002e26] border border-white/10' : 'bg-white'">

                <!-- Header -->
                <div
                    class="flex md:flex-row flex-col justify-between md:items-center items-start py-5 md:gap-0 gap-4 md:px-8 px-4 relative z-20">
                    <div class="flex flex-col">
                        <h3 class="md:text-xl text-lg font-semibold"
                            :class="isDark ? 'text-white' : 'text-primary-750'">
                            {{ ledgerName }} - {{ currentLang === 'ar' ? 'دفتر الأستاذ' : 'Ledger' }} ({{ currentLang
                                === 'ar' ? 'العام الحالي' : 'Current Year' }})
                        </h3>
                        <span class="text-xs mt-1" :class="isDark ? 'text-white/50' : 'text-gray-500'">
                            {{ currentLang === 'ar' ? 'القيم بملايين الدراهم الإماراتي' : 'Values in AED Million' }}
                        </span>
                    </div>
                    <div class="flex items-center gap-4">
                        <!-- EXPORT SECTION -->
                        <div class="relative " ref="exportDropdownRef">
                            <button @click="showExportDropdown = !showExportDropdown"
                                class="flex items-center gap-2 px-4 py-1.5 border rounded-lg text-sm font-medium transition-colors md:mr-6 mr-0"
                                :class="isDark ? 'bg-red-900 border-red-500 text-white hover:bg-red-800' : 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>{{ currentLang === 'ar' ? 'تصدير' : 'Export' }}</span>
                            </button>

                            <Transition name="dropdown">
                                <div v-if="showExportDropdown"
                                    class="absolute mt-2 w-52 border rounded-xl shadow-xl z-50 py-2 px-2" :class="[
                                        isDark ? 'bg-primary-900 border-primary-100 shadow-black/50' : 'bg-white border-primary-100',
                                        currentLang === 'ar' ? 'left-0' : 'right-0'
                                    ]">

                                    <button @click="triggerExport('pdf')"
                                        class="w-full px-3 py-2 text-sm rounded-lg flex items-center gap-3 transition-colors"
                                        :class="[
                                            currentLang === 'ar' ? 'flex-row-reverse text-right' : 'text-left',
                                            isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-primary-700'
                                        ]">
                                        <span class="flex-1">{{ currentLang === 'ar' ? 'تصدير بصيغة PDF (.pdf)' :
                                            'Export as PDF (.pdf)' }}</span>
                                    </button>
                                </div>
                            </Transition>
                        </div>

                        <button @click="$emit('close')"
                            class="hover:opacity-70 transition-opacity absolute top-2 right-2">
                            <svg class="w-6 h-6" :class="isDark ? 'text-white' : 'text-black'" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="flex-1 overflow-auto no-scrollbar" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                    <div v-if="loading" class="flex justify-center py-20">
                        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#029F80]"></div>
                    </div>

                    <table v-else-if="data?.report?.length > 0"
                        class="w-full text-sm border-collapse min-w-150 md:min-w-full">
                        <thead class="sticky top-0 z-10 text-white bg-[#029F80]">
                            <tr>
                                <th class="md:ps-8 ps-4 py-3 text-start font-medium w-1/4">{{ currentLang === 'ar' ?
                                    'التاريخ' :
                                    'Date' }}</th>
                                <th class="px-4 py-3 text-start font-medium w-2/4">{{ currentLang === 'ar' ? 'البيان' :
                                    'Particulars' }}</th>
                                <th class="px-4 py-3 text-end font-medium w-1/8">{{ currentLang === 'ar' ? 'مدين' :
                                    'Debit' }}</th>
                                <th class="pe-8 py-3 text-end font-medium w-1/8">{{ currentLang === 'ar' ? 'دائن' :
                                    'Credit' }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in data.report.slice(0, -3)" :key="idx"
                                :class="[row.in_range === 'Yes' ? (isDark ? 'bg-white/5' : 'bg-[#94F0D8]') : '', isDark ? 'text-white/80' : 'text-gray-700']">
                                <td class="md:ps-8 ps-4 py-3.5">{{ row.date }}</td>
                                <td class="px-4 py-3.5">{{ row.particulars }}</td>
                                <td class="px-4 py-3.5 text-end">{{ formatNumber(row.debit) }}</td>
                                <td class="pe-8 py-3.5 text-end">{{ formatNumber(row.credit) }}</td>
                            </tr>

                            <!-- Total Row -->
                            <tr class="bg-[#64E9D1] font-semibold ">
                                <td colspan="2" class="md:ps-8 ps-4 py-3 text-start">{{ currentLang === 'ar' ?
                                    'الإجمالي' :
                                    'Total' }}</td>
                                <td class="px-4 py-3 text-end">{{ formatNumber(data.report[data.report.length -
                                    3].debit) }}</td>
                                <td class="pe-8 py-3 text-end">{{ formatNumber(data.report[data.report.length -
                                    3].credit) }}</td>
                            </tr>

                            <!-- Closing Balance Row -->
                            <tr class="bg-[#029F80] text-white font-semibold">
                                <td colspan="2" class="md:ps-8 ps-4 py-4 text-start">{{ currentLang === 'ar' ?
                                    'رصي الإغلاق' :
                                    'Closing balance' }}</td>
                                <td class="px-4 py-4 text-end">{{ formatNumber(data.report[data.report.length -
                                    2].debit) }}</td>
                                <td class="pe-8 py-4 text-end">{{ formatNumber(data.report[data.report.length -
                                    2].credit) }}</td>
                            </tr>

                            <!-- Final Total Row -->
                            <tr class="bg-[#1EBBA3] font-semibold text-white">
                                <td colspan="2" class="md:ps-8 ps-4 py-3"></td>
                                <td class="px-4 py-3 text-end">{{ formatNumber(data.report[data.report.length -
                                    1].debit) }}</td>
                                <td class="pe-8 py-3 text-end">{{ formatNumber(data.report[data.report.length -
                                    1].credit) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-else class="flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg class="w-12 h-12 opacity-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                stroke-width="1.5" />
                        </svg>
                        <p>{{ currentLang === 'ar' ? 'لا توجد بيانات لهذه الفترة' : 'No data found for this period' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { jsPDF } from 'jspdf'; // 1. Use curly braces for destructuring
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';


const props = defineProps({
    isOpen: Boolean,
    loading: Boolean,
    ledgerName: String,
    data: Object,
    isDark: Boolean,
    currentLang: { type: String, default: 'en' }
});

const emit = defineEmits(['close']);

const showExportDropdown = ref(false);
const exportDropdownRef = ref(null);

// Close dropdown on click outside
const handleClickOutside = (event) => {
    if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target)) {
        showExportDropdown.value = false;
    }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

const formatNumber = (val) => {
    if (val === "" || val === null || val === undefined) return '-';
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const triggerExport = (type) => {
    if (!props.data?.report) return;

    if (type === 'pdf') {
        exportToPDF();
    }
    showExportDropdown.value = false;
};

const exportToPDF = () => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    }); const isAr = props.currentLang === 'ar';

    doc.setFontSize(18);
    doc.text(`${props.ledgerName} - Ledger Report`, 14, 22);
    const tableData = props.data.report.map(row => [
        row.date || '',
        row.particulars || '',
        formatNumber(row.debit),
        formatNumber(row.credit)
    ]);
    autoTable(doc, {
        startY: 35,
        head: [['Date', 'Particulars', 'Debit', 'Credit']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [2, 159, 128], // Your #029F80 color
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        columnStyles: {
            2: { halign: 'right' }, // Debit column
            3: { halign: 'right' }, // Credit column
        }
    });

    doc.save(`${props.ledgerName}_Ledger.pdf`);
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>