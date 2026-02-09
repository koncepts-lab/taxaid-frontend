<template>
  <div class="col-span-12 lg:col-span-7 bg-white rounded-[20px] p-6 shadow-sm relative h-[250px]">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
      
      <!-- Title & Icon -->
      <div class="flex items-center gap-3 mb-4 md:mb-0">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-[#00B794] text-xl" style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)">
          <!-- Refresh Icon SVG or simple text -->
          <img src="/images/icons/Cashflow-black.svg" alt="Cashflow" class="w-5 h-5 object-contain">
        </div>
        <div class="text-[#000] font-bold text-2xl">Cashflow</div>
      </div>

      <!-- Legend & Filters -->
      <div class="flex items-center gap-3 text-xs font-medium">
             <div class="flex items-center gap-1">
               <span class="w-3 h-3 rounded-full bg-[#FF7B5F]"></span>
               <span class="text-[#191919]">Hypothetical Scenario</span>
             </div>
             <div class="flex items-center gap-1">
               <span class="w-3 h-3 rounded-full bg-[#00B794]"></span>
               <span class="text-[#191919]">Real Scenario</span>
             </div>
      </div>
    </div>

    <!-- Chart & Filters Area -->
    <div class="flex gap-3">
      <!-- Chart -->
      <div class="flex-1 h-[170px]">
        <ClientOnly>
          <apexchart width="100%" height="100%" type="area" :options="chartOptions" :series="chartSeries"></apexchart>
        </ClientOnly>
      </div>

      <!-- Vertical Time Filters -->
      <div class="flex flex-col gap-2 pt-2 shrink-0">
          <button class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-bold bg-[#E0E7E6] text-[#003d35]">3M</button>
          <button class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-bold text-white bg-[#003d35] shadow-lg">6M</button>
          <button class="w-[35px] h-[25px] flex items-center justify-center rounded-full text-xs font-bold bg-[#E0E7E6] text-[#003d35]">1Y</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const seriesData = {
  real: [2.8, 2.1, 2.5, 1.7, 2.3, 4.0, 4.2, 3.1, 3.6, 3.0, 3.0, 1.4, 1.9, 1.5, 1.8, 3.0, 3.4, 3.6, 4.1, 3.9],
  hypothetical: [1.5, 0.8, 0.9, 1.2, 1.0, 0.9, 1.3, 2.7, 2.8, 2.2, 2.3, 1.8, 2.2, 1.2, 0.6, 1.8, 1.4, 0.4, 1.0, 1.0]
};

// Rebuilding data to roughly match the curve visualization
const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const chartSeries = [
  {
    name: 'Real Scenario',
    data: [2.6, 2.1, 2.5, 1.7, 2.5, 4.0, 2.9, 3.6, 2.8, 1.4, 1.9, 1.5, 3.2, 2.6, 4.1, 4.0]
  },
  {
    name: 'Hypothetical Scenario',
    data: [1.4, 0.8, 1.2, 0.9, 1.1, 2.8, 2.0, 2.3, 1.8, 1.3, 0.5, 1.5, 0.3, 2.0, 1.9, 2.9]
  }
];

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false }
  },
  colors: ['#00B794', '#FF7B5F'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: ['May', '','', 'Jun', '','', 'Jul', '','', 'Aug', '','', 'Sep', '','', 'Oct'],
    labels: {
        style: { colors: '#9CA3AF', fontSize: '12px' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 0,
    max: 4.5,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => value.toFixed(0) + 'M',
      style: { colors: '#9CA3AF', fontSize: '12px' }
    }
  },
  grid: {
    borderColor: '#f3f4f6',
    strokeDashArray: 0,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  legend: { show: false }, // Custom legend used
  tooltip: {
    custom: function({series, seriesIndex, dataPointIndex, w}) {
      return '<div class="px-3 py-2 bg-[#DFFFF6] text-[#003d35] rounded-lg shadow-lg border-none text-xs">' +
        '<div class="font-bold mb-1">July</div>' +
        '<div class="flex items-center gap-2 mb-1"><span class="w-2 h-2 rounded-full bg-[#00B794]"></span><span>Real: AED 2.5M</span></div>' +
        '<div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#FF7B5F]"></span><span>Hypothetical: AED 1.2M</span></div>' +
        '</div>'
    }
  },
  annotations: {
      xaxis: [
          {
              x: 'Jul',
              borderColor: '#00B794',
              strokeDashArray: 0,
              borderWidth: 2,
              opacity: 1,
          }
      ],
      points: [
          {
              x: 'Jul',
              y: 3.6,
              marker: {
                  size: 6,
                  fillColor: '#fff',
                  strokeColor: '#00B794',
                  strokeWidth: 3
              }
          },
          {
              x: 'Jul',
              y: 2.3,
              marker: {
                  size: 6,
                  fillColor: '#fff',
                  strokeColor: '#00B794', // Using green stroke for both markers on the green line/vertical line
                  strokeWidth: 3
              }
          }
      ]
  }
}));
</script>
