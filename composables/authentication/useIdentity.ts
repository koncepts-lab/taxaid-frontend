// Who is signed in (display name + email) for the header. Set at login, updated when the profile is saved,
// and filled from /me once if it is missing, so the full /profile is only ever called by the profile page.
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
    if (identity.value?.email || !useCookie('auth_token').value) return
    try {
      const me: any = await useApi('/me')
      setIdentity(me?.data?.user?.company_name, me?.data?.user?.email)
    } catch {}
  }

  return { identity, setIdentity, ensureIdentity }
}
