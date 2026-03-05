<template>
    <!-- 1. Background Overlay -->
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
        :class="isSideChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" @click="$emit('close')"></div>

    <!-- 2. Sidebar Container -->
    <div class="fixed top-0 right-0 h-full z-40 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-80 lg:z-0 "
        :class="[
            isSideChatOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
            // Toggle between w-70 and w-full on mobile
            viewMode === 'menu' ? 'max-lg:w-[75%]' : 'max-lg:w-full'
        ]">

        <div class="flex flex-col h-full">

            <!-- STEP 1: YOUR EXACT UI -->
            <div v-if="viewMode === 'menu' || $viewport?.isGreaterOrEquals('lg')"
                class="flex flex-col gap-4 h-full p-0 relative z-60"
                :class="{ 'max-lg:hidden': viewMode === 'history' }">

                <!-- START OF YOUR ORIGINAL CODE -->
                <div class="bg-primary-50 lg:rounded-3xl rounded-l-3xl p-4 border border-primary-100 shadow-sm shrink-0 h-full flex flex-col"
                    style="box-shadow: -6px 0px 8.4px 0px #6DD8C147;">

                    <div class="flex flex-col gap-3 mb-4 relative">
                        <div class="flex gap-3 items-center">
                            <div class="relative">
                                <img src="/images/akeel.webp"
                                    class="w-12 h-12 rounded-full border-primary-100 border object-contain" />
                                <span
                                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 class="font-medium text-black text-lg">Akeel</h3>
                            </div>

                            <button @click="$emit('close')"
                                class="p-2 hover:bg-black/5 rounded-full transition-colors absolute top-0 right-0 lg:hidden">
                                <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="flex gap-1">
                            <span
                                class="text-xs bg-primary-150 text-primary-200 border border-primary-100 px-1.5 py-0.5 rounded font-medium flex items-center">
                                <span class="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span> Online
                            </span>
                            <span
                                class="text-xs bg-secondary-50/40 text-secondary-100 px-1.5 py-0.5 rounded border border-secondary-50 font-medium">8,001/10,485
                                Tokens</span>
                        </div>
                    </div>

                    <div class="bg-white rounded px-2 py-2.5 border border-primary-100/29 mb-4 flex flex-col gap-1">
                        <div class="flex items-center">
                            <img src="/images/icons/calendar.svg" class="w-4 h-4 inline-block mr-2" />
                            <p class="text-black/50 text-xs font-medium">Upcoming Tax Deadlines</p>
                        </div>
                        <div class="text-black text-xs">VAT Return Date: <span class="text-orange-50 font-semibold">28
                                Jan
                                2026</span></div>
                        <div class="text-black text-xs">CT Return Date: <span class="text-orange-50 font-semibold">20
                                Jun
                                2026</span></div>
                    </div>

                    <button
                        class="w-full bg-primary-250 hover:bg-primary-300 text-white py-2.5 rounded-xl font-bold text-sm transition-all mb-4">+
                        New Chat</button>

                    <div class="space-y-1">
                        <p class="text-sm font-normal text-gray-400 tracking-widest mb-2 px-2">Ask About</p>
                        <button v-for="tab in tabs" :key="tab.id" @click="$emit('update:activeTab', tab.id)" :class="[
                            'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border',
                            activeTab === tab.id ? 'bg-primary-350 text-[#008472] border-primary-100' : 'text-gray-500 hover:bg-primary-350 border-primary-100/33'
                        ]">
                            <img :src="tab.icon" class="w-4 h-4 rounded-sm" /> {{ tab.name }}
                        </button>
                    </div>

                    <!-- TRIGGER FOR STEP 2: SEARCH -->
                    <div class="mt-4 relative"
                        @click="alert('Search Clicked! This will open the full chat history view on mobile.')">
                        <input type="text" readonly placeholder="Search Chat" @click="viewMode = 'history'"
                            class="w-full bg-gray-50 border border-primary-100/33 rounded-xl p-3 text-xs focus:outline-none cursor-pointer" />
                        <img src="/images/icons/search.svg" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <!-- TRIGGER FOR STEP 2: RECENT -->
                    <div class="mt-4 flex-1 overflow-hidden flex flex-col cursor-pointer">
                        <p class="text-sm font-normal text-black/50 tracking-widest mb-3 shrink-0 uppercase">Recent</p>
                        <div class="overflow-y-auto space-y-3 pr-2 no-scrollbar">
                            <p v-for="query in recentQueries" :key="query"
                                class="text-sm text-black/70 truncate cursor-pointer hover:text-primary-500 transition-colors">
                                {{ query }}
                            </p>
                        </div>
                    </div>
                </div>
                <!-- END OF YOUR ORIGINAL CODE -->
            </div>

            <!-- STEP 2: FULL WIDTH CHAT HISTORY UI (max-lg only) -->
            <div v-if="viewMode === 'history'"
                class="lg:hidden flex flex-col h-full bg-primary-50 px-4 pt-14 animate-in slide-in-from-right duration-300 relative">

                <!-- 1. NEW TOP RIGHT CLOSE BUTTON (Goes back to Step 1) -->
                <button @click="viewMode = 'menu'"
                    class="absolute top-2 right-2 p-2 text-gray-500 hover:bg-black/5 rounded-full transition-colors">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Search Input -->
                <div class="relative mb-3">
                    <input v-model="searchQuery" type="text" placeholder="Search Chat"
                        class="w-full bg-white border border-primary-100/33 rounded-xl p-2 pr-12 text-base text-gray-600 shadow-sm focus:outline-none" />

                    <!-- 2. INPUT CLEAR BUTTON (Clears text only) -->
                    <button v-if="searchQuery.length > 0" @click="searchQuery = ''"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <!-- Show search icon if input is empty -->
                    <img v-else src="/images/icons/search.svg"
                        class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-40" />
                </div>

                <button
                    class="w-full bg-[#00B68D] hover:bg-[#00A37E] text-white py-2 rounded-xl font-medium text-base flex items-center justify-center gap-2 mb-5">
                    <span class="text-2xl font-light">+</span> New Chat
                </button>

                <div class="flex-1 overflow-y-auto no-scrollbar space-y-8">
                    <div v-for="group in historyGroups" :key="group.label">
                        <h3 class="text-black/50 font-normal text-base mb-2">{{ group.label }}</h3>
                        <div class="space-y-2">
                            <p v-for="(query, idx) in group.queries" :key="idx"
                                class="text-black/70 text-base leading-relaxed cursor-pointer">
                                {{ query }}
                            </p>
                        </div>
                        <div class="h-px bg-primary-100/20 w-full mt-6"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { alert } from '#build/ui';
import { ref, watch } from 'vue';

const props = defineProps({
    activeTab: String,
    isSideChatOpen: Boolean
});
const emit = defineEmits(['update:activeTab', 'close']);

// viewMode tracks if we are in 'menu' (Step 1) or 'history' (Step 2)
const viewMode = ref('menu');
const searchQuery = ref(''); // Added to track search text


// Reset to menu when the sidebar is completely closed
watch(() => props.isSideChatOpen, (val) => {
    if (!val) setTimeout(() => viewMode.value = 'menu', 300);
});

const tabs = [
    { id: 'vat', name: 'VAT Queries', icon: '/images/icons/vat.svg' },
    { id: 'corporate', name: 'Corporate Tax', icon: '/images/icons/corporate-tax.svg' },
    { id: 'ifrs', name: 'IFRS', icon: '/images/icons/ifrs.svg' },
    { id: 'accounting', name: 'General Accounting', icon: '/images/icons/general.svg' }
];

const historyGroups = [
    {
        label: 'Today',
        queries: [
            "How can I claim input VAT on business...",
            "What are the UAE VAT return filing...",
            "Why is my VAT refund taking longer...",
            "How to handle VAT for export services..."
        ]
    },
    {
        label: 'Previous 7 Days',
        queries: [
            "How can I claim input VAT on business...",
            "What are the UAE VAT return filing...",
            "Why is my VAT refund taking longer...",
            "How to handle VAT for export services..."
        ]
    },
    {
        label: 'Previous 30 Days',
        queries: [
            "How can I claim input VAT on business...",
            "What are the UAE VAT return filing...",
            "Why is my VAT refund taking longer...",
            "How to handle VAT for export services..."
        ]
    }
];
watch(() => props.isSideChatOpen, (val) => {
    if (!val) {
        setTimeout(() => {
            viewMode.value = 'menu';
            searchQuery.value = ''; // Clear search when sidebar closes
        }, 300);
    }
});
// Reference for Step 1
const recentQueries = historyGroups[0].queries;
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>