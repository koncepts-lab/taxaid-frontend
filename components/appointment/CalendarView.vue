<template>
    <div class="w-full rounded-[20px] border overflow-hidden transition-all"
        :class="isDark ? 'bg-[#001410] border-[#03D8B0]/20' : 'bg-white border-gray-100 shadow-sm'">

        <!-- Calendar Header -->
        <div class="flex items-center justify-between px-8 py-5 border-b"
            :class="isDark ? 'border-[#03D8B0]/10' : 'border-gray-100'">
            <!-- Month Title -->
            <h2 class="text-[20px] font-semibold"
                :class="isDark ? 'text-white' : 'text-[#111111]'">
                {{ monthLabel }}
            </h2>

            <!-- Legend + Nav -->
            <div class="flex items-center gap-6">
                <!-- Legend -->
                <div class="hidden md:flex items-center gap-5">
                    <span v-for="item in legend" :key="item.label" class="flex items-center gap-1.5 text-[12px]"
                        :class="isDark ? 'text-white/60' : 'text-[#666]'">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: item.color }"></span>
                        {{ item.label }}
                    </span>
                </div>

                <!-- Nav Arrows -->
                <div class="flex items-center gap-1">
                    <button @click="prevMonth"
                        class="w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer"
                        :class="isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-500'">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button @click="nextMonth"
                        class="w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer"
                        :class="isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-500'">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Day Headers -->
        <div class="grid grid-cols-7 border-b"
            :class="isDark ? 'border-[#03D8B0]/10' : 'border-gray-100'">
            <div v-for="day in weekDays" :key="day"
                class="py-3 text-center text-[13px] font-medium"
                :class="isDark ? 'text-white/40' : 'text-gray-400'">
                {{ day }}
            </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7">
            <!-- Leading empty cells -->
            <div v-for="n in startOffset" :key="'empty-' + n"
                class="min-h-[120px] border-b border-r last:border-r-0 p-2"
                :class="isDark ? 'border-[#03D8B0]/05 bg-transparent' : 'border-gray-50 bg-gray-50/30'">
            </div>

            <!-- Day Cells -->
            <div v-for="day in daysInMonth" :key="day"
                class="min-h-[120px] border-b border-r p-2 relative transition-colors"
                :class="[
                    (day + startOffset) % 7 === 0 ? 'border-r-0' : '',
                    isToday(day)
                        ? (isDark ? 'bg-[#00FFBC]/5 border-[#00FFBC]/30' : 'bg-[#E6FFF8] border-[#04C18F]/40')
                        : (isDark ? 'border-[#03D8B0]/05 hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/60'),
                ]">

                <!-- Date Number -->
                <span class="text-[13px] font-medium inline-flex items-center justify-center w-7 h-7 rounded-full mb-1"
                    :class="[
                        isToday(day)
                            ? (isDark ? 'bg-[#00FFBC] text-[#013e32]' : 'bg-[#016A56] text-white')
                            : (isDark ? 'text-white/50' : 'text-gray-500')
                    ]">
                    {{ day }}
                </span>

                <!-- Appointment Pills -->
                <div class="flex flex-col gap-1 mt-0.5">
                    <template v-for="(appt, i) in getAppointmentsForDay(day)" :key="i">
                        <!-- extra_hours: pill color = pending normally / extra_hours when that filter active -->
                        <!-- dot at right = extra_hours accent color to signal extra allocation -->
                        <div v-if="appt.status === 'extra_hours'"
                            @click="openDetails(appt)"
                            class="w-full flex items-center gap-1 px-2 py-0.5 rounded-[5px] cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
                            :style="extraHoursPillStyle">
                            <span class="text-[11px] font-medium truncate flex-1 min-w-0">{{ appt.consultant }}</span>
                            <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: getStatusText('extra_hours') }"></span>
                        </div>
                        <!-- Normal appointment pill -->
                        <button v-else
                            @click="openDetails(appt)"
                            class="w-full text-left px-2 py-0.5 rounded-[5px] text-[11px] font-medium truncate transition-all cursor-pointer hover:opacity-80 active:scale-[0.97]"
                            :style="{ background: getStatusBg(appt.status), color: getStatusText(appt.status) }">
                            {{ appt.consultant }}
                        </button>
                    </template>
                </div>
            </div>

            <!-- Trailing empty cells to complete grid -->
            <div v-for="n in trailingCells" :key="'trail-' + n"
                class="min-h-[120px] border-b border-r last:border-r-0 p-2"
                :class="isDark ? 'border-[#03D8B0]/05' : 'border-gray-50 bg-gray-50/30'">
            </div>
        </div>
    </div>

    <!-- Appointment Details Modal -->
    <AppointmentDetailsModal
        v-model="isDetailsOpen"
        :appointment="selectedAppointment"
        @cancel="handleCancelAppointment"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { parseISO } from 'date-fns'

const props = defineProps({
    data: Array
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { cancelAppointment } = useAppointmentsPage()

// ─── Modal ───────────────────────────────────────────────────────────────────
const isDetailsOpen = ref(false)
const selectedAppointment = ref(null)

const handleCancelAppointment = async (appointment) => {
    if (!appointment?.id) return
    await cancelAppointment(appointment.id)
    isDetailsOpen.value = false
}

const openDetails = (appt) => {
    selectedAppointment.value = appt
    isDetailsOpen.value = true
}

// ─── Calendar state ───────────────────────────────────────────────────────────
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth()) // 0-indexed

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() => {
    const d = new Date(currentYear.value, currentMonth.value, 1)
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const startOffset = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const trailingCells = computed(() => {
    const total = startOffset.value + daysInMonth.value
    const remainder = total % 7
    return remainder === 0 ? 0 : 7 - remainder
})

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
}

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
}

const isToday = (day) => {
    return (
        day === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear()
    )
}

// ─── Appointment matching ─────────────────────────────────────────────────────
// API returns "YYYY-MM-DD". parseISO keeps it as local date (no UTC-shift).
const parseAppointmentDate = (dateStr) => {
    if (!dateStr) return null
    try {
        // Slice to first 10 chars to handle both "2026-06-17" and ISO datetime strings
        return parseISO(dateStr.slice(0, 10))
    } catch {
        return null
    }
}

const getAppointmentsForDay = (day) => {
    return (props.data ?? []).filter(appt => {
        const d = parseAppointmentDate(appt.appointment_date ?? appt.date)
        if (!d) return false
        return (
            d.getDate() === day &&
            d.getMonth() === currentMonth.value &&
            d.getFullYear() === currentYear.value
        )
    })
}

// ─── Auto-navigate when filter has no results in current month ────────────────
// When data changes (filter applied / new results) and the current displayed month
// has no appointments, jump to the month of the chronologically closest appointment.
watch(() => props.data, (list) => {
    if (!list || list.length === 0) return

    const hasInMonth = list.some(appt => {
        const d = parseAppointmentDate(appt.appointment_date)
        return d && d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value
    })

    if (!hasInMonth) {
        // Prefer the next upcoming appointment; fall back to the most recent past one
        const todayMs = Date.now()
        const upcoming = list.find(a => {
            const d = parseAppointmentDate(a.appointment_date)
            return d && d.getTime() >= todayMs
        })
        const target = upcoming ?? list[list.length - 1]
        const d = target ? parseAppointmentDate(target.appointment_date) : null
        if (d) {
            currentMonth.value = d.getMonth()
            currentYear.value  = d.getFullYear()
        }
    }
})

// ─── Status colours ───────────────────────────────────────────────────────────
const { legend: dynamicLegend, statusStyles, statusFilter } = useAppointmentsPage()

const getStatusBg   = (status) => statusStyles.value[status]?.bg   || '#F3F4F6'
const getStatusText = (status) => statusStyles.value[status]?.text || '#6B7280'

// extra_hours pill: pending color by default; switches to extra_hours color when that filter is active
const extraHoursPillStyle = computed(() => {
    const base = statusFilter.value === 'extra_hours' ? 'extra_hours' : 'pending'
    return { background: getStatusBg(base), color: getStatusText(base) }
})

// ─── Legend ───────────────────────────────────────────────────────────────────
const legend = computed(() => {
    return dynamicLegend.value.map(item => ({
        label: currentLang.value === 'ar' ? item.labelAr : item.label,
        color: item.color
    }))
})
</script>

<style scoped>
/* Remove bottom border on last grid row */
.grid > div:nth-last-child(-n+7) {
    border-bottom: none;
}
</style>
