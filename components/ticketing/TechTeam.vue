<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">4</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>
      
      <!-- Pending Review -->
      <div class="border border-[#FFE738] rounded-xl p-5 bg-[#FFFBE1] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Pending Review</div>
        <div class="text-3xl font-semibold text-[#A65F00]">2</div>
        <div class="absolute top-5 right-5 text-[#D97706]">
          <img src="/images/icons/Review-In-Progress.svg" class="w-6 h-6" alt="Review In Progress" />
        </div>
      </div>

      <!-- Need Scoring -->
      <div class="border border-[#81B8FF] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Need Scoring</div>
        <div class="text-3xl font-semibold text-[#1D4ED8]">3</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <img src="/images/icons/review.svg" class="w-6 h-6" alt="In Development" />
        </div>
      </div>

      <!-- Scored -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-[#FFFFFFBF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Scored</div>
        <div class="text-3xl font-semibold text-[#15803D]">3</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Completed.svg" class="w-6 h-6" alt="Completed" />
        </div>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
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
            <div class="text-[#A65F00] text-sm mt-1">Please review and assign priority scores to help managers make informed decisions.</div>
          </div>
        </div>
        <button class="text-[#D97706] hover:text-[#92400E] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
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
      
      <!-- Tickets Dropdown -->
      <div class="w-full md:w-[40%] lg:w-[30%] relative">
        <button @click="isTicketsOpen = !isTicketsOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedTickets }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isTicketsOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isTicketsOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="ticket in ticketsOptions" :key="ticket"
               @click="selectedTickets = ticket; isTicketsOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="ticket === selectedTickets ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ ticket }}
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Tickets for Technical Review</h2>
          <p class="text-gray-500 text-sm mt-1">Score technical feasibility, estimate costs</p>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-[#008169] text-white">
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Ticket ID</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[20%]">Title</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Type</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Lead Score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Tech score</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[10%]">Cost</th>
              <th class="py-3.5 px-6 font-medium text-sm w-[15%]">Status</th>
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
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6 text-gray-400 font-medium">Not Scored</td>
              <td class="py-4 px-6 text-gray-400">-</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#059669] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Team Lead Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="isScoreModalOpen = true" class="inline-flex items-center gap-1.5 bg-[#008169] text-white rounded-md px-4 py-1.5 hover:bg-[#006A56] ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  Score
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6 text-gray-400 font-medium">Not Scored</td>
              <td class="py-4 px-6 text-gray-400">-</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#059669] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Team Lead Approved</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="isScoreModalOpen = true" class="inline-flex items-center gap-1.5 bg-[#008169] text-white rounded-md px-4 py-1.5 hover:bg-[#006A56] ml-auto font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  Score
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
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  8/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  7/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#DBEAFE] text-[#193CB8] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Scored</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="isViewModalOpen = true" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 ml-auto transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </td>
            </tr>

            <!-- Row 4 -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-600 font-medium">TKT-002</td>
              <td class="py-4 px-6 text-gray-800">Add two-factor authentication</td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">Feature Suggestion</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  9/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1 bg-[#D0FAE5] text-[#007C65] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  8/10
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#DBEAFE] text-[#193CB8] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">5000</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#E0E7FF] text-[#4F46E5] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Scored</span>
              </td>
              <td class="py-4 px-6 text-right">
                <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 ml-auto transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Score Modal -->
    <div v-if="isScoreModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-8 py-6 flex items-start justify-between shrink-0">
          <div>
            <h2 class="text-[22px] font-semibold text-gray-900">Technical Feasibility & Cost Assessment</h2>
            <p class="text-gray-500 text-[15px] mt-1">Score technical aspects</p>
            <div class="mt-3">
              <span class="inline-flex border border-gray-200 bg-white rounded-md px-3 py-1 text-[13px] text-gray-800 font-medium shadow-sm">TKT-012</span>
            </div>
          </div>
          <button @click="isScoreModalOpen = false" class="text-gray-500 hover:text-gray-700 transition-colors mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-8 pb-8 overflow-y-auto space-y-6">
          <!-- Details Box -->
          <div class="border border-[#04C18F80] rounded-[16px] p-6 space-y-3">
            <div class="grid grid-cols-[160px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Client:</span>
              <span class="text-gray-700">ACME Corp</span>
            </div>
            <div class="grid grid-cols-[160px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Issue:</span>
              <span class="text-gray-700">Add dark mode feature</span>
            </div>
            <div class="grid grid-cols-[160px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Type:</span>
              <span class="text-gray-700">Feature Suggestion</span>
            </div>
            <div class="grid grid-cols-[160px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Description:</span>
              <span class="text-gray-700 leading-relaxed">Need to integrate stripe payment gateway for monthly/annual subscription payments.</span>
            </div>
            <div class="grid grid-cols-[160px_1fr] gap-x-4 items-center">
              <span class="text-gray-900 font-medium">Team Lead Priority:</span>
              <div>
                <span class="inline-flex items-center gap-1 bg-[#D1FAE5] text-[#059669] px-2.5 py-1 rounded-full text-[13px] font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                  9/10
                </span>
              </div>
            </div>
            <div class="grid grid-cols-[160px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Team Lead Comments:</span>
              <span class="text-gray-700 leading-relaxed">Critical for revenue generation. Multiple enterprise clients waiting for this feature.</span>
            </div>
            <div class="grid grid-cols-[160px_1fr] gap-x-4">
              <span class="text-gray-900 font-medium">Team Lead Reviewed on:</span>
              <span class="text-gray-700">10/30/2025 5:30:00 AM</span>
            </div>
          </div>

          <!-- Technical Feasibility Slider -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-[15px] font-medium text-gray-900">Technical Feasibility (1-10)</label>
              <span class="bg-[#FEF08A] text-[#A16207] px-3 py-1 rounded-md text-[13px] font-medium">Medium Priority</span>
            </div>
            
            <div class="flex items-center gap-6">
              <div class="text-[32px] font-normal text-gray-900 w-8 text-center">{{ techFeasibilityScore }}</div>
              
              <div class="flex-1 relative pb-6 pt-2">
                <input type="range" min="1" max="10" v-model="techFeasibilityScore" class="w-full h-3 bg-[#E0FDF4] rounded-full appearance-none cursor-pointer outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#008169] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm" :style="{ background: `linear-gradient(to right, #008169 0%, #008169 ${(techFeasibilityScore-1)/9 * 100}%, #E0FDF4 ${(techFeasibilityScore-1)/9 * 100}%, #E0FDF4 100%)` }">
                <div class="absolute bottom-0 left-0 right-0 flex justify-between text-[13px] text-gray-500 px-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>
              
              <div class="text-[15px] text-gray-500 w-10 text-right">/ 10</div>
            </div>
          </div>

          <!-- Estimated Cost -->
          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Estimated Cost ($) *</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 text-lg">$</span>
              <input type="number" placeholder="5000" class="w-full pl-8 pr-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
            </div>
            <p class="text-[13px] text-gray-500">Enter estimated development cost including resources and time</p>
          </div>

          <!-- Technical Comments -->
          <div class="space-y-2">
            <label class="text-[15px] font-medium text-gray-900 block">Technical Comments & Analysis *</label>
            <textarea placeholder="Add technical analysis: complexity, risks, dependencies." rows="4" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px] resize-none"></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 flex justify-end items-center gap-4 border-t border-gray-100 shrink-0">
          <button @click="isScoreModalOpen = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="isScoreModalOpen = false" class="px-6 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Submit Tech Score
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-8 py-6 flex items-center justify-between shrink-0">
          <h2 class="text-[20px] font-semibold text-gray-900">TKT-002</h2>
          <div class="flex items-center gap-3">
            <span class="inline-flex bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[13px] font-medium">Team Lead Reviewed</span>
            <button @click="isViewModalOpen = false" class="text-gray-500 hover:text-gray-700 transition-colors ml-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-8 pb-8 overflow-y-auto space-y-8">
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

          <!-- Activity & Comments -->
          <div class="space-y-4">
            <h3 class="text-[16px] font-semibold text-gray-900 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Activity & Comments
            </h3>
            
            <!-- Comment Card -->
            <div class="bg-[#F0FDF4] rounded-[12px] p-5">
              <div class="flex justify-between items-start mb-4">
                <span class="font-medium text-gray-900">Team Lead</span>
                <span class="text-[13px] text-gray-500">10/30/2025 5:30:00 AM</span>
              </div>
              <div class="flex items-center gap-2 mb-4">
                <span class="text-gray-900 font-medium">Team Lead Score:</span>
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

          <!-- Attachments -->
          <div class="space-y-4 border-t border-gray-100 pt-6">
            <h3 class="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
              Attachments
            </h3>
            <div class="text-gray-400 text-[14px]">
              No Attachments
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isTicketsOpen = ref(false)
const selectedTickets = ref('All Tickets')
const isScoreModalOpen = ref(false)
const techFeasibilityScore = ref(5)
const isViewModalOpen = ref(false)

const ticketsOptions = [
  'All Tickets',
  'Needs Scoring',
  'Scored'
]
</script>
