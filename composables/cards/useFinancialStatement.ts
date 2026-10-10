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

// Loading/error are per-tab — the Ratios fetch fires in the background on
// mount regardless of the active tab, and a shared flag let its failure
// bleed into whichever tab the user was actually looking at.
const _plLoading     = ref(false)
const _plError       = ref<string | null>(null)
const _bsLoading     = ref(false)
const _bsError       = ref<string | null>(null)
const _ratiosLoading = ref(false)
const _ratiosError   = ref<string | null>(null)
let _plReqSeq      = 0
let _bsReqSeq      = 0
let _ratiosReqSeq  = 0

// Gap-day snapshot notice for the Balance Sheet tab — same pattern as
// useAccountsReceivable/useAccountsPayable's snapshot_date fallback.
const _bsSnapshotDate   = ref<string | null>(null)
const _bsRequestedDate  = ref<string | null>(null)
const _bsSnapshotNotice = ref(false)


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
  if (num === null || num === undefined || num === '-' || num === '') return '-'
  const clean = typeof num === 'string' ? num.replace(/,/g, '') : num
  const val = Number(clean)
  if (isNaN(val)) return num
  return formatStandardNumber(val, 2)
}

const fmtVariance = (v: any) => {
  if (v === null || v === undefined || v === '-' || v === '') return '-'
  const clean = String(v).replace(/[%,]/g, '').trim()
  const val = Number(clean)
  if (isNaN(val)) return String(v)
  return `${val.toFixed(2)}%`
}

async function fetchPLData(clearCache = false) {
  const reqId = ++_plReqSeq
  _plLoading.value = true
  _plError.value = null
  const cardPeriod = useState('cardPeriod')
  const cardToday  = useState('cardToday')
  try {
    const payload: any = { range_option: fsFilters.value.range_option }
    if (fsFilters.value.range_option === 'Custom Dates') {
      payload.custom_from = fsFilters.value.custom_from
      payload.custom_to   = fsFilters.value.custom_to
    }
    if (clearCache) payload.clear_cache = clearCache === 'all' ? 'all' : 'true'
    const res: any = await useApi('/financial-analysis/pl-maingroup-totals', { method: 'POST', body: payload })
    if (reqId !== _plReqSeq) return
    if (res?.status === 'success') {
      cardPeriod.value = res.period ?? null
      cardToday.value  = res.today ?? null
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
        variance: fmtVariance(row.variance_percent),
        budget:   row.budget !== null ? fmtNum(row.budget) : '-',
        progress: row.ytg_percent !== null ? String(row.ytg_percent).replace('%', '') : '-',
        isSummary: row.isSummary,
        isHeader:  false,
        isTotal:   false,
        schedule:  scheduleMap[row.label] ?? '-',
      }))
    } else {
      _plError.value = res?.message ?? 'Failed to load the Profit & Loss report.'
    }
  } catch (e: any) {
    if (reqId !== _plReqSeq) return
    console.error('Failed to fetch P&L data', e)
    _plError.value = e?.data?.message ?? 'Failed to load the Profit & Loss report.'
  } finally {
    if (reqId === _plReqSeq) _plLoading.value = false
  }
}

async function fetchBSData(clearCache = false) {
  const reqId = ++_bsReqSeq
  _bsLoading.value = true
  _bsError.value = null
  const cardPeriod = useState('cardPeriod')
  const cardToday  = useState('cardToday')
  try {
    const payload: any = { range_option: fsFilters.value.range_option }
    if (fsFilters.value.range_option === 'Custom Dates') {
      payload.custom_from = fsFilters.value.custom_from
      payload.custom_to   = fsFilters.value.custom_to
    }
    if (clearCache) payload.clear_cache = clearCache === 'all' ? 'all' : 'true'
    const res: any = await useApi('/financial-analysis/bs-maingroup-totals', { method: 'POST', body: payload })
    if (reqId !== _bsReqSeq) return
    if (res?.status === 'success') {
      cardPeriod.value = res.period ?? null
      cardToday.value  = res.today ?? null
      const requested = res.info?.requested_date ?? null
      const snapshot  = res.info?.snapshot_date  ?? null
      _bsRequestedDate.value  = requested
      _bsSnapshotDate.value   = snapshot
      _bsSnapshotNotice.value = !!(requested && snapshot && requested !== snapshot)

      _bsRows.value = (res.report || []).map((row: any) => ({
        label:    row.label,
        current:  fmtNum(row.current_year),
        previous: fmtNum(row.previous_year),
        variance: fmtVariance(row.variance_percent),
        budget:   row.budget !== null ? fmtNum(row.budget) : '-',
        progress: row.ytg_percent !== null ? String(row.ytg_percent).replace('%', '') : '-',
        isSummary: row.isSummary || false,
        isHeader:  row.isHeader  || false,
        isTotal:   row.isTotal   || false,
        schedule:  scheduleMapBS[row.label] ?? '-',
      }))
    } else {
      _bsError.value = res?.message ?? 'Failed to load the Balance Sheet report.'
    }
  } catch (e: any) {
    if (reqId !== _bsReqSeq) return
    console.error('Failed to fetch BS data', e)
    _bsError.value = e?.data?.message ?? 'Failed to load the Balance Sheet report.'
  } finally {
    if (reqId === _bsReqSeq) _bsLoading.value = false
  }
}

async function fetchRatiosData(clearCache = false) {
  const reqId = ++_ratiosReqSeq
  _ratiosLoading.value = true
  _ratiosError.value = null
  try {
    const payload: any = { range_option: fsFilters.value.range_option }
    if (fsFilters.value.range_option === 'Custom Dates') {
      payload.custom_from = fsFilters.value.custom_from
      payload.custom_to   = fsFilters.value.custom_to
    }
    if (fsSelectedRatioType.value && fsSelectedRatioType.value !== 'All Ratios') {
      payload.ratio_type = fsSelectedRatioType.value
    }
    if (clearCache) payload.clear_cache = clearCache === 'all' ? 'all' : 'true'
    const res: any = await useApi('/financial-ratios/comparative-report', { method: 'POST', body: payload })
    if (reqId !== _ratiosReqSeq) return
    if (res?.success) {
      _ratiosRows.value = (res.report || []).map((row: any) => {
        let progressVal = 0
        if (row.year_to_go) {
          const parsed = parseFloat(String(row.year_to_go).replace('%', ''))
          if (!isNaN(parsed)) progressVal = Math.min(100, Math.max(0, Math.round(parsed)))
        }
        const isPct = (v: any) => row.category === 'Profitability' || String(row.key_metric).toLowerCase().includes('margin')
        const fmt = (v: any) => {
          if (v === null || v === undefined || v === '-' || v === '') return '-'
          const clean = String(v).replace(/[%,]/g, '').trim()
          const n = Number(clean)
          if (isNaN(n)) return v
          const formatted = formatStandardNumber(n, 2)
          return isPct(v) || String(v).includes('%') ? `${formatted}%` : formatted
        }
        return {
          label:    row.key_metric,
          category: row.category,
          current:  fmt(row.current_year),
          previous: fmt(row.previous_year),
          budget:   fmt(row.budget),
          variance: fmtVariance(row.variance_percent),
          progress: progressVal,
          isSummary: false,
          isHeader:  false,
          isTotal:   false,
          schedule:  '-',
        }
      })
    } else {
      _ratiosError.value = res?.message ?? 'Failed to load the Ratios report.'
    }
  } catch (e: any) {
    if (reqId !== _ratiosReqSeq) return
    console.error('Failed to fetch Ratios data', e)
    _ratiosError.value = e?.data?.message ?? 'Failed to load the Ratios report.'
  } finally {
    if (reqId === _ratiosReqSeq) _ratiosLoading.value = false
  }
}

export async function fetchTabData(tabId: string, clearCache = false) {
  if (tabId === 'profit-loss')    return fetchPLData(clearCache)
  if (tabId === 'balance-sheet')  return fetchBSData(clearCache)
  if (tabId === 'ratios')         return fetchRatiosData(clearCache)
}

export function useFinancialStatement() {
  return {
    filters:           fsFilters,
    selectedRatioType: fsSelectedRatioType,
    plRows:            _plRows,
    bsRows:            _bsRows,
    ratiosRows:        _ratiosRows,
    reportInfo:        _reportInfo,
    bsSnapshotDate:    _bsSnapshotDate,
    bsRequestedDate:   _bsRequestedDate,
    bsSnapshotNotice:  _bsSnapshotNotice,
    plLoading:         _plLoading,
    plError:           _plError,
    bsLoading:         _bsLoading,
    bsError:           _bsError,
    ratiosLoading:     _ratiosLoading,
    ratiosError:       _ratiosError,
    fetchTabData,
  }
}
