<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="(card, idx) in cards" :key="idx" 
      class="p-6 rounded-2xl border transition-all duration-300"
      :class="isDark ? 'bg-[#002B21] border-white/5' : 'bg-white border-[#03D8B0] shadow-sm'">
      
      <div class="flex items-center gap-2 mb-3">
        <img :src="card.icon" class="w-5 h-5" :class="isDark ? 'invert' : ''" />
        <span class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#666666]'">{{ currentLang === 'ar' ? card.labelAr : card.label }}</span>
      </div>
      
      <div class="flex items-baseline gap-2">
        <span class="text-[20px] font-bold" :class="isDark ? 'text-white' : 'text-[#013e32]'">{{ card.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const cards = [
  { label: 'Contract Value', labelAr: 'قيمة العقد', value: 'AED 3.10 M', icon: '/images/icons/Contract-Value.svg' },
  { label: 'Invoiced', labelAr: 'المفوترة', value: 'AED 2.45 M', icon: '/images/icons/Invoiced.svg' },
  { label: 'Yet to Invoice', labelAr: 'لم يتم الفوترة بعد', value: 'AED 8.12 M', icon: '/images/icons/Yet-to-Invoice.svg' }
]
</script>
