<template>
  <div class="w-full h-full rounded-[30px] p-8 relative flex flex-col overflow-hidden"
    :style="{ background: 'linear-gradient(90.74deg, #008C68 9.63%, #007053 50.16%, #00523D 91.47%)' }">
    <!-- Header Area -->
    <div class="flex justify-between items-start flex-shrink-0 mb-4 px-2">
      <div>
        <h2 class="text-[22px] font-medium text-white">{{ currentLang === 'ar' ? 'أفضل 5 فئات للمصروفات غير المباشرة' : 'Top 5 Indirect Expense Categories' }}</h2>
        <p class="text-[16px] font-normal mt-1 text-white/60">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
      </div>
      <div class="flex items-center gap-3">
        <img src="/images/icons/info-white.svg" alt="Info" class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
        <img src="/images/icons/expand-white.svg" alt="Expand" class="w-6 h-6 cursor-pointer hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <!-- Chart Area -->
    <div class="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4">
      <!-- Chart Container -->
      <div class="relative w-auto flex items-center justify-center">
        <!-- Background decorative circles -->

        
        <div class="w-[380px] h-[380px] relative z-10 flex items-center justify-center flex-shrink-0">
          <svg viewBox="-110 -110 220 220" class="w-full h-full transform -rotate-42 transition-all duration-700 ease-out" :style="{ opacity: animProgress / 100 }">
            <circle cx="0" cy="0" r="100" fill="#F7FBFD1A" />
            <g v-for="(slice, index) in computedSlices" :key="index">
              <path 
                :d="slice.path" 
                :fill="slice.color"
                class="transition-all duration-300 hover:opacity-80"
              />
              <g v-if="animProgress > 50" :transform="`translate(${slice.textPos.x}, ${slice.textPos.y}) rotate(42)`">
                <text 
                  fill="white" 
                  font-size="10" 
                  font-weight="700" 
                  text-anchor="middle"
                  y="-2"
                >
                  {{ series[index] }}%
                </text>
                <text 
                  fill="white" 
                  font-size="7" 
                  font-weight="400" 
                  text-anchor="middle"
                  y="8"
                >
                  {{ values[index] }}M
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
      
      <!-- Right Legend Box -->
      <div class="w-full lg:w-[45%] h-full flex items-center">
        <div class="w-full max-w-[320px] py-8 px-8 rounded-[35px] bg-[#1A8065] flex flex-col gap-6">
          <div v-for="(label, index) in labels" :key="index" 
            class="flex items-center gap-4">
            <div class="w-[15px] h-[15px] rounded-full flex-shrink-0" :style="{ backgroundColor: colors[index] }"></div>
            <span class="text-white text-[14px] font-normal tracking-[0.5px]">{{ currentLang === 'ar' ? labelsAr[index] : label }} ({{ series[index] }}%)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full h-[65vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
          :style="{ background: 'linear-gradient(90.74deg, #008C68 9.63%, #007053 50.16%, #00523D 91.47%)' }" 
          style="max-width: 1500px; margin: 0 15px;">
          <!-- Modal Header -->
          <div class="flex justify-between items-center py-8 px-10 border-b border-white/10">
            <div class="flex flex-col">
              <h2 class="text-2xl font-medium text-white">{{ currentLang === 'ar' ? 'أفضل 5 فئات للمصروفات غير المباشرة' : 'Top 5 Indirect Expense Categories' }}</h2>
              <p class="text-lg font-normal mt-1 text-white/60">{{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}</p>
            </div>
            <div class="flex items-center gap-4">
              <img src="/images/icons/info-white.svg" alt="Info" class="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
              <button @click="isModalOpen = false" class="p-3 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <img src="/images/icons/expand.svg" alt="Close Modal" class="w-6 h-6 invert" :class="[currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="flex-1 w-full p-12 flex items-center justify-center gap-12">
            <div class="w-[380px] h-[380px] relative z-10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="-110 -110 220 220" class="w-full h-full transform -rotate-42 transition-all duration-700 ease-out" :style="{ opacity: animProgress / 100 }">
                    <circle cx="0" cy="0" r="100" fill="#F7FBFD1A" />
                    <g v-for="(slice, index) in computedSlices" :key="'modal-'+index">
                    <path 
                        :d="slice.path" 
                        :fill="slice.color"
                        class="transition-all duration-300 hover:opacity-80"
                    />
                    <g v-if="animProgress > 50" :transform="`translate(${slice.textPos.x}, ${slice.textPos.y}) rotate(42)`">
                        <text 
                          fill="white" 
                          font-size="10" 
                          font-weight="700" 
                          text-anchor="middle"
                          y="-2"
                        >
                          {{ series[index] }}%
                        </text>
                        <text 
                          fill="white" 
                          font-size="7" 
                          font-weight="400" 
                          text-anchor="middle"
                          y="8"
                        >
                          {{ values[index] }}M
                        </text>
                    </g>
                    </g>
                </svg>
            </div>
            
            <div class="w-full max-w-[600px] p-12 rounded-[50px] bg-[#1A8065] flex flex-col gap-8">
              <div v-for="(label, index) in labels" :key="'modal-'+index" 
                class="flex items-center gap-4">
                <div class="w-[15px] h-[15px] rounded-full flex-shrink-0" :style="{ backgroundColor: colors[index] }"></div>
                <span class="text-white text-[14px] font-normal tracking-[0.5px]">{{ currentLang === 'ar' ? labelsAr[index] : label }} ({{ series[index] }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const isModalOpen = ref(false)

const labels = ['Rent & Utilities', 'Salaries & Wages', 'Marketing & Advertising', 'Office Supplies', 'Others'];
const labelsAr = ['الإيجار والمرافق', 'الرواتب والأجور', 'التسويق والإعلان', 'اللوازم المكتبية', 'أخرى'];
const series = [35, 30, 20, 10, 5];
const values = ['0.61', '0.42', '0.28', '0.19', '0.05'];
const colors = ['#004D41', '#00966C', '#FFB100', '#D29600', '#FF7E5B'];
const radii = [100, 96, 88, 80, 72];

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

const computedSlices = computed(() => {
  let currentAngle = 90; // Match dashboard start angle
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

<style scoped>
path {
  transition: d 0.3s ease;
}
</style>
