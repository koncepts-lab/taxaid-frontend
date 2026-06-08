<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">

    <div class="lg:px-8 px-4 py-5 flex justify-between items-center text-left rtl:text-right">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص حسابات القبض' : 'Accounts Receivable Summary' }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 hidden lg:block" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="w-full overflow-x-auto no-scrollbar">
      <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1000px]">
        <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr>
            <th class="px-8 py-5 font-normal text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
            <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">
              <div class="flex items-center justify-end rtl:justify-start gap-2">
                {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                <img src="/images/icons/edit-white.svg" class="w-[21px] h-auto" v-if="!isDark" />
                <svg v-else width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </th>
            <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '>30' : '>30' }}</th>
            <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '30-60' : '30-60' }}</th>
            <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '60-90' : '60-90' }}</th>
            <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '<90' : '<90' }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(group, gIdx) in arData" :key="gIdx">
            <!-- Main Group Row -->
            <tr class="transition-all duration-500 border-b border-white/5"
              :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'">
              <td class="px-8 py-5">
                <div class="flex items-center gap-2 cursor-pointer" @click="toggleGroup(gIdx)">
                  <span class="font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? group.labelAr : group.label }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="transition-transform duration-300" :class="[expandedGroups.includes(gIdx) ? 'rotate-180' : '', isDark ? 'text-white' : 'text-[#1A1A1A]']">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </td>
              <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ group.total }}</td>
              <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age30 }}</td>
              <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age3060 }}</td>
              <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age6090 }}</td>
              <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age90plus }}</td>
            </tr>

            <!-- Expandable Invoice Section -->
            <tr v-if="expandedGroups.includes(gIdx)">
              <td colspan="6" class="p-0">
                <div :class="isDark ? '' : 'bg-[#A2E8D6]'" class="p-8">
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <h3 class="text-[16px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                        {{ currentLang === 'ar' ? 'حدد الفواتير لإرسال تذكيرات تعليق الدفع' : 'Select invoices to send hold payment reminders.' }}
                      </h3>
                      <div class="flex items-center gap-3">
                        <input type="checkbox" v-model="selectAll" @change="handleSelectAll"
                          class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                        <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                          {{ currentLang === 'ar' ? `تحديد الكل (${getInvoices(group).length})` : `Select All (${getInvoices(group).length})` }}
                        </span>
                      </div>
                    </div>
                    <button class="bg-[#005A48] hover:bg-[#004A3B] text-white px-5 py-3 rounded-xl flex items-center gap-3 text-[16px] font-normal transition-colors">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      {{ currentLang === 'ar' ? 'مراجعة معلقة' : 'Hold for Review' }}
                    </button>
                  </div>

                  <!-- Loading spinner -->
                  <div v-if="loadingGroup === gIdx" class="flex justify-center py-6">
                    <div class="w-8 h-8 border-4 border-[#005A48] border-t-transparent rounded-full animate-spin"></div>
                  </div>

                  <div v-else class="space-y-4 mt-8">
                    <div v-if="getInvoices(group).length === 0" class="text-[14px] opacity-60 py-4" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                      {{ currentLang === 'ar' ? 'لا توجد فواتير' : 'No invoices found.' }}
                    </div>
                    <div v-for="(inv, iIdx) in getInvoices(group)" :key="iIdx"
                      class="grid grid-cols-6 items-center border-t border-black/5 dark:border-white/5 pt-4">
                      <div class="flex items-center gap-3">
                        <input type="checkbox" v-model="inv.selected"
                          class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                        <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ inv.invoiceNo }}</span>
                      </div>
                      <div class="text-right rtl:text-left font-normal text-[16px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                        <span class="underline underline-offset-4 cursor-pointer">{{ inv.amount?.toLocaleString() }}</span>
                      </div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age30?.toLocaleString() }}</div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age3060?.toLocaleString() }}</div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age6090?.toLocaleString() }}</div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age90plus?.toLocaleString() }}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#68E4C4]'" class="transition-all duration-500">
            <td class="px-8 py-5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.total.toLocaleString() }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age30.toLocaleString() }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age3060.toLocaleString() }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age6090.toLocaleString() }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age90plus.toLocaleString() }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص حسابات القبض' : 'Accounts Receivable Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>

          <div class="overflow-y-auto w-full no-scrollbar flex-1 relative bg-white dark:bg-[#00141080]">
            <table class="w-full text-left rtl:text-right border-collapse relative">
              <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="px-8 py-5 font-normal text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
                  <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">
                    <div class="flex items-center justify-end rtl:justify-start gap-2">
                      {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                      <img src="/images/icons/edit-white.svg" class="w-[21px] h-auto" v-if="!isDark" />
                      <svg v-else width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '>30' : '>30' }}</th>
                  <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '30-60' : '30-60' }}</th>
                  <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '60-90' : '60-90' }}</th>
                  <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '<90' : '<90' }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(group, gIdx) in arData" :key="'modal-' + gIdx">
                  <tr class="transition-all duration-500 border-b border-black/5 dark:border-white/5"
                    :class="isDark ? 'hover:bg-white/5 bg-[#00141080]' : 'hover:bg-gray-50 bg-white'">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-2 cursor-pointer" @click="toggleGroup(gIdx)">
                        <span class="font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? group.labelAr : group.label }}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          class="transition-transform duration-300" :class="[expandedGroups.includes(gIdx) ? 'rotate-180' : '', isDark ? 'text-white' : 'text-[#1A1A1A]']">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                    <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ group.total }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age30 }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age3060 }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age6090 }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ group.age90plus }}</td>
                  </tr>

                  <!-- Expandable Invoice Section (modal version) -->
                  <tr v-if="expandedGroups.includes(gIdx)">
                    <td colspan="6" class="p-0">
                      <div :class="isDark ? 'bg-transparent' : 'bg-[#A2E8D6]'" class="p-8">
                        <div v-if="loadingGroup === gIdx" class="flex justify-center py-6">
                          <div class="w-8 h-8 border-4 border-[#005A48] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div v-else class="space-y-4">
                          <div v-if="getInvoices(group).length === 0" class="text-[14px] opacity-60 py-4" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                            {{ currentLang === 'ar' ? 'لا توجد فواتير' : 'No invoices found.' }}
                          </div>
                          <div v-for="(inv, iIdx) in getInvoices(group)" :key="'modal-inv-' + iIdx"
                            class="grid grid-cols-6 items-center border-t border-black/5 dark:border-white/5 pt-4">
                            <div class="flex items-center gap-3">
                              <input type="checkbox" v-model="inv.selected"
                                class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                              <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ inv.invoiceNo }}</span>
                            </div>
                            <div class="text-right rtl:text-left font-normal text-[16px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                              <span class="underline underline-offset-4 cursor-pointer">{{ inv.amount?.toLocaleString() }}</span>
                            </div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age30?.toLocaleString() }}</div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age3060?.toLocaleString() }}</div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age6090?.toLocaleString() }}</div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age90plus?.toLocaleString() }}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot>
                <tr :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#68E4C4]'" class="transition-all duration-500 sticky bottom-0 z-10">
                  <td class="px-8 py-5 font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.total.toLocaleString() }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age30.toLocaleString() }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age3060.toLocaleString() }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age6090.toLocaleString() }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.age90plus.toLocaleString() }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data:     { type: Array,  default: () => [] },
  testDate: { type: String, default: '' }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const expandedGroups = ref([0])
const selectAll      = ref(false)
const isModalOpen    = ref(false)
const loadingGroup   = ref(null)
const invoiceCache   = ref({})

const arData = computed(() => props.data)

const summaryTotal = computed(() => {
  const rows = props.data
  return {
    total:     rows.reduce((s, r) => s + (r.total     ?? 0), 0),
    age30:     rows.reduce((s, r) => s + (r.age30     ?? 0), 0),
    age3060:   rows.reduce((s, r) => s + (r.age3060   ?? 0), 0),
    age6090:   rows.reduce((s, r) => s + (r.age6090   ?? 0), 0),
    age90plus: rows.reduce((s, r) => s + (r.age90plus ?? 0), 0),
  }
})

const toggleGroup = async (idx) => {
  const pos = expandedGroups.value.indexOf(idx)
  if (pos > -1) {
    expandedGroups.value.splice(pos, 1)
    return
  }
  expandedGroups.value.push(idx)

  const group = props.data[idx]
  if (!group || invoiceCache.value[group.label] !== undefined) return

  loadingGroup.value = idx
  try {
    const res = await useApi('/ar-report/customer-details', {
      params: { test_date: props.testDate, customer_name: group.label }
    })
    if (res?.status === 'success' && Array.isArray(res.data)) {
      invoiceCache.value[group.label] = res.data
        .filter(r => !r.isTotal)
        .map(r => ({
          invoiceNo:  r.invoice_no,
          amount:     r.amount,
          age30:      r.bucket_0_30,
          age3060:    r.bucket_31_60,
          age6090:    r.bucket_61_90,
          age90plus:  (r.bucket_91_180 ?? 0) + (r.bucket_181_365 ?? 0) + (r.bucket_365_plus ?? 0),
          selected:   false
        }))
    } else {
      invoiceCache.value[group.label] = []
    }
  } catch {
    invoiceCache.value[group.label] = []
  } finally {
    loadingGroup.value = null
  }
}

const getInvoices = (group) => invoiceCache.value[group?.label] ?? []

const handleSelectAll = () => {
  props.data.forEach(group => {
    getInvoices(group).forEach(inv => { inv.selected = selectAll.value })
  })
}
</script>

<style scoped>
input[type="checkbox"] {
  accent-color: #008864;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
