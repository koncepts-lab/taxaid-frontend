<template>
  <NuxtLayout name="admin">
    <div class="p-4 md:p-8 max-w-[100vw] overflow-x-hidden">
      <button @click="goBack" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back
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
