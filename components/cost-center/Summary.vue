<template>
  <div class="w-full h-[29rem] transition-all duration-500 rounded-3xl flex flex-col overflow-hidden"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white shadow-sm'">

    <div class="py-5 lg:px-8 px-4 flex justify-between items-center shrink-0">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص مركز التكلفة' : 'Cost Center Summary' }}
        <CommonInfoTooltip tip="costCenterSummary.table" light class="ml-2 rtl:ml-0 rtl:mr-2" />
      </p>
      <div class="flex gap-4 items-center">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ valuesNote(false) }}
        </p>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon"
          class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 max-lg:hidden" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
    <table class="w-full text-left rtl:text-right border-collapse ">
      <thead class="text-white sticky top-0 " :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
        <tr>
          <th class="px-8 py-5 font-medium text-left rtl:text-right text-[14px]"><span class="inline-flex items-center gap-1.5">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }} <CommonInfoTooltip tip="costCenterSummary.particulars" light /></span></th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ? 'الإيرادات' :
            'Revenue' }} <CommonInfoTooltip tip="costCenterSummary.revenue" light align="right" /></span></th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
            'تكلفة المبيعات' : 'COGS' }} <CommonInfoTooltip tip="costCenterSummary.cogs" light align="right" /></span></th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
            'المصروفات غير المباشرة' : 'Indirect Exp.' }} <CommonInfoTooltip tip="costCenterSummary.indirect" light align="right" /></span></th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ? 'الربح' :
            'Profit' }} <CommonInfoTooltip tip="costCenterSummary.profit" light align="right" /></span></th>
          <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ? 'هامش الربح'
            : 'Profit Margin' }} <CommonInfoTooltip tip="costCenterSummary.margin" light align="right" /></span></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoading">
          <tr v-for="n in 5" :key="'sk' + n" class="border-b animate-pulse" :class="isDark ? 'border-white/5' : 'border-[#F2F2F2]'">
            <td class="px-8 py-5 text-left rtl:text-right"><div class="h-[14px] rounded" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', n % 2 ? 'w-40' : 'w-56']"></div></td>
            <td v-for="c in 4" :key="c" class="px-6 py-5 text-right rtl:text-left"><div class="h-[14px] w-20 ml-auto rtl:ml-0 rtl:mr-auto rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
            <td class="px-6 py-5 text-right rtl:text-left"><div class="h-[26px] w-16 ml-auto rtl:ml-0 rtl:mr-auto rounded-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
          </tr>
        </template>
        <tr v-else-if="!tableData.length">
          <td colspan="6" class="px-8 py-16 text-center text-[14px]" :class="isDark ? 'text-white/50' : 'text-gray-400'">
            {{ currentLang === 'ar' ? 'لا توجد بيانات لهذا التاريخ' : 'No data for this date' }}
          </td>
        </tr>
        <template v-for="(item, idx) in (isLoading ? [] : tableData)" :key="idx">
          <tr class="transition-all duration-500 border-b cursor-pointer" @mouseenter="onRowEnter"
            @mouseleave="onRowLeave" @click="goToDetail(item)"
            :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
            <td class="px-8 py-5 text-left rtl:text-right">
              <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang ===
                'ar' ? item.labelAr : item.label }}</span>
            </td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.revenue }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.cogs }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.indirectExp }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
              :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.profit }}</td>
            <td class="px-6 py-5 text-right rtl:text-left">
              <span class="inline-block px-3 py-1 text-[13px] font-medium tabular-nums" style="border-radius: 19px;" :class="item.margin >= 0
                ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]')
                : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                {{ item.margin >= 0 ? '+' : '' }}{{ item.margin }}%
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    </div>

    <table v-if="summaryTotal && !isLoading" class="w-full text-left rtl:text-right border-collapse shrink-0">
      <tfoot>
        <tr :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'" class="transition-all duration-500">
          <td class="px-8 py-5 font-normal text-[14px] text-left rtl:text-right" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
            currentLang === 'ar' ? summaryTotal.labelAr : summaryTotal.label }}</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.revenue }}</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.cogs }}</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.indirectExp }}</td>
          <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
            :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.profit }}</td>
          <td class="px-6 py-5 text-right rtl:text-left">
            <span class="inline-block px-3 py-1 text-[13px] font-medium tabular-nums" style="border-radius: 19px;"
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
        <div class="w-full max-h-[78vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b"
            :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص مركز التكلفة' : 'Cost Center Summary' }}
                <CommonInfoTooltip tip="costCenterSummary.table" class="ml-2 rtl:ml-0 rtl:mr-2" />
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ valuesNote(false) }}
              </p>
            </div>
            <button @click="isModalOpen = false"
              class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5 transition-transform"
                :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>

          <div class="overflow-y-auto w-full no-scrollbar flex-1 relative" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
            <table class="w-full text-left rtl:text-right border-collapse relative">
              <thead class="text-white sticky top-0 z-10" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="px-8 py-5 font-medium text-left rtl:text-right text-[14px]"><span class="inline-flex items-center gap-1.5">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }} <CommonInfoTooltip tip="costCenterSummary.particulars" light /></span></th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
                    'الإيرادات' : 'Revenue' }} <CommonInfoTooltip tip="costCenterSummary.revenue" light align="right" /></span></th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
                    'تكلفة المبيعات' : 'COGS' }} <CommonInfoTooltip tip="costCenterSummary.cogs" light align="right" /></span></th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
                    'المصروفات غير المباشرة' : 'Indirect Exp.' }} <CommonInfoTooltip tip="costCenterSummary.indirect" light align="right" /></span></th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
                    'الربح' :
                    'Profit' }} <CommonInfoTooltip tip="costCenterSummary.profit" light align="right" /></span></th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]"><span class="inline-flex items-center justify-end rtl:justify-start gap-1.5 w-full">{{ currentLang === 'ar' ?
                    'هامش الربح' : 'Profit Margin' }} <CommonInfoTooltip tip="costCenterSummary.margin" light align="right" /></span></th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                  <tr class="transition-all duration-500 border-b cursor-pointer"
                    @mouseenter="onRowEnter" @mouseleave="onRowLeave" @click="goToDetail(item)"
                    :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
                    <td class="px-8 py-5 text-left rtl:text-right">
                      <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr :
                        item.label }}</span>
                    </td>
                    <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
                      item.revenue }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.cogs
                      }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
                      item.indirectExp }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ item.profit
                      }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left">
                      <span class="inline-block px-3 py-1 text-[13px] font-medium tabular-nums" style="border-radius: 19px;"
                        :class="item.margin >= 0 ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#6EFFA04D] text-[#008864]') : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                        {{ item.margin >= 0 ? '+' : '' }}{{ item.margin }}%
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot class="sticky bottom-0 z-10">
                <tr v-if="summaryTotal" :class="isDark ? 'bg-[#1F6F4D]' : 'bg-[#70FDDA]'"
                  class="transition-all duration-500">
                  <td class="px-8 py-5 font-normal text-[14px] text-left rtl:text-right" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{
                    currentLang === 'ar' ? summaryTotal.labelAr : summaryTotal.label }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.revenue }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.cogs }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.indirectExp }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px] tabular-nums"
                    :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ summaryTotal.profit }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left">
                    <span class="inline-block px-3 py-1 text-[13px] font-medium tabular-nums" style="border-radius: 19px;"
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
import { formatStandardNumber, formatCurrency } from '~/utils/formatters'

const { isDark } = useTheme()
const { valuesNote } = useCurrency()
const currentLang = useState('currentLang', () => 'en')
const router = useRouter()

const isModalOpen = ref(false)
const hoveredRowRect = ref(null)
const isLoading = ref(true)

const tableData = ref([])
const summaryTotal = ref(null)

const onRowEnter = (e) => {
  hoveredRowRect.value = e.currentTarget.getBoundingClientRect()
}

const onRowLeave = () => {
  hoveredRowRect.value = null
}

const selectedDate = ref('')

const goToDetail = (item) => {
  router.push({
    path: `/cost-center/${item.id}`,
    query: selectedDate.value ? { date: selectedDate.value } : {}
  })
}

const mapApiData = (item) => {
  return {
    id: item.id,
    label: item.cost_center,
    labelAr: item.cost_center,
    revenue: formatCurrency(item.revenue, 2, '-'),
    cogs: item.direct_expenses != null && item.direct_expenses !== '' && item.direct_expenses !== '-' ? formatCurrency(item.direct_expenses, 2, '-') : '-',
    indirectExp: formatCurrency(item.indirect_expenses, 2, '-'),
    profit: formatCurrency(item.profit, 2, '-'),
    margin: isNaN(parseFloat(String(item.profit_margin).replace('%', ''))) ? 0 : parseFloat(String(item.profit_margin).replace('%', ''))
  }
}

const fetchSummaryData = async (dateStr = selectedDate.value) => {
  isLoading.value = true
  try {
    // 2. Use a Template Literal for a dynamic URL
    const response = await useApi(dateStr ? `cost-center/summary-by-date?date=${dateStr}` : 'cost-center/summary-by-date', {
      method: 'GET'
    })

    if (dateStr) {
      selectedDate.value = dateStr
    } else if (response?.to_date) {
      const [y, m, d] = String(response.to_date).split('-')
      selectedDate.value = `${d}-${m}-${y}`
    }

    if (response.status === 'success' && response.data) {
      const rawData = [...response.data]
      const totalItem = rawData.find(item => item.cost_center === "TOTAL")
      if (totalItem) summaryTotal.value = mapApiData(totalItem)

      tableData.value = rawData
        .filter(item => item.cost_center !== "TOTAL")
        .map(mapApiData)
    }
  } catch (error) {
    console.error("Failed to fetch data:", error)
  } finally {
    isLoading.value = false
  }
}
defineExpose({
  fetchSummaryData,
  tableData,
  summaryTotal
})

onMounted(() => {
  fetchSummaryData() // Fetches default on load
})
</script>