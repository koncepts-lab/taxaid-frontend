<template>
    <div class=" bg-white p-6 rounded-2xl">
        <h2 class="text-lg text-black mb-6">Post Dated Cheques</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div v-for="group in pdcGroups" :key="group.type"
                class="rounded-[20px] p-6 transition-all duration-300 border"
                :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-[#F3FDFA] border-[#04C18F80] shadow-sm'">

                <h3 class="text-base font-medium mb-6" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                    {{ currentLang === 'ar' ? group.labelAr : group.label }}
                </h3>

                <div class="space-y-0 overflow-hidden  mb-6">
                    <div class="flex justify-between items-center p-3 bg-[#68E4C4] text-[#013E32]">
                        <span class="text-sm font-normal">{{ currentLang === 'ar' ? 'إجمالي الشيكات' : group.totalLabel
                            }}</span>
                        <span class=" text-sm font-normal">{{ group.totalAmount }}</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-[#FFC6C680] text-[#013E32]">
                        <span class="text-sm font-normal">{{ currentLang === 'ar' ? 'مستحق خلال 30 يوم' :
                            'Due in the next 30 days' }}</span>
                        <span class=" text-sm font-normal">{{ group.due30 }}</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-[#F9F6DE] text-[#013E32]">
                        <span class="text-sm font-normal">{{ currentLang === 'ar' ? 'مستحق خلال 45 يوم' :
                            'Due in the next 45 days' }}</span>
                        <span class=" text-sm font-normal">{{ group.due45 }}</span>
                    </div>
                </div>

                <button @click="$emit('open-report', group.type)"
                    class="w-full flex items-center justify-center gap-3 py-3 bg-[#007C65] hover:bg-[#004A3B] text-white rounded-xl text-sm font-medium transition-all shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isDark: Boolean,
    currentLang: String,
    pdcGroups: Array
})
defineEmits(['open-report'])
</script>