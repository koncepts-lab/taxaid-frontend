<template>
    <div class="rounded-xl p-6 shadow-sm border"
        :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h3 class="text-[16px] font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
                    Temporary Login Credentials
                </h3>
                <p class="text-[13px]" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                    Request temporary access to this client's account. Credentials expire when the review timer stops.
                </p>
            </div>
            <span v-if="credReq" class="px-3 py-1 rounded-full text-[13px] capitalize" :class="credStatusPill(credReq.status)">
                {{ credReq.status }}
            </span>
        </div>

        <div class="mt-4">
            <!-- No request yet, or re-requestable -->
            <div v-if="!credReq || ['rejected', 'terminated', 'expired'].includes(credReq.status)" class="space-y-3">
                <div v-if="credReq?.status === 'rejected'"
                    class="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-[13px] text-[#B91C1C]">
                    <span class="font-semibold">Rejected by manager:</span> {{ credReq.reject_note || '-' }}
                </div>
                <div v-else-if="credReq?.status === 'terminated'"
                    class="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-[13px] text-[#B91C1C]">
                    These credentials were terminated by the manager. You can request new ones.
                </div>
                <div v-else-if="credReq?.status === 'expired'"
                    class="p-3 rounded-xl text-[13px] border"
                    :class="isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-gray-100 border-gray-200 text-gray-500'">
                    Previous credentials expired (timer stopped). Request new ones if needed.
                </div>
                <textarea v-model="credNote" rows="2" maxlength="500"
                    placeholder="Note to manager (optional)..."
                    class="w-full border-none rounded-xl px-4 py-3 text-[13px] outline-none focus:ring-1 focus:ring-[#00896F]"
                    :class="isDark ? 'bg-white/5 text-white placeholder:text-white/40' : 'bg-[#F3F4F6] text-black placeholder:text-[#717182] focus:bg-white'"></textarea>
                <button @click="submitCredRequest" :disabled="credLoading"
                    class="bg-[#00896F] hover:bg-[#006B56] text-white px-6 py-2 rounded-lg text-[13px] font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ credLoading ? 'Requesting…' : (credReq ? 'Re-request Credentials' : 'Request Credentials') }}
                </button>
                <p v-if="credError" class="text-[13px] text-[#B91C1C]">{{ credError }}</p>
            </div>

            <!-- Pending -->
            <div v-else-if="credReq.status === 'pending'"
                class="p-3 bg-[#FEF9C2] border border-[#FDE68A] rounded-xl text-[13px] text-[#CE8600]">
                Your request is pending manager approval. Credentials will appear here once approved.
            </div>

            <!-- Approved / Active -->
            <div v-else-if="['approved', 'active'].includes(credReq.status)" class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="flex-1 rounded-xl px-4 py-2.5 text-[13px] font-mono break-all"
                        :class="isDark ? 'bg-white/5 text-white' : 'bg-[#F3F4F6] text-black'">
                        {{ credReq.username }}
                    </div>
                    <button @click="copyCred(credReq.username, 'user')"
                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                        {{ copied === 'user' ? 'Copied!' : 'Copy' }}
                    </button>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex-1 rounded-xl px-4 py-2.5 text-[13px] font-mono break-all"
                        :class="isDark ? 'bg-white/5 text-white' : 'bg-[#F3F4F6] text-black'">
                        {{ credReq.password }}
                    </div>
                    <button @click="copyCred(credReq.password, 'pass')"
                        class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                        {{ copied === 'pass' ? 'Copied!' : 'Copy' }}
                    </button>
                </div>
                <p class="text-xs" :class="isDark ? 'text-white/50' : 'text-[#717182]'">
                    Log into the client's account with these. They are deleted automatically when the review timer is stopped.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
    tenantId: { type: [String, Number], required: true },
    isDark: { type: Boolean, default: false },
})

const { requestCredentials, getMyCredentialRequest } = useTempCredentials()

const credReq     = ref(null)
const credNote    = ref('')
const credLoading = ref(false)
const credError   = ref('')
const copied      = ref(null)

async function loadCredRequest() {
    if (!props.tenantId) return
    try {
        credReq.value = await getMyCredentialRequest(props.tenantId)
    } catch { credReq.value = null }
}

async function submitCredRequest() {
    credLoading.value = true
    credError.value = ''
    try {
        await requestCredentials(props.tenantId, credNote.value.trim() || null)
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

watch(() => props.tenantId, loadCredRequest)
onMounted(loadCredRequest)
</script>
