<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100000] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="rounded-2xl mt-auto md:mt-0 h-[85vh] md:h-[75vh] max-h-[800px] w-[96vw] md:w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">

        <div class="shrink-0 px-4 md:px-6 py-4 flex justify-between items-start border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div>
            <div class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ partyName }}</div>
            <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">Resolve this vendor's bills against the TB variance.</p>
          </div>
          <button @click="$emit('close')" class="transition-colors" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4" :class="isDark ? 'text-white' : ''">
          <div v-if="loading" class="space-y-2.5">
            <div v-for="n in 3" :key="n" class="h-10 rounded-lg animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100'"></div>
          </div>

          <table v-else class="w-full text-left border-separate border-spacing-0 min-w-[640px]">
            <thead>
              <tr class="text-white text-sm">
                <th class="sticky top-0 z-10 bg-[#058a64] py-2.5 px-3 font-medium rounded-tl-lg">Bill / Invoice No.</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-2.5 px-3 font-medium">Current Amount</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-2.5 px-3 font-medium">Adjustment</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-2.5 px-3 font-medium text-center">Mark Fully Paid</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-2.5 px-3 font-medium rounded-tr-lg text-center">Remove</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="rows.length === 0">
                <td colspan="5" class="py-6 px-3 text-center" :class="isDark ? 'text-white/50' : 'text-gray-500'">
                  No outstanding bills for this vendor. Use "Create Invoice" to add one.
                </td>
              </tr>
              <tr v-for="(row, i) in rows" :key="i" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                <td class="py-2 px-3">
                  <input v-if="row.isNew" type="text" v-model="row.invoice_number" placeholder="Invoice number"
                    class="w-full border rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-1"
                    :class="isDuplicateRow(i)
                      ? 'border-red-400 focus:ring-red-400 bg-red-500/10 text-red-500'
                      : (isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30 focus:ring-[#058a64]' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400 focus:ring-[#058a64]')" />
                  <span v-else :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ row.invoice_number || '—' }}</span>
                </td>
                <td class="py-2 px-3">
                  <input v-if="row.isNew" type="text" v-model="row.amount" placeholder="0.00" class="w-full border rounded-md py-1.5 px-2.5 text-right focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                  <span v-else :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ formatAmount(row.amount) }}</span>
                </td>
                <td class="py-2 px-3">
                  <input type="text" v-model="row.adjustment" :disabled="row.markPaid" :placeholder="row.markPaid ? String(row.amount) : '0.00'" class="w-full border-none rounded-md py-1.5 px-2.5 text-right focus:outline-none focus:ring-1 focus:ring-[#058a64] disabled:opacity-40" :class="isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'" />
                </td>
                <td class="py-2 px-3 text-center">
                  <input type="checkbox" v-model="row.markPaid" class="w-4 h-4 rounded text-[#058a64] focus:ring-[#058a64]" :class="isDark ? 'border-white/20 bg-[#002e26]' : 'border-gray-300 bg-white'" />
                </td>
                <td class="py-2 px-3 text-center">
                  <button @click="rows.splice(i, 1)" class="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>

          <button v-if="!loading" @click="addInvoiceRow" type="button" class="mt-3 bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Create Invoice
          </button>
          <p v-if="duplicateRowIndexes.size > 0" class="text-sm text-red-500 mt-2">
            Duplicate invoice numbers for this vendor — give each one a unique number before applying.
          </p>
        </div>

        <div class="shrink-0 px-4 md:px-6 py-4 border-t flex flex-wrap items-center gap-3" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'">
          <div class="flex-1 min-w-[180px] text-sm" :class="isDark ? 'text-white/70' : 'text-gray-600'">
            Needed: <span class="font-semibold">{{ code }} {{ formatAmount(needed) }}</span>
            &nbsp;·&nbsp;
            Entered: <span class="font-semibold">{{ code }} {{ formatAmount(totalEntered) }}</span>
          </div>
          <p v-if="errorMessage" class="text-sm text-red-500 w-full">{{ errorMessage }}</p>
          <button @click="$emit('close')" class="px-4 py-1.5 border rounded-lg font-medium text-sm transition-colors" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            Cancel
          </button>
          <button @click="apply" :disabled="!canApply" class="px-4 py-1.5 rounded-lg font-medium text-sm" :class="canApply ? 'bg-[#058a64] hover:bg-[#047857] text-white cursor-pointer' : (isDark ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')">
            Apply
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  side: { type: String, required: true }, // 'ap' | 'ar'
  partyName: { type: String, required: true },
  needed: { type: Number, default: 0 },
  invoices: { type: Array, default: null }, // null = not loaded yet
  purchaseCandidates: { type: Array, default: () => [] }, // TB vouchers suggesting new bills for this vendor
  loading: { type: Boolean, default: false },
  typeField: { type: String, required: true }, // 'transaction_type' | 'type'
  primaryType: { type: String, required: true }, // 'purchase' | 'sales'
  code: { type: String, default: '' },
  isDark: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'resolved']);

const rows = ref([]);

const buildRows = () => {
  const existing = (props.invoices || []).map((inv) => ({
    invoice_number: inv.invoice_number,
    amount: inv.amount,
    date_of_invoice: inv.date_of_invoice,
    credit_days: inv.credit_days,
    adjustment: '',
    markPaid: false,
    isNew: false,
  }));
  const candidates = (props.purchaseCandidates || []).map((c) => ({
    invoice_number: c.voucher_no || '',
    amount: c.amount,
    date_of_invoice: c.entry_date,
    credit_days: 0,
    adjustment: String(c.amount ?? ''),
    markPaid: false,
    isNew: true,
  }));
  rows.value = [...existing, ...candidates];
};

watch([() => props.invoices, () => props.purchaseCandidates], buildRows, { immediate: true });

const addInvoiceRow = () => {
  rows.value.push({
    invoice_number: '', amount: '', date_of_invoice: '',
    credit_days: 0, adjustment: '', markPaid: false, isNew: true,
  });
};

const toNumber = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

const formatAmount = (v) => {
  const n = Number(v) || 0;
  const hasDecimal = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: hasDecimal ? 2 : 0, maximumFractionDigits: 2 }).format(n);
};

const rowApplied = (row) => row.markPaid ? toNumber(row.amount) : toNumber(row.adjustment);

const totalEntered = computed(() => rows.value.reduce((sum, r) => sum + rowApplied(r), 0));
const needed = computed(() => Math.abs(props.needed));

const duplicateRowIndexes = computed(() => {
  const seen = {};
  rows.value.forEach((r, i) => {
    const n = (r.invoice_number || '').trim().toLowerCase();
    if (!n) return;
    (seen[n] ||= []).push(i);
  });
  const bad = new Set();
  Object.values(seen).forEach((indexes) => {
    if (indexes.length > 1 && indexes.some((i) => rows.value[i].isNew)) {
      indexes.forEach((i) => bad.add(i));
    }
  });
  return bad;
});
const isDuplicateRow = (i) => duplicateRowIndexes.value.has(i);

const errorMessage = ref('');

const canApply = computed(() =>
  !props.loading &&
  Math.abs(totalEntered.value - needed.value) < 0.01 &&
  rows.value.some((r) => rowApplied(r) !== 0) &&
  rows.value.every((r) => !r.isNew || (r.invoice_number && toNumber(r.amount) > 0)) &&
  duplicateRowIndexes.value.size === 0
);

const todayStr = () => new Date().toISOString().slice(0, 10);

const apply = () => {
  errorMessage.value = '';
  if (!canApply.value) {
    errorMessage.value = 'Entered amount must equal the needed amount before applying.';
    return;
  }

  const lines = [];
  rows.value.forEach((row) => {
    const amt = rowApplied(row);
    if (amt === 0) return;

    if (row.isNew) {
      // Creates the bill; mark_paid closes it immediately if toggled.
      lines.push({
        party_name: props.partyName,
        invoice_number: row.invoice_number || null,
        date: todayStr(),
        adjustment: amt,
        credit_days: row.credit_days || 0,
        mark_paid: row.markPaid,
        [props.typeField]: props.primaryType,
      });
    } else if (row.markPaid) {
      // Explicit human confirmation — close this exact existing bill.
      lines.push({
        party_name: props.partyName,
        invoice_number: row.invoice_number,
        date: todayStr(),
        adjustment: amt,
        [props.typeField]: 'return',
      });
    } else {
      // Partial/unspecified — a floating balance adjustment, not tied to
      // this bill's own status (no partial-paid state exists).
      lines.push({
        party_name: props.partyName,
        invoice_number: null,
        date: todayStr(),
        adjustment: amt,
        [props.typeField]: 'return',
      });
    }
  });

  emit('resolved', { partyName: props.partyName, lines, amount: totalEntered.value });
};
</script>
