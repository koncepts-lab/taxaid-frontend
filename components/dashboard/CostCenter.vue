<template>
  <div class="rounded-[20px] p-4 flex flex-col h-[290px] relative overflow-hidden group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Cost Center'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Cost-Center-Project-black.svg" alt="Cost Center" class="w-5 h-5 object-contain" />
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'مركز التكلفة / المشروع' : 'Cost Center / Project' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>
 
    <!-- Main Content -->
    <div class="flex justify-between items-end">
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'هامش ربح المشروع' : 'Project Profit Margin' }}</div>
         <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">{{ profitMargin }}%</div>
        <div v-if="vsLastMonth" class="flex items-center gap-1 font-medium text-[14px] mt-2" :class="trend === 'up' ? 'text-[#05B743]' : 'text-[#FB7554]'">
           <span><img :src="trend === 'up' ? '/images/icons/up.svg' : '/images/icons/down-right.svg'" alt="trend" class="w-4 h-4" /></span>
           <span>{{ currentLang === 'ar' ? `${vsLastMonth} عن العام الماضي` : `${vsLastMonth} vs last year` }}</span>
        </div>
      </div>

      <!-- Mini Wave Chart — real per-project revenue (top-8, normalized) -->
      <div class="w-52 h-16 mb-2 animate-sweep-right">
        <svg viewBox="0 0 120 60" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="costCenterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00B794" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#00B794" stop-opacity="0.05"/>
            </linearGradient>
          </defs>

          <!-- Wave fill -->
          <path :d="`${wavePath} L 120 60 L 0 60 Z`" fill="url(#costCenterGradient)" />

          <!-- Wave stroke -->
          <path :d="wavePath" stroke="#00B794" stroke-width="3" stroke-linecap="round" fill="none" />
        </svg>
      </div>
    </div>

    <!-- Footer Text — key-driver line only if we have a real project name; the
         summary line always shows regardless. -->
    <div class="mt-auto transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
      <p class="text-[12px] font-regular">
        <template v-if="currentLang === 'ar'">
          <template v-if="keyDriver">مشروع <span :class="isDark ? 'text-white' : 'text-[#000]'">{{ keyDriver }}</span> هو المحرك الرئيسي.<br/></template>
          يعزز الربحية الإجمالية لمحفظتنا.
        </template>
        <template v-else>
          <template v-if="keyDriver">Project <span :class="isDark ? 'text-white' : 'text-[#000]'">{{ keyDriver }}</span> is a key driver.<br/></template>
          Boosting our overall portfolio profitability.
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Cost Center')

// ── Pull values from useDashboard() ───────────────────────────────────────
const { costCenter } = useDashboard()

const profitMargin = computed(() => costCenter.value?.profitMargin ?? 0)
const vsLastMonth   = computed(() => {
  const d = costCenter.value?.delta
  if (d === undefined || d === null) return ''
  return `${d >= 0 ? '+' : ''}${d}%`
})
const trend      = computed(() => (costCenter.value?.delta ?? 0) < 0 ? 'down' : 'up')
const keyDriver   = computed(() => costCenter.value?.keyDriver ?? '')

// Smooth wave path from the real year-over-year margin trend (0-100 normalized).
// Values map to the 120x60 viewBox: y=55 is the lowest month, y=8 is the highest.
const wavePath = computed(() => {
  const values: number[] = costCenter.value?.waveValues ?? []
  if (values.length < 2) return 'M 0 55 L 120 55'
  const stepX = 120 / (values.length - 1)
  const toY = (v: number) => 55 - (v / 100) * 47
  const pts = values.map((v, i) => ({ x: i * stepX, y: toY(v) }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const midX = (pts[i - 1].x + pts[i].x) / 2
    d += ` Q ${midX} ${pts[i - 1].y}, ${pts[i].x} ${pts[i].y}`
  }
  return d
})
</script>

<style scoped>
@keyframes sweep-right {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.animate-sweep-right {
  animation: sweep-right 1.2s ease-out forwards;
}
</style>
