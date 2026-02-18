<template>
  <div class="w-full h-full rounded-[20px] p-6 shadow-sm relative group cursor-pointer transition-all duration-300 flex flex-col"
    style="background: linear-gradient(180deg, #00A176 0%, #004E3F 100%);">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
      
       <!-- Title -->
      <div class="mb-2">
        <h2 class="text-[16px] font-regular text-white">{{ currentLang === 'ar' ? 'التدفق الداخلي مقابل التدفق الخارجي' : 'Inflow vs Outflow' }}</h2>
        <p class="text-[12px] font-regular mt-1 text-[#FFFFFFCF]">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>

      <!-- Legend & Expand Icon -->
      <div class="flex items-center gap-4 text-xs font-medium">
             <div class="flex items-center gap-1.5">
               <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
               <span class="text-white">{{ currentLang === 'ar' ? 'التدفق الخارجي' : 'Outflow' }}</span>
             </div>
             <div class="flex items-center gap-1.5">
               <span class="w-3 h-3 rounded-full bg-[#00FFBC]"></span>
               <span class="text-white">{{ currentLang === 'ar' ? 'التدفق الداخلي' : 'Inflow' }}</span>
             </div>
             <img 
               :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-white.svg'" 
               alt="Expand" 
               class="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100"
             />
      </div>
    </div>

    <!-- Chart Area -->
    <div class="flex-1 min-h-0 mt-6">
      <ClientOnly>
        <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()

const chartSeries = [
  {
    name: 'Outflow',
    data: [1.6, 1.6, 1.8, 2.0, 2.1, 2.3]
  },
  {
    name: 'Inflow',
    data: [2.6, 2.6, 3.0, 3.7, 3.8, 3.9]
  }
];

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false },
    background: 'transparent'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: '11px',
      colors: ['#FFFFFF'],
      fontWeight: 500
    },
    formatter: function (val: number) {
      return val.toFixed(1) + 'M'
    }
  },
  legend: { show: false },
  colors: ['#FF7B5F', '#00FFBC'],
  stroke: {
    show: false
  },
  xaxis: {
    categories: currentLang.value === 'ar' 
      ? ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
      : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    labels: {
        style: { colors: '#FFFFFF', fontSize: '13px', fontWeight: 500 }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => value.toFixed(0) + 'M',
      style: { colors: '#FFFFFF', fontSize: '13px', fontWeight: 500 }
    },
    axisBorder: { 
      show: true,
      color: 'rgba(255, 255, 255, 0.3)',
      width: 1,
      offsetX: -2,
      offsetY: -2
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    custom: function({series, seriesIndex, dataPointIndex, w}: any) {
      const month = w.globals.labels[dataPointIndex];
      const inflowValue = series[1][dataPointIndex];
      const outflowValue = series[0][dataPointIndex];
      const netCashflow = inflowValue - outflowValue;
      const netPercentage = ((netCashflow / outflowValue) * 100).toFixed(1);
      
      const inflowLabel = currentLang.value === 'ar' ? 'التدفق الداخلي: ' : 'Inflow: ';
      const outflowLabel = currentLang.value === 'ar' ? 'التدفق الخارجي: ' : 'Outflow: ';
      const netCashflowLabel = currentLang.value === 'ar' ? 'صافي التدفق النقدي: ' : 'Net Cashflow: ';
      
      return '<div class="px-4 py-3 bg-white rounded-lg shadow-xl border-none" style="min-width: 180px;">' +
        '<div class="font-semibold mb-2 text-[#000] text-[13px]">' + month + '</div>' +
        '<div class="text-[#000] text-[12px] mb-1">' + inflowLabel + '<span class="font-semibold">AED ' + inflowValue.toFixed(1) + 'M</span></div>' +
        '<div class="text-[#000] text-[12px] mb-1">' + outflowLabel + '<span class="font-semibold">AED ' + outflowValue.toFixed(1) + 'M</span></div>' +
        '<div class="text-[12px]">' + netCashflowLabel + '<span class="font-semibold text-[#00A176]">+' + netPercentage + '%</span></div>' +
        '</div>'
    }
  }
}));
</script>

<style scoped>
:deep(.apexcharts-tooltip) {
  background: white !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
