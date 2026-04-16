<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <!-- HEADER -->
    <DashboardHeader
      userName="Team Member Dashboard"
      userId="Welcome, Akhil"
      :showChangeProfile="true"
      :showManageAccess="true"
      changeProfileLink="/profile"
    />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-4 space-y-6 overflow-y-auto">

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div v-for="(m, i) in metrics" :key="i"
             class="rounded-[16px] p-6 border shadow-sm"
             :class="[isDark ? 'bg-[#00141080] border-white/10' : m.bg + ' ' + m.border]">
          <div class="flex justify-between items-start mb-4">
            <p class="text-[14px] opacity-60">{{ m.label }}</p>
            <img :src="m.icon" class="w-6 h-6" :alt="m.label" />
          </div>
          <p class="text-[38px] font-semibold leading-none" :class="isDark ? 'text-white' : m.color">{{ m.value }}</p>
        </div>
      </div>

      <!-- Alert Banners -->
      <div v-if="showBlueBanner" class="flex items-start justify-between gap-4 rounded-[12px] bg-[#EAF4FC] px-6 py-4" style="border: 1px solid #81B8FF;" :class="isDark ? 'bg-blue-900/20' : ''">
        <div class="flex items-start gap-3">
          <img src="/images/icons/tickets-development.svg" class="w-5 h-5 mt-0.5 flex-shrink-0" :class="isDark ? 'invert' : ''" alt="info" />
          <div>
            <p class="text-[16px] font-medium text-[#004254]" :class="isDark ? 'text-white' : ''">2 tickets are ready for development.</p>
            <p class="text-[14px] text-[#007595]">Development can now begin based on the approved requirements.</p>
          </div>
        </div>
        <button @click="showBlueBanner = false" class="text-[#1a1a1a]/40 hover:text-[#1a1a1a] text-lg cursor-pointer flex-shrink-0" :class="isDark ? 'text-white/40 hover:text-white' : ''">✕</button>
      </div>

      <div v-if="showGreenBanner" class="flex items-start justify-between gap-4 rounded-[12px] border border-[#B9E8CE] bg-[#EAFAF1] px-6 py-4" :class="isDark ? 'bg-green-900/20 border-green-400/20' : ''">
        <div class="flex items-start gap-3">
          <img src="/images/icons/Completed.svg" class="w-5 h-5 mt-0.5 flex-shrink-0" :class="isDark ? 'invert' : ''" alt="success" />
          <div>
            <p class="text-[16px] font-medium text-[#00441C]" :class="isDark ? 'text-white' : ''">2 tickets have been completed.</p>
            <p class="text-[14px] text-[#008235]">Development phase is closed.</p>
          </div>
        </div>
        <button @click="showGreenBanner = false" class="text-[#1a1a1a]/40 hover:text-[#1a1a1a] text-lg cursor-pointer flex-shrink-0" :class="isDark ? 'text-white/40 hover:text-white' : ''">✕</button>
      </div>

      <!-- Create New Ticket Button -->
      <div class="flex justify-end">
        <button @click="showModal = true"
                class="flex items-center gap-2 px-6 py-3 bg-[#007C65] hover:bg-[#006552] text-white text-[15px] font-medium rounded-[10px] transition-colors cursor-pointer">
          <span class="text-[20px] leading-none">+</span>
          Create New Ticket
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div class="rounded-[14px] px-6 py-5 flex flex-col md:flex-row items-center gap-4"
           :style="isDark ? '' : 'background-color: #61FFD62E; border: 1px solid #00BE8CBD;'"
           :class="isDark ? 'bg-[#00141080] border border-white/10' : ''">
        <!-- Search -->
        <div class="relative flex-1 w-full">
          <img src="/images/icons/search.svg" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" :class="isDark ? 'invert' : ''" alt="search" />
          <input type="text" v-model="searchQuery" placeholder="Search tickets..."
                 class="w-full h-[44px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] text-[14px] transition-colors"
                 :class="isDark ? 'bg-black/20 border-white/10 text-white placeholder-white/30' : 'bg-white text-[#1a1a1a] placeholder-[#00000040]'" />
        </div>

        <!-- All Statuses Dropdown -->
        <div class="relative w-full md:w-[260px]">
          <button @click="showStatusDd = !showStatusDd"
                  class="w-full h-[44px] px-5 rounded-[10px] border border-[#04C18F33] flex items-center justify-between cursor-pointer transition-colors"
                  :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              <span class="text-[14px] flex-1 text-center">{{ activeStatus }}</span>
            </div>
            <svg class="w-4 h-4 opacity-40 transition-transform" :class="showStatusDd ? 'rotate-180' : ''" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-if="showStatusDd" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100 p-2 z-30 flex flex-col gap-0.5">
            <button v-for="s in statuses" :key="s"
                    @click="activeStatus = s; showStatusDd = false"
                    class="text-left px-4 py-2.5 rounded-[8px] text-[14px] transition-colors cursor-pointer"
                    :class="activeStatus === s ? 'bg-[#E6FFF3] text-[#1a1a1a] font-medium' : 'text-[#1a1a1a] hover:bg-gray-50'">
              {{ s }}
            </button>
          </div>
        </div>

        <!-- All Types Dropdown -->
        <div class="relative w-full md:w-[260px]">
          <button @click="showTypeDd = !showTypeDd"
                  class="w-full h-[44px] px-5 rounded-[10px] border border-[#04C18F33] flex items-center justify-between cursor-pointer transition-colors"
                  :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              <span class="text-[14px] flex-1 text-center">{{ activeType }}</span>
            </div>
            <svg class="w-4 h-4 opacity-40 transition-transform" :class="showTypeDd ? 'rotate-180' : ''" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-if="showTypeDd" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100 p-2 z-30 flex flex-col gap-0.5">
            <button v-for="t in types" :key="t"
                    @click="activeType = t; showTypeDd = false"
                    class="text-left px-4 py-2.5 rounded-[8px] text-[14px] transition-colors cursor-pointer"
                    :class="activeType === t ? 'bg-[#E6FFF3] text-[#1a1a1a] font-medium' : 'text-[#1a1a1a] hover:bg-gray-50'">
              {{ t }}
            </button>
          </div>
        </div>
      </div>

      <!-- My Tickets Table -->
      <div class="rounded-[20px] border overflow-hidden shadow-sm"
           :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'">
        <div class="px-8 pt-7 pb-3">
          <h3 class="text-[20px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">My Tickets</h3>
          <p class="text-[13px] opacity-50 mt-0.5">Showing {{ tickets.length }} of {{ tickets.length }} tickets</p>
        </div>

        <div class="px-8 pb-8">
          <div class="overflow-hidden rounded-[8px] border" :class="isDark ? 'border-white/10' : 'border-[#E5E5E5]'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#00896F] text-white">
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10">Ticket ID</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10">Title</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10">Type</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10">Score</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10">Status</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10">Created</th>
                  <th class="py-4 px-6 font-normal text-[14px]">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
                <tr v-for="(ticket, idx) in filteredTickets" :key="idx"
                    class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                  <td class="py-5 px-6 text-[13px]" :class="isDark ? 'text-white/80' : 'text-[#1a1a1a]'">{{ ticket.id }}</td>
                  <td class="py-5 px-6 text-[13px]" :class="isDark ? 'text-white/80' : 'text-[#1a1a1a]'">{{ ticket.title }}</td>
                  <td class="py-5 px-6 text-[13px]">
                    <span class="px-3 py-1 rounded-full text-[13px]" 
                          style="border: 1px solid #0000001A;"
                          :class="isDark ? 'text-white/70 border-white/10' : 'text-[#1a1a1a]/70'">
                      {{ ticket.type }}
                    </span>
                  </td>
                  <td class="py-5 px-6 text-[13px]">
                    <span v-if="ticket.score"
                          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
                          :style="ticket.scoreStyle">
                      <img :src="ticket.scoreIcon" class="w-3.5 h-3.5" alt="score" />
                      {{ ticket.score }}
                    </span>
                    <span v-else class="text-[13px] opacity-40">Pending</span>
                  </td>
                  <td class="py-5 px-6">
                    <span v-if="ticket.status"
                          class="px-3 py-1 rounded-full text-[12px] font-medium"
                          :class="statusClass(ticket.status)">{{ ticket.status }}</span>
                    <span v-else class="text-[13px] opacity-40">—</span>
                  </td>
                  <td class="py-5 px-6 text-[13px] opacity-60">{{ ticket.created }}</td>
                  <td class="py-5 px-6">
                    <button @click="selectedTicket = ticket; showViewModal = true"
                            class="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] border border-[#04C18F80] text-[13px] font-medium leading-none hover:border-[#00896F] hover:text-[#00896F] transition-colors cursor-pointer"
                            :class="isDark ? 'border-white/10 text-white/70' : 'text-[#1a1a1a]'">
                      <img src="/images/icons/View.svg" class="w-4 h-4 opacity-50" :class="isDark ? 'invert' : ''" alt="view" />
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="px-8 pb-6 flex justify-between text-[#999] text-[13px] mt-auto hidden md:flex">
      <div>Copyright Reserved @2025</div>
      <div>Last Sync: 19 Oct 2025, 10:45 AM IST</div>
    </footer>

    <!-- Create New Ticket Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showModal = false"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-[20px] shadow-2xl w-full max-w-[540px] mx-4 p-8 z-10">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-[20px] font-semibold text-[#1a1a1a]">Create New Ticket</h2>
            <button @click="showModal = false" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-[#1a1a1a]/50 hover:text-[#1a1a1a] text-xl">✕</button>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4">
            <!-- Issue Type Dropdown -->
            <div class="relative">
              <button @click="showIssueTypeDd = !showIssueTypeDd"
                      class="w-full h-[48px] px-4 rounded-[10px] border border-[#04C18F66] flex items-center justify-between cursor-pointer hover:border-[#00896F] transition-colors bg-white text-[#1a1a1a]">
                <span class="text-[14px]" :class="selectedIssueType ? 'text-[#1a1a1a]' : 'text-[#00000040]'">
                  {{ selectedIssueType || 'Select Issue Type' }}
                </span>
                <svg class="w-4 h-4 opacity-40 transition-transform" :class="showIssueTypeDd ? 'rotate-180' : ''" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div v-if="showIssueTypeDd" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-lg border border-gray-100 p-2 z-10 flex flex-col gap-0.5">
                <button v-for="t in issueTypes" :key="t"
                        @click="selectedIssueType = t; showIssueTypeDd = false"
                        class="text-left px-4 py-2.5 rounded-[8px] text-[14px] transition-colors cursor-pointer hover:bg-[#E6FFF3]"
                        :class="selectedIssueType === t ? 'bg-[#E6FFF3] font-medium' : 'text-[#1a1a1a]'">
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- Client / Source Name -->
            <input type="text" v-model="newTicket.client" placeholder="Client / Source Name"
                   class="w-full h-[48px] px-4 rounded-[10px] border border-[#04C18F66] outline-none focus:border-[#00896F] text-[14px] transition-colors placeholder-[#00000040]" />

            <!-- Title -->
            <input type="text" v-model="newTicket.title" placeholder="Title"
                   class="w-full h-[48px] px-4 rounded-[10px] border border-[#04C18F66] outline-none focus:border-[#00896F] text-[14px] transition-colors placeholder-[#00000040]" />

            <!-- Detailed Description -->
            <textarea v-model="newTicket.description" placeholder="Detailed Description" rows="4"
                      class="w-full px-4 py-3 rounded-[10px] border border-[#04C18F66] outline-none focus:border-[#00896F] text-[14px] transition-colors resize-none placeholder-[#00000040]"></textarea>

            <!-- Upload Files -->
            <label class="w-full h-[48px] flex items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#04C18F66] text-[14px] text-[#00000040] hover:border-[#00896F] hover:text-[#00896F] transition-colors cursor-pointer">
              <img src="/images/icons/upload.svg" class="w-4 h-4 opacity-50" alt="upload" />
              Upload Files (Optional)
              <input type="file" class="hidden" multiple />
            </label>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-4 mt-8">
            <button @click="showModal = false"
                    class="px-6 py-2.5 text-[14px] font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors cursor-pointer">
              Cancel
            </button>
            <button @click="submitTicket"
                    class="flex items-center gap-2 px-8 py-2.5 bg-[#007C65] hover:bg-[#006552] text-white text-[14px] font-medium rounded-[10px] transition-colors cursor-pointer">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- View Ticket Modal -->
    <Transition name="fade">
      <div v-if="showViewModal && selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showViewModal = false"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-[20px] shadow-2xl w-full max-w-[600px] max-h-[90vh] mx-4 overflow-y-auto z-10 p-8 flex flex-col gap-6">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1">
              <h2 class="text-[22px] font-semibold text-[#1a1a1a]">{{ selectedTicket.id }}</h2>
              <span class="px-4 py-1.5 rounded-full text-[12px] font-medium" :class="statusClass(selectedTicket.status)">
                {{ selectedTicket.status }}
              </span>
            </div>
            <button @click="showViewModal = false" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-[#1a1a1a]/50 hover:text-[#1a1a1a] text-xl">✕</button>
          </div>

          <!-- Ticket Info Card -->
          <div class="rounded-[15px] border border-[#04C18F4D] p-6 space-y-3 bg-white">
            <div class="grid grid-cols-[110px_1fr] gap-x-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Client:</span>
              <span class="text-[15px] text-[#00000080]">{{ selectedTicket.client }}</span>
            </div>
            <div class="grid grid-cols-[110px_1fr] gap-x-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Issue:</span>
              <span class="text-[15px] text-[#00000080]">{{ selectedTicket.title }}</span>
            </div>
            <div class="grid grid-cols-[110px_1fr] gap-x-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Type:</span>
              <span class="text-[15px] text-[#00000080]">{{ selectedTicket.type }}</span>
            </div>
            <div class="grid grid-cols-[110px_1fr] gap-x-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Created by:</span>
              <span class="text-[15px] text-[#00000080]">{{ selectedTicket.createdBy }}</span>
            </div>
            <div class="grid grid-cols-[110px_1fr] gap-x-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Created on:</span>
              <span class="text-[15px] text-[#00000080]">{{ selectedTicket.created }}</span>
            </div>
            <div class="grid grid-cols-[110px_1fr] gap-x-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Department:</span>
              <span class="text-[15px] text-[#00000080]">{{ selectedTicket.department }}</span>
            </div>
            <div class="flex flex-col gap-1.5 mt-2">
              <span class="text-[15px] font-medium text-[#1a1a1a]">Description:</span>
              <span class="text-[14px] text-[#00000080] leading-relaxed">{{ selectedTicket.description }}</span>
            </div>
          </div>

          <!-- Activity & Comments -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <img src="/images/icons/Consultant-Activity-Log-History.svg" class="w-5 h-5 opacity-70" alt="activity" />
              <h3 class="text-[16px] font-semibold text-[#1a1a1a]">Activity & Comments</h3>
            </div>

            <div v-if="selectedTicket.activity && selectedTicket.activity.length" class="space-y-3">
              <div v-for="(act, i) in selectedTicket.activity" :key="i"
                   class="rounded-[12px] bg-[#F1F9F6] p-5 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[15px] font-medium text-[#1a1a1a]">{{ act.role }}</span>
                  <span class="text-[13px] text-[#00000060]">{{ act.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[14px] font-medium text-[#1a1a1a]">{{ act.role }} Score:</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold" :style="act.scoreStyle">
                    <img :src="act.scoreIcon" class="w-3.5 h-3.5" alt="score" />
                    {{ act.score }}
                  </span>
                </div>
                <p class="text-[14px] text-[#1a1a1aCC] leading-relaxed">{{ act.comment }}</p>
              </div>
            </div>
            <p v-else class="text-[14px] text-[#00000040]">No activity or comments found.</p>
          </div>

          <!-- Attachments -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <img src="/images/icons/Attachment-icon.svg" class="w-5 h-5 opacity-70" alt="attachments" />
              <h3 class="text-[15px] font-semibold text-[#1a1a1a]">Attachments</h3>
            </div>
            <p class="text-[14px] text-[#00000040]">No Attachments</p>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

definePageMeta({ layout: false })

// --- State ---
const showBlueBanner = ref(true)
const showGreenBanner = ref(true)
const showModal = ref(false)
const showViewModal = ref(false)
const selectedTicket = ref(null)
const showStatusDd = ref(false)
const showTypeDd = ref(false)
const showIssueTypeDd = ref(false)
const searchQuery = ref('')
const activeStatus = ref('All Statuses')
const activeType = ref('All Types')
const selectedIssueType = ref('')

const newTicket = ref({ client: '', title: '', description: '' })

// --- Metrics ---
const metrics = [
  { label: 'Total Tickets',   value: 2, icon: '/images/icons/Total-Tickets.svg',   bg: 'bg-white',        border: 'border-[#E5E5E5]', color: 'text-[#1a1a1a]' },
  { label: 'Pending Review',  value: 2, icon: '/images/icons/Pending-Review.svg',  bg: 'bg-[#FFFBEB]',    border: 'border-[#FDE68A]', color: 'text-[#D97706]' },
  { label: 'In Progress',     value: 2, icon: '/images/icons/In-Progress.svg',     bg: 'bg-[#EFF6FF]',    border: 'border-[#BFDBFE]', color: 'text-[#3B82F6]' },
  { label: 'Completed',       value: 2, icon: '/images/icons/Completed.svg',       bg: 'bg-white',        border: 'border-[#E5E5E5]', color: 'text-[#1a1a1a]' }
]

// --- Dropdowns ---
const statuses = ['All Statuses', 'Submitted', 'Team Lead Approved', 'Tech Scored', 'VP Approved', 'Manager Approved', 'Admin Approved', 'In development', 'Developed', 'Flagged', 'Scrapped']
const types    = ['All Types', 'Bug', 'Feature Suggestion', 'Implementation Feedback', 'Client Review', 'Query']
const issueTypes = ['Implementation Feedback', 'Initial Usability', 'Feature Suggestion']

// --- Table Data ---
const tickets = ref([
  { 
    id: 'TKT-002', title: 'Add dark mode feature', type: 'Feature Suggestion', 
    score: null, scoreIcon: '', scoreStyle: '', status: 'Team Lead Reviewed', created: '11/3/2025',
    client: 'ACME Corp', createdBy: 'Mike Chen', department: 'Customer Support Team',
    description: 'Clients are requesting ability to export multiple reports at once instead of one-by-one downloads.',
    activity: [
      { role: 'Team Lead', time: '10/30/2025 5:30:00 AM', score: '8/10', scoreIcon: '/images/icons/green-Score.svg', scoreStyle: 'color: #007C65; background-color: #D0FAE5;', comment: 'Important security feature. Can use existing libraries. 4 weeks.' }
    ],
    attachments: []
  },
  { 
    id: 'TKT-002', title: 'Add two-factor authentication', type: 'Implementation Feedback', 
    score: '7/10', scoreIcon: '/images/icons/red-Score.svg', scoreStyle: 'color: #CA3500; background-color: #FFEDD4;', status: 'Tech Scored', created: '10/29/2025',
    client: 'Bloom Tech', createdBy: 'Sarah Doe', department: 'IT Department',
    description: 'Integrate 2FA using TOTP for better security.',
    activity: [],
    attachments: []
  },
  { 
    id: 'TKT-002', title: 'Add two-factor authentication', type: 'Bug', 
    score: null, scoreIcon: '', scoreStyle: '', status: 'Submitted', created: '10/29/2025',
    client: 'Taxaid Source', createdBy: 'John Smith', department: 'Finance Team',
    description: 'Login page crashes on submitting with empty password.',
    activity: [],
    attachments: []
  },
  { 
    id: 'TKT-002', title: 'Add two-factor authentication', type: 'Bug', 
    score: '9/10', scoreIcon: '/images/icons/green-Score.svg', scoreStyle: 'color: #007C65; background-color: #D0FAE5;', status: 'Developed', created: '10/29/2025',
    client: 'Enterprise Solutions', createdBy: 'Jane Doe', department: 'Dev Team',
    description: 'Two factor auth implementation for admin panel.',
    activity: [],
    attachments: []
  }
])

const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    const matchSearch = !searchQuery.value || t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = activeStatus.value === 'All Statuses' || t.status === activeStatus.value
    const matchType   = activeType.value === 'All Types'    || t.type === activeType.value
    return matchSearch && matchStatus && matchType
  })
})

function statusClass(status) {
  const map = {
    'Team Lead Reviewed': 'bg-[#D0FAE5] text-[#007C65]',
    'Tech Scored':        'bg-[#D4DEFF] text-[#3B5BBA]',
    'Submitted':          'bg-[#F3F4F6] text-[#535353]',
    'Developed':          'bg-[#A8F1E3] text-[#086150]',
  }
  return map[status] || 'bg-[#F3F4F6] text-[#535353]'
}

function submitTicket() {
  showModal.value = false
  newTicket.value = { client: '', title: '', description: '' }
  selectedIssueType.value = ''
}
</script>

<style scoped>
.dark-mode-bg { background-color: #000c0a; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
