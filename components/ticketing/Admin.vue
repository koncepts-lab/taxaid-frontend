<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Pending Approval -->
      <div class="bg-[#FFF7ED] border border-[#FDBA74] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#C2410C] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Pending Approval</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#C2410C]">2</div>
      </div>

      <!-- Overdue Reviews -->
      <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#DC2626] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Overdue Reviews</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#DC2626]">2</div>
      </div>

      <!-- In Development -->
      <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#0369A1] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>In Development</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#0369A1]">2</div>
      </div>

      <!-- Developed -->
      <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#16A34A] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Developed</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#16A34A]">2</div>
      </div>

      <!-- Scrapped/Rejected -->
      <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-4 relative shadow-sm">
        <div class="text-[#DC2626] text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Scrapped/Rejected</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#DC2626]">2</div>
      </div>
    </div>

    <!-- Top Alert Banners -->
    <div class="space-y-3">
      <!-- Blue banner -->
      <div class="bg-[#EFF6FF] border border-[#81B8FF] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#2563EB]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
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
      <div class="bg-[#F0FDF4] border border-[#04C18F80] rounded-lg p-4 flex justify-between items-start relative">
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

    <!-- Manager Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Manager A -->
      <div class="border border-gray-200 rounded-[16px] p-6 bg-white shadow-sm space-y-6">
        <div>
          <h3 class="text-[17px] font-medium text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            Manager A Report
          </h3>
          <p class="text-gray-500 text-sm mt-1">Implementation, Business Review, Customer Support</p>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Total Tickets:</span>
            <span class="text-gray-900 font-medium">10</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Pending Your Review:</span>
            <span class="text-[#D97706] font-medium">2</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Approved:</span>
            <span class="text-[#16A34A] font-medium">0</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Flagged:</span>
            <span class="text-[#DC2626] font-medium">1</span>
          </div>
        </div>
      </div>

      <!-- Manager B -->
      <div class="border border-gray-200 rounded-[16px] p-6 bg-white shadow-sm space-y-6">
        <div>
          <h3 class="text-[17px] font-medium text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            Manager B Report
          </h3>
          <p class="text-gray-500 text-sm mt-1">Sales & Marketing, R&D, Tech / Development</p>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Total Tickets:</span>
            <span class="text-gray-900 font-medium">5</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Pending Your Review:</span>
            <span class="text-[#D97706] font-medium">0</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Approved:</span>
            <span class="text-[#16A34A] font-medium">1</span>
          </div>
          <div class="flex justify-between items-center text-[15px]">
            <span class="text-gray-500">Flagged:</span>
            <span class="text-[#DC2626] font-medium">1</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Red Alert Banner -->
    <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-4 flex justify-between items-start relative">
      <div class="flex gap-3">
        <div class="mt-0.5 text-[#DC2626]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div>
          <div class="text-[#991B1B] font-medium">2 tickets have been cancelled multiple times</div>
          <div class="text-[#DC2626] text-sm mt-1">These tickets may need special attention. Review the "Flagged" tab for details.</div>
        </div>
      </div>
      <button class="text-[#DC2626] hover:text-[#991B1B] absolute top-4 right-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-8 px-2 text-sm">
      <button @click="activeTab = 'Pending'" :class="activeTab === 'Pending' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">Pending (2)</button>
      <button @click="activeTab = 'Approved'" :class="activeTab === 'Approved' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">Approved (0)</button>
      <button @click="activeTab = 'Developed'" :class="activeTab === 'Developed' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">Developed(2)</button>
      <button @click="activeTab = 'In Dev'" :class="activeTab === 'In Dev' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">In Dev(2)</button>
      <button @click="activeTab = 'Flagged'" :class="activeTab === 'Flagged' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">Flagged(0)</button>
      <button @click="activeTab = 'Scrapped'" :class="activeTab === 'Scrapped' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">Scrapped(2)</button>
      <button @click="activeTab = 'Future'" :class="activeTab === 'Future' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center'">Future(0)</button>
      <button @click="activeTab = 'Master List'" :class="activeTab === 'Master List' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 py-2 rounded-full transition-colors flex-1 text-center whitespace-nowrap' : 'text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors flex-1 text-center whitespace-nowrap'">Master List(21)</button>
    </div>

    <!-- Search & Filters -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[16px] p-4 flex flex-col md:flex-row gap-4">
      <div class="relative w-full md:w-[60%]">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input type="text" placeholder="Search tickets..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>
      
      <!-- Managers Dropdown -->
      <div class="w-full md:w-[40%] relative">
        <button @click="isManagersOpen = !isManagersOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedManager }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isManagersOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isManagersOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="option in managersOptions" :key="option"
               @click="selectedManager = option; isManagersOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="option === selectedManager ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
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
          <p class="text-gray-500 text-sm mt-1">
            <template v-if="activeTab === 'Developed'">Track tickets that have been successfully developed</template>
            <template v-else-if="activeTab === 'In Dev'">Track tickets currently being worked on by the development team.</template>
            <template v-else-if="activeTab === 'Flagged'">Review tickets that have been flagged and require immediate attention.</template>
            <template v-else-if="activeTab === 'Scrapped'">Track tickets that were cancelled and are no longer in progress.</template>
            <template v-else-if="activeTab === 'Future'">Track tickets planned for upcoming development cycles.</template>
            <template v-else-if="activeTab === 'Master List'">Showing 5 of 21 tickets</template>
            <template v-else>Review tickets awaiting your decision.</template>
          </p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[25%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Department</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Manager</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Overall Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody v-if="activeTab === 'Pending'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Manager Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center gap-1.5 bg-[#22C55E] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] ml-auto font-medium transition-colors min-w-[162px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Review & Decide
                </button>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Manager Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center gap-1.5 bg-[#22C55E] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] ml-auto font-medium transition-colors min-w-[162px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Review & Decide
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="activeTab === 'Approved'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Admin Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Admin Approved</span>
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
          <tbody v-else-if="activeTab === 'Developed'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Developed</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Developed</span>
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
          <tbody v-else-if="activeTab === 'In Dev'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#CFFAFE] text-[#0891B2] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">In Development</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#CFFAFE] text-[#0891B2] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">In Development</span>
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
          <tbody v-else-if="activeTab === 'Flagged'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#FFEDD5] text-[#EA580C] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Flagged</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center gap-1.5 bg-[#22C55E] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] ml-auto font-medium transition-colors min-w-[100px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Review
                </button>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#FFEDD5] text-[#EA580C] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Flagged</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center gap-1.5 bg-[#22C55E] text-white rounded-md px-4 py-1.5 hover:bg-[#16A34A] ml-auto font-medium transition-colors min-w-[100px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Review
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="activeTab === 'Scrapped'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#FEE2E2] text-[#EF4444] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Scrapped</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#FEE2E2] text-[#EF4444] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Scrapped</span>
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
          <tbody v-else-if="activeTab === 'Future'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#FFEDD5] text-[#EA580C] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Future</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#FFEDD5] text-[#EA580C] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Future</span>
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
          <tbody v-else-if="activeTab === 'Master List'" class="text-sm text-gray-700">
            <!-- Row 1 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add dark mode feature</td>
              <td class="py-4 px-6 text-gray-800">R&D Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager A</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
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
            
            <!-- Row 2 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
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

            <!-- Row 3 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Scored</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Row 4 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#CFFAFE] text-[#0891B2] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">In Development</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Row 5 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6 text-gray-800">Customer Support Team</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Manager B</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#CFFAFE] text-[#0891B2] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">In Development</span>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('Approved')
const isManagersOpen = ref(false)
const selectedManager = ref('All Managers')

const managersOptions = [
  'All Managers',
  'Manager A',
  'Manager B'
]
</script>
