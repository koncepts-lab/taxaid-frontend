<template>
  <div class="w-full transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
    
    <div class="lg:px-8 px-4 py-5 flex justify-between items-center text-left rtl:text-right sticky top-0 z-30 rounded-t-3xl" :class="isDark ? 'bg-[#001410]' : 'bg-white'">
      <div>
        <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
          {{ currentLang === 'ar' ? 'ملخص المصروفات غير المباشرة' : 'Indirect Expense Summary' }}
        </p>
        <p class="text-[12px] font-normal mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <img :src="isDark ? '/images/icons/info-white.svg' : '/images/icons/info.svg'" alt="Info Icon" class="w-4 h-4 cursor-pointer hover:opacity-100" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity hidden lg:block" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="w-full max-w-full xl:overflow-visible overflow-x-auto custom-scrollbar relative">
      <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px] table-fixed">
        <colgroup>
            <col style="width: 25%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
        </colgroup>
        <thead class="text-white sticky top-[82px] z-20 shadow-sm" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr>
            <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Expenses' }}</th>
            <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">
              <div class="flex items-center gap-1">
                  {{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}
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
              <div class="flex items-center gap-2" :class="!item.isTotal ? 'cursor-pointer' : ''" @click="!item.isTotal && toggleExpand(item)">
                <span class="font-normal text-[14px]" :class="[isDark ? 'text-white' : 'text-[#333333]', item.isTotal ? 'font-medium' : '']">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                <svg v-if="!item.isTotal" class="w-2.5 h-2.5 transition-transform duration-300" :class="[expanded[item.label] ? 'rotate-180' : '', isDark ? 'text-white/70' : 'text-[#333333]']" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
              </div>
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
                <div class="relative w-[65px] h-[32px] overflow-hidden">
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

          <!-- Ledger sub-rows (Figma drill-down) -->
          <template v-if="expanded[item.label]">
            <tr v-if="expanded[item.label].loading" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
              <td colspan="6" class="px-12 py-3 text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">{{ currentLang === 'ar' ? 'جار التحميل...' : 'Loading...' }}</td>
            </tr>
            <tr v-else-if="expanded[item.label].error" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
              <td colspan="6" class="px-12 py-3 text-[13px] text-red-500">{{ expanded[item.label].error }}</td>
            </tr>
            <tr v-else-if="!expanded[item.label].rows.length" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
              <td colspan="6" class="px-12 py-3 text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">{{ currentLang === 'ar' ? 'لا توجد دفاتر لهذه الفترة' : 'No ledgers for this period' }}</td>
            </tr>
            <tr v-else v-for="led in expanded[item.label].rows" :key="item.label + led.name"
              class="border-b" :class="isDark ? 'bg-[#04C18F1A] border-white/10' : 'bg-[#A1E2D2]/60 border-white'">
              <td class="px-12 py-4">
                <button class="text-[13px] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity" :class="isDark ? 'text-white' : 'text-[#013e32]'"
                  :title="currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger'" @click="openLedger(led.name)">
                  {{ led.name }}
                </button>
              </td>
              <td class="px-6 py-4 text-left rtl:text-right text-[13px] font-medium" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.currentYear }}</td>
              <td class="px-6 py-4 text-left rtl:text-right text-[13px] font-medium" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.previousYear }}</td>
              <td class="px-6 py-4 text-left rtl:text-right text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
              <td class="px-6 py-4 text-left rtl:text-right text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
              <td class="px-6 py-4 text-left rtl:text-right text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>

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
          
          <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar bg-white dark:bg-[#00141080]">
            <div class="min-w-[1100px] flex flex-col flex-1 h-full">
              <!-- Header Table (Fixed) -->
              <div class="shrink-0 sticky top-0 z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                  <colgroup>
                      <col style="width: 25%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                  </colgroup>
                  <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                    <tr>
                      <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Expenses' }}</th>
                      <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</th>
                      <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</th>
                      <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                      <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'الانحراف' : 'Variance' }}</th>
                      <th class="px-6 py-5 font-medium text-left rtl:text-right text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <!-- Scrollable Body Table -->
              <div class="overflow-y-auto custom-scrollbar flex-1 max-h-[60vh]">
                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                  <colgroup>
                      <col style="width: 25%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                  </colgroup>
                  <tbody :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
                    <template v-for="(item, idx) in tableData" :key="'modal-' + idx">
                      <tr class="transition-all duration-500"
                        :class="[
                            !item.isTotal ? 'border-b' : '',
                            isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50',
                            item.isTotal ? (isDark ? 'bg-[#00D9A4]/20' : 'bg-[#68E4C4]') : ''
                        ]">
                        <td class="px-8 py-5">
                          <div class="flex items-center gap-2" :class="!item.isTotal ? 'cursor-pointer' : ''" @click="!item.isTotal && toggleExpand(item)">
                            <span class="font-normal text-[14px]" :class="[isDark ? 'text-white' : 'text-[#333333]', item.isTotal ? 'font-medium' : '']">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                            <svg v-if="!item.isTotal" class="w-2.5 h-2.5 transition-transform duration-300" :class="[expanded[item.label] ? 'rotate-180' : '', isDark ? 'text-white/70' : 'text-[#333333]']" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                          </div>
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
                            <div class="relative w-[65px] h-[32px] overflow-hidden">
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
    
                      <!-- Ledger sub-rows (Figma drill-down) -->
                      <template v-if="expanded[item.label]">
                        <tr v-if="expanded[item.label].loading" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                          <td colspan="6" class="px-12 py-3 text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">{{ currentLang === 'ar' ? 'جار التحميل...' : 'Loading...' }}</td>
                        </tr>
                        <tr v-else-if="expanded[item.label].error" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                          <td colspan="6" class="px-12 py-3 text-[13px] text-red-500">{{ expanded[item.label].error }}</td>
                        </tr>
                        <tr v-else-if="!expanded[item.label].rows.length" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                          <td colspan="6" class="px-12 py-3 text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">{{ currentLang === 'ar' ? 'لا توجد دفاتر لهذه الفترة' : 'No ledgers for this period' }}</td>
                        </tr>
                        <tr v-else v-for="led in expanded[item.label].rows" :key="'modal-' + item.label + led.name"
                          class="border-b" :class="isDark ? 'bg-[#04C18F1A] border-white/10' : 'bg-[#A1E2D2]/60 border-white'">
                          <td class="px-12 py-4">
                            <button class="text-[13px] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity" :class="isDark ? 'text-white' : 'text-[#013e32]'"
                              :title="currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger'" @click="openLedger(led.name)">
                              {{ led.name }}
                            </button>
                          </td>
                          <td class="px-6 py-4 text-left rtl:text-right text-[13px] font-medium" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.currentYear }}</td>
                          <td class="px-6 py-4 text-left rtl:text-right text-[13px] font-medium" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.previousYear }}</td>
                          <td class="px-6 py-4 text-left rtl:text-right text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
                          <td class="px-6 py-4 text-left rtl:text-right text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
                          <td class="px-6 py-4 text-left rtl:text-right text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <IndirectExpenseLedgerModal v-model:open="ledgerModalOpen" :ledger="activeLedger" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = ref(false)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const formatNumber = (val) => {
  if (val === null || val === undefined) return '0'
  const num = Number(val)
  return num.toLocaleString('en-US')
}

const parsePercent = (str) => {
  if (!str) return 0
  return parseFloat(str.replace('%', '')) || 0
}

const tableData = computed(() => {
  return props.data.map(item => ({
    label: item.subgroup,
    labelAr: item.subgroup, // API doesn't seem to have subgroupAr yet
    currentYear: formatNumber(item.current_year),
    previousYear: formatNumber(item.previous_year),
    budget: formatNumber(item.budget),
    variance: parsePercent(item.variance_percent),
    yearToGo: parsePercent(item.ytg_percent),
    isTotal: item.isTotal || false
  }))
})

const gaugeColor = (value) => {
    if (value >= 50) return '#00d28e'
    if (value >= 25) return '#ffb74d'
    return '#fb7554'
}

// ── Ledger drill-down (Figma) ────────────────────────────────────────────────

const { fetchSubgroupLedgers } = useIndirectExpense()

const expanded = ref({}) // subgroup label → { loading, error, rows }

const toggleExpand = async (item) => {
  const key = item.label
  if (expanded.value[key]) {
    delete expanded.value[key]
    return
  }
  expanded.value = { ...expanded.value, [key]: { loading: true, error: null, rows: [] } }
  try {
    const rows = await fetchSubgroupLedgers(key)
    expanded.value[key] = {
      loading: false,
      error: null,
      rows: rows.filter(r => !r.isTotal).map(r => ({
        name:         r.ledger_name,
        currentYear:  formatNumber(r.current_year),
        previousYear: formatNumber(r.previous_year),
      })),
    }
  } catch (e) {
    expanded.value[key] = { loading: false, error: e?.message ?? 'Failed to load ledgers', rows: [] }
  }
}

// Collapse everything when the page range/data changes — cached rows would be stale
watch(() => props.data, () => { expanded.value = {} })

const ledgerModalOpen = ref(false)
const activeLedger    = ref('')

const openLedger = (name) => {
  activeLedger.value    = name
  ledgerModalOpen.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
