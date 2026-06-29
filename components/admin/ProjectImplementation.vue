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
            <button :disabled="!steps[14]?.status"
                class="bg-[#00896F] hover:bg-[#006B56] text-white px-15 py-1.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ">
                <img src="/images/icons/rocket.svg" alt="Celebration" class="w-6 h-6">

                Ready for Go Live
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps({ project: Object })
const emit = defineEmits(['back'])

const { updateStepProgress } = useImplementation()

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