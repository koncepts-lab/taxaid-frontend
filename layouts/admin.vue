<template>
    <div :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#F0F0F0] text-[#1a1a1a]'" class="min-h-screen transition-colors duration-300">
        <!-- TODO: NEED Alerts — /admin/notifications has no real data source yet for Super Admin/Implementation roles (Payments Admin already has real data via /admin/payments's Alerts tab). It's now a proper admin-domain page though, not the revenue-partnership one — that route needs an rp_token these roles don't have, so linking there was actually broken for them, not just wrong content. -->
        <AdminDashboardHeader
            :userName="admin?.role?.name ?? ''"
            :userId="admin?.full_name ?? ''"
            :notificationsTo="route.path.startsWith('/admin/payments') ? '/admin/payments?tab=alerts' : '/admin/notifications'"
            :adminLogout="true" logoutTo="/ad-aqnz-pro-auth-78z46" />
        <slot />
        <CommonFooter />
    </div>
</template>

<script setup>
const { isDark } = useTheme()
const { admin }  = useAdminAuth()
const route = useRoute()
</script>