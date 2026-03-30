<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-[75vw] bg-white transition-all duration-300 transform scale-100 shadow-2xl overflow-hidden rounded-2xl flex flex-col max-h-[90vh]"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                    <!-- Header -->
                    <div class="flex justify-between items-center p-8">
                        <h2 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ title }}
                        </h2>
                        <button @click="$emit('close')"
                            class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Body (Scrollable Table Container) -->
                    <div class="px-8 pb-8 flex-1 overflow-hidden flex flex-col">
                        <div class="overflow-auto rounded-[20px] border no-scrollbar flex-1 relative"
                            :class="isDark ? 'border-white/10' : 'border-gray-200'">
                            <table class="w-full text-left rtl:text-right border-collapse min-w-[1200px]">
                                <thead class="sticky top-0 z-20">
                                    <tr class="bg-[#008864] text-white">
                                        <th class="px-6 py-5 text-[14px] font-normal w-20">SI.NO</th>
                                        <th v-for="col in columns" :key="col.key"
                                            class="px-4 py-5 text-[14px] font-normal">
                                            {{ currentLang === 'ar' ? col.labelAr : col.label }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in data" :key="index" class="border-b transition-colors"
                                        :class="isDark ? 'border-white/5 hover:bg-white/5 text-white/80' : 'border-gray-100 hover:bg-gray-50 text-gray-700'">
                                        <td class="px-6 py-4 text-[14px] opacity-50">{{ index + 1 }}</td>
                                        <td v-for="col in columns" :key="col.key" class="px-4 py-4 text-[14px]">
                                            {{ row[col.key] || '-' }}
                                        </td>
                                    </tr>
                                </tbody>

                                <!-- FOOTER INTEGRATED INTO TABLE -->
                                <tfoot class="sticky bottom-0 z-20">
                                    <tr class="bg-[#61FFD6] text-[#013E32] font-bold">
                                        <!-- Empty SI.NO cell -->
                                        <td class="px-6 py-4"></td>
                                        <!-- Loop through columns to place values -->
                                        <td v-for="(col, index) in columns" :key="'foot-' + col.key"
                                            class="px-4 py-4 text-[14px]">
                                            <!-- If it's the first column (Project Name Area), show "Total" -->
                                            <span v-if="index === 0">
                                                {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                                            </span>
                                            <!-- If it's the column that matches your total data key (e.g. 'value' or 'finalValue') -->
                                            <!-- Note: You can pass a 'totals' object to match specific columns -->
                                            <span v-else>
                                                {{ totals && totals[col.key] ? totals[col.key] : '-' }}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
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
    columns: Array,
    data: Array,
    isDark: Boolean,
    currentLang: String,
    totalValue: { type: String, default: '-' }
})
defineEmits(['close'])
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