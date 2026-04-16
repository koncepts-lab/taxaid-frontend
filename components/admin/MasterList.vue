<template>
    <div class="p-6 space-y-6  min-h-screen font-sans">
        <h2 class="text-2xl font-semibold text-gray-900 px-2">Master List</h2>

        <div class="flex items-center gap-3">
            <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </span>
                <input type="text" placeholder="Search by consultant name or consultant Id..."
                    class="w-full pl-12 pr-4 py-3 bg-white/50 border border-[#04C18F] rounded-xl text-sm focus:ring-1 focus:ring-[#00896F] outline-none shadow-sm transition-all placeholder:text-[#717182] text-black" />
            </div>
            <button
                class="p-3 bg-white/50 hover:bg-[#86E4CB] border border-[#04C18F] rounded-xl hover:bg-gray-50 transition-all shadow-sm text-[#00896F]">
                <img src="/images/icons/reload.svg" alt="Refresh" class="w-5 h-5">
            </button>
        </div>

        <div class="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-separate border-spacing-0 min-w-[1800px] table-auto">
                    <thead>
                        <tr class="bg-[#00896F] text-white">
                            <th class="px-6 py-5 text-[13px] font-semibold rounded-tl-lg w-[250px]">Client ID</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[250px]">Client Name</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[150px]">Date Assigned</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[100px]">ERP</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[150px]">Industry</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[250px]">Expected Close</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[200px]">Progress Indicator</th>
                            <th class="px-6 py-5 text-[13px] font-semibold min-w-[340px]">Client Delay</th>
                            <th class="px-6 py-5 text-[13px] font-semibold rounded-tr-lg w-[150px] text-right pe-10">
                                View Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="item in tableData" :key="item.id"
                            class="group hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-5 text-sm text-black font-normal whitespace-nowrap">{{ item.clientId
                            }}</td>
                            <td class="px-6 py-5 text-sm font-normal text-gray-900 whitespace-nowrap">{{ item.name
                            }}</td>
                            <td class="px-6 py-5 text-sm text-black whitespace-nowrap">{{ item.date }}</td>
                            <td class="px-6 py-5 text-sm text-black whitespace-nowrap">{{ item.erp }}</td>
                            <td class="px-6 py-5 text-sm text-black whitespace-nowrap">{{ item.industry }}</td>
                            <td class="px-6 py-5 text-sm text-black whitespace-nowrap">{{ item.close }}</td>

                            <td class="px-6 py-5">
                                <div class="flex items-center gap-3 whitespace-nowrap">
                                    <div class="w-24 bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                                        <div class="h-full rounded-full transition-all duration-700"
                                            :style="{ width: (item.progress / 15 * 100) + '%' }"
                                            :class="getProgressColor(item.progress)"></div>
                                    </div>
                                    <span class="text-xs font-bold text-gray-700 tabular-nums">{{ item.progress
                                    }}/15</span>
                                </div>
                            </td>

                            <td class="px-6 py-5">
                                <div class="flex items-center gap-2 h-10">
                                    <input type="text" v-model="item.delayReason"
                                        :ref="el => { if (el) delayInputs[item.id] = el }"
                                        placeholder="Click to add delay reason..." @focus="activeRowId = item.id"
                                        @keyup.enter="saveDelay(item)"
                                        class="flex-1 bg-[#F3F4F6] border border-transparent rounded-xl px-4 py-2.5 text-xs text-black outline-none focus:bg-white focus:border-[#00896F] transition-all placeholder:text-gray-400" />

                                    <Transition name="fade">
                                        <button v-if="activeRowId === item.id" @mousedown.prevent="saveDelay(item)"
                                            class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-4 py-1 rounded-md text-sm font-normal transition-all active:scale-95 shadow-sm whitespace-nowrap">
                                            {{ item.isSaved ? 'Update' : 'Save' }}
                                        </button>
                                    </Transition>
                                </div>
                            </td>

                            <td class="px-6 py-5 pe-8 ">
                                <button @click="$emit('go-to-project', item)"
                                    class="bg-[#00AD5FCC] hover:bg-[#00896F] hover:text-white text-white px-5 py-2 rounded-md text-xs font-bold shadow-sm active:scale-95 transition-all whitespace-nowrap">
                                    Go to Project
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const emit = defineEmits(['go-to-project'])
const headers = [
    'Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry',
    'Expected Close', 'Progress Indicator', 'Client Delay', 'View Status'
]

const activeRowId = ref(null)
const delayInputs = reactive({})

const tableData = ref([
    { id: 1, clientId: 'client-7', name: 'Logistics Express Inc.', date: '01/10/2026', erp: 'SAP', industry: 'Technology', close: '01/10/2026', progress: 8, delayReason: '', savedDate: null },
    { id: 2, clientId: 'client-4', name: 'Food Services Group', date: '01/10/2026', erp: 'Oracle', industry: 'Retail', close: '01/10/2026', progress: 10, delayReason: 'Wait for documentation', savedDate: '24/03/2026' },
    { id: 3, clientId: 'client-4', name: 'Maritime Logistics', date: '01/10/2026', erp: 'Oracle', industry: 'Maritime', close: '01/10/2026', progress: 3, delayReason: '', savedDate: null },
])

const saveDelay = (item) => {
    if (!item.delayReason.trim()) {
        item.savedDate = null
        activeRowId.value = null
        return
    }

    const now = new Date()
    item.savedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    activeRowId.value = null

    if (delayInputs[item.id]) {
        delayInputs[item.id].blur()
    }
}

const getProgressColor = (val) => {
    if (val >= 10) return 'bg-[#00896F]'
    if (val >= 6) return 'bg-[#F59E0B]'
    return 'bg-[#EF4444]'
}
</script>

<style scoped>
table {
    border-collapse: separate;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>