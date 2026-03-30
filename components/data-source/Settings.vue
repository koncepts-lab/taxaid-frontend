<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">

        <div class="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
                <h2 class="text-lg font-normal transition-colors duration-300"
                    :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                    {{ currentLang === 'ar' ? titleAr : title }}
                </h2>
                <p class="text-base mt-1 transition-colors duration-300"
                    :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                    {{ currentLang === 'ar' ? descriptionAr : description }}
                </p>
            </div>

            <button @click="$emit('add')"
                class="flex items-center gap-2 px-14 py-2 rounded-[10px] transition-all duration-300 text-[15px] hover:opacity-90 shadow-sm whitespace-nowrap"
                :class="isDark ? 'bg-[#00B794] text-white' : 'bg-[#008169] text-white'">
                <span class="text-2xl leading-none font-normal">+</span>
                <span class="text-base">{{ currentLang === 'ar' ? 'إضافة جديد' : 'Add New' }}</span>
            </button>
        </div>

        <div class="overflow-x-auto rounded-[15px] border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <table class="w-full border-collapse min-w-[600px]">
                <thead>
                    <tr class="transition-colors duration-300 bg-[#008864] text-white">
                        <th class="px-6 py-4 text-sm font-medium text-left w-36">
                            {{ currentLang === 'ar' ? 'رقم' : 'Sl.No' }}
                        </th>
                        <th v-for="(col, idx) in columns" :key="idx" class="px-4 py-4 text-sm font-medium text-left">
                            {{ currentLang === 'ar' ? col.labelAr : col.label }}
                        </th>
                        <th class="px-6 py-4 text-sm font-medium text-left">
                            {{ currentLang === 'ar' ? 'إجراء' : 'Action' }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in data" :key="index" class="transition-all duration-300 group"
                        :class="isDark ? 'hover:bg-[#00B794]/5 border-b border-white/5' : 'hover:bg-gray-50/50 border-b border-gray-100'">

                        <td class="px-6 py-4 text-sm" :class="isDark ? 'text-white/70' : 'text-[#4D4D4D]'">
                            {{ index + 1 }}
                        </td>

                        <td v-for="(col, cIdx) in columns" :key="cIdx" class="px-4 py-4 text-sm "
                            :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">
                            {{ row[col.key] }}
                        </td>

                        <td class="px-6 py-4 ">
                            <button @click="$emit('delete', row)"
                                class="text-sm text-[#FB7554] hover:text-[#ff5c33] transition-colors font-normal">
                                {{ currentLang === 'ar' ? 'حذف' : 'Delete' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    titleAr: String,
    description: String,
    descriptionAr: String,
    columns: Array,
    data: Array,
    isDark: Boolean,
    currentLang: String
});

defineEmits(['add', 'delete']);
</script>