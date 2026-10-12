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
    <div v-if="isOpen" ref="panelRef" :style="panelStyle"
      class="fixed z-[9999] w-64 max-h-[380px] flex flex-col rounded-xl border shadow-2xl overflow-hidden text-sm"
      :class="isDark ? 'bg-[#002E26] border-[#03D8B0]/20 text-white' : 'bg-white border-gray-200 text-gray-800'"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Search -->
      <div class="p-2 border-b flex-shrink-0" :class="isDark ? 'border-[#03D8B0]/15' : 'border-gray-100'">
        <input v-model="search" type="text"
          :placeholder="currentLang === 'ar' ? 'بحث...' : 'Search...'"
          class="w-full px-3 py-1.5 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-[#00B794]"
          :class="isDark ? 'bg-[#00211b] border-[#03D8B0]/20 text-white placeholder-white/40' : 'bg-white border-gray-200'" />
      </div>

      <!-- Select all -->
      <label class="flex items-center gap-2 px-3 py-2 cursor-pointer border-b font-medium flex-shrink-0"
        :class="isDark ? 'border-[#03D8B0]/15 hover:bg-white/5' : 'border-gray-100 hover:bg-[#E0FCF6]'">
        <input type="checkbox" :checked="allVisibleChecked" :indeterminate="someVisibleChecked"
          @change="toggleAll" class="accent-[#00B794] w-4 h-4" />
        <span>{{ currentLang === 'ar' ? 'تحديد الكل' : 'Select All' }}</span>
        <span class="ms-auto text-xs opacity-50">{{ checked.size }}/{{ options.length }}</span>
      </label>

      <!-- Value checkboxes -->
      <div class="flex-1 overflow-y-auto py-1 min-h-[100px] max-h-52">
        <!-- Checked rows keep the hover tint so selections stay visible in long lists -->
        <label v-for="opt in visibleOptions" :key="opt"
          class="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
          :class="checked.has(opt)
            ? (isDark ? 'bg-[#00B794]/20 text-[#00FFBC] font-medium' : 'bg-[#E0FCF6] text-[#00655B] font-medium')
            : (isDark ? 'hover:bg-white/5 text-white/80' : 'hover:bg-[#E0FCF6]')">
          <input type="checkbox" :checked="checked.has(opt)" @change="toggleOne(opt)"
            class="accent-[#00B794] w-4 h-4 flex-shrink-0" />
          <span class="truncate" :class="opt === '(blank)' ? 'italic opacity-60' : ''">
            {{ opt === '(blank)' ? (currentLang === 'ar' ? '(فارغ)' : '(Blanks)') : format(opt) }}
          </span>
        </label>
        <p v-if="!visibleOptions.length" class="px-3 py-3 text-center text-xs opacity-50">
          {{ currentLang === 'ar' ? 'لا توجد نتائج' : 'No matches' }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 p-2 border-t flex-shrink-0" :class="isDark ? 'border-[#03D8B0]/15 bg-[#002E26]' : 'border-gray-100 bg-white'">
        <button @click="clear"
          class="flex-1 py-1.5 rounded-lg border text-sm font-medium transition-all active:scale-[0.98]"
          :class="isDark
            ? (canClear ? 'border-[#00B794] text-[#00FFBC] bg-[#00B794]/15 hover:bg-[#00B794]/25' : 'border-white/20 text-white/70 hover:bg-white/5')
            : (canClear ? 'border-[#00B794] text-[#00896F] bg-[#00B794]/10 hover:bg-[#00B794]/20' : 'border-gray-300 text-gray-700 hover:bg-gray-100')">
          {{ currentLang === 'ar' ? 'إعادة تعيين' : 'Reset' }}
        </button>
        <!-- Excel behavior: nothing checked = nothing to show — disable Apply
             instead of silently falling back to "no filter" -->
        <button @click="apply" :disabled="checked.size === 0"
          class="flex-1 py-1.5 rounded-lg bg-[#00B794] text-white text-sm font-medium hover:bg-[#00a385] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#00B794]">
          {{ currentLang === 'ar' ? 'تطبيق' : 'Apply' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  column:      { type: String, required: true },   // fs_code | main_group | sub_group | ledger_name
  options:     { type: Array,  default: () => [] },
  selected:    { type: Array,  default: () => [] }, // current applied filter ([] = all)
  isDark:      { type: Boolean, default: false },
  currentLang: { type: String, default: 'en' },
  format:      { type: Function, default: (v) => v }, // display-only transform, raw value still used for filtering
  onRefresh:   { type: Function, default: null },
})
const emit = defineEmits(['apply'])
const refreshing = ref(false)
const handleRefresh = async () => {
  if (!props.onRefresh || refreshing.value) return
  refreshing.value = true
  try { await props.onRefresh() } finally { refreshing.value = false }
}

const isOpen     = ref(false)
const search     = ref('')
const triggerRef = ref(null)
const panelRef   = ref(null)
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
    const availableBelow = window.innerHeight - r.bottom
    const top = availableBelow < 390 && r.top > 390
      ? Math.max(8, r.top - 390)
      : Math.min(r.bottom + 6, window.innerHeight - 390)
    panelStyle.value = { top: `${Math.max(8, top)}px`, left: `${left}px` }
  }
  isOpen.value = true
}
const close = () => { isOpen.value = false }

// Panel position is computed once at open time and doesn't track the trigger on scroll — close
// instead of drifting out of place. Ignore scrolls inside the panel itself (its own option list
// scrolls internally) so opening the list doesn't immediately close it.
const onScroll = (e) => { if (!panelRef.value?.contains(e.target)) close() }
watch(isOpen, (open) => {
  if (open) window.addEventListener('scroll', onScroll, true)
  else window.removeEventListener('scroll', onScroll, true)
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll, true))

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

const canClear = computed(() => {
  return active.value || checked.value.size < props.options.length
})

const apply = () => {
  // Everything checked = no constraint; emit [] so no orphaned params linger
  const values = checked.value.size >= props.options.length ? [] : [...checked.value]
  emit('apply', props.column, values)
  close()
}
const clear = () => {
  checked.value = new Set(props.options)
  search.value = ''
}

// Options can refresh after a mapping save — drop checked values that no
// longer exist so a stale selection can't orphan the filter.
watch(() => props.options, (opts) => {
  const valid = new Set(opts)
  checked.value = new Set([...checked.value].filter(v => valid.has(v)))
})
</script>
