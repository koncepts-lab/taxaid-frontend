<template>
  <div
    class="w-full md:w-[500px] border border-[#04C18F33] hover:border-[#04C18F80] rounded-[20px] p-8 md:p-10 flex flex-col items-center transition-all duration-300 bg-[#FFFFFF] has-[button:hover]:bg-[#E6FFF3]"
  >
    <!-- Icon -->
    <div class="w-[72px] h-[72px] rounded-full bg-[#DCFCE7] flex items-center justify-center mb-6">
      <img :src="icon" :alt="title" class="w-10 h-10" />
    </div>

    <!-- Texts -->
    <h2 class="text-[24px] font-regular text-[#0A0A0A] mb-3 text-center">{{ title }}</h2>
    <p class="text-[16px] text-[#00000080] text-center leading-[1.6] mb-8 px-2 flex-grow font-regular">
      {{ description }}
    </p>

    <!-- Button -->
    <button
      @click="$emit('click')"
      class="w-full h-[46px] bg-[#007C65] hover:bg-[#006552] text-white font-normal text-[14px] rounded-[8px] transition-all duration-300 active:scale-[0.98] cursor-pointer"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup>
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
