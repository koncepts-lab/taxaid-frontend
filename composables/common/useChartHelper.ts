const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const million = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const raw = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Shared chart helpers: Short/Full switch (kept per session under storageKey), axis fitting and small-bar visibility.
export const useChartHelper = (storageKey = 'chart_unit') => {
  const unit = useState<'millions' | 'actual'>(`chartUnit:${storageKey}`, () => 'actual')

  onMounted(() => {
    try {
      const saved = sessionStorage.getItem(storageKey)
      if (saved === 'millions' || saved === 'actual') unit.value = saved
    } catch {}
  })

  const setUnit = (value: 'millions' | 'actual') => {
    unit.value = value
    try { sessionStorage.setItem(storageKey, value) } catch {}
  }

  const fmt = (value: any) => {
    const v = Number(value) || 0
    if (unit.value === 'millions') return `${million.format(v / 1_000_000)}M`
    return raw.format(v)
  }

  const axisFmt = (value: any) => {
    const v = Number(value) || 0
    if (unit.value === 'millions') return `${million.format(v / 1_000_000)}M`
    return whole.format(v)
  }

  const formatWhole = (value: any) => whole.format(Number(value) || 0)

  const axisFor = (peak: number) => {
    const top = peak * 1.12
    if (top <= 0) return { max: 5, ticks: 5 }

    const rough = top / 5
    const power = Math.pow(10, Math.floor(Math.log10(rough)))
    const step = [1, 1.5, 2, 2.5, 3, 4, 5, 10].map(m => m * power).find(s => s >= rough) ?? 10 * power
    const max = Math.ceil(top / step) * step

    return { max, ticks: Math.max(2, Math.round(max / step)) }
  }

  // Bars too small to see get a minimum height; labels and tooltips still show the real value.
  const plotter = (peak: number) => {
    const min = peak * 0.025
    return (value: number) => (value > 0 && value < min ? min : value)
  }

  return { unit, setUnit, fmt, axisFmt, formatWhole, axisFor, plotter }
}
