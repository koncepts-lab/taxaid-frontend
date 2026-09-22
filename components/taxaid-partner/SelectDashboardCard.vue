<template>
  <div
    class="w-full md:w-[500px] border rounded-[20px] p-8 md:p-10 flex flex-col items-center transition-all duration-300"
    :class="[
      variant === 'red'
        ? (isDark ? 'bg-[#18040680] border-red-500/30 hover:border-red-500/60 shadow-lg shadow-red-950/40 backdrop-blur-sm' : 'bg-[#FFFFFF] border-[#EF444433] hover:border-[#EF444480] has-[button:hover]:bg-[#FFF1F2]')
        : (isDark ? 'bg-[#00141080] border-white/20 hover:border-white/40 shadow-lg backdrop-blur-sm' : 'bg-[#FFFFFF] border-[#04C18F33] hover:border-[#04C18F80] has-[button:hover]:bg-[#E6FFF3]')
    ]">
    <!-- Icon -->
    <div class="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-6"
      :class="[
        variant === 'red'
          ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-[#FEE2E2] text-red-600')
          : (isDark ? 'bg-[#00b988]/20' : 'bg-[#DCFCE7]')
      ]">
      <svg v-if="icon === 'root' || variant === 'red'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <img v-else-if="icon && (icon.endsWith('.svg') || icon.endsWith('.png'))" :src="icon" :alt="title" class="w-10 h-10" />
      <svg v-else class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <!-- Texts -->
    <h2 class="text-[24px] font-regular mb-2 text-center" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">{{ title }}
    </h2>
    <p class="text-[16px] text-center leading-[1.6] mb-8 px-2 flex-grow font-regular"
      :class="isDark ? 'text-white/70' : 'text-[#00000080]'">
      {{ description }}
    </p>

    <!-- Button -->
    <button @click="$emit('click')"
      class="w-full h-[46px] text-white font-normal text-sm rounded-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
      :class="variant === 'red' ? 'bg-[#DC2626] hover:bg-[#B91C1C]' : 'bg-[#007C65] hover:bg-[#006552]'">
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup>
const { isDark } = useTheme()

defineProps({
  icon: {
    type: String,
    required: false,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  buttonLabel: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'green'
  }
})

defineEmits(['click'])
</script>