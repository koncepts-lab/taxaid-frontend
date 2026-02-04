<template>
  <NuxtLayout name="dashboard">
    <!-- Main Grid Wrapper -->
    <div class="grid grid-cols-12 gap-6 pb-6">
      
      <!-- LEFT SIDEBAR: col-span-2 -->
      <div class="col-span-12 lg:col-span-2 flex flex-col gap-6">
        <DashboardRevenue />

        <!-- COGS Card -->
        <div class="bg-white rounded-[30px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-[154px]">
             <div>
                <div class="flex items-center gap-2 text-[#003d35] font-bold text-sm mb-1">🏷️ C.O.G.S</div>
                <div class="text-[10px] text-gray-400">Ratio to Revenue</div>
             </div>
             <div>
                <div class="text-3xl font-bold text-[#003d35]">65%</div>
                <div class="text-[10px] text-[#00B794] font-bold mt-1">↗ 2% vs last month</div>
             </div>
             <div class="absolute bottom-0 right-0 w-20 h-10">
                 <svg class="w-full h-full text-[#00B794]" preserveAspectRatio="none" viewBox="0 0 100 50">
                    <path d="M0 50 L0 30 Q25 10 50 30 T100 10 V50 Z" fill="currentColor" opacity="0.1"/>
                    <path d="M0 30 Q25 10 50 30 T100 10" fill="none" stroke="currentColor" stroke-width="2"/>
                 </svg>
             </div>
        </div>
      </div>

      <!-- MAIN CONTENT: col-span-10 -->
      <div class="col-span-12 lg:col-span-10 flex flex-col gap-6">
        
        <!-- ROW 1: Cashflow (8) + Financials (4) -->
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 lg:col-span-8 bg-white rounded-[30px] p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2 text-[#003d35] font-bold text-lg"><span class="w-8 h-8 rounded-full bg-[#DFFFF6] flex items-center justify-center text-[#00B794]">⇄</span> Cashflow</div>
              <div class="flex items-center gap-4 text-[10px] font-semibold text-gray-400">
                  <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#FF7B5F]"></span> Hypothetical</div>
                  <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#00B794]"></span> Real</div>
              </div>
            </div>
            <ClientOnly>
               <apexchart width="100%" height="250" type="area" :options="cashflowOptions" :series="cashflowSeries"></apexchart>
            </ClientOnly>
          </div>

          <div class="col-span-12 lg:col-span-4 bg-white rounded-[30px] p-6 shadow-sm flex flex-col">
            <div class="flex items-center gap-2 text-[#003d35] font-bold text-lg mb-6"><span class="w-8 h-8 rounded-full bg-[#DFFFF6] flex items-center justify-center text-[#00B794]">📄</span> Financials</div>
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

        <!-- ROW 2: Indirect (5) + Receivables (7) -->
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 lg:col-span-5 bg-white rounded-[30px] p-6 shadow-sm">
            <div class="flex items-center gap-2 text-[#003d35] font-bold text-lg mb-4">% Indirect Expense</div>
            <ClientOnly>
               <apexchart width="100%" height="220" type="donut" :options="expenseOptions" :series="expenseSeries"></apexchart>
            </ClientOnly>
          </div>

          <div class="col-span-12 lg:col-span-7 bg-white rounded-[30px] p-6 shadow-sm">
             <div class="text-[#003d35] font-bold text-lg mb-4">$ Account Receivables</div>
             <ClientOnly>
                 <apexchart width="100%" height="220" type="bar" :options="receivableOptions" :series="receivableSeries"></apexchart>
             </ClientOnly>
          </div>
        </div>

        <!-- ROW 3: Three Equal Cards -->
        <div class="grid grid-cols-12 gap-6">
          <div v-for="card in bottomCards" :key="card.title" class="col-span-12 md:col-span-4 bg-white rounded-[30px] p-5 shadow-sm relative overflow-hidden">
             <div class="flex items-center gap-2 text-[#003d35] font-bold mb-1 text-sm">{{ card.icon }} {{ card.title }}</div>
             <div class="text-[10px] text-gray-400 mb-1">{{ card.subtitle }}</div>
             <div class="text-2xl font-bold text-[#003d35]">{{ card.value }}</div>
             <div :class="`text-[10px] font-bold mt-1 ${card.trendUp ? 'text-[#00B794]' : 'text-[#FF7B5F]'}`">{{ card.trend }}</div>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: false })

const financialStats = [
    { label: 'Growth', val: '+8.2%', color: '#00B794', dash: '80, 100' },
    { label: 'Margin', val: '+4.8%', color: '#005847', dash: '50, 100' }
]

const bottomCards = [
    { title: 'Accounts Payable', subtitle: 'Outstanding', value: 'د.إ 140,175', trend: '↘ 8% vs last month', trendUp: false, icon: '⬆️' },
    { title: 'Cost Center', subtitle: 'Active Projects', value: '12', trend: '↗ +2 vs last month', trendUp: true, icon: '📑' },
    { title: 'Tax Queries', subtitle: 'Token Usage', value: '8,001 / 10,485', trend: '↗ +8.4% vs last month', trendUp: true, icon: '💬' }
]

/* --- Chart Configs --- */
const cashflowSeries = [{ name: 'Real Scenario', data: [31, 40, 28, 51, 42, 109, 100] }, { name: 'Hypothetical', data: [11, 32, 45, 32, 34, 52, 41] }]
const cashflowOptions = { chart: { toolbar: { show: false } }, stroke: { curve: 'smooth', width: 3 }, colors: ['#00B794', '#FF7B5F'], grid: { strokeDashArray: 5 }, xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }, legend: { show: false } }
const expenseSeries = [35, 30, 20, 10, 5]
const expenseOptions = { labels: ['Others', 'Rent', 'Salaries', 'Ads', 'Office'], colors: ['#003d35', '#00B794', '#FFC107', '#FF7B5F', '#00E5B0'], legend: { position: 'right' }, plotOptions: { pie: { donut: { size: '70%' } } } }
const receivableSeries = [{ name: 'Due', data: [44, 55, 41, 67, 22] }, { name: 'Overdue', data: [13, 23, 20, 8, 13] }]
const receivableOptions = { chart: { stacked: true, toolbar: { show: false } }, colors: ['#003d35', '#00B794'], plotOptions: { bar: { columnWidth: '30%', borderRadius: 4 } }, legend: { show: false } }
</script>