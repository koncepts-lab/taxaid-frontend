<template>
  <NuxtLayout name="admin">
    <ClientOnly>
      <!-- Admin Header, reused globally -->
      <AdminHeader role="member" />
      
      <!-- Review Dashboard Content -->
      <ReviewDashboard />
      
      <template #fallback>
        <div class="p-20 text-center">Loading Dashboard...</div>
      </template>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ReviewDashboard from '~/components/admin/review/ReviewDashboard.vue'
</script>
