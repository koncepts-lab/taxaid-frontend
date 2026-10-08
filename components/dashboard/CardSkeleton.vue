<template>
  <div class="w-full rounded-[20px] overflow-hidden animate-pulse p-5 flex flex-col" :class="[height, bgClass]">
    <div class="flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full" :class="blockClass"></div>
        <div class="h-5 w-28 rounded" :class="blockClass"></div>
      </div>
      <div class="flex items-center gap-3">
        <template v-if="variant === 'area-chart' || variant === 'bar-chart'">
          <div class="hidden md:block w-20 h-3 rounded" :class="blockClass"></div>
          <div class="hidden md:block w-20 h-3 rounded" :class="blockClass"></div>
        </template>
        <div class="w-9 h-9 rounded-full" :class="blockClass"></div>
      </div>
    </div>

    <!-- gauge: Revenue -->
    <template v-if="variant === 'gauge'">
      <div class="flex-1 flex items-center justify-center">
        <div class="w-[220px] h-[110px] rounded-t-full" :class="blockClass"></div>
      </div>
      <div class="shrink-0 flex flex-col gap-3 items-center pb-2">
        <div class="h-3 w-1/3 rounded" :class="blockClass"></div>
        <div class="h-5 w-1/2 rounded" :class="blockClass"></div>
      </div>
    </template>

    <!-- gauge-row: Financials -->
    <template v-else-if="variant === 'gauge-row'">
      <div class="flex-1 flex items-start justify-around px-2 pt-2">
        <div v-for="n in 3" :key="n" class="flex flex-col items-center gap-2">
          <div class="w-[80px] h-[80px] rounded-full" :class="blockClass"></div>
          <div class="h-2.5 w-16 rounded" :class="blockClass"></div>
        </div>
      </div>
    </template>

    <!-- donut-legend: Indirect Expense -->
    <template v-else-if="variant === 'donut-legend'">
      <div class="flex-1 flex items-center justify-between gap-4 mt-2">
        <div class="w-[120px] h-[120px] rounded-full shrink-0" :class="blockClass"></div>
        <div class="flex-1 flex flex-col gap-3">
          <div v-for="n in 4" :key="n" class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" :class="blockClass"></div>
            <div class="h-3 flex-1 rounded" :class="blockClass"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- area-chart: Cashflow -->
    <template v-else-if="variant === 'area-chart'">
      <div class="flex-1 flex gap-3 mt-3">
        <div class="flex-1 rounded-xl" :class="blockClass"></div>
        <div class="hidden md:flex flex-col gap-2 justify-center shrink-0 w-[35px]">
          <div class="h-[25px] rounded-full" :class="blockClass"></div>
          <div class="h-[25px] rounded-full" :class="blockClass"></div>
        </div>
      </div>
    </template>

    <!-- bar-chart: Account Receivables -->
    <template v-else-if="variant === 'bar-chart'">
      <div class="flex-1 mt-3 flex gap-2">
        <div class="flex flex-col justify-between py-1 shrink-0 w-6">
          <div v-for="n in 4" :key="n" class="h-2 w-full rounded" :class="blockClass"></div>
        </div>
        <div class="flex-1 flex items-end justify-around gap-2 px-2 pb-1">
          <div v-for="n in 6" :key="n" class="w-[20px] rounded-t" :class="blockClass" :style="{ height: (30 + (n % 4) * 15) + '%' }"></div>
        </div>
      </div>
    </template>

    <!-- stat-wave: Cogs / Cost Center -->
    <template v-else-if="variant === 'stat-wave'">
      <div class="flex-1 flex justify-between items-start pt-1">
        <div class="flex flex-col gap-2">
          <div class="h-3 w-24 rounded" :class="blockClass"></div>
          <div class="h-9 w-20 rounded" :class="blockClass"></div>
          <div class="h-3 w-28 rounded" :class="blockClass"></div>
        </div>
        <div class="w-[140px] h-[70px] rounded-xl" :class="blockClass"></div>
      </div>
      <div class="shrink-0 flex flex-col gap-1.5">
        <div class="h-2.5 w-4/5 rounded" :class="blockClass"></div>
        <div class="h-2.5 w-3/5 rounded" :class="blockClass"></div>
      </div>
    </template>

    <!-- stat-bars: Accounts Payable -->
    <template v-else-if="variant === 'stat-bars'">
      <div class="flex-1 flex justify-between items-end pt-1">
        <div class="flex flex-col gap-2">
          <div class="h-3 w-28 rounded" :class="blockClass"></div>
          <div class="h-9 w-24 rounded" :class="blockClass"></div>
          <div class="h-3 w-24 rounded" :class="blockClass"></div>
        </div>
        <div class="flex items-end gap-2 h-20 mb-1">
          <div v-for="n in 4" :key="n" class="w-3 rounded-full" :class="blockClass" :style="{ height: (25 + n * 15) + '%' }"></div>
        </div>
      </div>
      <div class="shrink-0 flex flex-col gap-1.5">
        <div class="h-2.5 w-3/5 rounded" :class="blockClass"></div>
        <div class="h-2.5 w-2/3 rounded" :class="blockClass"></div>
      </div>
    </template>

    <!-- stat-donut: Tax Queries -->
    <template v-else-if="variant === 'stat-donut'">
      <div class="flex-1 flex justify-between items-start pt-1">
        <div class="flex flex-col gap-2">
          <div class="h-3 w-20 rounded" :class="blockClass"></div>
          <div class="h-8 w-28 rounded" :class="blockClass"></div>
          <div class="h-2.5 w-32 rounded" :class="blockClass"></div>
          <div class="h-2.5 w-28 rounded" :class="blockClass"></div>
        </div>
        <div class="w-24 h-24 rounded-full shrink-0" :class="blockClass"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  height: { type: String, required: true },
  variant: { type: String, required: true },
  dark: { type: Boolean, default: false }
})
const { isDark } = useTheme()
const bgClass = computed(() => props.dark ? 'bg-[#00342A]' : (isDark.value ? 'bg-[#002e26]' : 'bg-white'))
const blockClass = computed(() => props.dark || isDark.value ? 'bg-white/10' : 'bg-gray-200')
</script>
