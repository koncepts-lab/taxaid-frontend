const pad = (n: number): string => String(n).padStart(2, '0')

export const localIsoDate = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const localIsoMonth = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`

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
