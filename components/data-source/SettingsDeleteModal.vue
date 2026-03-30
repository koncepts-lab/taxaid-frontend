<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-md transition-all duration-300 transform scale-100 shadow-2xl relative text-center rounded-lg p-6"
                    :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

                    <button @click="$emit('close')"
                        class="absolute top-5 ltr:right-5 rtl:left-5 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                        :class="isDark ? 'bg-red-500/10' : 'bg-red-50'">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FB7554" stroke-width="2.5">
                            <path
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                    <h2 class="text-2xl font-bold mb-3" :class="isDark ? 'text-white' : 'text-gray-900'">
                        {{ currentLang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete' }}
                    </h2>

                    <div class="mb-10">
                        <p class="text-base leading-relaxed" :class="isDark ? 'text-white/70' : 'text-gray-600'">
                            {{ currentLang === 'ar' ?
                                'هل أنت متأكد أنك تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.' :
                                'Are you sure you want to delete this record? This action cannot be undone.' }}
                        </p>
                    </div>

                    <div class="flex justify-center gap-3">
                        <button @click="$emit('close')"
                            class="px-8 py-3 rounded-xl border font-bold text-sm transition-all active:scale-95" :class="isDark
                                ? 'border-white/10 text-white hover:bg-white/5'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
                            {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                        </button>
                        <button @click="$emit('confirm')"
                            class="px-10 py-3 rounded-xl bg-[#FB7554] hover:bg-[#ff5c33] text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all active:scale-95">
                            {{ currentLang === 'ar' ? 'تأكيد الحذف' : 'Delete Record' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    isDark: Boolean,
    currentLang: String
});
defineEmits(['close', 'confirm']);
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