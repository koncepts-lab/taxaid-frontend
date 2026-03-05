<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
    
    <div class="py-5 px-8 flex justify-between items-center">
      <div>
        <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
          {{ currentLang === 'ar' ? 'ملخص المصروفات غير المباشرة' : 'Indirect Expense Summary' }}
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

    <table class="w-full text-left rtl:text-right border-collapse">
      <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
        <tr>
          <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Expenses' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">
            <div class="flex items-center gap-1">
                {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
                <!-- <img src="/images/icons/edit-white.svg" alt="Link Icon" class="w-3 h-3 invert" /> -->
            </div>
          </th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الانحراف' : 'Variance' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, idx) in tableData" :key="idx">
          <tr class="transition-all duration-500" 
            :class="[
                !item.isTotal ? 'border-b' : '',
                isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50',
                item.isTotal ? (isDark ? 'bg-[#00D9A4]/20' : 'bg-[#68E4C4]') : ''
            ]">
            <td class="px-8 py-5">
              <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
            </td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ item.currentYear }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.previousYear }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.budget }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]">
                <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" 
                    :class="item.variance >= 0 
                    ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#68E4C4] text-[#008864]') 
                    : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                    {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
                </span>
            </td>
            <td class="px-6 py-5 text-left rtl:text-right">
                <div class="relative w-12 h-6 overflow-hidden">
                    <svg viewBox="0 0 100 50" class="w-full h-full">
                        <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                        <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(item.yearToGo)" stroke-width="12" stroke-linecap="round" 
                            :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * item.yearToGo / 100)" />
                    </svg>
                    <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold" :class="isDark ? 'text-white' : 'text-[#333333]'">
                        {{ item.yearToGo }}%
                    </div>
                </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص المصروفات غير المباشرة' : 'Indirect Expense Summary' }}
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
                  <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Expenses' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الانحراف' : 'Variance' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
                <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                  <tr class="transition-all duration-500"
                    :class="[
                        !item.isTotal ? 'border-b' : '',
                        isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50',
                        item.isTotal ? (isDark ? 'bg-[#00D9A4]/20' : 'bg-[#68E4C4]') : ''
                    ]">
                    <td class="px-8 py-5">
                      <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                    </td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ item.currentYear }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.previousYear }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.budget }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]">
                        <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" 
                            :class="item.variance >= 0 
                            ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#68E4C4] text-[#008864]') 
                            : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                            {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
                        </span>
                    </td>
                    <td class="px-6 py-5 text-left rtl:text-right">
                        <div class="relative w-12 h-6 overflow-hidden">
                            <svg viewBox="0 0 100 50" class="w-full h-full">
                                <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                                <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(item.yearToGo)" stroke-width="12" stroke-linecap="round" 
                                    :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * item.yearToGo / 100)" />
                            </svg>
                            <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold" :class="isDark ? 'text-white' : 'text-[#333333]'">
                                {{ item.yearToGo }}%
                            </div>
                        </div>
                    </td>
                  </tr>
                </template>
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

const tableData = ref([
  {
    label: 'Rent & Utilities',
    labelAr: 'الإيجار والمرافق',
    currentYear: '1,850,000',
    previousYear: '1,620,000',
    budget: '1,900,000',
    variance: 14.2,
    yearToGo: 50,
  },
  {
    label: 'Office Salaries & Wages',
    labelAr: 'رواتب وأجور المكتب',
    currentYear: '450,000',
    previousYear: '380,000',
    budget: '480,000',
    variance: 18.4,
    yearToGo: 30,
  },
  {
    label: 'Travel & Training',
    labelAr: 'السفر والتدريب',
    currentYear: '280,000',
    previousYear: '240,000',
    budget: '300,000',
    variance: -16.7,
    yearToGo: 20,
  },
  {
    label: 'Total Indirect Expenses',
    labelAr: 'إجمالي المصروفات غير المباشرة',
    currentYear: '2,775,000',
    previousYear: '2,405,000',
    budget: '2,890,000',
    variance: 15.4,
    yearToGo: 25,
    isTotal: true
  }
])

const gaugeColor = (value) => {
    if (value >= 50) return '#03D8B0'
    if (value >= 30) return '#FFBB00'
    return '#FF582F'
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
