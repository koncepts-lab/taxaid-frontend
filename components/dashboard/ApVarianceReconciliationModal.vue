<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Header & Summary -->
      <div class="sticky top-0 z-20 bg-white border-b shadow-sm">
        <!-- Top Title Bar -->
        <div class="px-6 py-4 flex justify-between items-start border-b border-gray-100">
          <div>
            <div class="flex items-center gap-2 text-xl font-bold text-gray-800">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            AP VARIANCE RECONCILIATION
          </div>
          <p class="text-sm text-gray-500 mt-2 max-w-2xl">
            Reconcile differences between Trial Balance and AP Report. All variances must be resolved to zero before posting.
          </p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        </div>

        <!-- Summary Box -->
        <div class="px-6 py-5">
          <div class="bg-[#eefdf6] border border-[#a7f3d0] rounded-xl p-5 flex flex-col md:flex-row gap-6 mb-4">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per TB</label>
              <input type="text" :value="formatAmount(balanceTB)" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per AP report</label>
              <input type="text" :value="formatAmount(balanceReport)" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variance</label>
              <input type="text" :value="formatAmount(variance)" readonly :class="isResolved ? 'bg-[#eefdf6] border-[#6ee7b7] text-[#047857]' : 'bg-[#fef2f2] border-[#fca5a5] text-red-600'" class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div v-if="!isResolved" class="flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AED {{ formatAmount(variance) }} variance remaining - Select items below to resolve the variance.
          </div>
          <div v-else class="flex items-center gap-2 text-[#047857] text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Variance resolved to zero - you can now post the variance.
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-4 space-y-8">

        <!-- Section 1: Potential reason for variance - Purchase -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Potential reason for variance - Purchase</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Voucher No.</th>
                  <th class="py-3 px-4 font-medium">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium">Select</th>
                  <th class="py-3 px-4 font-medium">Adjustments (AED)</th>
                  <th class="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-if="purchaseRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 bg-white">No purchase-side variance rows found.</td>
                </tr>
                <tr v-for="(row, i) in purchaseRows" :key="`purchase-${i}`" class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 text-gray-700">{{ row.entry_date }}</td>
                  <td class="py-3 px-4 text-gray-700 font-medium">{{ row.ledger_name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ row.voucher_no }}</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': purchaseState[i].applied && purchaseState[i].adjust}">{{ row.amount }}</span>
                    <span v-if="purchaseState[i].applied && purchaseState[i].adjust" class="font-bold text-[#058a64]">{{ purchaseState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="purchaseState[i].selected" :disabled="purchaseState[i].applied" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="purchaseState[i].adjust" :placeholder="purchaseState[i].selected ? String(row.amount) : 'Select to adjust'" :class="purchaseState[i].selected ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!purchaseState[i].selected || purchaseState[i].applied"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="purchaseState[i].selected && !purchaseState[i].applied" @click="applyRow('purchase', row, i)" :disabled="purchaseState[i].saving" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center disabled:opacity-50">
                      {{ purchaseState[i].saving ? 'Applying...' : 'Apply' }}
                    </button>
                    <span v-else-if="purchaseState[i].applied" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Payment - Unrecorded Transactions -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Payment - Unrecorded Transactions</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Voucher No.</th>
                  <th class="py-3 px-4 font-medium">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium">Select</th>
                  <th class="py-3 px-4 font-medium">Adjustments (AED)</th>
                  <th class="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-if="paymentRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 bg-white">No unrecorded payment rows found.</td>
                </tr>
                <tr v-for="(row, i) in paymentRows" :key="`payment-${i}`" class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 text-gray-700">{{ row.entry_date }}</td>
                  <td class="py-3 px-4 text-gray-700 font-medium">{{ row.ledger_name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ row.voucher_no }}</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': paymentState[i].applied && paymentState[i].adjust}">{{ row.amount }}</span>
                    <span v-if="paymentState[i].applied && paymentState[i].adjust" class="font-bold text-[#058a64]">{{ paymentState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="paymentState[i].selected" :disabled="paymentState[i].applied" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="paymentState[i].adjust" :placeholder="paymentState[i].selected ? String(row.amount) : 'Select to adjust'" :class="paymentState[i].selected ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!paymentState[i].selected || paymentState[i].applied"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="paymentState[i].selected && !paymentState[i].applied" @click="applyRow('payment', row, i)" :disabled="paymentState[i].saving" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center disabled:opacity-50">
                      {{ paymentState[i].saving ? 'Applying...' : 'Apply' }}
                    </button>
                    <span v-else-if="paymentState[i].applied" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 flex items-center justify-center gap-1">
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
            <h3 class="text-lg font-bold text-gray-800">Manual entry - Adjustments</h3>
            <button @click="addManualEntry" class="bg-[#56d5b0] hover:bg-[#3ebe97] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add Manual Entry Row
            </button>
          </div>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium w-40">Date</th>
                  <th class="py-3 px-4 font-medium w-auto">Party Name</th>
                  <th class="py-3 px-4 font-medium w-36">Invoice Number</th>
                  <th class="py-3 px-4 font-medium w-28">Credit Days</th>
                  <th class="py-3 px-4 font-medium w-32">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium w-44">Type</th>
                  <th class="py-3 px-4 font-medium w-32 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-if="manualEntries.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 bg-white">
                    No manual entries. Click "Add Manual Entry Row" to add one.
                  </td>
                </tr>
                <tr v-for="(entry, index) in manualEntries" :key="index" class="bg-white">
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.date" placeholder="dd-mm-yyyy" :disabled="entry.saved" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400 disabled:opacity-60" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.partyName" placeholder="Enter vendor name" :disabled="entry.saved" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400 disabled:opacity-60" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.invoiceNumber" placeholder="Enter bill number" :disabled="entry.saved" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400 disabled:opacity-60" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.creditDays" placeholder="e.g., 30" :disabled="entry.saved" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400 disabled:opacity-60" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.amount" placeholder="0.00" :disabled="entry.saved" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400 disabled:opacity-60" />
                  </td>
                  <td class="py-2 px-2">
                    <select v-model="entry.transactionType" :disabled="entry.saved" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] disabled:opacity-60">
                      <option value="purchase">Purchase (+)</option>
                      <option value="payment">Payment (-)</option>
                    </select>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <button v-if="!entry.saved" @click="saveManualEntry(index)" :disabled="entry.saving" class="bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 mr-2">
                      {{ entry.saving ? 'Saving...' : 'Save' }}
                    </button>
                    <button v-if="!entry.saved" @click="removeManualEntry(index)" class="text-red-500 hover:text-red-700 transition-colors font-medium">Delete</button>
                    <span v-else class="text-[#047857] font-medium flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Saved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end items-center gap-4">
        <p v-if="errorMessage" class="text-sm text-red-500 mr-auto">{{ errorMessage }}</p>
        <button @click="closeModal" class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
          Cancel
        </button>
        <button @click="ignoreAlert" :disabled="actionLoading" class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
          Ignore
        </button>
        <button @click="postVariance" :disabled="!canPost || actionLoading" :class="canPost ? 'bg-[#058a64] hover:bg-[#047857] cursor-pointer' : 'bg-[#a3dcc8] cursor-not-allowed'" class="px-4 py-1.5 text-white rounded-lg font-medium text-sm">
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

// Header balances are reactive: initialized from the alert payload, then
// updated from each adjustment endpoint's recalculated response.
const balanceTB = ref(0);
const balanceReport = ref(0);
const variance = ref(0);

watch(() => props.data, (d) => {
  balanceTB.value = Number(d?.['Balance as per TB'] ?? 0);
  balanceReport.value = Number(d?.['Balance as per AP report'] ?? 0);
  variance.value = Number(d?.['Variance'] ?? 0);
}, { immediate: true });

const isResolved = computed(() => Math.abs(Number(variance.value)) < 0.005);

const purchaseRows = computed(() => props.data?.Vouchers?.['Potential reason for variance - Purchase'] ?? []);
const paymentRows = computed(() => props.data?.Vouchers?.['Payment - Unrecorded Transactions'] ?? []);

const purchaseState = ref([]);
const paymentState = ref([]);

const resetRowState = (rows) => rows.map(() => ({ selected: false, adjust: '', applied: false, saving: false }));

watch(purchaseRows, (rows) => { purchaseState.value = resetRowState(rows); }, { immediate: true });
watch(paymentRows, (rows) => { paymentState.value = resetRowState(rows); }, { immediate: true });

const errorMessage = ref('');

const formatAmount = (v) => Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

// ---------- Section 1 & 2: per-row apply ----------
// purchase -> /adjustments/ap/purchase (recalculates balances)
// payment  -> /adjustments/ap/payment (marks invoice paid + recalculates)
const applyRow = async (section, row, i) => {
  const state = section === 'purchase' ? purchaseState.value : paymentState.value;
  const adjustment = toNumber(state[i].adjust || row.amount);
  if (!adjustment) { errorMessage.value = 'Enter an adjustment amount first'; return; }
  errorMessage.value = '';
  state[i].saving = true;
  try {
    const res = await useApi(`/adjustments/ap/${section}`, {
      method: 'POST',
      body: {
        party_name: row.ledger_name,
        invoice_number: row.voucher_no || null,
        date: toApiDate(row.entry_date),
        adjustment,
        balance_as_per_TB: balanceTB.value,
        Balance_as_per_AP_report: balanceReport.value,
        variance: variance.value,
      },
    });
    if (res?.status === 'success') {
      balanceTB.value = Number(res.balance_as_per_TB);
      balanceReport.value = Number(res.Balance_as_per_AP_report);
      variance.value = Number(res.variance);
      state[i].adjust = String(adjustment);
      state[i].applied = true;
    }
  } catch (err) {
    errorMessage.value = extractError(err);
  } finally {
    state[i].saving = false;
  }
};

// ---------- Section 3: manual entries -> /adjustments/ap/manual-adjustment ----------
const manualEntries = ref([]);

const addManualEntry = () => {
  manualEntries.value.push({
    date: '', partyName: '', invoiceNumber: '', creditDays: '', amount: '',
    transactionType: 'purchase', saving: false, saved: false,
  });
};

const removeManualEntry = (index) => manualEntries.value.splice(index, 1);

const saveManualEntry = async (index) => {
  const entry = manualEntries.value[index];
  const adjustment = toNumber(entry.amount);
  if (!entry.partyName || !entry.date || !adjustment) {
    errorMessage.value = 'Manual entry needs party name, date and amount';
    return;
  }
  errorMessage.value = '';
  entry.saving = true;
  try {
    const res = await useApi('/adjustments/ap/manual-adjustment', {
      method: 'POST',
      body: {
        party_name: entry.partyName,
        invoice_number: entry.invoiceNumber || null,
        date: toApiDate(entry.date),
        adjustment,
        credit_days: entry.creditDays !== '' ? parseInt(entry.creditDays, 10) || 0 : null,
        transaction_type: entry.transactionType,
      },
    });
    if (res?.status === 'success') {
      // Mirror the backend's balance math locally (this endpoint only returns the record).
      if (entry.transactionType === 'purchase') balanceReport.value += adjustment;
      else balanceReport.value -= adjustment;
      variance.value -= adjustment;
      entry.saved = true;
    }
  } catch (err) {
    errorMessage.value = extractError(err);
  } finally {
    entry.saving = false;
  }
};

// ---------- Footer actions ----------
const actionLoading = ref(false);

const appliedAdjustments = computed(() => {
  const collect = (rows, state, type) => rows
    .map((row, i) => ({ row, state: state[i] }))
    .filter(({ state: s }) => s?.applied)
    .map(({ row, state: s }) => ({
      party_name: row.ledger_name,
      invoice_number: row.voucher_no || null,
      date: toApiDate(row.entry_date),
      adjustment: toNumber(s.adjust || row.amount),
      credit_days: null,
      transaction_type: type,
    }));
  return [
    ...collect(purchaseRows.value, purchaseState.value, 'purchase'),
    ...collect(paymentRows.value, paymentState.value, 'payment'),
  ];
});

const canPost = computed(() =>
  isResolved.value && (appliedAdjustments.value.length > 0 || manualEntries.value.some((e) => e.saved))
);

const resolveAlert = async (type) => {
  if (!props.data.alert_id) return;
  await useApi(`/alerts/${props.data.alert_id}/action`, {
    method: 'POST',
    body: { type, action_by: 'Dashboard' },
  });
};

// Post Variance: persist all applied section rows via the bulk endpoint
// (manual entries are already stored individually), then resolve the alert.
const postVariance = async () => {
  errorMessage.value = '';
  actionLoading.value = true;
  try {
    if (appliedAdjustments.value.length > 0) {
      await useApi('/adjustments/ap/bulk', {
        method: 'POST',
        body: { variance: 0, adjustments: appliedAdjustments.value },
      });
    }
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

<style scoped>
/* Additional component-specific styling if needed */
</style>
