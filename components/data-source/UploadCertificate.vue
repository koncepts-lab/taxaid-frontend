<template>
    <div class="p-6 space-y-6 bg-gray-50/30 min-h-screen">

        <div class="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-4 flex items-start gap-3">
            <div class="w-5 h-5 rounded-full border border-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-[#B45309] text-xs font-bold">i</span>
            </div>
            <p class="text-sm text-[#B45309] leading-relaxed">
                Upload certificates for VAT returns, Corporate Tax (CT) returns, and other compliance documents. These
                certificates ensure secure authentication for tax filing and regulatory compliance.
            </p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div class="flex items-center gap-3 mb-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    class="text-gray-700">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <h2 class="text-lg font-normal text-gray-900">Upload New Certificate</h2>
            </div>
            <p class="text-base text-[#717182] mb-8">
                Upload certificate files (.pdf, .pem, .pfx, .p12, .cer, .crt) for compliance and authentication
            </p>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <!-- Certificate Type Dropdown -->
                <div class="md:col-span-4 space-y-2">
                    <label class="text-base font-normal text-black ">Certificate Type</label>
                    <div class="relative mt-2" ref="dropdownRef">
                        <!-- Trigger Button (Looks like an input) -->
                        <button type="button" @click="isOpen = !isOpen"
                            class="w-full flex items-center justify-between p-2.5 bg-white border rounded-lg text-sm transition-all outline-none"
                            :class="isOpen ? 'border-[#008169] ring-1 ring-[#008169]' : 'border-gray-200'">
                            <span :class="form.type ? 'text-black' : 'text-gray-400'">
                                {{ form.type || 'Select type' }}
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" class="transition-transform duration-200 text-gray-400"
                                :class="isOpen ? 'rotate-180' : ''">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        <!-- Custom Dropdown Menu -->
                        <transition name="fade-slide">
                            <div v-if="isOpen"
                                class="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2">
                                <div v-for="option in certificateOptions" :key="option.value"
                                    @click="selectOption(option)"
                                    class="px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-colors"
                                    :class="form.type === option.value ? 'bg-[#E6FDF9] text-[#008169] font-medium' : 'text-gray-700 hover:bg-[#E6FDF9] hover:text-[#008169]'">
                                    {{ option.label }}
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Custom Certificate File Input -->
                <div class="md:col-span-4 space-y-2">
                    <label class="text-base font-normal text-black ">Certificate File</label>
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden h-[42px] mt-2">
                        <label
                            class="bg-white px-4 py-2 text-base font-semibold text-gray-900  border-gray-200 cursor-pointer hover:bg-gray-50">
                            Choose File
                            <input type="file" class="hidden" @change="handleFileChange" />
                        </label>
                        <span class="px-4 text-base text-gray-500 truncate">
                            {{ form.fileName || 'No file Chosen' }}
                        </span>
                    </div>
                </div>

                <!-- Upload Button -->
                <div class="md:col-span-4">
                    <button @click="uploadCertificate"
                        class="w-full h-[42px] bg-[#008169] hover:bg-[#006b56] text-white rounded-lg font-normal flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        Upload Certificate
                    </button>
                </div>
            </div>
            <div class="min-h-[1.25rem] mt-1">
                <transition name="fade" mode="out-in">
                    <p v-if="fileError" class="text-xs text-red-500 font-medium" key="error">
                        {{ fileError }}
                    </p>

                </transition>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div class="flex items-center gap-3 mb-1">
                <img data-v-c730e2e1="" src="/images/icons/Upload-Certificate.svg" class="w-5 h-5 transition-all"
                    alt="Upload Certificate">
                <h2 class="text-lg font-normal text-black">Uploaded Certificates</h2>
            </div>
            <p class="text-base text-[#717182] mb-8">Manage your API certificates and authentication keys</p>

            <div class="space-y-4">
                <div v-for="cert in certificates" :key="cert.id"
                    class="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border border-gray-100 rounded-xl hover:border-[#00816940] hover:bg-gray-50/30 transition-all">

                    <div class="flex items-center gap-4 flex-1">
                        <div class=" bg-white  rounded-xl text-[#008169]">
                            <svg width="32" height="32" viewBox="0 0 18 18" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.0565 1.47534H4.41687C4.02555 1.47534 3.65026 1.63079 3.37356 1.9075C3.09686 2.1842 2.94141 2.55949 2.94141 2.95081V14.7545C2.94141 15.1458 3.09686 15.5211 3.37356 15.7978C3.65026 16.0745 4.02555 16.23 4.41687 16.23H13.2697C13.661 16.23 14.0363 16.0745 14.313 15.7978C14.5897 15.5211 14.7451 15.1458 14.7451 14.7545V5.16401L11.0565 1.47534Z"
                                    stroke="currentColor" stroke-width="1.47547" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M7.3739 13.2793C8.18878 13.2793 8.84937 12.6187 8.84937 11.8038C8.84937 10.989 8.18878 10.3284 7.3739 10.3284C6.55903 10.3284 5.89844 10.989 5.89844 11.8038C5.89844 12.6187 6.55903 13.2793 7.3739 13.2793Z"
                                    stroke="currentColor" stroke-width="1.47547" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M11.7925 7.37769L8.47266 10.6975" stroke="currentColor" stroke-width="1.47547"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.0547 8.11523L11.7935 8.85403" stroke="currentColor" stroke-width="1.47547"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>

                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <h4 class="font-normal text-lg text-gray-900">{{ cert.name }}</h4>
                                <span
                                    class="px-2 py-0.5 bg-[#00483A] text-white text-sm font-normal rounded-[9px] uppercase tracking-wider">
                                    {{ cert.tag }}
                                </span>
                            </div>
                            <div class="flex flex-wrap gap-x-6 gap-y-1 text-base text-[#6A7282]">
                                <p>Uploaded: <span class="text-[#6A7282]">{{ cert.uploadDate }}</span></p>
                                <p>Expires: <span class="text-[#6A7282]">{{ cert.expiryDate }}</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-6 mt-4 md:mt-0">
                        <div
                            class="flex items-center gap-1 px-3 py-1 bg-[#DCFCE7] text-[#008236] rounded-lg text-xs font-medium border border-[#B9F8CF]">
                            <img src="/images/icons/active.svg">
                            Active
                        </div>

                        <button class="text-gray-600 hover:text-gray-900 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                        </button>

                        <button @click="deleteCert(cert.id)" class="text-red-500 hover:text-red-700 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
const fileError = ref('');

const form = reactive({
    type: '',
    fileName: '',
    file: null
});
const isOpen = ref(false);
const certificateOptions = [
    { label: 'VAT Return', value: 'VAT Return' },
    { label: 'VAT', value: 'VAT' },
    { label: 'CT (Corporate Tax)', value: 'CT' },
    { label: 'CT Return', value: 'CT Return' },
    { label: 'Other', value: 'Other' }
];

const selectOption = (option) => {
    form.type = option.value;
    isOpen.value = false;
};

const dropdownRef = ref(null);
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};
const certificates = ref([
    {
        id: 1,
        name: 'GST_API_Certificate_2025.pem',
        tag: 'GST',
        uploadDate: '2025-01-15',
        expiryDate: '2026-01-15',
        status: 'Active'
    },
    {
        id: 2,
        name: 'VAT_Integration_Key.pfx',
        tag: 'VAT',
        uploadDate: '2024-11-10',
        expiryDate: '2025-11-10',
        status: 'Active'
    }
]);
onMounted(() => window.addEventListener('click', handleClickOutside));
onUnmounted(() => window.removeEventListener('click', handleClickOutside));
const handleFileChange = (event) => {
    const file = event.target.files[0];
    fileError.value = '';

    if (!file) return;

    const allowedExtensions = ['pdf', 'pem', 'pfx', 'p12', 'cer', 'crt'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (allowedExtensions.includes(extension)) {
        form.fileName = file.name;
        form.file = file;
        fileError.value = '';
    } else {
        form.fileName = '';
        form.file = null;
        fileError.value = `Invalid file type. Only .${allowedExtensions.join(', .')} are allowed.`;

        event.target.value = '';
    }
};

// Add this ref to track the physical input element
const fileInput = ref(null);

const uploadCertificate = () => {
    // 1. Validation
    if (!form.type) {
        fileError.value = 'Please select a certificate type first.';
        return;
    }
    if (!form.file) {
        fileError.value = 'Please choose a valid file to upload.';
        return;
    }

    // 2. Create the New Certificate Object
    const today = new Date();
    const expiry = new Date();
    expiry.setFullYear(today.getFullYear() + 1); // Set expiry to 1 year from now

    const newCert = {
        id: Date.now(), // Unique ID
        name: form.fileName,
        // Map the type to a short tag (e.g., "VAT Return" -> "VAT")
        tag: form.type.includes('VAT') ? 'VAT' : (form.type.includes('CT') ? 'CT' : 'OTHER'),
        uploadDate: today.toISOString().split('T')[0], // Format: YYYY-MM-DD
        expiryDate: expiry.toISOString().split('T')[0],
        status: 'Active'
    };

    // 3. Add to the list (unshift adds it to the top)
    certificates.value.unshift(newCert);

    // 4. Reset Form
    form.type = '';
    form.fileName = '';
    form.file = null;
    fileError.value = '';

    // Clear the actual file input so it says "No file chosen" again
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const deleteCert = (id) => {
    certificates.value = certificates.value.filter(c => c.id !== id);
};
</script>

<style scoped>
select {
    background-image: none;
}
</style>