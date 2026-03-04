<template>
  <div v-if="mounted" class="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans transition-colors duration-300"
    :class="{ 'dark-mode-bg': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- SIDEBAR -->
    <CommonSidebar />
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <ParticleBackground />
      <CommonHeader />

      <main class="flex-1 overflow-x-hidden overflow-y-auto lg:pt-0 transition-all duration-300 relative" :class="[
        currentLang === 'ar' ? 'lg:mr-[90px] lg:ml-0' : 'lg:ml-[90px] lg:mr-0',
        isDark ? 'bg-transparent' : 'bg-[#F3F4F6]'
      ]">
        <div class="relative z-10 px-[15px] min-h-[calc(100vh-64px)] flex flex-col">
          <div class="flex-1">
            <slot />
          </div>
          <CommonFooter />
        </div>
      </main>
    </div>
  </div>
  <div v-else class="flex h-screen bg-[#F3F4F6] items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B794] mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import ParticleBackground from '~/components/common/ParticleBackground.vue'

const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>
