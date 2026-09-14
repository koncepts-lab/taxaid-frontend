const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count += 1
  return entry.count > MAX_ATTEMPTS
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const host = getRequestHeader(event, 'host') || ''
  const origin = getRequestHeader(event, 'origin') || ''
  const requestedWith = getRequestHeader(event, 'x-requested-with') || ''

  if (requestedWith !== 'XMLHttpRequest') {
    return { success: false }
  }

  if (origin) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return { success: false }
      }
    } catch {
      return { success: false }
    }
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (isRateLimited(ip)) {
    return { success: false }
  }

  const token = getCookie(event, 'admin_token')
  const body = await readBody(event).catch(() => null)
  const password = body?.password

  if (!token || !password) {
    return { success: false }
  }

  try {
    const res: any = await $fetch('/admin/root/unlock', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: { password },
    })

    if (res?.success && res?.root_token) {
      return { success: true, root_token: res.root_token }
    }
    return { success: false }
  } catch {
    return { success: false }
  }
})
