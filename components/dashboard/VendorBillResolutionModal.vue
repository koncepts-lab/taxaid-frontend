<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100000] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="rounded-2xl mt-auto md:mt-0 h-[90vh] md:h-[82vh] max-h-[860px] w-[96vw] md:w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <div class="shrink-0 px-4 md:px-6 py-4 flex justify-between items-start border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div>
            <div class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ partyName }}</div>
            <p class="text-sm mt-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ labels.subtitle }}</p>
          </div>
          <button @click="$emit('close')" class="transition-colors" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="shrink-0 px-4 md:px-6 pt-4 pb-3 flex flex-col sm:flex-row gap-3">
          <div class="flex-1 border rounded-xl p-3" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eefdf6] border-[#a7f3d0]'">
            <label class="block text-xs font-semibold mb-1" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ tbLabel }}</label>
            <div class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ code }} {{ formatCurrency(tbBalance) }}</div>
          </div>
          <div class="flex-1 border rounded-xl p-3" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eefdf6] border-[#a7f3d0]'">
            <label class="block text-xs font-semibold mb-1" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ labels.currentReportLabel }}</label>
            <div class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ code }} {{ formatCurrency(liveReportBalance) }}</div>
          </div>
          <div class="flex-1 border rounded-xl p-3" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eefdf6] border-[#a7f3d0]'">
            <label class="block text-xs font-semibold mb-1" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ labels.variance }}</label>
            <div class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ code }} {{ formatCurrency(liveVariance) }}</div>
          </div>
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 pt-4 pb-4" :class="isDark ? 'text-white' : ''">

          <div>
          <h3 class="text-sm font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-800'">{{ labels.invoicesHeading }}</h3>

          <div v-if="loading" class="space-y-2.5">
            <div v-for="n in 3" :key="n" class="h-10 rounded-lg animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100'"></div>
          </div>

          <table v-else class="w-full table-fixed text-left border-separate border-spacing-0 min-w-[700px]">
            <colgroup>
              <col style="width:22%"><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:14%">
            </colgroup>
            <thead>
              <tr class="text-white text-sm">
                <th class="bg-[#058a64] py-2.5 px-3 font-medium rounded-ss-lg">{{ labels.billNo }}</th>
                <th class="bg-[#058a64] py-2.5 px-3 font-medium">{{ labels.currentAmount }}</th>
                <th class="bg-[#058a64] py-2.5 px-3 font-medium">{{ labels.adjustment }}</th>
                <th class="bg-[#058a64] py-2.5 px-3 font-medium">{{ labels.afterAdjustment }}</th>
                <th class="bg-[#058a64] py-2.5 px-3 font-medium text-center">{{ labels.markPaid }}</th>
                <th class="bg-[#058a64] py-2.5 px-3 font-medium rounded-se-lg text-center">{{ labels.action }}</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="rows.length === 0">
                <td colspan="6" class="py-6 px-3 text-center" :class="isDark ? 'text-white/50' : 'text-gray-500'">
                  {{ labels.empty }}
                </td>
              </tr>
              <tr v-for="(row, i) in rows" :key="i" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                <td class="py-2 px-3">
                  <span v-if="row.isNew" class="inline-block mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    :class="row.isAdvance ? (isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-700') : (isDark ? 'bg-[#058a64]/20 text-[#6ee7b7]' : 'bg-[#eefdf6] text-[#047857]')">
                    {{ row.isAdvance ? labels.tagAdvance : labels.tagNewInvoice }}
                  </span>
                  <input v-if="row.isNew" type="text" v-model="row.invoice_number" :placeholder="labels.invoicePlaceholder"
                    class="w-full border rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-1"
                    :class="isDuplicateRow(i)
                      ? 'border-red-400 focus:ring-red-400 bg-red-500/10 text-red-500'
                      : (isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30 focus:ring-[#058a64]' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400 focus:ring-[#058a64]')" />
                  <span v-else class="flex items-center gap-1.5" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                    {{ row.invoice_number || '—' }}
                    <span v-if="row.description" class="group relative inline-flex">
                      <svg class="w-3.5 h-3.5 cursor-help" :class="isDark ? 'text-white/40' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span class="hidden group-hover:block absolute z-10 left-0 top-full mt-1 w-56 p-2 rounded-md text-xs font-normal shadow-lg" :class="isDark ? 'bg-[#002e26] border border-white/10 text-white/80' : 'bg-white border border-gray-200 text-gray-700'">{{ row.description }}</span>
                    </span>
                  </span>
                </td>
                <td class="py-2 px-3">
                  <span v-if="row.isNew" class="invisible block mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold">.</span>
                  <input v-if="row.isNew" type="text" inputmode="decimal" :value="row.amount" @input="onAmountInput(row, $event)" @keydown="onAmountKeydown" placeholder="0.00" class="w-full border rounded-md py-1.5 px-2.5 text-right focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                  <span v-else :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ formatCurrency(row.amount) }}</span>
                </td>
                <td class="py-2 px-3">
                  <span v-if="row.isNew" class="invisible block mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold">.</span>
                  <input v-if="!row.isNew" type="text" inputmode="decimal" :value="row.adjustment" @input="onAdjustmentInput(row, $event)" @keydown="onSignedKeydown" :disabled="row.markPaid" placeholder="0" class="w-full border-none rounded-md py-1.5 px-2.5 text-right focus:outline-none focus:ring-1 focus:ring-[#058a64] disabled:opacity-40" :class="isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'" />
                  <span v-else class="block text-center" :class="isDark ? 'text-white/30' : 'text-gray-300'">—</span>
                </td>
                <td class="py-2 px-3 text-right font-medium" :class="isDark ? 'text-white' : 'text-gray-800'">
                  <span v-if="row.isNew" class="invisible block mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold">.</span>
                  {{ formatCurrency(afterAdjustment(row)) }}
                </td>
                <td class="py-2 px-3 text-center">
                  <span v-if="row.isNew" class="invisible block mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold">.</span>
                  <input type="checkbox" v-model="row.markPaid" class="w-4 h-4 rounded text-[#058a64] focus:ring-[#058a64]" :class="isDark ? 'border-white/20 bg-[#002e26]' : 'border-gray-300 bg-white'" />
                </td>
                <td class="py-2 px-3 text-center">
                  <button v-if="row.isNew" @click="removeRow(i)" class="text-red-500 hover:text-red-700 text-sm font-medium">{{ labels.remove }}</button>
                  <span v-else :class="isDark ? 'text-white/20' : 'text-gray-300'">—</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!loading" class="flex flex-wrap gap-2 mt-3">
            <button @click="addInvoiceRow" type="button" class="bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              {{ labels.createInvoice }}
            </button>
            <button @click="addAdvanceRow" type="button" class="border px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              {{ labels.advancePaid }}
            </button>
          </div>
          <p v-if="duplicateRowIndexes.size > 0" class="text-sm text-red-500 mt-2">
            {{ labels.duplicateWarning }}
          </p>
          </div>

          <div class="mt-6" v-if="!loading">
            <h3 class="text-sm font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-800'">{{ labels.candidatesHeading }}</h3>
            <table class="w-full table-fixed text-left border-separate border-spacing-0 min-w-[700px]">
              <colgroup>
                <col style="width:20%"><col style="width:42%"><col style="width:20%"><col style="width:18%">
              </colgroup>
              <thead>
                <tr class="text-white text-sm">
                  <th class="bg-[#047857] py-2.5 px-3 font-medium rounded-ss-lg">{{ labels.billNo }}</th>
                  <th class="bg-[#047857] py-2.5 px-3 font-medium">{{ labels.narration }}</th>
                  <th class="bg-[#047857] py-2.5 px-3 font-medium">{{ labels.amount }}</th>
                  <th class="bg-[#047857] py-2.5 px-3 font-medium rounded-se-lg text-center">{{ labels.action }}</th>
                </tr>
              </thead>
              <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
                <tr v-if="candidateRows.length === 0">
                  <td colspan="4" class="py-6 px-3 text-center" :class="isDark ? 'text-white/50' : 'text-gray-500'">{{ labels.noCandidates }}</td>
                </tr>
                <tr v-for="(c, i) in candidateRows" :key="`c-${i}`" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                  <td class="py-2 px-3" :class="isDark ? 'text-white/70' : 'text-gray-600'">{{ c.voucher_no || '—' }}</td>
                  <td class="py-2 px-3" :class="isDark ? 'text-white/70' : 'text-gray-600'">
                    <span class="flex items-center gap-1.5">
                      <span class="truncate">{{ c.narration || labels.noNarration }}</span>
                      <span v-if="c.narration" class="group relative inline-flex shrink-0">
                        <svg class="w-3.5 h-3.5 cursor-help" :class="isDark ? 'text-white/40' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span class="hidden group-hover:block absolute z-10 left-0 top-full mt-1 w-56 p-2 rounded-md text-xs font-normal shadow-lg" :class="isDark ? 'bg-[#002e26] border border-white/10 text-white/80' : 'bg-white border border-gray-200 text-gray-700'">{{ c.narration }}</span>
                      </span>
                    </span>
                  </td>
                  <td class="py-2 px-3" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ formatCurrency(c.amount) }}</td>
                  <td class="py-2 px-3 text-center">
                    <button @click="addCandidate(c)" class="bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1 rounded-md text-xs font-medium">{{ labels.add }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="shrink-0 px-4 md:px-6 py-4 border-t flex flex-wrap items-center gap-3" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'">
          <div class="flex-1 min-w-[180px] text-sm font-medium flex items-center gap-1.5" :class="isBalanced ? (isDark ? 'text-[#6ee7b7]' : 'text-[#047857]') : (isDark ? 'text-white/70' : 'text-gray-600')">
            <svg v-if="isBalanced" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span v-if="isBalanced">{{ labels.balanced }}</span>
          </div>
          <p v-if="errorMessage" class="text-sm text-red-500 w-full">{{ errorMessage }}</p>
          <button @click="$emit('close')" class="px-4 py-1.5 border rounded-lg font-medium text-sm transition-colors" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            {{ labels.cancel }}
          </button>
          <button @click="apply" :disabled="!canApply || submitting" class="px-4 py-1.5 rounded-lg font-medium text-sm" :class="canApply && !submitting ? 'bg-[#058a64] hover:bg-[#047857] text-white cursor-pointer' : (isDark ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')">
            {{ submitting ? labels.applying : labels.apply }}
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
  needed: { type: Number, default: 0 }, // kept for compat; sign-aware requiredChange below is authoritative
  invoices: { type: Array, default: null }, // null = not loaded yet; each row needs an `id`
  purchaseCandidates: { type: Array, default: () => [] }, // TB vouchers suggesting new bills (balance-increasing)
  paymentCandidates: { type: Array, default: () => [] }, // TB vouchers suggesting unrecorded payments/receipts (balance-decreasing)
  loading: { type: Boolean, default: false },
  code: { type: String, default: '' },
  isDark: { type: Boolean, default: false },
  tbBalance: { type: Number, default: 0 },
  apBalance: { type: Number, default: 0 },
  tbLabel: { type: String, default: 'Balance as per TB' },
  reportLabel: { type: String, default: 'Balance as per report' },
  targetDate: { type: String, default: null },
});
const emit = defineEmits(['close', 'resolved']);

const currentLang = useState('currentLang', () => 'en');
const isAr = computed(() => currentLang.value === 'ar');
const labels = computed(() => isAr.value ? {
  subtitle: 'سوِّ فواتير هذا المورد مقابل فرق ميزان المراجعة.',
  variance: 'الفرق',
  currentReportLabel: 'الرصيد الحالي حسب التقرير',
  invoicesHeading: 'الفواتير',
  candidatesHeading: 'أسباب محتملة للفرق من دفتر اليومية',
  billNo: 'رقم الفاتورة',
  currentAmount: 'المبلغ الحالي',
  adjustment: 'التسوية',
  afterAdjustment: 'بعد التسوية',
  markPaid: 'وضع كمدفوع بالكامل',
  action: 'إجراء',
  remove: 'إزالة',
  empty: 'لا توجد فواتير مستحقة لهذا المورد. استخدم «إنشاء فاتورة» لإضافة واحدة.',
  invoicePlaceholder: 'رقم الفاتورة',
  tagNewInvoice: 'فاتورة جديدة',
  tagAdvance: 'دفعة مقدمة',
  createInvoice: 'إنشاء فاتورة',
  advancePaid: 'دفعة مقدمة',
  narration: 'البيان',
  noNarration: 'لا يوجد بيان متاح',
  amount: 'المبلغ',
  add: 'إضافة',
  noCandidates: 'لا توجد أسباب محتملة من دفتر اليومية لهذا المورد.',
  duplicateWarning: 'أرقام فواتير مكررة لهذا المورد — أعطِ كل فاتورة رقماً فريداً قبل التطبيق.',
  balanced: 'تمت التسوية بالكامل',
  cancel: 'إلغاء',
  apply: 'تطبيق',
  applying: 'جارٍ التطبيق...',
  mustMatch: 'يجب أن يساوي المبلغ المُدخل المبلغ المطلوب قبل التطبيق.',
} : {
  subtitle: "Resolve this vendor's bills against the TB variance.",
  variance: 'Variance',
  currentReportLabel: 'Current Balance as per report',
  invoicesHeading: 'Invoices',
  candidatesHeading: 'Potential reasons for variance found from Day Book',
  billNo: 'Bill / Invoice No.',
  currentAmount: 'Current Amount',
  adjustment: 'Adjustment',
  afterAdjustment: 'After Adjustment',
  markPaid: 'Mark Fully Paid',
  action: 'Action',
  remove: 'Remove',
  empty: 'No outstanding bills for this vendor. Use "Create Invoice" to add one.',
  invoicePlaceholder: 'Invoice number',
  tagNewInvoice: 'New Invoice',
  tagAdvance: 'Advance Paid',
  createInvoice: 'Create Invoice',
  advancePaid: 'Advance Paid',
  narration: 'Narration',
  noNarration: 'No narration available',
  amount: 'Amount',
  add: 'Add',
  noCandidates: 'No potential reasons found from the day book for this vendor.',
  duplicateWarning: 'Duplicate invoice numbers for this vendor — give each one a unique number before applying.',
  balanced: 'Fully balanced',
  cancel: 'Cancel',
  apply: 'Apply',
  applying: 'Applying...',
  mustMatch: 'Entered amount must equal the needed amount before applying.',
});

const rows = ref([]);
const candidateRows = ref([]);

const buildRows = () => {
  rows.value = (props.invoices || []).map((inv) => ({
    id: inv.id,
    invoice_number: inv.invoice_number,
    amount: inv.amount,
    date_of_invoice: inv.date_of_invoice,
    credit_days: inv.credit_days,
    description: inv.description,
    adjustment: '',
    markPaid: false,
    isNew: false,
    isAdvance: false,
  }));
};

const buildCandidates = () => {
  const increase = (props.purchaseCandidates || []).map((c) => ({ ...c, kind: 'increase' }));
  const decrease = (props.paymentCandidates || []).map((c) => ({ ...c, kind: 'decrease' }));
  candidateRows.value = [...increase, ...decrease];
};

watch(() => props.invoices, buildRows, { immediate: true });
watch([() => props.purchaseCandidates, () => props.paymentCandidates], buildCandidates, { immediate: true });

const addInvoiceRow = () => {
  rows.value.push({
    id: null, invoice_number: '', amount: '', date_of_invoice: '',
    credit_days: 0, adjustment: '', markPaid: false, isNew: true, isAdvance: false,
  });
};

const addAdvanceRow = () => {
  rows.value.push({
    id: null, invoice_number: '', amount: '', date_of_invoice: '',
    credit_days: 0, adjustment: '', markPaid: false, isNew: true, isAdvance: true,
  });
};

const addCandidate = (c) => {
  rows.value.push({
    id: null,
    invoice_number: c.voucher_no || '',
    amount: String(c.amount ?? ''),
    date_of_invoice: c.entry_date,
    credit_days: 0,
    adjustment: '',
    markPaid: false,
    isNew: true,
    isAdvance: c.kind === 'decrease',
    sourceCandidate: c,
  });
  candidateRows.value = candidateRows.value.filter((row) => row !== c);
};

const removeRow = (i) => {
  const row = rows.value[i];
  if (row.sourceCandidate) candidateRows.value.push(row.sourceCandidate);
  rows.value.splice(i, 1);
};

const sanitizeAmount = (v) => String(v ?? '').replace(/[^0-9.]/g, '');
const sanitizeSigned = (v) => {
  const s = String(v ?? '');
  const neg = s.trim().startsWith('-');
  const digits = s.replace(/[^0-9.]/g, '');
  return neg ? `-${digits}` : digits;
};
const onAmountInput = (row, e) => { row.amount = sanitizeAmount(e.target.value); };
const onAdjustmentInput = (row, e) => { row.adjustment = sanitizeSigned(e.target.value); };

const CONTROL_KEYS = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'];
const onAmountKeydown = (e) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[0-9.]$/.test(e.key)) e.preventDefault();
};
const onSignedKeydown = (e) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (e.key === '-' && e.target.selectionStart === 0 && !e.target.value.includes('-')) return;
  if (!/^[0-9.]$/.test(e.key)) e.preventDefault();
};

const toNumber = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

const afterAdjustment = (row) => row.isNew ? toNumber(row.amount) : toNumber(row.amount) + toNumber(row.adjustment);

const rowDelta = (row) => {
  if (!row.isNew) return toNumber(row.adjustment);
  if (row.isAdvance) return -toNumber(row.amount);
  return toNumber(row.amount);
};

const totalEntered = computed(() => rows.value.reduce((sum, r) => sum + rowDelta(r), 0));
const requiredChange = computed(() => props.tbBalance - props.apBalance);
const remaining = computed(() => requiredChange.value - totalEntered.value);
const isBalanced = computed(() => Math.abs(remaining.value) < 0.01 && totalEntered.value !== 0);

const liveReportBalance = computed(() => props.apBalance + totalEntered.value);
const liveVariance = computed(() => liveReportBalance.value - props.tbBalance);

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
const submitting = ref(false);

const canApply = computed(() =>
  !props.loading &&
  !submitting.value &&
  Math.abs(remaining.value) < 0.01 &&
  rows.value.some((r) => rowDelta(r) !== 0 || r.markPaid) &&
  rows.value.every((r) => !r.isNew || r.isAdvance || (r.invoice_number && toNumber(r.amount) > 0)) &&
  rows.value.every((r) => !r.isAdvance || toNumber(r.amount) > 0) &&
  duplicateRowIndexes.value.size === 0
);

const todayStr = () => props.targetDate || new Date().toISOString().slice(0, 10);

const apply = async () => {
  errorMessage.value = '';
  if (!canApply.value) {
    errorMessage.value = labels.value.mustMatch;
    return;
  }

  const lines = [];
  rows.value.forEach((row) => {
    const delta = rowDelta(row);
    if (delta === 0 && !row.markPaid) return;

    if (!row.isNew) {
      lines.push({
        action: 'edit',
        id: row.id,
        amount: afterAdjustment(row),
        mark_paid: row.markPaid,
      });
    } else if (row.isAdvance) {
      lines.push({
        action: 'advance',
        invoice_number: row.invoice_number || null,
        amount: toNumber(row.amount),
      });
    } else {
      lines.push({
        action: 'create',
        invoice_number: row.invoice_number,
        amount: toNumber(row.amount),
        credit_days: row.credit_days || 0,
        mark_paid: row.markPaid,
      });
    }
  });

  submitting.value = true;
  try {
    const res = await useApi('/adjustments/resolve-vendor', {
      method: 'POST',
      body: {
        side: props.side,
        party_name: props.partyName,
        date: todayStr(),
        lines,
      },
    });
    emit('resolved', { partyName: props.partyName, balances: res?.balances ?? null });
  } catch (err) {
    const data = err?.data || err?.response?._data;
    errorMessage.value = data?.message || err?.message || (isAr.value ? 'حدث خطأ ما' : 'Something went wrong');
  } finally {
    submitting.value = false;
  }
};
</script>
