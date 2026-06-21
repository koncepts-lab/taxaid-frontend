<template>
    <Transition name="modal">
        <div v-if="modelValue" class="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
            
            <!-- Modal Content -->
            <div class="relative w-full max-w-[500px] rounded-[24px] overflow-hidden transition-all shadow-2xl"
                :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]/20' : 'bg-white border border-gray-100'"
                @click.stop>
                
                <!-- Header -->
                <div class="flex items-center justify-between p-6 pb-2">
                    <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                        {{ currentLang === 'ar' ? 'جدولة موعد' : 'Schedule Appointment' }}
                    </h2>
                    <button @click="$emit('update:modelValue', false)" 
                        class="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        :class="isDark ? 'hover:bg-white/10 text-white/60' : 'text-gray-400'">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="px-6 py-4 overflow-y-auto max-h-[80vh] no-scrollbar">
                    <!-- Progress Section — only shown when extra hours are being used (total used > 20) -->
                    <div v-if="props.monthlyUsageStats.extra_hours_used > 0" class="p-4 rounded-[12px] mb-4"
                        :class="isDark ? 'bg-[#00FFBC]/5 border border-[#00FFBC]/20' : 'bg-[#E6FFF5] border border-[#00FFBC]/30'">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013e32]'">
                                {{ currentLang === 'ar' ? 'الساعات الإضافية المستخدمة' : 'Extra Hours Used' }}
                            </span>
                            <span class="text-sm font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013e32]'">
                                {{ props.monthlyUsageStats.extra_hours_used }}/3 hrs
                            </span>
                        </div>
                        <div class="h-3 w-full rounded-full overflow-hidden" :class="isDark ? 'bg-black/20' : 'bg-white/80'">
                            <div class="h-full bg-[#033E32] rounded-full transition-all duration-300"
                                :style="{ width: `${Math.min((props.monthlyUsageStats.extra_hours_used / 3) * 100, 100)}%` }">
                            </div>
                        </div>
                    </div>

                    <!-- Form Fields -->
                    <div class="space-y-4">
                        <!-- Consultant (auto-filled from assignment) -->
                        <div class="relative">
                            <div class="w-full px-4 h-[44px] rounded-[10px] border flex items-center gap-2"
                                :class="isDark
                                    ? 'bg-[#001F1A] border-[#03D8B0]/20'
                                    : 'bg-[#F7FFFE] border-[#04C18F]/30'">
                                <svg class="w-4 h-4 flex-shrink-0" :class="isDark ? 'text-[#03D8B0]/50' : 'text-[#04C18F]/60'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span v-if="consultantLoading" class="text-sm" :class="isDark ? 'text-white/30' : 'text-[#00000080]'">
                                    {{ currentLang === 'ar' ? 'جارٍ التحميل...' : 'Loading...' }}
                                </span>
                                <span v-else-if="myConsultant" class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                                    {{ myConsultant.name }}
                                </span>
                                <span v-else class="text-sm" :class="isDark ? 'text-red-400/70' : 'text-red-500/70'">
                                    {{ currentLang === 'ar' ? 'لم يتم تعيين مستشار بعد' : 'No consultant assigned to your account yet' }}
                                </span>
                            </div>
                        </div>

                        <!-- Issue Type Dropdown -->
                        <div class="relative">
                            <button @click="toggleDropdown('issue')" 
                                class="w-full px-4 h-[44px] rounded-[10px] border flex items-center justify-between text-left transition-all cursor-pointer font-normal"
                                :class="isDark 
                                    ? 'bg-[#002E26] border-[#03D8B0]/30 text-white/50' 
                                    : 'bg-white border-[#04C18F]/30 ' + (selectedIssue ? 'text-[#013e32]' : 'text-[#00000080]')">
                                <span>{{ selectedIssue || (currentLang === 'ar' ? 'اختر نوع المشكلة' : 'Select Issue Type') }}</span>
                                <svg class="w-5 h-5 transition-transform" :class="activeDropdown === 'issue' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="activeDropdown === 'issue'" 
                                class="absolute top-full left-0 right-0 mt-1 p-1 z-50 rounded-[12px] shadow-xl border overflow-hidden"
                                :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/30' : 'bg-white border-gray-100'">
                                <button v-for="opt in issueOptions" :key="opt"
                                    @click="selectIssue(opt)"
                                    class="w-full text-left px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer"
                                    :class="selectedIssue === opt 
                                        ? 'bg-[#E6FFF5] text-[#013e32]' 
                                        : (isDark ? 'text-white/70 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50')">
                                    {{ opt }}
                                </button>
                            </div>
                        </div>

                        <!-- Date & Time Row -->
                        <div class="flex items-center gap-3">
                            <!-- Date Picker -->
                            <div class="relative flex-1">
                                <button @click="toggleDropdown('calendar')"
                                    class="w-full pl-4 pr-10 h-[44px] rounded-[10px] border flex items-center justify-between transition-all cursor-pointer font-normal"
                                    :class="isDark 
                                        ? 'bg-[#002E26] border-[#03D8B0]/30 text-white/50' 
                                        : 'bg-white border-[#04C18F]/30 ' + (selectedDate ? 'text-[#013e32]' : 'text-[#00000080]')">
                                    <span>{{ selectedDate ? formatDate(selectedDate) : (currentLang === 'ar' ? 'اختر التاريخ' : 'dd-mm-yyyy') }}</span>
                                    <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" :class="isDark ? 'text-white/30' : 'text-black/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                
                                <!-- Calendar Popover -->
                                <Transition name="dropdown">
                                    <div v-if="activeDropdown === 'calendar'" 
                                        class="absolute top-full left-0 mt-2 z-[60] border rounded-xl shadow-2xl overflow-hidden"
                                        :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/30' : 'bg-white border-gray-100'">
                                        <VDatePicker
                                            v-model="selectedDate"
                                            :is-dark="isDark"
                                            :locale="currentLang === 'ar' ? 'ar' : 'en'"
                                            :min-date="tomorrow"
                                            @update:model-value="activeDropdown = null"
                                            color="emerald"
                                            borderless
                                        />
                                    </div>
                                </Transition>
                            </div>

                             <!-- Time Slots -->
                            <div class="flex items-center gap-1.5 h-[44px]">
                                <div class="relative h-full">
                                    <select v-model="formData.hour" class="h-full px-2 rounded-[10px] border bg-transparent focus:outline-none appearance-none cursor-pointer pr-4"
                                        :class="isDark ? 'border-[#03D8B0]/30 text-white' : 'border-[#04C18F]/30 bg-[#E6FFF5]/30 text-[#00000080]'">
                                        <option v-for="h in 12" :key="h" :value="h" class="text-black">{{ h.toString().padStart(2, '0') }}</option>
                                    </select>
                                </div>
                                <span class="font-bold">:</span>
                                <div class="relative h-full">
                                    <select v-model="formData.minute" class="h-full px-2 rounded-[10px] border bg-transparent focus:outline-none appearance-none cursor-pointer pr-4"
                                        :class="isDark ? 'border-[#03D8B0]/30 text-white' : 'border-[#04C18F]/30 bg-[#E6FFF5]/30 text-[#00000080]'">
                                        <option v-for="m in ['00','15','30','45']" :key="m" :value="m" class="text-black">{{ m }}</option>
                                    </select>
                                </div>
                                <span class="font-bold">:</span>
                                <div class="relative h-full">
                                    <select v-model="formData.ampm" class="h-full px-2 rounded-[10px] border bg-transparent focus:outline-none appearance-none cursor-pointer pr-4"
                                        :class="isDark ? 'border-[#03D8B0]/30 text-white' : 'border-[#04C18F]/30 bg-[#E6FFF5]/30 text-[#00000080]'">
                                        <option value="AM" class="text-black">AM</option>
                                        <option value="PM" class="text-black">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Duration Dropdown -->
                        <div class="relative">
                            <button @click="toggleDropdown('duration')" 
                                class="w-full px-4 h-[44px] rounded-[10px] border flex items-center justify-between text-left transition-all cursor-pointer font-normal"
                                :class="isDark 
                                    ? 'bg-[#002E26] border-[#03D8B0]/30 text-white/50' 
                                    : 'bg-white border-[#04C18F]/30 ' + (selectedDuration ? 'text-[#013e32]' : 'text-[#00000080]')">
                                <span>{{ selectedDuration || (currentLang === 'ar' ? 'اختر المدة' : 'Select Duration') }}</span>
                                <svg class="w-5 h-5 transition-transform" :class="activeDropdown === 'duration' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="activeDropdown === 'duration'" 
                                class="absolute top-full left-0 right-0 mt-1 p-1 z-50 rounded-[12px] shadow-xl border overflow-hidden"
                                :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/30' : 'bg-white border-gray-100'">
                                <button v-for="opt in durationOptions" :key="opt"
                                    @click="selectDuration(opt)"
                                    class="w-full text-left px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer"
                                    :class="isDark ? 'text-white/70 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'">
                                    {{ opt }}
                                </button>
                            </div>
                        </div>

                        <!-- Notes Area -->
                        <div class="relative">
                            <textarea
                                v-model="formData.notes"
                                :placeholder="currentLang === 'ar' ? 'أضف أي ملاحظات إضافية...' : 'Add any additional notes...'"
                                class="w-full px-4 py-3 min-h-[100px] rounded-[12px] border focus:outline-none transition-all resize-none placeholder:font-normal"
                                :class="isDark
                                    ? 'bg-[#002E26] border-[#03D8B0]/30 text-white placeholder:text-white/30'
                                    : 'bg-white border-[#04C18F]/30 text-[#013e32] placeholder:text-[#00000080]'"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Error message -->
                <div v-if="submitError" class="mx-6 mb-2 px-4 py-2 rounded-[10px] text-sm text-red-600 bg-red-50 border border-red-200">
                    {{ submitError }}
                </div>

                <!-- Footer Actions -->
                <div class="p-6 flex items-center gap-4">
                    <button @click="confirm" :disabled="submitting || (!consultantLoading && !myConsultant)" class="flex-1 h-[48px] rounded-[12px] bg-[#007B5B] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#00664B] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                        <svg v-if="!submitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span>{{ submitting ? (currentLang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (currentLang === 'ar' ? 'تأكيد' : 'Confirm') }}</span>
                    </button>
                    <button @click="$emit('update:modelValue', false)"
                        class="flex-1 h-[48px] rounded-[12px] bg-white border border-[#04C18F] text-[#013e32] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}</span>
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { format } from 'date-fns'

const props = defineProps({
    modelValue: Boolean,
    monthlyUsageStats: {
        type: Object,
        default: () => ({ extra_hours_used: 0, total_hours_used: 0, remaining_hours: 20 })
    },
    onSubmit: {
        type: Function,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const formData = ref({
    hour: '10',
    minute: '00',
    ampm: 'AM',
    notes: ''
})

const myConsultant      = ref(null)
const consultantLoading = ref(false)

const { fetchMyConsultant } = useAppointmentsPage()

watch(() => props.modelValue, async (open) => {
    if (open && !myConsultant.value) {
        consultantLoading.value = true
        myConsultant.value      = await fetchMyConsultant()
        consultantLoading.value = false
    }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const activeDropdown = ref(null)
const selectedIssue = ref('')
const selectedDuration = ref('')
const selectedDate = ref(null)
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0)
const submitting = ref(false)
const submitError = ref('')

const issueOptions = [
    'Implementation Feedback',
    'Initial Usability',
    'Feature Suggestion'
]

const durationOptions = [
    '30 Minutes',
    '1 Hour',
    '1.5 Hours',
    '2 Hours'
]

const toggleDropdown = (type) => {
    activeDropdown.value = activeDropdown.value === type ? null : type
}

const selectIssue = (opt) => {
    selectedIssue.value = opt
    activeDropdown.value = null
}

const selectDuration = (opt) => {
    selectedDuration.value = opt
    activeDropdown.value = null
}

const confirm = async () => {
    submitError.value = ''

    const dateObj = selectedDate.value ?? new Date()

    const newAppointment = {
        type:             selectedIssue.value,
        appointment_date: format(dateObj, 'yyyy-MM-dd'),
        appointment_time: `${formData.value.hour}:${formData.value.minute} ${formData.value.ampm}`,
        duration:         selectedDuration.value,
        notes:            formData.value.notes || null,
    }

    if (props.onSubmit) {
        submitting.value = true
        try {
            await props.onSubmit(newAppointment)
            emit('update:modelValue', false)
            // Reset form only on success
            formData.value.notes = ''
            selectedDate.value = null
            selectedIssue.value = ''
            selectedDuration.value = ''
        } catch (err) {
            const errors = err?.data?.errors
            if (errors) {
                submitError.value = Object.values(errors).flat().join(' ')
            } else {
                submitError.value = err?.data?.message ?? 'Failed to schedule appointment.'
            }
        } finally {
            submitting.value = false
        }
    } else {
        emit('confirm', newAppointment)
        emit('update:modelValue', false)
    }
}

const formatDate = (date) => {
    if (!date) return ''
    return format(date, 'dd-MM-yyyy')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
    opacity: 0;
}

.dropdown-enter-active, .dropdown-leave-active {
    transition: all 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
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

/* Custom styles for selects to match the design */
select {
    background-image: none;
}

/* V-Calendar Overrides */
:deep(.vc-primary) {
    --vc-accent-50: #f0fdfa;
    --vc-accent-100: #ccfbf1;
    --vc-accent-500: #029F80;
    --vc-accent-600: #0d9488;
}

:deep(.vc-container) {
    border: none !important;
    background: transparent !important;
}

:deep(.dark .vc-container) {
    color: white;
}
</style>
