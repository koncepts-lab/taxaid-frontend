<template>
  <NuxtLayout name="dashboard">
    <!-- Main Grid Wrapper -->
    <div class="grid grid-cols-12 gap-6 pb-6">
      
      <!-- LEFT SIDEBAR: Added max-width constraint -->
      <div class="col-span-12 lg:col-span-3 flex flex-col gap-6">
        <DashboardRevenue />

        <!-- COGS Card -->
        <DashboardCogs />
      </div>

      <!-- MAIN CONTENT (Remaining space) -->
      <div class="col-span-12 lg:col-span-9 flex flex-col gap-6">
        
        <!-- ROW 1 -->
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 lg:col-span-8 bg-white rounded-[35px] p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2 text-[#003d35] font-bold text-xl">
                <span class="w-8 h-8 rounded-full bg-[#DFFFF6] flex items-center justify-center text-[#00B794]">⇄</span> 
                Cashflow
              </div>
            </div>
            <ClientOnly>
               <apexchart width="100%" height="250" type="area" :options="cashflowOptions" :series="cashflowSeries"></apexchart>
            </ClientOnly>
          </div>

          <div class="col-span-12 lg:col-span-4 bg-white rounded-[35px] p-6 shadow-sm flex flex-col">
            <div class="text-[#003d35] font-bold text-xl mb-6">📄 Financials</div>
            <div class="flex-1 flex justify-around items-center">
                 <div v-for="stat in financialStats" :key="stat.label" class="flex flex-col items-center">
                    <div class="relative w-14 h-14">
                        <svg class="w-full h-full" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" stroke-width="3" />
                            <circle cx="18" cy="18" r="16" fill="none" :stroke="stat.color" stroke-width="3" :stroke-dasharray="stat.dash" transform="rotate(-90 18 18)" />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-[9px]">{{ stat.val }}</div>
                    </div>
                    <span class="text-[9px] text-gray-400 mt-2 font-medium">{{ stat.label }}</span>
                 </div>
            </div>
          </div>
        </div>

        <!-- ROW 2 -->
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 lg:col-span-5 bg-white rounded-[35px] p-6 shadow-sm">
            <div class="text-[#003d35] font-bold text-lg mb-4">Indirect Expense</div>
            <ClientOnly><apexchart width="100%" height="220" type="donut" :options="expenseOptions" :series="expenseSeries"></apexchart></ClientOnly>
          </div>
          <div class="col-span-12 lg:col-span-7 bg-white rounded-[35px] p-6 shadow-sm">
             <div class="text-[#003d35] font-bold text-lg mb-4">Account Receivables</div>
             <ClientOnly><apexchart width="100%" height="220" type="bar" :options="receivableOptions" :series="receivableSeries"></apexchart></ClientOnly>
          </div>
        </div>

        <!-- ROW 3 -->
        <div class="grid grid-cols-12 gap-6">
          <div v-for="card in bottomCards" :key="card.title" class="col-span-12 md:col-span-4 bg-white rounded-[35px] p-5 shadow-sm">
             <div class="text-[#003d35] font-bold text-sm mb-1">{{ card.icon }} {{ card.title }}</div>
             <div class="text-2xl font-bold text-[#003d35]">{{ card.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// Config logic remains same as previous steps
const financialStats = [{ label: 'Growth', val: '+8.2%', color: '#00B794', dash: '80, 100' }, { label: 'Margin', val: '+4.8%', color: '#005847', dash: '50, 100' }];
const bottomCards = [{ title: 'Accounts Payable', value: 'د.إ 140,175', icon: '⬆️' }, { title: 'Cost Center', value: '12', icon: '📑' }, { title: 'Tax Queries', value: '8,001', icon: '💬' }];
const cashflowSeries = [{ name: 'Real', data: [31, 40, 28, 51, 42, 109, 100] }];
const cashflowOptions = { chart: { toolbar: { show: false } }, stroke: { curve: 'smooth' }, colors: ['#00B794'] };
const expenseSeries = [35, 30, 20, 10, 5];
const expenseOptions = { labels: ['Rent', 'Salaries', 'Ads', 'Office', 'Other'], colors: ['#003d35', '#00B794', '#FFC107', '#FF7B5F', '#00E5B0'], legend: { position: 'bottom' } };
const receivableSeries = [{ name: 'Due', data: [44, 55, 41, 67, 22] }];
const receivableOptions = { chart: { toolbar: { show: false } }, colors: ['#003d35'], plotOptions: { bar: { columnWidth: '30%' } } };
</script>