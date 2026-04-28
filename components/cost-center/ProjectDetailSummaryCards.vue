<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="(card, idx) in cards" :key="idx" class="p-6 rounded-2xl border transition-all duration-300"
      :class="isDark ? 'bg-[#002B21] border-white/5' : 'bg-white border-[#03D8B0] shadow-sm'">

      <div class="flex items-center gap-2 mb-3">
        <img :src="card.icon" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
        <span class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#666666]'">
          {{ currentLang === 'ar' ? card.labelAr : card.label }}
        </span>
      </div>

      <div class="flex items-baseline gap-2">
        <span class="text-[10px] opacity-50" :class="isDark ? 'text-white' : 'text-black'">AED</span>

        <span class="text-[20px] font-bold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
          {{ formatToMillions(card.value || 0) }} M
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  summaryData: {
    type: Object,
    default: () => ({})
  }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
watch(currentLang, () => {
  console.log("🚀 ~ currentLang:", props.value)
})
// Map the API's contract_summary object to the cards array
const cards = computed(() => {
  if (!props.summaryData) return []

  const data = props.summaryData
  console.log("🚀 ~ data:", data)

  return [
    {
      label: 'Contract Value',
      labelAr: 'قيمة العقد',
      value: data.contract_value?.toLocaleString() || '0',
      icon: '/images/icons/Contract-Value.svg'
    },
    {
      label: 'Invoiced Amount',
      labelAr: 'المبلغ المفوتر',
      value: data.invoiced?.toLocaleString() || '0',
      icon: '/images/icons/Invoiced.svg'
    },
    {
      label: 'Yet to Invoice',
      labelAr: 'المتبقي للفوترة',
      value: data.yet_to_invoice?.toLocaleString() || '0',
      icon: '/images/icons/pending.svg'
    }
  ]
})
</script>