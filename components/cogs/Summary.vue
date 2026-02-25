<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
    
    <div class="py-5 px-8 flex justify-between items-center">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص تكلفة المبيعات' : 'COGS Summary' }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" @click="isModalOpen = true" />
      </div>
    </div>

    <table class="w-full text-left rtl:text-right border-collapse">
      <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
        <tr>
          <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}</th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">
             {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
             <img src="/images/icons/link-white.svg" class="inline-block w-4 h-4 ml-1 opacity-70" alt="" />
          </th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year' }}</th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'التباين' : 'Variance' }}</th>
          <th class="px-6 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'السنة للذهاب' : 'Year to Go' }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, idx) in tableData" :key="idx">
          <tr class="transition-all duration-500 border-b" 
            :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
            <td class="px-8 py-5">
              <span class="font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
            </td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] underline underline-offset-4 cursor-pointer" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00C9A2]'">{{ item.currentYear }}</td>
            <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.previousYear }}</td>
            <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.budget }}</td>
            <td class="px-6 py-5 text-right rtl:text-left">
              <span class="inline-block px-3 py-1 text-[14px] font-medium" style="border-radius: 19px;" 
                :class="item.variance >= 0 
                  ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') 
                  : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
              </span>
            </td>
            <td class="px-6 py-3 text-center">
              <!-- Half Circular Progress -->
              <div class="relative w-[55px] h-[36px] mx-auto flex items-end justify-center">
                <svg class="w-[55px] h-[36px]" viewBox="0 0 48 32">
                  <path d="M 4 28 A 20 20 0 0 1 44 28" :class="isDark ? 'text-[#ffffff1a]' : 'text-[#F2F2F2]'" stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round" />
                  <path d="M 4 28 A 20 20 0 0 1 44 28" :style="{ color: item.color, strokeDasharray: 62.83, strokeDashoffset: 62.83 - (62.83 * item.progress) / 100 }" stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round" class="transition-all duration-500" />
                </svg>
                <span class="absolute bottom-0 text-[11px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.progress }}%</span>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
          <td class="px-8 py-5 font-semibold text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'إجمالي تكلفة المبيعات' : 'Total COGS' }}</td>
          <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">2,775,000</td>
          <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">2,405,000</td>
          <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">2,890,000</td>
          <td class="px-6 py-5 text-right rtl:text-left">
            <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" :class="isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]'">
              +15.4%
            </span>
          </td>
          <td class="px-6 py-3 text-center">
              <div class="relative w-[55px] h-[36px] mx-auto flex items-end justify-center">
                <svg class="w-[55px] h-[36px]" viewBox="0 0 48 32">
                  <path d="M 4 28 A 20 20 0 0 1 44 28" class="text-white/30" stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round" />
                  <path d="M 4 28 A 20 20 0 0 1 44 28" style="color: #FB7554; stroke-dasharray: 62.83; stroke-dashoffset: 47.1225" stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round" />
                </svg>
                <span class="absolute bottom-0 text-[11px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">25%</span>
              </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)

const tableData = ref([
  {
    label: 'Product Sales',
    labelAr: 'مبيعات المنتجات',
    currentYear: '1,850,000',
    previousYear: '1,620,000',
    budget: '1,900,000',
    variance: 14.2,
    progress: 50,
    color: '#00A176'
  },
  {
    label: 'Service',
    labelAr: 'خدمة',
    currentYear: '450,000',
    previousYear: '380,000',
    budget: '480,000',
    variance: 18.4,
    progress: 30,
    color: '#FFC107'
  },
  {
    label: 'Subscriptions',
    labelAr: 'الاشتراكات',
    currentYear: '280,000',
    previousYear: '240,000',
    budget: '300,000',
    variance: -16.7,
    progress: 20,
    color: '#FB7554'
  }
])
</script>
