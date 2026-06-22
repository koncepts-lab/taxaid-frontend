<template>
  <div class="min-h-screen bg-[#F3F4F6]">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="/images/logo.svg" alt="TaxAid" class="h-7" />
        <span class="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Super Admin</span>
      </div>
      <button @click="handleLogout" class="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1.5 transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Sign out
      </button>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="s in statCards" :key="s.label" class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p class="text-xs text-gray-500 mb-1">{{ s.label }}</p>
          <p class="text-2xl font-semibold text-[#013E32]">{{ s.value }}</p>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900 text-sm">Admin Users</h2>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-64">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input v-model="searchQuery" @input="handleSearch" placeholder="Search name or email..."
                class="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169]" />
            </div>
            <select v-model="statusFilter" @change="applyFilter"
              class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#008169] bg-white">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button @click="openCreate"
              class="bg-[#008169] hover:bg-[#006b56] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Admin
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <div v-if="tableLoading" class="py-16 text-center text-sm text-gray-400">Loading...</div>
          <div v-else-if="filtered.length === 0" class="py-16 text-center text-sm text-gray-400">No admins found</div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="text-xs text-gray-500 border-b border-gray-100">
                <th class="text-left px-4 py-3 font-medium">Name</th>
                <th class="text-left px-4 py-3 font-medium">Email</th>
                <th class="text-left px-4 py-3 font-medium">Role</th>
                <th class="text-left px-4 py-3 font-medium">Department</th>
                <th class="text-left px-4 py-3 font-medium">Systems</th>
                <th class="text-left px-4 py-3 font-medium">Status</th>
                <th class="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="admin in filtered" :key="admin.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-medium text-gray-900">{{ admin.full_name }}</td>
                <td class="px-4 py-3 text-gray-600">{{ admin.email }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-[#E6FFF5] text-[#008169]">
                    {{ admin.role?.name ?? '—' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ admin.department?.name ?? '—' }}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="s in (admin.assigned_systems ?? [])" :key="s"
                      class="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">
                      {{ systemLabel(s) }}
                    </span>
                    <span v-if="!admin.assigned_systems?.length" class="text-gray-400">—</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="admin.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'">
                    {{ admin.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button @click="openEdit(admin)" title="Edit"
                      class="text-gray-400 hover:text-[#008169] transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button v-if="admin.status === 'active'" @click="toggleStatus(admin)" title="Deactivate"
                      class="text-gray-400 hover:text-orange-500 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                      </svg>
                    </button>
                    <button v-else @click="toggleStatus(admin)" title="Activate"
                      class="text-gray-400 hover:text-green-600 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                      </svg>
                    </button>
                    <button @click="confirmDelete(admin)" title="Delete"
                      class="text-gray-400 hover:text-red-500 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">{{ editingId ? 'Edit Admin' : 'Add New Admin' }}</h3>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-4">
            <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ modalError }}</p>

            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input v-model="form.full_name" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169]" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input v-model="form.email" type="email" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169]" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input v-model="form.phone_number" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169]" />
              </div>
              <div v-if="!editingId">
                <label class="block text-xs font-medium text-gray-600 mb-1">Password</label>
                <input v-model="form.password" type="password" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169]" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select v-model="form.role_id" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169] bg-white">
                  <option value="">Select role</option>
                  <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select v-model="form.department_id" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#008169] bg-white">
                  <option value="">Select department</option>
                  <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-2">Assigned Systems</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="s in availableSystems" :key="s.value"
                    class="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" :value="s.value" v-model="form.assigned_systems"
                      class="rounded border-gray-300 text-[#008169] focus:ring-[#008169]" />
                    {{ s.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            <button @click="showModal = false"
              class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button @click="handleSubmit" :disabled="modalLoading"
              class="px-4 py-2 text-sm font-medium bg-[#008169] hover:bg-[#006b56] disabled:opacity-60 text-white rounded-lg transition-colors">
              {{ modalLoading ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete confirm -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showDeleteConfirm = false">
        <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Delete Admin</h3>
          <p class="text-sm text-gray-500 mb-5">Remove <span class="font-medium text-gray-700">{{ deletingAdmin?.full_name }}</span>? This cannot be undone.</p>
          <div class="flex gap-2">
            <button @click="showDeleteConfirm = false" class="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button @click="handleDelete" :disabled="modalLoading"
              class="flex-1 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-lg transition-colors">
              {{ modalLoading ? '...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import { useSuperAdmin } from '~/composables/superadmin/useSuperAdmin'
import { useAdminAuth } from '~/composables/superadmin/useAdminAuth'
import type { AdminUser, AdminRole, Department } from '~/composables/superadmin/useSuperAdmin'

const { isLoggedIn, logout } = useAdminAuth()
const {
  getStats, getUsers, searchUsers, createUser, updateUser, deleteUser,
  activateUser, deactivateUser,
  getRoles, getDepartments,
} = useSuperAdmin()

if (!isLoggedIn()) navigateTo('/superadmin/login')

const admins           = ref<AdminUser[]>([])
const filtered         = ref<AdminUser[]>([])
const roles            = ref<AdminRole[]>([])
const departments      = ref<Department[]>([])
const tableLoading     = ref(false)
const searchQuery      = ref('')
const statusFilter     = ref('')
const statCards        = ref<{ label: string; value: any }[]>([])

const showModal        = ref(false)
const showDeleteConfirm = ref(false)
const editingId        = ref<number | null>(null)
const deletingAdmin    = ref<AdminUser | null>(null)
const modalLoading     = ref(false)
const modalError       = ref('')

const availableSystems = [
  { value: 'admin_dashboard',          label: 'Admin' },
  { value: 'implementation_dashboard', label: 'Implementation' },
  { value: 'review_dashboard',         label: 'Review' },
  { value: 'ticketing_dashboard',      label: 'Ticketing' },
  { value: 'revenue_dashboard',        label: 'Revenue' },
]

const emptyForm = () => ({
  full_name: '', email: '', phone_number: '', password: '',
  role_id: '' as any, department_id: '' as any, assigned_systems: [] as string[],
})
const form = reactive(emptyForm())

function systemLabel(val: string) {
  return availableSystems.find(s => s.value === val)?.label ?? val
}

function applyFilter() {
  let list = [...admins.value]
  if (statusFilter.value) list = list.filter(a => a.status === statusFilter.value)
  filtered.value = list
}

let searchTimer: any = null
function handleSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    if (searchQuery.value.trim().length > 0) {
      const res = await searchUsers(searchQuery.value)
      admins.value  = res
      applyFilter()
    } else {
      await loadUsers()
    }
  }, 300)
}

async function loadUsers() {
  tableLoading.value = true
  try {
    admins.value = await getUsers()
    applyFilter()
  } finally {
    tableLoading.value = false
  }
}

async function loadStats() {
  try {
    const res: any = await getStats()
    const d = res.data ?? res
    statCards.value = [
      { label: 'Total Admins', value: d.total_users ?? 0 },
      { label: 'Active',       value: d.active_users ?? 0 },
      { label: 'Inactive',     value: d.inactive_users ?? 0 },
      { label: 'Total Roles',  value: d.total_roles ?? 0 },
    ]
  } catch {}
}

function openCreate() {
  editingId.value  = null
  modalError.value = ''
  Object.assign(form, emptyForm())
  showModal.value  = true
}

function openEdit(admin: AdminUser) {
  editingId.value  = admin.id
  modalError.value = ''
  Object.assign(form, {
    full_name:        admin.full_name,
    email:            admin.email,
    phone_number:     admin.phone_number ?? '',
    password:         '',
    role_id:          admin.admin_role_id,
    department_id:    admin.department_id,
    assigned_systems: [...(admin.assigned_systems ?? [])],
  })
  showModal.value = true
}

async function handleSubmit() {
  modalLoading.value = true
  modalError.value   = ''
  try {
    if (editingId.value) {
      await updateUser(editingId.value, {
        full_name:     form.full_name,
        email:         form.email,
        phone_number:  form.phone_number,
        role_id:       form.role_id,
        department_id: form.department_id,
      })
    } else {
      await createUser({ ...form })
    }
    showModal.value = false
    await loadUsers()
    await loadStats()
  } catch (e: any) {
    modalError.value = e?.data?.message ?? 'Something went wrong'
  } finally {
    modalLoading.value = false
  }
}

function confirmDelete(admin: AdminUser) {
  deletingAdmin.value     = admin
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!deletingAdmin.value) return
  modalLoading.value = true
  try {
    await deleteUser(deletingAdmin.value.id)
    showDeleteConfirm.value = false
    deletingAdmin.value     = null
    await loadUsers()
    await loadStats()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Cannot delete this admin')
  } finally {
    modalLoading.value = false
  }
}

async function toggleStatus(admin: AdminUser) {
  try {
    if (admin.status === 'active') await deactivateUser(admin.id)
    else await activateUser(admin.id)
    await loadUsers()
    await loadStats()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Action failed')
  }
}

function handleLogout() {
  logout()
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadStats()])
  roles.value       = await getRoles()
  departments.value = await getDepartments()
})
</script>
