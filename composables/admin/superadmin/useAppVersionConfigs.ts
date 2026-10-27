export const useAppVersionConfigs = () => {
  const list = () => useAdminApi('/admin/app-version-configs')

  const update = (platform: 'android' | 'ios', payload: Record<string, any>) =>
    useAdminApi(`/admin/app-version-configs/${platform}`, { method: 'PUT', body: payload })

  const VERSION_REGEX = /^\d+(\.\d+){0,2}$/

  const validate = (form: { latest_version: string; latest_build_number: number | string; min_supported_version: string; store_url: string }) => {
    if (!VERSION_REGEX.test(String(form.latest_version).trim())) return 'Latest version must look like 1.2.0 (numbers and dots only).'
    if (!VERSION_REGEX.test(String(form.min_supported_version).trim())) return 'Minimum supported version must look like 1.0.0 (numbers and dots only).'
    if (!Number.isInteger(Number(form.latest_build_number)) || Number(form.latest_build_number) < 1) return 'Build number must be a whole number of 1 or more.'
    try {
      new URL(String(form.store_url).trim())
    } catch {
      return 'Store URL is not a valid URL.'
    }
    return null
  }

  const errorMessage = (e: any) => {
    const errors = e?.data?.errors
    if (errors) return (Object.values(errors).flat() as string[])[0]
    return e?.data?.message || 'Something went wrong. Please try again.'
  }

  return { list, update, validate, errorMessage }
}
