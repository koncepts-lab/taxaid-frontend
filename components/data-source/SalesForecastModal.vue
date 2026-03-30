<template>
    <Teleport to="body">
        <Transition name="fade">
            <!-- Backdrop -->
            <div v-if="isOpen"
                class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:p-10"
                @click.self="$emit('close')">

                <!-- Modal Card -->
                <div class="w-full max-w-[1200px] bg-white transition-all duration-300 transform scale-100 shadow-2xl flex flex-col h-fit max-h-[95vh]"
                    style="border-radius: 12px; padding: 40px;">

                    <!-- Top Header Section -->
                    <div class="flex justify-between items-center mb-8">
                        <h2 class="text-2xl font-semibold text-gray-900 tracking-tight">
                            {{ currentLang === 'ar' ? 'توقعات المبيعات - تقرير مفصل' :
                                'Sales Forecast - Detailed Report' }}
                        </h2>
                        <button @click="$emit('close')"
                            class="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" class="text-gray-400 group-hover:text-black">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Table Container -->
                    <div class="overflow-x-auto rounded-xl border border-gray-200">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <!-- Teal Header Bar exactly like the image -->
                                <tr class="bg-[#008864] text-white">
                                    <th class="px-6 py-4 text-[16px] font-medium leading-relaxed">
                                        {{ currentLang === 'ar' ? 'اسم المشروع' : 'Project Name' }}
                                    </th>
                                    <th class="px-6 py-4 text-[16px] font-medium leading-relaxed">
                                        {{ currentLang === 'ar' ? 'العميل' : 'Customer' }}
                                    </th>
                                    <th class="px-6 py-4 text-[16px] font-medium leading-relaxed">
                                        {{ currentLang === 'ar' ? 'الاحتمالية' : 'Possibilty' }}
                                    </th>
                                    <th class="px-6 py-4 text-[16px] font-medium leading-relaxed">
                                        {{ currentLang === 'ar' ? 'التاريخ' : 'Date' }}
                                    </th>
                                    <th class="px-6 py-4 text-[16px] font-medium leading-relaxed text-right">
                                        {{ currentLang === 'ar' ? 'درهم' : 'AED' }}
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(row, index) in data" :key="index"
                                    class="transition-colors hover:bg-gray-50">

                                    <td class="px-6 py-4 text-[15px] text-gray-800">{{ row.projectName }}</td>
                                    <td class="px-6 py-4 text-[15px] text-gray-800">{{ row.customer }}</td>
                                    <td class="px-6 py-4 text-[15px] text-gray-800">{{ row.possibility }}</td>
                                    <td class="px-6 py-4 text-[15px] text-gray-800">{{ row.date }}</td>

                                    <!-- AED Column with right alignment -->
                                    <td class="px-6 py-4 text-[15px] text-gray-800 text-right font-medium">
                                        <span class="mr-2">AED</span>{{ row.amount }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    data: Array,
    currentLang: { type: String, default: 'en' }
});

defineEmits(['close']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

/* Force specific column widths if needed to match image exactly */
th:nth-child(1),
td:nth-child(1) {
    width: 25%;
}

th:nth-child(2),
td:nth-child(2) {
    width: 35%;
}

th:nth-child(3),
td:nth-child(3) {
    width: 10%;
}

th:nth-child(4),
td:nth-child(4) {
    width: 10%;
}

th:nth-child(5),
td:nth-child(5) {
    width: 20%;
}
</style>