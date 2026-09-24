<template>
    <div class="relative">
        <button ref="triggerRef" type="button" @click="toggle"
            class="h-[44px] w-full md:w-auto md:min-w-[150px] px-4 rounded-[10px] border flex items-center justify-between gap-3 transition-all cursor-pointer font-normal"
            :class="[
                isDark ? 'bg-[#002E26] border-[#03D8B0]/30 text-white' : 'bg-white border-[#04C18F]/30 text-[#013e32]',
                open ? (isDark ? 'ring-1 ring-[#03D8B0]/60' : 'ring-1 ring-[#04C18F]/60') : ''
            ]">
            <span class="flex items-center gap-2">
                <svg class="w-4 h-4" :class="isDark ? 'text-white/40' : 'text-black/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium tabular-nums">{{ displayHour }}:{{ minute }} {{ ampm }}</span>
            </span>
            <svg class="w-4 h-4 transition-transform" :class="[open ? 'rotate-180' : '', isDark ? 'text-white/40' : 'text-black/30']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <Teleport to="body">
            <div v-if="open" class="fixed inset-0 z-[1299]" @click="open = false"></div>
            <Transition name="tp">
                <div v-if="open" class="fixed z-[1300] w-[280px] rounded-2xl border shadow-2xl p-4"
                    :style="panelStyle"
                    :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/30 text-white' : 'bg-white border-gray-100 text-[#013e32]'">

                    <p class="text-[11px] font-semibold uppercase tracking-wide mb-2" :class="isDark ? 'text-white/40' : 'text-gray-400'">
                        {{ currentLang === 'ar' ? 'الساعة' : 'Hour' }}
                    </p>
                    <div class="grid grid-cols-6 gap-1.5 mb-4">
                        <button v-for="h in 12" :key="h" type="button" @click="setHour(h)"
                            class="h-9 rounded-lg text-[13px] font-medium transition-all cursor-pointer tabular-nums"
                            :class="Number(hour) === h
                                ? (isDark ? 'bg-[#00FFBC] text-[#013e32]' : 'bg-[#016A56] text-white shadow-sm')
                                : (isDark ? 'bg-white/5 text-white/80 hover:bg-white/10' : 'bg-[#F3FBF8] text-[#013e32] hover:bg-[#D6F5ED]')">
                            {{ String(h).padStart(2, '0') }}
                        </button>
                    </div>

                    <p class="text-[11px] font-semibold uppercase tracking-wide mb-2" :class="isDark ? 'text-white/40' : 'text-gray-400'">
                        {{ currentLang === 'ar' ? 'الدقائق' : 'Minutes' }}
                    </p>
                    <div class="grid grid-cols-4 gap-1.5 mb-4">
                        <button v-for="m in MINUTES" :key="m" type="button" @click="emit('update:minute', m)"
                            class="h-9 rounded-lg text-[13px] font-medium transition-all cursor-pointer tabular-nums"
                            :class="minute === m
                                ? (isDark ? 'bg-[#00FFBC] text-[#013e32]' : 'bg-[#016A56] text-white shadow-sm')
                                : (isDark ? 'bg-white/5 text-white/80 hover:bg-white/10' : 'bg-[#F3FBF8] text-[#013e32] hover:bg-[#D6F5ED]')">
                            {{ m }}
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-1.5 mb-4 p-1 rounded-xl" :class="isDark ? 'bg-white/5' : 'bg-[#F3FBF8]'">
                        <button v-for="p in ['AM', 'PM']" :key="p" type="button" @click="emit('update:ampm', p)"
                            class="h-9 rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
                            :class="ampm === p
                                ? (isDark ? 'bg-[#00FFBC] text-[#013e32]' : 'bg-[#016A56] text-white shadow-sm')
                                : (isDark ? 'text-white/60 hover:text-white' : 'text-[#013e32]/60 hover:text-[#013e32]')">
                            {{ p }}
                        </button>
                    </div>

                    <button type="button" @click="open = false"
                        class="w-full h-10 rounded-xl text-[14px] font-medium transition-all cursor-pointer active:scale-[0.98]"
                        :class="isDark ? 'bg-[#00FFBC]/15 text-[#00FFBC] hover:bg-[#00FFBC]/25' : 'bg-[#007B5B] text-white hover:bg-[#00664B]'">
                        {{ currentLang === 'ar' ? 'تم' : 'Done' }}
                    </button>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    hour:   { type: [String, Number], default: 9 },
    minute: { type: String, default: '00' },
    ampm:   { type: String, default: 'AM' },
})

const emit = defineEmits(['update:hour', 'update:minute', 'update:ampm'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const MINUTES = ['00', '15', '30', '45']
const PANEL_HEIGHT = 340
const PANEL_WIDTH = 280

const open = ref(false)
const triggerRef = ref(null)
const panelStyle = ref({})

const displayHour = computed(() => String(props.hour).padStart(2, '0'))

const setHour = (h) => {
    emit('update:hour', typeof props.hour === 'number' ? h : String(h).padStart(2, '0'))
}

const toggle = () => {
    if (open.value) { open.value = false; return }
    const rect = triggerRef.value?.getBoundingClientRect()
    if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom
        const top = spaceBelow >= PANEL_HEIGHT + 12 ? rect.bottom + 8 : Math.max(8, rect.top - PANEL_HEIGHT - 8)
        const left = Math.min(Math.max(8, rect.left), window.innerWidth - PANEL_WIDTH - 8)
        panelStyle.value = { top: `${top}px`, left: `${left}px` }
    }
    open.value = true
}
</script>

<style scoped>
.tp-enter-active, .tp-leave-active { transition: all 0.18s ease; }
.tp-enter-from, .tp-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
