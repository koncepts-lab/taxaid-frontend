<template>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm py-8 px-6 flex flex-col gap-8">
        <!-- Sub-tabs: General vocabulary vs per-tenant custom extras -->
        <div class="flex bg-[#F3F4F6] p-1 rounded-full w-fit">
            <button @click="mode = 'general'"
                class="px-6 py-1.5 rounded-full text-sm font-medium transition-all"
                :class="mode === 'general' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                General
            </button>
            <button @click="mode = 'tenant'"
                class="px-6 py-1.5 rounded-full text-sm font-medium transition-all"
                :class="mode === 'tenant' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                Tenant Mappings
            </button>
        </div>

        <!-- ======================= GENERAL (unchanged) ======================= -->
        <div v-if="mode === 'general'" class="flex flex-col gap-12">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div>
                    <h3 class="text-base font-semibold text-gray-900">Existing List</h3>
                    <p class="text-sm text-[#717182]">Edit fields and apply changes. Default values are system-managed.</p>
                </div>
                <div class="relative w-full sm:w-72">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" v-model="search" placeholder="Search groups..."
                        class="w-full bg-[#F3F4F6] border-none rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-12">
                <div class="border border-gray-100 rounded-2xl lg:w-3/5 max-h-[60vh] overflow-y-auto">
                    <table class="w-full text-left border-separate border-spacing-0 table-fixed">
                        <thead>
                            <tr class="text-gray-800 text-sm">
                                <th class="px-4 py-4 w-1/4 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">
                                    <span class="inline-flex items-center gap-1.5">
                                        FS Code
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" class="text-gray-400">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <p class="text-[11px] font-normal text-gray-400">Fixed (BS, P&amp;L)</p>
                                </th>
                                <th class="px-4 py-4 w-1/4 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">Main Group</th>
                                <th class="px-4 py-4 w-2/4 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">Subgroup</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="idx in visibleRowCount" :key="idx">
                                <!-- FS Code: locked, display only -->
                                <td class="px-2 py-3 border-r border-gray-50 align-top">
                                    <div v-if="filteredFs[idx - 1]" class="flex items-center gap-2 h-10">
                                        <div
                                            class="flex-1 flex items-center justify-between bg-[#F3F4F6] text-black px-3 py-2 rounded-xl h-full min-w-0">
                                            <span class="text-sm truncate">{{ filteredFs[idx - 1].code }}</span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-2 py-3 border-r border-gray-50 align-top">
                                    <div v-if="filteredMain[idx - 1]" class="flex items-center gap-2 group/cell h-10">
                                        <template v-if="editingCell === `mg-${filteredMain[idx - 1].id}`">
                                            <input v-model="editValue" @blur="editingCell = null"
                                                @keyup.enter="saveCell('mg', filteredMain[idx - 1])" v-focus
                                                class="flex-1 min-w-0 h-full px-3 text-black rounded-xl border border-[#00896F] outline-none text-sm shadow-sm" />
                                            <button @mousedown.prevent="saveCell('mg', filteredMain[idx - 1])"
                                                class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                        </template>
                                        <template v-else>
                                            <div
                                                class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                                <span class="text-sm truncate">{{ filteredMain[idx - 1].name }}</span>
                                                <span v-if="filteredMain[idx - 1].is_default"
                                                    title="Default value — managed by the system"
                                                    class="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded shrink-0">default</span>
                                                <svg v-else @click="startEdit('mg', filteredMain[idx - 1])" width="14"
                                                    height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2"
                                                    class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                    <path
                                                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </div>
                                            <button v-if="!filteredMain[idx - 1].is_default"
                                                @click="prepareDelete('mg', filteredMain[idx - 1])"
                                                class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2">
                                                    <path
                                                        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                                </svg></button>
                                        </template>
                                    </div>
                                </td>

                                <td class="px-2 py-3 align-top">
                                    <div v-if="filteredSub[idx - 1]" class="flex items-center gap-2 group/cell h-10">
                                        <template v-if="editingCell === `sg-${filteredSub[idx - 1].id}`">
                                            <input v-model="editValue" @blur="editingCell = null"
                                                @keyup.enter="saveCell('sg', filteredSub[idx - 1])" v-focus
                                                class="flex-1 min-w-0 h-full px-3 rounded-xl text-black border border-[#00896F] outline-none text-sm shadow-sm" />
                                            <button @mousedown.prevent="saveCell('sg', filteredSub[idx - 1])"
                                                class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                        </template>
                                        <template v-else>
                                            <div
                                                class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                                <span class="text-sm truncate">{{ filteredSub[idx - 1].name }}</span>
                                                <span v-if="filteredSub[idx - 1].is_default"
                                                    title="Default value — managed by the system"
                                                    class="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded shrink-0">default</span>
                                                <svg v-else @click="startEdit('sg', filteredSub[idx - 1])" width="14"
                                                    height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2"
                                                    class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                    <path
                                                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </div>
                                            <button v-if="!filteredSub[idx - 1].is_default"
                                                @click="prepareDelete('sg', filteredSub[idx - 1])"
                                                class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2">
                                                    <path
                                                        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                                </svg></button>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="visibleRowCount === 0">
                                <td colspan="3" class="px-4 py-6 text-sm text-gray-400 text-center">
                                    No matches for "{{ search }}"
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="w-full lg:w-2/5 space-y-8">
                    <h3 class="text-lg font-bold text-gray-900">Add New Entries</h3>

                    <div v-if="errorMsg && !pendingConfirm"
                        class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                        {{ errorMsg }}
                    </div>

                    <div v-if="pendingConfirm"
                        class="bg-[#FFF9E5] border border-[#FACC15] text-gray-800 text-sm rounded-xl px-4 py-3 space-y-3">
                        <p>A similar value already exists: <b>{{ pendingConfirm.similar }}</b>.
                            Add "<b>{{ pendingConfirm.value }}</b>" anyway?</p>
                        <div class="flex gap-2">
                            <button @click="confirmSimilar"
                                class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-4 py-1.5 rounded-lg text-xs font-medium">Add
                                anyway</button>
                            <button @click="pendingConfirm = null"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium">Cancel</button>
                        </div>
                    </div>

                    <div v-for="field in [{ l: 'Main Group', k: 'mg' }, { l: 'Subgroup', k: 'sg' }]" :key="field.k"
                        class="space-y-3">
                        <label class="text-sm font-semibold text-gray-800">{{ field.l }}</label>
                        <div class="flex gap-2 mt-1.5">
                            <input type="text" v-model="newValues[field.k]" :placeholder="`Enter ${field.l}`"
                                @input="clearFeedback"
                                class=" flex-1 bg-[#F3F4F6] border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                            <button @click="addItem(field.k)"
                                class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-8  rounded-lg font-normal text-base whitespace-nowrap transition-all ">+
                                Add</button>
                        </div>
                    </div>

                    <p class="text-xs text-gray-400">FS Codes are fixed to BS and P&amp;L and cannot be changed.</p>
                </div>
            </div>
        </div>

        <!-- ======================= TENANT MAPPINGS ======================= -->
        <div v-else class="flex flex-col gap-8">
            <!-- No tenant selected: picker + directory -->
            <div v-if="!selectedTenant" class="flex flex-col gap-8">
                <div>
                    <h3 class="text-base font-semibold text-gray-900">Find a Tenant</h3>
                    <p class="text-sm text-[#717182]">Search by tenant name or license ID to add or manage their custom mappings.</p>
                    <div class="relative w-full sm:w-96 mt-3">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" v-model="picker.query" @input="onPickerInput"
                            placeholder="Search tenant name or license ID (min 2 chars)..."
                            class="w-full bg-[#F3F4F6] border-none rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                    </div>

                    <div v-if="picker.results.length" class="mt-2 border border-gray-100 rounded-xl divide-y divide-gray-100 w-full sm:w-96 overflow-hidden">
                        <button v-for="t in picker.results" :key="t.id" @click="selectTenant(t)"
                            class="w-full text-left px-4 py-2.5 hover:bg-[#F3FDFA] flex items-center justify-between">
                            <span class="text-sm text-gray-900">{{ t.name }}</span>
                            <span class="text-xs text-gray-400">{{ t.license_id }}</span>
                        </button>
                    </div>
                    <p v-else-if="picker.query.trim().length >= 2 && !picker.loading" class="text-xs text-gray-400 mt-2">No tenants found.</p>
                </div>

                <div class="border-t border-gray-100 pt-8">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 class="text-base font-semibold text-gray-900">Tenants with Custom Mappings</h3>
                            <p class="text-sm text-[#717182]">Tenants that already have a tenant-specific main/sub group.</p>
                        </div>
                        <div class="relative w-full sm:w-72">
                            <input type="text" v-model="directory.search" @input="onDirectorySearchInput"
                                placeholder="Filter by name or license ID..."
                                class="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                        </div>
                    </div>

                    <div class="border border-gray-100 rounded-2xl mt-4 overflow-hidden">
                        <table class="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr class="text-gray-800 text-sm">
                                    <th class="px-4 py-3 font-medium bg-gray-50 border-b border-gray-100">Tenant</th>
                                    <th class="px-4 py-3 font-medium bg-gray-50 border-b border-gray-100">License ID</th>
                                    <th class="px-4 py-3 font-medium bg-gray-50 border-b border-gray-100">Custom Mappings</th>
                                    <th class="px-4 py-3 font-medium bg-gray-50 border-b border-gray-100"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="t in directory.items" :key="t.id">
                                    <td class="px-4 py-3 text-sm text-gray-900">{{ t.name }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-500">{{ t.license_id }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-500">{{ t.custom_mapping_count }}</td>
                                    <td class="px-4 py-3 text-right">
                                        <button @click="selectTenant(t)"
                                            class="text-xs font-medium text-[#00896F] hover:underline">Manage</button>
                                    </td>
                                </tr>
                                <tr v-if="!directory.items.length">
                                    <td colspan="4" class="px-4 py-6 text-sm text-gray-400 text-center">No tenants with custom mappings yet.</td>
                                </tr>
                            </tbody>
                        </table>
                        <CommonPaginationBar v-if="directory.meta.total > 10" :meta="directory.meta"
                            @page-change="p => loadDirectory(p)"
                            @per-page-change="pp => loadDirectory(1, pp)" />
                    </div>
                </div>
            </div>

            <!-- Tenant selected: manage their custom main/sub groups (mirrors General's layout) -->
            <div v-else class="flex flex-col gap-12">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                    <div>
                        <h3 class="text-base font-semibold text-gray-900">{{ selectedTenant.name }}</h3>
                        <p class="text-sm text-[#717182]">{{ selectedTenant.license_id }} — custom main/sub group mappings.</p>
                    </div>
                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <div class="relative w-full sm:w-72">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input type="text" v-model="tenantSearch" @input="onTenantSearchInput" placeholder="Search groups..."
                                class="w-full bg-[#F3F4F6] border-none rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                        </div>
                        <button @click="clearTenant" class="text-sm font-medium text-gray-500 hover:text-gray-800 whitespace-nowrap">
                            &larr; Change tenant
                        </button>
                    </div>
                </div>

                <div class="flex flex-col lg:flex-row gap-12">
                    <div class="lg:w-3/5 flex flex-col gap-3">
                        <div class="border border-gray-100 rounded-2xl max-h-[60vh] overflow-y-auto">
                            <table class="w-full text-left border-separate border-spacing-0 table-fixed">
                                <thead>
                                    <tr class="text-gray-800 text-sm">
                                        <th class="px-4 py-4 w-1/2 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">Main Group</th>
                                        <th class="px-4 py-4 w-1/2 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">Subgroup</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="idx in visibleTenantRowCount" :key="idx">
                                        <td class="px-2 py-3 border-r border-gray-50 align-top">
                                            <div v-if="tenantMain.items[idx - 1]" class="flex items-center gap-2 group/cell h-10">
                                                <template v-if="editingCell === `mg-${tenantMain.items[idx - 1].id}`">
                                                    <input v-model="editValue" @blur="editingCell = null"
                                                        @keyup.enter="saveCell('mg', tenantMain.items[idx - 1])" v-focus
                                                        class="flex-1 min-w-0 h-full px-3 text-black rounded-xl border border-[#00896F] outline-none text-sm shadow-sm" />
                                                    <button @mousedown.prevent="saveCell('mg', tenantMain.items[idx - 1])"
                                                        class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                                </template>
                                                <template v-else>
                                                    <div class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                                        <span class="text-sm truncate">{{ tenantMain.items[idx - 1].name }}</span>
                                                        <svg @click="startEdit('mg', tenantMain.items[idx - 1])" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                            stroke="currentColor" stroke-width="2"
                                                            class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </div>
                                                    <button @click="prepareDelete('mg', tenantMain.items[idx - 1])"
                                                        class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                                        </svg></button>
                                                </template>
                                            </div>
                                        </td>
                                        <td class="px-2 py-3 align-top">
                                            <div v-if="tenantSub.items[idx - 1]" class="flex items-center gap-2 group/cell h-10">
                                                <template v-if="editingCell === `sg-${tenantSub.items[idx - 1].id}`">
                                                    <input v-model="editValue" @blur="editingCell = null"
                                                        @keyup.enter="saveCell('sg', tenantSub.items[idx - 1])" v-focus
                                                        class="flex-1 min-w-0 h-full px-3 rounded-xl text-black border border-[#00896F] outline-none text-sm shadow-sm" />
                                                    <button @mousedown.prevent="saveCell('sg', tenantSub.items[idx - 1])"
                                                        class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                                </template>
                                                <template v-else>
                                                    <div class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                                        <span class="text-sm truncate">{{ tenantSub.items[idx - 1].name }}</span>
                                                        <svg @click="startEdit('sg', tenantSub.items[idx - 1])" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                            stroke="currentColor" stroke-width="2"
                                                            class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </div>
                                                    <button @click="prepareDelete('sg', tenantSub.items[idx - 1])"
                                                        class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                                        </svg></button>
                                                </template>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="visibleTenantRowCount === 0">
                                        <td colspan="2" class="px-4 py-6 text-sm text-gray-400 text-center">
                                            No custom mappings for this tenant{{ tenantSearch ? ` matching "${tenantSearch}"` : '' }}.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Independent datasets: each paginates on its own, only shown past 10 rows -->
                        <CommonPaginationBar v-if="tenantMain.meta.total > 10" :meta="tenantMain.meta"
                            @page-change="p => loadTenantList('mg', p)"
                            @per-page-change="pp => loadTenantList('mg', 1, pp)" />
                        <CommonPaginationBar v-if="tenantSub.meta.total > 10" :meta="tenantSub.meta"
                            @page-change="p => loadTenantList('sg', p)"
                            @per-page-change="pp => loadTenantList('sg', 1, pp)" />
                    </div>

                    <div class="w-full lg:w-2/5 space-y-8">
                        <h3 class="text-lg font-bold text-gray-900">Add New Entries</h3>

                        <div v-if="errorMsg && !pendingConfirm"
                            class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                            {{ errorMsg }}
                        </div>

                        <div v-if="pendingConfirm"
                            class="bg-[#FFF9E5] border border-[#FACC15] text-gray-800 text-sm rounded-xl px-4 py-3 space-y-3">
                            <p>A similar value already exists: <b>{{ pendingConfirm.similar }}</b>.
                                Add "<b>{{ pendingConfirm.value }}</b>" anyway?</p>
                            <div class="flex gap-2">
                                <button @click="confirmSimilar"
                                    class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-4 py-1.5 rounded-lg text-xs font-medium">Add
                                    anyway</button>
                                <button @click="pendingConfirm = null"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium">Cancel</button>
                            </div>
                        </div>

                        <div v-for="field in [{ l: 'Main Group', k: 'mg' }, { l: 'Subgroup', k: 'sg' }]" :key="field.k"
                            class="space-y-3">
                            <label class="text-sm font-semibold text-gray-800">{{ field.l }}</label>
                            <div class="flex gap-2 mt-1.5">
                                <input type="text" v-model="newValues[field.k]" :placeholder="`Enter ${field.l}`"
                                    @input="clearFeedback"
                                    class=" flex-1 bg-[#F3F4F6] border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                                <button @click="addItem(field.k)"
                                    class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-8  rounded-lg font-normal text-base whitespace-nowrap transition-all ">+
                                    Add</button>
                            </div>
                        </div>

                        <p class="text-xs text-gray-400">These are extra entries for {{ selectedTenant.name }} only — a value already in the General list can't be duplicated here.</p>
                    </div>
                </div>
            </div>
        </div>

        <DataSourceSettingsDeleteModal :isOpen="isDeleteModalOpen" :isDark="isDark" :currentLang="currentLang"
            @close="isDeleteModalOpen = false" @confirm="confirmDelete" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: String })

const {
    getGLMasters,
    createMainGroup, createSubGroup,
    updateMainGroup, updateSubGroup,
    deleteMainGroup, deleteSubGroup,
    getGroupsForTenant,
    getTenantsWithCustomMappings,
} = useImplementation()

// --- Sub-tab -----------------------------------------------------------------
const mode = ref('general') // 'general' | 'tenant'

// --- General (unchanged) ------------------------------------------------------
const fsCodeItems = ref([])
const mainGroupItems = ref([])
const subGroupItems = ref([])

onMounted(async () => {
    const data = await getGLMasters()
    fsCodeItems.value = data.fs_codes ?? []
    mainGroupItems.value = data.main_groups ?? []
    subGroupItems.value = data.sub_groups ?? []
})

const search = ref('')
const matches = (text) => (text ?? '').toLowerCase().includes(search.value.trim().toLowerCase())
const filteredFs = computed(() => fsCodeItems.value.filter(i => matches(i.code)))
const filteredMain = computed(() => mainGroupItems.value.filter(i => matches(i.name)))
const filteredSub = computed(() => subGroupItems.value.filter(i => matches(i.name)))
const visibleRowCount = computed(() =>
    Math.max(filteredFs.value.length, filteredMain.value.length, filteredSub.value.length))

// --- Tenant mode: picker, directory, selected tenant, tenant lists ------------
const selectedTenant = ref(null) // { id, name, license_id }
const emptyMeta = () => ({ current_page: 1, per_page: 5, total: 0, last_page: 1 })

const picker = reactive({ query: '', results: [], loading: false })
let pickerTimer = null
async function onPickerInput() {
    clearTimeout(pickerTimer)
    const q = picker.query.trim()
    if (q.length < 2) { picker.results = []; return }
    pickerTimer = setTimeout(async () => {
        picker.loading = true
        try {
            const res = await getTenantsWithCustomMappings({ mode: 'all', search: q, perPage: 5 })
            picker.results = res.data ?? []
        } finally {
            picker.loading = false
        }
    }, 350)
}

const directory = reactive({ items: [], meta: emptyMeta(), search: '' })
let directoryTimer = null
async function loadDirectory(page = 1, perPage = directory.meta.per_page) {
    const res = await getTenantsWithCustomMappings({ mode: 'custom', search: directory.search, page, perPage })
    directory.items = res.data ?? []
    directory.meta = { current_page: res.current_page ?? 1, per_page: res.per_page ?? perPage, total: res.total ?? 0, last_page: res.last_page ?? 1 }
}
function onDirectorySearchInput() {
    clearTimeout(directoryTimer)
    directoryTimer = setTimeout(() => loadDirectory(1), 350)
}

const tenantMain = reactive({ items: [], meta: emptyMeta() })
const tenantSub = reactive({ items: [], meta: emptyMeta() })
const tenantSearch = ref('') // single search box drives both lists, like General
let tenantSearchTimer = null

async function loadTenantList(kind, page = 1, perPage = null) {
    if (!selectedTenant.value) return
    const state = kind === 'mg' ? tenantMain : tenantSub
    perPage = perPage ?? state.meta.per_page
    const res = await getGroupsForTenant(kind === 'mg' ? 'main' : 'sub', selectedTenant.value.id, {
        search: tenantSearch.value, page, perPage,
    })
    state.items = res.data ?? []
    state.meta = { current_page: res.current_page ?? 1, per_page: res.per_page ?? perPage, total: res.total ?? 0, last_page: res.last_page ?? 1 }
}

const visibleTenantRowCount = computed(() => Math.max(tenantMain.items.length, tenantSub.items.length))

function onTenantSearchInput() {
    clearTimeout(tenantSearchTimer)
    tenantSearchTimer = setTimeout(() => {
        loadTenantList('mg', 1)
        loadTenantList('sg', 1)
    }, 350)
}

function selectTenant(t) {
    selectedTenant.value = t
    picker.query = ''; picker.results = []
    tenantSearch.value = ''
    clearFeedback()
    loadTenantList('mg', 1)
    loadTenantList('sg', 1)
}

function clearTenant() {
    selectedTenant.value = null
    tenantMain.items = []; tenantSub.items = []
    tenantMain.meta = emptyMeta(); tenantSub.meta = emptyMeta()
    clearFeedback()
    loadDirectory(1)
}

// --- Error / similar-value feedback (shared) ----------------------------------
const errorMsg = ref('')
const pendingConfirm = ref(null) // { action: 'add'|'edit', kind, value, similar, id }

const clearFeedback = () => { errorMsg.value = ''; pendingConfirm.value = null }

// Switching tabs must not leak a stale alert from one screen into the other —
// e.g. a "duplicate in tenant list" error must not still be showing after the
// user switches back to the General tab.
let directoryLoaded = false
watch(mode, (m) => {
    clearFeedback()
    if (m === 'tenant' && !selectedTenant.value && !directoryLoaded) {
        directoryLoaded = true
        loadDirectory(1)
    }
})

const handleApiError = (e, context) => {
    const errors = e?.data?.errors
    const message = errors?.value?.[0] ?? e?.data?.message ?? 'Something went wrong. Please try again.'

    if (context && errors?.similar?.[0]) {
        pendingConfirm.value = { ...context, similar: errors.similar[0] }
        errorMsg.value = ''
    } else {
        errorMsg.value = message
        pendingConfirm.value = null
    }
}

// --- Mode-aware list resolution (shared edit/delete/add logic) ---------------
function listFor(kind) {
    if (mode.value === 'tenant') return kind === 'mg' ? tenantMain.items : tenantSub.items
    return kind === 'mg' ? mainGroupItems.value : subGroupItems.value
}
function replaceInList(kind, updated) {
    const arr = listFor(kind)
    const i = arr.findIndex(x => x.id === updated.id)
    if (i !== -1) Object.assign(arr[i], updated)
}
function removeFromList(kind, id) {
    if (mode.value === 'tenant') {
        const state = kind === 'mg' ? tenantMain : tenantSub
        state.items = state.items.filter(i => i.id !== id)
        state.meta.total = Math.max(0, state.meta.total - 1)
    } else {
        const list = kind === 'mg' ? mainGroupItems : subGroupItems
        list.value = list.value.filter(i => i.id !== id)
    }
}

// --- Edit (main/sub only; items identified by id) -----------------------------
const editingCell = ref(null) // `${kind}-${id}`
const editValue = ref('')
const vFocus = { mounted: (el) => el.focus() }

const startEdit = (kind, item) => {
    clearFeedback()
    editingCell.value = `${kind}-${item.id}`
    editValue.value = item.name
}

const saveCell = async (kind, item, confirm = false) => {
    editingCell.value = null
    const value = editValue.value.trim()
    if (!value || value === item.name) return

    try {
        const updated = kind === 'mg'
            ? await updateMainGroup(item.id, value, confirm)
            : await updateSubGroup(item.id, value, confirm)
        replaceInList(kind, updated)
        clearFeedback()
    } catch (e) {
        handleApiError(e, { action: 'edit', kind, value, id: item.id })
    }
}

// --- Delete --------------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const pendingDelete = reactive({ kind: '', id: null })

const prepareDelete = (kind, item) => {
    clearFeedback()
    pendingDelete.kind = kind
    pendingDelete.id = item.id
    isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
    const { kind, id } = pendingDelete
    try {
        if (kind === 'mg') await deleteMainGroup(id)
        else await deleteSubGroup(id)
        removeFromList(kind, id)
    } catch (e) {
        handleApiError(e, null)
    }
    isDeleteModalOpen.value = false
}

// --- Add -------------------------------------------------------------------------
const newValues = reactive({ mg: '', sg: '' })

const addItem = async (kind, confirm = false, value = null) => {
    value = (value ?? newValues[kind]).trim()
    if (!value) return

    const tenantId = mode.value === 'tenant' ? selectedTenant.value?.id ?? null : null

    try {
        const item = kind === 'mg'
            ? await createMainGroup(value, confirm, tenantId)
            : await createSubGroup(value, confirm, tenantId)

        if (mode.value === 'tenant') {
            const state = kind === 'mg' ? tenantMain : tenantSub
            state.items.unshift(item)
            state.meta.total += 1
        } else {
            const list = kind === 'mg' ? mainGroupItems : subGroupItems
            list.value.push(item)
        }

        newValues[kind] = ''
        clearFeedback()
    } catch (e) {
        handleApiError(e, { action: 'add', kind, value })
    }
}

const confirmSimilar = async () => {
    const { action, kind, value, id } = pendingConfirm.value
    pendingConfirm.value = null

    if (action === 'add') {
        await addItem(kind, true, value)
    } else if (action === 'edit') {
        const list = listFor(kind)
        const item = list.find(i => i.id === id)
        if (item) {
            editValue.value = value
            await saveCell(kind, item, true)
        }
    }
}
</script>

<style scoped>
table {
    table-layout: fixed;
}

.group-hover\/cell\:opacity-100 {
    transition: opacity 0.2s ease;
}
</style>
