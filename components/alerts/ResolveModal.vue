<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-xl transition-all duration-300 transform scale-100"
                    :class="isDark ? 'bg-[#1a160a] border border-white/10' : 'bg-white'"
                    style="border-radius: 28px; padding: 32px;">

                    <!-- Header -->
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h2 class="text-xl font-medium" :class="isDark ? 'text-white' : 'text-black'">
                                {{ currentLang === 'ar' ? 'تسجيل الإجراء المتخذ' : 'Record Action Taken' }}
                            </h2>
                            <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-black/80'">
                                {{ currentLang === 'ar' ? 'وثق الإجراء المتخذ لحل هذا التنبيه' :
                                    'Document the action taken to resolve this alert' }}
                            </p>
                        </div>
                        <button @click="$emit('close')" class="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" :class="isDark ? 'text-white' : 'text-gray-400'">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Alert Summary Card (Gold) -->
                    <div class="p-4 rounded-2xl text-white mb-8 shadow-sm"
                        :class="isDark ? 'bg-[#A68426]/20 border border-[#A68426]/30' : 'bg-[#9E8338]/90'">
                        <h3 class="text-base font-normal mb-2" :class="isDark ? 'text-[#FFD700]' : 'text-white'">{{
                            alert.title }}</h3>
                        <p class="text-sm mb-4" :class="isDark ? 'text-white/80' : 'text-white/80'">{{ alert.description
                            || 'Alert details requiring attention.' }}</p>
                        <span
                            class="inline-block px-3 py-1 rounded-lg border border-white/50 text-xs font-normal   tracking-wider">
                            {{ alert.module }} Module
                        </span>
                    </div>

                    <!-- Form Fields -->
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-normal mb-2"
                                :class="isDark ? 'text-white/80' : 'text-gray-700'">
                                {{ currentLang === 'ar' ? 'الإجراء المتخذ من قبل' : 'Action Taken By' }}
                            </label>
                            <input type="text"
                                :placeholder="currentLang === 'ar' ? 'أدخل الاسم والدور...' : 'Enter name and role (e.g., John Smith - Financial Analyst)'"
                                class="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                                :class="isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#A68426]' : ' border-[#9E8338]/50 focus:border-[#A68426] placeholder:text-black/50 placeholder:text-sm'" />
                        </div>

                        <div>
                            <label class="block text-sm font-normal mb-2"
                                :class="isDark ? 'text-white/80' : 'text-gray-700'">
                                {{ currentLang === 'ar' ? 'الإجراء المتخذ والملاحظات' : 'Action Taken & Notes' }}
                            </label>
                            <textarea rows="4"
                                :placeholder="currentLang === 'ar' ? 'صف الإجراء المتخذ...' : 'Describe the action taken to resolve this alert...'"
                                class="w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none"
                                :class="isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#A68426]' : 'border-[#9E8338]/50  focus:border-[#A68426] placeholder:text-black/50 placeholder:text-sm'"></textarea>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-3 mt-8">
                        <button @click="$emit('close')"
                            class="px-6 py-3 rounded-xl border text-sm font-normal transition-all"
                            :class="isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
                            {{ currentLang === 'ar' ? 'تجاهل التنبيه' : 'Ignore Alert' }}
                        </button>
                        <button
                            class="px-8 py-3 rounded-xl bg-[#886B19] hover:bg-[#5E4B00] text-sm text-white font-normal shadow-lg transition-all active:scale-95">
                            {{ currentLang === 'ar' ? 'إرسال الإجراء' : 'Submit Action' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({ isOpen: Boolean, alert: Object, isDark: Boolean, currentLang: String });
defineEmits(['close']);
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