<template>
    <div :class="['rounded-2xl border flex flex-col p-4 relative h-full min-h-0 overflow-hidden', isDark ? 'bg-[#002e26] border-white/10 shadow-none' : 'bg-white border-emerald-50 shadow-sm']">
        <button @click="$emit('shrink')" class="absolute top-4 right-4 p-2 rounded-full transition-colors z-10 cursor-pointer" :class="isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-black/5'" :title="isMinimized ? 'Contract Chat' : 'Expand Chat'">
            <svg v-if="!isMinimized" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
            </svg>
        </button>

        <div v-if="!messages.length && sending" class="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-2">
            <div class="w-full max-w-3xl text-center flex flex-col items-center">
                <img src="/images/akeel.webp" class="lg:w-20 lg:h-20 w-12 h-12 mb-3 object-contain rounded-full animate-pulse" />
                <p class="lg:text-lg text-sm font-light" :class="isDark ? 'text-white/80' : 'text-black'">{{ sendingStatusDisplay }}</p>
            </div>
        </div>

        <div v-else-if="!messages.length" class="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-2 no-scrollbar">
            <div class="w-full max-w-3xl text-center flex flex-col items-center my-auto">
                <img src="/images/akeel.webp" class="lg:w-16 lg:h-16 w-12 h-12 mb-2 object-contain rounded-full" />
                <h2 class="lg:text-lg text-base font-medium mb-0.5" :class="isDark ? 'text-white' : 'text-black'">Let's Brainstorm with Akeel</h2>
                <p class="lg:text-sm text-xs mb-4 font-light" :class="isDark ? 'text-white/80' : 'text-black'">Ask me anything about your financial data</p>

                <div class="grid lg:grid-cols-2 grid-cols-1 gap-2.5 w-full mb-3">
                    <button v-for="(q, qi) in promptQuestions" :key="qi" @click="ask(q)"
                        :class="['flex items-center gap-3 p-2.5 border rounded-xl text-left transition-all', isDark ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-primary-100/5 border-primary-100/33 hover:border-emerald-200']">
                        <img src="/images/icons/chat-1.svg" class="w-4 h-4 shrink-0" alt="Lightning Icon" />
                        <span class="text-xs sm:text-sm font-normal" :class="isDark ? 'text-white' : 'text-black'">{{ q }}</span>
                    </button>
                </div>

                <template v-if="isMinimized">
                    <div v-for="(tip, ti) in promptTips" :key="ti"
                        :class="['border rounded-2xl p-3 text-center shadow-sm w-full mb-2', isDark ? 'bg-white/5 border-white/10' : 'bg-white border-emerald-100']">
                        <p :class="['text-xs sm:text-sm font-medium tracking-widest flex items-center justify-center gap-1 mb-1', isDark ? 'text-white/80' : 'text-black']">
                            <img src="/images/icons/bulb.svg" class="w-4 h-4" /> {{ tip.heading }}
                        </p>
                        <p class="text-xs font-light" :class="isDark ? 'text-white/60' : 'text-black'">{{ tip.body }}</p>
                    </div>
                </template>
            </div>
        </div>

        <div ref="chatContainer" v-else class="flex-1 min-h-0 overflow-y-auto space-y-3 pb-2 pt-6">
            <AkeelMessageList />
            <div v-if="sending" class="text-xs" :class="isDark ? 'text-white/50' : 'text-black/50'">{{ sendingStatusDisplay }}</div>
            <div v-if="chatGettingLong" class="text-xs text-amber-600">
                This conversation is getting long and may affect answer quality — consider starting a new chat.
            </div>
            <div v-if="usageWarning" class="text-xs text-amber-600">
                You're approaching your AI usage limit for this period.
            </div>
        </div>

        <div class="w-full max-w-3xl mx-auto mt-2 shrink-0">
            <CommonAiStatusBox :message="error" :variant="errorVariant" :isDark="isDark" />
            <div v-if="pendingUploads.length" class="flex flex-wrap gap-2 mb-2">
                <span v-for="u in pendingUploads" :key="u.id"
                    :class="['inline-flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-xs', isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-primary-100/10 border-primary-100/30 text-black']">
                    {{ u.file_type?.toUpperCase() }} attached
                    <button @click="removeUpload(u.id)" class="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                </span>
            </div>
            <div class="relative">
                <button v-if="enableUpload" type="button" @click="uploadModalOpen = true"
                    class="absolute lg:left-4 left-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    <img src="/images/icons/pin.svg" :class="['w-5 h-5', isDark ? 'invert opacity-50' : '']" alt="Attach file" />
                </button>
                <input type="text" v-model="draft" @keyup.enter="send" :disabled="locked" placeholder="Ask about your financials...."
                    :class="['w-full border rounded-xl lg:py-3.5 py-2.5 pr-12 text-sm placeholder:font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400', enableUpload ? 'pl-12' : 'pl-4', isDark ? 'bg-transparent border-white/20 text-white placeholder:text-white/40' : 'bg-white border-primary-100 text-[#000] placeholder:text-[#b9b9b9]']" />
                <button @click="send" :disabled="sending || locked"
                    class="absolute lg:right-2 right-1.5 top-1/2 -translate-y-1/2 bg-[#00B69B] lg:p-2.5 p-1.5 rounded-xl text-white hover:bg-[#008472] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <img src="/images/icons/chat.svg" class="lg:w-5 lg:h-5 w-4 h-4" alt="Send Icon" />
                </button>
            </div>
        </div>

        <CommonAiUploadModal v-if="enableUpload" v-model:open="uploadModalOpen" />
    </div>
</template>

<script setup>
import { useTheme } from '#imports'

const { isDark } = useTheme()

defineProps({
    isMinimized: { type: Boolean, default: false },
    enableUpload: { type: Boolean, default: false },
});

defineEmits(['shrink']);

const { messages, activeChatId, sending, sendingStatusText, sendingStatusDisplay, setScope, chatGettingLong, usageWarning, error, errorVariant, locked, pendingUploads, sendMessage, removeUpload } = useAkeel()
const { questions: promptQuestions, tips: promptTips, fetchPrompts } = useAkeelPrompts()

const route = useRoute()
onMounted(() => {
    setScope('tax-queries')
    const page = route.name?.toString() ?? 'default'
    if (page === 'tax-queries') fetchPrompts(['tax-queries', 'vat-queries'], 'tax-queries')
    else fetchPrompts(page)
})



const draft = ref('')
const uploadModalOpen = ref(false)

async function ask(question) {
    await sendMessage(question)
}

async function send() {
    if (!draft.value.trim() || sending.value) return
    const message = draft.value
    draft.value = ''
    await sendMessage(message)
}
const chatContainer = ref(null)
const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}
watch([() => messages.value.length, sending], scrollToBottom)
onMounted(scrollToBottom)
</script>
