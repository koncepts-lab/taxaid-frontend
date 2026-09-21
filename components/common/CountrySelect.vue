<template>
  <div ref="root" class="relative w-full" :class="variant === 'onboarding' ? 'max-w-[450px] z-20' : ''">
    <button type="button" :disabled="disabled" @click="toggle"
      :class="[triggerClass, disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer']"
      class="w-full flex items-center justify-between gap-3 text-left">
      <span class="flex items-center gap-3 min-w-0">
        <span class="truncate" :class="!modelValue ? placeholderClass : ''">{{ selectedName || placeholder }}</span>
      </span>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" class="shrink-0 transition-transform" :class="{ 'rotate-180': open }">
        <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>

    <div v-if="open" :class="listClass" class="absolute left-0 right-0 z-30">
      <input ref="searchInput" v-model="query" type="text" :placeholder="searchPlaceholder" autocomplete="off"
        :class="searchClass" class="w-full outline-none mb-2" />
      <div class="max-h-[280px] overflow-y-auto">
        <button v-for="c in filtered" :key="c.code" type="button" @click="select(c.code)"
          :class="[itemClass, c.code === modelValue ? activeClass : '']"
          class="w-full flex items-center gap-3 text-left">
          <span class="truncate">{{ c.name }}</span>
        </button>
        <p v-if="!filtered.length" :class="placeholderClass" class="px-3 py-3 text-sm">No country found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  disabled?: boolean
  variant?: 'onboarding' | 'light'
  placeholder?: string
  searchPlaceholder?: string
  locale?: string
  codes?: string[]
}>(), { modelValue: '', disabled: false, codes: () => [], variant: 'light', placeholder: 'Select country', searchPlaceholder: 'Search country…', locale: 'en' })

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const root = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')

const options = computed(() => countryOptions(props.locale).filter((c) => props.codes.includes(c.code)))
const selectedName = computed(() => countryName(props.modelValue, props.locale))
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? options.value.filter((c) => c.name.toLowerCase().includes(q)) : options.value
})

const onboarding = computed(() => props.variant === 'onboarding')
const triggerClass = computed(() => onboarding.value
  ? 'h-[50px] lg:h-[52px] px-6 lg:px-7 rounded-full bg-white/[0.03] border border-white/15 text-white text-[15px] lg:text-[16px] focus:border-[#04C18F] outline-none transition'
  : 'h-[40px] px-3 rounded-lg bg-white border border-[#04C18F] text-black text-sm focus:outline-none focus:border-[#00896F]')
const placeholderClass = computed(() => (onboarding.value ? 'text-white/40' : 'text-[#999]'))
const listClass = computed(() => onboarding.value
  ? 'top-[calc(100%+8px)] rounded-[20px] p-2 bg-[rgba(0,43,35,0.95)] border border-[rgba(4,193,143,0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl'
  : 'top-[calc(100%+6px)] rounded-lg p-2 bg-white border border-gray-200 shadow-lg')
const searchClass = computed(() => onboarding.value
  ? 'h-10 px-4 rounded-full bg-white/[0.05] border border-white/15 text-white text-sm placeholder-white/40 focus:border-[#04C18F]'
  : 'h-9 px-3 rounded-md border border-gray-200 text-sm text-black focus:border-[#00896F]')
const itemClass = computed(() => onboarding.value
  ? 'px-5 py-3 text-white text-[15px] rounded-xl hover:bg-white/5 transition'
  : 'px-3 py-2 text-sm text-black rounded-md hover:bg-[#E4FFF6]')
const activeClass = computed(() => (onboarding.value ? '!bg-[rgba(4,193,143,0.2)] !text-[#04C18F]' : 'bg-[#E4FFF6] text-[#00896F] font-medium'))

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function select(code: string) {
  emit('update:modelValue', code)
  open.value = false
}

watch(open, async (isOpen) => {
  if (isOpen) {
    query.value = ''
    await nextTick()
    searchInput.value?.focus()
  }
})

function onDocClick(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) open.value = false
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>
