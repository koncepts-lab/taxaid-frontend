<template>
    <div class="flex flex-col gap-4 h-full">
        <!-- Profile Card -->
        <div class="bg-primary-50 rounded-3xl p-4 border border-primary-100 shadow-sm shrink-0" style="box-shadow: -6px 0px 8.4px 0px #6DD8C147;
">
            <div class="flex flex-col  gap-3 mb-4">
                <div class="flex gap-3 items-center">
                    <div class="relative">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Akeel"
                            class="w-12 h-12 rounded-full bg-emerald-50" />
                        <span
                            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>

                    <div>
                        <h3 class="font-medium text-black text-lg">Akeel</h3>

                    </div>
                </div>
                <div class="flex gap-1">
                    <span
                        class="text-xs bg-primary-150 text-primary-200 border border-primary-100 px-1.5 py-0.5 rounded font-medium flex">
                        <div>
                            <span class="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                        </div>Online
                    </span>
                    <span
                        class="text-xs bg-secondary-50/40 text-secondary-100 px-1.5 py-0.5 rounded border border-secondary-50 font-medium">8,001/10,485
                        Tokens</span>
                </div>
            </div>

            <div class="bg-white rounded px-2 py-2.5 border border-primary-100/29 mb-4 flex flex-col gap-1">
                <div class="flex">
                    <img src="/images/icons/calendar.svg" class="w-4 h-4 inline-block mr-2" />
                    <p class="text-black/50 text-xs font-medium mb-1">Upcoming Tax Deadlines</p>
                </div>
                <div class="text-black text-xs font-normal">VAT Return Date: <span
                        class="text-orange-50 font-semibold text-xs">28
                        Jan 2026</span>
                </div>
                <div class="text-black text-xs font-medium mb-1">CT Return Date: <span
                        class="text-orange-50 font-semibold text-xs">20 Jun 2026</span>
                </div>
            </div>

            <button
                class="w-full bg-primary-250 hover:bg-primary-300 text-white py-2.5 rounded-xl font-bold text-sm transition-all mb-4">+
                New Chat</button>

            <!-- Nav Tabs -->
            <div class="space-y-1">
                <p class="text-sm font-normal text-gray-400 tracking-widest mb-2 px-2">Ask About</p>
                <button v-for="tab in tabs" :key="tab.id" @click="$emit('update:activeTab', tab.id)" :class="[
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border',
                    activeTab === tab.id ? 'bg-primary-350 text-[#008472] border-primary-100' : 'text-gray-500 hover:bg-primary-350 border-primary-100/33'
                ]">
                    <div class="w-4 h-4 bg-gray-200 rounded-sm"></div> {{ tab.name }}
                </button>
            </div>

            <div class="mt-4 relative">
                <input type="text" placeholder="Search Chat"
                    class="w-full bg-gray-50 border border-primary-100/33 rounded-xl py-2 px-4 text-xs focus:outline-none" />
                <img src="/images/icons/search.svg" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div class=" rounded-3xl p-5 border border-emerald-50 shadow-sm flex-1 overflow-hidden flex flex-col">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 shrink-0">Recent</p>
                <div class="overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    <p v-for="i in 8" :key="i"
                        class="text-[12px] text-gray-600 truncate cursor-pointer hover:text-emerald-600">
                        How can I claim input VAT on business...
                    </p>
                </div>
            </div>
        </div>

        <!-- Recent Items (Scrollable) -->

    </div>
</template>

<script setup>
defineProps(['activeTab']);
const tabs = [
    { id: 'vat', name: 'VAT Queries' },
    { id: 'corporate', name: 'Corporate Tax' },
    { id: 'ifrs', name: 'IFRS' },
    { id: 'accounting', name: 'General Accounting' }
];
</script>