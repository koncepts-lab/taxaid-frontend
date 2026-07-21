<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-6xl bg-white transition-all duration-300 transform scale-100 shadow-2xl overflow-hidden rounded-2xl flex flex-col h-[90vh]"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                    <!-- Header -->
                    <div class="p-6 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                                    {{ title }}
                                </h2>
                                <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                                    {{ subtitle }}
                                </p>
                            </div>
                            <button @click="$emit('close')"
                                class="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" :class="isDark ? 'text-white' : 'text-gray-500'">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Alert Banner -->
                        <div class="mt-4 p-3 rounded-lg flex items-center gap-2"
                            :class="isDark ? 'bg-amber-900/20 text-amber-200' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span class="text-sm font-medium">{{ alertMessage }}</span>
                        </div>

                        <div v-if="errorMessage" class="mt-3 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-100">
                            {{ errorMessage }}
                        </div>
                        <div v-if="successMessage" class="mt-3 p-3 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {{ successMessage }}
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="flex-1 overflow-auto px-6 pb-6">
                        <table class="w-full text-left rtl:text-right border-collapse"
                            :class="type === 'prepaid' ? 'min-w-[1700px]' : 'min-w-[800px]'">
                            <thead class="sticky top-0 z-20">
                                <tr class="bg-[#008169] text-white">
                                    <th class="px-6 py-4 text-sm font-medium rounded-l-lg">FS Code</th>
                                    <th class="px-6 py-4 text-sm font-medium">Main Group</th>
                                    <th class="px-6 py-4 text-sm font-medium">Sub group</th>
                                    <th class="px-6 py-4 text-sm font-medium">Ledger</th>

                                    <template v-if="type === 'cost_center'">
                                        <th class="px-6 py-4 text-sm font-medium rounded-r-lg">Cost Center</th>
                                    </template>
                                    <template v-else-if="type === 'opening_balance'">
                                        <th class="px-6 py-4 text-sm font-medium rounded-r-lg">Opening Balance</th>
                                    </template>
                                    <template v-else-if="type === 'prepaid'">
                                        <th class="px-4 py-4 text-sm font-medium whitespace-nowrap">Value in Budget</th>
                                        <th v-for="m in months" :key="m" class="px-3 py-4 text-sm font-medium whitespace-nowrap capitalize">{{ m }}</th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="loadingRows">
                                    <td :colspan="columnCount" class="py-16 text-center text-sm" :class="isDark ? 'text-white/50' : 'text-gray-400'">
                                        {{ currentLang === 'ar' ? 'جارٍ التحميل...' : 'Loading ledger data...' }}
                                    </td>
                                </tr>
                                <tr v-else-if="!rows.length">
                                    <td :colspan="columnCount" class="py-16 text-center text-sm" :class="isDark ? 'text-white/50' : 'text-gray-400'">
                                        {{ currentLang === 'ar' ? 'لا توجد بيانات دفتر أستاذ متاحة. يرجى رفع ميزان المراجعة أولاً.' : 'No ledger data available. Upload a trial balance first.' }}
                                    </td>
                                </tr>
                                <tr v-for="(row, index) in rows" v-else :key="index"
                                    class="border-b transition-colors"
                                    :class="isDark ? 'border-white/5 hover:bg-white/5 text-white/80' : 'border-gray-100 hover:bg-gray-50 text-gray-700'">
                                    <td class="px-6 py-4 text-sm whitespace-nowrap">{{ row.fsCode }}</td>
                                    <td class="px-6 py-4 text-sm whitespace-nowrap">{{ row.mainGroup }}</td>
                                    <td class="px-6 py-4 text-sm whitespace-nowrap">{{ row.subGroup }}</td>
                                    <td class="px-6 py-4 text-sm whitespace-nowrap">{{ row.ledger }}</td>

                                    <td v-if="type === 'cost_center'" class="px-6 py-4 text-sm">
                                        <div class="relative">
                                            <select v-model="row.value"
                                                class="w-full appearance-none bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008169] focus:bg-white transition-all pr-10"
                                                :class="isDark ? 'bg-white/5 text-white border-white/10 focus:bg-[#01261f]' : ''">
                                                <option value="" disabled>Select Cost Center</option>
                                                <option v-for="opt in costCenterOptions" :key="opt" :value="opt">{{ opt }}</option>
                                            </select>
                                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>

                                    <td v-else-if="type === 'opening_balance'" class="px-6 py-4 text-sm">
                                        <input v-model="row.value" type="number" step="0.01" placeholder="0.00"
                                            class="w-32 bg-[#F3F4F6] border border-transparent rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008169] focus:bg-white transition-all"
                                            :class="isDark ? 'bg-white/5 text-white border-white/10 focus:bg-[#01261f]' : ''" />
                                    </td>

                                    <template v-else-if="type === 'prepaid'">
                                        <td class="px-4 py-4 text-sm">
                                            <input v-model="row.valueInBudget" type="number" step="0.01" placeholder="0.00"
                                                class="w-28 bg-[#F3F4F6] border border-transparent rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008169] focus:bg-white transition-all"
                                                :class="isDark ? 'bg-white/5 text-white border-white/10 focus:bg-[#01261f]' : ''" />
                                        </td>
                                        <td v-for="m in months" :key="m" class="px-3 py-4 text-sm">
                                            <input v-model="row.months[m]" type="number" step="0.01" placeholder="0"
                                                class="w-20 bg-[#F3F4F6] border border-transparent rounded-lg px-2 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008169] focus:bg-white transition-all"
                                                :class="isDark ? 'bg-white/5 text-white border-white/10 focus:bg-[#01261f]' : ''" />
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loadingRows"
                        @page-change="(page) => $emit('change-page', page)"
                        @per-page-change="(perPage) => $emit('change-per-page', perPage)" />

                    <!-- Footer -->
                    <div class="p-6 border-t flex justify-end gap-3" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <button @click="$emit('close')"
                            class="px-6 py-2.5 rounded-xl border text-sm font-medium transition-all"
                            :class="isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
                            Cancel
                        </button>
                        <button @click="handleUpdate" :disabled="saving || !rows.length"
                            class="px-6 py-2.5 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ saving ? 'Saving...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    title: String,
    subtitle: String,
    alertMessage: String,
    errorMessage: String,
    successMessage: String,
    isDark: Boolean,
    currentLang: String,
    type: {
        type: String,
        default: 'cost_center', // 'cost_center' | 'prepaid' | 'opening_balance'
    },
    loadingRows: Boolean,
    saving: Boolean,
    // Source ledger rows: [{ fsCode, mainGroup, subGroup, ledger }]
    data: {
        type: Array,
        default: () => []
    },
    costCenterOptions: {
        type: Array,
        default: () => []
    },
    meta: {
        type: Object,
        default: () => ({ current_page: 1, last_page: 1, total: 0, per_page: 20 })
    }
})

const emit = defineEmits(['close', 'update', 'change-page', 'change-per-page'])

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// 4 fixed columns (FS Code / Main Group / Sub group / Ledger) + type-specific columns
const columnCount = computed(() => 4 + (props.type === 'prepaid' ? 1 + months.length : 1))

const rows = ref([])

const buildRows = () => {
    rows.value = props.data.map(r => ({
        fsCode: r.fsCode,
        mainGroup: r.mainGroup,
        subGroup: r.subGroup,
        ledger: r.ledger,
        value: '',
        valueInBudget: r.valueInBudget ?? '',
        months: Object.fromEntries(months.map(m => [m, ''])),
    }))
}

watch(() => [props.isOpen, props.data], () => {
    if (props.isOpen) buildRows()
}, { immediate: true })

const handleUpdate = () => {
    let payload = []

    if (props.type === 'cost_center') {
        payload = rows.value
            .filter(r => r.value)
            .map(r => ({
                fs_code: r.fsCode,
                main_group: r.mainGroup,
                subgroup: r.subGroup,
                ledger_name: r.ledger,
                cost_center: r.value,
            }))
    } else if (props.type === 'opening_balance') {
        payload = rows.value
            .filter(r => r.value !== '' && r.value !== null)
            .map(r => ({
                fs_code: r.fsCode,
                main_group: r.mainGroup,
                sub_group: r.subGroup,
                ledger: r.ledger,
                opening_balance: Number(r.value),
            }))
    } else if (props.type === 'prepaid') {
        payload = rows.value.map(r => ({
            fs_code: r.fsCode,
            main_group: r.mainGroup,
            subgroup: r.subGroup,
            ledger_name: r.ledger,
            value_in_budget: r.valueInBudget === '' ? 0 : Number(r.valueInBudget),
            ...Object.fromEntries(months.map(m => [m, r.months[m] === '' ? 0 : Number(r.months[m])])),
        }))
    }

    emit('update', payload)
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
