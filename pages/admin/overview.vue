<template>
  <div class="min-h-screen w-full bg-[#f3f4f6] relative flex flex-col font-sans">
    
    <!-- HEADER -->
    <DashboardHeader />

    <!-- CONTENT --> 
    <main class="flex-1 px-8 pb-[80px] space-y-6 overflow-y-auto pt-6">
      
      <!-- Alert Banner -->
      <div class="bg-[#FEFCE8] border border-[#FFF085] rounded-[16px] p-4 flex items-center justify-between shadow-sm relative pr-12">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#FFBB0D] rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[16px] font-semibold text-[#854D0E]">Upcoming Card Expiries</h4>
            <p class="text-[14px] font-normal text-[#854D0E]">3 customer cards are due to expire soon. Accounts has been alerted for action.</p>
          </div>
        </div>
        <button class="text-[#854D0E] hover:text-black transition-colors cursor-pointer absolute right-4 top-1/2 -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-10 flex items-center justify-between mt-6">
        <div class="bg-white rounded-full p-1.5 inline-flex items-center shadow-sm border border-gray-100">
          <button 
            @click="activeTab = 'Overview'"
            class="px-[80px] py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer"
            :class="activeTab === 'Overview' ? 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm' : 'bg-transparent text-[#000]'"
          >
            Overview
          </button>
          <button 
            @click="activeTab = 'Operations'"
            class="px-[80px] py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer"
            :class="activeTab === 'Operations' ? 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm' : 'bg-transparent text-[#000]'"
          >
            Operations
          </button>
        </div>
      </div>

      <!-- Overview Content -->
      <div v-if="activeTab === 'Overview'" class="space-y-8">
        
        <!-- Overview Metrics Section -->
        <section>
          <h2 class="text-[20px] font-normal text-[#1a1a1a] mb-6">Overview Metrics</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in overviewMetrics" :key="idx" 
                 class="bg-white rounded-[24px] p-6 border border-[#04C18F80] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
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
          <h2 class="text-[20px] font-normal text-[#1a1a1a] mb-6">Payment Status Overview</h2>
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
        <h2 class="text-[22px] font-normal text-[#1a1a1a]">Customer Management</h2>

        <!-- Sub Tabs -->
        <div class="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
          <button v-for="tab in operationsSubTabs" :key="tab.name"
                  @click="activeOperationsSubTab = tab.name"
                  class="px-5 py-2 rounded-full text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap text-center"
                  :class="activeOperationsSubTab === tab.name ? 'bg-[#9BFFEC] text-[#00614E]' : 'bg-transparent text-[#4B5563] hover:text-[#000]'">
            {{ tab.name }} <span v-if="tab.count !== undefined">({{ tab.count }})</span>
          </button>
        </div>

        <!-- Search & Filter Bar -->
        <div class="flex items-center gap-4 rounded-[16px] p-4 bg-[#E4FFF6B0] border border-[#00BE8CBD]">
          <!-- Search Input -->
          <div class="relative w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00000040]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by company name, customer code, or source..."
              class="w-full h-[44px] bg-white border border-[#00BE8CBD] rounded-[8px] pl-12 pr-4 text-[14px] text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none transition-all"
            />
          </div>

          <!-- Status Filter -->
          <div class="relative w-[300px] flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00000040] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <div @click="isStatusDropdownOpen = !isStatusDropdownOpen"
                 class="w-full h-[44px] bg-white border border-[#00BE8CBD] rounded-[8px] pl-10 pr-4 text-[14px] text-[#1a1a1a] flex items-center justify-between cursor-pointer transition-all">
              <span>{{ selectedStatus }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#00000040] transition-transform duration-200" :class="{ 'rotate-180': isStatusDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Export Button -->
          <button class="h-[44px] w-[200px] flex-shrink-0 flex items-center justify-center gap-2 px-5 rounded-[8px] text-[14px] font-medium border bg-[#9BFFEC] border-[#00BE8CBD] text-[#00614E] transition-all cursor-pointer hover:bg-[#82FFE0]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to Excel
          </button>
        </div>

        <!-- Table -->
        <section class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden mt-6">
          <div class="px-8 py-5 flex items-center justify-between border-b border-gray-50">
            <h2 class="text-[18px] font-medium text-[#1a1a1a]">Customer Details & Management</h2>
            <span class="text-[12px] text-gray-400">Values in AED Million</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[1000px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-4 text-[14px] font-medium">Customer Code</th>
                  <th class="px-8 py-4 text-[14px] font-medium">Source</th>
                  <th class="px-8 py-4 text-[14px] font-medium">Company Name</th>
                  <th class="px-8 py-4 text-[14px] font-medium text-center">Revenue</th>
                  <th class="px-8 py-4 text-[14px] font-medium text-center">Collected</th>
                  <th class="px-8 py-4 text-[14px] font-medium text-center">Payment Date</th>
                  <th class="px-8 py-4 text-[14px] font-medium text-center">Payment Status</th>
                  <th class="px-8 py-4 text-[14px] font-medium">Pending Reason</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in operationsTableData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A] text-center">{{ row.revenue }}</td>
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A] text-center">{{ row.collected }}</td>
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A] text-center">{{ row.date }}</td>
                  <td class="px-8 py-5 text-center">
                    <span :class="row.status === 'Paid' ? 'bg-[#00835D] text-white' : 'bg-[#EF4444] text-white'"
                          class="px-4 py-1.5 rounded-full text-[12px] font-semibold inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="px-8 py-5 text-[14px] text-[#0A0A0A]">{{ row.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          <!-- Bar Chart -->
          <div class="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm flex flex-col min-h-[400px]">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-[20px] font-medium text-[#1a1a1a]">Revenue Report by Source</h3>
              <div class="relative w-[140px]">
                <div class="w-full h-[40px] px-3 border border-[#00BE8CBD] rounded-[8px] flex items-center justify-between text-[14px] text-[#1a1a1a] cursor-pointer">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    6 Months
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            
            <div class="flex-grow flex flex-col justify-end w-full">
               <client-only>
                   <apexchart type="bar" height="280" :options="barOptions" :series="barSeries"></apexchart>
               </client-only>
            </div>
            
            <div class="flex items-center justify-center gap-6 mt-4">
              <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#FFBC0D]"></div><span class="text-[14px] text-[#FFBC0D]">Revenue</span></div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#FF7B4F]"></div><span class="text-[14px] text-[#FF7B4F]">Cost</span></div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#04C18F]"></div><span class="text-[14px] text-[#04C18F]">Profit</span></div>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="bg-[#F0fbf8] rounded-[12px] p-4 text-center border border-[#CCFBEF]">
                <p class="text-[14px] text-gray-500 mb-1">Partner</p>
                <h4 class="text-[18px] font-semibold text-[#1a1a1a]">5 <span class="text-[14px] font-normal">clients</span></h4>
              </div>
              <div class="bg-[#F0fbf8] rounded-[12px] p-4 text-center border border-[#CCFBEF]">
                <p class="text-[14px] text-gray-500 mb-1">Direct Customers</p>
                <h4 class="text-[18px] font-semibold text-[#1a1a1a]">4 <span class="text-[14px] font-normal">clients</span></h4>
              </div>
            </div>
          </div>

          <!-- Line Chart -->
          <div class="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm flex flex-col min-h-[400px]">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-[20px] font-medium text-[#1a1a1a]">Licensing Report (Cost Breakdown)</h3>
              <div class="relative w-[140px]">
                <div class="w-full h-[40px] px-3 border border-[#00BE8CBD] rounded-[8px] flex items-center justify-between text-[14px] text-[#1a1a1a] cursor-pointer">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    6 Months
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            
            <div class="flex-grow flex flex-col justify-end w-full">
               <client-only>
                   <apexchart type="line" height="280" :options="lineOptions" :series="lineSeries"></apexchart>
               </client-only>
            </div>
            
            <div class="flex items-center justify-center gap-6 mt-4">
              <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#FFBC0D]"></div><span class="text-[14px] text-[#FFBC0D]">AI Tokens</span></div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#A855F7] text-purple-600"></div><span class="text-[14px] text-[#A855F7]">Hosting Cost</span></div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#F43F5E] text-rose-500"></div><span class="text-[14px] text-[#F43F5E]">Total Cost</span></div>
            </div>

            <div class="bg-[#F9FAFB] border border-gray-100 rounded-[12px] p-4 mt-8 flex items-start gap-2">
               <span class="text-[13px] font-medium text-[#4B5563]">Note:</span>
               <span class="text-[13px] text-gray-500 leading-normal">Cost includes hosting infrastructure (60%) and AI token consumption (40%).</span>
            </div>
          </div>

        </div>

      </div>

    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    icon: '/images/icons/doller.svg', 
    iconColor: 'p-0',
    isCurrency: true 
  },
  { 
    title: 'Amount Collected', 
    value: '714,500', 
    subtext: 'Collection rate: 88.4%', 
    icon: '/images/icons/Amount-Collected.svg', 
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
    icon: '/images/icons/Settlements.svg', 
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
const isStatusDropdownOpen = ref(false)
const selectedStatus = ref('All Statuses')

const operationsTableData = [
  { code: 'CUST-001', source: 'PT-001', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Paid', reason: '-' },
  { code: 'CUST-002', source: 'PT-002', company: 'Global Finance LLC', revenue: '89,000', collected: '89,000', date: '11/5/2024', status: 'Failed', reason: 'Invoice not received' },
  { code: 'CUST-003', source: 'DC-003', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Failed', reason: 'Card limit exceeded' },
]

const barSeries = ref([
 { name: 'Revenue', data: [5.2, 3] },
 { name: 'Cost', data: [2.2, 1.7] },
 { name: 'Profit', data: [4, 1.9] }
])

const barOptions = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  colors: ['#FFBC0D', '#FF7B4F', '#04C18F'],
  plotOptions: {
    bar: { horizontal: false, columnWidth: '60%', borderRadius: 8, dataLabels: { position: 'top' } }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { categories: ['Partner', 'Direct Customers'], axisBorder: { show: true }, axisTicks: { show: false } },
  yaxis: { 
    title: { text: 'Values in AED Million', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
    labels: { formatter: (val) => val + 'M' },
    tickAmount: 4,
    min: 0,
    max: 6
  },
  fill: { opacity: 1 },
  grid: { strokeDashArray: 4, xaxis: { lines: { show: true } } },
  legend: { show: false }
})

const lineSeries = ref([
  { name: 'Total Cost', data: [5, 4.5, 6, 4.2, 8, 4.5] },
  { name: 'Hosting Cost', data: [2.5, 1.8, 3.7, 1.5, 4.5, 1.8] },
  { name: 'AI Tokens', data: [1.8, 1, 2.2, 1, 2.5, 1] }
])

const lineOptions = ref({
  chart: { type: 'line', toolbar: { show: false }, dropShadow: { enabled: false } },
  colors: ['#F43F5E', '#A855F7', '#FFBC0D'],
  stroke: { width: 2, curve: 'smooth' },
  markers: { size: 4, colors: ['#fff'], strokeColors: ['#F43F5E', '#A855F7', '#FFBC0D'], strokeWidth: 2, hover: { size: 6 } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], axisBorder: { show: true }, axisTicks: { show: false } },
  yaxis: { 
    title: { text: 'Values in AED Million', style: { color: '#9CA3AF', fontWeight: 'normal', fontSize: '10px' } },
    labels: { formatter: (val) => val + 'M' },
    tickAmount: 5,
    min: 0,
    max: 10
  },
  grid: { strokeDashArray: 4, padding: { left: 20 } },
  legend: { show: false }
})

</script>

<style scoped>
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
</style>
