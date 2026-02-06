<template>
  <div class="col-span-12 lg:col-span-5 bg-white rounded-[20px] p-5 shadow-sm flex flex-col h-[305px]">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <div 
        class="w-12 h-12 rounded-full grid place-items-center"
        style="background: linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)"
      >
        <img src="/images/icons/Indirect-Expense-black.svg" alt="Indirect Expense" class="w-6 h-6 object-contain" />
      </div>
      <div class="text-[20px] font-bold text-[#000]">Indirect Expense</div>
    </div>

    <!-- Chart Area -->
    <div class="flex-1 flex flex-col md:flex-row items-center justify-between gap-8">
       <!-- Custom SVG Irregular Pie Chart -->
       <div class="relative w-[200px] h-[200px] shrink-0 flex items-center justify-center">
          <!-- Subtle Background Circle for effect -->
          <div class="absolute inset-0 rounded-full bg-gray-50 opacity-50"></div>
          
          <svg viewBox="-110 -110 220 220" class="w-full h-full transform -rotate-110">
            <g v-for="(slice, index) in computedSlices" :key="index">
              <path 
                :d="slice.path" 
                :fill="slice.color"
              />
              <text 
                :x="slice.textPos.x" 
                :y="slice.textPos.y" 
                fill="white" 
                font-size="14" 
                font-weight="bold" 
                text-anchor="middle"
                class="transform rotate-110"
                style="transform-box: fill-box; transform-origin: center;"
              >
                {{ slice.value }}%
              </text>
            </g>
          </svg>
       </div>

       <!-- Custom Legend -->
       <div class="flex flex-col gap-3 justify-center">
          <div v-for="(label, index) in labels" :key="index" class="flex items-center gap-2">
             <span class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: colors[index] }"></span>
             <span class="text-[13px] font-medium text-gray-500">{{ label }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const labels = ['Rent & Utilities', 'Salaries & Wages', 'Marketing & Advertising', 'Office Supplies', 'Others'];
const series = [35, 30, 20, 10, 5];
const colors = ['#004D41', '#00966C', '#FFB100', '#D29600', '#FF7E5B'];
// Different radii for irregular look
const radii = [100, 96, 88, 80, 72];

const computedSlices = computed(() => {
  let currentAngle = 0;
  return series.map((value, index) => {
    const angle = (value / 100) * 360;
    const r = radii[index];
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
