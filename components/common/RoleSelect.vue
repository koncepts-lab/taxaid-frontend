<template>
  <div v-if="readonly" class="w-full min-h-[56px] flex items-center gap-3 py-1">
    <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="dark ? 'bg-white/10 text-[#7DF5D4]' : 'bg-[#E4FFF6] text-[#00896F]'">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="roleIcon(modelValue)"></svg>
    </span>
    <span class="min-w-0 flex-1">
      <span class="block text-sm font-medium truncate" :class="dark ? 'text-white' : 'text-[#013E32]'">{{ roleLabel(modelValue, lang) }}</span>
      <span class="block text-[12px] truncate" :class="dark ? 'text-white/50' : 'text-gray-500'">{{ roleDescription(modelValue, lang) }}</span>
    </span>
  </div>
  <div v-else ref="root" class="relative">
    <button ref="trigger" type="button" :disabled="disabled" @click="toggle" @keydown="onKey"
      class="w-full h-[56px] rounded-lg px-3 border flex items-center gap-3 text-left focus:outline-none focus:border-[#00896F] disabled:cursor-not-allowed"
      :class="dark ? (disabled ? 'bg-white/5 border-white/15 text-white' : 'bg-transparent border-white/20 text-white') : (disabled ? 'bg-[#F3FDFA] border-[#A2E8D6] text-[#013E32]' : 'bg-white border-[#04C18F] text-[#013E32]')">
      <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="dark ? 'bg-white/10 text-[#7DF5D4]' : 'bg-[#E4FFF6] text-[#00896F]'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="roleIcon(modelValue)"></svg>
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-sm font-medium truncate">{{ roleLabel(modelValue, lang) || placeholder }}</span>
        <span class="block text-[12px] truncate" :class="dark ? 'text-white/50' : 'text-gray-500'">{{ roleDescription(modelValue, lang) }}</span>
      </span>
      <svg class="w-4 h-4 shrink-0 transition-transform" :class="[open ? 'rotate-180' : '', dark ? 'text-white/50' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </button>

    <Teleport to="body">
    <ul v-if="open" ref="panel" role="listbox" :style="panelStyle" class="fixed z-[10000] max-h-[280px] overflow-y-auto rounded-lg border shadow-xl py-1"
      :class="dark ? 'bg-[#003b31] border-white/15' : 'bg-white border-gray-200'">
      <li v-for="(role, i) in options" :key="role" role="option" :aria-selected="role === modelValue"
        @click="select(role)" @mouseenter="active = i"
        class="px-3 py-2 flex items-center gap-3 cursor-pointer"
        :class="[i === active ? (dark ? 'bg-white/10' : 'bg-[#E4FFF6]') : '', dark ? 'text-white' : 'text-[#013E32]']">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="dark ? 'bg-white/10 text-[#7DF5D4]' : 'bg-[#E4FFF6] text-[#00896F]'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="roleIcon(role)"></svg>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-medium truncate">{{ roleLabel(role, lang) }}</span>
          <span class="block text-[12px] truncate" :class="dark ? 'text-white/50' : 'text-gray-500'">{{ roleDescription(role, lang) }}</span>
        </span>
        <svg v-if="role === modelValue" class="w-4 h-4 text-[#00896F] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </li>
    </ul>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  lang: { type: String, default: 'en' },
  dark: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
})
const readonly = computed(() => props.disabled || props.options.length <= 1)
const emit = defineEmits(['update:modelValue'])

const { roleLabel, roleDescription, roleIcon } = useRoleLabel()
const root = ref(null)
const trigger = ref(null)
const panel = ref(null)
const panelStyle = ref({})
const open = ref(false)
const active = ref(0)

const place = () => {
  const rect = trigger.value?.getBoundingClientRect()
  if (!rect) return
  const height = Math.min(props.options.length * 56 + 8, 280)
  const below = window.innerHeight - rect.bottom
  const top = below >= height + 8 || below >= rect.top ? rect.bottom + 4 : Math.max(rect.top - height - 4, 8)
  panelStyle.value = { top: `${top}px`, left: `${rect.left}px`, width: `${rect.width}px` }
}
const onMove = () => { if (open.value) place() }

const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) place()
  if (open.value) active.value = Math.max(props.options.indexOf(props.modelValue), 0)
}
const select = (role) => {
  emit('update:modelValue', role)
  open.value = false
}
const onKey = (e) => {
  if (props.disabled) return
  if (e.key === 'Escape') { open.value = false; return }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) { toggle(); return }
    const n = props.options.length
    active.value = (active.value + (e.key === 'ArrowDown' ? 1 : n - 1)) % n
  } else if ((e.key === 'Enter' || e.key === ' ') && open.value) {
    e.preventDefault()
    select(props.options[active.value])
  }
}
const onOutside = (e) => {
  if (root.value?.contains(e.target) || panel.value?.contains(e.target)) return
  open.value = false
}

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
