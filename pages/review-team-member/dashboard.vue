<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Team Member Dashboard" userId="Welcome, Akhil" :showChangeProfile="true" :showManageAccess="true" changeProfileLink="/profile" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-4 space-y-6 overflow-y-auto">
      
      <!-- Top Navigation Tabs -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="flex items-center justify-between overflow-x-auto no-scrollbar rounded-[35px] p-[10px] border shadow-sm mb-8 max-w-max">
        <button v-for="tab in mainTabs" :key="tab"
                @click="navigateTab(tab)"
                class="px-8 py-2.5 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap font-medium"
                :class="activeMainTab === tab 
                  ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A]') 
                  : (isDark ? 'bg-transparent text-white/70' : 'bg-transparent text-[#0A0A0A]')">
          {{ tab }}
        </button>
      </div>

      <!-- Activity Tracking Section -->
      <div v-if="activeMainTab === 'Activity Tracking'" class="space-y-6">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h1 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Activity Tracking</h1>
            <p class="text-[14px] text-[#717182]" :class="isDark ? 'text-white/60' : ''">Track your daily work sessions, activities, and performance metrics</p>
          </div>
          <button @click="navigateToActivityLog" 
                  class="flex items-center gap-2 px-5 py-2 rounded-[10px] border border-[#04C18F4D] text-[14px] font-medium transition-all cursor-pointer text-[#0A0A0A] shadow-sm active:scale-[0.98]"
                  :class="isDark ? 'bg-white/5 text-white border-white/20 hover:bg-white/20' : 'bg-white hover:bg-gray-50'">
            <img src="/images/icons/calendar.svg" class="w-4 h-4 opacity-70" :class="isDark ? 'invert brightness-0' : ''" alt="calendar" />
            Activity Log History
          </button>
        </div>

        <!-- Metrics Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Card 1: Number of Active Clients -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[16px] p-6 border shadow-sm relative group min-h-[210px] flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <h5 class="text-[14px] font-normal opacity-50">Number of Active Clients</h5>
              <div class="w-6 h-6 flex items-center justify-center opacity-70">
                <img src="/images/icons/Number-Clients.svg" alt="clients" class="w-5 h-5 object-contain" />
              </div>
            </div>
            <div class="flex items-baseline mb-2">
              <span class="text-[40px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">0</span>
            </div>
          </div>

          <!-- Card 2: Average Productive Hours -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[16px] p-6 border shadow-sm relative group min-h-[210px] flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <h5 class="text-[14px] font-normal opacity-50">Average Productive Hours</h5>
              <div class="w-6 h-6 flex items-center justify-center opacity-70">
                <img src="/images/icons/Average-Hours.svg" alt="hours" class="w-5 h-5 object-contain opacity-80" />
              </div>
            </div>
            <div class="flex items-baseline mb-2">
              <span class="text-[40px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">0 hrs 0 min</span>
            </div>
          </div>

          <!-- Card 3: Work Session Timer -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[20px] p-6 border shadow-sm relative group min-h-[210px] flex flex-col justify-between">
            <div class="space-y-4">
              <h5 class="text-[14px] font-normal opacity-40">Work Session Timer</h5>
              
              <!-- Active Session Design (Matching Image) -->
              <template v-if="sessionActive">
                <div class="flex justify-between items-center">
                  <span class="text-[15px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Logged in at: 1:24:12 PM</span>
                  <div class="flex items-center gap-2">
                    <img src="/images/icons/Average-Hours.svg" class="w-5 h-5 opacity-60" :class="isDark ? 'invert' : ''" alt="clock" />
                    <span class="text-[15px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">0h 2m</span>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <span class="text-[14px] font-medium opacity-80">Logout:</span>
                  <button @click="toggleSession" 
                          class="flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-[#F5F7F9] text-[#717182] text-[14px] font-medium hover:bg-gray-100 transition-all cursor-pointer border border-transparent"
                          :class="isDark ? 'bg-white/5 text-white/50 hover:bg-white/10' : ''">
                    <img src="/images/icons/logout-icon.svg" class="w-4 h-4 opacity-40" :class="isDark ? 'invert' : ''" alt="end" />
                    End Session
                  </button>
                  <span class="text-[12px] opacity-50 font-regular">7h 58m until logout available</span>
                </div>

                <p class="text-[12px] opacity-40 font-regular pt-1">Logout becomes available only after 8 hours are logged</p>
              </template>

              <!-- Inactive State -->
              <template v-else>
                <div class="flex items-center gap-4 py-2">
                  <span class="text-[14px] font-medium opacity-80">Login:</span>
                  <button @click="toggleSession" 
                          class="flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#FB2C36] text-white text-[13px] font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm">
                    <img src="/images/icons/logout-icon.svg" class="w-4 h-4 invert brightness-0" alt="start" />
                    Start Session
                  </button>
                  <div class="flex items-center gap-2 opacity-30">
                    <img src="/images/icons/Average-Hours.svg" class="w-4 h-4" alt="not logged in" />
                    <span class="text-[13px]">Not logged in</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

        </div>

        <!-- Current Activity Section (Visible when session is active) -->
        <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="sessionActive" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#E6FAF5] border-[#04C18F1A]'" 
               class="rounded-[20px] p-8 border shadow-sm space-y-6">
            <h3 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Current Activity</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
              <!-- Time In -->
              <div class="space-y-3">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Time In</label>
                <div class="flex gap-2">
                  <input type="text" placeholder="--:-- --" class="flex-1 px-4 py-2.5 rounded-[10px] bg-white border-0 text-[14px] shadow-sm focus:ring-2 focus:ring-[#04C18F]" :class="isDark ? '!bg-white/5 text-white' : ''" />
                  <button class="w-11 h-11 flex items-center justify-center rounded-[10px] bg-[#005D4F] text-white hover:opacity-90 cursor-pointer">
                    <img src="/images/icons/Average-Hours.svg" class="w-5 h-5 invert" alt="clock" />
                  </button>
                </div>
              </div>

              <!-- Time Out -->
              <div class="space-y-3">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Time Out</label>
                <div class="flex gap-2">
                  <input type="text" placeholder="--:-- --" class="flex-1 px-4 py-2.5 rounded-[10px] bg-white border-0 text-[14px] shadow-sm focus:ring-2 focus:ring-[#04C18F]" :class="isDark ? '!bg-white/5 text-white' : ''" />
                  <button class="w-11 h-11 flex items-center justify-center rounded-[10px] bg-[#82B1A8] text-white hover:opacity-90 cursor-pointer">
                    <img src="/images/icons/Average-Hours.svg" class="w-5 h-5 invert" alt="clock" />
                  </button>
                </div>
              </div>

              <!-- Type of Appointment (Custom Dropdown) -->
              <div class="space-y-3 relative">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Type of Appointment</label>
                <div @click="toggleDropdown('type')" 
                     :class="isDark ? '!bg-white/5 text-white' : 'bg-white'"
                     class="w-full flex justify-between items-center px-4 py-2.5 rounded-[10px] text-[14px] shadow-sm cursor-pointer border-0 ring-0 h-[40px]">
                  <span :class="!selectedType ? 'opacity-40' : ''">{{ selectedType || 'Select Appointment Type' }}</span>
                  <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform duration-300" :class="[showTypeDropdown ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
                </div>
                
                <div v-if="showTypeDropdown" class="absolute z-[60] left-0 right-0 top-full mt-1.5 py-2 bg-white rounded-[12px] shadow-lg border-0 max-h-[250px] overflow-y-auto no-scrollbar" :class="isDark ? 'bg-[#1a2e2a] border-white/5 text-white' : ''">
                  <div v-for="option in typeOptions" :key="option"
                        @click="selectOption('type', option)"
                        class="px-5 py-2.5 text-[14px] cursor-pointer transition-colors"
                        :class="isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]'">
                    {{ option }}
                  </div>
                </div>
              </div>

              <!-- Client ID (Custom Dropdown) -->
              <div class="space-y-3 relative h-auto">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Client ID</label>
                <div @click="toggleDropdown('client')" 
                     :class="isDark ? '!bg-white/5 text-white' : 'bg-white'"
                     class="w-full flex justify-between items-center px-4 py-2.5 rounded-[10px] text-[14px] shadow-sm cursor-pointer border-0 ring-0 h-[40px]">
                  <span :class="!selectedClientId ? 'opacity-40' : ''">{{ selectedClientId || 'Select Client Id' }}</span>
                  <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform duration-300" :class="[showClientDropdown ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
                </div>

                <div v-if="showClientDropdown" class="absolute z-[60] left-0 right-0 top-full mt-1.5 py-2 bg-white rounded-[12px] shadow-lg border-0 max-h-[250px] overflow-y-auto no-scrollbar" :class="isDark ? 'bg-[#1a2e2a] border-white/5 text-white' : ''">
                  <div v-for="option in clientOptions" :key="option"
                        @click="selectOption('client', option)"
                        class="px-5 py-2.5 text-[14px] cursor-pointer transition-colors"
                        :class="isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]'">
                    {{ option }}
                  </div>
                </div>
              </div>

              <!-- Client Name -->
              <div class="space-y-3">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Client Name</label>
                <input type="text" placeholder="Enter Client Name" class="w-full px-4 py-2.5 rounded-[10px] bg-white border-0 text-[14px] shadow-sm focus:ring-2 focus:ring-[#04C18F]" :class="isDark ? '!bg-white/5 text-white' : ''" />
              </div>
            </div>
          </div>
        </transition>

        <!-- Daily Activity Tracker Card -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 space-y-8 min-h-[450px]">
          
          <h2 class="text-[20px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Daily Activity Tracker</h2>

          <!-- Table Wrapper -->
          <div class="space-y-4">
            <div class="overflow-hidden rounded-[8px] border" :class="isDark ? 'border-white/10' : 'border-[#E5E5E5]'">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-[#00896F] text-white">
                    <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Time In</th>
                    <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Time Out</th>
                    <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Type of Appointment</th>
                    <th class="py-4 px-6 font-normal text-[14px] border-r border-[#ffffff1A] whitespace-nowrap">Client Id</th>
                    <th class="py-4 px-6 font-normal text-[14px] whitespace-nowrap">Client Name</th>
                  </tr>
                </thead>
                <tbody :class="isDark ? 'bg-transparent' : 'bg-white'">
                  <template v-if="sessionActive">
                    <tr v-for="(activity, index) in activities" :key="index" :class="isDark ? 'border-b border-white/5' : 'border-b border-gray-100'">
                      <td class="py-4 px-6 text-[14px]">{{ activity.timeIn }}</td>
                      <td class="py-4 px-6 text-[14px]">{{ activity.timeOut }}</td>
                      <td class="py-4 px-6 text-[14px]">
                        <span class="px-3 py-1 rounded-full bg-gray-100 text-[#0A0A0A] text-[12px] font-medium" :class="isDark ? 'bg-white/10 text-white' : ''">
                          {{ activity.type }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-[14px]">{{ activity.clientId }}</td>
                      <td class="py-4 px-6 text-[14px]">{{ activity.clientName }}</td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="5" class="py-16 text-center text-[14px] opacity-40 font-regular">
                      No activities logged today. Start by logging in and adding Time In.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total Hours Summary Bar -->
            <div :class="isDark ? 'bg-[#1a2e2a] border-white/10' : 'bg-[#FDC70029] border-[#D08700]'" 
                 class="flex justify-between items-center px-6 py-3 rounded-[12px] border mt-10">
              <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Total hours spent today:</span>
              <span class="text-[24px] font-bold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ sessionActive ? '02:45:00 hrs' : '00:00:00 hrs' }}</span>
            </div>
          </div>
        </div>

        <!-- Monthly Summary Metrics Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          <!-- Card 1: Total Client Fixed Hours -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[16px] p-6 border shadow-sm relative group h-[160px] flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <h5 class="text-[14px] font-normal opacity-50" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Total Client Fixed Hours - This Month</h5>
              <div class="w-6 h-6 flex items-center justify-center opacity-70">
                <img :src="isDark ? '/images/icons/famicons_checkbox-outline-dark.svg' : '/images/icons/famicons_checkbox-outline.svg'" alt="fixed" class="w-5 h-5 object-contain" />
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex items-baseline">
                <span class="text-[32px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">8 hrs 36 min</span>
              </div>
              <p class="text-[12px] opacity-40 font-normal" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Compulsory meetings completed this month</p>
            </div>
          </div>

          <!-- Card 2: Total Client Request Hours -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[16px] p-6 border shadow-sm relative group h-[160px] flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <h5 class="text-[14px] font-normal opacity-50" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Total Client Request Hours - This Month</h5>
              <div class="w-6 h-6 flex items-center justify-center opacity-70">
                <img :src="isDark ? '/images/icons/fa7-regular_message-dark.svg' : '/images/icons/fa7-regular_message.svg'" alt="request" class="w-5 h-5 object-contain" />
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex items-baseline">
                <span class="text-[32px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">8 hrs 36 min</span>
              </div>
              <p class="text-[12px] opacity-40 font-normal" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Client-requested appointments this month</p>
            </div>
          </div>

          <!-- Card 3: Total Internal Hours -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[16px] p-6 border shadow-sm relative group h-[160px] flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <h5 class="text-[14px] font-normal opacity-50" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Total Internal Hours - This Month</h5>
              <div class="w-6 h-6 flex items-center justify-center opacity-70">
                <img :src="isDark ? '/images/icons/Icon-profile-dark.svg' : '/images/icons/Icon-profile.svg'" alt="internal" class="w-5 h-5 object-contain" />
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex items-baseline">
                <span class="text-[32px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">8 hrs 36 min</span>
              </div>
              <p class="text-[12px] opacity-40 font-normal" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Internal meetings and tasks this month</p>
            </div>
          </div>

        </div>

      </div>

      <!-- Client Management Section -->
      <div v-else-if="activeMainTab === 'Client Management'" class="space-y-6">

        <!-- Section Header -->
        <div class="space-y-1">
          <h1 class="text-[24px] font-semibold" :class="isDark ? 'text-[#10FFD4]' : 'text-[#004D40]'">Client Management</h1>
          <p class="text-[14px] text-[#717182]" :class="isDark ? 'text-white/60' : ''">Manage client appointment requests and review client summary</p>
        </div>

        <!-- Client Request Pool -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 space-y-5">
          <div>
            <h2 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Client Request Pool</h2>
            <p class="text-[13px] opacity-50 mt-0.5">Manage client appointment requests</p>
          </div>

          <!-- Search + Filter -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-[10px] shadow-sm"
                 :class="isDark ? 'bg-white/5' : 'bg-[#F5F7F9]'">
              <img src="/images/icons/search.svg" class="w-4 h-4 opacity-40" :class="isDark ? 'invert' : ''" alt="search" />
              <input v-model="requestSearch" type="text" placeholder="Search by Client name or client id..."
                     class="flex-1 bg-transparent border-none outline-none text-[14px]"
                     :class="isDark ? 'text-white placeholder-white/30' : 'text-[#0A0A0A] placeholder-[#0A0A0A]/40'" />
            </div>
            <button @click="requestSearch = ''"
                    class="w-10 h-10 flex items-center justify-center rounded-[10px] shadow-sm border cursor-pointer transition-all hover:opacity-80"
                    :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#F5F7F9] border-transparent'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="isDark ? 'text-white/50' : 'text-[#717182]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <!-- Status Filter Dropdown -->
            <div class="relative">
              <div @click="showRequestStatusDd = !showRequestStatusDd"
                   class="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-sm cursor-pointer text-[14px] border min-w-[160px] justify-between"
                   :class="isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-[#F5F7F9] border-transparent text-[#0A0A0A]'">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                  <span>{{ requestStatusFilter || 'All Statuses' }}</span>
                </div>
                <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform" :class="[showRequestStatusDd ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
              </div>
              <div v-if="showRequestStatusDd" class="absolute z-50 right-0 top-full mt-1.5 py-2 rounded-[12px] shadow-lg min-w-[160px]"
                   :class="isDark ? 'bg-[#1a2e2a] text-white' : 'bg-white text-[#0A0A0A]'">
                <div v-for="s in ['All Statuses', 'Pending', 'Rescheduled', 'Scheduled', 'Completed']" :key="s"
                     @click="requestStatusFilter = s === 'All Statuses' ? '' : s; showRequestStatusDd = false"
                     class="px-5 py-2.5 text-[14px] cursor-pointer"
                     :class="isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]'">{{ s }}</div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-hidden rounded-[8px] border" :class="isDark ? 'border-white/10' : 'border-[#E5E5E5]'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#00896F] text-white">
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client ID</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client Name</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Proposed Date &amp; Time</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Rescheduled Date &amp; Time</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Status</th>
                  <th class="py-4 px-6 font-normal text-[14px] whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-transparent' : 'bg-white'">
                <tr v-for="(req, i) in filteredRequestPool" :key="i"
                    class="transition-colors"
                    :class="isDark ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-100 hover:bg-gray-50'">
                  <td class="py-4 px-6 text-[14px]">{{ req.clientId }}</td>
                  <td class="py-4 px-6 text-[14px]">{{ req.clientName }}</td>
                  <td class="py-4 px-6 text-[14px]">{{ req.proposedDate }}</td>
                  <td class="py-4 px-6 text-[14px]" :class="req.rescheduledDate !== '-' ? 'text-[#FB2C36]' : 'opacity-40'">{{ req.rescheduledDate }}</td>
                  <td class="py-4 px-6">
                    <span class="px-3 py-1 rounded-full text-[12px] font-medium"
                          :class="{
                            'bg-[#FFF3CD] text-[#92400E]': req.status === 'Pending',
                            'bg-[#FFE4E6] text-[#9F1239]': req.status === 'Rescheduled',
                            'bg-[#DBEAFE] text-[#1E40AF]': req.status === 'Scheduled',
                            'bg-[#D1FAE5] text-[#065F46]': req.status === 'Completed',
                          }">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <!-- Eye icon -->
                      <button class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80"
                              :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <!-- Rescheduled / Pending: Reschedule + Confirm -->
                      <template v-if="req.status === 'Rescheduled' || req.status === 'Pending'">
                        <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-[13px] cursor-pointer transition-all hover:opacity-80"
                                :class="isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-gray-200 text-[#717182] hover:bg-gray-50'">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Reschedule
                        </button>
                        <button class="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] bg-[#00896F] text-white text-[13px] cursor-pointer transition-all hover:opacity-90">
                          Confirm
                        </button>
                      </template>
                      <!-- Scheduled: Mark as Completed -->
                      <template v-else-if="req.status === 'Scheduled'">
                        <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-[13px] cursor-pointer transition-all hover:opacity-80"
                                :class="isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-gray-200 text-[#717182] hover:bg-gray-50'">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Mark as Completed
                        </button>
                      </template>
                      <!-- Completed -->
                      <template v-else-if="req.status === 'Completed'">
                        <span class="flex items-center gap-1.5 text-[13px] font-semibold text-[#00896F]">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Appointment Completed
                        </span>
                      </template>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredRequestPool.length === 0">
                  <td colspan="6" class="py-16 text-center text-[14px] opacity-40">No records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Client Fixed Summary -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 space-y-5">
          <div>
            <h2 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Client Fixed Summary</h2>
            <p class="text-[13px] opacity-50 mt-0.5">Overview of all client fixed</p>
          </div>

          <!-- Search + Filter -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-[10px] shadow-sm"
                 :class="isDark ? 'bg-white/5' : 'bg-[#F5F7F9]'">
              <img src="/images/icons/search.svg" class="w-4 h-4 opacity-40" :class="isDark ? 'invert' : ''" alt="search" />
              <input v-model="summarySearch" type="text" placeholder="Search by Client name or client id..."
                     class="flex-1 bg-transparent border-none outline-none text-[14px]"
                     :class="isDark ? 'text-white placeholder-white/30' : 'text-[#0A0A0A] placeholder-[#0A0A0A]/40'" />
            </div>
            <button @click="summarySearch = ''"
                    class="w-10 h-10 flex items-center justify-center rounded-[10px] shadow-sm border cursor-pointer transition-all hover:opacity-80"
                    :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#F5F7F9] border-transparent'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="isDark ? 'text-white/50' : 'text-[#717182]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <!-- Status Filter -->
            <div class="relative">
              <div @click="showSummaryStatusDd = !showSummaryStatusDd"
                   class="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-sm cursor-pointer text-[14px] border min-w-[160px] justify-between"
                   :class="isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-[#F5F7F9] border-transparent text-[#0A0A0A]'">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                  <span>{{ summaryStatusFilter || 'All Statuses' }}</span>
                </div>
                <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform" :class="[showSummaryStatusDd ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
              </div>
              <div v-if="showSummaryStatusDd" class="absolute z-50 right-0 top-full mt-1.5 py-2 rounded-[12px] shadow-lg min-w-[160px]"
                   :class="isDark ? 'bg-[#1a2e2a] text-white' : 'bg-white text-[#0A0A0A]'">
                <div v-for="s in ['All Statuses', 'Ongoing', 'Planned', 'Completed']" :key="s"
                     @click="summaryStatusFilter = s === 'All Statuses' ? '' : s; showSummaryStatusDd = false"
                     class="px-5 py-2.5 text-[14px] cursor-pointer"
                     :class="isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]'">{{ s }}</div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-hidden rounded-[8px] border" :class="isDark ? 'border-white/10' : 'border-[#E5E5E5]'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#00896F] text-white">
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client ID</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client Name</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client Fixed Review</th>
                  <th class="py-4 px-6 font-normal text-[14px] whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-transparent' : 'bg-white'">
                <tr v-for="(s, i) in filteredClientSummary" :key="i"
                    class="transition-colors"
                    :class="isDark ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-100 hover:bg-gray-50'">
                  <td class="py-4 px-6 text-[14px]">{{ s.clientId }}</td>
                  <td class="py-4 px-6 text-[14px]">{{ s.clientName }}</td>
                  <td class="py-5 px-6">
                    <div class="space-y-1.5">
                      <p class="text-[13px]" :class="isDark ? 'text-white/70' : 'text-[#717182]'">
                        Review {{ s.reviewCurrent }}/{{ s.reviewTotal }} &nbsp;·&nbsp; Steps {{ s.stepsCurrent }}/{{ s.stepsTotal }}
                      </p>
                      <div class="flex items-center gap-3">
                        <div class="flex-1 h-2 rounded-full overflow-hidden" :class="isDark ? 'bg-white/10' : 'bg-[#E5E5E5]'">
                          <div class="h-full rounded-full transition-all duration-500"
                               :style="{ width: s.percent + '%' }"
                               :class="{
                                 'bg-[#3B82F6]': s.status === 'Ongoing',
                                 'bg-[#F59E0B]': s.status === 'Planned',
                                 'bg-[#00896F]': s.status === 'Completed',
                               }"></div>
                        </div>
                        <span class="text-[13px] font-medium w-10 text-right" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ s.percent }}%</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <span class="px-3 py-1 rounded-full text-[12px] font-medium"
                          :class="{
                            'bg-[#DBEAFE] text-[#1E40AF]': s.status === 'Ongoing',
                            'bg-[#FEF3C7] text-[#92400E]': s.status === 'Planned',
                            'bg-[#D1FAE5] text-[#065F46]': s.status === 'Completed',
                          }">{{ s.status }}</span>
                  </td>
                </tr>
                <tr v-if="filteredClientSummary.length === 0">
                  <td colspan="4" class="py-16 text-center text-[14px] opacity-40">No records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Masterlist Placeholder -->
      <div v-else class="min-h-[400px] flex items-center justify-center opacity-40 italic">
        {{ activeMainTab }} content coming soon...
      </div>

    </main>

    <!-- Footer -->
    <footer class="px-8 pb-6 flex justify-between text-[#999] text-[13px] mt-auto hidden md:flex">
      <div>Copyright Reserved @2025</div>
      <div>Last Sync: 19 Oct 2025, 10:45 AM IST</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

const activeMainTab = ref('Activity Tracking')
const mainTabs = [
  'Activity Tracking',
  'Client Management',
  'Masterlist'
]

const navigateTab = (tab) => {
  activeMainTab.value = tab
}

const navigateToActivityLog = () => {
  navigateTo('/review-team-member/activity-log')
}

const sessionActive = ref(false)
const activities = ref([
  { timeIn: '09:15 AM', timeOut: '11:00 AM', type: 'Consultation', clientId: 'C-092', clientName: 'Robert Fox' },
  { timeIn: '11:15 AM', timeOut: '12:45 PM', type: 'Client Review', clientId: 'C-104', clientName: 'Jane Cooper' }
])

const toggleSession = () => {
  sessionActive.value = !sessionActive.value
}

// Custom Dropdowns Logic
const showTypeDropdown = ref(false)
const showClientDropdown = ref(false)
const selectedType = ref('')
const selectedClientId = ref('')

const typeOptions = [
  'Client Fixed',
  'Client Request',
  'Internal',
  'Client Analysis',
  'Training'
]

const clientOptions = ['C001', 'C002', 'C003']

const toggleDropdown = (field) => {
  if (field === 'type') {
    showTypeDropdown.value = !showTypeDropdown.value
    showClientDropdown.value = false
  } else {
    showClientDropdown.value = !showClientDropdown.value
    showTypeDropdown.value = false
  }
}

const selectOption = (field, value) => {
  if (field === 'type') {
    selectedType.value = value
    showTypeDropdown.value = false
  } else {
    selectedClientId.value = value
    showClientDropdown.value = false
  }
}

// ── Client Management ──────────────────────────────────────────
const requestSearch = ref('')
const requestStatusFilter = ref('')
const showRequestStatusDd = ref(false)

const summarySearch = ref('')
const summaryStatusFilter = ref('')
const showSummaryStatusDd = ref(false)

const clientRequestPool = ref([
  { clientId: 'client-7', clientName: 'Logistics Express Inc.', proposedDate: '3/20/2026, 10:00 AM', rescheduledDate: '21/03/2026, 03:30 PM', status: 'Rescheduled' },
  { clientId: 'client-4', clientName: 'Food Services Group',   proposedDate: '3/20/2026, 10:00 AM', rescheduledDate: '-', status: 'Pending' },
  { clientId: 'client-4', clientName: 'Food Services Group',   proposedDate: '3/20/2026, 10:00 AM', rescheduledDate: '-', status: 'Scheduled' },
  { clientId: 'client-4', clientName: 'Food Services Group',   proposedDate: '3/20/2026, 10:00 AM', rescheduledDate: '-', status: 'Completed' },
])

const clientFixedSummary = ref([
  { clientId: 'client-7', clientName: 'Logistics Express Inc.', reviewCurrent: 2, reviewTotal: 3, stepsCurrent: 8,  stepsTotal: 14, percent: 57, status: 'Ongoing' },
  { clientId: 'client-4', clientName: 'Food Services Group',   reviewCurrent: 1, reviewTotal: 3, stepsCurrent: 1,  stepsTotal: 14, percent: 10, status: 'Planned' },
  { clientId: 'client-4', clientName: 'Food Services Group',   reviewCurrent: 3, reviewTotal: 3, stepsCurrent: 14, stepsTotal: 14, percent: 100, status: 'Completed' },
])

const filteredRequestPool = computed(() => {
  return clientRequestPool.value.filter(r => {
    const q = requestSearch.value.toLowerCase()
    const matchSearch = !q || r.clientId.toLowerCase().includes(q) || r.clientName.toLowerCase().includes(q)
    const matchStatus = !requestStatusFilter.value || r.status === requestStatusFilter.value
    return matchSearch && matchStatus
  })
})

const filteredClientSummary = computed(() => {
  return clientFixedSummary.value.filter(s => {
    const q = summarySearch.value.toLowerCase()
    const matchSearch = !q || s.clientId.toLowerCase().includes(q) || s.clientName.toLowerCase().includes(q)
    const matchStatus = !summaryStatusFilter.value || s.status === summaryStatusFilter.value
    return matchSearch && matchStatus
  })
})
</script>

<style scoped>
.dark-mode-bg {
  background: radial-gradient(circle at center, #015c4d 0%, #002e26 100%) !important;
}
.font-regular {
  font-weight: 400;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

