<template>
  <Teleport to="body">
    <div v-if="current" class="fixed bottom-4 z-[9999] w-[clamp(300px,24vw,380px)] max-w-[calc(100vw-2rem)]"
      :class="currentLang === 'ar' ? 'left-4' : 'right-4'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <Transition name="toast" mode="out-in">
        <div :key="current"
          class="rounded-xl border shadow-2xl p-4 h-[clamp(108px,7.5vw,124px)] flex items-start gap-3"
          :class="isDark ? 'bg-[#002E26] border-[#03D8B0] text-white' : 'bg-white border-[#03D8B0] text-black'">
          <div class="rounded-lg flex items-center justify-center shrink-0" :style="{ width: 'clamp(2.5rem, 2.8vw, 3rem)', height: 'clamp(2.5rem, 2.8vw, 3rem)', backgroundColor: isDark ? '#095545' : '#176856' }">
            <img :src="META[current].icon" :alt="META[current].en" class="w-1/2 h-1/2 object-contain" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate" style="font-size: clamp(0.875rem, 0.95vw, 1rem)">{{ currentLang === 'ar' ? META[current].ar : META[current].en }}</p>
            <p class="mt-0.5 truncate" style="font-size: clamp(0.75rem, 0.8vw, 0.875rem); min-height: 1.25rem" :class="isDark ? 'text-white/60' : 'text-black/50'">
              <template v-if="keys.length > 1">{{ currentLang === 'ar' ? `+${keys.length - 1} تنبيهات أخرى` : `+${keys.length - 1} more alert${keys.length - 1 > 1 ? 's' : ''}` }}</template>
            </p>
            <button @click="$emit('open', current)"
              class="mt-2 rounded-lg font-medium bg-[#03D8B0] text-black hover:bg-[#02c39f] transition-colors cursor-pointer" style="font-size: clamp(0.75rem, 0.8vw, 0.875rem); padding: clamp(0.375rem, 0.45vw, 0.5rem) clamp(0.75rem, 0.9vw, 1rem)">
              {{ currentLang === 'ar' ? 'فتح' : 'Open' }}
            </button>
          </div>
          <button @click="$emit('close', current)" :aria-label="currentLang === 'ar' ? 'إغلاق' : 'Close'"
            class="shrink-0 transition-colors cursor-pointer" :class="isDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
            <svg class="shrink-0" style="width: clamp(1.125rem, 1.2vw, 1.25rem); height: clamp(1.125rem, 1.2vw, 1.25rem)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  keys: { type: Array, default: () => [] }
})
defineEmits(['open', 'close'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const META = {
  ar_variance: { en: 'AR Variance Reconciliation', ar: 'تسوية فروقات الذمم المدينة', icon: '/images/icons/Account-Receivables.svg' },
  ap_variance: { en: 'AP Variance Reconciliation', ar: 'تسوية فروقات الذمم الدائنة', icon: '/images/icons/Accounts-Payable.svg' },
  missing_ledgers: { en: 'New Ledger Detected', ar: 'تم اكتشاف دفتر أستاذ جديد', icon: '/images/icons/Financial-Statement.svg' },
  sales_forecast_variance: { en: 'Sales Forecast Variance', ar: 'فرق توقعات المبيعات', icon: '/images/icons/Revenue.svg' },
}

const current = computed(() => props.keys[0] ?? null)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
