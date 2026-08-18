<template>
    <!-- 1. Background Overlay -->
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
        :class="isSideChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" @click="$emit('close')"></div>

    <!-- 2. Sidebar Container -->
    <div class="fixed top-0 right-0 h-full z-40 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-80 lg:z-0 "
        :class="isSideChatOpen ? 'translate-x-0 max-lg:w-[75%]' : 'translate-x-full lg:translate-x-0 max-lg:w-[75%]'">

        <div class="flex flex-col h-full">

            <div class="flex flex-col gap-4 h-full p-0 relative z-60">

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
                                <span class="w-2 h-2 rounded-full inline-block mr-1" :class="status === 1 ? 'bg-green-500' : 'bg-red-400'"></span> {{ status === 1 ? 'Online' : 'Offline' }}
                            </span>
                            <span v-if="usage.tokens_total"
                                class="text-xs bg-secondary-50/40 text-secondary-100 px-1.5 py-0.5 rounded border border-secondary-50 font-medium">{{ usage.tokens_used }}/{{ usage.tokens_total }}
                                Tokens</span>
                        </div>
                    </div>

                    <div class="bg-white rounded px-2 py-2.5 border border-primary-100/29 mb-4 flex flex-col gap-1">
                        <div class="flex items-center">
                            <img src="/images/icons/calendar.svg" class="w-4 h-4 inline-block mr-2" />
                            <p class="text-black/50 text-xs font-medium">Upcoming Tax Deadlines</p>
                        </div>
                        <div v-for="deadline in deadlines" :key="deadline.label" class="text-black text-xs">
                          {{ deadline.label }}: <span class="text-orange-50 font-semibold" :class="'text-' + deadline.color">{{ deadline.date }}</span>
                        </div>
                    </div>

                    <button @click="startNewChat"
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

                    <!-- Search Chat — filters Recent in place, no navigation -->
                    <div class="mt-4 relative">
                        <input v-model="searchQuery" type="text" placeholder="Search Chat"
                            class="w-full bg-gray-50 border border-primary-100/33 rounded-xl p-3 text-xs text-[#000] placeholder:font-semibold placeholder:text-[#b9b9b9] focus:outline-none" />
                        <img v-if="!searchQuery" src="/images/icons/search.svg" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />
                        <button v-else @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <!-- Recent (filtered by search above) -->
                    <div class="mt-4 flex-1 overflow-hidden flex flex-col">
                        <p class="text-sm font-normal text-black/50 tracking-widest mb-3 shrink-0 uppercase">{{ searchQuery ? 'Results' : 'Recent' }}</p>
                        <div class="overflow-y-auto space-y-3 pr-2 no-scrollbar">
                            <div v-for="chat in filteredChats" :key="chat.id"
                                class="flex items-center justify-between gap-2 group">
                                <p @click="selectChat(chat.id)"
                                    class="text-sm text-black/70 truncate cursor-pointer hover:text-primary-500 transition-colors flex-1">
                                    {{ chat.title || 'Untitled chat' }}
                                </p>
                                <button @click.stop="confirmDelete(chat.id)"
                                    class="text-gray-400 hover:text-red-500 shrink-0 transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <p v-if="!filteredChats.length" class="text-sm text-black/40 text-center py-4">No chats found.</p>
                        </div>
                    </div>
                </div>
                <!-- END OF YOUR ORIGINAL CODE -->
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    activeTab: String,
    isSideChatOpen: Boolean
});
const emit = defineEmits(['update:activeTab', 'close']);

const searchQuery = ref('');

const { tabs, deadlines } = useTaxQueriesPage()

const { chats, status, usage, activeChatId, fetchChats, createChat, resumeChat, deleteChat } = useAkeel()

const filteredChats = computed(() => {
    if (!searchQuery.value.trim()) return chats.value
    const q = searchQuery.value.toLowerCase()
    return chats.value.filter((c) => (c.title || '').toLowerCase().includes(q))
})

async function startNewChat() {
    await createChat()
}

async function selectChat(id) {
    activeChatId.value = id
    await resumeChat(id)
}

async function confirmDelete(id) {
    if (!confirm('Delete this chat? This cannot be undone.')) return
    await deleteChat(id)
}

onMounted(() => {
    fetchChats()
})
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