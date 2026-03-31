<template>
    <div class="mt-8 transition-all duration-500">
        <h3 class="text-lg font-medium mb-4" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'سجل التغييرات' : 'Change log' }}
        </h3>

        <div class="overflow-x-auto rounded-[15px] border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <table class="w-full text-left rtl:text-right border-collapse">
                <thead>
                    <tr class="bg-[#008864] text-white">
                        <th class="px-6 py-4 text-[14px] font-normal rounded-tl-[15px]">Date</th>
                        <th class="px-4 py-4 text-[14px] font-normal">Timestamp</th>
                        <th class="px-4 py-4 text-[14px] font-normal">User ID</th>
                        <th class="px-4 py-4 text-[14px] font-normal rounded-tr-[15px]">Details of change</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(log, idx) in logs" :key="idx" class="transition-colors border-b last:border-none"
                        :class="isDark ? 'bg-[#00141080] border-white/5 text-white/70' : 'bg-white border-gray-100 text-[#4D4D4D]'">
                        <td class="px-6 py-4 text-sm">{{ log.date }}</td>
                        <td class="px-4 py-4 text-sm">{{ log.time }}</td>
                        <td class="px-4 py-4 text-sm">{{ log.user }}</td>
                        <td class="px-4 py-4 text-sm">{{ log.details }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    logs: Array,
    isDark: Boolean,
    currentLang: String
})
</script>