<template>
    <div class="space-y-6">
        <!-- 1. Sub-tabs -->
        <div class="flex bg-white p-1.5 rounded-full shadow-sm w-full border border-gray-100 transition-all duration-300"
            :class="isDark ? 'bg-[#013E32] border-white/5' : 'bg-white'">
            <button v-for="sub in subTabs" :key="sub.id" @click="activeSubTab = sub.id"
                class="flex-1 px-4 py-2.5 rounded-full text-base font-normal transition-all duration-300 whitespace-nowrap"
                :class="activeSubTab === sub.id
                    ? (isDark ? 'bg-[#00B794] text-white shadow-lg' : 'bg-[#68FFD6] text-black shadow-sm')
                    : (isDark ? 'text-white/60 hover:text-white' : 'text-black hover:text-black')">
                {{ currentLang === 'ar' ? sub.labelAr : sub.label }} ({{ sub.count }})
            </button>
        </div>

        <!-- 2. Content Card -->
        <div class="rounded-2xl border transition-all duration-300 p-8 space-y-6"
            :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30 text-white' : 'bg-white border-gray-100 shadow-sm text-black'">

            <div class="space-y-1 text-left rtl:text-right">
                <h3 class="text-xl font-normal">{{ currentLang === 'ar' ? currentTabConfig.titleAr :
                    currentTabConfig.title }}</h3>
                <p class="text-base text-[#717182]">{{ currentLang === 'ar' ? currentTabConfig.subAr :
                    currentTabConfig.sub }}</p>
            </div>

            <!-- Search bar Row -->
            <div class="flex flex-col md:flex-row items-center gap-3">
                <div class="relative flex-1 w-full">
                    <span
                        class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 rtl:left-auto rtl:right-0 rtl:pr-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
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
                    <button class="p-3 border rounded-xl"
                        :class="isDark ? 'bg-white/5 border-white/10 text-[#00B794]' : 'bg-white hover:bg-[#86E4CB] border-[#04C18F80] text-[#00896F]'">
                        <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5">
                    </button>

                    <div v-if="activeSubTab === 'ongoing'" class="relative">
                        <button @click.stop="openDropdown($event, 'filter', null)"
                            class="flex items-center gap-3 px-4 py-3 bg-white border border-[#04C18F80] rounded-xl text-sm text-[#717182] transition-all">
                            <span>{{ selectedFilter }}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="3" :class="{ 'rotate-180': openDropdownId === 'filter-global' }">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3. Dynamic Table -->
            <div class="overflow-x-auto border rounded-xl transition-colors"
                :class="isDark ? 'border-white/10' : 'border-gray-100'">
                <!-- Increased min-width to 2200px to accommodate all columns in "All Projects" -->
                <table class="w-full text-left rtl:text-right border-separate border-spacing-0 min-w-[2200px]">
                    <thead>
                        <tr class="bg-[#00896F] text-white">
                            <th v-for="h in translatedHeaders" :key="h"
                                class="px-4 py-4 text-sm font-normal tracking-wider  last:border-0">
                                {{ h }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
                        <tr v-for="client in activeTableData" :key="client.id"
                            class="hover:bg-gray-50/50 transition-colors">
                            <!-- 1. ID -->
                            <td class="px-4 py-5 text-sm text-black tabular-nums">{{ client.id }}</td>
                            <!-- 2. Name -->
                            <td class="px-4 py-5 text-sm ">{{ client.name }}</td>
                            <!-- 3. Date -->
                            <td class="px-4 py-5 text-sm ">{{ client.date }}</td>
                            <!-- 4. ERP -->
                            <td class="px-4 py-5 text-sm">{{ client.erp }}</td>

                            <!-- 5. Industry (Visible in New, Completed, All) -->
                            <td v-if="['new', 'completed', 'all'].includes(activeSubTab)" class="px-4 py-5 text-sm">
                                {{ client.industry || '-' }}
                            </td>

                            <!-- 6. Status/Connector (Visible in New, Ongoing, All) -->
                            <td v-if="['new', 'ongoing', 'all'].includes(activeSubTab)" class="px-4 py-5">
                                <div v-if="activeSubTab === 'new' || (activeSubTab === 'all' && !client.status)"
                                    class="relative w-44">
                                    <button @click.stop="openDropdown($event, 'conn', client)"
                                        class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border border-transparent transition-all"
                                        :class="[isDark ? 'bg-white/5 text-white' : 'bg-[#F3F4F6] text-black', openDropdownId === 'conn-' + client.id ? 'border-[#00896F] bg-white ring-1 ring-[#00896F]/20' : '']">
                                        <span>{{ client.connectorStatus || '-' }}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="3"
                                            :class="{ 'rotate-180': openDropdownId === 'conn-' + client.id }"
                                            class="transition-transform">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                </div>
                                <span v-else-if="client.status" class="px-3 py-0.5 rounded-full text-sm "
                                    :class="getStatusPillClass(client.status)">{{ client.status }}</span>
                                <span v-else>-</span>
                            </td>

                            <!-- 7. Progress Indicator (Visible in Ongoing, All) -->
                            <td v-if="['ongoing', 'all'].includes(activeSubTab)" class="px-4 py-5">
                                <div v-if="client.progress !== undefined" class="flex items-center gap-3 w-40">
                                    <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div class="h-full transition-all duration-700"
                                            :style="{ width: (client.progress / 15 * 100) + '%', backgroundColor: getProgressHex(client.progress) }">
                                        </div>
                                    </div>
                                    <span class="text-xs font-bold text-gray-700 tabular-nums">{{ client.progress
                                    }}/15</span>
                                </div>
                                <span v-else>-</span>
                            </td>

                            <!-- 8. Mobile Number (Visible in New, All) -->
                            <td v-if="['new', 'all'].includes(activeSubTab)"
                                class="px-4 py-5 text-sm whitespace-nowrap">{{ client.phone || '-' }}</td>

                            <!-- 9. Email (Visible in New, All) -->
                            <td v-if="['new', 'all'].includes(activeSubTab)" class="px-4 py-5 text-sm">{{ client.email
                                || '-' }}</td>

                            <!-- 10. End Date (Visible in Ongoing, Completed, All) -->
                            <td v-if="['ongoing', 'completed', 'all'].includes(activeSubTab)"
                                class="px-4 py-5 text-sm opacity-70">{{ client.endDate || '-' }}</td>

                            <!-- 11. Overrun (Visible in Ongoing, Completed, All) -->
                            <td v-if="['ongoing', 'completed', 'all'].includes(activeSubTab)"
                                class="px-4 py-5 text-sm font-semibold"
                                :class="client.overrun && client.overrun !== '-' ? 'text-[#FF3D00]' : 'text-gray-400'">
                                {{ client.overrun || '-' }}</td>

                            <!-- 12. Consultant Column (Visible in All Tabs) -->
                            <td class="px-4 py-5">
                                <div v-if="activeSubTab === 'new'" class="relative w-56">
                                    <button @click.stop="openDropdown($event, 'cons', client)"
                                        class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border border-transparent transition-all"
                                        :class="[isDark ? 'bg-white/5 text-white' : 'bg-[#F3F4F6] text-black', openDropdownId === 'cons-' + client.id ? 'border-[#00896F] bg-white ring-1 ring-[#00896F]/20' : '']">
                                        <span :class="!client.consultant ? 'opacity-40' : ''">{{ client.consultant ||
                                            'Select Consultant' }}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="3"
                                            :class="{ 'rotate-180': openDropdownId === 'cons-' + client.id }"
                                            class="transition-transform">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                </div>
                                <span v-else class="text-sm font-medium">{{ client.consultant || '-' }}</span>
                            </td>

                            <!-- 13. Assign Action (New only) -->
                            <td v-if="activeSubTab === 'new'" class="px-4 py-5 pe-8">
                                <button @click="assignProject(client)" :disabled="!client.consultant"
                                    class="bg-[#00B68D] hover:bg-[#006552] text-white px-6 py-2 rounded-md text-xs font-bold">Assign</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="openDropdownId"
                    class="absolute z-[9999] bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.2)] border border-gray-100 p-2 overflow-hidden"
                    :style="{ top: dropdownPos.top + 'px', left: dropdownPos.left + 'px', width: dropdownPos.width + 'px' }">
                    <div v-for="opt in dropdownItems" :key="opt" @click.stop="handleSelect(opt)"
                        class="px-4 py-2.5 text-xs rounded-xl cursor-pointer transition-colors hover:bg-[#E6FDF9] hover:text-[#00896F]"
                        :class="isOptionSelected(opt) ? 'bg-[#E6FDF9] text-[#00896F] font-bold' : 'text-gray-700'">
                        {{ opt }}
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: { type: String, default: 'en' } })

const activeSubTab = ref('new')
const openDropdownId = ref(null)
const dropdownPos = ref({ top: 0, left: 0, width: 0 })
const activeClient = ref(null)
const activeDropdownType = ref(null)
const selectedFilter = ref('All Connector Statuses')

// --- 1. MOCK DATA STORE ---
const mockData = ref({
    'new': [{ id: 'client-7', name: 'Logistics Express Inc.', date: '01/10/2026', erp: 'SAP', industry: 'Logistics', connectorStatus: 'Pending', phone: '+ 123 123 123', email: 'sarah@gmail.com', consultant: '' }],
    'ongoing': [{ id: 'client-11', name: 'Al Dhabi Contracting', date: '01/10/2026', erp: 'SAP', status: 'Pending', progress: 8, endDate: '01/10/2026', overrun: '+5 days', consultant: 'Sarah Johnson' }],
    'completed': [{ id: 'client-134', name: 'Maritime Logistics', date: '01/10/2026', erp: 'Oracle', industry: 'Maritime', status: 'Connected', progress: 15, endDate: '01/10/2026', overrun: '-', consultant: 'Sarah Johnson' }]
})

// --- 2. DYNAMIC COMPUTE FOR "ALL" DATA ---
const activeTableData = computed(() => {
    if (activeSubTab.value === 'all') {
        return [...mockData.value.new, ...mockData.value.ongoing, ...mockData.value.completed]
    }
    const data = mockData.value[activeSubTab.value]
    if (activeSubTab.value === 'ongoing' && selectedFilter.value !== 'All Connector Statuses') {
        return data.filter(c => c.status === selectedFilter.value)
    }
    return data
})

const subTabs = computed(() => [
    { id: 'new', label: 'New', labelAr: 'جديد', count: mockData.value.new.length },
    { id: 'ongoing', label: 'Ongoing', labelAr: 'قيد التنفيذ', count: mockData.value.ongoing.length },
    { id: 'completed', label: 'Completed', labelAr: 'مكتمل', count: mockData.value.completed.length },
    { id: 'all', label: 'All Projects', labelAr: 'جميع المشاريع', count: mockData.value.new.length + mockData.value.ongoing.length + mockData.value.completed.length },
])

const tabConfigs = {
    'new': { title: 'New Clients', titleAr: 'عملاء جدد', sub: 'Assign consultants to projects', headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry', 'Connector', 'Mobile Number', 'Email', 'Consultant', 'Action'], headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الصناعة', 'الموصل', 'الهاتف', 'البريد', 'المستشار', 'إجراء'] },
    'ongoing': { title: 'Ongoing Projects', titleAr: 'مشاريع قيد التنفيذ', sub: 'Track progress and assignments', headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Status', 'Progress Indicator', 'Expected Close', 'Overrun', 'Consultant ID'], headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الحالة', 'مؤشر التقدم', 'تاريخ الإغلاق', 'التجاوز', 'المستشار'] },
    'completed': { title: 'Completed Projects', titleAr: 'المشاريع المكتملة', sub: 'Successfully completed projects', headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry', 'Go Live Date', 'Overrun', 'Consultant ID'], headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الصناعة', 'تاريخ الإطلاق', 'التجاوز', 'المستشار'] },
    'all': {
        title: 'All Projects', titleAr: 'جميع المشاريع', sub: 'Complete project implementation history',
        headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry', 'Status/Connector', 'Progress', 'Mobile', 'Email', 'End Date', 'Overrun', 'Consultant'],
        headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الصناعة', 'الحالة', 'التقدم', 'الهاتف', 'البريد', 'تاريخ الانتهاء', 'التجاوز', 'المستشار']
    }
}

const currentTabConfig = computed(() => tabConfigs[activeSubTab.value] || tabConfigs['new'])
const translatedHeaders = computed(() => props.currentLang === 'ar' ? currentTabConfig.value.headersAr : currentTabConfig.value.headers)

// Logic helpers (Pills, Progress, Dropdowns) same as before...
const getProgressHex = (val) => val >= 10 ? '#00896F' : val >= 6 ? '#F59E0B' : '#FF3D00'
const getStatusPillClass = (status) => {
    if (status === 'Pending') return 'bg-[#FEF9C2] text-[#CE8600]'
    if (status.includes('Manual')) return 'bg-[#D0FAE5] text-[#007C65]'
    return 'bg-[#DBEAFE] text-[#193CB8]'
}
const isOptionSelected = (opt) => {
    if (activeDropdownType.value === 'filter') return selectedFilter.value === opt
    if (!activeClient.value) return false
    return activeDropdownType.value === 'conn' ? activeClient.value.connectorStatus === opt : activeClient.value.consultant === opt
}
const openDropdown = (event, type, client) => {
    const id = client ? `${type}-${client.id}` : 'filter-global'
    if (openDropdownId.value === id) { openDropdownId.value = null; return }
    activeClient.value = client; activeDropdownType.value = type
    const rect = event.currentTarget.getBoundingClientRect()
    dropdownPos.value = { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX, width: rect.width }
    openDropdownId.value = id
}
const handleSelect = (val) => {
    if (activeDropdownType.value === 'filter') selectedFilter.value = val
    else if (activeClient.value) { if (activeDropdownType.value === 'conn') activeClient.value.connectorStatus = val; else activeClient.value.consultant = val }
    openDropdownId.value = null
}
const dropdownItems = computed(() => {
    if (activeDropdownType.value === 'filter') return ['All Connector Statuses', 'Pending', 'Manual Connector', 'Connected', 'Send']
    if (activeDropdownType.value === 'conn') return ['Pending', 'Manual Connected', 'Send', 'Connected']
    return ['Consultant A (3 active)', 'Consultant B (5 active)', 'Consultant C (6 active)']
})
const assignProject = (client) => {
    mockData.value.new = mockData.value.new.filter(c => c.id !== client.id)
    mockData.value.ongoing.unshift({ ...client, status: 'Pending', progress: 0, endDate: '01/12/2026', overrun: '-' })
}
onMounted(() => { window.addEventListener('click', (e) => { if (!e.target.closest('button')) openDropdownId.value = null }) })
</script>