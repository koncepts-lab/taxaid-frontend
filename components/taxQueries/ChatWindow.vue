<template>
    <div :class="['rounded-2xl border flex flex-col p-4 relative min-h-[500px]', isDark ? 'bg-[#002e26] border-white/10 shadow-none' : 'bg-white border-emerald-50 shadow-sm']">

        <div v-if="!messages.length" class="flex-1 flex flex-col items-center justify-center">
            <div class="w-full max-w-3xl text-center flex flex-col items-center">
                <img src="/images/akeel.webp" class="lg:w-20 lg:h-20 w-15 h-15  mb-4 object-contain rounded-full" />
                <h2 class="lg:text-xl text-lg font-medium mb-1" :class="isDark ? 'text-white' : 'text-black'">Let's Brainstorm with Akeel</h2>
                <p class="lg:text-lg text-base mb-8 font-light" :class="isDark ? 'text-white/80' : 'text-black'">Ask me anything about your financial data</p>

                <div class="grid lg:grid-cols-2 grid-cols-1 gap-3 w-full mb-6">
                    <button v-for="(q, qi) in promptQuestions" :key="qi" @click="ask(q)"
                        :class="['flex items-center gap-3 p-3 border rounded-xl text-left transition-all', isDark ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-primary-100/5 border-primary-100/33 hover:border-emerald-200']">
                        <img src="/images/icons/chat-1.svg" class="w-4 h-4" alt="Lightning Icon" />
                        <span class="text-sm font-normal" :class="isDark ? 'text-white' : 'text-black'">{{ q }}</span>
                    </button>
                </div>

                <template v-if="isMinimized">
                    <div v-for="(tip, ti) in promptTips" :key="ti"
                        :class="['border rounded-2xl p-4 text-center shadow-sm w-full mb-3', isDark ? 'bg-white/5 border-white/10' : 'bg-white border-emerald-100']">
                        <p :class="['text-sm font-medium tracking-widest flex items-center justify-center gap-1 mb-1', isDark ? 'text-white/80' : 'text-black']">
                            <img src="/images/icons/bulb.svg" /> {{ tip.heading }}
                        </p>
                        <p class="text-sm font-light" :class="isDark ? 'text-white/60' : 'text-black'">{{ tip.body }}</p>
                    </div>
                </template>
            </div>
        </div>

        <div v-else class="flex-1 overflow-y-auto space-y-3 py-2">
            <div v-for="(m, idx) in messages" :key="idx"
                class="max-w-[80%] rounded-xl px-4 py-2.5 text-sm"
                :class="m.role === 'user' ? 'ml-auto bg-[#00B69B] text-white whitespace-pre-wrap' : (isDark ? 'bg-white/10 text-white' : 'bg-primary-100/10 text-black')">
                <span v-if="m.role === 'user'">{{ m.content }}</span>
                <div v-else class="md-content" v-html="renderMarkdown(m.content)"></div>
            </div>
            <div v-if="sending" class="text-xs" :class="isDark ? 'text-white/50' : 'text-black/50'">{{ sendingStatusText }}</div>
            <div v-if="chatGettingLong" class="text-xs text-amber-600">
                This conversation is getting long and may affect answer quality — consider starting a new chat.
            </div>
            <div v-if="usageWarning" class="text-xs text-amber-600">
                You're approaching your AI usage limit for this period.
            </div>
        </div>

        <div class="w-full max-w-3xl mx-auto mt-2">
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
                <input type="text" v-model="draft" @keyup.enter="send" placeholder="Ask about your financials...."
                    :class="['w-full border rounded-xl lg:py-4 py-2 pr-10 text-sm placeholder:font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400', enableUpload ? 'pl-12' : 'pl-4', isDark ? 'bg-transparent border-white/20 text-white placeholder:text-white/40' : 'bg-white border-primary-100 text-[#000] placeholder:text-[#b9b9b9]']" />
                <button @click="send" :disabled="sending"
                    class="absolute lg:right-2 right-1 top-1/2 -translate-y-1/2 bg-[#00B69B] lg:p-2.5 p-1.5 rounded-xl text-white hover:bg-[#008472] transition-colors disabled:opacity-50">
                    <img src="/images/icons/chat.svg" class="lg:w-6 lg:h-6 w-5 h-5" alt="Send Icon" />
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

const { messages, activeChatId, sending, sendingStatusText, chatGettingLong, usageWarning, error, errorVariant, pendingUploads, sendMessage, removeUpload } = useAkeel()
const { questions: promptQuestions, tips: promptTips, fetchPrompts } = useAkeelPrompts()

const route = useRoute()
onMounted(() => fetchPrompts(route.name?.toString() ?? 'default'))

// Only /chat-with-akeel offers resumable history (via its session-list sidebar) — everywhere
// else this component is mounted (e.g. /tax-queries), the conversation shouldn't survive
// navigating away, same as ChatSideBar.vue's widget instance.
onBeforeUnmount(() => {
    if (route.path.includes('chat-with-akeel')) return
    activeChatId.value = null
    messages.value = []
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
</script>

<style scoped>
.md-content :deep(p) { margin: 0 0 0.5em; }
.md-content :deep(p:last-child) { margin-bottom: 0; }
.md-content :deep(ul), .md-content :deep(ol) { margin: 0 0 0.5em 1.25em; }
.md-content :deep(strong) { font-weight: 600; }
.md-content :deep(code) { background: rgba(0,0,0,0.06); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
</style>
