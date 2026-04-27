<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl "
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">

    <div class="py-5 lg:lg: px-4 flex justify-between items-center">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص تكلفة المبيعات' : 'COGS Summary' }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon"
          class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 max-lg:hidden" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon"
          class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 max-lg:hidden" @click="isModalOpen = true" />
      </div>
    </div>
    <div class="w-full overflow-x-auto no-scrollbar">

      <table class="w-full text-left rtl:text-right border-collapse min-w-175 overflow-auto">
        <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr>
            <th class="lg:px-8 px-4 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}
            </th>
            <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">
              {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}

            </th>
            <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ?
              'السنة السابقة' : 'Previous Year' }}</th>
            <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ?
              'الميزانية' :
              'Budget' }}</th>
            <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ?
              'التباين' :
              'Variance' }}</th>
            <th class="lg:px-6 px-4 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ? 'السنة للذهاب' :
              'Year to Go' }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, idx) in tableData" :key="idx">
            <tr class="transition-all duration-500 border-b"
              :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
              <td class="lg:py-5 lg:px-6 px-4">
                <span class="font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ currentLang
                  ===
                  'ar' ? item.labelAr : item.label }}</span>
              </td>
              <td
                class="lg:px-6 px-4 py-5 text-right rtl:text-left font-medium text-[14px]  underline-offset-4 cursor-pointer"
                :class="isDark ? 'text-[#00FFBC]' : 'text-[#00C9A2]'">{{ item.currentYear }}</td>
              <td class="lg:px-6 px-4 py-5 text-right rtl:text-left text-[14px] font-semibold"
                :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.previousYear }}</td>
              <td class="lg:px-6 px-4 py-5 text-right rtl:text-left text-[14px] font-semibold"
                :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.budget }}</td>
              <td class="lg:px-6 px-4 py-5 text-right rtl:text-left">
                <span class="inline-block px-3 py-1 text-[14px] font-medium" style="border-radius: 19px;" :class="item.variance >= 0
                  ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]')
                  : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                  {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
                </span>
              </td>
              <td class="lg:px-6 px-4 py-3 text-center">
                <!-- Half Circular Progress -->
                <div class="relative w-[65px] h-[32px] mx-auto flex items-end justify-center">
                  <svg class="w-[65px] h-[32px]" viewBox="0 0 48 32">
                    <path d="M 4 28 A 20 20 0 0 1 44 28" :class="isDark ? 'text-[#ffffff1a]' : 'text-[#F2F2F2]'"
                      stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round" />
                    <path d="M 4 28 A 20 20 0 0 1 44 28"
                      :style="{ color: getProgressColor(item.progress), strokeDasharray: 62.83, strokeDashoffset: 62.83 - (62.83 * item.progress) / 100 }"
                      stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round"
                      class="transition-all duration-500" />
                  </svg>
                  <span class="absolute bottom-0 text-[10px] font-bold"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.progress }}%</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr v-if="summaryTotal" :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
            <td class="lg:py-5 lg:px-6 px-4 font-semibold text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
              {{
                currentLang ===
                  'ar' ? 'إجمالي تكلفة المبيعات' : 'Total COGS' }}</td>
            <td class="lg:px-6 px-4 py-5 text-right rtl:text-left font-semibold text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.currentYear }}</td>
            <td class="lg:px-6 px-4 py-5 text-right rtl:text-left font-semibold text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.previousYear }}</td>
            <td class="lg:px-6 px-4 py-5 text-right rtl:text-left font-semibold text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.budget }}</td>
            <td class="lg:px-6 px-4 py-5 text-right rtl:text-left">
              <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;"
                :class="summaryTotal.variance >= 0 ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                {{ summaryTotal.variance >= 0 ? '+' : '' }}{{ summaryTotal.variance }}%
              </span>
            </td>
            <td class="lg:px-6 px-4 py-3 text-center">
              <div class="relative w-[65px] h-[32px] mx-auto flex items-end justify-center">
                <svg class="w-[65px] h-[32px]" viewBox="0 0 48 32">
                  <path d="M 4 28 A 20 20 0 0 1 44 28" class="text-white/30" stroke-width="4" stroke="currentColor"
                    fill="none" stroke-linecap="round" />
                  <path d="M 4 28 A 20 20 0 0 1 44 28"
                    :style="{ color: getProgressColor(summaryTotal.progress), strokeDasharray: 62.83, strokeDashoffset: 62.83 - (62.83 * summaryTotal.progress) / 100 }" stroke-width="4"
                    stroke="currentColor" fill="none" stroke-linecap="round" class="transition-all duration-500" />
                </svg>
                <span class="absolute bottom-0 text-[10px] font-bold"
                  :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.progress }}%</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          :class="isDark ? 'bg-[#002e26]' : 'bg-[#fff]'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 lg: border-b"
            :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص تكلفة المبيعات' : 'COGS Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <button @click="isModalOpen = false"
              class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Close Modal"
                class="w-6 h-6 transition-transform" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>

          <div class="overflow-y-auto w-full no-scrollbar flex-1 relative"
            :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
            <table class="w-full text-left rtl:text-right border-collapse relative">
              <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="lg: py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'تكلفة المبيعات' : 'COGS' }}
                  </th>
                  <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">
                    {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
                  </th>
                  <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar'
                    ?
                    'السنة السابقة' : 'Previous Year' }}</th>
                  <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar'
                    ?
                    'الميزانية' : 'Budget' }}</th>
                  <th class="lg:px-6 px-4 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar'
                    ?
                    'التباين'
                    : 'Variance' }}</th>
                  <th class="lg:px-6 px-4 py-5 font-medium text-center text-[14px]">{{ currentLang === 'ar' ?
                    'السنة للذهاب'
                    :
                    'Year to Go' }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                  <tr class="transition-all duration-500 border-b"
                    :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
                    <td class="lg: py-5">
                      <span class="font-medium text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
                        currentLang === 'ar' ? item.labelAr : item.label }}</span>
                    </td>
                    <td
                      class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] underline underline-offset-4 cursor-pointer"
                      :class="isDark ? 'text-[#00FFBC]' : 'text-[#00C9A2]'">{{ item.currentYear }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-semibold"
                      :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.previousYear }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left text-[14px] font-semibold"
                      :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.budget }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left">
                      <span class="inline-block px-3 py-1 text-[14px] font-medium" style="border-radius: 19px;" :class="item.variance >= 0
                        ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]')
                        : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                        {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
                      </span>
                    </td>
                    <td class="px-6 py-3 text-center">
                      <div class="relative w-[65px] h-[32px] mx-auto flex items-end justify-center">
                        <svg class="w-[65px] h-[32px]" viewBox="0 0 48 32">
                          <path d="M 4 28 A 20 20 0 0 1 44 28" :class="isDark ? 'text-[#ffffff1a]' : 'text-[#F2F2F2]'"
                            stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round" />
                          <path d="M 4 28 A 20 20 0 0 1 44 28"
                            :style="{ color: getProgressColor(item.progress), strokeDasharray: 62.83, strokeDashoffset: 62.83 - (62.83 * item.progress) / 100 }"
                            stroke-width="4" stroke="currentColor" fill="none" stroke-linecap="round"
                            class="transition-all duration-500" />
                        </svg>
                        <span class="absolute bottom-0 text-[10px] font-bold"
                          :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.progress }}%</span>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot class="sticky bottom-0 z-10">
                <tr v-if="summaryTotal" :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
                  <td class="lg: py-5 font-semibold text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
                    currentLang === 'ar' ? 'إجمالي تكلفة المبيعات' : 'Total COGS' }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.currentYear }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.previousYear }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-semibold text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.budget }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left">
                    <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;"
                      :class="summaryTotal.variance >= 0 ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                      {{ summaryTotal.variance >= 0 ? '+' : '' }}{{ summaryTotal.variance }}%
                    </span>
                  </td>
                  <td class="px-6 py-3 text-center">
                    <div class="relative w-[65px] h-[32px] mx-auto flex items-end justify-center">
                      <svg class="w-[65px] h-[32px]" viewBox="0 0 48 32">
                        <path d="M 4 28 A 20 20 0 0 1 44 28" class="text-white/30" stroke-width="4"
                          stroke="currentColor" fill="none" stroke-linecap="round" />
                        <path d="M 4 28 A 20 20 0 0 1 44 28"
                          :style="{ color: getProgressColor(summaryTotal.progress), strokeDasharray: 62.83, strokeDashoffset: 62.83 - (62.83 * summaryTotal.progress) / 100 }" stroke-width="4"
                          stroke="currentColor" fill="none" stroke-linecap="round" class="transition-all duration-500" />
                      </svg>
                      <span class="absolute bottom-0 text-[10px] font-bold"
                        :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.progress }}%</span>
                    </div>
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
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)

const getProgressColor = (progress) => {
  if (progress >= 50) return '#00d28e'
  if (progress >= 25) return '#ffb74d'
  return '#fb7554'
}

const formatNumber = (val) => {
  if (val === null || val === undefined) return '0'
  const num = Number(val)
  if (isNaN(num)) return '0'
  return num.toLocaleString('en-US')
}

// Parse "80.56%" or "-38.52%" → number
const parsePercent = (val) => {
  if (val == null || val === 'null' || val === '') return 0
  const num = parseFloat(String(val).replace(/[^-0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

const tableData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return []
  return props.data
    .filter(item => !item.isTotal && !item.is_balance)
    .map(item => ({
      label: item.subgroup,
      labelAr: item.subgroup,
      currentYear: formatNumber(item.current_year),
      previousYear: formatNumber(item.previous_year),
      budget: formatNumber(item.budget),
      variance: parsePercent(item.variance_percent),
      progress: Math.max(0, Math.min(100, parsePercent(item.ytg_percent)))
    }))
})

const summaryTotal = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return null
  const row = props.data.find(item => item.isTotal)
  if (!row) return null
  return {
    currentYear: formatNumber(row.current_year),
    previousYear: formatNumber(row.previous_year),
    budget: formatNumber(row.budget),
    variance: parsePercent(row.variance_percent),
    progress: Math.max(0, Math.min(100, parsePercent(row.ytg_percent)))
  }
})
</script>
