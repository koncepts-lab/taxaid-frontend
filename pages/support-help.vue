<template>
  <div class="min-h-screen" :class="isDark ? 'bg-[#00141080]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="sticky top-0 z-20 border-b" :class="isDark ? 'border-white/10 bg-[#00141080]' : 'border-gray-100 bg-white'">
      <div class="max-w-[1100px] mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <NuxtLink to="/home">
          <img :src="isDark ? '/images/logo-white.png' : '/images/logo.png'" alt="TaxAid" class="h-9 w-auto" />
        </NuxtLink>
        <button @click="goBack" class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style="background-color: #00896F; color: #fff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
        </button>
      </div>
    </div>

    <div class="max-w-[1100px] mx-auto px-4 lg:px-8 py-8 lg:py-12">

      <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
        <nav class="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible shrink-0 md:w-[220px] no-scrollbar md:sticky md:top-[88px] md:self-start">
          <button v-for="t in tabs" :key="t.key" @click="activeKey = t.key"
            class="text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0"
            :class="activeKey === t.key
              ? 'bg-[#00896F] text-white'
              : (isDark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100')">
            {{ currentLang === 'ar' ? t.labelAr : t.label }}
          </button>
        </nav>

        <div class="flex-1 min-w-0">
          <CommonLegalBody :loading="state.loading" :error="state.error" :html="state.html" :dark="isDark" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const router = useRouter()

const tabs = [
  { key: 'terms', label: 'Terms and Conditions', labelAr: 'الشروط والأحكام' },
  { key: 'privacy', label: 'Privacy', labelAr: 'الخصوصية' },
  { key: 'data-collection', label: 'Data We Collect', labelAr: 'البيانات التي نجمعها' },
  { key: 'account-info', label: 'Account Information We Take', labelAr: 'معلومات الحساب' },
  { key: 'account-deletion-policy', label: 'Account Deletion', labelAr: 'حذف الحساب' },
  { key: 'contact-us', label: 'Contact Us', labelAr: 'اتصل بنا' },
]

useHead({ title: 'Support & Help' })

const route = useRoute()
const tabParam = tabs.find((t) => t.key === route.query.tab)?.key
const activeKey = ref(tabParam ?? tabs[0].key)

// Cached per key so switching tabs never refetches — only a fresh page load does.
const cache = reactive({})

const state = computed(() => cache[activeKey.value] ?? { loading: true, error: false, html: '' })

const load = async (key) => {
  if (cache[key]) return
  cache[key] = { loading: true, error: false, html: '' }
  try {
    const res = await useApi(`/public/cms/${key}`)
    const html = Object.values(res?.blocks ?? {})[0] ?? ''
    cache[key] = { loading: false, error: !html, html }
  } catch {
    cache[key] = { loading: false, error: true, html: '' }
  }
}

watch(activeKey, (key) => {
  load(key)
  router.replace({ query: { ...route.query, tab: key } })
}, { immediate: true })

const goBack = () => {
  if (window.history.length > 1) router.back()
  else navigateTo('/home')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
