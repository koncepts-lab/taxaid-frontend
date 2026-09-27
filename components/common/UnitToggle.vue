<template>
  <div class="flex rounded-full border overflow-hidden text-[12px] font-medium shrink-0"
    :class="onDark ? 'border-white/25' : 'border-black/15'" @click.stop>
    <button type="button" @click="setUnit('millions')"
      :title="currentLang === 'ar' ? 'عرض القيم مختصرة مثل 1.2M' : 'Show values short, like 1.2M'"
      class="px-3 py-1 cursor-pointer transition-colors"
      :class="unit === 'millions' ? 'bg-[#00D8B0] text-[#00342A]' : (onDark ? 'text-white/80 hover:bg-white/10' : 'text-black/70 hover:bg-black/5')">{{
        currentLang === 'ar' ? 'مختصر' : 'Short' }}</button>
    <button type="button" @click="setUnit('actual')"
      :title="currentLang === 'ar' ? 'عرض القيم كاملة مثل 1,200,000' : 'Show full values, like 1,200,000'"
      class="px-3 py-1 cursor-pointer transition-colors"
      :class="unit === 'actual' ? 'bg-[#00D8B0] text-[#00342A]' : (onDark ? 'text-white/80 hover:bg-white/10' : 'text-black/70 hover:bg-black/5')">{{
        currentLang === 'ar' ? 'كامل' : 'Full' }}</button>
  </div>
</template>

<script setup>
const props = defineProps({
  onDark: { type: Boolean, default: true },
  storageKey: { type: String, default: 'chart_unit' }
})

const currentLang = useState('currentLang', () => 'en')
const { unit, setUnit } = useChartHelper(props.storageKey)
</script>
