<template>
  <div class="min-h-screen w-full bg-[#f3f4f6] relative flex flex-col font-sans">
    
    <!-- HEADER --> 
    <DashboardHeader />

    <!-- CONTENT -->
    <main class="flex-1 px-8 pb-[80px] space-y-6 overflow-y-auto">
      
      <!-- Alert Banner -->
      <div class="bg-[#FEFCE8] border border-[#FFF085] rounded-[16px] p-4 flex items-center justify-between shadow-sm relative pr-12">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#FFBB0D] rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[16px] font-semibold text-[#854D0E]">Expiring cards detected</h4>
            <p class="text-[14px] font-normal text-[#854D0E]">You have {CUST-005,CUST-007} customers with credit cards expiring within the next 30 days. Kindly reach out to them and ensure their payment details are updated.</p>
          </div>
        </div>
        <button class="text-[#854D0E] hover:text-black transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(stat, idx) in mainStats" :key="idx" 
             class="bg-white rounded-[24px] p-6 border border-[#04C18F80] transition-all hover:shadow-lg group">
          <div class="flex justify-between items-start mb-3">
            <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
            <div class="w-10 h-10 flex items-center justify-center text-[#04C18F]">
              <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
              <component v-else :is="stat.icon" class="w-8 h-8" />
            </div>
          </div>
          <div class="flex items-baseline gap-2 mb-2">
            <img v-if="stat.isCurrency" src="/images/icons/dirham-black.svg" alt="AED" class="w-6 h-6 self-center" />
            <span class="text-[30px] font-normal text-[#1a1a1a] leading-[45px]">{{ stat.value }}</span>
          </div>
          <p v-if="stat.subtext" class="text-[14px] text-[#999]">{{ stat.subtext }}</p>
        </div>
      </div>

      <!-- Partner Summary -->
      <div class="bg-white rounded-[24px] p-6 border border-[#0000001A] shadow-sm">
        <div class="flex items-center justify-between mb-6 px-4">
          <h3 class="text-[20px] font-normal text-[#0A0A0A]">Partner Summary (2 partners)</h3>
          <button class="flex items-center gap-2 bg-[#A1FFE64D] border border-[#04C18F80] px-6 py-2 rounded-[8px] text-[#0A0A0A] font-medium text-[14px] hover:bg-[#A1FFE666] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to Excel
          </button>
        </div>

        <!-- Conditional Partner Grid/Carousel -->
        <div class="px-4 pb-4">
          <div :class="partnerCards.length > 4 ? 'flex overflow-x-auto gap-4 snap-x hide-scrollbar scroll-smooth' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'">
            <div v-for="partner in partnerCards" :key="partner.name" 
                 class="bg-[#E4FFF6B0] border border-[#04C18F80] rounded-[10px] p-6 relative transition-all hover:bg-[#E4FFF6]"
                 :class="partnerCards.length > 4 ? 'min-w-[calc(25%-12px)] p-6 snap-start' : 'w-full'">
              <h4 class="text-[16px] font-medium text-[#1a1a1a] mb-6">{{ partner.name }}</h4>
              <div class="space-y-3">
                <div v-for="(val, label) in partner.metrics" :key="label">
                  <div v-if="label === 'Collection Rate:'" class="border-t border-[#04C18F40] mt-3 pt-3 mb-1"></div>
                  <div class="flex justify-between items-center">
                    <span class="text-[14px] text-[#000000B2]">{{ label }}</span>
                    <span class="text-[14px] font-medium flex items-center gap-1" :class="label === 'Collection Rate:' ? 'text-[#155DFC]' : (label === 'Collected:' ? 'text-[#00A63E]' : 'text-[#1a1a1a]')">
                      <img v-if="label === 'Revenue:'" src="/images/icons/dirham-black.svg" alt="AED" class="w-3.5 h-3.5" />
                      <img v-if="label === 'Collected:'" src="/images/icons/dirham-green.svg" alt="AED" class="w-3.5 h-3.5" />
                      {{ val }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Details & Management -->
      <!-- Payment Details & Management -->
      <div class="bg-white rounded-[24px] p-8 border border-[#0000001A] shadow-sm">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h3 class="text-[20px] font-normal text-[#0A0A0A] w-full md:w-auto">Payment Details & Management</h3>
          <span class="text-[12px] text-gray-400">Values in AED Million</span>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div class="flex flex-wrap items-center gap-3 w-full">
            <div class="relative flex-1 md:w-[450px]">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#00000080]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input type="text" placeholder="Search by company name, customer code, or source..." 
                     class="w-full h-[44px] bg-white border border-[#04C18F80] rounded-[6px] pl-12 pr-4 outline-none focus:border-[#007C65] transition-all text-[14px] text-[#000] placeholder:text-gray-400">
            </div>
            
            <div class="relative w-full md:w-[280px]">
              <button @click="isStatusDropdownOpen = !isStatusDropdownOpen" 
                      class="flex items-center w-full h-[44px] bg-white border border-[#04C18F80] rounded-[6px] px-4 outline-none transition-all cursor-pointer">
                <span class="text-[#00000080] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </span>
                <span class="text-[#000] text-[14px] flex-1 text-left">{{ selectedStatus }}</span>
                <span class="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-180': isStatusDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="isStatusDropdownOpen" 
                   class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[12px] shadow-xl z-50 p-2 space-y-1">
                <div v-for="status in ['All Statuses', 'Paid', 'Failed']" :key="status"
                     @click="selectedStatus = status; isStatusDropdownOpen = false"
                     class="px-4 py-2.5 rounded-[8px] text-[14px] cursor-pointer transition-colors"
                     :class="selectedStatus === status ? 'bg-[#E4FFF6B0] text-[#000]' : 'text-gray-600 hover:bg-gray-50'">
                  {{ status }}
                </div>
              </div>
            </div>

            <button class="h-[44px] flex items-center gap-2 bg-[#A1FFE64D] border border-[#04C18F80] px-6 py-2 rounded-[6px] text-[#0A0A0A] font-medium text-[14px] hover:bg-[#A1FFE666] transition-colors cursor-pointer ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to Excel
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-[10px] border border-gray-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="px-6 py-4 font-normal text-[14px]">Customer Code</th>
                <th class="px-6 py-4 font-normal text-[14px] relative">
                  <div @click="isPartnerMenuOpen = !isPartnerMenuOpen" class="flex items-center gap-1 cursor-pointer select-none">
                    Partner Name
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform duration-200" :class="{ 'rotate-180': isPartnerMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <!-- Partner Multi-Select Dropdown -->
                  <div v-if="isPartnerMenuOpen" 
                       class="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-[16px] shadow-2xl z-50 p-3 min-w-[240px]">
                    <div class="space-y-2">
                      <div v-for="partnerName in ['Acme Partners', 'Beta Consulting']" :key="partnerName"
                           @click="togglePartnerFilter(partnerName)"
                           class="flex items-center gap-3 p-2 rounded-[12px] hover:bg-gray-50 cursor-pointer transition-colors group">
                        <!-- Checkbox UI -->
                        <div class="w-6 h-6 rounded-[6px] flex items-center justify-center transition-all flex-shrink-0"
                             :class="selectedPartners.includes(partnerName) ? 'bg-[#00896F]' : 'border-2 border-gray-300 group-hover:border-[#00896F80]'">
                          <svg v-if="selectedPartners.includes(partnerName)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <span class="text-[14px] font-normal" :class="selectedPartners.includes(partnerName) ? 'text-[#000]' : 'text-gray-700'">
                          {{ partnerName }}
                        </span>
                      </div>
                    </div>
                  </div>
                </th>
                <th class="px-6 py-4 font-normal text-[14px]">Company Name</th>
                <th class="px-6 py-4 font-normal text-[14px]">Contract Period</th>
                <th class="px-6 py-4 font-normal text-[14px]">Year</th>
                <th class="px-6 py-4 font-normal text-[14px] flex items-center gap-1">
                  Revenue
                  <img src="/images/icons/dirham-black.svg" alt="AED" class="w-3 h-3 invert contrast-[200%] grayscale" />
                </th>
                <th class="px-6 py-4 font-normal text-[14px]">
                  <div class="flex items-center gap-1">
                    Collected
                    <img src="/images/icons/dirham-black.svg" alt="AED" class="w-3 h-3 invert contrast-[200%] grayscale" />
                  </div>
                </th>
                <th class="px-6 py-4 font-normal text-[14px]">
                  <div class="flex items-center gap-1">
                    Settlement
                    <img src="/images/icons/dirham-black.svg" alt="AED" class="w-3 h-3 invert contrast-[200%] grayscale" />
                  </div>
                </th>
                <th class="px-6 py-4 font-normal text-[14px]">Payment Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="row in paymentTable" :key="row.code" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-[13px] text-gray-700">{{ row.code }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700">{{ row.partner }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700">{{ row.company }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.period }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.year }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.revenue }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.collected }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.settlement }}</td>
                <td class="px-6 py-4">
                  <span :class="row.status === 'Paid' ? 'bg-[#00896F] text-white' : 'bg-[#EF4444] text-white'" 
                        class="px-4 py-1 rounded-full text-[12px] font-medium block w-fit mx-auto">
                    {{ row.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <DashboardFooter />

  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const currentLang = useState('currentLang', () => 'en')
const { isDark, toggleTheme } = useTheme()

const isStatusDropdownOpen = ref(false)
const selectedStatus = ref('All Statuses')
const isPartnerMenuOpen = ref(false)
const selectedPartners = ref(['Acme Partners', 'Beta Consulting'])

const togglePartnerFilter = (partnerName) => {
  const index = selectedPartners.value.indexOf(partnerName)
  if (index > -1) {
    selectedPartners.value.splice(index, 1)
  } else {
    selectedPartners.value.push(partnerName)
  }
}

const mainStats = [
  { title: 'Total Customers', value: '5', subtext: 'Partner-sourced clients', icon: '/images/icons/Total-Customers.svg', isCurrency: false },
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
  },
  { title: 'Settlements', value: '714,500', subtext: 'Total disbursed', icon: '/images/icons/Amount-Collected.svg', isCurrency: true }
]

const partnerCards = [
  {
    name: 'Acme Partners',
    metrics: {
      'Customers:': '3',
      'Revenue:': '510,000',
      'Collected:': '416,500',
      'Collection Rate:': '81.7%'
    }
  },
  {
    name: 'Beta Consulting',
    metrics: {
      'Customers:': '2',
      'Revenue:': '298,000',
      'Collected:': '298,000',
      'Collection Rate:': '100.0%'
    }
  }
]

const paymentTable = [
  { code: 'CUST-002', partner: 'Acme Partners', company: 'TechCorp Solutions Inc.', period: '12 months', year: '1', revenue: '125,000', collected: '125,000', settlement: '15,000', status: 'Paid' },
  { code: 'CUST-004', partner: 'Beta Consulting', company: 'Innovate Systems Ltd.', period: '24 months', year: '2', revenue: '156,000', collected: '156,000', settlement: '26,000', status: 'Paid' },
  { code: 'CUST-001', partner: 'Acme Partners', company: 'Enterprise Holdings', period: '36 months', year: '3+', revenue: '198,000', collected: '198,000', settlement: '38,000', status: 'Paid' },
  { code: 'CUST-002', partner: 'Beta Consulting', company: 'Healthcare Plus', period: '24 months', year: '2', revenue: '142,000', collected: '142,000', settlement: '12,000', status: 'Failed' }
]

// Hero Icons components placeholders
const UserGroupIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' }
const ChartBarIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>' }
const DirhamIcon = {
  template: `<img src="/images/icons/dirham-black.svg" class="w-full h-full" alt="AED" />`
}

</script>

<style scoped>
/* Custom scrollbar for main area */
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
