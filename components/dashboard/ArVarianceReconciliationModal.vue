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
            AR VARIANCE RECONCILIATION
          </div>
          <p class="text-sm text-gray-500 mt-2 max-w-2xl">
            Reconcile differences between Trial Balance and AR Report. All variances must be resolved to zero before posting.
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
              <input type="text" :value="formatAmount(data['Balance as per TB'])" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per AR report</label>
              <input type="text" :value="formatAmount(data['Balance as per AR report'])" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variance</label>
              <input type="text" :value="formatAmount(data['Variance'])" readonly class="w-full bg-[#fef2f2] border border-[#fca5a5] text-red-600 rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AED {{ formatAmount(data['Variance']) }} variance remaining - Select items below to resolve the variance.
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-4 space-y-8">

        <!-- Section 1: Potential reason for variance - Sales -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Potential reason for variance - Sales</h3>
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
                <tr v-if="salesRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 bg-white">No sales-side variance rows found.</td>
                </tr>
                <tr v-for="(row, i) in salesRows" :key="`sales-${i}`" class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 text-gray-700">{{ row.entry_date }}</td>
                  <td class="py-3 px-4 text-gray-700 font-medium">{{ row.ledger_name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ row.voucher_no }}</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': salesState[i].applied && salesState[i].adjust}">{{ row.amount }}</span>
                    <span v-if="salesState[i].applied && salesState[i].adjust" class="font-bold text-[#058a64]">{{ salesState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="salesState[i].selected" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="salesState[i].adjust" :placeholder="salesState[i].selected ? '0.00' : 'Select to adjust'" :class="salesState[i].selected ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!salesState[i].selected"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="salesState[i].selected && !salesState[i].applied" @click="salesState[i].applied = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center">
                      Apply
                    </button>
                    <button v-else-if="salesState[i].selected && salesState[i].applied" @click="salesState[i].applied = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Receipt - Unrecorded Transactions -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Receipt - Unrecorded Transactions</h3>
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
                <tr v-if="receiptRows.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 bg-white">No unrecorded receipt rows found.</td>
                </tr>
                <tr v-for="(row, i) in receiptRows" :key="`receipt-${i}`" class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 text-gray-700">{{ row.entry_date }}</td>
                  <td class="py-3 px-4 text-gray-700 font-medium">{{ row.ledger_name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ row.voucher_no }}</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': receiptState[i].applied && receiptState[i].adjust}">{{ row.amount }}</span>
                    <span v-if="receiptState[i].applied && receiptState[i].adjust" class="font-bold text-[#058a64]">{{ receiptState[i].adjust }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="receiptState[i].selected" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="receiptState[i].adjust" :placeholder="receiptState[i].selected ? '0.00' : 'Select to adjust'" :class="receiptState[i].selected ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!receiptState[i].selected"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="receiptState[i].selected && !receiptState[i].applied" @click="receiptState[i].applied = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center">
                      Apply
                    </button>
                    <button v-else-if="receiptState[i].selected && receiptState[i].applied" @click="receiptState[i].applied = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end items-center gap-4">
        <button @click="closeModal" class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
          Cancel
        </button>
        <button @click="submitAction('ignore')" :disabled="actionLoading" class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
          Ignore
        </button>
        <button @click="submitAction('resolve')" :disabled="actionLoading || !data.alert_id" class="px-4 py-1.5 bg-[#058a64] hover:bg-[#047857] text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          Mark Resolved
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

const salesRows = computed(() => props.data?.Vouchers?.['Potential reason for variance - Sales'] ?? []);
const receiptRows = computed(() => props.data?.Vouchers?.['Receipt - Unrecorded Transactions'] ?? []);

const salesState = ref([]);
const receiptState = ref([]);

const resetRowState = (rows) => rows.map(() => ({ selected: false, adjust: '', applied: false }));

watch(salesRows, (rows) => { salesState.value = resetRowState(rows); }, { immediate: true });
watch(receiptRows, (rows) => { receiptState.value = resetRowState(rows); }, { immediate: true });

const formatAmount = (v) => Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const closeModal = () => emit('close');

const actionLoading = ref(false);
const submitAction = async (type) => {
  if (!props.data.alert_id) { emit('close'); return; }
  actionLoading.value = true;
  try {
    await useApi(`/alerts/${props.data.alert_id}/action`, {
      method: 'POST',
      body: { type, action_by: 'Dashboard' },
    });
    emit('resolved');
  } finally {
    actionLoading.value = false;
  }
};
</script>

<style scoped>
/* Additional component-specific styling if needed */
</style>
