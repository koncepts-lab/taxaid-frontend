<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Review Manager" userId="Welcome, Akhil" :showChangeProfile="false" />

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
            <input type="text" 
                   placeholder="Search by consultant name or consultant Id..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
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
            <input type="text" 
                   placeholder="Search by client id, client name or consultant name..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
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
                      @click="activeSyncStatus = status; showSyncStatusDropdown = false"
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
            <input type="text" 
                   placeholder="Search by consultant name or consultant Id..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
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
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.id }}</td>
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
            <input type="text" 
                   placeholder="Search by consultant name or consultant Id..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
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
                  <button @click="navigateTo('/review-manager/consultant-workload-details')" 
                          class="px-4 py-2 rounded-[8px] bg-[#82FFE0] text-[#0A0A0A] text-[13px] font-medium hover:bg-[#6eddc5] transition-colors cursor-pointer"
                          :class="isDark ? 'bg-[#1b5e50] text-white' : ''">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
            <input type="text" 
                   placeholder="Search by client name or client Id..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client ID</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Implementation Completed Date</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Mobile Number</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Email</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">List of Consultant</th>
                <th class="py-4 px-8 font-normal text-[15px]">Action</th>
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
                       class="w-[200px] h-[40px] px-4 rounded-[8px] border border-[#0000001A] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-[#F3F4F6] text-[#6B7280]'">
                    <span class="text-[13px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {{ item.selectedConsultant || 'Select Consultant' }}
                    </span>
                    <img src="/images/icons/down-select.svg" class="w-3.5 h-3.5 opacity-40" :class="isDark ? 'invert' : ''" alt="arrow" />
                  </div>

                  <!-- Dropdown Menu -->
                  <div v-if="activeConsultantDropdown === idx" 
                       class="absolute top-[80%] left-8 right-8 mt-2 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 p-2 z-30 flex flex-col gap-1 min-w-[220px]">
                    <button v-for="c in consultantList" 
                            :key="c.name"
                            @click="selectConsultant(idx, c.name)"
                            class="text-left px-4 py-3 rounded-[10px] text-[14px] transition-colors cursor-pointer group"
                            :class="item.selectedConsultant === c.name ? 'bg-[#E6FFF3] text-[#1a1a1a]' : 'text-[#1a1a1a] hover:bg-[#E6FFF3]'">
                      {{ c.name }} <span class="text-[12px] opacity-60 ml-1">({{ c.activeCount }} active)</span>
                    </button>
                  </div>
                </td>
                <td class="py-6 px-8">
                  <button class="px-6 py-2 rounded-[8px] bg-[#04C18F] text-white text-[13px] font-medium hover:bg-[#03a87c] transition-colors cursor-pointer shadow-sm">
                    Assign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Main Section: Client review analysis progress -->
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
            <input type="text" 
                   placeholder="Search by Client name or client id..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
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
      </div>
    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useReviewManagerDashboardPage } from '@/composables/useWebsiteData'

const { isDark } = useTheme()

const route = useRoute()
const {
  productivityMetrics,
  tabs,
  consultants,
  syncData,
  clientFixedProgressData,
  consultantWorkloadData,
  assignConsultantData: initialAssignConsultantData,
  clientReviewAnalysisData,
  consultantList
} = useReviewManagerDashboardPage()

const activeTab = ref(route.query.tab || 'Productivity tracker')
const assignConsultantData = ref([])

watchEffect(() => {
  if (initialAssignConsultantData.value?.length) {
    assignConsultantData.value = initialAssignConsultantData.value.map((item) => ({ ...item }))
  }
})

watchEffect(() => {
  if (!route.query.tab && tabs.value.length && !tabs.value.includes(activeTab.value)) {
    activeTab.value = tabs.value[0]
  }
})

const consultantsList = computed(() => consultants.value)

const activeConsultantDropdown = ref(null)

function toggleConsultantDropdown(idx) {
  if (activeConsultantDropdown.value === idx) {
    activeConsultantDropdown.value = null
  } else {
    activeConsultantDropdown.value = idx
  }
}

function selectConsultant(idx, name) {
  if (assignConsultantData.value[idx]) {
    assignConsultantData.value[idx].selectedConsultant = name
  }
  activeConsultantDropdown.value = null
}

const showAppointmentTypeDropdown = ref(false)
const selectedAppointmentType = ref('All Appointment Type')

function getProgressColor(value, total) {
  const percentage = (value / total) * 100
  if (percentage >= 60) return 'bg-[#00896F]'
  if (percentage >= 40) return 'bg-[#FDC700]'
  return 'bg-[#C10007]'
}

const activeSyncStatus = ref('All Statuses')
const showSyncStatusDropdown = ref(false)

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
