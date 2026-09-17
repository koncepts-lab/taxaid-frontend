<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center p-4" @click.self="onCancel">
      <div class="w-full max-w-[95vw] lg:max-w-5xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        :class="isDark ? 'bg-[#0d0d0d] text-white' : 'bg-white text-black'">

        <div class="p-6 border-b flex items-center justify-between" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <h3 class="text-lg font-normal">
            {{ currentLang === 'ar' ? 'معاينة تخطيط ميزان المراجعة' : 'Trial Balance Mapping Preview' }}
          </h3>
          <button @click="onCancel" class="text-2xl leading-none opacity-60 hover:opacity-100">&times;</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 flex-1 min-h-0">
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

          <div v-if="loading" class="h-full flex flex-col">
            <div class="w-full flex-1 overflow-hidden rounded-xl border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
              <table class="w-full text-left text-sm">
                <thead class="bg-[#00896F] text-white">
                  <tr>
                    <th class="px-3 py-2">#</th>
                    <th class="px-3 py-2">FS Code</th>
                    <th class="px-3 py-2">Main Group</th>
                    <th class="px-3 py-2">Sub Group</th>
                    <th class="px-3 py-2">Ledger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="n in 16" :key="n" class="border-b animate-pulse" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                    <td class="px-3 py-3"><div class="h-3 w-4 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                    <td class="px-3 py-3"><div class="h-3 w-16 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                    <td class="px-3 py-3"><div class="h-3 w-28 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                    <td class="px-3 py-3"><div class="h-3 w-28 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                    <td class="px-3 py-3"><div class="h-3 w-32 rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <template v-else>
            <div v-if="hasVariance" class="p-4 rounded-xl border" :class="isDark ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-yellow-300 bg-yellow-50'">
              <p class="text-sm font-medium mb-2">
                {{ currentLang === 'ar' ? 'قيم مفقودة من قائمة التخطيط' : 'Values missing from the mapping list' }}
              </p>
              <p class="text-xs opacity-70 mb-2">
                {{ currentLang === 'ar' ? 'اطلب من المدير إضافتها أولاً عبر شاشة GL Master.' : 'Ask a manager to add these via the GL Master screen first.' }}
              </p>
              <div v-for="key in ['fs_code', 'main_group', 'sub_group']" :key="key">
                <p v-if="variance[key]?.length" class="text-xs mt-1">
                  <span class="font-medium">{{ labelFor(key) }}:</span> {{ variance[key].join(', ') }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs">
              <span class="opacity-60">
                {{ currentLang === 'ar' ? 'إجمالي الصفوف' : 'Total rows' }}: {{ displayRows.length }}
                <template v-if="!showAllRows">({{ currentLang === 'ar' ? 'قابلة للتخطيط فقط' : 'mappable only' }})</template>
              </span>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" v-model="showAllRows" class="accent-[#00896F]" />
                {{ currentLang === 'ar' ? 'إظهار كل الصفوف من الملف' : 'Show all rows read from file' }} ({{ rows.length }})
              </label>
            </div>

            <div class="w-full overflow-x-auto rounded-xl border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
              <table class="w-full text-left text-sm">
                <thead class="bg-[#00896F] text-white">
                  <tr>
                    <th class="px-3 py-2">#</th>
                    <th class="px-3 py-2">FS Code</th>
                    <th class="px-3 py-2">Main Group</th>
                    <th class="px-3 py-2">Sub Group</th>
                    <th class="px-3 py-2">Ledger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in pageRows" :key="idx" class="border-b"
                    :class="[isDark ? 'border-white/5' : 'border-gray-100', !row.mapped ? 'opacity-40' : '']">
                    <td class="px-3 py-2 opacity-60">{{ (page - 1) * effectivePerPage + idx + 1 }}</td>
                    <td class="px-3 py-2">{{ row.fs_code }}</td>
                    <td class="px-3 py-2">{{ row.main_group }}</td>
                    <td class="px-3 py-2">{{ row.sub_group }}</td>
                    <td class="px-3 py-2">{{ row.ledger_name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CommonPaginationBar :meta="paginationMeta" :perPageOptions="perPageOptions"
              @page-change="(p) => (page = p)" @per-page-change="(pp) => onPerPageChange(pp)" />
          </template>
        </div>

        <div class="p-6 border-t flex items-center justify-end gap-3" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <button @click="onCancel" :disabled="loading"
            class="px-6 py-2 rounded-xl border text-sm disabled:opacity-50" :class="isDark ? 'border-white/15' : 'border-gray-200'">
            {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
          </button>
          <button @click="onReverify" :disabled="loading"
            class="px-6 py-2 rounded-xl border text-sm disabled:opacity-50" :class="isDark ? 'border-white/15' : 'border-gray-200'">
            {{ currentLang === 'ar' ? 'إعادة التحقق' : 'Re-verify' }}
          </button>
          <button @click="onConfirm" :disabled="loading || hasVariance"
            class="px-8 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-xl text-sm disabled:opacity-50">
            {{ currentLang === 'ar' ? 'تأكيد' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isDark:      { type: Boolean, default: false },
  currentLang: { type: String,  default: 'en' },
  loading:     { type: Boolean, default: false },
  error:       { type: String,  default: null },
  variance:    { type: Object,  default: () => ({ fs_code: [], main_group: [], sub_group: [] }) },
  rows:        { type: Array,   default: () => [] },
  onConfirm:   { type: Function, required: true },
  onCancel:    { type: Function, required: true },
  onReverify:  { type: Function, required: true },
})

const page = ref(1)
const showAllRows = ref(false)
const perPageOptions = [40, 50, 100, 200, 'full']
const perPage = ref(50)

const hasVariance = computed(() =>
  (props.variance.fs_code?.length || 0) + (props.variance.main_group?.length || 0) + (props.variance.sub_group?.length || 0) > 0)

const displayRows = computed(() => showAllRows.value ? props.rows : props.rows.filter(r => r.mapped))
const effectivePerPage = computed(() => perPage.value === 'full' ? Math.max(displayRows.value.length, 1) : perPage.value)
const totalPages = computed(() => Math.max(1, Math.ceil(displayRows.value.length / effectivePerPage.value)))
const pageRows = computed(() => displayRows.value.slice((page.value - 1) * effectivePerPage.value, page.value * effectivePerPage.value))

const paginationMeta = computed(() => ({
  current_page: page.value,
  per_page: effectivePerPage.value,
  total: displayRows.value.length,
  last_page: totalPages.value,
}))

const onPerPageChange = (pp) => { perPage.value = pp; page.value = 1 }

const labelFor = (key) => ({ fs_code: 'FS Code', main_group: 'Main Group', sub_group: 'Sub Group' }[key])

watch(() => props.rows, () => { page.value = 1 })
watch(showAllRows, () => { page.value = 1 })
</script>
