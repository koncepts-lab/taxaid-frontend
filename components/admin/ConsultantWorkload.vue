<template>
    <div class="space-y-6">
        <!-- Search and Refresh Section -->
        <div class="flex flex-col md:flex-row items-center gap-3">
            <div class="relative flex-1 w-full">
                <span
                    class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 rtl:left-auto rtl:right-0 rtl:pr-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </span>
                <input type="text" v-model="search" :placeholder="currentLang === 'ar' ? 'بحث باسم المستشار...' : 'Search consultants...'"
                    class="w-full py-3 border rounded-xl text-sm outline-none transition-all" :class="[
                        currentLang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left',
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#04C18F80] text-black'
                    ]" />
            </div>
            <div class="flex items-center gap-3">
                <button @click="resetAndReload" :disabled="loading" title="Reset filters and reload" class="p-3 border rounded-xl transition-all"
                    :class="[isDark ? 'bg-white/5 border-white/10 text-[#00B794]' : 'bg-white hover:bg-[#86E4CB] border-[#04C18F80] text-[#00896F]', loading ? 'opacity-50 cursor-not-allowed' : '']">
                    <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5" :class="loading ? 'animate-spin' : ''">
                </button>


            </div>
        </div>

        <!-- Main Data Table -->
        <div class="rounded-2xl shadow-sm border overflow-x-auto min-h-[440px] transition-colors"
            :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'">
            <table class="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr class="font-medium text-sm border-b" :class="isDark ? 'text-white border-white/10' : 'text-[#1A1A1A] border-gray-50'">
                        <th class="px-6 py-5 font-medium">Consultant Name</th>
                        <th class="px-6 py-5 text-center font-medium">New</th>
                        <th class="px-6 py-5 text-center font-medium">Ongoing</th>
                        <th class="px-6 py-5 text-center font-medium">Critical</th>
                        <th class="px-6 py-5 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody :class="isDark ? 'divide-y divide-white/10' : 'divide-y divide-gray-50'">
                    <template v-if="loading">
                        <tr v-for="n in workloadMeta.per_page" :key="'sk'+n" class="h-[68px]">
                            <td v-for="c in 5" :key="c" class="px-6 py-5">
                                <div class="h-4 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'" style="width: 70%"></div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else-if="!consultants.length">
                        <td colspan="5" class="px-6 py-10 text-center text-sm" :class="isDark ? 'text-white/40' : 'text-gray-400'">No consultants found.</td>
                    </tr>
                    <tr v-else v-for="consultant in consultants" :key="consultant.name"
                        class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'">
                        <td class="px-6 py-5 text-sm" :class="isDark ? 'text-white/90' : 'text-gray-700'">{{ consultant.name }}</td>
                        <td class="px-6 py-5 text-sm text-center" :class="isDark ? 'text-white/90' : 'text-gray-700'">{{ consultant.new }}</td>
                        <td class="px-6 py-5 text-sm text-center" :class="isDark ? 'text-white/90' : 'text-gray-700'">{{ consultant.ongoing }}</td>
                        <td class="px-6 py-5 text-sm text-center" :class="isDark ? 'text-white/90' : 'text-gray-700'">{{ consultant.critical }}</td>
                        <td class="px-6 py-5">
                            <button @click="openModal(consultant)"
                                class="border text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                                :class="isDark ? 'bg-[#FFF085]/90 hover:bg-[#FDE047] text-black border-black/10' : 'bg-[#FFF085] hover:bg-[#FDE047] text-black border-black/10'">
                                View details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <CommonPaginationBar v-if="workloadMeta.total > 10" :meta="workloadMeta" :loading="loading" :dark="isDark"
            :per-page-options="[10, 20, 50]"
            @page-change="p => loadWorkload(p)" @per-page-change="p => loadWorkload(1, p)" />

        <!-- Details Modal -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                class="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors"
                :class="isDark ? 'bg-[#001410] border border-white/10' : 'bg-white'">
                <!-- Modal Header -->
                <div class="flex items-center justify-between px-8 py-6">
                    <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                        Consultant Workload Details - {{ selectedConsultant?.name }}
                    </h2>
                    <button @click="showModal = false" class="transition-colors" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Modal Content with Blue Border Box -->
                <div class="pb-4 px-2">
                    <div class="rounded-lg overflow-hidden">
                        <div class="overflow-y-auto min-h-[520px]" style="max-height: 520px">
                            <table class="w-full text-left border-collapse">
                                <thead class="sticky top-0 z-10" :class="isDark ? 'bg-[#001410]' : 'bg-white'">
                                    <tr class="font-medium text-sm border-b" :class="isDark ? 'text-white border-white/10' : 'text-[#1A1A1A] border-gray-100'">
                                        <th class="px-6 py-4 w-1/2">Project Name</th>
                                        <th class="px-6 py-4 text-center">New</th>
                                        <th class="px-6 py-4 text-center">Ongoing</th>
                                        <th class="px-6 py-4 text-center">Critical</th>
                                    </tr>
                                </thead>
                                <tbody :class="isDark ? 'divide-y divide-white/10' : 'divide-y divide-gray-100'">
                                    <template v-if="detailsLoading">
                                        <tr v-for="n in detailsMeta.per_page" :key="'sk'+n" class="h-[56px]">
                                            <td v-for="c in 4" :key="c" class="px-6 py-4">
                                                <div class="h-4 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'" style="width: 60%"></div>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr v-else-if="!projectDetails.length">
                                        <td colspan="4" class="px-6 py-10 text-center text-sm" :class="isDark ? 'text-white/40' : 'text-gray-400'">No projects assigned.</td>
                                    </tr>
                                    <tr v-else v-for="project in projectDetails" :key="project.id" class="text-sm">
                                        <td class="px-6 py-4 font-medium" :class="isDark ? 'text-white/90' : 'text-gray-700'">{{ project.name }}</td>

                                        <!-- New Column -->
                                        <td class="px-6 py-4 text-center">
                                            <div v-if="project.isNew" class="flex justify-center">
                                                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </td>

                                        <!-- Ongoing Column -->
                                        <td class="px-6 py-4 text-center">
                                            <div v-if="project.isOngoing" class="flex justify-center">
                                                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </td>

                                        <!-- Critical Column -->
                                        <td class="px-6 py-4 text-center">
                                            <div v-if="project.isCritical" class="flex justify-center">
                                                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <CommonPaginationBar v-if="detailsMeta.total > 20" class="px-6 pt-4" :meta="detailsMeta" :loading="detailsLoading" :dark="isDark"
                            :per-page-options="[20, 50, 100]"
                            @page-change="p => loadDetailsPage(p)" @per-page-change="p => loadDetailsPage(1, p)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: { type: String, default: 'en' } })
const { getConsultantWorkload, getConsultantWorkloadDetails } = useImplementation()

const showModal = ref(false)
const selectedConsultant = ref(null)
const loading = ref(false)
const detailsLoading = ref(false)
const search = ref('')
const workloadMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })

// --- MOCK DATA (commented out — replaced by API) ---
// const consultants = [
//     { name: 'Sarah Johnson', new: 1, ongoing: 3, critical: 1 },
//     { name: 'Michael Chen', new: 0, ongoing: 3, critical: 0 },
//     { name: 'Emily Rodriguez', new: 2, ongoing: 4, critical: 2 },
//     { name: 'David Kumar', new: 1, ongoing: 3, critical: 1 },
//     { name: 'Lisa Anderson', new: 0, ongoing: 2, critical: 0 },
// ]
// const projectDetails = ref([
//     { id: 1, name: 'Mining Resources Ltd.', status: 'new' },
//     { id: 2, name: 'Finance First Bank', status: 'ongoing' },
//     { id: 3, name: 'Automative Dynamics LLC', status: 'ongoing' },
//     { id: 4, name: 'Telecom Networks Inc.', status: 'ongoing' },
//     { id: 5, name: 'Energy Solutions Group', status: 'critical' },
// ])

const consultants = ref([])
const projectDetails = ref([])

async function loadWorkload(page = workloadMeta.value.current_page, perPage = workloadMeta.value.per_page) {
    loading.value = true
    try {
        const res = await getConsultantWorkload({ search: search.value.trim() || undefined, page, perPage })
        consultants.value = res.data.map(c => ({
            consultant_id: c.consultant_id,
            name:          c.consultant_name,
            new:           c.new_projects,
            ongoing:       c.ongoing_projects,
            critical:      c.critical_projects,
        }))
        workloadMeta.value = {
            current_page: res.page,
            per_page: res.per_page,
            total: res.total,
            last_page: Math.max(1, Math.ceil(res.total / res.per_page)),
        }
    } finally {
        loading.value = false
    }
}

let workloadSearchTimer = null
watch(search, () => {
    clearTimeout(workloadSearchTimer)
    workloadSearchTimer = setTimeout(() => loadWorkload(1), 350)
})

onMounted(() => loadWorkload())

const detailsMeta = ref({ current_page: 1, per_page: 20, total: 0, last_page: 1 })

const openModal = async (consultant) => {
    selectedConsultant.value = consultant
    showModal.value = true
    detailsMeta.value = { current_page: 1, per_page: 20, total: 0, last_page: 1 }
    await loadDetailsPage(1)
}

async function loadDetailsPage(page = detailsMeta.value.current_page, perPage = detailsMeta.value.per_page) {
    detailsLoading.value = true
    try {
        const res = await getConsultantWorkloadDetails(selectedConsultant.value.consultant_id, { page, perPage })
        projectDetails.value = res.data.map((p, i) => ({
            id:       (page - 1) * perPage + i + 1,
            name:     p.project_name,
            isNew:     !!p.new,
            isOngoing: !!p.ongoing,
            isCritical: !!p.critical,
        }))
        detailsMeta.value = {
            current_page: res.page,
            per_page: res.per_page,
            total: res.total,
            last_page: Math.max(1, Math.ceil(res.total / res.per_page)),
        }
    } finally {
        detailsLoading.value = false
    }
}

function resetAndReload() {
    search.value = ''
    loadWorkload(1)
}
</script>