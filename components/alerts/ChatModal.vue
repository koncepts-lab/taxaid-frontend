<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
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

                        <!-- Initial Bot Message -->
                        <div class="flex flex-col items-start max-w-[85%]">
                            <div class="p-4 shadow-sm text-[15px] leading-relaxed transition-all duration-300" :class="[
                                isDark
                                    ? 'bg-white/10 border border-white/10 text-white/90'
                                    : 'bg-white border border-gray-100 text-gray-800',
                                currentLang === 'ar' ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none'
                            ]">
                                {{ currentLang === 'ar'
                                    ? `مرحباً! أنا هنا لمساعدتك بخصوص "${alert.titleAr || alert.title}". ماذا تود أن تعرف عن
                                هذا التنبيه؟`
                                    : `Hi! I'm here to help you with "${alert.title}". What would you like to know about
                                this alert?`
                                }}
                            </div>
                            <span class="text-[10px] text-gray-400 mt-2 mx-1">5:18 PM</span>
                        </div>
                    </div>

                    <!-- Footer / Input -->
                    <div class="p-5 border-t flex items-center gap-3 shrink-0 transition-colors duration-300"
                        :class="isDark ? 'bg-[#001a16] border-white/10' : 'bg-white border-gray-100'">

                        <button class="p-2 transition-colors"
                            :class="isDark ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>

                        <div class="flex-1 relative">
                            <input v-model="chatInput" type="text"
                                :placeholder="currentLang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'"
                                class="w-full border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#00B68D] outline-none transition-all"
                                :class="isDark
                                    ? 'bg-white/5 text-white placeholder:text-white/30'
                                    : 'bg-gray-100 text-black placeholder:text-black/40'" @keyup.enter="handleSend" />
                        </div>

                        <button @click="handleSend"
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
import { ref } from 'vue';

// Using your global state logic instead of props
const { isDark } = useTheme();
const currentLang = useState('currentLang', () => 'en');

const props = defineProps({
    isOpen: Boolean,
    alert: Object
});

const emit = defineEmits(['close']);
const chatInput = ref('');

const handleSend = () => {
    if (!chatInput.value.trim()) return;
    chatInput.value = '';
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
</style>