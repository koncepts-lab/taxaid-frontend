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
                <input type="text" v-model="search" placeholder="Search by client name or client ID..."
                    class="w-full pl-12 pr-4 py-3 bg-white/50 border border-[#04C18F] rounded-xl text-sm focus:ring-1 focus:ring-[#00896F] outline-none shadow-sm transition-all placeholder:text-[#717182] text-black" />
            </div>
            <button @click="fetchClients()"
                class="p-3 bg-white/50 hover:bg-[#86E4CB] border border-[#04C18F] rounded-xl hover:bg-gray-50 transition-all shadow-sm text-[#00896F]">
                <img src="/images/icons/reload.svg" alt="Refresh" class="w-5 h-5">
            </button>
        </div>

        <div class="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden">
            <div class="overflow-auto custom-scrollbar" style="height: 836px">
                <table class="w-full text-left border-separate border-spacing-0 min-w-[1800px] table-auto">
                    <thead class="sticky top-0 z-10">
                        <tr class="bg-[#00896F] text-white">
                            <th class="px-6 py-5 text-[13px] font-semibold rounded-tl-lg w-[250px]">Client ID</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[250px]">Client Name</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[150px]">Date Assigned</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[100px]">ERP</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[150px]">Industry</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[250px]">Expected Close</th>
                            <th class="px-6 py-5 text-[13px] font-semibold w-[200px]">Progress Indicator</th>
                            <th class="px-6 py-5 text-[13px] font-semibold rounded-tr-lg w-[150px] text-right pe-10">
                                View Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <template v-if="loading">
                            <tr v-for="n in perPage" :key="'sk'+n" class="h-[76px]">
                                <td class="px-6 py-5"><div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 90px"></div></td>
                                <td class="px-6 py-5"><div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 150px"></div></td>
                                <td class="px-6 py-5"><div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 80px"></div></td>
                                <td class="px-6 py-5"><div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 50px"></div></td>
                                <td class="px-6 py-5"><div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 90px"></div></td>
                                <td class="px-6 py-5"><div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 80px"></div></td>
                                <td class="px-6 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="w-24 h-2 rounded-full animate-pulse" :class="skelClass"></div>
                                        <div class="h-3.5 w-7 rounded animate-pulse" :class="skelClass"></div>
                                    </div>
                                </td>
                                <td class="px-6 py-5 pe-8">
                                    <div class="h-9 w-28 rounded-md animate-pulse ml-auto" :class="skelClass"></div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="tableData.length === 0">
                            <tr class="h-[76px]">
                                <td colspan="8" class="px-6 py-5 text-sm text-gray-400 text-center">No clients found.</td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="item in tableData" :key="item.id"
                                class="group hover:bg-gray-50/50 transition-colors h-[76px]">
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

                                <td class="px-6 py-5 pe-8 ">
                                    <button @click="$emit('go-to-project', item)"
                                        class="bg-[#00AD5FCC] hover:bg-[#00896F] hover:text-white text-white px-5 py-2 rounded-md text-xs font-bold shadow-sm active:scale-95 transition-all whitespace-nowrap">
                                        Go to Project
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div class="px-2 pb-2">
                <CommonPaginationBar :meta="meta" :loading="loading" :per-page-options="[20, 30, 50]"
                    @page-change="p => fetchClients(p)" @per-page-change="p => fetchClients(1, p)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
const emit = defineEmits(['go-to-project'])

const { getMyClients } = useImplementation()
const { isDark } = useTheme()

const loading = ref(false)
const search = ref('')
const page = ref(1)
const perPage = ref(20)
const total = ref(0)

const meta = computed(() => ({
    current_page: page.value,
    per_page: perPage.value,
    total: total.value,
    last_page: Math.max(1, Math.ceil(total.value / perPage.value)),
}))

const skelClass = computed(() => (isDark.value ? 'bg-gray-300' : 'bg-gray-100'))

const tableData = ref([])

async function fetchClients(newPage = page.value, newPerPage = perPage.value) {
    loading.value = true
    page.value = newPage
    perPage.value = newPerPage
    try {
        const res = await getMyClients({ page: newPage, perPage: newPerPage, search: search.value.trim() })
        total.value = res.total
        tableData.value = res.data.map(item => ({
            id:          item.client_id,
            clientId:    item.client_id,
            name:        item.client_name,
            date:        item.date_assigned ?? '-',
            erp:         item.erp ?? '-',
            industry:    item.industry ?? '-',
            close:       item.expected_date_to_close ?? '-',
            progress:    item.progress_indicator ?? 0,
        }))
    } finally {
        loading.value = false
    }
}

let searchTimer = null
watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => fetchClients(1), 350)
})

onMounted(() => fetchClients())

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
