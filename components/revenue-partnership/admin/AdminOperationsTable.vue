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
              <div class="flex items-center gap-1 cursor-pointer">
                Source
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
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
          <tr v-for="(row, idx) in allCustomersData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
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
          <tr v-for="(row, idx) in directCustomersData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
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
          <tr v-for="(row, idx) in partnersData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
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
          <tr v-for="(row, idx) in resourceCustomersData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
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
            <tr v-for="(row, idx) in partnerApprovalsData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
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
                <button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                        :class="row.status === 'Pending' ? 'bg-[#2DCE89] text-white hover:bg-[#28b97b] shadow-[#2DCE8933] shadow-sm' : 'bg-[#2DCE89] text-white opacity-40 cursor-not-allowed'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Review
                </button>
              </td>
            </tr>
          </template>
          <template v-else-if="subTab === 'Payment Requests'">
            <tr v-for="(row, idx) in partnerPaymentRequestsData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
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
                <button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                        :class="row.status === 'Pending' ? 'bg-[#2DCE89] text-white hover:bg-[#28b97b] shadow-[#2DCE8933] shadow-sm' : 'bg-[#2DCE89] text-white opacity-40 cursor-not-allowed'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Review
                </button>
              </td>
            </tr>
          </template>
        </tbody>

        <!-- UPLOADED REPORTS TAB BODY -->
        <tbody v-else-if="activeTab === 'Uploaded Reports'" :class="isDark ? 'bg-transparent' : 'bg-white'">
          <tr v-for="(row, idx) in uploadedReportsData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
            <td class="pl-6 pr-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.type }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.file }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.uploader }}</td>
            <td class="px-4 py-3 text-[13px] border-b" :class="isDark ? 'text-white/90 border-white/5' : 'text-[#1a1a1a] border-gray-100'">{{ row.date }}</td>
            <td class="px-4 py-3 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
              <button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all bg-[#2DCE89] text-white hover:bg-[#28b97b] shadow-[#2DCE8933] shadow-sm">
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
          <tr v-for="(row, idx) in userMasterInfoData" :key="idx" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'" class="transition-all group">
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
import { computed } from 'vue'

const { isDark } = useTheme()

const props = defineProps({
  activeTab: { type: String, default: 'All Customers' },
  subTab: { type: String, default: 'Partner Registration' }
})

const partnerApprovalsData = [
  { date: '11/20/2024', name: 'Alex Thompson', email: 'partner@newtech.com', phone: '+1-555-0201', license: 'TL-2024-001', status: 'Pending' },
  { date: '11/20/2024', name: 'Alex Thompson', email: 'partner@newtech.com', phone: '+1-555-0201', license: 'TL-2024-001', status: 'Pending' },
  { date: '11/22/2024', name: 'Mark Stevens', email: 'partners@globalreach.com', phone: '+1-555-0203', license: 'TL-2024-002', status: 'Approved' },
]

const partnerPaymentRequestsData = [
  { date: '11/20/2024', name: 'TechCorp Solutions Inc.', partnerId: 'PT-001', amount: '45,000', voucher: 'VCH-2024-1101', paymentDate: '11/25/2024', status: 'Pending' },
  { date: '11/20/2024', name: 'Innovate System Ltd.', partnerId: 'PT-002', amount: '45,000', voucher: 'VCH-2024-1101', paymentDate: '11/25/2024', status: 'Pending' },
  { date: '11/22/2024', name: 'Enterprise Holdings', partnerId: 'PT-003', amount: '45,000', voucher: 'VCH-2024-1101', paymentDate: '11/25/2024', status: 'Approved' }
]

const uploadedReportsData = [
  { type: 'Month End Report', file: 'Month_End_Report_October_2024.csv', uploader: 'Accounts', date: '11/5/2024' },
  { type: 'Hosting Cost Report', file: 'Month_End_Report_September_2024.csv', uploader: 'Accounts', date: '10/3/2024' },
  { type: 'Month End Report', file: 'Month_End_Report_August_2024.csv', uploader: 'Accounts', date: '9/2/2024' }
]

const userMasterInfoData = [
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', bank: 'Chase Bank *****1234', card: '**** 4532', contactPerson: 'John Smith', contactNo: '+1-555-0101', email: 'john.smith@techcorp.com' },
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', bank: 'Chase Bank *****1234', card: '**** 4532', contactPerson: 'John Smith', contactNo: '+1-555-0101', email: 'john.smith@techcorp.com' },
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', bank: 'Chase Bank *****1234', card: '**** 4532', contactPerson: 'John Smith', contactNo: '+1-555-0101', email: 'john.smith@techcorp.com' }
]

const allCustomersData = [
  { code: 'CUST-001', source: 'PT-001', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Paid', reason: '-' },
  { code: 'CUST-002', source: 'PT-002', company: 'Global Finance LLC', revenue: '89,000', collected: '89,000', date: '11/5/2024', status: 'Failed', reason: 'Invoice not received' },
  { code: 'CUST-003', source: 'DC-003', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Failed', reason: 'Card limit exceeded' },
]

const directCustomersData = [
  { code: 'CUST-001', source: 'DT-001', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Paid', reason: '-' },
  { code: 'CUST-002', source: 'DT-002', company: 'Global Finance LLC', revenue: '89,000', collected: '89,000', date: '11/5/2024', status: 'Failed', reason: 'Invoice not received' },
  { code: 'CUST-001', source: 'DT-003', company: 'TechCorp Solutions Inc.', revenue: '125,000', collected: '125,000', date: '11/5/2024', status: 'Failed', reason: 'Card limit exceeded' },
]

const partnersData = [
  { code: 'CUST-001', source: 'PT-001', company: 'TechCorp Solutions Inc.', contract: '12 Months', year: '1', revenue: '125,000', collected: '125,000', settlement: '125,000', date: '11/5/2024', status: 'Paid' },
  { code: 'CUST-002', source: 'PT-002', company: 'Global Finance LLC', contract: '24 Months', year: '3+', revenue: '26,000', collected: '26,000', settlement: '26,000', date: '11/5/2024', status: 'Failed' },
  { code: 'CUST-001', source: 'PT-003', company: 'TechCorp Solutions Inc.', contract: '36 Months', year: '2', revenue: '38,000', collected: '38,000', settlement: '38,000', date: '11/5/2024', status: 'Failed' },
]

const resourceCustomersData = [
  { code: 'CUST-001', source: 'DC-001', company: 'TechCorp Solutions Inc.', hosting: '35,000', ai: '37,000', total: '72,000', issues: ['High Hosting'] },
  { code: 'CUST-002', source: 'DC-002', company: 'Global Finance LLC', hosting: '25,000', ai: '40,000', total: '68,000', issues: ['High Hosting', 'High AI Usage'] },
]

const currentTableData = computed(() => {
  if (props.activeTab === 'Direct Customers') {
    return allCustomersData.filter(item => item.source.startsWith('DC'))
  }
  return allCustomersData
})
</script>
