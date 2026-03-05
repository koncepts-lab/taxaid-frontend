<template>
    <NuxtLayout name="dashboard">

        <UNotifications />

        <div v-if="!isFullScreenChat" class="font-sans flex relative z-10"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
<<<<<<< HEAD
            <div class="flex-1 transition-all duration-500 ease-in-out px-8 pt-8 pb-[17px]" :class="isChatOpen
                ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
                : (currentLang === 'ar' ? 'ml-[170px]' : 'mr-[170px]')">
=======
            <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8"
                :class="isChatOpen
                    ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
                    : (currentLang === 'ar' ? 'lg:ml-[170px] mr-0' : 'lg:mr-[170px] mr-0')">
>>>>>>> 67345f228bea0115be47ffad81dfe7abf2b13a45
                <div class="mx-auto">
                    <FinancialStatementHeader @date-change="handleDateUpdate" @export-excel="handleExportExcel"
                        @export-pdf="handleExportPDF" @refresh="fetchTabData(activeTab)"
                        v-model:selectedPeriod="selectedPeriodLabel" />

                    <!-- Tabs -->
                    <div class="flex gap-3 my-8 overflow-x-auto pb-2 no-scrollbar"
                        :class="currentLang === 'ar' ? 'flex-row-reverse' : ''">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            :class="[activeTab === tab.id
                                ? (isDark ? 'bg-primary-750 text-white shadow-md' : 'bg-primary-750 text-white shadow-md')
                                : (isDark ? 'bg-primary-950/80 text-white/70' : 'bg-white text-gray-600'), currentLang === 'ar' ? 'pr-4' : 'lg:pl-4 px-4']"
                            class="flex items-center gap-2 py-3 rounded-lg border border-primary-650 text-sm font-normal transition-all whitespace-nowrap hover:shadow-lg w-48">
                            <div v-html="tab.icon" class="w-5 h-5 flex items-center justify-center"></div>
                            {{ currentLang === 'ar' ? tab.labelAr : tab.label }}
                        </button>
                    </div>

                    <!-- Table Container -->
                    <div class="rounded-3xl shadow-sm border border-transparent min-h-[500px] mb-10"
                        :class="isDark ? 'bg-[#00141050]' : 'bg-white'">
                        <FinancialStatementSummary :data="activeTabData.rows" :is-compressed="isChatOpen"
                            :filters="filters" :active-tab="activeTab" @ask-akeel="handleInfo"
                            @ratio-change="(val) => { selectedRatioType = val; fetchTabData('ratios'); }"
                            :report-info="reportInfo" />
                    </div>
                </div>
            </div>

            <!-- 3. RIGHT SIDEBAR: Fixed width, does not scroll with content -->
            <aside class="fixed z-[1000] transition-all duration-500 ease-in-out" :class="[
                currentLang === 'ar' ? 'left-0' : 'right-0',

                // 2. Desktop Positioning: Centered vertically on the side
                'lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:mt-5',

                // 3. Mobile Positioning: Pinned to bottom, full width
                isChatOpen
                    ? 'bottom-0 w-full h-[90vh] translate-y-0'
                    : 'bottom-24 w-[80px]',

                // 4. Desktop Widths
                isChatOpen ? 'lg:2xl:w-120 lg:w-100' : 'lg:w-[80px]'
            ]">
                <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
            </aside>
        </div>

        <div v-else class="w-full flex overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <!-- Full Sidebar version -->
            <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
                <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />
            </aside>
            <!-- Main Chat Window -->
            <main class="flex-1">
                <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
            </main>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ParticleBackground from '~/components/common/ParticleBackground.vue'
import * as XLSX from 'xlsx'
import { format } from 'date-fns' // Ensure date-fns is installed
const isFullScreenChat = ref(false)
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const config = useRuntimeConfig()
const isChatOpen = ref(false)
const activeTab = ref('profit-loss')
const isLoading = ref(false)
const selectedRatioType = ref('All Ratios');

// --- 1. INITIAL FILTER STATE ---
const today = new Date()
const startOfYear = new Date(today.getFullYear(), 0, 1)
const toast = useToast()
const reportInfo = ref({ current: '', previous: '' });

const filters = ref({
    "range_option": "Year to Date",
    "custom_from": "12-05-2025",
    "custom_to": null
})

const dashboardData = ref({
    'profit-loss': { rows: [] },
    'balance-sheet': { rows: [] },
    'schedules': { rows: [] },
    'ratios': { rows: [] }
})

const handleInfo = () => {
    isChatOpen.value = true
}

const fetchTabData = async (tabId) => {
    const apiEndpoints = {
        'profit-loss': '/financial-analysis/pl-maingroup-totals',
        'balance-sheet': '/financial-analysis/bs-maingroup-totals',
        'ratios': 'financial-ratios/comparative-report'
    }

    isLoading.value = true
    const isYTD = filters.value.range_option === "Year to Date";

    try {
        const requestBody = {
            "range_option": isYTD ? "Custom Dates" : filters.value.range_option,
            "custom_from": isYTD ? "01-01-2025" : filters.value.custom_from,
            "custom_to": isYTD ? "12-05-2025" : filters.value.custom_to,
        };

        // Add the extra parameter ONLY for ratios
        if (tabId === 'ratios') {
            requestBody.ratio_type = selectedRatioType.value;
            // Note: If your API strictly requires "range_options" (plural) for ratios:
            // requestBody.range_options = filters.value.range_option;
        }

        // Inside index.vue -> fetchTabData
        const response = await $fetch(apiEndpoints[tabId], {
            baseURL: config.public.apiBase,
            method: 'POST',
            body: requestBody
        })

        // 1. Updated Success Check (to handle boolean "success: true")
        if (response.success === true || response.status === 'success') {
            const formatter = new Intl.NumberFormat('en-US');

            // 2. Updated Data Access (Ratio API uses "report")
            const dataToMap = response.report || response.data || [];
            // Helper to format "2025-01-01" to "01 Jan 2025"
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                return new Date(dateStr).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                });
            };

            if (response.info) {
                const cy = response.info.current_range;
                const py = response.info.previous_range;
                reportInfo.value = {
                    current: `${formatDate(cy.from)} – ${formatDate(cy.to)}`,
                    previous: `${formatDate(py.from)} – ${formatDate(py.to)}`
                };
            }
            let detailRowCounter = 0;

            dashboardData.value[tabId].rows = dataToMap.map(item => {
                const isRatioTab = tabId === 'ratios';

                // Formatting logic
                let schedule = item.schedule || '';
                if (!isRatioTab && !item.isSummary && !item.isHeader && !item.isTotal) {
                    detailRowCounter += 1;
                    schedule = String(detailRowCounter).padStart(2, '0');
                }

                // RETURN DATA STRUCTURE
                return {
                    // Label mapping
                    label: isRatioTab ? item.key_metric : item.label,
                    category: item.category || '', // Needed for "All Ratios" column

                    // Numbers (formatted only for non-ratio tabs)
                    current: isRatioTab ? item.current_year : formatter.format(item.current_year || 0),
                    previous: isRatioTab ? item.previous_year : formatter.format(item.previous_year || 0),
                    budget: isRatioTab ? item.budget : formatter.format(item.budget || 0),

                    // Variance: Handles the decimal percent from your JSON
                    variance: (item.variance_percent || 0),

                    // Progress: Strips the "%" from "0%" in your JSON to make it a number
                    progress: isRatioTab ? (parseFloat(item.year_to_go) || 0) : (item.progress || 0),

                    // Flags
                    isHeader: item.isHeader || false,
                    isSummary: item.isSummary || false,
                    isTotal: item.isTotal || false,
                    schedule: isRatioTab ? '-' : schedule
                };
            });
        }
    } catch (err) {
        toast.add({
            title: currentLang.value === 'ar' ? 'خطأ' : 'Error',
            description: currentLang.value === 'ar' ? 'فشل جلب البيانات. تم العودة للوضع الافتراضي.' : 'Failed to fetch data. Resetting to Year to Date.',
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 4000
        })

        filters.value = { ...YTD_DEFAULTS }

    } finally {
        isLoading.value = false
    }
}

// --- 3. HANDLE DATE CHANGE FROM HEADER ---
const handleDateUpdate = (payload) => {
    filters.value = payload;
    // The watcher below will trigger fetchTabData automatically, 
    // but calling it here is fine for immediate feedback.
    fetchTabData(activeTab.value);
}

// Watch both Tab and Filters for changes
watch([activeTab, filters], () => {
    fetchTabData(activeTab.value)
}, { immediate: true, deep: true })

const activeTabData = computed(() => {
    return dashboardData.value[activeTab.value] || { rows: [] }
})
// --- EXCEL LOGIC (Kept as is) ---
const handleExportExcel = () => {
    const exportData = activeTabData.value.rows.map(row => ({
        "Account": row.label,
        "Current": row.current,
        "Previous": row.previous,
        "Variance": row.variance
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, `Report_${activeTab.value}.xlsx`)
}

// --- PDF LOGIC (Kept as is) ---
const handleExportPDF = async () => {
    if (!process.client) return;
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF();
        const body = activeTabData.value.rows.map(row => [
            row.label,
            row.current,
            row.previous,
            row.variance
        ]);
        doc.setFontSize(18);
        doc.text(`${activeTab.value.toUpperCase()} Report`, 14, 15);
        autoTable(doc, {
            head: [['Account', 'Current', 'Previous', 'Variance']],
            body: body,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [13, 148, 136] },
            styles: { fontSize: 9 },
            margin: { top: 25 }
        });
        doc.save(`Report_${activeTab.value}.pdf`);
    } catch (error) {
        console.error("Export Error:", error);
    }
};

const tabs = [
    {
        id: 'profit-loss',
        label: 'Profit & Loss',
        labelAr: 'الأرباح والخسائر',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.24318 9.37483V6.24983C7.24318 6.06316 7.30873 5.90428 7.43984 5.77316C7.5704 5.64205 7.72929 5.5765 7.91651 5.5765C8.10373 5.5765 8.26262 5.64205 8.39318 5.77316C8.52429 5.90428 8.58984 6.06316 8.58984 6.24983V9.37483C8.58984 9.56205 8.52429 9.72094 8.39318 9.8515C8.26207 9.98261 8.10318 10.0482 7.91651 10.0482C7.72984 10.0482 7.57096 9.98261 7.43984 9.8515C7.30873 9.72039 7.24318 9.5615 7.24318 9.37483ZM10.8657 10.4532V2.9165C10.8657 2.72983 10.931 2.57094 11.0615 2.43983C11.1926 2.30872 11.3515 2.24316 11.5382 2.24316C11.7254 2.24316 11.8843 2.30872 12.0148 2.43983C12.146 2.57094 12.2115 2.72983 12.2115 2.9165V10.4532C12.2115 10.6776 12.1426 10.8459 12.0048 10.9582C11.8665 11.0704 11.7118 11.1265 11.5407 11.1265C11.3696 11.1265 11.214 11.0704 11.074 10.9582C10.934 10.8459 10.8646 10.6776 10.8657 10.4532ZM3.58984 12.2382V9.58316C3.58984 9.3965 3.65512 9.23761 3.78568 9.1065C3.91679 8.97539 4.07595 8.90983 4.26318 8.90983C4.4504 8.90983 4.60929 8.97539 4.73984 9.1065C4.8704 9.23761 4.93568 9.3965 4.93568 9.58316V12.239C4.93568 12.4634 4.86679 12.6315 4.72901 12.7432C4.59123 12.8554 4.43651 12.9115 4.26484 12.9115C4.09373 12.9115 3.93818 12.8554 3.79818 12.7432C3.65929 12.6315 3.58984 12.4634 3.58984 12.239M4.49401 17.1248C4.3079 17.1248 4.17929 17.0401 4.10818 16.8707C4.03707 16.7018 4.06929 16.5493 4.20484 16.4132L7.46151 13.1573C7.58207 13.0362 7.73068 12.9687 7.90734 12.9548C8.08401 12.9409 8.24095 12.9946 8.37818 13.1157L10.8657 15.2532L16.4932 9.62483H14.9998C14.8815 9.62483 14.7826 9.58483 14.7032 9.50483C14.6237 9.42483 14.5837 9.32566 14.5832 9.20733C14.5826 9.089 14.6226 8.99011 14.7032 8.91066C14.7837 8.83122 14.8826 8.7915 14.9998 8.7915H17.2432C17.4343 8.7915 17.5943 8.85594 17.7232 8.98483C17.8521 9.11372 17.9165 9.27372 17.9165 9.46483V11.7082C17.9165 11.8265 17.8765 11.9254 17.7965 12.0048C17.7165 12.0843 17.6173 12.1243 17.499 12.1248C17.3807 12.1254 17.2818 12.0854 17.2023 12.0048C17.1229 11.9243 17.0832 11.8254 17.0832 11.7082V10.2148L11.3298 15.9682C11.2093 16.0887 11.0607 16.1559 10.884 16.1698C10.7073 16.1837 10.5504 16.1301 10.4132 16.009L7.92568 13.8715L4.79484 17.0032C4.75929 17.0365 4.71457 17.0651 4.66068 17.089C4.60679 17.1129 4.55123 17.1248 4.49401 17.1248Z" fill="currentColor"/></svg>`
    },
    {
        id: 'balance-sheet',
        label: 'Balance Sheet',
        labelAr: 'الميزانية العمومية',
        icon: `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 0.5H3.83333C2.26167 0.5 1.47667 0.5 0.988333 0.988333C0.5 1.47667 0.5 2.26167 0.5 3.83333V15.5L3 14.6667L5.5 15.5L8 14.6667L10.5 15.5V5.5M13 0.5C12.337 0.5 11.7011 0.763392 11.2322 1.23223C10.7634 1.70107 10.5 2.33696 10.5 3V5.5M13 0.5C13.663 0.5 14.2989 0.763392 14.7678 1.23223C15.2366 1.70107 15.5 2.33696 15.5 3V4.78583C15.5 5.06417 15.5 5.20333 15.4358 5.305C15.4026 5.35787 15.3579 5.40258 15.305 5.43583C15.2033 5.5 15.0642 5.5 14.7858 5.5H10.5" stroke="currentColor"/><path d="M3.83203 3.83398H7.16536M4.66536 7.16732H3.83203M3.83203 10.5007H6.33203" stroke="currentColor" stroke-linecap="round"/></svg>`
    },
    {
        id: 'ratios',
        label: 'Ratios',
        labelAr: 'النسب المالية',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.05 17.7C6.95146 17.7005 6.85382 17.6812 6.76281 17.6435C6.6718 17.6057 6.58925 17.5501 6.52 17.48C6.37955 17.3394 6.30066 17.1488 6.30066 16.95C6.30066 16.7513 6.37955 16.5606 6.52 16.42L16.42 6.52C16.4887 6.44631 16.5715 6.38721 16.6635 6.34622C16.7555 6.30523 16.8548 6.28319 16.9555 6.28141C17.0562 6.27963 17.1562 6.29816 17.2496 6.33588C17.343 6.3736 17.4278 6.42974 17.499 6.50096C17.5703 6.57218 17.6264 6.65702 17.6641 6.7504C17.7018 6.84379 17.7204 6.94382 17.7186 7.04452C17.7168 7.14523 17.6948 7.24454 17.6538 7.33654C17.6128 7.42854 17.5537 7.51134 17.48 7.58L7.58 17.48C7.51076 17.5501 7.42821 17.6057 7.33719 17.6435C7.24618 17.6812 7.14854 17.7005 7.05 17.7ZM8.5 10.75C8.05499 10.75 7.61998 10.618 7.24997 10.3708C6.87996 10.1236 6.59157 9.77217 6.42127 9.36104C6.25097 8.9499 6.20642 8.4975 6.29323 8.06105C6.38005 7.62459 6.59434 7.22368 6.90901 6.90901C7.22368 6.59434 7.62459 6.38005 8.06105 6.29323C8.4975 6.20642 8.9499 6.25097 9.36104 6.42127C9.77217 6.59157 10.1236 6.87996 10.3708 7.24997C10.618 7.61998 10.75 8.05499 10.75 8.5C10.75 8.79548 10.6918 9.08806 10.5787 9.36104C10.4657 9.63402 10.2999 9.88206 10.091 10.091C9.88206 10.2999 9.63402 10.4657 9.36104 10.5787C9.08806 10.6918 8.79548 10.75 8.5 10.75ZM8.5 7.75C8.35167 7.75 8.20666 7.79399 8.08332 7.8764C7.95999 7.95881 7.86386 8.07594 7.80709 8.21299C7.75033 8.35003 7.73547 8.50083 7.76441 8.64632C7.79335 8.7918 7.86478 8.92544 7.96967 9.03033C8.07456 9.13522 8.2082 9.20665 8.35368 9.23559C8.49917 9.26453 8.64997 9.24968 8.78701 9.19291C8.92406 9.13614 9.04119 9.04002 9.1236 8.91668C9.20601 8.79334 9.25 8.64834 9.25 8.5C9.24741 8.30189 9.16756 8.11263 9.02747 7.97253C8.88737 7.83244 8.69811 7.75259 8.5 7.75ZM15.5 17.75C15.055 17.75 14.62 17.618 14.25 17.3708C13.88 17.1236 13.5916 16.7722 13.4213 16.361C13.251 15.9499 13.2064 15.4975 13.2932 15.061C13.3801 14.6246 13.5943 14.2237 13.909 13.909C14.2237 13.5943 14.6246 13.3801 15.061 13.2932C15.4975 13.2064 15.9499 13.251 16.361 13.4213C16.7722 13.5916 17.1236 13.88 17.3708 14.25C17.618 14.62 17.75 15.055 17.75 15.5C17.75 16.0967 17.5129 16.669 17.091 17.091C16.669 17.5129 16.0967 17.75 15.5 17.75ZM15.5 14.75C15.3517 14.75 15.2067 14.794 15.0833 14.8764C14.96 14.9588 14.8639 15.0759 14.8071 15.213C14.7503 15.35 14.7355 15.5008 14.7644 15.6463C14.7934 15.7918 14.8648 15.9254 14.9697 16.0303C15.0746 16.1352 15.2082 16.2066 15.3537 16.2356C15.4992 16.2645 15.65 16.2497 15.787 16.1929C15.9241 16.1361 16.0412 16.04 16.1236 15.9167C16.206 15.7933 16.25 15.6483 16.25 15.5C16.2474 15.3019 16.1676 15.1126 16.0275 14.9725C15.8874 14.8324 15.6981 14.7526 15.5 14.75Z" fill="currentColor"/></svg>`
    }
]
</script>

<style scoped>
/* Ensure SVG inherits text color */
div[v-html] svg {
    color: currentColor;
}

div[v-html] svg path {
    transition: all 0.2s ease;
}
</style>