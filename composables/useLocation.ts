// composables/useLocation.ts
//
// Resolves a human-readable "City, Region, Country" for the current device and
// lazily syncs it to the current session (PUT /sessions/location). Called from
// the dashboard and cards pages; the browser remembers the geolocation
// allow/deny choice, so users see the permission prompt at most once.
//
// Provider chain (ordered — swap/reorder here to change providers):
//   1. BigDataCloud  — precise, needs GPS coords from the permission prompt
//                      (free client-side, no key, no hard limit)
//   2. freeipapi.com — IP-based backup, no coords/permission needed
//                      (free, 60 req/min; our once-a-day lazy call is far under)
// All providers failing -> null, and the backend keeps its timezone fallback.

interface GeocodeProvider {
  name: string
  needsCoords: boolean
  url: string
  params: (lat?: number, lon?: number) => Record<string, any>
  parse: (res: any) => string | null
}

const joinParts = (parts: any[]) =>
  parts.filter((p) => typeof p === 'string' && p.trim()).join(', ') || null

const GEOCODE_PROVIDERS: GeocodeProvider[] = [
  {
    name: 'bigdatacloud',
    needsCoords: true,
    url: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
    params: (lat, lon) => ({ latitude: lat, longitude: lon, localityLanguage: 'en' }),
    parse: (r) => joinParts([r?.city || r?.locality, r?.principalSubdivision, r?.countryName]),
  },
  {
    name: 'freeipapi',
    needsCoords: false,
    url: 'https://freeipapi.com/api/json',
    params: () => ({}),
    parse: (r) => joinParts([r?.cityName, r?.regionName, r?.countryName]),
  },
]

const SENT_AT_KEY = 'session_location_sent_at' // ISO timestamp of last successful sync
const RESEND_AFTER_MS = 24 * 60 * 60 * 1000 // re-sync at most once a day
const IDLE_DELAY_MS = 5000 // let the page's card requests finish first
const GEO_TIMEOUT_MS = 10000

// Module-level guard: fast page switches inside the 5s defer window would
// otherwise queue one timer per page and fire duplicate PUTs.
let syncScheduled = false

export function useLocation() {
  const getCoords = (): Promise<{ lat: number; lon: number } | null> =>
    new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve(null)
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
        () => resolve(null), // denied / unavailable -> next provider
        { timeout: GEO_TIMEOUT_MS, maximumAge: 600000 }
      )
    })

  // Walk the provider chain and return the first resolved location string.
  const resolve = async (): Promise<string | null> => {
    let coords: { lat: number; lon: number } | null | undefined // undefined = not asked yet

    for (const provider of GEOCODE_PROVIDERS) {
      try {
        if (provider.needsCoords) {
          if (coords === undefined) coords = await getCoords()
          if (!coords) continue // permission denied -> IP-based backup
        }
        const res = await $fetch(provider.url, {
          params: provider.params(coords?.lat, coords?.lon),
        })
        const location = provider.parse(res)
        if (location) return location
      } catch {
        // provider down / rate-limited -> try the next one
      }
    }
    return null
  }

  const lastSentAt = (): number => {
    if (typeof localStorage === 'undefined') return 0
    try {
      const iso = localStorage.getItem(SENT_AT_KEY)
      return iso ? new Date(iso).getTime() : 0
    } catch {
      return 0
    }
  }

  // Entry point for dashboard/cards pages: fire-and-forget, throttled to once
  // a day, deferred so it never competes with the page's own requests.
  const syncSessionLocation = (): void => {
    if (typeof window === 'undefined') return
    if (!useCookie('auth_token').value) return // not logged in (admins never call this)
    if (syncScheduled) return
    if (Date.now() - lastSentAt() < RESEND_AFTER_MS) return

    syncScheduled = true

    const run = async () => {
      try {
        // re-check at fire time in case another tab synced meanwhile
        if (Date.now() - lastSentAt() < RESEND_AFTER_MS) return
        const location = await resolve()
        if (!location) return // backend keeps the timezone-derived value
        await useApi('/sessions/location', {
          method: 'PUT',
          body: { location },
          priority: 'low',
        })
        try {
          localStorage.setItem(SENT_AT_KEY, new Date().toISOString())
        } catch {}
      } catch {
        // best effort — allow a retry on a later page visit
        syncScheduled = false
      }
    }

    setTimeout(() => {
      if (typeof requestIdleCallback === 'function') requestIdleCallback(() => run())
      else run()
    }, IDLE_DELAY_MS)
  }

  return { resolve, syncSessionLocation }
}
