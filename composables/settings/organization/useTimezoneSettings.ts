export const useTimezoneSettings = () => {
  const errorMessage = (e: any) =>
    e?.data?.message ||
    (e?.data?.errors ? (Object.values(e.data.errors).flat() as string[])[0] : null) ||
    'Something went wrong. Please try again.'

  const getTimezone = () => useApi('/user/company-settings/timezone')

  const setTimezone = (payload: { scope: 'organization' | 'tenant'; tenant_id?: number; zone: string | null }) =>
    useApi('/user/company-settings/timezone', { method: 'PUT', body: payload })

  return { errorMessage, getTimezone, setTimezone }
}
