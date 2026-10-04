<template>
    <div class="space-y-6">
        <!-- Content Card -->
        <div class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8 transition-all duration-300"
            :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5] text-black'">

            <div class="space-y-1 text-left rtl:text-right">
                <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">{{ currentLang === 'ar' ? 'طلبات بيانات الاعتماد' : 'Temporary Credential Requests' }}</h2>
                <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">{{ currentLang === 'ar' ? 'الموافقة على أو رفض طلبات تسجيل الدخول المؤقت' : 'Approve or reject temporary login requests from consultants' }}</p>
            </div>

            <!-- Search bar Row -->
            <div class="flex items-center gap-4">
                <div class="relative flex-1">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
                        <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
                    </span>
                    <input type="text" v-model="search"
                        :placeholder="currentLang === 'ar' ? 'بحث بالاستشاري أو العميل...' : 'Search by consultant, client name or ID...'"
                        class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                        :class="[currentLang === 'ar' ? 'pr-12 pl-4 text-right' : '', isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]']" />
                </div>
                <button @click="resetAndReload" :disabled="loading" title="Reset filters and reload"
                    class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                    :class="[isDark ? 'bg-black/20 border-white/10' : 'bg-white', loading ? 'opacity-50 cursor-not-allowed' : '']">
                    <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', loading ? 'animate-spin' : '']">
                </button>

                <div class="relative w-[220px]">
                    <button @click.stop="filterOpen = !filterOpen"
                        class="w-full h-[48px] px-4 rounded-[10px] border border-[#04C18F] flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                        :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
                        <span class="text-[14px] font-regular flex-1 text-center">{{ statusLabel }}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="3" class="transition-transform opacity-40" :class="{ 'rotate-180': filterOpen }">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                    <div v-if="filterOpen"
                        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-2 z-20 flex flex-col gap-1">
                        <button v-for="opt in statusOptions" :key="opt.value" @click.stop="selectStatus(opt.value)"
                            class="text-left px-4 py-2.5 rounded-[10px] text-[15px] transition-colors cursor-pointer"
                            :class="statusFilter === opt.value ? 'bg-[#E6FFF3] text-[#1a1a1a]' : 'text-[#1a1a1a] hover:bg-gray-50'">
                            {{ opt.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <CommonAdminDataTable :headers="headers" :loading="loading" :row-count="rows.length" :dark="isDark" empty-text="No credential requests found.">
                <tr v-for="req in rows" :key="req.id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                    <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ req.consultant_name }}</td>
                    <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ req.client_name || '-' }}</td>
                    <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC] tabular-nums" :class="isDark ? 'text-white/90' : ''">{{ req.client_id }}</td>
                    <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC] whitespace-nowrap" :class="isDark ? 'text-white/90' : ''">{{ formatTime(req.requested_at) }}</td>
                    <td class="py-6 px-8">
                        <span class="px-3 py-0.5 rounded-full text-[13px] capitalize" :class="statusPill(req.status)">
                            {{ req.status }}
                        </span>
                    </td>
                    <td class="py-6 px-8 text-[14px] font-regular max-w-[220px] truncate" :class="!req.request_note ? 'text-center text-gray-400' : (isDark ? 'text-white/90' : 'text-[#000000CC]')" :title="req.request_note || ''">
                        {{ req.request_note || '—' }}
                    </td>
                    <td class="py-6 px-8">
                        <div class="flex items-center gap-2">
                            <button v-if="req.status === 'pending'" @click="openReview(req)"
                                class="px-5 py-2 rounded-[8px] bg-[#04C18F] text-white text-[13px] font-medium hover:bg-[#03a87c] transition-colors cursor-pointer shadow-sm">
                                Review
                            </button>
                            <button v-else @click="openView(req)"
                                class="px-5 py-2 rounded-[8px] border border-[#00896F] text-[#00896F] text-[13px] font-medium hover:bg-[#E6FDF9] transition-colors cursor-pointer"
                                :class="isDark ? 'bg-transparent' : 'bg-white'">
                                View
                            </button>
                            <button v-if="req.has_logged_in" @click="openInfo(req)"
                                class="px-4 py-2 rounded-[8px] border border-[#193CB8] text-[#193CB8] text-[13px] font-medium hover:bg-[#DBEAFE] transition-colors cursor-pointer flex items-center gap-1.5"
                                :class="isDark ? 'bg-transparent' : 'bg-white'">
                                <span v-if="req.is_online" class="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
                                Info
                            </button>
                        </div>
                    </td>
                </tr>
            </CommonAdminDataTable>

            <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loading" :dark="isDark"
                :per-page-options="[10, 20, 50]"
                @page-change="p => fetchRows(p)" @per-page-change="p => fetchRows(1, p)" />
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
                    <div class="bg-white rounded-2xl shadow-xl w-[460px] max-w-full flex flex-col max-h-[78vh]">
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
                    <div class="bg-white rounded-2xl shadow-xl w-[460px] max-w-full flex flex-col max-h-[78vh]">
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
const meta        = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })

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

async function fetchRows(page = meta.value.current_page, perPage = meta.value.per_page) {
    loading.value = true
    try {
        const p = await getCredentialRequests({
            search: search.value.trim() || undefined,
            status: statusFilter.value || undefined,
            page,
            per_page: perPage,
        })
        rows.value = p.data ?? []
        meta.value = {
            current_page: p.current_page ?? 1,
            per_page: perPage,
            total: p.total ?? 0,
            last_page: p.last_page ?? 1,
        }
    } finally {
        loading.value = false
    }
}

let searchTimer = null
watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => fetchRows(1), 350)
})

function resetAndReload() {
    search.value = ''
    statusFilter.value = ''
    fetchRows(1)
}

function selectStatus(val) {
    statusFilter.value = val
    filterOpen.value = false
    fetchRows(1)
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
