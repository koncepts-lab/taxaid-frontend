<template>
  <NuxtLayout name="dashboard">
    <!-- Main Grid Wrapper -->
    <div class="grid grid-cols-12 gap-3 pb-4 pt-4">
      
      <!-- LEFT SIDEBAR -->
      <div class="col-span-12 lg:col-span-3 flex flex-col gap-3">
        <DashboardRevenue />
      </div>

      <!-- MAIN CONTENT -->
      <div class="col-span-12 lg:col-span-9 flex flex-col gap-3">
        
        <!-- ROW 1 -->
        <div class="grid grid-cols-12 gap-3">
          <DashboardCashflow />
          <DashboardFinancials />
        </div>

        <!-- ROW 2 -->
        <div class="grid grid-cols-12 gap-3">
          <DashboardIndirectExpense />
          <DashboardAccountReceivables />
        </div>
      </div>

      <!-- ROW 3 (Full Width Bottom Row) -->
      <div class="col-span-12 grid grid-cols-12 gap-3 pb-4">
        <DashboardCogs />
        <DashboardAccountsPayable />
        <DashboardCostCenter />
        <DashboardTaxQueries />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// Config logic remains same as previous steps
const receivableOptions = {}; // Placeholders as logic is moved to components
const receivableSeries = [];
const cashflowOptions = {};
const cashflowSeries = [];
</script>