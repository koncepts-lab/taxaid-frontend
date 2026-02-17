<template>
  <div class="rounded-3xl p-8 h-full flex flex-col transition-all duration-500"
    :class="isDark ? 'bg-[#00141080] border-none shadow-none' : 'bg-white shadow-sm border border-gray-100'">
    <div class="flex justify-between items-start mb-4">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-normal leading-tight text-white">{{ currentLang === 'ar' ? 'الإيرادات حسب الفئة' : 'Revenue by category' }}</h2>
        <p class="text-[12px] font-regular mt-1" :class="isDark ? 'text-white/60' : 'text-[#0000005C]'">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand" class="w-5 h-5 cursor-pointer opacity-80" />
    </div>

    <div class="flex-1 w-full min-h-[400px]">
      <ClientOnly>
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const series = computed(() => [
  {
    name: currentLang.value === 'ar' ? 'السنة السابقة' : 'Previous Year',
    data: [2.8, 3.1, 3.4, 1.5, 2.5]
  },
  {
    name: currentLang.value === 'ar' ? 'السنة الحالية' : 'Current Year',
    data: [4.2, 3.5, 2.8, 2.0, 1.7]
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    },
    fontFamily: 'Noto Sans Arabic, sans-serif',
    rtl: currentLang.value === 'ar'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -30,
    style: {
      fontSize: '10px',
      colors: ['#46867E'],
      fontWeight: 400,
    },
    formatter: function (val) {
      if (currentLang.value === 'ar') {
        return val.toString().replace('.', ',') + " مليون"
      }
      return val.toString().replace('.', ',') + "M"
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: currentLang.value === 'ar' ? ['استشارات', 'ساس', 'تدريب', 'دعم', 'أخرى'] : ['Consulting', 'SaaS', 'Training', 'Support', 'Other'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        fontSize: '12px',
        colors: isDark.value ? '#FFFFFF80' : '#00000080',
        fontWeight: 400
      },
      offsetY: 0,
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: false
    }
  },
  yaxis: {
    min: 0,
    max: 6,
    tickAmount: 6,
    labels: {
      style: {
        fontSize: '12px',
        colors: '#A6A6A6',
        fontWeight: 400
      },
      formatter: (value) => {
        if (currentLang.value === 'ar') {
          return value === 0 ? "0" : Math.floor(value) + " مليون"
        }
        return value === 0 ? "0" : Math.floor(value) + "M"
      },
      offsetX: 0
    },
    opposite: currentLang.value === 'ar',
    axisBorder: {
      show: true,
      color: isDark.value ? '#F2F2F20F' : '#EFEFEF99',
      width: 1,
      offsetX: -2
    }
  },
  grid: {
    borderColor: isDark.value ? '#F2F2F20F' : '#EFEFEF99',
    strokeDashArray: 0,
    yaxis: {
      lines: {
        show: true
      }
    },
    xaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      top: 0,
      right: currentLang.value === 'ar' ? 10 : 20,
      bottom: 0,
      left: currentLang.value === 'ar' ? 20 : 10
    }
  },
  fill: {
    opacity: 1
  },
  colors: ['#FB7554', '#0BD9A4'],
  legend: {
    position: 'bottom',
    horizontalAlign: currentLang.value === 'ar' ? 'right' : 'left',
    fontSize: '14px',
    fontWeight: 400,
    offsetY: 0,
    markers: {
      width: 12,
      height: 12,
      radius: 6,
      offsetY: 0
    },
    itemMargin: {
      horizontal: 10,
      vertical: -5
    },
    labels: {
      colors: isDark.value ? '#FFFFFF' : '#000000'
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        if (currentLang.value === 'ar') {
          return val + " مليون درهم"
        }
        return val + " Million AED"
      }
    }
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '70%'
          }
        },
        dataLabels: {
          style: {
            fontSize: '10px'
          }
        },
        legend: {
          fontSize: '12px'
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            },
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: false
          }
        }
      }
    }
  ]
}))
</script>

<style scoped>
/* Adjust ApexCharts default font styles if necessary */
:deep(.apexcharts-legend) {
  overflow: visible !important;
  max-height: none !important;
}

:deep(.apexcharts-legend-series) {
  margin-bottom: 5px !important;
}
</style>
