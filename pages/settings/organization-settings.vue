<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20">

      <div class="mb-8">
        <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]">Company Settings</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">
          Org-wide configuration for this account, managed by its owner or master user.
        </p>
      </div>

      <div class="space-y-6">
        <SettingsOrganizationAiAlert />
        <SettingsOrganizationMailSettings />
      </div>

    </div>
  </NuxtLayout>
</template>
