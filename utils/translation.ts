// Generic EN→AR translation helpers for data that isn't Tally-sourced (ledger/category
// names are translated server-side instead — see ArabicTranslationService on the backend).
// Add further generic translators (weekdays, units, etc.) to this same file as they come up.

const MONTH_AR: Record<string, string> = {
  Jan: 'يناير', Feb: 'فبراير', Mar: 'مارس', Apr: 'أبريل', May: 'مايو', Jun: 'يونيو',
  Jul: 'يوليو', Aug: 'أغسطس', Sep: 'سبتمبر', Oct: 'أكتوبر', Nov: 'نوفمبر', Dec: 'ديسمبر',
}

// Translates generic month labels (e.g. "Apr-2026", "Apr 2026", "Apr") to Arabic.
export function translateMonthLabel(label: string): string {
  if (!label) return label
  const match = label.match(/^([A-Za-z]+)([\s-]*)(.*)$/)
  if (!match) return label
  const [, mon, sep, rest] = match
  const ar = MONTH_AR[mon]
  if (!ar) return label
  return rest ? `${ar}${sep || ' '}${rest}` : ar
}

export function translateMonthLabels(labels: string[]): string[] {
  return labels.map(translateMonthLabel)
}
