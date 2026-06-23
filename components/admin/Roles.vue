<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-medium text-[#013E32]">User & System Access Management</h1>
      <p class="text-gray-500 mt-1">Centralized admin control to manage users and access across all dashboards.</p>
    </div>

    <!-- Top 4 Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Total Users</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">24</div>
        <div class="text-xs text-gray-400">Across all systems</div>
      </div>

      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Active Roles</span>
          <img src="/images/icons/Active-Roles.svg" alt="Active Roles" class="w-[18px] h-[18px]" />
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">12</div>
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
        <div class="text-3xl font-semibold text-gray-800 mb-1">48</div>
        <div class="text-xs text-gray-400">Total system assignments</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 text-sm mt-8 bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto">
      <button @click="activeTab = 'User Management'" :class="activeTab === 'User Management' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">User Management</button>
      <button @click="activeTab = 'System Access Control'" :class="activeTab === 'System Access Control' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">System Access Control</button>
      <button @click="activeTab = 'Partner Management'" :class="activeTab === 'Partner Management' ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'" class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">Partner Management</button>
    </div>

    <div v-if="activeTab === 'User Management'">
      <!-- Active/Inactive User Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-[10px] p-5 relative shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Active Users</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#16A34A]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#1a1a1a]">1</div>
      </div>

      <div class="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-5 relative shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
          <span>Inactive Users</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#DC2626]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          </svg>
        </div>
        <div class="text-3xl font-semibold text-[#1a1a1a]">0</div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
      <div class="relative w-full md:w-[40%]">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input type="text" placeholder="Search by name, email or role..." class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="relative min-w-[160px]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <select class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Team Member</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>

        <div class="relative min-w-[160px]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <select class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>

        <button @click="showAddUserModal = true" class="bg-[#007C65] text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New User
        </button>
      </div>
    </div>

    <!-- Data Table -->
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
            <!-- Row 1: Admin Active -->
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-800 font-medium">Akhil Kumar</td>
              <td class="py-4 px-6">admin@taxaid.com</td>
              <td class="py-4 px-6">+123 123 1234</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Admin</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Administration</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full px-2.5 py-1 text-[13px] font-medium whitespace-nowrap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Active
                </span>
              </td>
              <td class="py-4 px-6">12/04/2026</td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="showEditUserModal = true" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </button>
                  <button @click="showDeleteUserModal = true" class="inline-flex items-center justify-center border border-red-200 rounded-md p-1.5 hover:bg-red-50 text-red-500 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Row 2: Team Member Inactive -->
            <tr class="hover:bg-gray-50/50">
              <td class="py-4 px-6 text-gray-800 font-medium">Akhil Kumar</td>
              <td class="py-4 px-6">admin@taxaid.com</td>
              <td class="py-4 px-6">+123 123 1234</td>
              <td class="py-4 px-6">
                <span class="inline-flex bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Team Member</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-3 py-1 text-[13px] whitespace-nowrap">Tech Team</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] rounded-full px-2.5 py-1 text-[13px] font-medium whitespace-nowrap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  </svg>
                  Inactive
                </span>
              </td>
              <td class="py-4 px-6">12/04/2026</td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="showEditUserModal = true" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                  </button>
                  <button @click="showDeleteUserModal = true" class="inline-flex items-center justify-center border border-red-200 rounded-md p-1.5 hover:bg-red-50 text-red-500 transition-colors">
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

    <!-- System Access Control Content -->
    <div v-else-if="activeTab === 'System Access Control'">
      <!-- 5 Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        <!-- Ticketing -->
        <div class="bg-[#EFF6FF] border border-[#BEDBFF] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#0369A1] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Ticketing</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="text-3xl font-semibold text-[#0369A1]">1</div>
          <div class="text-xs text-[#0369A1] opacity-80 mt-1">Active Users</div>
        </div>
        <!-- Revenue -->
        <div class="bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#16A34A] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Revenue</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <div class="text-3xl font-semibold text-[#16A34A]">12</div>
          <div class="text-xs text-[#16A34A] opacity-80 mt-1">Active Users</div>
        </div>
        <!-- Implementation -->
        <div class="bg-[#FAF5FF] border border-[#E9D4FF] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#9333EA] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Implementation</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <polyline points="9 14 11 16 15 12"></polyline>
            </svg>
          </div>
          <div class="text-3xl font-semibold text-[#9333EA]">5</div>
          <div class="text-xs text-[#9333EA] opacity-80 mt-1">Active Users</div>
        </div>
        <!-- Review -->
        <div class="bg-[#FFF7ED] border border-[#FFD6A8] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#C2410C] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Review</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="text-3xl font-semibold text-[#C2410C]">48</div>
          <div class="text-xs text-[#C2410C] opacity-80 mt-1">Active Users</div>
        </div>
        <!-- Admin -->
        <div class="bg-[#FEF2F2] border border-[#FFC9C9] rounded-[10px] p-4 relative shadow-sm">
          <div class="text-[#DC2626] text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Admin</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <div class="text-3xl font-semibold text-[#DC2626]">1</div>
          <div class="text-xs text-[#DC2626] opacity-80 mt-1">Active Users</div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input type="text" placeholder="Search by name, email or role..." class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </span>
            <select class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Team Member</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>

          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </span>
            <select class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Dashboards</option>
              <option>Ticketing</option>
              <option>Revenue</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Data Table -->
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
              <!-- Row 1: Admin -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Admin</span>
                </td>
                <td class="py-4 px-6 text-gray-800">Adminstration</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Admin</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>
              
              <!-- Row 2: Review Manager -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Review Manager</span>
                </td>
                <td class="py-4 px-6 text-gray-800">R&amp;D Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Ticketing</span>
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Review</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>

              <!-- Row 3: Implementation Manager -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Implementation Manager</span>
                </td>
                <td class="py-4 px-6 text-gray-800">R&amp;D Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Ticketing</span>
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Implementation</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>

              <!-- Row 4: Team Lead -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#D1FAE5] text-[#065F46] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Team Lead</span>
                </td>
                <td class="py-4 px-6 text-gray-800">Implementation Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Ticketing</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>

              <!-- Row 5: VP -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#E9D5FF] text-[#7E22CE] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">VP</span>
                </td>
                <td class="py-4 px-6 text-gray-800">Tech Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Ticketing</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>

              <!-- Row 6: Tech Team -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#BFDBFE] text-[#1D4ED8] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Tech Team</span>
                </td>
                <td class="py-4 px-6 text-gray-800">Tech Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Ticketing</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>

              <!-- Row 7: Team Member -->
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Team Member</span>
                </td>
                <td class="py-4 px-6 text-gray-800">Review Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Ticketing</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>

              <!-- Row 8: Accounts -->
              <tr class="hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800 font-medium">
                  <div>Akhil Kumar</div>
                  <div class="text-xs text-gray-500 font-normal mt-0.5">admin@taxaid.com</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#FEF08A] text-[#854D0E] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Accounts</span>
                </td>
                <td class="py-4 px-6 text-gray-800">Accounts Team</td>
                <td class="py-4 px-6">
                  <div class="flex gap-2 flex-wrap">
                    <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc]">Revenue</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">Configure</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'Partner Management'">
      <!-- Active/Inactive User Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px] p-5 relative shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Total Partners</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#3B82F6]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#1a1a1a]">12</div>
        </div>

        <div class="bg-[#F0FDF4] border border-[#86EFAC] rounded-[10px] p-5 relative shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Active Partners</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#16A34A]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#1a1a1a]">8</div>
        </div>

        <div class="bg-[#FFF7ED] border border-[#FED7AA] rounded-[10px] p-5 relative shadow-sm">
          <div class="text-gray-500 text-[13px] mb-3 font-medium flex items-center justify-between">
            <span>Partnered Clients</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#F97316]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="text-3xl font-semibold text-[#1a1a1a]">45</div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input type="text" placeholder="Search partners..." class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </span>
            <select class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option>All Statuses</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-6">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Email</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Contact Person</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Contact Phone</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Trading License</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Created</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-gray-100">
              <tr class="hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800">partner1@example.com</td>
                <td class="py-4 px-6 text-gray-800 font-medium">John Doe</td>
                <td class="py-4 px-6 text-gray-800">+1 234 567 890</td>
                <td class="py-4 px-6 text-gray-800 font-medium">#TRD-98765432</td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Pending</span>
                </td>
                <td class="py-4 px-6 text-gray-500">12/04/2026</td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button class="inline-flex items-center justify-center border border-green-200 rounded-md px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-[13px] font-medium shadow-sm">
                      Approve
                    </button>
                    <button class="inline-flex items-center justify-center border border-red-200 rounded-md px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-[13px] font-medium shadow-sm">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Second Dummy Row -->
              <tr class="hover:bg-gray-50/50">
                <td class="py-4 px-6 text-gray-800">partner2@example.com</td>
                <td class="py-4 px-6 text-gray-800 font-medium">Jane Smith</td>
                <td class="py-4 px-6 text-gray-800">+1 987 654 321</td>
                <td class="py-4 px-6 text-gray-800 font-medium">#TRD-12345678</td>
                <td class="py-4 px-6">
                  <span class="inline-flex bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC] rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap">Approved</span>
                </td>
                <td class="py-4 px-6 text-gray-500">10/04/2026</td>
                <td class="py-4 px-6 text-right">
                  <button @click="showConfigureModal = true" class="bg-[#007C65] text-white px-4 py-1.5 rounded-md font-medium text-[13px] hover:bg-[#006A56] transition-colors whitespace-nowrap shadow-sm">
                    Configure
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Configure Dashboard Access Modal -->
    <div v-if="showConfigureModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[600px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-[19px] font-semibold text-gray-900">Configure Dashboard Access</h2>
          <button @click="showConfigureModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto">
          <!-- User Info Box -->
          <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex items-center gap-4 mb-6">
            <div class="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-semibold text-lg">A</div>
            <div>
              <div class="text-gray-900 font-semibold text-[15px]">Akhil Kumar</div>
              <div class="text-gray-500 text-xs mt-0.5">admin@taxaid.com</div>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="text-[15px] font-semibold text-gray-900">Available Dashboards</h3>
            <p class="text-gray-500 text-[13px] mt-0.5">Select the dashboards this user should be able to view and access</p>
          </div>

          <!-- Options -->
          <div class="space-y-3">
            <label v-for="(db, index) in availableDashboards" :key="index" :class="['border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors', selectedDashboards.includes(db.title) ? 'bg-[#F0FDF4] border-[#86EFAC]' : 'border-gray-200 hover:border-gray-300 bg-white']">
              <div class="relative flex items-start pt-0.5">
                <input type="checkbox" :value="db.title" v-model="selectedDashboards" class="w-[18px] h-[18px] rounded border border-gray-300 bg-white text-blue-500 focus:ring-blue-500 mt-0.5 cursor-pointer shadow-sm" />
              </div>
              <div class="flex-1">
                <div class="text-[14px] font-semibold text-gray-900">{{ db.title }}</div>
                <div class="text-[13px] text-gray-500 mt-0.5">{{ db.desc }}</div>
              </div>
              <div v-if="selectedDashboards.includes(db.title)" class="text-[#007C65]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
            </label>
          </div>

          <!-- Info Box -->
          <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 mt-6">
            <div class="flex items-center gap-2 text-[#0369A1] font-medium text-sm mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              {{ selectedDashboards.length }} Dashboards Selected
            </div>
            <div class="text-[#0369A1] text-[13px] opacity-90 pl-6">
              Akhil Kumar gets instant access to selected dashboards and can switch after login.
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
          <button @click="showConfigureModal = false" class="px-5 py-2 rounded-md border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="showConfigureModal = false" class="bg-[#007C65] text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Permissions
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[600px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-5 flex items-center justify-between">
          <h2 class="text-[19px] font-semibold text-gray-900">Edit User</h2>
          <button @click="showEditUserModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-2 overflow-y-auto space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Full Name *</label>
            <input type="text" placeholder="Enter full name" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
          </div>

          <!-- Email Address -->
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Email Address *</label>
            <input type="email" placeholder="user@taxaid.com" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Phone Number (Optional) *</label>
            <input type="text" placeholder="+1 (555) 000-0000" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
          </div>

          <!-- User Role -->
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">User Role *</label>
            <div class="relative">
              <select class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                <option value="" disabled selected hidden>Select Role....</option>
                <option>Admin</option>
                <option>Team Member</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            <p class="text-[12px] text-gray-500 mt-1.5">Role determines default dashboard access and permissions</p>
          </div>

          <!-- Department -->
          <div>
            <label class="block text-[14px] font-semibold text-gray-900 mb-2">Department</label>
            <div class="relative">
              <select class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                <option value="" disabled selected hidden>Select Department</option>
                <option>Administration</option>
                <option>Tech Team</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 flex items-center justify-end gap-3 bg-white mt-2">
          <button @click="showEditUserModal = false" class="px-5 py-2 rounded-md border border-gray-200 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="showEditUserModal = false" class="bg-[#007C65] text-white px-5 py-2 rounded-md font-medium text-[14px] flex items-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Delete User Modal -->
    <div v-if="showDeleteUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[450px] max-w-full overflow-hidden flex flex-col relative text-center p-8">
        <!-- Close Button -->
        <button @click="showDeleteUserModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Icon -->
        <div class="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-5 text-[#EF4444]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>

        <h2 class="text-[22px] font-semibold text-gray-900 mb-3">Delete User?</h2>
        <p class="text-gray-600 text-[15px] px-4 mb-8 leading-relaxed">
          This user will be removed and will no longer have access to the system.
        </p>

        <!-- Buttons -->
        <div class="flex items-center justify-center gap-4">
          <button @click="showDeleteUserModal = false" class="px-6 py-2.5 rounded-md border border-gray-200 text-gray-700 text-[15px] font-medium hover:bg-gray-50 transition-colors bg-white">Cancel</button>
          <button @click="showDeleteUserModal = false; showDeleteSuccessModal = true" class="bg-[#007C65] text-white px-6 py-2.5 rounded-md font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm min-w-[160px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Success Modal -->
    <div v-if="showDeleteSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[450px] max-w-full overflow-hidden flex flex-col relative text-center px-8 py-10">
        <!-- Close Button -->
        <button @click="showDeleteSuccessModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Icon -->
        <div class="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-5 text-[#EF4444]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>

        <h2 class="text-[22px] font-semibold text-gray-900 mb-3">User deleted successfully</h2>
        <p class="text-gray-600 text-[15px] px-4 leading-relaxed">
          The user has been removed and no longer has access to the system.
        </p>
      </div>
    </div>

    <!-- Add New User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div class="bg-white rounded-xl shadow-lg w-[650px] max-w-full overflow-hidden flex flex-col max-h-[95vh]">
        <!-- Header -->
        <div class="px-8 py-6 flex items-center justify-between">
          <h2 class="text-[20px] font-semibold text-gray-900">Add New User</h2>
          <button @click="closeAddUserModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body -->
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
          <div v-show="addUserStep === 1" class="space-y-7">
            <!-- Alert Box -->
            <div class="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex items-start gap-3">
              <svg class="text-[#D97706] mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <div class="text-[#92400E] font-semibold text-[15px] mb-1">Create New User Account</div>
                <div class="text-[#92400E] text-[14px] opacity-90">Add a new user. Login details will be sent via email with assigned access.</div>
              </div>
            </div>

            <!-- Fields -->
            <div class="space-y-5">
              <div>
                <label class="block text-[14px] font-semibold text-gray-900 mb-2">Full Name *</label>
                <input type="text" placeholder="Enter full name" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
              </div>

              <div>
                <label class="block text-[14px] font-semibold text-gray-900 mb-2">Email Address *</label>
                <input type="email" placeholder="user@taxaid.com" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
              </div>

              <div>
                <label class="block text-[14px] font-semibold text-gray-900 mb-2">Phone Number (Optional) *</label>
                <input type="text" placeholder="+1 (555) 000-0000" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm" />
              </div>

              <div>
                <label class="block text-[14px] font-semibold text-gray-900 mb-2">User Role *</label>
                <div class="relative">
                  <select class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                    <option value="" disabled selected hidden>Select Role....</option>
                    <option>Admin</option>
                    <option>Team Member</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <p class="text-[13px] text-gray-500 mt-1.5">Role determines default dashboard access and permissions</p>
              </div>

              <div>
                <label class="block text-[14px] font-semibold text-gray-900 mb-2">Department</label>
                <div class="relative mb-2">
                  <select class="w-full appearance-none border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] bg-white shadow-sm">
                    <option value="" disabled selected hidden>Select Department</option>
                    <option>Administration</option>
                    <option>Tech Team</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[14px] font-semibold text-gray-900 mb-2">Initial Password</label>
                <input type="password" placeholder="Min. 6 characters" class="w-full border border-[#A7F3D0] rounded-md px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#007C65] focus:ring-1 focus:ring-[#007C65] placeholder-gray-400 shadow-sm mb-4" />
                <button class="w-full py-2.5 bg-white border border-gray-200 text-gray-700 text-[14px] font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                  Generate Secure Password
                </button>
                <p class="text-[13px] text-gray-500 mt-2">User must change password on first login</p>
              </div>
            </div>
          </div>

          <!-- Step 2: System Access -->
          <div v-show="addUserStep === 2" class="space-y-6 pb-4">
            <div class="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex items-start gap-3">
              <svg class="text-[#D97706] mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <div class="text-[#92400E] font-semibold text-[15px] mb-1">Assign System Access</div>
                <div class="text-[#92400E] text-[14px] opacity-90">Select which TaxFiq.ai systems this user can access. You can modify these permissions later.</div>
              </div>
            </div>

            <div>
              <h3 class="text-[16px] font-semibold text-gray-900">Available Dashboards</h3>
              <p class="text-gray-500 text-[14px] mt-0.5 mb-4">Select the dashboards this user should be able to view and access</p>

              <div class="space-y-3">
                <label v-for="(db, index) in availableDashboards" :key="index" :class="['border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors', selectedDashboards.includes(db.title) ? 'bg-[#F0FDF4] border-[#86EFAC]' : 'border-gray-200 hover:border-gray-300 bg-white']">
                  <div class="relative flex items-start pt-0.5">
                    <input type="checkbox" :value="db.title" v-model="selectedDashboards" class="w-[18px] h-[18px] rounded border border-gray-300 bg-white text-blue-500 focus:ring-blue-500 mt-0.5 cursor-pointer shadow-sm" />
                  </div>
                  <div class="flex-1">
                    <div class="text-[14px] font-semibold text-gray-900">{{ db.title }}</div>
                    <div class="text-[13px] text-gray-500 mt-0.5">{{ db.desc }}</div>
                  </div>
                  <div v-if="selectedDashboards.includes(db.title)" class="text-[#007C65]">
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

            <!-- User Info Card -->
            <div class="border border-gray-200 rounded-xl p-5">
              <h3 class="text-[16px] font-semibold text-gray-900 mb-5">User Information</h3>
              <div class="space-y-4 text-[14px]">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Full Name</span>
                  <span class="text-gray-900 font-medium">Akshay</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Email Address</span>
                  <span class="text-gray-900 font-medium">a@gmail.com</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Phone Number</span>
                  <span class="text-gray-900 font-medium">+123 123 1234</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Role</span>
                  <span class="text-gray-900 font-medium">Manager</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Department</span>
                  <span class="text-gray-900 font-medium">-</span>
                </div>
              </div>
            </div>

            <!-- System Access Card -->
            <div class="border border-gray-200 rounded-xl p-5">
              <h3 class="text-[16px] font-semibold text-gray-900 mb-5">System Access</h3>
              <div class="flex items-center justify-between text-[14px]">
                <span class="text-gray-500">Assigned Systems</span>
                <div class="flex items-center gap-2 flex-wrap justify-end">
                  <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc] text-[12px]">Ticketing</span>
                  <span class="text-gray-800 border rounded-full px-2.5 py-0.5 border-[#ccc] text-[12px]">Implementation</span>
                </div>
              </div>
            </div>

            <!-- Welcome Email -->
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
          
          <button v-if="addUserStep < 3" @click="addUserStep++" :class="[addUserStep === 1 ? 'w-full' : 'w-1/2']" class="bg-[#007C65] text-white py-2.5 rounded-md font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#006A56] transition-colors shadow-sm">
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
        <!-- Close Button -->
        <button @click="showCreateSuccessModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Icon -->
        <div class="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5 text-[#10B981]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <h2 class="text-[22px] font-semibold text-gray-900 mb-3">User created successfully</h2>
        <p class="text-gray-600 text-[15px] px-4 leading-relaxed">
          Permissions and dashboard access have been<br />configured.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('User Management')
const showConfigureModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteUserModal = ref(false)
const showDeleteSuccessModal = ref(false)
const showAddUserModal = ref(false)
const addUserStep = ref(1)
const showCreateSuccessModal = ref(false)

const closeAddUserModal = () => {
  showAddUserModal.value = false
  setTimeout(() => { addUserStep.value = 1 }, 300) // reset step after animation
}

const handleCreateUser = () => {
  closeAddUserModal()
  showCreateSuccessModal.value = true
}
const selectedDashboards = ref(['Ticketing Dashboard'])
const availableDashboards = [
  { title: 'Admin Dashboard', desc: 'Manage users, roles, permissions, and system settings.' },
  { title: 'Ticketing Dashboard', desc: 'Track and manage support tickets, requests, and workflows.' },
  { title: 'Implementation Dashboard', desc: 'Handle client onboarding, data setup, and project execution.' },
  { title: 'Review Dashboard', desc: 'Monitor reviews, consultant activity, and performance tracking.' },
  { title: 'Revenue Dashboard', desc: 'Analyze revenue, financial reports, and business performance.' }
]
</script>
