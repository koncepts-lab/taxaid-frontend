<template>
    <div
        class="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <!-- Middle Content Container -->
        <div class="w-full max-w-2xl text-center flex flex-col items-center">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Akeel" class="w-16 h-16 mb-4" />
            <h2 class="text-lg font-bold text-gray-800 mb-1">Let's Brainstorm with Akeel</h2>
            <p class="text-[11px] text-gray-400 mb-8 font-medium">Ask me anything about your financial data</p>

            <!-- Suggestion Grid -->
            <div class="grid grid-cols-2 gap-3 w-full mb-6">
                <button v-for="tip in suggestions" :key="tip"
                    class="flex items-center gap-3 p-3 bg-[#F4F9F8] border border-emerald-50 rounded-xl hover:border-emerald-200 text-left transition-all">
                    <div class="w-4 h-4 rounded-sm" :class="tip.color"></div>
                    <span class="text-[11px] font-bold text-gray-700">{{ tip.label }}</span>
                </button>
            </div>

            <!-- Pro Tips Box (Shown when table is minimized) -->
            <div v-if="isMinimized"
                class="bg-white border border-emerald-100 rounded-2xl p-4 text-center shadow-sm w-full mb-10">
                <p
                    class="text-orange-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 mb-1">
                    💡 Pro tips
                </p>
                <p class="text-[11px] text-gray-400">You can ask questions in English or Arabic. Try asking for specific
                    metrics or comparisons!</p>
            </div>
        </div>

        <!-- Bottom Input Bar (Sticky to bottom of container) -->
        <div class="absolute bottom-8 w-full px-12">
            <div class="relative max-w-3xl mx-auto">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">📎</span>
                <input type="text" placeholder="Ask about your financials...."
                    class="w-full bg-[#F4F9F8] border border-emerald-50 rounded-2xl py-4 pl-12 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00B69B] p-2.5 rounded-xl text-white hover:bg-[#008472]">
                    ➤
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['isMinimized']);
const suggestions = [
    { label: 'How strong is your business?', color: 'bg-emerald-500' },
    { label: 'What areas need attention?', color: 'bg-teal-500' },
    { label: 'How to improve cash flow?', color: 'bg-cyan-500' },
    { label: 'Revenue growth analysis?', color: 'bg-emerald-600' },
];
</script>