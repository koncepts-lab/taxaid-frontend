const pad = (n: number): string => String(n).padStart(2, '0')

const TAXAID_ZONE = 'Asia/Dubai'

const formatLocal = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const orgZone = (): string => {
  let zone = ''

  try {
    zone = (useCookie('timezone').value as string) || ''
  } catch {
    zone = ''
  }

  if (!zone && typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)timezone=([^;]*)/)
    zone = match ? decodeURIComponent(match[1]) : ''
  }

  if (!zone) return TAXAID_ZONE

  try {
    new Intl.DateTimeFormat('en', { timeZone: zone })

    return zone
  } catch {
    return TAXAID_ZONE
  }
}

export const orgToday = (at: Date = new Date()): string => {
  const parts: Record<string, string> = {}
  new Intl.DateTimeFormat('en-US', { timeZone: orgZone(), year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(at)
    .forEach((p) => { parts[p.type] = p.value })

  return `${parts.year}-${parts.month}-${parts.day}`
}

export const orgTodayDate = (at?: Date): Date => {
  const [year, month, day] = orgToday(at).split('-').map(Number)

  return new Date(year, month - 1, day)
}

export const localIsoDate = (date?: Date): string => (date ? formatLocal(date) : orgToday())

export const localIsoMonth = (date?: Date): string => (date ? formatLocal(date).slice(0, 7) : orgToday().slice(0, 7))

export const toIsoDay = (value: Date | string | null | undefined): string => {
  if (!value) return ''

  if (typeof value === 'string') {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim())
    if (match) return match[1]

    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? '' : localIsoDate(parsed)
  }

  return Number.isNaN(value.getTime()) ? '' : localIsoDate(value)
}

export const DISPLAY_DATE_FORMATS = ['dd mmm yyyy', 'dd mmm yy', 'dd-mm-yyyy', 'dd-mm-yy', 'mmm dd, yyyy'] as const
export const DEFAULT_DISPLAY_FORMAT = 'dd mmm yyyy/12'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const displayFormat = (): { date: string; hours: 12 | 24 } => {
  const raw = String(useCookie('display_format').value || DEFAULT_DISPLAY_FORMAT)
  const [date, hours] = raw.split('/')

  return {
    date: (DISPLAY_DATE_FORMATS as readonly string[]).includes(date) ? date : 'dd mmm yyyy',
    hours: hours === '24' ? 24 : 12,
  }
}

export const formatDisplayDate = (value: Date | string | null | undefined, style?: string): string => {
  if (!value) return ''

  let y: number, m: number, d: number
  const match = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})-(\d{2})/) : null

  if (match) {
    y = +match[1]; m = +match[2]; d = +match[3]
  } else {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    y = date.getFullYear(); m = date.getMonth() + 1; d = date.getDate()
  }

  const yyyy = String(y)
  const yy = yyyy.slice(2)

  switch (style ?? displayFormat().date) {
    case 'dd mmm yy': return `${pad(d)} ${MONTHS[m - 1]} ${yy}`
    case 'dd-mm-yyyy': return `${pad(d)}-${pad(m)}-${yyyy}`
    case 'dd-mm-yy': return `${pad(d)}-${pad(m)}-${yy}`
    case 'mmm dd, yyyy': return `${MONTHS[m - 1]} ${pad(d)}, ${yyyy}`
    default: return `${pad(d)} ${MONTHS[m - 1]} ${yyyy}`
  }
}

export const formatDisplayTime = (value: string | null | undefined): string => {
  const match = String(value ?? '').match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (!match) return String(value ?? '')

  const h = +match[1]
  const mm = match[2]
  const ss = match[3] ? `:${match[3]}` : ''

  if (displayFormat().hours === 24) return `${pad(h)}:${mm}${ss}`

  return `${h % 12 || 12}:${mm}${ss} ${h < 12 ? 'AM' : 'PM'}`
}
