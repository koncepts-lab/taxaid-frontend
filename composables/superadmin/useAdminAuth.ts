interface AdminUser {
  id: number
  full_name: string
  email: string
  status: string
  assigned_systems: string[]
  role: { id: number; name: string }
  department: { id: number; name: string }
}

export function useAdminAuth() {
  const config      = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('admin_token', { maxAge: 60 * 60 * 24 * 7 })
  const userCookie  = useCookie<string | null>('admin_user',  { maxAge: 60 * 60 * 24 * 7 })
  // useState, not a module-level ref: a plain ref here is created once per server
  // process and reused across every SSR request, leaking one user's session state
  // into another's render (or into a stale null after a concurrent logout) — the
  // cause of the "logged out on refresh" bug. useState is per-request on the server.
  const _admin = useState<AdminUser | null>('admin_auth_user', () => null)

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
    if (process.client) {
      window.location.href = '/ad-aqnz-pro-auth-78z46'
    } else {
      navigateTo('/ad-aqnz-pro-auth-78z46')
    }
  }

  const isLoggedIn = () => !!tokenCookie.value
  const getRole    = () => _admin.value?.role?.name ?? null

  function redirectByRole() {
    return navigateTo('/admin/roles')
  }

  return { admin: _admin, isLoggedIn, getRole, login, logout, redirectByRole }
}
