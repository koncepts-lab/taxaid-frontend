<template>
  <div class="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 border-t mt-2"
    :class="dark ? 'border-white/10' : 'border-gray-100'">
    <span class="text-xs md:text-sm text-center md:text-left" :class="dark ? 'text-white/60' : 'text-gray-500'">
      Showing {{ pageStart }}–{{ pageEnd }} of {{ meta.total }} results
    </span>

    <div class="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
      <button @click="goToPage(meta.current_page - 1)"
        :disabled="meta.current_page <= 1 || loading"
        class="px-2 md:px-3 py-1 md:py-1.5 rounded-lg border text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        :class="dark ? 'border-white/15 text-white/80 bg-transparent hover:bg-white/10' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'">
        Previous
      </button>

      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === '...'"
          class="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm select-none"
          :class="dark ? 'text-white/40' : 'text-gray-400'">
          &hellip;
        </span>
        <button v-else
          @click="goToPage(p)"
          :class="p === meta.current_page
            ? 'bg-[#00896F] text-white border-[#00896F]'
            : (dark ? 'bg-transparent text-white/80 border-white/15 hover:bg-white/10' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')"
          class="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border text-xs md:text-sm font-medium transition-all">
          {{ p }}
        </button>
      </template>

      <button @click="goToPage(meta.current_page + 1)"
        :disabled="meta.current_page >= meta.last_page || loading"
        class="px-2 md:px-3 py-1 md:py-1.5 rounded-lg border text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        :class="dark ? 'border-white/15 text-white/80 bg-transparent hover:bg-white/10' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'">
        Next
      </button>

      <div class="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto justify-center md:justify-start">
        <span class="text-xs md:text-sm whitespace-nowrap" :class="dark ? 'text-white/60' : 'text-gray-500'">Rows per page:</span>
        <select v-model="localPerPage" @change="$emit('per-page-change', localPerPage)"
          class="border rounded-lg px-2 py-1 md:py-1.5 text-xs md:text-sm focus:ring-1 focus:ring-[#00896F] outline-none appearance-none"
          :class="dark ? 'border-white/15 bg-black/40 text-white' : 'border-gray-200 bg-white text-gray-700'">
          <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
// Common pagination footer — same look and page math as the trial-balance
// mapping pagination (data-source), extracted for reuse across tables.
// meta = Laravel paginator shape: { current_page, per_page, total, last_page }
import { ref, computed, watch } from 'vue'

const props = defineProps({
  meta: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  perPageOptions: { type: Array, default: () => [10, 20, 30] },
  dark: { type: Boolean, default: false },
})

const emit = defineEmits(['page-change', 'per-page-change'])

const localPerPage = ref(props.meta?.per_page ?? props.perPageOptions[0])
watch(() => props.meta?.per_page, (v) => { if (v) localPerPage.value = v })

const pageStart = computed(() =>
  props.meta.total === 0 ? 0 : (props.meta.current_page - 1) * props.meta.per_page + 1
)
const pageEnd = computed(() =>
  Math.min(props.meta.current_page * props.meta.per_page, props.meta.total)
)

// Ellipsis pagination:
// Always include page 1, last page, and cur-1/cur/cur+1.
// Fill a gap of exactly 1 missing page; use '...' for gaps > 2.
const visiblePages = computed(() => {
  const total = props.meta.last_page
  const cur   = props.meta.current_page
  if (total <= 1) return [1]

  const include = new Set([1, total])
  for (let p = Math.max(1, cur - 1); p <= Math.min(total, cur + 1); p++) include.add(p)

  const sorted = [...include].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const gap = sorted[i] - sorted[i - 1]
      if (gap === 2)    result.push(sorted[i - 1] + 1)
      else if (gap > 2) result.push('...')
    }
    result.push(sorted[i])
  }
  return result
})

const goToPage = (page) => {
  if (typeof page !== 'number') return
  if (page < 1 || page > props.meta.last_page || page === props.meta.current_page) return
  emit('page-change', page)
}
</script>
