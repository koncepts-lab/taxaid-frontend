<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
    
    <div class="py-5 px-8 flex justify-between items-center">
      <div>
        <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
          {{ currentLang === 'ar' ? 'ملخص مشروع البرج السكني' : 'Residential Tower Project Summary' }}
        </p>
        <p class="text-[12px] font-normal mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <img src="/images/icons/info.svg" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Main Table Content -->
    <div class="overflow-x-auto no-scrollbar">
      <table class="w-full text-left rtl:text-right border-collapse">
        <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr>
            <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
            <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'الفعلي' : 'Actual' }}</th>
            <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
            <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, idx) in tableData" :key="idx">
            <tr class="transition-all duration-500 border-b" 
              :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
              <td class="px-8 py-5">
                <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
              </td>
              <td class="px-6 py-5 text-center font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.actual }}</td>
              <td class="px-6 py-5 text-center font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.budget }}</td>
              <td class="px-6 py-5 text-center">
                  <div class="relative w-[65px] h-[32px] overflow-hidden mx-auto">
                      <svg viewBox="0 0 100 50" class="w-full h-full">
                          <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                          <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(item.progress)" stroke-width="12" stroke-linecap="round" 
                              :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * item.progress / 100)" />
                      </svg>
                      <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold" :class="isDark ? 'text-white' : 'text-[#333333]'">
                          {{ item.progress }}%
                      </div>
                  </div>
              </td>
            </tr>
          </template>
          <!-- Total Row -->
          <tr class="transition-all duration-500" :class="isDark ? 'bg-[#00D9A4]/20' : 'bg-[#68E4C4]'">
            <td class="px-8 py-5">
              <span class="font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'إجمالي الربح' : 'Gross Profit' }}</span>
            </td>
            <td class="px-6 py-5 text-center font-bold text-[14px]" :class="isDark ? 'text-white' : 'text-[#013e32]'">17,500,000</td>
            <td class="px-6 py-5 text-center font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#013e32]'">550,000</td>
            <td class="px-6 py-5 text-center">
              <div class="relative w-[65px] h-[32px] overflow-hidden mx-auto">
                  <svg viewBox="0 0 100 50" class="w-full h-full">
                      <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                      <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(10)" stroke-width="12" stroke-linecap="round" 
                          :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * 10 / 100)" />
                  </svg>
                  <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                      10%
                  </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal View -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص مشروع البرج السكني' : 'Residential Tower Project Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Close Modal" class="w-6 h-6 transition-transform" :class="[isDark ? '' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>
          
          <div class="overflow-y-auto w-full no-scrollbar flex-1 relative bg-white dark:bg-[#00141080]">
            <table class="w-full text-left rtl:text-right border-collapse relative">
              <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
                  <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'الفعلي' : 'Actual' }}</th>
                  <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                  <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
                <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                  <tr class="transition-all duration-500 border-b"
                    :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
                    <td class="px-8 py-5">
                      <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                    </td>
                    <td class="px-6 py-5 text-center font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.actual }}</td>
                    <td class="px-6 py-5 text-center font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.budget }}</td>
                    <td class="px-6 py-5 text-center">
                        <div class="relative w-[65px] h-[32px] overflow-hidden mx-auto">
                            <svg viewBox="0 0 100 50" class="w-full h-full">
                                <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                                <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(item.progress)" stroke-width="12" stroke-linecap="round" 
                                    :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * item.progress / 100)" />
                            </svg>
                            <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold" :class="isDark ? 'text-white' : 'text-[#333333]'">
                                {{ item.progress }}%
                            </div>
                        </div>
                    </td>
                  </tr>
                </template>
                <!-- Total Row Modal -->
                <tr class="transition-all duration-500 sticky bottom-0 z-10" :class="isDark ? 'bg-[#00D9A4]' : 'bg-[#68E4C4]'">
                    <td class="px-8 py-5">
                      <span class="font-medium text-[14px]" :class="isDark ? 'text-black' : 'text-[#013e32]'">{{ currentLang === 'ar' ? 'إجمالي الربح' : 'Gross Profit' }}</span>
                    </td>
                    <td class="px-6 py-5 text-center font-bold text-[14px]" :class="isDark ? 'text-black' : 'text-[#013e32]'">17,500,000</td>
                    <td class="px-6 py-5 text-center font-medium text-[14px]" :class="isDark ? 'text-black' : 'text-[#013e32]'">550,000</td>
                    <td class="px-6 py-5 text-center">
                      <div class="relative w-[65px] h-[32px] overflow-hidden mx-auto">
                          <svg viewBox="0 0 100 50" class="w-full h-full">
                              <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                              <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(10)" stroke-width="12" stroke-linecap="round" 
                                  :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * 10 / 100)" />
                          </svg>
                          <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold" :class="isDark ? 'text-black' : 'text-[#013e32]'">
                              10%
                          </div>
                      </div>
                    </td>
                </tr>
              </tbody>
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
const isModalOpen = ref(false)

const tableData = [
  { label: 'Revenue', labelAr: 'الإيرادات', actual: '2,400,000', budget: '2,500,000', progress: 60, color: '#03D8B0' },
  { label: 'COGS', labelAr: 'تكلفة المبيعات', actual: '1,500,000', budget: '1,400,000', progress: 30, color: '#FFBC01' },
  { label: 'Indirect Expenses', labelAr: 'المصروفات غير المباشرة', actual: '600,000', budget: '550,000', progress: 10, color: '#FB7554' }
]

const gaugeColor = (value) => {
    if (value >= 50) return '#00d28e'
    if (value >= 25) return '#ffb74d'
    return '#fb7554'
}
</script>