<template>
  <div ref="rootRef" class="relative">
    <!-- Field -->
    <button ref="fieldRef" type="button" :disabled="disabled" @click="toggle" @keydown="onKeydown"
      :role="isSelect ? 'combobox' : undefined"
      :aria-haspopup="isSelect ? 'listbox' : undefined"
      :aria-expanded="isSelect ? open : undefined"
      :aria-controls="isSelect ? listId : undefined"
      :aria-activedescendant="isSelect && open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
      :class="fieldClasses"
      class="w-full border outline-none cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
      <span v-if="isHighlighted(modelValue)" class="w-2.5 h-2.5 rounded-full bg-[#04C18F] shrink-0"></span>
      <span class="flex-1 truncate" :class="(selectedOption || hasValue) ? '' : placeholderClass">{{ displayText }}</span>
      <svg class="w-4 h-4 shrink-0 transition-transform" :class="[open ? 'rotate-180' : '', isSelect ? (dk ? 'text-[#00FFBC]' : 'text-[#00896F]') : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Menu: teleported to body so it can't be clipped by overflow containers (tables, modals) -->
    <Teleport to="body">
      <div v-if="open" ref="menuRef" :style="menuStyle" :dir="isSelect ? (currentLang === 'ar' ? 'rtl' : 'ltr') : undefined"
        :class="menuClasses">
        <!-- Search -->
        <div v-if="searchable" class="px-2 pb-1">
          <input ref="searchRef" type="text" v-model="search" :placeholder="searchPlaceholder" @keydown="onSearchKeydown"
            :class="searchClasses"
            class="w-full px-3 py-1.5 border rounded-md text-sm focus:ring-1 focus:ring-[#00896F] outline-none" />
        </div>

        <div :id="listId" :role="isSelect ? 'listbox' : undefined" class="max-h-60 overflow-y-auto">
          <button v-if="showClear" type="button" @click="select('')"
            class="w-full px-3 py-2 text-sm text-left flex items-center gap-1.5 hover:bg-gray-50"
            :class="!modelValue ? 'bg-[#eefdf6] text-[#00896F] font-medium' : 'text-gray-600'">
            <span v-if="hasHighlights" class="w-2.5 h-2.5 shrink-0"></span>
            {{ clearLabel }}
          </button>
          <button v-for="(opt, index) in filteredOptions" :key="opt.value" type="button" @click="select(opt.value)"
            :id="isSelect ? optionId(index) : undefined"
            :role="isSelect ? 'option' : undefined"
            :aria-selected="isSelect ? isSelected(opt.value) : undefined"
            :data-active="isSelect && index === activeIndex ? 'true' : undefined"
            @mouseenter="isSelect ? (activeIndex = index) : null"
            :class="optionClasses(opt, index)"
            class="w-full flex items-center gap-1.5">
            <span v-if="hasHighlights" class="w-2.5 h-2.5 rounded-full shrink-0" :class="isHighlighted(opt.value) ? 'bg-[#04C18F]' : ''"></span>
            <span class="truncate">{{ opt.label }}</span>
          </button>
          <p v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-400">{{ noMatchesLabel }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// Generic rounded dropdown.
//   <CommonSelectDropdown v-model="value" :options="['A','B']" />
// Optional:
//   :highlights="['A']"  -> green dot on field + inside the menu for those values
//   searchable           -> search bar inside the menu
//   clearable            -> empty option at the top (default true)
//   placeholder / clear-label / disabled
//   mode="select"        -> behaves like a native <select>: no empty option, 44px themed field,
//                           dark-mode menu, keyboard (arrows/Home/End/Enter/Esc/type-ahead), ARIA, RTL.
//                           Options may be strings or { value, label, search? }; values may be numbers or null.
//                           `search` is hidden text that also matches the search box (every word must match).
//   size="md|sm|xs"       -> field/option size in select mode (44 / 38 / 30 px)
//   :dark="bool"          -> force light/dark in select mode instead of following the theme
//   invalid              -> red border in select mode
import { ref, computed, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  highlights: { type: Array, default: () => [] },
  searchable: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  placeholder: { type: String, default: '—' },
  clearLabel: { type: String, default: '—' },
  disabled: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  mode: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  dark: { type: Boolean, default: undefined },
  invalid: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Search...' },
  noMatchesLabel: { type: String, default: 'No matches' },
})
const emit = defineEmits(['update:modelValue'])

const uid = useId()
const listId = `${uid}-list`
const optionId = (index) => `${uid}-opt-${index}`

const dk = computed(() => props.dark ?? isDark.value)
const isSelect = computed(() => props.mode === 'select')

const SIZES = {
  md: { field: 'h-[44px] px-4 rounded-[10px] text-[14px]', option: 'px-3 py-2 text-[14px]' },
  sm: { field: 'h-[38px] px-3 rounded-[10px] text-[13px]', option: 'px-3 py-1.5 text-[13px]' },
  xs: { field: 'h-[30px] px-2.5 rounded-lg text-xs', option: 'px-2.5 py-1.5 text-xs' },
}
const sizeClasses = computed(() => SIZES[props.size] ?? SIZES.md)
const showClear = computed(() => props.clearable && !search.value && !isSelect.value)

const normalized = computed(() => props.options.map((o) => (
  o !== null && typeof o === 'object'
    ? { value: o.value, label: String(o.label ?? o.value), search: String(o.search ?? '') }
    : { value: o, label: String(o), search: '' }
)))

const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined)
const sameValue = (a, b) => a === b || (a != null && b != null && String(a) === String(b))
const isSelected = (value) => sameValue(value, props.modelValue)
const selectedOption = computed(() => normalized.value.find((o) => isSelected(o.value)))
const displayText = computed(() => {
  if (selectedOption.value) return selectedOption.value.label
  return hasValue.value ? String(props.modelValue) : props.placeholder
})

const fieldClasses = computed(() => {
  if (isSelect.value) {
    return [
      sizeClasses.value.field + ' text-start',
      open.value
        ? 'border-[#00896F] ring-1 ring-[#00896F]'
        : (props.invalid ? 'border-red-500' : (dk.value ? 'border-[#03D8B0]/30' : 'border-[#04C18F]/40')),
      dk.value ? 'bg-[#001F1A] text-white' : 'bg-white text-[#013e32]',
    ]
  }
  return [
    'p-2.5 rounded-lg text-sm text-left',
    open.value ? 'border-[#00896F] ring-1 ring-[#00896F]' : fieldBorderClass.value,
    fieldBgClass.value,
  ]
})

const menuClasses = computed(() => {
  if (isSelect.value) {
    return [
      'fixed z-[100000] border p-1.5 rounded-[14px]',
      dk.value
        ? 'bg-[#002E26] border-[#03D8B0]/30 text-white shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
        : 'bg-white border-[#04C18F]/40 text-[#013e32] shadow-[0_12px_32px_rgba(1,62,50,0.14)]',
    ]
  }
  return 'fixed z-[100000] bg-white border border-gray-200 rounded-lg shadow-lg py-1'
})

const searchClasses = computed(() => (isSelect.value && dk.value
  ? 'bg-black/30 border-white/10 text-white placeholder-white/40'
  : 'bg-gray-50 border-gray-100 text-gray-700 placeholder-gray-400'))

const optionClasses = (opt, index) => {
  if (isSelect.value) {
    const selected = isSelected(opt.value)
    const active = index === activeIndex.value
    return [
      sizeClasses.value.option + ' text-start rounded-[9px] cursor-pointer',
      selected
        ? (dk.value ? 'bg-[#00FFBC]/20 text-[#00FFBC] font-semibold' : 'bg-[#D6F5ED] text-[#013e32] font-semibold')
        : active
          ? (dk.value ? 'bg-[#00FFBC]/10' : 'bg-[#E6FFF5]')
          : '',
    ]
  }
  return [
    'px-3 py-2 text-sm text-left hover:bg-gray-50',
    isSelected(opt.value) ? 'bg-[#eefdf6] text-[#00896F] font-medium' : 'text-gray-600',
  ]
}

const fieldBgClass = computed(() => {
  if (props.plain) return 'bg-white text-gray-700'
  return (isDark.value ? 'bg-[#032e23]' : 'bg-[#69e4c4]') + ' text-[#717182]'
})
const fieldBorderClass = computed(() => (props.plain ? 'border-gray-200' : 'border-gray-100'))
const placeholderClass = computed(() => (props.plain ? 'text-gray-700' : 'text-gray-400'))

const open = ref(false)
const search = ref('')
const activeIndex = ref(-1)
const rootRef = ref(null)
const fieldRef = ref(null)
const menuRef = ref(null)
const searchRef = ref(null)
const menuStyle = ref({})

const hasHighlights = computed(() => props.highlights.length > 0)
const isHighlighted = (value) => value !== '' && value != null && props.highlights.includes(value)

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return normalized.value
  if (isSelect.value) {
    const tokens = q.split(/\s+/)
    return normalized.value.filter((opt) => {
      const haystack = `${opt.label} ${opt.search}`.toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
  }
  return normalized.value.filter((opt) => opt.label.toLowerCase().includes(q))
})

const positionMenu = () => {
  const rect = fieldRef.value?.getBoundingClientRect()
  if (!rect) return
  const menuMaxHeight = 300 // search bar + max-h-60 list
  const spaceBelow = window.innerHeight - rect.bottom
  const openUp = spaceBelow < menuMaxHeight && rect.top > spaceBelow
  menuStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    ...(openUp
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  }
}

const close = () => { open.value = false }

// Close when the page scrolls, but not when scrolling the menu's own list.
const onScroll = (e) => {
  if (menuRef.value?.contains(e.target)) return
  close()
}

const scrollActive = async () => {
  await nextTick()
  menuRef.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
}

const openMenu = async () => {
  open.value = true
  search.value = ''
  positionMenu()
  activeIndex.value = Math.max(0, filteredOptions.value.findIndex((o) => isSelected(o.value)))
  if (props.searchable) {
    await nextTick()
    searchRef.value?.focus()
  }
  if (isSelect.value) scrollActive()
}

const toggle = async () => {
  if (open.value) close()
  else await openMenu()
}

const select = (value) => {
  emit('update:modelValue', value)
  close()
}

const move = (delta) => {
  const count = filteredOptions.value.length
  if (!count) return
  activeIndex.value = (activeIndex.value + delta + count) % count
  scrollActive()
}

const jumpTo = (index) => {
  if (!filteredOptions.value.length) return
  activeIndex.value = index
  scrollActive()
}

const typeAhead = (key) => {
  const list = filteredOptions.value
  const k = key.toLowerCase()
  const from = open.value ? activeIndex.value + 1 : 0
  const order = [...list.keys()].map((i) => (i + from) % list.length)
  const hit = order.find((i) => list[i].label.toLowerCase().startsWith(k))
  if (hit === undefined) return
  if (open.value) jumpTo(hit)
  else select(list[hit].value)
}

const chooseActive = () => {
  const opt = filteredOptions.value[activeIndex.value]
  if (opt) select(opt.value)
}

const onKeydown = (e) => {
  if (!isSelect.value || props.disabled) return

  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      openMenu()
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typeAhead(e.key)
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); move(1); break
    case 'ArrowUp': e.preventDefault(); move(-1); break
    case 'Home': e.preventDefault(); jumpTo(0); break
    case 'End': e.preventDefault(); jumpTo(filteredOptions.value.length - 1); break
    case 'Enter':
    case ' ': e.preventDefault(); chooseActive(); break
    case 'Escape': e.preventDefault(); e.stopPropagation(); close(); break
    case 'Tab': close(); break
    default:
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) typeAhead(e.key)
  }
}

const onSearchKeydown = (e) => {
  if (!isSelect.value) return
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); move(1); break
    case 'ArrowUp': e.preventDefault(); move(-1); break
    case 'Enter': e.preventDefault(); chooseActive(); break
    case 'Escape': e.preventDefault(); e.stopPropagation(); close(); fieldRef.value?.focus(); break
  }
}

const onClickOutside = (e) => {
  if (rootRef.value?.contains(e.target)) return
  if (menuRef.value?.contains(e.target)) return
  close()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  // The menu is position:fixed, so any scroll/resize invalidates its anchor.
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', close)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', close)
})
</script>
