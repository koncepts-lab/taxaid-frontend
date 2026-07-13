<template>
  <div class="space-y-6">
    <!-- Header (hidden while a client config is open — SPA takeover) -->
    <div v-if="!clientDetailOpen">
      <h1 class="text-2xl font-medium text-[#013E32]">User & System Access Management</h1>
      <p class="text-gray-500 mt-1">Centralized admin control to manage users and access across all dashboards.</p>
    </div>

    <!-- Top 4 Summary Cards -->
    <div v-if="!clientDetailOpen" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Total Users</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">{{ stats.total_users ?? 0 }}</div>
        <div class="text-xs text-gray-400">Across all systems</div>
      </div>

      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Active Roles</span>
          <img src="/images/icons/Active-Roles.svg" alt="Active Roles" class="w-[18px] h-[18px]" />
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">{{ stats.total_roles ?? 0 }}</div>
        <div class="text-xs text-gray-400">Unique role types</div>
      </div>

      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Connected Systems</span>
          <img src="/images/icons/Connected-Systems.svg" alt="Connected Systems" class="w-[18px] h-[18px]" />
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">5</div>
        <div class="text-xs text-gray-400 truncate">Admin, Ticketing, Revenue, Implementation, Review</div>
      </div>

      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Access Permissions</span>
          <img src="/images/icons/Access-Permissions.svg" alt="Access Permissions" class="w-[18px] h-[18px]" />
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">{{ stats.total_assigned_systems ?? 0 }}</div>
        <div class="text-xs text-gray-400">Total system assignments</div>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="!clientDetailOpen" class="flex items-center gap-2 text-sm mt-8 bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto">
      <button @click="setTab('User Management')" :class="activeTab === 'User Management' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">User Management</button>
      <button @click="setTab('System Access Control')" :class="activeTab === 'System Access Control' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">System Access Control</button>
      <button @click="setTab('Partner Management'); loadPartners()" :class="activeTab === 'Partner Management' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">Partner Management</button>
      <button @click="setTab('Tenants Management')" :class="activeTab === 'Tenants Management' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">Tenants Management</button>
    </div>

    <!-- User Management Tab -->
    <div v-if="activeTab === 'User Management'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-[10px] p-5 relative shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Active Users</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#16A34A]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#1a1a1a]">{{ stats.active_users ?? 0 }}</div>
        </div>
        <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-5 relative shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Inactive Users</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#DC2626]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#1a1a1a]">{{ stats.inactive_users ?? 0 }}</div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="searchQuery" type="text" placeholder="Search by name, email or role..." autocomplete="off" class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <select v-model="roleFilter" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Roles</option>
              <option v-for="r in roles" :key="r.id" :value="r.name">{{ r.name }}</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>

          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <select v-model="statusFilter" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>

          <button @click="showAddUserModal = true" class="bg-[#007C65] text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add New User
          </button>
        </div>
      </div>

      <!-- User Table -->
      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-6">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Name</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Email</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Contact No.</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Role</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Department</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Created</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="loading"><td colspan="8" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!filteredUsers.length"><td colspan="8" class="py-10 text-center text-gray-400">No users found.</td></tr>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">{{ user.full_name }}</td>
                <td class="py-4 px-6">{{ user.email }}</td>
                <td class="py-4 px-6">{{ user.phone_number ?? '—' }}</td>
                <td class="py-4 px-6">
                  <span :class="roleBadgeClass(user.role?.name)" class="inline-flex rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ user.role?.name ?? '—' }}</span>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">{{ user.department?.name ?? '—' }}</span>
                </td>
                <td class="py-4 px-6">
                  <span v-if="user.status === 'active'" class="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full px-2.5 py-1 text-[13px] font-medium whitespace-nowrap">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Active
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] rounded-full px-2.5 py-1 text-[13px] font-medium whitespace-nowrap">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                    Inactive
                  </span>
                </td>
                <td class="py-4 px-6">{{ formatDate(user.created_at) }}</td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(user)" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <template v-if="!isSelf(user.id)">
                      <button @click="handleToggleStatus(user)" :title="user.status === 'active' ? 'Deactivate' : 'Activate'" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                        <svg v-if="user.status === 'active'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                      </button>
                      <button @click="openDeleteModal(user)" class="inline-flex items-center justify-center border border-red-200 rounded-md p-1.5 hover:bg-red-50 text-red-500 transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- System Access Control Tab -->
    <div v-else-if="activeTab === 'System Access Control'">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        <div class="bg-[#EFF6FF] border border-[#BEDBFF] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#0369A1] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Ticketing</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div class="text-3xl font-semibold text-[#0369A1]">{{ systemCounts.ticketing_dashboard ?? 0 }}</div>
          <div class="text-xs text-[#0369A1] opacity-80 mt-1">Active Users</div>
        </div>
        <div class="bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#16A34A] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Revenue</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <div class="text-3xl font-semibold text-[#16A34A]">{{ systemCounts.revenue_dashboard ?? 0 }}</div>
          <div class="text-xs text-[#16A34A] opacity-80 mt-1">Active Users</div>
        </div>
        <div class="bg-[#FAF5FF] border border-[#E9D4FF] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#9333EA] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Implementation</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><polyline points="9 14 11 16 15 12"></polyline></svg>
          </div>
          <div class="text-3xl font-semibold text-[#9333EA]">{{ systemCounts.implementation_dashboard ?? 0 }}</div>
          <div class="text-xs text-[#9333EA] opacity-80 mt-1">Active Users</div>
        </div>
        <div class="bg-[#FFF7ED] border border-[#FFD6A8] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#C2410C] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Review</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#C2410C]">{{ systemCounts.review_dashboard ?? 0 }}</div>
          <div class="text-xs text-[#C2410C] opacity-80 mt-1">Active Users</div>
        </div>
        <div class="bg-[#FEF2F2] border border-[#FFC9C9] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#DC2626] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Admin</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#DC2626]">{{ systemCounts.admin_dashboard ?? 0 }}</div>
          <div class="text-xs text-[#DC2626] opacity-80 mt-1">Active Users</div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="searchQuery" type="text" placeholder="Search by name, email or role..." autocomplete="off" class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <select v-model="roleFilter" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Roles</option>
              <option v-for="r in roles" :key="r.id" :value="r.name">{{ r.name }}</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <select v-model="dashboardFilter" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Dashboards</option>
              <option v-for="db in dashboards" :key="db.id" :value="db.name">{{ db.name }}</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>
        </div>
      </div>

      <!-- System Access Table -->
      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-6">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">User</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Role</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Department</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Dashboard Access</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="loading"><td colspan="5" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!systemFilteredUsers.length"><td colspan="5" class="py-10 text-center text-gray-400">No users found.</td></tr>
              <tr v-for="user in systemFilteredUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>{{ user.full_name }}</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">{{ user.email }}</div>
                </td>
                <td class="py-4 px-6">
                  <span :class="roleBadgeClass(user.role?.name)" class="inline-flex rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">{{ user.role?.name ?? '—' }}</span>
                </td>
                <td class="py-4 px-6 text-gray-800">{{ user.department?.name ?? '—' }}</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span v-if="!user.assigned_systems?.length" class="text-gray-400 text-[13px]">No access</span>
                    <span v-for="sys in user.assigned_systems" :key="sys" class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc] text-[13px]">{{ sys }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="openConfigureModal(user)" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Partner Management Tab -->
    <div v-else-if="activeTab === 'Partner Management'">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px] p-5 shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Total Partners</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#3B82F6]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-gray-800">{{ partnerStats.total ?? 0 }}</div>
        </div>
        <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-[10px] p-5 shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Active Partners</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#16A34A]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-gray-800">{{ partnerStats.active ?? 0 }}</div>
        </div>
        <div class="bg-[#FFF7ED] border border-[#FED7AA] rounded-[10px] p-5 shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Partnered Clients</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#F97316]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-gray-800">{{ partnerStats.partnered_clients ?? 0 }}</div>
        </div>
      </div>

      <!-- Delete info notice -->
      <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-6 text-sm text-amber-800">
        <svg class="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>To delete a partner, you must first <strong>unlink all their clients</strong> and <strong>deactivate</strong> the partner account.</span>
      </div>
      <!-- Delete info notice -->      

      <!-- Search & Filter -->
      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="partnerSearch" @input="debouncedPartnerLoad" type="text" placeholder="Search by name, email or code..." autocomplete="off" class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="flex items-center gap-2">
          <button v-for="f in ['all','active','inactive']" :key="f" @click="partnerStatusFilter = f; loadPartners()" :class="partnerStatusFilter === f ? 'bg-[#007C65] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'" class="px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors shadow-sm">{{ f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) }}</button>
        </div>
      </div>

      <!-- Partners Table -->
      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-6">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Name</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Email</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Phone</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Added Date</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-center">Partner Clients</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="partnerLoading"><td colspan="7" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!partners.length"><td colspan="7" class="py-10 text-center text-gray-400">No partners found.</td></tr>
              <tr v-for="p in partners" :key="p.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 font-medium text-gray-800">{{ p.name }}</td>
                <td class="py-4 px-6">{{ p.email }}</td>
                <td class="py-4 px-6">{{ p.contact_phone ?? '—' }}</td>
                <td class="py-4 px-6">{{ formatDate(p.created_at) }}</td>
                <td class="py-4 px-6">
                  <span v-if="p.is_active" class="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full px-2.5 py-1 text-[13px] font-medium">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg> Active
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5 bg-[#FEE2E2] text-[#DC2626] rounded-full px-2.5 py-1 text-[13px] font-medium">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg> Inactive
                  </span>
                </td>
                <td class="py-4 px-6 text-center">
                  <button @click="openPartnerClientsModal(p)" class="inline-flex items-center gap-1.5 border border-[#007C65] text-[#007C65] px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#F0FDF4] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    View ({{ p.clients_count ?? 0 }})
                  </button>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openPartnerConfigModal(p)" title="Configure" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                    <button @click="confirmDeletePartner(p)" :disabled="p.is_active || p.clients_count > 0" :title="p.is_active ? 'Deactivate first' : p.clients_count > 0 ? 'Unlink all clients first' : 'Delete'" :class="(p.is_active || p.clients_count > 0) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-red-50 text-red-500'" class="inline-flex items-center justify-center border border-red-200 rounded-md p-1.5 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tenants Management Tab — reusable component (review team can reuse) -->
    <AdminClientTenants v-else-if="activeTab === 'Tenants Management'" />

    <!-- Partner Clients Modal -->
    <div v-if="showPartnerClientsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[560px] max-w-full flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-[17px] font-semibold text-gray-900">Partner Clients</h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ activePartner?.name }}</p>
          </div>
          <button @click="showPartnerClientsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="overflow-y-auto" style="max-height: 420px;">
          <div v-if="partnerClientsLoading" class="py-10 text-center text-gray-400 text-sm">Loading...</div>
          <div v-else-if="!partnerClients.length" class="py-10 text-center text-gray-400 text-sm">No clients linked.</div>
          <table v-else class="w-full text-sm text-left">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="text-gray-500 text-xs uppercase">
                <th class="py-3 px-6 font-medium">Company</th>
                <th class="py-3 px-6 font-medium">Email</th>
                <th class="py-3 px-6 font-medium">Added</th>
                <th class="py-3 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in partnerClients" :key="c.user_id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-3 px-6 font-medium text-gray-800">{{ c.company_name ?? '—' }}</td>
                <td class="py-3 px-6 text-gray-600">{{ c.email ?? '—' }}</td>
                <td class="py-3 px-6 text-gray-500">{{ c.assigned_at ?? '—' }}</td>
                <td class="py-3 px-6 text-right">
                  <button @click="confirmUnlinkClient(c)" class="text-red-500 hover:text-red-700 text-[13px] font-medium transition-colors">Unlink</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">{{ partnerClients.length }} client(s) linked</div>
      </div>
    </div>

    <!-- Unlink Client Confirmation -->
    <div v-if="showUnlinkConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[420px] max-w-full text-center px-8 py-8 relative">
        <div class="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4 text-red-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
        </div>
        <h3 class="text-[18px] font-semibold text-gray-900 mb-2">Unlink Client?</h3>
        <p class="text-gray-500 text-sm mb-1"><span class="font-medium text-gray-800">{{ clientToUnlink?.company_name }}</span></p>
        <p class="text-red-500 text-[13px] mb-6">This action cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button @click="showUnlinkConfirm = false" class="px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button @click="handleUnlinkClient" class="px-5 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Yes, Unlink</button>
        </div>
      </div>
    </div>

    <!-- Partner Config Modal (status toggle + password reset) -->
    <div v-if="showPartnerConfigModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[480px] max-w-full flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-[17px] font-semibold text-gray-900">Configure Partner</h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ activePartner?.name }}</p>
          </div>
          <button @click="showPartnerConfigModal = false" class="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-6 space-y-5">
          <!-- Toggle Status -->
          <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div class="text-[14px] font-semibold text-gray-800">Account Status</div>
              <div class="text-[13px] text-gray-500 mt-0.5">Currently <span :class="activePartner?.is_active ? 'text-[#065F46]' : 'text-red-500'" class="font-medium">{{ activePartner?.is_active ? 'Active' : 'Inactive' }}</span></div>
            </div>
            <button @click="confirmPartnerToggle" :class="activePartner?.is_active ? 'bg-[#FEE2E2] text-red-600 hover:bg-red-100' : 'bg-[#D1FAE5] text-[#065F46] hover:bg-green-100'" class="px-4 py-2 rounded-md text-sm font-medium transition-colors">
              {{ activePartner?.is_active ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
          <!-- Password Reset via Email -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="text-[14px] font-semibold text-gray-800 mb-1">Reset Password</div>
            <p class="text-[13px] text-gray-500 mb-3">Send a password reset link to <span class="font-medium text-gray-700">{{ activePartner?.email }}</span>. The link expires in 30 minutes.</p>
            <div v-if="resetEmailSent" class="flex items-center gap-2 bg-[#D1FAE5] text-[#065F46] rounded-md px-4 py-2.5 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Reset email sent successfully!
            </div>
            <button v-else @click="handleSendPartnerResetEmail" :disabled="resetEmailSending" class="w-full bg-[#007C65] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#006A56] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2">
              <svg v-if="resetEmailSending" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              {{ resetEmailSending ? 'Sending...' : 'Send Reset Email' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Partner Status Toggle Confirmation -->
    <div v-if="showPartnerToggleConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[380px] max-w-full text-center px-8 py-8">
        <h3 class="text-[18px] font-semibold text-gray-900 mb-2">{{ activePartner?.is_active ? 'Deactivate' : 'Activate' }} Partner?</h3>
        <p class="text-gray-500 text-sm mb-6">{{ activePartner?.is_active ? 'This will prevent the partner from logging in.' : 'This will restore the partner\'s access.' }}</p>
        <div class="flex gap-3 justify-center">
          <button @click="showPartnerToggleConfirm = false" class="px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button @click="handlePartnerToggle" class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56] transition-colors">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Delete Partner Confirmation -->
    <div v-if="showDeletePartnerConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[420px] max-w-full text-center px-8 py-8 relative">
        <div class="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4 text-red-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </div>
        <h3 class="text-[18px] font-semibold text-gray-900 mb-2">Delete Partner?</h3>
        <p class="text-gray-500 text-sm mb-6">This will permanently remove <span class="font-medium text-gray-800">{{ partnerToDelete?.name }}</span> and cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDeletePartnerConfirm = false" class="px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button @click="handleDeletePartner" class="px-5 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Yes, Delete</button>
        </div>
      </div>
    </div>

    <!-- Configure Dashboard Access Modal -->
    <div v-if="showConfigureModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[600px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-[19px] font-semibold text-gray-900">Configure Dashboard Access</h2>
          <button @click="showConfigureModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex items-center gap-4 mb-6">
            <div class="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-semibold text-lg">{{ configureUser?.full_name?.charAt(0) ?? '?' }}</div>
            <div>
              <div class="text-gray-900 font-semibold text-[15px]">{{ configureUser?.full_name }}</div>
              <div class="text-gray-500 text-xs mt-0.5">{{ configureUser?.email }}</div>
            </div>
          </div>
          <div class="mb-4">
            <h3 class="text-[15px] font-semibold text-gray-900">Available Dashboards</h3>
            <p class="text-gray-500 text-[13px] mt-0.5">Select the dashboards this user should be able to view and access</p>
          </div>
          <div class="space-y-3">
            <label v-for="db in dashboards" :key="db.id" :class="['border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors', selectedDashboards.includes(db.name) ? 'bg-[#F0FDF4] border-[#86EFAC]' : 'border-gray-200 hover:border-gray-300 bg-white']">
              <input type="checkbox" :value="db.name" v-model="selectedDashboards" class="w-[18px] h-[18px] rounded border border-gray-300 bg-white accent-[#007C65] mt-0.5 cursor-pointer shadow-sm" />
              <div class="flex-1">
                <div class="text-[14px] font-semibold text-gray-900">{{ db.name }}</div>
              </div>
              <div v-if="selectedDashboards.includes(db.name)" class="text-[#007C65]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
            </label>
          </div>
          <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 mt-6">
            <div class="flex items-center gap-2 text-[#0369A1] font-medium text-sm mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              {{ selectedDashboards.length }} Dashboards Selected
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
          <button @click="showConfigureModal = false" class="px-5 py-2 rounded-md border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="handleSaveConfigure" class="bg-[#007C65] text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Permissions
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[600px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-5 flex items-center justify-between">
          <h2 class="text-[19px] font-semibold text-gray-900">Edit User</h2>
          <button @click="showEditUserModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="px-6 py-2 overflow-y-auto space-y-5">
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Full Name *</label>
            <input v-model="editUserForm.full_name" type="text" placeholder="Enter full name" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
          </div>
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Email Address *</label>
            <input v-model="editUserForm.email" type="email" placeholder="user@taxaid.com" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
          </div>
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Phone Number</label>
            <input v-model="editUserForm.phone_number" type="text" placeholder="+1 (555) 000-0000" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
          </div>
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">User Role *</label>
            <div class="relative">
              <select v-model="editUserForm.admin_role_id" class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                <option :value="null" disabled>Select Role</option>
                <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
            </div>
          </div>
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Department</label>
            <div class="relative">
              <select v-model="editUserForm.department_id" class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                <option :value="null">No Department</option>
                <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
            </div>
          </div>
        </div>
        <div class="px-6 py-5 flex items-center justify-end gap-3 bg-white mt-2">
          <button @click="showEditUserModal = false" class="px-5 py-2 rounded-md border border-gray-200 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="handleEditUser" class="bg-[#007C65] text-white px-5 py-2 rounded-md font-medium text-[14px] flex items-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Delete User Modal -->
    <div v-if="showDeleteUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[450px] max-w-full overflow-hidden flex flex-col relative text-center p-8">
        <button @click="showDeleteUserModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-5 text-[#EF4444]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </div>
        <h2 class="text-[22px] font-semibold text-gray-900 mb-3">Delete User?</h2>
        <p class="text-gray-600 text-[15px] px-4 mb-8 leading-relaxed">This user will be removed and will no longer have access to the system.</p>
        <div class="flex items-center justify-center gap-4">
          <button @click="showDeleteUserModal = false" class="px-6 py-2.5 rounded-md border border-gray-200 text-gray-700 text-[15px] font-medium hover:bg-gray-50 transition-colors bg-white">Cancel</button>
          <button @click="handleDeleteUser" class="bg-[#007C65] text-white px-6 py-2.5 rounded-md font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm min-w-[160px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Success Modal -->
    <div v-if="showDeleteSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[450px] max-w-full overflow-hidden flex flex-col relative text-center px-8 py-10">
        <button @click="showDeleteSuccessModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-5 text-[#EF4444]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 class="text-[22px] font-semibold text-gray-900 mb-3">User deleted successfully</h2>
        <p class="text-gray-600 text-[15px] px-4 leading-relaxed">The user has been removed and no longer has access to the system.</p>
      </div>
    </div>

    <!-- Add New User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[650px] max-w-full overflow-hidden flex flex-col max-h-[95vh]">
        <div class="px-8 py-6 flex items-center justify-between">
          <h2 class="text-[20px] font-semibold text-gray-900">Add New User</h2>
          <button @click="closeAddUserModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="px-8 py-2 overflow-y-auto min-h-[300px]">
          <!-- Stepper -->
          <div class="relative flex justify-between items-start mt-2 mb-8 mx-4">
            <div class="absolute top-[14px] left-6 right-6 h-[2px] bg-gray-200 z-0"></div>
            <div class="absolute top-[14px] left-6 h-[2px] bg-[#007C65] z-0 transition-all duration-300" :style="{ width: addUserStep === 1 ? '0%' : addUserStep === 2 ? '50%' : '100%' }"></div>
            <div class="relative z-10 flex flex-col items-center gap-2">
              <div class="w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-medium shadow-[0_0_0_4px_white] transition-colors" :class="addUserStep >= 1 ? 'bg-[#007C65]' : 'bg-gray-200'">01</div>
              <div class="text-[14px] font-medium transition-colors" :class="addUserStep >= 1 ? 'text-[#007C65]' : 'text-gray-400'">User Info</div>
            </div>
            <div class="relative z-10 flex flex-col items-center gap-2">
              <div class="w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-medium shadow-[0_0_0_4px_white] transition-colors" :class="addUserStep >= 2 ? 'bg-[#007C65]' : 'bg-gray-200'">02</div>
              <div class="text-[14px] font-medium transition-colors" :class="addUserStep >= 2 ? 'text-[#007C65]' : 'text-gray-400'">System Access</div>
            </div>
            <div class="relative z-10 flex flex-col items-center gap-2">
              <div class="w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-medium shadow-[0_0_0_4px_white] transition-colors" :class="addUserStep >= 3 ? 'bg-[#007C65]' : 'bg-gray-200'">03</div>
              <div class="text-[14px] font-medium transition-colors" :class="addUserStep >= 3 ? 'text-[#007C65]' : 'text-gray-400'">Review</div>
            </div>
          </div>

          <!-- Step 1: User Info -->
          <div v-show="addUserStep === 1" class="space-y-5">
            <div class="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex items-start gap-3">
              <svg class="text-[#D97706] mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <div class="text-[#92400E] font-semibold text-[15px] mb-1">Create New User Account</div>
                <div class="text-[#92400E] text-[14px] opacity-90">Add a new user. Login details will be sent via email with assigned access.</div>
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-900 mb-2">Full Name *</label>
              <input v-model="newUserForm.full_name" type="text" placeholder="Enter full name" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-900 mb-2">Email Address *</label>
              <input v-model="newUserForm.email" type="email" placeholder="user@taxaid.com" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-900 mb-2">Phone Number (Optional)</label>
              <input v-model="newUserForm.phone_number" type="text" placeholder="+1 (555) 000-0000" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-900 mb-2">User Role *</label>
              <div class="relative">
                <select v-model="newUserForm.admin_role_id" class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                  <option :value="null" disabled>Select Role</option>
                  <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
              </div>
              <p class="text-[13px] text-gray-500 mt-1.5">Role determines default dashboard access and permissions</p>
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-900 mb-2">Department</label>
              <div class="relative">
                <select v-model="newUserForm.department_id" class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                  <option :value="null">No Department</option>
                  <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-900 mb-2">Initial Password *</label>
              <input v-model="newUserForm.password" type="password" placeholder="Min. 6 characters" autocomplete="new-password" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
              <p class="text-[13px] text-gray-500 mt-2">User must change password on first login</p>
            </div>
          </div>

          <!-- Step 2: System Access -->
          <div v-show="addUserStep === 2" class="space-y-6 pb-4">
            <div class="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex items-start gap-3">
              <svg class="text-[#D97706] mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <div class="text-[#92400E] font-semibold text-[15px] mb-1">Assign System Access</div>
                <div class="text-[#92400E] text-[14px] opacity-90">Select which systems this user can access. You can modify these permissions later.</div>
              </div>
            </div>
            <div>
              <h3 class="text-[16px] font-semibold text-gray-900">Available Dashboards</h3>
              <p class="text-gray-500 text-[14px] mt-0.5 mb-4">Select the dashboards this user should be able to view and access</p>
              <div class="space-y-3">
                <label v-for="db in dashboards" :key="db.id" :class="['border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors', selectedDashboards.includes(db.name) ? 'bg-[#F0FDF4] border-[#86EFAC]' : 'border-gray-200 hover:border-gray-300 bg-white']">
                  <input type="checkbox" :value="db.name" v-model="selectedDashboards" class="w-[18px] h-[18px] rounded border border-gray-300 bg-white accent-[#007C65] mt-0.5 cursor-pointer shadow-sm" />
                  <div class="flex-1">
                    <div class="text-[14px] font-semibold text-gray-900">{{ db.name }}</div>
                  </div>
                  <div v-if="selectedDashboards.includes(db.name)" class="text-[#007C65]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                </label>
              </div>
              <p class="text-[13px] text-gray-500 mt-3">{{ selectedDashboards.length }} systems selected</p>
            </div>
          </div>

          <!-- Step 3: Review -->
          <div v-show="addUserStep === 3" class="space-y-6 pb-4">
            <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-4 flex items-start gap-3">
              <svg class="text-[#007C65] mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <div>
                <div class="text-[#007C65] font-semibold text-[15px] mb-1">Ready to Create User</div>
                <div class="text-[#007C65] text-[14px] opacity-90">Review the information and confirm to create the user account with system access.</div>
              </div>
            </div>
            <div class="border border-gray-200 rounded-xl p-5">
              <h3 class="text-[16px] font-semibold text-gray-900 mb-5">User Information</h3>
              <div class="space-y-4 text-[14px]">
                <div class="flex items-center justify-between"><span class="text-gray-500">Full Name</span><span class="text-gray-900 font-medium">{{ newUserForm.full_name || '—' }}</span></div>
                <div class="flex items-center justify-between"><span class="text-gray-500">Email Address</span><span class="text-gray-900 font-medium">{{ newUserForm.email || '—' }}</span></div>
                <div class="flex items-center justify-between"><span class="text-gray-500">Phone Number</span><span class="text-gray-900 font-medium">{{ newUserForm.phone_number || '—' }}</span></div>
                <div class="flex items-center justify-between"><span class="text-gray-500">Role</span><span class="text-gray-900 font-medium">{{ roles.find(r => r.id === newUserForm.admin_role_id)?.name || '—' }}</span></div>
                <div class="flex items-center justify-between"><span class="text-gray-500">Department</span><span class="text-gray-900 font-medium">{{ departments.find(d => d.id === newUserForm.department_id)?.name || '—' }}</span></div>
              </div>
            </div>
            <div class="border border-gray-200 rounded-xl p-5">
              <h3 class="text-[16px] font-semibold text-gray-900 mb-5">System Access</h3>
              <div class="flex items-center justify-between text-[14px]">
                <span class="text-gray-500">Assigned Systems</span>
                <div class="flex items-center gap-2 flex-wrap justify-end">
                  <span v-if="!selectedDashboards.length" class="text-gray-400">None</span>
                  <span v-for="sys in selectedDashboards" :key="sys" class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc] text-[12px]">{{ sys }}</span>
                </div>
              </div>
            </div>
            <div class="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex items-start gap-3">
              <svg class="text-[#D97706] mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <div>
                <div class="text-[#92400E] font-semibold text-[15px] mb-1">Welcome Email</div>
                <div class="text-[#92400E] text-[14px] opacity-90">User will receive an email with login credentials and links to access their assigned systems.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 bg-white mt-2 flex items-center justify-between gap-4 border-t border-gray-100">
          <button v-if="addUserStep > 1" @click="addUserStep--" class="w-1/2 py-2.5 rounded-md border border-gray-200 text-gray-700 text-[15px] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </button>
          <button v-if="addUserStep < 3" @click="addUserStep++" :class="addUserStep === 1 ? 'w-full' : 'w-1/2'" class="bg-[#007C65] text-white py-2.5 rounded-md font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
            Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <button v-if="addUserStep === 3" @click="handleCreateUser" class="w-1/2 bg-[#007C65] text-white py-2.5 rounded-md font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Create User
          </button>
        </div>
      </div>
    </div>

    <!-- Create Success Modal -->
    <div v-if="showCreateSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[450px] max-w-full overflow-hidden flex flex-col relative text-center px-8 py-10">
        <button @click="showCreateSuccessModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5 text-[#10B981]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 class="text-[22px] font-semibold text-gray-900 mb-3">User created successfully</h2>
        <p class="text-gray-600 text-[15px] px-4 leading-relaxed">Permissions and dashboard access have been configured.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { getMe, getStats, getSystemCounts, getUsers, createUser, updateUser, deleteUser, activateUser, deactivateUser, updateSystems, getRoles, getDepartments, getDashboards, getPartners, getPartnerClients, togglePartnerStatus, unlinkPartnerClient, deletePartner, sendPartnerResetEmail } = useSuperAdmin()

const currentAdminId = ref(null)
const isSelf = (userId) => currentAdminId.value != null && userId == currentAdminId.value

// ── Data ──────────────────────────────────────────────────────────────────────
const loading       = ref(false)
const stats         = ref({})
const systemCounts  = ref({})
const users         = ref([])
const roles         = ref([])
const departments   = ref([])
const dashboards    = ref([])

// ── Tabs & filters ────────────────────────────────────────────────────────────
const route  = useRoute()
const router = useRouter()
const tabMap = { users: 'User Management', systems: 'System Access Control', partners: 'Partner Management', clients: 'Tenants Management' }
const tabKey = { 'User Management': 'users', 'System Access Control': 'systems', 'Partner Management': 'partners', 'Tenants Management': 'clients' }
const activeTab = ref(tabMap[route.query.tab] ?? 'User Management')

// A client config is open (?tab=clients&id=N) → hide header/cards/tabs (SPA takeover)
const clientDetailOpen = computed(() =>
  activeTab.value === 'Tenants Management' && Number(route.query.id) > 0
)

function setTab(name) {
  activeTab.value = name
  router.replace({ query: { ...route.query, tab: tabKey[name] } })
}
const searchQuery    = ref('')
const roleFilter     = ref('All Roles')
const statusFilter   = ref('All Statuses')
const dashboardFilter = ref('All Dashboards')

// ── Modal state ───────────────────────────────────────────────────────────────
const showConfigureModal    = ref(false)
const showEditUserModal     = ref(false)
const showDeleteUserModal   = ref(false)
const showDeleteSuccessModal = ref(false)
const showAddUserModal      = ref(false)
const showCreateSuccessModal = ref(false)
const addUserStep           = ref(1)

// ── Focused user for modal operations ────────────────────────────────────────
const configureUser  = ref(null)
const editUser       = ref(null)
const deleteUserId   = ref(null)

// ── Shared dashboard selection (configure + add step 2) ───────────────────────
const selectedDashboards = ref([])

// ── Partner Management ────────────────────────────────────────────────────────
const partners              = ref([])
const partnerStats          = ref({})
const partnerLoading        = ref(false)
const partnerSearch         = ref('')
const partnerStatusFilter   = ref('all')
const partnerClients        = ref([])
const partnerClientsLoading = ref(false)
const activePartner         = ref(null)
const resetEmailSent        = ref(false)
const resetEmailSending     = ref(false)
const clientToUnlink        = ref(null)
const partnerToDelete       = ref(null)

const showPartnerClientsModal   = ref(false)
const showPartnerConfigModal    = ref(false)
const showPartnerToggleConfirm  = ref(false)
const showUnlinkConfirm         = ref(false)
const showDeletePartnerConfirm  = ref(false)

let partnerSearchTimer = null

async function loadPartners() {
  partnerLoading.value = true
  try {
    const res = await getPartners({ status: partnerStatusFilter.value, search: partnerSearch.value })
    partnerStats.value = res.stats ?? {}
    partners.value     = res.data ?? []
  } finally {
    partnerLoading.value = false
  }
}

function debouncedPartnerLoad() {
  clearTimeout(partnerSearchTimer)
  partnerSearchTimer = setTimeout(loadPartners, 350)
}

async function openPartnerClientsModal(partner) {
  activePartner.value         = partner
  showPartnerClientsModal.value = true
  partnerClientsLoading.value = true
  try {
    partnerClients.value = await getPartnerClients(partner.id)
  } finally {
    partnerClientsLoading.value = false
  }
}

function openPartnerConfigModal(partner) {
  activePartner.value          = partner
  resetEmailSent.value         = false
  resetEmailSending.value      = false
  showPartnerConfigModal.value = true
}

function confirmPartnerToggle() {
  showPartnerToggleConfirm.value = true
}

async function handlePartnerToggle() {
  const updated = await togglePartnerStatus(activePartner.value.id)
  const idx = partners.value.findIndex(p => p.id === activePartner.value.id)
  if (idx !== -1) partners.value[idx].is_active = updated.is_active
  activePartner.value = { ...activePartner.value, is_active: updated.is_active }
  showPartnerToggleConfirm.value = false
  await loadPartners()
}

async function handleSendPartnerResetEmail() {
  resetEmailSending.value = true
  try {
    await sendPartnerResetEmail(activePartner.value.id)
    resetEmailSent.value = true
  } finally {
    resetEmailSending.value = false
  }
}

function confirmUnlinkClient(client) {
  clientToUnlink.value   = client
  showUnlinkConfirm.value = true
}

async function handleUnlinkClient() {
  await unlinkPartnerClient(activePartner.value.id, clientToUnlink.value.user_id)
  partnerClients.value = partnerClients.value.filter(c => c.user_id !== clientToUnlink.value.user_id)
  const idx = partners.value.findIndex(p => p.id === activePartner.value.id)
  if (idx !== -1 && partners.value[idx].clients_count > 0) partners.value[idx].clients_count--
  showUnlinkConfirm.value = false
  partnerStats.value = { ...partnerStats.value, partnered_clients: (partnerStats.value.partnered_clients ?? 1) - 1 }
}

function confirmDeletePartner(partner) {
  partnerToDelete.value        = partner
  showDeletePartnerConfirm.value = true
}

async function handleDeletePartner() {
  await deletePartner(partnerToDelete.value.id)
  showDeletePartnerConfirm.value = false
  await loadPartners()
}

// ── Forms ─────────────────────────────────────────────────────────────────────
const newUserForm = ref({ full_name: '', email: '', phone_number: '', admin_role_id: null, department_id: null, password: '' })
const editUserForm = ref({ full_name: '', email: '', phone_number: '', admin_role_id: null, department_id: null })

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredUsers = computed(() => {
  let list = users.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.name?.toLowerCase().includes(q))
  }
  if (roleFilter.value !== 'All Roles') list = list.filter(u => u.role?.name === roleFilter.value)
  if (statusFilter.value !== 'All Statuses') list = list.filter(u => u.status === statusFilter.value.toLowerCase())
  return list
})

const systemFilteredUsers = computed(() => {
  let list = users.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.name?.toLowerCase().includes(q))
  }
  if (roleFilter.value !== 'All Roles') list = list.filter(u => u.role?.name === roleFilter.value)
  if (dashboardFilter.value !== 'All Dashboards') list = list.filter(u => u.assigned_systems?.includes(dashboardFilter.value))
  return list
})

// ── Load all data ─────────────────────────────────────────────────────────────
async function loadData() {
  loading.value = true
  try {
    const [meRes, statsRes, countsRes, usersRes, rolesRes, deptsRes, dashRes] = await Promise.all([
      getMe(), getStats(), getSystemCounts(), getUsers(), getRoles(), getDepartments(), getDashboards()
    ])
    currentAdminId.value = meRes?.id ?? null
    stats.value          = statsRes?.data ?? statsRes ?? {}
    systemCounts.value   = countsRes?.data ?? countsRes ?? {}
    users.value          = usersRes ?? []
    roles.value          = rolesRes ?? []
    departments.value    = deptsRes ?? []
    dashboards.value     = (dashRes ?? []).filter(d => d.name !== 'All Dashboards')
  } finally {
    loading.value = false
  }
}

// Normalize old snake_case assigned_systems values to full dashboard names
const dashboardNameMap = {
  'ticketing_dashboard':       'Ticketing Dashboard',
  'revenue_dashboard':         'Revenue Partnership Dashboard',
  'implementation_dashboard':  'Implementation Dashboard',
  'review_dashboard':          'Review Dashboard',
  'admin_dashboard':           'Admin Dashboard',
}

// ── Modal openers ─────────────────────────────────────────────────────────────
function openConfigureModal(user) {
  configureUser.value      = user
  selectedDashboards.value = (user.assigned_systems ?? []).map(s => dashboardNameMap[s] ?? s)
  showConfigureModal.value = true
}

function openEditModal(user) {
  editUser.value     = user
  editUserForm.value = { full_name: user.full_name, email: user.email, phone_number: user.phone_number ?? '', admin_role_id: user.admin_role_id, department_id: user.department_id }
  showEditUserModal.value = true
}

function openDeleteModal(user) {
  deleteUserId.value      = user.id
  showDeleteUserModal.value = true
}

// ── Handlers ──────────────────────────────────────────────────────────────────
async function handleSaveConfigure() {
  await updateSystems(configureUser.value.id, selectedDashboards.value)
  showConfigureModal.value = false
  await loadData()
}

async function handleEditUser() {
  await updateUser(editUser.value.id, editUserForm.value)
  showEditUserModal.value = false
  await loadData()
}

async function handleDeleteUser() {
  await deleteUser(deleteUserId.value)
  showDeleteUserModal.value  = false
  showDeleteSuccessModal.value = true
  await loadData()
}

async function handleToggleStatus(user) {
  if (user.status === 'active') await deactivateUser(user.id)
  else await activateUser(user.id)
  await loadData()
}

function closeAddUserModal() {
  showAddUserModal.value = false
  setTimeout(() => { addUserStep.value = 1 }, 300)
  newUserForm.value      = { full_name: '', email: '', phone_number: '', admin_role_id: null, department_id: null, password: '' }
  selectedDashboards.value = []
}

const createUserError = ref('')
async function handleCreateUser() {
  createUserError.value = ''
  try {
    await createUser({ ...newUserForm.value, assigned_systems: selectedDashboards.value })
    closeAddUserModal()
    showCreateSuccessModal.value = true
    await loadData()
  } catch (err) {
    const msg = err?.data?.message ?? ''
    const errors = err?.data?.errors
    if (errors) {
      createUserError.value = Object.values(errors).flat().join(' ')
    } else {
      createUserError.value = msg || 'Failed to create user. Please check all fields.'
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function roleBadgeClass(name) {
  const map = {
    'Admin': 'bg-[#D1FAE5] text-[#065F46]',
    'Super Admin': 'bg-[#D1FAE5] text-[#065F46]',
    'Review Manager': 'bg-[#D1FAE5] text-[#065F46]',
    'Implementation Manager': 'bg-[#D1FAE5] text-[#065F46]',
    'Implementation Consultant': 'bg-[#D1FAE5] text-[#065F46]',
    'Team Lead': 'bg-[#D1FAE5] text-[#065F46]',
    'VP': 'bg-[#E9D5FF] text-[#7E22CE]',
    'Tech Team': 'bg-[#BFDBFE] text-[#1D4ED8]',
    'Team Member': 'bg-gray-100 text-gray-600',
    'Accounts': 'bg-[#FEF08A] text-[#854D0E]',
  }
  return map[name] ?? 'bg-gray-100 text-gray-600'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(() => {
  loadData()
  if (activeTab.value === 'Partner Management') loadPartners()
})
</script>
