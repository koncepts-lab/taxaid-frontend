<template>
    <Teleport to="body" v-if="isOpen">
        <Transition name="fade" appear>
            <div class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                @click.self="$emit('close')">

                <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative transition-all duration-300"
                    :class="isDark ? 'bg-[#111111] border border-white/10 text-white' : 'bg-white text-black'">

                    <!-- Header -->
                    <div class="p-6 pb-4 flex justify-between items-start">
                        <div class=" w-full mr-4">
                            <div v-if="role == 'team_member'"
                                class="flex items-center justify-between w-full gap-3 mb-1">
                                <h2 class="text-xl font-normal text-black">
                                    {{
                                        ticket?.id
                                    }}
                                </h2>
                                <span :class="getStatusClasses(ticket?.status)"
                                    class="px-3 py-1 rounded-full text-xs border border-[#008169]/10">
                                    {{ ticket?.status || 'Manager Approved' }}
                                </span>
                            </div>
                            <div v-else class="flex items-center justify-between w-full gap-3 mb-1">
                                <h2 class="text-xl font-normal text-black">
                                    {{
                                        role === 'tech_team' ? 'Technical Feasibility & Cost Assessment' :
                                            role === 'team_lead' ? 'Team Lead Priority Scoring' :
                                                role === 'vp' ? 'Approval Decision - VP of Technology' :
                                                    'Approval Decision - Admin'
                                    }}
                                </h2>
                                <span :class="getStatusClasses(ticket?.status)"
                                    class="px-3 py-1 rounded-full text-xs border border-[#008169]/10">
                                    {{ ticket?.status || 'Manager Approved' }}
                                </span>
                            </div>
                            <p v-if="role !== 'team_member'" class="text-sm text-black/50">
                                {{
                                    role === 'tech_team' ? 'Score technical aspects' :
                                        role === 'team_lead' ? 'Score and prioritize' :
                                            role === 'vp' ? 'Score technical feasibility and estimate implementation costs.' :
                                                'Review tickets awaiting your decision.'
                                }}
                            </p>
                            <div v-if="role !== 'team_member'"
                                class="mt-4 inline-block px-4 py-1 border border-[#E1E1E1] rounded-md text-sm font-medium text-black">
                                {{ ticket?.id || 'TKT-012' }}
                            </div>
                        </div>
                        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Scrollable Body -->
                    <div class="flex-1 overflow-y-auto p-6 pt-0 space-y-8 no-scrollbar border-separate">

                        <!-- Main Info Box -->
                        <div class="border-[.8px] border-[#04C18F] rounded-lg p-6 space-y-3"
                            :class="isDark ? 'bg-white/5' : 'bg-white'">
                            <div v-for="(val, key) in ticketMetadata" :key="key" class="flex text-base">
                                <span class="font-normal shrink-0 capitalize"
                                    :class="isDark ? 'text-white' : 'text-gray-900'">{{ key.replace(/_/g, ' ')
                                    }}:</span>
                                <span class="font-light ml-2" :class="isDark ? 'text-white/70' : 'text-gray-600'"> {{
                                    val }}</span>
                            </div>
                        </div>

                        <!-- Activity & Comments Section -->
                        <div class="space-y-4 border-t border-gray-100">
                            <div class="flex items-center gap-2 font-normal text-base my-4"
                                :class="isDark ? 'text-white' : 'text-gray-900'">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span>Activity & Comments</span>
                            </div>

                            <div v-for="(group, index) in groupedActivities" :key="index"
                                class="rounded-lg p-5 mb-4 relative overflow-hidden transition-all "
                                :class="getRoleStyles(group.role)">

                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-base tracking-wide font-medium">{{ group.role }}</span>
                                    <span class="text-sm opacity-60">{{ group.date }}</span>
                                </div>

                                <div v-if="group && group.score" class="flex items-center gap-3 mb-4">
                                    <span class="text-base text-black whitespace-nowrap">
                                        {{ group.role }} Score:
                                    </span>
                                    <span
                                        class="flex items-center gap-2 px-2 border rounded-full text-sm transition-all"
                                        :class="getScoreClasses(group.score)">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                            xmlns="http://www.w3.org/2000/svg" class="shrink-0">
                                            <g>
                                                <path
                                                    d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                                                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path
                                                    d="M7.5 11.25C9.57107 11.25 11.25 9.57107 11.25 7.5C11.25 5.42893 9.57107 3.75 7.5 3.75C5.42893 3.75 3.75 5.42893 3.75 7.5C3.75 9.57107 5.42893 11.25 7.5 11.25Z"
                                                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path
                                                    d="M7.5 8.75C8.19036 8.75 8.75 8.19036 8.75 7.5C8.75 6.80964 8.19036 6.25 7.5 6.25C6.80964 6.25 6.25 6.80964 6.25 7.5C6.25 8.19036 6.80964 8.75 7.5 8.75Z"
                                                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </g>
                                        </svg>
                                        {{ group.score }}/10
                                    </span>
                                </div>

                                <p class="text-base w-full leading-relaxed">
                                    <span class="font-bold">Comments:</span> {{ group.text }}
                                </p>

                                <div v-if="group.phases.length" class="mt-6 space-y-6">
                                    <div v-for="(phase, pIdx) in group.phases" :key="pIdx"
                                        class="pt-6 border-t border-black/5">
                                        <div class="flex justify-between items-center mb-3">
                                            <span v-if="phase.label" class="px-3 py-1 rounded-full text-xs border"
                                                :class="phase.label.includes('Developed') ? 'border-[#007C65] text-[#007C65] bg-[#D0FAE5B2]' : 'border-[#005C75] text-[#005C75] bg-[#BCF0FE80]'">
                                                {{ phase.label }}
                                            </span>
                                            <span class="text-sm opacity-40">{{ phase.date }}</span>
                                        </div>
                                        <p class="text-base leading-relaxed">{{ phase.text }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Attachments -->
                        <div class="space-y-3 border-y py-3 border-black/10">
                            <div class="flex items-center gap-2 text-black text-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.82l8.49-8.48" />
                                </svg>
                                <span>Attachments</span>
                            </div>
                            <p class="text-sm text-black/50 ">No Attachments</p>
                        </div>

                        <!-- Decision Section -->
                        <div v-if="mode === 'review'" class="space-y-6">

                            <!-- VP Specific: Technical Feasibility Slider -->
                            <div v-if="role === 'vp' || role === 'team_lead' || role === 'tech_team'" class="space-y-6">
                                <div class="flex justify-between items-center">
                                    <label class="text-sm font-normal text-black">{{ role === 'vp' || role ==
                                        'tech_team' ?
                                        'Technical Feasibility(1 - 10)' : 'Priority Score' }}</label>
                                    <span
                                        class="px-3 py-1 bg-[#FEF9C2] text-[#D08700] border border-[#FEF3C7] rounded-lg text-xs">{{
                                            feasibilityLabel }}</span>
                                </div>
                                <div class="relative pt-2">
                                    <div class="flex items-center gap-6">
                                        <span class="text-4xl font-normal text-black w-8">{{ feasibilityScore }}</span>
                                        <!-- Custom Styled Input Range -->
                                        <input type="range" min="1" max="10" v-model="feasibilityScore"
                                            class="flex-1 h-3 rounded-full appearance-none cursor-pointer outline-none transition-all"
                                            :style="{ background: `linear-gradient(to right, #00896F 0%, #00896F ${((feasibilityScore - 1) / 9) * 100}%, #E6FDF9 ${((feasibilityScore - 1) / 9) * 100}%, #E6FDF9 100%)` }" />
                                        <span class="text-sm text-gray-400 font-medium">/ 10</span>
                                    </div>
                                    <div
                                        class="flex justify-between px-14 mt-4 text-[12px] text-gray-400 font-medium tracking-tight">
                                        <span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-sm" :class="isDark ? 'text-white' : 'text-black'">
                                    {{ role === 'vp' || role == 'tech_team' ? 'Technical Comments & Analysis *' :
                                        'Admin Comments & Analysis * '
                                    }}
                                </label>
                                <textarea v-model="decisionData.comment" rows="3"
                                    :placeholder="role === 'vp' ? 'Add technical analysis: complexity, risks, dependencies.' : 'Add admin review and final approval notes.'"
                                    class="mt-3 w-full px-4 py-2 border border-[#04C18F80] rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#008169] transition-all text-black"></textarea>
                            </div>
                            <div v-if="role == 'tech_team'" class="w-full">
                                <!-- Label -->
                                <label class="block text-sm font-normal text-black mb-1.5">
                                    Estimated Cost ($) *
                                </label>

                                <!-- Input Container -->
                                <div class="relative group">
                                    <!-- Dollar Sign Icon -->
                                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span class="text-gray-400 text-xl font-light">$</span>
                                    </span>

                                    <!-- Input Field -->
                                    <input type="text" v-model="estimatedCost" placeholder="5000"
                                        class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#04C18F80] rounded-lg text-black placeholder:text-gray-300 outline-none focus:ring-1 focus:ring-[#00BE8C] focus:border-[#00BE8C] transition-all shadow-sm" />
                                </div>

                                <!-- Helper Text -->
                                <p class="mt-2 text-xs text-gray-400 font-normal">
                                    Enter estimated development cost including resources and time
                                </p>
                            </div>
                            <div class="space-y-3 border-t py-3 border-black/10">
                                <label class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">Your Decision
                                    *</label>
                                <div class="grid gap-3 mt-3"
                                    :class="decisionOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'">
                                    <button v-for="opt in decisionOptions" :key="opt.id"
                                        @click="decisionData.status = opt.id"
                                        class="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all"
                                        :class="[opt.borderColor, decisionData.status === opt.id ? opt.activeBg : 'bg-white hover:bg-gray-50']">
                                        <div v-html="opt.icon" class="w-6 h-6 transition-colors"
                                            :class="decisionData.status === opt.id ? 'opacity-100' : 'opacity-40 text-black/50'">
                                        </div>
                                        <span class="text-sm font-medium"
                                            :class="decisionData.status === opt.id ? 'text-black' : 'text-black/50'">{{
                                                opt.label }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div v-if="mode === 'review'"
                        class="p-8 bg-gray-50/50 flex justify-end gap-5 border-t border-gray-100">
                        <button @click="$emit('close')"
                            class="px-4 py-2.5 bg-white border border-gray-200 text-black rounded-lg text-sm">Cancel</button>
                        <button @click="submitDecision"
                            class="flex items-center gap-4 px-10 py-2.5 bg-[#008169] hover:bg-[#006B56] text-white rounded-lg text-sm shadow-lg active:scale-95 font-bold">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_8633_3931)">
                                    <path
                                        d="M14.3339 6.41666C14.6383 7.91086 14.4214 9.46427 13.7191 10.8179C13.0169 12.1714 11.8718 13.2434 10.4749 13.8549C9.07796 14.4664 7.51362 14.5805 6.04274 14.1782C4.57185 13.776 3.28333 12.8816 2.39206 11.6443C1.50078 10.407 1.06062 8.90148 1.14498 7.37892C1.22934 5.85635 1.83312 4.40872 2.85564 3.27744C3.87815 2.14616 5.25759 1.39961 6.76391 1.1623C8.27024 0.924977 9.81239 1.21123 11.1332 1.97333"
                                        stroke="white" stroke-width="1.33333" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M5.7998 7.08268L7.7998 9.08268L14.4665 2.41602" stroke="white"
                                        stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_8633_3931">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    isDark: Boolean,
    ticket: Object,
    mode: { type: String, default: 'review' },
    role: { type: String, default: 'admin' }
})
watch(() => props.role, (newRole) => {
    console.log("DEBUG ROLE:", newRole)
}, { immediate: true })
const emit = defineEmits(['close', 'submit'])

const feasibilityScore = ref(5)
const decisionData = reactive({ comment: '', status: 'approve' })

const feasibilityLabel = computed(() => {
    if (feasibilityScore.value <= 3) return 'Low Priority'
    if (feasibilityScore.value <= 6) return 'Medium Priority'
    return 'High Priority'
})

const ticketMetadata = computed(() => ({
    Client: props.ticket?.client || 'ACME Corp',
    Issue: props.ticket?.title || '-',
    Type: props.ticket?.type || 'Feature Suggestion',
    Created_by: 'Mike Chen',
    Created_on: '11/3/2025',
    Department: props.ticket?.department || '-',
    Description: props.ticket?.description || '-'
}))

const groupedActivities = computed(() => {
    const raw = props.ticket?.activities || []
    const grouped = []
    raw.forEach((item) => {
        const lastEntry = grouped[grouped.length - 1]
        if (lastEntry && lastEntry.role === item.role) {
            lastEntry.phases.push(item)
        } else {
            grouped.push({ ...item, phases: [] })
        }
    })
    return grouped
})

const getScoreClasses = (score) => {
    if (score === undefined || score === null) return ''
    const s = parseInt(score)
    if (s >= 9) return 'bg-[#D0FAE5] text-[#007C65] border-[#0081691A]'
    if (s >= 7) return 'bg-[#FEF9C2] text-[#CE8600] border-[#D087001A]'
    return 'bg-[#FFEDD4] text-[#CA3500] border-[#CA35001A]'
}

const getRoleStyles = (role) => {
    const r = role?.toLowerCase() || ''
    if (r.includes('lead')) return 'bg-[#04C18F12]'
    if (r.includes('tech team')) return 'bg-[#EBEFFB]'
    if (r.includes('vp') || r.includes('president')) return 'bg-[#F8F1FF]'
    if (r.includes('manager')) return 'bg-[#CBFFE0]'
    if (r.includes('admin')) return 'bg-[#C9FFBA99]'
    return 'bg-gray-50 border-gray-100'
}

const getStatusClasses = (status) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('admin approved')) return 'bg-[#C3FFBE] text-[#17740F]'
    if (s.includes('manager approved')) return 'bg-[#CCFEE0] text-[#093F1E]'
    if (s.includes('development')) return 'bg-[#BCF0FE] text-[#005C75]'
    if (s.includes('developed')) return 'bg-[#D0FAE5] text-[#007C65]'
    if (s.includes('tech scored')) return 'bg-[#D4DEFF] text-[#3B5BBA]'
    if (s.includes('scrapped')) return 'bg-[#FFBABA] text-[#FF1616]'
    if (s.includes('flagged')) return 'bg-[#FFCCBA] text-[#FF5316]'
    return 'bg-gray-100 text-gray-600'
}

const decisionOptions = computed(() => {
    const options = [
        { id: 'approve', label: 'Approve', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`, borderColor: 'border-[#04C18FB2]', activeBg: 'bg-[#017F5E33]' },
        { id: 'reject', label: 'Reject', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`, borderColor: 'border-[#FFA07E]', activeBg: 'bg-[#FF454533]' },
        { id: 'hold', label: 'On Hold', icon: `<svg viewBox="0 0 28 28" fill="none"><path d="M6.1 0.4h0.2c1.2 0 2.2 0 3 0.1 0.8 0.1 1.5 0.4 2.1 1C12 2.1 12.2 2.8 12.3 3.6c0.1 0.8 0.1 1.8 0.1 3v15.7c0 1.2 0 2.2-0.1 3-0.1 0.8-0.3 1.5-0.9 2.1-0.6 0.6-1.3 0.8-2.1 0.9-0.8 0.1-1.8 0.1-3 0.1H6.1c-1.2 0-2.2 0-3-0.1-0.8-0.1-1.5-0.3-2.1-0.9-0.6-0.6-0.8-1.3-0.9-2.1C0 24.4 0 23.4 0 22.2V6.5c0-1.2 0-2.2 0.1-3C0.2 2.7 0.4 2 1 1.4c0.6-0.6 1.3-0.8 2.1-0.9C3.9 0.4 4.9 0.4 6.1 0.4zM21.7 0.4h0.2c1.2 0 2.2 0 3 0.1 0.8 0.1 1.5 0.4 2.1 1 0.6 0.6 0.8 1.3 0.9 2.1 0.1 0.8 0.1 1.8 0.1 3v15.7c0 1.2 0 2.2-0.1 3-0.1 0.8-0.3 1.5-0.9 2.1-0.6 0.6-1.3 0.8-2.1 0.9-0.8 0.1-1.8 0.1-3 0.1H21.7c-1.2 0-2.2 0-3-0.1-0.8-0.1-1.5-0.3-2.1-0.9-0.6-0.6-0.8-1.3-0.9-2.1-0.1-0.8-0.1-1.8-0.1-3V6.5c0-1.2 0-2.2 0.1-3 0.1-0.8 0.3-1.5 0.9-2.1 0.6-0.6 1.3-0.8 2.1-0.9 0.8-0.1 1.8-0.1 3-0.1z" fill="currentColor" fill-opacity="0.5"/></svg>`, borderColor: 'border-[#FFC14D]', activeBg: 'bg-[#FFC14D26]' },
    ]
    if (props.role === 'manager' || props.role === 'vp' || props.role === 'team_lead' || props.role === 'tech_team' || props.ticket?.status?.toLowerCase().includes('flagged')) {
        return options.filter(opt => opt.id !== 'hold')
    }
    return options
})

const submitDecision = () => {
    if (props.mode === 'view') { emit('close'); return }
    emit('submit', { id: props.ticket?.id, score: feasibilityScore.value, ...decisionData })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: 2px solid #00896F;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>