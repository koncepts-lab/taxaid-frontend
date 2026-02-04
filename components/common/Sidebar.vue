<template>
  <aside class="fixed left-0 top-0 bottom-0 z-30 w-[100px] flex flex-col items-center py-10 transition-all duration-300 hidden lg:flex" style="background-image: url('/images/side-menu-bg.png'); background-size: 100% 100%; background-repeat: no-repeat;">
    <!-- NAV ITEMS -->
    <nav class="flex-1 w-full flex flex-col items-start justify-center gap-7">
      <NuxtLink 
        v-for="(item, index) in navItems" 
        :key="index" 
        :to="item.to" 
        class="nav-item group relative side-icons"
      >
        <!-- Default Icon (w-8) -->
        <img 
          :src="item.icon" 
          class="w-6 group-hover:hidden group-[.router-link-active]:hidden" 
          :alt="item.label" 
        />
        <!-- Active Icon (Increased to w-9 to match visual size) -->
        <img 
          :src="item.activeIcon" 
          class="w-6 hidden group-hover:block group-[.router-link-active]:block" 
          :alt="item.label" 
        />
        
        <!-- TOOLTIP -->
        <div class="tooltip absolute left-full ml-0 px-4 py-2 bg-white text-[#009276] text-[16px] font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
          {{ item.label }}
          <!-- Arrow -->
          <div class="absolute right-[100%] top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white"></div>
        </div>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const navItems = [
  { 
    label: 'Revenue', 
    to: '/dashboard', 
    icon: '/images/icons/Revenue.svg',
    activeIcon: '/images/icons/Revenue-active.svg'
  },
  { 
    label: 'Cashflow', 
    to: '/dashboard/transactions', 
    icon: '/images/icons/Cashflow.svg',
    activeIcon: '/images/icons/Cashflow-active.svg'
  },
  { 
    label: 'Financial Statement', 
    to: '/dashboard/reports', 
    icon: '/images/icons/Financial-Statement.svg',
    activeIcon: '/images/icons/Financial-Statement-active.svg'
  },
  { 
    label: 'Indirect Expense', 
    to: '/dashboard/budget', 
    icon: '/images/icons/Indirect-Expense.svg',
    activeIcon: '/images/icons/Indirect-Expense-active.svg'
  },
  { 
    label: 'Account Receivables', 
    to: '/dashboard/goals', 
    icon: '/images/icons/Account-Receivables.svg',
    activeIcon: '/images/icons/Account-Receivables-active.svg'
  },
  { 
    label: 'COGS', 
    to: '/dashboard/tags', 
    icon: '/images/icons/C.O.G.S.svg',
    activeIcon: '/images/icons/C.O.G.S-active.svg'
  },
  { 
    label: 'Accounts Payable', 
    to: '/dashboard/tags', 
    icon: '/images/icons/Accounts-Payable.svg',
    activeIcon: '/images/icons/Accounts-Payable-active.svg'
  },
  { 
    label: 'Cost Center', 
    to: '/dashboard/tags', 
    icon: '/images/icons/Cost-Center-Project.svg',
    activeIcon: '/images/icons/Cost-Center-Project-active.svg'
  },
  { 
    label: 'Tax Queries', 
    to: '/dashboard/tags', 
    icon: '/images/icons/Tax-Queries.svg',
    activeIcon: '/images/icons/Tax-Queries-active.svg'
  },
]
</script>

<style scoped>
.nav-item {
  width: 87%; height: 40px;
  display: flex; align-items: center; justify-content: center;
}

.nav-item:hover { opacity: 1; }
.nav-item.router-link-active { opacity: 1; }
.side-icons{

}
</style>
