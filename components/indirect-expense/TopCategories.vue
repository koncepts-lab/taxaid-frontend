<template>
  <div class="w-full h-full rounded-[30px] p-6 lg:p-8 relative flex flex-col justify-between overflow-hidden min-h-[460px]"
    :style="{ background: 'linear-gradient(90.74deg, #008C68 9.63%, #007053 50.16%, #00523D 91.47%)' }">
    <!-- Header Area -->
    <div class="flex flex-row justify-between items-start flex-shrink-0 mb-4 px-1 gap-2">
      <div>
        <h2 class="text-[18px] lg:text-[22px] font-medium text-white">{{ currentLang === 'ar' ? 'أفضل 5 فئات للمصروفات غير المباشرة' : 'Top 5 Indirect Expense Categories' }}</h2>
        <p class="text-[13px] lg:text-[15px] font-normal mt-1 text-white/60">{{ valuesNote(unit === 'millions') }}</p>
      </div>
      <div class="flex items-center gap-3 lg:gap-4 shrink-0">
        <CommonUnitToggle :on-dark="true" storage-key="indirect_expense_top_categories_unit" />
        <img src="/images/icons/info-white.svg" alt="Info" class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
        <img src="/images/icons/expand-white.svg" alt="Expand" class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Loading Skeleton (Zero CLS) -->
    <div v-if="loading" class="flex-1 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-12 w-full animate-pulse py-4">
      <div class="w-[260px] h-[260px] xl:w-[320px] xl:h-[320px] rounded-full border-8 border-white/10 flex items-center justify-center flex-shrink-0">
        <div class="w-3/4 h-3/4 rounded-full bg-white/5"></div>
      </div>
      <div class="w-full xl:w-[45%] max-w-[360px] xl:max-w-[400px] py-6 px-6 rounded-[30px] bg-[#1A8065]/60 flex flex-col gap-4 shrink-0">
        <div v-for="c in 5" :key="'skel-top-' + c" class="flex items-center gap-3">
          <div class="w-3.5 h-3.5 rounded-full bg-white/20 shrink-0"></div>
          <div class="h-4 bg-white/20 rounded flex-1"></div>
          <div class="h-4 w-12 bg-white/20 rounded shrink-0"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center py-12">
      <p class="text-sm font-medium text-red-200">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!labels.length" class="flex-1 flex items-center justify-center py-12">
      <p class="text-sm font-medium text-white/60">{{ currentLang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available' }}</p>
    </div>

    <!-- Chart Area -->
    <div v-else class="flex-1 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-10 w-full py-2">
      <!-- Chart Container -->
      <div class="relative w-full xl:w-auto flex items-center justify-center shrink-0">
        <div class="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] xl:w-[320px] xl:h-[320px] relative z-10 flex items-center justify-center flex-shrink-0">
          <svg viewBox="-110 -110 220 220" class="w-full h-full transform -rotate-42 transition-all duration-700 ease-out" :style="{ opacity: animProgress / 100 }">
            <circle cx="0" cy="0" r="100" fill="#F7FBFD1A" />
            <path 
              v-for="(slice, index) in computedSlices" 
              :key="'path-' + index"
              :d="slice.path" 
              :fill="slice.color"
              class="transition-all duration-300 hover:opacity-80"
            />
            <g v-for="(slice, index) in computedSlices" :key="'label-' + index">
              <g v-if="animProgress > 50" :transform="`translate(${slice.textPos.x}, ${slice.textPos.y}) rotate(42)`">
                <text 
                  fill="white" 
                  font-size="9" 
                  font-weight="700" 
                  text-anchor="middle"
                  y="-2"
                >
                  {{ series[index] }}%
                </text>
                <text 
                  fill="white" 
                  font-size="6.5" 
                  font-weight="500" 
                  text-anchor="middle"
                  y="7"
                >
                  {{ formatShortValue(index) }}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
      
      <!-- Right Legend Box -->
      <div class="w-full xl:w-[45%] flex items-center justify-center">
        <div class="w-full max-w-[360px] xl:max-w-[400px] py-5 px-6 rounded-[28px] bg-[#1A8065] flex flex-col gap-3.5 shrink-0">
          <div v-for="(label, index) in labels" :key="index" 
            class="flex items-center justify-between gap-3 text-white">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-[13px] h-[13px] rounded-full flex-shrink-0" :style="{ backgroundColor: colors[index] }"></div>
              <span class="text-[13px] font-normal truncate" :title="currentLang === 'ar' ? labelsAr[index] : label">
                {{ currentLang === 'ar' ? labelsAr[index] : label }}
              </span>
            </div>
            <div class="text-[13px] font-medium tabular-nums shrink-0 text-white/95">
              <span>({{ series[index] }}%)</span>
              <span class="ms-2 font-semibold">{{ formatLegendValue(index) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
          :style="{ background: 'linear-gradient(90.74deg, #008C68 9.63%, #007053 50.16%, #00523D 91.47%)' }" 
          style="max-width: 1400px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-6 px-8 border-b border-white/10">
            <div>
              <h2 class="text-xl font-medium text-white">{{ currentLang === 'ar' ? 'أفضل 5 فئات للمصروفات غير المباشرة' : 'Top 5 Indirect Expense Categories' }}</h2>
              <p class="text-sm font-normal mt-1 text-white/60">{{ valuesNote(unit === 'millions') }}</p>
            </div>
            <div class="flex items-center gap-4">
              <CommonUnitToggle :on-dark="true" storage-key="indirect_expense_top_categories_unit" />
              <button @click="isModalOpen = false" class="p-2.5 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-6 h-6 invert" :class="currentLang === 'ar' ? 'scale-x-[-1]' : ''" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="flex-1 w-full p-8 overflow-auto flex flex-col lg:flex-row items-center justify-center gap-10">
            <div class="w-[320px] h-[320px] relative z-10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="-110 -110 220 220" class="w-full h-full transform -rotate-42 transition-all duration-700 ease-out" :style="{ opacity: animProgress / 100 }">
                <circle cx="0" cy="0" r="100" fill="#F7FBFD1A" />
                <path 
                  v-for="(slice, index) in computedSlices" 
                  :key="'modal-path-' + index"
                  :d="slice.path" 
                  :fill="slice.color"
                  class="transition-all duration-300 hover:opacity-80"
                />
                <g v-for="(slice, index) in computedSlices" :key="'modal-label-' + index">
                  <g v-if="animProgress > 50" :transform="`translate(${slice.textPos.x}, ${slice.textPos.y}) rotate(42)`">
                    <text 
                      fill="white" 
                      font-size="9" 
                      font-weight="700" 
                      text-anchor="middle"
                      y="-2"
                    >
                      {{ series[index] }}%
                    </text>
                    <text 
                      fill="white" 
                      font-size="6.5" 
                      font-weight="500" 
                      text-anchor="middle"
                      y="7"
                    >
                      {{ formatShortValue(index) }}
                    </text>
                  </g>
                </g>
              </svg>
            </div>
            
            <div class="w-full max-w-[500px] p-8 rounded-[35px] bg-[#1A8065] flex flex-col gap-5">
              <div v-for="(label, index) in labels" :key="'modal-'+index" 
                class="flex items-center justify-between gap-4 text-white">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-[14px] h-[14px] rounded-full flex-shrink-0" :style="{ backgroundColor: colors[index] }"></div>
                  <span class="text-[14px] font-normal truncate">{{ currentLang === 'ar' ? labelsAr[index] : label }}</span>
                </div>
                <div class="text-[14px] font-medium tabular-nums shrink-0 text-white/95">
                  <span>({{ series[index] }}%)</span>
                  <span class="ms-2 font-semibold">{{ formatLegendValue(index) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { formatToMillions, formatStandardNumber } from '~/utils/formatters'
import { useCurrency } from '~/composables/common/useCurrency'
import { useChartHelper } from '~/composables/common/useChartHelper'

const currentLang = useState('currentLang', () => 'en')
const { valuesNote } = useCurrency()
const { unit } = useChartHelper('indirect_expense_top_categories_unit')

const isModalOpen = ref(false)

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Object],
    default: null
  }
})

const labels = computed(() => props.data?.categories || [])
const labelsAr = computed(() => props.data?.categories || [])
const series = computed(() => props.data?.percentages || [])
const rawCurrentYear = computed(() => props.data?.current_year || [])

const formatShortValue = (index: number) => {
  const raw = rawCurrentYear.value[index] ?? 0
  if (unit.value === 'millions') {
    return `${formatToMillions(raw, 2)}M`
  }
  return formatStandardNumber(raw, 0)
}

const formatLegendValue = (index: number) => {
  const raw = rawCurrentYear.value[index] ?? 0
  if (unit.value === 'millions') {
    return `${formatToMillions(raw, 2)}M`
  }
  return formatStandardNumber(raw, 2)
}

const colors = ['#004D41', '#00966C', '#FFB100', '#D29600', '#FF7E5B']
const radii = [100, 96, 88, 80, 72]

const animProgress = ref(0)

onMounted(() => {
  let startTimestamp: number | null = null
  const duration = 1200
  const animate = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = timestamp - startTimestamp
    animProgress.value = Math.min(100, (progress / duration) * 100)
    if (progress < duration) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
})

const computedSlices = computed(() => {
  let currentAngle = 90
  return series.value.map((val: number, index: number) => {
    const value = val * (animProgress.value / 100)
    const angle = (value / 100) * 360
    const r = radii[index] || 100
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    const x1 = r * Math.cos(startRad)
    const y1 = r * Math.sin(startRad)
    const x2 = r * Math.cos(endRad)
    const y2 = r * Math.sin(endRad)
    
    const largeArc = angle > 180 ? 1 : 0
    const path = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    
    const textAngle = startAngle + angle / 2
    const textRad = (textAngle * Math.PI) / 180
    const tr = r * 0.72
    const textPos = {
      x: tr * Math.cos(textRad),
      y: tr * Math.sin(textRad)
    }
    
    currentAngle += angle
    return { path, textPos, color: colors[index], value }
  })
})
</script>

<style scoped>
path {
  transition: d 0.3s ease;
}
</style>
