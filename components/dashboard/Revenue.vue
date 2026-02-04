<template>
  <div
    class="w-full rounded-[35px] text-white relative flex flex-col items-center h-[580px] overflow-hidden bg-no-repeat bg-top bg-cover shadow-sm"
    :style="{
      backgroundImage: 'url(/images/bg-Revenue.png)',
      backgroundColor: '#003d35'
    }"
  >
    <!-- Header -->
    <div class="w-full flex items-center gap-2 px-5 pt-8">
      <div class="w-9 h-9 rounded-full grid place-items-center bg-white/10 shrink-0">
        <img src="/images/icons/revenue.svg" alt="Revenue" class="w-4 h-4 object-contain" />
      </div>
      <div class="text-[16px] font-medium tracking-tight">Revenue</div>
    </div>

    <!-- Gauge Area -->
    <div class="relative w-full px-2 mt-4">
      <div class="relative w-full h-[260px]">
        <svg class="w-full h-full block" :viewBox="`0 0 ${svgW} ${svgH}`">
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

          <!-- Segments -->
          <path :d="segLastYearPath" :stroke="colors.lastYear" :stroke-width="strokeW" stroke-linecap="round" fill="none" />
          <path :d="segCurrentPath" :stroke="colors.currentYear" :stroke-width="strokeW" stroke-linecap="round" fill="none" />
          <path :d="segBalancePath" :stroke="colors.balance" :stroke-width="strokeW" stroke-linecap="round" fill="none" />

          <!-- Marker -->
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
          <span class="text-3xl font-bold leading-none">{{ Math.round(currentYearPct) }}%</span>
          <span class="text-[10px] opacity-60 mt-1 uppercase tracking-[1px]">Target</span>
        </div>

        <!-- Center Icon -->
        <div class="absolute left-1/2 top-[72%] -translate-x-1/2 -translate-y-1/2">
          <img src="/images/icons/Total-Revenue.svg" alt="Icon" class="w-12 h-12 object-contain" />
        </div>
      </div>
    </div>

    <!-- Bottom Values -->
    <div class="w-full text-center px-4 flex-1 flex flex-col justify-between pb-10">
      <div class="mt-2">
        <div class="text-[11px] opacity-60 uppercase tracking-widest mb-1">Total Revenue</div>
        <div class="text-2xl font-bold">
          <span class="text-base mr-1 opacity-60">د.إ</span>{{ formatNumber(totalRevenue) }}
        </div>
      </div>

      <div class="pt-6 border-t border-white/10 mx-2">
        <div class="text-[10px] opacity-50 uppercase tracking-[2px] mb-1">Net Revenue</div>
        <div class="text-lg font-semibold">
          <span class="text-xs opacity-60">د.إ</span>{{ formatNumber(netRevenue) }}
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
const svgW = 400; const svgH = 320;
const cx = 200;   const cy = 200;  const r = 175;
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
  for (let i = 0; i <= 25; i++) {
    const ang = startDeg + (i / 25) * 180;
    const p = polarToCartesian(ang);
    const rads = (ang * Math.PI) / 180;
    pts.push({ i, x: p.x - 30 * Math.cos(rads), y: p.y - 30 * Math.sin(rads) });
  }
  return pts;
});

const formatNumber = (n: number) => new Intl.NumberFormat("en-AE").format(n);
</script>