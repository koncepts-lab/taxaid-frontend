<template>
  <!-- Inline mode: just the wheel columns, for embedding inside another modal. -->
  <div v-if="inline" class="flex flex-col items-center gap-1">
    <div class="flex justify-center gap-2">
      <button class="wheel-arrow" @click="stepColumn('hour', -1)">▲</button>
      <button class="wheel-arrow" @click="stepColumn('minute', -1)">▲</button>
      <button v-if="!is24Hour" class="wheel-arrow" @click="stepColumn('ampm', -1)">▲</button>
    </div>
    <div class="relative flex justify-center gap-2">
      <div ref="hourCol" class="wheel-col" @scroll="onScroll('hourCol', hourOptions, onHourPick)">
        <div class="wheel-pad"></div>
        <div v-for="h in hourOptions" :key="h" @click="pickHour(h)"
             class="wheel-item" :class="{ 'wheel-item-active': h === displayHour }">
          {{ String(h).padStart(2, '0') }}
        </div>
        <div class="wheel-pad"></div>
      </div>
      <div ref="minCol" class="wheel-col" @scroll="onScroll('minCol', minuteOptions, onMinutePick)">
        <div class="wheel-pad"></div>
        <div v-for="m in minuteOptions" :key="m" @click="pickMinute(m)"
             class="wheel-item" :class="{ 'wheel-item-active': m === parts.m }">
          {{ String(m).padStart(2, '0') }}
        </div>
        <div class="wheel-pad"></div>
      </div>
      <div v-if="!is24Hour" ref="ampmCol" class="wheel-col" @scroll="onScroll('ampmCol', ['AM','PM'], onAmPmPick)">
        <div class="wheel-pad"></div>
        <div v-for="p in ['AM','PM']" :key="p" @click="pickAmPm(p)"
             class="wheel-item" :class="{ 'wheel-item-active': p === ampm }">
          {{ p }}
        </div>
        <div class="wheel-pad"></div>
      </div>
      <div class="wheel-highlight"></div>
    </div>
    <div class="flex justify-center gap-2">
      <button class="wheel-arrow" @click="stepColumn('hour', 1)">▼</button>
      <button class="wheel-arrow" @click="stepColumn('minute', 1)">▼</button>
      <button v-if="!is24Hour" class="wheel-arrow" @click="stepColumn('ampm', 1)">▼</button>
    </div>
  </div>

  <!-- Standalone mode: trigger + its own centered modal. -->
  <div v-else class="inline-block">
    <div @click="open = true"
         class="px-3 py-2 rounded-[8px] border border-[#04C18F33] bg-white flex items-center gap-2 cursor-pointer text-[14px] min-w-[110px]">
      <span>{{ label }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 pointer-events-none ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="open = false">
        <div class="bg-white rounded-2xl w-full max-w-xs shadow-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[15px] font-medium text-gray-900">Select Time</h3>
            <button @click="open = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div class="flex justify-center gap-2 mb-1">
            <button class="wheel-arrow" @click="stepColumn('hour', -1)">▲</button>
            <button class="wheel-arrow" @click="stepColumn('minute', -1)">▲</button>
            <button v-if="!is24Hour" class="wheel-arrow" @click="stepColumn('ampm', -1)">▲</button>
          </div>
          <div class="relative flex justify-center gap-2">
            <div ref="hourCol" class="wheel-col" @scroll="onScroll('hourCol', hourOptions, onHourPick)">
              <div class="wheel-pad"></div>
              <div v-for="h in hourOptions" :key="h" @click="pickHour(h)"
                   class="wheel-item" :class="{ 'wheel-item-active': h === displayHour }">
                {{ String(h).padStart(2, '0') }}
              </div>
              <div class="wheel-pad"></div>
            </div>
            <div ref="minCol" class="wheel-col" @scroll="onScroll('minCol', minuteOptions, onMinutePick)">
              <div class="wheel-pad"></div>
              <div v-for="m in minuteOptions" :key="m" @click="pickMinute(m)"
                   class="wheel-item" :class="{ 'wheel-item-active': m === parts.m }">
                {{ String(m).padStart(2, '0') }}
              </div>
              <div class="wheel-pad"></div>
            </div>
            <div v-if="!is24Hour" ref="ampmCol" class="wheel-col" @scroll="onScroll('ampmCol', ['AM','PM'], onAmPmPick)">
              <div class="wheel-pad"></div>
              <div v-for="p in ['AM','PM']" :key="p" @click="pickAmPm(p)"
                   class="wheel-item" :class="{ 'wheel-item-active': p === ampm }">
                {{ p }}
              </div>
              <div class="wheel-pad"></div>
            </div>
            <div class="wheel-highlight"></div>
          </div>
          <div class="flex justify-center gap-2 mt-1">
            <button class="wheel-arrow" @click="stepColumn('hour', 1)">▼</button>
            <button class="wheel-arrow" @click="stepColumn('minute', 1)">▼</button>
            <button v-if="!is24Hour" class="wheel-arrow" @click="stepColumn('ampm', 1)">▼</button>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="open = false" class="text-[13px] text-white bg-[#00896F] hover:bg-[#00705a] rounded-md px-4 py-1.5">Done</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '10:00' },
  is24Hour: { type: Boolean, default: true },
  inline: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const hourCol = ref(null)
const minCol = ref(null)
const ampmCol = ref(null)

const parts = computed(() => {
  const [h, m] = (props.modelValue ?? '10:00').split(':').map(Number)
  return { h24: h, m }
})
const ampm = computed(() => (parts.value.h24 < 12 ? 'AM' : 'PM'))
const displayHour = computed(() => {
  if (props.is24Hour) return parts.value.h24
  const h = parts.value.h24 % 12
  return h === 0 ? 12 : h
})
const hourOptions = computed(() => props.is24Hour ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i + 1))
const minuteOptions = Array.from({ length: 60 }, (_, i) => i)

const label = computed(() => {
  const hh = String(parts.value.h24).padStart(2, '0')
  const mm = String(parts.value.m).padStart(2, '0')
  return props.is24Hour ? `${hh}:${mm}` : `${String(displayHour.value).padStart(2, '0')}:${mm} ${ampm.value}`
})

function to24(h12, ap) {
  const h = Number(h12) % 12
  return ap === 'PM' ? h + 12 : h
}
function emitTime(h24, m) {
  emit('update:modelValue', `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
}

function pickHour(h) {
  const newH24 = props.is24Hour ? h : to24(h, ampm.value)
  emitTime(newH24, parts.value.m)
}
function pickMinute(m) { emitTime(parts.value.h24, m) }
function pickAmPm(p) { emitTime(to24(displayHour.value, p), parts.value.m) }

function onHourPick(h) { pickHour(h) }
function onMinutePick(m) { pickMinute(m) }
function onAmPmPick(p) { pickAmPm(p) }

/** Click-to-step fallback for when mouse-wheel scroll doesn't work (e.g. inside a modal/trackpad quirk). */
function stepColumn(kind, dir) {
  if (kind === 'hour') {
    const idx = hourOptions.value.indexOf(displayHour.value)
    const newIdx = Math.min(hourOptions.value.length - 1, Math.max(0, idx + dir))
    pickHour(hourOptions.value[newIdx])
    nextTick(() => { if (hourCol.value) hourCol.value.scrollTop = newIdx * 36 })
  } else if (kind === 'minute') {
    const newIdx = Math.min(59, Math.max(0, parts.value.m + dir))
    pickMinute(newIdx)
    nextTick(() => { if (minCol.value) minCol.value.scrollTop = newIdx * 36 })
  } else if (kind === 'ampm') {
    const newAmpm = ampm.value === 'AM' ? 'PM' : 'AM'
    pickAmPm(newAmpm)
    nextTick(() => { if (ampmCol.value) ampmCol.value.scrollTop = (newAmpm === 'PM' ? 1 : 0) * 36 })
  }
}

let scrollTimers = {}
function onScroll(refName, options, cb) {
  clearTimeout(scrollTimers[refName])
  scrollTimers[refName] = setTimeout(() => {
    const el = { hourCol, minCol, ampmCol }[refName].value
    if (!el) return
    const idx = Math.round(el.scrollTop / 36)
    if (options[idx] !== undefined) cb(options[idx])
  }, 120)
}

function scrollToSelected() {
  nextTick(() => {
    if (hourCol.value) hourCol.value.scrollTop = hourOptions.value.indexOf(displayHour.value) * 36
    if (minCol.value) minCol.value.scrollTop = parts.value.m * 36
    if (ampmCol.value) ampmCol.value.scrollTop = (ampm.value === 'PM' ? 1 : 0) * 36
  })
}
watch(open, (v) => { if (v) scrollToSelected() })
onMounted(() => { if (props.inline) scrollToSelected() })
</script>

<style scoped>
.wheel-col {
  height: 144px;
  width: 56px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  text-align: center;
  scrollbar-width: none;
}
.wheel-col::-webkit-scrollbar { display: none; }
.wheel-pad { height: 54px; scroll-snap-align: none; }
.wheel-item {
  height: 36px;
  line-height: 36px;
  scroll-snap-align: center;
  font-size: 14px;
  color: #99a1af;
  cursor: pointer;
}
.wheel-item-active {
  color: #00896F;
  font-weight: 600;
  font-size: 16px;
}
.wheel-arrow {
  width: 56px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #99a1af;
  font-size: 10px;
  cursor: pointer;
}
.wheel-arrow:hover { color: #00896F; }
.wheel-highlight {
  position: absolute;
  left: 28px;
  right: 28px;
  top: 54px;
  height: 36px;
  border-top: 1px solid #04C18F55;
  border-bottom: 1px solid #04C18F55;
  pointer-events: none;
}
</style>
