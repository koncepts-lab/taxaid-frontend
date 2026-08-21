<template>
  <div class="rounded-[20px] p-4 flex flex-col justify-between h-[290px] relative overflow-hidden group cursor-pointer transition-all duration-300 gap-1 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'COGS'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div 
          class="w-12 h-12 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/C.O.G.S-black.svg" alt="C.O.G.S" class="w-5 h-5 object-contain" />
        </div>
        <div class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'تكلفة البضائع المباعة' : 'C.O.G.S' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>

    <div class="flex justify-between items-start z-10">
      <!-- Left Content -->
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'نسبة تكلفة البضائع المباعة إلى الإيرادات' : 'COGS to Revenue Ratio' }}</div>
        <div class="text-[40px] font-semibold leading-tight transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">{{ cogsRatio }}</div>
        <div v-if="vsLastMonth" class="flex items-center gap-1 font-medium text-[14px] mt-1" :class="trend === 'up' ? 'text-[#E5484D]' : 'text-[#05B743]'">
          <span><img :src="trend === 'up' ? '/images/icons/up.svg' : '/images/icons/down-right.svg'" alt="trend" class="w-4 h-4 object-contain" /></span>
          <span class="text-[12px] font-Regular transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ vsLastMonth }} {{ currentLang === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month' }}</span>
        </div>
      </div>


      <!-- Right Graph Area -->
      <div 
        class="absolute top-[70px] w-[140px] h-[100px] animate-sweep-right"
        :class="currentLang === 'ar' ? 'left-[15px]' : 'right-[15px]'"
      >
         <svg class="w-full h-full" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <linearGradient id="cogsWaveGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="#00B794" stop-opacity="0.3"/>
                 <stop offset="100%" stop-color="#00B794" stop-opacity="0"/>
               </linearGradient>
             </defs>

             <!-- Smooth wave path with fill — real 6-month COGS-to-revenue ratio trend -->
             <path :d="wavePath.fill" fill="url(#cogsWaveGradient)" />

             <!-- Wave stroke line -->
             <path :d="wavePath.line" stroke="#00B794" stroke-width="3" stroke-linecap="round" fill="none" />

             <!-- Marker circle at the highest point in the trend -->
             <circle v-if="wavePath.peak" :cx="wavePath.peak.x" :cy="wavePath.peak.y" r="5" fill="white" stroke="#00B794" stroke-width="3" />
         </svg>
      </div>
    </div>

    <div class="text-[12px] leading-snug transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">
      {{ footerText.split('\n')[0] }}<br>
      {{ footerText.split('\n')[1] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'COGS')

// ── Pull values from useDashboard() ───────────────────────────────────────
const { cogs, cogsTrend } = useDashboard()

const cogsRatio   = computed(() => cogs.value?.cogsToRevenueRatio ?? '0%')
const vsLastMonth = computed(() => cogs.value?.vsLastMonth ?? '')
const trend       = computed(() => (cogs.value?.delta ?? 0) < 0 ? 'down' : 'up')
const footerText  = computed(() => currentLang.value === 'ar'
  ? (cogs.value?.footerTextAr ?? 'تم تحقيق كفاءة تشغيلية أكبر.\nوالآن يتم فتح هوامش ربح أعلى.')
  : (cogs.value?.footerText   ?? 'Achieved greater operational efficiency.\nNow unlocking higher profit margins.')
)

// Real 6-month COGS-to-revenue ratio trend, drawn as a smooth wave (quadratic
// curve through each pair's midpoint — simple, no charting library needed).
const wavePath = computed(() => {
  const values = cogsTrend.value
  if (!values || values.length < 2) return { line: '', fill: '', peak: null }

  const width = 140, height = 100, topPad = 15, bottomPad = 25
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  const points = values.map((v: number, i: number) => ({
    x: (i / (values.length - 1)) * width,
    // Flat series (range 0) renders as a flat mid-height line, not a divide-by-zero.
    y: range > 0
      ? height - bottomPad - ((v - min) / range) * (height - topPad - bottomPad)
      : height / 2,
  }))

  let line = `M ${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const xc = (points[i - 1].x + points[i].x) / 2
    const yc = (points[i - 1].y + points[i].y) / 2
    line += ` Q ${points[i - 1].x},${points[i - 1].y} ${xc},${yc}`
  }
  const last = points[points.length - 1]
  line += ` L ${last.x},${last.y}`

  const fill = `${line} L ${last.x},${height} L ${points[0].x},${height} Z`

  const peakIdx = values.indexOf(max)
  return { line, fill, peak: points[peakIdx] }
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
