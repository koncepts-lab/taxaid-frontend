<template>
  <NuxtLayout name="dashboard">
    <div class="flex-1 p-8 space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24 text-gray-400 text-sm">Loading profile...</div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{{ error }}</div>

    <template v-if="!loading && profile">

   

    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-[26px] font-semibold text-[#004D40] mb-1">Company Profile</h1>
        <p class="text-[15px] text-gray-500">Manage Company Information and details</p>
      </div>
      <div v-if="!isEditing">
        <button 
          @click="isEditing = true"
          class="flex items-center gap-2 px-5 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>
      <div v-else class="flex gap-3">
        <button 
          @click="isEditing = false"
          class="px-5 py-2 border border-gray-200 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          :disabled="saving"
          class="flex items-center gap-2 px-5 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- 1. Header Card (Green) -->
    <div class="rounded-2xl p-8 text-white flex gap-6 items-center shadow-sm relative overflow-hidden" style="background: linear-gradient(180deg, #013E32 0%, #007760 100%);">
      <!-- Decorative gradient background -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#00896F]/20 pointer-events-none"></div>
      
      <div class="relative z-10">
        <img :src="pictureUrl ?? '/default-avatar.png'" alt="Profile" class="w-20 h-20 rounded-full border-2 border-white/20 object-cover" />
        <div v-if="isEditing" class="absolute bottom-0 right-0 bg-[#00896F] rounded-full p-1.5 border-2 border-white cursor-pointer hover:bg-[#00705a] transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
          <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" id="profilePicUpload" />
          <label for="profilePicUpload" class="absolute inset-0 cursor-pointer"></label>
        </div>
      </div>
      
      <div class="flex-1 z-10">
        <div>
          <h2 class="text-[22px] font-semibold mb-1">{{ profile.companyNickname || profile.companyName }}</h2>
          <p class="text-white/80 text-sm mb-6">{{ profile.companyName }}</p>
        </div>
        
        <div class="flex gap-12">
          <div>
            <p class="text-[#00FFB2] text-xs mb-1">EIN</p>
            <p class="text-sm text-white/90">{{ profile.ein }}</p>
          </div>
          <div>
            <p class="text-[#00FFB2] text-xs mb-1">Entity Type</p>
            <p class="text-sm text-white/90">{{ profile.entityType }}</p>
          </div>
          <div>
            <p class="text-[#00FFB2] text-xs mb-1">Founded</p>
            <p class="text-sm text-white/90">{{ profile.founded }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Basic Information -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
      <!-- Read-Only View -->
      <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-0.5">First Name</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.firstName }}</p>
          </div>
        </div>
        <div class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-0.5">Last Name</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.lastName }}</p>
          </div>
        </div>
        <div class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-0.5">Email</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.email }}</p>
          </div>
        </div>
        <div class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-0.5">Phone</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.phone }}</p>
          </div>
        </div>
        <div class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-0.5">Company</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.companyName }}</p>
          </div>
        </div>
        <div class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-0.5">Company Nickname</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.companyNickname }}</p>
          </div>
        </div>
      </div>
      
      <!-- Edit View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label class="block text-xs text-gray-700 mb-1">First Name</label>
          <input v-model="profile.firstName" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Last Name</label>
          <input v-model="profile.lastName" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Company Name <span class="text-[10px] text-gray-400">(from your accounting system - not editable)</span></label>
          <input :value="profile.companyName" disabled class="w-full h-[40px] bg-gray-100 border border-gray-200 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed" />
        </div>
        <div>
          <div class="flex justify-between items-end mb-1">
            <label class="block text-xs text-gray-700">Company Nickname</label>
            <span class="text-[10px] text-gray-400">{{ profile.companyNickname?.length || 0 }}/15</span>
          </div>
          <input v-model="profile.companyNickname" maxlength="15" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Email</label>
          <div class="relative">
             <span class="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
             </span>
             <input v-model="profile.email" class="w-full pl-9 bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Phone</label>
          <div class="relative">
             <span class="absolute left-3 top-1/2 -translate-y-1/2 text-black">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
             </span>
             <input v-model="profile.phone" class="w-full pl-9 bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">EIN</label>
          <input v-model="profile.ein" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Entity Type</label>
          <input v-model="profile.entityType" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Founded Year</label>
          <input v-model="profile.founded" maxlength="4" placeholder="e.g. 2015" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Industry</label>
          <input v-model="profile.industry" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs text-gray-700 mb-1">Fiscal Year End</label>
          <input v-model="profile.fiscalYearEnd" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
      </div>
    </div>

    <!-- 3. Contact Information (Address) -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 mb-6">Contact Information</h3>
      
      <div class="space-y-6">
        <div>
          <h4 v-if="!isEditing" class="text-sm text-gray-500 mb-4">Permanent Address</h4>
          
          <div v-if="!isEditing" class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            </div>
            
            <div class="flex-1 py-1">
              <p class="text-sm font-medium text-gray-900 mb-1">{{ profile.permanentAddress.street }}</p>
              <p class="text-sm text-gray-600">{{ profile.permanentAddress.city }}, {{ profile.permanentAddress.state }} {{ profile.permanentAddress.zip }}</p>
            </div>
          </div>

          <div v-else class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 space-y-4">
            <h4 class="text-sm text-gray-900 font-medium mb-2">Permanent Address</h4>
            <div>
              <label class="block text-xs text-gray-700 mb-1">Street Address</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                </span>
                <input v-model="profile.permanentAddress.street" class="w-full pl-9 h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-xs text-gray-700 mb-1">City</label>
                <div class="relative">
                  <input v-model="profile.permanentAddress.city" placeholder="City" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F] pr-8 cursor-pointer" />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </span>
                </div>
              </div>
              <div class="w-1/3">
                <label class="block text-xs text-gray-700 mb-1">State</label>
                <div class="relative">
                  <input v-model="profile.permanentAddress.state" placeholder="State" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F] pr-8 cursor-pointer" />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </span>
                </div>
              </div>
              <div class="w-1/3">
                <label class="block text-xs text-gray-700 mb-1">Z!P Code</label>
                <input v-model="profile.permanentAddress.zip" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="isEditing || profile.communicationAddresses.some(a => a.street || a.city || a.state || a.zip)">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-sm text-gray-500">Communication Address</h4>
            <button v-if="isEditing" @click="addCommunicationAddress" class="text-xs bg-[#00896F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#00705a] transition-colors flex items-center gap-1.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Address
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="(addr, index) in profile.communicationAddresses.filter(a => !isEditing ? (a.street || a.city || a.state || a.zip) : true)" :key="index" class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-start gap-4">
              <div v-if="!isEditing" class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              </div>
              
              <div v-if="!isEditing" class="flex-1 py-1">
                <p class="text-xs text-gray-500 mb-0.5">{{ addr.label }}</p>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ addr.street }}</p>
                <p class="text-sm text-gray-600">{{ addr.city }}, {{ addr.state }} {{ addr.zip }}</p>
              </div>
              
              <div v-else class="flex-1 space-y-4 py-1">
                <div class="flex justify-between gap-4">
                  <div class="flex-1">
                    <label class="block text-xs text-gray-700 mb-1">Address Label</label>
                    <input v-model="addr.label" placeholder="e.g. Address 1" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
                  </div>
                  <button @click="removeCommunicationAddress(index)" class="text-gray-400 hover:text-red-500 self-end mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                </div>
                <div>
                  <label class="block text-xs text-gray-700 mb-1">Street Address</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    </span>
                    <input v-model="addr.street" class="w-full pl-9 h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block text-xs text-gray-700 mb-1">City</label>
                    <div class="relative">
                      <input v-model="addr.city" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F] pr-8 cursor-pointer" />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </div>
                  </div>
                  <div class="w-1/3">
                    <label class="block text-xs text-gray-700 mb-1">State</label>
                    <div class="relative">
                      <input v-model="addr.state" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F] pr-8 cursor-pointer" />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </div>
                  </div>
                  <div class="w-1/3">
                    <label class="block text-xs text-gray-700 mb-1">ZIP Code</label>
                    <input v-model="addr.zip" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="profile.communicationAddresses.length === 0 && !isEditing" class="text-sm text-gray-500 italic py-2">
              No communication addresses added.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Related Entities -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">Related Entities</h3>
        <button v-if="isEditing" @click="openEntityModal()" class="text-xs bg-[#00896F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#00705a] transition-colors flex items-center gap-1.5 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Entity
        </button>
      </div>
      <div class="space-y-3">
        <div v-for="(entity, index) in profile.relatedEntities" :key="index" class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center justify-between gap-4 transition-all">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-[#E6F6F2] flex items-center justify-center text-[#00896F] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ entity.name }}</p>
              <p class="text-sm text-gray-600">{{ entity.type }} • EIN: {{ entity.ein }}</p>
            </div>
          </div>
          <div v-if="isEditing" class="flex gap-2">
            <button @click="openEntityModal(index)" class="text-gray-500 hover:text-[#00896F] p-1.5 rounded-md hover:bg-[#E6F6F2] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
            </button>
            <button @click="deleteEntity(index)" class="text-gray-500 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Key Contacts -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">Key Contacts</h3>
        <button v-if="isEditing" @click="openContactModal()" class="text-xs bg-[#00896F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#00705a] transition-colors flex items-center gap-1.5 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Contact
        </button>
      </div>
      <div class="space-y-3">
        <div v-for="(contact, index) in profile.keyContacts" :key="index" class="bg-[#EBFAF680] border border-[#E9F3F0] rounded-xl p-4 flex items-center justify-between gap-4 transition-all">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0" style="background: linear-gradient(180deg, #013E32 0%, #007760 100%);">
               {{ profile.firstName?.substring(0, 2).toUpperCase() || 'NA' }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ contact.name }}</p>
              <p class="text-sm text-gray-600">{{ contact.role }}</p>
              <p class="text-xs text-gray-500">{{ contact.email }} • {{ contact.phone }}</p>
            </div>
          </div>
          <div v-if="isEditing" class="flex gap-2">
            <button @click="openContactModal(index)" class="text-gray-500 hover:text-[#00896F] p-1.5 rounded-md hover:bg-[#E6F6F2] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
            </button>
            <button @click="deleteContact(index)" class="text-gray-500 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Entity Modal -->
    <div v-if="entityModal.isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#E6F6F2] flex items-center justify-center text-[#00896F]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ entityModal.isEdit ? 'Edit' : 'Add' }} Related Entity</h3>
              <p class="text-sm text-gray-500">{{ entityModal.isEdit ? 'Edit related' : 'Add a new related' }} business entity</p>
            </div>
          </div>
          <button @click="closeEntityModal" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">Entity Name</label>
            <input v-model="entityModal.data.name" placeholder="Enter entity name" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Entity Type</label>
            <select v-model="entityModal.data.type" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F] appearance-none">
              <option value="">Select Type</option>
              <option value="Division">Division</option>
              <option value="Subsidiary">Subsidiary</option>
              <option value="Affiliate">Affiliate</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">EIN (Employer Identification Number)</label>
            <input v-model="entityModal.data.ein" @input="formatEntityEIN" placeholder="XX-XXXXXXX" maxlength="10" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            <p class="text-xs text-gray-400 mt-1">Format: 12-3456789</p>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">State of Formation</label>
            <input v-model="entityModal.data.state" placeholder="e.g., Delaware, New York" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Formation Date</label>
            <input type="date" v-model="entityModal.data.date" @click="$event.target.showPicker && $event.target.showPicker()" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F] cursor-pointer" />
          </div>
          <div class="bg-[#F2FAF8] text-[#00896F] text-sm p-3 rounded-lg border border-[#E9F3F0]">
            <strong>Note:</strong> All fields marked with asterisk (*) are required.
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button @click="closeEntityModal" class="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button @click="saveEntityModal" class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
            {{ entityModal.isEdit ? 'Save' : 'Add' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div v-if="contactModal.isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#E6F6F2] flex items-center justify-center text-[#00896F]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ contactModal.isEdit ? 'Edit' : 'Add' }} Key Contact</h3>
              <p class="text-sm text-gray-500">{{ contactModal.isEdit ? 'Edit key contact' : 'Add a new key contact' }} person</p>
            </div>
          </div>
          <button @click="closeContactModal" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">Full Name</label>
            <input v-model="contactModal.data.name" placeholder="Enter full name" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Role / Position</label>
            <input v-model="contactModal.data.role" placeholder="e.g., CFO, Tax Manager" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Email Address</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              </span>
              <input v-model="contactModal.data.email" type="email" placeholder="email@example.com" class="w-full pl-9 bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Phone Number</label>
            <div class="relative">
               <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
               </span>
               <input v-model="contactModal.data.phone" placeholder="(555) 123-4567" class="w-full pl-9 bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Department</label>
            <input v-model="contactModal.data.department" placeholder="e.g., Finance, Legal" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Notes (Optional)</label>
            <textarea v-model="contactModal.data.notes" placeholder="Additional notes about this contact..." rows="3" class="w-full h-[40px] bg-white border border-[#04C18F] placeholder-[#ccc] text-[#000] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00896F] resize-none"></textarea>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
          <button @click="closeContactModal" class="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button @click="saveContactModal" class="px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
            {{ contactModal.isEdit ? 'Save' : 'Add' }}
          </button>
        </div>
      </div>
    </div>

    </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfile } from '~/composables/settings/useProfile'

const { profile, pictureUrl, loading, saving, error, fetchProfile, saveProfile, uploadPicture } = useProfile()

const isEditing = ref(false)

onMounted(() => fetchProfile())

async function handleSave() {
  if (!profile.value) return
  try {
    await saveProfile(profile.value)
    isEditing.value = false
  } catch {
    // error is stored in composable error ref
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    await uploadPicture(target.files[0])
  }
}

const addCommunicationAddress = () => {
  profile.value.communicationAddresses.push({
    label: `Address ${profile.value.communicationAddresses.length + 1}`,
    street: '',
    city: '',
    state: '',
    zip: ''
  })
}

const removeCommunicationAddress = (index: number) => {
  profile.value.communicationAddresses.splice(index, 1)
}

// Entity Modal
const entityModal = ref({
  isOpen: false,
  isEdit: false,
  editIndex: -1,
  data: { name: '', type: '', ein: '', state: '', date: '' }
})

const openEntityModal = (index = -1) => {
  if (index >= 0) {
    entityModal.value.isEdit = true
    entityModal.value.editIndex = index
    entityModal.value.data = { ...profile.value.relatedEntities[index] }
  } else {
    entityModal.value.isEdit = false
    entityModal.value.editIndex = -1
    entityModal.value.data = { name: '', type: '', ein: '', state: '', date: '' }
  }
  entityModal.value.isOpen = true
}

const formatEntityEIN = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let val = target.value.replace(/\D/g, '');
  if (val.length > 2) {
    val = val.substring(0, 2) + '-' + val.substring(2, 9);
  }
  entityModal.value.data.ein = val;
}

const closeEntityModal = () => {
  entityModal.value.isOpen = false
}

const saveEntityModal = () => {
  if (entityModal.value.isEdit) {
    profile.value.relatedEntities[entityModal.value.editIndex] = { ...entityModal.value.data }
  } else {
    profile.value.relatedEntities.push({ ...entityModal.value.data })
  }
  closeEntityModal()
}

const deleteEntity = (index: number) => {
  profile.value.relatedEntities.splice(index, 1)
}

// Contact Modal
const contactModal = ref({
  isOpen: false,
  isEdit: false,
  editIndex: -1,
  data: { name: '', role: '', email: '', phone: '', department: '', notes: '' }
})

const openContactModal = (index = -1) => {
  if (index >= 0) {
    contactModal.value.isEdit = true
    contactModal.value.editIndex = index
    contactModal.value.data = { ...profile.value.keyContacts[index] }
  } else {
    contactModal.value.isEdit = false
    contactModal.value.editIndex = -1
    contactModal.value.data = { name: '', role: '', email: '', phone: '', department: '', notes: '' }
  }
  contactModal.value.isOpen = true
}

const closeContactModal = () => {
  contactModal.value.isOpen = false
}

const saveContactModal = () => {
  const initials = contactModal.value.data.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'NA'

  const newContact = { ...contactModal.value.data, initials }

  if (contactModal.value.isEdit) {
    profile.value.keyContacts[contactModal.value.editIndex] = newContact
  } else {
    profile.value.keyContacts.push(newContact)
  }
  closeContactModal()
}

const deleteContact = (index: number) => {
  profile.value.keyContacts.splice(index, 1)
}
</script>
