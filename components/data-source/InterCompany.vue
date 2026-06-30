<template>
    <!-- Main Container: Logic for RTL and Dark Mode -->
    <div :dir="currentLang === 'ar' ? 'rtl' : 'ltr'"
        class="p-6 space-y-6 rounded-2xl transition-all duration-300 min-h-screen"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30 text-white' : 'bg-white text-black'">

        <!-- 1. Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div :class="currentLang === 'ar' ? 'text-right' : 'text-left'">
                <h2 class="text-lg font-normal mb-2" :class="isDark ? 'text-white' : 'text-black'">
                    {{ currentLang === 'ar' ? currentConfig.titleAr : currentConfig.title }}
                </h2>
                <p class="text-base" :class="isDark ? 'text-white/60' : 'text-[#717182]'">
                    {{ currentLang === 'ar' ? currentConfig.subAr : currentConfig.sub }}
                </p>
            </div>

            <!-- Search Bar -->
            <div class="relative w-full lg:w-96">
                <span class="absolute inset-y-0 flex items-center px-3 text-gray-400"
                    :class="currentLang === 'ar' ? 'right-0' : 'left-0'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </span>
                <input type="text" :placeholder="currentLang === 'ar' ? 'بحث...' : 'Search...'"
                    class="w-full py-2 border rounded-xl text-sm focus:ring-1 outline-none shadow-sm transition-all"
                    :class="[
                        currentLang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left',
                        isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-[#00B794]'
                            : 'bg-[#F3FDFA] border-[#04C18F80] text-black placeholder:text-[#717182] focus:ring-[#00896F]'
                    ]" />
            </div>
        </div>

        <!-- 2. Actions Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 min-h-[44px]">
            <div class="flex items-center gap-4">
                <div v-if="selectedCount > 0" class="flex items-center gap-4 animate-fade-in">
                    <span class="text-sm font-medium">{{ selectedCount }} {{ currentLang === 'ar' ? 'محدد' : 'Selected'
                        }}</span>
                    <button @click="deleteSelected"
                        class="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-500 bg-white rounded-xl text-sm font-medium hover:bg-red-50 transition-all active:scale-95 shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                        </svg>
                        {{ currentLang === 'ar' ? 'حذف' : 'Delete' }}
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button v-if="!isApiType && isImportedLocal"
                    class="px-6 py-2 bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 rounded-xl font-medium transition-all active:scale-95 shadow-sm">
                    {{ currentLang === 'ar' ? 'تطبيق التغييرات' : 'Apply Changes' }}
                </button>

                <button v-if="type === 'inter-company'" @click="isModalOpen = true"
                    class="flex items-center gap-2 px-4 py-2 bg-white border border-[#04C18F80] text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    {{ currentLang === 'ar' ? 'استيراد' : 'Import Excel' }}
                </button>

                <button v-if="type === 'inter-company'"
                    class="flex items-center gap-2 px-4 py-2 bg-white border border-[#04C18F80] text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    {{ currentLang === 'ar' ? 'تصدير' : 'Export' }}
                </button>

                <div class="relative" ref="addDropdownRef">
                    <button @click="isAddDropdownOpen = !isAddDropdownOpen"
                        class="flex items-center gap-2 px-5 py-2 bg-[#008169] text-white rounded-xl text-sm font-medium hover:bg-[#006b56] transition-all">
                        <span>{{ currentLang === 'ar' ? '+ إضافة صف' : '+ Add New Row' }}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" :class="{ 'rotate-180': isAddDropdownOpen }">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <div v-if="isAddDropdownOpen"
                        class="absolute mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-2 space-y-1"
                        :class="currentLang === 'ar' ? 'left-0 text-right' : 'right-0 text-left'">
                        <button v-for="opt in translatedOptions" :key="opt.id" @click="handleAddAction(opt.id)"
                            :disabled="opt.requiresSelection && !lastSelectedRowId"
                            class="w-full flex items-center gap-3 p-3 rounded-xl transition-all group" :class="[
                                opt.requiresSelection && !lastSelectedRowId ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#E6FDF9]'
                            ]">
                            <span v-html="opt.icon" class="text-gray-400 group-hover:text-[#008169]"></span>
                            <div class="text-start">
                                <p class="text-sm font-medium text-black">{{ opt.label }}</p>
                                <p v-if="opt.requiresSelection && !lastSelectedRowId"
                                    class="text-[10px] text-gray-400 italic">
                                    {{ currentLang === 'ar' ? 'حدد صفاً أولاً' : 'Select a row first' }}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. Main Table Card -->
        <div class="rounded-2xl border shadow-sm overflow-x-auto transition-all duration-300"
            :class="isDark ? 'bg-transparent border-white/10' : 'bg-white border-gray-100'">
            <div :style="{ minWidth: currentConfig.minWidth }">
                <!-- Teal Header -->
                <div class="bg-[#00896F] text-white flex items-center px-4 py-4">
                    <div class="w-10 shrink-0">
                        <input type="checkbox" @change="toggleAll" v-model="allSelected" class="header-checkbox" />
                    </div>
                    <!-- Fixed Grid using Inline Style for Design Accuracy -->
                    <div class="flex-1 grid gap-4 text-[13px] font-medium items-center"
                        :style="{ gridTemplateColumns: currentConfig.gridCols }">
                        <div class="text-center">{{ currentLang === 'ar' ? '#' : 'ID' }}</div>
                        <div v-for="h in translatedHeaders" :key="h">{{ h }}</div>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3">
                    <div class="w-8 h-8 border-2 border-[#00896F] border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-sm" :class="isDark ? 'text-white/50' : 'text-[#717182]'">Loading...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="apiError" class="p-12 flex flex-col items-center justify-center gap-3 text-center">
                    <p class="text-sm text-red-500">{{ apiError }}</p>
                    <button @click="loadData" class="px-4 py-2 text-sm border border-[#00896F] text-[#00896F] rounded-xl hover:bg-[#E6FDF9] transition-all">Retry</button>
                </div>

                <!-- State 1: Empty UI -->
                <div v-else-if="!showTable" class="p-24 flex flex-col items-center justify-center text-center space-y-4">
                    <div class="w-24 h-24 bg-[#8DF3DF]/91 rounded-full flex items-center justify-center">
                        <img src="/images/icons/file.svg" class="w-12 h-12" alt="Empty" />
                    </div>
                    <h3 class="text-base font-normal">{{ currentLang === 'ar' ? 'الجدول فارغ - ابدأ باستيراد بياناتك' :
                        'Your table is empty — start by importing your data' }}</h3>
                    <p class="text-xs text-black mx-auto leading-6"
                        :class="isDark ? 'text-white/50' : 'text-[#717182]'">
                        <template v-if="currentLang === 'ar'">
                            انقر فوق استيراد Excel (أعلى اليمين) لتحميل ملف .xlsx أو .csv. سيتم تعيين أعمدتك تلقائياً
                            وملء جميع الصفوف أدناه.
                        </template>
                        <template v-else>
                            Click Import Excel (top right) to upload an .xlsx or .csv file. Your columns will map
                            automatically and populate all the rows below.
                        </template>
                    </p>
                    <button @click="isModalOpen = true"
                        class="flex items-center gap-2 px-8 py-3 bg-[#63DABCEB] text-[#013E32] rounded-xl font-medium hover:scale-95 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        {{ currentLang === 'ar' ? 'استيراد ملف الآن' : 'Import a file Now' }}
                    </button>
                </div>

                <!-- State 2: Populated Table -->
                <div v-else class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-50'">
                    <div v-for="(row, idx) in rows" :key="row.id"
                        class="flex items-center px-4 py-3 transition-colors"
                        :class="row.selected ? (isDark ? 'bg-[#00896F]/10' : 'bg-[#E6FDF9]') : 'hover:bg-gray-50/50'">
                        <div class="w-10 shrink-0">
                            <input type="checkbox" v-model="row.selected" @change="handleRowSelect(row)"
                                class="w-4 h-4 rounded border-2 border-black/50 bg-white cursor-pointer accent-[#008169]" />
                        </div>
                        <div class="flex-1 grid gap-3 items-center"
                            :style="{ gridTemplateColumns: currentConfig.gridCols }">
                            <div class="text-center text-xs text-gray-400 font-medium">{{ idx + 1 }}</div>
                            <div v-for="(h, hIdx) in currentConfig.headers" :key="hIdx">
                                <div v-if="h === 'Status'"
                                    class="px-3 py-1 rounded-full text-[10px] w-fit font-bold uppercase border"
                                    :class="(row.status || 'Active') === 'Active' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-[#FEF9C3] text-[#854D0E] border-[#FDE047]'">
                                    {{ row.status || 'Active' }}
                                </div>
                                <input v-else type="text" placeholder="-"
                                    :value="getFieldValue(row, h)"
                                    @input="row.isNew && setFieldValue(row, h, $event.target.value)"
                                    :readonly="!row.isNew"
                                    class="w-full h-10 border rounded-lg px-3 text-sm outline-none transition-all"
                                    :class="[
                                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-[#F9FAFB] border-[#F3F4F6] text-black focus:border-[#00896F]',
                                        !row.isNew ? 'cursor-default' : ''
                                    ]" />
                            </div>
                        </div>
                        <!-- Save / Cancel for unsaved new rows -->
                        <div v-if="row.isNew" class="flex gap-2 ml-3 shrink-0">
                            <button @click="saveRow(row)" :disabled="row._saving"
                                class="px-3 py-1.5 bg-[#00896F] text-white rounded-lg text-xs font-medium hover:bg-[#006b56] transition-all disabled:opacity-50">
                                {{ row._saving ? '...' : 'Save' }}
                            </button>
                            <button @click="cancelRow(row)"
                                class="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4. Import Modal -->
        <Transition name="fade">
            <div v-if="isModalOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                @click.self="isModalOpen = false">
                <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden">
                    <button @click="isModalOpen = false"
                        class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="p-8 space-y-6">
                        <div class="space-y-1">
                            <h2 class="text-lg font-normal text-gray-900">
                                {{ currentLang === 'ar' ? 'استيراد بيانات الإعدادات' : 'Import Settings Data' }}
                            </h2>
                            <p class="text-base text-[#717182]">
                                {{ currentLang === 'ar' ? 'ارفع ملف إكسل لاستيراد بيانات الإعدادات إلى النظام' :
                                    'Upload Excel file to import settings data into the system' }}
                            </p>
                        </div>

                        <!-- Info Alert -->
                        <div class="bg-[#E1FFF7] border border-[#04C18F80] rounded-2xl p-4 flex items-start gap-2">
                            <div
                                class="w-4 h-4 rounded-full border-2 border-[#0A0A0AA8] flex items-center justify-center shrink-0">
                                <span class="text-[#0A0A0AA8] font-bold text-[10px]">!</span>
                            </div>
                            <p class="text-sm text-[#00000078]">
                                <template v-if="currentLang === 'ar'">
                                    يرجى التأكد من أن ملف إكسل يتبع التنسيق الصحيح. قم بتحميل النموذج أدناه للمراجعة.
                                </template>
                                <template v-else>
                                    Please ensure your Excel file follows the correct format. Download the template
                                    below for reference.
                                </template>
                            </p>
                        </div>

                        <div class="flex justify-center">
                            <button
                                class="flex items-center gap-2 px-6 py-2.5 bg-[#00896F] text-white rounded-[8px] text-sm font-normal hover:bg-[#006b56] transition-all">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                {{ currentLang === 'ar' ? 'تحميل نموذج إكسل' : 'Download Excel Template' }}
                            </button>
                        </div>

                        <div>
                            <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls"
                                @change="(e) => selectedFile = e.target.files[0]" />
                            <div @click="triggerPicker" @dragover.prevent="isDragging = true"
                                @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
                                class="border-2 rounded-[10px] p-12 flex flex-col items-center justify-center transition-all cursor-pointer"
                                :class="[
                                    isDragging ? 'border-[#008169] bg-[#E6FDF9]' : 'border-[#04C18F80] bg-white',
                                    selectedFile ? 'border-solid border-[#008169]' : ''
                                ]">
                                <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-3">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
                                        :stroke="selectedFile ? '#008169' : '#C0FFF3'" stroke-width="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <path d="M14 2v6h6M8 13h8M8 17h8M10 9H8" />
                                    </svg>
                                </div>
                                <div class="text-center">
                                    <template v-if="!selectedFile">
                                        <p class="text-base font-normal text-black">{{ currentLang === 'ar' ?
                                            'قم بإسقاط ملف إكسل هنا' : 'Drop your Excel file here' }}</p>
                                        <p class="text-black">{{ currentLang === 'ar' ? 'أو انقر للتصفح' :
                                            'or click to browse' }}</p>
                                    </template>
                                    <template v-else>
                                        <p class="text-lg font-semibold text-[#008169]">{{ selectedFile.name }}</p>
                                        <p class="text-xs text-gray-500 mt-1">Ready to import ({{ (selectedFile.size /
                                            1024).toFixed(1) }} KB)</p>
                                    </template>
                                    <p class="text-sm text-black/50 mt-2">{{ currentLang === 'ar' ?
                                        'يدعم ملفات .xlsx, .xls(بحد أقصى 10 ميجابايت) ' :
                                        'Supports.xlsx, .xls files(Max 10MB)'
                                    }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end pt-4">
                            <button @click="simulateImport"
                                class="px-10 py-2 bg-[#00896F] text-white rounded-xl active:scale-95 transition-all">
                                {{ currentLang === 'ar' ? 'استيراد' : 'Import' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useContacts } from '~/composables/data-source/useContacts'
import { useInternalEmails } from '~/composables/data-source/useInternalEmails'

const props = defineProps({
    type: { type: String, default: 'inter-company' },
    isDark: Boolean,
    currentLang: { type: String, default: 'en' }
})

// --- 1. COLUMN AND HEADER CONFIGURATION ---
const configs = {
    'inter-company': {
        title: 'Inter Company Transactions', titleAr: 'معاملات الشركات الشقيقة',
        sub: 'Track transactions between related entities', subAr: 'تتبع المعاملات بين الكيانات ذات الصلة',
        headers: ['Date', 'Counterparty', 'Description', 'FX_to_Base', 'Due_From/To', 'Amount_Base', 'Settlement_Date', 'Status', 'Notes'],
        headersAr: ['التاريخ', 'الطرف المقابل', 'الوصف', 'سعر الصرف', 'مستحق من/إلى', 'المبلغ الأساسي', 'تاريخ التسوية', 'الحالة', 'ملاحظات'],
        gridCols: '50px 120px 180px 220px 100px 160px 120px 140px 100px 1fr',
        minWidth: '1600px'
    },
    'vendor': {
        title: 'Vendor Directory', titleAr: 'دليل جهات الاتصال',
        sub: 'Manage all business vendors and their details', subAr: 'إدارة جميع جهات الاتصال التجارية وتفاصيلها',
        headers: ['Contact_ID', 'Name', 'Type', 'Company', 'Email', 'Phone', 'TRN', 'Status'],
        headersAr: ['معرف الاتصال', 'الاسم', 'النوع', 'الشركة', 'البريد', 'الهاتف', 'TRN', 'الحالة'],
        gridCols: '50px 100px 180px 120px 180px 220px 150px 150px 100px',
        minWidth: '1400px'
    },
    'internal-email': {
        title: 'Internal Email Directory', titleAr: 'دليل البريد الداخلي',
        sub: 'Manage employee email addresses', subAr: 'إدارة عناوين البريد الإلكتروني للموظفين والجهات الداخلية',
        headers: ['Employee', 'Department', 'Email', 'Extension', 'Status'],
        headersAr: ['الموظف', 'القسم', 'البريد', 'التحويلة', 'الحالة'],
        gridCols: '50px 1fr 1fr 1fr 1fr 100px',
        minWidth: '900px'
    },
    'customers': {
        title: 'Customer Management', titleAr: 'إدارة العملاء',
        sub: 'Manage customer accounts and credit information', subAr: 'إدارة حسابات العملاء ومعلومات الائتمان',
        headers: ['Tax ID', 'Contact Person', 'Contact Details', 'Outstanding (AED)', 'Credit Limit (AED)', 'Status'],
        headersAr: ['الرقم الضريبي', 'الشخص المسؤول', 'بيانات الاتصال', 'المبالغ المستحقة', 'الحد الائتماني', 'الحالة'],
        gridCols: '50px 180px 200px 250px 180px 180px 100px',
        minWidth: '1200px'
    }
}

// Maps each column header to the API field key for that type
const fieldMap = {
    'vendor': {
        'Contact_ID': 'identity', 'Name': 'name', 'Type': 'type',
        'Company': 'name', 'Email': 'email', 'Phone': 'phone_number', 'TRN': 'tax_id',
    },
    'customers': {
        'Tax ID': 'tax_id', 'Contact Person': 'contact_person',
        'Contact Details': 'email', 'Outstanding (AED)': null, 'Credit Limit (AED)': 'credit_limit',
    },
    'internal-email': {
        'Employee': 'employee_name', 'Department': 'department',
        'Email': 'email', 'Extension': 'phone_number',
    },
}

const getFieldValue = (row, header) => {
    const key = fieldMap[props.type]?.[header]
    if (!key) return ''
    return row[key] ?? ''
}

const setFieldValue = (row, header, value) => {
    const key = fieldMap[props.type]?.[header]
    if (key) row[key] = value
}

// --- 2. API COMPOSABLES ---
const contactsApi = useContacts()
const emailsApi = useInternalEmails()

const isApiType = computed(() => ['vendor', 'contacts', 'customers', 'internal-email'].includes(props.type))

// --- 3. STATE ---
const isImportedLocal = ref(false) // only used for non-API types (inter-company)
const rows = ref([])
const loading = ref(false)
const apiError = ref(null)
const isModalOpen = ref(false)
const allSelected = ref(false)
const isAddDropdownOpen = ref(false)
const lastSelectedRowId = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const addDropdownRef = ref(null)

const showTable = computed(() => {
    if (isApiType.value) return loading.value || rows.value.length > 0
    return isImportedLocal.value
})

// --- 4. COMPUTED ---
const currentConfig = computed(() => configs[props.type] || configs['inter-company'])
const translatedHeaders = computed(() => props.currentLang === 'ar' ? currentConfig.value.headersAr : currentConfig.value.headers)
const selectedCount = computed(() => rows.value.filter(r => r.selected).length)

// --- 5. DATA LOADING ---
const loadData = async () => {
    if (!isApiType.value) return
    loading.value = true
    apiError.value = null
    rows.value = []
    try {
        if (props.type === 'internal-email') {
            await emailsApi.fetchEmails()
            rows.value = emailsApi.emails.value.map(r => ({ ...r, selected: false, isNew: false, _saving: false }))
        } else if (props.type === 'customers') {
            await contactsApi.fetchCustomers()
            rows.value = contactsApi.customers.value.map(r => ({ ...r, selected: false, isNew: false, _saving: false }))
        } else {
            await contactsApi.fetchContacts()
            rows.value = contactsApi.contacts.value.map(r => ({ ...r, selected: false, isNew: false, _saving: false }))
        }
    } catch (e) {
        apiError.value = e?.data?.message ?? 'Failed to load data.'
    } finally {
        loading.value = false
    }
}

watch(() => props.type, () => {
    isImportedLocal.value = false
    allSelected.value = false
    loadData()
})

onMounted(loadData)

// --- 6. ICONS ---
const IconAbove = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.3 7.3L8 4 4.7 7.3M11.3 12L8 8.7 4.7 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const IconBelow = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.7 8.7L8 12l3.3-3.3M4.7 4L8 7.3l3.3-3.3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const IconPlus = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.3V12.7M3.3 8h9.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const translatedOptions = computed(() => [
    { id: 'above', label: props.currentLang === 'ar' ? 'إضافة فوق الصف المحدد' : 'Add Above Selected Row', icon: IconAbove, requiresSelection: true },
    { id: 'below', label: props.currentLang === 'ar' ? 'إضافة تحت الصف المحدد' : 'Add Below Selected Row', icon: IconBelow, requiresSelection: true },
    { id: 'end', label: props.currentLang === 'ar' ? 'إضافة في النهاية' : 'Add at End', icon: IconPlus, requiresSelection: false }
])

// --- 7. METHODS ---
const toggleAll = () => rows.value.forEach(r => r.selected = allSelected.value)
const handleRowSelect = (row) => { if (row.selected) lastSelectedRowId.value = row.id }

const newRowTemplate = () => {
    const base = { id: Date.now(), selected: false, isNew: true, _saving: false }
    if (props.type === 'internal-email') {
        return { ...base, employee_name: '', department: '', email: '', phone_number: '' }
    }
    return { ...base, identity: '', name: '', type: props.type === 'customers' ? 'customer' : 'vendor', tax_id: '', contact_person: '', email: '', phone_number: '', credit_limit: '', status: '' }
}

const handleAddAction = async (actionId) => {
    const newRow = newRowTemplate()

    // Auto-generate identity for contact/customer rows
    if (isApiType.value && props.type !== 'internal-email') {
        try {
            newRow.identity = await contactsApi.generateIdentity(props.type === 'customers' ? 'customer' : 'vendor')
        } catch {}
    }

    const idx = rows.value.findIndex(r => r.id === lastSelectedRowId.value)
    if (actionId === 'end' || idx === -1) rows.value.push(newRow)
    else if (actionId === 'above') rows.value.splice(idx, 0, newRow)
    else if (actionId === 'below') rows.value.splice(idx + 1, 0, newRow)
    isAddDropdownOpen.value = false
}

const saveRow = async (row) => {
    row._saving = true
    try {
        let saved
        if (props.type === 'internal-email') {
            saved = await emailsApi.createEmail({
                employee_name: row.employee_name,
                department: row.department,
                email: row.email,
                phone_number: row.phone_number || undefined,
            })
        } else {
            saved = await contactsApi.createContact({
                type: props.type === 'customers' ? 'customer' : (row.type || 'customer'),
                name: row.name,
                identity: row.identity || undefined,
                tax_id: row.tax_id || undefined,
                contact_person: row.contact_person || undefined,
                email: row.email,
                phone_number: row.phone_number || undefined,
                credit_limit: row.credit_limit ? Number(row.credit_limit) : undefined,
            })
        }
        const idx = rows.value.indexOf(row)
        if (idx !== -1) rows.value.splice(idx, 1, { ...saved, selected: false, isNew: false, _saving: false })
    } catch {
        row._saving = false
    }
}

const cancelRow = (row) => {
    rows.value = rows.value.filter(r => r !== row)
}

const deleteSelected = async () => {
    if (!isApiType.value) {
        rows.value = rows.value.filter(r => !r.selected)
        allSelected.value = false
        return
    }
    const toDelete = rows.value.filter(r => r.selected && !r.isNew)
    rows.value = rows.value.filter(r => !(r.selected && r.isNew))
    for (const row of toDelete) {
        try {
            if (props.type === 'internal-email') await emailsApi.deleteEmail(row.id)
            else await contactsApi.deleteContact(row.id)
            rows.value = rows.value.filter(r => r.id !== row.id)
        } catch {}
    }
    allSelected.value = false
}

const simulateImport = () => {
    isModalOpen.value = false
    if (!isApiType.value) {
        setTimeout(() => {
            rows.value = [1, 2, 3, 4].map(id => ({ id, selected: false, isNew: false, _saving: false }))
            isImportedLocal.value = true
        }, 400)
    }
}

const triggerPicker = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.xlsx, .xls';
    input.onchange = (e) => selectedFile.value = e.target.files[0];
    input.click()
}

const handleDrop = (e) => {
    isDragging.value = false
    selectedFile.value = e.dataTransfer?.files[0] ?? null
}

const handleClickOutside = (e) => {
    if (addDropdownRef.value && !addDropdownRef.value.contains(e.target)) isAddDropdownOpen.value = false
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Custom Transparent Header Checkbox */
.header-checkbox {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-position: center;
    background-repeat: no-repeat;
}

.header-checkbox:checked {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: white;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
}
</style>