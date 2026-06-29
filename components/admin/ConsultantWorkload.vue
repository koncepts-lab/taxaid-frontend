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
                <input type="text" :placeholder="currentLang === 'ar' ? 'بحث باسم العميل...' : 'Search...'"
                    class="w-full py-3 border rounded-xl text-sm outline-none transition-all" :class="[
                        currentLang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left',
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#04C18F80] text-black'
                    ]" />
            </div>
            <div class="flex items-center gap-3">
                <button @click="loadWorkload" :disabled="loading" class="p-3 border rounded-xl transition-all"
                    :class="[isDark ? 'bg-white/5 border-white/10 text-[#00B794]' : 'bg-white hover:bg-[#86E4CB] border-[#04C18F80] text-[#00896F]', loading ? 'opacity-50 cursor-not-allowed' : '']">
                    <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5" :class="loading ? 'animate-spin' : ''">
                </button>


            </div>
        </div>

        <!-- Main Data Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr class="text-[#1A1A1A] font-medium text-sm border-b border-gray-50">
                        <th class="px-6 py-5 font-medium">Consultant Name</th>
                        <th class="px-6 py-5 text-center font-medium">New</th>
                        <th class="px-6 py-5 text-center font-medium">Ongoing</th>
                        <th class="px-6 py-5 text-center font-medium">Critical</th>
                        <th class="px-6 py-5 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="consultant in consultants" :key="consultant.name"
                        class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-5 text-sm text-gray-700">{{ consultant.name }}</td>
                        <td class="px-6 py-5 text-sm text-center text-gray-700">{{ consultant.new }}</td>
                        <td class="px-6 py-5 text-sm text-center text-gray-700">{{ consultant.ongoing }}</td>
                        <td class="px-6 py-5 text-sm text-center text-gray-700">{{ consultant.critical }}</td>
                        <td class="px-6 py-5">
                            <button @click="openModal(consultant)"
                                class="bg-[#FFF085] hover:bg-[#FDE047] text-black border border-black/10 text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                                View details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Details Modal -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <!-- Modal Header -->
                <div class="flex items-center justify-between px-8 py-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                        Consultant Workload Details - {{ selectedConsultant?.name }}
                    </h2>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Modal Content with Blue Border Box -->
                <div class=" pb-8">
                    <div class=" rounded-lg overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="text-[#1A1A1A] font-medium text-sm border-b border-gray-100">
                                    <th class="px-6 py-4 w-1/2">Project Name</th>
                                    <th class="px-6 py-4 text-center">New</th>
                                    <th class="px-6 py-4 text-center">Ongoing</th>
                                    <th class="px-6 py-4 text-center">Critical</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="project in projectDetails" :key="project.id" class="text-sm">
                                    <td class="px-6 py-4 text-gray-700 font-medium">{{ project.name }}</td>

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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: { type: String, default: 'en' } })
const { getConsultantWorkload, getConsultantWorkloadDetails } = useImplementation()

const showModal = ref(false)
const selectedConsultant = ref(null)
const loading = ref(false)
const detailsLoading = ref(false)

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

async function loadWorkload() {
    loading.value = true
    try {
        const data = await getConsultantWorkload()
        consultants.value = data.map(c => ({
            consultant_id: c.consultant_id,
            name:          c.consultant_name,
            new:           c.new_projects,
            ongoing:       c.ongoing_projects,
            critical:      c.critical_projects,
        }))
    } finally {
        loading.value = false
    }
}

onMounted(loadWorkload)

const openModal = async (consultant) => {
    selectedConsultant.value = consultant
    showModal.value = true
    detailsLoading.value = true
    projectDetails.value = []
    try {
        const data = await getConsultantWorkloadDetails(consultant.consultant_id)
        projectDetails.value = data.map((p, i) => ({
            id:       i + 1,
            name:     p.project_name,
            isNew:     !!p.new,
            isOngoing: !!p.ongoing,
            isCritical: !!p.critical,
        }))
    } finally {
        detailsLoading.value = false
    }
}
</script>