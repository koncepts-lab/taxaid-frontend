<template>
    <div class="p-6 rounded-2xl transition-all duration-300"
        :class="isDark ? 'bg-[#002e26]' : 'bg-white shadow-sm'">
        <h2 class="text-lg mb-6" :class="isDark ? 'text-white' : 'text-black'">Post Dated Cheques</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div v-for="group in pdcGroups" :key="group.type"
                class="rounded-[20px] p-6 transition-all duration-300 border"
                :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#F3FDFA] border-[#04C18F80] shadow-sm'">

                <h3 class="text-base font-medium mb-6" :class="isDark ? 'text-white' : 'text-[#013E32]'">
                    {{ currentLang === 'ar' ? group.labelAr : group.label }}
                </h3>

                <div class="space-y-0 overflow-hidden rounded-xl mb-6 border"
                    :class="isDark ? 'border-white/10 divide-y divide-white/10' : 'border-transparent'">
                    <div class="flex justify-between items-center p-3"
                        :class="isDark ? 'bg-teal-500/20 text-white' : 'bg-[#68E4C4] text-[#013E32]'">
                        <span class="text-sm font-normal">{{ currentLang === 'ar' ? 'إجمالي الشيكات' : group.totalLabel
                            }}</span>
                        <div v-if="loading" class="skeleton h-4 w-24 rounded" :class="{ dark: isDark }"></div><span v-else class="text-sm font-medium">{{ group.totalAmount }}</span>
                    </div>
                    <div class="flex justify-between items-center p-3"
                        :class="isDark ? 'bg-rose-500/15 text-white' : 'bg-[#FFC6C680] text-[#013E32]'">
                        <span class="text-sm font-normal">{{ currentLang === 'ar' ? 'مستحق خلال 30 يوم' :
                            'Due in the next 30 days' }}</span>
                        <div v-if="loading" class="skeleton h-4 w-24 rounded" :class="{ dark: isDark }"></div><span v-else class="text-sm font-medium">{{ group.due30 }}</span>
                    </div>
                    <div class="flex justify-between items-center p-3"
                        :class="isDark ? 'bg-amber-500/15 text-white' : 'bg-[#F9F6DE] text-[#013E32]'">
                        <span class="text-sm font-normal">{{ currentLang === 'ar' ? 'مستحق خلال 45 يوم' :
                            'Due in the next 45 days' }}</span>
                        <div v-if="loading" class="skeleton h-4 w-24 rounded" :class="{ dark: isDark }"></div><span v-else class="text-sm font-medium">{{ group.due45 }}</span>
                    </div>
                </div>

                <button @click="$emit('open-report', group.type)"
                    class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all shadow-sm"
                    :class="isDark ? 'bg-[#008169] hover:bg-[#006b56] text-white' : 'bg-[#007C65] hover:bg-[#004A3B] text-white'">
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
    pdcGroups: Array,
    loading: Boolean,
})
defineEmits(['open-report'])
</script>
<style scoped>
.skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
    background-size: 400% 100%;
    animation: ds-shimmer 1.4s ease infinite;
}
.skeleton.dark {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.12) 37%, rgba(255, 255, 255, 0.05) 63%);
    background-size: 400% 100%;
}
@keyframes ds-shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
}
</style>
