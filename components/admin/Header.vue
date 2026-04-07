<template>
    <div class="space-y-8 mb-6 mt-12">
        <div class="grid grid-cols-1 md:grid-cols-2  gap-4 px-8"
            :class="isManager ? 'lg:grid-cols-3' : 'lg:grid-cols-4'">
            <template v-for="stat in stats" :key="stat.label">
                <div v-if="!(stat.label === 'Deliverables this week' && isManager)"
                    class="p-6 rounded-2xl border transition-all shadow-sm flex flex-col justify-between h-32"
                    :class="stat.bgClass" :style="{ borderColor: stat.color + '40' }">
                    <div class="flex justify-between items-start">
                        <span class="text-sm font-medium text-black/50">{{ stat.label }}</span>
                        <div class="w-5 h-5 flex items-center justify-center" :style="{ color: stat.color }"
                            v-html="stat.icon"></div>
                    </div>

                    <span class="text-3xl font-semibold mt-2" :style="{ color: stat.color }">
                        {{ stat.value }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    role: {
        type: String,
        default: 'member'
    }
})

// Create a robust check for the manager role
const isManager = computed(() => {
    return props.role?.toLowerCase().trim() === 'manager'
})

const stats = [
    {
        label: 'New Projects',
        value: '3',
        bgClass: 'bg-[#EFF6FF] border-blue-100',
        color: '#1447E6',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`
    },
    {
        label: 'Ongoing Projects',
        value: '2',
        bgClass: 'bg-[#FEF2F2] border-red-100',
        color: '#B91C1C',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
    },
    {
        label: 'Deliverables this week',
        value: '2',
        bgClass: 'bg-[#FFFBE1] border-yellow-100',
        color: '#B45309',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    },
    {
        label: 'Avg. Days to Complete',
        value: '15',
        bgClass: 'bg-[#ECFDF5] border-emerald-100',
        color: '#047857',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    },
]
</script>