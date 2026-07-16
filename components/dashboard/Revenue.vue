<template>
  <div
    class="
      w-full
      mx-auto
      rounded-[20px]
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
      h-[542px]
      group
      cursor-pointer
      justify-between
    "
    :style="{
      backgroundImage: 'url(/images/bg-Revenue.png)',
    }"
    @mouseenter="hoveredMenuItem = 'Revenue'"
    @mouseleave="hoveredMenuItem = null"
  >
    <!-- Header -->
    <div class="w-full flex items-center justify-between px-6 pt-15">
      <div class="flex items-center gap-3">
        <div class="w-[41px] h-[41px] rounded-full grid place-items-center bg-white/10 shrink-0">
          <img src="/images/icons/Revenue.svg" alt="Revenue" class="w-[24px] object-contain" />
        </div>
        <div class="text-base font-medium tracking-tight text-[20px]">{{ currentLang === 'ar' ? 'الإيرادات' : 'Revenue' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>

    <!-- Gauge Area -->
    <div class="relative w-full px-4 mt-4 overflow-visible">
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
            stroke="#03D9B0"
            stroke-width="6"
          />

          <!-- Labels -->
          <text :x="polarToCartesian(-180).x" :y="polarToCartesian(-180).y + 35" text-anchor="middle" fill="white" font-size="18" font-weight="500" opacity="0.5">0</text>
          <text :x="polarToCartesian(0).x" :y="polarToCartesian(0).y + 35" text-anchor="middle" fill="white" font-size="18" font-weight="500" opacity="0.5">100 %</text>
        </svg>

        <!-- Center Value & Icon -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pt-[40%]">
          <span class="leading-none text-[40px] font-semibold block">
            {{ Math.round(currentYearPct) }}%
          </span>
          <span class="text-[11px] font-light opacity-60 mt-1 mb-0 uppercase tracking-widest block">
            {{ currentLang === 'ar' ? 'تم تحقيق الهدف' : 'Target Achieved' }}
          </span>
          
          <!-- Center Icon moved inside absolute container -->
          <div 
            class="flex justify-center"
            :style="{ 
              opacity: animProgress / 100, 
              clipPath: `inset(${100 - animProgress}% 0 0 0)`
            }"
          >
            <img
              src="/images/icons/Total-Revenue.svg"
              alt="Icon"
              class="w-[50px] md:w-[60px] h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Values -->
    <div class="w-full text-center px-6 flex flex-col gap-3 pb-[30px]">
      <div class="mt-0">
        <div class="text-[14px] opacity-70 mb-0 uppercase tracking-widest">{{ currentLang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue' }}</div>
        <div class="text-xl font-bold flex items-center justify-center">
          <span class="mr-1"><img src="/images/icons/dirham.svg" alt="Icon" class="w-[20px]" /></span>{{ formatNumber(totalRevenue) }}
        </div>
      </div>

      <div class="pt-3 border-t border-white/10 mx-2">
        
        <div class="text-[18px] font-thin flex items-center justify-center gap-1">
          <img src="/images/icons/dirham.svg" alt="Icon" class="w-[16px]" />{{ formatNumber(netRevenue) }}
          <div class="text-[14px] font-thin">{{ currentLang === 'ar' ? 'صافي الإيرادات (بعد المرتجعات)' : 'Net Revenue (After Returns)' }}</div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
const currentLang = useState('currentLang')
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Revenue')

// ── Pull values from website-data.json ───────────────────────────────────
const { revenue } = useDashboard()

const totalRevenue        = computed(() => revenue.value?.totalRevenue        ?? 0)
const netRevenue          = computed(() => revenue.value?.netRevenue          ?? 0)
const currentYearTarget   = computed(() => revenue.value?.currentYearTarget   ?? 0)
const currentYearAchieved = computed(() => revenue.value?.currentYearAchieved ?? 0)

const colors = computed(() => revenue.value?.gaugeColors ?? { lastYear: "#21E669", currentYear: "#03D8B0", balance: "#0A7C4B" })
const svgW = 400; const svgH = 240;
const cx = 200;   const cy = 180;  const r = 170;
const strokeW = 18; const startDeg = -180; const endDeg = 0;
const gapDeg = 9; const lastYearSpanDeg = 30;

const animProgress = ref(0);

onMounted(() => {
  let startTimestamp: number | null = null;
  const duration = 1200;
  const animate = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = timestamp - startTimestamp;
    animProgress.value = Math.min(100, (progress / duration) * 100);
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
});

const currentYearPct = computed(() => currentYearTarget.value > 0 ? Math.min(100, (currentYearAchieved.value / currentYearTarget.value) * 100) : 0);
const remainingSpan = computed(() => (endDeg - startDeg) - lastYearSpanDeg - (gapDeg * 2));

const polarToCartesian = (angleDeg: number, radius = r) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
};

const arcPath = (a0: number, a1: number) => {
  if (a1 <= a0) return "M 0 0";
  const p0 = polarToCartesian(a0); const p1 = polarToCartesian(a1);
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`;
};

const displayLimitDeg = computed(() => startDeg + (animProgress.value / 100) * (endDeg - startDeg));

const segLastYearPath = computed(() => {
  const a0 = startDeg;
  const a1 = startDeg + lastYearSpanDeg;
  return arcPath(a0, Math.min(a1, displayLimitDeg.value));
});

const segCurrent = computed(() => {
  const a0 = startDeg + lastYearSpanDeg + gapDeg;
  return { a0, a1: a0 + (currentYearPct.value / 100) * remainingSpan.value };
});

const segCurrentPath = computed(() => {
  const { a0, a1 } = segCurrent.value;
  if (displayLimitDeg.value <= a0) return "M 0 0";
  return arcPath(a0, Math.min(a1, displayLimitDeg.value));
});

const segBalancePath = computed(() => {
  const a0 = segCurrent.value.a1 + gapDeg;
  const a1 = endDeg;
  if (displayLimitDeg.value <= a0) return "M 0 0";
  return arcPath(a0, Math.min(a1, displayLimitDeg.value));
});

const marker = computed(() => {
  const targetA = segCurrent.value.a1;
  return polarToCartesian(Math.min(targetA, displayLimitDeg.value));
});

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