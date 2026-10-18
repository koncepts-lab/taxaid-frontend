<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="close">
                <div class="w-full h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500" :class="isDark ? 'bg-[#001a14] border border-white/10' : 'bg-white'" style="max-width: 1300px;">
                    <!-- ── Fixed Header ── -->
                    <div class="shrink-0 flex justify-between items-start py-5 px-4 lg:px-8 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <div>
                            <h3 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                                {{ type === 'incoming' ? (currentLang === 'ar' ? 'الواردة' : 'Incoming') : (currentLang === 'ar' ? 'الصادرة' : 'Outgoing') }}
                            </h3>
                            <span class="text-[12px] mt-0.5 block" :class="isDark ? 'text-white/50' : 'text-[#00000096]'">
                                {{ valuesNote(false) }}
                            </span>
                        </div>
                        <button @click="close" class="p-1.5 rounded-lg transition-colors" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-[#013e32]'">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <CashFlowDetailSections :type="type" @open-invoices="$emit('open-invoices', $event)" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    open: Boolean,
    type: { type: String, default: 'incoming' }, // incoming | outgoing
})
const emit = defineEmits(['update:open', 'open-invoices'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { valuesNote } = useCurrency()

const close = () => emit('update:open', false)
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
