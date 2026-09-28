<template>
  <NuxtLayout name="admin">
    <div class="p-4 md:p-8 max-w-[100vw] overflow-x-hidden">
      <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
        <button @click="goBack"
          class="inline-flex items-center gap-2 pl-4 pr-6 py-2 rounded-full border text-[14px] font-medium transition-all"
          :class="isDark ? 'bg-[#057759]/60 border-white/10 text-white hover:bg-[#057759]' : 'bg-[#00896F] border-[#00896F] text-white hover:bg-[#00705a]'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
        </button>

        <div class="flex items-center gap-2">
          <CommonDateField v-model="selectedDate" size="sm" />
          <button v-if="selectedDate !== today" @click="selectedDate = today; load()"
            class="text-[13px] underline" :class="isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'">
            {{ currentLang === 'ar' ? 'اليوم' : 'Today' }}
          </button>
        </div>
      </div>

      <CommonNotificationsList
        :groups="notificationGroups"
        :tabs="tabs"
        :active-tab="activeTab"
        :loading="loading"
        @update:active-tab="onTabChange"
        @item-click="onItemClick"
        @mark-all-read="onMarkAllRead"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { fetchNotifications, markRead, markAllRead, toGroups } = useNotifications()
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

const today = new Date().toISOString().slice(0, 10)
const selectedDate = ref(today)

async function load() {
  loading.value = true
  try {
    const res = await fetchNotifications({ mode: 'page', per_page: 50, date: selectedDate.value })
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

async function onItemClick(item) {
  if (typeof item.id !== 'number' || !item.unread) return
  item.unread = false
  try {
    await markRead(item.id)
  } catch {
    item.unread = true
  }
}

async function onMarkAllRead() {
  const changed = notificationGroups.value.flatMap(g => g.items).filter(i => i.unread)
  changed.forEach(i => { i.unread = false })
  try {
    await markAllRead()
  } catch {
    changed.forEach(i => { i.unread = true })
  }
}

watch(selectedDate, load)
onMounted(load)
</script>
