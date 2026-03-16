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
    </div>
  </NuxtLayout>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

// Config logic remains same as previous steps
const receivableOptions = {}; // Placeholders as logic is moved to components
const receivableSeries = [];
const cashflowOptions = {};
const cashflowSeries = [];
</script>