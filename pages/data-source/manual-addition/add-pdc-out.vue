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
                  {{ currentLang === 'ar' ? 'إدخال شيك صادر' : 'PDC Out' }}
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

          <!-- Section 1: Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-10">
            <div>
              <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">PDC Issue Date</label>
              <CommonDateField v-model="form.pdc_issue_date" format="dmy" allow-future />
            </div>
            <div>
              <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">PDC Realisation Date</label>
              <CommonDateField v-model="form.pdc_realisation_date" format="dmy" allow-future />
            </div>
            <div>
              <label :class="['block text-[14px] font-medium mb-1.5', isDark ? 'text-white' : 'text-[#0A0A0A]']">Bank Name</label>
              <input type="text" v-model="form.bank_name" placeholder="Enter bank name"
                :class="['w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] text-white' : 'text-gray-700']" />
            </div>
          </div>

          <!-- Section 2: Cheque Details -->
          <div class="mb-10">
            <div class="flex justify-between items-center mb-4">
              <h2 :class="['text-[18px] font-medium', isDark ? 'text-white' : 'text-[#0A0A0A]']">Cheque Details</h2>
              <button @click="addCheque" class="flex items-center justify-center gap-2 hover:bg-[#52D1B2] transition-colors" style="background: #68E4C4; width: 204px; height: 40px; border-radius: 8.84px; border: 1px solid #04C18F80; color: #0A0A0A; font-size: 16px; font-weight: 400;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Cheque
              </button>
            </div>
            
            <div class="w-full overflow-x-auto rounded-t-lg">
              <table class="w-full text-sm text-left">
                <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#00896F]'">
                  <tr>
                    <th class="px-4 py-3 font-medium rounded-tl-lg">Cheque Number</th>
                    <th class="px-4 py-3 font-medium">Party Name</th>
                    <th class="px-4 py-3 font-medium">Amount (AED)</th>
                    <th class="px-4 py-3 font-medium rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody :class="['border-b', isDark ? 'border-white/10' : 'border-gray-100']">
                  <tr v-for="(cheque, index) in paginatedCheques" :key="cheque.id || index"
                    :class="['border-b', isDark ? 'border-white/5 bg-[#00201a]/40' : 'border-gray-100/50']">
                    <td class="p-2 w-48">
                      <input type="text" v-model="cheque.cheque_number" placeholder="eg., CHQ-123456"
                        :class="['w-full px-3 py-2.5 rounded outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] border border-white/10 text-white' : 'text-gray-700 bg-[rgb(243,243,245)] border border-[rgba(0,0,0,0.04)]']" />
                    </td>
                    <td class="p-2">
                      <input type="text" v-model="cheque.party_name" placeholder="Enter party/vendor name"
                        :class="['w-full px-3 py-2.5 rounded outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] border border-white/10 text-white' : 'text-gray-700 bg-[rgb(243,243,245)] border border-[rgba(0,0,0,0.04)]']" />
                    </td>
                    <td class="p-2 w-40">
                      <input type="text" v-model="cheque.amount" placeholder=""
                        :class="['w-full px-3 py-2.5 rounded outline-none text-sm placeholder-[#717182]', isDark ? 'bg-[#00201a] border border-white/10 text-white' : 'text-gray-700 bg-[rgb(243,243,245)] border border-[rgba(0,0,0,0.04)]']" />
                    </td>
                    <td class="p-2 w-24">
                      <button @click="removeCheque(cheque)" :class="isDark ? 'text-red-400 hover:text-red-300' : 'text-[#FCA5A5] hover:text-red-500'" class="font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div :class="['px-4 py-3 flex justify-end items-center text-sm font-semibold', isDark ? 'bg-[#1D5E54] text-white' : 'bg-[#65E2C4] text-[#013E32]']">
                <span class="mr-4">Total PDC Amount</span>
                <span>{{ formatInMillions(totalPdcAmount) }} AED</span>
              </div>
              
              <!-- Pagination footer -->
              <div :class="['px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t mt-2 rounded-b-lg', isDark ? 'border-white/10 bg-[#002e26]' : 'border-gray-100 bg-white']">
                  <span class="text-sm" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                      {{ currentLang === 'ar'
                          ? `عرض ${pageStart}–${pageEnd} من ${totalResults} نتيجة`
                          : `Showing ${pageStart}–${pageEnd} of ${totalResults} results`
                      }}
                  </span>

                  <div class="flex items-center gap-1.5">
                      <button :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)"
                          :class="isDark ? 'border-white/10 text-white/80 bg-[#00201a] hover:bg-[#00201a]/70' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'"
                          class="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
                      </button>

                      <template v-for="p in visiblePages" :key="p">
                          <span v-if="p === '...'"
                              class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none">
                              &hellip;
                          </span>
                          <button v-else @click="goToPage(p)"
                              :class="p === currentPage
                                  ? 'bg-[#00896F] text-white border-[#00896F]'
                                  : (isDark ? 'bg-[#00201a] text-white/80 border-white/10 hover:bg-[#00201a]/70' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')"
                              class="w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all">
                              {{ p }}
                          </button>
                      </template>

                      <button :disabled="currentPage >= lastPage" @click="goToPage(currentPage + 1)"
                          :class="isDark ? 'border-white/10 text-white/80 bg-[#00201a] hover:bg-[#00201a]/70' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'"
                          class="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
                      </button>

                      <span class="ml-3 text-sm whitespace-nowrap" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                          {{ currentLang === 'ar' ? 'صفوف لكل صفحة:' : 'Rows per page:' }}
                      </span>
                      <CommonSelectDropdown class="w-20" mode="select" size="xs" :clearable="false" :options="perPageOptions" v-model="localPerPage" />
                  </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Notes / Remarks -->
          <div class="mb-4">
            <h2 :class="['text-[16px] font-medium mb-3', isDark ? 'text-white' : 'text-[#0A0A0A]']">Notes / Remarks</h2>
            <textarea v-model="form.remarks" placeholder="Add any additional notes or comments about these PDCs..." rows="4"
              :class="['w-full px-4 py-3 rounded-lg border focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-sm placeholder-gray-400 resize-y', isDark ? 'bg-[#00201a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700']"></textarea>
          </div>

          <!-- Bottom Action -->
          <div :class="['flex justify-end items-center gap-4 mt-8 border-t pt-6', isDark ? 'border-white/10' : 'border-gray-100']">
            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
            <p v-if="success" class="text-sm text-[#00896F] font-medium">{{ success }}</p>
            <button @click="savePdcData" :disabled="saving" class="px-6 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ saving ? 'Saving...' : 'Save PDC Data' }}
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

const {
  saving, error, success,
  toApiDate, toNumber, clearMessages, savePdc
} = useManualAddition()

const form = ref({
  pdc_issue_date: '',
  pdc_realisation_date: '',
  bank_name: '',
  remarks: ''
})

const cheques = ref([
  { id: Date.now(), cheque_number: '', party_name: '', amount: '' }
])

onMounted(() => clearMessages())

const totalPdcAmount = computed(() =>
  cheques.value.reduce((sum, c) => sum + toNumber(c.amount), 0)
)

const savePdcData = async () => {
  const payload = {
    pdc_issue_date: toApiDate(form.value.pdc_issue_date),
    pdc_realisation_date: form.value.pdc_realisation_date ? toApiDate(form.value.pdc_realisation_date) : null,
    bank_name: form.value.bank_name || null,
    remarks: form.value.remarks || null,
    cheques: cheques.value
      .filter(c => c.cheque_number || c.party_name || c.amount)
      .map(c => ({
        cheque_number: c.cheque_number,
        party_name: c.party_name,
        amount: toNumber(c.amount)
      }))
  }

  const saved = await savePdc('out', payload)
  if (saved) {
    form.value = { pdc_issue_date: '', pdc_realisation_date: '', bank_name: '', remarks: '' }
    cheques.value = [{ id: Date.now(), cheque_number: '', party_name: '', amount: '' }]
  }
}

const addCheque = () => {
  cheques.value.push({ id: Date.now(), cheque_number: '', party_name: '', amount: '' })
  setTimeout(() => { currentPage.value = lastPage.value }, 0)
}

const removeCheque = (cheque) => {
  const index = cheques.value.indexOf(cheque)
  if (index !== -1) cheques.value.splice(index, 1)
  if (currentPage.value > lastPage.value && lastPage.value >= 1) {
    currentPage.value = lastPage.value
  }
}

const currentPage = ref(1)
const localPerPage = ref(6)
const perPageOptions = [6, 10, 20, 30]

const totalResults = computed(() => cheques.value.length)
const lastPage = computed(() => Math.ceil(totalResults.value / localPerPage.value) || 1)

const pageStart = computed(() => totalResults.value > 0 ? (currentPage.value - 1) * localPerPage.value + 1 : 0)
const pageEnd = computed(() => Math.min(currentPage.value * localPerPage.value, totalResults.value))

const visiblePages = computed(() => {
  const total = lastPage.value
  const cur = currentPage.value
  if (total <= 1) return [1]
  const include = new Set([1, total])
  for (let p = Math.max(1, cur - 1); p <= Math.min(total, cur + 1); p++) include.add(p)
  const sorted = [...include].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const gap = sorted[i] - sorted[i - 1]
      if (gap === 2) result.push(sorted[i - 1] + 1)
      else if (gap > 2) result.push('...')
    }
    result.push(sorted[i])
  }
  return result
})

const paginatedCheques = computed(() => {
  const start = (currentPage.value - 1) * localPerPage.value
  return cheques.value.slice(start, start + localPerPage.value)
})

const goToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= lastPage.value) {
    currentPage.value = page
  }
}
</script>
