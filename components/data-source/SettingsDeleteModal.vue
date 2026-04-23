<template>
    <Teleport to="body" v-if="isOpen">
        <Transition name="fade" appear>
            <div class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="$emit('close')">

                <div class="w-full max-w-md transition-all duration-300 transform scale-100 shadow-2xl relative text-center rounded-2xl p-8"
                    :class="isDark ? 'bg-[#111111] border border-white/10' : 'bg-white'">

                    <!-- Close Button -->
                    <button @click="$emit('close')"
                        class="absolute top-5 ltr:right-5 rtl:left-5 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- DYNAMIC ICON SECTION -->
                    <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-500"
                        :class="config.iconBg">
                        <div v-html="config.icon" class="flex items-center justify-center"></div>
                    </div>

                    <!-- DYNAMIC TEXT -->
                    <h2 class="text-2xl font-bold mb-3" :class="isDark ? 'text-white' : 'text-gray-900'">
                        {{ currentLang === 'ar' ? config.titleAr : config.title }}
                    </h2>

                    <div class="mb-10">
                        <p class="text-base leading-relaxed px-4" :class="isDark ? 'text-white/70' : 'text-gray-500'">
                            {{ currentLang === 'ar' ? config.subAr : config.sub }}
                        </p>
                    </div>

                    <!-- ACTIONS -->
                    <div class="flex justify-center gap-3">
                        <button @click="$emit('close')"
                            class="px-8 py-3 rounded-xl border font-bold text-sm transition-all active:scale-95" :class="isDark
                                ? 'border-white/10 text-white hover:bg-white/5'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
                            {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                        </button>
                        <button @click="$emit('confirm')"
                            class="px-10 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2"
                            :class="config.btnClass">
                            <!-- Show check icon only for confirm actions -->

                            <svg v-if="type !== 'delete'" width="20" height="20" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.1678 8.33357C18.5484 10.2013 18.2772 12.1431 17.3994 13.8351C16.5216 15.527 15.0902 16.8669 13.3441 17.6313C11.5979 18.3957 9.64252 18.5384 7.80391 18.0355C5.9653 17.5327 4.35465 16.4147 3.24056 14.8681C2.12646 13.3214 1.57626 11.4396 1.68171 9.53639C1.78717 7.63318 2.54189 5.82364 3.82004 4.40954C5.09818 2.99545 6.82248 2.06226 8.70538 1.76561C10.5883 1.46897 12.516 1.82679 14.167 2.7794"
                                    stroke="white" stroke-width="1.66667" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M7.5 9.16683L10 11.6668L18.3333 3.3335" stroke="white" stroke-width="1.66667"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>{{ currentLang === 'ar' ?
                                config.btnTextAr : config.btnText }} </button>


                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    isDark: Boolean,
    currentLang: String,
    type: {
        type: String,
        default: 'delete' // 'delete' | 'start-dev' | 'complete'
    }
});

const emit = defineEmits(['close', 'confirm']);

const config = computed(() => {
    const schemas = {
        'delete': {
            title: 'Confirm Delete',
            titleAr: 'تأكيد الحذف',
            sub: 'Are you sure you want to delete this record? This action cannot be undone.',
            subAr: 'هل أنت متأكد أنك تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
            btnText: 'Delete Record',
            btnTextAr: 'تأكيد الحذف',
            btnClass: 'bg-[#FB7554] hover:bg-[#ff5c33] shadow-red-500/20',
            iconBg: 'bg-red-50',
            icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FB7554" stroke-width="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" /></svg>`
        },
        'start-dev': {
            title: 'Start Development?',
            titleAr: 'بدء التطوير؟',
            sub: 'Are you sure you want to start development on this ticket? This will notify the team.',
            subAr: 'هل أنت متأكد أنك تريد بدء التطوير لهذه التذكرة؟ سيتم إخطار الفريق.',
            btnText: 'Yes, Confirm',
            btnTextAr: 'نعم، تأكيد',
            btnClass: 'bg-[#008169] hover:bg-[#006B56] shadow-teal-500/20',
            iconBg: 'bg-[#D0FAE5]',
            icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#008169"><path d="M8 5v14l11-7z"/></svg>`
        },
        'complete': {
            title: 'Mark as Developed?',
            titleAr: 'تمييز كمكتمل؟',
            sub: 'This will notify the team and move the status to Developed.',
            subAr: 'سيؤدي هذا إلى إخطار الفريق ونقل الحالة إلى "تم التطوير".',
            btnText: 'Yes, Confirm',
            btnTextAr: 'نعم، تأكيد',
            btnClass: 'bg-[#008169] hover:bg-[#006B56] shadow-teal-500/20',
            iconBg: 'bg-[#D0FAE5]',
            icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#008169" stroke-width="3"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        }
    }
    return schemas[props.type] || schemas.delete;
})
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