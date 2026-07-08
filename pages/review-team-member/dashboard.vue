<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <WorkSessionGuardModal :show="showGuard" @dismiss="showGuard = false" />

    <!-- HEADER -->
    <DashboardHeader userName="Team Member Dashboard" userId="Welcome, Akhil" :showChangeProfile="false" :showManageAccess="false" changeProfileLink="/profile" :adminLogout="true" logoutTo="/ad-aqnz-pro-auth-78z46" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-4 space-y-6 overflow-y-auto">

      <!-- Top Navigation Tabs -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="flex items-center justify-between overflow-x-auto no-scrollbar rounded-[35px] p-[10px] border shadow-sm mb-8 max-w-max">
        <button v-for="tab in mainTabs" :key="tab"
                @click="navigateTab(tab)"
                class="min-w-[300px] py-2.5 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap font-medium text-center flex items-center justify-center px-4"
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
                <img :src="isDark ? '/images/icons/Number-Clients-white.svg' : '/images/icons/Number-Clients.svg'" alt="clients" class="w-5 h-5 object-contain" />
              </div>
            </div>
            <div class="flex items-baseline mb-2">
              <span class="text-[40px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ stats?.active_clients_count ?? 0 }}</span>
            </div>
          </div>

          <!-- Card 2: Average Productive Hours -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[16px] p-6 border shadow-sm relative group min-h-[210px] flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <h5 class="text-[14px] font-normal opacity-50">Average Productive Hours</h5>
              <div class="w-6 h-6 flex items-center justify-center opacity-70">
                <img :src="isDark ? '/images/icons/Average-Hours-light.svg' : '/images/icons/Average-Hours.svg'" alt="hours" class="w-5 h-5 object-contain opacity-80" />
              </div>
            </div>
            <div class="flex items-baseline mb-2">
              <span class="text-[40px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ stats?.avg_productive_hours ?? '0 hrs 0 min' }}</span>
            </div>
          </div>

          <!-- Card 3: Work Session Timer -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F33]'" class="rounded-[20px] p-6 border shadow-sm relative group min-h-[210px] flex flex-col justify-between">
            <div class="space-y-4">
              <h5 class="text-[14px] font-normal opacity-40">Work Session Timer</h5>

              <!-- Active Session -->
              <template v-if="sessionActive">
                <div class="flex justify-between items-center">
                  <span class="text-[15px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Logged in at: {{ sessionLoggedInAt }}</span>
                  <div class="flex items-center gap-2">
                    <img :src="isDark ? '/images/icons/Average-Hours-light.svg' : '/images/icons/Average-Hours.svg'" class="w-5 h-5 opacity-60" alt="clock" />
                    <span class="text-[15px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ sessionDurationDisplay }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <span class="text-[14px] font-medium opacity-80">Logout:</span>
                  <button @click="handleSessionToggle" :disabled="activityLoading"
                          class="flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-[#F5F7F9] text-[#717182] text-[14px] font-medium hover:bg-gray-100 transition-all cursor-pointer border border-transparent disabled:opacity-60"
                          :class="isDark ? 'bg-white/5 text-white/50 hover:bg-white/10' : ''">
                    <img src="/images/icons/logout-icon.svg" class="w-4 h-4 opacity-40" :class="isDark ? 'invert' : ''" alt="end" />
                    {{ activityLoading ? 'Loading...' : 'End Session' }}
                  </button>
                  <span class="text-[12px] opacity-50 font-regular">{{ untilLogoutDisplay }}</span>
                </div>

                <p class="text-[12px] opacity-40 font-regular pt-1">Logout becomes available only after 8 hours are logged</p>

                <!-- Running timers block clockout -->
                <div v-if="clockOutBlockedTimers.length" class="mt-2 rounded-[10px] border border-[#FB2C3640] bg-[#FFF1F2] px-4 py-3 space-y-1">
                  <p class="text-[13px] font-semibold text-[#FB2C36]">Stop running timers before ending session:</p>
                  <p v-for="t in clockOutBlockedTimers" :key="t.type" class="text-[12px] text-[#FB2C36]">
                    <template v-if="t.type === 'activity_timer'">
                      • Activity Timer ({{ t.appointment_type?.replace('_', ' ') }}) is still running
                    </template>
                    <template v-else-if="t.type === 'appointment_session'">
                      • Appointment session for {{ t.client_name }} ({{ t.appointment_type }}) is still running
                    </template>
                  </p>
                </div>
              </template>

              <!-- Inactive State -->
              <template v-else>
                <div class="flex items-center gap-4 py-2">
                  <span class="text-[14px] font-medium opacity-80">Login:</span>
                  <button @click="handleSessionToggle" :disabled="activityLoading"
                          class="flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#FB2C36] text-white text-[13px] font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm disabled:opacity-60">
                    <img src="/images/icons/logout-icon.svg" class="w-4 h-4 invert brightness-0" alt="start" />
                    {{ activityLoading ? 'Loading...' : 'Start Session' }}
                  </button>
                  <div class="flex items-center gap-2 opacity-30">
                    <img :src="isDark ? '/images/icons/Average-Hours-light.svg' : '/images/icons/Average-Hours.svg'" class="w-4 h-4" alt="not logged in" />
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
                  <div class="flex-1 px-4 py-2.5 rounded-[10px] bg-white border-0 text-[14px] shadow-sm flex items-center" :class="isDark ? '!bg-white/5 text-white' : ''">
                    <span :class="isDark ? '!text-white/40' : (timeInDisplay ? 'text-gray-800' : 'text-gray-400')">{{ timeInDisplay || '--:-- --' }}</span>
                  </div>
                  <button class="w-11 h-11 flex items-center justify-center rounded-[10px] bg-[#005D4F] text-white hover:opacity-90 cursor-pointer">
                    <img src="/images/icons/Average-Hours.svg" class="w-5 h-5 invert" alt="clock" />
                  </button>
                </div>
              </div>

              <!-- Time Out -->
              <div class="space-y-3">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Time Out</label>
                <div class="flex gap-2">
                  <div class="flex-1 px-4 py-2.5 rounded-[10px] bg-white border-0 text-[14px] shadow-sm flex items-center text-gray-400" :class="isDark ? '!bg-white/5 text-white/40' : ''">
                    —
                  </div>
                  <button class="w-11 h-11 flex items-center justify-center rounded-[10px] bg-[#82B1A8] text-white hover:opacity-90 cursor-pointer">
                    <img src="/images/icons/Average-Hours.svg" class="w-5 h-5 invert" alt="clock" />
                  </button>
                </div>
              </div>

              <!-- Type of Appointment (Custom Dropdown) -->
              <div class="space-y-3 relative">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Type of Appointment</label>
                <div @click="timerState === 'idle' && toggleDropdown('type')"
                     :class="[isDark ? '!bg-white/5 text-white' : 'bg-white', timerState !== 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer']"
                     class="w-full flex justify-between items-center px-4 py-2.5 rounded-[10px] text-[14px] shadow-sm border-0 ring-0 h-[40px]">
                  <span :class="!activityForm.appointment_type ? 'opacity-40' : ''">{{ selectedActivityType || 'Select Appointment Type' }}</span>
                  <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform duration-300" :class="[showTypeDropdown ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
                </div>

                <div v-if="showTypeDropdown" class="absolute z-[60] left-0 right-0 top-full mt-1.5 py-2 bg-white rounded-[12px] shadow-lg border-0 max-h-[250px] overflow-y-auto no-scrollbar" :class="isDark ? 'bg-[#1a2e2a] border-white/5 text-white' : ''">
                  <div v-for="option in activityTypeOptions" :key="option.value"
                        @click="selectActivityType(option.value)"
                        class="px-5 py-2.5 text-[14px] cursor-pointer transition-colors"
                        :class="isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]'">
                    {{ option.label }}
                  </div>
                </div>
              </div>

              <!-- Client ID (Custom Dropdown) -->
              <div class="space-y-3 relative h-auto">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Client ID</label>
                <template v-if="needsActivityClient">
                  <div @click="timerState === 'idle' && toggleDropdown('client')"
                       :class="[isDark ? '!bg-white/5 text-white' : 'bg-white', timerState !== 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer']"
                       class="w-full flex justify-between items-center px-4 py-2.5 rounded-[10px] text-[14px] shadow-sm border-0 ring-0 h-[40px]">
                    <span :class="!activityForm.tenant_id ? 'opacity-40' : ''">{{ activityForm.tenant_id ? `C${String(activityForm.tenant_id).padStart(3, '0')}` : 'Select Client Id' }}</span>
                    <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform duration-300" :class="[showClientDropdown ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
                  </div>
                  <div v-if="showClientDropdown" class="absolute z-[60] left-0 right-0 top-full mt-1.5 py-2 bg-white rounded-[12px] shadow-lg border-0 max-h-[250px] overflow-y-auto no-scrollbar" :class="isDark ? 'bg-[#1a2e2a] border-white/5 text-white' : ''">
                    <div v-for="c in clients" :key="c.id"
                          @click="selectActivityClient(c.id)"
                          class="px-5 py-2.5 text-[14px] cursor-pointer transition-colors"
                          :class="isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]'">
                      C{{ String(c.id).padStart(3, '0') }}
                    </div>
                  </div>
                </template>
                <div v-else class="w-full px-4 py-2.5 rounded-[10px] text-[14px] shadow-sm h-[40px] flex items-center opacity-40" :class="isDark ? 'bg-white/5 text-white' : 'bg-white'">N/A</div>
              </div>

              <!-- Client Name -->
              <div class="space-y-3">
                <label class="text-[14px] font-medium text-[#1a1a1a] opacity-80" :class="isDark ? 'text-white' : ''">Client Name</label>
                <input :value="activityClientName" readonly type="text" placeholder="Auto-filled"
                  class="w-full px-4 py-2.5 rounded-[10px] bg-white border-0 text-[14px] shadow-sm focus:ring-2 focus:ring-[#04C18F] cursor-default" :class="isDark ? '!bg-white/5 text-white placeholder-white/30' : ''" />
              </div>
            </div>

            <!-- Timer Controls Row -->
            <div class="flex items-center gap-4 pt-2">
              <div class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-[#00896F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-mono text-base font-medium" :class="timerState === 'running' ? (isDark ? 'text-[#10FFD4]' : 'text-[#004D40]') : 'opacity-40'">{{ formattedElapsed }}</span>
                <span v-if="timerState === 'paused'" class="text-xs text-amber-500 font-medium">Paused</span>
              </div>

              <template v-if="timerState === 'idle'">
                <button @click="startActivityTimer" :disabled="activityActionLoading || appointmentTimerRunning"
                        class="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[#00896F] text-white text-[13px] font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  {{ activityActionLoading ? 'Starting...' : 'Start' }}
                </button>
                <p v-if="appointmentTimerRunning" class="text-xs text-amber-500">An appointment session is currently running.</p>
              </template>

              <template v-if="timerState === 'running' || timerState === 'paused'">
                <button v-if="timerState === 'running'" @click="pauseActivityTimer" :disabled="activityActionLoading"
                        class="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm disabled:opacity-60">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  Pause
                </button>
                <button v-else @click="resumeActivityTimer" :disabled="activityActionLoading"
                        class="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[#00896F] text-white text-[13px] font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm disabled:opacity-60">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Resume
                </button>
                <button @click="stopActivityTimer" :disabled="activityActionLoading"
                        class="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[#FB2C36] text-white text-[13px] font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm disabled:opacity-60">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                  {{ activityActionLoading ? 'Saving...' : 'Stop & Save' }}
                </button>
              </template>

              <p v-if="activityError" class="text-xs text-red-500">{{ activityError }}</p>
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
                  <template v-if="sessionActive && todayLogs.length > 0">
                    <tr v-for="(activity, index) in todayLogs" :key="index" :class="isDark ? 'border-b border-white/5' : 'border-b border-gray-100'">
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

            <!-- Daily Logs Pagination -->
            <div v-if="todayLogsMeta && todayLogsMeta.total > 0" class="flex items-center justify-between pt-2">
              <span class="text-[13px] opacity-50">{{ todayLogsMeta.from }}–{{ todayLogsMeta.to }} of {{ todayLogsMeta.total }}</span>
              <div class="flex items-center gap-2">
                <button @click="fetchTodaySession(todayLogsMeta.current_page - 1)" :disabled="todayLogsMeta.current_page === 1"
                        class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                        :class="isDark ? 'border-white/10' : 'border-gray-200'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span class="text-[13px] px-2">{{ todayLogsMeta.current_page }} / {{ todayLogsMeta.last_page }}</span>
                <button @click="fetchTodaySession(todayLogsMeta.current_page + 1)" :disabled="todayLogsMeta.current_page === todayLogsMeta.last_page"
                        class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                        :class="isDark ? 'border-white/10' : 'border-gray-200'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <!-- Total Hours Summary Bar -->
            <div :class="isDark ? 'bg-[#1a2e2a] border-white/10' : 'bg-[#FDC70029] border-[#D08700]'"
                 class="flex justify-between items-center px-6 py-3 rounded-[12px] border mt-10">
              <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">Total hours spent today:</span>
              <span class="text-[24px] font-bold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ totalHoursDisplay }}</span>
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
                <span class="text-[32px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ monthlyStats?.fixed_formatted ?? '0 hrs 0 min' }}</span>
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
                <span class="text-[32px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ monthlyStats?.review_formatted ?? '0 hrs 0 min' }}</span>
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
                <span class="text-[32px] font-medium leading-tight" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ monthlyStats?.internal_formatted ?? '0 hrs 0 min' }}</span>
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
            <!-- Search Input -->
            <div class="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-[10px] border"
                 :class="isDark ? 'bg-white/5 border-white/20' : 'bg-white border-[#04C18F80]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" :class="isDark ? 'text-white/40' : 'text-[#04C18F]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
              <input v-model="requestSearch" type="text" placeholder="Search by Client name or client id..."
                     class="flex-1 bg-transparent border-none outline-none text-[14px]"
                     :class="isDark ? 'text-white placeholder-white/30' : 'text-[#0A0A0A] placeholder-[#0A0A0A]/40'" />
            </div>
            <!-- Refresh Button -->
            <button @click="requestSearch = ''; requestStatusFilter = ''; fetchAppointments(1)"
                    class="w-10 h-10 flex items-center justify-center rounded-[10px] border cursor-pointer transition-all hover:opacity-80"
                    :class="isDark ? 'bg-white/5 border-white/20' : 'bg-white border-[#04C18F]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="isDark ? 'text-white/50' : 'text-[#04C18F]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <!-- Status Filter Dropdown -->
            <div class="relative max-w-[300px]">
              <div @click="showRequestStatusDd = !showRequestStatusDd"
                   class="flex items-center gap-2 px-4 py-2.5 rounded-[10px] cursor-pointer text-[14px] border w-full max-w-[300px] justify-between"
                   :class="isDark ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-[#04C18F80] text-[#0A0A0A]'">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                  <span>{{ requestStatusFilter || 'All Statuses' }}</span>
                </div>
                <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform" :class="[showRequestStatusDd ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
              </div>
              <div v-if="showRequestStatusDd" class="absolute z-50 right-0 top-full mt-1.5 py-2 rounded-[12px] shadow-lg w-full max-w-[300px]"
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
                <tr v-for="(req, i) in filteredRequestPool" :key="req.id || i"
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
                      <button @click="openAppointmentModal(req)"
                              class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80"
                              :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <!-- Rescheduled / Pending: Reschedule + Confirm -->
                      <template v-if="req.status === 'Rescheduled' || req.status === 'Pending'">
                        <button @click="openRescheduleModal(req)"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-[13px] cursor-pointer transition-all hover:opacity-80"
                                :class="isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-gray-200 text-[#717182] hover:bg-gray-50'">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Reschedule
                        </button>
                        <button @click="confirmAppointment(req)"
                                class="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] bg-[#00896F] text-white text-[13px] cursor-pointer transition-all hover:opacity-90 active:scale-[0.98]">
                          Confirm
                        </button>
                      </template>
                      <!-- Scheduled: Session Timer -->
                      <template v-else-if="req.status === 'Scheduled'">
                        <SessionTimerRow
                          :appointment="req._raw"
                          :any-running="currentActivityRunning"
                          @start="startSession(req.id)"
                          @pause="pauseSession(req.id)"
                          @stop="stopSession(req.id)"
                          @complete="completeAppointment(req.id)"
                        />
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

          <!-- Pagination -->
          <div v-if="appointmentsMeta && appointmentsMeta.last_page > 1" class="flex items-center justify-between pt-2">
            <span class="text-[13px] opacity-50">{{ appointmentsMeta.from }}–{{ appointmentsMeta.to }} of {{ appointmentsMeta.total }}</span>
            <div class="flex items-center gap-2">
              <button @click="fetchAppointments(appointmentsMeta.current_page - 1)" :disabled="appointmentsMeta.current_page === 1"
                      class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                      :class="isDark ? 'border-white/10' : 'border-gray-200'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span class="text-[13px] px-2">{{ appointmentsMeta.current_page }} / {{ appointmentsMeta.last_page }}</span>
              <button @click="fetchAppointments(appointmentsMeta.current_page + 1)" :disabled="appointmentsMeta.current_page === appointmentsMeta.last_page"
                      class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                      :class="isDark ? 'border-white/10' : 'border-gray-200'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
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
            <!-- Search Input -->
            <div class="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-[10px] border"
                 :class="isDark ? 'bg-white/5 border-white/20' : 'bg-white border-[#04C18F80]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" :class="isDark ? 'text-white/40' : 'text-[#04C18F]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
              <input v-model="summarySearch" type="text" placeholder="Search by Client name or client id..."
                     class="flex-1 bg-transparent border-none outline-none text-[14px]"
                     :class="isDark ? 'text-white placeholder-white/30' : 'text-[#0A0A0A] placeholder-[#0A0A0A]/40'" />
            </div>
            <!-- Refresh Button -->
            <button @click="summarySearch = ''; summaryStatusFilter = ''; loadReviews(1)"
                    class="w-10 h-10 flex items-center justify-center rounded-[10px] border cursor-pointer transition-all hover:opacity-80"
                    :class="isDark ? 'bg-white/5 border-white/20' : 'bg-white border-[#04C18F]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="isDark ? 'text-white/50' : 'text-[#04C18F]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <!-- Status Filter -->
            <div class="relative max-w-[300px]">
              <div @click="showSummaryStatusDd = !showSummaryStatusDd"
                   class="flex items-center gap-2 px-4 py-2.5 rounded-[10px] cursor-pointer text-[14px] border w-full max-w-[300px] justify-between"
                   :class="isDark ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-[#04C18F80] text-[#0A0A0A]'">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                  <span>{{ summaryStatusFilter || 'All Statuses' }}</span>
                </div>
                <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform" :class="[showSummaryStatusDd ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
              </div>
              <div v-if="showSummaryStatusDd" class="absolute z-50 right-0 top-full mt-1.5 py-2 rounded-[12px] shadow-lg w-full max-w-[300px]"
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
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Status</th>
                  <th class="py-4 px-6 font-normal text-[14px] whitespace-nowrap text-right">Project Details</th>
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
                  <td class="py-4 px-6 text-right">
                    <NuxtLink :to="`/review-team-member/${s.tenantId}`"
                              class="flex items-center justify-end gap-1 text-[13px] font-medium transition-colors hover:opacity-80"
                              :class="isDark ? 'text-[#10FFD4]' : 'text-[#00896F]'">
                      Project Details
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </NuxtLink>
                  </td>
                </tr>
                <tr v-if="filteredClientSummary.length === 0">
                  <td colspan="5" class="py-16 text-center text-[14px] opacity-40">No records found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Client Fixed Summary Pagination -->
          <div v-if="reviewsMeta && reviewsMeta.total > 0" class="flex items-center justify-between pt-2">
            <span class="text-[13px] opacity-50">{{ reviewsMeta.from }}–{{ reviewsMeta.to }} of {{ reviewsMeta.total }}</span>
            <div class="flex items-center gap-2">
              <button @click="loadReviews(reviewsMeta.current_page - 1)" :disabled="reviewsMeta.current_page === 1"
                      class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                      :class="isDark ? 'border-white/10' : 'border-gray-200'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span class="text-[13px] px-2">{{ reviewsMeta.current_page }} / {{ reviewsMeta.last_page }}</span>
              <button @click="loadReviews(reviewsMeta.current_page + 1)" :disabled="reviewsMeta.current_page === reviewsMeta.last_page"
                      class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                      :class="isDark ? 'border-white/10' : 'border-gray-200'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Masterlist Section -->
      <div v-else-if="activeMainTab === 'Masterlist'" class="space-y-6">

        <!-- Section Header -->
        <div class="space-y-1">
          <h1 class="text-[24px] font-semibold" :class="isDark ? 'text-[#10FFD4]' : 'text-[#004D40]'">Masterlist - Client Projects</h1>
          <p class="text-[14px] text-[#717182]" :class="isDark ? 'text-white/60' : ''">Review and manage client projects</p>
        </div>

        <!-- Sub-Tabs -->
        <div class="flex items-center justify-between no-scrollbar p-[10px] w-full max-w-full rounded-[50px] border shadow-sm mb-4"
             :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-white'">
          <button v-for="tab in masterTabs" :key="tab"
                  @click="setMasterTab(tab)"
                  class="w-[25%] py-3 rounded-full text-[14px] font-medium transition-all whitespace-nowrap cursor-pointer"
                  :class="activeMasterTab === masterTabKey(tab)
                    ? (isDark ? 'bg-[#1b5e50] text-white shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A]')
                    : (isDark ? 'bg-transparent text-white/50' : 'bg-transparent text-[#0A0A0A]')">
            {{ tab }}
          </button>
        </div>

        <!-- Card Container -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 space-y-6">

          <!-- Search Row -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-[10px] border"
                 :class="isDark ? 'bg-white/5 border-white/20' : 'bg-white border-[#04C18F80]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" :class="isDark ? 'text-white/40' : 'text-[#04C18F]'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
              <input v-model="masterSearch" type="text" placeholder="Search by client name or client Id..."
                     class="flex-1 bg-transparent border-none outline-none text-[14px]"
                     :class="isDark ? 'text-white placeholder-white/30' : 'text-[#0A0A0A] placeholder-[#0A0A0A]/40'" />
            </div>
            <button @click="masterSearch = ''; refreshMasterlist()"
                    class="w-10 h-10 flex items-center justify-center rounded-[10px] border cursor-pointer transition-all hover:opacity-80"
                    :class="isDark ? 'bg-white/5 border-white/20' : 'bg-white border-[#04C18F]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="[isDark ? 'text-white/50' : 'text-[#04C18F]', masterlistLoading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-hidden rounded-[8px] border" :class="isDark ? 'border-white/10' : 'border-[#E5E5E5]'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#00896F] text-white">
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client ID</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Client Name</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Date of Appointment</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Type of Appointment</th>
                  <th class="py-4 px-6 font-normal text-[14px] border-r border-white/10 whitespace-nowrap">Progress Indicator</th>
                  <th class="py-4 px-6 font-normal text-[14px] whitespace-nowrap">Notes</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-transparent' : 'bg-white'">
                <tr v-for="(p, i) in filteredMasterlist" :key="i"
                    class="transition-colors border-b"
                    :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'">
                  <td class="py-4 px-6 text-[14px]">{{ p.clientId }}</td>
                  <td class="py-4 px-6 text-[14px]">{{ p.clientName }}</td>
                  <td class="py-4 px-6 text-[14px]">{{ p.date }}</td>
                  <td class="py-4 px-6 text-[14px]">{{ p.type }}</td>
                  <td class="py-4 px-6">
                    <div v-if="p.current !== null && p.current !== undefined" class="flex items-center gap-3">
                      <div class="w-24 h-2 rounded-full overflow-hidden" :class="isDark ? 'bg-white/10' : 'bg-[#E5E5E5]'">
                        <div class="h-full rounded-full transition-all duration-500"
                             :style="{ width: (p.current / p.total * 100) + '%' }"
                             :class="getProgressColor(p.current, p.total)"></div>
                      </div>
                      <span class="text-[14px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ p.current }}/{{ p.total }}</span>
                    </div>
                    <span v-else class="opacity-40">-</span>
                  </td>
                  <td class="py-4 px-6 min-w-[250px]">
                    <div class="px-3 py-2 rounded-[8px] border text-[12px] transition-all"
                         :class="isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-[#F3F4F6] border-transparent text-[#717182] hover:bg-gray-100'">
                      {{ p.notes || '—' }}
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMasterlist.length === 0">
                  <td colspan="6" class="py-16 text-center text-[14px] opacity-40">No records found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Masterlist Pagination -->
          <div v-if="masterlistCurrentMeta && masterlistCurrentMeta.last_page > 1" class="flex items-center justify-between pt-2">
            <span class="text-[13px] opacity-50" :class="isDark ? 'text-white/50' : 'text-[#6B7280]'">{{ masterlistCurrentMeta.from }}–{{ masterlistCurrentMeta.to }} of {{ masterlistCurrentMeta.total }}</span>
            <div class="flex items-center gap-2">
              <button @click="masterlistPrev" :disabled="masterlistCurrentMeta.current_page === 1"
                      class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                      :class="isDark ? 'border-white/10' : 'border-gray-200'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span class="text-[13px] px-2" :class="isDark ? 'text-white/60' : 'text-[#6B7280]'">{{ masterlistCurrentMeta.current_page }} / {{ masterlistCurrentMeta.last_page }}</span>
              <button @click="masterlistNext" :disabled="masterlistCurrentMeta.current_page === masterlistCurrentMeta.last_page"
                      class="w-8 h-8 flex items-center justify-center rounded-[8px] border cursor-pointer transition-all hover:opacity-80 disabled:opacity-30"
                      :class="isDark ? 'border-white/10' : 'border-gray-200'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>

    </main>



    <!-- APPOINTMENT DETAILS MODAL -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showAppointmentModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'"
             class="w-full max-w-[550px] rounded-[24px] shadow-2xl overflow-hidden relative border animate-in fade-in zoom-in duration-300">

          <!-- Modal Header -->
          <div class="px-8 pt-8 pb-4 flex justify-between items-center">
            <h2 class="text-[22px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Appointment Details</h2>
            <button @click="showAppointmentModal = false" class="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="px-8 pb-8 space-y-7">

            <!-- Grid Info -->
            <div class="grid grid-cols-3 gap-6">
              <div class="space-y-1.5">
                <span class="text-[13px] opacity-50 block">Appointment Type</span>
                <span class="inline-block px-3 py-1 rounded-full text-[12px] font-medium"
                      :class="isDark ? 'bg-[#04C18F22] text-[#10FFD4]' : 'bg-[#E6FAF5] text-[#00896F]'">
                  {{ selectedAppointment?.type ?? '—' }}
                </span>
              </div>
              <div class="space-y-1.5">
                <span class="text-[13px] opacity-50 block">Consultant</span>
                <span class="text-[15px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ selectedAppointment?.consultant ?? '—' }}</span>
              </div>
              <div class="space-y-1.5">
                <span class="text-[13px] opacity-50 block">Status</span>
                <span class="inline-block px-3 py-1 rounded-full text-[12px] font-medium"
                      :class="selectedAppointment?.status === 'Rescheduled' ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-[#FFE4E6] text-[#9F1239]') : (isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700')">
                  {{ selectedAppointment?.status || 'Scheduled' }}
                </span>
              </div>
            </div>

            <!-- Rescheduled Banner (Conditional) -->
            <div v-if="selectedAppointment?.status === 'Rescheduled'"
                 :class="isDark ? 'bg-[#ff3b3b10] border-[#ff3b3b30]' : 'bg-[#FFF1F2] border-[#FDA4AF]'"
                 class="rounded-[16px] p-5 border space-y-3">
              <div class="flex items-center gap-2 text-[#FB2C36]" :class="isDark ? 'text-[#ff5c5c]' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="text-[14px] font-semibold">Appointment Rescheduled by Admin</span>
              </div>
              <div class="flex items-center gap-3 text-[14px]">
                <span class="line-through opacity-40">{{ selectedAppointment?.proposedDate }}</span>
                <span class="text-[#FB2C36] font-bold" :class="isDark ? 'text-[#ff5c5c]' : ''">{{ selectedAppointment?.rescheduledDate }}</span>
              </div>
              <p class="text-[13px] opacity-60 italic">Please make note of the updated date and time.</p>
            </div>

            <!-- Meet Link -->
            <div v-if="selectedAppointment?.meet_url" class="space-y-2">
              <h4 class="text-[15px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Meet Link</h4>
              <a :href="selectedAppointment.meet_url" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-2 px-4 py-3 rounded-[12px] border text-[14px] break-all transition-colors hover:opacity-80"
                 :class="isDark ? 'bg-white/5 border-white/10 text-[#10FFD4]' : 'bg-[#E6FAF5] border-[#04C18F40] text-[#00896F]'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                {{ selectedAppointment.meet_url }}
              </a>
            </div>

            <!-- Notes Section -->
            <div class="space-y-3">
              <h4 class="text-[15px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Notes</h4>
              <div :class="isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#F2FAF8] border-[#E0F2EF] text-[#333]'"
                   class="p-5 rounded-[16px] border text-[14px] leading-relaxed min-h-[100px]">
                {{ selectedAppointment?.notes || 'No notes available.' }}
              </div>
            </div>

            <!-- Temporary Login Credentials (only for appointments that can run the timer) -->
            <AdminReviewTempCredentialCard
              v-if="['Scheduled', 'Rescheduled'].includes(selectedAppointment?.status) && selectedAppointment?._raw?.tenant_id"
              :tenantId="selectedAppointment._raw.tenant_id"
              :isDark="isDark" />

          </div>
        </div>
      </div>
    </transition>

    <!-- MEET URL MODAL (Confirm Appointment) -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showMeetUrlModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'"
             class="w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden relative border">
          <div class="px-7 pt-7 pb-4 flex justify-between items-center">
            <h2 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Confirm Appointment</h2>
            <button @click="showMeetUrlModal = false" class="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="px-7 pb-7 space-y-4">
            <div class="space-y-2">
              <label class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Meet URL (optional)</label>
              <input v-model="pendingMeetUrl" type="url" placeholder="https://meet.google.com/..."
                     class="w-full px-4 py-3 rounded-[12px] border text-[14px] outline-none focus:ring-2 focus:ring-[#00896F]"
                     :class="isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-gray-200'" />
            </div>
            <div class="flex gap-3">
              <button @click="showMeetUrlModal = false"
                      class="flex-1 px-4 py-3 rounded-[12px] border text-[14px] font-semibold cursor-pointer transition-all"
                      :class="isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-100 text-[#1a1a1a] hover:bg-black/5'">
                Cancel
              </button>
              <button @click="submitConfirmAppointment" :disabled="confirmActionLoading"
                      class="flex-[1.5] flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#00896F] text-white text-[14px] font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ confirmActionLoading ? 'Confirming...' : 'Confirm' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- RESCHEDULE MODAL -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showRescheduleModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'"
             class="w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden relative border animate-in fade-in zoom-in duration-300">

          <!-- Modal Header -->
          <div class="px-7 pt-7 pb-4 flex justify-between items-center">
            <div class="flex items-center gap-2 text-[14px]">
              <button @click="prevCalMonth" class="p-1 rounded hover:opacity-70 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-40" :class="isDark ? 'text-white' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span class="font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ calMonthName }}</span>
              <span class="font-semibold ml-2" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ calYear }}</span>
              <button @click="nextCalMonth" class="p-1 rounded hover:opacity-70 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-40" :class="isDark ? 'text-white' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <button @click="showRescheduleModal = false" class="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Calendar View -->
          <div class="px-7 pb-6">
            <div class="grid grid-cols-7 gap-1 text-center bg-[#F8FAFB] rounded-[12px] p-2" :class="isDark ? 'bg-white/5' : ''">
              <!-- Days Header -->
              <div v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="py-3 text-[12px] font-medium opacity-40">{{ d }}</div>

              <!-- Previous Month Days -->
              <div v-for="d in calPrevDays" :key="'prev'+d" class="py-2 text-[13px] opacity-20">{{ d }}</div>

              <!-- Current Month Days -->
              <div v-for="d in calDaysInMonth" :key="d"
                   @click="selectedRescheduleDate = d"
                   class="relative py-2 text-[13px] cursor-pointer rounded-[8px] transition-all"
                   :class="[
                     selectedRescheduleDate === d ? 'bg-[#00896F] text-white shadow-md' : (isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1a1a1a] hover:bg-gray-100'),
                     isCalToday(d) && selectedRescheduleDate !== d ? 'text-[#00896F] font-bold' : ''
                   ]">
                {{ d }}
                <div v-if="isCalToday(d)" class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00896F]"></div>
              </div>

              <!-- Next Month Days -->
              <div v-for="d in calNextDays" :key="'next'+d" class="py-2 text-[13px] opacity-20">{{ d }}</div>
            </div>
          </div>

          <div class="border-t border-gray-100 mx-7" :class="isDark ? 'border-white/5' : ''"></div>

          <!-- Time Picker Section -->
          <div class="px-7 py-6 space-y-5">
            <div class="space-y-4">
              <h4 class="text-[15px] font-semibold" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Select Time</h4>

              <!-- Time Dropdown -->
              <div class="relative">
                <div @click="showTimeSlotDropdown = !showTimeSlotDropdown"
                     :class="isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-[#1a1a1a]'"
                     class="w-full flex items-center justify-between px-4 py-3 border rounded-[12px] cursor-pointer transition-all hover:border-[#00896F]">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span class="text-[14px]" :class="!selectedTimeSlot ? 'opacity-40' : ''">{{ selectedTimeSlot || 'Select Time Slot' }}</span>
                  </div>
                  <img src="/images/icons/down-select.svg" class="w-2.5 h-2.5 transition-transform" :class="[showTimeSlotDropdown ? 'rotate-180' : '', isDark ? 'invert' : '']" alt="v" />
                </div>

                <transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0">
                  <div v-if="showTimeSlotDropdown"
                       class="absolute bottom-full left-0 right-0 mb-2 py-2 rounded-[16px] shadow-2xl z-[130] border border-gray-100"
                       :class="isDark ? 'bg-[#1a2e2a] border-white/10 text-white' : 'bg-white text-[#1a1a1a]'">
                    <div v-for="slot in timeSlots" :key="slot"
                         @click="selectedTimeSlot = slot; showTimeSlotDropdown = false"
                         class="px-5 py-3 text-[14px] cursor-pointer transition-colors"
                         :class="[
                           isDark ? 'hover:bg-white/5' : 'hover:bg-[#E6FAF5]',
                           selectedTimeSlot === slot ? (isDark ? 'bg-white/10 text-[#04C18F]' : 'bg-[#E6FAF5] text-[#00896F] font-medium') : ''
                         ]">
                      {{ slot }}
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <!-- Reschedule Confirmation Text -->
            <p class="text-[14px] text-center" :class="isDark ? 'text-white/60' : 'text-[#1a1a1a]'">
              Rescheduling to <span class="text-[#FB2C36] font-semibold">{{ calMonthName }} {{ selectedRescheduleDate }}, {{ calYear }}, {{ selectedTimeSlot || '—' }}</span>
            </p>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button @click="showRescheduleModal = false"
                      class="flex-1 px-4 py-3 rounded-[12px] border text-[14px] font-semibold cursor-pointer transition-all hover:bg-black/5"
                      :class="isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-100 text-[#1a1a1a]'">
                Cancel
              </button>
              <button @click="submitReschedule" :disabled="rescheduleLoading || !selectedRescheduleDate || !selectedTimeSlot"
                      class="flex-[1.5] flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#00896F] text-white text-[14px] font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>
    <DashboardFooter />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useActivityTracking } from '~/composables/admin/review/useActivityTracking'
import { useAdminAppointments } from '~/composables/admin/review/useAdminAppointments'
import { useAdminMonthlyReviews } from '~/composables/admin/review/useAdminMonthlyReviews'
import WorkSessionGuardModal from '~/components/admin/review/WorkSessionGuardModal.vue'
import SessionTimerRow from '~/components/admin/review/SessionTimerRow.vue'

const { isDark } = useTheme()

// ── Composables ───────────────────────────────────────────────
const {
  session, clients, dailyStats, todayLogs, todayLogsMeta, monthlyStats, stats,
  loading: activityLoading, clockIn, clockOut, activeTimer,
  fetchTodaySession, fetchClients, fetchMonthlyStats, fetchStats, fetchActiveTimer, timer
} = useActivityTracking()

const {
  appointments, meta: appointmentsMeta, loading: appointmentsLoading,
  fetchAppointments, approveAppointment, rescheduleAppointment, completeAppointment,
  startSession, pauseSession, stopSession
} = useAdminAppointments()

const { reviews, meta: reviewsMeta, fetchReviews } = useAdminMonthlyReviews()
const summaryPage = ref(1)

// ── Current month ─────────────────────────────────────────────
const _now = new Date()
const currentMonth = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}`

// ── Route / Tab persistence (mirrors admin behaviour) ─────────
const route = useRoute()
const router = useRouter()

const tabKeyMap = {
  'Activity Tracking': 'activity',
  'Client Management': 'client',
  'Masterlist': 'masterlist',
}
const tabKeyReverseMap = {
  'activity': 'Activity Tracking',
  'client': 'Client Management',
  'masterlist': 'Masterlist',
}
const subtabKeyMap = {
  'Client Fixed': 'fixed',
  'Client Review': 'review',
  'Client Analysis': 'analysis',
  'All Appointments': 'all',
}
const subtabKeyReverseMap = {
  'fixed': 'Client Fixed',
  'review': 'Client Review',
  'analysis': 'Client Analysis',
  'all': 'All Appointments',
}

// ── Tabs ──────────────────────────────────────────────────────
const mainTabs = ['Activity Tracking', 'Client Management', 'Masterlist']
const activeMainTab = ref(tabKeyReverseMap[route.query.tab] ?? 'Activity Tracking')

function navigateTab(tab) {
  activeMainTab.value = tab
  router.replace({ query: { ...route.query, tab: tabKeyMap[tab] } })
}

function navigateToActivityLog() {
  navigateTo('/review-team-member/activity-log')
}

watch(activeMainTab, async (tab) => {
  router.replace({ query: { ...route.query, tab: tabKeyMap[tab] } })
  if (tab === 'Activity Tracking') {
    fetchActiveTimer()
  } else if (tab === 'Client Management') {
    fetchAppointments(1)
    summaryPage.value = 1
    fetchReviews(currentMonth, summarySearch.value || undefined, 1)
    fetchActiveTimer()
  } else if (tab === 'Masterlist') {
    refreshMasterlist()
  }
})

// ── Session ───────────────────────────────────────────────────
const sessionActive = computed(() => !!session.value?.checked_in_at && !session.value?.checked_out_at)

const sessionLoggedInAt = computed(() => {
  if (!session.value?.checked_in_at) return ''
  return new Date(session.value.checked_in_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
})

// Live tick — increments every second so elapsed computeds stay current
const liveTick = ref(0)
let _sessionInterval = null
onMounted(() => { _sessionInterval = setInterval(() => liveTick.value++, 1000) })
onUnmounted(() => { if (_sessionInterval) clearInterval(_sessionInterval) })

const sessionElapsedSeconds = computed(() => {
  liveTick.value // depend on tick so this recomputes every second
  const base = session.value?.total_worked_seconds ?? 0
  if (!session.value?.checked_in_at || session.value?.checked_out_at) return base
  const segmentMs = Math.max(0, Date.now() - new Date(session.value.checked_in_at).getTime())
  return base + Math.floor(segmentMs / 1000)
})

const sessionDurationDisplay = computed(() => {
  const s = sessionElapsedSeconds.value
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`
})

const untilLogoutDisplay = computed(() => {
  const remaining = Math.max(0, 8 * 3600 - sessionElapsedSeconds.value)
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m until logout available`
})

const totalHoursDisplay = computed(() => {
  const m = dailyStats.value?.total_logged_minutes ?? 0
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00 hrs`
})

const clockOutBlockedTimers = ref([])

async function handleSessionToggle() {
  if (sessionActive.value) {
    clockOutBlockedTimers.value = []
    try {
      await useAdminApi('/admin/activity/clockout', { method: 'POST' })
      await fetchTodaySession()
    } catch (err) {
      const data = err?.data ?? err?.response?._data
      if (data?.running_timers?.length) {
        clockOutBlockedTimers.value = data.running_timers
      }
    }
  } else {
    await clockIn()
  }
}

// ── Cross-timer guard ─────────────────────────────────────────
const currentActivityRunning = computed(() => activeTimer.value?.state === 'running')

const appointmentTimerRunning = computed(() =>
  appointments.value.some(a =>
    a.status !== 'completed' && (!!a.session_started_at || (a.session_elapsed_seconds ?? 0) > 0)
  )
)

// ── Activity Timer (inline) ───────────────────────────────────
const showGuard = ref(false)
const activityError = ref('')
const activityActionLoading = ref(false)
const timerState = ref('idle')
const elapsedMs = ref(0)
const runStartMs = ref(0)
const tick = ref(0)
let tickInterval = null

const activityForm = ref({ appointment_type: '', tenant_id: null })

const activityTypeOptions = [
  { value: 'client_fixed', label: 'Client Fixed' },
  { value: 'internal',     label: 'Internal' },
  { value: 'training',     label: 'Training' },
]

const selectedActivityType = computed(() =>
  activityTypeOptions.find(o => o.value === activityForm.value.appointment_type)?.label ?? ''
)

const needsActivityClient = computed(() => activityForm.value.appointment_type === 'client_fixed')

const activityClientName = computed(() =>
  clients.value.find(c => c.id === activityForm.value.tenant_id)?.name ?? ''
)

const totalElapsedMs = computed(() => {
  tick.value
  if (timerState.value !== 'running') return elapsedMs.value
  return elapsedMs.value + (Date.now() - runStartMs.value)
})

const formattedElapsed = computed(() => {
  const s = Math.floor(totalElapsedMs.value / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`
})

const timeInDisplay = computed(() => {
  if (timerState.value === 'idle') return ''
  const timeIn = new Date(Date.now() - totalElapsedMs.value)
  return timeIn.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
})

function startTick() {
  if (tickInterval) return
  tickInterval = setInterval(() => tick.value++, 1000)
}

function stopTick() {
  if (tickInterval) { clearInterval(tickInterval); tickInterval = null }
}

function restoreTimerFromBackend(t) {
  activityForm.value.appointment_type = t.appointment_type
  activityForm.value.tenant_id = t.tenant_id
  elapsedMs.value = t.elapsed_ms
  if (t.state === 'running') {
    runStartMs.value = new Date(t.started_at).getTime()
    timerState.value = 'running'
    startTick()
  } else {
    timerState.value = 'paused'
  }
}

async function startActivityTimer() {
  activityError.value = ''
  if (!sessionActive.value) { showGuard.value = true; return }
  if (!activityForm.value.appointment_type) { activityError.value = 'Select appointment type.'; return }
  if (needsActivityClient.value && !activityForm.value.tenant_id) { activityError.value = 'Select a client.'; return }
  activityActionLoading.value = true
  try {
    const t = await timer('start', { appointment_type: activityForm.value.appointment_type, tenant_id: activityForm.value.tenant_id })
    if (t) restoreTimerFromBackend(t)
  } catch (e) {
    activityError.value = e?.data?.message ?? 'Failed to start timer.'
  } finally {
    activityActionLoading.value = false
  }
}

async function pauseActivityTimer() {
  activityActionLoading.value = true
  stopTick()
  try {
    const t = await timer('pause')
    elapsedMs.value = t?.elapsed_ms ?? elapsedMs.value
    timerState.value = 'paused'
  } catch (e) {
    activityError.value = e?.data?.message ?? 'Failed to pause.'
    startTick()
  } finally {
    activityActionLoading.value = false
  }
}

async function resumeActivityTimer() {
  activityActionLoading.value = true
  try {
    const t = await timer('resume')
    if (t) runStartMs.value = new Date(t.started_at).getTime()
    timerState.value = 'running'
    startTick()
  } catch (e) {
    activityError.value = e?.data?.message ?? 'Failed to resume.'
  } finally {
    activityActionLoading.value = false
  }
}

async function stopActivityTimer() {
  activityActionLoading.value = true
  stopTick()
  try {
    await timer('stop')
    timerState.value = 'idle'
    elapsedMs.value = 0
    runStartMs.value = 0
    tick.value = 0
    activityForm.value = { appointment_type: '', tenant_id: null }
  } catch (e) {
    activityError.value = e?.data?.message ?? 'Failed to stop timer.'
    if (timerState.value === 'running') startTick()
  } finally {
    activityActionLoading.value = false
  }
}

onUnmounted(() => stopTick())

// ── Current Activity Dropdowns ────────────────────────────────
const showTypeDropdown = ref(false)
const showClientDropdown = ref(false)

function toggleDropdown(field) {
  if (field === 'type') {
    showTypeDropdown.value = !showTypeDropdown.value
    showClientDropdown.value = false
  } else {
    showClientDropdown.value = !showClientDropdown.value
    showTypeDropdown.value = false
  }
}

function selectActivityType(value) {
  activityForm.value.appointment_type = value
  activityForm.value.tenant_id = null
  showTypeDropdown.value = false
}

function selectActivityClient(id) {
  activityForm.value.tenant_id = id
  showClientDropdown.value = false
}

// ── Appointment helpers ───────────────────────────────────────
function formatApptDateTime(date, time) {
  if (!date) return '-'
  const [y, m, d] = date.split('-')
  const dateStr = `${m}/${d}/${y}`
  if (!time) return dateStr
  // Time is stored as "H:MM AM/PM" — use directly
  if (/am|pm/i.test(time)) return `${dateStr}, ${time.trim()}`
  // Otherwise treat as 24-hour HH:mm[:ss]
  const parts = time.split(':').map(Number)
  const h = parts[0]
  const min = isNaN(parts[1]) ? 0 : parts[1]
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${dateStr}, ${h12}:${String(min).padStart(2, '0')} ${ampm}`
}

const mappedAppointments = computed(() =>
  appointments.value.map(a => ({
    id: a.id,
    clientId: `C${String(a.tenant_id).padStart(3, '0')}`,
    clientName: a.client_name,
    proposedDate: formatApptDateTime(a.appointment_date, a.appointment_time),
    rescheduledDate: a.rescheduled_date ? formatApptDateTime(a.rescheduled_date, a.rescheduled_time) : '-',
    status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
    type: a.type,
    consultant: a.consultant,
    notes: a.notes,
    meet_url: a.meet_url,
    _raw: a,
  }))
)

// ── Client Management ─────────────────────────────────────────
const requestSearch = ref('')
const requestStatusFilter = ref('')
const showRequestStatusDd = ref(false)

const filteredRequestPool = computed(() => {
  return mappedAppointments.value.filter(r => {
    const q = requestSearch.value.toLowerCase()
    const matchSearch = !q || r.clientId.toLowerCase().includes(q) || r.clientName.toLowerCase().includes(q)
    const matchStatus = !requestStatusFilter.value || r.status === requestStatusFilter.value
    return matchSearch && matchStatus
  })
})

const summarySearch = ref('')
const summaryStatusFilter = ref('')
const showSummaryStatusDd = ref(false)

function loadReviews(page = 1) {
  summaryPage.value = page
  fetchReviews(currentMonth, summarySearch.value || undefined, page)
}

watch(summarySearch, () => loadReviews(1))

function reviewStatusLabel(status) {
  const map = { pending: 'Planned', scheduled: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' }
  return map[status] ?? (status.charAt(0).toUpperCase() + status.slice(1))
}

const mappedReviews = computed(() =>
  reviews.value.map(r => ({
    clientId: `C${String(r.tenant_id).padStart(3, '0')}`,
    clientName: r.client_name,
    tenantId: r.tenant_id,
    reviewCurrent: r.progress_current,
    reviewTotal: r.progress_total,
    stepsCurrent: r.progress_current,
    stepsTotal: r.progress_total,
    percent: r.progress_total > 0 ? Math.round((r.progress_current / r.progress_total) * 100) : 0,
    status: reviewStatusLabel(r.status),
  }))
)

const filteredClientSummary = computed(() =>
  mappedReviews.value.filter(s => {
    const q = summarySearch.value.toLowerCase()
    const matchSearch = !q || s.clientId.toLowerCase().includes(q) || s.clientName.toLowerCase().includes(q)
    const matchStatus = !summaryStatusFilter.value || s.status === summaryStatusFilter.value
    return matchSearch && matchStatus
  })
)

// ── Appointment Details Modal ─────────────────────────────────
const showAppointmentModal = ref(false)
const selectedAppointment = ref(null)

function openAppointmentModal(req) {
  selectedAppointment.value = req
  showAppointmentModal.value = true
}

// ── Meet URL / Confirm Modal ──────────────────────────────────
const showMeetUrlModal = ref(false)
const pendingMeetUrl = ref('')
const pendingConfirmId = ref(null)
const confirmActionLoading = ref(false)

function confirmAppointment(req) {
  pendingConfirmId.value = req.id
  pendingMeetUrl.value = req.meet_url ?? ''
  showMeetUrlModal.value = true
}

async function submitConfirmAppointment() {
  if (!pendingConfirmId.value) return
  confirmActionLoading.value = true
  try {
    await approveAppointment(pendingConfirmId.value, pendingMeetUrl.value)
    showMeetUrlModal.value = false
  } catch (e) {
    // silently handled — appointments ref updates on success
  } finally {
    confirmActionLoading.value = false
  }
}

// ── Reschedule Modal ──────────────────────────────────────────
const showRescheduleModal = ref(false)
const selectedRescheduleReq = ref(null)
const selectedRescheduleDate = ref(null)
const showTimeSlotDropdown = ref(false)
const selectedTimeSlot = ref('')
const rescheduleLoading = ref(false)

const calDate = ref(new Date())
const calYear = computed(() => calDate.value.getFullYear())
const calMonthIndex = computed(() => calDate.value.getMonth())
const calMonthName = computed(() => calDate.value.toLocaleString('default', { month: 'long' }))
const calFirstDay = computed(() => new Date(calYear.value, calMonthIndex.value, 1).getDay())
const calDaysInMonth = computed(() => new Date(calYear.value, calMonthIndex.value + 1, 0).getDate())
const calPrevDays = computed(() => {
  const last = new Date(calYear.value, calMonthIndex.value, 0).getDate()
  return Array.from({ length: calFirstDay.value }, (_, i) => last - calFirstDay.value + i + 1)
})
const calNextDays = computed(() => {
  const total = calFirstDay.value + calDaysInMonth.value
  const rem = total % 7 === 0 ? 0 : 7 - (total % 7)
  return Array.from({ length: rem }, (_, i) => i + 1)
})

function isCalToday(d) {
  const t = new Date()
  return d === t.getDate() && calMonthIndex.value === t.getMonth() && calYear.value === t.getFullYear()
}

function prevCalMonth() {
  calDate.value = new Date(calYear.value, calMonthIndex.value - 1, 1)
  selectedRescheduleDate.value = null
}

function nextCalMonth() {
  calDate.value = new Date(calYear.value, calMonthIndex.value + 1, 1)
  selectedRescheduleDate.value = null
}

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:30 PM - 02:30 PM',
  '2:30 PM - 03:30 PM'
]

function parseTimeSlot(slot) {
  const match = slot.match(/^(\d+):(\d+)\s+(AM|PM)/)
  if (!match) return '09:00:00'
  let h = parseInt(match[1])
  const m = match[2]
  const ampm = match[3]
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m}:00`
}

function openRescheduleModal(req) {
  selectedRescheduleReq.value = req
  selectedRescheduleDate.value = null
  selectedTimeSlot.value = ''
  calDate.value = new Date()
  showRescheduleModal.value = true
}

async function submitReschedule() {
  if (!selectedRescheduleReq.value || !selectedRescheduleDate.value || !selectedTimeSlot.value) return
  rescheduleLoading.value = true
  try {
    const dateStr = `${calYear.value}-${String(calMonthIndex.value + 1).padStart(2, '0')}-${String(selectedRescheduleDate.value).padStart(2, '0')}`
    const timeStr = parseTimeSlot(selectedTimeSlot.value)
    await rescheduleAppointment(selectedRescheduleReq.value.id, dateStr, timeStr)
    showRescheduleModal.value = false
  } catch (e) {
    // handled — composable re-fetches on success
  } finally {
    rescheduleLoading.value = false
  }
}

// ── Masterlist ────────────────────────────────────────────────
// Mirrors admin ReviewDashboard.vue exactly:
//   Client Fixed   → monthly reviews (fetchReviews)
//   Client Review  → appointment summaries per client (/admin/appointments/client-summary)
//   Client Analysis → same appointment summaries (same endpoint, same data)
//   All Appointments → MERGED monthly reviews + appointment summaries (like admin allRows)

const masterTabKeys = ['Client Fixed', 'Client Review', 'Client Analysis', 'All Appointments']
const activeMasterTab = ref(subtabKeyReverseMap[route.query.subtab] ?? 'Client Fixed')
const masterSearch = ref('')
const masterlistLoading = ref(false)

const mlFixedPage = ref(1)

// Client Review / Client Analysis — appointment summaries per client (same as admin)
const mlReviewRows = ref([])
const mlReviewMeta = ref(null)
const mlReviewPage = ref(1)

async function fetchClientReview(page = 1, perPage = 10) {
  try {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })
    if (masterSearch.value) params.set('search', masterSearch.value)
    const res = await useAdminApi(`/admin/appointments/client-summary?${params.toString()}`)
    mlReviewRows.value = res.data ?? []
    mlReviewMeta.value = res.meta ?? null
    mlReviewPage.value = page
  } catch {}
}

const masterlistCurrentMeta = computed(() => {
  if (activeMasterTab.value === 'Client Fixed') return reviewsMeta.value
  if (activeMasterTab.value === 'Client Review' || activeMasterTab.value === 'Client Analysis') return mlReviewMeta.value
  return null // All Appointments is a merged view — no single meta
})

async function refreshMasterlist() {
  masterlistLoading.value = true
  try {
    // Same as admin onMounted: load both datasets upfront with large perPage for the merged All view
    await Promise.all([
      fetchReviews(currentMonth, masterSearch.value || undefined, mlFixedPage.value),
      fetchClientReview(mlReviewPage.value, 1000),
    ])
  } finally {
    masterlistLoading.value = false
  }
}

function masterlistPrev() {
  const meta = masterlistCurrentMeta.value
  if (!meta || meta.current_page <= 1) return
  const page = meta.current_page - 1
  if (activeMasterTab.value === 'Client Fixed') {
    mlFixedPage.value = page
    fetchReviews(currentMonth, masterSearch.value || undefined, page)
  } else {
    fetchClientReview(page, 10)
  }
}

function masterlistNext() {
  const meta = masterlistCurrentMeta.value
  if (!meta || meta.current_page >= meta.last_page) return
  const page = meta.current_page + 1
  if (activeMasterTab.value === 'Client Fixed') {
    mlFixedPage.value = page
    fetchReviews(currentMonth, masterSearch.value || undefined, page)
  } else {
    fetchClientReview(page, 10)
  }
}

watch(masterSearch, () => {
  mlFixedPage.value = 1
  mlReviewPage.value = 1
  refreshMasterlist()
})

const masterTabs = computed(() => {
  const fixedCount = reviewsMeta.value?.total ?? reviews.value.length
  const reviewCount = mlReviewMeta.value?.total ?? mlReviewRows.value.length
  const allCount = fixedCount + reviewCount
  return [
    `Client Fixed (${fixedCount})`,
    `Client Review (${reviewCount})`,
    `Client Analysis (0)`,
    `All Appointments (${allCount})`,
  ]
})

function masterTabKey(tabWithCount) {
  return masterTabKeys.find(k => tabWithCount.startsWith(k)) ?? ''
}

function setMasterTab(tabWithCount) {
  const key = masterTabKey(tabWithCount)
  if (key) {
    activeMasterTab.value = key
    router.replace({ query: { ...route.query, subtab: subtabKeyMap[key] } })
  }
}

const filteredMasterlist = computed(() => {
  const q = masterSearch.value.toLowerCase()

  const mapFixed = r => ({
    clientId: `C${String(r.tenant_id).padStart(3, '0')}`,
    clientName: r.client_name,
    date: r.scheduled_date ?? r.month ?? '-',
    type: 'Client Fixed',
    current: r.progress_current ?? null,
    total: r.progress_total ?? null,
    notes: r.notes ?? '',
  })

  const mapReview = r => ({
    clientId: `C${String(r.tenant_id).padStart(3, '0')}`,
    clientName: r.client_name,
    date: '-',
    type: 'Client Review',
    current: r.completed ?? 0,
    total: r.total ?? 0,
    notes: `${r.total} appointment${r.total !== 1 ? 's' : ''}`,
  })

  if (activeMasterTab.value === 'Client Fixed') {
    return reviews.value.map(mapFixed)
  }
  if (activeMasterTab.value === 'Client Review') {
    return mlReviewRows.value.map(mapReview)
  }
  if (activeMasterTab.value === 'Client Analysis') {
    return []
  }
  // All Appointments: merged, sorted by client name (same as admin allRows)
  const merged = [
    ...reviews.value.map(mapFixed),
    ...mlReviewRows.value.map(mapReview),
  ].sort((a, b) => a.clientName.localeCompare(b.clientName))
  if (!q) return merged
  return merged.filter(r => r.clientName.toLowerCase().includes(q) || r.clientId.toLowerCase().includes(q))
})

function getProgressColor(current, total) {
  if (current === null || current === undefined) return ''
  const p = (current / total) * 100
  if (p < 30) return 'bg-[#FB2C36]'
  if (p < 70) return 'bg-[#FDC700]'
  return 'bg-[#00896F]'
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  const active = await fetchActiveTimer()
  if (active) restoreTimerFromBackend(active)

  await Promise.all([
    fetchTodaySession(),
    fetchStats(),
    fetchMonthlyStats(currentMonth),
    fetchClients(),
  ])

  if (activeMainTab.value === 'Masterlist') {
    refreshMasterlist()
  } else if (activeMainTab.value === 'Client Management') {
    fetchAppointments(1)
    fetchReviews(currentMonth, undefined, 1)
  } else {
    fetchAppointments(1)
    fetchReviews(currentMonth, undefined, 1)
  }
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
