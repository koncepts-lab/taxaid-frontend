export interface ZoneOption {
  value: string
  label: string
  search: string
}

const SEARCH_ALIASES: Record<string, string> = {
  AE: 'uae', GB: 'uk britain england scotland wales', US: 'usa america', KR: 'korea', RU: 'russia', CZ: 'czech',
  SA: 'ksa', TR: 'turkiye turkey', IR: 'persia', MM: 'burma', CI: 'ivory coast', VN: 'vietnam', LA: 'laos',
}

const displayNames = (locale: string): { of: (code: string) => string | undefined } | null => {
  try {
    return new (Intl as any).DisplayNames([locale], { type: 'region' })
  } catch {
    return null
  }
}

const regionName = (names: { of: (code: string) => string | undefined } | null, code: string): string => {
  try {
    return names?.of(code) ?? ''
  } catch {
    return ''
  }
}

export const zoneOffsetMinutes = (zone: string, at: Date = new Date()): number => {
  try {
    const instant = Math.floor(at.getTime() / 1000) * 1000
    const parts: Record<string, string> = {}
    new Intl.DateTimeFormat('en-US', {
      timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    }).formatToParts(new Date(instant)).forEach((p) => { parts[p.type] = p.value })

    const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second))

    return Math.round((asUtc - instant) / 60000)
  } catch {
    return Number.NaN
  }
}

export const timezoneList = (): string[] => {
  const now = new Date()

  return Object.keys(TIMEZONE_COUNTRY)
    .map((zone) => ({ zone, offset: zoneOffsetMinutes(zone, now) }))
    .filter((entry) => !Number.isNaN(entry.offset))
    .sort((a, b) => a.offset - b.offset || a.zone.localeCompare(b.zone))
    .map((entry) => entry.zone)
}

export const zoneOffsetLabel = (zone: string, at: Date = new Date()): string => {
  try {
    const part = new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'shortOffset' })
      .formatToParts(at)
      .find((p) => p.type === 'timeZoneName')

    return part?.value ?? ''
  } catch {
    return ''
  }
}

export const zoneClock = (zone: string, lang: string, at: Date = new Date()): { day: string; date: string; time: string } => {
  const locale = lang === 'ar' ? 'ar-AE-u-nu-latn' : 'en-GB'

  try {
    return {
      day: new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: 'long' }).format(at),
      date: new Intl.DateTimeFormat(locale, { timeZone: zone, day: '2-digit', month: 'short', year: 'numeric' }).format(at),
      time: new Intl.DateTimeFormat(locale, { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(at),
    }
  } catch {
    return { day: '', date: '', time: '' }
  }
}

const genericName = (zone: string, locale: string): string => {
  try {
    return new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: 'longGeneric' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}

const optionCache: Record<string, ZoneOption[]> = {}

export const timezoneOptions = (lang: string): ZoneOption[] => {
  const key = lang === 'ar' ? 'ar' : 'en'
  if (optionCache[key]) return optionCache[key]

  const shown = displayNames(key)
  const english = displayNames('en')
  const arabic = displayNames('ar')
  const now = new Date()

  optionCache[key] = timezoneList().map((zone) => {
    const code = TIMEZONE_COUNTRY[zone] ?? ''
    const offset = zoneOffsetLabel(zone, now)
    const country = code ? regionName(shown, code) : ''
    const city = (zone.split('/').pop() ?? zone).replace(/_/g, ' ')

    return {
      value: zone,
      label: [country, zone, offset].filter(Boolean).join('  ·  '),
      search: [
        zone, city, code, SEARCH_ALIASES[code] ?? '', regionName(english, code), regionName(arabic, code),
        genericName(zone, 'en'), genericName(zone, 'ar'), offset, offset.replace('GMT', 'UTC'),
      ].filter(Boolean).join(' '),
    }
  })

  return optionCache[key]
}
