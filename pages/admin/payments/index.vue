<template>
  <NuxtLayout name="admin">
    <div class="p-4 md:p-8 space-y-12 max-w-[100vw] overflow-x-hidden">
      <div>
        <h1 class="text-2xl font-medium text-[#013E32]">Subscription Management</h1>
        <p class="text-gray-500 mt-1">Manage plans, entitlements, and monitor subscriptions & payments</p>
      </div>
      <AdminPaymentsAdmin />
    </div>
  </NuxtLayout>
</template>

<script setup>
</script>
