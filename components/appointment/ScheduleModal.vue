<template>
    <Teleport to="body">
    <!-- Floating popovers (calendar / issue type / duration) — fixed + body-level so the modal keeps its size and nothing clips them -->
    <div v-if="modelValue && activeDropdown" class="fixed inset-0 z-[1299]" @click="activeDropdown = null"></div>
    <Transition name="dropdown">
        <div v-if="modelValue && (activeDropdown === 'issue' || activeDropdown === 'duration' || activeDropdown === 'consultant')"
            class="fixed z-[1300] p-1 rounded-[12px] shadow-2xl border overflow-y-auto max-h-[220px]"
            :style="floatStyle"
            :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/30' : 'bg-white border-gray-100'">
            <button v-for="opt in floatOptions" :key="opt.key"
                @click="selectFloat(opt)"
                class="w-full text-left px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer"
                :class="opt.key === selectedFloatKey
                    ? (isDark ? 'bg-[#00FFBC]/15 text-[#00FFBC]' : 'bg-[#E6FFF5] text-[#013e32]')
                    : (isDark ? 'text-white/70 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50')">
                {{ opt.label }}
            </button>
        </div>
    </Transition>
    <Transition name="dropdown">
        <div v-if="modelValue && activeDropdown === 'calendar'"
            class="fixed z-[1300] border rounded-xl shadow-2xl overflow-hidden"
            :style="floatStyle"
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
    <Transition name="modal">
        <div v-if="modelValue" class="fixed inset-0 z-[1200] flex items-center justify-center p-4">
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

                <div class="px-6 py-4 overflow-y-auto max-h-[78vh] no-scrollbar">
                    <!-- Progress Section — only shown when extra hours are being used (total used > 20) -->
                    <div v-if="props.monthlyUsageStats.extra_hours_used > 0" class="p-4 rounded-[12px] mb-4"
                        :class="isDark ? 'bg-[#00FFBC]/5 border border-[#00FFBC]/20' : 'bg-[#E6FFF5] border border-[#00FFBC]/30'">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013e32]'">
                                {{ currentLang === 'ar' ? 'الساعات الإضافية المستخدمة' : 'Extra Hours Used' }}
                            </span>
                            <span class="text-sm font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013e32]'">
                                {{ props.monthlyUsageStats.extra_hours_used }}/{{ extraAllowed }} hrs
                            </span>
                        </div>
                        <div class="h-3 w-full rounded-full overflow-hidden" :class="isDark ? 'bg-black/20' : 'bg-white/80'">
                            <div class="h-full bg-[#033E32] rounded-full transition-all duration-300"
                                :style="{ width: `${Math.min((props.monthlyUsageStats.extra_hours_used / extraAllowed) * 100, 100)}%` }">
                            </div>
                        </div>
                    </div>

                    <!-- Form Fields -->
                    <div class="space-y-4">
                        <!-- Consultant (auto-filled from assignment) -->
                        <div v-if="!consultantLoading && consultants.length > 1" class="relative">
                            <button @click="toggleFloating('consultant', $event)"
                                class="w-full px-4 h-[44px] rounded-[10px] border flex items-center justify-between gap-2 text-left transition-all cursor-pointer font-normal"
                                :class="isDark
                                    ? 'bg-[#002E26] border-[#03D8B0]/30 text-white'
                                    : 'bg-white border-[#04C18F]/30 text-[#013e32]'">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4 flex-shrink-0" :class="isDark ? 'text-[#03D8B0]/50' : 'text-[#04C18F]/60'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span class="text-sm font-medium">{{ myConsultant?.name }}</span>
                                </span>
                                <svg class="w-5 h-5 transition-transform" :class="activeDropdown === 'consultant' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div v-else class="relative">
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
                            <button @click="toggleFloating('issue', $event)"
                                class="w-full px-4 h-[44px] rounded-[10px] border flex items-center justify-between text-left transition-all cursor-pointer font-normal"
                                :class="isDark 
                                    ? 'bg-[#002E26] border-[#03D8B0]/30 text-white/50' 
                                    : 'bg-white border-[#04C18F]/30 ' + (selectedIssue ? 'text-[#013e32]' : 'text-[#00000080]')">
                                <span>{{ selectedIssue || (currentLang === 'ar' ? 'اختر نوع المشكلة' : 'Select Issue Type') }}</span>
                                <svg class="w-5 h-5 transition-transform" :class="activeDropdown === 'issue' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Date & Time Row -->
                        <div class="flex flex-col md:flex-row md:items-center gap-3">
                            <!-- Date Picker -->
                            <div class="relative w-full md:flex-1">
                                <button @click="toggleFloating('calendar', $event)"
                                    class="w-full pl-4 pr-10 h-[44px] rounded-[10px] border flex items-center justify-between transition-all cursor-pointer font-normal"
                                    :class="isDark 
                                        ? 'bg-[#002E26] border-[#03D8B0]/30 text-white/50' 
                                        : 'bg-white border-[#04C18F]/30 ' + (selectedDate ? 'text-[#013e32]' : 'text-[#00000080]')">
                                    <span>{{ selectedDate ? formatDate(selectedDate) : (currentLang === 'ar' ? 'اختر التاريخ' : 'dd-mm-yyyy') }}</span>
                                    <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" :class="isDark ? 'text-white/30' : 'text-black/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>

                             <!-- Time Slots -->
                            <CommonTimePicker
                                v-model:hour="formData.hour"
                                v-model:minute="formData.minute"
                                v-model:ampm="formData.ampm" />
                        </div>

                        <!-- Duration Dropdown -->
                        <div class="relative">
                            <button @click="toggleFloating('duration', $event)"
                                class="w-full px-4 h-[44px] rounded-[10px] border flex items-center justify-between text-left transition-all cursor-pointer font-normal"
                                :class="isDark 
                                    ? 'bg-[#002E26] border-[#03D8B0]/30 text-white/50' 
                                    : 'bg-white border-[#04C18F]/30 ' + (selectedDuration ? 'text-[#013e32]' : 'text-[#00000080]')">
                                <span>{{ selectedDuration || (currentLang === 'ar' ? 'اختر المدة' : 'Select Duration') }}</span>
                                <svg class="w-5 h-5 transition-transform" :class="activeDropdown === 'duration' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
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
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

const extraAllowed = computed(() => props.monthlyUsageStats.extra_hours_allowed || 3)

const consultants          = ref([])
const selectedConsultantId = ref(null)
const consultantLoading    = ref(false)

const myConsultant = computed(() =>
    consultants.value.find(c => c.id === selectedConsultantId.value) ?? consultants.value[0] ?? null
)

const { fetchMyConsultants } = useAppointmentsPage()

watch(() => props.modelValue, async (open) => {
    if (open && !consultants.value.length) {
        consultantLoading.value = true
        consultants.value       = await fetchMyConsultants()
        selectedConsultantId.value = consultants.value[0]?.id ?? null
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

const floatStyle = ref({})
const FLOAT_HEIGHTS = { calendar: 330, issue: 150, duration: 190, consultant: 190 }

const floatOptions = computed(() => {
    if (activeDropdown.value === 'issue')      return issueOptions.map(o => ({ key: o, label: o }))
    if (activeDropdown.value === 'duration')   return durationOptions.map(o => ({ key: o, label: o }))
    if (activeDropdown.value === 'consultant') return consultants.value.map(c => ({ key: c.id, label: c.name }))
    return []
})

const selectedFloatKey = computed(() => {
    if (activeDropdown.value === 'issue')      return selectedIssue.value
    if (activeDropdown.value === 'duration')   return selectedDuration.value
    if (activeDropdown.value === 'consultant') return selectedConsultantId.value
    return null
})

const selectFloat = (opt) => {
    if (activeDropdown.value === 'issue')           selectedIssue.value = opt.key
    else if (activeDropdown.value === 'duration')   selectedDuration.value = opt.key
    else if (activeDropdown.value === 'consultant') selectedConsultantId.value = opt.key
    activeDropdown.value = null
}
const CAL_WIDTH = 300

const toggleFloating = (type, event) => {
    if (activeDropdown.value === type) { activeDropdown.value = null; return }
    const rect = event?.currentTarget?.getBoundingClientRect()
    if (rect) {
        const height = FLOAT_HEIGHTS[type]
        const spaceBelow = window.innerHeight - rect.bottom
        const top = spaceBelow >= height + 12 ? rect.bottom + 6 : Math.max(8, rect.top - height - 6)
        if (type === 'calendar') {
            const left = Math.min(Math.max(8, rect.left), window.innerWidth - CAL_WIDTH - 8)
            floatStyle.value = { top: `${top}px`, left: `${left}px` }
        } else {
            floatStyle.value = { top: `${top}px`, left: `${rect.left}px`, width: `${rect.width}px` }
        }
    }
    activeDropdown.value = type
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

    if (consultants.value.length > 1 && selectedConsultantId.value) {
        newAppointment.consultant_id = selectedConsultantId.value
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
