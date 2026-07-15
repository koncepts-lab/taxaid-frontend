<template>
    <div class="p-6 space-y-6 font-sans pb-24">
        <!-- Header -->
        <div class="flex items-center gap-4">
            <button @click="$emit('back')" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#013E32]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <div>
                <h1 class="text-2xl font-medium text-gray-900">{{ project.name }}</h1>
                <p class="text-sm text-[#717182]">Project Details</p>
            </div>
        </div>

        <!-- Top Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="info in projectInfo" :key="info.label"
                class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p class="text-sm text-black/50 font-normal mb-1">{{ info.label }}</p>
                <p class="text-base font-semibold text-black">{{ info.value }}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p class="text-sm text-black/50 font-normal mb-2">Progress</p>
                <div class="flex items-center gap-5">
                    <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div class="h-full transition-all rounded-full duration-500" :style="{
                            width: (completedCount / 15 * 100) + '%',
                            backgroundColor: getProgressHex(completedCount)
                        }"></div>
                    </div>
                    <span class="text-xs font-bold text-gray-700 tabular-nums whitespace-nowrap">
                        {{ completedCount }}/15
                    </span>
                </div>
            </div>
        </div>

        <!-- Temporary Login Credentials (3/4) + TaxAid Connect (1/4) -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div class="flex items-start justify-between gap-6 flex-wrap">
                <div>
                    <h3 class="text-xl font-normal mb-1 text-black">Temporary Login Credentials</h3>
                    <p class="text-base text-[#717182]">Request temporary access to this client's account for implementation work</p>
                </div>
                <span v-if="credReq" class="px-3 py-1 rounded-full text-sm capitalize" :class="credStatusPill(credReq.status)">
                    {{ credReq.status }}
                </span>
            </div>

            <div class="mt-6">
                <!-- No request yet, or re-requestable -->
                <div v-if="!credReq || ['rejected', 'terminated'].includes(credReq.status)" class="space-y-4">
                    <div v-if="credReq?.status === 'rejected'"
                        class="p-4 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C]">
                        <span class="font-semibold">Rejected by manager:</span> {{ credReq.reject_note || '-' }}
                    </div>
                    <div v-else-if="credReq?.status === 'terminated'"
                        class="p-4 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C]">
                        These credentials were terminated by the manager. You can request new ones.
                    </div>
                    <textarea v-model="credNote" rows="2" maxlength="500"
                        placeholder="Note to manager (optional)..."
                        class="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-3 text-sm text-black outline-none placeholder:text-[#717182] focus:bg-white focus:ring-1 focus:ring-[#00896F]"></textarea>
                    <button @click="submitCredRequest" :disabled="credLoading"
                        class="bg-[#00896F] hover:bg-[#006B56] text-white px-8 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ credLoading ? 'Requesting…' : (credReq ? 'Re-request Credentials' : 'Request Credentials') }}
                    </button>
                    <p v-if="credError" class="text-sm text-[#B91C1C]">{{ credError }}</p>
                </div>

                <!-- Pending -->
                <div v-else-if="credReq.status === 'pending'"
                    class="p-4 bg-[#FEF9C2] border border-[#FDE68A] rounded-xl text-sm text-[#CE8600]">
                    Your request is pending manager approval. This card will show the credentials once approved.
                </div>

                <!-- Approved / Active -->
                <div v-else-if="['approved', 'active'].includes(credReq.status)" class="space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-black font-mono break-all">
                            {{ credReq.username }}
                        </div>
                        <button @click="copyCred(credReq.username, 'user')"
                            class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                            {{ copied === 'user' ? 'Copied!' : 'Copy' }}
                        </button>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-black font-mono break-all">
                            {{ credReq.password }}
                        </div>
                        <button @click="copyCred(credReq.password, 'pass')"
                            class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                            {{ copied === 'pass' ? 'Copied!' : 'Copy' }}
                        </button>
                    </div>
                    <p class="text-xs text-[#717182]">Use these to log into the client's account. They expire automatically when the client goes live.</p>
                </div>

                <!-- Expired -->
                <div v-else-if="credReq.status === 'expired'"
                    class="p-4 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500">
                    These credentials have expired (client is live).
                </div>
            </div>
        </div>

        <!-- TaxAid Connector Card (1/4) -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col">
            <div class="flex items-start justify-between gap-2">
                <h3 class="text-xl font-normal mb-1 text-black">TaxAid Connector</h3>
                <span v-if="connCode?.code && !connCode?.connected && connCode?.is_expired" class="px-3 py-1 rounded-full text-sm bg-[#FEE2E2] text-[#B91C1C]">Expired</span>
            </div>
            <div v-if="connCode?.connected" class="mb-6">
                <span class="inline-block px-3 py-1 rounded-full text-sm bg-[#DCFCE7] text-[#15803D]">Connected</span>
            </div>
            <p v-else class="text-base text-[#717182] mb-6">One-time activation code for the client's connector</p>

            <!-- Connected: no more generation -->
            <div v-if="connCode?.connected" class="space-y-2">
                <p class="text-sm text-black capitalize"><span class="text-[#717182]">ERP:</span> {{ connCode.erp_type || '-' }}</p>
                <p class="text-xs text-[#717182]">Connector is linked. Last sync: {{ formatDate(connCode.last_sync_at) }}.</p>
            </div>

            <!-- Code exists, not connected -->
            <div v-else-if="connCode?.code" class="space-y-3">
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-[#F3F4F6] rounded-xl px-3 py-2.5 text-sm text-black font-mono break-all">
                        {{ connCode.code }}
                    </div>
                    <button @click="copyCred(connCode.code, 'conn')"
                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                        {{ copied === 'conn' ? 'Copied!' : 'Copy' }}
                    </button>
                </div>
                <p class="text-xs text-[#717182]">
                    <span v-if="connCode.is_expired">This code expired unused — generate a new one.</span>
                    <span v-else>Valid until {{ formatDate(connCode.expires_at) }}. Paste it into the connector to link this client.</span>
                </p>
                <button @click="generateCode" :disabled="connLoading"
                    class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50">
                    {{ connLoading ? 'Generating…' : 'Regenerate' }}
                </button>
            </div>

            <!-- No code yet -->
            <div v-else class="space-y-3">
                <button @click="generateCode" :disabled="connLoading"
                    class="bg-[#00896F] hover:bg-[#006B56] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50">
                    {{ connLoading ? 'Generating…' : 'Generate Code' }}
                </button>
            </div>

            <p v-if="connError" class="text-xs text-[#B91C1C] mt-2">{{ connError }}</p>
        </div>
        </div>

        <!-- Implementation Table -->
        <div class="bg-white rounded-2xl border shadow-sm p-8 overflow-hidden">
            <h3 class="text-xl font-normal mb-1 text-black">Implementation Steps</h3>
            <p class="text-base text-[#717182] mb-6">Track progress through all 15 implementation milestones</p>

            <div class="overflow-x-auto border-black/10 border rounded-2xl">
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-black text-sm tracking-wider border-b border-black/10">
                            <th class="px-4 py-3 font-medium">Sl Num</th>
                            <th class="px-4 py-3 font-medium">Particulars</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Client Delay</th>
                            <th class="px-4 py-3 font-medium">Time Stamp</th>
                            <th class="px-4 py-3 font-medium">Client Delay Reason</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <template v-for="(step, idx) in steps" :key="step.id">
                            <tr v-if="idx === 5">
                                <td colspan="6" class="">
                                    <div
                                        class="flex items-center justify-between p-4 bg-[#FDC70029] border border-[#FDC700BD]  shadow-sm">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 bg-[#D08700] rounded-full flex items-center justify-center text-white shrink-0">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2.5">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p class="text-sm font-semibold text-[#D08700]">
                                                    {{ steps[4]?.status ? 'First 5 steps Completed!' :
                                                        'First 5 steps Pending' }}
                                                </p>
                                                <p class="text-sm  text-[#D08700]">Click to enable client dashboard
                                                    access for partial visibility.</p>
                                            </div>
                                        </div>

                                        <button :disabled="!steps[4]?.status"
                                            class="bg-[#FB2C36] hover:bg-[#E63939] text-white px-15 py-1.5 rounded-lg text-base font-normal flex items-center gap-2 transition-all shadow-lg shadow-red-200  disabled:opacity-50  disabled:cursor-not-allowed disabled:shadow-none">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2.5">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            Display Dashboard
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50/50 transition-colors border-b ">
                                <td class="px-4 py-3 text-sm font-medium text-black">{{ idx + 1 }}</td>
                                <td class="px-4 py-3 text-sm text-black">{{ step.label }}</td>

                                <td class="px-4 py-3">
                                    <div @click="toggleStep(step, idx)"
                                        class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                                        :class="[
                                            step.status ? 'bg-[#00896F] border-[#00896F]' : 'bg-white border-gray-200',
                                            idx > 0 && !steps[idx - 1].status ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                        ]">
                                        <svg v-if="step.status" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="white" stroke-width="4">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <div @click="toggleDelay(step)"
                                        class="w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all"
                                        :class="step.clientDelay ? 'bg-[#00896F] border-[#00896F]' : 'bg-white border-gray-200'">
                                        <svg v-if="step.clientDelay" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="white" stroke-width="4">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-black font-normal whitespace-nowrap">{{ step.timestamp
                                    || '-' }}</td>
                                <td class="px-4 py-3 min-w-[300px]">
                                    <div class="flex items-center gap-2 h-10">
                                        <input type="text" v-model="step.delayReason"
                                            :ref="el => { if (el) delayInputs[step.id] = el }"
                                            placeholder="Click to add delay reason..." @focus="activeStepId = step.id"
                                            @keyup.enter="saveStepDelay(step)" :disabled="!step.clientDelay"
                                            class="flex-1 bg-[#F3F4F6] border-none rounded-lg px-3 py-2 text-black text-sm outline-none transition-all placeholder:text-[#717182] disabled:opacity-50"
                                            :class="activeStepId === step.id ? 'bg-white ring-1 ring-[#00896F]' : 'bg-[#F3F4F6]'" />

                                        <Transition name="fade">
                                            <button v-if="activeStepId === step.id"
                                                @mousedown.prevent="saveStepDelay(step)"
                                                class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-4 py-1.5 rounded-md text-xs font-semibold transition-all active:scale-95 shadow-sm whitespace-nowrap">
                                                {{ step.isSaved ? 'Update' : 'Save' }}
                                            </button>
                                        </Transition>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>

        <div
            class="bg-[#61FFD62E] border-[#00BE8CBD] border p-6 rounded-2xl shadow-2xl flex items-center justify-between ">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-[#00896F] rounded-full text-white">
                    <img src="/images/icons/rocket.svg" alt="Celebration" class="w-6 h-6">
                </div>
                <div>
                    <h4 class="text-[#007C65] font-bold text-xl">All 15 Implementation Steps are Completed!</h4>
                    <p class="text-[#007C65] text-base">Click "Ready for Go Live" to finalize this project.</p>
                </div>
            </div>
            <button :disabled="!steps[14]?.status || isLive" @click="showGoLiveModal = true"
                class="bg-[#00896F] hover:bg-[#006B56] text-white px-15 py-1.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ">
                <img src="/images/icons/rocket.svg" alt="Celebration" class="w-6 h-6">

                {{ isLive ? 'Client is Live' : 'Ready for Go Live' }}
            </button>
        </div>

        <!-- Go Live Confirmation Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showGoLiveModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[420px] max-w-full px-8 py-8 text-center">
                        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
                            <img src="/images/icons/rocket.svg" alt="Go Live" class="w-6 h-6">
                        </div>
                        <template v-if="!goLiveDone">
                            <h3 class="text-[17px] font-semibold text-gray-900 mb-2">Set Client Live?</h3>
                            <p class="text-sm text-gray-500 mb-1">You're marking</p>
                            <p class="text-sm font-semibold text-gray-800 mb-1">{{ project.name }}</p>
                            <p class="text-sm text-gray-500 mb-6">as live. All temporary login credentials for this client will be deleted.</p>
                            <p v-if="goLiveError" class="text-sm text-[#B91C1C] mb-4">{{ goLiveError }}</p>
                            <div class="flex gap-3 justify-center">
                                <button @click="showGoLiveModal = false" class="px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
                                <button @click="confirmGoLive" :disabled="goLiveLoading"
                                    class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56] transition-colors disabled:opacity-60">
                                    {{ goLiveLoading ? 'Processing…' : 'Confirm Go Live' }}
                                </button>
                            </div>
                        </template>
                        <template v-else>
                            <h3 class="text-[17px] font-semibold text-gray-900 mb-2">Client is Live!</h3>
                            <p class="text-sm text-gray-500 mb-6">{{ project.name }} is now live. Temporary credentials have been removed.</p>
                            <button @click="showGoLiveModal = false" class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56]">Close</button>
                        </template>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

const props = defineProps({ project: Object })
const emit = defineEmits(['back'])

const { updateStepProgress, requestCredentials, getMyCredentialRequest, goLive, getConnectorCode, generateConnectorCode } = useImplementation()

// --- TaxAid Connect activation code ---
const connCode    = ref(null)
const connLoading = ref(false)
const connError   = ref('')

async function loadConnectorCode() {
    try { connCode.value = await getConnectorCode(props.project.clientId) } catch {}
}

async function generateCode() {
    connLoading.value = true
    connError.value = ''
    try {
        await generateConnectorCode(props.project.clientId)
        await loadConnectorCode()
    } catch (e) {
        connError.value = e?.data?.message || 'Failed to generate code.'
        await loadConnectorCode()
    } finally {
        connLoading.value = false
    }
}

// --- Temporary login credentials ---
const credReq     = ref(null)
const credNote    = ref('')
const credLoading = ref(false)
const credError   = ref('')
const copied      = ref(null)

async function loadCredRequest() {
    try {
        credReq.value = await getMyCredentialRequest(props.project.clientId)
    } catch { credReq.value = null }
}

async function submitCredRequest() {
    credLoading.value = true
    credError.value = ''
    try {
        await requestCredentials(props.project.clientId, credNote.value.trim() || null)
        credNote.value = ''
        await loadCredRequest()
    } catch (e) {
        credError.value = e?.data?.message || 'Failed to submit request.'
    } finally {
        credLoading.value = false
    }
}

async function copyCred(text, which) {
    try {
        await navigator.clipboard.writeText(text)
        copied.value = which
        setTimeout(() => { if (copied.value === which) copied.value = null }, 1500)
    } catch {}
}

const credStatusPill = (status) => ({
    pending:    'bg-[#FEF9C2] text-[#CE8600]',
    approved:   'bg-[#D0FAE5] text-[#007C65]',
    active:     'bg-[#DCFCE7] text-[#15803D]',
    rejected:   'bg-[#FEE2E2] text-[#B91C1C]',
    terminated: 'bg-[#FEE2E2] text-[#B91C1C]',
    expired:    'bg-gray-100 text-gray-500',
}[status] || 'bg-gray-100 text-gray-500')

// --- Go Live ---
const showGoLiveModal = ref(false)
const goLiveLoading   = ref(false)
const goLiveError     = ref('')
const goLiveDone      = ref(false)
const isLive          = ref(false)

async function confirmGoLive() {
    goLiveLoading.value = true
    goLiveError.value = ''
    try {
        await goLive(props.project.clientId)
        goLiveDone.value = true
        isLive.value = true
        await loadCredRequest()
    } catch (e) {
        goLiveError.value = e?.data?.message || 'Failed to set client live.'
    } finally {
        goLiveLoading.value = false
    }
}

onMounted(() => {
    loadCredRequest()
    loadConnectorCode()
})

const activeStepId = ref(null)
const delayInputs = reactive({})

const formatDate = (dateInput) => {
    if (!dateInput) return '-'
    const date = new Date(dateInput)
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date)
}

const projectInfo = [
    { label: 'Client Id', value: props.project.clientId },
    { label: 'Client Name', value: props.project.name },
    { label: 'ERP', value: props.project.erp },
    { label: 'Start Date', value: formatDate(props.project.date) },
    { label: 'Expected Close', value: formatDate(props.project.close) },
]

// --- MOCK STEPS (commented out — replaced by API data from props.project.steps) ---
// const steps = ref([
//     { id: 1, label: 'Connector activated', status: true, clientDelay: true, timestamp: '3/16/2026, 6:18:18 PM', delayReason: 'Credentials verified', isSaved: true },
//     ...15 items
// ])

const steps = ref(props.project.steps ?? [])

const completedCount = computed(() => steps.value.filter(s => s.status).length)

const toggleStep = async (step, idx) => {
    const isFirstStep = idx === 0
    const isPreviousStepDone = isFirstStep || steps.value[idx - 1].status
    const isNextStepDone = idx < steps.value.length - 1 && steps.value[idx + 1].status

    if (!step.status) {
        if (!isPreviousStepDone) return
        step.status = true
        step.timestamp = new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        })
    } else {
        if (isNextStepDone) return
        step.status = false
        step.timestamp = ''
    }

    await updateStepProgress(step.id, { completed: step.status })
}

const toggleDelay = async (step) => {
    step.clientDelay = !step.clientDelay
    if (!step.clientDelay) step.delayReason = ''
    await updateStepProgress(step.id, {
        client_delay: step.clientDelay,
        client_delay_reason: step.clientDelay ? step.delayReason : null,
    })
}

const saveStepDelay = async (step) => {
    step.isSaved = !!step.delayReason.trim()
    activeStepId.value = null
    if (delayInputs[step.id]) delayInputs[step.id].blur()
    await updateStepProgress(step.id, { client_delay_reason: step.delayReason || null })
}

const getProgressHex = (count) => {
    if (count >= 10) return '#00896F'
    if (count >= 6) return '#F59E0B'
    return '#E64A19'
}
</script>

<style scoped>
@keyframes slideUp {
    from {
        transform: translate(-50%, 100%);
        opacity: 0;
    }

    to {
        transform: translate(-50%, 0);
        opacity: 1;
    }
}

.animate-slideUp {
    animation: slideUp 0.4s ease-out forwards;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>