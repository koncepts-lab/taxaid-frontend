import { ref } from 'vue'

export interface AdminUser {
  id: number
  full_name: string
  email: string
  phone_number: string | null
  status: 'active' | 'inactive'
  assigned_systems: string[]
  admin_role_id: number
  department_id: number
  role?: { id: number; name: string }
  department?: { id: number; name: string }
}

export interface AdminRole { id: number; name: string }
export interface Department { id: number; name: string }

const _token = ref<string | null>(null)

export function useSuperAdmin() {
  const config      = useRuntimeConfig()
  const tokenCookie = useCookie('admin_token')

  if (!_token.value && tokenCookie.value) _token.value = tokenCookie.value

  function apiFetch(url: string, options: any = {}) {
    const method     = (options.method || 'GET').toUpperCase()
    const isFormData = options.body instanceof FormData
    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(method !== 'GET' && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(_token.value ? { 'Authorization': `Bearer ${_token.value}` } : {}),
        ...options.headers,
      },
    })
  }

  async function getStats(): Promise<any> {
    return apiFetch('/admin/dashboard/statistics')
  }

  async function getSystemCounts(): Promise<any> {
    return apiFetch('/admin/dashboard/system-user-counts')
  }

  async function getUsers(): Promise<AdminUser[]> {
    const res: any = await apiFetch('/admin/users')
    return res.data ?? res
  }

  async function searchUsers(query: string): Promise<AdminUser[]> {
    const res: any = await apiFetch(`/admin/users/search?search=${encodeURIComponent(query)}`)
    return res.data ?? res
  }

  async function getUser(id: number): Promise<AdminUser> {
    const res: any = await apiFetch(`/admin/users/${id}`)
    return res.data ?? res
  }

  async function createUser(data: Record<string, any>): Promise<AdminUser> {
    const res: any = await apiFetch('/admin/users', { method: 'POST', body: data })
    return res.data ?? res
  }

  async function updateUser(id: number, data: Record<string, any>): Promise<AdminUser> {
    const res: any = await apiFetch(`/admin/users/${id}`, { method: 'PUT', body: data })
    return res.data ?? res
  }

  async function deleteUser(id: number): Promise<void> {
    await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
  }

  async function activateUser(id: number): Promise<void> {
    await apiFetch(`/admin/users/${id}/activate`, { method: 'PATCH' })
  }

  async function deactivateUser(id: number): Promise<void> {
    await apiFetch(`/admin/users/${id}/deactivate`, { method: 'PATCH' })
  }

  async function updateSystems(id: number, systems: string[]): Promise<void> {
    await apiFetch(`/admin/users/${id}/assigned-systems`, { method: 'PATCH', body: { assigned_systems: systems } })
  }

  async function getRoles(): Promise<AdminRole[]> {
    const res: any = await apiFetch('/admin/roles')
    const list = res.data ?? res
    return list.filter((r: any) => r.id !== null)
  }

  async function getDepartments(): Promise<Department[]> {
    const res: any = await apiFetch('/admin/departments')
    return res.data ?? res
  }

  async function getDashboards(): Promise<any[]> {
    const res: any = await apiFetch('/admin/dashboards')
    return res.data ?? res
  }

  return {
    getStats, getSystemCounts,
    getUsers, searchUsers, getUser, createUser, updateUser, deleteUser,
    activateUser, deactivateUser, updateSystems,
    getRoles, getDepartments, getDashboards,
  }
}
