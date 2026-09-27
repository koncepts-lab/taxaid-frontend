<template>
  <div>
    <template v-if="loading">
      <div class="h-9 w-72 rounded animate-pulse mb-10" :class="skeletonClass"></div>

      <div v-for="group in 4" :key="group" class="mb-10">
        <div class="h-6 w-48 rounded animate-pulse mb-4" :class="skeletonClass"></div>
        <div v-for="n in 5" :key="n" class="h-4 rounded animate-pulse mb-3"
          :class="[skeletonClass, n === 5 ? 'w-1/2' : n === 4 ? 'w-5/6' : 'w-full']"></div>
      </div>
    </template>

    <p v-else-if="error" class="text-sm" :class="dark ? 'text-white/60' : 'text-gray-500'">
      {{ currentLang === 'ar' ? 'تعذر تحميل هذه الصفحة. حاول مرة أخرى لاحقًا.' : 'Could not load this page. Please try again later.' }}
    </p>

    <div v-else class="legal-content" :class="dark ? 'text-white/90' : 'text-[#1A1A1A]'" v-html="html"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  html: { type: String, default: '' },
  dark: { type: Boolean, default: false },
})

const skeletonClass = computed(() => (props.dark ? 'bg-white/10' : 'bg-gray-200'))
const currentLang = useState('currentLang', () => 'en')
</script>

<style scoped>
.legal-content :deep(h1) {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.legal-content :deep(h2) {
  font-size: clamp(1.15rem, 3vw, 1.5rem);
  font-weight: 600;
  color: #00896F;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.legal-content :deep(p) {
  line-height: 1.75;
  margin-bottom: 1rem;
}

.legal-content :deep(ul) {
  list-style-type: disc;
  padding-inline-start: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content :deep(li) {
  margin-bottom: 0.5rem;
}

.legal-content :deep(a) {
  color: #00896F;
  text-decoration: underline;
}
</style>
