<template>
  <section :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[24px] shadow-sm overflow-hidden mt-6 border transition-all duration-300">
    <div class="px-8 py-5 flex items-start justify-between">
      <div v-if="activeTab === 'Resource Consumption'">
        <h2 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Top 10 Highest Consumption Customers</h2>
        <p class="text-[14px] mt-0.5 font-normal" :class="isDark ? 'text-white/60' : 'text-[#868A91]'">Customers with consumption 50% above average - requires cost optimization review</p>
      </div>
      <div v-else-if="activeTab === 'Partner Approvals'">
        <h2 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ subTab === 'Partner Registration' ? 'Partner Registration Approvals' : 'Partner Payment Requests' }}</h2>
        <p class="text-[14px] mt-0.5 font-normal" :class="isDark ? 'text-white/60' : 'text-[#868A91]'">Review and approve partner {{ subTab === 'Partner Registration' ? 'registration' : 'payment' }} requests from accounts team</p>
      </div>
      <div v-else-if="activeTab === 'Uploaded Reports'">
        <h2 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Uploaded Reports</h2>
        <p class="text-[14px] mt-0.5 font-normal" :class="isDark ? 'text-white/60' : 'text-[#868A91]'">View and manage uploaded reports from various sources</p>
      </div>
      <div v-else>
        <h2 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Customer Details & Management</h2>
      </div>
      <span class="text-[12px] font-medium mt-1" :class="isDark ? 'text-white/40' : 'text-gray-500'">Values in AED Million</span>
    </div>
    <div class="overflow-x-auto px-6 pb-6">
      <div class="rounded-[12px] overflow-hidden border" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <table class="w-full text-left min-w-[1000px]" style="border-collapse: separate; border-spacing: 0;">
        <!-- ALL CUSTOMERS TAB HEADERS -->
        <thead v-if="!['Partners', 'Direct Customers', 'Resource Consumption', 'Partner Approvals', 'Uploaded Reports', 'User Master Info'].includes(activeTab)" class="bg-[#00835D] text-white">
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
        
        <!-- DIRECT CUSTOMERS TAB HEADERS -->
        <thead v-else-if="activeTab === 'Direct Customers'" class="bg-[#00835D] text-white">
          <tr>
            <th class="px-8 py-4 text-[14px] font-medium">Customer Code</th>
            <th class="px-8 py-4 text-[14px] font-medium">Source</th>
            <th class="px-8 py-4 text-[14px] font-medium">Company Name</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Revenue</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Collected</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Payment Date</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Payment Status</th>
            <th class="px-8 py-4 text-[14px] font-medium">Pending Reason</th>
            <th class="px-8 py-4 text-[14px] font-medium text-right">Action</th>
          </tr>
        </thead>

        <!-- PARTNERS TAB HEADERS -->
        <thead v-else-if="activeTab === 'Partners'" class="bg-[#00835D] text-white">
          <tr>
            <th class="px-8 py-4 text-[14px] font-medium">Customer Code</th>
            <th class="px-8 py-4 text-[14px] font-medium">
              <div class="relative">
                <div class="flex items-center gap-1 cursor-pointer select-none" @click="isSourceMenuOpen = !isSourceMenuOpen">
                  Source
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isSourceMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div v-if="isSourceMenuOpen" class="absolute top-full left-0 mt-1 bg-white rounded-[10px] shadow-lg border border-gray-100 z-20 min-w-[160px] py-1">
                  <div v-for="source in partnerSourceOptions" :key="source"
                       class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 group"
                       @click.stop="toggleSourceFilter(source)">
                    <div class="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                         :class="selectedSources.includes(source) ? 'bg-[#00835D]' : 'border-2 border-gray-300 group-hover:border-[#00835D80]'">
                      <svg v-if="selectedSources.includes(source)" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-[13px] text-gray-700">{{ source }}</span>
                  </div>
                  <div v-if="selectedSources.length" class="border-t border-gray-100 mt-1 pt-1 px-3 pb-1">
                    <button class="text-[12px] text-[#00835D] hover:underline" @click.stop="selectedSources = []">Clear filter</button>
                  </div>
                </div>
              </div>
            </th>
            <th class="px-8 py-4 text-[14px] font-medium">Company Name</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Contract Period</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Year</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Revenue</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Collected</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Settlement</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Payment Date</th>
            <th class="px-8 py-4 text-[14px] font-medium text-right">Payment Status</th>
          </tr>
        </thead>
        
        <!-- RESOURCE CONSUMPTION TAB HEADERS -->
        <thead v-else-if="activeTab === 'Resource Consumption'" class="bg-[#00835D] text-white">
          <tr>
            <th class="px-8 py-4 text-[14px] font-medium">Customer Code</th>
            <th class="px-8 py-4 text-[14px] font-medium">Source</th>
            <th class="px-8 py-4 text-[14px] font-medium">Company Name</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Hosting Cost</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">AI Token Cost</th>
            <th class="px-8 py-4 text-[14px] font-medium text-center">Total Cost</th>
            <th class="px-8 py-4 text-[14px] font-medium text-left">Payment Status</th>
          </tr>
        </thead>

        <!-- PARTNER APPROVALS TAB HEADERS -->
        <thead v-else-if="activeTab === 'Partner Approvals'" class="bg-[#00835D] text-white">
          <tr v-if="subTab === 'Partner Registration'">
            <th class="pl-6 pr-4 py-3 text-[14px] font-medium rounded-tl-[8px] rounded-bl-[8px]">Request Date</th>
            <th class="px-4 py-3 text-[14px] font-medium">Partner Name</th>
            <th class="px-4 py-3 text-[14px] font-medium">Email Id</th>
            <th class="px-4 py-3 text-[14px] font-medium">Phone</th>
            <th class="px-4 py-3 text-[14px] font-medium">Trading License</th>
            <th class="px-4 py-3 text-[14px] font-medium">Status</th>
            <th class="px-4 py-3 text-[14px] font-medium rounded-tr-[8px] rounded-br-[8px]">Action</th>
          </tr>
          <tr v-else-if="subTab === 'Payment Requests'">
            <th class="pl-6 pr-4 py-3 text-[14px] font-medium rounded-tl-[8px] rounded-bl-[8px]">Request Date</th>
            <th class="px-4 py-3 text-[14px] font-medium">Partner Name</th>
            <th class="px-4 py-3 text-[14px] font-medium">Partner Id</th>
            <th class="px-4 py-3 text-[14px] font-medium">Amount</th>
            <th class="px-4 py-3 text-[14px] font-medium">Voucher No.</th>
            <th class="px-4 py-3 text-[14px] font-medium">Payment Date</th>
            <th class="px-4 py-3 text-[14px] font-medium">Status</th>
            <th class="px-4 py-3 text-[14px] font-medium rounded-tr-[8px] rounded-br-[8px]">Action</th>
          </tr>
        </thead>

        <!-- UPLOADED REPORTS TAB HEADERS -->
        <thead v-else-if="activeTab === 'Uploaded Reports'" class="bg-[#00835D] text-white">
          <tr>
            <th class="pl-6 pr-4 py-3 text-[14px] font-medium rounded-tl-[8px] rounded-bl-[8px]">Report Type</th>
            <th class="px-4 py-3 text-[14px] font-medium">File Name</th>
            <th class="px-4 py-3 text-[14px] font-medium">Uploaded By</th>
            <th class="px-4 py-3 text-[14px] font-medium">Uploaded Date</th>
            <th class="px-4 py-3 text-[14px] font-medium rounded-tr-[8px] rounded-br-[8px]">Action</th>
          </tr>
        </thead>

        <!-- USER MASTER INFO TAB HEADERS -->
        <thead v-else-if="activeTab === 'User Master Info'" class="bg-[#00835D] text-white">
          <tr>
            <th class="pl-6 pr-4 py-3 text-[14px] font-medium rounded-tl-[8px] rounded-bl-[8px]">Customer Code</th>
            <th class="px-4 py-3 text-[14px] font-medium">Source</th>
            <th class="px-4 py-3 text-[14px] font-medium">Company Name</th>
            <th class="px-4 py-3 text-[14px] font-medium">Bank Details</th>
            <th class="px-4 py-3 text-[14px] font-medium">Credit Card</th>
            <th class="px-4 py-3 text-[14px] font-medium">Contact Person</th>
            <th class="px-4 py-3 text-[14px] font-medium">Contact No.</th>
            <th class="px-4 py-3 text-[14px] font-medium rounded-tr-[8px] rounded-br-[8px]">Registered Email</th>
          </tr>
        </thead>
        
        <!-- ALL CUSTOMERS TAB BODY -->
        <tbody v-if="!['Partners', 'Direct Customers', 'Resource Consumption', 'Partner Approvals', 'Uploaded Reports', 'User Master Info'].includes(activeTab)" 
               :class="isDark ? 'bg-transparent divide-white/5' : 'bg-[#F9FAFB]/50 divide-gray-50'" class="divide-y">
          <tr v-for="(row, idx) in allCustomersRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.code }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.source }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.company }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.revenue }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.collected }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.date }}</td>
            <td class="px-8 py-5 text-center">
              <span :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#EF4444] text-white shadow-[#EF444433]'"
                    class="px-4 py-1.5 rounded-full text-[12px] font-semibold inline-block min-w-[70px] shadow-sm">
                {{ row.status }}
              </span>
            </td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.reason }}</td>
          </tr>
        </tbody>

        <!-- DIRECT CUSTOMERS TAB BODY -->
        <tbody v-else-if="activeTab === 'Direct Customers'" 
               :class="isDark ? 'bg-transparent divide-white/5' : 'bg-[#F9FAFB]/50 divide-gray-50'" class="divide-y">
          <tr v-for="(row, idx) in directCustomersRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.code }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.source }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.company }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.revenue }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.collected }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.date }}</td>
            <td class="px-8 py-5 text-center">
              <span :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#EF4444] text-white shadow-[#EF444433]'"
                    class="px-4 py-1.5 rounded-full text-[12px] font-semibold inline-block min-w-[70px] shadow-sm">
                {{ row.status }}
              </span>
            </td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.reason }}</td>
            <td class="px-8 py-5 text-right flex justify-end">
              <button class="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12px] font-medium transition-all"
                      :class="row.status === 'Paid' ? 'bg-[#00835D] text-white hover:bg-[#006A4A]' : (isDark ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-[#7EAC9D] text-white cursor-not-allowed')">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>
            </td>
          </tr>
        </tbody>

        <!-- PARTNERS TAB BODY -->
        <tbody v-else-if="activeTab === 'Partners'" 
               :class="isDark ? 'bg-transparent divide-white/5' : 'bg-[#F9FAFB]/50 divide-gray-50'" class="divide-y">
          <tr v-for="(row, idx) in filteredPartnersRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.code }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.source }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.company }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.contract }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.year }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.revenue }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.collected }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.settlement }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.date }}</td>
            <td class="px-8 py-5 text-right">
              <span :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#EF4444] text-white shadow-[#EF444433]'"
                    class="px-4 py-1.5 rounded-full text-[12px] font-semibold inline-block min-w-[70px] text-center shadow-sm">
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>

        <!-- RESOURCE CONSUMPTION TAB BODY -->
        <tbody v-else-if="activeTab === 'Resource Consumption'" 
               :class="isDark ? 'bg-transparent divide-white/5' : 'bg-[#F9FAFB]/50 divide-gray-50'" class="divide-y">
          <tr v-for="(row, idx) in resourceRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.code }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.source }}</td>
            <td class="px-8 py-5 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.company }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.hosting }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.ai }}</td>
            <td class="px-8 py-5 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.total }}</td>
            <td class="px-8 py-5 flex items-center gap-2 flex-wrap">
              <span v-for="(issue, iIdx) in row.issues" :key="iIdx" 
                    class="bg-[#F85559] text-white px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap shadow-sm shadow-[#F8555933]">
                {{ issue }}
              </span>
            </td>
          </tr>
        </tbody>

        <!-- PARTNER APPROVALS TAB BODY -->
        <tbody v-else-if="activeTab === 'Partner Approvals'" :class="isDark ? 'bg-transparent' : 'bg-white'">
          <template v-if="subTab === 'Partner Registration'">
            <tr v-for="(row, idx) in partnerApprovalsRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
              <td class="pl-6 pr-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.date }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.name }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.email }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.phone }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.license }}</td>
              <td class="px-4 py-3 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                <span :class="row.status === 'Approved' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#F59E0B] text-white shadow-[#F59E0B33]'"
                      class="px-3 py-1 rounded-[20px] text-[12px] font-medium inline-block min-w-[70px] text-center shadow-sm">
                  {{ row.status }}
                </span>
              </td>
              <td class="px-4 py-3 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                <div class="flex items-center gap-2">
                  <button @click="row.status === 'Pending' && emit('approve-partner', row.id)"
                          class="px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                          :class="row.status === 'Pending' ? 'bg-[#00835D] text-white hover:bg-[#006A4A]' : 'bg-[#00835D] text-white opacity-40 cursor-not-allowed'">
                    Approve
                  </button>
                  <button @click="row.status === 'Pending' && emit('reject-partner', row.id)"
                          class="px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                          :class="row.status === 'Pending' ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' : 'bg-[#EF4444] text-white opacity-40 cursor-not-allowed'">
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="subTab === 'Payment Requests'">
            <tr v-for="(row, idx) in paymentRequestsRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
              <td class="pl-6 pr-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.date }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.name }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.partnerId }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.amount }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.voucher }}</td>
              <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.paymentDate }}</td>
              <td class="px-4 py-3 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                <span :class="row.status === 'Approved' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#F59E0B] text-white shadow-[#F59E0B33]'"
                      class="px-3 py-1 rounded-[20px] text-[12px] font-medium inline-block min-w-[70px] text-center shadow-sm">
                  {{ row.status }}
                </span>
              </td>
              <td class="px-4 py-3 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                <div class="flex items-center gap-2">
                  <button @click="row.status === 'Pending' && emit('approve-payment', row.id)"
                          class="px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                          :class="row.status === 'Pending' ? 'bg-[#00835D] text-white hover:bg-[#006A4A]' : 'bg-[#00835D] text-white opacity-40 cursor-not-allowed'">
                    Approve
                  </button>
                  <button @click="row.status === 'Pending' && emit('reject-payment', row.id)"
                          class="px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                          :class="row.status === 'Pending' ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' : 'bg-[#EF4444] text-white opacity-40 cursor-not-allowed'">
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>

        <!-- UPLOADED REPORTS TAB BODY -->
        <tbody v-else-if="activeTab === 'Uploaded Reports'" :class="isDark ? 'bg-transparent' : 'bg-white'">
          <tr v-for="(row, idx) in uploadedReportsRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
            <td class="pl-6 pr-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ reportTypeLabel(row.type) }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.file }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.uploader }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.date }}</td>
            <td class="px-4 py-3 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
              <button @click="emit('download-report', row.id)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all bg-[#2DCE89] text-white hover:bg-[#28b97b] shadow-[#2DCE8933] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </td>
          </tr>
        </tbody>

        <!-- USER MASTER INFO TAB BODY -->
        <tbody v-else-if="activeTab === 'User Master Info'" :class="isDark ? 'bg-transparent' : 'bg-white'">
          <tr v-for="(row, idx) in userMasterRows" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
            <td class="pl-6 pr-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.code }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.source }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.company }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.bank }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.card }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.contactPerson }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.contactNo }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.email }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </section>
</template>

<script setup>
const { isDark } = useTheme()

const props = defineProps({
  activeTab:           { type: String,  default: 'All Customers' },
  subTab:              { type: String,  default: 'Partner Registration' },
  allCustomersRows:    { type: Array,   default: () => [] },
  directCustomersRows: { type: Array,   default: () => [] },
  partnersRows:        { type: Array,   default: () => [] },
  resourceRows:        { type: Array,   default: () => [] },
  partnerApprovalsRows:{ type: Array,   default: () => [] },
  paymentRequestsRows: { type: Array,   default: () => [] },
  uploadedReportsRows: { type: Array,   default: () => [] },
  userMasterRows:      { type: Array,   default: () => [] },
})

const emit = defineEmits(['approve-partner', 'reject-partner', 'approve-payment', 'reject-payment', 'download-report'])

const reportTypeLabel = (type) => {
  if (type === 'ai_usage') return 'AI Usage Report'
  if (type === 'hosting_cost') return 'Hosting Cost Report'
  return type
}

// ── Partners Source filter ────────────────────────────────────────────────────
const isSourceMenuOpen  = ref(false)
const selectedSources   = ref([])

const partnerSourceOptions = computed(() => [...new Set(props.partnersRows.map(r => r.source).filter(Boolean))])

const filteredPartnersRows = computed(() =>
  selectedSources.value.length
    ? props.partnersRows.filter(r => selectedSources.value.includes(r.source))
    : props.partnersRows
)

const toggleSourceFilter = (source) => {
  const i = selectedSources.value.indexOf(source)
  i > -1 ? selectedSources.value.splice(i, 1) : selectedSources.value.push(source)
}
</script>
