/**
 * useWebsiteData
 * ──────────────────────────────────────────────────────────────────────────
 * Fetches /data/data.json (served from /public) once and caches it
 * for the lifetime of the Nuxt app. Components call a section-specific
 * helper instead of importing JSON directly so that a single source of
 * truth drives all pages.
 *
 * Usage in a component:
 *   const { revenue, cashflow, taxQueries } = useMainDashboard()
 *   const { activities, timeSlots }         = useTeamMemberActivity()
 *   const { tickets }                       = useTeamMemberTicketing()
 *   const { consultants, dataSyncStatus }   = useReviewManager()
 *   const { paymentDetails }                = useRevenuePartnership()
 */

// ── Shared cache ─────────────────────────────────────────────────────────
let _cache: Record<string, any> | null = null
let _pending: Promise<Record<string, any>> | null = null

async function fetchData(): Promise<Record<string, any>> {
  if (_cache) return _cache
  if (_pending) return _pending

  _pending = $fetch<Record<string, any>>('/data/data.json').then((data) => {
    _cache = data
    return data
  })
  return _pending
}

// ── Generic root hook ─────────────────────────────────────────────────────
export function useWebsiteData() {
  const data = useState<Record<string, any>>('websiteData', () => ({}))
  const loading = ref(!_cache)
  const error = ref<string | null>(null)

  onMounted(async () => {
    if (_cache) {
      data.value = _cache
      loading.value = false
      return
    }
    try {
      data.value = await fetchData()
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load data.json'
    } finally {
      loading.value = false
    }
  })

  return { data, loading, error }
}

// ── Section helpers ───────────────────────────────────────────────────────

/** Main dashboard widgets: /dashboard */
export function useMainDashboard() {
  const { data, loading, error } = useWebsiteData()
  const widgets = computed(() => data.value?.mainDashboard?.widgets ?? {})

  return {
    loading, error,
    layout:              computed(() => data.value?.mainDashboard?.layout ?? {}),
    revenue:             computed(() => widgets.value?.revenue             ?? {}),
    cashflow:            computed(() => widgets.value?.cashflow            ?? {}),
    financialStatements: computed(() => widgets.value?.financialStatements ?? {}),
    indirectExpense:     computed(() => widgets.value?.indirectExpense     ?? {}),
    accountReceivables:  computed(() => widgets.value?.accountReceivables  ?? {}),
    cogs:                computed(() => widgets.value?.cogs                ?? {}),
    accountsPayable:     computed(() => widgets.value?.accountsPayable     ?? {}),
    costCenter:          computed(() => widgets.value?.costCenter          ?? {}),
    taxQueries:          computed(() => widgets.value?.taxQueries          ?? {}),
  }
}

/** Auth: pages/home.vue */
export function useAuthData() {
  const { data, loading, error } = useWebsiteData()
  return {
    loading, error,
    login:          computed(() => data.value?.auth?.login          ?? {}),
    forgotPassword: computed(() => data.value?.auth?.forgotPassword ?? {}),
  }
}

/** Onboarding: pages/onboarding.vue */
export function useOnboarding() {
  const { data, loading, error } = useWebsiteData()
  return {
    loading, error,
    totalSteps: computed(() => data.value?.onboarding?.totalSteps ?? 12),
    options:    computed(() => data.value?.onboarding?.options    ?? {}),
  }
}

/** Team Member — Activity Tracking tab */
export function useTeamMemberActivity() {
  const { data, loading, error } = useWebsiteData()
  const tm = computed(() => data.value?.teamMember ?? {})
  return {
    loading, error,
    metrics:        computed(() => tm.value?.activityTracking?.metrics        ?? {}),
    workSession:    computed(() => tm.value?.activityTracking?.workSession    ?? {}),
    appointmentTypes:computed(() => tm.value?.activityTracking?.appointmentTypes ?? []),
    activities:     computed(() => tm.value?.activityTracking?.activities     ?? []),
    monthlySummary: computed(() => tm.value?.activityTracking?.monthlySummary ?? {}),
    timeSlots:      computed(() => tm.value?.activityTracking?.timeSlots      ?? []),
  }
}

/** Team Member — Client Management tab */
export function useTeamMemberClientManagement() {
  const { data, loading, error } = useWebsiteData()
  const cm = computed(() => data.value?.teamMember?.clientManagement ?? {})
  return {
    loading, error,
    requestPool:          computed(() => cm.value?.requestPool          ?? []),
    requestStatusOptions: computed(() => cm.value?.requestStatusOptions ?? []),
    clientFixedSummary:   computed(() => cm.value?.clientFixedSummary   ?? []),
    summaryStatusOptions: computed(() => cm.value?.summaryStatusOptions  ?? []),
  }
}

/** Team Member — Masterlist tab */
export function useTeamMemberMasterlist() {
  const { data, loading, error } = useWebsiteData()
  const ml = computed(() => data.value?.teamMember?.masterlist ?? {})
  return {
    loading, error,
    tabs:     computed(() => ml.value?.tabs     ?? []),
    projects: computed(() => ml.value?.projects ?? []),
  }
}

/** Team Member — Ticketing Dashboard */
export function useTeamMemberTicketing() {
  const { data, loading, error } = useWebsiteData()
  const td = computed(() => data.value?.teamMember?.ticketingDashboard ?? {})
  return {
    loading, error,
    metrics:       computed(() => td.value?.metrics       ?? []),
    statusOptions: computed(() => td.value?.statusOptions ?? []),
    typeOptions:   computed(() => td.value?.typeOptions   ?? []),
    issueTypes:    computed(() => td.value?.issueTypes    ?? []),
    tickets:       computed(() => td.value?.tickets       ?? []),
  }
}

/** Team Member — Activity Log */
export function useTeamMemberActivityLog() {
  const { data, loading, error } = useWebsiteData()
  const al = computed(() => data.value?.teamMember?.activityLog ?? {})
  return {
    loading, error,
    summaryMetrics:   computed(() => al.value?.summaryMetrics   ?? {}),
    sampleActivities: computed(() => al.value?.sampleActivities ?? []),
    totalHoursLogged: computed(() => al.value?.totalHoursLogged ?? ''),
  }
}

/** Review Manager — all tabs */
export function useReviewManager() {
  const { data, loading, error } = useWebsiteData()
  const rm = computed(() => data.value?.reviewManager ?? {})
  return {
    loading, error,
    dashboard:             computed(() => rm.value?.dashboard             ?? {}),
    productivityMetrics:   computed(() => rm.value?.productivityMetrics?.cards ?? []),
    productivityTracker:   computed(() => rm.value?.productivityTracker?.consultants ?? []),
    dataSyncStatus:        computed(() => rm.value?.dataSyncStatus        ?? {}),
    clientFixedProgress:   computed(() => rm.value?.clientFixedProgress?.records ?? []),
    consultantWorkload:    computed(() => rm.value?.consultantWorkload?.records   ?? []),
    assignConsultant:      computed(() => rm.value?.assignConsultant      ?? {}),
    clientReviewAnalysis:  computed(() => rm.value?.clientReviewAnalysis  ?? {}),
  }
}

/** Revenue Partnership — accounts page */
export function useRevenuePartnership() {
  const { data, loading, error } = useWebsiteData()
  const rp = computed(() => data.value?.revenuePartnership ?? {})
  return {
    loading, error,
    partnerInfo:          computed(() => rp.value?.partnerInfo          ?? {}),
    overviewMetrics:      computed(() => rp.value?.overviewMetrics?.cards ?? []),
    paymentStatusMetrics: computed(() => rp.value?.paymentStatusMetrics?.cards ?? []),
    customerManagement:   computed(() => rp.value?.customerManagement   ?? {}),
    paymentToPartnerModal:computed(() => rp.value?.paymentToPartnerModal ?? {}),
    alerts:               computed(() => rp.value?.alerts               ?? {}),
  }
}

/** Revenue detail page: /revenue */
export function useRevenuePage() {
  const { data, loading, error } = useWebsiteData()
  const rp = computed(() => data.value?.revenuePage ?? {})
  return {
    loading, error,
    summary:      computed(() => rp.value?.summary      ?? []),
    gauge:        computed(() => rp.value?.gauge        ?? {}),
    byCategory:   computed(() => rp.value?.byCategory   ?? {}),
    trend:        computed(() => rp.value?.trend        ?? {}),
    topCustomers: computed(() => rp.value?.topCustomers ?? {}),
  }
}

/** Financial Statement detail page: /financial-statement */
export function useFinancialStatementPage() {
  const { data, loading, error } = useWebsiteData()
  const fp = computed(() => data.value?.financialStatementPage ?? {})
  return {
    loading, error,
    tabs:         computed(() => fp.value?.tabs         ?? []),
    profitLoss:   computed(() => fp.value?.profitLoss   ?? []),
    balanceSheet: computed(() => fp.value?.balanceSheet ?? []),
    ratios:       computed(() => fp.value?.ratios       ?? []),
  }
}

/** Indirect Expense detail page: /indirect-expense */
export function useIndirectExpensePage() {
  const { data, loading, error } = useWebsiteData()
  const ep = computed(() => data.value?.indirectExpensePage ?? {})
  return {
    loading, error,
    summary:            computed(() => ep.value?.summary            ?? []),
    topCategories:      computed(() => ep.value?.topCategories      ?? {}),
    overheadTrends:     computed(() => ep.value?.overheadTrends     ?? {}),
    overheadVsRevenue:  computed(() => ep.value?.overheadVsRevenue  ?? {}),
  }
}

/** Cash-Flow detail page: /cash-flow */
export function useCashFlowPage() {
  const { data, loading, error } = useWebsiteData()
  const cp = computed(() => data.value?.cashFlowPage ?? {})
  return {
    loading, error,
    summary:        computed(() => cp.value?.summary        ?? []),
    metrics:        computed(() => cp.value?.metrics        ?? {}),
    scenarioChart:  computed(() => cp.value?.scenarioChart  ?? {}),
    inflowOutflow:  computed(() => cp.value?.inflowOutflow  ?? {}),
  }
}

/** Accounts Receivable detail page: /accounts-receivable */
export function useAccountsReceivablePage() {
  const { data, loading, error } = useWebsiteData()
  const ar = computed(() => data.value?.accountsReceivablePage ?? {})
  return {
    loading, error,
    summary:            computed(() => ar.value?.summary            ?? []),
    topCustomers:       computed(() => ar.value?.topCustomers       ?? {}),
    historicalMovement: computed(() => ar.value?.historicalMovement ?? {}),
    agingGraph:         computed(() => ar.value?.agingGraph         ?? {}),
  }
}

/** COGS detail page: /cogs */
export function useCogsPage() {
  const { data, loading, error } = useWebsiteData()
  const cp = computed(() => data.value?.cogsPage ?? {})
  return {
    loading, error,
    summary:        computed(() => cp.value?.summary        ?? []),
    summaryTotal:   computed(() => cp.value?.summaryTotal   ?? {}),
    breakdown:      computed(() => cp.value?.breakdown      ?? {}),
    last6Months:    computed(() => cp.value?.last6Months    ?? {}),
    revenueToCogs:  computed(() => cp.value?.revenueToCogs  ?? {}),
  }
}

/** Accounts Payable detail page: /accounts-payable */
export function useAccountsPayablePage() {
  const { data, loading, error } = useWebsiteData()
  const ap = computed(() => data.value?.accountsPayablePage ?? {})
  return {
    loading, error,
    summary:            computed(() => ap.value?.summary            ?? []),
    summaryTotal:       computed(() => ap.value?.summaryTotal       ?? {}),
    topCustomers:       computed(() => ap.value?.topCustomers       ?? {}),
    historicalMovement: computed(() => ap.value?.historicalMovement ?? {}),
    agingGraph:         computed(() => ap.value?.agingGraph         ?? {}),
  }
}

/** Cost Center detail page: /cost-center */
export function useCostCenterPage() {
  const { data, loading, error } = useWebsiteData()
  const cc = computed(() => data.value?.costCenterPage ?? {})
  return {
    loading, error,
    summary:                computed(() => cc.value?.summary               ?? []),
    summaryTotal:           computed(() => cc.value?.summaryTotal          ?? {}),
    overallRevenueVsCost:   computed(() => cc.value?.overallRevenueVsCost  ?? {}),
    projectDetail:          computed(() => cc.value?.projectDetail         ?? {}),
  }
}

/** Tax Queries page: /tax-queries */
export function useTaxQueriesPage() {
  const { data, loading, error } = useWebsiteData()
  const tq = computed(() => data.value?.taxQueriesPage ?? {})
  return {
    loading, error,
    tableData:      computed(() => tq.value?.tableData      ?? {}),
    suggestions:    computed(() => tq.value?.suggestions    ?? []),
    tabs:           computed(() => tq.value?.tabs           ?? []),
    historyGroups:  computed(() => tq.value?.historyGroups  ?? []),
    deadlines:      computed(() => tq.value?.deadlines      ?? []),
  }
}

/** Data Source Management page: /data-source */
export function useDataSourcePage() {
  const { data, loading, error } = useWebsiteData()
  const ds = computed(() => data.value?.dataSourcePage ?? {})
  return {
    loading, error,
    mainTabs:           computed(() => ds.value?.mainTabs           ?? []),
    subTabsFinancial:   computed(() => ds.value?.subTabsFinancial   ?? []),
    subTabsContacts:    computed(() => ds.value?.subTabsContacts    ?? []),
    settings:           computed(() => ds.value?.settings           ?? {}),
    arData:             computed(() => ds.value?.arData             ?? []),
    apData:             computed(() => ds.value?.apData             ?? []),
    logs:               computed(() => ds.value?.logs               ?? {}),
    pdcSummaryData:     computed(() => ds.value?.pdcSummaryData     ?? []),
    pdcDetailedData:    computed(() => ds.value?.pdcDetailedData    ?? []),
    interCompanyData:   computed(() => ds.value?.interCompanyData   ?? []),
    dataInItems:        computed(() => ds.value?.dataInItems        ?? []),
    costCenterReports:  computed(() => ds.value?.costCenterReports  ?? {}),
    budget:             computed(() => ds.value?.budget             ?? {}),
    salesForecast:      computed(() => ds.value?.salesForecast      ?? {}),
  }
}

export function useAlertsPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.alertsPage ?? {})

  return {
    loading,
    error,
    categories: computed(() => pageData.value?.categories ?? []),
    statusMap:  computed(() => pageData.value?.statusMap  ?? {}),
    alerts:     computed(() => pageData.value?.alerts     ?? []),
  }
}

export function useAppointmentsPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.appointmentsPage ?? {})

  return {
    loading,
    error,
    stats:        computed(() => pageData.value?.stats        ?? []),
    banner:       computed(() => pageData.value?.banner       ?? {}),
    legend:       computed(() => pageData.value?.legend       ?? []),
    statusStyles: computed(() => pageData.value?.statusStyles ?? {}),
    typeStyles:   computed(() => pageData.value?.typeStyles   ?? {}),
    columns:      computed(() => pageData.value?.columns      ?? []),
    columnsAr:    computed(() => pageData.value?.columnsAr    ?? []),
    appointments: computed(() => pageData.value?.appointments ?? []),
  }
}
export function useRevenuePartnershipLogin() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.revenuePartnershipLoginPage ?? {})

  return {
    loading,
    error,
    title:        computed(() => pageData.value?.title        ?? ''),
    titleAr:      computed(() => pageData.value?.titleAr      ?? ''),
    subtitle:     computed(() => pageData.value?.subtitle     ?? ''),
    subtitleAr:    computed(() => pageData.value?.subtitleAr    ?? ''),
    roles:        computed(() => pageData.value?.roles        ?? []),
    rolesAr:      computed(() => pageData.value?.rolesAr      ?? []),
    labels:       computed(() => pageData.value?.labels       ?? {}),
    placeholders: computed(() => pageData.value?.placeholders ?? {}),
    footer:       computed(() => pageData.value?.footer       ?? {}),
  }
}

export function useRevenuePartnershipPartnerPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.revenuePartnershipPartnerPage ?? {})

  return {
    loading,
    error,
    alert:          computed(() => pageData.value?.alert          ?? {}),
    mainStats:      computed(() => pageData.value?.mainStats      ?? []),
    partnerSummary: computed(() => pageData.value?.partnerSummary ?? {}),
    paymentDetails: computed(() => pageData.value?.paymentDetails ?? {}),
  }
}

export function useRevenuePartnershipSelectDashboardPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.revenuePartnershipSelectDashboardPage ?? {})

  return {
    loading,
    error,
    pageData,
    title:    computed(() => pageData.value?.title    ?? ''),
    subtitle: computed(() => pageData.value?.subtitle ?? ''),
    cards:    computed(() => pageData.value?.cards    ?? []),
  }
}

export function useRevenuePartnershipAdminPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.revenuePartnershipAdminPage ?? {})

  return {
    loading,
    error,
    pageData,
    alert:               computed(() => pageData.value?.alert               ?? {}),
    overviewMetrics:     computed(() => pageData.value?.overviewMetrics     ?? {}),
    paymentStatusMetrics:computed(() => pageData.value?.paymentStatusMetrics ?? {}),
    operationsSubTabs:   computed(() => pageData.value?.operationsSubTabs   ?? []),
    approvalSubTabs:     computed(() => pageData.value?.approvalSubTabs     ?? []),
    statusFilters:       computed(() => pageData.value?.statusFilters       ?? []),
  }
}

export function useReviewManagerSelectDashboardPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.reviewManagerSelectDashboardPage ?? {})

  return {
    loading,
    error,
    title:    computed(() => pageData.value?.title    ?? ''),
    subtitle: computed(() => pageData.value?.subtitle ?? ''),
    cards:    computed(() => pageData.value?.cards    ?? []),
  }
}

export function useReviewManagerDashboardPage() {
  const { data, loading, error } = useWebsiteData()
  const pageData = computed(() => data.value?.reviewManagerDashboardPage ?? {})

  return {
    loading,
    error,
    productivityMetrics:   computed(() => pageData.value?.productivityMetrics?.cards ?? []),
    tabs:                  computed(() => pageData.value?.tabs ?? []),
    consultants:           computed(() => pageData.value?.consultants ?? []),
    syncData:              computed(() => pageData.value?.syncData ?? []),
    clientFixedProgressData: computed(() => pageData.value?.clientFixedProgressData ?? []),
    consultantWorkloadData: computed(() => pageData.value?.consultantWorkloadData ?? []),
    assignConsultantData:  computed(() => pageData.value?.assignConsultantData ?? []),
    clientReviewAnalysisData: computed(() => pageData.value?.clientReviewAnalysisData ?? []),
    consultantList:        computed(() => pageData.value?.consultantList ?? []),
  }
}
