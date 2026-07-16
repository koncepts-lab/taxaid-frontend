<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20 ">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]">Notification Settings</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage how you receive alerts and updates</p>
      </div>

      <div class="space-y-6">
        
        <!-- Email Notifications -->
        <div class="bg-white border border-gray-100 rounded-[16px] shadow-sm overflow-hidden">
          <div class="p-6 pb-2">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-10 h-10 bg-[#E8FCF2] rounded-[10px] flex items-center justify-center text-[#00835D] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909A2.25 2.25 0 0 1 2.25 8.5v-.243" /></svg>
              </div>
              <div>
                <h2 class="text-[18px] font-normal" style="color: #101828;">Email Notifications</h2>
                <p class="text-[14px] mt-0.5" style="color: #4A5565;">Receive updates via email</p>
              </div>
            </div>

            <!-- List -->
            <div class="space-y-6 mb-6">
              
              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Tax Deadlines</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Get notified about upcoming tax filing deadlines</p>
                  </div>
                </div>
                <button @click="emailSettings.taxDeadlines = !emailSettings.taxDeadlines" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.taxDeadlines ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.taxDeadlines ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Filing Reminders</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Reminders for pending tax returns and submissions</p>
                  </div>
                </div>
                <button @click="emailSettings.filingReminders = !emailSettings.filingReminders" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.filingReminders ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.filingReminders ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Payment Due</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Notifications when payments are due</p>
                  </div>
                </div>
                <button @click="emailSettings.paymentDue = !emailSettings.paymentDue" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.paymentDue ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.paymentDue ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Security Alerts</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Important security and account activity alerts</p>
                  </div>
                </div>
                <button @click="emailSettings.securityAlerts = !emailSettings.securityAlerts" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.securityAlerts ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.securityAlerts ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9ZM9.75 14.25l1.036-1.036a1.5 1.5 0 0 1 2.122 0l.542.542a1.5 1.5 0 0 0 2.122 0l1.036-1.036" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Weekly Summary Report</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Get a weekly overview of your financial status</p>
                  </div>
                </div>
                <button @click="emailSettings.weeklySummary = !emailSettings.weeklySummary" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.weeklySummary ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.weeklySummary ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Monthly Report</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Comprehensive monthly financial report</p>
                  </div>
                </div>
                <button @click="emailSettings.monthlyReport = !emailSettings.monthlyReport" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.monthlyReport ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.monthlyReport ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">System Updates</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">New features and platform updates</p>
                  </div>
                </div>
                <button @click="emailSettings.systemUpdates = !emailSettings.systemUpdates" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="emailSettings.systemUpdates ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="emailSettings.systemUpdates ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Push Notifications -->
        <div class="bg-white border border-gray-100 rounded-[16px] shadow-sm overflow-hidden">
          <div class="p-6 pb-2">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-10 h-10 bg-[#E8FCF2] rounded-[10px] flex items-center justify-center text-[#00835D] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
              </div>
              <div>
                <h2 class="text-[18px] font-normal" style="color: #101828;">Push Notifications</h2>
                <p class="text-[14px] mt-0.5" style="color: #4A5565;">Real-time alerts in your browser</p>
              </div>
            </div>

            <!-- List -->
            <div class="space-y-6 mb-6">
              
              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Tax Deadlines</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Get push alerts for upcoming deadlines</p>
                  </div>
                </div>
                <button @click="pushSettings.taxDeadlines = !pushSettings.taxDeadlines" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="pushSettings.taxDeadlines ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="pushSettings.taxDeadlines ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Filing Reminders</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Push alerts for pending submissions</p>
                  </div>
                </div>
                <button @click="pushSettings.filingReminders = !pushSettings.filingReminders" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="pushSettings.filingReminders ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="pushSettings.filingReminders ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Payment Due</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Push notifications for due payments</p>
                  </div>
                </div>
                <button @click="pushSettings.paymentDue = !pushSettings.paymentDue" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="pushSettings.paymentDue ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="pushSettings.paymentDue ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Security Alerts</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Immediate security notifications</p>
                  </div>
                </div>
                <button @click="pushSettings.securityAlerts = !pushSettings.securityAlerts" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="pushSettings.securityAlerts ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="pushSettings.securityAlerts ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">System Updates</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Platform update notifications</p>
                  </div>
                </div>
                <button @click="pushSettings.systemUpdates = !pushSettings.systemUpdates" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="pushSettings.systemUpdates ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="pushSettings.systemUpdates ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- SMS Notifications(hidden for now) -->
        <div v-if="false" class="bg-white border border-gray-100 rounded-[16px] shadow-sm overflow-hidden">
          <div class="p-6 pb-2">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-10 h-10 bg-[#E8FCF2] rounded-[10px] flex items-center justify-center text-[#00835D] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
              </div>
              <div>
                <h2 class="text-[18px] font-normal" style="color: #101828;">SMS Notifications</h2>
                <p class="text-[14px] mt-0.5" style="color: #4A5565;">Text message alerts for critical updates</p>
              </div>
            </div>

            <!-- List -->
            <div class="space-y-6 mb-6">
              
              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Tax Deadlines</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">SMS alerts for critical tax deadlines</p>
                  </div>
                </div>
                <button @click="smsSettings.taxDeadlines = !smsSettings.taxDeadlines" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="smsSettings.taxDeadlines ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="smsSettings.taxDeadlines ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

              <div class="flex items-center justify-between group border-b border-[#F3F4F6] pb-6 last:border-0 last:pb-0">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-[14px] font-medium leading-tight" style="color: #101828;">Urgent Alerts</h3>
                    <p class="text-[14px] mt-0.5" style="color: #4A5565;">Critical notifications requiring immediate action</p>
                  </div>
                </div>
                <button @click="smsSettings.urgentAlerts = !smsSettings.urgentAlerts" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4" :class="smsSettings.urgentAlerts ? 'bg-[#00835D]' : 'bg-gray-200'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="smsSettings.urgentAlerts ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'

const emailSettings = ref({
  taxDeadlines: false,
  filingReminders: true,
  paymentDue: true,
  securityAlerts: true,
  weeklySummary: true,
  monthlyReport: false,
  systemUpdates: false
})

const pushSettings = ref({
  taxDeadlines: true,
  filingReminders: true,
  paymentDue: true,
  securityAlerts: true,
  systemUpdates: false
})

const smsSettings = ref({
  taxDeadlines: true,
  urgentAlerts: true
})
</script>
