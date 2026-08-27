<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
  currentLang: { type: String, default: 'en' },
  title: { type: String, default: 'Data Variance' },
  confirming: { type: Boolean, default: false },
  // { added, changed, removed }
  summary: { type: Object, default: () => ({ added: 0, changed: 0, removed: 0 }) },
  // [{ type: 'added'|'changed'|'removed', invoiceNumber, customer, amountFrom, amountTo, statusFrom, statusTo }]
  changes: { type: Array, default: () => [] },
  // non-fatal shape warnings (e.g. non-numeric cells) — informational, doesn't block confirm
  warnings: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'confirm']);

const close = () => emit('close');
const confirm = () => emit('confirm');

const totalDiff = computed(() => props.summary.changed);

// Budget rows carry `change`/`field`/`current_value`/`new_value`; AR/AP rows carry `type`/`invoiceNumber`/flat fields.
const isBudgetShape = computed(() => props.changes.length > 0 && props.changes[0].change !== undefined);

// Only the keys that actually differ (or every key, for added/removed rows where one side is '-').
const diffEntries = (row) => {
  const cur = row.current_value;
  const nw = row.new_value;
  if (cur === '-' || nw === '-') {
    const source = cur === '-' ? nw : cur;
    return Object.keys(source ?? {}).map(key => ({ key, from: cur === '-' ? null : source[key], to: nw === '-' ? null : source[key] }));
  }
  const keys = new Set([...Object.keys(cur ?? {}), ...Object.keys(nw ?? {})]);
  return [...keys]
    .filter(key => String(cur?.[key]) !== String(nw?.[key]))
    .map(key => ({ key, from: cur?.[key] ?? null, to: nw?.[key] ?? null }));
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen"
          class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="close">

        <div class="w-full max-w-4xl transition-all duration-300 shadow-2xl rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col"
            :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

          <div class="flex justify-between items-start mb-6 p-6 pb-0">
            <div>
              <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ title }}</h2>
              <p class="text-[15px] font-medium mt-1" :class="isDark ? 'text-white/80' : 'text-gray-800'">Review before saving</p>
              <p class="text-[14px] mt-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">Differences found between your uploaded file and the current data</p>
            </div>
            <button @click="close" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

      <div class="px-6 flex-1 overflow-y-auto">
        <div v-if="warnings.length" class="bg-[#FFF8E6] border border-[#FEEFC3] rounded-lg p-3 mb-4">
          <p class="text-[13px] text-[#B45309] font-bold mb-1">{{ warnings.length }} data warning{{ warnings.length === 1 ? '' : 's' }} — review before confirming:</p>
          <ul class="text-[12px] text-[#B45309] list-disc list-inside space-y-0.5">
            <li v-for="(w, idx) in warnings" :key="idx">{{ w }}</li>
          </ul>
        </div>

        <div class="bg-[#FFF8E6] border border-[#FEEFC3] rounded-lg p-3 flex items-start gap-2 mb-4">
          <svg class="text-[#D97706] mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p class="text-[13px] text-[#B45309]">
            <span class="font-bold">{{ totalDiff }} difference{{ totalDiff === 1 ? '' : 's' }} found.</span> Confirm to save these changes.
          </p>
        </div>

        <div class="flex gap-3 mb-4">
          <span v-if="summary.changed" class="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-[13px] font-medium rounded-full">{{ summary.changed }} Changed</span>
          <span v-if="summary.added" class="px-3 py-1 bg-[#D1FAE5] text-[#059669] text-[13px] font-medium rounded-full">{{ summary.added }} Added</span>
          <span v-if="summary.removed" class="px-3 py-1 bg-[#FECACA] text-[#B91C1C] text-[13px] font-medium rounded-full">{{ summary.removed }} Removed</span>
        </div>

        <div v-if="changes.length === 0" class="text-center py-10 text-[14px]" :class="isDark ? 'text-white/50' : 'text-gray-500'">
          No differences — nothing will change.
        </div>

        <div v-else-if="isBudgetShape" class="rounded-lg overflow-hidden border border-gray-200 mb-6" :class="isDark ? 'border-white/10' : ''">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896A] text-white">
                <th class="px-4 py-3 text-[13px] font-medium">Field</th>
                <th class="px-4 py-3 text-[13px] font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in changes" :key="idx"
                  :class="{
                    'bg-[#FEF9C3]': row.change === 'Changed',
                    'bg-[#D1FAE5]': row.change === 'Added',
                    'bg-[#FECACA]': row.change === 'Removed',
                  }">
                <td class="px-4 py-4 text-[13px] font-medium border-b border-black/5 align-top text-gray-900">{{ row.field }}</td>
                <td class="px-4 py-4 text-[13px] border-b border-black/5 align-top text-gray-800">
                  <div v-for="entry in diffEntries(row)" :key="entry.key" class="mb-1 last:mb-0">
                    <span class="text-gray-500">{{ entry.key }}:</span>
                    <span v-if="entry.from !== null" class="text-gray-600 ml-1">{{ entry.from }}</span>
                    <span v-if="entry.from !== null && entry.to !== null" class="mx-1">→</span>
                    <span v-if="entry.to !== null" class="text-gray-900 font-medium">{{ entry.to }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="rounded-lg overflow-hidden border border-gray-200 mb-6" :class="isDark ? 'border-white/10' : ''">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896A] text-white">
                <th class="px-4 py-3 text-[13px] font-medium">Invoice #</th>
                <th class="px-4 py-3 text-[13px] font-medium">Customer</th>
                <th class="px-4 py-3 text-[13px] font-medium text-center">Amount</th>
                <th class="px-4 py-3 text-[13px] font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in changes" :key="idx"
                  :class="{
                    'bg-[#FEF9C3]': row.type === 'changed',
                    'bg-[#D1FAE5]': row.type === 'added',
                    'bg-[#FECACA]': row.type === 'removed',
                  }">
                <td class="px-4 py-4 text-[13px] font-medium border-b border-black/5 align-top text-gray-900">{{ row.invoiceNumber }}</td>
                <td class="px-4 py-4 text-[13px] border-b border-black/5 align-top text-gray-800">{{ row.customer }}</td>

                <td class="px-4 py-4 text-[13px] border-b border-black/5 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span v-if="row.amountFrom !== null" class="text-gray-600">{{ row.amountFrom }}</span>
                    <svg v-if="row.type === 'changed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span v-if="row.amountTo !== null" class="text-gray-900 font-medium">{{ row.amountTo }}</span>
                  </div>
                </td>

                <td class="px-4 py-4 text-[13px] border-b border-black/5 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span v-if="row.statusFrom" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-[12px] whitespace-nowrap">{{ row.statusFrom }}</span>
                    <svg v-if="row.type === 'changed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span v-if="row.statusTo" class="px-3 py-1 bg-[#A7F3D0] text-[#065F46] rounded-full text-[12px] whitespace-nowrap">{{ row.statusTo }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-[13px]" :class="isDark ? 'text-white/60' : 'text-gray-600'">Once confirmed, this action cannot be undone.</p>
      </div>

      <div class="p-6 border-t flex justify-end gap-3 mt-2" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <button @click="close" :disabled="confirming" class="px-5 py-2.5 rounded-lg border text-[14px] font-medium transition-colors disabled:opacity-50"
                :class="isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
          Cancel
        </button>
        <button @click="confirm" :disabled="confirming" class="px-5 py-2.5 bg-[#00896A] text-white rounded-lg text-[14px] font-medium hover:bg-[#007056] transition-colors disabled:opacity-50">
          {{ confirming ? 'Saving...' : 'Confirm & Save' }}
        </button>
      </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
