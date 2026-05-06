<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
              <input type="text" value="3,854,920.00" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per AR report</label>
              <input type="text" value="3,804,170.00" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variance</label>
              <input type="text" value="50,750.00" readonly class="w-full bg-[#fef2f2] border border-[#fca5a5] text-red-600 rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AED 50,750.00 variance remaining - Select items below to resolve the variance.
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-4 space-y-8">

        <!-- Section 1 -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Potential reason for variance - Sales</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Invoice Number</th>
                  <th class="py-3 px-4 font-medium">Credit Days</th>
                  <th class="py-3 px-4 font-medium">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium">Select</th>
                  <th class="py-3 px-4 font-medium">Adjustments (AED)</th>
                  <th class="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Dubai Steel Suppliers</td>
                  <td class="py-3 px-4 text-gray-600">INV-2025-567</td>
                  <td class="py-3 px-4 text-gray-600">-</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedPurchase1 && adjustPurchase1}">32000</span>
                    <span v-if="appliedPurchase1 && adjustPurchase1" class="font-bold text-[#058a64]">{{ adjustPurchase1 }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="selectedPurchase1" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustPurchase1" :placeholder="selectedPurchase1 ? '0.00' : 'Select to adjust'" :class="selectedPurchase1 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedPurchase1"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="selectedPurchase1 && !appliedPurchase1" @click="appliedPurchase1 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center">
                      Apply
                    </button>
                    <button v-else-if="selectedPurchase1 && appliedPurchase1" @click="appliedPurchase1 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Al Ain Construction Materials</td>
                  <td class="py-3 px-4 text-gray-600">INV-2025-589</td>
                  <td class="py-3 px-4 text-gray-600">-</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedPurchase2 && adjustPurchase2}">18750</span>
                    <span v-if="appliedPurchase2 && adjustPurchase2" class="font-bold text-[#058a64]">{{ adjustPurchase2 }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="selectedPurchase2" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustPurchase2" :placeholder="selectedPurchase2 ? '0.00' : 'Select to adjust'" :class="selectedPurchase2 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedPurchase2"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="selectedPurchase2 && !appliedPurchase2" @click="appliedPurchase2 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center">
                      Apply
                    </button>
                    <button v-else-if="selectedPurchase2 && appliedPurchase2" @click="appliedPurchase2 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2 -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Receipts - Unrecorded Transactions</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#058a64] text-white text-sm">
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Party Name</th>
                  <th class="py-3 px-4 font-medium">Invoice Number</th>
                  <th class="py-3 px-4 font-medium">Credit Days</th>
                  <th class="py-3 px-4 font-medium">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium">Select</th>
                  <th class="py-3 px-4 font-medium">Adjustments (AED)</th>
                  <th class="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Dubai Steel Suppliers</td>
                  <td class="py-3 px-4 text-gray-600">INV-2025-567</td>
                  <td class="py-3 px-4 text-gray-600">-</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedPayment1 && adjustPayment1}">32000</span>
                    <span v-if="appliedPayment1 && adjustPayment1" class="font-bold text-[#058a64]">{{ adjustPayment1 }}</span>
                  </td>
                  <td class="py-3 px-4"><input type="checkbox" v-model="selectedPayment1" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustPayment1" :placeholder="selectedPayment1 ? '0.00' : 'Select to adjust'" :class="selectedPayment1 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedPayment1"/>
                  </td>
                  <td class="py-2 px-4">
                    <button v-if="selectedPayment1 && !appliedPayment1" @click="appliedPayment1 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center">
                      Apply
                    </button>
                    <button v-else-if="selectedPayment1 && appliedPayment1" @click="appliedPayment1 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3 -->
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
                  <th class="py-3 px-4 font-medium w-56">Date</th>
                  <th class="py-3 px-4 font-medium w-auto">Party Name</th>
                  <th class="py-3 px-4 font-medium w-32">Invoice Number</th>
                  <th class="py-3 px-4 font-medium w-28">Credit Days</th>
                  <th class="py-3 px-4 font-medium w-32">Amount (AED)</th>
                  <th class="py-3 px-4 font-medium w-48">Sales / Return</th>
                  <th class="py-3 px-4 font-medium w-24 text-center">Action</th>
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
                    <div class="relative">
                      <input type="text" v-model="entry.date" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64]" />
                      <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.partyName" placeholder="Enter vendor name" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.invoiceNumber" placeholder="Enter invoice number" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.creditDays" placeholder="Enter Credit Days" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.amount" placeholder="0.00" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <div class="flex items-center gap-3">
                      <label class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="entry.isSales" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" style="background: white !important; color-scheme: light !important;" />
                        <span class="text-gray-600">Sales</span>
                      </label>
                      <label class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="entry.isReturn" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64]" style="background: white !important; color-scheme: light !important;" />
                        <span class="text-gray-600">Return</span>
                      </label>
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
      <div class="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end items-center gap-4">
        <button @click="closeModal" class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
          Cancel
        </button>
        <button class="px-4 py-1.5 bg-[#a3dcc8] text-white rounded-lg font-medium cursor-not-allowed text-sm">
          Post Variance
        </button>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(true); // Open by default when mounted based on user request
const currentLang = useState('currentLang', () => 'en')

const selectedPurchase1 = ref(false);
const selectedPurchase2 = ref(false);
const selectedPayment1 = ref(false);

const appliedPurchase1 = ref(false);
const appliedPurchase2 = ref(false);
const appliedPayment1 = ref(false);

const adjustPurchase1 = ref('');
const adjustPurchase2 = ref('');
const adjustPayment1 = ref('');

const manualEntries = ref([]);

const addManualEntry = () => {
  manualEntries.value.push({
    date: '15-03-2025',
    partyName: '',
    invoiceNumber: '',
    creditDays: '',
    amount: '',
    isSales: false,
    isReturn: false
  });
};

const removeManualEntry = (index) => {
  manualEntries.value.splice(index, 1);
};

const closeModal = () => {
  isOpen.value = false;
};

// Expose a way to open/close it if needed
defineExpose({
  isOpen,
  closeModal
});
</script>

<style scoped>
/* Additional component-specific styling if needed */
</style>
