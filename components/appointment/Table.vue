<template>
    <div class="w-full overflow-hidden rounded-[16px] border transition-all"
        :class="isDark ? 'bg-[#001410] border-[#03D8B0]/20' : 'bg-white border-gray-100 shadow-sm'">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr :class="isDark ? 'bg-[#00FFBC]/10' : 'bg-[#018E71]'">
                    <th v-for="col in columns" :key="col"
                        class="px-6 py-4 text-[14px] font-semibold"
                        :class="isDark ? 'text-[#00FFBC]' : 'text-white'">
                        {{ col }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, idx) in data" :key="idx"
                    class="border-b last:border-0 transition-colors"
                    :class="isDark ? 'border-[#03D8B0]/10 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'">

                    <!-- Date -->
                    <td class="px-6 py-4">
                        <div class="flex flex-row gap-[10px] items-center">
                            <span class="text-[14px] font-medium" :class="isDark ? 'text-white' : 'text-[#111111]'">{{ item.date }}</span>
                            <span class="text-[12px] opacity-60" :class="isDark ? 'text-white' : 'text-[#111111]'">{{ item.time }}</span>
                        </div>
                    </td>

                    <!-- Consultant -->
                    <td class="px-6 py-4">
                        <span class="text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#111111]/80'">{{ item.consultant }}</span>
                    </td>

                    <!-- Type -->
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-[12px] font-medium"
                            :style="{ backgroundColor: getTypeStyle(item.type).bg, color: getTypeStyle(item.type).text }">
                            {{ item.type }}
                        </span>
                    </td>

                    <!-- Duration -->
                    <td class="px-6 py-4">
                        <span class="text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#111111]/80'">{{ item.duration }}</span>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-[12px] font-medium"
                            :style="{ backgroundColor: getStatusStyle(item.status).bg, color: getStatusStyle(item.status).text }">
                            {{ item.status }}
                        </span>
                    </td>

                    <!-- Action -->
                    <td class="px-6 py-4">
                        <button @click="openDetails(item)"
                            class="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#04C18F]/30 text-[#04C18F] hover:bg-[#04C18F]/10 transition-all cursor-pointer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span class="text-[13px] font-medium">{{ currentLang === 'ar' ? 'عرض' : 'View' }}</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Appointment Details Modal -->
    <AppointmentDetailsModal
        v-model="isDetailsOpen"
        :appointment="selectedAppointment"
        @cancel="handleCancelAppointment"
    />
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    data: Array
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { columns: dynamicColumns, columnsAr, statusStyles, typeStyles } = useAppointmentsPage()

const columns = computed(() => {
    return currentLang.value === 'ar' ? columnsAr.value : dynamicColumns.value
})

const isDetailsOpen = ref(false)
const selectedAppointment = ref(null)

const openDetails = (item) => {
    selectedAppointment.value = item
    isDetailsOpen.value = true
}

const handleCancelAppointment = (appointment) => {
    // Optionally handle cancellation logic here
    console.log('Cancel appointment:', appointment)
}

const getTypeStyle = (type) => {
    const style = typeStyles.value[type]
    if (style) return { bg: style.bg, text: style.text }
    
    if (type === 'Monthly Review') return { bg: '#D6F5ED', text: '#018E71' }
    return { bg: '#FFE8E8', text: '#FF5B5B' }
}

const getStatusStyle = (status) => {
    const style = statusStyles.value[status]
    if (style) return { bg: style.bg, text: style.text }

    switch(status) {
        case 'Completed': return { bg: '#D6F5ED', text: '#018E71' }
        case 'Pending': return { bg: '#FFF4E5', text: '#FFA84A' }
        case 'Scheduled': return { bg: '#E5F1FF', text: '#4A90FF' }
        case 'Cancelled': return { bg: '#FFE8E8', text: '#FF5B5B' }
        default: return { bg: '#F3F4F6', text: '#6B7280' }
    }
}
</script>
