<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
                    :class="isDark ? 'bg-[#001a16] border border-white/10' : ''"
                    style="border-radius: 28px; height: 600px;">

                    <!-- Header -->
                    <div class="p-5 flex items-center justify-between text-white shrink-0" :style="{
                        background: isDark
                            ? 'linear-gradient(180deg, #01261f 0%, #013e32 100%)'
                            : 'linear-gradient(180deg, #013E32 0%, #007760 100%)'
                    }">
                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <img src="/images/akeel.webp"
                                    class="w-12 h-12 rounded-full border border-white/20 object-cover" alt="Akeel" />
                                <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#03D8B0] border-2 rounded-full"
                                    :style="{ borderColor: isDark ? '#01261f' : '#013E32' }"></span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold leading-tight">Akeel</h3>
                                <div class="flex items-center gap-1.5 opacity-90 text-xs">
                                    <span class="w-1.5 h-1.5 bg-[#03D8B0] rounded-full"></span>
                                    {{ currentLang === 'ar' ? 'متصل الآن' : 'Online' }}
                                </div>
                            </div>
                        </div>
                        <button @click="$emit('close')" class="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Chat Body -->
                    <div class="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
                        :class="isDark ? 'bg-[#001410]' : 'bg-gray-50'">

                        <div v-for="(m, idx) in messages" :key="idx" class="flex flex-col max-w-[85%]"
                            :class="m.role === 'user' ? 'items-end ml-auto' : 'items-start'">
                            <div class="p-4 shadow-sm text-[15px] leading-relaxed transition-all duration-300" :class="[
                                m.role === 'user'
                                    ? 'bg-primary-250 text-white rounded-2xl'
                                    : (isDark
                                        ? 'bg-white/10 border border-white/10 text-white/90'
                                        : 'bg-white border border-gray-100 text-gray-800'),
                                m.role !== 'user' && (currentLang === 'ar' ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none')
                            ]">
                                <span v-if="m.role === 'user'" class="whitespace-pre-wrap">{{ m.content }}</span>
                                <div v-else class="md-content" v-html="renderMarkdown(m.content)"></div>
                            </div>
                        </div>
                        <div v-if="sending" class="text-xs" :class="isDark ? 'text-white/50' : 'text-black/50'">
                            {{ currentLang === 'ar' ? 'عقيل يكتب...' : 'Akeel is typing...' }}
                        </div>
                    </div>

                    <!-- Footer / Input -->
                    <div class="px-5 pt-5 pb-2 border-t transition-colors duration-300" v-if="error"
                        :class="isDark ? 'bg-[#001a16] border-white/10' : 'bg-white border-gray-100'">
                        <p class="text-xs text-red-500">{{ error }}</p>
                    </div>
                    <div class="p-5 flex items-center gap-3 shrink-0 transition-colors duration-300"
                        :class="[isDark ? 'bg-[#001a16] border-white/10' : 'bg-white border-gray-100', !error && 'border-t']">

                        <button class="p-2 transition-colors"
                            :class="isDark ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>

                        <div class="flex-1 relative">
                            <input v-model="chatInput" type="text" :disabled="sending"
                                :placeholder="currentLang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'"
                                class="w-full border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#00B68D] outline-none transition-all disabled:opacity-50"
                                :class="isDark
                                    ? 'bg-white/5 text-white placeholder:text-white/30'
                                    : 'bg-gray-100 text-black placeholder:text-black/40'" @keyup.enter="handleSend" />
                        </div>

                        <button @click="handleSend" :disabled="sending"
                            class="p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                            :class="isDark ? 'bg-[#03D8B0] text-[#01261f]' : 'bg-primary-250 text-white hover:bg-[#03D8B0]'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" :class="{ 'rotate-180': currentLang === 'ar' }">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    alert: Object,
    isDark: Boolean,
    currentLang: String,
});

const emit = defineEmits(['close']);
const chatInput = ref('');

const { renderMarkdown } = useMarkdown()
const { messages, sending, activeChatId, error, createChat, sendMessage } = useAkeel()

// A fresh alert-context conversation each time the modal opens for a new alert —
// not the same shared chat as the sidebar/full-page widgets.
watch(() => props.isOpen, async (open) => {
    if (!open || !props.alert?.id) return
    activeChatId.value = null
    messages.value = []
    const domains = props.alert?.module ? [String(props.alert.module).toUpperCase()] : []
    await createChat()
    await sendMessage(`Tell me about this alert: "${props.alert?.title}"`, domains)
})

const handleSend = async () => {
    if (!chatInput.value.trim() || sending.value) return;
    const message = chatInput.value
    chatInput.value = '';
    await sendMessage(message)
};
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
/* TODO: add more scopes  */
.md-content :deep(p) { margin: 0 0 0.5em; }
.md-content :deep(p:last-child) { margin-bottom: 0; }
.md-content :deep(ul), .md-content :deep(ol) { margin: 0 0 0.5em 1.25em; }
.md-content :deep(strong) { font-weight: 600; }
.md-content :deep(code) { background: rgba(0,0,0,0.06); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
</style>