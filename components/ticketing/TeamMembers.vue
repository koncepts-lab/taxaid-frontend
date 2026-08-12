<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">{{ stats.total_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>

      <!-- Review In Progress -->
      <div class="border border-[#FFE738] rounded-xl p-5 bg-[#FFFBE1] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Review In Progress</div>
        <div class="text-3xl font-semibold text-[#A65F00]">{{ stats.review_in_progress ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#D97706]">
          <img src="/images/icons/Review-In-Progress.svg" class="w-6 h-6" alt="Review In Progress" />
        </div>
      </div>

      <!-- In Development -->
      <div class="border border-[#81B8FF] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">In Development</div>
        <div class="text-3xl font-semibold text-[#1447E6]">{{ stats.in_development_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <img src="/images/icons/review.svg" class="w-6 h-6" alt="In Development" />
        </div>
      </div>

      <!-- Completed -->
      <div class="border border-[#04C18F] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Completed</div>
        <div class="text-3xl font-semibold text-[#008236]">{{ stats.developed_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
          <img src="/images/icons/Completed.svg" class="w-6 h-6" alt="Completed" />
        </div>
      </div>
    </div>

    <!-- Alert Banners -->
    <div v-if="showReadyBanner || showCompletedBanner" class="space-y-3">
      <div v-if="showReadyBanner" class="bg-[#EFF6FF] border border-[#81B8FF] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#005B9F]">
            <img src="/images/icons/tickets-development.svg" class="w-5 h-5" alt="Tickets Development" />
          </div>
          <div>
            <div class="text-[#004254] font-medium">{{ stats.ready_for_development }} ticket{{ stats.ready_for_development === 1 ? '' : 's' }} ready for development.</div>
            <div class="text-[#007595] text-sm mt-1">Development can now begin based on the approved requirements.</div>
          </div>
        </div>
        <button @click="readyBannerDismissed = true" class="text-[#005B9F] hover:text-[#004275] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div v-if="showCompletedBanner" class="bg-[#F0FDF4] border border-[#04C18F80] rounded-lg p-4 flex justify-between items-start relative">
        <div class="flex gap-3">
          <div class="mt-0.5 text-[#166534]">
            <img src="/images/icons/Completed.svg" class="w-5 h-5" alt="Completed" />
          </div>
          <div>
            <div class="text-[#00441C] font-medium">{{ stats.developed_tickets }} ticket{{ stats.developed_tickets === 1 ? '' : 's' }} have been completed.</div>
            <div class="text-[#008235] text-sm mt-1">Development phase is closed.</div>
          </div>
        </div>
        <button @click="completedBannerDismissed = true" class="text-[#166534] hover:text-[#14532D] absolute top-4 right-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Create Button -->
    <div class="flex justify-end">
      <button @click="openCreateModal" class="bg-[#008169] hover:bg-[#006A56] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm text-sm">
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
        <input v-model="searchTerm" type="text" placeholder="Search tickets..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>

      <!-- Status Dropdown -->
      <div class="w-full md:w-[30%] relative">
        <button @click="isStatusOpen = !isStatusOpen" class="w-full relative flex items-center pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm transition-shadow">
          <span class="absolute left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span class="flex-1 text-center">{{ selectedStatus.name }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isStatusOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isStatusOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="status in statusOptions" :key="status.id"
               @click="selectedStatus = status; isStatusOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="status.id === selectedStatus.id ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ status.name }}
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
          <span class="flex-1 text-center">{{ selectedType.name }}</span>
          <span class="absolute right-3 flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isTypeOpen }">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div v-if="isTypeOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
          <div v-for="type in typeOptions" :key="type.id"
               @click="selectedType = type; isTypeOpen = false"
               class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer transition-colors text-left"
               :class="type.id === selectedType.id ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
            {{ type.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-4">
      <div class="p-6 pb-4 border-b border-gray-100">
        <h2 class="text-xl font-semibold text-gray-800">My Tickets</h2>
        <p class="text-gray-500 text-sm mt-1">Showing {{ tickets.length }} of {{ pageMeta.total }} tickets</p>
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
            <template v-if="loadingTickets">
              <tr v-for="n in perPage" :key="`sk-${n}`" class="border-b border-gray-100 animate-pulse">
                <td colspan="7" class="py-4 px-6"><div class="h-4 bg-gray-100 rounded"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr v-if="!tickets.length">
                <td colspan="7" class="py-8 px-6 text-center text-gray-400">No tickets found.</td>
              </tr>
              <tr v-for="ticket in tickets" :key="ticket.ticket_custom_id" class="border-b border-gray-100 hover:bg-gray-50/50 last:border-b-0">
                <td class="py-4 px-6 text-gray-600 font-medium">{{ ticket.ticket_custom_id }}</td>
                <td class="py-4 px-6 text-gray-800">{{ ticket.title }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex border border-gray-200 bg-white rounded-full px-3 py-1 text-[13px] text-gray-600">{{ ticket.type ?? '—' }}</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="ticket.score !== null && ticket.score !== undefined" class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    {{ ticket.score }}/10
                  </span>
                  <span v-else class="text-gray-400 font-medium">Pending</span>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#F3F4F6] text-[#4B5563] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ ticket.status }}</span>
                </td>
                <td class="py-4 px-6 text-gray-600">{{ ticket.created_at }}</td>
                <td class="py-4 px-6 text-right">
                  <button @click="openViewModal(ticket.ticket_custom_id)" class="inline-flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-700 ml-auto font-medium transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View
                  </button>
                </td>
              </tr>
              <tr v-for="n in fillerRowCount" :key="`fill-${n}`" class="border-b border-gray-100 last:border-b-0" aria-hidden="true">
                <td colspan="7" class="py-4 px-6">&nbsp;</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <CommonPaginationBar
        :meta="pageMeta"
        :loading="loadingTickets"
        @page-change="(p) => fetchTickets(p)"
        @per-page-change="(pp) => { perPage = pp; fetchTickets(1) }"
      />
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
          <p v-if="createError" class="text-red-600 text-sm">{{ createError }}</p>

          <!-- Issue Type -->
          <div class="relative">
            <button @click="isIssueTypeOpen = !isIssueTypeOpen" class="w-full relative flex items-center justify-between px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-[15px] shadow-sm transition-shadow" :class="form.type_id ? 'text-gray-900' : 'text-gray-500'">
              <span>{{ selectedIssueTypeName || 'Select Issue Type' }}</span>
              <span class="flex items-center pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': isIssueTypeOpen }">
                <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            <div v-if="isIssueTypeOpen" class="absolute z-[110] w-full mt-2 bg-white border border-gray-100 rounded-[10px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5">
              <div v-for="issue in typesForCreate" :key="issue.id"
                   @click="form.type_id = issue.id; isIssueTypeOpen = false"
                   class="px-4 py-2.5 text-[15px] rounded-lg cursor-pointer transition-colors text-left"
                   :class="issue.id === form.type_id ? 'bg-[#E0FDF4] text-gray-900' : 'text-gray-700 hover:bg-gray-50'">
                {{ issue.name }}
              </div>
            </div>
          </div>

          <!-- Client / Source Name -->
          <div>
            <input v-model="form.source_name" type="text" placeholder="Client / Source Name" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
          </div>

          <!-- Title -->
          <div>
            <input v-model="form.title" type="text" placeholder="Title" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
          </div>

          <!-- Detailed Description -->
          <div>
            <textarea v-model="form.description" placeholder="Detailed Description" rows="4" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px] resize-none"></textarea>
          </div>

          <!-- Upload Files -->
          <div>
            <input type="file" ref="fileInput" @change="onFilesSelected" class="hidden" multiple />
            <button @click="fileInput.click()" type="button" class="w-full py-3 flex items-center justify-center gap-2 border border-[#04C18F80] rounded-[10px] text-gray-500 hover:bg-gray-50 transition-colors text-[15px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {{ form.attachments.length ? `${form.attachments.length} file(s) selected` : 'Upload Files (Optional)' }}
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-6 flex items-center justify-center gap-4">
          <button @click="isCreateModalOpen = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="submitCreateTicket" :disabled="creating" class="px-6 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ creating ? 'Submitting…' : 'Submit Ticket' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Ticket Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[78vh]">
        <!-- Header -->
        <div class="px-4 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <h2 class="text-[18px] font-medium text-[#0A0A0A]">{{ viewTicket?.ticket_custom_id }}</h2>
          <div class="flex items-center gap-4">
            <span class="inline-flex bg-[#D0FAE5] text-[#007C65] rounded-full px-3 py-1 text-[13px] font-medium">{{ viewTicket?.status }}</span>
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
          <div v-if="loadingViewTicket" class="text-center text-gray-400 py-10">Loading…</div>
          <template v-else-if="viewTicket">
            <!-- Details Box -->
            <div class="border border-[#04C18F80] rounded-[16px] p-6 space-y-4">
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Client:</span>
                <span class="text-gray-700">{{ viewTicket.client_source_name ?? '—' }}</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Issue:</span>
                <span class="text-gray-700">{{ viewTicket.issue }}</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Type:</span>
                <span class="text-gray-700">{{ viewTicket.type }}</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Created by:</span>
                <span class="text-gray-700">{{ viewTicket.created_by }}</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Created on:</span>
                <span class="text-gray-700">{{ viewTicket.created_at }}</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Department:</span>
                <span class="text-gray-700">{{ viewTicket.department ?? '—' }}</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] gap-x-4">
                <span class="text-gray-900 font-medium">Description:</span>
                <span class="text-gray-700 leading-relaxed">{{ viewTicket.description ?? '—' }}</span>
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

              <p v-if="!viewTicket.team_lead_reviewed_on" class="text-gray-400 text-sm">No review activity yet.</p>

              <!-- Comment Card -->
              <div v-if="viewTicket.team_lead_reviewed_on" class="bg-[#F2FFF8] rounded-[16px] p-6 space-y-4">
                <div class="flex justify-between items-start">
                  <span class="text-gray-900 font-medium">Team Lead</span>
                  <span class="text-gray-400 text-sm">{{ viewTicket.team_lead_reviewed_on }}</span>
                </div>
                <div v-if="viewTicket.score !== null" class="flex items-center gap-2">
                  <span class="text-gray-900">Team Lead Score:</span>
                  <span class="inline-flex items-center gap-1 bg-[#D1FAE5] text-[#059669] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                    {{ viewTicket.score }}/10
                  </span>
                </div>
                <p v-if="viewTicket.comments_justification" class="text-gray-900 text-[15px] leading-relaxed">
                  {{ viewTicket.comments_justification }}
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
              <p v-if="!viewTicket.attachments?.length" class="text-gray-400 text-sm">No Attachments</p>
              <ul v-else class="space-y-1">
                <li v-for="att in viewTicket.attachments" :key="att.id" class="text-sm text-[#008169]">
                  <a :href="att.file_path" target="_blank" rel="noopener">{{ att.file_name }}</a>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { getTicketMeta, getMyTickets, getMyTicketStats, createTicket, getTicket } = useTicketing()

// Meta (statuses + types) — fetched once in a single call, not two
const statuses = ref([])
const types = ref([])

const statusOptions = computed(() => statuses.value)
const typeOptions = computed(() => types.value)
const typesForCreate = computed(() => types.value.filter(t => t.id !== 0))

const isStatusOpen = ref(false)
const selectedStatus = ref({ id: 0, name: 'All Statuses' })
const isTypeOpen = ref(false)
const selectedType = ref({ id: 0, name: 'All Types' })
const searchTerm = ref('')

// Stats
const stats = ref({})
const readyBannerDismissed = ref(false)
const completedBannerDismissed = ref(false)
const showReadyBanner = computed(() => !readyBannerDismissed.value && (stats.value.ready_for_development ?? 0) > 0)
const showCompletedBanner = computed(() => !completedBannerDismissed.value && (stats.value.developed_tickets ?? 0) > 0)

// Table + pagination
const tickets = ref([])
const loadingTickets = ref(false)
const perPage = ref(10)
const pageMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
// Pads the table body up to a fixed perPage row-count so real data never shrinks/grows
// the table height between page loads — the height stays constant once past loading.
const fillerRowCount = computed(() => Math.max(0, perPage.value - Math.max(tickets.value.length, 1)))

async function loadMeta() {
  const meta = await getTicketMeta()
  statuses.value = meta.statuses ?? []
  types.value = meta.types ?? []
}

async function loadStats() {
  stats.value = await getMyTicketStats()
}

async function fetchTickets(page = 1) {
  loadingTickets.value = true
  try {
    const params = { page, per_page: perPage.value }
    if (selectedStatus.value.id) params.status_id = selectedStatus.value.id
    if (selectedType.value.id) params.type_id = selectedType.value.id
    if (searchTerm.value) params.search = searchTerm.value

    const { items, meta } = await getMyTickets(params)
    tickets.value = items
    pageMeta.value = meta
  } finally {
    loadingTickets.value = false
  }
}

let searchDebounce
watch(searchTerm, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => fetchTickets(1), 350)
})
watch([selectedStatus, selectedType], () => fetchTickets(1))

onMounted(async () => {
  await Promise.all([loadMeta(), loadStats(), fetchTickets(1)])
})

// Create modal
const isCreateModalOpen = ref(false)
const isIssueTypeOpen = ref(false)
const fileInput = ref(null)
const creating = ref(false)
const createError = ref('')

const form = ref({
  title: '',
  type_id: null,
  source_name: '',
  description: '',
  attachments: [],
})

const selectedIssueTypeName = computed(() =>
  typesForCreate.value.find(t => t.id === form.value.type_id)?.name ?? ''
)

function openCreateModal() {
  form.value = { title: '', type_id: null, source_name: '', description: '', attachments: [] }
  createError.value = ''
  isCreateModalOpen.value = true
}

function onFilesSelected(e) {
  form.value.attachments = Array.from(e.target.files ?? [])
}

async function submitCreateTicket() {
  createError.value = ''

  if (!form.value.title || !form.value.type_id || !form.value.source_name) {
    createError.value = 'Title, issue type, and client/source name are required.'
    return
  }

  creating.value = true
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('type_id', form.value.type_id)
    fd.append('source_name', form.value.source_name)
    if (form.value.description) fd.append('description', form.value.description)
    form.value.attachments.forEach(f => fd.append('attachments[]', f))

    await createTicket(fd)
    isCreateModalOpen.value = false
    await Promise.all([loadStats(), fetchTickets(1)])
  } catch (e) {
    createError.value = e?.data?.message || 'Failed to create ticket.'
  } finally {
    creating.value = false
  }
}

// View modal
const isViewModalOpen = ref(false)
const viewTicket = ref(null)
const loadingViewTicket = ref(false)

async function openViewModal(ticketCustomId) {
  const ticket = tickets.value.find(t => t.ticket_custom_id === ticketCustomId)
  isViewModalOpen.value = true
  viewTicket.value = null
  loadingViewTicket.value = true
  try {
    if (ticket?.id) {
      viewTicket.value = await getTicket(ticket.id)
    }
  } finally {
    loadingViewTicket.value = false
  }
}
</script>
