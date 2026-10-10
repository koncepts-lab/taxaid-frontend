const THRESHOLD = 3

export const trackReloadClick = (key: string): boolean => {
  if (typeof sessionStorage === 'undefined') return false

  const storageKey = `reload_clicks_${key}`
  const count = Number(sessionStorage.getItem(storageKey) || '0') + 1

  if (count >= THRESHOLD) {
    sessionStorage.setItem(storageKey, '0')
    return true
  }

  sessionStorage.setItem(storageKey, String(count))
  return false
}
