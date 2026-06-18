import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

export function usePagination<T>(source: Ref<T[]> | ComputedRef<T[]>, pageSize = 10) {
  const page = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(source.value.length / pageSize)))
  const startIdx   = computed(() => (page.value - 1) * pageSize)
  const paged      = computed(() => source.value.slice(startIdx.value, startIdx.value + pageSize))
  const from       = computed(() => source.value.length === 0 ? 0 : startIdx.value + 1)
  const to         = computed(() => Math.min(startIdx.value + pageSize, source.value.length))
  const total      = computed(() => source.value.length)

  // Reset to first page whenever the source list changes (e.g. search/filter)
  watch(source, () => { page.value = 1 })

  function next() { if (page.value < totalPages.value) page.value++ }
  function prev() { if (page.value > 1) page.value-- }

  return { page, totalPages, paged, from, to, total, next, prev }
}
