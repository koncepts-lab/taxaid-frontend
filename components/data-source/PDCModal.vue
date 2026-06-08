<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-[95vw] bg-white transition-all duration-300 shadow-2xl overflow-hidden"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'" style="border-radius: 28px;">

                    <div class="flex justify-between items-center p-8 "
                        :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <h2 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ type === 'issued' ? 'PDC Issued' : 'PDC Received' }} - Detailed Report
                        </h2>
                        <button @click="$emit('close')"
                            class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-8">
                        <div class="overflow-x-auto rounded-[20px] border max-h-[60vh] no-scrollbar"
                            :class="isDark ? 'border-white/10' : 'border-gray-200'">
                            <table class="w-full text-left rtl:text-right border-collapse min-w-[1200px]">
                                <thead class="sticky top-0 z-10">
                                    <tr class="bg-[#008864] text-white">
                                        <th class="px-6 py-5 text-sm font-semibold w-20">SI.NO</th>
                                        <th class="px-4 py-5 text-sm font-semibold">Issue Date</th>
                                        <th class="px-4 py-5 text-sm font-semibold">Cheque Date</th>
                                        <th class="px-4 py-5 text-sm font-semibold">Bank Name</th>
                                        <th class="px-4 py-5 text-sm font-semibold">Cheque No.</th>
                                        <th class="px-4 py-5 text-sm font-semibold">Party Name</th>
                                        <th class="px-6 py-5 text-sm font-semibold text-right rtl:text-left">Amount
                                            (AED)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in data" :key="index" class="border-b transition-colors"
                                        :class="isDark ? 'border-white/5 hover:bg-white/5 text-white/80' : 'border-gray-100 hover:bg-gray-50 text-gray-700'">
                                        <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
                                        <td class="px-4 py-4 text-sm">{{ row.issueDate }}</td>
                                        <td class="px-4 py-4 text-sm">{{ row.chequeDate }}</td>
                                        <td class="px-4 py-4 text-sm">{{ row.bankName }}</td>
                                        <td class="px-4 py-4 text-sm">{{ row.chequeNo }}</td>
                                        <td class="px-4 py-4 text-sm">{{ row.partyName }}</td>
                                        <td class="px-6 py-4 text-sm text-right rtl:text-left font-medium">{{
                                            row.amount }}</td>
                                    </tr>
                                </tbody>
                                <tfoot class="sticky bottom-0">
                                    <tr class="bg-[#61FFD6] font-bold text-[#013E32]">
                                        <td class="px-6 py-5 rounded-bl-[20px]">Total</td>
                                        <td class="px-4 py-4 text-sm">-</td>
                                        <td class="px-4 py-4 text-sm">-</td>
                                        <td class="px-4 py-4 text-sm">-</td>
                                        <td class="px-4 py-4 text-sm">-</td>
                                        <td class="px-4 py-4 text-sm">-</td>
                                        <td class="px-6 py-4 text-sm text-right rtl:text-left font-medium">{{ totalAmount ?? '-' }}</td>
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
defineProps({
    isOpen: Boolean,
    type: String,
    data: Array,
    totalAmount: [Number, String],
    isDark: Boolean,
    currentLang: String
})
defineEmits(['close'])
</script>