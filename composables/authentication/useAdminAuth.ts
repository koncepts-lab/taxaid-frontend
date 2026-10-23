interface AdminUser {
  id: number
  full_name: string
  email: string
  status: string
  assigned_systems: string[]
  role: { id: number; name: string }
  department: { id: number; name: string }
}

let syncedThisLoad = false

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

  async function login(email: string, password: string, location: string | null = null): Promise<void> {
    let sessionMeta: Record<string, any> = {}
    try {
      sessionMeta = { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
    } catch {}
    if (location) sessionMeta.location = location

    const res: any = await $fetch('/admin/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: { email, password, ...sessionMeta },
    })
    tokenCookie.value = res.token
    userCookie.value  = JSON.stringify(res.admin ?? res.user ?? {})
    _admin.value      = res.admin ?? res.user ?? null
  }

  async function forgotPassword(email: string): Promise<void> {
    await $fetch('/admin/forgot-password', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: { email },
    })
  }

  async function resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
    await $fetch('/admin/reset-password', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: { token, password, password_confirmation: passwordConfirmation },
    })
  }

  async function logout() {
    try {
      await useAdminApi('/admin/logout', { method: 'POST' })
    } catch {}

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
    return navigateTo('/admin/management')
  }

  function updateFullName(fullName: string) {
    if (!_admin.value) return
    _admin.value = { ..._admin.value, full_name: fullName }
    userCookie.value = JSON.stringify(_admin.value)
  }

  async function syncFromServer(): Promise<void> {
    if (syncedThisLoad || !tokenCookie.value) return
    syncedThisLoad = true
    try {
      const res: any = await useAdminApi('/admin/me')
      const d = res?.data
      if (!d) return

      const fresh: AdminUser = {
        id: d.id,
        full_name: d.full_name,
        email: d.email,
        status: d.status,
        assigned_systems: d.assigned_systems ?? [],
        role: d.role ? { id: d.role.id, name: d.role.name } : (_admin.value?.role ?? { id: 0, name: '' }),
        department: d.department ? { id: d.department.id, name: d.department.name } : (_admin.value?.department ?? { id: 0, name: '' }),
      }

      _admin.value = fresh
      userCookie.value = JSON.stringify(fresh)
    } catch {}
  }

  return { admin: _admin, isLoggedIn, getRole, login, logout, redirectByRole, forgotPassword, resetPassword, updateFullName, syncFromServer }
}
