<template>
    <div class="space-y-6">
        <div class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8 transition-all duration-300"
            :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5] text-black'">

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="space-y-1 text-left rtl:text-right">
                    <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">{{ currentLang === 'ar' ? 'طلبات حذف الحساب' : 'Account Deletion Requests' }}</h2>
                    <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
                        {{ role === 'review'
                            ? (currentLang === 'ar' ? 'الموافقة على أو رفض طلبات حذف الحساب' : 'Approve or reject account deletion requests')
                            : (currentLang === 'ar' ? 'تنفيذ الحذف بعد موافقة المراجع' : 'Execute deletion once Review Manager has approved') }}
                    </p>
                </div>
                <div class="flex items-center gap-4">
                    <select v-model="statusFilter" @change="fetchRows(1)"
                        class="h-[48px] px-4 rounded-[10px] border border-[#04C18F] text-[14px] font-regular w-[160px]"
                        :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
                        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                    <button @click="fetchRows(page)" :disabled="loading"
                        class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                        :class="[isDark ? 'bg-black/20 border-white/10' : 'bg-white', loading ? 'opacity-50 cursor-not-allowed' : '']">
                        <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', loading ? 'animate-spin' : '']">
                    </button>
                </div>
            </div>

            <div v-if="role === 'super-admin' && eligibleForRemovalCount > 0 && statusFilter === ''"
                class="flex items-center justify-between rounded-[10px] border px-5 py-3 text-sm"
                :class="isDark ? 'bg-[#FB2C36]/10 border-[#FB2C36]/30 text-red-200' : 'bg-red-50 border-red-200 text-red-700'">
                <span>{{ eligibleForRemovalCount }} organization{{ eligibleForRemovalCount > 1 ? 's are' : ' is' }} ready to be removed.</span>
                <button @click="statusFilter = 'completed'; fetchRows(1)" class="font-medium underline whitespace-nowrap">View Completed</button>
            </div>

            <CommonAdminDataTable :headers="headers" :loading="loading" :row-count="rows.length" :dark="isDark" empty-text="No requests found.">
                <tr v-for="req in rows" :key="req.id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                    <td class="py-6 px-8 text-[14px] font-regular" :class="isDark ? 'text-white/90' : 'text-[#000000CC]'">{{ req.user_name || '—' }}</td>
                    <td class="py-6 px-8 text-[14px] font-regular" :class="isDark ? 'text-white/90' : 'text-[#000000CC]'">{{ req.user_email || '—' }}</td>
                    <td class="py-6 px-8 text-[14px] font-regular" :class="isDark ? 'text-white/90' : 'text-[#000000CC]'">{{ req.source === 'public' ? 'Public' : 'In-app' }}</td>
                    <td class="py-6 px-8 text-[14px] font-regular whitespace-nowrap" :class="isDark ? 'text-white/90' : 'text-[#000000CC]'">{{ formatTime(req.created_at) }}</td>
                    <td class="py-6 px-8">
                        <span class="px-3 py-0.5 rounded-full text-[13px] capitalize" :class="statusPill(req.status)">{{ req.status }}</span>
                    </td>
                    <td class="py-6 px-8">
                        <div class="flex items-center gap-2">
                            <button @click="openModal(req)"
                                class="px-5 py-2 rounded-[8px] bg-[#04C18F] text-white text-[13px] font-medium hover:bg-[#03a87c] transition-colors cursor-pointer shadow-sm">
                                {{ (role === 'review' && req.status === 'pending') || (role === 'super-admin' && req.status === 'approved') ? 'Review' : 'View' }}
                            </button>
                            <button v-if="role === 'super-admin' && req.status === 'completed' && req.is_owner" @click="openRemoveOrg(req)"
                                class="px-5 py-2 rounded-[8px] border border-[#FB2C36] text-[#FB2C36] text-[13px] font-medium hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                                :class="isDark ? 'bg-transparent' : 'bg-white'">
                                Remove organization
                            </button>
                        </div>
                    </td>
                </tr>
            </CommonAdminDataTable>
            <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loading" :dark="isDark"
                @page-change="(p) => fetchRows(p)" @per-page-change="(pp) => { perPage = pp; fetchRows(1) }" />
        </div>

        <!-- Unified request modal: Info / User Info / Feedback / Review Manager (super-admin only) — fixed height across every tab, no layout shift -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="rounded-2xl shadow-xl w-[520px] max-w-full h-[620px] flex flex-col transition-colors"
                        :class="isDark ? 'bg-[#0B2620] border border-white/10' : 'bg-white'">
                        <div class="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                            <div>
                                <h3 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Account Deletion Request</h3>
                                <p class="text-xs mt-0.5" :class="isDark ? 'text-white/50' : 'text-gray-400'">{{ activeReq?.user_name || activeReq?.user_email }}</p>
                            </div>
                            <button @click="closeModals" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        <!-- Tabs -->
                        <div class="flex gap-1 px-6 pt-3 border-b flex-shrink-0" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                            <button v-for="t in modalTabs" :key="t.id" @click="modalTab = t.id"
                                class="px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap"
                                :class="modalTab === t.id
                                    ? 'border-[#00896F] text-[#00896F]'
                                    : (isDark ? 'border-transparent text-white/50 hover:text-white/80' : 'border-transparent text-gray-500 hover:text-gray-700')">
                                {{ t.label }}
                            </button>
                        </div>

                        <div class="p-6 space-y-3 overflow-y-auto text-sm flex-1 modal-scroll">

                            <!-- Info: status + contact details -->
                            <template v-if="modalTab === 'info'">
                                <div class="flex items-center justify-between"><span :class="labelClass">Status</span><span class="px-3 py-0.5 rounded-full capitalize" :class="statusPill(activeReq?.status)">{{ activeReq?.status }}</span></div>
                                <div class="flex items-center justify-between"><span :class="labelClass">Name</span><span class="font-medium" :class="valueClass">{{ activeReq?.user_name || '—' }}</span></div>
                                <div class="flex items-center justify-between"><span :class="labelClass">Email</span><span class="font-medium flex items-center gap-1.5" :class="valueClass">{{ activeReq?.user_email || '—' }}<CommonCopyIconButton v-if="activeReq?.user_email" :value="activeReq.user_email" /></span></div>
                                <div class="flex items-center justify-between"><span :class="labelClass">Phone</span><span class="font-medium flex items-center gap-1.5" :class="valueClass">{{ activeReq?.user_phone || '—' }}<CommonCopyIconButton v-if="activeReq?.user_phone" :value="activeReq.user_phone" /></span></div>
                                <div class="flex items-center justify-between"><span :class="labelClass">Role</span><span class="font-medium" :class="valueClass">{{ roleLabel(activeReq) }}</span></div>

                                <!-- Fallback contact via the tenant owner, when the requester has no number and isn't the owner themselves -->
                                <div v-if="!activeReq?.user_phone && (activeReq?.owner_name || activeReq?.owner_email || activeReq?.owner_phone)"
                                    class="p-3 rounded-xl mt-2" :class="panelClass">
                                    <span class="font-semibold text-xs block mb-1" :class="labelClass">Account owner (fallback contact)</span>
                                    <div v-if="activeReq.owner_name" :class="valueClass">{{ activeReq.owner_name }}</div>
                                    <div v-if="activeReq.owner_email" :class="valueClass">{{ activeReq.owner_email }}</div>
                                    <div v-if="activeReq.owner_phone" :class="valueClass">{{ activeReq.owner_phone }}</div>
                                </div>
                            </template>

                            <!-- User Info: device / session meta -->
                            <template v-else-if="modalTab === 'user-info'">
                                <div class="flex items-center justify-between"><span :class="labelClass">Source</span><span :class="valueClass">{{ activeReq?.source === 'public' ? 'Public' : 'In-app' }}</span></div>
                                <div class="flex items-center justify-between"><span :class="labelClass">IP address</span><span class="font-mono text-xs" :class="valueClass">{{ activeReq?.ip_address || '—' }}</span></div>
                                <div class="flex items-start justify-between gap-4"><span class="flex-shrink-0" :class="labelClass">Device</span><span class="text-right break-words line-clamp-2" :class="valueClass">{{ deviceDisplay }}</span></div>
                                <div class="flex items-center justify-between"><span :class="labelClass">Raised</span><span :class="valueClass">{{ formatTime(activeReq?.created_at) }}</span></div>
                                <div v-if="activeReq?.reviewed_at" class="flex items-center justify-between"><span :class="labelClass">Reviewed</span><span :class="valueClass">{{ formatTime(activeReq?.reviewed_at) }}</span></div>
                                <div v-if="activeReq?.completed_at" class="flex items-center justify-between"><span :class="labelClass">Completed</span><span :class="valueClass">{{ formatTime(activeReq?.completed_at) }}</span></div>
                            </template>

                            <!-- Feedback -->
                            <template v-else-if="modalTab === 'feedback'">
                                <div v-if="!hasFeedback" class="text-center py-6" :class="labelClass">No feedback was given.</div>
                                <template v-else>
                                    <div v-if="feedbackReasons"><span :class="labelClass">Reason:</span> <span :class="valueClass">{{ feedbackReasons }}</span></div>
                                    <div v-if="activeReq.feedback.answers?.reason_other" class="p-3 rounded-xl" :class="panelClass">
                                        <span class="font-semibold text-xs block mb-1" :class="labelClass">Other — extra note</span><span :class="valueClass">{{ activeReq.feedback.answers.reason_other }}</span>
                                    </div>
                                    <div v-if="activeReq.feedback.answers?.improve_points?.length"><span :class="labelClass">Improve:</span> <span :class="valueClass">{{ activeReq.feedback.answers.improve_points.join(', ') }}</span></div>
                                    <div v-if="activeReq.feedback.answers?.improve_freetext" class="p-3 rounded-xl" :class="panelClass">
                                        <span class="font-semibold text-xs block mb-1" :class="labelClass">Note</span><span :class="valueClass">{{ activeReq.feedback.answers.improve_freetext }}</span>
                                    </div>
                                    <div v-if="activeReq.feedback.answers?.general_freetext" class="p-3 rounded-xl" :class="panelClass">
                                        <span class="font-semibold text-xs block mb-1" :class="labelClass">Custom note</span><span :class="valueClass">{{ activeReq.feedback.answers.general_freetext }}</span>
                                    </div>
                                </template>
                            </template>

                            <!-- Review Manager (super-admin only) -->
                            <template v-else-if="modalTab === 'review-manager'">
                                <div v-if="!activeReq?.reviewed_at" class="text-center py-6" :class="labelClass">Not reviewed yet.</div>
                                <template v-else>
                                    <div class="flex items-center justify-between"><span :class="labelClass">Manager</span><span class="font-medium" :class="valueClass">{{ activeReq?.reviewed_by_name || '—' }}</span></div>
                                    <div class="flex items-center justify-between"><span :class="labelClass">Time</span><span :class="valueClass">{{ formatTime(activeReq?.reviewed_at) }}</span></div>
                                    <div v-if="activeReq?.feedback?.reviewer_notes" class="p-3 rounded-xl" :class="panelClass">
                                        <span class="font-semibold text-xs block mb-1" :class="labelClass">Note</span><span :class="valueClass">{{ activeReq.feedback.reviewer_notes }}</span>
                                    </div>
                                </template>
                                <div v-if="activeReq?.feedback?.admin_notes" class="p-3 rounded-xl mt-2" :class="panelClass">
                                    <span class="font-semibold text-xs block mb-1" :class="labelClass">Super Admin's report</span><span :class="valueClass">{{ activeReq.feedback.admin_notes }}</span>
                                </div>
                            </template>
                        </div>

                        <!-- Actions -->
                        <div class="px-6 py-4 border-t flex-shrink-0" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                            <template v-if="role === 'review' && activeReq?.status === 'pending'">
                                <p class="text-xs font-semibold mb-1.5" :class="labelClass">Reviewer report</p>
                                <textarea v-model="notes" @input="sanitizeNotes" rows="2" maxlength="2000" placeholder="Explain your decision..."
                                    class="w-full border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#00896F] mb-1"
                                    :class="isDark ? 'bg-white/5 text-white placeholder:text-white/40 focus:bg-white/10' : 'bg-[#F3F4F6] text-black placeholder:text-[#717182] focus:bg-white'"></textarea>
                                <p v-if="notesTouched && !notes.trim()" class="text-xs text-[#EF4444] mb-2">Report is required</p>
                                <p v-if="modalError" class="text-sm text-[#EF4444] mb-2 text-center">{{ modalError }}</p>
                                <div class="flex gap-3 justify-center">
                                    <button @click="closeModals" class="px-5 py-2 border rounded-md text-sm font-medium" :class="isDark ? 'border-white/15 text-white/80 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">Cancel</button>
                                    <button @click="doReject" :disabled="acting || !notesValid" class="px-5 py-2 bg-[#FB2C36] text-white rounded-md text-sm font-medium hover:bg-[#E63939] disabled:opacity-40 disabled:cursor-not-allowed">{{ acting === 'reject' ? 'Rejecting…' : 'Reject' }}</button>
                                    <button @click="doApprove" :disabled="acting || !notesValid" class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56] disabled:opacity-40 disabled:cursor-not-allowed">{{ acting === 'approve' ? 'Approving…' : 'Approve' }}</button>
                                </div>
                            </template>
                            <template v-else-if="role === 'super-admin' && activeReq?.status === 'approved'">
                                <p class="text-xs font-semibold mb-1.5" :class="labelClass">Execution report</p>
                                <textarea v-model="notes" @input="sanitizeNotes" rows="2" maxlength="2000" placeholder="Explain this action..."
                                    class="w-full border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#00896F] mb-1"
                                    :class="isDark ? 'bg-white/5 text-white placeholder:text-white/40 focus:bg-white/10' : 'bg-[#F3F4F6] text-black placeholder:text-[#717182] focus:bg-white'"></textarea>
                                <p v-if="notesTouched && !notes.trim()" class="text-xs text-[#EF4444] mb-2">Report is required</p>
                                <p v-if="modalError" class="text-sm text-[#EF4444] mb-2 text-center">{{ modalError }}</p>
                                <div class="flex gap-3 justify-center">
                                    <button @click="closeModals" class="px-5 py-2 border rounded-md text-sm font-medium" :class="isDark ? 'border-white/15 text-white/80 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">Cancel</button>
                                    <button @click="doExecute" :disabled="acting || !notesValid" class="px-5 py-2 bg-[#FB2C36] text-white rounded-md text-sm font-medium hover:bg-[#E63939] disabled:opacity-40 disabled:cursor-not-allowed">{{ acting === 'execute' ? 'Deleting…' : 'Confirm Delete' }}</button>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex justify-center">
                                    <button @click="closeModals" class="px-6 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56]">Close</button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Remove organization confirm (Super Admin, §4.1) -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showRemoveOrg" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="rounded-2xl shadow-xl w-[440px] max-w-full px-8 py-8 text-center transition-colors" :class="isDark ? 'bg-[#0B2620] border border-white/10' : 'bg-white'">
                        <h3 class="text-[17px] font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ checklistLoading ? 'Checking…' : (removalChecklist?.eligible ? 'Remove organization now?' : 'Not ready for removal yet') }}
                        </h3>

                        <template v-if="checklistLoading">
                            <div class="space-y-3 mb-6">
                                <div v-for="n in 5" :key="n" class="h-4 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
                            </div>
                        </template>
                        <template v-else>
                            <ul class="text-sm text-left space-y-2 mb-6" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                                <li v-for="(item, i) in (removalChecklist?.checklist || [])" :key="i" class="flex items-start gap-2">
                                    <span :class="item.passed ? 'text-[#00896F]' : 'text-[#FB2C36]'">{{ item.passed ? '✓' : '✗' }}</span>
                                    <span>{{ item.label }}</span>
                                </li>
                            </ul>
                            <p v-if="removalChecklist?.eligible" class="text-sm mb-6" :class="isDark ? 'text-white/60' : 'text-gray-500'">This drops the organization's schema and all its data. This cannot be undone.</p>
                        </template>

                        <p v-if="modalError" class="text-sm text-[#EF4444] mb-3">{{ modalError }}</p>
                        <div class="flex gap-3 justify-center">
                            <button @click="closeModals" class="px-5 py-2 border rounded-md text-sm font-medium" :class="isDark ? 'border-white/15 text-white/80 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
                                {{ removalChecklist?.eligible ? 'Cancel' : 'Close' }}
                            </button>
                            <button v-if="!checklistLoading && removalChecklist?.eligible" @click="doRemoveOrg" :disabled="acting"
                                class="px-5 py-2 bg-[#FB2C36] text-white rounded-md text-sm font-medium hover:bg-[#E63939] disabled:opacity-60">
                                {{ acting === 'remove-org' ? 'Removing…' : 'Confirm Remove' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    isDark: Boolean,
    currentLang: { type: String, default: 'en' },
    role: { type: String, default: 'review' }, // 'review' | 'super-admin'
})

const { getReviewQueue, approveRequest, rejectRequest, getClientQueue, executeRequest, removeOrganization, getRemovalChecklist } = useAccountDeletionRequests()

const headers = ['Name', 'Email', 'Source', 'Raised', 'Status', 'Action']

const rows    = ref([])
const loading = ref(false)
const page    = ref(1)
const perPage = ref(10)
const meta    = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })

const reviewStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
]
const clientStatusOptions = [
    { value: '', label: 'All' },
    { value: 'approved', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
]
const statusOptions = computed(() => props.role === 'review' ? reviewStatusOptions : clientStatusOptions)
const statusFilter = ref(props.role === 'review' ? 'pending' : 'approved')
const eligibleForRemovalCount = ref(0)

async function fetchRows(p = page.value) {
    loading.value = true
    try {
        const opts = { status: statusFilter.value || undefined, page: p, per_page: perPage.value }
        const res = props.role === 'review' ? await getReviewQueue(opts) : await getClientQueue(opts)
        rows.value = res.data ?? []
        meta.value = res.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: perPage.value }
        page.value = meta.value.current_page
        if (props.role === 'super-admin') eligibleForRemovalCount.value = res.eligible_for_removal_count ?? 0
    } finally {
        loading.value = false
    }
}

const showModal      = ref(false)
const showRemoveOrg  = ref(false)
const activeReq      = ref(null)
const modalTab       = ref('info')
const notes          = ref('')
const notesTouched   = ref(false)
const acting         = ref(null)
const modalError     = ref('')

const modalTabs = computed(() => {
    const tabs = [{ id: 'info', label: 'Info' }]
    if (props.role === 'super-admin') tabs.push({ id: 'review-manager', label: 'Review Manager' })
    tabs.push({ id: 'user-info', label: 'User Info' }, { id: 'feedback', label: 'Feedback' })
    return tabs
})

const labelClass = computed(() => props.isDark ? 'text-white/60' : 'text-gray-500')
const valueClass = computed(() => props.isDark ? 'text-white' : 'text-gray-800')
const panelClass = computed(() => props.isDark ? 'bg-white/5' : 'bg-[#F3F4F6]')

const { userRoleLabel } = useRoleLabel()
function roleLabel(req) {
    if (!req?.user_role) return '—'
    return userRoleLabel({ role: req.user_role, is_primary: req.is_owner }, props.currentLang)
}

// Notes must be a real report: required, alphanumeric + common punctuation only, no emoji/pasted rich content.
const NOTES_PATTERN = /^[a-zA-Z0-9\s.,!?()'"\-:;@#&%/]*$/
function sanitizeNotes(e) {
    notesTouched.value = true
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9\s.,!?()'"\-:;@#&%/]/g, '')
    if (cleaned !== e.target.value) notes.value = cleaned
}
const notesValid = computed(() => notes.value.trim().length > 0 && notes.value.trim().length <= 2000 && NOTES_PATTERN.test(notes.value))

// Parsed label when we have one; the raw request header when parsing gave up, so nothing is hidden.
const deviceDisplay = computed(() => {
    const label = activeReq.value?.device_label
    if (label && label !== 'Unknown Device') return label
    return activeReq.value?.user_agent || label || '—'
})

const hasFeedback = computed(() => {
    const a = activeReq.value?.feedback?.answers
    return !!(a && (a.reason?.length || a.reason_other || a.improve_points?.length || a.improve_freetext || a.general_freetext))
})

// Title-cases legacy snake_case test values (e.g. "too_expensive") the same way a raw enum would read.
const titleCase = (v) => String(v).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const feedbackReasons = computed(() => {
    const reason = activeReq.value?.feedback?.answers?.reason
    if (!reason) return ''
    return (Array.isArray(reason) ? reason : [reason]).map(titleCase).join(', ')
})

function closeModals() {
    showModal.value = showRemoveOrg.value = false
    modalError.value = ''
}

function openModal(req) { activeReq.value = req; modalTab.value = 'info'; notes.value = ''; notesTouched.value = false; modalError.value = ''; showModal.value = true }
const checklistLoading = ref(false)
const removalChecklist = ref(null)
async function openRemoveOrg(req) {
    activeReq.value = req; modalError.value = ''; showRemoveOrg.value = true
    checklistLoading.value = true; removalChecklist.value = null
    try {
        removalChecklist.value = await getRemovalChecklist(req.id)
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to load removal status.'
    } finally {
        checklistLoading.value = false
    }
}

async function doApprove() {
    acting.value = 'approve'; modalError.value = ''
    try {
        await approveRequest(activeReq.value.id, notes.value.trim())
        showModal.value = false
        await fetchRows()
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to approve request.'
    } finally { acting.value = null }
}

async function doReject() {
    acting.value = 'reject'; modalError.value = ''
    try {
        await rejectRequest(activeReq.value.id, notes.value.trim())
        showModal.value = false
        await fetchRows()
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to reject request.'
    } finally { acting.value = null }
}

async function doExecute() {
    acting.value = 'execute'; modalError.value = ''
    try {
        await executeRequest(activeReq.value.id, notes.value.trim())
        showModal.value = false
        await fetchRows()
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to execute deletion.'
    } finally { acting.value = null }
}

async function doRemoveOrg() {
    acting.value = 'remove-org'; modalError.value = ''
    try {
        await removeOrganization(activeReq.value.id)
        showRemoveOrg.value = false
        await fetchRows()
    } catch (e) {
        modalError.value = e?.data?.message || 'Failed to remove organization.'
    } finally { acting.value = null }
}

const statusPill = (status) => ({
    pending:   'bg-[#FEF9C2] text-[#CE8600]',
    approved:  'bg-[#D0FAE5] text-[#007C65]',
    rejected:  'bg-[#FEE2E2] text-[#B91C1C]',
    completed: 'bg-gray-100 text-gray-500',
}[status] || 'bg-gray-100 text-gray-500')

const formatTime = (dt) => {
    if (!dt) return '-'
    return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
}

onMounted(fetchRows)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-scroll { scrollbar-width: thin; scrollbar-color: #D1D5DB transparent; }
.modal-scroll::-webkit-scrollbar { width: 6px; }
.modal-scroll::-webkit-scrollbar-track { background-color: transparent; }
.modal-scroll::-webkit-scrollbar-thumb { background-color: #D1D5DB; border-radius: 9999px; }
</style>
