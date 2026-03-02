<template>
  <div class="rounded-[20px] p-5 shadow-sm flex flex-col h-[280px] group cursor-pointer hover:shadow-[0_0_10px_#00B794] transition-all duration-300"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4"> 
      <div class="flex items-center gap-3">
        <div 
          class="w-12 h-12 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Indirect-Expense-black.svg" alt="Indirect Expense" class="w-6 h-6 object-contain" />
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'المصاريف غير المباشرة' : 'Indirect Expense' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] opacity-0 group-hover:opacity-100 transition-all duration-300"
      />
    </div>

    <!-- Chart Area -->
    <div class="flex-1 flex flex-col md:flex-row items-center justify-between gap-1">
       <!-- Custom SVG Irregular Pie Chart -->
       <div class="relative w-full max-w-[35%] shrink-0 flex items-center justify-center">
          <!-- Subtle Background Circle for effect -->
          <div class="absolute inset-0 rounded-full opacity-50" :class="isDark ? 'bg-[#005B48]' : 'bg-gray-50'"></div>
          
          <svg viewBox="-110 -110 220 220" class="w-full h-full transform -rotate-42 transition-all duration-700 ease-out" :style="{ opacity: animProgress / 100 }">
            <g v-for="(slice, index) in computedSlices" :key="index">
              <path 
                :d="slice.path" 
                :fill="slice.color"
                class="transition-all duration-300"
              />
              <text 
                v-if="animProgress > 50"
                :x="slice.textPos.x" 
                :y="slice.textPos.y" 
                fill="white" 
                font-size="12" 
                font-weight="500" 
                text-anchor="middle"
                class="transform rotate-42"
                style="transform-box: fill-box; transform-origin: center;"
              >
                {{ slice.value }}%
              </text>
            </g>
          </svg>
       </div>

       <!-- Custom Legend -->
       <div class="flex flex-col gap-1 justify-center w-full max-w-[50%]">
          <div v-for="(label, index) in labels" :key="index" class="flex items-center gap-2">
             <span class="w-[10px] h-[10px] rounded-full shrink-0" :style="{ backgroundColor: colors[index] }"></span>
             <span class="text-[14px] font-normal transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? labelsAr[index] : label }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const labels = ['Rent & Utilities', 'Salaries & Wages', 'Marketing & Advertising', 'Office Supplies', 'Others'];
const labelsAr = ['الإيجار والمرافق', 'الرواتب والأجور', 'التسويق والإعلان', 'اللوازم المكتبية', 'أخرى'];
const series = [35, 30, 20, 10, 5];
const colors = ['#004D41', '#00966C', '#FFB100', '#D29600', '#FF7E5B'];

const animProgress = ref(0);

onMounted(() => {
  let startTimestamp: number | null = null;
  const duration = 1500;
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
// Different radii for irregular look
const radii = [100, 96, 88, 80, 72];

const computedSlices = computed(() => {
  let currentAngle = 90; // Start at top (90 degrees)
  return series.map((val, index) => {
    const value = val * (animProgress.value / 100);
    const angle = (value / 100) * 360;
    const r = radii[index] || 100;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Path calculation
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = r * Math.cos(startRad);
    const y1 = r * Math.sin(startRad);
    const x2 = r * Math.cos(endRad);
    const y2 = r * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    // Text position (centered in slice)
    const textAngle = startAngle + angle / 2;
    const textRad = (textAngle * Math.PI) / 180;
    const tr = r * 0.65;
    const textPos = {
      x: tr * Math.cos(textRad),
      y: tr * Math.sin(textRad)
    };
    
    currentAngle += angle;
    return { path, textPos, color: colors[index], value };
  });
});
</script>
