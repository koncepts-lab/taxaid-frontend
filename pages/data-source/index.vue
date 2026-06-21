<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="relative z-10 flex h-full  overflow-hidden"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8">

        <div class=" data-source-container pt-8 lg:pt-0">
          <div class="mb-6">
            <h1 class="font-medium transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#013E32]'"
              style="font-size: 24px;">
              {{ currentLang === 'ar' ? 'إدارة مصدر البيانات' : 'Data Source Management' }}
            </h1>
            <p class="font-normal mt-1 transition-colors duration-300"
              :class="isDark ? 'text-white/60' : 'text-[#00000080]'" style="font-size: 14px;">
              {{ currentLang === 'ar' ? 'إدارة مصادر البيانات المالية والجهات الاتصال وشهادات API لتكامل GST/VAT/ERP' :
                'Manage your financial data sources, contacts, and API certificates for GST/VAT/ERP integrations' }}
            </p>
          </div>

          <div class="main-tabs mb-6 flex gap-2 p-1.5 transition-all duration-500"
            :class="isDark ? 'bg-[#014235] border border-white/5' : 'bg-[#84D8C5]'" style="border-radius: 50px;">

            <button v-for="(tab, index) in mainTabs" :key="index" @click="activeMainTab = tab.id"
              class="flex-1 flex items-center justify-center gap-2 px-6 py-3 transition-all duration-300 rounded-[50px] text-[15px]"
              :class="[
                activeMainTab === tab.id
                  ? (isDark ? 'bg-white text-[#013E32] shadow-lg' : 'bg-white text-black')
                  : (isDark ? 'text-white/70 hover:text-white' : 'text-[#0A0A0A]')
              ]">
              <img :src="tab.icon" class="w-5 h-5 transition-all"
                :class="{ 'invert brightness-200': isDark && activeMainTab !== tab.id }" :alt="tab.label" />
              <span class="font-normal">{{ currentLang === 'ar' ? tab.labelAr : tab.label }}</span>
            </button>
          </div>

          <div v-if="activeMainTab === 'financial' || activeMainTab === 'contacts'"
            class="sub-tabs-wrapper relative mb-6 flex items-center group overflow-hidden">

            <!-- Left Scroll Arrow -->
            <Transition name="fade">
              <div v-if="activeMainTab === 'financial'" class="absolute left-0 h-full flex justify-center items-center"
                style="background: linear-gradient(270deg, #84D7C5 0%, #F3F4F6 100%);">
                <button v-if="canScrollLeft" @click="scrollTabs('left')"
                  class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:scale-110 active:scale-95 z-20"
                  :class="isDark ? 'text-[#013E32]' : 'text-[#00B794]'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>
            </Transition>

            <!-- Scrollable Container -->
            <!-- Note: We use rounded-full if main tab is contacts to match your image -->
            <div ref="subTabsContainer" @scroll="updateArrowVisibility"
              class="sub-tabs-container flex-1 overflow-x-auto p-1.5 transition-all duration-500 no-scrollbar scroll-smooth"
              :class="[
                isDark ? 'bg-[#013E32] border border-white/5' : 'bg-[#84D8C5]',
                activeMainTab === 'contacts' ? 'rounded-full' : 'rounded-[10px]'
              ]">

              <div class="sub-tabs flex gap-2" :class="activeMainTab === 'contacts' ? 'w-full' : 'min-w-max'">
                <button v-for="tab in currentSubTabs" :key="tab.id" @click="activeSubTab = tab.id"
                  class="px-6 py-2.5 transition-all duration-300 whitespace-nowrap text-[15px] font-normal" :class="[
                    activeMainTab === 'contacts' ? 'flex-1 rounded-full' : 'rounded-[40px]',
                    activeSubTab === tab.id
                      ? (isDark ? 'bg-white text-[#013E32] shadow-md' : 'bg-white text-black shadow-sm')
                      : (isDark ? 'text-white/70 hover:text-white' : 'text-[#013E32] hover:bg-white/10')
                  ]">
                  {{ currentLang === 'ar' ? tab.labelAr : tab.label }}
                </button>
              </div>
            </div>

            <!-- Right Scroll Arrow -->
            <Transition name="fade">
              <div v-if="activeMainTab === 'financial'" class="absolute right-0 h-full flex justify-center items-center"
                style="background: linear-gradient(270deg, #F3F4F6 0%, #84D7C5 100%);">
                <button v-if="canScrollRight" @click="scrollTabs('right')"
                  class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:scale-110 active:scale-95 z-20"
                  :class="isDark ? 'text-[#013E32]' : 'text-[#00B794]'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
          <div>
            <DataSourceSettings v-if="activeSubTab === 'settings'" title="System Settings" titleAr="إعدادات النظام"
              description="Configure system currencies and preferences" descriptionAr="تكوين عملات النظام وتفضيلاته"
              :isDark="isDark" :currentLang="currentLang" :columns="currencyColumns" :data="currencyData"
              @delete="prepareDelete" @add=" isAddModalOpen = true" />
            <DataSourceSettingsAddModal :isOpen="isAddModalOpen" :isDark="isDark" :currentLang="currentLang"
              @close=" isAddModalOpen = false" @save="onCurrencySave" />
            <DataSourceSettingsDeleteModal :isOpen="isDeleteModalOpen" :isDark="isDark" :currentLang="currentLang"
              @close="isDeleteModalOpen = false" @confirm="executeDelete" />
            <div class="space-y-8">
              <!-- Accounts Receivable (live API) -->
              <DataSourceAR v-if="activeSubTab === 'accounts-receivable'"
                type="AR"
                :data="arData"
                :arRows="arRows"
                :arTotals="arTotals"
                :loading="arLoading"
                :error="arError"
                :isDark="isDark"
                :currentLang="currentLang"
                :title="currrentTitle" />
              <!-- Accounts Payable (live API) -->
              <DataSourceAR v-if="activeSubTab === 'accounts-payable'"
                type="AP"
                :data="apData"
                :arRows="apRows"
                :arTotals="apTotals"
                :loading="apLoading"
                :error="apError"
                :isDark="isDark"
                :currentLang="currentLang"
                :title="currrentTitle" />
              <DataSourceInterCompany
                v-if="activeMainTab !== 'certificate' && ['inter-company', 'vendor', 'internal-email', 'customers'].includes(activeSubTab)"
                :key="activeSubTab" :type="activeSubTab" :data="interCompanyData" :isDark="isDark"
                :currentLang="currentLang" @add="handleAddRow" @delete="handleDeleteRows" />
              <DataSourcePDC v-if="activeSubTab === 'pdc'" :pdcGroups="pdcSummaryData" :isDark="isDark"
                :currentLang="currentLang" @open-report="openPDCReport" />
              <DataSourceCostCenter v-if="activeSubTab === 'cost-center'" :isDark="isDark" :currentLang="currentLang"
                @open-report="handleOpenCCReport" />
              <DataSourcePDCModal :isOpen="isPDCModalOpen" :type="selectedPDCType" :data="pdcDetailedData"
                :totalAmount="pdcDetailedTotal" :isDark="isDark" :currentLang="currentLang" @close="isPDCModalOpen = false" />
              <DataSourceCostCenterModal :isOpen="isModalOpen" :title="modalConfig.title" :columns="modalConfig.columns"
                :data="modalConfig.data" :totalValue="modalConfig.total" :isDark="isDark" :currentLang="currentLang"
                @close="isModalOpen = false" />
              <DataSourceBudget v-if="activeSubTab === 'budget'" :isDark="isDark" :currentLang="currentLang"
                @open-budget-report="handleOpenBudgetReport" :isOpen="isBudgetOpen" />
              <DataSourceSalesForecast v-if="activeSubTab === 'sales-forecast'" :data="salesForecastItems"
                :isDark="isDark" :currentLang="currentLang" @open-sales-report="isForecastModalOpen = true" />
              <DataSourceSalesForecastModal :isOpen="isForecastModalOpen" :data="salesForecastDetailedData"
                :isDark="isDark" :currentLang="currentLang" @close="isForecastModalOpen = false" />
              <DataSourceDataIn v-if="activeSubTab === 'data-in'"
                :dataInItems="dataInItems"
                :loading="dataInLoading"
                :error="dataInError"
                :uploadFile="dataInUploadFile"
                :downloadSample="dataInDownloadSample"
                :uploadingId="dataInUploadingId"
                :isDark="isDark"
                :currentLang="currentLang"
                @remove="handleRemove"
                @uploaded="fetchDataInConfig" />
              <DataSourceTrialBalance v-if="activeSubTab === 'trial-balance'" :isDark="isDark"
                :currentLang="currentLang"
                :tbMappingData="tbMappingData"
                :tbConfigData="tbConfigData"
                :tbMappingOptions="tbMappingOptions"
                :tbSaving="tbSaving"
                :onUpdate="updateTrialBalance" />
              <DataSourceChangeLog
                v-if="activeSubTab === 'accounts-receivable' || activeSubTab === 'accounts-payable' || activeSubTab === 'pdc' || activeSubTab === 'cost-center' || activeSubTab === 'budget' || activeSubTab === 'sales-forecast' || activeSubTab === 'trial-balance'"
                :logs="currentLogs" :isDark="isDark" :currentLang="currentLang" />
            </div>
          </div>
          <div v-if="activeMainTab === 'certificate'">
            <DataSourceUploadCertificate />
          </div>
        </div>
      </div>


    </div>


  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useDataIn } from '../../composables/data-source/useDataIn'
import { usePDC } from '../../composables/data-source/usePDC'
import { useTrialBalance } from '../../composables/data-source/useTrialBalance'

// ── AR Aging Summary (live API) ────────────────────────────────────────────
const { rows: arRows, totals: arTotals, loading: arLoading, error: arError } = useArAgingSummary()

// ── AP Aging Summary (live API) ────────────────────────────────────────────
const { rows: apRows, totals: apTotals, loading: apLoading, error: apError } = useApAgingSummary()

// ── Trial Balance (live API) ───────────────────────────────────────────────
const { tbMappingData, tbConfigData, tbMappingOptions, tbSaving, updateTrialBalance } = useTrialBalance()

const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const isChatOpen = ref(true)
const isFullScreenChat = ref(false)
const isAddModalOpen = ref(false)
const isDeleteModalOpen = ref(false);
const itemPendingDeletion = ref(null);

// ── Data from data.json ──────────────────────────────────────────────────
const {
  mainTabs: mainTabsData,
  subTabsFinancial: subTabsFinancialData,
  subTabsContacts: subTabsContactsData,
  settings: settingsData,
  arData: arDataFromJson,
  apData: apDataFromJson,
  logs: logsData,
  interCompanyData: interCompanyDataFromJson,
  dataInItems: _dataInItemsFromJson,
  costCenterReports,
  budget: budgetData,
  salesForecast: salesForecastData,
} = useDataSourcePage()

const activeMainTab = ref('financial')
const activeSubTab = ref('settings')

// Computed aliases so template/logic reads identically to before
const mainTabs = computed(() => mainTabsData.value)
const subTabsFinancial = computed(() => subTabsFinancialData.value)
const subTabsContacts = computed(() => subTabsContactsData.value)
const searchQuery = ref('')
const subTabsContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
let resizeObserver = null
const isForecastModalOpen = ref(false)
const updateArrowVisibility = () => {
  const el = subTabsContainer.value
  if (!el) return


  const isRTL = document.dir === 'rtl' || currentLang.value === 'ar'
  const { scrollLeft, scrollWidth, clientWidth } = el

  const absScrollLeft = Math.abs(scrollLeft)
  const isOverflowing = scrollWidth > clientWidth + 2

  if (!isOverflowing) {
    canScrollLeft.value = false
    canScrollRight.value = false
    return
  }
  if (!isRTL) {
    canScrollLeft.value = scrollLeft > 5
    canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 5
  } else {
    canScrollRight.value = absScrollLeft > 5
    canScrollLeft.value = absScrollLeft + clientWidth < scrollWidth - 5
  }
}

const scrollTabs = (direction) => {
  const el = subTabsContainer.value
  if (!el) return

  const scrollAmount = 300
  const multiplier = direction === 'right' ? 1 : -1

  el.scrollBy({
    left: multiplier * scrollAmount,
    behavior: 'smooth'
  })
}

const onCurrencySave = (newData) => {
  currencyData.value.push({
    id: currencyData.value.length + 1,
    code: newData.code,
    name: newData.name,
  })
}
const prepareDelete = (row) => {
  itemPendingDeletion.value = row;
  isDeleteModalOpen.value = true;
};

const executeDelete = () => {
  if (itemPendingDeletion.value) {
    currencyData.value = currencyData.value.filter(
      item => item.code !== itemPendingDeletion.value.code
    );

    isDeleteModalOpen.value = false;
    itemPendingDeletion.value = null;

  }
};
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    updateArrowVisibility()
  })

  if (subTabsContainer.value) {
    resizeObserver.observe(subTabsContainer.value)
    const inner = subTabsContainer.value.querySelector('.sub-tabs')
    if (inner) resizeObserver.observe(inner)
  }

  nextTick(updateArrowVisibility)
  setTimeout(updateArrowVisibility, 100)
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

watch(() => currentLang.value, () => {
  nextTick(updateArrowVisibility)
})



const isPDCModalOpen = ref(false)
const selectedPDCType = ref('issued')


const {
  pdcGroups,
  pdcDetailedData,
  pdcDetailedTotal,
  fetchDetailed: fetchPdcDetailed,
} = usePDC()

const pdcSummaryData = computed(() => pdcGroups.value)

const openPDCReport = async (type) => {
  selectedPDCType.value = type
  await fetchPdcDetailed(type)
  isPDCModalOpen.value = true
}


// Settings (currency) from composable
const currencyData = ref([])
watch(settingsData, (val) => {
  if (val?.currencyData?.length && !currencyData.value.length) {
    currencyData.value = [...val.currencyData]
  }
}, { immediate: true })
const currencyColumns = computed(() => settingsData.value?.currencyColumns ?? [])


// AR / AP / Logs from composable
const arData = computed(() => arDataFromJson.value)
const apData = computed(() => apDataFromJson.value)
const arLogs = computed(() => logsData.value?.ar ?? [])
const apLogs = computed(() => logsData.value?.ap ?? [])
const pdcLogs = computed(() => logsData.value?.pdc ?? [])
const ccLogs = computed(() => logsData.value?.costCenter ?? [])
const tbLogs = computed(() => logsData.value?.trialBalance ?? [])
const budgetLogs = computed(() => logsData.value?.budget ?? [])
const salesForecastLogs = computed(() => logsData.value?.salesForecast ?? [])

// Data-In items — live from backend via useDataIn composable
const { items: dataInItems, loading: dataInLoading, error: dataInError, fetchConfig: fetchDataInConfig, uploadFile: dataInUploadFile, downloadSample: dataInDownloadSample, uploadingId: dataInUploadingId } = useDataIn()
onMounted(() => fetchDataInConfig())

// Inter-company from composable (kept as ref so add/delete can mutate)
const interCompanyData = ref([])
watch(interCompanyDataFromJson, (val) => {
  if (val?.length && !interCompanyData.value.length) {
    interCompanyData.value = val.map(row => ({ ...row }))
  }
}, { immediate: true })

// Legacy tableData (settings table, not sent to any component now — kept for compat)
const tableData = ref([
  { id: 1, currency: 'INR', status: 'Open', contactType: 'Customer', paymentTerms: 'Immediate', bankAccount: 'Operating_AED', pdcStatus: 'Pending', selected: true },
  { id: 2, currency: 'AED', status: 'Partially Paid', contactType: 'Vendor', paymentTerms: 'Net 7', bankAccount: 'Operating_INR', pdcStatus: 'Deposited', selected: false },
  { id: 3, currency: 'SAR', status: 'Paid', contactType: 'Intercompany', paymentTerms: 'Net 15', bankAccount: 'Operating_SAR', pdcStatus: 'Cleared', selected: false },
  { id: 4, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false },
])

const handleRemove = (id) => {
  const item = dataInItems.value.find(i => i.id === id)
  if (item) {
    item.isUploaded = false
    item.fileName = null
    item.uploadDate = null
  }
}
// interCompanyData is already declared above via watch on composable

const currentAgingData = computed(() => activeSubTab.value === 'accounts-receivable' ? arData.value : apData.value)
const currrentTitle = computed(() => activeSubTab.value === 'accounts-receivable' ? (currentLang.value === 'ar' ? 'حسابات القبض' : 'Accounts Receivable') : (currentLang.value === 'ar' ? 'حسابات الدفع' : 'Accounts Payable'))
const currentLogs = computed(() => {
  const logMap = {
    'accounts-receivable': arLogs.value,
    'accounts-payable': apLogs.value,
    'pdc': pdcLogs.value,
    'cost-center': ccLogs.value,
    'budget': budgetLogs.value,
    'sales-forecast': salesForecastLogs.value,
    'trial-balance': tbLogs.value


  }

  return logMap[activeSubTab.value] || []
})
const currentSubTabs = computed(() => {
  return activeMainTab.value === 'financial'
    ? subTabsFinancial.value
    : subTabsContacts.value
})

watch(activeMainTab, (newTab) => {
  const newArray = newTab === 'financial' ? subTabsFinancial.value : subTabsContacts.value
  if (newArray?.length > 0) {
    activeSubTab.value = newArray[0].id
  }
})

const agingType = computed(() => activeSubTab.value === 'accounts-receivable' ? 'AR' : 'AP')
const selectAll = ref(false)
const selectedCount = computed(() => tableData.value.filter(row => row.selected).length)

const toggleSelectAll = () => {
  tableData.value.forEach(row => row.selected = selectAll.value)
}

const getStatusClass = (status) => {
  const baseClasses = isDark.value
    ? 'bg-opacity-20 border border-opacity-30'
    : 'bg-opacity-10 border border-opacity-20'

  switch (status) {
    case 'Open':
    case 'Partially Paid':
      return `${baseClasses} bg-yellow-500 text-yellow-600 border-yellow-500`
    case 'Paid':
      return `${baseClasses} bg-green-500 text-green-600 border-green-500`
    case 'Overdue':
      return `${baseClasses} bg-red-500 text-red-600 border-red-500`
    default:
      return `${baseClasses} bg-gray-500 text-gray-600 border-gray-500`
  }
}
// Cost-center report columns/data from composable
const ccMappingColumns = computed(() => costCenterReports.value?.mappingColumns ?? [])
const ccContractColumns = computed(() => costCenterReports.value?.contractColumns ?? [])
const ccBudgetColumns = computed(() => costCenterReports.value?.budgetColumns ?? [])
const mappingData = computed(() => costCenterReports.value?.mappingData ?? [])
const contractData = computed(() => costCenterReports.value?.contractData ?? [])
const ccBudgetData = computed(() => costCenterReports.value?.budgetData ?? [])
const isModalOpen = ref(false)
const isBudgetOpen = ref(false)
const modalConfig = ref({ title: '', columns: [], data: [], total: '-' })

const handleOpenCCReport = (reportId) => {
  if (reportId === 'mapping') {
    modalConfig.value = {
      title: currentLang.value === 'ar' ? 'تقرير تخطيط مركز التكلفة' : 'Cost Center Mapping Report',
      columns: ccMappingColumns.value,
      data: mappingData.value,
      total: 'N/A'
    }
  } else if (reportId === 'contract') {
    modalConfig.value = {
      title: currentLang.value === 'ar' ? 'تقرير سجل العقود الرئيسي' : 'Contract Master Detailed Report',
      columns: ccContractColumns.value,
      data: contractData.value,
      total: costCenterReports.value?.contractTotal ?? '1,250,000'
    }
  } else if (reportId === 'budget') {
    modalConfig.value = {
      title: currentLang.value === 'ar' ? 'تقرير ميزانية مركز التكلفة' : 'Budget Cost Center Report',
      columns: ccBudgetColumns.value,
      data: ccBudgetData.value,
      total: costCenterReports.value?.budgetTotal ?? '840,000'
    }
  }
  isModalOpen.value = true
}
// Budget report data/columns from composable
const budgetReportData = computed(() => budgetData.value?.reportData ?? [])
const budgetColumns = computed(() => budgetData.value?.reportColumns ?? [])
const budgetReportTotal = computed(() => budgetData.value?.reportTotal ?? '-')

// Sales forecast from composable (salesForecastData from useDataSourcePage)
const salesForecastItems = computed(() => salesForecastData.value?.data ?? [])
const salesForecastDetailedData = computed(() => salesForecastData.value?.detailedData ?? [])


// salesForecastDetailedColumns kept for SalesForecastModal prop
const salesForecastDetailedColumns = [
  { label: 'Project Name', labelAr: 'اسم المشروع', key: 'projectName' },
  { label: 'Customer', labelAr: 'العميل', key: 'customer' },
  { label: 'Possibilty', labelAr: 'الاحتمالية', key: 'possibility' }, // Spelled "Possibilty" to match your image
  { label: 'Date', labelAr: 'التاريخ', key: 'date' },
  { label: 'AED', labelAr: 'درهم إماراتي', key: 'amount', textRight: true }
]


const handleOpenBudgetReport = (id, title) => {
  modalConfig.value = {
    title: title,
    columns: budgetColumns.value,
    data: budgetReportData.value,
    total: budgetReportTotal.value
  }
  isBudgetOpen.value = true
}
</script>

<style scoped>
.data-source-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sub-tabs-container::-webkit-scrollbar {
  height: 6px;
}

.sub-tabs-container::-webkit-scrollbar-track {
  background: transparent;
}

.sub-tabs-container::-webkit-scrollbar-thumb {
  background: #00B794;
  border-radius: 3px;
}

.sub-tabs-container::-webkit-scrollbar-thumb:hover {
  background: #009276;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 183, 148, 0.3);
}

table {
  border-collapse: separate;
  border-spacing: 0;
}


</style>
