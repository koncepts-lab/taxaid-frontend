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

interface FetcherEntry {
  params?: any | (() => any)
  fetch: () => Promise<any>
}

type Fetchers = Record<string, FetcherEntry | (() => Promise<any>)>

interface KeyCache {
  order: string[]
  hashes: Record<string, string>
  data: Record<string, any>
}

interface StaleWhileRevalidateOptions {
  fetchers: Fetchers
  apply: (key: string, data: any) => void
  maxParamSetsPerKey?: number
  staleFallback?: boolean
}

export function useStaleWhileRevalidate(moduleKey: string, options: StaleWhileRevalidateOptions) {
  const { fetchers, apply, maxParamSetsPerKey = 4, staleFallback = false } = options

  const storageKey = (): string => {
    let userId = 'anon'
    try { userId = localStorage.getItem('auth_user_id') ?? 'anon' } catch {}
    return `swr:${userId}:${moduleKey}`
  }

  const readCache = (): Record<string, KeyCache> => {
    if (import.meta.server) return {}
    try {
      const raw = sessionStorage.getItem(storageKey())
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  const writeCache = (cache: Record<string, KeyCache>) => {
    if (import.meta.server) return
    try {
      sessionStorage.setItem(storageKey(), JSON.stringify(cache))
    } catch {}
  }

  const loading = reactive<Record<string, boolean>>({})

  const normalize = (entry: FetcherEntry | (() => Promise<any>)): FetcherEntry =>
    typeof entry === 'function' ? { fetch: entry } : entry

  const resolveParams = (entry: FetcherEntry) =>
    typeof entry.params === 'function' ? entry.params() : entry.params ?? null

  const runKey = async (key: string, opts: { force?: boolean } = {}) => {
    const raw = fetchers[key]
    if (!raw) return
    const entry = normalize(raw)

    const cache = readCache()
    const paramsHash = hashOf(resolveParams(entry))
    const existing = cache[key]

    if (opts.force) {
      loading[key] = true
    } else if (existing && paramsHash in existing.data) {
      apply(key, existing.data[paramsHash])
    } else if (staleFallback && existing && existing.order.length) {
      apply(key, existing.data[existing.order[existing.order.length - 1]])
    } else {
      loading[key] = true
    }

    try {
      const fresh = await entry.fetch()
      const freshHash = hashOf(fresh)
      const keyCache: KeyCache = cache[key] ?? { order: [], hashes: {}, data: {} }

      if (opts.force || keyCache.hashes[paramsHash] !== freshHash) {
        apply(key, fresh)
        keyCache.hashes[paramsHash] = freshHash
        keyCache.data[paramsHash] = fresh
      }

      keyCache.order = keyCache.order.filter((h) => h !== paramsHash)
      keyCache.order.push(paramsHash)
      while (keyCache.order.length > maxParamSetsPerKey) {
        const evicted = keyCache.order.shift()
        if (evicted) {
          delete keyCache.hashes[evicted]
          delete keyCache.data[evicted]
        }
      }

      cache[key] = keyCache
      writeCache(cache)
    } finally {
      loading[key] = false
    }
  }

  const run = async () => {
    await Promise.all(Object.keys(fetchers).map(runKey))
  }

  return { run, runKey, loading }
}
