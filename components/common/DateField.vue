<template>
  <div ref="rootRef" class="relative">
    <div ref="fieldRef" :class="fieldClasses"
      class="w-full rounded-[10px] border flex items-center gap-2 px-3 transition-colors">
      <template v-if="range">
        <input :value="texts.from" @input="onInput('from', $event)" @blur="commit('from')" @keydown="onKeydown('from', $event)"
          type="text" inputmode="numeric" :maxlength="maxLength" autocomplete="off" dir="ltr" :disabled="disabled"
          :placeholder="placeholderFrom || defaultPlaceholder" :title="bad.from ? invalidHint : undefined"
          :class="inputClasses" class="flex-1 min-w-0 w-0 bg-transparent outline-none text-left tabular-nums" />
        <span class="shrink-0 opacity-50">–</span>
        <input :value="texts.to" @input="onInput('to', $event)" @blur="commit('to')" @keydown="onKeydown('to', $event)"
          type="text" inputmode="numeric" :maxlength="maxLength" autocomplete="off" dir="ltr" :disabled="disabled"
          :placeholder="placeholderTo || defaultPlaceholder" :title="bad.to ? invalidHint : undefined"
          :class="inputClasses" class="flex-1 min-w-0 w-0 bg-transparent outline-none text-left tabular-nums" />
      </template>
      <input v-else :value="texts.single" @input="onInput('single', $event)" @blur="commit('single')" @keydown="onKeydown('single', $event)"
        type="text" inputmode="numeric" :maxlength="maxLength" autocomplete="off" dir="ltr" :disabled="disabled"
        :placeholder="placeholder || defaultPlaceholder" :title="bad.single ? invalidHint : undefined"
        :class="inputClasses" class="flex-1 min-w-0 w-0 bg-transparent outline-none text-left tabular-nums" />

      <button ref="iconRef" type="button" :disabled="disabled" @click="toggle" @keydown.esc.stop.prevent="close"
        aria-haspopup="dialog" :aria-expanded="open" :aria-label="isAr ? 'فتح التقويم' : 'Open calendar'"
        class="shrink-0 cursor-pointer disabled:cursor-not-allowed outline-none">
        <svg class="w-5 h-5" :class="dk ? 'text-[#00FFBC]' : 'text-[#00896F]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <div v-if="open" ref="panelRef" :style="panelStyle" :dir="isAr ? 'rtl' : 'ltr'" role="dialog"
        @keydown.esc.stop.prevent="closeAndFocus"
        :class="panelClasses">
        <div v-if="month" class="w-[264px] select-none">
          <div class="flex items-center justify-between px-1 pb-2">
            <button type="button" @click="pickerYear--" :aria-label="isAr ? 'السنة السابقة' : 'Previous year'"
              class="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
              :class="dk ? 'text-white hover:bg-white/10' : 'text-[#013e32] hover:bg-[#E6FFF5]'">
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span class="text-sm font-semibold" :class="dk ? 'text-white' : 'text-[#013e32]'">{{ pickerYear }}</span>
            <button type="button" @click="pickerYear++" :disabled="!allowFuture && pickerYear >= currentYear" :aria-label="isAr ? 'السنة التالية' : 'Next year'"
              class="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              :class="dk ? 'text-white hover:bg-white/10' : 'text-[#013e32] hover:bg-[#E6FFF5]'">
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div class="grid grid-cols-3 gap-1.5">
            <button v-for="m in 12" :key="m" type="button" :disabled="monthDisabled(m)" @click="pickMonth(m)"
              class="h-10 rounded-[9px] text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              :class="monthClasses(m)">{{ monthLabel(m) }}</button>
          </div>
        </div>
        <VDatePicker v-else-if="range" v-model.range="rangeValue" :columns="columns" :is-dark="dk"
          :locale="isAr ? 'ar' : 'en'" color="primary" borderless transparent :max-date="maxDate"
          @update:model-value="onRange" />
        <VDatePicker v-else v-model="singleValue" :is-dark="dk"
          :locale="isAr ? 'ar' : 'en'" color="primary" borderless transparent :max-date="maxDate"
          @update:model-value="onSingle" />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// Date field you can type into (dd-mm-yyyy, auto-dashed) or pick from the calendar popup.
//   <CommonDateField v-model="date" />                                    single day
//   <CommonDateField range v-model:from="from" v-model:to="to" />         from / to range
//   <CommonDateField month v-model="month" />                             month + year (mm-yyyy, value yyyy-MM)
// format="iso" (default) emits yyyy-MM-dd; format="dmy" emits dd-MM-yyyy. Incoming values may be
// either format (or a Date). Optional: placeholder(-from/-to), disabled, allow-future, invalid, size="md|sm", dark.
// Nothing after today unless allow-future. An invalid typed date shows a red border and is not emitted.
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isAr = computed(() => currentLang.value === 'ar')

const props = defineProps({
  modelValue: { type: [String, Date], default: '' },
  from: { type: [String, Date], default: '' },
  to: { type: [String, Date], default: '' },
  range: { type: Boolean, default: false },
  month: { type: Boolean, default: false },
  format: { type: String, default: 'iso' },
  placeholder: { type: String, default: '' },
  placeholderFrom: { type: String, default: '' },
  placeholderTo: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  allowFuture: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  dark: { type: Boolean, default: undefined },
})
const emit = defineEmits(['update:modelValue', 'update:from', 'update:to'])

const dk = computed(() => props.dark ?? isDark.value)
const pad = (n) => String(n).padStart(2, '0')

const makeDate = (y, m, d) => {
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null
}

const parseDay = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const text = String(value ?? '').trim()
  if (!text) return null
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T\s])/.exec(text)
  if (match) return makeDate(Number(match[1]), Number(match[2]), Number(match[3]))
  match = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(text)
  return match ? makeDate(Number(match[3]), Number(match[2]), Number(match[1])) : null
}

const parseMonth = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), 1)
  const text = String(value ?? '').trim()
  if (!text) return null
  let match = /^(\d{4})-(\d{1,2})(?:$|-\d{1,2}|[T\s])/.exec(text)
  if (match) return makeDate(Number(match[1]), Number(match[2]), 1)
  match = /^(\d{1,2})[-/.](\d{4})$/.exec(text)
  return match ? makeDate(Number(match[2]), Number(match[1]), 1) : null
}

const parseAny = (value) => (props.month ? parseMonth(value) : parseDay(value))

const fmtText = (date) => (props.month
  ? `${pad(date.getMonth() + 1)}-${date.getFullYear()}`
  : `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`)

const outValue = (date) => {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  if (props.month) return props.format === 'dmy' ? `${m}-${y}` : `${y}-${m}`
  return props.format === 'dmy' ? `${pad(date.getDate())}-${m}-${y}` : `${y}-${m}-${pad(date.getDate())}`
}

const shown = (value) => {
  const date = parseAny(value)
  return date ? fmtText(date) : ''
}

const texts = reactive({ single: '', from: '', to: '' })
const bad = reactive({ single: false, from: false, to: false })

const syncTexts = () => {
  texts.single = shown(props.modelValue)
  texts.from = shown(props.from)
  texts.to = shown(props.to)
}
watch(() => [props.modelValue, props.from, props.to], syncTexts, { immediate: true })

const maxDate = ref(props.allowFuture ? undefined : orgTodayDate())
const refreshMax = () => { maxDate.value = props.allowFuture ? undefined : orgTodayDate() }
const maxLength = computed(() => (props.month ? 7 : 10))
const defaultPlaceholder = computed(() => (props.month ? 'mm-yyyy' : 'dd-mm-yyyy'))
const invalidHint = computed(() => {
  if (props.month) return isAr.value ? 'أدخل شهراً صحيحاً (شهر-سنة)' : 'Enter a valid month (mm-yyyy)'
  return isAr.value ? 'أدخل تاريخاً صحيحاً (يوم-شهر-سنة)' : 'Enter a valid date (dd-mm-yyyy)'
})

const startOfThisMonth = () => {
  const now = orgTodayDate()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

const inBounds = (key, date) => {
  if (!props.allowFuture) {
    if (props.month) {
      if (date > startOfThisMonth()) return false
    } else {
      const end = orgTodayDate()
      end.setHours(23, 59, 59, 999)
      if (date > end) return false
    }
  }
  if (!props.range) return true
  if (key === 'from') {
    const to = parseAny(props.to)
    return !to || date <= to
  }
  const from = parseAny(props.from)
  return !from || date >= from
}

const emitKey = (key, value) => {
  if (key === 'single') emit('update:modelValue', value)
  else emit(key === 'from' ? 'update:from' : 'update:to', value)
}

const commit = (key) => {
  const text = texts[key].trim()
  if (!text) {
    bad[key] = false
    emitKey(key, '')
    return
  }
  const date = parseAny(text)
  if (!date || !inBounds(key, date)) {
    bad[key] = true
    return
  }
  bad[key] = false
  texts[key] = fmtText(date)
  emitKey(key, outValue(date))
}

const onInput = (key, event) => {
  const raw = event.target.value
  let out
  if (props.month) {
    const iso = /^(\d{4})-(\d{2})/.exec(raw)
    if (iso) {
      out = `${iso[2]}-${iso[1]}`
    } else {
      const digits = raw.replace(/\D/g, '').slice(0, 6)
      out = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits
    }
  } else {
    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw)
    if (iso) {
      out = `${iso[3]}-${iso[2]}-${iso[1]}`
    } else {
      const digits = raw.replace(/\D/g, '').slice(0, 8)
      out = digits.length > 4
        ? `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
        : digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits
    }
  }
  texts[key] = out
  event.target.value = out
  bad[key] = false
  if (out.length === maxLength.value) commit(key)
}

const onKeydown = (key, event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    commit(key)
  } else if (event.key === 'ArrowDown' && event.altKey) {
    event.preventDefault()
    if (!open.value) toggle()
  } else if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    close()
  }
}

const singleValue = ref(null)
const rangeValue = ref(null)
const pickerYear = ref(orgTodayDate().getFullYear())
const currentYear = orgTodayDate().getFullYear()

const refreshPicker = () => {
  singleValue.value = parseAny(props.modelValue)
  const start = parseAny(props.from)
  const end = parseAny(props.to)
  rangeValue.value = start && end ? { start, end } : null
  pickerYear.value = (singleValue.value ?? orgTodayDate()).getFullYear()
}

const open = ref(false)
const columns = ref(1)
const rootRef = ref(null)
const fieldRef = ref(null)
const iconRef = ref(null)
const panelRef = ref(null)
const panelStyle = ref({})

const anyBad = computed(() => props.invalid || bad.single || bad.from || bad.to)

const fieldClasses = computed(() => [
  props.size === 'sm' ? 'h-[38px] text-[13px]' : 'h-[44px] text-[14px]',
  open.value
    ? 'border-[#00896F] ring-1 ring-[#00896F]'
    : anyBad.value
      ? 'border-red-500 focus-within:ring-1 focus-within:ring-red-500'
      : (dk.value ? 'border-[#03D8B0]/30' : 'border-[#04C18F]/40') + ' focus-within:border-[#00896F] focus-within:ring-1 focus-within:ring-[#00896F]',
  dk.value ? 'bg-[#001F1A] text-white' : 'bg-white text-[#013e32]',
  props.disabled ? 'opacity-50' : '',
])

const inputClasses = computed(() => (dk.value ? 'placeholder:text-white/40' : 'placeholder:text-gray-400'))

const panelClasses = computed(() => [
  'fixed z-[100000] border p-2 rounded-[14px]',
  dk.value
    ? 'bg-[#002E26] border-[#03D8B0]/30 shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
    : 'bg-white border-[#04C18F]/40 shadow-[0_12px_32px_rgba(1,62,50,0.14)]',
])

const monthLabel = (m) => new Date(2000, m - 1, 1)
  .toLocaleDateString(isAr.value ? 'ar-AE-u-nu-latn' : 'en-GB', { month: 'short' })

const monthDisabled = (m) => !props.allowFuture && new Date(pickerYear.value, m - 1, 1) > startOfThisMonth()

const monthClasses = (m) => {
  const selected = singleValue.value
    && singleValue.value.getFullYear() === pickerYear.value
    && singleValue.value.getMonth() === m - 1
  if (selected) return dk.value ? 'bg-[#00FFBC]/20 text-[#00FFBC] font-semibold' : 'bg-[#D6F5ED] text-[#013e32] font-semibold'
  return dk.value ? 'text-white hover:bg-white/10' : 'text-[#013e32] hover:bg-[#E6FFF5]'
}

const positionPanel = () => {
  const rect = fieldRef.value?.getBoundingClientRect()
  if (!rect) return
  const width = props.month ? 284 : props.range && columns.value === 2 ? 600 : 310
  const height = 350
  const spaceBelow = window.innerHeight - rect.bottom
  const openUp = spaceBelow < height && rect.top > spaceBelow
  const start = isAr.value ? rect.right - width : rect.left
  const left = Math.max(8, Math.min(start, window.innerWidth - width - 8))
  panelStyle.value = {
    left: `${left}px`,
    ...(openUp
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  }
}

const close = () => { open.value = false }
const closeAndFocus = () => {
  close()
  nextTick(() => iconRef.value?.focus())
}

const toggle = () => {
  if (open.value) return close()
  refreshMax()
  refreshPicker()
  columns.value = props.range && !props.month && window.innerWidth >= 720 ? 2 : 1
  positionPanel()
  open.value = true
}

const onSingle = (value) => {
  const date = parseAny(value)
  if (!date) return
  bad.single = false
  texts.single = fmtText(date)
  emit('update:modelValue', outValue(date))
  closeAndFocus()
}

const pickMonth = (m) => onSingle(new Date(pickerYear.value, m - 1, 1))

const onRange = (value) => {
  const start = parseAny(value?.start)
  const end = parseAny(value?.end)
  if (!start || !end) return
  bad.from = false
  bad.to = false
  texts.from = fmtText(start)
  texts.to = fmtText(end)
  emit('update:from', outValue(start))
  emit('update:to', outValue(end))
  closeAndFocus()
}

const onClickOutside = (e) => {
  const path = e.composedPath ? e.composedPath() : []
  if (path.includes(rootRef.value) || path.includes(panelRef.value)) return
  close()
}

const onScroll = (e) => {
  if (panelRef.value?.contains(e.target)) return
  close()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', close)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', close)
})
</script>
