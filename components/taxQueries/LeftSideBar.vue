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
                <div :class="['lg:rounded-3xl rounded-l-3xl p-4 border shrink-0 h-full flex flex-col', isDark ? 'bg-[#002e26] border-white/10 shadow-none' : 'bg-primary-50 border-primary-100 shadow-sm']"
                    :style="isDark ? '' : 'box-shadow: -6px 0px 8.4px 0px #6DD8C147;'">

                    <div class="flex flex-col gap-3 mb-4 relative">
                        <div class="flex gap-3 items-center">
                            <div class="relative">
                                <img src="/images/akeel.webp"
                                    class="w-12 h-12 rounded-full border-primary-100 border object-contain" />
                                <span
                                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 class="font-medium text-lg" :class="isDark ? 'text-white' : 'text-black'">Akeel</h3>
                            </div>

                            <button @click="$emit('close')"
                                :class="['p-2 rounded-full transition-colors absolute top-0 right-0 lg:hidden', isDark ? 'hover:bg-white/10' : 'hover:bg-black/5']">
                                <svg class="w-6 h-6" :class="isDark ? 'text-white' : 'text-black'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="flex gap-1">
                            <span
                                :class="['text-xs px-1.5 py-0.5 rounded border font-medium flex items-center', isDark ? 'bg-white/10 text-white border-white/20' : 'bg-primary-150 text-primary-200 border-primary-100']">
                                <span class="w-2 h-2 rounded-full inline-block mr-1" :class="status === 1 ? 'bg-green-500' : 'bg-red-400'"></span> {{ status === 1 ? 'Online' : 'Offline' }}
                            </span>
                            <span v-if="usage.tokens_total"
                                :class="['text-xs px-1.5 py-0.5 rounded border font-medium', isDark ? 'text-white bg-secondary-50/25 border-secondary-50/50' : 'bg-secondary-50/40 text-secondary-100 border-secondary-50']">{{ usage.tokens_used }}/{{ usage.tokens_total }}
                                Tokens</span>
                        </div>
                    </div>

                    <div :class="['rounded px-2 py-2.5 border mb-4 flex flex-col gap-1', isDark ? 'bg-[#001a14] border-white/10' : 'bg-white border-primary-100/29']">
                        <div class="flex items-center">
                            <img src="/images/icons/calendar.svg" class="w-4 h-4 inline-block mr-2" />
                            <p class="text-xs font-medium" :class="isDark ? 'text-white/50' : 'text-black/50'">Upcoming Tax Deadlines</p>
                        </div>
                        <div v-for="deadline in deadlines" :key="deadline.label" class="text-xs" :class="isDark ? 'text-white/90' : 'text-black'">
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
                            activeTab === tab.id 
                                ? (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-primary-350 text-[#008472] border-primary-100') 
                                : (isDark ? 'text-white/60 hover:bg-white/5 border-transparent' : 'text-gray-500 hover:bg-primary-350 border-primary-100/33')
                        ]">
                            <img :src="tab.icon" class="w-4 h-4 rounded-sm" /> {{ tab.name }}
                        </button>
                    </div>

                    <!-- Search Chat — filters Recent in place, no navigation -->
                    <div class="mt-4 relative">
                        <input v-model="searchQuery" type="text" placeholder="Search Chat"
                            :class="['w-full border rounded-xl p-3 text-xs placeholder:font-semibold focus:outline-none', isDark ? 'bg-transparent border-white/20 text-white placeholder:text-white/40' : 'bg-gray-50 border-primary-100/33 text-[#000] placeholder:text-[#b9b9b9]']" />
                        <img v-if="!searchQuery" src="/images/icons/search.svg" :class="['w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2', isDark ? 'invert opacity-50' : '']" />
                        <button v-else @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <!-- Recent (filtered by search above) -->
                    <div class="mt-4 flex-1 overflow-hidden flex flex-col">
                        <p class="text-sm font-normal tracking-widest mb-3 shrink-0 uppercase" :class="isDark ? 'text-white/50' : 'text-black/50'">{{ searchQuery ? 'Results' : 'Recent' }}</p>
                        <div class="overflow-y-auto space-y-3 pr-2 no-scrollbar">
                            <p v-for="chat in filteredChats" :key="chat.id" @click="selectChat(chat.id)"
                                :class="['text-sm truncate cursor-pointer transition-colors', isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-primary-500']">
                                {{ chat.title || 'Untitled chat' }}
                            </p>
                            <p v-if="!filteredChats.length" class="text-sm text-center py-4" :class="isDark ? 'text-white/40' : 'text-black/40'">No chats found.</p>
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
import { useTheme } from '#imports'

const { isDark } = useTheme()

const props = defineProps({
    activeTab: String,
    isSideChatOpen: Boolean
});
const emit = defineEmits(['update:activeTab', 'close']);

const searchQuery = ref('');

const { tabs, deadlines } = useTaxQueriesPage()

const { chats, status, usage, activeChatId, fetchChats, createChat, resumeChat } = useAkeel()

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