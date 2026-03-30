<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

                <div class="w-full max-w-xl transition-all duration-300 shadow-2xl rounded-xl p-6"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <h2 class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                                {{ currentLang === 'ar' ? 'إضافة عملة جديدة' : 'Add New Currency' }}
                            </h2>
                            <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-black/70'">
                                {{ currentLang === 'ar' ? 'أدخل تفاصيل العملة وسعر التحويل للعملة الأساسية (AED)' :
                                    'Enter currency details and conversion rate to base currency (AED)' }}
                            </p>
                        </div>
                        <button @click="handleClose"
                            class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div class="relative">
                            <label class="block text-sm font-normal mb-1  tracking-wide"
                                :class="isDark ? 'text-white/80' : 'text-black'">
                                {{ currentLang === 'ar' ? 'رمز العملة *' : 'Currency Code *' }}
                            </label>
                            <select v-model="form.code" @change="onCodeChange"
                                class="w-full px-4 py-3.5 rounded-xl border appearance-none outline-none transition-all text-sm cursor-pointer"
                                :class="[
                                    errors.code ? 'border-red-500' : (isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#00B794]' : 'bg-white border-[#04C18F80] text-gray-900 focus:border-[#00B794]'),
                                    !form.code ? 'text-gray-400' : ''
                                ]">
                                <option value="" disabled>{{ currentLang === 'ar' ? 'اختر الرمز' : 'Select Code' }}
                                </option>
                                <option v-for="(name, code) in currencyMap" :key="code" :value="code">{{ code }}
                                </option>
                            </select>
                            <div
                                class="absolute inset-y-0 ltr:right-4 rtl:left-4 top-10 flex items-center text-black/80 pointer-events-none opacity-50 h-fit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </div>
                            <p v-if="errors.code" class="text-red-500 text-xs mt-1">{{ errors.code }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-normal mb-1  tracking-wide"
                                :class="isDark ? 'text-white/80' : 'text-black'">
                                {{ currentLang === 'ar' ? 'اسم العملة' : 'Currency Name' }}
                            </label>
                            <input v-model="form.name" type="text" readonly
                                class="w-full px-4 py-3.5 rounded-xl border outline-none text-sm "
                                :class="isDark ? 'bg-white/5 border-white/5 text-white/50' : ' border-[#04C18F80] text-black'" />
                        </div>

                        <div>
                            <label class="block text-sm font-normal mb-1  tracking-wide"
                                :class="isDark ? 'text-white/80' : 'text-gray-700'">
                                {{ currentLang === 'ar' ? 'سعر التحويل إلى AED *' : 'Conversion Rate to AED *' }}
                            </label>
                            <input v-model="form.rate" type="number" step="0.01" placeholder="0.00"
                                class="w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-sm"
                                :class="errors.rate ? 'border-red-500' : (isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#00B794]' : 'bg-white border-[#04C18F80] text-black focus:border-[#00B794]')" />
                            <p v-if="errors.rate" class="text-red-500 text-xs mt-1">{{ errors.rate }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-10">
                        <button @click="handleClose"
                            class="px-4 py-2 rounded-lg border font-normal text-sm transition-all active:scale-95"
                            :class="isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
                            {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                        </button>
                        <button @click="handleSave"
                            class="px-4 py-2 rounded-lg bg-[#008169] hover:bg-[#006b56] text-white font-normal text-sm shadow-lg transition-all active:scale-95">
                            {{ currentLang === 'ar' ? 'حفظ العملة' : 'Save Currency' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    isDark: Boolean,
    currentLang: String
})

const emit = defineEmits(['close', 'save'])

const currencyMap = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    INR: 'Indian Rupee',
    SAR: 'Saudi Riyal',
    KWD: 'Kuwaiti Dinar',
    OMR: 'Omani Rial',
    QAR: 'Qatari Riyal',
    BHD: 'Bahraini Dinar',
    JPY: 'Japanese Yen'
}

const form = reactive({
    code: '',
    name: '',
    rate: ''
})

const errors = reactive({
    code: '',
    rate: ''
})

const onCodeChange = () => {
    form.name = currencyMap[form.code] || ''
    errors.code = ''
}

const validate = () => {
    let isValid = true
    errors.code = ''
    errors.rate = ''

    if (!form.code) {
        errors.code = 'Please select a currency code'
        isValid = false
    }
    if (!form.rate || form.rate <= 0) {
        errors.rate = 'Please enter a valid conversion rate'
        isValid = false
    }

    return isValid
}

const handleSave = () => {
    if (validate()) {
        emit('save', { ...form })
        handleClose()
    }
}

const handleClose = () => {
    form.code = ''
    form.name = ''
    form.rate = ''
    errors.code = ''
    errors.rate = ''
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