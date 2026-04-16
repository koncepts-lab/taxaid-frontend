<template>
  <div
    class="w-full md:w-[500px] border rounded-[20px] p-8 md:p-10 flex flex-col items-center transition-all duration-300"
    :class="isDark ? 'bg-[#00141080] border-white/20 hover:border-white/40 shadow-lg backdrop-blur-sm' : 'bg-[#FFFFFF] border-[#04C18F33] hover:border-[#04C18F80] has-[button:hover]:bg-[#E6FFF3]'">
    <!-- Icon -->
    <div class="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-6"
      :class="isDark ? 'bg-[#00b988]/20' : 'bg-[#DCFCE7]'">
      <img :src="icon" :alt="title" class="w-10 h-10" />
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
      class="w-full h-[46px] bg-[#007C65] hover:bg-[#006552] text-white font-normal text-sm rounded-lg transition-all duration-300 active:scale-[0.98] cursor-pointer">
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup>
const { isDark } = useTheme()

defineProps({
  icon: {
    type: String,
    required: true
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
  }
})

defineEmits(['click'])
</script>