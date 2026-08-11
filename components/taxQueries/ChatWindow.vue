<template>
    <div class="bg-white rounded-2xl border border-emerald-50 shadow-sm flex flex-col p-4 relative">

        <div v-if="!messages.length" class="flex-1 flex flex-col items-center justify-center">
            <div class="w-full max-w-3xl text-center flex flex-col items-center">
                <img src="/images/akeel.webp" class="lg:w-20 lg:h-20 w-15 h-15  mb-4 object-contain rounded-full" />
                <h2 class="lg:text-xl text-lg font-medium text-black mb-1">Let's Brainstorm with Akeel</h2>
                <p class="lg:text-lg text-base text-black mb-8 font-light">Ask me anything about your financial data</p>

                <div class="grid lg:grid-cols-2 grid-cols-1 gap-3 w-full mb-6">
                    <button v-for="(q, qi) in promptQuestions" :key="qi" @click="ask(q)"
                        class="flex items-center gap-3 p-3 bg-primary-100/5 border border-primary-100/33 rounded-xl hover:border-emerald-200 text-left transition-all">
                        <img src="/images/icons/chat-1.svg" class="w-4 h-4" alt="Lightning Icon" />
                        <span class="text-sm font-normal text-black">{{ q }}</span>
                    </button>
                </div>

                <template v-if="isMinimized">
                    <div v-for="(tip, ti) in promptTips" :key="ti"
                        class="bg-white border border-emerald-100 rounded-2xl p-4 text-center shadow-sm w-full mb-3">
                        <p
                            class="text-blacktext-sm font-medium tracking-widest flex items-center justify-center gap-1 mb-1">
                            <img src="/images/icons/bulb.svg" /> {{ tip.heading }}
                        </p>
                        <p class="text-sm font-light text-black" v-html="tip.body"></p>
                    </div>
                </template>
            </div>
        </div>

        <div v-else class="flex-1 overflow-y-auto space-y-3 py-2">
            <div v-for="(m, idx) in messages" :key="idx"
                class="max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap"
                :class="m.role === 'user' ? 'ml-auto bg-[#00B69B] text-white' : 'bg-primary-100/10 text-black'">
                {{ m.content }}
            </div>
            <div v-if="sending" class="text-xs text-black/50">Akeel is typing...</div>
            <div v-if="chatGettingLong" class="text-xs text-amber-600">
                This conversation is getting long and may affect answer quality — consider starting a new chat.
            </div>
            <div v-if="usageWarning" class="text-xs text-amber-600">
                You're approaching your AI usage limit for this period.
            </div>
        </div>

        <div class="w-full max-w-3xl mx-auto mt-2">
            <p v-if="error" class="text-xs text-red-500 mb-2">{{ error }}</p>
            <div class="relative">
                <span class="absolute lg:left-4 left-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    <img src="/images/icons/pin.svg" class="w-5 h-5" alt="Chat Icon" />
                </span>
                <input type="text" v-model="draft" @keyup.enter="send" placeholder="Ask about your financials...."
                    class="w-full bg-white border border-primary-100 rounded-xl lg:py-4 py-2 pl-12 pr-10 text-sm placeholder:font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                <button @click="send" :disabled="sending"
                    class="absolute lg:right-2 right-1 top-1/2 -translate-y-1/2 bg-[#00B69B] lg:p-2.5 p-1.5 rounded-xl text-white hover:bg-[#008472] transition-colors disabled:opacity-50">
                    <img src="/images/icons/chat.svg" class="lg:w-6 lg:h-6 w-5 h-5" alt="Send Icon" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['isMinimized']);

const { messages, activeChatId, sending, chatGettingLong, usageWarning, error, sendMessage } = useAkeel()
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
