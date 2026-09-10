export function useRootAdmin() {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('admin_token')
  const rootCookie = useCookie<string | null>('taxaid_root_token', { maxAge: 60 * 60 * 24 })
  const { admin } = useAdminAuth()

  const isRootUnlocked = computed(() => !!rootCookie.value)
  const rootToken = computed(() => rootCookie.value)
  const rootLoading = useState<boolean>('root_admin_loading', () => false)

  async function unlock(password: string) {
    rootLoading.value = true
    try {
      const res: any = await $fetch('/admin/root/unlock', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenCookie.value}`,
        },
        body: { password },
      })

      if (res?.success && res?.root_token) {
        rootCookie.value = res.root_token
        return { success: true, message: res.message || 'Root access unlocked' }
      }
      return { success: false, message: res?.message || 'Invalid root password' }
    } catch (err: any) {
      return {
        success: false,
        message: err?.data?.message || err?.message || 'Failed to authenticate root password',
      }
    } finally {
      rootLoading.value = false
    }
  }

  function lock() {
    rootCookie.value = null
  }

  async function runArtisan(command: string, confirmPassword?: string) {
    return await $fetch('/admin/root/artisan', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
        ...(confirmPassword ? { 'X-Root-Confirm-Password': confirmPassword } : {}),
      },
      body: {
        command,
        confirm_password: confirmPassword,
      },
    })
  }

  async function runTinker(code: string, confirmPassword?: string) {
    return await $fetch('/admin/root/tinker', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
        ...(confirmPassword ? { 'X-Root-Confirm-Password': confirmPassword } : {}),
      },
      body: {
        code,
        confirm_password: confirmPassword,
      },
    })
  }

  async function runDbQuery(query: string, schema?: string, confirmPassword?: string) {
    return await $fetch('/admin/root/db-query', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
        ...(confirmPassword ? { 'X-Root-Confirm-Password': confirmPassword } : {}),
      },
      body: {
        query,
        schema: schema || 'public',
        confirm_password: confirmPassword,
      },
    })
  }

  async function getTenants() {
    return await $fetch('/admin/root/tenants', {
      baseURL: config.public.apiBase,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
      },
    })
  }

  async function testFirebase(payload: any) {
    return await $fetch('/admin/root/test-firebase', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function testMail(payload: any) {
    return await $fetch('/admin/root/test-mail', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function getSystemInfo() {
    return await $fetch('/admin/root/system-info', {
      baseURL: config.public.apiBase,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
      },
    })
  }

  async function getCommands() {
    return await $fetch('/admin/root/commands', {
      baseURL: config.public.apiBase,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenCookie.value}`,
        'X-Root-Token': rootToken.value || '',
      },
    })
  }

  return {
    isRootUnlocked,
    rootToken,
    rootLoading,
    unlock,
    lock,
    runArtisan,
    runTinker,
    runDbQuery,
    getCommands,
    getTenants,
    testFirebase,
    testMail,
    getSystemInfo,
  }
}
