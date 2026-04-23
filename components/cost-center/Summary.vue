<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl max-h-100 overflow-y-auto"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">

    <div class="py-5 lg:px-8 px-4 flex justify-between items-center">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص مركز التكلفة' : 'Cost Center Summary' }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon"
          class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 max-lg:hidden" @click="isModalOpen = true" />
      </div>
    </div>

    <table class="w-full text-left rtl:text-right border-collapse ">
      <thead class="text-white sticky top-0 " :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
        <tr>
          <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الإيرادات' :
            'Revenue' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
            'تكلف المبيعات' : 'COGS' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
            'المصروفات غير المباشرة' : 'Indirect Exp.' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الربح' :
            'Profit' }}</th>
          <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'هامش الربح'
            : 'Profit Margin' }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, idx) in tableData" :key="idx">
          <tr class="transition-all duration-500 border-b cursor-pointer" @mouseenter="onRowEnter"
            @mouseleave="onRowLeave" @click="goToDetail(item)"
            :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
            <td class="px-8 py-5">
              <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang ===
                'ar' ? item.labelAr : item.label }}</span>
            </td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.revenue }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.cogs }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.indirectExp }}</td>
            <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.profit }}</td>
            <td class="px-6 py-5 text-left rtl:text-right">
              <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;" :class="item.margin >= 0
                ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]')
                : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                {{ item.margin >= 0 ? '+' : '' }}{{ item.margin }}%
              </span>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr v-if="summaryTotal" :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
          <td class="px-8 py-5 font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
            currentLang === 'ar' ? summaryTotal.labelAr : summaryTotal.label }}</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.revenue }}</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.cogs }}</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.indirectExp }}</td>
          <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.profit }}</td>
          <td class="px-6 py-5 text-left rtl:text-right">
            <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;"
              :class="summaryTotal.margin >= 0 ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
              {{ summaryTotal.margin >= 0 ? '+' : '' }}{{ summaryTotal.margin }}%
            </span>
          </td>
        </tr>
      </tfoot>
    </table>

    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b"
            :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص مركز التكلفة' : 'Cost Center Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <button @click="isModalOpen = false"
              class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 transition-transform"
                :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>

          <div class="overflow-y-auto w-full no-scrollbar flex-1 relative bg-white dark:bg-[#00141080]">
            <table class="w-full text-left rtl:text-right border-collapse relative">
              <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}
                  </th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
                    'الإيرادات' : 'Revenue' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
                    'تكلفة المبيعات' : 'COGS' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
                    'المصروفات غير المباشرة' : 'Indirect Exp.' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
                    'الربح' :
                    'Profit' }}</th>
                  <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ?
                    'هامش الربح' : 'Profit Margin' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                  <tr class="transition-all duration-500 border-b border-[#F2F2F2] hover:bg-gray-50 cursor-pointer"
                    @mouseenter="onRowEnter" @mouseleave="onRowLeave" @click="goToDetail(item)">
                    <td class="px-8 py-5">
                      <span class="font-normal text-[14px] text-[#333333]">{{ currentLang === 'ar' ? item.labelAr :
                        item.label }}</span>
                    </td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{
                      item.revenue }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{ item.cogs
                      }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{
                      item.indirectExp }}</td>
                    <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px] text-[#1A1A1A]">{{ item.profit
                      }}</td>
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
                <tr v-if="summaryTotal" :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'"
                  class="transition-all duration-500">
                  <td class="px-8 py-5 font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
                    currentLang === 'ar' ? summaryTotal.labelAr : summaryTotal.label }}</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.revenue }}</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.cogs }}</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.indirectExp }}</td>
                  <td class="px-6 py-5 text-left rtl:text-right font-medium text-[14px]"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.profit }}</td>
                  <td class="px-6 py-5 text-left rtl:text-right">
                    <span class="inline-block px-3 py-1 text-[13px] font-medium" style="border-radius: 19px;"
                      :class="summaryTotal.margin >= 0 ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                      {{ summaryTotal.margin >= 0 ? '+' : '' }}{{ summaryTotal.margin }}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Row Hover Tooltip -->
    <Teleport to="body">
      <div v-if="hoveredRowRect" :style="{
        top: hoveredRowRect.top - 12 + 'px',
        left: hoveredRowRect.left + hoveredRowRect.width / 2 + 'px',
        transform: 'translate(-50%, -100%)'
      }"
        class="fixed z-[99999] px-4 py-2 text-[14px] font-normal rounded-2xl whitespace-nowrap shadow-xl pointer-events-none transition-opacity duration-300"
        :class="isDark ? 'bg-white text-black' : 'bg-[#003228] text-white'">
        {{ currentLang === 'ar' ? 'انقر لعرض التفاصيل' : 'Click to view details' }}
        <div class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 border-x-[6px] border-x-transparent border-t-[6px]"
          :class="isDark ? 'border-t-white' : 'border-t-[#003228]'"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const router = useRouter()

const isModalOpen = ref(false)
const hoveredRowRect = ref(null)
const isLoading = ref(true)

// Reactive references for the data
const tableData = ref([])
const summaryTotal = ref(null)

const onRowEnter = (e) => {
  hoveredRowRect.value = e.currentTarget.getBoundingClientRect()
}

const onRowLeave = () => {
  hoveredRowRect.value = null
}

const goToDetail = (item) => {
  router.push('/cost-center/project-detail')
}

// Mapping Function to clean and format API data
const mapApiData = (item) => {
  return {
    label: item.cost_center,
    labelAr: item.cost_center, // API doesn't provide Arabic, using same for now
    revenue: item.revenue,
    cogs: item.cogs || '-',
    indirectExp: item.indirect_expenses,
    profit: item.profit,
    // Convert margin string "-433.7%" to numeric -433.7 for the CSS logic
    margin: parseFloat(item.profit_margin.replace('%', ''))
  }
}

const fetchSummaryData = async () => {
  isLoading.value = true
  try {
    const response = await useApi('cost-center/summary-by-date?date=31-12-2025', {
      method: 'GET'
    })

    if (response.status === 'success' && response.data) {
      const rawData = [...response.data]

      // 1. Extract the "TOTAL" row (it's the last item in your JSON)
      const totalItem = rawData.find(item => item.cost_center === "TOTAL")
      if (totalItem) {
        summaryTotal.value = mapApiData(totalItem)
      }

      // 2. Filter out the "TOTAL" row from the main list and map the rest
      tableData.value = rawData
        .filter(item => item.cost_center !== "TOTAL")
        .map(mapApiData)
    }
  } catch (error) {
    console.error("Failed to fetch cost center summary:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSummaryData()
})
// Expose the data to the parent component
defineExpose({
  tableData,
  summaryTotal
})
</script>