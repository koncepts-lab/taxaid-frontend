// Who is signed in (display name + email) for the header. Set at login, updated when the profile is saved,
// and filled from /me once if it is missing, so the full /profile is only ever called by the profile page.
let syncedThisLoad = false

export const useIdentity = () => {
  const cookie = useCookie<any>('identity')

  const identity = computed<{ name: string; email: string } | null>(() => {
    const value = cookie.value
    return value && typeof value === 'object' ? value : null
  })

  const setIdentity = (name: string | null | undefined, email: string | null | undefined) => {
    cookie.value = { name: name || '', email: email || '' }
  }

  const ensureIdentity = async () => {
    const timezone = useCookie('timezone')
    if ((syncedThisLoad && identity.value?.email && timezone.value) || !useCookie('auth_token').value) return
    syncedThisLoad = true
    try {
      const me: any = await useApi('/me')
      useCookie('display_format').value = me?.data?.user?.display_format ?? null
      setIdentity(me?.data?.user?.company_name, me?.data?.user?.email)
      if (me?.data?.tenant?.timezone) timezone.value = me.data.tenant.timezone
    } catch {}
  }

  return { identity, setIdentity, ensureIdentity }
}
