<template>
  <div class="revenue-gauge-card rounded-[20px] p-8 text-white h-full flex flex-col items-center justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-md"
    :class="{ 'dark-mode': isDark }">
    <!-- Header -->
    <div class="w-full flex items-center justify-between mb-4">
      <div class="flex flex-col">
        <h2 class="text-[16px] font-normal leading-tight">{{ currentLang === 'ar' ? 'الهدف ، العام الماضي والحالي' : 'Target , Previous Year and Current' }}</h2>
        <p class="text-[12px] opacity-70 font-normal mt-1">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <img src="/images/icons/expand-white.svg" alt="Expand" class="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
    </div>

    <!-- Gauge Area -->
    <div class="relative w-full flex flex-col items-center justify-center flex-1 py-4">
      <div class="relative w-full max-w-[400px]">
        <svg class="w-full h-auto block" :viewBox="`0 0 ${svgW} ${svgH}`">
          <!-- Ticks -->
          <g>
            <circle
              v-for="t in tickPoints"
              :key="t.i"
              :cx="t.x"
              :cy="t.y"
              r="1.2"
              fill="rgba(255,255,255,0.4)"
            />
          </g>

          <!-- Paths from Dashboard -->
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
            stroke="#03D9B0"
            stroke-width="6"
          />

          <!-- Labels -->
          <text :x="polarToCartesian(-180, r).x" :y="polarToCartesian(-180, r).y + 35" text-anchor="middle" fill="white" font-size="18" font-weight="500" opacity="0.5">0</text>
          <text :x="polarToCartesian(0, r).x" :y="polarToCartesian(0, r).y + 35" text-anchor="middle" fill="white" font-size="18" font-weight="500" opacity="0.5">100%</text>
        </svg>

        <!-- Center Value -->
        <div class="absolute inset-0 flex flex-col items-center justify-center translate-y-2">
          <span class="leading-none text-[43px] font-semibold mt-[0px] block">
            {{ Math.round(currentYearPct) }}%
          </span>
          <span class="text-[12px] font-light mt-3 tracking-widest block">
            {{ currentLang === 'ar' ? 'تم تحقيق الهدف' : 'Target Achieved' }}
          </span>
        </div>
      </div>
    </div>


    <!-- Legend (Dashboard Style) -->
    <div class="w-full grid grid-cols-3 gap-2 mt-[-90px] pt-6 border-t border-white/10">
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors.lastYear }"></div>
          <span class="text-[12px] opacity-70 whitespace-nowrap">{{ currentLang === 'ar' ? 'العام الماضي' : 'Previous Year' }} ({{ lastYearPct }}%)</span>
        </div>
        <div class="text-[18px] font-bold">
          <template v-if="currentLang === 'ar'">0,8 مليون د.إ</template>
          <template v-else>AED 0.8M</template>
        </div>
      </div>
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors.currentYear }"></div>
          <span class="text-[12px] opacity-70 whitespace-nowrap">{{ currentLang === 'ar' ? 'الحالي' : 'Current' }} ({{ Math.round(currentYearPct) }}%)</span>
        </div>
        <div class="text-[18px] font-bold">
          <template v-if="currentLang === 'ar'">7,8 مليون د.إ</template>
          <template v-else>AED 7.8M</template>
        </div>
      </div>
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors.balance }"></div>
          <span class="text-[12px] opacity-70 whitespace-nowrap">{{ currentLang === 'ar' ? 'المستهدف' : 'Target' }} (100%)</span>
        </div>
        <div class="text-[18px] font-bold">
          <template v-if="currentLang === 'ar'">8,5 مليون د.إ</template>
          <template v-else>AED 8.5M</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

// Support for language state if available, fallback to 'en'
const { isDark } = useTheme();
const currentLang = useState('currentLang', () => 'en');

// Data
const currentYearTarget = 8500000;
const currentYearAchieved = 7820000;
const lastYearPct = 9; // Based on the provided image legend

// Dashboard Logic Constants
const colors = { lastYear: "#21E669", currentYear: "#03D8B0", balance: "#0A7C4B" };
const svgW = 400; const svgH = 330;
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

const currentYearPct = computed(() => Math.min(100, (currentYearAchieved / currentYearTarget) * 100));
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
  return polarToCartesian(targetA);
});

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
</script>

<style scoped>
.revenue-gauge-card {
  background: radial-gradient(circle at center, #015c4d 0%, #002e26 100%) !important;
}

.revenue-gauge-card.dark-mode {
  background: #015A49E5 !important;
}

path {
  transition: stroke-dashoffset 0.1s linear;
}

/* Base fade animation for content */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.revenue-gauge-card > * {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
