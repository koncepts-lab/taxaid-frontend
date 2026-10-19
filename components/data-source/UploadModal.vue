<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar w-full max-w-xl overflow-hidden shadow-2xl transition-all"
                    :class="effectiveDark ? 'bg-[#002e26] border border-white/10 text-white' : 'bg-white text-gray-900'">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 pb-2">
                    <h3 class="text-xl font-semibold" :class="effectiveDark ? 'text-white' : 'text-gray-900'">
                        {{ title ?? (currentLang === 'ar' ? 'إضافة (IC)' : 'Add IC') }}
                    </h3>
                    <button @click="closeModal" class="transition-colors cursor-pointer"
                        :class="effectiveDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6">
                    <Transition name="fade">
                        <div v-if="errorMessage"
                            class="mb-4 p-3 rounded-xl flex items-center gap-3 text-sm font-medium"
                            :class="effectiveDark ? 'bg-red-500/15 border border-red-500/30 text-red-200' : 'bg-red-50 border border-red-200 text-red-600'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{{ errorMessage }}</span>
                        </div>
                    </Transition>
                    <input type="file" ref="fileInput" class="hidden" :accept="accept" @change="handleFileSelect" />

                    <!-- Drop Zone -->
                    <div class="border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer"
                        :class="[
                            effectiveDark
                                ? (isDragging ? 'border-[#008169] bg-[#008169]/20' : (selectedFile ? 'border-solid border-[#04C18F80] bg-white/5' : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#04C18F80]'))
                                : (isDragging ? 'border-[#008169] bg-[#E6FDF9]' : (selectedFile ? 'border-solid border-[#04C18F80] bg-[#E6FDF9]/50' : 'border-[#04C18F80] bg-[#E6FDF9]/30'))
                        ]" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop" @click="triggerPicker">
                        <div class="mb-4" :class="selectedFile ? 'text-[#008169]' : (effectiveDark ? 'text-white/40' : 'text-[#04C18F33]')">
                            <!-- File Icon if selected, Upload Icon if not -->
                            <svg v-if="!selectedFile" width="48" height="48" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.5">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <div class="text-center">
                            <p class="mb-1 font-medium" :class="effectiveDark ? 'text-white' : 'text-gray-600'">
                                <template v-if="!selectedFile">
                                    {{ currentLang === 'ar' ? 'انقر للتحميل أو سحب وإفلات' :
                                        'Click to upload or drag and drop' }}
                                </template>
                                <template v-else>
                                    {{ selectedFile.name }}
                                </template>
                            </p>
                            <p class="text-xs mb-6" :class="effectiveDark ? 'text-white/60' : 'text-gray-400'">
                                <template v-if="!selectedFile">
                                    {{ hint ?? (currentLang === 'ar' ? 'ملفات Excel فقط (.xlsx, .xls)' : 'Excel files only (.xlsx, .xls)') }}
                                </template>
                                <template v-else>
                                    {{ (selectedFile.size / 1024).toFixed(2) }} KB
                                </template>
                            </p>
                        </div>

                        <button type="button"
                            class="px-8 py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
                            :class="effectiveDark ? 'bg-white/10 text-white hover:bg-white/15 border border-white/10' : 'bg-[#B8F2E6] text-[#013E32] hover:bg-[#a2e9da]'">
                            {{ selectedFile
                                ? (currentLang === 'ar' ? 'تغيير الملف' : 'Change File')
                                : (currentLang === 'ar' ? 'اختر ملف' : 'Choose File')
                            }}
                        </button>
                    </div>

                    <!-- Period selector (AR/AP only) -->
                    <div v-if="showPeriodSelector" class="mt-5 pt-5 border-t" :class="effectiveDark ? 'border-white/10' : 'border-gray-200'">
                        <p class="text-sm font-medium mb-2" :class="effectiveDark ? 'text-white/80' : 'text-gray-700'">
                            {{ currentLang === 'ar' ? 'بيانات صحيحة حتى تاريخ' : 'Data verified up to' }}
                        </p>
                        <CommonDateField v-model="periodValue" :dark="effectiveDark" />
                        <p class="text-xs mt-2" :class="effectiveDark ? 'text-white/50' : 'text-gray-400'">
                            {{ currentLang === 'ar'
                                ? 'سيتم استبدال كل بيانات الرفع الحالية بهذا الملف بتاريخ الفترة المحدد'
                                : 'This file will replace all existing upload data, stamped with this period date' }}
                        </p>
                    </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center justify-between gap-3 p-6 pt-2">
                    <slot name="footer-extra" />
                    <div class="flex items-center gap-3 ms-auto">
                    <button @click="closeModal"
                        class="px-8 py-2.5 border rounded-xl font-medium transition-all cursor-pointer"
                        :class="effectiveDark ? 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
                        {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                    </button>
                    <button @click="handleUpload" :disabled="!selectedFile"
                        class="px-10 py-2.5 bg-[#008169] text-white rounded-xl font-medium hover:bg-[#006b56] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        {{ currentLang === 'ar' ? 'رفع' : 'Upload' }}
                    </button>
                    </div>
                </div>
            </div>
        </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    isDark: { type: Boolean, default: undefined },
    currentLang: String,
    title: { type: String, default: null },
    hint: { type: String, default: null },
    // Comma-separated extensions, matching the native <input accept> attribute (e.g. ".xlsx, .xls" or ".exe").
    accept: { type: String, default: '.xlsx, .xls' },
    showPeriodSelector: { type: Boolean, default: false },
})

const { isDark: themeDark } = useTheme()
const effectiveDark = computed(() => props.isDark !== undefined ? props.isDark : themeDark.value)

const emit = defineEmits(['close', 'upload'])

const fileInput = ref(null)
const selectedFile = ref(null)
const errorMessage = ref('')
const isDragging = ref(false)
const periodValue = ref(orgToday())

// 1. Trigger the native file browser
const triggerPicker = () => {
    fileInput.value.click()
}

// 2. Handle file selection via picker
const handleFileSelect = (e) => {
    const file = e.target.files[0]
    validateAndAssignFile(file)
}

// 3. Handle file drop
const handleDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    validateAndAssignFile(file)
}

// 4. Validation against the accept prop's extension list.
const validateAndAssignFile = (file) => {
    if (!file) return

    const allowedExts = props.accept.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    const fileName = file.name.toLowerCase()
    if (allowedExts.some(ext => fileName.endsWith(ext))) {
        selectedFile.value = file
        errorMessage.value = ''
    } else {
        errorMessage.value = props.currentLang === 'ar'
            ? `يرجى اختيار ملف بامتداد ${allowedExts.join(', ')} فقط`
            : `Please select a file with extension: ${allowedExts.join(', ')}`
        selectedFile.value = null
        setTimeout(() => { errorMessage.value = '' }, 5000)

    }
}

const closeModal = () => {
    selectedFile.value = null
    errorMessage.value = ''
    periodValue.value = orgToday()
    emit('close')
}

const handleUpload = () => {
    if (selectedFile.value) {
        if (props.showPeriodSelector) {
            emit('upload', selectedFile.value, { periodValue: periodValue.value })
        } else {
            emit('upload', selectedFile.value)
        }
        closeModal()
    }
}
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
</style>