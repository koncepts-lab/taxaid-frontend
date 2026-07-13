<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20 ">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]">Sync & Data Management</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage your data synchronization and exports</p>
      </div>

      <div class="space-y-6">
        
        <!-- Automatic Sync -->
        <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-[16px] font-medium text-[#101828]">Automatic Sync</h2>
              <p class="text-[14px] mt-0.5 text-[#4A5565]">Automatically synchronize your data</p>
            </div>
            <button @click="autoSync = !autoSync" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0" :class="autoSync ? 'bg-[#00835D]' : 'bg-gray-200'">
              <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="autoSync ? 'translate-x-6' : 'translate-x-1'"></span>
            </button>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-[#101828] mb-2">Sync Frequency</label>
            <div class="relative max-w-full">
              <select class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm appearance-none bg-white">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Financial Year</option>
                <option>Custom</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Last Sync -->
        <div class="bg-[#E0F9F3] border border-[#6FDBBF] rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-[16px] font-medium text-[#101828]">Last Sync</h2>
            <p class="text-[14px] mt-0.5 text-[#4A5565]">12/15/2024 at 5:30:00 AM</p>
          </div>
          <button class="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            Sync Now
          </button>
        </div>

        <!-- Sync History -->
        <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-[16px] font-medium text-[#101828]">Sync History</h2>
            <button class="px-4 py-2 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors">
              View All
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="item in historyItems" :key="item.id" class="flex items-center justify-between p-4 border border-[#6FDBBF] rounded-lg bg-white">
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full bg-[#E0F9F3] flex items-center justify-center text-[#00896F] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-[14px] font-medium text-[#101828]">{{ item.date }}</h3>
                  <p class="text-[13px] text-[#4A5565]">{{ item.details }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button class="text-gray-500 hover:text-gray-700 transition-colors p-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
                <button class="text-gray-500 hover:text-gray-700 transition-colors p-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- System Backup -->
        <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden p-6">
          <h2 class="text-[16px] font-medium text-[#101828]">System Backup</h2>
          <p class="text-[14px] mt-0.5 text-[#4A5565] mb-6">Download all your data in CSV or JSON format</p>
          
          <div class="flex flex-wrap items-center gap-4">
            <button class="flex items-center gap-2 px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Backup (CSV)
            </button>
            <button class="flex items-center gap-2 px-4 py-2.5 border border-[#6FDBBF] rounded-lg text-sm font-medium text-[#013E32] hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Backup (JSON)
            </button>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'

const autoSync = ref(true)

const historyItems = ref([
  { id: 1, date: 'November 24, 2025', details: '2:00 AM • Automatic • 2.4 GB • 12 minutes' },
  { id: 2, date: 'November 23, 2025', details: '2:00 AM • Automatic • 2.3 GB • 11 minutes' },
  { id: 3, date: 'November 22, 2025', details: '2:00 AM • Automatic • 2.3 GB • 10 minutes' },
  { id: 4, date: 'November 20, 2025', details: '4:30 PM • Manual • 2.2 GB • 9 minutes' }
])
</script>
