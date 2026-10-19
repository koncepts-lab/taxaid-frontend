<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="rounded-2xl mt-auto md:mt-0 h-[90vh] md:h-[82vh] max-h-[900px] w-[96vw] md:w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Header & Summary -->
      <div class="shrink-0 border-b shadow-sm" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'">
        <div class="px-4 md:px-6 py-4 flex justify-between items-start border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div>
            <div class="flex items-center gap-2 text-lg md:text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">
              <svg class="w-6 h-6 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              {{ cfg.title }}
            </div>
            <p class="text-sm mt-2 max-w-2xl" :class="isDark ? 'text-white/60' : 'text-gray-500'">
              {{ cfg.subtitle }}
            </p>
          </div>
          <button @click="closeModal" class="transition-colors cursor-pointer" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="px-4 md:px-6 py-4">
          <div class="border rounded-xl p-4 flex flex-col md:flex-row gap-4 mb-3" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eefdf6] border-[#a7f3d0]'">
            <div class="flex-1 min-w-0">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ cfg.tbLabel }}</label>
              <input type="text" :value="`${code} ${formatAmount(balanceTB)}`" readonly class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'" />
            </div>
            <div class="flex-1 min-w-0">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ cfg.reportLabel }}</label>
              <input type="text" :value="`${code} ${formatAmount(balanceReport)}`" readonly class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'" />
            </div>
            <div class="flex-1 min-w-0">
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

      <!-- Tabs + active section title, same row -->
      <div class="shrink-0 px-4 md:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <div class="flex items-center gap-2">
          <button v-for="tab in visibleTabs" :key="tab.key" @click="activeTab = tab.key"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            :class="activeTab === tab.key
              ? (isDark ? 'bg-white/10 text-white' : 'bg-[#eefdf6] text-[#047857]')
              : (isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-700')">
            {{ tab.label }}
            <span v-if="tab.count" class="text-xs px-1.5 py-0.5 rounded-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'">{{ tab.count }}</span>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <!-- <h3 class="text-base font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ activeTabHeading }}</h3> -->
          <button v-if="activeTab === 'manual'" @click="addManualEntry" class="bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Manual Entry Row
          </button>
        </div>
      </div>

      <!-- Content: the only scroll region -->
      <div class="flex-1 overflow-y-auto overflow-x-auto px-4 md:px-6 pb-6" :class="isDark ? 'text-white' : ''">

        <div v-show="activeTab === 'primary' || activeTab === 'secondary'">
          <table class="w-full text-left border-separate border-spacing-0 min-w-[760px]">
            <thead>
              <tr class="text-white text-sm">
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium rounded-tl-lg">Date</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">Party Name</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ cfg.refColumnLabel }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">Amount ({{ code }})</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">Select</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">Adjustments ({{ code }})</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="voucherRows.length === 0">
                <td colspan="7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">{{ voucherEmptyMessage }}</td>
              </tr>
              <tr v-for="(row, i) in voucherRows" :key="`${activeTab}-${i}`" class="transition-colors" :class="isDark ? 'hover:bg-white/5 bg-[#002e26]' : 'hover:bg-gray-50 bg-white'">
                <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ rowDate(row) }}</td>
                <td class="py-3 px-4 font-medium" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                  {{ rowParty(row) }}
                  <span v-if="vendorDiff(rowParty(row))" class="block text-xs font-normal" :class="isDark ? 'text-white/40' : 'text-gray-400'">needs {{ formatAmount(vendorDiff(rowParty(row))) }}</span>
                </td>
                <td class="py-3 px-4" :class="isDark ? 'text-white/60' : 'text-gray-600'">{{ rowRef(row) }}</td>
                <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                  <span :class="{'line-through text-gray-400 mr-2': voucherState[i].selected && voucherState[i].adjust}">{{ rowAmount(row) }}</span>
                  <span v-if="voucherState[i].selected && voucherState[i].adjust" class="font-bold text-[#058a64]">{{ voucherState[i].adjust }}</span>
                </td>
                <td class="py-3 px-4"><input type="checkbox" v-model="voucherState[i].selected" @change="onRowToggle(voucherState[i])" class="w-4 h-4 rounded text-[#058a64] focus:ring-[#058a64]" :class="isDark ? 'border-white/20 bg-[#002e26]' : 'border-gray-300 bg-white'" /></td>
                <td class="py-2 px-4">
                  <input type="text" v-model="voucherState[i].adjust" :placeholder="voucherState[i].selected ? String(rowAmount(row)) : 'Select to adjust'" :class="voucherState[i].selected ? (isDark ? 'bg-white/10 rounded-md py-1.5 px-3 text-right text-white' : 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800') : (isDark ? 'bg-transparent disabled:bg-transparent p-0 text-white/30 placeholder-white/20' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300')" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!voucherState[i].selected"/>
                </td>
                <td class="py-2 px-4">
                  <span v-if="voucherState[i].selected" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 flex items-center justify-center gap-1">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Applied
                  </span>
                </td>
              </tr>
              <tr v-if="cfg.showTotalRow && voucherRows.length > 0" class="bg-[#a7f3d0] font-bold text-gray-800">
                <td colspan="3" class="py-3 px-4 text-right">{{ cfg.totalRowLabel }}</td>
                <td class="py-3 px-4">{{ code }} {{ formatAmount(selectedVoucherTotal) }}</td>
                <td colspan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-show="activeTab === 'manual'">
          <table class="w-full text-left border-separate border-spacing-0 min-w-[900px]">
            <thead>
              <tr class="text-white text-sm">
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-40 rounded-tl-lg">Date</th>
                <th v-if="isSF" class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-auto">Project Name</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-auto">Party Name</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-36">Invoice Number</th>
                <th v-if="!isSF" class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-28">Credit Days</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-32">Amount ({{ code }})</th>
                <th v-if="!isSF" class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-44">Type</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-32 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="manualEntries.length === 0">
                <td :colspan="isSF ? 6 : 7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">
                  No manual entries. Click "Add Manual Entry Row" to add one.
                </td>
              </tr>
              <tr v-for="(entry, index) in manualEntries" :key="index" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                <td class="py-2 px-2">
                  <CommonDateField v-model="entry.date" format="dmy" size="sm" allow-future />
                </td>
                <td v-if="isSF" class="py-2 px-2">
                  <input type="text" v-model="entry.projectName" placeholder="Enter project name" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td class="py-2 px-2">
                  <CommonSelectDropdown v-if="!isSF" v-model="entry.partyName" mode="select" size="sm" searchable :dark="isDark"
                    :placeholder="cfg.partyPlaceholder" :options="partyOptions" @update:model-value="onEntryPartyChange(entry)" />
                  <input v-else type="text" v-model="entry.partyName" placeholder="Enter customer name" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td class="py-2 px-2">
                  <CommonSelectDropdown v-if="!isSF" v-model="entry.invoiceNumber" mode="select" size="sm" searchable :dark="isDark"
                    placeholder="Select invoice" :options="invoiceOptionsFor(entry.partyName)" :disabled="!entry.partyName" />
                  <input v-else type="text" v-model="entry.invoiceNumber" placeholder="Enter invoice number" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td v-if="!isSF" class="py-2 px-2">
                  <input type="text" v-model="entry.creditDays" placeholder="e.g., 30" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td class="py-2 px-2">
                  <input type="text" v-model="entry.amount" placeholder="0.00" class="w-full border rounded-md py-1.5 px-3 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td v-if="!isSF" class="py-2 px-2">
                  <div class="flex items-center gap-2">
                    <button type="button" @click="entry.type = cfg.primaryType" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="entry.type === cfg.primaryType ? 'bg-[#058a64] text-white' : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
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

      <!-- Footer -->
      <div class="shrink-0 px-4 md:px-6 py-4 border-t flex flex-wrap justify-end items-center gap-3" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white'">
        <p v-if="errorMessage" class="text-sm text-red-500 mr-auto">{{ errorMessage }}</p>
        <button @click="closeModal" class="px-4 py-1.5 border rounded-lg font-medium transition-colors text-sm" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          Cancel
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
  side: { type: String, required: true },
  data: { type: Object, required: true },
  date: { type: String, default: null },
});
const emit = defineEmits(['close', 'resolved']);

const SIDE_CONFIG = {
  ap: {
    code: 'AP',
    title: 'AP VARIANCE RECONCILIATION',
    subtitle: 'Reconcile differences between Trial Balance and AP Report. All variances must be resolved to zero before posting.',
    tbLabel: 'Balance as per TB',
    reportKey: 'Balance as per AP report',
    reportLabel: 'Balance as per AP report',
    primaryKey: 'Potential reason for variance - Purchase',
    secondaryKey: 'Payment - Unrecorded Transactions',
    primaryLabel: 'Purchase',
    secondaryLabel: 'Payment',
    refColumnLabel: 'Voucher No.',
    partyPlaceholder: 'Select vendor',
    primaryType: 'purchase',
    bulkEndpoint: '/adjustments/ap/bulk',
    typeField: 'transaction_type',
  },
  ar: {
    code: 'AR',
    title: 'AR VARIANCE RECONCILIATION',
    subtitle: 'Reconcile differences between Trial Balance and AR Report. All variances must be resolved to zero before posting.',
    tbLabel: 'Balance as per TB',
    reportKey: 'Balance as per AR report',
    reportLabel: 'Balance as per AR report',
    primaryKey: 'Potential reason for variance - Sales',
    secondaryKey: 'Receipt - Unrecorded Transactions',
    primaryLabel: 'Sales',
    secondaryLabel: 'Receipt',
    refColumnLabel: 'Voucher No.',
    partyPlaceholder: 'Select customer',
    primaryType: 'sales',
    bulkEndpoint: '/adjustments/ar/bulk',
    typeField: 'type',
  },
  'sales-forecast': {
    code: 'SF',
    title: 'SALES FORECAST VARIANCE',
    subtitle: 'Reconcile discrepancies between forecasted values and actual invoiced revenue.',
    tbLabel: 'Actual Revenue (Invoiced)',
    reportLabel: 'Balance as per sales forecast',
    primaryLabel: 'Reason for variance',
    refColumnLabel: 'Invoice Number',
    showTotalRow: true,
    totalRowLabel: 'Total sales',
  },
};
const isSF = computed(() => props.side === 'sales-forecast');
const cfg = computed(() => SIDE_CONFIG[props.side]);

const partyOptions = ref([]);
const invoicesByParty = ref({});

const loadPartyOptions = async () => {
  if (isSF.value) return;
  try {
    const res = await useApi('/adjustments/parties', { params: { side: props.side } });
    partyOptions.value = res?.data ?? [];
  } catch (e) { /* non-fatal — dropdown just stays empty */ }
};
loadPartyOptions();

const loadInvoicesForParty = async (partyName) => {
  if (!partyName || invoicesByParty.value[partyName]) return;
  try {
    const res = await useApi('/adjustments/invoices', { params: { side: props.side, party_name: partyName } });
    invoicesByParty.value = { ...invoicesByParty.value, [partyName]: res?.data ?? [] };
  } catch (e) { /* non-fatal */ }
};

const invoiceOptionsFor = (partyName) => (invoicesByParty.value[partyName] || []).map((inv) => inv.invoice_number).filter(Boolean);

const onEntryPartyChange = (entry) => {
  entry.invoiceNumber = '';
  loadInvoicesForParty(entry.partyName);
};

const currentLang = useState('currentLang', () => 'en');
const { isDark } = useTheme();
const { code } = useCurrency();

const baseBalanceTB = ref(0);
const baseBalanceReport = ref(0);
const baseVariance = ref(0);

watch(() => props.data, (d) => {
  if (isSF.value) {
    baseBalanceTB.value = Number(d?.actual_revenue ?? 0);
    baseBalanceReport.value = Number(d?.forecasted_revenue ?? 0);
    baseVariance.value = Math.abs(baseBalanceTB.value - baseBalanceReport.value);
    return;
  }
  baseBalanceTB.value = Number(d?.['Balance as per TB'] ?? 0);
  baseBalanceReport.value = Number(d?.[cfg.value.reportKey] ?? 0);
  baseVariance.value = Number(d?.['Variance'] ?? 0);
}, { immediate: true });

const primaryRows = computed(() => isSF.value ? (props.data?.reasons ?? []) : (props.data?.Vouchers?.[cfg.value.primaryKey] ?? []));
const secondaryRows = computed(() => isSF.value ? [] : (props.data?.Vouchers?.[cfg.value.secondaryKey] ?? []));
const vendorDiffs = computed(() => props.data?.VendorDiffs ?? {});
const vendorDiff = (ledgerName) => vendorDiffs.value[ledgerName] ? Math.abs(Number(vendorDiffs.value[ledgerName])) : 0;

const rowDate = (row) => isSF.value ? row['Date'] : row.entry_date;
const rowParty = (row) => isSF.value ? row['Party Name'] : row.ledger_name;
const rowRef = (row) => isSF.value ? row['Invoice Number'] : row.voucher_no;
const rowAmount = (row) => isSF.value ? row['Amount'] : row.amount;

const visibleTabs = computed(() => {
  const tabs = [];
  if (primaryRows.value.length) tabs.push({ key: 'primary', label: cfg.value.primaryLabel, count: primaryRows.value.length });
  if (secondaryRows.value.length) tabs.push({ key: 'secondary', label: cfg.value.secondaryLabel, count: secondaryRows.value.length });
  tabs.push({ key: 'manual', label: 'Manual Entry', count: 0 });
  return tabs;
});
const activeTab = ref(null);
watch(visibleTabs, (tabs) => {
  if (!tabs.some((t) => t.key === activeTab.value)) {
    activeTab.value = tabs[0]?.key ?? 'manual';
  }
}, { immediate: true });

const activeTabHeading = computed(() => {
  if (activeTab.value === 'primary') return `${cfg.value.primaryLabel} variance`;
  if (activeTab.value === 'secondary') return `${cfg.value.secondaryLabel} - Unrecorded Transactions`;
  return 'Manual entry - Adjustments';
});

const primaryState = ref([]);
const secondaryState = ref([]);

const resetRowState = (rows) => rows.map(() => ({ selected: false, adjust: '', applied: false }));

watch(primaryRows, (rows) => { primaryState.value = resetRowState(rows); }, { immediate: true });
watch(secondaryRows, (rows) => { secondaryState.value = resetRowState(rows); }, { immediate: true });

const voucherRows = computed(() => activeTab.value === 'secondary' ? secondaryRows.value : primaryRows.value);
const voucherState = computed(() => activeTab.value === 'secondary' ? secondaryState.value : primaryState.value);
const voucherEmptyMessage = computed(() => {
  if (isSF.value) return 'No forecast rows found for this date.';
  return activeTab.value === 'secondary'
    ? `No unrecorded ${cfg.value.secondaryLabel.toLowerCase()} rows found.`
    : `No ${cfg.value.primaryLabel.toLowerCase()}-side variance rows found.`;
});
const selectedVoucherTotal = computed(() =>
  voucherRows.value.reduce((sum, row, i) => voucherState.value[i]?.selected
    ? sum + toNumber(voucherState.value[i].adjust || rowAmount(row))
    : sum, 0)
);

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

const onRowToggle = (rowState) => {
  if (!rowState.selected) rowState.adjust = '';
};

const manualEntries = ref([]);

const addManualEntry = () => {
  if (isSF.value) {
    manualEntries.value.push({ date: '', projectName: '', partyName: '', invoiceNumber: '', amount: '' });
    return;
  }
  manualEntries.value.push({ date: '', partyName: '', invoiceNumber: '', creditDays: '', amount: '', type: cfg.value.primaryType });
};

const removeManualEntry = (index) => manualEntries.value.splice(index, 1);

const validManualEntries = computed(() => isSF.value
  ? manualEntries.value.filter((e) => e.partyName && e.date && e.invoiceNumber && toNumber(e.amount))
  : manualEntries.value.filter((e) => e.partyName && e.date && toNumber(e.amount))
);

const balanceTB = computed(() => baseBalanceTB.value);

const balanceReport = computed(() => {
  if (isSF.value) {
    let total = baseBalanceReport.value;
    primaryRows.value.forEach((row, i) => {
      if (primaryState.value[i]?.selected) {
        total += toNumber(primaryState.value[i].adjust || rowAmount(row)) - toNumber(rowAmount(row));
      }
    });
    validManualEntries.value.forEach((e) => { total += toNumber(e.amount); });
    return total;
  }
  let total = baseBalanceReport.value;
  primaryRows.value.forEach((row, i) => {
    if (primaryState.value[i]?.selected) total += toNumber(primaryState.value[i].adjust || row.amount);
  });
  secondaryRows.value.forEach((row, i) => {
    if (secondaryState.value[i]?.selected) total -= toNumber(secondaryState.value[i].adjust || row.amount);
  });
  validManualEntries.value.forEach((e) => {
    const amt = toNumber(e.amount);
    total += e.type === 'return' ? -amt : amt;
  });
  return total;
});

const variance = computed(() => {
  if (isSF.value) return Math.abs(balanceTB.value - balanceReport.value);
  let resolved = 0;
  primaryRows.value.forEach((row, i) => {
    if (primaryState.value[i]?.selected) resolved += toNumber(primaryState.value[i].adjust || row.amount);
  });
  secondaryRows.value.forEach((row, i) => {
    if (secondaryState.value[i]?.selected) resolved += toNumber(secondaryState.value[i].adjust || row.amount);
  });
  validManualEntries.value.forEach((e) => { resolved += toNumber(e.amount); });
  return baseVariance.value - resolved;
});

const isResolved = computed(() => Math.abs(Number(variance.value)) < 0.005);

const actionLoading = ref(false);

const appliedAdjustments = computed(() => {
  if (isSF.value) {
    const selectedRows = primaryRows.value.filter((_, i) => primaryState.value[i]?.selected);
    return [...selectedRows, ...validManualEntries.value];
  }
  const collect = (rows, state, type) => rows
    .map((row, i) => ({ row, state: state[i] }))
    .filter(({ state: s }) => s?.selected)
    .map(({ row, state: s }) => ({
      party_name: row.ledger_name,
      invoice_number: row.voucher_no || null,
      date: toApiDate(row.entry_date),
      adjustment: toNumber(s.adjust || row.amount),
      credit_days: null,
      [cfg.value.typeField]: type,
    }));
  const manual = validManualEntries.value.map((e) => ({
    party_name: e.partyName,
    invoice_number: e.invoiceNumber || null,
    date: toApiDate(e.date),
    adjustment: toNumber(e.amount),
    credit_days: e.creditDays !== '' ? parseInt(e.creditDays, 10) || 0 : null,
    [cfg.value.typeField]: e.type,
  }));
  return [
    ...collect(primaryRows.value, primaryState.value, cfg.value.primaryType),
    ...collect(secondaryRows.value, secondaryState.value, 'return'),
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

const postVariance = async () => {
  errorMessage.value = '';
  actionLoading.value = true;
  try {
    if (isSF.value) {
      for (let i = 0; i < primaryRows.value.length; i++) {
        if (!primaryState.value[i]?.selected) continue;
        const row = primaryRows.value[i];
        await useApi('/data-source/sales-forecast/update-adjustments', {
          method: 'POST',
          body: {
            date: row['Date'],
            party_name: row['Party Name'],
            invoice_number: row['Invoice Number'],
            original_invoice_number: row['Invoice Number'],
            amount: row['Amount'],
            adjustments: toNumber(primaryState.value[i].adjust || row['Amount']),
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
    } else {
      await useApi(cfg.value.bulkEndpoint, {
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

</script>
