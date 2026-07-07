<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Review Manager" userId="Welcome, Akhil" :showChangeProfile="false" :adminLogout="true" logoutTo="/ad-aqnz-pro-auth-78z46" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto" style="margin-top: -18px;">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(metric, idx) in productivityMetrics" :key="idx" 
             :class="[isDark ? 'bg-[#00141080] border-white/10' : metric.bgClass + ' ' + metric.borderClass]"
             class="rounded-[16px] p-6 border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-6">
            <h5 class="text-[14px] font-medium opacity-70">{{ metric.title }}</h5>
            <div class="w-8 h-8 flex items-center justify-center">
              <img :src="metric.icon" :alt="metric.title" class="w-6 h-6 object-contain" />
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-[36px] font-semibold leading-tight" :class="isDark ? 'text-white' : metric.textClass">{{ metric.value }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="flex items-center justify-between overflow-x-auto no-scrollbar rounded-[35px] p-[10px] border shadow-sm">
        <button v-for="tab in tabs" :key="tab"
                @click="activeTab = tab"
                class="px-8 py-2.5 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap"
                :class="activeTab === tab 
                  ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] font-normal') 
                  : (isDark ? 'bg-transparent text-white/70' : 'bg-transparent text-[#0A0A0A] font-normal')">
          {{ tab }}
        </button>
      </div>

      <!-- Main Section: Productivity Tracker -->
      <div v-if="activeTab === 'Productivity tracker'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Productivity tracker</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Manage client appointment requests and review client summary</p>
          </div>
          <button @click="navigateToActivityLog" 
                  class="flex items-center gap-3 px-5 py-2.5 rounded-[12px] border border-[#04C18F] text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer text-[#0A0A0A]"
                  :class="isDark ? 'bg-white/5 text-white border-white/20 hover:bg-white/20' : 'bg-white'">
            <img src="/images/icons/calendar-black.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : 'brightness-0'" alt="calendar" />
            Consultant Activity Log History
          </button>
        </div>

        <!-- Search & Refresh -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" v-model="consultantsSearch"
                   @input="debounceSearch('consultants', () => { consultantsPage = 1; loadConsultants() })"
                   placeholder="Search by consultant name..."
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button @click="loadConsultants" class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', reloading ? 'animate-spin' : '']" alt="refresh" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant Name</th>
                <th class="py-4 px-8 font-normal text-[15px] text-left border-r border-[#ffffff1A]">Open request (Fixed)</th>
                <th class="py-4 px-8 font-normal text-[15px] text-left">Open request (Adhoc)</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-for="(consultant, idx) in consultantsList" :key="idx"
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ consultant.id }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ consultant.name }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ consultant.fixed }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ consultant.adhoc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="consultantsLast > 1" class="flex items-center justify-end gap-2 pt-2">
          <button @click="consultantsPage--; loadConsultants()" :disabled="consultantsPage <= 1" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">← Prev</button>
          <span class="text-[13px] opacity-60">{{ consultantsPage }} / {{ consultantsLast }}</span>
          <button @click="consultantsPage++; loadConsultants()" :disabled="consultantsPage >= consultantsLast" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">Next →</button>
        </div>
      </div>

      <!-- Main Section: Data Sync Status -->
      <div v-if="activeTab === 'Data Sync Status'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Data Sync Status</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Monitor client data sync health and identify out-of-sync records</p>
          </div>
        </div>

        <!-- Search, Refresh, Filter -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" v-model="syncSearch"
                   @input="debounceSearch('sync', () => { syncPage = 1; loadSync() })"
                   placeholder="Search by client name..."
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button @click="loadSync" class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', reloading ? 'animate-spin' : '']" alt="refresh" />
          </button>
          
          <div class="relative w-[220px]">
            <button @click="showSyncStatusDropdown = !showSyncStatusDropdown" 
                    class="w-full h-[48px] px-4 rounded-[10px] border border-[#04C18F] flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <span class="text-[14px] font-regular flex-1 text-center">{{ activeSyncStatus }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 transform transition-transform" :class="{ 'rotate-180': showSyncStatusDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showSyncStatusDropdown" 
                 class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-2 z-20 flex flex-col gap-1">
              <button v-for="status in ['All Statuses', 'Synced', 'Not Synced']"
                      :key="status"
                      @click="onSyncFilterChange(status)"
                      class="text-left px-4 py-2.5 rounded-[10px] text-[15px] transition-colors cursor-pointer"
                      :class="activeSyncStatus === status ? 'bg-[#E6FFF3] text-[#1a1a1a]' : 'text-[#1a1a1a] hover:bg-gray-50'">
                {{ status }}
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Last Sync Date</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Sync Status</th>
                <th class="py-4 px-8 font-normal text-[15px]">Responsible Consultant</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-for="(client, idx) in syncData" :key="idx" 
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ client.id }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ client.name }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">
                  <div class="flex items-center gap-2">
                    <span :class="client.status === 'Not Synced' ? 'text-[#C10007]' : ''">{{ client.date }}</span>
                    <span v-if="client.daysAgo" class="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C10007] text-[11px] font-medium border border-[#FFA6A6]">
                      {{ client.daysAgo }} days ago
                    </span>
                  </div>
                </td>
                <td class="py-6 px-8 text-[14px] font-regular">
                  <span :class="client.status === 'Synced' ? 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]' : 'bg-[#FEF2F2] text-[#C10007] border-[#FFA6A6]'"
                        class="px-3 py-1 rounded-full text-[12px] font-medium border">
                    {{ client.status }}
                  </span>
                </td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ client.consultant }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="syncLast > 1" class="flex items-center justify-end gap-2 pt-2">
          <button @click="syncPage--; loadSync()" :disabled="syncPage <= 1" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">← Prev</button>
          <span class="text-[13px] opacity-60">{{ syncPage }} / {{ syncLast }}</span>
          <button @click="syncPage++; loadSync()" :disabled="syncPage >= syncLast" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">Next →</button>
        </div>
      </div>

      <!-- Main Section: Client fixed progress -->
      <div v-if="activeTab === 'Client fixed progress'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Client fixed progress</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Review completion status per consultant and client</p>
          </div>
        </div>

        <!-- Search & Refresh -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" v-model="progressSearch"
                   @input="debounceSearch('progress', () => { progressPage = 1; loadProgress() })"
                   placeholder="Search by consultant or client name..."
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button @click="loadProgress" class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', reloading ? 'animate-spin' : '']" alt="refresh" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Progress Tracker</th>
                <th class="py-4 px-8 font-normal text-[15px]">Client Delay</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-for="(item, idx) in clientFixedProgressData" :key="idx"
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.consultant_id }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.consultantName }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.clientName }}</td>
                <td class="py-6 px-8 text-[14px] font-regular">
                  <div class="flex items-center gap-4">
                    <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden" :class="isDark ? 'bg-white/10' : ''">
                      <div class="h-full rounded-full transition-all duration-500"
                           :style="{ width: (item.progressValue / item.progressTotal * 100) + '%' }"
                           :class="getProgressColor(item.progressValue, item.progressTotal)"></div>
                    </div>
                    <span class="text-[13px] text-[#00000099]" :class="isDark ? 'text-white/60' : ''">{{ item.progressValue }}/{{ item.progressTotal }}</span>
                  </div>
                </td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.delay }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="progressLast > 1" class="flex items-center justify-end gap-2 pt-2">
          <button @click="progressPage--; loadProgress()" :disabled="progressPage <= 1" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">← Prev</button>
          <span class="text-[13px] opacity-60">{{ progressPage }} / {{ progressLast }}</span>
          <button @click="progressPage++; loadProgress()" :disabled="progressPage >= progressLast" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">Next →</button>
        </div>
      </div>

      <!-- Main Section: Consultant workload -->
      <div v-if="activeTab === 'Consultant workload'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Consultant workload</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Hours worked per consultant across all project types for the selected period</p>
          </div>
        </div>

        <!-- Search & Refresh -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" v-model="workloadSearch"
                   @input="debounceSearch('workload', () => { workloadPage = 1; loadWorkload() })"
                   placeholder="Search by consultant name..."
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button @click="loadWorkload" class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', reloading ? 'animate-spin' : '']" alt="refresh" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Average productive hours (1 month)</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Fixed</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Request</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Analysis</th>
                <th class="py-4 px-8 font-normal text-[15px]">View Status</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-for="(item, idx) in consultantWorkloadData" :key="idx"
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.id }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.name }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.avgHours }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.clientFixed }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.clientRequest }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.clientAnalysis }}</td>
                <td class="py-6 px-8">
                  <button @click="navigateTo(`/review-manager/consultant-workload-details?admin_id=${item.id}`)"
                          class="px-4 py-2 rounded-[8px] bg-[#82FFE0] text-[#0A0A0A] text-[13px] font-medium hover:bg-[#6eddc5] transition-colors cursor-pointer"
                          :class="isDark ? 'bg-[#1b5e50] text-white' : ''">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="workloadLast > 1" class="flex items-center justify-end gap-2 pt-2">
          <button @click="workloadPage--; loadWorkload()" :disabled="workloadPage <= 1" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">← Prev</button>
          <span class="text-[13px] opacity-60">{{ workloadPage }} / {{ workloadLast }}</span>
          <button @click="workloadPage++; loadWorkload()" :disabled="workloadPage >= workloadLast" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">Next →</button>
        </div>
      </div>

      <!-- Main Section: Assign Consultant -->
      <div v-if="activeTab === 'Assign Consultant'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">New Clients</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Assign consultants to new review projects</p>
          </div>
        </div>

        <!-- Search & Refresh -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" v-model="unassignedSearch"
                   @input="debounceSearch('unassigned', () => { unassignedPage = 1; loadUnassigned() })"
                   placeholder="Search by client name or email..."
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button @click="loadUnassigned" class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', reloading ? 'animate-spin' : '']" alt="refresh" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-visible rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] rounded-tl-[8px]">Client ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Implementation Completed Date</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Mobile Number</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Email</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">List of Consultant</th>
                <th class="py-4 px-8 font-normal text-[15px] rounded-tr-[8px]">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-for="(item, idx) in assignConsultantData" :key="idx" 
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.id }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.clientName }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.completedDate }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.mobile }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.email }}</td>
                <td class="py-6 px-8 relative">
                  <!-- Custom Dropdown Trigger -->
                  <div @click="toggleConsultantDropdown(idx)"
                       class="w-[220px] h-[44px] px-4 rounded-[8px] border border-[#0000001A] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-[#F3F4F6] text-[#6B7280]'">
                    <div class="flex flex-col overflow-hidden">
                      <span v-if="item.selectedConsultant" class="text-[13px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ item.selectedConsultant }}</span>
                      <span v-if="item.selectedConsultantRole" class="text-[11px] opacity-50 leading-tight">{{ item.selectedConsultantRole }}</span>
                      <span v-if="!item.selectedConsultant" class="text-[13px]">Select Consultant</span>
                    </div>
                    <img src="/images/icons/down-select.svg" class="w-3.5 h-3.5 opacity-40 flex-shrink-0" :class="isDark ? 'invert' : ''" alt="arrow" />
                  </div>

                  <!-- Dropdown Menu -->
                  <div v-if="activeConsultantDropdown === idx" 
                       class="absolute top-[80%] left-8 right-8 mt-2 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 p-2 z-30 flex flex-col gap-1 min-w-[220px]">
                    <button v-for="c in consultantList"
                            :key="c.id"
                            @click="selectConsultant(idx, c)"
                            class="text-left px-4 py-3 rounded-[10px] text-[14px] transition-colors cursor-pointer group"
                            :class="item.selectedConsultant === c.name ? 'bg-[#E6FFF3] text-[#1a1a1a]' : 'text-[#1a1a1a] hover:bg-[#E6FFF3]'">
                      <span class="font-medium">{{ c.name }}</span>
                      <span class="text-[12px] opacity-50 ml-1">{{ c.role }}</span>
                    </button>
                  </div>
                </td>
                <td class="py-6 px-8">
                  <button @click="doAssign(item)" :disabled="assigning || !item.selectedConsultantId"
                          class="px-6 py-2 rounded-[8px] bg-[#04C18F] text-white text-[13px] font-medium hover:bg-[#03a87c] transition-colors cursor-pointer shadow-sm disabled:opacity-50">
                    Assign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="unassignedLast > 1" class="flex items-center justify-end gap-2 pt-2">
          <button @click="unassignedPage--; loadUnassigned()" :disabled="unassignedPage <= 1" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">← Prev</button>
          <span class="text-[13px] opacity-60">{{ unassignedPage }} / {{ unassignedLast }}</span>
          <button @click="unassignedPage++; loadUnassigned()" :disabled="unassignedPage >= unassignedLast" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">Next →</button>
        </div>
      </div>

      <!-- Main Section: Client review analysis progress -->
      <!-- Consultant Requests (temp credential approvals) -->
      <div v-if="activeTab === 'Consultant Requests'">
        <AdminConsultantRequests team="review" :isDark="isDark" currentLang="en" />
      </div>

      <div v-if="activeTab === 'Client review analysis progress'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Client review analysis progress</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Review completion status per consultant and client</p>
          </div>
        </div>

        <!-- Search, Refresh, Filter -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" v-model="analysisSearch"
                   @input="debounceSearch('analysis', () => { analysisPage = 1; loadAnalysis() })"
                   placeholder="Search by consultant or client name..."
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button @click="loadAnalysis" class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', reloading ? 'animate-spin' : '']" alt="refresh" />
          </button>

          <div class="relative w-[280px]">
            <button @click="showAppointmentTypeDropdown = !showAppointmentTypeDropdown" 
                    class="w-full h-[48px] px-6 rounded-[10px] border border-[#04C18F33] flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
              <div class="flex items-center gap-3">
                <img src="/images/icons/filter.svg" class="w-4 h-4 opacity-40" :class="isDark ? 'invert' : ''" alt="filter" />
                <span class="text-[14px] font-regular">{{ selectedAppointmentType }}</span>
              </div>
              <img src="/images/icons/down-select.svg" class="w-3.5 h-3.5 opacity-40 transition-transform" :class="[{ 'rotate-180': showAppointmentTypeDropdown }, isDark ? 'invert' : '']" alt="arrow" />
            </button>

            <!-- Appointment Type Dropdown Menu -->
            <div v-if="showAppointmentTypeDropdown" 
                 class="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 p-2 z-30 flex flex-col gap-1">
              <button v-for="type in ['All Appointment Type', 'Client Review', 'Client Analysis']" 
                      :key="type"
                      @click="selectedAppointmentType = type; showAppointmentTypeDropdown = false"
                      class="text-left px-4 py-3 rounded-[10px] text-[14px] transition-colors cursor-pointer"
                      :class="selectedAppointmentType === type ? 'bg-[#E6FFF3] text-[#1a1a1a]' : 'text-[#1a1a1a] hover:bg-gray-50'">
                {{ type }}
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Consultant Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Appointment Type</th>
                <th class="py-4 px-8 font-normal text-[15px]">Client Delay</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-for="(item, idx) in clientReviewAnalysisData" :key="idx" 
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.id }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.consultantName }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.clientName }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.appointmentType }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.delay }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="analysisLast > 1" class="flex items-center justify-end gap-2 pt-2">
          <button @click="analysisPage--; loadAnalysis()" :disabled="analysisPage <= 1" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">← Prev</button>
          <span class="text-[13px] opacity-60">{{ analysisPage }} / {{ analysisLast }}</span>
          <button @click="analysisPage++; loadAnalysis()" :disabled="analysisPage >= analysisLast" class="px-3 py-1.5 rounded-[8px] border text-[13px] disabled:opacity-40 cursor-pointer" :class="isDark ? 'border-white/20 text-white' : 'border-gray-200 text-[#1a1a1a]'">Next →</button>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useReviewManager } from '@/composables/admin/review/useReviewManager'

const { isDark } = useTheme()
const route = useRoute()
const rm = useReviewManager()

const tabs = ['Productivity tracker', 'Data Sync Status', 'Client fixed progress', 'Consultant workload', 'Assign Consultant', 'Client review analysis progress', 'Consultant Requests']
const activeTab = ref(route.query.tab || 'Productivity tracker')

// -- data refs --
const consultantsList        = ref([])
const syncData               = ref([])
const clientFixedProgressData = ref([])
const consultantWorkloadData  = ref([])
const assignConsultantData    = ref([])
const consultantList          = ref([])
const clientReviewAnalysisData = ref([])

const productivityMetrics = computed(() => [
  { title: 'Total Consultants', value: consultantsList.value.length, bgClass: 'bg-white', borderClass: 'border-gray-100', textClass: 'text-[#004D40]', icon: '/images/icons/team.svg' },
  { title: 'Open Fixed', value: consultantsList.value.reduce((s, c) => s + (c.open_fixed || 0), 0), bgClass: 'bg-white', borderClass: 'border-gray-100', textClass: 'text-[#004D40]', icon: '/images/icons/calendar-black.svg' },
  { title: 'Open Adhoc', value: consultantsList.value.reduce((s, c) => s + (c.open_adhoc || 0), 0), bgClass: 'bg-white', borderClass: 'border-gray-100', textClass: 'text-[#004D40]', icon: '/images/icons/calendar-black.svg' },
  { title: 'Unassigned Clients', value: assignConsultantData.value.length, bgClass: 'bg-white', borderClass: 'border-gray-100', textClass: 'text-[#C10007]', icon: '/images/icons/team.svg' },
])

const reloading = ref(false)

// Per-tab search, page, lastPage state
const consultantsSearch  = ref(''); const consultantsPage  = ref(1); const consultantsLast  = ref(1)
const syncSearch         = ref(''); const syncPage         = ref(1); const syncLast         = ref(1)
const progressSearch     = ref(''); const progressPage     = ref(1); const progressLast     = ref(1)
const workloadSearch     = ref(''); const workloadPage     = ref(1); const workloadLast     = ref(1)
const unassignedSearch   = ref(''); const unassignedPage   = ref(1); const unassignedLast   = ref(1)
const analysisSearch     = ref(''); const analysisPage     = ref(1); const analysisLast     = ref(1)

const searchTimers = {}
function debounceSearch(key, fn) {
  clearTimeout(searchTimers[key])
  searchTimers[key] = setTimeout(fn, 400)
}

async function loadConsultants() {
  reloading.value = true
  const res = await rm.getConsultants(consultantsPage.value, consultantsSearch.value).catch(() => ({ data: [], meta: {} }))
  consultantsList.value = (res.data ?? []).map((c) => ({ ...c, fixed: c.open_fixed, adhoc: c.open_adhoc }))
  consultantList.value  = (res.data ?? []).map((c) => ({ ...c, activeCount: c.open_fixed + c.open_adhoc }))
  consultantsLast.value = res.meta?.last_page ?? 1
  reloading.value = false
}

async function loadSync() {
  reloading.value = true
  const res = await rm.getSyncStatus(syncPage.value, syncSearch.value, activeSyncStatus.value === 'All Statuses' ? '' : activeSyncStatus.value).catch(() => ({ data: [], meta: {} }))
  syncData.value = (res.data ?? []).map((c) => ({ ...c, name: c.client_name, date: c.last_sync_date, daysAgo: c.days_ago, status: c.sync_status, consultant: c.responsible_consultant }))
  syncLast.value = res.meta?.last_page ?? 1
  reloading.value = false
}

async function loadProgress() {
  reloading.value = true
  const res = await rm.getFixedProgress(progressPage.value, progressSearch.value).catch(() => ({ data: [], meta: {} }))
  clientFixedProgressData.value = (res.data ?? []).map((r) => ({ ...r, consultantName: r.consultant_name, clientName: r.client_name, progressValue: r.progress_value, progressTotal: r.progress_total, delay: r.delay_days + ' days' }))
  progressLast.value = res.meta?.last_page ?? 1
  reloading.value = false
}

async function loadWorkload() {
  reloading.value = true
  const res = await rm.getTeamWorkload(workloadPage.value, workloadSearch.value).catch(() => ({ data: [], meta: {} }))
  consultantWorkloadData.value = (res.data ?? []).map((w) => ({ ...w, avgHours: w.avg_hours, clientFixed: w.fixed_hours, clientRequest: w.request_hours, clientAnalysis: w.analysis_hours }))
  workloadLast.value = res.meta?.last_page ?? 1
  reloading.value = false
}

async function loadUnassigned() {
  reloading.value = true
  const res = await rm.getUnassignedClients(unassignedPage.value, unassignedSearch.value).catch(() => ({ data: [], meta: {} }))
  assignConsultantData.value = (res.data ?? []).map((c) => ({ ...c, clientName: c.client_name, completedDate: '—', mobile: c.phone ?? '—', selectedConsultant: null, selectedConsultantId: null, selectedConsultantRole: null }))
  unassignedLast.value = res.meta?.last_page ?? 1
  reloading.value = false
}

async function loadAnalysis() {
  reloading.value = true
  const res = await rm.getFixedProgress(analysisPage.value, analysisSearch.value).catch(() => ({ data: [], meta: {} }))
  clientReviewAnalysisData.value = (res.data ?? []).map((r) => ({ ...r, id: r.consultant_id, consultantName: r.consultant_name, clientName: r.client_name, appointmentType: 'Client Review', delay: (r.delay_days ?? 0) + ' days' }))
  analysisLast.value = res.meta?.last_page ?? 1
  reloading.value = false
}

async function loadData() {
  await Promise.all([loadConsultants(), loadSync(), loadProgress(), loadWorkload(), loadUnassigned(), loadAnalysis()])
}

onMounted(() => { loadData() })

// Assign consultant
const activeConsultantDropdown = ref(null)
const assigning = ref(false)

function toggleConsultantDropdown(idx) {
  activeConsultantDropdown.value = activeConsultantDropdown.value === idx ? null : idx
}

function selectConsultant(idx, consultant) {
  if (assignConsultantData.value[idx]) {
    assignConsultantData.value[idx].selectedConsultant     = consultant.name
    assignConsultantData.value[idx].selectedConsultantId   = consultant.id
    assignConsultantData.value[idx].selectedConsultantRole = consultant.role
  }
  activeConsultantDropdown.value = null
}

async function doAssign(item) {
  if (!item.selectedConsultantId) return
  assigning.value = true
  try {
    const dept = consultantList.value.find(c => c.id === item.selectedConsultantId)
    await rm.assignConsultant(item.id, item.selectedConsultantId, dept?.department_id ?? 1)
    unassignedPage.value = 1
    await loadUnassigned()
  } finally {
    assigning.value = false
  }
}

// Filters
const showAppointmentTypeDropdown = ref(false)
const selectedAppointmentType     = ref('All Appointment Type')
const activeSyncStatus            = ref('All Statuses')
const showSyncStatusDropdown      = ref(false)

function onSyncFilterChange(status) {
  activeSyncStatus.value = status
  showSyncStatusDropdown.value = false
  syncPage.value = 1
  loadSync()
}

function getProgressColor(value, total) {
  const pct = (value / total) * 100
  if (pct >= 60) return 'bg-[#00896F]'
  if (pct >= 40) return 'bg-[#FDC700]'
  return 'bg-[#C10007]'
}

function navigateToActivityLog() {
  navigateTo('/review-manager/activity-log')
}
</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
