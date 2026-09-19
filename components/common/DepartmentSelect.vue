<template>
  <div ref="root" class="relative">
    <button ref="trigger" type="button" @click="toggle"
      class="w-full h-[44px] rounded-lg px-3 border flex items-center gap-3 text-left focus:outline-none focus:border-[#00896F]"
      :class="dark ? 'bg-transparent border-white/20 text-white' : 'bg-white border-[#04C18F] text-[#013E32]'">
      <svg class="w-4 h-4 shrink-0" :class="dark ? 'text-[#7DF5D4]' : 'text-[#00896F]'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>
      <span class="flex-1 text-sm truncate" :class="modelValue ? '' : (dark ? 'text-white/40' : 'text-gray-400')">{{ modelValue ? departmentLabel(modelValue, lang) : placeholder }}</span>
      <svg class="w-4 h-4 shrink-0 transition-transform" :class="[open ? 'rotate-180' : '', dark ? 'text-white/50' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </button>

    <Teleport to="body">
      <div v-if="open" ref="panel" class="fixed z-[10000] rounded-lg border shadow-xl overflow-hidden"
        :style="panelStyle" :class="dark ? 'bg-[#003b31] border-white/15 text-white' : 'bg-white border-gray-200 text-[#013E32]'">
        <div class="p-2 border-b" :class="dark ? 'border-white/10' : 'border-gray-100'">
          <input ref="searchInput" v-model="query" type="text" :placeholder="lang === 'ar' ? 'ابحث عن قسم' : 'Search department'"
            class="w-full h-9 rounded-md px-3 text-sm border focus:outline-none focus:border-[#00896F]"
            :class="dark ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-200 text-black'"
            @keydown.esc="open = false" @keydown.enter.prevent="pick(filtered[0]?.key ?? 'other')" />
        </div>
        <ul class="max-h-[220px] overflow-y-auto py-1">
          <li v-for="d in filtered" :key="d.key" @click="pick(d.key)"
            class="px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
            :class="[d.key === modelValue ? (dark ? 'bg-white/10' : 'bg-[#E4FFF6]') : '', dark ? 'hover:bg-white/10' : 'hover:bg-[#E4FFF6]']">
            {{ lang === 'ar' ? d.ar : d.en }}
            <svg v-if="d.key === modelValue" class="w-4 h-4 text-[#00896F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </li>
          <li v-if="!filtered.length" @click="pick('other')" class="px-3 py-2 text-sm cursor-pointer" :class="dark ? 'hover:bg-white/10' : 'hover:bg-[#E4FFF6]'">
            {{ lang === 'ar' ? 'لا نتائج — استخدم "أخرى"' : 'No match — use "Other"' }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  lang: { type: String, default: 'en' },
  dark: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const { departments, departmentLabel } = useDepartments()
const root = ref(null)
const trigger = ref(null)
const panel = ref(null)
const searchInput = ref(null)
const open = ref(false)
const query = ref('')
const panelStyle = ref({})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return departments
  return departments.filter((d) => d.en.toLowerCase().includes(q) || d.ar.includes(q))
})

const place = () => {
  const rect = trigger.value?.getBoundingClientRect()
  if (!rect) return
  const below = window.innerHeight - rect.bottom
  const height = 300
  const top = below >= height || below >= rect.top ? rect.bottom + 4 : Math.max(rect.top - height - 4, 8)
  panelStyle.value = { top: `${top}px`, left: `${rect.left}px`, width: `${rect.width}px` }
}

const toggle = async () => {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    place()
    await nextTick()
    searchInput.value?.focus()
  }
}
const pick = (key) => {
  emit('update:modelValue', key)
  open.value = false
}
const onOutside = (e) => {
  if (root.value?.contains(e.target) || panel.value?.contains(e.target)) return
  open.value = false
}
const onMove = () => { if (open.value) place() }

onMounted(() => {
  document.addEventListener('mousedown', onOutside)
  window.addEventListener('resize', onMove)
  window.addEventListener('scroll', onMove, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onOutside)
  window.removeEventListener('resize', onMove)
  window.removeEventListener('scroll', onMove, true)
})
</script>
