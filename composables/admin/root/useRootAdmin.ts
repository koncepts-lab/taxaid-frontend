export function useRootAdmin() {
  const rootCookie = useCookie<string | null>('rid', { maxAge: 60 * 55 })
  const { admin } = useAdminAuth()

  const isRootUnlocked = computed(() => !!rootCookie.value)
  const rootToken = computed(() => rootCookie.value)
  const rootLoading = useState<boolean>('root_admin_loading', () => false)

  async function unlock(password: string) {
    rootLoading.value = true
    try {
      const res: any = await $fetch('/api/diag', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: { password },
      })

      if (res?.success && res?.root_token) {
        rootCookie.value = res.root_token
        return { success: true, message: 'Authenticated successfully' }
      }
      return { success: false, message: 'Invalid credentials' }
    } catch {
      return { success: false, message: 'Authentication failed' }
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
        'Request-Id': rootToken.value || '',
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
        'Request-Id': rootToken.value || '',
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
        'Request-Id': rootToken.value || '',
      },
    })
  }

  async function cancelJob(jobId: string) {
    return await useAdminApi(`/admin/root/jobs/${jobId}/cancel`, {
      method: 'POST',
      headers: {
        'Request-Id': rootToken.value || '',
      },
    })
  }

  async function runDbQuery(query: string, schema?: string, confirmPassword?: string) {
    return await useAdminApi('/admin/root/db-query', {
      method: 'POST',
      headers: {
        'Request-Id': rootToken.value || '',
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
        'Request-Id': rootToken.value || '',
      },
    })
  }

  async function testFirebase(payload: any) {
    return await useAdminApi('/admin/root/test-firebase', {
      method: 'POST',
      headers: {
        'Request-Id': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function testMail(payload: any) {
    return await useAdminApi('/admin/root/test-mail', {
      method: 'POST',
      headers: {
        'Request-Id': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function getSystemInfo() {
    return await useAdminApi('/admin/root/system-info', {
      headers: {
        'Request-Id': rootToken.value || '',
      },
    })
  }

  async function getCommands() {
    return await useAdminApi('/admin/root/commands', {
      headers: {
        'Request-Id': rootToken.value || '',
      },
    })
  }

  async function getConnectorInfraSettings() {
    return await useAdminApi('/admin/root/connector-infra-settings', {
      headers: {
        'Request-Id': rootToken.value || '',
      },
    })
  }

  async function updateConnectorInfraSettings(payload: any) {
    return await useAdminApi('/admin/root/connector-infra-settings', {
      method: 'PUT',
      headers: {
        'Request-Id': rootToken.value || '',
      },
      body: payload,
    })
  }

  async function getCorsSettings() {
    return await useAdminApi('/admin/root/cors-settings', {
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  async function addCorsOrigin(origin: string) {
    return await useAdminApi('/admin/root/cors-settings', {
      method: 'POST',
      headers: { 'Request-Id': rootToken.value || '' },
      body: { origin },
    })
  }

  async function deleteCorsOrigin(id: number) {
    return await useAdminApi(`/admin/root/cors-settings/${id}`, {
      method: 'DELETE',
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  async function setMainCorsOrigin(id: number) {
    return await useAdminApi(`/admin/root/cors-settings/${id}/set-main`, {
      method: 'PATCH',
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  async function getMailSettings() {
    return await useAdminApi('/admin/root/mail-settings', {
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  async function updateMailSettings(slot: string, payload: any) {
    return await useAdminApi(`/admin/root/mail-settings/${slot}`, {
      method: 'PUT',
      headers: { 'Request-Id': rootToken.value || '' },
      body: payload,
    })
  }

  async function getAnalyticsEvents(params: Record<string, any> = {}) {
    return await useAdminApi('/admin/root/analytics-events', {
      headers: { 'Request-Id': rootToken.value || '' },
      params,
    })
  }

  async function clearAnalyticsEvents() {
    return await useAdminApi('/admin/root/analytics-events', {
      method: 'DELETE',
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  // -- AI model catalog --
  /** params.status: 'active' (default) | 'disabled' | 'removed' | 'all' */
  async function getAiModels(params: Record<string, any> = {}) {
    return await useAdminApi('/admin/root/ai/models', {
      headers: { 'Request-Id': rootToken.value || '' },
      params,
    })
  }

  async function createAiModel(body: { model_key: string; thinking_config: { provider: string; mechanism: string; levels?: string[]; active_level?: string; budget_tokens?: number } }) {
    return await useAdminApi('/admin/root/ai/models', {
      method: 'POST',
      headers: { 'Request-Id': rootToken.value || '' },
      body,
    })
  }

  /** Tests a model_key/thinking_config combo before it is saved. */
  async function verifyAiModelConfig(body: { model_key: string; thinking_config: { provider: string; mechanism: string; levels?: string[]; active_level?: string; budget_tokens?: number } }) {
    return await useAdminApi('/admin/root/ai/models/verify-config', {
      method: 'POST',
      headers: { 'Request-Id': rootToken.value || '' },
      body,
    })
  }

  /** Tests low/medium/high individually against the real API, returns { levels: { low: {...}, medium: {...}, high: {...} } }. */
  async function verifyAiModelLevels(body: { model_key: string; provider: string; mechanism: string; budget_tokens?: number }) {
    return await useAdminApi('/admin/root/ai/models/verify-levels', {
      method: 'POST',
      headers: { 'Request-Id': rootToken.value || '' },
      body,
    })
  }

  async function updateAiModel(id: number, body: Partial<{ model_key: string; thinking_config: { provider: string; mechanism: string; levels?: string[]; active_level?: string; budget_tokens?: number }; is_active: boolean }>) {
    return await useAdminApi(`/admin/root/ai/models/${id}`, {
      method: 'PATCH',
      headers: { 'Request-Id': rootToken.value || '' },
      body,
    })
  }

  async function deleteAiModel(id: number) {
    return await useAdminApi(`/admin/root/ai/models/${id}`, {
      method: 'DELETE',
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  async function verifyAiModel(id: number) {
    return await useAdminApi(`/admin/root/ai/models/${id}/verify`, {
      method: 'POST',
      headers: { 'Request-Id': rootToken.value || '' },
    })
  }

  /** messages: the whole conversation so far ({role, text}[]). */
  async function testChatAiModel(id: number, messages: Array<{ role: string; text: string }>) {
    return await useAdminApi(`/admin/root/ai/models/${id}/test-chat`, {
      method: 'POST',
      headers: { 'Request-Id': rootToken.value || '' },
      body: { messages },
    })
  }

  return {
    isRootUnlocked,
    rootToken,
    rootLoading,
    unlock,
    lock,
    getAiModels,
    createAiModel,
    verifyAiModelConfig,
    verifyAiModelLevels,
    updateAiModel,
    deleteAiModel,
    verifyAiModel,
    testChatAiModel,
    runArtisan,
    runTinker,
    getJobStatus,
    cancelJob,
    runDbQuery,
    getCommands,
    getTenants,
    testFirebase,
    testMail,
    getSystemInfo,
    getConnectorInfraSettings,
    updateConnectorInfraSettings,
    getCorsSettings,
    addCorsOrigin,
    deleteCorsOrigin,
    setMainCorsOrigin,
    getMailSettings,
    updateMailSettings,
    getAnalyticsEvents,
    clearAnalyticsEvents,
  }
}
