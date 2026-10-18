<template>
    <div class="rounded-2xl border shadow-sm p-8 flex flex-col"
        :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-100 text-gray-900'">
        <div class="flex items-start justify-between gap-2">
            <h3 class="text-xl font-normal mb-1" :class="isDark ? 'text-white' : 'text-black'">TaxAid Connector</h3>
            <span v-if="connCode?.code && !connCode?.connected && connCode?.is_expired" class="px-3 py-1 rounded-full text-sm"
                :class="isDark ? 'bg-red-900/40 text-red-300' : 'bg-[#FEE2E2] text-[#B91C1C]'">Expired</span>
        </div>
        <div v-if="connCode?.connected" class="mb-6">
            <span class="inline-block px-3 py-1 rounded-full text-sm"
                :class="isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-[#DCFCE7] text-[#15803D]'">Connected</span>
        </div>
        <p v-else class="text-base mb-6" :class="isDark ? 'text-white/60' : 'text-[#717182]'">One-time activation code for the client's connector</p>

        <div v-if="connCode?.connected" class="space-y-2">
            <p class="text-sm capitalize" :class="isDark ? 'text-white' : 'text-black'"><span :class="isDark ? 'text-white/60' : 'text-[#717182]'">ERP:</span> {{ connCode.erp_type || '-' }}</p>
            <p class="text-xs" :class="isDark ? 'text-white/60' : 'text-[#717182]'">Connector is linked. Last sync: {{ formatDate(connCode.last_sync_at) }}.</p>
            <button @click="showReactivateConfirm = true" :disabled="connLoading"
                class="border border-[#00896F] text-[#00896F] px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
                :class="isDark ? 'bg-transparent hover:bg-white/10' : 'bg-white hover:bg-[#E6FDF9]'">
                {{ connLoading ? 'Re-activating…' : 'Re-activate' }}
            </button>
            <p class="text-xs" :class="isDark ? 'text-white/60' : 'text-[#717182]'">Disconnects the current device and issues a new activation code.</p>
        </div>

        <!-- Code exists, not connected -->
        <div v-else-if="connCode?.code" class="space-y-3">
            <div class="flex items-center gap-2">
                <div class="flex-1 rounded-xl px-3 py-2.5 text-sm font-mono break-all"
                    :class="isDark ? 'bg-[#00201A] border border-white/10 text-white' : 'bg-[#F3F4F6] text-black'">
                    {{ connCode.code }}
                </div>
                <button @click="copyCode"
                    class="border border-[#00896F] text-[#00896F] px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    :class="isDark ? 'bg-transparent hover:bg-white/10' : 'bg-white hover:bg-[#E6FDF9]'">
                    {{ copied ? 'Copied!' : 'Copy' }}
                </button>
            </div>
            <p class="text-xs" :class="isDark ? 'text-white/60' : 'text-[#717182]'">
                <span v-if="connCode.is_expired">This code expired unused — generate a new one.</span>
                <span v-else>Valid until {{ formatDate(connCode.expires_at) }}. Paste it into the connector to link this client.</span>
            </p>
            <button @click="generateCode" :disabled="connLoading"
                class="border border-[#00896F] text-[#00896F] px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
                :class="isDark ? 'bg-transparent hover:bg-white/10' : 'bg-white hover:bg-[#E6FDF9]'">
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
                <div class="rounded-2xl shadow-md w-[400px] max-w-full p-8"
                    :class="isDark ? 'bg-[#002E26] border border-white/10 text-white' : 'bg-white text-gray-900'">
                    <h2 class="text-[17px] font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">Re-activate connector?</h2>
                    <p class="text-sm mb-4" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                        This disconnects the client's current device and issues a new activation code. The old code stops working immediately.
                    </p>
                    <div class="flex gap-3 justify-end">
                        <button @click="showReactivateConfirm = false" class="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                            :class="isDark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'">Cancel</button>
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

const { isDark } = useTheme()
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
