<template>
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div class="mb-6 px-2">
            <h2 class="text-xl font-normal text-black">
                {{ role === 'vp' ? 'Tickets for Technical Review' : 'Tickets Table' }}
            </h2>
            <p class="text-base text-black/50">
                {{ role === 'vp' ? 'Score technical feasibility and estimate implementation costs.' :
                    (subtextMap[activeTab] || 'Review tickets awaiting your decision.') }}
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-0">
                <thead class="bg-[#00896F] text-white">
                    <tr>
                        <th class="p-4 rounded-tl-xl font-normal text-sm">Ticket ID</th>
                        <th class="p-4 font-normal text-sm">Title</th>

                        <!-- VP Specific Header -->
                        <th v-if="role === 'vp' || role === 'manager' || role === 'team_lead' || role === 'tech_team' || role === 'team_member'"
                            class="p-4 font-normal text-sm">Type</th>
                        <th v-if="role === 'team_lead'" class="p-4 font-normal text-sm">Created by</th>

                        <!-- Admin Specific Headers -->
                        <th v-if="role === 'admin'" class="p-4 font-normal text-sm">Department</th>
                        <th v-if="role === 'admin'" class="p-4 text-center font-normal text-sm">Manager</th>
                        <th v-if="role === 'admin' || role === 'manager' || role === 'team_lead' || role === 'team_member'"
                            class="p-4 text-center font-normal text-sm">
                            Overall Score</th>

                        <!-- VP Specific Score Headers -->
                        <th v-if="role === 'vp' || role === 'tech_team'" class="p-4 text-center font-normal text-sm">
                            Lead
                            Score</th>
                        <th v-if="role === 'vp' || role === 'tech_team'" class="p-4 text-center font-normal text-sm">
                            Tech score</th>

                        <th v-if="role !== 'team_lead' && role !== 'team_member'"
                            class="p-4 text-center font-normal text-sm">Cost</th>
                        <th class="p-4 text-center font-normal text-sm">Status</th>
                        <th v-if="role === 'team_member'" class="p-4 font-normal text-sm">Created</th>

                        <th class="p-4 rounded-tr-xl text-center font-normal text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 border-x border-b border-gray-100 rounded-b-xl">
                    <tr v-for="row in data" :key="row.id" class="group hover:bg-gray-50/80 transition-colors">
                        <td class="px-4 py-4 text-sm font-normal text-gray-500">{{ row.id }}</td>
                        <td class="p-4 text-sm font-normal text-black">{{ row.title }}</td>

                        <!-- VP: Type Column -->
                        <td v-if="role === 'vp' || role === 'manager' || role === 'team_lead' || role === 'tech_team' || role === 'team_member'"
                            class="p-4">
                            <span class="px-3 border border-black/10 rounded-full text-xs text-black whitespace-nowrap">
                                {{ row.type || 'Feature Suggestion' }}
                            </span>
                        </td>
                        <td v-if="role === 'team_lead'" class="p-4 text-sm text-black">
                            {{ row.created_by }}
                        </td>

                        <!-- Admin: Dept & Manager -->
                        <td v-if="role === 'admin'" class="p-4 text-sm text-black">{{ row.department }}</td>
                        <td v-if="role === 'admin'" class="p-4 text-center">
                            <span
                                class="px-2 bg-white border border-black/10 rounded-full text-xs font-normal text-[#535353] tracking-tight">
                                {{ row.manager }}
                            </span>
                        </td>


                        <td v-if="role === 'admin' || role === 'manager' || role === 'team_lead' || role === 'team_member'"
                            class="p-4">
                            <div class="flex justify-center">
                                <span v-if="row.score"
                                    class="flex items-center gap-2 px-3 border rounded-full text-sm font-normal transition-all"
                                    :class="getScoreClasses(row.score)">
                                    <div v-html="tripleCircleSvg"></div> {{ row.score }}/10
                                </span>

                                <span v-else class="text-sm font-normal text-gray-400">
                                    Not Scored
                                </span>
                            </div>
                        </td>

                        <td v-if="role === 'vp' || role === 'tech_team'" class="p-4">
                            <div class="flex justify-center">
                                <span v-if="row.leadScore"
                                    class="flex items-center gap-2 px-3 border rounded-full text-sm font-normal transition-all"
                                    :class="getScoreClasses(row.leadScore)">
                                    <div v-html="tripleCircleSvg"></div> {{ row.leadScore }}/10
                                </span>

                                <span v-else class="text-sm font-normal text-gray-400">
                                    Not Scored
                                </span>
                            </div>
                        </td>
                        <td v-if="role === 'vp' || role === 'tech_team'" class="p-4">
                            <div v-if="row.techScore" class="flex justify-center">
                                <span
                                    class="flex items-center gap-2 px-3 border rounded-full text-sm font-normal transition-all"
                                    :class="getScoreClasses(row.techScore)">
                                    <div v-html="tripleCircleSvg"></div> {{ row.techScore }}/10
                                </span>
                            </div>

                            <div v-else class="flex justify-center">
                                <span class="text-sm font-normal text-gray-400 whitespace-nowrap">
                                    Not Scored
                                </span>
                            </div>
                        </td>

                        <td v-if="role !== 'team_lead' && role !== 'team_member'" class="p-4 text-center">
                            <span v-if="row.cost && row.cost !== '-'"
                                class="px-4 bg-[#EFF6FF] text-[#1E40AF] rounded-full text-xs font-normal border border-[#DBEAFE]">
                                {{ row.cost }}
                            </span>

                            <span v-else class="text-sm font-normal text-gray-400">
                                -
                            </span>
                        </td>

                        <td class="p-4 text-center">
                            <span class="px-4 py-0.5 rounded-full text-xs font-normal transition-all"
                                :class="getStatusClasses(row.status)">
                                {{ row.status }}
                            </span>
                        </td>
                        <td v-if="role === 'team_member'" class="p-4 text-sm text-black">
                            {{ row.created }}
                        </td>
                        <!-- ACTIONS COLUMN -->
                        <td class="p-4 text-center pe-6">
                            <div class="flex items-center justify-center gap-2">

                                <!-- ADMIN ACTIONS -->
                                <template v-if="role === 'admin'">
                                    <button v-if="activeTab === 'manager approved' || activeTab === 'flagged'"
                                        @click="$emit('open-ticket', { ticket: row, mode: 'review' })"
                                        class="flex items-center gap-2 bg-[#00AD5FCC] hover:bg-[#00896F] text-white px-2 py-2 rounded-lg text-sm font-normal transition-all active:scale-95 shadow-sm">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2.5">
                                            <path
                                                d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                        </svg>
                                        Review & Decide
                                    </button>
                                    <button v-else @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                        class="p-2 border border-black/10 hover:bg-gray-200 text-black rounded-lg transition-all active:scale-90">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </template>

                                <!-- VP ACTIONS (Matches Figma) -->
                                <template v-if="role === 'vp'">
                                    <!-- Review Button (For Tech Scored tickets) -->
                                    <button v-if="row.status.toLowerCase().includes('tech scored')"
                                        @click="$emit('open-ticket', { ticket: row, mode: 'review' })"
                                        class="flex items-center gap-2 bg-[#00AD5FCC] hover:bg-[#00896F] text-white px-2 py-2 rounded-lg text-sm font-normal transition-all active:scale-95 shadow-sm">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2.5">
                                            <path
                                                d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                        </svg>
                                        Review
                                    </button>

                                    <!-- Start Dev Button (For Admin Approved tickets) -->
                                    <template v-else-if="row.status.toLowerCase().includes('admin approved')">
                                        <button @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                            class="p-2 border border-black/10 hover:bg-gray-200 text-black rounded-lg"><svg
                                                width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg></button>
                                        <button @click="showStartModal = true"
                                            class="flex items-center gap-2 bg-[#558AFF] hover:bg-[#3b71db] text-white px-1 py-2 rounded-md text-sm font-normal transition-all active:scale-95">
                                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M0.666992 2.00023C0.666923 1.76563 0.728756 1.53516 0.846248 1.33209C0.96374 1.12903 1.13273 0.960559 1.33616 0.843696C1.53959 0.726834 1.77025 0.665715 2.00485 0.666512C2.23946 0.667308 2.4697 0.729991 2.67233 0.848232L10.6703 5.51357C10.8722 5.63069 11.0397 5.79873 11.1563 6.0009C11.2728 6.20307 11.3343 6.4323 11.3345 6.66566C11.3347 6.89902 11.2736 7.12835 11.1574 7.33072C11.0412 7.5331 10.874 7.70143 10.6723 7.8189L2.67233 12.4856C2.4697 12.6038 2.23946 12.6665 2.00485 12.6673C1.77025 12.6681 1.53959 12.607 1.33616 12.4901C1.13273 12.3732 0.96374 12.2048 0.846248 12.0017C0.728756 11.7986 0.666923 11.5682 0.666992 11.3336V2.00023Z"
                                                    stroke="white" stroke-width="1.33333" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>

                                            Start Dev
                                        </button>
                                    </template>
                                    <template v-else-if="row.status.toLowerCase().includes('development')">
                                        <button @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                            class="p-2 border border-black/10 hover:bg-gray-200 text-black rounded-lg"><svg
                                                width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg></button>
                                        <button @click="showCompleteModal = true"
                                            class="flex items-center gap-2 bg-[#007C65] hover:bg-[#006B56] text-white px-1 py-2 rounded-md text-sm font-normal transition-all active:scale-95 shadow-sm">
                                            <!-- Hollow Play/Triangle Icon matching your screenshot -->
                                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M0.666992 2.00023C0.666923 1.76563 0.728756 1.53516 0.846248 1.33209C0.96374 1.12903 1.13273 0.960559 1.33616 0.843696C1.53959 0.726834 1.77025 0.665715 2.00485 0.666512C2.23946 0.667308 2.4697 0.729991 2.67233 0.848232L10.6703 5.51357C10.8722 5.63069 11.0397 5.79873 11.1563 6.0009C11.2728 6.20307 11.3343 6.4323 11.3345 6.66566C11.3347 6.89902 11.2736 7.12835 11.1574 7.33072C11.0412 7.5331 10.874 7.70143 10.6723 7.8189L2.67233 12.4856C2.4697 12.6038 2.23946 12.6665 2.00485 12.6673C1.77025 12.6681 1.53959 12.607 1.33616 12.4901C1.13273 12.3732 0.96374 12.2048 0.846248 12.0017C0.728756 11.7986 0.666923 11.5682 0.666992 11.3336V2.00023Z"
                                                    stroke="white" stroke-width="1.33333" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>

                                            Complete
                                        </button>
                                    </template>

                                    <!-- Default View for everything else -->
                                    <button v-else @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                        class="p-2 border border-black/10 hover:bg-gray-200 text-black rounded-lg transition-all active:scale-90">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </template>

                                <!-- MANAGER ACTIONS -->
                                <template v-if="role === 'team_lead'">
                                    <div class="flex items-center justify-center gap-2">

                                        <!-- CASE 1: Ticket needs manager review (Status: VP Approved) -->
                                        <button v-if="row.status.toLowerCase().includes('submitted')"
                                            @click="$emit('open-ticket', { ticket: row, mode: 'review' })"
                                            class="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-3 py-1.5 rounded-lg text-sm font-normal transition-all active:scale-95 shadow-sm">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2.5">
                                                <path
                                                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                            </svg>
                                            Review
                                        </button>

                                        <!-- CASE 2: Ticket already reviewed or finalized (Status: Manager Approved, etc.) -->
                                        <button v-else @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                            class="p-2 border border-black/10 hover:bg-gray-100 text-black rounded-lg transition-all active:scale-90">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>

                                    </div>
                                </template>

                                <template v-if="role === 'manager'">
                                    <div class="flex items-center justify-center gap-2">

                                        <!-- CASE 1: Ticket needs manager review (Status: VP Approved) -->
                                        <button v-if="row.status.toLowerCase().includes('vp approved')"
                                            @click="$emit('open-ticket', { ticket: row, mode: 'review' })"
                                            class="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-3 py-1.5 rounded-lg text-sm font-normal transition-all active:scale-95 shadow-sm">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2.5">
                                                <path
                                                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                            </svg>
                                            Review
                                        </button>

                                        <!-- CASE 2: Ticket already reviewed or finalized (Status: Manager Approved, etc.) -->
                                        <button v-else @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                            class="p-2 border border-black/10 hover:bg-gray-100 text-black rounded-lg transition-all active:scale-90">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>

                                    </div>
                                </template>
                                <template v-if="role === 'tech_team'">
                                    <div class="flex items-center justify-center gap-2">

                                        <!-- CASE 1: Ticket needs manager review (Status: VP Approved) -->
                                        <button v-if="row.status.toLowerCase().includes('team lead approved')"
                                            @click="$emit('open-ticket', { ticket: row, mode: 'review' })"
                                            class="flex items-center gap-2 bg-[#007C65] hover:bg-[#059669] text-white px-3 py-1.5 rounded-lg text-sm font-normal transition-all active:scale-95 shadow-sm">
                                            <div v-html="tripleCircleSvg"></div>
                                            Score
                                        </button>

                                        <!-- CASE 2: Ticket already reviewed or finalized (Status: Manager Approved, etc.) -->
                                        <button v-else @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                            class="p-2 border border-black/10 hover:bg-gray-100 text-black rounded-lg transition-all active:scale-90">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>

                                    </div>
                                </template>

                                <template v-if="role === 'team_member'">

                                    <button @click="$emit('open-ticket', { ticket: row, mode: 'view' })"
                                        class="p-2 border border-black/10 hover:bg-gray-200 text-black rounded-lg transition-all active:scale-90">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </template>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <DataSourceSettingsDeleteModal :isOpen="showCompleteModal" type="complete" @confirm="handleMarkDeveloped"
        @close="showCompleteModal = false" />
    <DataSourceSettingsDeleteModal :isOpen="showStartModal" type="start-dev" @confirm="handleStartDev"
        @close="showStartModal = false" />

</template>

<script setup>
import { ref } from 'vue' // 1. Import ref

const props = defineProps({
    data: Array,
    activeTab: String,
    role: { type: String, default: 'admin' } // Accepts 'admin' or 'vp'
})
const showStartModal = ref(false)
const showCompleteModal = ref(false)

// 3. Define the confirmation handlers
const handleStartDev = () => {
    console.log("Starting Development...")
    // Add your API logic here
    showStartModal.value = false // Close modal after action
}

const handleMarkDeveloped = () => {
    console.log("Marking as Developed...")
    // Add your API logic here
    showCompleteModal.value = false // Close modal after action
}
const tripleCircleSvg = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /><path d="M7.5 11.25C9.57107 11.25 11.25 9.57107 11.25 7.5C11.25 5.42893 9.57107 3.75 7.5 3.75C5.42893 3.75 3.75 5.42893 3.75 7.5C3.75 9.57107 5.42893 11.25 7.5 11.25Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /><path d="M7.5 8.75C8.19036 8.75 8.75 8.19036 8.75 7.5C8.75 6.80964 8.19036 6.25 7.5 6.25C6.80964 6.25 6.25 6.80964 6.25 7.5C6.25 8.19036 6.80964 8.75 7.5 8.75Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></g></svg>`

const subtextMap = {
    pending: 'Review tickets awaiting your decision.',
    developed: 'Track tickets that have been successfully developed',
    'in-dev': 'Track tickets currently being worked on by the development team.',
    scrapped: 'Track tickets that were cancelled and are no longer in progress.'
}

const getScoreClasses = (score) => {
    const s = parseInt(score)
    if (s >= 9) return 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]'
    if (s >= 7) return 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]'
    return 'bg-[#FFEDD4] text-[#CA3500] border-[#FEE2E2]'
}

const getStatusClasses = (status) => {
    const s = status.toLowerCase()
    if (s.includes('admin approved')) return 'bg-[#C3FFBE] text-[#17740F]'
    if (s.includes('team lead approved')) return 'bg-[#D0FAE5] text-[#007C65]'
    if (s.includes('manager approved')) return 'bg-[#CCFEE0] text-[#093F1E]'
    if (s.includes('development')) return 'bg-[#BCF0FE] text-[#005C75]'
    if (s.includes('developed')) return 'bg-[#D0FAE5] text-[#007C65]'
    if (s.includes('tech scored')) return 'bg-[#D4DEFF] text-[#3B5BBA]'
    if (s.includes('scrapped')) return 'bg-[#FFBABA] text-[#FF1616]'
    if (s.includes('future')) return 'bg-[#FFEDD4] text-[#CA3500]'
    if (s.includes('flagged')) return 'bg-[#FFCCBA] text-[#FF5316]'
    if (s.includes('vp approved')) return 'bg-[#F3E8FF] text-[#933ED3]'
    return 'bg-gray-100 text-gray-600'
}
</script>