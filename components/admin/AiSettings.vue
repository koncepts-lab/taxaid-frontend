<template>
  <div class="space-y-6 mt-4">

    <!-- Global usage totals -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Total Tokens Used</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">{{ usageLoading ? '—' : (usageSnapshot.total_tokens ?? 0).toLocaleString() }}</div>
        <div class="text-xs text-gray-400">Across all tenants</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Total Requests</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">{{ usageLoading ? '—' : (usageSnapshot.total_requests ?? 0).toLocaleString() }}</div>
        <div class="text-xs text-gray-400">Across all tenants</div>
      </div>
      <div class="bg-white border border-[#FFC9C9] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-[#DC2626] text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Total Flags</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
        </div>
        <div class="text-3xl font-semibold text-[#DC2626] mb-1">{{ usageLoading ? '—' : (usageSnapshot.total_flags ?? 0).toLocaleString() }}</div>
        <div class="text-xs text-[#DC2626] opacity-70">Repeated-pattern flags</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm relative">
        <div class="text-gray-500 text-[13px] mb-3 flex items-center justify-between font-medium">
          <span>Active Tenants</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="text-3xl font-semibold text-gray-800 mb-1">{{ usageLoading ? '—' : (usageSnapshot.active_tenants ?? 0) }}</div>
        <div class="text-xs text-gray-400">Using AI this period</div>
      </div>
      <p v-if="usageSnapshot.computed_at" class="sm:col-span-4 text-[12px] text-gray-400">
        As of {{ new Date(usageSnapshot.computed_at).toLocaleString() }}
      </p>
    </div>

    <!-- Sub-tab switcher -->
    <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto">
      <button v-for="t in subTabs" :key="t" @click="activeSubTab = t"
        :class="activeSubTab === t ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-6 shadow-sm' : 'text-gray-700 font-medium px-5 hover:bg-gray-50 hover:text-gray-900'"
        class="py-2 rounded-full transition-colors whitespace-nowrap">{{ t }}</button>
    </div>

    <!-- Instructions sub-tab -->
    <div v-if="activeSubTab === 'Instructions'" class="bg-white border border-[#D1FAE5] rounded-[10px] shadow-sm p-6">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">Global AI Instructions</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">Akeel's guard rules — all rows are joined into one system instruction. Default rows are seeded and can't be removed.</p>
        </div>
        <button @click="openInstructionModal" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] shrink-0">+ Add</button>
      </div>

      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="settingsSearch" type="text" placeholder="Search instructions…" autocomplete="off"
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="relative min-w-[160px] w-full md:w-auto">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </span>
          <select v-model="settingsFilter" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="all">All</option>
            <option value="default">Default (locked)</option>
            <option value="custom">Custom</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>
      </div>

      <div class="space-y-2 min-h-[520px] max-h-[520px] overflow-y-auto pr-1">
        <div v-if="settingsLoading" class="space-y-2">
          <div v-for="n in 4" :key="n" class="h-14 bg-gray-100 rounded-[10px] animate-pulse"></div>
        </div>
        <template v-else>
          <div v-for="row in filteredSettings" :key="row.id" class="flex items-start gap-3 border border-gray-100 rounded-[10px] p-3">
            <svg v-if="row.is_default" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p class="text-sm text-gray-700 flex-1">{{ row.instruction }}</p>
            <button v-if="!row.is_default" @click="removeSetting(row)" class="text-red-500 text-xs px-2 shrink-0 hover:text-red-600">Remove</button>
          </div>
          <p v-if="!filteredSettings.length" class="text-sm text-gray-400 py-6 text-center">No instructions found.</p>
        </template>
      </div>
    </div>

    <!-- Add instruction modal -->
    <div v-if="instructionModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[480px] max-w-full p-6 relative">
        <button @click="instructionModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3 class="text-[16px] font-semibold text-gray-900 mb-4 pr-6">Add Instruction</h3>
        <label class="block text-[13px] text-gray-600 mb-1.5">Instruction</label>
        <textarea v-model="newInstruction" rows="4" placeholder="e.g. Always respond in a professional tone…"
          class="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"></textarea>
        <p v-if="instructionWarning" class="text-[13px] text-amber-600 mb-3">{{ instructionWarning }}</p>
        <div class="flex justify-end gap-3">
          <button @click="instructionModalOpen = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="addInstruction" :disabled="!newInstruction.trim() || savingSettings"
            class="px-4 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ savingSettings ? 'Adding…' : 'Add' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Data-Links sub-tab -->
    <div v-if="activeSubTab === 'Data-Links'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#EFF6FF] border border-[#BEDBFF] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#0369A1] text-[13px] font-medium mb-2">Total Data-Links</p>
          <p class="text-3xl font-semibold text-[#0369A1]">{{ dataLinks.counts.total }}</p>
        </div>
        <div class="bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#16A34A] text-[13px] font-medium mb-2">Active</p>
          <p class="text-3xl font-semibold text-[#16A34A]">{{ dataLinks.counts.active }}</p>
        </div>
        <div class="bg-[#FEF2F2] border border-[#FFC9C9] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#DC2626] text-[13px] font-medium mb-2">Inactive</p>
          <p class="text-3xl font-semibold text-[#DC2626]">{{ dataLinks.counts.inactive }}</p>
        </div>
      </div>

      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="dataLinks.search" @input="debouncedLoad('dataLinks')" type="text" placeholder="Search key word, label, description…" autocomplete="off"
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="flex items-center gap-2 min-w-[150px] bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm text-gray-700">
            <span>Domain<span v-if="dataLinks.domain.length"> ({{ dataLinks.domain.length }})</span></span>
            <DataSourceTbHeaderFilter column="domain" :options="dataLinks.domainOptions" :selected="dataLinks.domain"
              @apply="(col, values) => { dataLinks.domain = values; loadDataLinks(1) }" class="ml-auto" />
          </div>
          <div class="flex items-center gap-2 min-w-[150px] bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm text-gray-700">
            <span>Category<span v-if="dataLinks.category.length"> ({{ dataLinks.category.length }})</span></span>
            <DataSourceTbHeaderFilter column="category" :options="dataLinks.categoryOptions" :selected="dataLinks.category"
              @apply="(col, values) => { dataLinks.category = values; loadDataLinks(1) }" class="ml-auto" />
          </div>
          <div class="relative min-w-[140px]">
            <select v-model="dataLinks.status" @change="loadDataLinks(1)"
              class="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-[10px] overflow-hidden shadow-sm">
        <div class="w-full overflow-x-auto min-h-[520px]">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">ID</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Label</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Domain</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Category</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <template v-if="dataLinks.loading">
                <tr v-for="n in 5" :key="'sk'+n" class="border-b border-gray-100">
                  <td v-for="c in 6" :key="c" class="py-3.5 px-6"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!dataLinks.rows.length"><td colspan="6" class="py-10 text-center text-gray-400">No data-links found.</td></tr>
              <template v-else>
                <tr v-for="link in dataLinks.rows" :key="link.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                  <td class="py-3.5 px-6 text-gray-500">{{ link.id }}</td>
                  <td class="py-3.5 px-6 font-medium text-gray-800">{{ link.label }}</td>
                  <td class="py-3.5 px-6">
                    <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-2.5 py-1 text-[12px] whitespace-nowrap">{{ link.domain }}</span>
                  </td>
                  <td class="py-3.5 px-6 text-gray-500">{{ link.category ?? '—' }}</td>
                  <td class="py-3.5 px-6">
                    <span :class="link.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'" class="rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap">{{ link.is_active ? 'Active' : 'Inactive' }}</span>
                  </td>
                  <td class="py-3.5 px-6 text-right">
                    <button @click="openDataLinkModal(link)" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="px-6 pb-4">
          <CommonPaginationBar v-if="dataLinks.meta.total > 0" :meta="dataLinks.meta" :loading="dataLinks.loading"
            @page-change="(p) => loadDataLinks(p)" @per-page-change="(pp) => { dataLinks.perPage = pp; loadDataLinks(1) }" />
        </div>
      </div>
    </div>

    <!-- Rules sub-tab -->
    <div v-if="activeSubTab === 'Rules'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#EFF6FF] border border-[#BEDBFF] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#0369A1] text-[13px] font-medium mb-2">Total Rules</p>
          <p class="text-3xl font-semibold text-[#0369A1]">{{ rules.counts.total }}</p>
        </div>
        <div class="bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#16A34A] text-[13px] font-medium mb-2">Active</p>
          <p class="text-3xl font-semibold text-[#16A34A]">{{ rules.counts.active }}</p>
        </div>
        <div class="bg-[#FEF2F2] border border-[#FFC9C9] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#DC2626] text-[13px] font-medium mb-2">Inactive</p>
          <p class="text-3xl font-semibold text-[#DC2626]">{{ rules.counts.inactive }}</p>
        </div>
      </div>

      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="rules.search" @input="debouncedLoad('rules')" type="text" placeholder="Search label, context template…" autocomplete="off"
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <select v-model="rules.domain" @change="loadRules(1)" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option value="">All Domains</option>
              <option v-for="d in domainOptions" :key="d" :value="d">{{ d }}</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>
          <div class="relative min-w-[160px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <input v-model="rules.category" @input="debouncedLoad('rules')" placeholder="Category…" class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-[10px] overflow-hidden shadow-sm">
        <div class="w-full overflow-x-auto min-h-[520px]">
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Label</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Domain</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Category</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <template v-if="rules.loading">
                <tr v-for="n in 5" :key="'sk'+n" class="border-b border-gray-100">
                  <td v-for="c in 5" :key="c" class="py-3.5 px-6"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!rules.rows.length"><td colspan="5" class="py-10 text-center text-gray-400">No rules yet.</td></tr>
              <tr v-for="rule in rules.rows" :key="rule.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-3.5 px-6 font-medium text-gray-800">{{ rule.label }}</td>
                <td class="py-3.5 px-6">
                  <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-2.5 py-1 text-[12px] whitespace-nowrap">{{ rule.domain }}</span>
                </td>
                <td class="py-3.5 px-6 text-gray-500">{{ rule.category ?? '—' }}</td>
                <td class="py-3.5 px-6">
                  <span :class="rule.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'" class="rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap">{{ rule.is_active ? 'Active' : 'Inactive' }}</span>
                </td>
                <td class="py-3.5 px-6 text-right">
                  <button @click="openRuleModal(rule)" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 pb-4">
          <CommonPaginationBar v-if="rules.meta.total > 0" :meta="rules.meta" :loading="rules.loading"
            @page-change="(p) => loadRules(p)" @per-page-change="(pp) => { rules.perPage = pp; loadRules(1) }" />
        </div>
      </div>
    </div>

    <!-- Alert Rules sub-tab -->
    <div v-if="activeSubTab === 'Alert Rules'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#FAF5FF] border border-[#E9D4FF] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#9333EA] text-[13px] font-medium mb-2">Total Alert Rules</p>
          <p class="text-3xl font-semibold text-[#9333EA]">{{ alertRules.counts.total }}</p>
        </div>
        <div class="bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#16A34A] text-[13px] font-medium mb-2">Active</p>
          <p class="text-3xl font-semibold text-[#16A34A]">{{ alertRules.counts.active }}</p>
        </div>
        <div class="bg-[#FEF2F2] border border-[#FFC9C9] rounded-[10px] p-4 shadow-sm">
          <p class="text-[#DC2626] text-[13px] font-medium mb-2">Inactive</p>
          <p class="text-3xl font-semibold text-[#DC2626]">{{ alertRules.counts.inactive }}</p>
        </div>
      </div>

      <div class="bg-[#61FFD62E] border border-[#00BE8CBD] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="alertRules.search" @input="debouncedLoad('alertRules')" type="text" placeholder="Search alert title, prompt instruction…" autocomplete="off"
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="flex items-center gap-2 min-w-[140px] bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm text-gray-700">
            <span>Domain<span v-if="alertRules.domain.length"> ({{ alertRules.domain.length }})</span></span>
            <DataSourceTbHeaderFilter column="domain" :options="domainOptions" :selected="alertRules.domain"
              @apply="(col, values) => { alertRules.domain = values; loadAlertRules(1) }" class="ml-auto" />
          </div>
          <div class="flex items-center gap-2 min-w-[140px] bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm text-gray-700">
            <span>Category<span v-if="alertRules.category.length"> ({{ alertRules.category.length }})</span></span>
            <DataSourceTbHeaderFilter column="category" :options="alertRules.categoryOptions" :selected="alertRules.category"
              @apply="(col, values) => { alertRules.category = values; loadAlertRules(1) }" class="ml-auto" />
          </div>
          <div class="relative min-w-[140px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <select v-model="alertRules.priority" @change="loadAlertRules(1)" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
              <option value="">All Priorities</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-[10px] overflow-hidden shadow-sm">
        <div class="w-full overflow-x-auto min-h-[520px]">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Alert Title</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Domain</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Category</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Priority</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <template v-if="alertRules.loading">
                <tr v-for="n in 5" :key="'sk'+n" class="border-b border-gray-100">
                  <td v-for="c in 6" :key="c" class="py-3.5 px-6"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!alertRules.rows.length"><td colspan="6" class="py-10 text-center text-gray-400">No alert rules yet.</td></tr>
              <template v-else>
                <tr v-for="rule in alertRules.rows" :key="rule.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                  <td class="py-3.5 px-6 font-medium text-gray-800">{{ rule.alert_title }}</td>
                  <td class="py-3.5 px-6">
                    <span class="inline-flex border border-gray-200 bg-white text-gray-600 rounded-full px-2.5 py-1 text-[12px] whitespace-nowrap">{{ rule.domain }}</span>
                  </td>
                  <td class="py-3.5 px-6 text-gray-500">{{ rule.category ?? '—' }}</td>
                  <td class="py-3.5 px-6">
                    <span :class="{ 'bg-[#FEF2F2] text-[#DC2626]': rule.priority === 'P1', 'bg-[#FFF7ED] text-[#C2410C]': rule.priority === 'P2', 'bg-gray-100 text-gray-600': rule.priority === 'P3' }" class="rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap">{{ rule.priority }}</span>
                  </td>
                  <td class="py-3.5 px-6">
                    <span :class="rule.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'" class="rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap">{{ rule.is_active ? 'Active' : 'Inactive' }}</span>
                  </td>
                  <td class="py-3.5 px-6 text-right">
                    <button @click="openAlertRuleModal(rule)" class="inline-flex items-center justify-center border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="px-6 pb-4">
          <CommonPaginationBar v-if="alertRules.meta.total > 0" :meta="alertRules.meta" :loading="alertRules.loading"
            @page-change="(p) => loadAlertRules(p)" @per-page-change="(pp) => { alertRules.perPage = pp; loadAlertRules(1) }" />
        </div>
      </div>
    </div>

    <!-- Chat Quick Questions & Tips sub-tab -->
    <div v-if="activeSubTab === 'Quick Questions & Tips'" class="bg-white border border-gray-100 rounded-[10px] overflow-hidden shadow-sm">
      <div class="p-6 pb-4 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">Chat Quick Questions & Tips</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">Per-page config, max 6 questions / 3 tips. "default" is used when a page has no specific row.</p>
        </div>
        <button @click="openPromptModal(null)" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] shrink-0">+ New Page</button>
      </div>

      <div class="px-6 pb-4">
        <div class="relative w-full md:w-[40%]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input v-model="chatPrompts.search" @input="debouncedLoad('chatPrompts')" type="text" placeholder="Search by page…" autocomplete="off"
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 shadow-sm" />
        </div>
      </div>

      <div class="w-full overflow-x-auto min-h-[520px]">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-[#008865] text-white text-sm">
              <th class="py-2.5 px-4 font-medium">Page</th>
              <th class="py-2.5 px-4 font-medium">Questions</th>
              <th class="py-2.5 px-4 font-medium">Tips</th>
              <th class="py-2.5 px-4 font-medium">Active</th>
              <th class="py-2.5 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <template v-if="chatPrompts.loading">
              <tr v-for="n in 5" :key="'sk'+n" class="border-b border-gray-100">
                <td v-for="c in 5" :key="c" class="py-3 px-4"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
              </tr>
            </template>
            <tr v-else-if="!chatPrompts.rows.length"><td colspan="5" class="py-8 text-center text-gray-400">No pages configured.</td></tr>
            <template v-else>
              <tr v-for="p in chatPrompts.rows" :key="p.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-3 px-4 font-medium">{{ p.page }}</td>
                <td class="py-3 px-4">{{ p.questions?.length ?? 0 }}</td>
                <td class="py-3 px-4">{{ p.tips?.length ?? 0 }}</td>
                <td class="py-3 px-4">
                  <span :class="p.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'" class="rounded-full px-2.5 py-1 text-[12px] font-medium">{{ p.is_active ? 'Active' : 'Inactive' }}</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <button @click="openPromptModal(p)" class="px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50 mr-1.5">Edit</button>
                  <button @click="cloneRow(p)" class="px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50 mr-1.5">Clone</button>
                  <button @click="deleteRow(p)" class="px-3 py-1.5 border border-red-300 text-red-600 rounded text-xs hover:bg-red-50">Delete</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4">
        <CommonPaginationBar v-if="chatPrompts.meta.total > 0" :meta="chatPrompts.meta" :loading="chatPrompts.loading"
          @page-change="(p) => loadChatPrompts(p)" @per-page-change="(pp) => { chatPrompts.perPage = pp; loadChatPrompts(1) }" />
      </div>
    </div>

    <!-- Edit modals (Data-Link / Rule / Alert Rule) -->
    <div v-if="dataLinkModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[480px] max-w-full p-6 relative">
        <button @click="dataLinkModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3 class="text-[16px] font-semibold text-gray-900 mb-1 pr-6">Edit Data-Link</h3>
        <code class="text-xs text-gray-400 block mb-4">{{ editingDataLink.key_word }} · {{ editingDataLink.domain }}</code>
        <label class="block text-[13px] text-gray-600 mb-1.5">Label</label>
        <input v-model="editingDataLink.label" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <label class="block text-[13px] text-gray-600 mb-1.5">Category</label>
        <select v-model="editingDataLinkCategorySuffix" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169] bg-white">
          <option value="AI">AI</option>
          <option value="General">General</option>
          <option value="System">System</option>
        </select>
        <label class="block text-[13px] text-gray-600 mb-1.5">Context / description</label>
        <textarea v-model="editingDataLink.context" rows="8" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"></textarea>
        <template v-if="editingDataLink.available_params && Object.keys(editingDataLink.available_params).length">
          <label class="block text-[13px] text-gray-600 mb-1.5">Params (developer-managed, read-only)</label>
          <pre class="w-full mb-4 px-3 py-2 border border-gray-100 bg-gray-50 rounded-lg text-xs text-gray-500 overflow-x-auto">{{ JSON.stringify(editingDataLink.available_params, null, 2) }}</pre>
        </template>
        <label class="flex items-center gap-2 mb-4">
          <input type="checkbox" v-model="editingDataLink.is_active" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Active</span>
        </label>
        <div class="flex justify-end gap-3">
          <button @click="dataLinkModalOpen = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="submitDataLink" class="px-4 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-lg text-sm font-medium transition-colors">Save</button>
        </div>
      </div>
    </div>

    <div v-if="ruleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[480px] max-w-full p-6 relative">
        <button @click="ruleModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3 class="text-[16px] font-semibold text-gray-900 mb-1 pr-6">Edit Rule</h3>
        <code class="text-xs text-gray-400 block mb-4">{{ editingRule.domain }}</code>
        <label class="block text-[13px] text-gray-600 mb-1.5">Label</label>
        <input v-model="editingRule.label" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <label class="block text-[13px] text-gray-600 mb-1.5">Category</label>
        <input v-model="editingRule.category" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <label class="block text-[13px] text-gray-600 mb-1.5">Context template</label>
        <textarea v-model="editingRule.context_template" rows="3" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"></textarea>
        <label class="flex items-center gap-2 mb-4">
          <input type="checkbox" v-model="editingRule.is_active" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Active</span>
        </label>
        <div class="flex justify-end gap-3">
          <button @click="ruleModalOpen = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="submitRule" class="px-4 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-lg text-sm font-medium transition-colors">Save</button>
        </div>
      </div>
    </div>

    <div v-if="alertRuleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[480px] max-w-full p-6 relative">
        <button @click="alertRuleModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3 class="text-[16px] font-semibold text-gray-900 mb-1 pr-6">Edit Alert Rule</h3>
        <code class="text-xs text-gray-400 block mb-4">{{ editingAlertRule.domain }}</code>
        <label class="block text-[13px] text-gray-600 mb-1.5">Alert title</label>
        <input v-model="editingAlertRule.alert_title" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-[13px] text-gray-600 mb-1.5">Category</label>
            <input v-model="editingAlertRule.category" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
          </div>
          <div>
            <label class="block text-[13px] text-gray-600 mb-1.5">Priority</label>
            <select v-model="editingAlertRule.priority" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]">
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>
        </div>
        <label class="block text-[13px] text-gray-600 mb-1.5">RAG prompt instruction</label>
        <textarea v-model="editingAlertRule.rag_prompt_instruction" rows="3" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"></textarea>
        <label class="flex items-center gap-2 mb-4">
          <input type="checkbox" v-model="editingAlertRule.is_active" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Active</span>
        </label>
        <div class="flex justify-end gap-3">
          <button @click="alertRuleModalOpen = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="submitAlertRule" class="px-4 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-lg text-sm font-medium transition-colors">Save</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit chat prompt modal -->
    <div v-if="promptModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[560px] max-w-full p-6 max-h-[85vh] overflow-y-auto relative">
        <button @click="promptModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3 class="text-[16px] font-semibold text-gray-900 mb-4 pr-6">{{ editingPrompt.id ? 'Edit Page Config' : 'New Page Config' }}</h3>

        <label class="block text-[13px] text-gray-600 mb-1.5">Page</label>
        <select v-model="editingPrompt.page" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]">
          <option value="" disabled>Select a page…</option>
          <option v-for="opt in pageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <label class="flex items-center gap-2 mb-4">
          <input type="checkbox" v-model="editingPrompt.is_active" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Active</span>
        </label>

        <div class="mb-4">
          <p class="text-[13px] text-gray-600 mb-1.5 font-medium">Questions ({{ editingPrompt.questions.length }}/6)</p>
          <div v-for="(q, qi) in editingPrompt.questions" :key="qi" class="flex gap-2 mb-1.5">
            <input v-model="q.text" placeholder="English" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
            <input v-model="q.text_ar" placeholder="Arabic" dir="rtl" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
            <button @click="editingPrompt.questions.splice(qi, 1)" class="text-red-500 text-xs px-2">✕</button>
          </div>
          <button v-if="editingPrompt.questions.length < 6" @click="editingPrompt.questions.push({ text: '', text_ar: '' })" class="text-[#00896F] text-xs font-medium">+ Add question</button>
        </div>

        <div class="mb-4">
          <p class="text-[13px] text-gray-600 mb-1.5 font-medium">Tips ({{ editingPrompt.tips.length }}/3, plain text)</p>
          <div v-for="(t, ti) in editingPrompt.tips" :key="ti" class="border border-gray-100 rounded p-3 mb-2">
            <div class="flex gap-2 mb-1.5">
              <input v-model="t.heading" placeholder="Heading (EN)" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
              <input v-model="t.heading_ar" placeholder="Heading (AR)" dir="rtl" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
            </div>
            <textarea v-model="t.body" rows="2" placeholder="Body text (EN)" class="w-full mb-1.5 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]"></textarea>
            <textarea v-model="t.body_ar" rows="2" dir="rtl" placeholder="Body text (AR)" class="w-full mb-1.5 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]"></textarea>
            <button @click="editingPrompt.tips.splice(ti, 1)" class="text-red-500 text-xs">Remove tip</button>
          </div>
          <button v-if="editingPrompt.tips.length < 3" @click="editingPrompt.tips.push({ heading: '', heading_ar: '', body: '', body_ar: '' })" class="text-[#00896F] text-xs font-medium">+ Add tip</button>
        </div>

        <p v-if="promptError" class="text-[13px] text-red-500 mb-3">{{ promptError }}</p>
        <div class="flex justify-end gap-3">
          <button @click="promptModalOpen = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="savePrompt" :disabled="savingPrompt || !editingPrompt.page"
            class="px-4 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ savingPrompt ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const {
  getSettings, addSetting, deleteSetting, getUsageSnapshot,
  getDataLinks, updateDataLink,
  getRules, updateRule,
  getAlertRules, updateAlertRule,
  getChatPrompts, createChatPrompt, updateChatPrompt, deleteChatPrompt, cloneChatPrompt,
} = useAdminAi()

// The 9 main report pages + support pages + the reserved 'default' fallback.
const pageOptions = [
  'default', 'dashboard', 'revenue', 'cash-flow', 'cost-center', 'cogs',
  'accounts-payable', 'accounts-receivable', 'indirect-expense', 'financial-statement',
  'tax-queries', 'alerts', 'chat-with-akeel',
]

// Used by the Rules/Alert Rules sub-tabs' domain filters only — Data-Links has its own
// backend-supplied dataLinks.domainOptions instead (this hardcoded list was missing
// COGS/TAX/COST_CENTER, same gap that would exist here too if left in sync manually).
const domainOptions = ['AR', 'AP', 'general']
// 'Rules' (ai_rules) hidden — unused, data-links (ai_data_links) cover this today.
const subTabs = ['Instructions', 'Data-Links', 'Alert Rules', 'Quick Questions & Tips']
const subTabSlugs = { 'Instructions': 'instructions', 'Data-Links': 'data-links', 'Rules': 'rules', 'Alert Rules': 'alert-rules', 'Quick Questions & Tips': 'quick-questions' }
const slugToSubTab = Object.fromEntries(Object.entries(subTabSlugs).map(([k, v]) => [v, k]))

const route = useRoute()
const router = useRouter()
const activeSubTab = ref(slugToSubTab[route.query.subtab] ?? 'Instructions')

watch(activeSubTab, (val) => {
  router.replace({ query: { ...route.query, subtab: subTabSlugs[val] } })
})

const globalSettings = ref([])
const newInstruction = ref('')
const instructionWarning = ref('')
const savingSettings = ref(false)
const settingsLoading = ref(false)
const settingsSearch = ref('')
const settingsFilter = ref('all')
const instructionModalOpen = ref(false)
const usageSnapshot = ref({})
const usageLoading = ref(false)

const filteredSettings = computed(() => {
  return globalSettings.value.filter((row) => {
    if (settingsFilter.value === 'default' && !row.is_default) return false
    if (settingsFilter.value === 'custom' && row.is_default) return false
    if (settingsSearch.value.trim() && !row.instruction.toLowerCase().includes(settingsSearch.value.trim().toLowerCase())) return false
    return true
  })
})

function makeTableState() {
  return reactive({
    rows: [], meta: { total: 0 }, loading: false, perPage: 10,
    search: '', domain: [], category: [], priority: '', status: '',
    categoryOptions: [], domainOptions: [],
    counts: { total: 0, active: 0, inactive: 0 },
  })
}

const dataLinks = makeTableState()
const rules = makeTableState()
const alertRules = makeTableState()
const chatPrompts = makeTableState()

const dataLinkModalOpen = ref(false)
const editingDataLink = reactive({ id: null, key_word: '', domain: '', label: '', category: '', context: '', is_active: true, available_params: {} })
// Category is stored as `{domain}-{suffix}` (e.g. AR-ai) — the dropdown only ever edits the
// suffix, the domain prefix always comes from the row's own (read-only here) domain field.
const editingDataLinkCategorySuffix = ref('AI')

const ruleModalOpen = ref(false)
const editingRule = reactive({ id: null, domain: '', label: '', category: '', context_template: '', is_active: true })

const alertRuleModalOpen = ref(false)
const editingAlertRule = reactive({ id: null, domain: '', alert_title: '', category: '', priority: 'P2', rag_prompt_instruction: '', is_active: true })

function skeletonWidth(col) {
  const widths = ['85%', '70%', '55%', '60%', '50%', '40%']
  return widths[(col - 1) % widths.length]
}

function applyMeta(res) {
  return { current_page: res.current_page ?? 1, per_page: res.per_page ?? 15, total: res.total ?? 0, last_page: res.last_page ?? 1 }
}

// Debounced search — 400ms after the user stops typing, avoids firing a request per keystroke.
const debounceTimers = {}
function debouncedLoad(key) {
  clearTimeout(debounceTimers[key])
  debounceTimers[key] = setTimeout(() => {
    if (key === 'dataLinks') loadDataLinks(1)
    if (key === 'rules') loadRules(1)
    if (key === 'alertRules') loadAlertRules(1)
    if (key === 'chatPrompts') loadChatPrompts(1)
  }, 400)
}

async function loadDataLinks(page = 1) {
  dataLinks.loading = true
  try {
    const res = await getDataLinks({ page, per_page: dataLinks.perPage, search: dataLinks.search, domain: dataLinks.domain, category: dataLinks.category, status: dataLinks.status })
    dataLinks.rows = res?.data ?? []
    dataLinks.meta = applyMeta(res)
    if (res?.counts) dataLinks.counts = res.counts
    if (res?.category_options) dataLinks.categoryOptions = res.category_options
    if (res?.domain_options) dataLinks.domainOptions = res.domain_options
  } finally {
    dataLinks.loading = false
  }
}

async function loadRules(page = 1) {
  rules.loading = true
  try {
    const res = await getRules({ page, per_page: rules.perPage, search: rules.search, domain: rules.domain, category: rules.category })
    rules.rows = res?.data ?? []
    rules.meta = applyMeta(res)
    if (res?.counts) rules.counts = res.counts
  } finally {
    rules.loading = false
  }
}

async function loadAlertRules(page = 1) {
  alertRules.loading = true
  try {
    const res = await getAlertRules({ page, per_page: alertRules.perPage, search: alertRules.search, domain: alertRules.domain, category: alertRules.category, priority: alertRules.priority })
    alertRules.rows = res?.data ?? []
    alertRules.meta = applyMeta(res)
    if (res?.counts) alertRules.counts = res.counts
    if (res?.category_options) alertRules.categoryOptions = res.category_options
  } finally {
    alertRules.loading = false
  }
}

async function loadChatPrompts(page = 1) {
  chatPrompts.loading = true
  try {
    const res = await getChatPrompts({ page, per_page: chatPrompts.perPage, search: chatPrompts.search })
    chatPrompts.rows = res?.data ?? []
    chatPrompts.meta = applyMeta(res)
  } finally {
    chatPrompts.loading = false
  }
}

async function loadSettings() {
  settingsLoading.value = true
  try {
    globalSettings.value = (await getSettings())?.data ?? []
  } finally {
    settingsLoading.value = false
  }
}

function openInstructionModal() {
  newInstruction.value = ''
  instructionWarning.value = ''
  instructionModalOpen.value = true
}

async function addInstruction() {
  if (!newInstruction.value.trim()) return
  savingSettings.value = true
  instructionWarning.value = ''
  try {
    const res = await addSetting(newInstruction.value.trim())
    await loadSettings()
    if (res?.warning) {
      instructionWarning.value = res.warning
    } else {
      instructionModalOpen.value = false
    }
    newInstruction.value = ''
  } finally {
    savingSettings.value = false
  }
}

async function removeSetting(row) {
  await deleteSetting(row.id)
  await loadSettings()
}

async function loadUsageSnapshot() {
  usageLoading.value = true
  try {
    usageSnapshot.value = (await getUsageSnapshot())?.data ?? {}
  } finally {
    usageLoading.value = false
  }
}

function openDataLinkModal(link) {
  Object.assign(editingDataLink, link)
  // Derive the dropdown's initial value from the stored `{domain}-{suffix}` category —
  // falls back to 'ai' if unparseable/null (matches this seeder's current default for every
  // existing row except the single 'general'-domain one).
  const parts = (link.category ?? '').split('-')
  editingDataLinkCategorySuffix.value = parts.length > 1 ? parts[parts.length - 1] : (link.category || 'AI')
  dataLinkModalOpen.value = true
}
async function submitDataLink() {
  // The 'general' DOMAIN is its own catch-all — don't double-prefix it (e.g. avoid
  // "general-general"); every other domain composes normally as `{domain}-{suffix}`.
  editingDataLink.category = editingDataLink.domain === 'general'
    ? editingDataLinkCategorySuffix.value
    : `${editingDataLink.domain}-${editingDataLinkCategorySuffix.value}`
  await updateDataLink(editingDataLink.id, {
    label: editingDataLink.label, context: editingDataLink.context,
    category: editingDataLink.category, is_active: editingDataLink.is_active,
  })
  dataLinkModalOpen.value = false
  await loadDataLinks(dataLinks.meta.current_page)
}

function openRuleModal(rule) {
  Object.assign(editingRule, rule)
  ruleModalOpen.value = true
}
async function submitRule() {
  await updateRule(editingRule.id, {
    label: editingRule.label, context_template: editingRule.context_template,
    category: editingRule.category, is_active: editingRule.is_active,
  })
  ruleModalOpen.value = false
  await loadRules(rules.meta.current_page)
}

function openAlertRuleModal(rule) {
  Object.assign(editingAlertRule, rule)
  alertRuleModalOpen.value = true
}
async function submitAlertRule() {
  await updateAlertRule(editingAlertRule.id, {
    alert_title: editingAlertRule.alert_title, category: editingAlertRule.category, priority: editingAlertRule.priority,
    rag_prompt_instruction: editingAlertRule.rag_prompt_instruction, is_active: editingAlertRule.is_active,
  })
  alertRuleModalOpen.value = false
  await loadAlertRules(alertRules.meta.current_page)
}

// ── Chat prompt modal ────────────────────────────────────────────────────
const promptModalOpen = ref(false)
const savingPrompt = ref(false)
const promptError = ref('')
const editingPrompt = reactive({ id: null, page: '', questions: [], tips: [], is_active: true })

function openPromptModal(prompt) {
  promptError.value = ''
  editingPrompt.id = prompt?.id ?? null
  editingPrompt.page = prompt?.page ?? ''
  editingPrompt.questions = prompt?.questions ? JSON.parse(JSON.stringify(prompt.questions)) : []
  editingPrompt.tips = prompt?.tips ? JSON.parse(JSON.stringify(prompt.tips)) : []
  editingPrompt.is_active = prompt?.is_active ?? true
  promptModalOpen.value = true
}

async function savePrompt() {
  savingPrompt.value = true
  promptError.value = ''
  const body = { page: editingPrompt.page, questions: editingPrompt.questions, tips: editingPrompt.tips, is_active: editingPrompt.is_active }
  try {
    if (editingPrompt.id) {
      await updateChatPrompt(editingPrompt.id, body)
    } else {
      await createChatPrompt(body)
    }
    promptModalOpen.value = false
    await loadChatPrompts(chatPrompts.meta.current_page)
  } catch (e) {
    promptError.value = e?.data?.message ?? 'Failed to save.'
  } finally {
    savingPrompt.value = false
  }
}

async function cloneRow(prompt) {
  const page = window.prompt('New page key for the clone:')
  if (!page) return
  await cloneChatPrompt(prompt.id, page)
  await loadChatPrompts(chatPrompts.meta.current_page)
}

async function deleteRow(prompt) {
  await deleteChatPrompt(prompt.id)
  await loadChatPrompts(chatPrompts.meta.current_page)
}

onMounted(async () => {
  try { await loadSettings() } catch {}
  try { await loadUsageSnapshot() } catch {}
  await Promise.all([loadDataLinks(), loadRules(), loadAlertRules(), loadChatPrompts()])
})
</script>
