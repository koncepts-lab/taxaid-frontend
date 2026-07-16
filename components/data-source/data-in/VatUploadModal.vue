<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 pb-2">
                    <h3 class="text-xl font-semibold text-gray-900">
                        {{ currentLang === 'ar' ? 'رفع إقرار ضريبة القيمة المضافة' : 'Upload VAT Return' }}
                    </h3>
                    <button @click="closeModal" class="text-gray-900 hover:text-gray-600 transition-colors">
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
                    <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileSelect" />

                    <!-- Drop Zone -->
                    <div class="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer mb-5"
                        :class="[
                            isDragging ? 'border-[#008169] bg-[#E6FDF9]' : 'border-[#04C18F80] bg-[#E6FDF9]/30',
                            selectedFile ? 'border-solid bg-[#000000]' : ''
                        ]" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop" @click="triggerPicker">
                        <div class="mb-3" :class="selectedFile ? 'text-[#008169]' : 'text-[#04C18F33]'">
                            <svg v-if="!selectedFile" width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.5">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <div class="text-center">
                            <p class="text-gray-600 mb-1 font-medium text-sm">
                                <template v-if="!selectedFile">
                                    {{ currentLang === 'ar' ? 'انقر للتحميل أو سحب وإفلات' :
                                        'Click to upload or drag and drop' }}
                                </template>
                                <template v-else>
                                    {{ selectedFile.name }}
                                </template>
                            </p>
                            <p class="text-xs text-gray-900">
                                <template v-if="!selectedFile">
                                    {{ currentLang === 'ar' ? 'ملفات PDF فقط' : 'PDF files only' }}
                                </template>
                                <template v-else>
                                    {{ (selectedFile.size / 1024).toFixed(2) }} KB
                                </template>
                            </p>
                        </div>
                    </div>

                    <!-- VAT figures -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-medium text-gray-500 mb-1 block">Period From</label>
                            <input v-model="form.period_from" type="date"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008169]" />
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-500 mb-1 block">Period To</label>
                            <input v-model="form.period_to" type="date"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008169]" />
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-500 mb-1 block">Standard Rated Supplies</label>
                            <input v-model.number="form.standard_rated_supplies" type="number" step="0.01"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008169]" />
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-500 mb-1 block">Zero Rated Supplies</label>
                            <input v-model.number="form.zero_rated_supplies" type="number" step="0.01"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008169]" />
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-500 mb-1 block">Exempted Supplies</label>
                            <input v-model.number="form.exempted_supplies" type="number" step="0.01"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008169]" />
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-500 mb-1 block">Standard Rated Expenses</label>
                            <input v-model.number="form.standard_rated_expenses" type="number" step="0.01"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008169]" />
                        </div>
                    </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center justify-end gap-3 p-6 pt-2">
                    <button @click="closeModal"
                        class="px-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all">
                        {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                    </button>
                    <button @click="handleUpload"
                        class="px-10 py-2.5 bg-[#008169] text-white rounded-xl font-medium hover:bg-[#006b56] transition-all shadow-md active:scale-95">
                        {{ currentLang === 'ar' ? 'رفع' : 'Upload' }}
                    </button>
                </div>
            </div>
        </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    currentLang: String
})

const emit = defineEmits(['close', 'upload'])

const fileInput = ref(null)
const selectedFile = ref(null)
const errorMessage = ref('')
const isDragging = ref(false)

const form = reactive({
    period_from: '',
    period_to: '',
    standard_rated_supplies: 0,
    zero_rated_supplies: 0,
    exempted_supplies: 0,
    standard_rated_expenses: 0,
})

// Only the period dates are truly required — the 4 figures default to 0, so a
// missing/blank number input never silently disables the button with no feedback.
const isValid = computed(() =>
    !!form.period_from && !!form.period_to && form.period_from <= form.period_to
)

const triggerPicker = () => {
    fileInput.value.click()
}

const handleFileSelect = (e) => {
    const file = e.target.files[0]
    validateAndAssignFile(file)
}

const handleDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    validateAndAssignFile(file)
}

const validateAndAssignFile = (file) => {
    if (!file) return

    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.pdf')) {
        selectedFile.value = file
        errorMessage.value = ''
    } else {
        errorMessage.value = props.currentLang === 'ar'
            ? 'يرجى اختيار ملف PDF فقط'
            : 'Please select a PDF file only'
        selectedFile.value = null
        setTimeout(() => { errorMessage.value = '' }, 5000)
    }
}

const resetForm = () => {
    selectedFile.value = null
    errorMessage.value = ''
    form.period_from = ''
    form.period_to = ''
    form.standard_rated_supplies = 0
    form.zero_rated_supplies = 0
    form.exempted_supplies = 0
    form.standard_rated_expenses = 0
}

const closeModal = () => {
    resetForm()
    emit('close')
}

const handleUpload = () => {
    if (!isValid.value) {
        errorMessage.value = props.currentLang === 'ar'
            ? 'يرجى تحديد فترة البداية والنهاية'
            : 'Please select both Period From and Period To dates'
        setTimeout(() => { errorMessage.value = '' }, 5000)
        return
    }
    emit('upload', {
        file: selectedFile.value,
        period_from: form.period_from,
        period_to: form.period_to,
        standard_rated_supplies: form.standard_rated_supplies,
        zero_rated_supplies: form.zero_rated_supplies,
        exempted_supplies: form.exempted_supplies,
        standard_rated_expenses: form.standard_rated_expenses,
    })
    resetForm()
    emit('close')
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
