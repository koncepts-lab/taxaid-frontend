<template>
    <Transition name="modal">
        <div v-if="modelValue" class="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>

            <!-- Modal Card -->
            <div class="relative w-full max-w-[560px] rounded-[24px] shadow-2xl overflow-hidden transition-all"
                :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]/20' : 'bg-white border border-gray-100'"
                @click.stop>

                <!-- Header -->
                <div class="flex items-center justify-between px-8 pt-8 pb-4">
                    <h2 class="text-[18px]"
                        style="font-weight: 500; color: #0A0A0A;"
                        :style="isDark ? 'color: #ffffff;' : 'color: #0A0A0A;'">
                        {{ currentLang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details' }}
                    </h2>
                    <button @click="$emit('update:modelValue', false)"
                        class="p-2 rounded-full transition-colors cursor-pointer"
                        :class="isDark ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Divider -->
                <div class="mx-8 mb-6 h-px" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>

                <!-- Body -->
                <div class="px-8 pb-2">
                    <!-- Row 1: Type, Consultant, Date -->
                    <div class="grid grid-cols-3 gap-6 mb-7">
                        <!-- Appointment Type -->
                        <div>
                            <p class="mb-2"
                                style="font-weight: 400; font-size: 12px;"
                                :style="isDark ? 'color: rgba(255,255,255,0.4);' : 'color: #505050;'">
                                {{ currentLang === 'ar' ? 'نوع الموعد' : 'Appointment Type' }}
                            </p>
                            <span class="inline-block px-3 py-1.5 rounded-full text-[12px] font-medium"
                                :class="getTypeStyle(appointment?.type)">
                                {{ appointment?.type || '—' }}
                            </span>
                        </div>

                        <!-- Consultant -->
                        <div>
                            <p class="mb-2"
                                style="font-weight: 400; font-size: 12px;"
                                :style="isDark ? 'color: rgba(255,255,255,0.4);' : 'color: #505050;'">
                                {{ currentLang === 'ar' ? 'المستشار' : 'Consultant' }}
                            </p>
                            <p style="font-weight: 400; font-size: 14px;"
                                :style="isDark ? 'color: #ffffff;' : 'color: #101828;'">
                                {{ appointment?.consultant || '—' }}
                            </p>
                        </div>

                        <!-- Date -->
                        <div>
                            <p class="mb-2"
                                style="font-weight: 400; font-size: 12px;"
                                :style="isDark ? 'color: rgba(255,255,255,0.4);' : 'color: #505050;'">
                                {{ currentLang === 'ar' ? 'التاريخ' : 'Date' }}
                            </p>
                            <p style="font-weight: 400; font-size: 14px;"
                                :style="isDark ? 'color: #ffffff;' : 'color: #101828;'">
                                {{ appointment?.date || '—' }}
                            </p>
                        </div>
                    </div>

                    <!-- Row 2: Time, Duration, Status -->
                    <div class="grid grid-cols-3 gap-6 mb-7">
                        <!-- Time -->
                        <div>
                            <p class="mb-2"
                                style="font-weight: 400; font-size: 12px;"
                                :style="isDark ? 'color: rgba(255,255,255,0.4);' : 'color: #505050;'">
                                {{ currentLang === 'ar' ? 'الوقت' : 'Time' }}
                            </p>
                            <p style="font-weight: 400; font-size: 14px;"
                                :style="isDark ? 'color: #ffffff;' : 'color: #101828;'">
                                {{ appointment?.time || '—' }}
                            </p>
                        </div>

                        <!-- Duration -->
                        <div>
                            <p class="mb-2"
                                style="font-weight: 400; font-size: 12px;"
                                :style="isDark ? 'color: rgba(255,255,255,0.4);' : 'color: #505050;'">
                                {{ currentLang === 'ar' ? 'المدة' : 'Duration' }}
                            </p>
                            <p style="font-weight: 400; font-size: 14px;"
                                :style="isDark ? 'color: #ffffff;' : 'color: #101828;'">
                                {{ appointment?.duration || '—' }}
                            </p>
                        </div>

                        <!-- Status -->
                        <div>
                            <p class="mb-2"
                                style="font-weight: 400; font-size: 12px;"
                                :style="isDark ? 'color: rgba(255,255,255,0.4);' : 'color: #505050;'">
                                {{ currentLang === 'ar' ? 'الحالة' : 'Status' }}
                            </p>
                            <span class="inline-block px-3 py-1.5 rounded-full text-[12px] font-medium"
                                :class="getStatusStyle(appointment?.status)">
                                {{ appointment?.status || '—' }}
                            </span>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="mb-8">
                        <p class="text-[14px] font-bold mb-3"
                            :class="isDark ? 'text-white' : 'text-[#111111]'">
                            {{ currentLang === 'ar' ? 'ملاحظات' : 'Notes' }}
                        </p>
                        <div class="w-full min-h-[100px] px-4 py-3 rounded-[12px] text-[14px]"
                            :class="isDark
                                ? 'bg-[#00FFBC]/5 border border-[#00FFBC]/10 text-white/60'
                                : 'bg-[#E6FFF5] text-[#555]'">
                            {{ appointment?.notes || (currentLang === 'ar' ? 'لا توجد ملاحظات.' : 'No notes provided.') }}
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 pb-8 flex justify-end">
                    <button @click="handleCancel"
                        class="px-8 h-[48px] rounded-[12px] border text-[14px] font-medium transition-all cursor-pointer hover:bg-red-50 active:scale-[0.98]"
                        :class="isDark
                            ? 'border-red-400/50 text-red-400 hover:bg-red-400/10'
                            : 'border-red-300 text-red-500'">
                        {{ currentLang === 'ar' ? 'إلغاء الموعد' : 'Cancel Appointment' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    appointment: Object
})

const emit = defineEmits(['update:modelValue', 'cancel'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const getTypeStyle = (type) => {
    if (type === 'Monthly Review') return 'bg-[#D6F5ED] text-[#018E71]'
    return 'bg-[#FFE8E8] text-[#FF5B5B]'
}

const getStatusStyle = (status) => {
    switch (status) {
        case 'Completed': return 'bg-[#D6F5ED] text-[#018E71]'
        case 'Pending': return 'bg-[#FFF4E5] text-[#FFA84A]'
        case 'Scheduled': return 'bg-[#E5F1FF] text-[#4A90FF]'
        case 'Confirmed': return 'bg-[#D6F5ED] text-[#018E71]'
        case 'Cancelled': return 'bg-[#FFE8E8] text-[#FF5B5B]'
        default: return 'bg-gray-100 text-gray-600'
    }
}

const handleCancel = () => {
    emit('cancel', props.appointment)
    emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
}
</style>
