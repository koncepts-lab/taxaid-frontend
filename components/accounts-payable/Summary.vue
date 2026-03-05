<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
    
    <div class="py-5 px-8 flex justify-between items-center">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص حسابات الدفع' : 'Accounts Payable Summary' }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100" @click="isModalOpen = true" />
      </div>
    </div>

    <table class="w-full text-left rtl:text-right border-collapse">
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="transition-transform duration-300" :class="expandedGroups.includes(gIdx) ? 'rotate-180' : ''">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                        {{ currentLang === 'ar' ? 'تحديد الكل (4)' : 'Select All (4)' }}
                      </span>
                    </div>
                  </div>
                  <button class="bg-[#005A48] hover:bg-[#004A3B] text-white px-5 py-3 rounded-xl flex items-center gap-3 text-[16px] font-normal transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ currentLang === 'ar' ? 'مراجعة معلقة (5)' : 'Hold for Review (5)' }}
                  </button>
                </div>

                <div class="space-y-4 mt-8">
                  <div v-for="(inv, iIdx) in group.invoices" :key="iIdx" 
                    class="grid grid-cols-6 items-center border-t border-black/5 dark:border-white/5 pt-4">
                    <div class="flex items-center gap-3">
                      <input type="checkbox" v-model="inv.selected" 
                        class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                      <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ inv.id }}</span>
                    </div>
                    <div class="text-right rtl:text-left font-normal text-[16px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                      <span class="underline underline-offset-4 cursor-pointer">{{ inv.total }}</span>
                    </div>
                    <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age30 }}</div>
                    <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age3060 }}</div>
                    <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age6090 }}</div>
                    <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age90plus }}</div>
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
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">960,000</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">525,000</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">330,000</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">205,000</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">125,000</td>
        </tr>
      </tfoot>
    </table>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص حسابات الدفع' : 'Accounts Payable Summary' }}
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          class="transition-transform duration-300" :class="expandedGroups.includes(gIdx) ? 'rotate-180' : ''">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                      <div :class="isDark ? 'bg-transparent' : 'bg-[#A2E8D6]'" class="p-8">
                        <div class="flex justify-between items-start mb-6">
                          <div>
                            <h3 class="text-[16px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                              {{ currentLang === 'ar' ? 'حدد الفواتير لإرسال تذكيرات تعليق الدفع' : 'Select invoices to send hold payment reminders.' }}
                            </h3>
                            <div class="flex items-center gap-3">
                              <input type="checkbox" v-model="selectAll" @change="handleSelectAll" 
                                class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                              <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                                {{ currentLang === 'ar' ? 'تحديد الكل (4)' : 'Select All (4)' }}
                              </span>
                            </div>
                          </div>
                          <button class="bg-[#005A48] hover:bg-[#004A3B] text-white px-5 py-3 rounded-xl flex items-center gap-3 text-[16px] font-normal transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ currentLang === 'ar' ? 'مراجعة معلقة (5)' : 'Hold for Review (5)' }}
                          </button>
                        </div>

                        <div class="space-y-4 mt-8">
                          <div v-for="(inv, iIdx) in group.invoices" :key="'modal-inv-' + iIdx" 
                            class="grid grid-cols-6 items-center border-t border-black/5 dark:border-white/5 pt-4">
                            <div class="flex items-center gap-3">
                              <input type="checkbox" v-model="inv.selected" 
                                class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                              <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ inv.id }}</span>
                            </div>
                            <div class="text-right rtl:text-left font-normal text-[16px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                              <span class="underline underline-offset-4 cursor-pointer">{{ inv.total }}</span>
                            </div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age30 }}</div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age3060 }}</div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age6090 }}</div>
                            <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age90plus }}</div>
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
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">960,000</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">525,000</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">330,000</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">205,000</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">125,000</td>
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
import { ref } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const expandedGroups = ref([0]) // Default expand first group
const selectAll = ref(false)
const isModalOpen = ref(false)

const arData = ref([
  {
    label: 'Corporate Clients',
    labelAr: 'عملاء الشركات',
    total: '550,000',
    age30: '250,000',
    age3060: '150,000',
    age6090: '90,000',
    age90plus: '60,000',
    invoices: [
      { id: 'Invoice 1', total: '550,000', age30: '250,000', age3060: '150,000', age6090: '90,000', age90plus: '60,000', selected: true },
      { id: 'Invoice 2', total: '550,000', age30: '250,000', age3060: '150,000', age6090: '90,000', age90plus: '60,000', selected: true },
      { id: 'Invoice 3', total: '550,000', age30: '250,000', age3060: '150,000', age6090: '90,000', age90plus: '60,000', selected: false },
      { id: 'Invoice 4', total: '550,000', age30: '250,000', age3060: '150,000', age6090: '90,000', age90plus: '60,000', selected: false },
    ]
  },
  {
    label: 'Retail Customers',
    labelAr: 'عملاء التجزئة',
    total: '265,000',
    age30: '120,000',
    age3060: '80,000',
    age6090: '40,000',
    age90plus: '25,000',
    invoices: []
  },
  {
    label: 'Export Clients',
    labelAr: 'عملاء التصدير',
    total: '145,000',
    age30: '70,000',
    age3060: '40,000',
    age6090: '25,000',
    age90plus: '10,000',
    invoices: []
  }
])

const toggleGroup = (idx) => {
  const index = expandedGroups.value.indexOf(idx)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(idx)
  }
}

const handleSelectAll = () => {
  arData.value.forEach(group => {
    group.invoices.forEach(inv => {
      inv.selected = selectAll.value
    })
  })
}
</script>

<style scoped>
input[type="checkbox"] {
  accent-color: #008864;
}
</style>
