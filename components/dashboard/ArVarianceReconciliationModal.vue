<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl w-full max-w-6xl max-h-[78vh] overflow-y-auto" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Header & Summary -->
      <div class="sticky top-0 z-20 border-b shadow-sm" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'">
        <!-- Top Title Bar -->
        <div class="px-6 py-4 flex justify-between items-start border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div>
          <div class="flex items-center gap-2 text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            AR VARIANCE RECONCILIATION
          </div>
          <p class="text-sm mt-2 max-w-2xl" :class="isDark ? 'text-white/60' : 'text-gray-500'">
            Reconcile differences between Trial Balance and AR Report. All variances must be resolved to zero before posting.
          </p>
        </div>
        <button @click="closeModal" class="transition-colors cursor-pointer" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        </div>

        <!-- Summary Box -->
        <div class="px-6 py-5">
          <div class="border rounded-xl p-5 flex flex-col md:flex-row gap-6 mb-4" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eefdf6] border-[#a7f3d0]'">
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">Balance as per TB</label>
              <input type="text" :value="`${code} ${formatAmount(balanceTB)}`" readonly class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">Balance as per AR report</label>
              <input type="text" :value="`${code} ${formatAmount(balanceReport)}`" readonly class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">Variance</label>
              <input type="text" :value="`${code} ${formatAmount(variance)}`" readonly :class="isResolved ? (isDark ? 'bg-[#047857]/20 border-[#6ee7b7]/40 text-[#6ee7b7]' : 'bg-[#eefdf6] border-[#6ee7b7] text-[#047857]') : (isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#fef2f2] border-[#fca5a5] text-red-600')" class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div v-if="!isResolved" class="flex items-center gap-2 text-sm font-medium" :class="isDark ? 'text-red-400' : 'text-red-500'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ code }} {{ formatAmount(variance) }} variance remaining - Select items below to resolve the variance.
          </div>
          <div v-else class="flex items-center gap-2 text-sm font-medium" :class="isDark ? 'text-[#6ee7b7]' : 'text-[#047857]'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Variance resolved to zero - you can now post the variance.
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-4 space-y-8" :class="isDark ? 'text-white' : ''">

        <!-- Section 1: Potential reason for variance - Sales -->
        <div>
          <h3 class="text-lg font-bold mb-3" :class="isDark ? 'text-white' : 'text-gray-800'">Potential reason for variance - Sales</h3>
          <div class="border rounded-lg overflow-hidden" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Voucher No.</th>
                  <th class="py-3 px-4 font-medium">Amount ({{ code }})</th>
                  <th class="py-3 px-4 font-medium">Select</th>
                  <th class="py-3 px-4 font-medium">Adjustments ({{ code }})</th>
                  <th class="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
                <tr v-if="salesRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">No sales-side variance rows found.</td>
                </tr>
                <tr v-for="(row, i) in salesRows" :key="`sales-${i}`" class="transition-colors" :class="isDark ? 'hover:bg-white/5 bg-[#002e26]' : 'hover:bg-gray-50 bg-white'">
                  <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ row.entry_date }}</td>
                  <td class="py-3 px-4 font-medium" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ row.ledger_name }}</td>
                  <td class="py-3 px-4" :class="isDark ? 'text-white/60' : 'text-gray-600'">{{ row.voucher_no }}</td>
                  <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                    <span :class="{'line-through text-gray-400 mr-2': salesState[i].selected && salesState[i].adjust}">{{ row.amount }}</span>
                    <span v-if="salesState[i].selected && salesState[i].adjust" class="font-bold text-[#058a64]">{{ salesState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="salesState[i].selected" @change="onRowToggle(salesState[i])" class="w-4 h-4 rounded text-[#058a64] focus:ring-[#058a64]" :class="isDark ? 'border-white/20 bg-[#002e26]' : 'border-gray-300 bg-white'" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="salesState[i].adjust" :placeholder="salesState[i].selected ? String(row.amount) : 'Select to adjust'" :class="salesState[i].selected ? (isDark ? 'bg-white/10 rounded-md py-1.5 px-3 text-right text-white' : 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800') : (isDark ? 'bg-transparent disabled:bg-transparent p-0 text-white/30 placeholder-white/20' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300')" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!salesState[i].selected"/>
                  </td>
                  <td class="py-2 px-4">
                    <span v-if="salesState[i].selected" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Receipt - Unrecorded Transactions -->
        <div>
          <h3 class="text-lg font-bold mb-3" :class="isDark ? 'text-white' : 'text-gray-800'">Receipt - Unrecorded Transactions</h3>
          <div class="border rounded-lg overflow-hidden" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Voucher No.</th>
                  <th class="py-3 px-4 font-medium">Amount ({{ code }})</th>
                  <th class="py-3 px-4 font-medium">Select</th>
                  <th class="py-3 px-4 font-medium">Adjustments ({{ code }})</th>
                  <th class="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
                <tr v-if="receiptRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">No unrecorded receipt rows found.</td>
                </tr>
                <tr v-for="(row, i) in receiptRows" :key="`receipt-${i}`" class="transition-colors" :class="isDark ? 'hover:bg-white/5 bg-[#002e26]' : 'hover:bg-gray-50 bg-white'">
                  <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ row.entry_date }}</td>
                  <td class="py-3 px-4 font-medium" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ row.ledger_name }}</td>
                  <td class="py-3 px-4" :class="isDark ? 'text-white/60' : 'text-gray-600'">{{ row.voucher_no }}</td>
                  <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                    <span :class="{'line-through text-gray-400 mr-2': receiptState[i].selected && receiptState[i].adjust}">{{ row.amount }}</span>
                    <span v-if="receiptState[i].selected && receiptState[i].adjust" class="font-bold text-[#058a64]">{{ receiptState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="receiptState[i].selected" @change="onRowToggle(receiptState[i])" class="w-4 h-4 rounded text-[#058a64] focus:ring-[#058a64]" :class="isDark ? 'border-white/20 bg-[#002e26]' : 'border-gray-300 bg-white'" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="receiptState[i].adjust" :placeholder="receiptState[i].selected ? String(row.amount) : 'Select to adjust'" :class="receiptState[i].selected ? (isDark ? 'bg-white/10 rounded-md py-1.5 px-3 text-right text-white' : 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800') : (isDark ? 'bg-transparent disabled:bg-transparent p-0 text-white/30 placeholder-white/20' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300')" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!receiptState[i].selected"/>
                  </td>
                  <td class="py-2 px-4">
                    <span v-if="receiptState[i].selected" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Manual entry - Adjustments -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">Manual entry - Adjustments</h3>
            <button @click="addManualEntry" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add Manual Entry Row
            </button>
          </div>
          <div class="border rounded-lg overflow-hidden" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium w-40">Date</th>
                  <th class="py-3 px-4 font-medium w-auto">Party Name</th>
                  <th class="py-3 px-4 font-medium w-36">Invoice Number</th>
                  <th class="py-3 px-4 font-medium w-28">Credit Days</th>
                  <th class="py-3 px-4 font-medium w-32">Amount ({{ code }})</th>
                  <th class="py-3 px-4 font-medium w-44">Type</th>
                  <th class="py-3 px-4 font-medium w-32 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
                <tr v-if="manualEntries.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">
                    No manual entries. Click "Add Manual Entry Row" to add one.
                  </td>
                </tr>
                <tr v-for="(entry, index) in manualEntries" :key="index" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                  <td class="py-2 px-2">
                    <CommonDateField v-model="entry.date" format="dmy" size="sm" allow-future />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.partyName" placeholder="Enter customer name" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.invoiceNumber" placeholder="Enter invoice number" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.creditDays" placeholder="e.g., 30" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.amount" placeholder="0.00" class="w-full border rounded-md py-1.5 px-3 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                  </td>
                  <td class="py-2 px-2">
                    <div class="flex items-center gap-2">
                      <button type="button" @click="entry.type = 'sales'" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="entry.type === 'sales' ? 'bg-[#058a64] text-white' : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
                        Sales
                      </button>
                      <button type="button" @click="entry.type = 'return'" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="entry.type === 'return' ? 'bg-[#058a64] text-white' : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
                        Return
                      </button>
                    </div>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <button @click="removeManualEntry(index)" class="text-red-500 hover:text-red-700 transition-colors font-medium">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 z-10 px-6 py-4 border-t flex justify-end items-center gap-4" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white'">
        <p v-if="errorMessage" class="text-sm text-red-500 mr-auto">{{ errorMessage }}</p>
        <button @click="closeModal" class="px-4 py-1.5 border rounded-lg font-medium transition-colors text-sm" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          Cancel
        </button>
        <button @click="ignoreAlert" :disabled="actionLoading" class="px-4 py-1.5 border rounded-lg font-medium transition-colors text-sm disabled:opacity-50" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          Ignore
        </button>
        <button @click="postVariance" :disabled="!canPost || actionLoading" :class="canPost ? 'bg-[#058a64] hover:bg-[#047857] text-white cursor-pointer' : (isDark ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')" class="px-4 py-1.5 rounded-lg font-medium text-sm">
          {{ actionLoading ? 'Posting...' : 'Post Variance' }}
        </button>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  data: { type: Object, required: true },
});
const emit = defineEmits(['close', 'resolved']);

const currentLang = useState('currentLang', () => 'en');
const { isDark } = useTheme();
const { code } = useCurrency();

// Server-supplied starting point — never mutated directly. Everything below
// is a live local preview computed on top of it; only Post Variance writes
// anything to the backend.
const baseBalanceTB = ref(0);
const baseBalanceReport = ref(0);
const baseVariance = ref(0);

watch(() => props.data, (d) => {
  baseBalanceTB.value = Number(d?.['Balance as per TB'] ?? 0);
  baseBalanceReport.value = Number(d?.['Balance as per AR report'] ?? 0);
  baseVariance.value = Number(d?.['Variance'] ?? 0);
}, { immediate: true });

const salesRows = computed(() => props.data?.Vouchers?.['Potential reason for variance - Sales'] ?? []);
const receiptRows = computed(() => props.data?.Vouchers?.['Receipt - Unrecorded Transactions'] ?? []);

const salesState = ref([]);
const receiptState = ref([]);

const resetRowState = (rows) => rows.map(() => ({ selected: false, adjust: '' }));

watch(salesRows, (rows) => { salesState.value = resetRowState(rows); }, { immediate: true });
watch(receiptRows, (rows) => { receiptState.value = resetRowState(rows); }, { immediate: true });

const errorMessage = ref('');

const formatAmount = (v) => {
  const n = Number(v) || 0;
  const hasDecimal = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: hasDecimal ? 2 : 0, maximumFractionDigits: 2 }).format(n);
};
const toNumber = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};
// Backend requires Y-m-d; accepts daybook dates (already ISO, possibly with time) and dd-mm-yyyy input.
const toApiDate = (value) => {
  const v = String(value ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const m = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return v;
};
const extractError = (err) => {
  const data = err?.data || err?.response?._data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    return Array.isArray(first) ? String(first[0]) : String(first);
  }
  return data?.message || err?.message || 'Something went wrong';
};

const closeModal = () => emit('close');

// Unchecking a row clears its adjustment too, so it stops contributing.
const onRowToggle = (rowState) => {
  if (!rowState.selected) rowState.adjust = '';
};

// ---------- Section 3: manual entries (local only until Post Variance) ----------
const manualEntries = ref([]);

const addManualEntry = () => {
  manualEntries.value.push({ date: '', partyName: '', invoiceNumber: '', creditDays: '', amount: '', type: 'sales' });
};

const removeManualEntry = (index) => manualEntries.value.splice(index, 1);

const validManualEntries = computed(() =>
  manualEntries.value.filter((e) => e.partyName && e.date && toNumber(e.amount))
);

// ---------- Live local preview ----------
// sales/manual-sales add to the report balance; receipt/return remove from
// it — but every applied item reduces the variance by its own amount
// regardless of direction, since each one explains away that much of the gap.
const balanceTB = computed(() => baseBalanceTB.value);

const balanceReport = computed(() => {
  let total = baseBalanceReport.value;
  salesRows.value.forEach((row, i) => {
    if (salesState.value[i]?.selected) total += toNumber(salesState.value[i].adjust || row.amount);
  });
  receiptRows.value.forEach((row, i) => {
    if (receiptState.value[i]?.selected) total -= toNumber(receiptState.value[i].adjust || row.amount);
  });
  validManualEntries.value.forEach((e) => {
    const amt = toNumber(e.amount);
    total += e.type === 'return' ? -amt : amt;
  });
  return total;
});

const variance = computed(() => {
  let resolved = 0;
  salesRows.value.forEach((row, i) => {
    if (salesState.value[i]?.selected) resolved += toNumber(salesState.value[i].adjust || row.amount);
  });
  receiptRows.value.forEach((row, i) => {
    if (receiptState.value[i]?.selected) resolved += toNumber(receiptState.value[i].adjust || row.amount);
  });
  validManualEntries.value.forEach((e) => { resolved += toNumber(e.amount); });
  return baseVariance.value - resolved;
});

const isResolved = computed(() => Math.abs(Number(variance.value)) < 0.005);

// ---------- Footer actions ----------
const actionLoading = ref(false);

// Bulk endpoint accepts type sales|return: sales creates an unpaid invoice,
// return marks the matching invoice_number as paid.
const appliedAdjustments = computed(() => {
  const collect = (rows, state, type) => rows
    .map((row, i) => ({ row, state: state[i] }))
    .filter(({ state: s }) => s?.selected)
    .map(({ row, state: s }) => ({
      party_name: row.ledger_name,
      invoice_number: row.voucher_no || null,
      date: toApiDate(row.entry_date),
      adjustment: toNumber(s.adjust || row.amount),
      credit_days: null,
      type,
    }));
  const manual = validManualEntries.value.map((e) => ({
    party_name: e.partyName,
    invoice_number: e.invoiceNumber || null,
    date: toApiDate(e.date),
    adjustment: toNumber(e.amount),
    credit_days: e.creditDays !== '' ? parseInt(e.creditDays, 10) || 0 : null,
    type: e.type,
  }));
  return [
    ...collect(salesRows.value, salesState.value, 'sales'),
    ...collect(receiptRows.value, receiptState.value, 'return'),
    ...manual,
  ];
});

const canPost = computed(() => isResolved.value && appliedAdjustments.value.length > 0);

const resolveAlert = async (type) => {
  if (!props.data.alert_id) return;
  await useApi(`/alerts/${props.data.alert_id}/action`, {
    method: 'POST',
    body: { type, action_by: 'Dashboard' },
  });
};

// Post Variance is the only action that writes anything to the backend —
// every selected row and manual entry goes in one bulk call, then the alert
// is resolved.
const postVariance = async () => {
  errorMessage.value = '';
  actionLoading.value = true;
  try {
    await useApi('/adjustments/ar/bulk', {
      method: 'POST',
      body: { variance: 0, adjustments: appliedAdjustments.value },
    });
    await resolveAlert('resolve');
    emit('resolved');
  } catch (err) {
    errorMessage.value = extractError(err);
  } finally {
    actionLoading.value = false;
  }
};

const ignoreAlert = async () => {
  errorMessage.value = '';
  actionLoading.value = true;
  try {
    await resolveAlert('ignore');
    emit('resolved');
  } catch (err) {
    errorMessage.value = extractError(err);
  } finally {
    actionLoading.value = false;
  }
};
</script>
