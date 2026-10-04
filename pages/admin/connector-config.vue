<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <!-- HEADER -->
    <AdminDashboardHeader :userName="admin?.role?.name ?? 'Admin'" :userId="'Welcome, ' + (admin?.full_name ?? '')" :showChangeProfile="false" :adminLogout="true" logoutTo="/ad-aqnz-pro-auth-78z46" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto" style="margin-top: -18px;">

      <!-- Page Header with Back Button -->
      <div class="flex items-center gap-6 mb-2">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="space-y-0.5">
          <h1 class="text-[32px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Connector Configuration</h1>
          <p class="text-[14px] font-medium text-[#00000080]" :class="isDark ? 'text-white/60' : ''">{{ clientName || ('Tenant #' + tenantId) }}</p>
        </div>
      </div>

      <AdminClientConnector v-if="tenantId" :key="'connector-' + tenantId" :tenant-id="tenantId" />
      <p v-else class="text-[14px] opacity-50">No tenant selected.</p>
    </main>

    <DashboardFooter />
  </div>
</template>

<script setup>
const { isDark } = useTheme()
const { admin } = useAdminAuth()
const route = useRoute()
const router = useRouter()

const tenantId = computed(() => Number(route.query.tenant_id) || null)
const clientName = computed(() => route.query.name ? String(route.query.name) : '')

function goBack() {
  if (route.query.back) {
    navigateTo(String(route.query.back))
    return
  }
  router.back()
}
</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
</style>
