<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl w-full max-w-6xl max-h-[78vh] overflow-y-auto" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Header & Summary -->
      <div class="sticky top-0 z-20 bg-white border-b shadow-sm">
        <!-- Top Title Bar -->
        <div class="px-6 py-4 flex justify-between items-start border-b border-gray-100">
          <div>
            <div class="flex items-center gap-2 text-xl font-bold text-gray-800 uppercase">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              SALES FORECAST VARIANCE
            </div>
            <p class="text-sm text-gray-500 mt-2 max-w-2xl">
              Reconcile discrepancies between forecasted values and actual invoiced revenue.
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">Actual Revenue (Invoiced)</label>
              <input type="text" :value="formatAmount(actualRevenue)" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per sales forecast</label>
              <input type="text" :value="formatAmount(forecastedRevenue)" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variance</label>
              <input type="text" :value="formatAmount(variance)" readonly :class="isResolved ? 'bg-[#eefdf6] border-[#6ee7b7] text-[#047857]' : 'bg-[#fef2f2] border-[#fca5a5] text-red-600'" class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div v-if="!isResolved" class="flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AED {{ formatAmount(variance) }} variance remaining — select and adjust items below.
          </div>
          <div v-else class="flex items-center gap-2 text-[#047857] text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            All variance has been resolved. You can now post this record.
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-4 space-y-8">

        <!-- Reason for variance -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Reason for variance</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Invoice Number</th>
                  <th class="py-3 px-4 font-medium">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium text-center">Select</th>
                  <th class="py-3 px-4 font-medium text-center">Adjustments (AED)</th>
                  <th class="py-3 px-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-if="reasonRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 bg-white">No forecast rows found for this date.</td>
                </tr>
                <tr v-for="(row, i) in reasonRows" :key="i" class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 text-gray-700">{{ row['Date'] }}</td>
                  <td class="py-3 px-4 text-gray-700 font-medium">{{ row['Party Name'] }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ row['Invoice Number'] }}</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': rowState[i].selected && rowState[i].adjust}">{{ row['Amount'] }}</span>
                    <span v-if="rowState[i].selected && rowState[i].adjust" class="font-bold text-[#058a64]">{{ rowState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4 text-center"><input type="checkbox" v-model="rowState[i].selected" @change="onRowToggle(rowState[i])" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="rowState[i].adjust" :placeholder="rowState[i].selected ? '0.00' : 'Select to adjust'" :class="rowState[i].selected ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!rowState[i].selected"/>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <span v-if="rowState[i].selected" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 inline-flex items-center justify-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </span>
                  </td>
                </tr>
                <tr v-if="reasonRows.length > 0" class="bg-[#a7f3d0] font-bold text-gray-800">
                  <td colspan="3" class="py-3 px-4 text-right">Total sales</td>
                  <td class="py-3 px-4">{{ formatAmount(selectedRowsTotal) }}</td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Manual Add -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-gray-800">Manual Add</h3>
            <button @click="addManualEntry" class="bg-[#56d5b0] hover:bg-[#3ebe97] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add Manual Entry Row
            </button>
          </div>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium w-48">Date</th>
                  <th class="py-3 px-4 font-medium w-auto">Project Name</th>
                  <th class="py-3 px-4 font-medium w-auto">Party Name</th>
                  <th class="py-3 px-4 font-medium w-48">Invoice Number</th>
                  <th class="py-3 px-4 font-medium w-40">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-if="manualEntries.length === 0">
                  <td colspan="6" class="py-8 px-4 text-center text-gray-500 bg-white">
                    No manual entries. Click "Add Manual Entry Row" to add one.
                  </td>
                </tr>
                <tr v-for="(entry, index) in manualEntries" :key="index" class="bg-white">
                  <td class="py-2 px-2">
                    <input type="date" v-model="entry.date" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64]" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.projectName" placeholder="Enter project name" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.partyName" placeholder="Enter customer name" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.invoiceNumber" placeholder="Enter invoice number" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.amount" placeholder="0.00" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2 text-center">
                    <button @click="removeManualEntry(index)" class="text-red-500 hover:text-red-700 transition-colors font-medium cursor-pointer">Delete</button>
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
        <button @click="closeModal" class="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer">
          Cancel
        </button>
        <button @click="postVariance" :disabled="!canPost || actionLoading" :class="canPost ? 'bg-[#058a64] hover:bg-[#047857] cursor-pointer' : 'bg-[#a3dcc8] cursor-not-allowed'" class="px-8 py-2 text-white rounded-lg font-medium text-sm">
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
  date: { type: String, default: null },
});
const emit = defineEmits(['close', 'resolved']);

const currentLang = useState('currentLang', () => 'en');

// Server-supplied starting point — never mutated directly. Everything below
// is a live local preview computed on top of it; only Post Variance writes
// anything to the backend.
const baseActual = ref(0);
const baseForecasted = ref(0);

watch(() => props.data, (d) => {
  baseActual.value = Number(d?.actual_revenue ?? 0);
  baseForecasted.value = Number(d?.forecasted_revenue ?? 0);
}, { immediate: true });

const reasonRows = computed(() => props.data?.reasons ?? []);
const rowState = ref([]);

const resetRowState = (rows) => rows.map(() => ({ selected: false, adjust: '' }));
watch(reasonRows, (rows) => { rowState.value = resetRowState(rows); }, { immediate: true });

const formatAmount = (v) => formatInMillions(v);
const toNumber = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
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

const onRowToggle = (rowState) => {
  if (!rowState.selected) rowState.adjust = '';
};

// ---------- Manual entries (local only until Post Variance) ----------
const manualEntries = ref([]);

const addManualEntry = () => {
  manualEntries.value.push({ date: '', projectName: '', partyName: '', invoiceNumber: '', amount: '' });
};

const removeManualEntry = (index) => manualEntries.value.splice(index, 1);

const validManualEntries = computed(() =>
  manualEntries.value.filter((e) => e.partyName && e.date && e.invoiceNumber && toNumber(e.amount))
);

// ---------- Live local preview ----------
// A selected reason row swaps its own contribution from the original amount to
// the typed adjustment (the backend replaces invoice_value, it doesn't add to
// it) — every manual entry is a brand-new forecast row, so it adds in full.
const selectedRowsTotal = computed(() =>
  reasonRows.value.reduce((sum, row, i) => rowState.value[i]?.selected
    ? sum + toNumber(rowState.value[i].adjust || row['Amount'])
    : sum, 0)
);

const forecastedRevenue = computed(() => {
  let total = baseForecasted.value;
  reasonRows.value.forEach((row, i) => {
    if (rowState.value[i]?.selected) {
      total += toNumber(rowState.value[i].adjust || row['Amount']) - toNumber(row['Amount']);
    }
  });
  validManualEntries.value.forEach((e) => { total += toNumber(e.amount); });
  return total;
});

const actualRevenue = computed(() => baseActual.value);
const variance = computed(() => Math.abs(actualRevenue.value - forecastedRevenue.value));
const isResolved = computed(() => variance.value < 0.005);

// ---------- Footer actions ----------
const errorMessage = ref('');
const actionLoading = ref(false);

const canPost = computed(() =>
  isResolved.value && (reasonRows.value.some((_, i) => rowState.value[i]?.selected) || validManualEntries.value.length > 0)
);

const resolveAlert = async (type) => {
  if (!props.data.alert_id) return;
  await useApi(`/alerts/${props.data.alert_id}/action`, {
    method: 'POST',
    body: { type, action_by: 'Dashboard' },
  });
};

// Post Variance is the only action that writes anything to the backend — every
// selected reason row and manual entry gets sent, then the alert is resolved.
const postVariance = async () => {
  errorMessage.value = '';
  actionLoading.value = true;
  try {
    for (let i = 0; i < reasonRows.value.length; i++) {
      if (!rowState.value[i]?.selected) continue;
      const row = reasonRows.value[i];
      await useApi('/data-source/sales-forecast/update-adjustments', {
        method: 'POST',
        body: {
          date: row['Date'],
          party_name: row['Party Name'],
          invoice_number: row['Invoice Number'],
          original_invoice_number: row['Invoice Number'],
          amount: row['Amount'],
          adjustments: toNumber(rowState.value[i].adjust || row['Amount']),
          current_date: props.date,
        },
      });
    }
    for (const entry of validManualEntries.value) {
      await useApi('/data-source/sales-forecast/store', {
        method: 'POST',
        body: {
          date: entry.date,
          project_name: entry.projectName,
          party_name: entry.partyName,
          invoice_number: entry.invoiceNumber,
          amount: entry.amount,
        },
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
</script>
