import { ref } from 'vue'

interface AdminUser {
  id: number
  full_name: string
  email: string
  status: string
  assigned_systems: string[]
  role: { id: number; name: string }
  department: { id: number; name: string }
}

const _admin = ref<AdminUser | null>(null)

export function useAdminAuth() {
  const config      = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('admin_token', { maxAge: 60 * 60 * 24 * 7 })
  const userCookie  = useCookie<string | null>('admin_user',  { maxAge: 60 * 60 * 24 * 7 })

  if (!_admin.value && userCookie.value) {
    try { _admin.value = JSON.parse(userCookie.value) } catch {}
  }

  async function login(email: string, password: string): Promise<void> {
    const res: any = await $fetch('/admin/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: { email, password },
    })
    tokenCookie.value = res.token
    userCookie.value  = JSON.stringify(res.admin ?? res.user ?? {})
    _admin.value      = res.admin ?? res.user ?? null
  }

  function logout() {
    tokenCookie.value = null
    userCookie.value  = null
    _admin.value      = null
    navigateTo('/superadmin/login')
  }

  const isLoggedIn = () => !!tokenCookie.value
  const getRole    = () => _admin.value?.role?.name ?? null

  function redirectByRole() {
    return navigateTo('/superadmin')
  }

  return { admin: _admin, isLoggedIn, getRole, login, logout, redirectByRole }
}
