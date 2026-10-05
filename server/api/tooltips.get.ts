let cached: Record<string, { en: string; ar: string }> | null = null
let cachedAt = 0
const TTL_MS = 5 * 60 * 1000

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Cache-Control', 'public, max-age=300')

  if (cached && Date.now() - cachedAt < TTL_MS) {
    return cached
  }

  const config = useRuntimeConfig()
  try {
    const proxyRes: any = await $fetch('/public/cms/tooltips', { baseURL: config.public.apiBase })
    const fileUrl = proxyRes?.blocks?.['tooltip-file']?.url
    if (!fileUrl) return cached ?? {}

    const data: any = await $fetch(fileUrl)
    if (data && typeof data === 'object') {
      cached = data
      cachedAt = Date.now()
      return data
    }
  } catch {}

  return cached ?? {}
})
