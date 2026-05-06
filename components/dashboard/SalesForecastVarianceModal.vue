<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
              SALES FORCAST VARIANCE
            </div>
            <p class="text-sm text-gray-500 mt-2 max-w-2xl">
              Reconcile discrepancies between forecasted values and signed contract amounts
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per TB (Total Sales)</label>
              <input type="text" value="3,854,920.00" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Balance as per sales forcast</label>
              <input type="text" value="3,804,170.00" readonly class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variance</label>
              <input type="text" value="50,750.00" readonly class="w-full bg-[#fef2f2] border border-[#fca5a5] text-red-600 rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AED 50,750.00 variance remaining — select and adjust items below.
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-4 space-y-8">

        <!-- Section 1 -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Reason for variance sales @100%</h3>
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
                <!-- Row 1 -->
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Dubai Steel Suppliers</td>
                  <td class="py-3 px-4 text-gray-600">BILL-2025-567</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedS1_1 && adjustS1_1}">32000</span>
                    <span v-if="appliedS1_1 && adjustS1_1" class="font-bold text-[#058a64]">{{ adjustS1_1 }}</span>
                  </td>
                  <td class="py-3 px-4 text-center"><input type="checkbox" v-model="selectedS1_1" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustS1_1" :placeholder="selectedS1_1 ? '0.00' : 'Select to adjust'" :class="selectedS1_1 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedS1_1"/>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <button v-if="selectedS1_1 && !appliedS1_1" @click="appliedS1_1 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center cursor-pointer">
                      Apply
                    </button>
                    <button v-else-if="selectedS1_1 && appliedS1_1" @click="appliedS1_1 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
                <!-- Row 2 -->
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Al Ain Construction Materials</td>
                  <td class="py-3 px-4 text-gray-600">BILL-2025-589</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedS1_2 && adjustS1_2}">18750</span>
                    <span v-if="appliedS1_2 && adjustS1_2" class="font-bold text-[#058a64]">{{ adjustS1_2 }}</span>
                  </td>
                  <td class="py-3 px-4 text-center"><input type="checkbox" v-model="selectedS1_2" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustS1_2" :placeholder="selectedS1_2 ? '0.00' : 'Select to adjust'" :class="selectedS1_2 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedS1_2"/>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <button v-if="selectedS1_2 && !appliedS1_2" @click="appliedS1_2 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center cursor-pointer">
                      Apply
                    </button>
                    <button v-else-if="selectedS1_2 && appliedS1_2" @click="appliedS1_2 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
                <!-- Summary Row -->
                <tr class="bg-[#6ee7b7] text-gray-800">
                  <td colspan="3" class="py-3 px-4 text-center font-bold">Total sales</td>
                  <td class="py-3 px-4 font-bold">18750</td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2 -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Sales @ 90% and less</h3>
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
                <!-- Row 1 -->
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Dubai Steel Suppliers</td>
                  <td class="py-3 px-4 text-gray-600">BILL-2025-567</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedS2_1 && adjustS2_1}">32000</span>
                    <span v-if="appliedS2_1 && adjustS2_1" class="font-bold text-[#058a64]">{{ adjustS2_1 }}</span>
                  </td>
                  <td class="py-3 px-4 text-center"><input type="checkbox" v-model="selectedS2_1" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustS2_1" :placeholder="selectedS2_1 ? '0.00' : 'Select to adjust'" :class="selectedS2_1 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedS2_1"/>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <button v-if="selectedS2_1 && !appliedS2_1" @click="appliedS2_1 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center cursor-pointer">
                      Apply
                    </button>
                    <button v-else-if="selectedS2_1 && appliedS2_1" @click="appliedS2_1 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
                <!-- Row 2 -->
                <tr class="hover:bg-gray-50 transition-colors bg-white">
                  <td class="py-3 px-4 flex items-center gap-2 text-gray-700">15-03-2025 <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></td>
                  <td class="py-3 px-4 text-gray-700 font-medium">Al Ain Construction Materials</td>
                  <td class="py-3 px-4 text-gray-600">BILL-2025-589</td>
                  <td class="py-3 px-4 text-gray-700">
                    <span :class="{'line-through text-gray-400 mr-2': appliedS2_2 && adjustS2_2}">18750</span>
                    <span v-if="appliedS2_2 && adjustS2_2" class="font-bold text-[#058a64]">{{ adjustS2_2 }}</span>
                  </td>
                  <td class="py-3 px-4 text-center"><input type="checkbox" v-model="selectedS2_2" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" style="background: white !important; color-scheme: light !important;" /></td>
                  <td class="py-2 px-4">
                    <input type="text" v-model="adjustS2_2" :placeholder="selectedS2_2 ? '0.00' : 'Select to adjust'" :class="selectedS2_2 ? 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300'" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!selectedS2_2"/>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <button v-if="selectedS2_2 && !appliedS2_2" @click="appliedS2_2 = true" class="bg-[#058a64] hover:bg-[#047857] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center cursor-pointer">
                      Apply
                    </button>
                    <button v-else-if="selectedS2_2 && appliedS2_2" @click="appliedS2_2 = false" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-24 flex items-center justify-center gap-1 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Applied
                    </button>
                  </td>
                </tr>
                <!-- Summary Row -->
                <tr class="bg-[#6ee7b7] text-gray-800">
                  <td colspan="3" class="py-3 px-4 text-center font-bold">Total sales</td>
                  <td class="py-3 px-4 font-bold">18750</td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3 -->
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
                  <th class="py-3 px-4 font-medium w-24 text-center">Select</th>
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
                    <div class="relative">
                      <input type="text" v-model="entry.date" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64]" />
                      <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  </td>
                  <td class="py-2 px-2">
                    <div class="relative">
                      <select v-model="entry.partyName" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#058a64] appearance-none cursor-pointer">
                        <option value="" disabled>Enter vendor name</option>
                        <option value="Dubai Steel">Dubai Steel</option>
                        <option value="Al Ain Construction">Al Ain Construction</option>
                      </select>
                      <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.invoiceNumber" placeholder="Enter bill number" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2">
                    <input type="text" v-model="entry.amount" placeholder="0.00" class="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-gray-600 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64] placeholder-gray-400" />
                  </td>
                  <td class="py-2 px-2 text-center">
                    <input type="checkbox" v-model="entry.isSelected" class="w-4 h-4 rounded border-gray-300 bg-white text-[#058a64] focus:ring-[#058a64] cursor-pointer" style="background: white !important; color-scheme: light !important;" />
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
        <button @click="closeModal" class="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer">
          Cancel
        </button>
        <button class="px-8 py-2 bg-[#a3dcc8] text-white rounded-lg font-medium transition-colors text-sm cursor-pointer">
          Close
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

const selectedS1_1 = ref(false);
const selectedS1_2 = ref(false);
const selectedS2_1 = ref(false);
const selectedS2_2 = ref(false);

const appliedS1_1 = ref(false);
const appliedS1_2 = ref(false);
const appliedS2_1 = ref(false);
const appliedS2_2 = ref(false);

const adjustS1_1 = ref('');
const adjustS1_2 = ref('');
const adjustS2_1 = ref('');
const adjustS2_2 = ref('');

const manualEntries = ref([]);

const addManualEntry = () => {
  manualEntries.value.push({
    date: '15-03-2025',
    partyName: '',
    invoiceNumber: '',
    amount: '',
    isSelected: false
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
