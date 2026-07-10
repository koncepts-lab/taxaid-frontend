<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-[75vw]  transition-all duration-300 transform scale-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-2xl"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                    <div class="flex justify-between items-center p-8 "
                        :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <h2 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ title }} - Detailed Report
                        </h2>
                        <button @click="$emit('close')"
                            class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 flex-1 overflow-hidden flex flex-col">
                        <div v-if="loading" class="flex justify-center items-center py-16">
                            <div class="w-8 h-8 border-2 border-[#008169] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div v-else class="overflow-auto rounded-[20px] border budget-scroll flex-1 relative shadow-inner"
                            :class="isDark ? 'border-white/10 bg-[#001a16]' : 'border-gray-200 bg-gray-50/30'">

                            <table class="w-full text-left border-collapse">
                                <thead class="sticky top-0 z-30">
                                    <tr class="bg-[#008864] text-white">
                                        <th v-if="showSiNo" class="px-4 py-5 text-sm font-semibold w-40">SI.NO</th>
                                        <th v-for="col in columns" :key="col.key"
                                            class="px-3 py-5 text-sm font-semibold whitespace-nowrap" :class="[
                                                col.key !== 'name' && col.key !== 'mainGroup' ? 'text-left' : ''
                                            ]">
                                            {{ currentLang === 'ar' ? col.labelAr : col.label }}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(row, index) in data" :key="index" class="transition-colors" :class="[
                                        row.type === 'header' ? (isDark ? 'bg-[#61FFD6]/10' : 'bg-[#C2F9E9]') : '',
                                        row.type === 'net-row' ? (isDark ? 'bg-[#61FFD6]/10' : 'bg-primary-1200') : '',

                                        isDark ? 'border-b border-white/5' : 'border-b border-gray-100'
                                    ]">

                                        <td v-if="showSiNo" class="px-4 py-4 text-sm ">{{ row.type ? '' :
                                            index + 1 }}</td>

                                        <td v-for="col in columns" :key="col.key"
                                            class="px-3 py-4 text-sm whitespace-nowrap transition-colors duration-300" :class="[
                                                isDark ? 'text-white/90' : 'text-black',

                                                row.type === 'header' ? (isDark ? 'bg-[#023b31]' : 'bg-primary-800') :
                                                    row.type === 'net-row' ? (isDark ? 'bg-[#023b31]' : 'bg-primary-1200') :
                                                        !row.type ? (isDark ? '' : 'bg-white') : '',

                                                (['header', 'total-row', 'net-row'].includes(row.type) || col.fontBold) ? 'font-medium' : 'font-normal'
                                            ]">
                                            {{ row[col.key] || '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div v-if="footerTotal"
                        class="p-6 bg-[#61FFD6] flex justify-between items-center px-12 shrink-0 border-t border-white/10">
                        <span class="font-bold text-[#013E32] text-lg">{{ currentLang === 'ar' ? 'الإجمالي العام' :
                            'Grand Total' }}</span>
                        <span class="font-bold text-[#013E32] text-2xl">{{ footerTotal }}</span>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    title: String,
    columns: Array,
    data: Array,
    isDark: Boolean,
    currentLang: String,
    showSiNo: { type: Boolean, default: false },
    footerTotal: { type: String, default: '' },
    loading: { type: Boolean, default: false },
})
defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Subtle shadow to indicate sticky column is active */
.sticky {
    transition: background-color 0.3s ease;
}

.budget-scroll::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

.budget-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.budget-scroll::-webkit-scrollbar-thumb {
    background: #04C18F80;
    border-radius: 9999px;
}

.budget-scroll::-webkit-scrollbar-thumb:hover {
    background: #00896F;
}

.budget-scroll {
    scrollbar-width: thin;
    scrollbar-color: #04C18F80 transparent;
}
</style>