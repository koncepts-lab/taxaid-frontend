<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="relative z-10 flex h-screen overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <!-- LEFT AREA: Resizes dynamically -->
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8" :class="isChatOpen 
        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
        : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')">
        
        <div class="data-source-container pt-8 lg:pt-0">
          <!-- Page Title & Description -->
          <div class="mb-6">
            <h1 class="font-medium transition-colors duration-300" 
                :class="isDark ? 'text-white' : 'text-[#013E32]'"
                style="font-size: 24px;">
              {{ currentLang === 'ar' ? 'إدارة مصدر البيانات' : 'Data Source Management' }}
            </h1>
            <p class="font-normal mt-1 transition-colors duration-300" 
               :class="isDark ? 'text-white/60' : 'text-[#00000080]'"
               style="font-size: 14px;">
              {{ currentLang === 'ar' ? 'إدارة مصادر البيانات المالية والجهات الاتصال وشهادات API لتكامل GST/VAT/ERP' : 'Manage your financial data sources, contacts, and API certificates for GST/VAT/ERP integrations' }}
            </p>
          </div>

          <!-- Main Tabs -->
          <div class="main-tabs mb-6 flex gap-2 p-1.5 transition-all duration-300"
              style="background-color: #84D8C5; border-radius: 50px;">
            <button 
              v-for="(tab, index) in mainTabs" 
              :key="index"
              @click="activeMainTab = tab.id"
              class="flex-1 flex items-center justify-center gap-2 px-6 py-3 transition-all duration-300"
              :style="activeMainTab === tab.id 
                ? 'background: #fff; border-radius: 50px; color: #000; font-weight: 400; font-size: 15px;'
                : 'font-weight: 400; font-size: 15px; color: #0A0A0A;'">
              <img :src="tab.icon" class="w-5 h-5" :alt="tab.label" />
              <span>{{ currentLang === 'ar' ? tab.labelAr : tab.label }}</span>
            </button>
          </div>

          <!-- Sub Navigation Tabs (Horizontal Scroll) -->
          <div class="sub-tabs-container mb-6 overflow-x-auto p-2" 
              style="background-color: #84D7C5; border-radius: 10px;">
            <div class="sub-tabs flex gap-2 min-w-max">
              <button 
                v-for="(tab, index) in subTabs" 
                :key="index"
                @click="activeSubTab = tab.id"
                class="px-5 py-2 transition-all duration-300 whitespace-nowrap"
                :style="activeSubTab === tab.id 
                  ? 'background: #fff; border-radius: 40px; box-shadow: none; color: #000; font-size: 15px; font-weight: 400;'
                  : 'background: transparent; color: #000; border-radius: 40px; font-size: 15px; font-weight: 400;'">
                {{ currentLang === 'ar' ? tab.labelAr : tab.label }}
              </button>
            </div>
          </div>

          <!-- Content Area -->
          <div class="content-area rounded-[20px] p-8 transition-all duration-300"
              :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">
            
            <!-- System Settings Header & Search -->
            <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h2 class="text-[20px] font-medium transition-colors duration-300" 
                    :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                  {{ currentLang === 'ar' ? 'إعدادات النظام' : 'System Settings' }}
                </h2>
                <p class="text-[14px] mt-1 transition-colors duration-300" 
                  :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                  {{ currentLang === 'ar' ? 'تكوين معلمات النظام والقيم الافتراضية' : 'Configure system parameters and default values' }}
                </p>
              </div>
              
              <!-- Search Bar -->
              <div class="relative w-full md:w-[480px]">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5" :class="isDark ? 'text-[#00B794]' : 'text-[#84D7C5]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  v-model="searchQuery"
                  :placeholder="currentLang === 'ar' ? 'البحث في الإعدادات...' : 'Search settings...'"
                  class="w-full pl-12 pr-4 py-2.5 rounded-[12px] border transition-all duration-300 text-[15px] focus:outline-none"
                  :class="isDark 
                    ? 'bg-[#015F4D]/30 border-[#00B794]/30 text-white placeholder-white/40 focus:border-[#00B794]' 
                    : 'bg-[#F0FAF9] border-[#84D7C5] text-[#0A0A0A] placeholder-[#00000080] focus:border-[#00B794]'">
              </div>
            </div>

            <!-- Action Buttons Row -->
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <!-- Left Actions -->
              <div class="flex items-center gap-4 w-full md:w-auto">
                <span class="text-[15px] transition-colors duration-300"
                      :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                  {{ selectedCount }} {{ currentLang === 'ar' ? 'محدد' : 'Selected' }}
                </span>
                <button class="flex items-center gap-2 px-6 py-2 rounded-[12px] border transition-all duration-300 text-[15px] hover:opacity-80"
                        :class="isDark ? 'border-[#00B794]/40 text-white' : 'border-[#84D7C5] text-[#0A0A0A]'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{{ currentLang === 'ar' ? 'حذف' : 'Delete' }}</span>
                </button>

                <button class="flex items-center gap-2 px-6 py-2 rounded-[12px] border transition-all duration-300 text-[15px] hover:opacity-80"
                        :class="isDark ? 'border-[#00B794]/40 text-white' : 'border-[#84D7C5] text-[#0A0A0A]'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{{ currentLang === 'ar' ? 'تصدير' : 'Export' }}</span>
                </button>
              </div>

              <!-- Right Actions -->
              <div class="flex items-center gap-4 w-full md:w-auto">
                <button class="flex items-center gap-2 px-6 py-2 rounded-[12px] border transition-all duration-300 text-[15px] hover:opacity-80"
                        :class="isDark ? 'border-[#00B794]/40 text-white' : 'border-[#84D7C5] text-[#0A0A0A]'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>{{ currentLang === 'ar' ? 'استيراد Excel' : 'Import Excel' }}</span>
                </button>

                <button class="flex items-center gap-2 px-8 py-2.5 rounded-[10px] transition-all duration-300 text-[15px] hover:opacity-90 shadow-sm"
                        :class="isDark ? 'bg-[#00B794] text-white' : 'bg-[#008169] text-white'">
                  <span class="text-xl leading-none">+</span>
                  <span>{{ currentLang === 'ar' ? 'إضافة جديد' : 'Add New' }}</span>
                </button>
              </div>
            </div>

            <!-- Data Table -->
            <div class="overflow-x-auto rounded-[15px] border border-gray-200">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="transition-colors duration-300 bg-[#008169] text-white">
                    <th class="px-6 py-4 w-12 rounded-tl-[15px]">
                      <div class="w-5 h-5 rounded border border-white/40 flex items-center justify-center cursor-pointer">
                        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="opacity-0 absolute w-5 h-5 cursor-pointer">
                        <div v-if="selectAll" class="w-3 h-3 bg-white rounded-[2px]"></div>
                      </div>
                    </th>
                    <th v-for="(column, index) in tableColumns.filter(c => c.label)" 
                        :key="index"
                        class="px-4 py-4 text-[14px] font-normal transition-colors duration-300"
                        :class="index === tableColumns.filter(c => c.label).length - 1 ? 'rounded-tr-[15px]' : ''">
                      {{ currentLang === 'ar' ? column.labelAr : column.label }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in tableData" 
                      :key="index"
                      class="transition-all duration-300"
                      :class="isDark ? 'hover:bg-[#00B794]/5' : 'hover:bg-gray-50/50'">
                    <td class="px-6 py-4 transition-colors duration-300"
                        :class="[
                          isDark ? 'border-b border-[#00B794]/10' : 'border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors"
                            :class="row.selected 
                                ? 'bg-[#008169] border-[#008169]' 
                                : 'border-gray-300 bg-white'">
                          <input type="checkbox" v-model="row.selected" class="opacity-0 absolute w-5 h-5 cursor-pointer">
                          <svg v-if="row.selected" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span class="text-[14px] text-gray-500 min-w-[20px]">{{ row.id }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-[14px] font-medium transition-colors duration-300"
                        :class="[
                          isDark ? 'text-white border-b border-[#00B794]/10' : 'text-[#0A0A0A] border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      {{ row.currency }}
                    </td>
                    <td class="px-4 py-4 text-[14px] transition-colors duration-300"
                        :class="[
                          isDark ? 'text-white/80 border-b border-[#00B794]/10' : 'text-[#0A0A0A] border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      {{ row.status }}
                    </td>
                    <td class="px-4 py-4 text-[14px] transition-colors duration-300"
                        :class="[
                          isDark ? 'text-white/80 border-b border-[#00B794]/10' : 'text-[#0A0A0A] border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      {{ row.contactType }}
                    </td>
                    <td class="px-4 py-4 text-[14px] transition-colors duration-300"
                        :class="[
                          isDark ? 'text-white/80 border-b border-[#00B794]/10' : 'text-[#0A0A0A] border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      {{ row.paymentTerms }}
                    </td>
                    <td class="px-4 py-4 text-[14px] transition-colors duration-300"
                        :class="[
                          isDark ? 'text-white/80 border-b border-[#00B794]/10' : 'text-[#0A0A0A] border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      {{ row.bankAccount }}
                    </td>
                    <td class="px-4 py-4 text-[14px] transition-colors duration-300"
                        :class="[
                          isDark ? 'text-white/80 border-b border-[#00B794]/10' : 'text-[#0A0A0A] border-b border-gray-200',
                          index === tableData.length - 1 ? 'border-none' : ''
                        ]">
                      {{ row.pdcStatus }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Footer -->
            <div class="mt-6 text-center">
              <p class="text-[14px] transition-colors duration-300"
                :class="isDark ? 'text-white/40' : 'text-[#00000080]'">
                {{ currentLang === 'ar' ? 'انقر نقرًا مزدوجًا على أي صف لتحرير القيم' : 'Double click on any row to edit values' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. RIGHT SIDEBAR -->
      <aside class="fixed z-[1000] transition-all duration-500 ease-in-out" :class="[
        currentLang === 'ar' ? 'left-0' : 'right-0',
        'lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:mt-5',
        isChatOpen
          ? 'bottom-0 w-full translate-y-0'
          : 'bottom-24 w-[80px]',
        isChatOpen ? 'lg:2xl:w-120 lg:w-100' : 'lg:w-[80px]'
      ]">
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
      </aside>
    </div>

    <!-- FULL SCREEN CHAT -->
    <div v-else class="w-full flex overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <!-- Full Sidebar version -->
      <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
        <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />
      </aside>

      <!-- Main Chat Window -->
      <main class="flex-1">
        <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const isChatOpen = ref(true)
const isFullScreenChat = ref(false)

// Active tabs
const activeMainTab = ref('financial')
const activeSubTab = ref('settings')

// Search
const searchQuery = ref('')

// Main tabs
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

// Sub tabs
const subTabs = [
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات' },
  { id: 'trial-balance', label: 'Trial balance', labelAr: 'ميزان المراجعة' },
  { id: 'accounts-receivable', label: 'Accounts Receivable', labelAr: 'حسابات القبض' },
  { id: 'accounts-payable', label: 'Accounts Payable', labelAr: 'حسابات الدفع' },
  { id: 'inter-company', label: 'Inter Company', labelAr: 'بين الشركات' },
  { id: 'bank-reconciliation', label: 'Bank Reconciliation', labelAr: 'تسوية البنك' },
  { id: 'pdc-in', label: 'PDC In', labelAr: 'شيكات مؤجلة واردة' },
  { id: 'pdc-out', label: 'PDC Out', labelAr: 'شيكات مؤجلة صادرة' },
  { id: 'budget', label: 'Budget', labelAr: 'الميزانية' }
]

// Table columns
const tableColumns = [
  { label: '', labelAr: '' },
  { label: 'Currencies', labelAr: 'العملات' },
  { label: 'Status_List', labelAr: 'قائمة الحالة' },
  { label: 'Contact_Types', labelAr: 'أنواع جهات الاتصال' },
  { label: 'Payment_Terms', labelAr: 'شروط الدفع' },
  { label: 'Bank_Accounts', labelAr: 'الحسابات البنكية' },
  { label: 'PDC_Status', labelAr: 'حالة الشيكات المؤجلة' }
]

// Table data
const tableData = ref([
  { id: 1, currency: 'INR', status: 'Open', contactType: 'Customer', paymentTerms: 'Immediate', bankAccount: 'Operating_AED', pdcStatus: 'Pending', selected: true },
  { id: 2, currency: 'AED', status: 'Partially Paid', contactType: 'Vendor', paymentTerms: 'Net 7', bankAccount: 'Operating_INR', pdcStatus: 'Deposited', selected: false },
  { id: 3, currency: 'SAR', status: 'Paid', contactType: 'Intercompany', paymentTerms: 'Net 15', bankAccount: 'Operating_SAR', pdcStatus: 'Cleared', selected: false },
  { id: 4, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false },
  { id: 5, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false },
  { id: 6, currency: 'USD', status: 'Overdue', contactType: 'Bank', paymentTerms: 'Net 30', bankAccount: 'Operating_SAR', pdcStatus: 'Returned', selected: false }
])

// Select all functionality
const selectAll = ref(false)
const selectedCount = computed(() => tableData.value.filter(row => row.selected).length)

const toggleSelectAll = () => {
  tableData.value.forEach(row => row.selected = selectAll.value)
}

// Status styling
const getStatusClass = (status) => {
  const baseClasses = isDark.value 
    ? 'bg-opacity-20 border border-opacity-30' 
    : 'bg-opacity-10 border border-opacity-20'
  
  switch(status) {
    case 'Open':
      return `${baseClasses} bg-blue-500 text-blue-600 border-blue-500`
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

const getPDCStatusClass = (status) => {
  const baseClasses = isDark.value 
    ? 'bg-opacity-20 border border-opacity-30' 
    : 'bg-opacity-10 border border-opacity-20'
  
  switch(status) {
    case 'Pending':
      return `${baseClasses} bg-orange-500 text-orange-600 border-orange-500`
    case 'Deposited':
      return `${baseClasses} bg-blue-500 text-blue-600 border-blue-500`
    case 'Cleared':
      return `${baseClasses} bg-green-500 text-green-600 border-green-500`
    case 'Returned':
      return `${baseClasses} bg-red-500 text-red-600 border-red-500`
    default:
      return `${baseClasses} bg-gray-500 text-gray-600 border-gray-500`
  }
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
