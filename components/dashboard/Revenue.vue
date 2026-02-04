<template>
  <div
    class="
      w-full
      mx-auto
      rounded-[35px]
      text-white
      relative
      flex
      flex-col
      items-center
      overflow-hidden
      bg-no-repeat
      bg-top
      bg-cover
      shadow-md
    "
    :style="{
      backgroundImage: 'url(/images/bg-Revenue.png)',
      
    }"
  >
    <!-- Header -->
    <div class="w-full flex items-center gap-3 px-6 pt-[65px]">
      <div class="w-[50px] h-[50px] rounded-full grid place-items-center bg-white/10 shrink-0">
        <img src="/images/icons/revenue.svg" alt="Revenue" class="w-6 h-6 object-contain" />
      </div>
      <div class="text-lg font-medium tracking-tight">Revenue</div>
    </div>

    <!-- Gauge Area -->
    <div class="relative w-full px-4 mt-6">
      <div class="relative w-full">
        <svg class="w-full h-auto block" :viewBox="`0 0 ${svgW} ${svgH}`">
          <!-- Ticks -->
          <g v-if="showTicks">
            <circle
              v-for="t in tickPoints"
              :key="t.i"
              :cx="t.x"
              :cy="t.y"
              r="1.2"
              fill="rgba(255,255,255,0.4)"
            />
          </g>

          <path :d="segLastYearPath" :stroke="colors.lastYear" :stroke-width="strokeW" stroke-linecap="round" fill="none" />
          <path :d="segCurrentPath" :stroke="colors.currentYear" :stroke-width="strokeW" stroke-linecap="round" fill="none" />
          <path :d="segBalancePath" :stroke="colors.balance" :stroke-width="strokeW" stroke-linecap="round" fill="none" />

          <circle
            v-if="currentYearPct > 0"
            :cx="marker.x"
            :cy="marker.y"
            r="9"
            fill="#fff"
            style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3))"
          />
        </svg>

        <!-- Center Value -->
        <div class="absolute inset-0 flex flex-col items-center justify-center translate-y-4">
          <span class="leading-none text-[40px] font-normal -mt-[75px] block">
  {{ Math.round(currentYearPct) }}%
</span>

          <span class="text-[12px] font-light opacity-60 mt-1 uppercase tracking-widest block">
  Target Achieved
</span>

        </div>

        <!-- Center Icon -->
        <div class="absolute left-1/2 top-[85%] -translate-x-1/2 -translate-y-1/2">
          <img
  src="/images/icons/Total-Revenue.svg"
  alt="Icon"
  class="w-[75px] h-auto object-contain -mt-[15px]"
/>

        </div>
      </div>
    </div>

    <!-- Bottom Values -->
    <div class="w-full text-center px-6 flex-1 flex flex-col justify-end gap-6 pb-10">
      <div class="mt-2">
        <div class="text-[12px] opacity-70 mb-1 uppercase tracking-widest">Total Revenue</div>
        <div class="text-2xl font-bold flex items-center justify-center">
          <span class="mr-1"><img src="/images/icons/dirham.svg" alt="Icon" class="w-[25px]" /></span>{{ formatNumber(totalRevenue) }}
        </div>
      </div>

      <div class="pt-6 border-t border-white/10 mx-2">
        
        <div class="text-[14px] font-thin flex items-center justify-center gap-1">
          <img src="/images/icons/dirham.svg" alt="Icon" class="w-[20px]" />{{ formatNumber(netRevenue) }}
          <div class="text-[14px] font-thin">Net Revenue (After Returns)</div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const totalRevenue = 2775000;
const netRevenue = 988430;
const currentYearTarget = 3000000;
const currentYearAchieved = 2760000;

const colors = { lastYear: "#21E669", currentYear: "#03D8B0", balance: "#0A7C4B" };
const svgW = 400; const svgH = 330;
const cx = 200;   const cy = 180;  const r = 170;
const strokeW = 18; const startDeg = -180; const endDeg = 0;
const gapDeg = 6; const lastYearSpanDeg = 30;

const currentYearPct = computed(() => Math.min(100, (currentYearAchieved / currentYearTarget) * 100));
const remainingSpan = computed(() => (endDeg - startDeg) - lastYearSpanDeg - (gapDeg * 2));

const polarToCartesian = (angleDeg: number, radius = r) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
};

const arcPath = (a0: number, a1: number) => {
  const p0 = polarToCartesian(a0); const p1 = polarToCartesian(a1);
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`;
};

const segLastYearPath = computed(() => arcPath(startDeg, startDeg + lastYearSpanDeg));
const segCurrent = computed(() => {
  const a0 = startDeg + lastYearSpanDeg + gapDeg;
  return { a0, a1: a0 + (currentYearPct.value / 100) * remainingSpan.value };
});
const segCurrentPath = computed(() => arcPath(segCurrent.value.a0, segCurrent.value.a1));
const segBalancePath = computed(() => arcPath(segCurrent.value.a1 + gapDeg, endDeg));
const marker = computed(() => polarToCartesian(segCurrent.value.a1));

const showTicks = true;
const tickPoints = computed(() => {
  const pts = [];
  for (let i = 0; i <= 26; i++) {
    const ang = startDeg + (i / 26) * 180;
    const p = polarToCartesian(ang);
    const rads = (ang * Math.PI) / 180;
    pts.push({ i, x: p.x - 30 * Math.cos(rads), y: p.y - 30 * Math.sin(rads) });
  }
  return pts;
});

const formatNumber = (n: number) => new Intl.NumberFormat("en-AE").format(n);
</script>