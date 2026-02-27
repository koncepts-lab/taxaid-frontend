<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
    
    <div class="py-5 px-8 flex justify-between items-center">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص مركز التكلفة' : 'Cost Center Summary' }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" @click="isModalOpen = true" />
      </div>
    </div>

    <table class="w-full text-left rtl:text-right border-collapse">
      <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
        <tr>
          <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Exp.' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الربح' : 'Profit' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'هامش الربح' : 'Profit Margin' }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, idx) in tableData" :key="idx">
          <tr class="transition-all duration-500 border-b" 
            :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
            <td class="px-8 py-5">
              <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
            </td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.revenue }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.cogs }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.indirectExp }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.profit }}</td>
            <td class="px-6 py-5 text-left rtl:text-right">
              <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" 
                :class="item.margin >= 0 
                  ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') 
                  : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                {{ item.margin >= 0 ? '+' : '' }}{{ item.margin }}%
              </span>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
          <td class="px-8 py-5 font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'إجمالي تكلفة المشروع' : 'Total Project Cost' }}</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">17,500,000</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">12,800,000</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">1,030,000</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">3,670,000</td>
          <td class="px-6 py-5 text-left rtl:text-right">
            <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" :class="isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]'">
              +21.0%
            </span>
          </td>
        </tr>
      </tfoot>
    </table>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص مركز التكلفة' : 'Cost Center Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 transition-transform" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>
          
          <div class="overflow-y-auto w-full no-scrollbar flex-1 relative bg-white dark:bg-[#00141080]">
            <table class="w-full text-left rtl:text-right border-collapse relative">
              <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Exp.' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الربح' : 'Profit' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'هامش الربح' : 'Profit Margin' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                  <tr class="transition-all duration-500 border-b border-[#F2F2F2] hover:bg-gray-50">
                    <td class="px-8 py-5">
                      <span class="font-normal text-[14px] text-[#333333]">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                    </td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{ item.revenue }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{ item.cogs }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{ item.indirectExp }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{ item.profit }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right">
                      <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" 
                        :class="item.margin >= 0 ? 'bg-[#6EFFA04D] text-[#008864]' : 'bg-[#FB75544D] text-[#FF582F]'">
                        {{ item.margin >= 0 ? '+' : '' }}{{ item.margin }}%
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot class="sticky bottom-0 z-10">
                <tr :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
                  <td class="px-8 py-5 font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang === 'ar' ? 'إجمالي تكلفة المشروع' : 'Total Project Cost' }}</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">17,500,000</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">12,800,000</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">1,030,000</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">3,670,000</td>
                  <td class="px-6 py-5 text-left rtl:text-right">
                    <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" :class="isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]'">
                      +21.0%
                    </span>
                  </td>
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

const isModalOpen = ref(false)

const tableData = ref([
  {
    label: 'Residential Projects',
    labelAr: 'المشاريع السكنية',
    revenue: '2,400,000',
    cogs: '1,500,000',
    indirectExp: '600,000',
    profit: '300,000',
    margin: 12.5,
  },
  {
    label: 'Commercial Projects',
    labelAr: 'المشاريع التجارية',
    revenue: '1,800,000',
    cogs: '1,100,000',
    indirectExp: '400,000',
    profit: '300,000',
    margin: 16.7,
  },
  {
    label: 'Infrastructure',
    labelAr: 'البنية التحتية',
    revenue: '2,000,000',
    cogs: '1,200,000',
    indirectExp: '500,000',
    profit: '300,000',
    margin: 15.0,
  }
])
</script>
