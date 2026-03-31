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
            <p class="text-[14px] font-normal text-[#854D0E]">3 customers have cards expiring in under 30 days. Update details to prevent payment issues.</p>
          </div>
        </div>
        <button class="text-[#854D0E] hover:text-black transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs and Action Buttons -->
      <div class="mb-10 flex items-center justify-between">
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

        <!-- Operations Specific Action Buttons -->
        <div v-if="activeTab === 'Operations'" class="flex items-center gap-4">
          <button @click="showPaymentModal = true" class="px-6 py-3 bg-[#9BFFEC66] text-[#000] text-[16px] border border-[#04C18F80] rounded-xl font-normal flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <img src="/images/icons/dirham-black.svg" class="w-4" />
            Payment to Partner
          </button>
          <button @click="showAddPartnerModal = true" class="px-6 py-3 bg-[#007C65] text-white rounded-xl font-normal flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer text-[16px]">
            <span class="text-xl leading-none">+</span>
            Add New Partner
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
                <div class="w-10 h-10 flex items-center justify-center" :class="stat.iconColor">
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
                <div class="w-10 h-10 flex items-center justify-center" :class="stat.iconColor">
                  <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
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
      <div v-else class="space-y-12">
        
        <!-- Report Uploads -->
        <section>
          <h2 class="text-[22px] font-normal text-[#1a1a1a] mb-6">Report Uploads</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Month End Report -->
            <div class="bg-[#F0FDF4] rounded-[24px] p-[24px] border border-[#BEDBFF] shadow-sm group hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-8">
                <img src="/images/icons/Month-End-Report.svg" class="w-7 h-7" />
                <h4 class="text-[16px] font-normal text-[#00614E]">Month End Report</h4>
              </div>
              <div class="space-y-6">
                <div>
                  <label class="block text-[14px] mb-2 text-[#0A0A0A]">Upload CSV File</label>
                  <div @click="$refs.csvInput.click()" class="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-[#F9FAFB] cursor-pointer hover:border-[#04C18F80] transition-colors">
                    <span class="text-[#000] font-medium text-[15px]">Choose File</span>
                    <span class="text-gray-400 text-[14px]">{{ csvFileName || 'No file chosen' }}</span>
                  </div>
                  <input ref="csvInput" type="file" accept=".csv" class="hidden" @change="e => csvFileName = e.target.files[0]?.name || ''" />
                </div>
                <button class="w-full py-4 bg-[#00835D] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#006b4d] transition-all cursor-pointer shadow-sm">
                  <img src="/images/icons/upload.svg" class="w-5 h-5 brightness-0 invert" />
                  Upload Month End Report
                </button>
              </div>
            </div>

            <!-- Hosting Cost Report -->
            <div class="bg-[#F0FDF4] rounded-[24px] p-[24px] border border-[#BEDBFF] shadow-sm group hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-8">
                <img src="/images/icons/Hosting-Cost-Report.svg" class="w-7 h-7" />
                <h4 class="text-[16px] font-normal text-[#00614E]">Hosting Cost Report</h4>
              </div>
              <div class="space-y-6">
                <div>
                  <label class="block text-[14px] mb-2 text-[#0A0A0A]">Upload Excel File</label>
                  <div @click="$refs.excelInput.click()" class="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-[#F9FAFB] cursor-pointer hover:border-[#04C18F80] transition-colors">
                    <span class="text-[#000] font-medium text-[15px]">Choose File</span>
                    <span class="text-gray-400 text-[14px]">{{ excelFileName || 'No file chosen' }}</span>
                  </div>
                  <input ref="excelInput" type="file" accept=".xlsx,.xls" class="hidden" @change="e => excelFileName = e.target.files[0]?.name || ''" />
                </div>
                <button class="w-full py-4 bg-[#00835D] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#006b4d] transition-all cursor-pointer shadow-sm">
                  <img src="/images/icons/upload.svg" class="w-5 h-5 brightness-0 invert" />
                  Upload Hosting Cost Report
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Customer Management -->
        <section class="space-y-8">
          <h2 class="text-[22px] font-normal text-[#1a1a1a]">Customer Management</h2>
          
          <!-- Sub Tabs -->
          <div class="bg-white rounded-full p-1.5 flex items-center shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
            <button v-for="tab in customerSubTabs" :key="tab.name"
                    @click="activeCustomerSubTab = tab.name"
                    class="w-1/4 px-8 py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer whitespace-nowrap text-center"
                    :class="activeCustomerSubTab === tab.name ? 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm' : 'bg-transparent text-[#000]'">
              {{ tab.name }} ({{ tab.count }})
            </button>
          </div>

          <!-- Stats Grid -->
          <div v-if="!['Notify Customers', 'User Master Info'].includes(activeCustomerSubTab)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in overviewMetrics" :key="idx" 
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
        </section>

        <!-- Search & Filter Bar -->
        <div class="flex items-center gap-4 rounded-[16px] p-5 border" style="background-color: #61FFD62E; border-color: #00BE8CBD;">
          <!-- Search Input -->
          <div class="relative w-full max-w-[60%]">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00000040]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by company name, customer code, or source..."
              class="w-full h-[44px] bg-white border rounded-[8px] pl-12 pr-4 text-[14px] text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none transition-all"
              style="border-color: #00BE8CBD;"
            />
          </div>

          <!-- Status Filter -->
          <div class="relative w-full max-w-[30%]">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00000040] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <div @click="isStatusDropdownOpen = !isStatusDropdownOpen"
                 class="w-full h-[44px] bg-white border rounded-[8px] pl-10 pr-4 text-[14px] text-[#1a1a1a] flex items-center justify-between cursor-pointer transition-all"
                 style="border-color: #00BE8CBD;">
              <span>{{ selectedStatus }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#00000040] transition-transform duration-200" :class="{ 'rotate-180': isStatusDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <!-- Custom Dropdown Menu -->
            <transition name="fade-slide">
              <div v-if="isStatusDropdownOpen" class="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-xl z-50 p-2 space-y-1">
                <div v-for="status in ['All Statuses', 'Paid', 'Failed']" :key="status"
                     @click="selectedStatus = status; isStatusDropdownOpen = false"
                     class="px-4 py-2.5 rounded-[8px] text-[14px] cursor-pointer transition-colors"
                     :class="selectedStatus === status ? 'bg-[#E4FFF6B0] text-[#000]' : 'text-gray-600 hover:bg-gray-50'">
                  {{ status }}
                </div>
              </div>
            </transition>
          </div>

          <!-- Export Button -->
          <button class="h-[44px] w-[350px] flex items-center justify-center gap-2 px-5 rounded-[8px] text-[14px] font-medium border transition-all cursor-pointer hover:shadow-sm" style="background-color: #61FFD62E; border-color: #00BE8CBD; color: #007C65;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to Excel
          </button>
        </div>

        <!-- Customer/Payment Details & Management -->
        <section class="p-8 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          <div class="pb-4 flex items-center justify-between">
            <h2 class="text-[22px] font-normal text-[#1a1a1a]">
              {{ activeCustomerSubTab === 'User Master Info' ? 'Customer Details & Management' : 'Payment Details & Management' }}
            </h2>
            <span class="text-[12px] text-gray-400">Values in AED Million</span>
          </div>
          <!-- Table Wrapper -->
          <div class="overflow-x-auto">
            <!-- Partners Table -->
            <table v-if="activeCustomerSubTab === 'Partners'" class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium relative">
                    <div @click="isSourceMenuOpen = !isSourceMenuOpen" class="flex items-center gap-2 cursor-pointer select-none">
                      Source 
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 transition-transform duration-200" :class="{ 'rotate-180': isSourceMenuOpen }" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>

                    <!-- Source Multi-Select Dropdown -->
                    <div v-if="isSourceMenuOpen" 
                         class="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-[12px] shadow-2xl z-50 p-2 min-w-[160px] text-left font-normal text-[#1a1a1a]">
                      <div class="space-y-1">
                        <div v-for="source in ['PT-001', 'PT-002', 'PT-003']" :key="source"
                             @click.stop="toggleSourceFilter(source)"
                             class="flex items-center gap-3 p-2 rounded-[8px] hover:bg-gray-50 cursor-pointer transition-colors group">
                          <!-- Checkbox UI -->
                          <div class="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-all flex-shrink-0"
                               :class="selectedSources.includes(source) ? 'bg-[#00835D]' : 'border-2 border-gray-300 group-hover:border-[#00835D80]'">
                            <svg v-if="selectedSources.includes(source)" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                          </div>
                          <span class="text-[14px]" :class="selectedSources.includes(source) ? 'text-[#000]' : 'text-gray-700'">
                            {{ source }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Contract Period</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Year</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Revenue</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Collected</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Settlement</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center whitespace-nowrap">Payment Date</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in paymentDetails" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.period }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.year }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.revenue }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.collected }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.settlement }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.date }}</td>
                  <td class="px-8 py-6 text-center">
                    <span :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#FF4D4D] text-white shadow-[#FF4D4D33]'"
                          class="px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Direct Customers Table -->
            <table v-if="activeCustomerSubTab === 'Direct Customers'" class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Source</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Revenue</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Collected</th>
                  <th class="px-8 py-5 text-[15px] font-medium whitespace-nowrap">Payment Date</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Payment Status</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl">Pending Reason</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in directCustomersData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.revenue }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.collected }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.date }}</td>
                  <td class="px-8 py-6 text-center">
                    <span :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#FF4D4D] text-white shadow-[#FF4D4D33]'"
                          class="px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.reason }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Notify Customers Table -->
            <table v-if="activeCustomerSubTab === 'Notify Customers'" class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Source</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Contact No.</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Card Type</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Last 4 Digits</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Expiring Date</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Status</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in notifyCustomersData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.contact }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.cardType }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.last4 }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.expiry }}</td>
                  <td class="px-8 py-6 text-center">
                    <span class="bg-[#EF4444] text-white shadow-[#EF444433] px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <button v-if="row.action === 'Notify'" class="px-5 py-2 bg-[#00835D] text-white rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-2 mx-auto hover:bg-[#007452] transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Notify
                    </button>
                    <button v-else-if="row.action === 'Notified'" class="px-4 py-2 bg-transparent border border-[#00BE8CBD] text-[#00BE8CBD] rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-2 mx-auto cursor-default opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Notified
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- User Master Info Table -->
            <table v-if="activeCustomerSubTab === 'User Master Info'" class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Source</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Bank Details</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Credit Card</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Contact Person</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Contact No.</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl">Registered Email</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in userMasterData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.bank }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.card }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.contactPerson }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.contactNo }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>


    </main>

    <!-- FOOTER -->
    <DashboardFooter />

    <!-- PAYMENT MODAL -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[650px] overflow-hidden">
        <div class="p-10 relative">
          <!-- Close Button -->
          <button @click="showPaymentModal = false" class="absolute top-6 right-8 text-[#000] hover:text-gray-600 transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-8">
            <h3 class="text-[18px] font-medium text-[#1a1a1a]">Payment to Partner</h3>
            <p class="text-[#9ea4ad] text-[15px] mt-1 font-normal">Submit a payment request for partner approval</p>
          </div>

          <!-- Form Grid -->
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <!-- Select Partner -->
              <div class="space-y-1.5 relative">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Select Partner *</label>
                <div @click="showPartnerList = !showPartnerList" 
                     class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl flex items-center justify-between cursor-pointer focus:border-[#00DDA3] transition-all">
                  <span :class="selectedPartner === 'Choose a partner' ? 'text-[#b0b7c1]' : 'text-[#000]'" class="text-[15px]">{{ selectedPartner }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-40 transition-transform duration-300" 
                       :class="showPartnerList ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                <!-- Dropdown List -->
                <transition name="fade-slide">
                  <div v-if="showPartnerList" class="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl z-20 border border-gray-50 overflow-hidden py-1">
                    <div v-for="partner in partners" :key="partner"
                         @click="selectedPartner = partner; showPartnerList = false"
                         class="px-6 py-4 text-[15px] text-[#1a1a1a] cursor-pointer hover:bg-[#E0FFF7] transition-all font-normal">
                      {{ partner }}
                    </div>
                  </div>
                </transition>
              </div>
              <!-- Payment Date -->
              <div class="space-y-1.5 relative">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Payment Date *</label>
                <div @click="activeModalDropdown = activeModalDropdown === 'calendar' ? null : 'calendar'"
                     class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl flex items-center justify-between cursor-pointer focus:border-[#00DDA3] transition-all">
                  <span :class="!paymentDate ? 'text-[#b0b7c1]' : 'text-[#000]'" class="text-[15px]">
                    {{ paymentDate ? formatDate(paymentDate) : 'dd-mm-yyyy' }}
                  </span>
                  <img src="/images/icons/calendar.svg" class="w-5 h-5 opacity-40 pointer-events-none" />
                </div>
                
                <!-- Calendar Popover -->
                <transition name="fade-slide">
                  <div v-if="activeModalDropdown === 'calendar'" class="absolute top-[calc(100%+8px)] right-0 z-[60] bg-white border border-gray-100 rounded-2xl shadow-2xl p-2">
                    <VDatePicker 
                      v-model="paymentDate" 
                      @update:model-value="activeModalDropdown = null"
                      color="emerald"
                      borderless
                    />
                  </div>
                </transition>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="space-y-1.5">
              <label class="text-[15px] font-normal text-[#1a1a1a]">Payment Details *</label>
              <textarea placeholder="e.g., Commission for October 2024, Revenue share for Q4..." rows="4"
                        class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px] resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Payment Value -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Payment Value (AED) *</label>
                <input type="number" step="0.01" placeholder="0.00" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <!-- Voucher Number -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Voucher Number *</label>
                <input type="text" placeholder="e.g., VCH-2024-001" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-4">
              <button @click="showPaymentModal = false" class="px-8 py-3 bg-white border border-gray-200 text-[#1a1a1a] rounded-xl font-normal hover:bg-gray-50 transition-all cursor-pointer">
                Cancel
              </button>
              <button class="px-8 py-3 bg-[#00835D] text-white rounded-xl font-normal hover:bg-[#007452] transition-all cursor-pointer">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD NEW PARTNER MODAL -->
    <div v-if="showAddPartnerModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[650px] overflow-hidden">
        <div class="p-10 relative">
          <!-- Close Button -->
          <button @click="showAddPartnerModal = false" class="absolute top-6 right-8 text-[#000] hover:text-gray-600 transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-8">
            <h3 class="text-[18px] font-medium text-[#1a1a1a]">Add New Partner Request</h3>
            <p class="text-[#9ea4ad] text-[15px] mt-1 font-normal">Submit a new partner request for admin approval</p>
          </div>

          <!-- Form Grid -->
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <!-- Email -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Email *</label>
                <input type="email" placeholder="partner@company.com" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
              <!-- Contact Person -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Contact Person *</label>
                <input type="text" placeholder="John Doe" class="w-full px-4 py-3 bg-white border border-[#82FFE0) rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Contact Phone -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Contact Phone</label>
                <input type="text" placeholder="+1-555-0000" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
              <!-- Trading License -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Trading License *</label>
                <input type="text" placeholder="TL-2024-XXX" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-1.5">
              <label class="text-[15px] font-normal text-[#1a1a1a]">Address</label>
              <textarea placeholder="Full business address" rows="3"
                        class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px] resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Authorized Person -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Authorized Person</label>
                <input type="text" placeholder="Jane Smith" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
              <!-- Authorized Person Contact -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Authorized Person Contact</label>
                <input type="text" placeholder="+1-555-0001" class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-4">
              <button @click="showAddPartnerModal = false" class="px-8 py-3 bg-white border border-gray-200 text-[#1a1a1a] rounded-xl font-normal hover:bg-gray-50 transition-all cursor-pointer">
                Cancel
              </button>
              <button class="px-8 py-3 bg-[#00835D] text-white rounded-xl font-normal hover:bg-[#007452] transition-all cursor-pointer">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { format } from 'date-fns'

definePageMeta({
  layout: false
})

const activeTab = ref('Overview')
const csvFileName = ref('')
const excelFileName = ref('')
const isStatusDropdownOpen = ref(false)
const selectedStatus = ref('All Statuses')

// Icons as inline components for simplicity
const UserGroupIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`
}
const CurrencyIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}
const TrendingUpIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" /></svg>`
}
const DirhamIcon = {
  template: `<img src="/images/icons/dirham-black.svg" class="w-full h-full" alt="AED" />`
}
const CheckCircleIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}
const XCircleIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}

const activeCustomerSubTab = ref('Partners')
const showPaymentModal = ref(false)
const showAddPartnerModal = ref(false)
const showPartnerList = ref(false)
const selectedPartner = ref('Choose a partner')
const partners = ['TechCorp Solutions Inc.', 'Innovate System Ltd.', 'Enterprise Holdings']

const paymentDate = ref(null)
const activeModalDropdown = ref(null)

const formatDate = (date) => {
  if (!date) return ''
  return format(date, 'dd-MM-yyyy')
}

const customerSubTabs = [
  { name: 'Partners', count: 3 },
  { name: 'Direct Customers', count: 2 },
  { name: 'Notify Customers', count: 2 },
  { name: 'User Master Info', count: 2 }
]


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

const paymentDetails = [
  { code: 'CUST-001', source: 'PT-001', company: 'TechCorp Solutions Inc.', period: '125,000', year: '1', revenue: '125,000', collected: '125,000', settlement: '125,000', date: '11/5/2024', status: 'Paid' },
  { code: 'CUST-002', source: 'PT-002', company: 'Global Finance LLC', period: '89,000', year: '2', revenue: '89,000', collected: '89,000', settlement: '89,000', date: '11/5/2024', status: 'Failed' },
  { code: 'CUST-001', source: 'PT-003', company: 'TechCorp Solutions Inc.', period: '125,000', year: '3+', revenue: '125,000', collected: '125,000', settlement: '125,000', date: '11/5/2024', status: 'Failed' },
]

const directCustomersData = [
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Paid', reason: '-' },
  { code: 'CUST-002', source: 'DC-002', company: 'Global Finance LLC', revenue: '89,000', collected: '89,000', date: '11/5/2024', status: 'Failed', reason: 'Invoice not received' },
  { code: 'CUST-001', source: 'DC-003', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Failed', reason: 'Card limit exceeded' },
]

const notifyCustomersData = [
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', contact: '+123456789', cardType: 'Visa', last4: '4432', expiry: '12/2024', status: 'Expiring', action: 'Notify' },
  { code: 'CUST-002', source: 'DC-002', company: 'Global Finance LLC', contact: '+123456789', cardType: 'Mastercard', last4: '9921', expiry: '11/2024', status: 'Expiring', action: 'Notified' }
]

const userMasterData = [
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', bank: 'Chase Bank *****1234', card: '**** 4532', contactPerson: 'John Smith', contactNo: '+1-555-0101', email: 'john.smith@techcorp.com' },
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', bank: 'Chase Bank *****1234', card: '**** 4532', contactPerson: 'John Smith', contactNo: '+1-555-0101', email: 'john.smith@techcorp.com' },
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', bank: 'Chase Bank *****1234', card: '**** 4532', contactPerson: 'John Smith', contactNo: '+1-555-0101', email: 'john.smith@techcorp.com' }
]

const isSourceMenuOpen = ref(false)
const selectedSources = ref(['PT-002'])

const toggleSourceFilter = (source) => {
  const index = selectedSources.value.indexOf(source)
  if (index > -1) {
    selectedSources.value.splice(index, 1)
  } else {
    selectedSources.value.push(source)
  }
}


</script>

<style scoped>
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
