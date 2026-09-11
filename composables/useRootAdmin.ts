export function useRootAdmin() {
  const rootCookie = useCookie<string | null>('taxaid_root_token', { maxAge: 60 * 60 * 24 })
  const { admin } = useAdminAuth()

  const isRootUnlocked = computed(() => !!rootCookie.value)
  const rootToken = computed(() => rootCookie.value)
  const rootLoading = useState<boolean>('root_admin_loading', () => false)

  async function unlock(password: string) {
    rootLoading.value = true
    try {
      const res: any = await useAdminApi('/admin/root/unlock', {
        method: 'POST',
        body: { password },
      })

      if (res?.success && res?.root_token) {
        rootCookie.value = res.root_token
        return { success: true, message: res.message || 'Authenticated successfully' }
      }
      return { success: false, message: res?.message || 'Invalid credentials' }
    } catch (err: any) {
      return {
        success: false,
        message: err?.data?.message || err?.message || 'Authentication failed',
      }
    } finally {
      rootLoading.value = false
    }
  }

  function lock() {
    rootCookie.value = null
  }

  async function runArtisan(command: string, confirmPassword?: string, runAsJob?: boolean) {
    return await useAdminApi('/admin/root/artisan', {
      method: 'POST',
      headers: {
        'X-Root-Token': rootToken.value || '',
        ...(confirmPassword ? { 'X-Root-Confirm-Password': confirmPassword } : {}),
      },
      body: {
        command,
        run_as_job: !!runAsJob,
        confirm_password: confirmPassword,
      },
    })
  }

  async function runTinker(code: string, confirmPassword?: string, runAsJob?: boolean) {
    return await useAdminApi('/admin/root/tinker', {
      method: 'POST',
      headers: {
        'X-Root-Token': rootToken.value || '',
        ...(confirmPassword ? { 'X-Root-Confirm-Password': confirmPassword } : {}),
      },
      body: {
        code,
        run_as_job: !!runAsJob,
        confirm_password: confirmPassword,
      },
    })
  }

  async function getJobStatus(jobId: string) {
    return await useAdminApi(`/admin/root/jobs/${jobId}`, {
      headers: {
        'X-Root-Token': rootToken.value || '',
      },
    })
  }

  async function runDbQuery(query: string, schema?: string, confirmPassword?: string) {
    return await useAdminApi('/admin/root/db-query', {
      method: 'POST',
      headers: {
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
    return await useAdminApi('/admin/root/tenants', {
      headers: {
        'X-Root-Token': rootToken.value || '',
      },
    })
  }

  async function testFirebase(payload: any) {
    return await useAdminApi('/admin/root/test-firebase', {
      method: 'POST',
      headers: {
        'X-Root-Token': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function testMail(payload: any) {
    return await useAdminApi('/admin/root/test-mail', {
      method: 'POST',
      headers: {
        'X-Root-Token': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function getSystemInfo() {
    return await useAdminApi('/admin/root/system-info', {
      headers: {
        'X-Root-Token': rootToken.value || '',
      },
    })
  }

  async function getCommands() {
    return await useAdminApi('/admin/root/commands', {
      headers: {
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
    getJobStatus,
    runDbQuery,
    getCommands,
    getTenants,
    testFirebase,
    testMail,
    getSystemInfo,
  }
}
