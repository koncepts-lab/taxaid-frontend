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

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mx-auto">

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-10">
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Party Name <span class="text-red-500">*</span></label>
                <input type="text" v-model="form.party_name" placeholder="Enter party/vendor name" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Invoice Number</label>
                <input type="text" v-model="form.invoice_number" placeholder="Enter invoice number (optional)" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input type="text" v-model="form.date" placeholder="dd-mm-yyyy" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Transaction Type <span class="text-red-500">*</span></label>
                <select v-model="form.transaction_type" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm bg-white">
                  <option value="purchase">Purchase (increases payable)</option>
                  <option value="payment">Payment (reduces payable)</option>
                </select>
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Adjustment Amount (AED) <span class="text-red-500">*</span></label>
                <input type="text" v-model="form.adjustment" placeholder="Enter amount" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
                <p class="text-xs text-gray-400 mt-1">Sign is applied automatically: purchase adds, payment subtracts.</p>
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Credit Days</label>
                <input type="text" v-model="form.credit_days" placeholder="e.g., 30 (optional)" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
              </div>
            </div>

            <!-- Bottom Action -->
            <div class="flex justify-end items-center gap-4 mt-8 border-t border-gray-100 pt-6">
              <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
              <p v-if="success" class="text-sm text-[#00896F] font-medium">{{ success }}</p>
              <button @click="saveAdjustment" :disabled="saving" class="px-6 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ saving ? 'Saving...' : 'Save Adjustment' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useState } from '#app'

const router = useRouter()
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()

const {
  saving, error, success,
  toApiDate, toNumber, clearMessages, saveApAdjustment
} = useManualAddition()

const form = ref({
  party_name: '',
  invoice_number: '',
  date: '',
  transaction_type: 'purchase',
  adjustment: '',
  credit_days: ''
})

onMounted(() => clearMessages())

const saveAdjustment = async () => {
  const payload = {
    party_name: form.value.party_name,
    invoice_number: form.value.invoice_number || null,
    date: toApiDate(form.value.date),
    adjustment: toNumber(form.value.adjustment),
    credit_days: form.value.credit_days !== '' ? parseInt(form.value.credit_days, 10) || 0 : null,
    transaction_type: form.value.transaction_type
  }

  const saved = await saveApAdjustment(payload)
  if (saved) {
    form.value = { party_name: '', invoice_number: '', date: '', transaction_type: 'purchase', adjustment: '', credit_days: '' }
  }
}
</script>
