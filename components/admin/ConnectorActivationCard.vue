<template>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col">
        <div class="flex items-start justify-between gap-2">
            <h3 class="text-xl font-normal mb-1 text-black">TaxAid Connector</h3>
            <span v-if="connCode?.code && !connCode?.connected && connCode?.is_expired" class="px-3 py-1 rounded-full text-sm bg-[#FEE2E2] text-[#B91C1C]">Expired</span>
        </div>
        <div v-if="connCode?.connected" class="mb-6">
            <span class="inline-block px-3 py-1 rounded-full text-sm bg-[#DCFCE7] text-[#15803D]">Connected</span>
        </div>
        <p v-else class="text-base text-[#717182] mb-6">One-time activation code for the client's connector</p>

        <div v-if="connCode?.connected" class="space-y-2">
            <p class="text-sm text-black capitalize"><span class="text-[#717182]">ERP:</span> {{ connCode.erp_type || '-' }}</p>
            <p class="text-xs text-[#717182]">Connector is linked. Last sync: {{ formatDate(connCode.last_sync_at) }}.</p>
            <button @click="showReactivateConfirm = true" :disabled="connLoading"
                class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50">
                {{ connLoading ? 'Re-activating…' : 'Re-activate' }}
            </button>
            <p class="text-xs text-[#717182]">Disconnects the current device and issues a new activation code.</p>
        </div>

        <!-- Code exists, not connected -->
        <div v-else-if="connCode?.code" class="space-y-3">
            <div class="flex items-center gap-2">
                <div class="flex-1 bg-[#F3F4F6] rounded-xl px-3 py-2.5 text-sm text-black font-mono break-all">
                    {{ connCode.code }}
                </div>
                <button @click="copyCode"
                    class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                    {{ copied ? 'Copied!' : 'Copy' }}
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

        <Teleport to="body">
            <div v-if="showReactivateConfirm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl shadow-md w-[400px] max-w-full p-8">
                    <h2 class="text-[17px] font-semibold text-gray-900 mb-2">Re-activate connector?</h2>
                    <p class="text-sm text-gray-500 mb-4">
                        This disconnects the client's current device and issues a new activation code. The old code stops working immediately.
                    </p>
                    <div class="flex gap-3 justify-end">
                        <button @click="showReactivateConfirm = false" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
                        <button @click="reactivateConnector" :disabled="connLoading" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00896F] hover:bg-[#006B56] disabled:opacity-60 cursor-pointer">
                            {{ connLoading ? 'Re-activating…' : 'Re-activate' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
// Shared TaxAid Connector activation card — used by the Implementation project
// page and the Super Admin/Review Manager org-management connector tab.
// clientId is the tenant's license_id string (ImplementationPoolController
// resolves {clientId} via Tenant::where('license_id', ...), not tenant_id).
import { ref, onMounted, watch } from 'vue'

const props = defineProps({ clientId: { type: String, required: true } })

const { getConnectorCode, generateConnectorCode, resetConnector } = useImplementation()

const connCode = ref(null)
const connLoading = ref(false)
const connError = ref('')
const copied = ref(false)
const showReactivateConfirm = ref(false)

async function loadConnectorCode() {
    try { connCode.value = await getConnectorCode(props.clientId) } catch {}
}

async function generateCode() {
    connLoading.value = true
    connError.value = ''
    try {
        await generateConnectorCode(props.clientId)
        await loadConnectorCode()
    } catch (e) {
        connError.value = e?.data?.message || 'Failed to generate code.'
        await loadConnectorCode()
    } finally {
        connLoading.value = false
    }
}

async function reactivateConnector() {
    showReactivateConfirm.value = false
    connLoading.value = true
    connError.value = ''
    try {
        await resetConnector(props.clientId)
        await generateConnectorCode(props.clientId)
        await loadConnectorCode()
    } catch (e) {
        connError.value = e?.data?.message || 'Failed to re-activate.'
        await loadConnectorCode()
    } finally {
        connLoading.value = false
    }
}

async function copyCode() {
    if (!connCode.value?.code) return
    try {
        await navigator.clipboard.writeText(connCode.value.code)
        copied.value = true
        setTimeout(() => { copied.value = false }, 1500)
    } catch {}
}

function formatDate(dateInput) {
    if (!dateInput) return '-'
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

watch(() => props.clientId, (id) => { if (id) loadConnectorCode() })
onMounted(() => { if (props.clientId) loadConnectorCode() })
</script>
