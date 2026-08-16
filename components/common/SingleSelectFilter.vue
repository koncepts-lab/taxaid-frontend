<template>
  <div ref="rootRef" class="relative">
    <!-- Trigger -->
    <button ref="triggerRef" type="button" @click="toggle"
      :class="open ? 'border-[#058a64] ring-1 ring-[#058a64]' : 'border-gray-100'"
      class="w-full bg-gray-50 border text-sm rounded-lg flex items-center justify-between px-4 py-2.5 cursor-pointer text-left">
      <span class="truncate" :class="modelValue ? 'text-gray-700' : 'text-gray-400'">{{ modelValue || placeholder }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="shrink-0 ml-2" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5h16l-6.4 7.5v5L10.4 19v-6.5L4 5Z" :fill="modelValue ? '#058a64' : 'none'" stroke="currentColor" stroke-width="2" stroke-linejoin="round" class="text-gray-400" />
      </svg>
    </button>

    <!-- Panel -->
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[99998]" @click="close" />
      <div v-if="open" :style="panelStyle"
        class="fixed z-[99999] w-64 rounded-xl border border-gray-200 shadow-2xl overflow-hidden text-sm bg-white">

        <!-- Search -->
        <div class="p-2 border-b border-gray-100">
          <input ref="searchRef" v-model="search" type="text" placeholder="Search..."
            class="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-1 focus:ring-[#058a64]" />
        </div>

        <!-- Options — single-select, clicking one replaces the current pick -->
        <div class="max-h-52 overflow-y-auto py-1">
          <button v-for="opt in visibleOptions" :key="opt" type="button" @click="picked = opt"
            class="w-full px-3 py-2 text-left flex items-center gap-1.5 hover:bg-gray-50"
            :class="opt === picked ? 'bg-[#eefdf6] text-[#058a64] font-medium' : 'text-gray-600'">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="opt === picked ? 'bg-[#04C18F]' : ''"></span>
            <span class="truncate">{{ opt }}</span>
          </button>
          <p v-if="!visibleOptions.length" class="px-3 py-3 text-center text-xs text-gray-400">No matches</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 p-2 border-t border-gray-100">
          <button @click="clear" class="flex-1 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
            Clear
          </button>
          <button @click="apply" :disabled="!picked" class="flex-1 py-1.5 rounded-lg bg-[#058a64] text-white text-sm hover:bg-[#047857] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Apply
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// Single-select variant of DataSourceTbHeaderFilter's funnel/search/list style —
// picks exactly one value (for assigning a field) instead of filtering rows.
//   <CommonSingleSelectFilter v-model="value" :options="['A','B']" placeholder="Select" />
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select' },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const search = ref('')
const rootRef = ref(null)
const triggerRef = ref(null)
const searchRef = ref(null)
const panelStyle = ref({})
const picked = ref('')

const visibleOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? props.options.filter((o) => String(o).toLowerCase().includes(q)) : props.options
})

const toggle = () => {
  if (open.value) return close()
  picked.value = props.modelValue
  search.value = ''
  const r = triggerRef.value?.getBoundingClientRect()
  if (r) {
    const panelW = 256
    const left = Math.min(Math.max(8, r.left), window.innerWidth - panelW - 8)
    const top = Math.min(r.bottom + 6, window.innerHeight - 320)
    panelStyle.value = { top: `${Math.max(8, top)}px`, left: `${left}px` }
  }
  open.value = true
  nextTick(() => searchRef.value?.focus())
}
const close = () => { open.value = false }

const apply = () => {
  emit('update:modelValue', picked.value)
  close()
}
const clear = () => {
  picked.value = ''
  emit('update:modelValue', '')
  close()
}
</script>
