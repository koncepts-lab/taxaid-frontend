<template>
    <div class="z-50 flex items-center pointer-events-auto transition-all duration-500 ease-in-out shrink-0" :class="[
        isChatOpen ? '2xl:w-120 w-100 h-[85vh]' : 'w-24 h-150',
        currentLang === 'ar' ? 'justify-end -ml-4' : 'justify-end -mr-4'
    ]">

        <div v-if="!isChatOpen" class="relative h-150 w-auto shrink-0 transition-transform duration-500"
            :style="currentLang === 'ar' ? 'transform: scaleX(-1);' : ''">

            <img src="/images/chatSideBar.webp" alt="" class="h-full w-auto object-contain" />

            <div class="absolute inset-0 flex flex-col px-6 pt-20 pr-8"
                :style="currentLang === 'ar' ? 'transform: scaleX(-1);' : ''">

                <div class="flex flex-col items-center gap-6 mt-4 ml-2">
                    <h2 class="text-white text-base text-center font-normal leading-[1.2]">
                        <template v-if="currentLang === 'ar'">
                            دعنا<br>نناقش هذا<br>أكثر.
                        </template>
                        <template v-else>
                            Let's<br>discuss this<br>further.
                        </template>
                    </h2>

                    <p class="text-white/30 text-sm font-medium">
                        {{ currentLang === 'ar' ? 'انقر للمحادثة' : 'Tap to Chat' }}
                    </p>

                    <button @click="openChat"
                        class="w-16 h-16 bg-primary-600 border-2 border-primary-650 rounded-full flex items-center justify-center shadow-[0px_0px_20px_0px_rgba(0,255,188,0.6)] transition-all duration-200 hover:scale-110 active:scale-95">
                        <img src="/images/icons/chat-4.svg" alt="Chat Icon" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div class="absolute bottom-2 left-0 w-full h-150 pointer-events-none">
                <img src="/images/masked-akeel.webp" alt="Chat Assistant"
                    class="absolute bottom-2 left-0 w-full h-full object-contain object-bottom" />
            </div>
        </div>

        <div v-else
            class="w-full h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-500 border border-primary-100"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" :class="[
                isDark ? 'bg-primary-900/50' : 'bg-white',
                currentLang === 'ar' ? 'slide-in-from-left-full ml-6' : 'slide-in-from-right-full mr-6'
            ]" style="box-shadow: -6px 0px 8.4px 0px #6DD8C147;">

            <div class="p-4 flex items-start justify-between border-b"
                :class="isDark ? 'border-white/10' : 'border-black/10'">
                <div class="flex items-start gap-3">
                    <img src="/images/akeel.webp" alt="Akeel"
                        class="w-7 h-7 rounded-full border border-primary-100 object-contain" />
                    <div class="text-start">
                        <h3 class="font-medium text-lg" :class="isDark ? 'text-white' : 'text-black'">
                            {{ currentLang === 'ar' ? 'عقيل' : 'Akeel' }}
                        </h3>
                        <div class="flex items-center gap-2">
                            <div
                                class="bg-primary-150 border border-primary-100 rounded-md flex items-center justify-center p-1 gap-1">
                                <span class="inline-block w-2 h-2 bg-primary-200 rounded-full"></span>
                                <span class="text-primary-200 text-xs">{{ currentLang === 'ar' ? 'متصل' : 'Online'
                                    }}</span>
                            </div>
                            <div class="border border-secondary-50 rounded-md flex items-center p-1 gap-1"
                                :class="isDark ? 'bg-secondary-50/25' : 'bg-secondary-50/40'">
                                <span class="text-secondary-100 text-xs">8,001/10,485 {{ currentLang === 'ar' ? 'رمز' :
                                    'Tokens'
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-center items-center">
                    <button @click="$emit('expand')">
                        <img src="/images/icons/expand-dark.svg" alt="Pin Chat"
                            class="w-5 h-5 opacity-70 hover:opacity-100"
                            :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'transform scale-x-[-1]' : '']" />
                    </button>
                    <button>
                        <img src="/images/icons/open-new.svg" alt="Minimize Chat" :class="isDark ? 'invert' : ''" />
                    </button>
                    <button @click="closeChat" class="rounded-full transition-colors"
                        :class="isDark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex-1 p-6 overflow-y-auto no-scrollbar">
                <div class="text-center mb-8">
                    <img src="/images/akeel.webp" alt="Akeel"
                        class="w-15 h-15 rounded-full object-contain mx-auto mb-4" />
                    <h2 class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-gray-800'">
                        {{ currentLang === 'ar' ? 'دعنا نفكر مع عقيل' : "Let's Brainstorm with Akeel" }}
                    </h2>
                    <p class="text-sm font-light" :class="isDark ? 'text-white/60' : ''">
                        <template v-if="currentLang === 'ar'">
                            يمكنك طرح الأسئلة بالعربية أو الإنجليزية. جرّب أن تطلب مقاييس محددة أو مقارنات!
                        </template>
                        <template v-else>
                            You can ask questions in English or Arabic. Try asking for specific metrics or
                            comparisons!
                        </template>
                    </p>
                </div>

                <div class="space-y-3 mb-6">
                    <h3 class="text-sm font-light mb-3" :class="isDark ? 'text-white/60' : 'text-black'">
                        {{ currentLang === 'ar' ? 'أسئلة سريعة' : 'Quick Questions' }}
                    </h3>

                    <button v-for="q in quickQuestions" :key="q.label"
                        class="w-full p-4 border rounded-xl transition-colors text-sm font-normal flex items-center gap-3"
                        :class="[
                            isDark ? 'bg-primary-100/5 border-primary-100/33 text-white/80 hover:bg-white/10' : 'bg-primary-100/5 border-primary-100/33 text-gray-700 hover:bg-primary-100/10'
                        ]">
                        <img :src="q.icon" alt="icon" class="w-5 h-5 shrink-0" :class="{ '': isDark }" />
                        <span class="text-start flex-1">{{ currentLang === 'ar' ? q.labelAr : q.label }}</span>
                    </button>
                </div>

                <div class="border rounded-xl p-4"
                    :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white border-primary-100/33'">
                    <div class="flex items-start gap-3">
                        <img src="/images/icons/bulb.svg" alt="Pro Tips" class="w-5 h-5 mt-1 opacity-80"
                            :class="isDark ? '' : ''" />
                        <div class="text-start">
                            <h4 class="font-medium text-sm mb-1" :class="isDark ? 'text-white' : 'text-black'">
                                {{ currentLang === 'ar' ? 'نصائح احترافية' : 'Pro tips' }}
                            </h4>
                            <p class="font-light text-xs" :class="isDark ? 'text-white/60' : 'text-black'">
                                <template v-if="currentLang === 'ar'">
                                    يمكنك طرح الأسئلة بالعربية أو الإنجليزية. جرّب أن تطلب مقاييس محددة أو مقارنات!
                                </template>
                                <template v-else>
                                    You can ask questions in English or Arabic. Try asking for specific metrics or
                                    comparisons!
                                </template>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                <div class="flex items-center border rounded-xl px-2 py-1 gap-2"
                    :class="isDark ? 'border-white/10 bg-white/5' : 'border-primary-100'">
                    <input type="text"
                        :placeholder="currentLang === 'ar' ? 'اسأل عن بياناتك المالية...' : 'Ask about your financials....'"
                        class="flex-1 bg-transparent focus:outline-none transition-colors text-sm py-2"
                        :class="isDark ? 'text-white placeholder:text-white/30' : 'placeholder:text-black/30'" />
                    <button
                        class="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors shrink-0">
                        <img src="/images/icons/chat.svg" alt="Send" class="w-6 h-6"
                            :class="currentLang === 'ar' ? 'transform scale-x-[-1]' : ''" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const isDark = useTheme().isDark
const currentLang = useState('currentLang', () => 'en')

const quickQuestions = [
    { label: 'How strong is your business?', labelAr: 'ما مدى قوة عملك؟', icon: '/images/icons/chat-1.svg' },
    { label: 'What areas need attention?', labelAr: 'ما المجالات التي تحتاج اهتماماً؟', icon: '/images/icons/chat-2.svg' },
    { label: 'How to improve cash flow?', labelAr: 'كيف تحسّن التدفق النقدي؟', icon: '/images/icons/chat-3.svg' },
    { label: 'Revenue growth analysis?', labelAr: 'تحليل نمو الإيرادات؟', icon: '/images/icons/chat-1.svg' },
]

const isChatOpen = defineModel('isChatOpen')
defineEmits(['update:activeTab', 'expand'])

const openChat = () => { isChatOpen.value = true }
const closeChat = () => { isChatOpen.value = false }
</script>