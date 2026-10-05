type TooltipData = Record<string, { en: string; ar: string }>

const STORAGE_KEY = 'tooltips-data'
let fetchPromise: Promise<TooltipData> | null = null

export const useTooltips = () => {
  const currentLang = useState('currentLang', () => 'en')
  const tooltips = useState<TooltipData>('tooltips', () => ({}))

  if (!fetchPromise) {
    fetchPromise = (async () => {
      if (import.meta.client) {
        const cached = sessionStorage.getItem(STORAGE_KEY)
        if (cached) {
          const parsed = JSON.parse(atob(cached))
          tooltips.value = parsed
          return parsed
        }
      }

      const data = await $fetch<TooltipData>('/api/tooltips')
      tooltips.value = data

      if (import.meta.client) {
        sessionStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(data)))
      }

      return data
    })()
  } else {
    fetchPromise.then((data) => {
      tooltips.value = data
    })
  }

  const tip = (key: string): string => {
    const entry = tooltips.value?.[key]
    if (!entry) return ''

    return (currentLang.value === 'ar' ? entry.ar : entry.en) || entry.en
  }

  return { tip }
}
