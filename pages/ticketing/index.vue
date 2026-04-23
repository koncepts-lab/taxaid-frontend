<template>
    <NuxtLayout name="admin">

        <div class="p-8 space-y-8  min-h-screen">

            <div class="grid gap-4 w-full" :class="activeStatCards.length === 5 ? 'grid-cols-5' : 'grid-cols-4'">
                <TicketingStatCard v-for="card in activeStatCards" :key="card.title" :title="card.title"
                    :count="card.count" :bgColor="card.bg" :borderColor="card.border" :textColor="card.text">
                    <template #icon>
                        <img :src="card.icon" class="w-5 h-5 object-contain" alt="Stat Icon" />
                    </template>
                </TicketingStatCard>
            </div>

            <TicketingAlertCard message="2 tickets are ready for development."
                subtext="Development can now begin based on the approved requirements." ] type="info"
                icon="/images/icons/in-development.svg" />
            <TicketingAlertCard message="2 tickets have been completed." subtext="Development phase is closed."
                type="success" icon="/images/icons/developed.svg" />
            <TicketingAlertCard message="2 tickets waiting for your review"
                subtext="Tickets awaiting manager review with deadlines" type="warning"
                icon="/images/icons/pending.svg" />
            <TicketingAlertCard message="2 tickets have been cancelled multiple times"
                subtext='These tickets may need special attention. Review the " Flagged" tab for details.' type="danger"
                icon="/images/icons/overdue.svg" />

            <div class="flex gap-6" v-if="userRole == 'admin'">
                <TicketingManagerReportCard name="Manager A Report"
                    departments="Implementation, Business Review, Customer Support" :stats="managerStatsA"
                    iconColor="#155DFC" />
                <TicketingManagerReportCard name="Manager B Report"
                    departments="Sales & Marketing, R&D, Tech / Development" :stats="managerStatsB"
                    iconColor="#9810FA" />
            </div>

            <TicketingTabNavigation v-model="activeTab" :tabs="currentTabsList" />

            <div
                class="bg-[#61FFD62E] border border-[#00BE8CBD] px-4 py-8 rounded-[14px] flex flex-col md:flex-row gap-4 items-center shadow-sm">

                <!-- UNIVERSAL SEARCH BAR -->
                <div class="relative flex-1 w-full group">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </span>
                    <input type="text" placeholder="Search tickets..."
                        class="w-full pl-12 pr-4 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#008169] text-black" />
                </div>

                <!-- ADMIN DROPDOWNS -->
                <template v-if="userRole === 'admin'">
                    <!-- Time Filter (Only on Master Tab) -->
                    <div v-if="activeTab === 'master'" class="relative w-full md:w-[300px]">
                        <button @click="isTimeOpen = !isTimeOpen"
                            class="w-full px-3 text-black/50 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedTime }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isTimeOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isTimeOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2">
                            <div v-for="t in timeOptions" :key="t" @click="selectedTime = t; isTimeOpen = false"
                                class="px-6 py-2 text-sm rounded-lg hover:bg-[#F3F4F6] cursor-pointer">{{ t }}</div>
                        </div>
                    </div>

                    <!-- Manager Filter -->
                    <div class="relative w-full" :class="activeTab !== 'master' ? 'md:w-1/3' : 'md:w-[300px]'">
                        <button @click="isManagerOpen = !isManagerOpen"
                            class="w-full px-3 text-black/50 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedManagerFilter }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isManagerOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isManagerOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2">
                            <div v-for="m in managerFilterOptions" :key="m"
                                @click="selectedManagerFilter = m; isManagerOpen = false"
                                class="px-6 py-2 text-sm rounded-lg hover:bg-[#F3F4F6] cursor-pointer">{{ m }}</div>
                        </div>
                    </div>
                </template>

                <!-- VP DROPDOWNS -->
                <template v-else-if="userRole === 'vp' || userRole === 'tech_team'">
                    <!-- Status Filter (Label: All Tickets) -->
                    <div class="relative w-full" :class="userRole == 'tech_team' ? 'md:w-1/3' : 'md:w-[300px]'">
                        <button @click="isStatusOpen = !isStatusOpen"
                            class="w-full px-3 text-black/50 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedStatus }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isStatusOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isStatusOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2">
                            <div v-for="s in vpStatusOptions" :key="s" @click="selectedStatus = s; isStatusOpen = false"
                                class="px-6 py-2 text-sm text-black rounded-lg hover:bg-[#61FFD62E] cursor-pointer">{{ s
                                }}</div>
                        </div>
                    </div>
                    <!-- Department Filter (Same as Manager) -->
                    <div class="relative w-full md:w-[300px]" v-if="userRole != 'tech_team'">
                        <button @click="isDeptOpen = !isDeptOpen"
                            class="w-full px-3 text-black/50 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedDept }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isDeptOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isDeptOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2">
                            <div v-for="d in deptOptions" :key="d" @click="selectedDept = d; isDeptOpen = false"
                                class="px-6 py-2 text-sm rounded-lg hover:bg-[#F3F4F6] cursor-pointer">{{ d }}</div>
                        </div>
                    </div>
                </template>

                <!-- MANAGER DROPDOWNS -->
                <template v-else-if="userRole === 'manager' || userRole === 'team_lead'">
                    <!-- Status Filter (Label: All Statuses) -->
                    <div class="relative w-full " :class="userRole == 'team_lead' ? 'md:w-1/3' : 'md:w-[300px]'">
                        <button @click="isStatusOpen = !isStatusOpen"
                            class="w-full px-3 text-black/50 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedStatus }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isStatusOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isStatusOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2">
                            <div v-for="s in managerStatusOptions" :key="s"
                                @click="selectedStatus = s; isStatusOpen = false"
                                class="px-6 py-2 text-sm text-black rounded-lg hover:bg-[#61FFD62E] cursor-pointer">{{ s
                                }}</div>
                        </div>
                    </div>
                    <!-- Department Filter -->
                    <div class="relative w-full md:w-[300px]" v-if="userRole !== 'team_lead'">
                        <button @click="isDeptOpen = !isDeptOpen"
                            class="w-full pl-3 pr-3 py-2 bg-white border border-[#04C18F80] rounded-lg text-black/50 text-sm flex justify-between items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedDept }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isDeptOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isDeptOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2">
                            <div v-for="d in deptOptions" :key="d" @click="selectedDept = d; isDeptOpen = false"
                                class="px-6 py-2 text-sm text-black rounded-lg hover:bg-[#61FFD62E] cursor-pointer">{{ d
                                }}</div>
                        </div>
                    </div>
                </template>
                <template v-else-if="userRole === 'team_member'">
                    <!-- Status Filter (All Statuses) -->
                    <div class="relative w-full md:w-[300px]">
                        <button @click="isStatusOpen = !isStatusOpen"
                            class="w-full px-3 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center outline-none"
                            :class="{ 'ring-1 ring-[#008169]': isStatusOpen }">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" class="text-gray-400">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedStatus }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" class="text-gray-300 transition-transform duration-300"
                                :class="isStatusOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isStatusOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2 space-y-1">
                            <div v-for="s in teamMemberStatusOptions" :key="s"
                                @click="selectedStatus = s; isStatusOpen = false"
                                class="px-6 py-2 text-sm text-black rounded-lg hover:bg-[#61FFD62E] cursor-pointer"
                                :class="{ 'bg-[#61FFD62E]': selectedStatus === s }">
                                {{ s }}
                            </div>
                        </div>
                    </div>

                    <!-- Type Filter (All Types) -->
                    <div class="relative w-full md:w-[300px]">
                        <button @click="isTypeOpen = !isTypeOpen"
                            class="w-full px-3 py-2 bg-white border border-[#04C18F80] rounded-lg text-sm flex justify-between items-center outline-none"
                            :class="{ 'ring-1 ring-[#008169]': isTypeOpen }">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" class="text-gray-400">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span class="flex-1 text-center text-black">{{ selectedType }}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" class="text-gray-300 transition-transform duration-300"
                                :class="isTypeOpen ? 'rotate-0' : 'rotate-180'">
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </button>
                        <div v-if="isTypeOpen"
                            class="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl p-2 space-y-1">
                            <div v-for="t in ticketTypeOptions" :key="t" @click="selectedType = t; isTypeOpen = false"
                                class="px-6 py-2 text-sm text-black rounded-lg hover:bg-[#61FFD62E] cursor-pointer"
                                :class="{ 'bg-[#61FFD62E]': selectedType === t }">
                                {{ t }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <TicketingTable :data="filteredData" :activeTab="activeTab" @open-ticket="handleOpenTicket"
                :role="userRole" />
            <TicketingDecisionModal :isOpen="isModalOpen" :ticket="selectedTicket" :mode="modalMode" :isDark="isDark"
                @close="isModalOpen = false" @submit="handleDecisionSubmit" :role="userRole" />
        </div>
    </NuxtLayout>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isTimeOpen = ref(false)
const isManagerOpen = ref(false)
const searchQuery = ref('')
const selectedTime = ref('All Time')
const selectedManager = ref('All Manager')
const isModalOpen = ref(false)
const selectedTicket = ref(null)
const modalMode = ref('review')
const isDark = ref(false)
const timeDropdownRef = ref(null)
const managerDropdownRef = ref(null)
const isStatusOpen = ref(false)
const isDeptOpen = ref(false)
const isTypeOpen = ref(false)


const selectedDept = ref('All Departments')
const selectedManagerFilter = ref('All Managers')
const selectedType = ref('All Types')


const managerStatusOptions = ['All Statuses', 'VP Approved', 'Manger Approved', 'Admin Approved', 'Flagged', 'Scrapped', 'Future']
const vpStatusOptions = ['All Tickets', 'Tech Scored', 'Manger Approved', 'Admin Approved', 'Flagged', 'Scrapped', 'Future']
const deptOptions = ['All Departments', 'Implementation Team', 'Business Review Team', 'Customer Support Team', 'Sales & Marketing', 'R & D', 'Tech / Development Team']
const timeOptions = ['All Time', 'This Week', 'This Month', 'Q1 2025']
const managerFilterOptions = ['All Managers', 'John Doe', 'Jane Smith']
const teamMemberStatusOptions = [
    'All Statuses',
    'Submitted',
    'Team Lead Approved',
    'Tech Scored',
    'VP Approved',
    'Manager Approved',
    'Admin Approved',
    'In development',
    'Developed',
    'Flagged',
    'Scrapped'
]

const ticketTypeOptions = [
    'All Types',
    'Bug',
    'Feature Suggestion',
    'Implementation Feedback',
    'Client Review',
    'Query'
]

const handleClickOutside = (event) => {
    if (timeDropdownRef.value && !timeDropdownRef.value.contains(event.target)) isTimeOpen.value = false
    if (managerDropdownRef.value && !managerDropdownRef.value.contains(event.target)) isManagerOpen.value = false
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
const userRole = ref('team_member');
const selectedStatus = ref(userRole.value === 'manager' || userRole.value === 'team_lead' || userRole.value === 'team_member' ? 'All Statuses' : 'All Tickets')


const activeStatCards = computed(() => {
    const cardKeys = roleStatsConfig[userRole.value] || roleStatsConfig.team_member;

    return cardKeys.map(key => {
        const config = cardLibrary[key];
        return {
            ...config,
            count: Math.floor(Math.random() * 20)
        };
    });
});

const ticketsDataRegistry = {
    admin: [
        { id: 'TKT-101', title: 'Fix Header Alignment', department: 'UI/UX Team', manager: 'Manager A', score: '10', cost: '1200', status: 'Manager Approved' },
        { id: 'TKT-102', title: 'API Integration Bug', department: 'Backend Team', manager: 'Manager B', score: '4', cost: '3000', status: 'Manager Approved' },
        { id: 'TKT-001', title: 'Add dark mode feature', department: 'R&D Team', manager: 'Manager A', score: '9', cost: '5000', status: 'Admin Approved' },
        { id: 'TKT-401', title: 'Database Migration', department: 'DevOps', manager: 'Manager A', score: '3', cost: '9000', status: 'Flagged' },
        { id: 'TKT-601', title: 'AI Chatbot v2', department: 'AI Lab', manager: 'Manager A', score: '9', cost: '15000', status: 'Future' }
    ],

    vp: [
        {
            id: 'TKT-002',
            title: 'Add dark mode feature',
            type: 'Feature Suggestion',
            leadScore: '9',
            techScore: '8',
            cost: '5000',
            status: 'Tech Scored'
        },
        {
            id: 'TKT-002',
            title: 'Add two-factor authentication',
            type: 'Implementation Feedback',
            leadScore: '7',
            techScore: '8',
            cost: '5000',
            status: 'Tech Scored'
        },
        {
            id: 'TKT-002',
            title: 'Add two-factor authentication',
            type: 'Feature Suggestion',
            leadScore: '8',
            techScore: '7',
            cost: '5000',
            status: 'Admin Approved'
        },
        {
            id: 'TKT-002',
            title: 'Add two-factor authentication',
            type: 'Feature Suggestion',
            leadScore: '8',
            techScore: '7',
            cost: '5000',
            status: 'In Development'
        }
    ],

    // 3. MANAGER: Operations & Validation (Focus on Priority and validation)
    manager: [
        { id: 'TKT-201', title: 'Email Template Update', priority: 'High', validation: 'Pending', cost: '800', status: 'VP Approved' },
        { id: 'TKT-301', title: 'Mobile Responsive Fix', priority: 'Medium', validation: 'Passed', cost: '2200', status: 'In Development' },
        { id: 'TKT-405', title: 'Server Cache Tuning', priority: 'Critical', validation: 'In-Progress', cost: '500', status: 'Flagged' }
    ],

    // 4. TEAM LEAD: Technical Quality (Focus on Team Capacity and Sprints)
    team_lead: [
        {
            id: 'TKT-001',
            title: 'Dashboard loading time is too slow',
            type: 'Bug',
            created_by: 'John Doe',
            score: '',
            status: 'Submitted'
        },
        {
            id: 'TKT-002',
            title: 'Add two-factor authentication',
            type: 'Feature Suggestion',
            created_by: 'Emma Wilson',
            score: '7',
            status: 'Tech Scored'
        },
        {
            id: 'TKT-003', // Changed ID to be unique for Vue keys, though title matches image
            title: 'Add two-factor authentication',
            type: 'Feature Suggestion',
            created_by: 'Chris Taylor',
            score: '8',
            status: 'Tech Scored'
        },
        {
            id: 'TKT-004',
            title: 'Add two-factor authentication',
            type: 'Bug',
            created_by: 'John Doe',
            score: '9',
            status: 'In Development'
        }
    ],

    // 5. TECH TEAM: Development Execution (Focus on Progress & Sprints)
    tech_team: [
        {
            id: 'TKT-002',
            title: 'Add dark mode feature',
            type: 'Feature Suggestion',
            leadScore: '9',
            techScore: '', // Becomes "Not Scored"
            cost: '-',
            status: 'Team Lead Approved'
        },
        {
            id: 'TKT-003',
            title: 'Add two-factor authentication',
            type: 'Implementation Feedback',
            leadScore: '7',
            techScore: '',
            cost: '-',
            status: 'Team Lead Approved'
        },
        {
            id: 'TKT-004',
            title: 'Add two-factor authentication',
            type: 'Feature Suggestion',
            leadScore: '8',
            techScore: '7',
            cost: '5000',
            status: 'Tech Scored'
        },
        {
            id: 'TKT-005',
            title: 'Add two-factor authentication',
            type: 'Feature Suggestion',
            leadScore: '9',
            techScore: '8',
            cost: '5000',
            status: 'Tech Scored'
        }
    ],

    // 6. TEAM MEMBER: Individual Tasks (Focus on Assignment & Hours)
    team_member: [
        {
            id: 'TKT-002',
            title: 'Add dark mode feature',
            type: 'Feature Suggestion',
            score: '', // Will show as "Pending"
            status: 'Team Lead Reviewed',
            created: '11/3/2025'
        },
        {
            id: 'TKT-003',
            title: 'Add two-factor authentication',
            type: 'Implementation Feedback',
            score: '7',
            status: 'Tech Scored',
            created: '10/29/2025'
        },
        {
            id: 'TKT-004',
            title: 'Add two-factor authentication',
            type: 'Bug',
            score: '',
            status: 'Submitted',
            created: '10/29/2025'
        },
        {
            id: 'TKT-005',
            title: 'Add two-factor authentication',
            type: 'Bug',
            score: '9',
            status: 'Developed',
            created: '10/29/2025'
        }
    ]
}
const ticketsData = computed(() => {
    // Returns the array matching the role, or a fallback empty array
    return ticketsDataRegistry[userRole.value] || []
})
const getCountForStatus = (statusName) => {
    if (statusName === 'master') return ticketsData.value.length;
    return ticketsData.value.filter(t => t.status.toLowerCase().includes(statusName)).length;
};
const cardLibrary = {
    total: { title: 'Total Tickets', bg: '#FFFFFFBF', border: '#04C18FCC', text: '#008236', icon: '/images/icons/ticket.svg' },
    pending: { title: 'Pending Approval', bg: '#FFF7ED', border: '#FFA638', text: '#CA3500', icon: '/images/icons/pending.svg' },
    overdue: { title: 'Overdue Reviews', bg: '#FEF2F2', border: '#FFA6A6', text: '#C10007', icon: '/images/icons/overdue.svg' },
    in_dev: { title: 'In Development', bg: '#EFF6FF', border: '#81B8FF', text: '#007595', icon: '/images/icons/in-development.svg' },
    developed: { title: 'Developed', bg: '#F0FDF4', border: '#04C18F80', text: '#008236', icon: '/images/icons/developed.svg' },
    scrapped: { title: 'Scrapped', bg: '#FEF2F2', border: '#FFA6A6', text: '#C10007', icon: '/images/icons/scrapped.svg' },
    validation: { title: 'Need Validation', bg: '#FFF7ED', border: '#FFA638', text: '#CA3500', icon: '/images/icons/validation.svg' },
    team: { title: 'Team Members', bg: '#F2FFF8', border: '#04C18F80', text: '#008236', icon: '/images/icons/team.svg' },
    scoring: { title: 'Need Scoring', bg: '#EFF6FF', border: '#81B8FF', text: '#007595', icon: '/images/icons/review.svg' },
    scored: { title: 'Scored', bg: '#F0FDF4', border: '#04C18F80', text: '#008236', icon: '/images/icons/developed.svg' },
    in_progress: { title: 'In Progress', bg: '#EFF6FF', border: '#81B8FF', text: '#007595', icon: '/images/icons/review.svg' },
    completed: { title: 'Completed', bg: '#F0FDF4', border: '#04C18F80', text: '#008236', icon: '/images/icons/developed.svg' },
    review: { title: 'Needs Review', bg: '#EFF6FF', border: '#81B8FF', text: '#1447E6', icon: '/images/icons/review.svg' },
    approved: { title: 'Approved', bg: '#F0FDF4', border: '#04C18F80', text: '#008236', icon: '/images/icons/developed.svg' },
    approval: { title: 'Review In Progress', bg: '#FFFBE1', border: '#FFE738', text: '#A65F00', icon: '/images/icons/approval.svg' },
};

const roleStatsConfig = {
    admin: ['pending', 'overdue', 'in_dev', 'developed', 'scrapped'],
    vp: ['total', 'validation', 'overdue', 'in_dev', 'developed'],
    manager: ['total', 'review', 'approved', 'overdue'],
    team_lead: ['total', 'review', 'overdue', 'team'],
    tech_team: ['total', 'pending', 'scoring', 'scored'],
    team_member: ['total', 'approval', 'in_dev', 'completed']
};

const managerStatsA = [
    { label: 'Total Tickets:', value: '12', color: '#000000' },
    { label: 'Pending Your Review:', value: '4', color: '#A65F00' },
    { label: 'Approved:', value: '6', color: '#00A63E' },
    { label: 'Flagged:', value: '2', color: '#F54900' },
]

const managerStatsB = [
    { label: 'Total Tickets:', value: '8', color: '#000000' },
    { label: 'Pending Your Review:', value: '1', color: '#A65F00' },
    { label: 'Approved:', value: '5', color: '#00A63E' },
    { label: 'Flagged:', value: '2', color: '#F54900' },
]

// 1. Define the master metadata for all possible tabs
const allTabDefinitions = {
    pending: { name: 'pending', label: 'Pending', labelAr: 'قيد الانتظار' },
    needs_action: { name: 'pending', label: 'Needs Action', labelAr: 'يحتاج اتخاذ إجراء' },
    needs_review: { name: 'needs-review', label: 'Needs Review', labelAr: 'يحتاج مراجعة' },
    approved: { name: 'approved', label: 'Approved', labelAr: 'تمت الموافقة' },
    developed: { name: 'developed', label: 'Developed', labelAr: 'تم التطوير' },
    in_dev: { name: 'in-dev', label: 'In Dev', labelAr: 'قيد التطوير' },
    in_development: { name: 'in-dev', label: 'In Development', labelAr: 'قيد التطوير' },
    flagged: { name: 'flagged', label: 'Flagged', labelAr: 'محيز' },
    scrapped: { name: 'scrapped', label: 'Scrapped', labelAr: 'ملغى' },
    rejected: { name: 'scrapped', label: 'Rejected', labelAr: 'مرفوض' },
    future: { name: 'future', label: 'Future', labelAr: 'مستقبلي' },
    master: { name: 'master', label: 'Master List', labelAr: 'القائمة الرئيسية' },
    all_tickets: { name: 'master', label: 'All Tickets', labelAr: 'جميع التذاكر' },
};

// 2. Map roles to their specific tab sequences
const roleTabs = {
    admin: ['pending', 'approved', 'developed', 'in_dev', 'flagged', 'scrapped', 'future', 'master'],
    vp: ['needs_action', 'in_development', 'developed', 'approved', 'rejected', 'all_tickets'],
    manager: ['pending', 'approved', 'flagged', 'all_tickets'],
    team_lead: ['needs_review', 'approved', 'rejected', 'all_tickets'],
    tech_team: [],
    team_member: []
};
const currentTabsList = computed(() => {
    const keys = roleTabs[userRole.value] || roleTabs.team_member;

    return keys.map(key => {
        const config = allTabDefinitions[key];
        return {
            name: config.name, // The internal key for filtering (e.g., 'pending')
            label: config.label, // The display label (e.g., 'Needs Action')
            // Get the count from your tickets data based on the internal name
            count: getCountForStatus(config.name)
        };
    });
});
const activeTab = ref(
    currentTabsList.value.length > 0
        ? currentTabsList.value[0].name
        : (userRole.value === 'tech_team' || userRole.value === 'team_member' ? '' : 'pending')
)
watch(currentTabsList, (newList) => {
    if (newList.length > 0) {
        activeTab.value = newList[0].name
    }
}, { immediate: true })





const filteredData = computed(() => {
    let data = ticketsData.value

    if (activeTab.value !== 'master') {
        data = data.filter(t => {
            const s = t.status.toLowerCase()
            if (activeTab.value === 'pending') return s.includes('review')
            if (activeTab.value === 'approved') return s.includes('approved')
            if (activeTab.value === 'in-dev') return s.includes('development')
            return s.includes(activeTab.value)
        })
    }

    if (selectedManager.value !== 'All Manager') {
        data = data.filter(t => t.manager === selectedManager.value)
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(t => t.title.toLowerCase().includes(query) || t.id.toLowerCase().includes(query))
    }

    return data
})

const ticketHistories = {
    'Developed': [
        { role: 'Team Lead', date: '10/30/2025 5:30 AM', score: 8, text: 'Initial check complete.' },
        { role: 'Tech Team', date: '10/30/2025 5:30 AM', score: 8, text: 'Architecture approved.' },
        { role: 'VP of Technology', date: '10/30/2025 5:30 AM', score: 8, text: 'Primary assessment done.' },
        { role: 'VP of Technology', date: '10/30/2025 6:30 AM', label: 'Moved to In Development', text: 'Sprints started.' },
        { role: 'VP of Technology', date: '10/30/2025 9:30 AM', label: 'Marked as Developed', text: 'Build verified.' },
        { role: 'Manager', date: '10/30/2025 5:30 AM', text: 'Approved for roadmap.' }
    ],
    'Pending Review': [
        { role: 'Team Lead', date: '10/30/2025 5:30 AM', score: 7, text: 'Waiting for VP input.' },
        {
            role: 'Tech Team',
            date: '10/30/2025 5:30 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Vice President of Technology',
            date: '10/30/2025 5:30 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Manager',
            date: '10/30/2025 5:30 AM',
            text: 'Approved for Q1 2025 roadmap. This is critical for our enterprise customers.'
        }
    ],
    'Approved': [
        { role: 'Team Lead', date: '10/30/2025 5:30 AM', score: 7, text: 'Waiting for VP input.' },
        {
            role: 'Tech Team',
            date: '10/30/2025 5:30 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Vice President of Technology',
            date: '10/30/2025 5:30 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Manager',
            date: '10/30/2025 5:30 AM',
            text: 'Approved for Q1 2025 roadmap. This is critical for our enterprise customers.'
        }
    ],
    'In Development': [
        {
            role: 'Team Lead',
            date: '10/30/2025 5:30:00 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Tech Team',
            date: '10/30/2025 5:30:00 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Vice President of Technology',
            date: '10/30/2025 5:30:00 AM',
            score: 8,
            text: 'Important security feature. Can use existing libraries. 4 weeks.'
        },
        {
            role: 'Vice President of Technology',
            status: 'Moved to In Development',
            date: '10/30/2025 5:30:00 AM',
            text: 'Development kick-off confirmed. Assigned to the core platform team. Estimated completion within 4 weeks. Sprint planning done.'
        },
        {
            role: 'Manager',
            date: '10/30/2025 5:30:00 AM',
            text: 'Approved for Q1 2025 roadmap. This is critical for our enterprise customers.'
        },
        {
            role: 'Admin',
            status: 'Approved',
            date: '10/30/2025 5:30:00 AM',
            text: 'Ticket reviewed and approved. All team assessments have been considered and the proposed feature meets the required standards. Cleared for development — VP of Technology to proceed with sprint planning and resource allocation.'
        }
    ],
    'Flagged': [
        {
            role: 'Team Lead',
            date: '10/30/2025 5:30:00 AM',
            score: 2,
            status: 'Flagged for admin',
            text: 'Security risk identified. Needs admin approval before proceeding.'
        },
        {
            role: 'Tech Team',
            date: '10/30/2025 5:30:00 AM',
            score: 3,
            status: 'Flagged for admin',
            text: 'Dependency conflict with existing auth module. Admin review required.'
        },
        {
            role: 'Vice President of Technology',
            date: '10/30/2025 5:30:00 AM',
            score: 7,
            status: 'Flagged for admin',
            text: 'Not aligned with Q4 roadmap. Flagging for admin to reassess priority.'
        },
        {
            role: 'Manager',
            date: '10/30/2025 5:30:00 AM',
            text: 'Approved for Q1 2025 roadmap. Critical for enterprise customers.'
        }
    ]
}

const handleOpenTicket = ({ ticket, mode }) => {
    const history = ticketHistories[ticket.status] || ticketHistories['Pending Review']

    selectedTicket.value = {
        ...ticket,
        activities: history
    }
    modalMode.value = mode
    isModalOpen.value = true
}
const handleDecisionSubmit = (data) => {
    console.log('Decision submitted:', data)
    isModalOpen.value = false
}

</script>