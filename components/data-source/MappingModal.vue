<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">
                
                <div class="w-full max-w-6xl bg-white transition-all duration-300 transform scale-100 shadow-2xl overflow-hidden rounded-2xl flex flex-col max-h-[90vh]"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">
                    
                    <!-- Header -->
                    <div class="p-6 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                                    {{ title }}
                                </h2>
                                <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                                    {{ subtitle }}
                                </p>
                            </div>
                            <button @click="$emit('close')"
                                class="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" :class="isDark ? 'text-white' : 'text-gray-500'">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Alert Banner -->
                        <div class="mt-4 p-3 rounded-lg flex items-center gap-2"
                            :class="isDark ? 'bg-amber-900/20 text-amber-200' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span class="text-sm font-medium">{{ alertMessage }}</span>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="flex-1 overflow-auto p-6 no-scrollbar">
                        <table class="w-full text-left rtl:text-right border-collapse min-w-[800px]">
                            <thead class="sticky top-0 z-20">
                                <tr class="bg-[#008169] text-white">
                                    <th class="px-6 py-4 text-sm font-medium rounded-l-lg">FS Code</th>
                                    <th class="px-6 py-4 text-sm font-medium">Main Group</th>
                                    <th class="px-6 py-4 text-sm font-medium">Sub group</th>
                                    <th class="px-6 py-4 text-sm font-medium">Ledger</th>
                                    <th class="px-6 py-4 text-sm font-medium rounded-r-lg">Cost Center</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in data" :key="index"
                                    class="border-b transition-colors"
                                    :class="isDark ? 'border-white/5 hover:bg-white/5 text-white/80' : 'border-gray-100 hover:bg-gray-50 text-gray-700'">
                                    <td class="px-6 py-4 text-sm">{{ row.fsCode }}</td>
                                    <td class="px-6 py-4 text-sm">{{ row.mainGroup }}</td>
                                    <td class="px-6 py-4 text-sm">{{ row.subGroup }}</td>
                                    <td class="px-6 py-4 text-sm">{{ row.ledger }}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <div class="relative">
                                            <select class="w-full appearance-none bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008169] focus:bg-white transition-all pr-10"
                                                :class="isDark ? 'bg-white/5 text-white border-white/10 focus:bg-[#01261f]' : ''">
                                                <option value="" disabled selected>Select Cost Center</option>
                                                <option v-for="opt in costCenterOptions" :key="opt" :value="opt">{{ opt }}</option>
                                            </select>
                                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Footer -->
                    <div class="p-6 border-t flex justify-end gap-3" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <button @click="$emit('close')"
                            class="px-6 py-2.5 rounded-xl border text-sm font-medium transition-all"
                            :class="isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
                            Cancel
                        </button>
                        <button @click="handleUpdate"
                            class="px-6 py-2.5 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    isOpen: Boolean,
    title: String,
    subtitle: String,
    alertMessage: String,
    isDark: Boolean,
    currentLang: String,
    data: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'update'])

const costCenterOptions = [
    'Cost Center 1',
    'Cost Center 2',
    'Cost Center 3'
]

const handleUpdate = () => {
    emit('update')
    emit('close')
}
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
