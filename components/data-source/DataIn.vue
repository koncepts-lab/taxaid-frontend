<template>
    <!-- Existing Documents Upload Grid (budget excluded) -->
    <div class="space-y-6 bg-white p-6 rounded-xl border transition-all duration-300">
        <h2 class="text-lg text-black">{{ userType === 'client' ? 'Uploaded Documents' :
            'Upload Documents' }}</h2>
        <div v-if="userType === 'admin'"
            class="p-4 rounded-xl border flex items-center gap-3 transition-all duration-300"
            :class="isDark ? 'bg-amber-900/20 border-amber-500/30' : 'bg-[#FEFCE8] border-[#FDE68A]'">
            <div class="w-6 h-6 rounded-full border-2 border-[#894B00] flex items-center justify-center shrink-0">
                <span class="text-[#894B00] font-bold text-xs">!</span>
            </div>
            <p class="text-sm" :class="isDark ? 'text-amber-200/80' : 'text-[#894B00]'">
                {{ currentLang === 'ar' ? 'يجب أن تتطابق الرفوعات مع مستند العينة.' :
                    'Uploads must match sample document.' }}
            </p>
        </div>

        <div v-if="loading" class="text-center py-8 text-gray-400">Loading...</div>
        <div v-else-if="error" class="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">{{ error }}</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="card in nonBudgetItems" :key="card.id"
                class="rounded-[20px] p-6 transition-all duration-300 border relative group"
                :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : ' border-[#04C18F80] shadow-sm', card.isUploaded ? 'bg-[#00FFBC]/15' : ' bg-[#00FFBC1F]'">

                <div class="flex justify-between items-start mb-6">
                    <h3 class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                        {{ currentLang === 'ar' ? card.labelAr : card.label }}
                    </h3>
                    <div v-if="card.isUploaded" class="text-[#03D8B0]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>

                <div v-if="card.isUploaded" class="p-4 rounded-xl border mb-6 flex items-start gap-3 transition-colors"
                    :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'">
                    <div class="p-2 rounded-lg bg-[#E6FDF9] dark:bg-[#00B794]/10 text-[#008864]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate" :class="isDark ? 'text-white/90' : 'text-gray-800'">{{
                            getFileNameFromUrl(card.pdfUrl) }}</p>
                        <p class="text-[11px] opacity-60 mt-0.5" :class="isDark ? 'text-white' : 'text-gray-500'">{{
                            card.uploadDate }}</p>
                    </div>
                </div>

                <div v-else class=" flex items-center justify-center mb-6">
                    <p class="text-base font-normal text-[#FF6B50]">
                        {{ currentLang === 'ar' ? 'لم يتم تحميل أي مستند' : 'No document uploaded' }}
                    </p>
                </div>

                <div v-if="userType === 'client'">
                    <button @click="openPdf(card)"
                        class="w-full flex items-center justify-center gap-3 py-3 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
                        :disabled="!card.isUploaded" :class="!card.isUploaded ? 'hidden' : ''">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                    </button>
                </div>

                <div v-else class="space-y-3">
                    <div v-if="card.isUploaded" class="flex gap-3">
                        <button
                            class="flex-1 py-3 bg-[#68E4C44D] text-black rounded-xl text-sm font-medium transition-all cursor-default border-[#04C18F80] border">
                            {{ currentLang === 'ar' ? 'تم تحميل المستند' : 'Document Uploaded' }}
                        </button>
                        <button @click="removeFile(card)"
                            class="px-6 py-3 border bg-[#FEF2F230] border-[#FFA6A6] text-[#FF6B50] hover:bg-[#FF6B50] hover:text-white rounded-xl text-sm font-medium  transition-all active:scale-95">
                            {{ currentLang === 'ar' ? 'حذف' : 'Remove' }}
                        </button>
                    </div>
                    <div v-else class="space-y-3">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            class="hidden"
                            :ref="el => { if (el) fileInputs[card.id] = el }"
                            @change="onFileSelected(card, $event)"
                        />
                        <button @click="handleDownloadSample(card)"
                            class="w-full flex items-center justify-center gap-3 py-3 border border-[#008169]/30 text-[#008169] rounded-xl text-sm font-medium hover:bg-[#00B794]/5 transition-all">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {{ currentLang === 'ar' ? 'تحميل نموذج' : 'Download Sample' }}
                        </button>
                        <button @click="openUploadModal(card)"
                            :disabled="uploadingId === card.id"
                            class="w-full flex items-center justify-center gap-3 py-3 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all active:scale-95 cursor-pointer">
                            <span class="text-lg font-light">{{ uploadingId === card.id ? '…' : '+' }}</span>
                            {{ uploadingId === card.id ? (currentLang === 'ar' ? 'جارٍ الرفع...' : 'Uploading...') : (currentLang === 'ar' ? 'إضافة (IC)' : 'Add (IC)') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Budget Upload Section -->
    <div class="space-y-6 bg-white p-6 rounded-xl border transition-all duration-300">
        <h2 class="text-lg text-black">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</h2>

        <!-- Tab row -->
        <div class="flex flex-wrap gap-2">
            <button v-for="tab in budgetTabs" :key="tab.id" @click="activeBudgetTab = tab.id"
                class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-normal transition-all"
                :class="activeBudgetTab === tab.id
                    ? 'bg-[#008169] text-white shadow-sm'
                    : isDark ? 'border border-white/20 text-white/70 hover:bg-white/5' : 'border border-[#04C18F80] text-[#013E32] hover:bg-[#00B794]/5'">
                <!-- Eye icon for view-only tabs (BS / P&L) -->
                <svg v-if="tab.isViewOnly" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                <!-- Plus icon for upload tabs -->
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {{ currentLang === 'ar' ? tab.labelAr : tab.label }}
            </button>
        </div>

        <!-- Two-column content: upload card (left) + progress (right) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Left: active tab upload / fetch card -->
            <div class="rounded-[20px] p-6 transition-all duration-300 border"
                :class="[isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30' : 'border-[#04C18F80]',
                         budgetStatuses[activeBudgetTab]?.isUploaded ? 'bg-[#00FFBC]/15' : 'bg-[#00FFBC1F]']">

                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                            {{ currentLang === 'ar' ? activeBudgetTabData?.labelAr : activeBudgetTabData?.label }}
                        </h3>
                        <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                            {{ currentLang === 'ar' ? activeBudgetTabData?.descriptionAr : activeBudgetTabData?.description }}
                        </p>
                    </div>
                    <div v-if="budgetStatuses[activeBudgetTab]?.isUploaded" class="text-[#03D8B0] shrink-0 ml-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>

                <!-- Uploaded file info -->
                <div v-if="budgetStatuses[activeBudgetTab]?.isUploaded"
                    class="p-4 rounded-xl border mb-6 flex items-start gap-3"
                    :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'">
                    <div class="p-2 rounded-lg bg-[#E6FDF9] text-primary-750">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate"
                            :class="isDark ? 'text-white/90' : 'text-gray-800'">
                            {{ budgetStatuses[activeBudgetTab]?.fileName ?? 'Fetched from ERP' }}
                        </p>
                        <p class="text-[11px] opacity-60 mt-0.5"
                            :class="isDark ? 'text-white' : 'text-gray-500'">
                            {{ budgetStatuses[activeBudgetTab]?.uploadDate }}
                        </p>
                    </div>
                </div>
                <div v-else-if="!activeBudgetTabData?.isViewOnly" class="flex items-center justify-center mb-6">
                    <p class="text-base font-normal text-[#FF6B50]">
                        {{ currentLang === 'ar' ? 'لم يتم تحميل أي مستند' : 'No document uploaded' }}
                    </p>
                </div>

                <!-- View-only tabs (BS / P&L): View Report + Sync buttons -->
                <div v-if="activeBudgetTabData?.isViewOnly" class="flex gap-3">
                    <button @click="handleViewDetailedReport(activeBudgetTab)"
                        :disabled="budgetViewLoading"
                        class="flex-1 flex items-center justify-center gap-2 py-3 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all active:scale-95">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        {{ budgetViewLoading ? (currentLang === 'ar' ? 'جارٍ التحميل...' : 'Loading...') : (currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report') }}
                    </button>
                    <button @click="handleBudgetFetch(activeBudgetTab)"
                        :disabled="budgetFetchingId === activeBudgetTab"
                        class="flex-1 flex items-center justify-center gap-2 py-3 border border-[#008169]/40 text-[#008169] hover:bg-[#00B794]/5 rounded-xl text-sm font-medium transition-all active:scale-95">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                        </svg>
                        {{ budgetFetchingId === activeBudgetTab
                            ? (currentLang === 'ar' ? 'جارٍ المزامنة...' : 'Syncing...')
                            : (currentLang === 'ar' ? 'مزامنة من الجداول' : 'Synced from Schedules') }}
                    </button>
                </div>

                <!-- Upload tabs: Download Sample + Add (IC) -->
                <div v-else class="space-y-3">
                    <input :key="activeBudgetTab" type="file" accept=".xlsx,.xls" class="hidden"
                        :ref="el => { if (el) budgetFileInputs[activeBudgetTab] = el }"
                        @change="onBudgetFileSelected(activeBudgetTab, $event)" />
                    <button @click="handleBudgetDownloadSample(activeBudgetTab)"
                        class="w-full flex items-center justify-center gap-3 py-3 border border-[#008169]/30 text-[#008169] rounded-xl text-sm font-medium hover:bg-[#00B794]/5 transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {{ currentLang === 'ar' ? 'تحميل نموذج' : 'Download Sample' }}
                    </button>
                    <button @click="openBudgetUploadInput(activeBudgetTab)"
                        :disabled="budgetUploadingId === activeBudgetTab"
                        class="w-full flex items-center justify-center gap-3 py-3 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all active:scale-95 cursor-pointer">
                        <span class="text-lg font-light">{{ budgetUploadingId === activeBudgetTab ? '…' : '+' }}</span>
                        {{ budgetUploadingId === activeBudgetTab
                            ? (currentLang === 'ar' ? 'جارٍ الرفع...' : 'Uploading...')
                            : (currentLang === 'ar' ? 'إضافة (IC)' : 'Add (IC)') }}
                    </button>
                </div>
            </div>

            <!-- Right: Upload Progress -->
            <div class="rounded-[20px] p-6 transition-all duration-300 border"
                :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#04C18F80]'">
                <h3 class="text-base font-medium mb-5" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                    {{ currentLang === 'ar' ? 'تقدم الرفع' : 'Upload Progress' }}
                </h3>
                <div class="space-y-4">
                    <div v-for="tab in budgetTabs" :key="tab.id" class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                            :class="budgetStatuses[tab.id]?.isUploaded
                                ? 'bg-[#008169] border-[#008169]'
                                : isDark ? 'border-white/30' : 'border-gray-300'">
                            <svg v-if="budgetStatuses[tab.id]?.isUploaded" width="10" height="10"
                                viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span class="text-sm" :class="isDark ? 'text-white/70' : 'text-[#0A0A0A]'">
                            {{ currentLang === 'ar' ? tab.labelAr : tab.label }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <DataSourceUploadModal :is-open="isModalOpen" :current-lang="currentLang" @close="isModalOpen = false" />

    <!-- BS / P&L detailed report modal -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="viewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40" @click="viewModalOpen = false" />
                <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
                    <!-- Header -->
                    <div class="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">
                                {{ viewModalType === 'bs' ? (currentLang === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet') : (currentLang === 'ar' ? 'الأرباح والخسائر' : 'Profit & Loss') }}
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ viewModalType === 'bs'
                                    ? (currentLang === 'ar' ? 'ملخص المركز المالي - الأصول والالتزامات وحقوق الملكية' : 'Financial position summary — assets, liabilities and equity as per uploaded data')
                                    : (currentLang === 'ar' ? 'الدخل والمصروفات وصافي الربحية من بيانات الميزانية' : 'Income, expenses and net profitability overview from uploaded budget data') }}
                            </p>
                        </div>
                        <button @click="viewModalOpen = false" class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <!-- Table -->
                    <div class="overflow-y-auto flex-1">
                        <table class="w-full text-sm">
                            <thead class="sticky top-0">
                                <tr class="bg-[#005F50] text-white">
                                    <th class="text-left px-6 py-3 font-medium">{{ currentLang === 'ar' ? 'البيان' : 'Particulars' }}</th>
                                    <th class="text-right px-6 py-3 font-medium">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, idx) in viewModalRows" :key="idx">
                                    <!-- Section header row (is_gap acts as section divider with label) -->
                                    <tr v-if="row.is_section" class="bg-[#CCFFF4]">
                                        <td colspan="2" class="px-6 py-2.5 font-medium text-[#013E32]">{{ row.particulars }}</td>
                                    </tr>
                                    <!-- Normal or summary row -->
                                    <tr v-else :class="row.is_summary ? 'font-semibold text-[#013E32]' : 'text-gray-700 hover:bg-gray-50'">
                                        <td class="px-6 py-3 border-b border-gray-50">{{ row.particulars }}</td>
                                        <td class="px-6 py-3 border-b border-gray-50 text-right tabular-nums">
                                            {{ row.total !== null ? row.total.toLocaleString() : '—' }}
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div v-if="!viewModalRows.length" class="py-12 text-center text-gray-400 text-sm">
                            {{ currentLang === 'ar' ? 'لا توجد بيانات. قم بالمزامنة أولاً.' : 'No data available. Sync from Schedules first.' }}
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    isDark: Boolean,
    currentLang: String,
    dataInItems: Array,
    loading: Boolean,
    error: String,
    uploadFile: Function,
    downloadSample: Function,
    uploadingId: String,
})

const emit = defineEmits(['view', 'remove', 'uploaded'])
const userType = ref('admin')
const isModalOpen = ref(false)
const fileInputs = ref({})

// ── Existing upload card logic ────────────────────────────────────────────────

// Filter out any backend-supplied budget item so it doesn't appear in the main grid
const nonBudgetItems = computed(() =>
    props.dataInItems?.filter(item => item.id !== 'budget') ?? []
)

const openUploadModal = (card) => {
    const input = fileInputs.value[card.id]
    if (input) input.click()
}

const onFileSelected = async (card, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
        await props.uploadFile(card.id, file)
        emit('uploaded', card.id)
    } catch (err) {
        console.error(`Upload failed for ${card.id}:`, err)
    }
    event.target.value = ''
}

const getFileNameFromUrl = (url) => {
    if (!url) return ''
    const parts = url.split('/')
    return parts[parts.length - 1]
}

const openPdf = (card) => {
    if (card.pdfUrl) window.open(card.pdfUrl, '_blank')
}

const removeFile = (card) => {
    emit('remove', card.id)
}

const handleDownloadSample = async (card) => {
    try {
        await props.downloadSample(card.id)
    } catch (err) {
        console.error(`Sample download failed for ${card.id}:`, err)
    }
}

// ── Budget upload section — use useDataIn directly for budget functions ──────────

const {
    budgetStatuses,
    budgetUploadingId,
    budgetFetchingId,
    budgetViewLoading,
    budgetUploadFile,
    budgetFetchGet,
    budgetFetchViewData,
    budgetDownloadSample,
    fetchBudgetStatuses,
} = useDataIn()

onMounted(() => fetchBudgetStatuses())

// View detailed report modal
const viewModalOpen = ref(false)
const viewModalType = ref("bs")
const viewModalRows = ref([])

const handleViewDetailedReport = async (id) => {
    const data = await budgetFetchViewData(id)
    if (!data) return
    const rows = []
    for (const row of data.data) {
        if (row.is_gap) {
            if (row.particulars) rows.push({ particulars: row.particulars, total: null, is_section: true })
            continue
        }
        const months = row.months || []
        const total = months.reduce((sum, v) => sum + (v || 0), 0)
        if (id === "bs" && rows.length === 0) rows.push({ particulars: "Assets", total: null, is_section: true })
        if (id === "bs" && row.particulars === "Shareholder’s Equity") rows.push({ particulars: "Liabilities & Equity", total: null, is_section: true })
        rows.push({ particulars: row.particulars, total: total, is_summary: row.is_summary })
    }
    viewModalRows.value = rows
    viewModalType.value = id
    viewModalOpen.value = true
}

const budgetTabs = [
    { id: 'bs',                    label: 'BS',                     labelAr: 'الميزانية',                   isViewOnly: true,  description: 'View the balance sheet data as per the Schedules imported from your ERP system.',             descriptionAr: 'عرض بيانات الميزانية العمومية وفق الجداول المستوردة من نظام ERP.' },
    { id: 'pl',                    label: 'P&L',                    labelAr: 'الأرباح والخسائر',            isViewOnly: true,  description: 'View the P&L statement generated from Trial Balance.',             descriptionAr: 'عرض قائمة الأرباح والخسائر المستخرجة من ميزان المراجعة.' },
    { id: 'fixed-asset',           label: 'Fixed assets',           labelAr: 'الأصول الثابتة',             isViewOnly: false, description: 'Upload the Fixed assets budget file. Must match the sample document format.',             descriptionAr: 'قم برفع ملف ميزانية الأصول الثابتة. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'current-asset',         label: 'Current assets',         labelAr: 'الأصول المتداولة',           isViewOnly: false, description: 'Upload the Current assets budget file. Must match the sample document format.',           descriptionAr: 'قم برفع ملف ميزانية الأصول المتداولة. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'capital',               label: 'Capital',                labelAr: 'رأس المال',                  isViewOnly: false, description: 'Upload the Capital budget file. Must match the sample document format.',               descriptionAr: 'قم برفع ملف ميزانية رأس المال. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'non-current-liability', label: 'Non Current Liability',  labelAr: 'الالتزامات غير المتداولة', isViewOnly: false, description: 'Upload the Non Current Liability budget file. Must match the sample document format.',   descriptionAr: 'قم برفع ملف ميزانية الالتزامات غير المتداولة. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'current-liability',     label: 'Current Liability',      labelAr: 'الالتزامات المتداولة',      isViewOnly: false, description: 'Upload the Current Liability budget file. Must match the sample document format.',       descriptionAr: 'قم برفع ملف ميزانية الالتزامات المتداولة. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'revenue',               label: 'Revenue',                labelAr: 'الإيرادات',                  isViewOnly: false, description: 'Upload the Revenue budget file. Must match the sample document format.',               descriptionAr: 'قم برفع ملف ميزانية الإيرادات. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'direct-expense',        label: 'Direct Expenses',        labelAr: 'المصروفات المباشرة',         isViewOnly: false, description: 'Upload the Direct Expenses budget file. Must match the sample document format.',        descriptionAr: 'قم برفع ملف ميزانية المصروفات المباشرة. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'general-admin',         label: 'General & Admin',        labelAr: 'العام والإداري',             isViewOnly: false, description: 'Upload the General & Admin budget file. Must match the sample document format.',         descriptionAr: 'قم برفع ملف ميزانية العام والإداري. يجب أن يتطابق مع نموذج المستند.' },
    { id: 'salary',                label: 'Salary',                 labelAr: 'الرواتب',                    isViewOnly: false, description: 'Upload the Salary budget file. Must match the sample document format.',                descriptionAr: 'قم برفع ملف ميزانية الرواتب. يجب أن يتطابق مع نموذج المستند.' },
]

const activeBudgetTab  = ref('fixed-asset')
const budgetFileInputs = ref({})

const activeBudgetTabData = computed(() => budgetTabs.find(t => t.id === activeBudgetTab.value))

const openBudgetUploadInput = (id) => {
    const input = budgetFileInputs.value[id]
    if (input) input.click()
}

const onBudgetFileSelected = async (id, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
        await budgetUploadFile(id, file)
    } catch (err) {
        console.error(`Budget upload failed for ${id}:`, err)
    }
    event.target.value = ''
}

const handleBudgetFetch = async (id) => {
    try {
        await budgetFetchGet(id)
    } catch (err) {
        console.error(`Budget fetch failed for ${id}:`, err)
    }
}

const handleBudgetDownloadSample = async (id) => {
    try {
        await budgetDownloadSample(id)
    } catch (err) {
        console.error(`Budget sample download failed for ${id}:`, err)
    }
}

</script>
