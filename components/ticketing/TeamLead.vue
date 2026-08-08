<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tickets -->
      <div class="border border-[#04C18FCC] rounded-xl p-5 bg-white relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Total Tickets</div>
        <div class="text-3xl font-semibold text-[#000]">{{ dashboard.total_tickets ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#00BE8C]">
           <img src="/images/icons/Total-Tickets.svg" class="w-6 h-6" alt="Total Tickets" />
        </div>
      </div>

      <!-- Need Review -->
      <div class="border border-[#81B8FF] rounded-xl p-5 bg-[#EFF6FF] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Need Review</div>
        <div class="text-3xl font-semibold text-[#1D4ED8]">{{ dashboard.needs_review ?? 0 }}</div>
        <div class="absolute top-5 right-5 text-[#2563EB]">
          <img src="/images/icons/review.svg" class="w-6 h-6" alt="Review" />
        </div>
      </div>

      <!-- Overdue -->
      <div class="border border-[#FCA5A5] rounded-xl p-5 bg-[#FEF2F2] relative shadow-sm">
        <div class="text-[#00000080] text-sm mb-2 font-normal">Overdue</div>
        <div class="text-3xl font-semibold text-[#DC2626]">{{ dashboard.overdue ?? 0 }}</div>
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
        <div class="text-3xl font-semibold text-[#15803D]">{{ dashboard.total_team_members ?? 0 }}</div>
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

    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-8 px-2">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key; fetchTickets(1)"
        :class="activeTab === tab.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold' : 'text-gray-700 font-medium hover:text-gray-900'"
        class="px-8 py-2 rounded-full transition-colors">
        {{ tab.label }}
      </button>
    </div>

    <!-- Search -->
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
                <td class="py-4 px-6 text-gray-800">{{ ticket.created_by }}</td>
                <td class="py-4 px-6">
                  <span v-if="ticket.score !== null && ticket.score !== undefined" class="inline-flex items-center gap-1 bg-[#FFEDD4] text-[#CA3500] px-2.5 py-1 rounded-full text-[13px] font-medium">
                    {{ ticket.score }}/10
                  </span>
                  <span v-else class="text-gray-400 font-medium">Not Scored</span>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ ticket.status }}</span>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openDecisionModal(ticket, 'view')" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button v-if="ticket.status === 'Submitted'" @click="openDecisionModal(ticket, 'review')" class="inline-flex items-center gap-1.5 bg-[#10B981] text-white rounded-md px-4 py-1.5 hover:bg-[#059669] font-medium transition-colors">
                      <img src="/images/icons/ok.svg" class="w-[14px] h-[14px]" alt="Review" />
                      Review
                    </button>
                  </div>
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

    <!-- My Team Members Section -->
    <div class="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm mt-8">
      <div class="p-6 pb-4 flex justify-between items-start">
        <div>
          <h2 class="text-xl font-medium text-gray-800">My Team Members</h2>
          <p class="text-gray-500 text-sm mt-1">Manage your department team</p>
        </div>
        <button @click="openAddMemberModal" class="inline-flex items-center gap-2 bg-[#008169] text-white rounded-[8px] px-5 py-2 hover:bg-[#006A56] font-medium transition-colors text-sm">
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
        <template v-if="loadingMembers">
          <div v-for="n in membersPerPage" :key="`sk-m-${n}`" class="border border-gray-200 rounded-[12px] p-4 h-[64px] animate-pulse">
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
        </template>
        <template v-else>
          <p v-if="!teamMembers.length" class="text-gray-400 text-sm py-4">No team members yet.</p>
          <div v-for="member in teamMembers" :key="member.id" class="border border-gray-200 rounded-[12px] p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
            <div>
              <div class="text-gray-900 font-medium">{{ member.full_name }}</div>
              <div class="text-gray-500 text-sm mt-0.5">{{ member.email }}</div>
            </div>
            <button @click="handleRemoveMember(member)" :disabled="removingId === member.id" class="text-[#EF4444] hover:text-[#DC2626] font-medium text-sm transition-colors disabled:opacity-50">
              {{ removingId === member.id ? 'Removing…' : 'Remove' }}
            </button>
          </div>
          <div v-for="n in memberFillerCount" :key="`fill-m-${n}`" class="h-[64px]" aria-hidden="true"></div>
        </template>
      </div>

      <CommonPaginationBar
        :meta="membersPageMeta"
        :loading="loadingMembers"
        @page-change="(p) => loadTeamMembers(p)"
        @per-page-change="(pp) => { membersPerPage = pp; loadTeamMembers(1) }"
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

    <TicketingDecisionModal
      :is-open="isDecisionModalOpen"
      :ticket="decisionTicket"
      :mode="decisionMode"
      role="team_lead"
      :submitting="reviewing"
      :error="reviewError"
      @close="isDecisionModalOpen = false"
      @submit="handleDecisionSubmit"
    />

    <!-- Add Team Member Modal -->
    <div v-if="isAddMemberModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-white rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[78vh]">
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
            <p class="text-gray-500 text-sm mt-1">Links an existing admin account to your team by email</p>
          </div>
          <button @click="isAddMemberModalOpen = false" :disabled="addingMember" class="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-8 pb-8 overflow-y-auto space-y-6">
          <p v-if="addMemberError" class="text-red-600 text-sm">{{ addMemberError }}</p>

          <p class="text-sm text-gray-600">Role: <span class="font-medium text-gray-900">{{ pairedRole || 'No assignable role' }}</span></p>

          <div v-if="!pairedRole" class="text-sm text-gray-500 border border-gray-200 rounded-[10px] p-4">
            You have no assignable team-member role — nobody can be added to your team.
          </div>
          <div v-else class="space-y-2 relative">
            <label class="text-[15px] font-medium text-gray-900 block">Search by name or email</label>
            <input v-model="candidateSearch" type="text" placeholder="Start typing a name or email…" class="w-full px-4 py-3 bg-white border border-[#04C18F80] rounded-[10px] outline-none focus:border-[#008169] text-gray-700 placeholder-gray-400 text-[15px]">
            <div v-if="candidates.length" class="w-full mt-1 bg-white border border-gray-100 rounded-[10px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-2 space-y-0.5 max-h-40 overflow-y-auto">
              <div v-for="c in candidates" :key="c.id" @click="selectCandidate(c)"
                   class="px-4 py-2.5 text-[14px] rounded-lg cursor-pointer hover:bg-gray-50 text-left">
                <div class="text-gray-900 font-medium">{{ c.full_name }}</div>
                <div class="text-gray-500 text-xs">{{ c.email }}</div>
              </div>
            </div>
            <p v-if="addMemberEmail" class="text-sm text-gray-500">Selected: {{ addMemberEmail }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 flex justify-end items-center gap-4 shrink-0">
          <button @click="isAddMemberModalOpen = false" :disabled="addingMember" class="px-6 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button @click="submitAddMember" :disabled="addingMember || !pairedRole || !addMemberEmail" class="px-6 py-2.5 bg-[#008169] hover:bg-[#006A56] text-white rounded-[10px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
            <svg v-if="addingMember" width="18" height="18" viewBox="0 0 24 24" fill="none" class="animate-spin">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-opacity="0.25"></circle>
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            {{ addingMember ? 'Adding…' : 'Add Member' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const {
  getTicketMeta, getTicket, getTeamLeadDashboard, getTeamLeadTickets, reviewAsTeamLead,
  getMyTeamMembers, addTeamMember, removeTeamMember, createTicket, searchTeamMemberCandidates,
} = useTicketing()

// Meta (types only needed here — statuses aren't filterable in this screen's tabs)
const types = ref([])
const typesForCreate = computed(() => types.value.filter(t => t.id !== 0))

async function loadMeta() {
  const meta = await getTicketMeta(['types'])
  types.value = meta.types ?? []
}

// Dashboard stats
const dashboard = ref({})
async function loadDashboard() {
  dashboard.value = await getTeamLeadDashboard()
}

// Tabs + table + pagination
const tabs = [
  { key: 'all', label: 'All Tickets' },
  { key: 'needs_review', label: 'Needs Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]
const activeTab = ref('all')
const searchTerm = ref('')
const tickets = ref([])
const loadingTickets = ref(false)
const perPage = ref(10)
const pageMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const fillerRowCount = computed(() => Math.max(0, perPage.value - Math.max(tickets.value.length, 1)))

async function fetchTickets(page = 1) {
  loadingTickets.value = true
  try {
    const params = { filter: activeTab.value, page, per_page: perPage.value }
    if (searchTerm.value) params.search = searchTerm.value
    const { items, meta } = await getTeamLeadTickets(params)
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

// Team members
const teamMembers = ref([])
const loadingMembers = ref(false)
const removingId = ref(null)
const membersPerPage = ref(10)
const membersPageMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const memberFillerCount = computed(() => Math.max(0, membersPerPage.value - Math.max(teamMembers.value.length, 1)))

async function loadTeamMembers(page = 1) {
  loadingMembers.value = true
  try {
    const { items, meta } = await getMyTeamMembers({ page, per_page: membersPerPage.value })
    teamMembers.value = items
    membersPageMeta.value = meta
  } finally {
    loadingMembers.value = false
  }
}

async function handleRemoveMember(member) {
  removingId.value = member.id
  try {
    await removeTeamMember(member.id)
    await Promise.all([loadTeamMembers(membersPageMeta.value.current_page), loadDashboard()])
  } finally {
    removingId.value = null
  }
}

onMounted(async () => {
  await Promise.all([loadMeta(), loadDashboard(), fetchTickets(1), loadTeamMembers()])
})

// Create ticket modal
const isCreateModalOpen = ref(false)
const isIssueTypeOpen = ref(false)
const fileInput = ref(null)
const creating = ref(false)
const createError = ref('')

const form = ref({ title: '', type_id: null, source_name: '', description: '', attachments: [] })

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
    await Promise.all([loadDashboard(), fetchTickets(1)])
  } catch (e) {
    createError.value = e?.data?.message || 'Failed to create ticket.'
  } finally {
    creating.value = false
  }
}

// Review/View modal — shared DecisionModal component
const isDecisionModalOpen = ref(false)
const decisionTicket = ref(null)
const decisionMode = ref('review')
const reviewing = ref(false)
const reviewError = ref('')

async function openDecisionModal(ticket, mode) {
  decisionMode.value = mode
  reviewError.value = ''
  isDecisionModalOpen.value = true
  decisionTicket.value = null
  if (ticket?.id) {
    decisionTicket.value = await getTicket(ticket.id)
  }
}

async function handleDecisionSubmit(payload) {
  if (!payload?.id) {
    reviewError.value = 'Missing ticket id.'
    return
  }
  reviewing.value = true
  reviewError.value = ''
  try {
    await reviewAsTeamLead(payload.id, {
      score: payload.score,
      decision: payload.status === 'approve' ? 'approved' : 'rejected',
      comments_justification: payload.comment,
    })
    isDecisionModalOpen.value = false
    await Promise.all([loadDashboard(), fetchTickets(pageMeta.value.current_page)])
  } catch (e) {
    reviewError.value = e?.data?.message || 'Failed to submit review.'
  } finally {
    reviewing.value = false
  }
}

// Add team member modal
const isAddMemberModalOpen = ref(false)
const addMemberEmail = ref('')
const addMemberError = ref('')
const addingMember = ref(false)

const candidateSearch = ref('')
const candidates = ref([])
const pairedRole = ref(null)
let candidateDebounce

let skipNextSearchWatch = false

watch(candidateSearch, (val) => {
  if (skipNextSearchWatch) {
    skipNextSearchWatch = false
    return
  }
  addMemberEmail.value = ''
  clearTimeout(candidateDebounce)
  candidateDebounce = setTimeout(() => loadCandidates(val), 350)
})

async function loadCandidates(search) {
  const res = await searchTeamMemberCandidates(search)
  pairedRole.value = res.role
  candidates.value = res.data
}

function selectCandidate(c) {
  addMemberEmail.value = c.email
  skipNextSearchWatch = true
  candidateSearch.value = `${c.full_name} (${c.email})`
  candidates.value = []
}

async function openAddMemberModal() {
  addMemberEmail.value = ''
  addMemberError.value = ''
  candidateSearch.value = ''
  candidates.value = []
  isAddMemberModalOpen.value = true
  await loadCandidates()
}

async function submitAddMember() {
  if (!addMemberEmail.value) {
    addMemberError.value = 'Email is required.'
    return
  }
  addingMember.value = true
  addMemberError.value = ''
  try {
    await addTeamMember(addMemberEmail.value)
    isAddMemberModalOpen.value = false
    await Promise.all([loadTeamMembers(), loadDashboard()])
  } catch (e) {
    addMemberError.value = e?.data?.message || 'Failed to add team member.'
  } finally {
    addingMember.value = false
  }
}
</script>
