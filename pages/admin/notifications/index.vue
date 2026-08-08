<template>
  <NuxtLayout name="admin">
    <div class="p-4 md:p-8 max-w-[100vw] overflow-x-hidden">
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
