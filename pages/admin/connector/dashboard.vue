<template>
  <NuxtLayout name="admin">
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto overflow-x-hidden">

      <!-- Page title -->
      <div class="space-y-1">
        <h1 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Connector Dashboard</h1>
        <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Groups, sync status, and version rollout for the Tally connector</p>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(metric, idx) in statCards" :key="idx"
             :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
             class="rounded-[16px] p-6 border shadow-sm">
          <h5 class="text-[14px] font-medium opacity-70 mb-4">{{ metric.title }}</h5>
          <span class="text-[32px] font-semibold leading-tight" :class="isDark ? 'text-white' : metric.textClass">{{ metric.value }}</span>
        </div>
      </div>

      <!-- Navigation Tabs (sized to content, not stretched) -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="inline-flex items-center gap-1 overflow-x-auto no-scrollbar rounded-[35px] p-[10px] border shadow-sm">
        <button v-for="tab in tabs" :key="tab"
                @click="setTab(tab)"
                class="px-6 py-2.5 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap"
                :class="activeTab === tab
                  ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] font-normal')
                  : (isDark ? 'bg-transparent text-white/70' : 'bg-transparent text-[#0A0A0A] font-normal')">
          {{ tab }}
        </button>
      </div>

      <!-- Sync Status -->
      <div v-if="activeTab === 'Sync Status'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Sync Status</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Per-tenant connector sync status and group assignment</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-48">
              <CommonSelectDropdown v-model="tenantGroupFilterLabel" @update:modelValue="onGroupFilterChange"
                :options="groupFilterLabels" placeholder="All Groups" clear-label="All Groups" searchable plain />
            </div>
            <input v-model="tenantSearch" type="text" placeholder="Search by name or license ID..."
                   @input="debounce(() => loadTenants(1))"
                   class="w-64 h-[42px] px-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] text-[14px] bg-white text-[#1a1a1a]" />
            <button @click="loadTenants(tenantsMeta.current_page)" class="w-[42px] h-[42px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                    :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
              <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', tenantsLoading ? 'animate-spin' : '']" alt="refresh" />
            </button>
          </div>
        </div>

        <div class="overflow-x-auto overflow-y-auto rounded-[8px] h-[732px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Tenant</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Group</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Last Sync</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Connector Version</th>
                <th class="py-4 px-8 font-normal text-[15px]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <template v-if="tenantsLoading">
                <tr v-for="n in 10" :key="'sk'+n">
                  <td v-for="c in 5" :key="c" class="py-6 px-8"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!tenantRows.length">
                <td colspan="5" class="py-8 text-center text-gray-400 text-sm">No Tally-connected tenants yet.</td>
              </tr>
              <tr v-for="row in tenantRows" :key="row.tenant_id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">
                  {{ row.company_name }}<span v-if="row.license_id" class="text-gray-400"> ({{ row.license_id }})</span>
                </td>
                <td class="py-6 px-8 text-[14px] font-regular">
                  <div class="flex items-center gap-2">
                    <select :value="row.connector_group_id ?? ''" @change="onReassign(row, $event.target.value)"
                            class="rounded-[8px] border border-[#04C18F33] px-3 py-1.5 text-[13px] bg-white text-[#1a1a1a]">
                      <option value="" disabled>Unassigned</option>
                      <option v-for="g in groupRows" :key="g.id" :value="g.id">{{ g.name }}</option>
                    </select>
                    <button @click="pinTenantPrompt = row" class="text-[12px] text-[#00896F] hover:text-[#00705a] cursor-pointer whitespace-nowrap">
                      Pin dedicated
                    </button>
                  </div>
                </td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ formatDate(row.last_sync_at) }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ row.connector_version ?? '—' }}</td>
                <td class="py-6 px-8 text-[14px] font-regular">
                  <span :class="row.needs_full_resync ? 'bg-[#FEF2F2] text-[#C10007] border-[#FFA6A6]' : 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]'"
                        class="px-3 py-1 rounded-full text-[12px] font-medium border">
                    {{ row.needs_full_resync ? 'Full Resync Pending' : 'OK' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="tenantsMeta.total > 0" :meta="tenantsMeta" :loading="tenantsLoading"
          @page-change="(p) => loadTenants(p)" @per-page-change="(pp) => loadTenants(1, pp)" />
      </div>

      <!-- Groups -->
      <div v-if="activeTab === 'Groups'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Connector Groups</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Edit name, sync time, interval, and notes here</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center rounded-full border border-[#04C18F33] p-1 text-[12px] font-medium">
              <button @click="setGroupsSubTab('default')" class="px-4 py-1.5 rounded-full transition-colors" :class="groupsSubTab === 'default' ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">Default Groups</button>
              <button @click="setGroupsSubTab('custom')" class="px-4 py-1.5 rounded-full transition-colors" :class="groupsSubTab === 'custom' ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">Custom Groups</button>
            </div>
            <div class="flex items-center rounded-full border border-[#04C18F33] p-1 text-[12px] font-medium">
              <button @click="is24Hour = false" class="px-3 py-1 rounded-full transition-colors" :class="!is24Hour ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">12h</button>
              <button @click="is24Hour = true" class="px-3 py-1 rounded-full transition-colors" :class="is24Hour ? 'bg-[#82FFE0] text-[#0A0A0A]' : 'text-gray-500'">24h</button>
            </div>
          </div>
        </div>

        <!-- Default Groups -->
        <div v-if="groupsSubTab === 'default'" class="space-y-4">
          <div class="rounded-[16px] border p-3" :class="isDark ? 'border-white/10' : 'border-gray-200'">
          <div class="space-y-4 overflow-y-auto overflow-x-hidden pr-1 h-[932px]">
            <template v-if="groupsLoading">
              <div v-for="n in 3" :key="'sk'+n" class="rounded-[12px] border p-5 h-[300px]" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#E0F9F3]/40 border-[#6FDBBF]'">
                <div class="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div class="flex gap-4 mb-4">
                  <div class="h-10 w-40 bg-gray-100 rounded animate-pulse"></div>
                  <div class="h-10 w-40 bg-gray-100 rounded animate-pulse"></div>
                  <div class="h-10 w-32 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div class="h-10 w-48 bg-gray-100 rounded animate-pulse mb-4"></div>
                <div class="h-14 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
            </template>
            <div v-else-if="!groupRows.length" class="py-8 text-center text-gray-400 text-sm">No groups yet — one is created automatically when the first connector activates.</div>
            <AdminConnectorGroupEditCard v-for="g in groupRows" :key="g.id"
              :group="g" :draft="draftFor(g)" :is24-hour="is24Hour"
              :saving="savingGroupId === g.id" :saved="savedGroupId === g.id"
              @save="saveGroupDraft(g)" />
          </div>
          </div>
          <CommonPaginationBar v-if="groupsMeta.total > 0" :meta="groupsMeta" :loading="groupsLoading"
            @page-change="(p) => loadGroups(p)" @per-page-change="(pp) => loadGroups(1, pp)" />

          <div class="flex flex-wrap items-center gap-3 pt-4 border-t" :class="isDark ? 'border-white/10' : 'border-[#E5E5E5]'">
            <label class="text-[13px] font-medium">Max Groups</label>
            <input v-model.number="maxGroupsDraft" type="number" min="1"
                   class="w-24 rounded-[8px] border border-[#04C18F33] px-3 py-1.5 text-[14px]" />
            <button @click="saveMaxGroups" :disabled="savingMaxGroups"
                    class="px-4 py-1.5 rounded-[10px] bg-[#00896F] text-white text-[13px] font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
              {{ savingMaxGroups ? 'Saving...' : 'Save & Reshard' }}
            </button>
            <p v-if="reshardMessage" class="text-[13px] text-[#00896F]">{{ reshardMessage }}</p>
          </div>
        </div>

        <!-- Custom Groups -->
        <div v-else class="space-y-4">
          <div class="flex justify-end">
            <button @click="openCustomGroupModal" class="px-5 py-2.5 rounded-[10px] bg-[#00896F] text-white text-[14px] font-medium hover:bg-[#00705a] transition-colors cursor-pointer">
              + Add Custom Group
            </button>
          </div>

          <div class="rounded-[16px] border p-3" :class="isDark ? 'border-white/10' : 'border-gray-200'">
          <div class="space-y-4 overflow-y-auto overflow-x-hidden pr-1 h-[932px]">
            <template v-if="customGroupsLoading">
              <div v-for="n in 3" :key="'sk'+n" class="rounded-[12px] border p-5 h-[300px]" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#E0F9F3]/40 border-[#6FDBBF]'">
                <div class="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div class="flex gap-4 mb-4">
                  <div class="h-10 w-40 bg-gray-100 rounded animate-pulse"></div>
                  <div class="h-10 w-40 bg-gray-100 rounded animate-pulse"></div>
                  <div class="h-10 w-32 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div class="h-10 w-48 bg-gray-100 rounded animate-pulse mb-4"></div>
                <div class="h-14 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
            </template>
            <div v-else-if="!customGroupRows.length" class="py-8 text-center text-gray-400 text-sm">No custom groups yet.</div>
            <AdminConnectorGroupEditCard v-for="g in customGroupRows" :key="g.id"
              :group="g" :draft="draftFor(g)" :is24-hour="is24Hour" show-delete
              :saving="savingGroupId === g.id" :saved="savedGroupId === g.id"
              @save="saveGroupDraft(g)" @delete="deleteGroupTarget = g" />
          </div>
          </div>
          <CommonPaginationBar v-if="customGroupsMeta.total > 0" :meta="customGroupsMeta" :loading="customGroupsLoading"
            @page-change="(p) => loadCustomGroups(p)" @per-page-change="(pp) => loadCustomGroups(1, pp)" />
        </div>
      </div>

      <!-- Delete custom group confirm -->
      <Teleport to="body">
        <div v-if="deleteGroupTarget" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-md w-[400px] max-w-full p-8">
            <h2 class="text-[17px] font-semibold text-gray-900 mb-2">Delete "{{ deleteGroupTarget.name }}"?</h2>
            <p class="text-sm text-gray-500 mb-4">
              Any tenant(s) currently in this group move back into the normal round-robin pool first.
            </p>
            <div class="flex gap-3 justify-end">
              <button @click="deleteGroupTarget = null" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
              <button @click="confirmDeleteCustomGroup" :disabled="deletingGroup" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 cursor-pointer">
                {{ deletingGroup ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Add Custom Group modal -->
      <Teleport to="body">
        <div v-if="showCustomGroupModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showCustomGroupModal = false">
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[520px] max-w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between">
              <h3 class="text-[18px] font-semibold text-gray-900">New Custom Group</h3>
              <button @click="showCustomGroupModal = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
            </div>

            <div>
              <label class="block text-[13px] font-medium mb-1">Name</label>
              <input v-model="customGroupForm.name" type="text" placeholder="e.g. Acme LLC (dedicated)"
                     class="w-full rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
            </div>

            <div class="flex gap-4">
              <div>
                <label class="block text-[13px] font-medium mb-1">Sync Time (cycle 1)</label>
                <AdminConnectorTimeWheelPicker v-model="customGroupForm.sync_time" :is24-hour="is24Hour" />
              </div>
              <div>
                <label class="block text-[13px] font-medium mb-1">Cycle 2 Time</label>
                <div class="flex items-center gap-2">
                  <AdminConnectorTimeWheelPicker v-model="customGroupForm.cycle_2_time" :is24-hour="is24Hour" />
                  <label class="flex items-center gap-1.5 text-[12px] text-gray-600 whitespace-nowrap cursor-pointer">
                    <input type="checkbox" v-model="customGroupForm.cycle_2_enabled" class="w-4 h-4 accent-[#00896F] cursor-pointer" />
                    Enabled
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[13px] font-medium mb-1">Reconciliation Interval (minutes)</label>
              <input v-model.number="customGroupForm.reconciliation_interval_minutes" type="number" min="1"
                     class="w-32 rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
            </div>

            <div>
              <label class="block text-[13px] font-medium mb-1">Scheduled Full Sync</label>
              <AdminConnectorFullSyncDayPicker
                :frequency="customGroupForm.full_sync_frequency" :day="customGroupForm.full_sync_day"
                @update:frequency="customGroupForm.full_sync_frequency = $event; customGroupForm.full_sync_day = $event === 'monthly' ? 1 : 0"
                @update:day="customGroupForm.full_sync_day = $event" />
            </div>

            <div>
              <label class="block text-[13px] font-medium mb-1">Notes</label>
              <textarea v-model="customGroupForm.notes" maxlength="2000" rows="2" placeholder="Reference notes..."
                        class="w-full rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px] resize-y"></textarea>
            </div>

            <p v-if="customGroupMessage" class="text-[13px] text-red-500">{{ customGroupMessage }}</p>

            <div class="flex justify-end gap-2 pt-2">
              <button @click="showCustomGroupModal = false" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
              <button @click="createCustomGroupNow" :disabled="!customGroupForm.name || creatingCustomGroup"
                      class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00896F] hover:bg-[#00705a] disabled:opacity-60 cursor-pointer">
                {{ creatingCustomGroup ? 'Creating...' : 'Create Group' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Update Packages -->
      <div v-if="activeTab === 'Update Packages'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Update Packages</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Connector version history and rollout</p>
          </div>
        </div>

        <!-- Upload — Super Admin only. Version/schedule fields sit here; the modal only handles file pick/drop. -->
        <div v-if="isSuperAdmin" class="flex flex-wrap items-end gap-4 p-4 rounded-[12px] border border-[#04C18F33]">
          <div>
            <label class="block text-[13px] font-medium mb-1">Version</label>
            <input v-model="upload.version" type="text" placeholder="e.g. 2.0.1" class="rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px] w-32" />
          </div>
          <div>
            <label class="block text-[13px] font-medium mb-1">Schedule for later (optional)</label>
            <div @click="showScheduleCalendar = true"
              class="px-3 py-2 rounded-[8px] border border-[#04C18F33] bg-white flex items-center gap-2 justify-between cursor-pointer text-[14px] min-w-[220px]">
              <span :class="!upload.scheduledAt ? 'text-[#717182]' : 'text-gray-700'">
                {{ upload.scheduledAt ? formatScheduleLabel(upload.scheduledAt) : 'Pick date & time' }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <Teleport to="body">
              <div v-if="showScheduleCalendar" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showScheduleCalendar = false">
                <div class="bg-white rounded-2xl shadow-xl p-4 space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-[15px] font-medium text-gray-900">Schedule Upload</h3>
                    <button @click="showScheduleCalendar = false" class="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div class="flex items-start gap-4">
                    <VDatePicker v-model="upload.scheduledAt" mode="date" color="teal" borderless />
                    <div class="border-l border-gray-100 pl-4 pt-1">
                      <span class="block text-[12px] text-gray-500 mb-2 text-center">Time</span>
                      <AdminConnectorTimeWheelPicker v-model="upload.scheduledTime" :is24-hour="is24Hour" inline />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2 pt-1">
                    <button @click="upload.scheduledAt = null; showScheduleCalendar = false" class="text-[12px] text-gray-500 hover:text-gray-700 px-2 py-1">Clear</button>
                    <button @click="showScheduleCalendar = false" class="text-[13px] text-white bg-[#00896F] hover:bg-[#00705a] rounded-md px-4 py-1.5">Done</button>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>
          <button @click="showUploadModal = true" :disabled="!upload.version"
                  class="px-5 py-2.5 rounded-[10px] bg-[#00896F] text-white text-[14px] font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
            Choose File & Upload
          </button>
        </div>
        <div v-if="uploading" class="max-w-sm space-y-1">
          <div class="h-2 rounded-full bg-[#04C18F1A] overflow-hidden">
            <div class="h-full bg-[#00896F] transition-all" :style="{ width: cd.uploadProgress.value + '%' }" />
          </div>
          <p class="text-[12px] text-[#00000080]">Uploading… {{ cd.uploadProgress.value }}%</p>
        </div>
        <p v-if="uploadMessage" class="text-[13px]" :class="uploadOk ? 'text-[#00896F]' : 'text-red-500'">{{ uploadMessage }}</p>

        <div class="overflow-x-auto overflow-y-auto rounded-[8px] h-[732px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Version</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Uploaded</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Scheduled At</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Status</th>
                <th class="py-4 px-8 font-normal text-[15px]">File</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <template v-if="updatesLoading">
                <tr v-for="n in 10" :key="'sk'+n">
                  <td v-for="c in 5" :key="c" class="py-6 px-8"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!updateRows.length">
                <td colspan="5" class="py-8 text-center text-gray-400 text-sm">No packages uploaded yet.</td>
              </tr>
              <tr v-for="pkg in updateRows" :key="pkg.id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px]">{{ pkg.version }}</td>
                <td class="py-6 px-8 text-[14px]">{{ formatDate(pkg.created_at) }}</td>
                <td class="py-6 px-8 text-[14px]">{{ pkg.scheduled_at ? formatDate(pkg.scheduled_at) : '—' }}</td>
                <td class="py-6 px-8 text-[14px]">
                  <span v-if="pkg.is_latest" class="px-3 py-1 rounded-full text-[12px] font-medium border bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]">Latest</span>
                  <button v-else @click="handleSetLatest(pkg)"
                          class="px-3 py-1 rounded-full text-[12px] font-medium border bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 cursor-pointer">
                    Set Latest
                  </button>
                </td>
                <td class="py-6 px-8 text-[14px]">
                  <button v-if="pkg.file_exists" @click="handleDownload(pkg)"
                          class="text-[#00896F] hover:text-[#00705a] font-medium text-[13px] cursor-pointer">
                    Download
                  </button>
                  <span v-else class="text-gray-400 text-[13px]">Missing on bucket</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="updatesMeta.total > 0" :meta="updatesMeta" :loading="updatesLoading"
          @page-change="(p) => loadUpdates(p)" @per-page-change="(pp) => loadUpdates(1, pp)" />
      </div>

      <!-- Live Status -->
      <div v-if="activeTab === 'Live Status'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Live Status</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Currently running group consumer tasks and active imports</p>
          </div>
          <button @click="loadLiveStatus" class="w-[42px] h-[42px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="[isDark ? 'invert brightness-0' : '', liveStatusLoading ? 'animate-spin' : '']" alt="refresh" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[16px] p-6 border shadow-sm">
            <h5 class="text-[14px] font-medium opacity-70 mb-4">Active Tenants Importing Now</h5>
            <span class="text-[32px] font-semibold leading-tight text-[#004D40]" :class="isDark ? 'text-white' : ''">{{ liveStatusRows.active_tenants_count }}</span>
          </div>
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[16px] p-6 border shadow-sm">
            <h5 class="text-[14px] font-medium opacity-70 mb-4">Queued Tenants</h5>
            <span class="text-[32px] font-semibold leading-tight text-[#004D40]" :class="isDark ? 'text-white' : ''">{{ liveStatusRows.queued_tenants_count }}</span>
          </div>
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[16px] p-6 border shadow-sm">
            <h5 class="text-[14px] font-medium opacity-70 mb-4">Total Groups</h5>
            <span class="text-[32px] font-semibold leading-tight text-[#004D40]" :class="isDark ? 'text-white' : ''">{{ liveStatusRows.total_groups }}</span>
          </div>
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-[16px] p-6 border shadow-sm">
            <h5 class="text-[14px] font-medium opacity-70 mb-4">Tasks Running Now</h5>
            <span class="text-[32px] font-semibold leading-tight text-[#004D40]" :class="isDark ? 'text-white' : ''">{{ liveStatusRows.processing_batches.length }}</span>
          </div>
        </div>

        <div class="overflow-x-auto overflow-y-auto rounded-[8px] h-[732px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Company</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Started</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Batch ID</th>
                <th class="py-4 px-8 font-normal text-[15px]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <template v-if="liveStatusLoading">
                <tr v-for="n in 10" :key="'sk'+n">
                  <td v-for="c in 4" :key="c" class="py-6 px-8"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!liveStatusRows.processing_batches.length">
                <td colspan="4" class="py-8 text-center text-gray-400 text-sm">No batches currently processing.</td>
              </tr>
              <tr v-for="batch in liveStatusRows.processing_batches" :key="batch.batch_id" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px]">{{ batch.company_name }}</td>
                <td class="py-6 px-8 text-[14px]">{{ formatDate(batch.started_at) }}</td>
                <td class="py-6 px-8 text-[14px] font-mono text-[12px]">{{ batch.batch_id }}</td>
                <td class="py-6 px-8 text-[14px]">
                  <span class="px-3 py-1 rounded-full text-[12px] font-medium border bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]">Processing</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="liveStatusMeta.total > 0" :meta="liveStatusMeta" :loading="liveStatusLoading"
          @page-change="(p) => loadLiveStatus(p)" @per-page-change="(pp) => loadLiveStatus(1, pp)" />
      </div>

      <!-- Analytics -->
      <div v-if="activeTab === 'Analytics'" :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-6 space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Analytics</h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">Import duration and size history, last {{ metricsDays }} days</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-40">
              <CommonSelectDropdown v-model="metricsStatusLabel" @update:modelValue="loadImportMetrics(1)"
                :options="['Synced', 'Failed']" placeholder="All Status" clear-label="All Status" plain />
            </div>
            <input v-model.number="metricsDays" type="number" min="1" @change="loadImportMetrics(1)"
                   class="w-20 rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
            <span class="text-[13px] text-gray-500">days</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="row in importMetricsRows.summary" :key="row.status"
               :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
               class="rounded-[16px] p-6 border shadow-sm">
            <h5 class="text-[14px] font-medium opacity-70 mb-2 capitalize">{{ row.status }}</h5>
            <p class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-white' : ''">{{ row.count }} batch(es)</p>
            <p class="text-[13px] text-gray-500 mt-1">avg {{ Math.round(row.avg_seconds || 0) }}s · avg {{ formatBytes(row.avg_file_size_bytes) }}</p>
          </div>
        </div>

        <div class="overflow-x-auto overflow-y-auto rounded-[8px] h-[732px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] cursor-pointer select-none" @click="toggleMetricsSort('tenant_id')">Tenant{{ sortArrow('tenant_id') }}</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] cursor-pointer select-none" @click="toggleMetricsSort('group_id')">Group{{ sortArrow('group_id') }}</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] cursor-pointer select-none" @click="toggleMetricsSort('file_size_bytes')">Size{{ sortArrow('file_size_bytes') }}</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] cursor-pointer select-none" @click="toggleMetricsSort('started_at')">Started{{ sortArrow('started_at') }}</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] cursor-pointer select-none" @click="toggleMetricsSort('status')">Status{{ sortArrow('status') }}</th>
                <th class="py-4 px-8 font-normal text-[15px]">Reason</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <template v-if="metricsLoading">
                <tr v-for="n in 10" :key="'sk'+n">
                  <td v-for="c in 6" :key="c" class="py-6 px-8"><div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: skeletonWidth(c) }"></div></td>
                </tr>
              </template>
              <tr v-else-if="!importMetricsRows.recent.length">
                <td colspan="6" class="py-8 text-center text-gray-400 text-sm">No import history yet.</td>
              </tr>
              <tr v-for="row in importMetricsRows.recent" :key="row.id" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px]">{{ row.tenant_id }}</td>
                <td class="py-6 px-8 text-[14px]">{{ row.group_id ?? '—' }}</td>
                <td class="py-6 px-8 text-[14px]">{{ formatBytes(row.file_size_bytes) }}</td>
                <td class="py-6 px-8 text-[14px]">{{ formatDate(row.started_at) }}</td>
                <td class="py-6 px-8 text-[14px]">
                  <span :class="row.status === 'synced' ? 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]' : 'bg-[#FEF2F2] text-[#C10007] border-[#FFA6A6]'"
                        class="px-3 py-1 rounded-full text-[12px] font-medium border">
                    {{ row.status }}
                  </span>
                </td>
                <td class="py-6 px-8 text-[13px] text-gray-500">{{ row.failure_reason ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="importMetricsMeta.total > 0" :meta="importMetricsMeta" :loading="metricsLoading"
          @page-change="(p) => loadImportMetrics(p)" @per-page-change="(pp) => loadImportMetrics(1, pp)" />
      </div>

    </main>

    <DataSourceUploadModal :isOpen="showUploadModal" title="Upload Connector Version"
      hint="TaxAidConnector .exe file" accept=".exe"
      @close="showUploadModal = false" @upload="handleUpload" />

    <div v-if="setLatestTarget" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-md w-[400px] max-w-full p-8">
        <h2 class="text-[17px] font-semibold text-gray-900 mb-2">Set as Latest?</h2>
        <p v-if="setLatestIsOlder" class="text-sm text-amber-600 mb-4">
          {{ setLatestTarget.version }} is older than the current latest ({{ currentLatestVersion }}).
          The connector doesn't compare version numbers — it just checks whether the server's latest differs
          from its own, so every connector would be prompted to "update" to this older build.
        </p>
        <p v-else class="text-sm text-gray-500 mb-4">
          This makes {{ setLatestTarget.version }} the version every connector is offered on its next check.
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="setLatestTarget = null" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          <button @click="confirmSetLatest" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00896F] hover:bg-[#00705a]">Set Latest</button>
        </div>
      </div>
    </div>

    <div v-if="pinTenantPrompt" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-md w-[400px] max-w-full p-8">
        <h2 class="text-[17px] font-semibold text-gray-900 mb-2">Pin to a Dedicated Group?</h2>
        <p class="text-sm text-gray-500 mb-4">
          Creates a new permanent custom group just for {{ pinTenantPrompt.company_name }}, separate from the normal round-robin pool.
        </p>
        <label class="block text-[13px] font-medium mb-1">Group Name</label>
        <input v-model="pinGroupName" type="text" :placeholder="`${pinTenantPrompt.company_name} (dedicated)`"
               class="w-full rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px] mb-4" />
        <div class="flex gap-3 justify-end">
          <button @click="pinTenantPrompt = null; pinGroupName = ''" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          <button @click="confirmPinTenant" :disabled="pinningTenant" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00896F] hover:bg-[#00705a] disabled:opacity-60">
            {{ pinningTenant ? 'Pinning...' : 'Pin' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'

useHead({ title: 'Connector Dashboard' })

const { isDark } = useTheme()
const { admin } = useAdminAuth()
const cd = useConnectorDashboard()

const isSuperAdmin = computed(() => admin.value?.role?.name === 'Super Admin')

const route  = useRoute()
const router = useRouter()
const tabs = ['Sync Status', 'Groups', 'Live Status', 'Analytics', 'Update Packages']
const tabMap = { 'sync-status': 'Sync Status', groups: 'Groups', 'live-status': 'Live Status', analytics: 'Analytics', 'update-packages': 'Update Packages' }
const tabKey = { 'Sync Status': 'sync-status', Groups: 'groups', 'Live Status': 'live-status', Analytics: 'analytics', 'Update Packages': 'update-packages' }
const activeTab = ref(tabMap[route.query.tab] ?? 'Sync Status')

function setTab(name) {
  activeTab.value = name
  router.replace({ query: { ...route.query, tab: tabKey[name] } })
  if (name === 'Live Status') loadLiveStatus()
  if (name === 'Analytics') loadImportMetrics()
}

const tenantRows = computed(() => cd.tenants.value)
const groupRows  = computed(() => cd.groups.value)
const updateRows = computed(() => cd.updates.value)
const tenantsMeta = computed(() => cd.tenantsMeta.value)
const groupsMeta  = computed(() => cd.groupsMeta.value)
const updatesMeta = computed(() => cd.updatesMeta.value)

const stats = ref({ total_tenants: 0, pending_full_resync: 0, total_groups: 0, latest_version: null })
const statCards = computed(() => [
  { title: 'Connected Tenants', value: stats.value.total_tenants, textClass: 'text-[#004D40]' },
  { title: 'Full Resync Pending', value: stats.value.pending_full_resync, textClass: stats.value.pending_full_resync ? 'text-[#C10007]' : 'text-[#004D40]' },
  { title: 'Connector Groups', value: stats.value.total_groups, textClass: 'text-[#004D40]' },
  { title: 'Latest Version', value: stats.value.latest_version ?? '—', textClass: 'text-[#004D40]' },
])

const tenantSearch = ref('')
const tenantGroupFilter = ref('')
const tenantGroupFilterLabel = ref('')
const groupFilterOptions = ref([])
const groupFilterLabelMap = computed(() => {
  const map = {}
  for (const g of groupFilterOptions.value) map[g.name + (g.is_custom ? ' (Custom)' : '')] = g.id
  return map
})
const groupFilterLabels = computed(() => Object.keys(groupFilterLabelMap.value))

function onGroupFilterChange() {
  tenantGroupFilter.value = tenantGroupFilterLabel.value ? groupFilterLabelMap.value[tenantGroupFilterLabel.value] : ''
  loadTenants(1)
}

const tenantsLoading = ref(false)
async function loadTenants(page = 1, perPage = tenantsMeta.value.per_page) {
  tenantsLoading.value = true
  await cd.getTenants(page, perPage, tenantSearch.value, tenantGroupFilter.value || null).catch(() => {})
  tenantsLoading.value = false
}
async function loadGroupFilterOptions() {
  groupFilterOptions.value = await cd.getGroupFilterOptions().catch(() => [])
}

let searchTimer = null
function debounce(fn) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fn, 400)
}

async function onReassign(row, groupId) {
  if (!groupId) return
  await cd.reassignGroup(row.tenant_id, Number(groupId)).catch(() => {})
  await loadTenants(tenantsMeta.value.current_page)
}

const pinTenantPrompt = ref(null)
const pinGroupName = ref('')
const pinningTenant = ref(false)
async function confirmPinTenant() {
  const row = pinTenantPrompt.value
  const name = pinGroupName.value || `${row.company_name} (dedicated)`
  pinningTenant.value = true
  try {
    await cd.pinTenantToCustomGroup(row.tenant_id, name)
    pinTenantPrompt.value = null
    pinGroupName.value = ''
    await Promise.all([loadTenants(tenantsMeta.value.current_page), loadGroups(1)])
  } catch (e) {
  } finally {
    pinningTenant.value = false
  }
}

const groupsSubTab = ref('default')
function setGroupsSubTab(tab) {
  groupsSubTab.value = tab
  if (tab === 'custom' && !customGroupRows.value.length) loadCustomGroups(1)
}

const groupsLoading = ref(false)
async function loadGroups(page = 1, perPage = groupsMeta.value.per_page) {
  groupsLoading.value = true
  await cd.getGroups(page, perPage).catch(() => {})
  for (const key of Object.keys(groupDrafts)) delete groupDrafts[key]
  groupsLoading.value = false
}

const customGroupRows = computed(() => cd.customGroups.value)
const customGroupsMeta = computed(() => cd.customGroupsMeta.value)
const customGroupsLoading = ref(false)
async function loadCustomGroups(page = 1, perPage = customGroupsMeta.value.per_page) {
  customGroupsLoading.value = true
  await cd.getCustomGroups(page, perPage).catch(() => {})
  customGroupsLoading.value = false
}

// Local edit buffer per group — nothing hits the backend until Save is clicked.
const groupDrafts = reactive({})
function draftFor(g) {
  if (!groupDrafts[g.id]) {
    groupDrafts[g.id] = {
      name: g.name,
      sync_time: g.sync_time ?? '10:00',
      cycle_2_time: g.cycle_2_time ?? '16:00',
      cycle_2_enabled: g.cycle_2_enabled ?? true,
      reconciliation_interval_minutes: g.reconciliation_interval_minutes,
      full_sync_frequency: g.full_sync_frequency ?? 'monthly',
      full_sync_day: g.full_sync_day ?? 1,
      notes: g.notes ?? '',
    }
  }
  return groupDrafts[g.id]
}

const savingGroupId = ref(null)
const savedGroupId = ref(null)
async function saveGroupDraft(g) {
  savingGroupId.value = g.id
  savedGroupId.value = null
  try {
    await cd.updateGroup(g.id, draftFor(g))
    await loadGroups(groupsMeta.value.current_page)
    savedGroupId.value = g.id
    setTimeout(() => { if (savedGroupId.value === g.id) savedGroupId.value = null }, 3000)
  } catch {
    // Left as-is — the draft stays editable so the admin can retry.
  } finally {
    savingGroupId.value = null
  }
}

const is24Hour = ref(true)

const updatesLoading = ref(false)
async function loadUpdates(page = 1, perPage = updatesMeta.value.per_page) {
  updatesLoading.value = true
  await cd.getUpdatePackages(page, perPage).catch(() => {})
  updatesLoading.value = false
  await loadStats()
}

const showUploadModal = ref(false)
const showScheduleCalendar = ref(false)
const upload = reactive({ version: '', scheduledAt: null, scheduledTime: '09:00' })
const uploadMessage = ref('')
const uploadOk = ref(true)
const uploading = ref(false)

const formatScheduleLabel = (date) => {
  const dateLabel = new Date(date).toLocaleDateString([], { dateStyle: 'medium' })
  return `${dateLabel}, ${upload.scheduledTime}`
}

function combinedScheduledAtIso() {
  if (!upload.scheduledAt) return null
  const [h, m] = upload.scheduledTime.split(':').map(Number)
  const d = new Date(upload.scheduledAt)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

async function handleUpload(file) {
  uploadMessage.value = ''
  uploading.value = true
  try {
    await cd.uploadUpdatePackage(file, upload.version, true, combinedScheduledAtIso())
    uploadOk.value = true
    uploadMessage.value = 'Package uploaded and set as latest.'
    upload.version = ''
    upload.scheduledAt = null
    upload.scheduledTime = '09:00'
    await loadUpdates(1)
  } catch (e) {
    uploadOk.value = false
    uploadMessage.value = e?.data?.message ?? e?.data?.error ?? 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

async function handleDownload(pkg) {
  try {
    await cd.downloadUpdatePackage(pkg.id, pkg.version)
  } catch {
    uploadOk.value = false
    uploadMessage.value = `Could not download ${pkg.version} — file missing on the bucket.`
  }
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}

const setLatestTarget = ref(null)
const currentLatestVersion = computed(() => updateRows.value.find(p => p.is_latest)?.version ?? null)
const setLatestIsOlder = computed(() =>
  setLatestTarget.value && currentLatestVersion.value
    ? compareVersions(setLatestTarget.value.version, currentLatestVersion.value) < 0
    : false
)

function handleSetLatest(pkg) {
  setLatestTarget.value = pkg
}

async function confirmSetLatest() {
  const pkg = setLatestTarget.value
  setLatestTarget.value = null
  try {
    await cd.setLatestPackage(pkg.id)
    uploadOk.value = true
    uploadMessage.value = `${pkg.version} is now the latest version.`
  } catch (e) {
    uploadOk.value = false
    uploadMessage.value = e?.data?.message ?? e?.data?.error ?? 'Could not set latest.'
  }
}

async function loadStats() {
  stats.value = await cd.getStats().catch(() => stats.value)
}

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
}

const formatBytes = (bytes) => {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let val = Number(bytes)
  let i = 0
  while (val >= 1024 && i < units.length - 1) { val /= 1024; i++ }
  return `${val.toFixed(1)} ${units[i]}`
}

const maxGroupsDraft = ref(10)
const savingMaxGroups = ref(false)
const reshardMessage = ref('')
async function loadShardingSettings() {
  const res = await cd.getShardingSettings().catch(() => null)
  if (res) maxGroupsDraft.value = res.max_groups
}
async function saveMaxGroups() {
  savingMaxGroups.value = true
  reshardMessage.value = ''
  try {
    const res = await cd.updateShardingSettings(maxGroupsDraft.value)
    reshardMessage.value = `Saved. ${res.moved ?? 0} tenant(s) moved.`
    await Promise.all([loadGroups(1), loadGroupFilterOptions()])
  } catch (e) {
    reshardMessage.value = e?.data?.message ?? e?.data?.error ?? 'Save failed.'
  } finally {
    savingMaxGroups.value = false
  }
}

const showCustomGroupModal = ref(false)
const creatingCustomGroup = ref(false)
const customGroupMessage = ref('')
const customGroupForm = reactive({
  name: '',
  sync_time: '10:00',
  cycle_2_time: '16:00',
  cycle_2_enabled: true,
  reconciliation_interval_minutes: 60,
  full_sync_frequency: 'monthly',
  full_sync_day: 1,
  notes: '',
})

function openCustomGroupModal() {
  Object.assign(customGroupForm, {
    name: '', sync_time: '10:00', cycle_2_time: '16:00', cycle_2_enabled: true,
    reconciliation_interval_minutes: 60, full_sync_frequency: 'monthly', full_sync_day: 1, notes: '',
  })
  customGroupMessage.value = ''
  showCustomGroupModal.value = true
}

async function createCustomGroupNow() {
  creatingCustomGroup.value = true
  customGroupMessage.value = ''
  try {
    await cd.createCustomGroup({ ...customGroupForm })
    showCustomGroupModal.value = false
    await Promise.all([loadCustomGroups(1), loadGroupFilterOptions()])
  } catch (e) {
    customGroupMessage.value = e?.data?.message ?? e?.data?.error ?? 'Could not create group.'
  } finally {
    creatingCustomGroup.value = false
  }
}

const deleteGroupTarget = ref(null)
const deletingGroup = ref(false)
async function confirmDeleteCustomGroup() {
  const group = deleteGroupTarget.value
  deletingGroup.value = true
  try {
    await cd.deleteCustomGroup(group.id)
    deleteGroupTarget.value = null
    await Promise.all([loadCustomGroups(1), loadGroupFilterOptions()])
  } catch (e) {
  } finally {
    deletingGroup.value = false
  }
}

function skeletonWidth(col) {
  const widths = ['85%', '70%', '60%', '55%', '65%', '50%']
  return widths[(col - 1) % widths.length]
}

const liveStatusRows = computed(() => cd.liveStatus.value)
const liveStatusMeta = computed(() => cd.liveStatusMeta.value)
const liveStatusLoading = ref(false)
async function loadLiveStatus(page = 1, perPage = liveStatusMeta.value.per_page) {
  liveStatusLoading.value = true
  await cd.getLiveStatus(page, perPage).catch(() => {})
  liveStatusLoading.value = false
}

const importMetricsRows = computed(() => cd.importMetrics.value)
const importMetricsMeta = computed(() => cd.importMetricsMeta.value)
const metricsDays = ref(60)
const metricsStatusLabel = ref('')
const metricsSortBy = ref('created_at')
const metricsSortDir = ref('desc')
const metricsLoading = ref(false)

function toggleMetricsSort(column) {
  if (metricsSortBy.value === column) {
    metricsSortDir.value = metricsSortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    metricsSortBy.value = column
    metricsSortDir.value = 'asc'
  }
  loadImportMetrics(1)
}

function sortArrow(column) {
  if (metricsSortBy.value !== column) return ''
  return metricsSortDir.value === 'asc' ? ' ↑' : ' ↓'
}

async function loadImportMetrics(page = 1, perPage = importMetricsMeta.value.per_page) {
  metricsLoading.value = true
  await cd.getImportMetrics({
    days: metricsDays.value,
    status: metricsStatusLabel.value ? metricsStatusLabel.value.toLowerCase() : null,
    sortBy: metricsSortBy.value,
    sortDir: metricsSortDir.value,
    page,
    perPage,
  }).catch(() => {})
  metricsLoading.value = false
}

onMounted(async () => {
  await Promise.all([loadStats(), loadGroups(1), loadTenants(1), loadUpdates(1), loadShardingSettings(), loadGroupFilterOptions()])
  if (activeTab.value === 'Live Status') loadLiveStatus()
  if (activeTab.value === 'Analytics') loadImportMetrics()
})
</script>
