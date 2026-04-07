<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Admin User" userId="ADMIN-001" showChangeProfile changeProfileLink="/revenue-partnership/admin" />

    <!-- CONTENT --> 
    <main class="flex-1 px-8 pb-[0px] pt-8 space-y-6 overflow-y-auto" style="margin-top: -18px;">
      
      <!-- Alert Banner -->
      <div v-if="showAlertBanner" :class="isDark ? 'bg-[#00141080] border-[#F9AF4D80]' : 'bg-[#FEFCE8] border-[#FFF085]'" class="rounded-[16px] p-4 flex items-center justify-between shadow-sm relative pr-12 border">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#FFBB0D] rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="text-white w-6 h-6 transition-colors" :class="{ 'hover:text-white': isDark }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#854D0E]'">Upcoming Card Expiries</h4>
            <p class="text-[14px] font-normal" :class="isDark ? 'text-white/70' : 'text-[#854D0E]'">3 customer cards are due to expire soon. Accounts has been alerted for action.</p>
          </div>
        </div>
        <button @click="showAlertBanner = false" class="transition-colors cursor-pointer absolute right-4 top-1/2 -translate-y-1/2" :class="isDark ? 'text-white/50 hover:text-white' : 'text-[#854D0E] hover:text-black'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-10 flex items-center justify-between mt-6">
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-full p-1.5 inline-flex items-center shadow-sm border">
          <button 
            @click="activeTab = 'Overview'"
            class="px-[80px] py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer"
            :class="activeTab === 'Overview' ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm') : (isDark ? 'bg-transparent text-[#fff]' : 'bg-transparent text-[#000]')"
          >
            Overview
          </button>
          <button 
            @click="activeTab = 'Operations'"
            class="px-[80px] py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer"
            :class="activeTab === 'Operations' ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm') : (isDark ? 'bg-transparent text-[#fff]' : 'bg-transparent text-[#000]')"
          >
            Operations
          </button>
        </div>
      </div>

      <!-- Overview Content -->
      <div v-if="activeTab === 'Overview'" class="space-y-8">
        
        <!-- Overview Metrics Section -->
        <section>
          <h2 class="text-[20px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Overview Metrics</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in overviewMetrics" :key="idx" 
                 :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F80]'" 
                 class="rounded-[24px] p-6 border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-6">
                <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
                <div class="w-10 h-10 flex items-center justify-center p-0">
                  <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
                  <component v-else :is="stat.icon" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex items-baseline gap-2 mb-2">
                <img v-if="stat.isCurrency" src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
                <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">{{ stat.value }}</span>
              </div>
              <p class="text-[14px] text-[#999] font-normal">{{ stat.subtext }}</p>
            </div>
          </div>
        </section>

        <!-- Payment Status Overview Section -->
        <section>
          <h2 class="text-[20px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Payment Status Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in paymentStatusMetrics" :key="idx" 
                 :class="[stat.bgClass, stat.borderColor]"
                 class="rounded-[15px] p-6 border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-6">
                <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
                <div class="w-10 h-10 flex items-center justify-center p-0">
                  <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8 pointer-events-none" alt="icon" />
                  <component v-else :is="stat.icon" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex items-baseline gap-2 mb-2">
                <img src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
                <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">{{ stat.value }}</span>
              </div>
              <p class="text-[16px] font-normal flex items-center gap-2">
                <span class="text-[24px] font-normal" :style="{ color: stat.textColor || '#045E40' }">{{ stat.count }}</span>
                <span class="text-[14px] font-normal" :style="{ color: stat.textColor || '#045E40' }">{{ stat.subtext }}</span>
              </p>
            </div>
          </div>
        </section>

      </div>

      <!-- Operations Content -->
      <div v-if="activeTab === 'Operations'" class="space-y-8">
        
        <!-- Header -->
        <h2 class="text-[22px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Customer Management</h2>

        <!-- Sub Tabs -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="flex items-center justify-between overflow-x-auto no-scrollbar rounded-[35px] p-[10px] border shadow-sm">
          <template v-for="(tab, index) in operationsSubTabs" :key="tab.name">
            <button
              @click="activeOperationsSubTab = tab.name"
              class="px-5 py-2 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap"
              :class="activeOperationsSubTab === tab.name
                ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] font-normal')
                : (isDark ? 'bg-transparent text-white/70' : 'bg-transparent text-[#0A0A0A] font-normal')"
            >
              {{ tab.name }}<span v-if="tab.count !== undefined"> ({{ tab.count }})</span>
            </button>
          </template>
        </div>

        <!-- Partners & Direct Customers Tab Metrics -->
        <div v-if="['Partners', 'Direct Customers'].includes(activeOperationsSubTab)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(stat, idx) in overviewMetrics" :key="idx" 
               :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F80]'" 
               class="rounded-[24px] p-6 border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-6">
              <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
              <div class="w-10 h-10 flex items-center justify-center p-0">
                <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
                <component v-else :is="stat.icon" class="w-8 h-8" />
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-2">
              <img v-if="stat.isCurrency" src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
              <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">{{ stat.value }}</span>
            </div>
            <p class="text-[14px] text-[#999] font-normal">{{ stat.subtext }}</p>
          </div>
        </div>

        <!-- Resource Consumption metrics -->
        <div v-if="activeOperationsSubTab === 'Resource Consumption'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-[#E7FBF3] rounded-[16px] p-6 border border-[#A6E8D0] shadow-sm relative">
            <div class="flex items-start justify-between mb-6">
              <h5 class="text-[16px] font-normal text-[#00000080]">Average Hosting Consumption</h5>
              <img src="/images/icons/Hosting.svg" class="w-6 h-6 object-contain" alt="Hosting" />
            </div>
            <div class="flex items-baseline gap-2 mb-2">
              <img src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
              <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">18,400</span>
            </div>
            <p class="text-[14px] text-[#999] font-normal">Per Customer</p>
          </div>
          
          <div class="bg-[#E7FBF3] rounded-[16px] p-6 border border-[#A6E8D0] shadow-sm relative">
            <div class="flex items-start justify-between mb-6">
              <h5 class="text-[16px] font-normal text-[#00000080]">Average AI Token Consumption</h5>
              <img src="/images/icons/ai.svg" class="w-6 h-6 object-contain" alt="AI Token" />
            </div>
            <div class="flex items-baseline gap-2 mb-2">
              <img src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
              <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">26,500</span>
            </div>
            <p class="text-[14px] text-[#999] font-normal">Per Customer</p>
          </div>
        </div>

        <!-- Partner Approvals Sub Bar -->
        <div v-if="activeOperationsSubTab === 'Partner Approvals'" class="flex items-center justify-between gap-4 bg-[#E7FBF3] border border-[#04C18F20] rounded-[16px] p-2 mt-6">
          <div class="flex items-center gap-2 w-[75%] p-1 bg-transparent rounded-[14px] border border-[#04C18F20]">
            <button 
              @click="activeApprovalSubTab = 'Partner Registration'"
              class="flex items-center justify-start gap-3 w-1/2 py-2.5 px-4 rounded-[12px] text-[15px] font-medium transition-all"
              :class="activeApprovalSubTab === 'Partner Registration' ? 'bg-[#00835D] text-white shadow-sm' : 'text-[#1a1a1a] bg-transparent'"
            >
              <img src="/images/icons/Partner.svg" class="w-5 h-5 flex-shrink-0" :class="activeApprovalSubTab === 'Partner Registration' ? 'brightness-0 invert' : ''" alt="" />
              <span>Partner Registration</span>
              <span class="w-6 h-6 flex items-center justify-center rounded-full text-[12px] text-center font-semibold"
                    :class="activeApprovalSubTab === 'Partner Registration' ? 'bg-white text-[#00835D]' : 'bg-[#00835D] text-white'">2</span>
            </button>
            <button 
              @click="activeApprovalSubTab = 'Payment Requests'"
              class="flex items-center justify-start gap-3 w-1/2 py-2.5 px-4 rounded-[12px] text-[15px] font-medium transition-all"
              :class="activeApprovalSubTab === 'Payment Requests' ? 'bg-[#00835D] text-white shadow-sm' : 'text-[#1a1a1a] bg-transparent'"
            >
              <img src="/images/icons/doller-black.svg" class="w-5 h-5 flex-shrink-0" :class="activeApprovalSubTab === 'Payment Requests' ? 'brightness-0 invert' : ''" alt="" />
              <span>Payment Requests</span>
              <span class="w-6 h-6 flex items-center justify-center rounded-full text-[12px] text-center font-semibold"
                    :class="activeApprovalSubTab === 'Payment Requests' ? 'bg-white text-[#00835D]' : 'bg-[#00835D] text-white'">3</span>
            </button>
          </div>
          
          <div class="flex items-center w-[25%]">
            <div class="relative w-full">
              <div @click="showStatusesDropdown = !showStatusesDropdown" class="flex items-center gap-3 px-5 py-2.5 bg-white rounded-[12px] border border-[#04C18F20] cursor-pointer shadow-sm hover:border-[#00835D] transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 group-hover:text-[#00835D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span class="text-[15px] font-medium text-[#1a1a1a] flex-grow text-center">{{ activeStatusFilter }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 group-hover:text-[#00835D] transform transition-transform" :class="{ 'rotate-180': showStatusesDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Dropdown Menu -->
              <div v-if="showStatusesDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-2 z-20 flex flex-col gap-1">
                <button 
                  v-for="status in ['All Statuses', 'Pending', 'Approved', 'Rejected']" 
                  :key="status"
                  @click="activeStatusFilter = status; showStatusesDropdown = false"
                  class="text-left px-4 py-2.5 rounded-[8px] text-[15px] transition-colors"
                  :class="activeStatusFilter === status ? 'bg-[#E7FBF3] text-[#1a1a1a] font-medium' : 'text-[#1a1a1a] hover:bg-gray-50'"
                >
                  {{ status }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AdminSearchFilter v-if="!['Resource Consumption', 'Partner Approvals', 'Uploaded Reports'].includes(activeOperationsSubTab)" />
        
        <AdminOperationsTable :activeTab="activeOperationsSubTab" :subTab="activeApprovalSubTab" />

        <!-- Charts Grid -->
        <div v-if="!['Resource Consumption', 'Partner Approvals', 'Uploaded Reports', 'User Master Info'].includes(activeOperationsSubTab)" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <AdminBarChart />
          <AdminLineChart />
        </div>

      </div>

    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { isDark } = useTheme()

definePageMeta({
  layout: false
})

const activeTab = ref('Overview')

const overviewMetrics = [
  { 
    title: 'Total Customers', 
    value: '5', 
    subtext: 'Partner-sourced clients', 
    icon: '/images/icons/Total-Customers.svg', 
    iconColor: 'p-0',
    isCurrency: false 
  },
  { 
    title: 'Total Revenue', 
    value: '808,000', 
    subtext: 'All partner revenue', 
    icon: '/images/icons/doller-green.svg', 
    iconColor: 'p-0',
    isCurrency: true  
  },
  { 
    title: 'Amount Collected', 
    value: '714,500', 
    subtext: 'Collection rate: 88.4%', 
    icon: '/images/icons/amt_collected.svg', 
    iconColor: 'p-0',
    isCurrency: true 
  }
]

const paymentStatusMetrics = [
  { 
    title: 'Paid', 
    value: '808,000', 
    count: '3',
    subtext: 'Completed payments', 
    icon: '/images/icons/green-tick.svg', 
    iconColor: 'p-0',
    bgClass: 'bg-[#F0FDF4]',
    borderColor: 'border-[#04C18F80]'
  },
  { 
    title: 'Failed', 
    value: '808,000', 
    count: '3',
    subtext: 'Failed Payments', 
    icon: '/images/icons/close.svg', 
    iconColor: 'p-0',
    bgClass: 'bg-[#FEF2F2]',
    borderColor: 'border-[#FFA6A6]',
    textColor: '#C10007'
  },
  { 
    title: 'Settlements', 
    value: '808,000', 
    count: '3',
    subtext: 'Total Partner Payments', 
    icon: '/images/icons/Settlements-blue.svg', 
    iconColor: 'p-0',
    bgClass: 'bg-[#DFF4FF]',
    borderColor: 'border-[#1FB2FF]',
    textColor: '#005B8A'
  }
]

const operationsSubTabs = [
  { name: 'All Customers', count: 21 },
  { name: 'Partners', count: 0 },
  { name: 'Direct Customers', count: 2 },
  { name: 'Resource Consumption' },
  { name: 'Partner Approvals' },
  { name: 'Uploaded Reports', count: 2 },
  { name: 'User Master Info', count: 2 }
]

const activeOperationsSubTab = ref('All Customers')
const activeApprovalSubTab = ref('Partner Registration')

const showStatusesDropdown = ref(false)
const activeStatusFilter = ref('All Statuses')
const showAlertBanner = ref(true)


</script>

<style scoped>
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }

/* Override ApexCharts default tooltip border so the custom div is the only edge */
:deep(.apexcharts-tooltip) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}
</style>
