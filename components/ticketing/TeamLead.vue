<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">5</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
           <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>
      
      <!-- Need Review -->
      <div class="border border-[#81B8FF] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Need Review</div>
        <div class="text-3xl font-semibold text-[#1D4ED8]">3</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <img src="/images/icons/review.svg" class="w-6 h-6" alt="Review" />
        </div>
      </div>

      <!-- Overdue -->
      <div class="border border-[#FCA5A5] rounded-xl p-5 bg-[#FEF2F2] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Overdue</div>
        <div class="text-3xl font-semibold text-[#DC2626]">3</div>
        <div class="absolute top-5 right-5 text-[#EF4444]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      </div>

      <!-- Team Members -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Team Members</div>
        <div class="text-3xl font-semibold text-[#15803D]">3</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
      <!-- Ready for dev -->
      <div class="bg-[#EFF6FF] border border-[#81B8FF] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#005B9F]">
            <img src="/images/icons/tickets-development.svg" class="w-5 h-5" alt="Tickets Development" />
          </div>
          <div>
            <div class="text-[#004254] font-medium">2 tickets are ready for development.</div>
            <div class="text-[#007595] text-sm mt-1">Development can now begin based on the approved requirements.</div>
          </div>
        </div>
        <button class="text-[#2563EB] hover:text-[#1E3A8A] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Completed -->
      <div class="bg-[#F0FDF4] border border-[#04C18F80] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#166534]">
            <img src="/images/icons/Completed.svg" class="w-5 h-5" alt="Completed" />
          </div>
          <div>
            <div class="text-[#00441C] font-medium">2 tickets have been completed.</div>
            <div class="text-[#008235] text-sm mt-1">Development phase is closed.</div>
          </div>
        </div>
        <button class="text-[#16A34A] hover:text-[#14532D] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <!-- Waiting for review -->
      <div class="bg-[#FEFCE8] border border-[#FFF085] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#0A0A0A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <div class="text-[#733E0A] font-medium">2 tickets waiting for your review</div>
            <div class="text-[#A65F00] text-sm mt-1">Tickets awaiting your review with deadlines</div>
          </div>
        </div>
        <button class="text-[#D97706] hover:text-[#92400E] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-8 px-2">
      <button class="bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors">All Tickets (10)</button>
      <button class="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors">Needs Review (3)</button>
      <button class="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors">Approved (3)</button>
      <button class="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors">Rejected (1)</button>
    </div>

    <!-- Search & Filters -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[16px] p-4 flex flex-col md:flex-row gap-4">
      <div class="relative w-full md:flex-1">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input type="text" placeholder="Search tickets..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>
      
      <!-- Statuses Dropdown -->
      <div class="w-full md:w-[40%] lg:w-[30%] relative">
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
          <div v-for="status in statusOptions" :key="status"
               @click="selectedStatus = status; isStatusesOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="status === selectedStatus ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ status }}
          </div>
        </div>
      </div>
    </div>

    <!-- Department Tickets Table -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h2 class="text-xl font-medium text-gray-800">Department Tickets</h2>
          <p class="text-gray-500 text-sm mt-1">Review, prioritize, score, and approve tickets from your team</p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[25%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Created by</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-001</td>
              <td class="py-4 px-6 text-gray-800">Dashboard loading time is too slow</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Bug</span>
              </td>
              <td class="py-4 px-6 text-gray-800">John Doe</td>
              <td class="py-4 px-6 text-gray-400 font-medium">Not Scored</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Submitted</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center gap-1.5 bg-[#10B981] text-white rounded-md px-4 py-1.5 hover:bg-[#059669] ml-auto font-medium transition-colors">
                  <img src="/images/icons/ok.svg" class="w-[14px] h-[14px]" alt="Review" />
                  Review
                </button>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Feature Suggestion</span>
              </td>
              <td class="py-4 px-6 text-gray-800">Emma Wilson</td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Scored</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 ml-auto transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </td>
            </tr>

            <!-- Row 3 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Feature Suggestion</span>
              </td>
              <td class="py-4 px-6 text-gray-800">Chris Taylor</td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  8/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Scored</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 ml-auto transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </td>
            </tr>

            <!-- Row 4 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Bug</span>
              </td>
              <td class="py-4 px-6 text-gray-800">John Doe</td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#CCFBF1] text-[#0F766E] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">In Development</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 ml-auto transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- My Team Members Section -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-8">
      <div class="p-6 pb-4 flex justify-between items-start">
        <div>
          <h2 class="text-xl font-medium text-gray-800">My Team Members</h2>
          <p class="text-gray-500 text-sm mt-1">Manage your department team</p>
        </div>
        <button @click="isAddMemberModalOpen = true" class="inline-flex items-center gap-2 bg-[#008169] text-white rounded-[8px] px-5 py-2 hover:bg-[#006A56] font-medium transition-colors text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          Add Team Members
        </button>
      </div>

      <div class="p-6 pt-0 space-y-3">
        <!-- Member 1 -->
        <div class="border border-gray-200 rounded-[12px] p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
          <div>
            <div class="text-gray-900 font-medium">John Doe</div>
            <div class="text-gray-500 text-sm mt-0.5">john.doe@company.com</div>
          </div>
          <button class="text-[#EF4444] hover:text-[#DC2626] font-medium text-sm transition-colors">
            Remove
          </button>
        </div>

        <!-- Member 2 -->
        <div class="border border-gray-200 rounded-[12px] p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
          <div>
            <div class="text-gray-900 font-medium">Emma Wilson</div>
            <div class="text-gray-500 text-sm mt-0.5">emma.wilson@company.com</div>
          </div>
          <button class="text-[#EF4444] hover:text-[#DC2626] font-medium text-sm transition-colors">
            Remove
          </button>
        </div>

        <!-- Member 3 -->
        <div class="border border-gray-200 rounded-[12px] p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
          <div>
            <div class="text-gray-900 font-medium">Chris Taylor</div>
            <div class="text-gray-500 text-sm mt-0.5">chris.taylor@company.com</div>
          </div>
          <button class="text-[#EF4444] hover:text-[#DC2626] font-medium text-sm transition-colors">
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Add Team Member Modal -->
    <div v-if="isAddMemberModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-8 py-6 flex items-start justify-between shrink-0">
          <div>
            <h2 class="text-[18px] font-medium text-gray-900 flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Add Team Member
            </h2>
            <p class="text-gray-500 text-sm mt-1">Add a new team member to Implementation Team</p>
          </div>
          <button @click="isAddMemberModalOpen = false" class="text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-8 pb-8 overflow-y-auto space-y-6">
          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Full Name</label>
            <input type="text" placeholder="Enter member's full name" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
          </div>

          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Email</label>
            <input type="email" placeholder="member@company.com" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
          </div>

          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Department</label>
            <div class="relative">
              <select class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-400 text-[15px] appearance-none">
                <option>Implementation Team</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Role</label>
            <div class="relative">
              <select class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-400 text-[15px] appearance-none">
                <option>Team Member</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 flex justify-end items-center gap-4 shrink-0">
          <button @click="isAddMemberModalOpen = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="isAddMemberModalOpen = false" class="px-6 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Add Members
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
const isAddMemberModalOpen = ref(false)

const statusOptions = [
  'All Statuses',
  'Submitted',
  'Tech Scored',
  'VP Approved',
  'Manager Approved',
  'Admin Approved',
  'In Development',
  'Developed',
  'Flagged',
  'Scrapped'
]
</script>
