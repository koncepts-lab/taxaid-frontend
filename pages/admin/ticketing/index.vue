<template>
    <NuxtLayout name="admin">
        <div class="p-4 md:p-8 space-y-12 min-h-screen max-w-[100vw] overflow-x-hidden">
            <div class="space-y-12">
                <component :is="screenComponent" v-if="screenComponent" />
                <p v-else class="text-center text-gray-500 py-20">
                    Your role isn't assigned to the ticketing system.
                </p>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
const { admin } = useAdminAuth()
const { toTicketRole } = useTicketRoleMap()

const SCREEN_BY_TICKET_ROLE = {
    team_member: resolveComponent('TicketingTeamMembers'),
    team_lead: resolveComponent('TicketingTeamLead'),
    tech_team: resolveComponent('TicketingTechTeam'),
    vp: resolveComponent('TicketingVP'),
    manager: resolveComponent('TicketingManager'),
    admin: resolveComponent('TicketingAdmin'),
}

const screenComponent = computed(() => {
    const roleName = admin.value?.role?.name
    // Super Admin's ticket_tier is null in the DB (bypasses via role name on the backend) —
    // resolve to 'admin' here so they don't lose ticketing UI access on the frontend.
    const tier = roleName === 'Super Admin' ? 'admin' : admin.value?.role?.ticket_tier
    const ticketRole = toTicketRole(tier)
    return ticketRole ? SCREEN_BY_TICKET_ROLE[ticketRole] : null
})
</script>
