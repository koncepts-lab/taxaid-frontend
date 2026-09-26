<template>
  <span v-if="text" ref="anchor" class="relative inline-flex shrink-0 align-middle" tabindex="0"
    @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide">
    <img :src="light || isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info"
      class="w-4 h-4 cursor-help opacity-80 hover:opacity-100 transition-opacity" />

    <Teleport to="body">
      <span v-if="open" role="tooltip"
        class="pointer-events-none fixed z-[10000] w-64 rounded-lg bg-[#003d35] text-white text-[12px] font-normal leading-snug px-3 py-2 shadow-lg normal-case text-left rtl:text-right"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" :style="style">
        {{ text }}
      </span>
    </Teleport>
  </span>
</template>

<script setup>
// <CommonInfoTooltip tip="costCenterDetail.chart" /> reads its text from composables/common/useTooltips.ts.
// The popover is drawn on the page itself (not inside its parent), so scrolling tables and sticky headers never clip it.
const props = defineProps({
  tip: { type: String, required: true },
  light: { type: Boolean, default: false },
  align: { type: String, default: 'left' },
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { tip: read } = useTooltips()
const text = computed(() => read(props.tip))

const anchor = ref(null)
const open = ref(false)
const style = ref({})

const WIDTH = 256
const GAP = 8
const MARGIN = 8

const show = () => {
  const rect = anchor.value?.getBoundingClientRect()
  if (!rect) return

  let left = props.align === 'right' ? rect.right - WIDTH : rect.left
  left = Math.max(MARGIN, Math.min(left, window.innerWidth - WIDTH - MARGIN))

  style.value = { top: `${rect.bottom + GAP}px`, left: `${left}px` }
  open.value = true
}

const hide = () => { open.value = false }

onMounted(() => { window.addEventListener('scroll', hide, true) })
onBeforeUnmount(() => { window.removeEventListener('scroll', hide, true) })
</script>
