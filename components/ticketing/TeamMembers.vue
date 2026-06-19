<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">2</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>
      
      <!-- Review In Progress -->
      <div class="border border-[#FFE738] rounded-xl p-5 bg-[#FFFBE1] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Review In Progress</div>
        <div class="text-3xl font-semibold text-[#A65F00]">2</div>
        <div class="absolute top-5 right-5 text-[#D97706]">
          <img src="/images/icons/Review-In-Progress.svg" class="w-6 h-6" alt="Review In Progress" />
        </div>
      </div>

      <!-- In Development -->
      <div class="border border-[#81B8FF] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">In Development</div>
        <div class="text-3xl font-semibold text-[#1447E6]">2</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <img src="/images/icons/review.svg" class="w-6 h-6" alt="In Development" />
        </div>
      </div>

      <!-- Completed -->
      <div class="border border-[#04C18F] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Completed</div>
        <div class="text-3xl font-semibold text-[#008236]">2</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Completed.svg" class="w-6 h-6" alt="Completed" />
        </div>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
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
        <button class="text-[#005B9F] hover:text-[#004275] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

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
        <button class="text-[#166534] hover:text-[#14532D] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Create Button -->
    <div class="flex justify-end">
      <button @click="isCreateModalOpen = true" class="bg-[#008169] hover:bg-[#006A56] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create New Ticket
      </button>
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
      
      <!-- Status Dropdown -->
      <div class="w-full md:w-[30%] relative">
        <button @click="isStatusOpen = !isStatusOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedStatus }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isStatusOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isStatusOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="status in statusOptions" :key="status"
               @click="selectedStatus = status; isStatusOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="status === selectedStatus ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ status }}
          </div>
        </div>
      </div>

      <!-- Type Dropdown -->
      <div class="w-full md:w-[30%] relative">
        <button @click="isTypeOpen = !isTypeOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedType }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isTypeOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isTypeOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="type in typeOptions" :key="type"
               @click="selectedType = type; isTypeOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="type === selectedType ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ type }}
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100">
        <h2 class="text-xl font-semibold text-gray-800">My Tickets</h2>
        <p class="text-gray-500 text-sm mt-1">Showing 2 of 2 tickets</p>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[25%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[20%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Created</th>
              <th class="py-3.5 px-6 font-medium text-sm text-right w-[10%]">Actions</th>
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
              <td class="py-4 px-6 text-gray-400 font-medium">Pending</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#059669] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Team Lead Reviewed</span>
              </td>
              <td class="py-4 px-6 text-gray-600">11/3/2025</td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-700 ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
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
                <span class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Scored</span>
              </td>
              <td class="py-4 px-6 text-gray-600">10/29/2025</td>
              <td class="py-4 px-6 text-right">
                <button @click="isViewModalOpen = true" class="inline-flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-700 ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
              </td>
            </tr>

            <!-- Row 3 -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Bug</span>
              </td>
              <td class="py-4 px-6 text-gray-400 font-medium">Pending</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#F3F4F6] text-[#4B5563] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Submitted</span>
              </td>
              <td class="py-4 px-6 text-gray-600">10/29/2025</td>
              <td class="py-4 px-6 text-right">
                <button @click="isViewModalOpen = true" class="inline-flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-700 ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
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
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#CCFBF1] text-[#0F766E] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Developed</span>
              </td>
              <td class="py-4 px-6 text-gray-600">10/29/2025</td>
              <td class="py-4 px-6 text-right">
                <button @click="isViewModalOpen = true" class="inline-flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-700 ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl">
        <!-- Header -->
        <div class="px-6 py-5 flex items-center justify-between">
          <h2 class="text-[20px] font-semibold text-gray-900">Create New Ticket</h2>
          <button @click="isCreateModalOpen = false" class="text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-2 space-y-4">
          <!-- Issue Type -->
          <div class="relative">
            <button @click="isIssueTypeOpen = !isIssueTypeOpen" class="w-full relative flex items-center justify-between px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-[15px] shadow-sm transition-shadow" :class="selectedIssueType ? 'text-gray-900' : 'text-gray-500'">
              <span>{{ selectedIssueType || 'Select Issue Type' }}</span>
              <span class="flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isIssueTypeOpen }">
                <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            <div v-if="isIssueTypeOpen" class="absolute z-[110] w-full mt-2 bg-white border border-gray-100 rounded-[10px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
              <div v-for="issue in issueTypeOptions" :key="issue"
                   @click="selectedIssueType = issue; isIssueTypeOpen = false"
                   class="px-4 py-2.5 text-[15px] rounded-lg cursor-pointer transition-colors text-left"
                   :class="issue === selectedIssueType ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
                {{ issue }}
              </div>
            </div>
          </div>

          <!-- Client / Source Name -->
          <div>
            <input type="text" placeholder="Client / Source Name" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
          </div>

          <!-- Title -->
          <div>
            <input type="text" placeholder="Title" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
          </div>

          <!-- Detailed Description -->
          <div>
            <textarea placeholder="Detailed Description" rows="4" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px] resize-none"></textarea>
          </div>

          <!-- Upload Files -->
          <div>
            <input type="file" ref="fileInput" class="hidden" multiple />
            <button @click="fileInput.click()" type="button" class="w-full py-3 flex items-center justify-center gap-2 border border-[#04C18F80] rounded-[10px] text-gray-500 hover:bg-gray-50 transition-colors text-[15px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Files (Optional)
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-6 flex items-center justify-center gap-4">
          <button @click="isCreateModalOpen = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="isCreateModalOpen = false" class="px-6 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>

    <!-- View Ticket Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-4 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <h2 class="text-[18px] font-medium  text-[#0A0A0A]">TKT-002</h2>
          <div class="flex items-center gap-4">
            <span class="inline-flex bg-[#D0FAE5] text-[#007C65] rounded-full px-3 py-1 text-[13px] font-medium">Team Lead Approved</span>
            <button @click="isViewModalOpen = false" class="text-[#0A0A0A] hover:text-black transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-8 overflow-y-auto">
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
              <span class="text-gray-700 leading-relaxed">Clients are requesting ability to export multiple reports at once instead of one-by-one downloads.</span>
            </div>
          </div>

          <hr class="border-gray-100 my-8" />

          <!-- Activity & Comments -->
          <div class="space-y-6">
            <h3 class="text-[17px] font-medium text-gray-900 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Activity & Comments
            </h3>

            <!-- Comment Card -->
            <div class="bg-[#F2FFF8] rounded-[16px] p-6 space-y-4">
              <div class="flex justify-between items-start">
                <span class="text-gray-900 font-medium">Team Lead</span>
                <span class="text-gray-400 text-sm">10/30/2025 5:30:00 AM</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-gray-900">Team Lead Score:</span>
                <span class="inline-flex items-center gap-1 bg-[#D1FAE5] text-[#059669] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                  8/10
                </span>
              </div>
              <p class="text-gray-900 text-[15px] leading-relaxed">
                Important security feature. Can use existing libraries. 4 weeks.
              </p>
            </div>
          </div>

          <hr class="border-gray-100 my-8" />

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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isViewModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const isIssueTypeOpen = ref(false)
const selectedIssueType = ref('')
const fileInput = ref(null)

const issueTypeOptions = [
  'Implementation Feedback',
  'Initial Usability',
  'Feature Suggestion'
]

const isStatusOpen = ref(false)
const selectedStatus = ref('All Statuses')

const statusOptions = [
  'All Statuses',
  'Submitted',
  'Team Lead Approved',
  'Tech Scored',
  'VP Approved',
  'Manager Approved',
  'Admin Approved',
  'In development',
  'Developed',
  'Flagged',
  'Scrapped'
]

const isTypeOpen = ref(false)
const selectedType = ref('All Types')

const typeOptions = [
  'All Types',
  'Bug',
  'Feature Suggestion',
  'Implementation Feedback',
  'Client Review',
  'Query'
]
</script>
