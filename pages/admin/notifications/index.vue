<template>
  <NuxtLayout name="admin">
    <div class="p-4 md:p-8 max-w-[100vw] overflow-x-hidden">
      <button @click="goBack"
        class="inline-flex items-center gap-2 pl-4 pr-6 py-2 rounded-full border text-[14px] font-medium transition-all mb-4"
        :class="isDark ? 'bg-[#057759]/60 border-white/10 text-white hover:bg-[#057759]' : 'bg-[#00896F] border-[#00896F] text-white hover:bg-[#00705a]'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
      </button>
      <CommonNotificationsList
        :groups="notificationGroups"
        :tabs="tabs"
        :active-tab="activeTab"
        :loading="loading"
        @update:active-tab="onTabChange"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { fetchNotifications, toGroups } = useNotifications()
const router = useRouter()

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/admin')
  }
}

const loading = ref(false)
const notificationGroups = ref([])
const activeTab = ref('All')
const tabs = ref([
  { name: 'All', count: 0 },
  { name: 'Ticket', count: 0 },
  { name: 'Default', count: 0 },
])

async function load() {
  loading.value = true
  try {
    const res = await fetchNotifications({ mode: 'page', per_page: 50 })
    const items = res?.data ?? []
    notificationGroups.value = toGroups(items)

    const ticketCount = items.filter(i => i.category === 'ticket').length
    const defaultCount = items.filter(i => i.category === 'default').length
    tabs.value = [
      { name: 'All', count: items.length },
      { name: 'Ticket', count: ticketCount },
      { name: 'Default', count: defaultCount },
    ]
  } finally {
    loading.value = false
  }
}

function onTabChange(name) {
  activeTab.value = name
}

onMounted(load)
</script>
