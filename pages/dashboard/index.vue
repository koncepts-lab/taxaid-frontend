<template>
  <NuxtLayout name="dashboard">
    <div class="relative z-10 px-0 lg:px-6 pb-0 lg:pb-4 font-sans min-h-[calc(100vh-90px)]" :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <!-- Main Grid Wrapper -->
      <div class="grid grid-cols-12 gap-3 pb-0 lg:pb-4 pt-4">

        <div class="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <DashboardCardSkeleton v-if="loading" :height="cardHeights.revenue" variant="gauge" dark />
          <template v-else>
            <NuxtLink v-if="can('cards.revenue')" to="/revenue">
              <DashboardRevenue />
            </NuxtLink>
            <DashboardLockedTile v-else title="Revenue" :height="cardHeights.revenue" />
          </template>
        </div>

        <div class="col-span-12 lg:col-span-9 flex flex-col gap-3">

          <div class="grid grid-cols-12 gap-3">
            <DashboardCardSkeleton v-if="loading" class="col-span-12 lg:col-span-7" :height="cardHeights.cash_flow" variant="area-chart" />
            <template v-else>
              <NuxtLink v-if="can('cards.cash_flow')" to="/cash-flow" class="col-span-12 lg:col-span-7">
                <DashboardCashflow />
              </NuxtLink>
              <DashboardLockedTile v-else class="col-span-12 lg:col-span-7" title="Cashflow" :height="cardHeights.cash_flow" />
            </template>
            <DashboardCardSkeleton v-if="loading" class="col-span-12 lg:col-span-5" :height="cardHeights.financials" variant="gauge-row" />
            <template v-else>
              <NuxtLink v-if="can('cards.financials')" to="/financial-statement" class="col-span-12 lg:col-span-5">
                <DashboardFinancials />
              </NuxtLink>
              <DashboardLockedTile v-else class="col-span-12 lg:col-span-5" title="Financial Statement" :height="cardHeights.financials" />
            </template>
          </div>

          <div class="grid grid-cols-12 gap-3">
            <DashboardCardSkeleton v-if="loading" class="col-span-12 lg:col-span-5" :height="cardHeights.indirect_expense" variant="donut-legend" />
            <template v-else>
              <NuxtLink v-if="can('cards.indirect_expense')" to="/indirect-expense" class="col-span-12 lg:col-span-5">
                <DashboardIndirectExpense />
              </NuxtLink>
              <DashboardLockedTile v-else class="col-span-12 lg:col-span-5" title="Indirect Expense" :height="cardHeights.indirect_expense" />
            </template>
            <DashboardCardSkeleton v-if="loading" class="col-span-12 lg:col-span-7" :height="cardHeights.accounts_receivable" variant="bar-chart" />
            <template v-else>
              <NuxtLink v-if="can('cards.accounts_receivable')" to="/accounts-receivable" class="col-span-12 lg:col-span-7">
                <DashboardAccountReceivables />
              </NuxtLink>
              <DashboardLockedTile v-else class="col-span-12 lg:col-span-7" title="Account Receivables" :height="cardHeights.accounts_receivable" />
            </template>
          </div>
        </div>

        <div class="col-span-12 grid grid-cols-12 gap-3 pb-0 lg:pb-4">
          <DashboardCardSkeleton v-if="loading" class="col-span-12 md:col-span-6 lg:col-span-3" :height="cardHeights.cogs" variant="stat-wave" />
          <template v-else>
            <NuxtLink v-if="can('cards.cogs')" to="/cogs" class="col-span-12 md:col-span-6 lg:col-span-3">
              <DashboardCogs />
            </NuxtLink>
            <DashboardLockedTile v-else class="col-span-12 md:col-span-6 lg:col-span-3" title="COGS" :height="cardHeights.cogs" />
          </template>
          <DashboardCardSkeleton v-if="loading" class="col-span-12 md:col-span-6 lg:col-span-3" :height="cardHeights.accounts_payable" variant="stat-bars" />
          <template v-else>
            <NuxtLink v-if="can('cards.accounts_payable')" to="/accounts-payable" class="col-span-12 md:col-span-6 lg:col-span-3">
              <DashboardAccountsPayable />
            </NuxtLink>
            <DashboardLockedTile v-else class="col-span-12 md:col-span-6 lg:col-span-3" title="Accounts Payable" :height="cardHeights.accounts_payable" />
          </template>
          <DashboardCardSkeleton v-if="loading" class="col-span-12 md:col-span-6 lg:col-span-3" :height="cardHeights.cost_center" variant="stat-wave" />
          <template v-else>
            <NuxtLink v-if="can('cards.cost_center')" to="/cost-center" class="col-span-12 md:col-span-6 lg:col-span-3">
              <DashboardCostCenter />
            </NuxtLink>
            <DashboardLockedTile v-else class="col-span-12 md:col-span-6 lg:col-span-3" title="Cost Center" :height="cardHeights.cost_center" />
          </template>
          <DashboardCardSkeleton v-if="loading" class="col-span-12 md:col-span-6 lg:col-span-3" :height="cardHeights.tax_queries" variant="stat-donut" />
          <template v-else>
            <NuxtLink v-if="can('cards.tax_queries')" to="/tax-queries" class="col-span-12 md:col-span-6 lg:col-span-3">
              <DashboardTaxQueries />
            </NuxtLink>
            <DashboardLockedTile v-else class="col-span-12 md:col-span-6 lg:col-span-3" title="Tax Queries" :height="cardHeights.tax_queries" />
          </template>
        </div>
      </div>

      <DashboardAlertToasts v-if="!isMobile" :keys="pendingKeys" @open="openModalKey = $event" @close="dismissKey" />
      <DashboardApVarianceReconciliationModal
        v-if="openModalKey === 'ap_variance' && !isMobile"
        :data="dashboardAlerts.ap_variance"
        @close="closeModal"
        @resolved="onModalResolved" />
      <DashboardArVarianceReconciliationModal
        v-if="openModalKey === 'ar_variance' && !isMobile"
        :data="dashboardAlerts.ar_variance"
        @close="closeModal"
        @resolved="onModalResolved" />
      <DashboardNewLedgerDetectedModal
        v-if="openModalKey === 'missing_ledgers' && !isMobile"
        :data="dashboardAlerts.missing_ledgers"
        @close="closeModal"
        @resolved="onModalResolved" />
      <DashboardSalesForecastVarianceModal
        v-if="openModalKey === 'sales_forecast_variance' && !isMobile"
        :data="dashboardAlerts.sales_forecast_variance"
        :date="today"
        @close="closeModal"
        @resolved="onModalResolved" />
    </div>
  </NuxtLayout>
</template>

<script setup>
const today = localIsoDate()
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ALERT_KEYS = ['ap_variance', 'ar_variance', 'missing_ledgers', 'sales_forecast_variance']

const { can } = usePermissions()
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isMobile = ref(false)

const dashboardAlerts = ref({
  ar_variance: null,
  ap_variance: null,
  missing_ledgers: null,
  sales_forecast_variance: null,
})

const { fetchSummary, loading } = useDashboard()
const cardHeights = {
  revenue: 'h-[542px]',
  cash_flow: 'h-[250px]',
  financials: 'h-[250px]',
  indirect_expense: 'h-[280px]',
  accounts_receivable: 'h-[280px]',
  cogs: 'h-[290px]',
  accounts_payable: 'h-[290px]',
  cost_center: 'h-[290px]',
  tax_queries: 'h-[290px]',
}

const fetchDashboardAlerts = async () => {
  if (!can('alerts.access')) return
  const res = await useApi('/dashboard/alerts')
  if (res?.status === 'success') {
    dashboardAlerts.value = res.data
    registerShown()
  }
}

const shownKeys = ref(new Set())
const closedKeys = ref(new Set())
const openModalKey = ref(null)

const registerShown = () => {
  for (const key of ALERT_KEYS) {
    if (!dashboardAlerts.value[key] || shownKeys.value.has(key)) continue
    shownKeys.value = new Set(shownKeys.value).add(key)
  }
}

const pendingKeys = computed(() =>
  ALERT_KEYS.filter((key) => dashboardAlerts.value[key] && shownKeys.value.has(key) && !closedKeys.value.has(key))
)

const dismissKey = (key) => {
  closedKeys.value = new Set(closedKeys.value).add(key)
}

const closeModal = () => {
  openModalKey.value = null
}

const onModalResolved = async () => {
  if (openModalKey.value) dismissKey(openModalKey.value)
  openModalKey.value = null
  await fetchDashboardAlerts()
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  const updateIsMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener('resize', updateIsMobile);
  onUnmounted(() => window.removeEventListener('resize', updateIsMobile));

  fetchDashboardAlerts()
  fetchSummary()
  useLocation().syncSessionLocation()
  useNotificationSettings().syncWebPush()
})
</script>