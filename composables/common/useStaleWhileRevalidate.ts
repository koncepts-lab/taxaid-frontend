// Instant-paint-then-revalidate pattern: on return visits, show the last known
// data from sessionStorage immediately (no skeleton/remount), then always fire
// the real API call in the background and swap in-place only if it differs.
// First-ever visit (nothing cached) behaves exactly like a normal fresh fetch.

const stableStringify = (value: any): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const keys = Object.keys(value).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`
}

// Fast non-crypto hash (FNV-1a) — only used to cheaply detect "did this change",
// never for anything security-sensitive.
const hashString = (str: string): string => {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

const hashOf = (value: any): string => hashString(stableStringify(value))

type Fetchers = Record<string, () => Promise<any>>

interface StaleWhileRevalidateOptions {
  fetchers: Fetchers
  // Called with fresh data the moment it's available — once synchronously
  // from cache (if present) and again after each fetcher resolves, but only
  // when the hash actually changed. Implementations should patch existing
  // refs/objects in place rather than reassigning, so bound components don't
  // remount or restart their mount animations.
  apply: (key: string, data: any) => void
}

export function useStaleWhileRevalidate(moduleKey: string, options: StaleWhileRevalidateOptions) {
  const { fetchers, apply } = options
  const storageKey = `swr:${moduleKey}`

  const readCache = (): { hashes: Record<string, string>; data: Record<string, any> } => {
    if (import.meta.server) return { hashes: {}, data: {} }
    try {
      const raw = sessionStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : { hashes: {}, data: {} }
    } catch {
      return { hashes: {}, data: {} }
    }
  }

  const writeCache = (cache: { hashes: Record<string, string>; data: Record<string, any> }) => {
    if (import.meta.server) return
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(cache))
    } catch {
      // sessionStorage full/unavailable (private mode) — fail silently, fresh fetch still runs
    }
  }

  // true while a key's very first fetch (no cache for it) is in flight —
  // pages can use this to show their normal loading skeleton only in that case.
  const loading = reactive<Record<string, boolean>>({})

  const run = async () => {
    const cache = readCache()

    // 1) Instant paint from whatever we have cached, synchronously, before any network call.
    for (const key of Object.keys(fetchers)) {
      if (key in cache.data) {
        apply(key, cache.data[key])
      } else {
        loading[key] = true
      }
    }

    // 2) Always revalidate every key against the real API in the background.
    await Promise.all(
      Object.entries(fetchers).map(async ([key, fetcher]) => {
        try {
          const fresh = await fetcher()
          const freshHash = hashOf(fresh)

          if (cache.hashes[key] !== freshHash) {
            apply(key, fresh)
            cache.hashes[key] = freshHash
            cache.data[key] = fresh
            writeCache(cache)
          }
        } finally {
          loading[key] = false
        }
      })
    )
  }

  return { run, loading }
}
