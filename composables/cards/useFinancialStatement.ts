export const fsFilters = ref({
  range_option: 'Year to Date',
  custom_from:  null as string | null,
  custom_to:    null as string | null,
})

export const fsSelectedRatioType = ref('All Ratios')

const _plRows      = ref<any[]>([])
const _bsRows      = ref<any[]>([])
const _ratiosRows  = ref<any[]>([])
const _reportInfo  = ref({ current: '', previous: '' })
const _loading     = ref(false)

const scheduleMap: Record<string, string | null> = {
  'Revenue':                     '01',
  'Direct Expenses':             '02',
  'Opening Stock':               null,
  'Closing Stock':               null,
  'Gross Profit':                null,
  'Indirect Expenses':           '03',
  'Net Operating Income':        null,
  'Indirect Income':             '04',
  'Profit Before Tax (PBT)':     null,
  'Tax Expense':                 '05',
  'Net Profit':                  null,
}

const scheduleMapBS: Record<string, string> = {
  'Fixed Assets':              'S1',
  'Current Asset':             'S2',
  'Current Liabilitity':       'S3',
  'Non Current Liabilities':   'S4',
}

const fmtNum = (num: any) => {
  if (num === null || num === undefined || isNaN(num)) return num
  return new Intl.NumberFormat('en-US').format(num)
}

async function fetchPLData() {
  _loading.value = true
  try {
    const payload: any = { range_option: fsFilters.value.range_option }
    if (fsFilters.value.range_option === 'Custom Dates') {
      payload.custom_from = fsFilters.value.custom_from
      payload.custom_to   = fsFilters.value.custom_to
    }
    const res: any = await useApi('/financial-analysis/pl-maingroup-totals', { method: 'POST', body: payload })
    if (res?.status === 'success') {
      try {
        if (res.info) {
          _reportInfo.value = {
            current:  res.info.current_range  ? `${format(new Date(res.info.current_range.from),  'dd MMM yyyy')} - ${format(new Date(res.info.current_range.to),  'dd MMM yyyy')}` : '',
            previous: res.info.previous_range ? `${format(new Date(res.info.previous_range.from), 'dd MMM yyyy')} - ${format(new Date(res.info.previous_range.to), 'dd MMM yyyy')}` : '',
          }
        }
      } catch {}
      _plRows.value = (res.report || []).map((row: any) => ({
        label:    row.label,
        current:  fmtNum(row.current_year),
        previous: fmtNum(row.previous_year),
        variance: row.variance_percent,
        budget:   row.budget !== null ? fmtNum(row.budget) : '-',
        progress: row.ytg_percent !== null ? String(row.ytg_percent).replace('%', '') : '-',
        isSummary: row.isSummary,
        isHeader:  false,
        isTotal:   false,
        schedule:  scheduleMap[row.label] ?? '-',
      }))
    }
  } catch (e) {
    console.error('Failed to fetch P&L data', e)
  } finally {
    _loading.value = false
  }
}

async function fetchBSData() {
  _loading.value = true
  try {
    const payload: any = { range_option: fsFilters.value.range_option }
    if (fsFilters.value.range_option === 'Custom Dates') {
      payload.custom_from = fsFilters.value.custom_from
      payload.custom_to   = fsFilters.value.custom_to
    }
    const res: any = await useApi('/financial-analysis/bs-maingroup-totals', { method: 'POST', body: payload })
    if (res?.status === 'success') {
      _bsRows.value = (res.report || []).map((row: any) => ({
        label:    row.label,
        current:  fmtNum(row.current_year),
        previous: fmtNum(row.previous_year),
        variance: row.variance_percent !== null ? row.variance_percent : '-',
        budget:   row.budget !== null ? fmtNum(row.budget) : '-',
        progress: row.ytg_percent !== null ? String(row.ytg_percent).replace('%', '') : '-',
        isSummary: row.isSummary || false,
        isHeader:  row.isHeader  || false,
        isTotal:   row.isTotal   || false,
        schedule:  scheduleMapBS[row.label] ?? '-',
      }))
    }
  } catch (e) {
    console.error('Failed to fetch BS data', e)
  } finally {
    _loading.value = false
  }
}

async function fetchRatiosData() {
  _loading.value = true
  try {
    const payload: any = { range_option: fsFilters.value.range_option }
    if (fsFilters.value.range_option === 'Custom Dates') {
      payload.custom_from = fsFilters.value.custom_from
      payload.custom_to   = fsFilters.value.custom_to
    }
    if (fsSelectedRatioType.value && fsSelectedRatioType.value !== 'All Ratios') {
      payload.ratio_type = fsSelectedRatioType.value
    }
    const res: any = await useApi('/financial-ratios/comparative-report', { method: 'POST', body: payload })
    if (res?.success) {
      _ratiosRows.value = (res.report || []).map((row: any) => {
        let progressVal = 0
        if (row.year_to_go) {
          const parsed = parseFloat(String(row.year_to_go).replace('%', ''))
          if (!isNaN(parsed)) progressVal = Math.min(100, Math.max(0, Math.round(parsed)))
        }
        const isPct = (v: any) => row.category === 'Profitability' || String(row.key_metric).toLowerCase().includes('margin')
        const fmt = (v: any) => {
          if (v === null || v === undefined) return '-'
          return isPct(v) && !String(v).includes('%') ? `${v}%` : v
        }
        return {
          label:    row.key_metric,
          category: row.category,
          current:  fmt(row.current_year),
          previous: fmt(row.previous_year),
          budget:   fmt(row.budget),
          variance: row.variance_percent !== null ? row.variance_percent : '-',
          progress: progressVal,
          isSummary: false,
          isHeader:  false,
          isTotal:   false,
          schedule:  '-',
        }
      })
    }
  } catch (e) {
    console.error('Failed to fetch Ratios data', e)
  } finally {
    _loading.value = false
  }
}

export async function fetchTabData(tabId: string) {
  if (tabId === 'profit-loss')    return fetchPLData()
  if (tabId === 'balance-sheet')  return fetchBSData()
  if (tabId === 'ratios')         return fetchRatiosData()
}

export function useFinancialStatement() {
  return {
    filters:           fsFilters,
    selectedRatioType: fsSelectedRatioType,
    plRows:            _plRows,
    bsRows:            _bsRows,
    ratiosRows:        _ratiosRows,
    reportInfo:        _reportInfo,
    loading:           _loading,
    fetchTabData,
  }
}
