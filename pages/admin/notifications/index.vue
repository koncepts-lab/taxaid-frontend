<template>
  <NuxtLayout name="admin">
    <div class="p-4 md:p-8 max-w-[100vw] overflow-x-hidden">
      <CommonNotificationsList :groups="notificationGroups" :loading="loading" />
    </div>
  </NuxtLayout>
</template>

<script setup>
// TODO: NEED Alerts — no generic admin notifications API exists yet (Payments Admin has its own
// real Alerts tab under /admin/payments; this page is the shared landing for every other admin
// role until each gets real backend data). Currently always empty, not mock — nothing to show yet.
import { ref } from 'vue'

const loading = ref(false)
const notificationGroups = ref([])
</script>
