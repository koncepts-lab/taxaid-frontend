<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">10</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
           <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>
      
      <!-- Needs Review -->
      <div class="border border-[#BFDBFE] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Needs Review</div>
        <div class="text-3xl font-semibold text-[#2563EB]">3</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
        </div>
      </div>

      <!-- Approved -->
      <div class="border border-[#86EFAC] rounded-xl p-5 bg-[#F0FDF4] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Approved</div>
        <div class="text-3xl font-semibold text-[#16A34A]">3</div>
        <div class="absolute top-5 right-5 text-[#16A34A]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      </div>

      <!-- Overdue -->
      <div class="border border-[#FCA5A5] rounded-xl p-5 bg-[#FEF2F2] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Overdue</div>
        <div class="text-3xl font-semibold text-[#DC2626]">3</div>
        <div class="absolute top-5 right-5 text-[#DC2626]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
      <!-- Blue banner -->
      <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#2563EB]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <div class="text-[#1E3A8A] font-medium">2 tickets are ready for development.</div>
            <div class="text-[#1D4ED8] text-sm mt-1">Development can now begin based on the approved requirements.</div>
          </div>
        </div>
        <button class="text-[#3B82F6] hover:text-[#1D4ED8] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Green banner -->
      <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#16A34A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <div class="text-[#14532D] font-medium">2 tickets have been completed.</div>
            <div class="text-[#16A34A] text-sm mt-1">Development phase is closed.</div>
          </div>
        </div>
        <button class="text-[#22C55E] hover:text-[#16A34A] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Yellow banner -->
      <div class="bg-[#FEFCE8] border border-[#FFF085] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#D97706]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <div class="text-[#92400E] font-medium">2 tickets waiting for your review</div>
            <div class="text-[#B45309] text-sm mt-1">Tickets awaiting manager review with deadlines</div>
          </div>
        </div>
        <button class="text-[#D97706] hover:text-[#92400E] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-8 px-2">
      <button class="bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center">All Tickets (10)</button>
      <button class="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center">Needs Review (3)</button>
      <button class="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center">Approved (3)</button>
      <button class="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center">Rejected (1)</button>
    </div>

    <!-- Search & Filters -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[16px] p-4 flex flex-col md:flex-row gap-4">
      <div class="relative w-full md:w-[40%]">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input type="text" placeholder="Search tickets..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>
      
      <!-- Statuses Dropdown -->
      <div class="w-full md:w-[30%] relative">
        <button @click="isStatusesOpen = !isStatusesOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedStatus }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isStatusesOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isStatusesOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="option in statusesOptions" :key="option"
               @click="selectedStatus = option; isStatusesOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="option === selectedStatus ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ option }}
          </div>
        </div>
      </div>

      <!-- Departments Dropdown -->
      <div class="w-full md:w-[30%] relative">
        <button @click="isDepartmentsOpen = !isDepartmentsOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedDepartment }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isDepartmentsOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isDepartmentsOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="option in departmentsOptions" :key="option"
               @click="selectedDepartment = option; isDepartmentsOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="option === selectedDepartment ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ option }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h2 class="text-xl font-medium text-gray-800">Tickets Table</h2>
          <p class="text-gray-500 text-sm mt-1">Showing 2 of 2 tickets</p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[25%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[12%]">Overall score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[13%]">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Feature Suggestion</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  8/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#F4E8FF] text-[#A855F7] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">VP Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="isReviewModalOpen = true" class="inline-flex items-center gap-1.5 bg-[#00AD5FCC] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Review
                </button>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Implementation Feedback</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  8/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#F4E8FF] text-[#A855F7] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">VP Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="isReviewModalOpen = true" class="inline-flex items-center gap-1.5 bg-[#00AD5FCC] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Review
                </button>
              </td>
            </tr>

            <!-- Row 3 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Implementation Feedback</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  8/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Manager Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="isReviewModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-8 py-6 flex items-start justify-between shrink-0">
          <div>
            <h2 class="text-xl font-medium text-gray-900">Approval Decision - Manager</h2>
            <p class="text-gray-500 text-sm mt-1">Review and decide</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="inline-flex bg-[#F4E8FF] text-[#A855F7] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">VP Approved</span>
            <button @click="isReviewModalOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-8 pb-8 overflow-y-auto space-y-8">
          <!-- Ticket ID -->
          <div>
            <span class="inline-block border border-gray-200 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700">TKT-012</span>
          </div>

          <!-- Details Box -->
          <div class="border border-[#04C18F80] rounded-[16px] p-6 space-y-4">
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Client:</span>
              <span class="text-gray-700">ACME Corp</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Issue:</span>
              <span class="text-gray-700">Add dark mode feature</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Type:</span>
              <span class="text-gray-700">Feature Suggestion</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Created by:</span>
              <span class="text-gray-700">Mike Chen</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Created on:</span>
              <span class="text-gray-700">11/3/2025</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Department:</span>
              <span class="text-gray-700">Customer Support Team</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Description:</span>
              <span class="text-gray-700">Clients are requesting ability to export multiple reports at once instead of one-by-one downloads.</span>
            </div>
          </div>

          <!-- Activity & Comments -->
          <div class="space-y-4">
            <h3 class="text-[15px] font-medium text-gray-900 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Activity & Comments
            </h3>
            
            <div class="space-y-4">
              <!-- Team Lead -->
              <div class="bg-[#F0FDF4] rounded-xl p-5 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-900 font-medium">Team Lead</span>
                  <span class="text-gray-500 text-sm">10/30/2025 5:30:00 AM</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-700">Team Lead Score:</span>
                  <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    8/10
                  </span>
                </div>
                <div class="text-gray-900">
                  <span class="font-medium">Comments:</span> Important security feature. Can use existing libraries. 4 weeks.
                </div>
              </div>

              <!-- Tech Team -->
              <div class="bg-[#EEF2FF] rounded-xl p-5 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-900 font-medium">Tech Team</span>
                  <span class="text-gray-500 text-sm">10/30/2025 5:30:00 AM</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-700">Tech Team Score:</span>
                  <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    8/10
                  </span>
                </div>
                <div class="text-gray-900">
                  <span class="font-medium">Comments:</span> Important security feature. Can use existing libraries. 4 weeks.
                </div>
              </div>

              <!-- VP -->
              <div class="bg-[#FAF5FF] rounded-xl p-5 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-900 font-medium">Vice President of Technology</span>
                  <span class="text-gray-500 text-sm">10/30/2025 5:30:00 AM</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-700">VP Score:</span>
                  <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    8/10
                  </span>
                </div>
                <div class="text-gray-900">
                  <span class="font-medium">Comments:</span> Important security feature. Can use existing libraries. 4 weeks.
                </div>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="space-y-4">
            <h3 class="text-[15px] font-medium text-gray-900 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
              Attachments
            </h3>
            <p class="text-gray-400 text-sm">No Attachments</p>
          </div>
          
          <hr class="border-gray-100" />

          <!-- Comments Area -->
          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Manager Comments & Analysis *</label>
            <textarea rows="3" placeholder="Add manager review: business value & final decision." class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px] resize-none"></textarea>
          </div>

          <!-- Your Decision -->
          <div class="space-y-4">
            <label class="text-[15px] font-medium text-gray-900 block">Your Decision *</label>
            <div class="grid grid-cols-2 gap-4">
              <button class="border border-[#008169] rounded-[10px] py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#F0FDF4] transition-colors group">
                <div class="text-gray-400 group-hover:text-[#008169] transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span class="text-gray-600 font-medium group-hover:text-[#008169] transition-colors">Approve</span>
              </button>
              <button class="border border-[#FCA5A5] rounded-[10px] py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#FEF2F2] transition-colors group">
                <div class="text-gray-400 group-hover:text-[#DC2626] transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <span class="text-gray-600 font-medium group-hover:text-[#DC2626] transition-colors">Reject</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 flex justify-end items-center gap-4 shrink-0 border-t border-gray-100 bg-white">
          <button @click="isReviewModalOpen = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="isReviewModalOpen = false" class="px-8 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isStatusesOpen = ref(false)
const selectedStatus = ref('All Statuses')
const isDepartmentsOpen = ref(false)
const selectedDepartment = ref('All Departments')
const isReviewModalOpen = ref(false)

const statusesOptions = [
  'All Statuses',
  'VP Approved',
  'Manger Approved',
  'Admin Approved',
  'Flagged',
  'Scrapped',
  'Future'
]

const departmentsOptions = [
  'All Departments',
  'Implementation Team',
  'Business Review Team',
  'Customer Support Team',
  'Sales & Marketing',
  'R & D',
  'Tech / Development Team'
]
</script>
