<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1000] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-xl transition-all duration-300 border rounded-2xl p-6"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <h2 class="text-xl font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                {{ currentLang === 'ar' ? 'تفاصيل التنبيه' : 'Alert Details' }}
                            </h2>
                            <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-black/80'">
                                {{ currentLang === 'ar' ? 'عرض معلومات التنبيه وحالة الإجراء' :
                                    'View alert information and action status' }}
                            </p>
                        </div>
                        <button @click="$emit('close')"
                            class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" :class="isDark ? 'text-white' : 'text-gray-400'">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="border rounded-2xl p-6 mb-6 transition-all duration-500"
                        :class="[statusTheme.borderColor, isDark ? 'bg-white/5' : 'bg-white']">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-base font-normal" :class="isDark ? 'text-white' : 'text-black'">{{
                                alert.title }}</h3>
                            <span class="px-4 py-1 rounded-full text-xs font-medium text-white"
                                :class="statusTheme.badgeBg">
                                {{ translateStatus(alert.status) }}
                            </span>
                        </div>
                        <p class="text-sm mb-6 leading-relaxed" :class="isDark ? 'text-white/70' : 'text-black/80'">
                            {{ alert.description }}
                        </p>
                        <div class="flex gap-y-2 gap-x-8 text-xs text-xs"
                            :class="isDark ? 'text-white/50' : 'text-black/80'">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ currentLang === 'ar' ? 'تاريخ التنبيه' : 'Alert Date' }}: {{ alert.date }}
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {{ currentLang === 'ar' ? 'الوحدة' : 'Module' }}: {{ alert.fullModuleName }}
                            </div>
                        </div>
                    </div>

                    <div class="rounded-2xl p-6 text-white transition-all duration-500" :class="statusTheme.bannerBg">
                        <div class="flex items-start gap-3 mb-3">
                            <div
                                class="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shrink-0 mt-0.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="4">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div class="flex flex-col">
                                <h4 class="text-base font-normal">{{ alert.actionTitle }}</h4>
                                <p class="text-sm opacity-90 my-3 leading-relaxed">
                                    {{ alert.actionNote }}
                                </p>
                                <div v-if="alert.status !== 'Awaiting Action'"
                                    class="flex flex-wrap gap-y-2 gap-x-8 text-xs font-medium">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {{ alert.assignee }}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {{ alert.status === 'Completed' ? (currentLang === 'ar' ? 'اكتمل في' :
                                            'Completed')
                                            :
                                            (currentLang === 'ar' ? 'تحديث في' : 'Updated') }}: {{ alert.actionDate }}
                                    </div>
                                </div>
                            </div>
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
    alert: Object,
    isDark: Boolean,
    currentLang: String
});

const translateStatus = (status) => {
    if (props.currentLang !== 'ar') return status;
    const s = status.toLowerCase();
    if (s.includes('completed')) return 'مكتمل';
    if (s.includes('awaiting')) return 'قيد الانتظار';
    if (s.includes('ignored')) return 'تم التجاهل';
    return status;
}

const statusTheme = computed(() => {
    const s = props.alert.status?.toLowerCase() || '';
    if (s.includes('completed') || s.includes('resolved')) {
        return {
            borderColor: 'border-[#198A3F]/20',
            badgeBg: 'bg-[#198A3F]',
            bannerBg: 'bg-[#479D67]'
        };
    }
    if (s.includes('awaiting') || s.includes('pending')) {
        return {
            borderColor: 'border-[#B29544]/20',
            badgeBg: 'bg-[#B29544]',
            bannerBg: 'bg-[#B29544]'
        };
    }
    return {
        borderColor: 'border-gray-200',
        badgeBg: 'bg-[#666666]',
        bannerBg: 'bg-[#666666]'
    };
});
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
</style>