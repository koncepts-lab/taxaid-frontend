<template>
  <NuxtLayout name="partner">
    <CommonAccountSettingsPanel
      :controller="controller"
      :currentName="user?.name ?? ''"
      fallbackRoute="/taxaid-partner/dashboard"
      @profile-updated="updateName"
    />
  </NuxtLayout>
</template>

<script setup>
const { user, updateName } = useRevenueAuth()
const controller = usePartnerAccountSettings()
</script>
