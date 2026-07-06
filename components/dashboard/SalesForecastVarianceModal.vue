<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

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
              <input type="text" :value="formatAmount(data.actual_revenue)" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per sales forecast</label>
              <input type="text" :value="formatAmount(data.forecasted_revenue)" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variance</label>
              <input type="text" :value="formatAmount(data.variance)" readonly class="w-full bg-[#fef2f2] border border-[#fca5a5] text-red-600 rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AED {{ formatAmount(data.variance) }} variance remaining — select and adjust items below.
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
                    <span :class="{'line-through text-gray-400 mr-2': rowState[i].applied && rowState[i].adjust}">{{ row['Amount'] }}</span>
                    <span v-if="rowState[i].applied && rowState[i].adjust" class="font-bold text-[#058a64]">{{ rowState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4 text-center"><input type="checkbox" v-model="rowState[i].selected" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="rowState[i].adjust" :placeholder="rowState[i].selected ? '0.00' : 'Select to adjust'" :class="rowState[i].selected ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!rowState[i].selected"/>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <button v-if="rowState[i].selected && !rowState[i].applied" @click="applyAdjustment(row, i)" :disabled="rowState[i].saving" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center cursor-pointer disabled:opacity-50">
                      Apply
                    </button>
                    <button v-else-if="rowState[i].selected && rowState[i].applied" @click="rowState[i].applied = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
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
                  <th class="py-3 px-4 font-medium w-auto">Party Name</th>
                  <th class="py-3 px-4 font-medium w-48">Invoice Number</th>
                  <th class="py-3 px-4 font-medium w-40">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-if="manualEntries.length === 0">
                  <td colspan="5" class="py-8 px-4 text-center text-gray-500 bg-white">
                    No manual entries. Click "Add Manual Entry Row" to add one.
                  </td>
                </tr>
                <tr v-for="(entry, index) in manualEntries" :key="index" class="bg-white">
                  <td class="py-2 px-2">
                    <input type="date" v-model="entry.date" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64]" />
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
                    <button @click="saveManualEntry(index)" :disabled="entry.saving" class="text-[#058a64] hover:text-[#047857] transition-colors font-medium cursor-pointer mr-3 disabled:opacity-50">Save</button>
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
        <button @click="closeModal" class="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer">
          Close
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

const reasonRows = computed(() => props.data?.reasons ?? []);
const rowState = ref([]);

watch(reasonRows, (rows) => {
  rowState.value = rows.map(() => ({ selected: false, adjust: '', applied: false, saving: false }));
}, { immediate: true });

const formatAmount = (v) => Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const closeModal = () => emit('close');

const applyAdjustment = async (row, i) => {
  rowState.value[i].saving = true;
  try {
    await useApi('/data-source/sales-forecast/update-adjustments', {
      method: 'POST',
      body: {
        date: row['Date'],
        party_name: row['Party Name'],
        invoice_number: row['Invoice Number'],
        amount: row['Amount'],
        adjustments: rowState.value[i].adjust,
        current_date: props.date,
      },
    });
    rowState.value[i].applied = true;
    emit('resolved');
  } finally {
    rowState.value[i].saving = false;
  }
};

const manualEntries = ref([]);

const addManualEntry = () => {
  manualEntries.value.push({ date: '', partyName: '', invoiceNumber: '', amount: '', saving: false });
};

const removeManualEntry = (index) => {
  manualEntries.value.splice(index, 1);
};

const saveManualEntry = async (index) => {
  const entry = manualEntries.value[index];
  manualEntries.value[index].saving = true;
  try {
    await useApi('/data-source/sales-forecast/store', {
      method: 'POST',
      body: {
        date: entry.date,
        party_name: entry.partyName,
        invoice_number: entry.invoiceNumber,
        amount: entry.amount,
      },
    });
    manualEntries.value.splice(index, 1);
    emit('resolved');
  } finally {
    if (manualEntries.value[index]) manualEntries.value[index].saving = false;
  }
};
</script>
