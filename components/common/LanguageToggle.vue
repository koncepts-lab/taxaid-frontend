<template>
  <button 
    class="relative w-[80px] h-[31px] rounded-full bg-[#EFEFEF] shadow-[inset_0px_-4px_4px_0px_rgba(203,255,243,0.05)] border border-white/10 p-[3px] cursor-pointer transition-all hover:brightness-95 flex items-center" 
    @click="toggle"
  >
    <!-- Track Text: EN (Visible when AR is active / Thumb Right) -->
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#BCBCBC] font-medium transition-opacity duration-300"
          :class="modelValue === 'ar' ? 'opacity-100' : 'opacity-0'">EN</span>

    <!-- Track Text: AR (Visible when EN is active / Thumb Left) -->
    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#BCBCBC] font-medium transition-opacity duration-300"
          :class="modelValue === 'en' ? 'opacity-100' : 'opacity-0'">AR</span>

    <!-- Thumb -->
    <div 
      class="absolute top-[-6px] left-[-4px] w-[40px] h-[40px] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
      :style="{ background: 'linear-gradient(180deg, #057255 0%, #04C18F 100%)' }"
      :class="modelValue === 'ar' ? 'translate-x-[48px]' : 'translate-x-0'"
    >
      <!-- Arabic Icon (Shown when EN/Left) -->
      <img src="/images/arbic-icon.svg" class="absolute w-[13px] h-[22px] object-contain transition-all duration-300 transform"
           :class="modelValue === 'en' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'" alt="EN" />
           
      <!-- English Icon (Shown when AR/Right) -->
      <img src="/images/english-icon.svg" class="absolute w-[14px] h-[18px] object-contain transition-all duration-300 transform"
           :class="modelValue === 'ar' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'" alt="AR" />
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'en'
  }
})

const emit = defineEmits(['update:modelValue', 'toggle'])

function toggle() {
  const newValue = props.modelValue === 'en' ? 'ar' : 'en'
  emit('update:modelValue', newValue)
  emit('toggle', newValue)
}
</script>
