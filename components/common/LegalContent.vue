<template>
  <NuxtLayout name="dashboard">
    <div class="max-w-[960px] px-4 lg:px-8 py-8">
      <CommonLegalBody :loading="loading" :error="error" :html="html" :dark="isDark" />
    </div>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  cmsKey: { type: String, required: true },
})

const { isDark } = useTheme()

const loading = ref(true)
const error = ref(false)
const html = ref('')
const seo = ref(null)

useSeoMeta({
  title: () => seo.value?.meta?.title,
  description: () => seo.value?.meta?.description,
  ogTitle: () => seo.value?.og?.title,
  ogDescription: () => seo.value?.og?.description,
  twitterCard: 'summary_large_image',
})

onMounted(async () => {
  try {
    const res = await useApi(`/public/cms/${props.cmsKey}`)
    html.value = Object.values(res?.blocks ?? {})[0] ?? ''
    seo.value = res?.seo ?? null
    if (!html.value) error.value = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
