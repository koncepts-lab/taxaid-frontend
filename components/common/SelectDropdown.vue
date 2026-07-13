<template>
  <div ref="rootRef" class="relative">
    <!-- Field -->
    <button ref="fieldRef" type="button" :disabled="disabled" @click="toggle"
      :class="open ? 'border-[#00896F] ring-1 ring-[#00896F]' : 'border-gray-100'"
      class="w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none cursor-pointer text-[#717182] flex items-center gap-1.5 text-left disabled:opacity-50 disabled:cursor-not-allowed">
      <span v-if="isHighlighted(modelValue)" class="w-2.5 h-2.5 rounded-full bg-[#04C18F] shrink-0"></span>
      <span class="flex-1 truncate" :class="modelValue ? '' : 'text-gray-400'">{{ modelValue || placeholder }}</span>
      <svg class="w-4 h-4 text-gray-400 shrink-0 transition-transform" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Menu: teleported to body so it can't be clipped by overflow containers (tables, modals) -->
    <Teleport to="body">
      <div v-if="open" ref="menuRef" :style="menuStyle"
        class="fixed z-[100000] bg-white border border-gray-200 rounded-lg shadow-lg py-1">
        <!-- Search -->
        <div v-if="searchable" class="px-2 pb-1">
          <input ref="searchRef" type="text" v-model="search" placeholder="Search..."
            class="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-sm focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 placeholder-gray-400" />
        </div>

        <div class="max-h-60 overflow-y-auto">
          <button v-if="clearable && !search" type="button" @click="select('')"
            class="w-full px-3 py-2 text-sm text-left flex items-center gap-1.5 hover:bg-gray-50"
            :class="!modelValue ? 'bg-[#eefdf6] text-[#00896F] font-medium' : 'text-gray-600'">
            <span v-if="hasHighlights" class="w-2.5 h-2.5 shrink-0"></span>
            {{ clearLabel }}
          </button>
          <button v-for="opt in filteredOptions" :key="opt" type="button" @click="select(opt)"
            class="w-full px-3 py-2 text-sm text-left flex items-center gap-1.5 hover:bg-gray-50"
            :class="opt === modelValue ? 'bg-[#eefdf6] text-[#00896F] font-medium' : 'text-gray-600'">
            <span v-if="hasHighlights" class="w-2.5 h-2.5 rounded-full shrink-0" :class="isHighlighted(opt) ? 'bg-[#04C18F]' : ''"></span>
            <span class="truncate">{{ opt }}</span>
          </button>
          <p v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-400">No matches</p>
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
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  highlights: { type: Array, default: () => [] },
  searchable: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  placeholder: { type: String, default: '—' },
  clearLabel: { type: String, default: '—' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const search = ref('')
const rootRef = ref(null)
const fieldRef = ref(null)
const menuRef = ref(null)
const searchRef = ref(null)
const menuStyle = ref({})

const hasHighlights = computed(() => props.highlights.length > 0)
const isHighlighted = (value) => !!value && props.highlights.includes(value)

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((opt) => String(opt).toLowerCase().includes(q))
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

const toggle = async () => {
  open.value = !open.value
  if (open.value) {
    search.value = ''
    positionMenu()
    if (props.searchable) {
      await nextTick()
      searchRef.value?.focus()
    }
  }
}

const select = (value) => {
  emit('update:modelValue', value)
  close()
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
