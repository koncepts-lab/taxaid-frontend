<template>
    <div class="space-y-6 bg-white  p-6 rounded-xl border transition-all duration-300">
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
            <div v-for="card in dataInItems" :key="card.id"
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
    <DataSourceUploadModal :is-open="isModalOpen" :current-lang="currentLang" @close="isModalOpen = false" />
</template>

<script setup>
import { ref } from 'vue'

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
</script>