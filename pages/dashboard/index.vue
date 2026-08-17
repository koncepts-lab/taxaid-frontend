<template>
  <NuxtLayout name="dashboard">
    <div class="relative z-10 px-0 lg:px-6 pb-0 lg:pb-4 font-sans min-h-[calc(100vh-90px)]" :class="{ '': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <!-- Main Grid Wrapper -->
      <div class="grid grid-cols-12 gap-3 pb-0 lg:pb-4 pt-4">
        
        <!-- LEFT SIDEBAR -->
        <div class="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <NuxtLink to="/revenue">
            <DashboardRevenue />
          </NuxtLink> 
        </div>

        <!-- MAIN CONTENT -->
        <div class="col-span-12 lg:col-span-9 flex flex-col gap-3">
          
          <!-- ROW 1 -->
          <div class="grid grid-cols-12 gap-3">
            <NuxtLink to="/cash-flow" class="col-span-12 lg:col-span-7">
              <DashboardCashflow />
            </NuxtLink>
            <NuxtLink to="/financial-statement" class="col-span-12 lg:col-span-5">
              <DashboardFinancials />
            </NuxtLink>
          </div>

          <!-- ROW 2 -->
          <div class="grid grid-cols-12 gap-3">
            <NuxtLink to="/indirect-expense" class="col-span-12 lg:col-span-5">
              <DashboardIndirectExpense />
            </NuxtLink>
            <NuxtLink to="/accounts-receivable" class="col-span-12 lg:col-span-7">
              <DashboardAccountReceivables />
            </NuxtLink>
          </div>
        </div>

        <!-- ROW 3 (Full Width Bottom Row) -->
        <div class="col-span-12 grid grid-cols-12 gap-3 pb-0 lg:pb-4">
          <NuxtLink to="/cogs" class="col-span-12 md:col-span-6 lg:col-span-3">
            <DashboardCogs />
          </NuxtLink>
          <NuxtLink to="/accounts-payable" class="col-span-12 md:col-span-6 lg:col-span-3">
            <DashboardAccountsPayable />
          </NuxtLink>
          <NuxtLink to="/cost-center" class="col-span-12 md:col-span-6 lg:col-span-3">
            <DashboardCostCenter />
          </NuxtLink>
          <NuxtLink to="/tax-queries" class="col-span-12 md:col-span-6 lg:col-span-3">
            <DashboardTaxQueries />
          </NuxtLink>
        </div>
      </div>

      <!-- Only one active alert modal renders at a time -->
      <DashboardApVarianceReconciliationModal
        v-if="activeModalKey === 'ap_variance' && !isMobile"
        :data="dashboardAlerts.ap_variance"
        @close="dismissModal('ap_variance')"
        @resolved="onModalResolved" />
      <DashboardArVarianceReconciliationModal
        v-if="activeModalKey === 'ar_variance' && !isMobile"
        :data="dashboardAlerts.ar_variance"
        @close="dismissModal('ar_variance')"
        @resolved="onModalResolved" />
      <DashboardNewLedgerDetectedModal
        v-if="activeModalKey === 'missing_ledgers' && !isMobile"
        :data="dashboardAlerts.missing_ledgers"
        @close="dismissModal('missing_ledgers')"
        @resolved="onModalResolved" />
      <DashboardSalesForecastVarianceModal
        v-if="activeModalKey === 'sales_forecast_variance' && !isMobile"
        :data="dashboardAlerts.sales_forecast_variance"
        :date="new Date().toISOString().slice(0, 10)"
        @close="dismissModal('sales_forecast_variance')"
        @resolved="onModalResolved" />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ALERT_KEYS = ['ap_variance', 'ar_variance', 'missing_ledgers', 'sales_forecast_variance']

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isMobile = ref(false)

const dashboardAlerts = ref({
  ar_variance: null,
  ap_variance: null,
  missing_ledgers: null,
  sales_forecast_variance: null,
})

// Single call for all 8 card summaries — the cards themselves read from the
// same useDashboard() shared state, so this one fetch populates every card.
const { fetchSummary } = useDashboard()

const fetchDashboardAlerts = async () => {
  const res = await useApi('/dashboard/alerts')
  if (res?.status === 'success') dashboardAlerts.value = res.data
}

const dismissedKeys = ref(new Set())
const activeModalKey = computed(() =>
  ALERT_KEYS.find((key) => dashboardAlerts.value[key] && !dismissedKeys.value.has(key)) ?? null
)

const dismissModal = (key) => {
  dismissedKeys.value = new Set(dismissedKeys.value).add(key)
}

const onModalResolved = async () => {
  dismissedKeys.value = new Set()
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
  // deferred + throttled to once a day; never competes with the card requests
  useLocation().syncSessionLocation()
  useNotificationSettings().syncWebPush()
})
</script>