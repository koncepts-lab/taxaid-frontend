<template>
    <div class="z-50 flex items-center justify-end pointer-events-auto transition-all duration-500 ease-in-out shrink-0 -mr-4"
        :class="isChatOpen ? 'w-121.5 h-[85vh]' : 'w-24 h-150'">

        <!-- Collapsed State (Initial) -->
        <div v-if="!isChatOpen" class="relative h-150 w-auto shrink-0">
            <img src="/images/chatSideBar.webp" alt="" class="h-full w-auto object-contain" />

            <div class="absolute inset-0 flex flex-col px-6 pt-20 pr-8">
                <div class="flex flex-col items-center space-y-6 mt-4 ml-2">
                    <h2 class="text-white text-base text-center font-normal leading-[1.2]">
                        Let's<br>
                        discuss this<br>
                        further.
                    </h2>

                    <p class="text-white/30 text-sm font-medium">Tap to Chat</p>

                    <button @click="openChat"
                        class="w-16 h-16 bg-primary-600 border-2 border-primary-650 rounded-full flex items-center justify-center shadow-[0px_0px_20px_0px_rgba(0,255,188,0.6)] transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-[0px_0px_30px_0px_rgba(0,255,188,0.8)]">
                        <img src="/images/icons/chat-4.svg" alt="Chat Icon" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div class="absolute bottom-2 left-0 w-full h-150 pointer-events-none">
                <img src="/images/masked-akeel.webp" alt="Chat Assistant"
                    class="absolute bottom-2 left-0 w-full h-full object-contain object-bottom" />
            </div>
        </div>

        <!-- Expanded State (Chat Interface) -->
        <div v-else
            class="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-full duration-500 mr-6">
            <!-- Header -->
            <div class=" p-4 flex items-start justify-between border-b border-b-black/10 ">
                <div class="flex items-start space-x-3">
                    <img src="/images/akeel.webp" alt="Akeel"
                        class="w-7 h-7 rounded-full border border-primary-100 object-contain" />
                    <div>
                        <h3 class="text-black font-medium text-lg">Akeel</h3>
                        <div class="flex items-center space-x-2">
                            <div
                                class="bg-primary-150 border border-primary-100 rounded-md flex items-center p-1 gap-1">
                                <span class="inline-block w-2 h-2 bg-primary-200 rounded-full"></span>

                                <span class="text-primary-200 text-xs">Online</span>
                            </div>
                            <div
                                class="bg-secondary-50/40 border border-primary-100 rounded-md flex items-center p-1 gap-1">
                                <span class="text-secondary-100 text-xs">8,001/10,485 Tokens</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-1 justify-center items-center">
                    <button>
                        <img src="/images/icons/expand-dark.svg" alt="Pin Chat"
                            class="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                    </button>
                    <button>
                        <img src="/images/icons/open-new.svg" alt="Minimize Chat" /> </button>
                    <button @click="closeChat" class="text-black hover:bg-white/20 rounded-full transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Chat Content -->
            <div class="flex-1 p-6 overflow-y-auto  ">
                <div class="text-center mb-8">
                    <img src="/images/akeel.webp" alt="Akeel"
                        class="w-15 h-15 rounded-full object-contain mx-auto mb-4" />
                    <h2 class="text-lg font-medium text-gray-800">Let's Brainstorm with Akeel</h2>
                    <p class="text-sm font-light">Ask me anything about your financial data</p>
                </div>

                <!-- Quick Questions -->
                <div class="space-y-3 mb-6">
                    <h3 class="text-sm font-light text-black mb-3">Quick Questions</h3>
                    <button v-for="q in [
                        'Which cost categories increased the most this year?',
                        'How did COGS impact my gross margin?',
                        'What are the biggest drivers behind my COGS variance?',
                        'Which areas offer the highest cost-saving opportunity?'
                    ]" :key="q"
                        class="w-full text-left p-4 bg-primary-100/5  border border-primary-100/33 rounded-xl transition-colors text-sm font-normal text-gray-700">
                        {{ q }}
                    </button>
                </div>

                <!-- Pro Tips -->
                <div class="bg-white border border-primary-100/33 rounded-xl p-4">
                    <div class="flex items-start space-x-2">
                        <img src="/images/icons/bulb.svg" alt="Pro Tips" class="w-5 h-5 mt-1 opacity-80" />
                        <div>
                            <h4 class="font-medium text-black text-sm mb-1">Pro tips</h4>
                            <p class="text-black font-light text-xs">You can ask questions in English or Arabic. Try
                                asking
                                for specific metrics or comparisons!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-white">
                <div class="flex items-center  border border-primary-100 rounded-xl pr-1 pl-2 py-1">
                    <input type="text" placeholder="Ask about your financials...."
                        class="flex-1   focus:outline-none focus:border-primary-500 transition-colors placeholder:text-black/30" />
                    <button class="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors">
                        <img src="/images/icons/chat.svg" alt="Send" class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// defineModel allows the parent dashboard to stay in sync with the open/close state
const isChatOpen = defineModel('isChatOpen')

const openChat = () => { isChatOpen.value = true }
const closeChat = () => { isChatOpen.value = false }
</script>