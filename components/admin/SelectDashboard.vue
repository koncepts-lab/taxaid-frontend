<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300"
    :class="isDark ? 'bg-[#0A0A0A]' : ''" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

    <div class="text-center mb-12">
      <h1 class="text-3xl font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ currentLang === 'ar' ? 'اختر لوحة التحكم' : 'Select Dashboard' }}
      </h1>
      <p class="text-gray-500 text-sm">
        {{ currentLang === 'ar' ? 'اختر لوحة التحكم التي ترغب في الوصول إليها' :
          "Choose which dashboard you'd like to access" }}
      </p>
    </div>

    <!-- First cards: Ticketing (if assigned), then the primary own-dashboard (if assigned) -->
    <div class="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">
      <SelectDashboardCard v-for="card in primaryCards" :key="card.title" :icon="card.icon" :title="card.title"
        :description="card.description" :buttonLabel="card.buttonLabel" @click="navigateTo(card.route)" />
    </div>

    <!-- Any other assigned systems beyond the first 2, appended below, same screen -->
    <div v-if="showMore && remainingCards.length"
      class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-[1080px] justify-items-center mt-6">
      <SelectDashboardCard v-for="card in remainingCards" :key="card.title" :icon="card.icon" :title="card.title"
        :description="card.description" :buttonLabel="card.buttonLabel" @click="navigateTo(card.route)" />
    </div>

    <button v-if="remainingCards.length" @click="showMore = !showMore"
      class="mt-8 text-sm underline underline-offset-2" :class="isDark ? 'text-white/70' : 'text-gray-500'">
      {{ showMore
        ? (currentLang === 'ar' ? 'عرض أقل' : 'Show Less')
        : (currentLang === 'ar' ? 'عرض المزيد' : 'Show More') }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  isDark: Boolean,
  currentLang: { type: String, default: 'en' }
})

const { admin } = useAdminAuth()
const { toTicketRole } = useTicketRoleMap()
const { ownDashboardRoute } = useDashboardRoute()

const roleName = computed(() => admin.value?.role?.name ?? null)
const assignedSystems = computed(() => admin.value?.assigned_systems ?? [])
// Super Admin's ticket_tier is null in the DB (bypasses the tier check via role name on the
// backend) — resolve it to 'admin' here so they don't lose ticketing UI access on the frontend.
const ticketTier = computed(() => roleName.value === 'Super Admin' ? 'admin' : admin.value?.role?.ticket_tier ?? null)
const showMore = ref(false)

// Card copy per canonical AdminSystem value (App\Enums\AdminSystem). Systems with a
// role-dependent destination resolve their route from the current role; everything else
// is a fixed route. Card only renders if its system is actually in assigned_systems.
const SYSTEM_CARDS = computed(() => {
  const role = roleName.value

  return {
    'Ticketing Dashboard': {
      icon: '/images/icons/Ticketing-System.svg', title: 'Ticketing System',
      description: 'Manage customer support tickets, track issues, and monitor resolution times',
      buttonLabel: 'Access Ticketing Dashboard', route: '/admin/ticketing'
    },
    'Admin Dashboard': {
      icon: '/images/icons/Revenue-Partnership.svg', title: 'Admin Dashboard',
      description: 'Manage system roles, access control, and client oversight within your assigned systems.',
      buttonLabel: 'Access Admin Dashboard', route: '/admin/management'
    },
    'Payments Dashboard': {
      icon: '/images/icons/Revenue-Partnership.svg', title: 'Payments Dashboard',
      description: 'Manage subscription plans, monitor payments, and configure billing.',
      buttonLabel: 'Access Payments Dashboard', route: '/admin/payments'
    },
    'Implementation Dashboard': {
      icon: '/images/icons/Revenue-Partnership.svg', title: 'Implementation Dashboard',
      description: role === 'Implementation Consultant'
        ? 'Track your assigned clients, onboarding steps, and deliverables.'
        : 'Manage client onboarding, GL codes, consultant assignments, and project tracking.',
      buttonLabel: 'Access Implementation Dashboard',
      route: role === 'Implementation Consultant' ? '/admin/implementation/member' : '/admin/implementation/manager'
    },
    'Review Dashboard': {
      icon: '/images/icons/Revenue-Partnership.svg', title: 'Review Dashboard',
      description: role === 'Review Consultant'
        ? 'Log daily activity, manage client appointments, and track review progress.'
        : 'Manage team workload, client sync status, and assignment across consultants.',
      buttonLabel: 'Access Review Dashboard',
      route: role === 'Review Consultant' ? '/review-team-member/dashboard' : '/review-manager/dashboard'
    },
    'Revenue Partnership Dashboard': {
      icon: '/images/icons/Revenue-Partnership.svg', title: 'Revenue Partnership Dashboard',
      description: role === 'Partner Account'
        ? 'Manage partner accounts, uploads, and payment processing.'
        : 'Review partner approvals, payment requests, and revenue reporting.',
      buttonLabel: 'Access Revenue Partnership Dashboard',
      route: role === 'Partner Account' ? '/admin/revenue-partner/accounts' : '/admin/revenue-partner/admin'
    },
  }
})

// Primary slot 1: Ticketing, if assigned and the role resolves to a real ticketing tier.
// Primary slot 2: the role's own-dashboard system (via useDashboardRoute.ts), if assigned.
const primaryCards = computed(() => {
  const cards = []
  if (assignedSystems.value.includes('Ticketing Dashboard') && toTicketRole(ticketTier.value)) {
    cards.push(SYSTEM_CARDS.value['Ticketing Dashboard'])
  }
  const ownRoute = ownDashboardRoute(roleName.value)
  const ownSystem = Object.entries(SYSTEM_CARDS.value).find(([, c]) => c.route === ownRoute)?.[0]
  if (ownSystem && ownSystem !== 'Ticketing Dashboard' && assignedSystems.value.includes(ownSystem)) {
    cards.push(SYSTEM_CARDS.value[ownSystem])
  }
  return cards
})

// Everything else assigned beyond the 2 primary cards.
const remainingCards = computed(() => {
  const primaryTitles = new Set(primaryCards.value.map(c => c.title))
  return assignedSystems.value
    .map(system => SYSTEM_CARDS.value[system])
    .filter(card => card && !primaryTitles.has(card.title))
})
</script>

<style scoped>
.grid {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
