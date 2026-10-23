<template>
  <NuxtLayout name="admin">
    <CommonAccountSettingsPanel
      :controller="controller"
      :currentName="admin?.full_name ?? ''"
      fallbackRoute="/admin"
      @profile-updated="updateFullName"
    />
  </NuxtLayout>
</template>

<script setup>
const { admin, updateFullName } = useAdminAuth()
const controller = useAdminAccountSettings()
</script>
