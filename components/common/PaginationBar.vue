<template>
  <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 mt-2">
    <span class="text-sm text-gray-500">
      Showing {{ pageStart }}–{{ pageEnd }} of {{ meta.total }} results
    </span>

    <div class="flex items-center gap-1.5">
      <button @click="goToPage(meta.current_page - 1)"
        :disabled="meta.current_page <= 1 || loading"
        class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        Previous
      </button>

      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === '...'"
          class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none">
          &hellip;
        </span>
        <button v-else
          @click="goToPage(p)"
          :class="p === meta.current_page
            ? 'bg-[#00896F] text-white border-[#00896F]'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
          class="w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all">
          {{ p }}
        </button>
      </template>

      <button @click="goToPage(meta.current_page + 1)"
        :disabled="meta.current_page >= meta.last_page || loading"
        class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        Next
      </button>

      <span class="ml-3 text-sm text-gray-500 whitespace-nowrap">Rows per page:</span>
      <select v-model="localPerPage" @change="$emit('per-page-change', localPerPage)"
        class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-[#00896F] outline-none appearance-none">
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
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
