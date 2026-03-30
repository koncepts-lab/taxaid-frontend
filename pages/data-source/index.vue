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
              :isDark="isDark" :currentLang="currentLang" :columns="[
                { label: 'Currency Code', labelAr: 'رمز العملة', key: 'code' },
                { label: 'Currency Name', labelAr: 'اسم العملة', key: 'name' }
              ]" :data="currencyData" @delete="prepareDelete" @add=" isAddModalOpen = true" />
            <DataSourceSettingsAddModal :isOpen="isAddModalOpen" :isDark="isDark" :currentLang="currentLang"
              @close=" isAddModalOpen = false" @save="onCurrencySave" />
            <DataSourceSettingsDeleteModal :isOpen="isDeleteModalOpen" :isDark="isDark" :currentLang="currentLang"
              @close="isDeleteModalOpen = false" @confirm="executeDelete" />
            <div class="space-y-8">
              <DataSourceAR v-if="activeSubTab === 'accounts-receivable' || activeSubTab === 'accounts-payable'"
                :type="agingType" :data="currentAgingData" :isDark="isDark" :currentLang="currentLang"
                :title="currrentTitle" />
              <DataSourceInterCompany
                v-if="activeMainTab !== 'certificate' && ['inter-company', 'contacts', 'internal-email', 'customers'].includes(activeSubTab)"
                :key="activeSubTab" :type="activeSubTab" :data="interCompanyData" :isDark="isDark"
                :currentLang="currentLang" @add="handleAddRow" @delete="handleDeleteRows" />
              <DataSourcePDC v-if="activeSubTab === 'pdc'" :pdcGroups="pdcSummaryData" :isDark="isDark"
                :currentLang="currentLang" @open-report="openPDCReport" />
              <DataSourceCostCenter v-if="activeSubTab === 'cost-center'" :isDark="isDark" :currentLang="currentLang"
                @open-report="handleOpenCCReport" />
              <DataSourcePDCModal :isOpen="isPDCModalOpen" :type="selectedPDCType" :data="pdcDetailedData"
                :isDark="isDark" :currentLang="currentLang" @close="isPDCModalOpen = false" />
              <DataSourceCostCenterModal :isOpen="isModalOpen" :title="modalConfig.title" :columns="modalConfig.columns"
                :data="modalConfig.data" :totalValue="modalConfig.total" :isDark="isDark" :currentLang="currentLang"
                @close="isModalOpen = false" />
              <DataSourceBudget v-if="activeSubTab === 'budget'" :isDark="isDark" :currentLang="currentLang"
                @open-budget-report="handleOpenBudgetReport" :isOpen="isBudgetOpen" />
              <DataSourceSalesForecast v-if="activeSubTab === 'sales-forecast'" :data="salesForecastData"
                :isDark="isDark" :currentLang="currentLang" @open-sales-report="isForecastModalOpen = true" />
              <DataSourceSalesForecastModal :isOpen="isForecastModalOpen" :data="salesForecastDetailedData"
                :isDark="isDark" :currentLang="currentLang" @close="isForecastModalOpen = false" />
              <DataSourceDataIn v-if="activeSubTab === 'data-in'" :dataInItems="dataInItems" :isDark="isDark"
                :currentLang="currentLang" @remove="handleRemove" />
              <DataSourceTrialBalance v-if="activeSubTab === 'trial-balance'" :isDark="isDark"
                :currentLang="currentLang" />
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

const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const isChatOpen = ref(true)
const isFullScreenChat = ref(false)
const isAddModalOpen = ref(false)
const isDeleteModalOpen = ref(false);
const itemPendingDeletion = ref(null);

const activeMainTab = ref('financial')
const activeSubTab = ref('settings')
const mainTabs = [
  {
    id: 'financial',
    label: 'Financial Data Sources',
    labelAr: 'مصادر البيانات المالية',
    icon: '/images/icons/Financial-Data-Sources.svg'
  },
  {
    id: 'contacts',
    label: 'Contacts & Customers',
    labelAr: 'جهات الاتصال والعملاء',
    icon: '/images/icons/Contacts-Customers.svg'
  },
  {
    id: 'certificate',
    label: 'Upload Certificate',
    labelAr: 'تحميل الشهادة',
    icon: '/images/icons/Upload-Certificate.svg'
  }
]
const subTabsFinancial = [
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات' },
  { id: 'data-in', label: 'Data In', labelAr: 'إدخال البيانات' },
  { id: 'trial-balance', label: 'Trial balance', labelAr: 'ميزان المراجعة' },
  { id: 'accounts-receivable', label: 'Accounts Receivable', labelAr: 'حسابات القبض' },
  { id: 'accounts-payable', label: 'Accounts Payable', labelAr: 'حسابات الدفع' },
  { id: 'inter-company', label: 'Inter Company', labelAr: 'بين الشركات' },
  { id: 'sales-forecast', label: 'Sales Forecast', labelAr: 'توقعات المبيعات' },
  { id: 'pdc', label: 'PDC', labelAr: 'الشيكات المؤجلة' },
  { id: 'cost-center', label: 'Cost Center', labelAr: 'مركز التكلفة' },
  { id: 'budget', label: 'Budget', labelAr: 'الميزانية' }
]
const subTabsContacts = [
  { id: 'contacts', label: 'Contacts', labelAr: 'جهات الاتصال' },
  { id: 'internal-email', label: 'Internal Email', labelAr: 'البريد الإلكتروني الداخلي' },
  { id: 'customers', label: 'Customers', labelAr: 'العملاء' }]
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

const pdcSummaryData = ref([
  {
    type: 'issued', label: 'PDC Issued', labelAr: 'الشيكات المؤجلة الصادرة',
    totalLabel: 'Total PDC issued', totalAmount: '1,250,000',
    due30: '1,250,000', due45: '1,250,000'
  },
  {
    type: 'received', label: 'PDC Received', labelAr: 'الشيكات المؤجلة الواردة',
    totalLabel: 'Total PDC received', totalAmount: '1,250,000',
    due30: '1,250,000', due45: '1,250,000'
  }
])

const pdcDetailedData = ref([
  { issueDate: '-', chequeDate: '-', bankName: '-', chequeNo: '-', partyName: '-', amount: '-' },
  { issueDate: '-', chequeDate: '-', bankName: '-', chequeNo: '-', partyName: '-', amount: '-' },
])

const openPDCReport = (type) => {
  selectedPDCType.value = type
  isPDCModalOpen.value = true
}


const tableColumns = [
  { label: '', labelAr: '' },
  { label: 'Currencies', labelAr: 'العملات' },
  { label: 'Status_List', labelAr: 'قائمة الحالة' },
  { label: 'Contact_Types', labelAr: 'أنواع جهات الاتصال' },
  { label: 'Payment_Terms', labelAr: 'شروط الدفع' },
  { label: 'Bank_Accounts', labelAr: 'الحسابات البنكية' },
  { label: 'PDC_Status', labelAr: 'حالة الشيكات المؤجلة' }
]
const currencyData = ref([
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'USD', name: 'US Dollar' }
]);


const tableData = ref([
  { id: 1, currency: 'INR', status: 'Open', contactType: 'Customer', paymentTerms: 'Immediate', bankAccount: 'Operating_AED', pdcStatus: 'Pending', selected: true },
  { id: 2, currency: 'AED', status: 'Partially Paid', contactType: 'Vendor', paymentTerms: 'Net 7', bankAccount: 'Operating_INR', pdcStatus: 'Deposited', selected: false },
  { id: 3, currency: 'SAR', status: 'Paid', contactType: 'Intercompany', paymentTerms: 'Net 15', bankAccount: 'Operating_SAR', pdcStatus: 'Cleared', selected: false },
  { id: 4, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false },
  { id: 5, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false },
  { id: 6, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false }
])
const arData = ref([
  { customer: 'AI Dhabi Contracting LLC', amount: '1,678,295.5', age1: '1,678,295.5', age2: '-', age3: '-', age4: '-' },
  { customer: 'AI Dhabi Contracting LLC', amount: '1,678,295.5', age1: '1,678,295.5', age2: '-', age3: '-', age4: '-' },
  { customer: 'AI Dhabi Contracting LLC', amount: '1,678,295.5', age1: '1,678,295.5', age2: '-', age3: '-', age4: '-' },
])

const arLogs = ref([
  { date: '06-Mar-2025', time: '14:23:45', user: 'consultant@taxaid.com', details: 'Historical AR data year set to 2022 and table locked' }
])
const apLogs = ref([
  { date: '10-Mar-2025', time: '09:15:22', user: 'admin@taxaid.com', details: 'Vendor payment terms updated for Global Suppliers' }
])
const pdcLogs = ref([
  {
    date: '11-Mar-2025',
    time: '16:45:10',
    user: 'manager@taxaid.com',
    details: 'Bulk import of 50 received PDCs completed and verified'
  }
])
const ccLogs = ref([
  {
    date: '11-Mar-2025',
    time: '16:45:10',
    user: 'manager@taxaid.com',
    details: 'Bulk import of 50 received PDCs completed and verified'
  }
])
const tbLogs = ref([
  {
    date: '11-Mar-2025',
    time: '16:45:10',
    user: 'manager@taxaid.com',
    details: 'Bulk import of 50 received PDCs completed and verified'
  }
])
const apData = ref([
  { customer: 'Global Suppliers Ltd', amount: '850,000.00', age1: '400,000.00', age2: '450,000.00', age3: '-', age4: '-' },
  { customer: 'Dubai Logistics Co', amount: '120,500.00', age1: '-', age2: '120,500.00', age3: '-', age4: '-' }
])
const dataInItems = ref([
  {
    id: 'ar',
    label: 'Account Receivable',
    labelAr: 'حسابات القبض',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'ap',
    label: 'Account Payable',
    labelAr: 'حسابات الدفع',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'pdcin',
    label: 'PDC In',
    labelAr: 'شيكات واردة',
    isUploaded: false,
    uploadDate: '',
    pdfUrl: ''
  },
  {
    id: 'pdcout',
    label: 'PDC Out',
    labelAr: 'شيكات صادرة',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'forecast',
    label: 'Sales Forecast',
    labelAr: 'توقعات المبيعات',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'budget',
    label: 'Budget',
    labelAr: 'الميزانية',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'cc_mapping',
    label: 'Cost Center Mapping',
    labelAr: 'تخطيط مراكز التكلفة',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'cc_master',
    label: 'Cost Center Master',
    labelAr: 'سجل مراكز التكلفة الرئيسي',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/cost_center_master.pdf'
  },
  {
    id: 'cc_budget',
    label: 'Cost Center Budget',
    labelAr: 'ميزانية مراكز التكلفة',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'prepaid',
    label: 'Prepaid Adjustments',
    labelAr: 'تسويات المصاريف المدفوعة مقدماً',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'ct_returns',
    label: 'CT Returns',
    labelAr: 'إقرارات ضريبة الشركات',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'vat_returns',
    label: 'VAT Returns',
    labelAr: 'إقرارات ضريبة القيمة المضافة',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
  {
    id: 'opening_bal',
    label: 'Opening Balance',
    labelAr: 'الرصيد الافتتاحي',
    isUploaded: true,
    uploadDate: 'Mar 07, 2026, 09:51 PM',
    pdfUrl: '/reports/Sales - SST 35 Community Hub_Ledger.pdf'
  },
])
const handleRemove = (id) => {
  const item = dataInItems.value.find(i => i.id === id)
  if (item) {
    item.isUploaded = false
    item.fileName = ''
  }
}
const interCompanyData = ref([
  {
    id: 1,
    entryId: 'TRX-9001',
    date: '10-Mar-2025',
    counterparty: 'Masterline Trading',
    description: 'Management Fee Transfer',
    fx: '1.00',
    dueType: 'Due From (+)',
    amountBase: '50,000.00',
    settlementDate: '30-Mar-2025',
    status: 'Pending',
    notes: 'Awaiting bank confirmation'
  },
  {
    id: 2,
    entryId: 'TRX-9002',
    date: '11-Mar-2025',
    counterparty: 'Apex Logistics',
    description: 'Shared Office Rent',
    fx: '3.67',
    dueType: 'Due To (-)',
    amountBase: '12,500.00',
    settlementDate: '25-Mar-2025',
    status: 'Settled',
    notes: ''
  }
])

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
    ? subTabsFinancial
    : subTabsContacts
})

watch(activeMainTab, (newTab) => {
  const newArray = newTab === 'financial' ? subTabsFinancial : subTabsContacts
  if (newArray.length > 0) {
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
const ccMappingColumns = [
  { label: 'Cost Center Name', labelAr: 'اسم مركز التكلفة', key: 'ccName' },
  { label: 'FS Code', labelAr: 'كود FS', key: 'fsCode' },
  { label: 'Main Group', labelAr: 'المجموعة الرئيسية', key: 'mainGroup' },
  { label: 'Sub Group', labelAr: 'المجموعة الفرعية', key: 'subGroup' },
  { label: 'Ledger Name', labelAr: 'اسم الأستاذ', key: 'ledger' }
]

const ccContractColumns = [
  { label: 'Project Name As Tally', labelAr: 'اسم المشروع (تارلي)', key: 'projectName' },
  { label: 'Status in 2025', labelAr: 'الحالة في 2025', key: 'status' },
  { label: 'Project Value', labelAr: 'قيمة المشروع', key: 'value' },
  { label: 'Variation', labelAr: 'الاختلاف', key: 'variation' },
  { label: 'Final Project Value', labelAr: 'قيمة المشروع النهائية', key: 'finalValue' }
]

const ccBudgetColumns = [
  { label: 'Project Name As Tally', labelAr: 'اسم المشروع (تارلي)', key: 'projectName' },
  { label: 'Status in 2025', labelAr: 'الحالة في 2025', key: 'status' },
  { label: 'Budgeted Cost', labelAr: 'التكلفة المرصودة', key: 'budgeted' },
  { label: 'Material Purchased', labelAr: 'المواد المشتراة', key: 'material' },
  { label: 'Labor Cost', labelAr: 'تكلفة العمالة', key: 'labor' }
]
const mappingData = ref([
  { ccName: 'TS 17 - Al Ain Zoo', fsCode: 'FS-001', mainGroup: 'Operations', subGroup: 'Direct Cost', ledger: 'Project A Ledger' },
  { ccName: 'TS 18 - Dubai Mall', fsCode: 'FS-002', mainGroup: 'Operations', subGroup: 'Direct Cost', ledger: 'Project B Ledger' },
])

const contractData = ref([
  { projectName: 'TS 17 - Al Ain Zoo', status: 'Closed', value: '3,43,000.00', variation: '-', finalValue: '3,43,000.00' },
  { projectName: 'TS 17 - Al Ain Zoo', status: 'Closed', value: '3,43,000.00', variation: '-', finalValue: '3,43,000.00' },
  { projectName: 'TS 17 - Al Ain Zoo', status: 'Closed', value: '3,43,000.00', variation: '-', finalValue: '3,43,000.00' },
])

const budgetData = ref([
  { projectName: 'TS 17 - Al Ain Zoo', status: 'Closed', budgeted: '3,43,000.00', material: '-', labor: '3,43,000.00' },
  { projectName: 'TS 17 - Al Ain Zoo', status: 'Closed', budgeted: '3,43,000.00', material: '-', labor: '3,43,000.00' },
])
const isModalOpen = ref(false)
const isBudgetOpen = ref(false)
const modalConfig = ref({ title: '', columns: [], data: [], total: '-' })

const handleOpenCCReport = (reportId) => {
  if (reportId === 'mapping') {
    modalConfig.value = {
      title: currentLang.value === 'ar' ? 'تقرير تخطيط مركز التكلفة' : 'Cost Center Mapping Report',
      columns: ccMappingColumns,
      data: mappingData.value,
      total: 'N/A'
    }
  } else if (reportId === 'contract') {
    modalConfig.value = {
      title: currentLang.value === 'ar' ? 'تقرير سجل العقود الرئيسي' : 'Contract Master Detailed Report',
      columns: ccContractColumns,
      data: contractData.value,
      total: '1,250,000'
    }
  } else if (reportId === 'budget') {
    modalConfig.value = {
      title: currentLang.value === 'ar' ? 'تقرير ميزانية مركز التكلفة' : 'Budget Cost Center Report',
      columns: ccBudgetColumns,
      data: budgetData.value,
      total: '840,000'
    }
  }
  isModalOpen.value = true
}
const budgetReportData = ref([
  { name: 'Sales Department', budgeted: '1,200,000.00', actual: '1,150,000.00', variance: '50,000.00', percent: '95.8%' },
  { name: 'Marketing & PR', budgeted: '450,000.00', actual: '480,000.00', variance: '-30,000.00', percent: '106.6%' },
  { name: 'Operations', budgeted: '2,500,000.00', actual: '2,400,000.00', variance: '100,000.00', percent: '96.0%' },
  { name: 'Human Resources', budgeted: '300,000.00', actual: '290,000.00', variance: '10,000.00', percent: '96.6%' },
])

// 2. LOGS FOR BUDGET PLANNING
const budgetLogs = ref([
  { date: '15-Mar-2026', time: '11:20:05', user: 'cfo@masterline.com', details: 'Revised Fixed Assets budget for Q3 2026' },
  { date: '12-Mar-2026', time: '09:05:44', user: 'admin@taxaid.com', details: 'Initial budget templates generated for all cost centers' }
])



const budgetColumns = [
  { label: 'Particulars', labelAr: 'التفاصيل', key: 'name' },
  { label: 'Budgeted', labelAr: 'الميزانية', key: 'budgeted' },
  { label: 'Actual', labelAr: 'الفعلي', key: 'actual' },
  { label: 'Variance', labelAr: 'التباين', key: 'variance' },
  { label: 'Utilized %', labelAr: 'نسبة الاستخدام', key: 'percent' }
]
const salesForecastData = ref([
  {
    id: '2025',
    label: '2025',
    quarters: [
      {
        id: 'q1',
        label: '1st Quarter',
        months: [
          {
            label: 'January',
            actual: '1,250,000',
            income: '1,300,000',
            forecast: '1,200,000',
            possible: '1,280,000',
            budget: '1,200,000',
            diff: '+100,000'
          },
          { label: 'February', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
          { label: 'March', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
        ]
      },
      {
        id: 'q1',
        label: '1st Quarter',
        months: [
          {
            label: 'January',
            actual: '1,250,000',
            income: '1,300,000',
            forecast: '1,200,000',
            possible: '1,280,000',
            budget: '1,200,000',
            diff: '+100,000'
          },
          { label: 'February', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
          { label: 'March', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
        ]
      },
      {
        id: 'q2',
        label: '2nd Quarter',
        months: [
          {
            label: 'April',
            actual: '1,250,000',
            income: '1,300,000',
            forecast: '1,200,000',
            possible: '1,280,000',
            budget: '1,200,000',
            diff: '+100,000'
          },
          { label: 'May', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
          { label: 'June', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
        ]
      },
      {
        id: 'q3',
        label: '3rd Quarter',
        months: [
          {
            label: 'July',
            actual: '1,250,000',
            income: '1,300,000',
            forecast: '1,200,000',
            possible: '1,280,000',
            budget: '1,200,000',
            diff: '+100,000'
          },
          { label: 'August', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
          { label: 'September', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
        ]
      },
      {
        id: 'q4',
        label: '4th Quarter',
        months: [
          {
            label: 'October',
            actual: '1,250,000',
            income: '1,300,000',
            forecast: '1,200,000',
            possible: '1,280,000',
            budget: '1,200,000',
            diff: '+100,000'
          },
          { label: 'November', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
          { label: 'December', actual: '', income: '', forecast: '', possible: '', budget: '', diff: '' },
        ]
      }
    ]
  }
])
const salesForecastLogs = ref([
  { date: '19-Mar-2026', time: '15:10:22', user: 'cfo@masterline.com', details: 'Updated Q3 sales targets based on market shift' }
])
const salesForecastDetailedColumns = [
  { label: 'Project Name', labelAr: 'اسم المشروع', key: 'projectName' },
  { label: 'Customer', labelAr: 'العميل', key: 'customer' },
  { label: 'Possibilty', labelAr: 'الاحتمالية', key: 'possibility' }, // Spelled "Possibilty" to match your image
  { label: 'Date', labelAr: 'التاريخ', key: 'date' },
  { label: 'AED', labelAr: 'درهم إماراتي', key: 'amount', textRight: true }
]
const salesForecastDetailedData = ref([
  {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  },
  {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  },
  {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: '6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: ' 6,12,147.91'
  }, {
    projectName: 'SST-34 Animal Shelter',
    customer: 'Lazourdy Contracting & Gen Maintanance',
    possibility: '100%',
    date: '3-Jan-25',
    amount: ' 6,12,147.91'
  },
])
const handleOpenBudgetReport = (id, title) => {
  modalConfig.value = {
    title: title,
    columns: budgetColumns,
    data: budgetReportData.value,
    total: '4,450,000.00'
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
