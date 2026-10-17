const stableStringify = (value: any): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const keys = Object.keys(value).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`
}

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
  apply: (key: string, data: any) => void
}

export function useStaleWhileRevalidate(moduleKey: string, options: StaleWhileRevalidateOptions) {
  const { fetchers, apply } = options

  const storageKey = (): string => {
    let userId = 'anon'
    try { userId = localStorage.getItem('auth_user_id') ?? 'anon' } catch {}
    return `swr:${userId}:${moduleKey}`
  }

  const readCache = (): { hashes: Record<string, string>; data: Record<string, any> } => {
    if (import.meta.server) return { hashes: {}, data: {} }
    try {
      const raw = sessionStorage.getItem(storageKey())
      return raw ? JSON.parse(raw) : { hashes: {}, data: {} }
    } catch {
      return { hashes: {}, data: {} }
    }
  }

  const writeCache = (cache: { hashes: Record<string, string>; data: Record<string, any> }) => {
    if (import.meta.server) return
    try {
      sessionStorage.setItem(storageKey(), JSON.stringify(cache))
    } catch {}
  }

  const loading = reactive<Record<string, boolean>>({})

  const run = async () => {
    const cache = readCache()

    for (const key of Object.keys(fetchers)) {
      if (key in cache.data) {
        apply(key, cache.data[key])
      } else {
        loading[key] = true
      }
    }

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
