<template>
    <div class="space-y-6">
        <!-- Content Card -->
        <div class="rounded-2xl border transition-all duration-300 p-8 space-y-6"
            :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30 text-white' : 'bg-white border-gray-100 shadow-sm text-black'">

            <div class="space-y-1 text-left rtl:text-right">
                <h3 class="text-xl font-normal">{{ currentLang === 'ar' ? 'طلبات بيانات الاعتماد' : 'Temporary Credential Requests' }}</h3>
                <p class="text-base text-[#717182]">{{ currentLang === 'ar' ? 'الموافقة على أو رفض طلبات تسجيل الدخول المؤقت' : 'Approve or reject temporary login requests from consultants' }}</p>
            </div>

            <!-- Search bar Row -->
            <div class="flex flex-col md:flex-row items-center gap-3">
                <div class="relative flex-1 w-full">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 rtl:left-auto rtl:right-0 rtl:pr-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </span>
                    <input type="text" v-model="search"
                        :placeholder="currentLang === 'ar' ? 'بحث بالاستشاري أو العميل...' : 'Search by consultant, client name or ID...'"
                        class="w-full py-3 border rounded-xl text-sm outline-none transition-all" :class="[
                            currentLang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left',
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#04C18F80] text-black'
                        ]" />
                </div>
                <div class="flex items-center gap-3">
                    <button @click="fetchRows" :disabled="loading" class="p-3 border rounded-xl transition-all"
                        :class="[isDark ? 'bg-white/5 border-white/10 text-[#00B794]' : 'bg-white hover:bg-[#86E4CB] border-[#04C18F80] text-[#00896F]', loading ? 'opacity-50 cursor-not-allowed' : '']">
                        <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5" :class="loading ? 'animate-spin' : ''">
                    </button>

                    <div class="relative">
                        <button @click.stop="filterOpen = !filterOpen"
                            class="flex items-center gap-3 px-4 py-3 bg-white border border-[#04C18F80] rounded-xl text-sm text-[#717182] transition-all">
                            <span>{{ statusLabel }}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="3" class="transition-transform" :class="{ 'rotate-180': filterOpen }">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <Transition name="fade">
                            <div v-if="filterOpen"
                                class="absolute right-0 mt-2 z-50 bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.2)] border border-gray-100 p-2 w-48">
                                <div v-for="opt in statusOptions" :key="opt.value" @click.stop="selectStatus(opt.value)"
                                    class="px-4 py-2.5 text-xs rounded-xl cursor-pointer transition-colors hover:bg-[#E6FDF9] hover:text-[#00896F]"
                                    :class="statusFilter === opt.value ? 'bg-[#E6FDF9] text-[#00896F] font-bold' : 'text-gray-700'">
                                    {{ opt.label }}
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto border rounded-xl transition-colors"
                :class="isDark ? 'border-white/10' : 'border-gray-100'">
                <table class="w-full text-left rtl:text-right border-separate border-spacing-0">
                    <thead>
                        <tr class="bg-[#00896F] text-white">
                            <th v-for="h in headers" :key="h" class="px-4 py-4 text-sm font-normal tracking-wider last:border-0">
                                {{ h }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
                        <tr v-if="!loading && !rows.length">
                            <td :colspan="headers.length" class="px-4 py-10 text-center text-sm text-gray-400">
                                No credential requests found.
                            </td>
                        </tr>
                        <tr v-for="req in rows" :key="req.id" class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-4 py-5 text-sm font-medium text-black">{{ req.consultant_name }}</td>
                            <td class="px-4 py-5 text-sm">{{ req.client_name || '-' }}</td>
                            <td class="px-4 py-5 text-sm tabular-nums">{{ req.client_id }}</td>
                            <td class="px-4 py-5 text-sm whitespace-nowrap">{{ formatTime(req.requested_at) }}</td>
                            <td class="px-4 py-5">
                                <span class="px-3 py-0.5 rounded-full text-sm capitalize" :class="statusPill(req.status)">
                                    {{ req.status }}
                                </span>
                            </td>
                            <td class="px-4 py-5 text-sm max-w-[220px] truncate" :class="!req.request_note ? 'text-center text-gray-400' : ''" :title="req.request_note || ''">
                                {{ req.request_note || '—' }}
                            </td>
                            <td class="px-4 py-5">
                                <div class="flex items-center gap-2">
                                    <button v-if="req.status === 'pending'" @click="openReview(req)"
                                        class="bg-[#00B68D] hover:bg-[#006552] text-white px-5 py-1.5 rounded-md text-xs font-bold transition-colors">
                                        Review
                                    </button>
                                    <button v-else @click="openView(req)"
                                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-5 py-1.5 rounded-md text-xs font-medium transition-colors">
                                        View
                                    </button>
                                    <button v-if="req.has_logged_in" @click="openInfo(req)"
                                        class="bg-white border border-[#193CB8] text-[#193CB8] hover:bg-[#DBEAFE] px-4 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5">
                                        <span v-if="req.is_online" class="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
                                        Info
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-3">
                <p class="text-sm text-[#717182]">
                    Showing {{ rows.length ? (currentPage - 1) * 10 + 1 : 0 }}–{{ (currentPage - 1) * 10 + rows.length }} of {{ total }}
                </p>
                <div class="flex items-center gap-2">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
                        class="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                        Prev
                    </button>
                    <button v-for="p in pageWindow" :key="p" @click="goToPage(p)"
                        class="w-9 h-9 rounded-md text-sm transition-colors"
                        :class="p === currentPage ? 'bg-[#00896F] text-white font-bold' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'">
                        {{ p }}
                    </button>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= lastPage"
                        class="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Review Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showReview" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[460px] max-w-full px-8 py-8">
                        <template v-if="!approvedCreds">
                            <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
                                <svg class="text-[#007C65]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <h3 class="text-[17px] font-semibold text-gray-900 mb-2 text-center">Temporary Credential Request</h3>
                            <p class="text-sm text-gray-500 text-center mb-4">
                                <span class="font-semibold text-gray-800">{{ activeReq?.consultant_name }}</span>
                                is requesting temporary credential generation for tenant
                                <span class="font-semibold text-gray-800">{{ activeReq?.client_name || '-' }}</span>
                                (ID <span class="font-semibold text-gray-800">{{ activeReq?.client_id }}</span>)
                            </p>
                            <div v-if="activeReq?.request_note" class="p-3 bg-[#F3F4F6] rounded-xl text-sm text-gray-700 mb-4">
                                <span class="font-semibold text-gray-500 text-xs block mb-1">Consultant note</span>
                                {{ activeReq.request_note }}
                            </div>
                            <textarea v-model="rejectNote" rows="2" maxlength="500"
                                placeholder="Reject note (required to reject)..."
                                class="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-3 text-sm text-black outline-none placeholder:text-[#717182] focus:bg-white focus:ring-1 focus:ring-[#00896F] mb-4"></textarea>
                            <p v-if="modalError" class="text-sm text-[#B91C1C] mb-3 text-center">{{ modalError }}</p>
                            <div class="flex gap-3 justify-center">
                                <button @click="closeReview" class="px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
                                <button @click="doReject" :disabled="acting || !rejectNote.trim()"
                                    class="px-5 py-2 bg-[#FB2C36] text-white rounded-md text-sm font-medium hover:bg-[#E63939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ acting === 'reject' ? 'Rejecting…' : 'Reject' }}
                                </button>
                                <button @click="doApprove" :disabled="acting"
                                    class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56] transition-colors disabled:opacity-60">
                                    {{ acting === 'approve' ? 'Approving…' : 'Approve' }}
                                </button>
                            </div>
                        </template>

                        <!-- Approved: show generated credentials -->
                        <template v-else>
                            <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
                                <svg class="text-[#007C65]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <h3 class="text-[17px] font-semibold text-gray-900 mb-2 text-center">Credentials Generated</h3>
                            <p class="text-sm text-gray-500 text-center mb-4">Share these with the consultant. They can also see them on the project page.</p>
                            <div class="space-y-3 mb-6">
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-black font-mono break-all">{{ approvedCreds.username }}</div>
                                    <button @click="copyText(approvedCreds.username, 'user')"
                                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap">
                                        {{ copied === 'user' ? 'Copied!' : 'Copy' }}
                                    </button>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-black font-mono break-all">{{ approvedCreds.password }}</div>
                                    <button @click="copyText(approvedCreds.password, 'pass')"
                                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap">
                                        {{ copied === 'pass' ? 'Copied!' : 'Copy' }}
                                    </button>
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <button @click="closeReview" class="px-6 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56]">Close</button>
                            </div>
                        </template>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Session Info Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showInfo" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[460px] max-w-full flex flex-col max-h-[85vh]">
                        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 class="text-[16px] font-semibold text-gray-900">Session Info</h3>
                                <p class="text-xs text-gray-400 mt-0.5">{{ activeReq?.client_name || '-' }} ({{ activeReq?.client_id }}) — {{ activeReq?.username }}</p>
                            </div>
                            <button @click="showInfo = false" class="text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div class="p-6 space-y-4 overflow-y-auto">
                            <div v-if="!activeReq?.sessions?.length"
                                class="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 text-center">
                                No active session — credentials not currently in use.
                            </div>
                            <div v-for="s in activeReq?.sessions" :key="s.id"
                                class="p-4 bg-[#F9FAFB] border border-gray-100 rounded-xl space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-semibold text-gray-900">{{ s.device_label }}</span>
                                    <span class="px-3 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5"
                                        :class="s.is_online ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-gray-100 text-gray-500'">
                                        <span class="w-1.5 h-1.5 rounded-full" :class="s.is_online ? 'bg-[#15803D] animate-pulse' : 'bg-gray-400'"></span>
                                        {{ s.is_online ? 'Online now' : 'Offline' }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-500">Location</span>
                                    <span class="text-gray-800">{{ s.location || '-' }}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-500">IP address</span>
                                    <span class="text-gray-800 font-mono text-xs">{{ s.ip || '-' }}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-500">Last active</span>
                                    <span class="text-gray-800">{{ timeAgo(s.last_active_at) }}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-500">Logged in</span>
                                    <span class="text-gray-800">{{ formatTime(s.logged_in_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- View Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showView" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[460px] max-w-full flex flex-col max-h-[85vh]">
                        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 class="text-[16px] font-semibold text-gray-900">Credential Request</h3>
                                <p class="text-xs text-gray-400 mt-0.5">{{ activeReq?.client_name || '-' }} ({{ activeReq?.client_id }})</p>
                            </div>
                            <button @click="showView = false" class="text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div class="p-6 space-y-4 overflow-y-auto">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">Status</span>
                                <span class="px-3 py-0.5 rounded-full text-sm capitalize" :class="statusPill(activeReq?.status)">{{ activeReq?.status }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">Consultant</span>
                                <span class="text-sm font-medium text-gray-800">{{ activeReq?.consultant_name }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">Requested</span>
                                <span class="text-sm text-gray-800">{{ formatTime(activeReq?.requested_at) }}</span>
                            </div>
                            <div v-if="activeReq?.reviewed_at" class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">{{ activeReq?.status === 'rejected' ? 'Rejected' : 'Approved' }}</span>
                                <span class="text-sm text-gray-800">{{ formatTime(activeReq?.reviewed_at) }}</span>
                            </div>
                            <div v-if="activeReq?.activated_at" class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">First login</span>
                                <span class="text-sm text-gray-800">{{ formatTime(activeReq?.activated_at) }}</span>
                            </div>
                            <div v-if="activeReq?.expired_at" class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">{{ activeReq?.status === 'terminated' ? 'Terminated' : 'Expired' }}</span>
                                <span class="text-sm text-gray-800">{{ formatTime(activeReq?.expired_at) }}</span>
                            </div>
                            <div v-if="activeReq?.request_note" class="p-3 bg-[#F3F4F6] rounded-xl text-sm text-gray-700">
                                <span class="font-semibold text-gray-500 text-xs block mb-1">Consultant note</span>
                                {{ activeReq.request_note }}
                            </div>
                            <div v-if="activeReq?.reject_note" class="p-3 bg-[#FEE2E2] rounded-xl text-sm text-[#B91C1C]">
                                <span class="font-semibold text-xs block mb-1">Reject note</span>
                                {{ activeReq.reject_note }}
                            </div>
                            <template v-if="['approved', 'active'].includes(activeReq?.status)">
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-black font-mono break-all">{{ activeReq?.username }}</div>
                                    <button @click="copyText(activeReq?.username, 'user')"
                                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap">
                                        {{ copied === 'user' ? 'Copied!' : 'Copy' }}
                                    </button>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-black font-mono break-all">{{ activeReq?.password }}</div>
                                    <button @click="copyText(activeReq?.password, 'pass')"
                                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap">
                                        {{ copied === 'pass' ? 'Copied!' : 'Copy' }}
                                    </button>
                                </div>
                                <p v-if="modalError" class="text-sm text-[#B91C1C] text-center">{{ modalError }}</p>
                                <div class="pt-2 border-t border-gray-100">
                                    <button v-if="!confirmTerminate" @click="confirmTerminate = true"
                                        class="w-full px-5 py-2 bg-white border border-[#FB2C36] text-[#FB2C36] rounded-md text-sm font-medium hover:bg-[#FEE2E2] transition-colors">
                                        Force Terminate
                                    </button>
                                    <div v-else class="flex gap-3">
                                        <button @click="confirmTerminate = false"
                                            class="flex-1 px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
                                        <button @click="doTerminate" :disabled="acting"
                                            class="flex-1 px-5 py-2 bg-[#FB2C36] text-white rounded-md text-sm font-medium hover:bg-[#E63939] disabled:opacity-60">
                                            {{ acting === 'terminate' ? 'Terminating…' : 'Confirm Terminate' }}
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
    isDark: Boolean,
    currentLang: { type: String, default: 'en' },
    team: { type: String, default: 'implementation' }, // 'implementation' | 'review'
})

const { getCredentialRequests, approveCredentialRequest, rejectCredentialRequest, terminateCredentialRequest } =
    props.team === 'review' ? useTempCredentials() : useImplementation()

const headers = ['Consultant Name', 'Client Name', 'Client ID', 'Time Requested', 'Status', 'Notes', 'Action']

const rows        = ref([])
const loading     = ref(false)
const search      = ref('')
const statusFilter = ref('')
const filterOpen  = ref(false)
const currentPage = ref(1)
const lastPage    = ref(1)
const total       = ref(0)

const statusOptions = [
    { value: '',           label: 'All Statuses' },
    { value: 'pending',    label: 'Pending' },
    { value: 'approved',   label: 'Approved' },
    { value: 'active',     label: 'Active' },
    { value: 'rejected',   label: 'Rejected' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'expired',    label: 'Expired' },
]
const statusLabel = computed(() => statusOptions.find(o => o.value === statusFilter.value)?.label ?? 'All Statuses')

async function fetchRows() {
    loading.value = true
    try {
        const p = await getCredentialRequests({
            search: search.value.trim() || undefined,
            status: statusFilter.value || undefined,
            page: currentPage.value,
            per_page: 10,
        })
        rows.value        = p.data ?? []
        currentPage.value = p.current_page ?? 1
        lastPage.value    = p.last_page ?? 1
        total.value       = p.total ?? 0
    } finally {
        loading.value = false
    }
}

function goToPage(p) {
    if (p < 1 || p > lastPage.value || p === currentPage.value) return
    currentPage.value = p
    fetchRows()
}

const pageWindow = computed(() => {
    const win = 5
    let start = Math.max(1, currentPage.value - Math.floor(win / 2))
    const end = Math.min(lastPage.value, start + win - 1)
    start = Math.max(1, end - win + 1)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

let searchTimer = null
watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { currentPage.value = 1; fetchRows() }, 350)
})

function selectStatus(val) {
    statusFilter.value = val
    filterOpen.value = false
    currentPage.value = 1
    fetchRows()
}

// --- Modals ---
const showReview       = ref(false)
const showView         = ref(false)
const activeReq        = ref(null)
const rejectNote       = ref('')
const approvedCreds    = ref(null)
const acting           = ref(null)
const modalError       = ref('')
const copied           = ref(null)
const confirmTerminate = ref(false)

function openReview(req) {
    activeReq.value     = req
    rejectNote.value    = ''
    approvedCreds.value = null
    modalError.value    = ''
    showReview.value    = true
}

function closeReview() {
    showReview.value = false
    if (approvedCreds.value) fetchRows()
}

const showInfo = ref(false)

function openInfo(req) {
    activeReq.value = req
    showInfo.value = true
}

function openView(req) {
    activeReq.value        = req
    modalError.value       = ''
    confirmTerminate.value = false
    showView.value         = true
}

async function doApprove() {
    acting.value = 'approve'
    modalError.value = ''
    try {
        approvedCreds.value = await approveCredentialRequest(activeReq.value.id)
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to approve request.'
    } finally {
        acting.value = null
    }
}

async function doReject() {
    if (!rejectNote.value.trim()) return
    acting.value = 'reject'
    modalError.value = ''
    try {
        await rejectCredentialRequest(activeReq.value.id, rejectNote.value.trim())
        showReview.value = false
        fetchRows()
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to reject request.'
    } finally {
        acting.value = null
    }
}

async function doTerminate() {
    acting.value = 'terminate'
    modalError.value = ''
    try {
        await terminateCredentialRequest(activeReq.value.id)
        showView.value = false
        fetchRows()
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to terminate credentials.'
    } finally {
        acting.value = null
    }
}

async function copyText(text, which) {
    try {
        await navigator.clipboard.writeText(text)
        copied.value = which
        setTimeout(() => { if (copied.value === which) copied.value = null }, 1500)
    } catch {}
}

const statusPill = (status) => ({
    pending:    'bg-[#FEF9C2] text-[#CE8600]',
    approved:   'bg-[#D0FAE5] text-[#007C65]',
    active:     'bg-[#DCFCE7] text-[#15803D]',
    rejected:   'bg-[#FEE2E2] text-[#B91C1C]',
    terminated: 'bg-[#FEE2E2] text-[#B91C1C]',
    expired:    'bg-gray-100 text-gray-500',
}[status] || 'bg-gray-100 text-gray-500')

const timeAgo = (dt) => {
    if (!dt) return '-'
    const secs = Math.max(0, Math.floor((Date.now() - new Date(dt).getTime()) / 1000))
    if (secs < 60) return 'Just now'
    const mins = Math.floor(secs / 60)
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
    const days = Math.floor(hrs / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
}

const formatTime = (dt) => {
    if (!dt) return '-'
    return new Date(dt).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
    })
}

onMounted(fetchRows)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
