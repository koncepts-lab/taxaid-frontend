<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transition-all">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 pb-2">
                    <h3 class="text-xl font-semibold text-gray-900">
                        {{ currentLang === 'ar' ? 'إضافة (IC)' : 'Add IC' }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6">
                    <Transition name="fade">
                        <div v-if="errorMessage"
                            class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span class="text-sm font-medium">{{ errorMessage }}</span>
                        </div>
                    </Transition>
                    <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileSelect" />

                    <!-- Drop Zone -->
                    <div class="border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer"
                        :class="[
                            isDragging ? 'border-[#008169] bg-[#E6FDF9]' : 'border-[#04C18F80] bg-[#E6FDF9]/30',
                            selectedFile ? 'border-solid bg-[#E6FDF9]/50' : ''
                        ]" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop" @click="triggerPicker">
                        <div class="mb-4" :class="selectedFile ? 'text-[#008169]' : 'text-[#04C18F33]'">
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
                            <p class="text-gray-600 mb-1 font-medium">
                                <template v-if="!selectedFile">
                                    {{ currentLang === 'ar' ? 'انقر للتحميل أو سحب وإفلات' :
                                        'Click to upload or drag and drop' }}
                                </template>
                                <template v-else>
                                    {{ selectedFile.name }}
                                </template>
                            </p>
                            <p class="text-xs text-gray-400 mb-6">
                                <template v-if="!selectedFile">
                                    {{ currentLang === 'ar' ? 'ملفات Excel فقط (.xlsx, .xls)' :
                                        'Excel files only (.xlsx, .xls)' }}
                                </template>
                                <template v-else>
                                    {{ (selectedFile.size / 1024).toFixed(2) }} KB
                                </template>
                            </p>
                        </div>

                        <button type="button"
                            class="px-8 py-2.5 bg-[#B8F2E6] text-[#013E32] rounded-xl font-medium hover:bg-[#a2e9da] transition-colors">
                            {{ selectedFile
                                ? (currentLang === 'ar' ? 'تغيير الملف' : 'Change File')
                                : (currentLang === 'ar' ? 'اختر ملف' : 'Choose File')
                            }}
                        </button>
                    </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center justify-end gap-3 p-6 pt-2">
                    <button @click="closeModal"
                        class="px-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all">
                        {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                    </button>
                    <button @click="handleUpload" :disabled="!selectedFile"
                        class="px-10 py-2.5 bg-[#008169] text-white rounded-xl font-medium hover:bg-[#006b56] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ currentLang === 'ar' ? 'رفع' : 'Upload' }}
                    </button>
                </div>
            </div>
        </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    currentLang: String
})

const emit = defineEmits(['close', 'upload'])

const fileInput = ref(null)
const selectedFile = ref(null)
const errorMessage = ref('')
const isDragging = ref(false)

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

// 4. Validation (Excel only)
const validateAndAssignFile = (file) => {
    if (!file) return

    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        selectedFile.value = file
        errorMessage.value = ''
    } else {
        errorMessage.value = props.currentLang === 'ar'
            ? 'يرجى اختيار ملف Excel فقط (.xlsx, .xls)'
            : 'Please select an Excel file only (.xlsx, .xls)'
        selectedFile.value = null
        setTimeout(() => { errorMessage.value = '' }, 5000)

    }
}

const closeModal = () => {
    selectedFile.value = null
    errorMessage.value = ''
    emit('close')
}

const handleUpload = () => {
    if (selectedFile.value) {
        emit('upload', selectedFile.value)
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