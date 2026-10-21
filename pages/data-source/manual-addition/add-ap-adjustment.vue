<template>
  <NuxtLayout name="dashboard">
    <div class="relative z-10 flex h-full overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8">

        <div class=" data-source-container pt-8 lg:pt-0">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start gap-4">
              <button @click="router.back()" class="mt-1.5 p-1 rounded-full transition-colors" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-700'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div>
                <h1 class="font-medium transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#013E32]'" style="font-size: 24px;">
                  {{ currentLang === 'ar' ? 'تسوية حسابات دائنة' : 'AP Manual Adjustment' }}
                </h1>
              </div>
            </div>
            <!-- Close icon -->
            <button @click="router.back()" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div :class="['rounded-xl shadow-sm border p-8 mx-auto transition-colors', isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100']">

            <!-- Transaction type -->
            <div class="flex items-center gap-2 mb-8">
              <button type="button" @click="setType('purchase')" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="form.transaction_type === 'purchase' ? 'bg-[#00896F] text-white' : (isDark ? 'bg-[#00201a] text-white/70 hover:bg-[#00201a]/80' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
                New Purchase (Unpaid)
              </button>
              <button type="button" @click="setType('return')" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="form.transaction_type === 'return' ? 'bg-[#00896F] text-white' : (isDark ? 'bg-[#00201a] text-white/70 hover:bg-[#00201a]/80' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
                Mark Invoice as Paid
              </button>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-10">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">Party Name <span class="text-red-500">*</span></label>
                  <button type="button" @click="togglePartyMode" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00896F] text-white hover:bg-[#00705a] transition-colors">
                    {{ partyMode === 'existing' ? '+ Add New' : '← Existing' }}
                  </button>
                </div>
                <div v-if="partyMode === 'existing'" class="flex items-center gap-2">
                  <CommonSelectDropdown v-model="form.party_name" mode="select" size="md" searchable
                    placeholder="Select vendor" :options="partyOptionsWithCount" @update:model-value="onPartyChange" class="flex-1" />
                  <button v-if="form.party_name" type="button" @click="clearParty" title="Clear"
                    :class="['shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-[10px] border border-[#04C18F80] transition-colors', isDark ? 'text-white/60 hover:text-red-400 hover:border-red-400' : 'text-gray-400 hover:text-red-500 hover:border-red-300']">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <input v-else type="text" v-model="form.party_name" placeholder="Enter new vendor name"
                  :class="['w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] text-white' : 'text-gray-700']" />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">Invoice Number <span v-if="form.transaction_type === 'return'" class="text-red-500">*</span></label>
                  <button v-if="form.transaction_type !== 'return'" type="button" @click="toggleInvoiceMode" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00896F] text-white hover:bg-[#00705a] transition-colors">
                    {{ invoiceMode === 'existing' ? '+ Add New' : '← Existing' }}
                  </button>
                </div>
                <div v-if="invoiceMode === 'existing'" class="flex items-center gap-2">
                  <CommonSelectDropdown v-model="form.invoice_number" mode="select" size="md" searchable
                    :disabled="!form.party_name" placeholder="Select invoice" :options="invoiceOptions" @update:model-value="onInvoiceChange" class="flex-1" />
                  <button v-if="form.invoice_number" type="button" @click="clearInvoice" title="Clear"
                    :class="['shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-[10px] border border-[#04C18F80] transition-colors', isDark ? 'text-white/60 hover:text-red-400 hover:border-red-400' : 'text-gray-400 hover:text-red-500 hover:border-red-300']">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <input v-else type="text" v-model="form.invoice_number" placeholder="Enter new invoice number (optional)"
                  :class="['w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] text-white' : 'text-gray-700']" />
                <p v-if="duplicateWarning" class="text-xs text-amber-500 mt-1.5">{{ duplicateWarning }}</p>
              </div>

              <div>
                <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">Date <span class="text-red-500">*</span></label>
                <CommonDateField v-model="form.date" format="dmy" allow-future use-display-format />
              </div>

              <div>
                <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">Adjustment Amount ({{ currencyCode }}) <span class="text-red-500">*</span></label>
                <input type="text" v-model="form.adjustment" :disabled="form.transaction_type === 'return'" placeholder="Enter amount"
                  :class="['w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] text-white disabled:bg-[#00201a]/50 disabled:text-white/40' : 'text-gray-700 disabled:bg-gray-50 disabled:text-gray-400']" />
                <p class="text-xs mt-1" :class="isDark ? 'text-white/60' : 'text-gray-400'">
                  {{ form.transaction_type === 'return' ? 'Marks the selected invoice as fully paid — the invoice\'s own amount is used.' : 'Creates an unpaid purchase entry that increases the payable.' }}
                </p>
              </div>

              <div v-if="form.transaction_type !== 'return'">
                <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">Credit Days</label>
                <input type="text" v-model="form.credit_days" placeholder="e.g., 30 (optional)"
                  :class="['w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] text-white' : 'text-gray-700']" />
              </div>
            </div>

            <!-- Bottom Action -->
            <div :class="['flex justify-end items-center gap-4 mt-8 border-t pt-6', isDark ? 'border-white/10' : 'border-gray-100']">
              <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
              <p v-if="success" class="text-sm text-[#00896F] font-medium">{{ success }}</p>
              <button @click="saveAdjustment" :disabled="saving || !canSave" class="px-6 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ saving ? 'Saving...' : (form.transaction_type === 'return' ? 'Mark as Paid' : 'Save Adjustment') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useState } from '#app'

const router = useRouter()
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const { code: currencyCode } = useCurrency()

const {
  saving, error, success,
  toApiDate, toNumber, clearMessages, saveApAdjustment
} = useManualAddition()

const form = ref({
  party_name: '',
  invoice_number: '',
  date: '',
  adjustment: '',
  credit_days: '',
  transaction_type: 'purchase',
})

const partyMode = ref('existing') // 'existing' | 'new'
const invoiceMode = ref('existing')

const partyOptions = ref([])
const invoicesByParty = ref({})
const invoicesForParty = computed(() => invoicesByParty.value[form.value.party_name] || [])
const invoiceOptions = computed(() => invoicesForParty.value.map((i) => i.invoice_number).filter(Boolean))

const partyOptionsWithCount = computed(() => partyOptions.value.map((name) => {
  const count = (invoicesByParty.value[name] || []).length
  return { value: name, label: `${name} (${count})`, search: name }
}))

const loadParties = async () => {
  try {
    const res = await useApi('/adjustments/parties', { params: { side: 'ap' } })
    partyOptions.value = res?.data ?? []
    preloadAllInvoices(partyOptions.value)
  } catch (e) { /* non-fatal — dropdown just stays empty, "Add New Vendor" still works */ }
}

const preloadAllInvoices = async (partyNames) => {
  if (!partyNames.length) return
  try {
    const res = await useApi('/adjustments/invoices-batch', { params: { side: 'ap', party_names: partyNames.join(',') } })
    invoicesByParty.value = { ...invoicesByParty.value, ...(res?.data ?? {}) }
  } catch (e) { /* non-fatal — falls back to the per-vendor fetch on select */ }
}

const loadInvoices = async (partyName) => {
  if (!partyName || invoicesByParty.value[partyName]) return
  try {
    const res = await useApi('/adjustments/invoices', { params: { side: 'ap', party_name: partyName } })
    invoicesByParty.value = { ...invoicesByParty.value, [partyName]: res?.data ?? [] }
  } catch (e) { /* non-fatal */ }
}

onMounted(() => {
  clearMessages()
  loadParties()
})

const togglePartyMode = () => {
  partyMode.value = partyMode.value === 'existing' ? 'new' : 'existing'
  form.value.party_name = ''
  form.value.invoice_number = ''
}

const toggleInvoiceMode = () => {
  invoiceMode.value = invoiceMode.value === 'existing' ? 'new' : 'existing'
  form.value.invoice_number = ''
}

const onPartyChange = () => {
  form.value.invoice_number = ''
  loadInvoices(form.value.party_name)
}

const clearParty = () => {
  form.value.party_name = ''
  form.value.invoice_number = ''
}

const clearInvoice = () => {
  form.value.invoice_number = ''
  if (form.value.transaction_type === 'return') form.value.adjustment = ''
}

const onInvoiceChange = () => {
  if (form.value.transaction_type === 'return') {
    const inv = invoicesForParty.value.find((i) => i.invoice_number === form.value.invoice_number)
    form.value.adjustment = inv ? String(Math.round(parseFloat(inv.amount) * 100) / 100) : ''
  }
}

const setType = (type) => {
  form.value.transaction_type = type
  if (type === 'return') {
    invoiceMode.value = 'existing'
    onInvoiceChange()
  } else {
    form.value.adjustment = ''
  }
}

const duplicateWarning = computed(() => {
  if (form.value.transaction_type !== 'purchase' || invoiceMode.value !== 'new') return ''
  const n = (form.value.invoice_number || '').trim().toLowerCase()
  if (!n) return ''
  const exists = invoicesForParty.value.some((i) => (i.invoice_number || '').trim().toLowerCase() === n)
  return exists ? `Invoice '${form.value.invoice_number}' already exists for this vendor — use "Choose Existing Invoice" instead to avoid a duplicate.` : ''
})

const canSave = computed(() => {
  if (!form.value.party_name || !form.value.date) return false
  if (form.value.transaction_type === 'return') return !!form.value.invoice_number
  if (duplicateWarning.value) return false
  return !!toNumber(form.value.adjustment)
})

const saveAdjustment = async () => {
  const payload = {
    party_name: form.value.party_name,
    invoice_number: form.value.invoice_number || null,
    date: toApiDate(form.value.date),
    adjustment: toNumber(form.value.adjustment),
    credit_days: form.value.credit_days !== '' ? parseInt(form.value.credit_days, 10) || 0 : null,
    transaction_type: form.value.transaction_type,
  }

  const saved = await saveApAdjustment(payload)
  if (saved !== null) {
    form.value = { party_name: '', invoice_number: '', date: '', adjustment: '', credit_days: '', transaction_type: 'purchase' }
    partyMode.value = 'existing'
    invoiceMode.value = 'existing'
  }
}
</script>
