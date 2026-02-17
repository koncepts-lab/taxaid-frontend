<template>
    <div class="bg-white rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-center p-4 relative">

        <div class="flex-1 flex flex-col items-center justify-center">
            <div class="w-full max-w-3xl text-center flex flex-col items-center">
                <img src="/images/akeel.webp" class="w-20 h-20 mb-4 object-contain rounded-full" />
                <h2 class="text-xl font-medium text-black mb-1">Let's Brainstorm with Akeel</h2>
                <p class="text-lg text-black mb-8 font-light">Ask me anything about your financial data</p>

                <div class="grid grid-cols-2 gap-3 w-full mb-6">
                    <button v-for="tip in suggestions" :key="tip.label"
                        class="flex items-center gap-3 p-3 bg-primary-100/5 border border-primary-100/33 rounded-xl hover:border-emerald-200 text-left transition-all">
                        <img :src="tip.icon" class="w-4 h-4" alt="Lightning Icon" />
                        <span class="text-sm font-normal text-black">{{ tip.label }}</span>
                    </button>
                </div>

                <div v-if="isMinimized"
                    class="bg-white border border-emerald-100 rounded-2xl p-4 text-center shadow-sm w-full">
                    <p
                        class="text-blacktext-sm font-medium tracking-widest flex items-center justify-center gap-1 mb-1">
                        <img src="/images/icons/bulb.svg" /> Pro tips
                    </p>
                    <p class="text-sm font-light text-black">
                        You can ask questions in English or Arabic. Try asking for specific metrics or comparisons!
                    </p>
                </div>
            </div>
        </div>

        <div class="w-full max-w-3xl mx-auto mt-2">
            <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    <img src="/images/icons/pin.svg" class="w-5 h-5" alt="Chat Icon" />
                </span>
                <input type="text" placeholder="Ask about your financials...."
                    class="w-full bg-white border border-primary-100 rounded-xl py-4 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00B69B] p-2.5 rounded-xl text-white hover:bg-[#008472] transition-colors">
                    <img src="/images/icons/chat.svg" class="w-6 h-6" alt="Send Icon" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['isMinimized']);

const suggestions = [
    { label: 'How strong is your business?', icon: '/images/icons/chat-1.svg' },
    { label: 'What areas need attention?', icon: '/images/icons/chat-2.svg' },
    { label: 'How to improve cash flow?', icon: '/images/icons/chat-3.svg' },
    { label: 'Revenue growth analysis?', icon: '/images/icons/chat-1.svg' },
];
</script>