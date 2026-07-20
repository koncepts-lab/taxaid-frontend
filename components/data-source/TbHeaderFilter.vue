<template>
  <!-- Funnel trigger — sits to the right of the header label -->
  <button ref="triggerRef" @click.stop="toggle"
    class="inline-flex items-center justify-center w-5 h-5 rounded transition-colors align-middle"
    :class="active ? 'bg-white/25' : 'hover:bg-white/15'"
    :title="currentLang === 'ar' ? 'تصفية' : 'Filter'">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5h16l-6.4 7.5v5L10.4 19v-6.5L4 5Z"
        :fill="active ? '#FFD666' : 'none'"
        stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
    </svg>
  </button>

  <!-- Panel — fixed-position like the page's calendar popovers, so the
       table's overflow-x container can never clip it -->
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9998]" @click="close" />
    <div v-if="isOpen" :style="panelStyle"
      class="fixed z-[9999] w-64 rounded-xl border shadow-2xl overflow-hidden text-sm"
      :class="isDark ? 'bg-[#1a1a1a] border-white/10 text-white/90' : 'bg-white border-gray-200 text-gray-800'"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Search -->
      <div class="p-2 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <input v-model="search" type="text"
          :placeholder="currentLang === 'ar' ? 'بحث...' : 'Search...'"
          class="w-full px-3 py-1.5 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-[#00B794]"
          :class="isDark ? 'bg-[#0d0d0d] border-white/10 placeholder-white/30' : 'bg-white border-gray-200'" />
      </div>

      <!-- Select all -->
      <label class="flex items-center gap-2 px-3 py-2 cursor-pointer border-b font-medium"
        :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-[#E0FCF6]'">
        <input type="checkbox" :checked="allVisibleChecked" :indeterminate="someVisibleChecked"
          @change="toggleAll" class="accent-[#00B794] w-4 h-4" />
        <span>{{ currentLang === 'ar' ? 'تحديد الكل' : 'Select All' }}</span>
        <span class="ms-auto text-xs opacity-50">{{ checked.size }}/{{ options.length }}</span>
      </label>

      <!-- Value checkboxes -->
      <div class="max-h-52 overflow-y-auto py-1">
        <!-- Checked rows keep the hover tint so selections stay visible in long lists -->
        <label v-for="opt in visibleOptions" :key="opt"
          class="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
          :class="checked.has(opt)
            ? (isDark ? 'bg-white/10 text-white' : 'bg-[#E0FCF6] text-[#00655B] font-medium')
            : (isDark ? 'hover:bg-white/5' : 'hover:bg-[#E0FCF6]')">
          <input type="checkbox" :checked="checked.has(opt)" @change="toggleOne(opt)"
            class="accent-[#00B794] w-4 h-4 flex-shrink-0" />
          <span class="truncate" :class="opt === '(blank)' ? 'italic opacity-60' : ''">
            {{ opt === '(blank)' ? (currentLang === 'ar' ? '(فارغ)' : '(Blanks)') : opt }}
          </span>
        </label>
        <p v-if="!visibleOptions.length" class="px-3 py-3 text-center text-xs opacity-50">
          {{ currentLang === 'ar' ? 'لا توجد نتائج' : 'No matches' }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 p-2 border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <button @click="clear"
          class="flex-1 py-1.5 rounded-lg border text-sm transition-colors"
          :class="isDark ? 'border-white/15 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'">
          {{ currentLang === 'ar' ? 'مسح' : 'Clear' }}
        </button>
        <!-- Excel behavior: nothing checked = nothing to show — disable Apply
             instead of silently falling back to "no filter" -->
        <button @click="apply" :disabled="checked.size === 0"
          class="flex-1 py-1.5 rounded-lg bg-[#00B794] text-white text-sm hover:bg-[#00a385] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#00B794]">
          {{ currentLang === 'ar' ? 'تطبيق' : 'Apply' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  column:      { type: String, required: true },   // fs_code | main_group | sub_group | ledger_name
  options:     { type: Array,  default: () => [] },
  selected:    { type: Array,  default: () => [] }, // current applied filter ([] = all)
  isDark:      { type: Boolean, default: false },
  currentLang: { type: String, default: 'en' },
})
const emit = defineEmits(['apply'])

const isOpen     = ref(false)
const search     = ref('')
const triggerRef = ref(null)
const panelStyle = ref({})
// Working copy — applied only on Apply, like Excel
const checked = ref(new Set())

const active = computed(() =>
  props.selected.length > 0 && props.selected.length < props.options.length)

const visibleOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? props.options.filter(o => String(o).toLowerCase().includes(q)) : props.options
})

const allVisibleChecked = computed(() =>
  visibleOptions.value.length > 0 && visibleOptions.value.every(o => checked.value.has(o)))
const someVisibleChecked = computed(() =>
  !allVisibleChecked.value && visibleOptions.value.some(o => checked.value.has(o)))

const toggle = () => {
  if (isOpen.value) return close()
  // Seed working copy: applied selection, or everything when unfiltered
  checked.value = new Set(props.selected.length ? props.selected : props.options)
  search.value = ''
  const r = triggerRef.value?.getBoundingClientRect()
  if (r) {
    const panelW = 256
    const left = Math.min(Math.max(8, r.left), window.innerWidth - panelW - 8)
    const top  = Math.min(r.bottom + 6, window.innerHeight - 380)
    panelStyle.value = { top: `${Math.max(8, top)}px`, left: `${left}px` }
  }
  isOpen.value = true
}
const close = () => { isOpen.value = false }

const toggleOne = (opt) => {
  const next = new Set(checked.value)
  next.has(opt) ? next.delete(opt) : next.add(opt)
  checked.value = next
}
// Select-all acts on the visible (searched) subset, like Excel
const toggleAll = () => {
  const next = new Set(checked.value)
  if (allVisibleChecked.value) visibleOptions.value.forEach(o => next.delete(o))
  else visibleOptions.value.forEach(o => next.add(o))
  checked.value = next
}

const apply = () => {
  // Everything checked = no constraint; emit [] so no orphaned params linger
  const values = checked.value.size >= props.options.length ? [] : [...checked.value]
  emit('apply', props.column, values)
  close()
}
const clear = () => {
  emit('apply', props.column, [])
  close()
}

// Options can refresh after a mapping save — drop checked values that no
// longer exist so a stale selection can't orphan the filter.
watch(() => props.options, (opts) => {
  const valid = new Set(opts)
  checked.value = new Set([...checked.value].filter(v => valid.has(v)))
})
</script>
