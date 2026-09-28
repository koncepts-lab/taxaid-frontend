// The tenant's currency (cookie set at login and refreshed by /me); AED only when the cookie is empty.
// Codes the backend supports today (onboarding: default AED, alternatives USD, EUR, SAR); any other code the tenant carries is shown as its code
const ARABIC_SHORT_NAMES: Record<string, string> = { AED: 'درهم' }

const arabicName = (code: string): string => {
  if (ARABIC_SHORT_NAMES[code]) return ARABIC_SHORT_NAMES[code]

  try {
    return new Intl.DisplayNames(['ar'], { type: 'currency' }).of(code) || code
  } catch {
    return code
  }
}

export const useCurrency = () => {
  const cookie = useCookie<string | null>('currency')
  const currentLang = useState('currentLang', () => 'en')

  const code = computed(() => (cookie.value || 'AED').toUpperCase())

  // "Values in AED Million" / "القيم بمليون درهم"; pass millions=false for "Values in AED"
  const valuesNote = (millions = true): string => {
    if (currentLang.value === 'ar') {
      const name = arabicName(code.value)
      return millions ? `القيم بمليون ${name}` : `القيم بـ ${name}`
    }

    return millions ? `Values in ${code.value} Million` : `Values in ${code.value}`
  }

  return { code, valuesNote }
}
